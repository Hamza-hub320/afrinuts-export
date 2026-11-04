import type { TrustResult } from './trustScore';

export interface DevelopmentOpportunity {
    supplierId: string;
    supplierName: string;
    weakness: string;             // human-readable
    detectedBy: string;           // which rule fired
    suggestedSupport: string;     // from the framework table
    severity: 'high' | 'medium' | 'low';
    metric: string;               // the number that triggered it, e.g. "8.4% avg moisture"
    confidence: TrustResult['confidence'];
}

interface BatchStats {
    avgMoisture: number | null;
    avgDefectRate: number | null;
    batchCount: number;
    verifiedCount: number;
}

function computeBatchStats(batches: any[]): BatchStats {
    if (!batches || batches.length === 0) {
        return { avgMoisture: null, avgDefectRate: null, batchCount: 0, verifiedCount: 0 };
    }
    const withMoisture = batches.filter(b => typeof b.moistureContent === 'number');
    const withDefect = batches.filter(b => typeof b.defectiveRate === 'number');
    return {
        avgMoisture: withMoisture.length > 0
            ? withMoisture.reduce((s, b) => s + b.moistureContent, 0) / withMoisture.length
            : null,
        avgDefectRate: withDefect.length > 0
            ? withDefect.reduce((s, b) => s + b.defectiveRate, 0) / withDefect.length
            : null,
        batchCount: batches.length,
        verifiedCount: batches.filter(b => b.verifiedAt && b.verifiedAt > 0).length,
    };
}

/**
 * Framework Section 9 — Supplier development rules.
 * Each rule is a detector over existing evidence. No new collections.
 */
export function detectDevelopmentOpportunities(
    suppliers: Array<{ id: string; name: string; registrationNumber?: string; farmerIdNumber?: string; dataConsentGiven?: boolean }>,
    batchesBySupplier: Record<string, any[]>,
    trustBySupplier: Record<string, TrustResult>
): DevelopmentOpportunity[] {
    const out: DevelopmentOpportunity[] = [];

    suppliers.forEach(s => {
        const trust = trustBySupplier[s.id];
        if (!trust) return;

        const batches = batchesBySupplier[s.id] || [];
        const stats = computeBatchStats(batches);

        // Rule 1 — Moisture management (framework: "Drying, storage and moisture-control training")
        if (stats.avgMoisture !== null && stats.avgMoisture > 7) {
            out.push({
                supplierId: s.id,
                supplierName: s.name,
                weakness: 'Moisture management',
                detectedBy: 'Average batch moisture above 7%',
                suggestedSupport: 'Drying, storage and moisture-control training',
                severity: stats.avgMoisture > 9 ? 'high' : 'medium',
                metric: `${stats.avgMoisture.toFixed(1)}% avg moisture across ${stats.batchCount} batch${stats.batchCount !== 1 ? 'es' : ''}`,
                confidence: trust.confidence,
            });
        }

        // Rule 2 — Inconsistent documentation
        const docsMissing = !s.registrationNumber && !s.farmerIdNumber;
        const consentMissing = !s.dataConsentGiven;
        if (docsMissing || consentMissing) {
            const parts: string[] = [];
            if (docsMissing) parts.push('no registration or farmer ID on file');
            if (consentMissing) parts.push('no data consent recorded');
            out.push({
                supplierId: s.id,
                supplierName: s.name,
                weakness: 'Inconsistent documentation',
                detectedBy: 'Missing registration, farmer ID, or consent',
                suggestedSupport: 'Field-agent or cooperative documentation assistance',
                severity: 'high',
                metric: parts.join('; '),
                confidence: trust.confidence,
            });
        }

        // Rule 3 — Insufficient supplier history
        if (trust.confidence === 'preliminary') {
            out.push({
                supplierId: s.id,
                supplierName: s.name,
                weakness: 'Insufficient supplier history',
                detectedBy: 'Fewer than 3 verified batches',
                suggestedSupport: 'Smaller initial procurement, proportionate checks and reassessment',
                severity: 'low',  // not a fault — a stage
                metric: `${trust.verifiedTransactions} verified batch${trust.verifiedTransactions !== 1 ? 'es' : ''}`,
                confidence: trust.confidence,
            });
        }

        // Rule 4 — High foreign matter / defects
        if (stats.avgDefectRate !== null && stats.avgDefectRate > 5) {
            out.push({
                supplierId: s.id,
                supplierName: s.name,
                weakness: 'High foreign matter / defects',
                detectedBy: 'Average defective rate above 5%',
                suggestedSupport: 'Sorting, cleaning and handling training',
                severity: stats.avgDefectRate > 8 ? 'high' : 'medium',
                metric: `${stats.avgDefectRate.toFixed(1)}% avg defects across ${stats.batchCount} batch${stats.batchCount !== 1 ? 'es' : ''}`,
                confidence: trust.confidence,
            });
        }
    });

    // Sort: high severity first, then alphabetical within severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return out.sort((a, b) => {
        const sev = severityOrder[a.severity] - severityOrder[b.severity];
        if (sev !== 0) return sev;
        return a.supplierName.localeCompare(b.supplierName);
    });
}