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

function computeBatchStats(batches: any[]): {
    verifiedBatches: any[];
    verifiedCount: number;
    avgMoisture: number | null;
    avgDefectRate: number | null;
    highMoistureShare: number;   // % of verified batches with moisture > 10%
    mediumMoistureShare: number; // % with moisture > 8%
    highDefectShare: number;     // % with defect > 10%
    mediumDefectShare: number;   // % with defect > 5%
    highMoistureCount: number;
    highDefectCount: number;
} {
    const verified = (batches || []).filter(b => b.verifiedAt && b.verifiedAt > 0);
    const n = verified.length;

    const withMoisture = verified.filter(b => typeof b.moistureContent === 'number');
    const withDefect = verified.filter(b => typeof b.defectiveRate === 'number');

    const highMoisture = withMoisture.filter(b => b.moistureContent > 10).length;
    const mediumMoisture = withMoisture.filter(b => b.moistureContent > 8).length;
    const highDefect = withDefect.filter(b => b.defectiveRate > 10).length;
    const mediumDefect = withDefect.filter(b => b.defectiveRate > 5).length;

    return {
        verifiedBatches: verified,
        verifiedCount: n,
        avgMoisture: withMoisture.length > 0
            ? withMoisture.reduce((s, b) => s + b.moistureContent, 0) / withMoisture.length
            : null,
        avgDefectRate: withDefect.length > 0
            ? withDefect.reduce((s, b) => s + b.defectiveRate, 0) / withDefect.length
            : null,
        highMoistureShare: withMoisture.length > 0 ? highMoisture / withMoisture.length : 0,
        mediumMoistureShare: withMoisture.length > 0 ? mediumMoisture / withMoisture.length : 0,
        highDefectShare: withDefect.length > 0 ? highDefect / withDefect.length : 0,
        mediumDefectShare: withDefect.length > 0 ? mediumDefect / withDefect.length : 0,
        highMoistureCount: highMoisture,
        highDefectCount: highDefect,
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

        // Rule 1 — Moisture management (framework: "Drying, storage and moisture-control training")if (stats.verifiedCount > 0) {
        if (stats.verifiedCount > 0) {
            let severity: 'high' | 'medium' | 'low' | null = null;
            let metric = '';

            if (stats.highMoistureShare >= 0.25 || stats.highMoistureCount >= 2) {
                severity = stats.verifiedCount >= 3 ? 'high' : 'low';
                metric = `${Math.round(stats.highMoistureShare * 100)}% of verified batches above 10% moisture (${stats.verifiedCount} verified)${stats.verifiedCount < 3 ? ' — early signal' : ''}`;
            } else if (stats.mediumMoistureShare >= 0.33) {
                severity = stats.verifiedCount >= 3 ? 'medium' : 'low';
                metric = `${Math.round(stats.mediumMoistureShare * 100)}% of verified batches above 8% moisture (${stats.verifiedCount} verified)${stats.verifiedCount < 3 ? ' — early signal' : ''}`;
            }

            if (severity) {
                out.push({
                    supplierId: s.id,
                    supplierName: s.name,
                    weakness: 'Moisture management',
                    detectedBy: 'Share of verified batches above QC moisture bands',
                    suggestedSupport: 'Drying, storage and moisture-control training',
                    severity,
                    metric,
                    confidence: trust.confidence,
                });
            }
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
        if (stats.verifiedCount > 0) {
            let severity: 'high' | 'medium' | 'low' | null = null;
            let metric = '';

            if (stats.highDefectShare >= 0.66 || stats.highDefectCount >= 1) {
                severity = stats.verifiedCount >= 3 ? 'high' : 'low';
                metric = `${Math.round(stats.highDefectShare * 100)}% of verified batches above 10% defects (${stats.verifiedCount} verified)${stats.verifiedCount < 3 ? ' — early signal' : ''}`;
            } else if (stats.mediumDefectShare >= 0.33) {
                severity = stats.verifiedCount >= 3 ? 'medium' : 'low';
                metric = `${Math.round(stats.mediumDefectShare * 100)}% of verified batches above 5% defects (${stats.verifiedCount} verified)${stats.verifiedCount < 3 ? ' — early signal' : ''}`;
            }

            if (severity) {
                out.push({
                    supplierId: s.id,
                    supplierName: s.name,
                    weakness: 'High foreign matter / defects',
                    detectedBy: 'Share of verified batches above QC defect bands',
                    suggestedSupport: 'Sorting, cleaning and handling training',
                    severity,
                    metric,
                    confidence: trust.confidence,
                });
            }
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