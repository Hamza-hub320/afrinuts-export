/**
 * Server-side Supplier Development detectors + suppression rules.
 *
 * SOURCE OF TRUTH: src/utils/supplierDevelopment.ts
 * Mirrored on: 2026-11-10 — 1:1 port of detectDevelopmentOpportunities()
 *
 * Any change to detectors or thresholds in src/utils/supplierDevelopment.ts
 * must be mirrored here in the same commit. Server and client must produce
 * identical opportunity lists.
 *
 * Suppression rules (applied on top of the detector output, matching the
 * Development page's latest-action-per-(supplier,weakness) behavior):
 *   - No action → visible.
 *   - status OPEN → suppressed.
 *   - status DONE → suppressed until ≥2 verified batches exist with
 *                   processingDate > action.givenAt; once met, the weakness
 *                   is re-evaluated on post-support batches only.
 */

export interface DevelopmentOpportunity {
    supplierId: string;
    supplierName: string;
    weakness: string;
    detectedBy: string;
    suggestedSupport: string;
    severity: 'high' | 'medium' | 'low';
    metric: string;
    baselineValue: number;
    baselineMetricLabel: string;
    confidence: 'preliminary' | 'developing' | 'established';
}

export interface SupportAction {
    supplierId: number | string;
    weakness: string;
    status: 'OPEN' | 'DONE';
    givenAt: number;
}

interface BatchStats {
    verifiedBatches: any[];
    verifiedCount: number;
    avgMoisture: number | null;
    avgDefectRate: number | null;
    highMoistureShare: number;
    mediumMoistureShare: number;
    highDefectShare: number;
    mediumDefectShare: number;
    highMoistureCount: number;
    highDefectCount: number;
}

function computeBatchStats(batches: any[]): BatchStats {
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
 * Raw detection — no suppression. Same rules as client detectDevelopmentOpportunities.
 * `trustConfidence` is only used for the `confidence` field on each opportunity
 * and for the `preliminary` gate on Rule 3.
 */
function detectRaw(
    s: { id: string; name: string; registrationNumber?: string; farmerIdNumber?: string; dataConsentGiven?: boolean },
    batches: any[],
    verifiedTransactions: number,
    confidence: 'preliminary' | 'developing' | 'established'
): DevelopmentOpportunity[] {
    const out: DevelopmentOpportunity[] = [];
    const stats = computeBatchStats(batches);

    // Rule 1 — Moisture management
    if (stats.verifiedCount > 0) {
        let severity: 'high' | 'medium' | 'low' | null = null;
        let metric = '';
        let baselineValue = 0;
        let baselineMetricLabel = '';

        if (stats.highMoistureShare >= 0.25 || stats.highMoistureCount >= 2) {
            severity = stats.verifiedCount >= 3 ? 'high' : 'low';
            baselineValue = Math.round(stats.highMoistureShare * 100);
            baselineMetricLabel = 'Moisture >10% share';
            metric = `${baselineValue}% of verified batches above 10% moisture (${stats.verifiedCount} verified)${stats.verifiedCount < 3 ? ' — early signal' : ''}`;
        } else if (stats.mediumMoistureShare >= 0.33) {
            severity = stats.verifiedCount >= 3 ? 'medium' : 'low';
            baselineValue = Math.round(stats.mediumMoistureShare * 100);
            baselineMetricLabel = 'Moisture >8% share';
            metric = `${baselineValue}% of verified batches above 8% moisture (${stats.verifiedCount} verified)${stats.verifiedCount < 3 ? ' — early signal' : ''}`;
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
                baselineValue,
                baselineMetricLabel,
                confidence,
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
            baselineValue: 0,
            baselineMetricLabel: 'Documentation completeness',
            confidence,
        });
    }

    // Rule 3 — Insufficient supplier history
    if (confidence === 'preliminary') {
        out.push({
            supplierId: s.id,
            supplierName: s.name,
            weakness: 'Insufficient supplier history',
            detectedBy: 'Fewer than 3 verified batches',
            suggestedSupport: 'Smaller initial procurement, proportionate checks and reassessment',
            severity: 'low',
            metric: `${verifiedTransactions} verified batch${verifiedTransactions !== 1 ? 'es' : ''}`,
            baselineValue: verifiedTransactions,
            baselineMetricLabel: 'Verified batch count',
            confidence,
        });
    }

    // Rule 4 — High foreign matter / defects
    if (stats.verifiedCount > 0) {
        let severity: 'high' | 'medium' | 'low' | null = null;
        let metric = '';
        let baselineValue = 0;
        let baselineMetricLabel = '';

        if (stats.highDefectShare >= 0.66 || stats.highDefectCount >= 1) {
            severity = stats.verifiedCount >= 3 ? 'high' : 'low';
            baselineValue = Math.round(stats.highDefectShare * 100);
            baselineMetricLabel = 'Defect >10% share';
            metric = `${baselineValue}% of verified batches above 10% defects (${stats.verifiedCount} verified)${stats.verifiedCount < 3 ? ' — early signal' : ''}`;
        } else if (stats.mediumDefectShare >= 0.33) {
            severity = stats.verifiedCount >= 3 ? 'medium' : 'low';
            baselineValue = Math.round(stats.mediumDefectShare * 100);
            baselineMetricLabel = 'Defect >5% share';
            metric = `${baselineValue}% of verified batches above 5% defects (${stats.verifiedCount} verified)${stats.verifiedCount < 3 ? ' — early signal' : ''}`;
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
                baselineValue,
                baselineMetricLabel,
                confidence,
            });
        }
    }

    return out;
}

/**
 * Apply suppression and return visible opportunities.
 */
export function detectVisibleOpportunities(
    suppliers: Array<{
        id: string;
        name: string;
        registrationNumber?: string;
        farmerIdNumber?: string;
        dataConsentGiven?: boolean;
    }>,
    batchesBySupplier: Record<string, any[]>,
    trustBySupplier: Record<string, {
        confidence: 'preliminary' | 'developing' | 'established';
        verifiedTransactions: number;
    }>,
    actions: SupportAction[]
): DevelopmentOpportunity[] {
    // Latest action per (supplierId, weakness)
    const latestAction = new Map<string, SupportAction>();
    actions.forEach(a => {
        const key = `${a.supplierId}::${a.weakness}`;
        const existing = latestAction.get(key);
        if (!existing || a.givenAt > existing.givenAt) {
            latestAction.set(key, a);
        }
    });

    const all: DevelopmentOpportunity[] = [];

    suppliers.forEach(s => {
        const trust = trustBySupplier[s.id];
        if (!trust) return;

        const batches = batchesBySupplier[s.id] || [];
        const raw = detectRaw(s, batches, trust.verifiedTransactions, trust.confidence);

        raw.forEach(opp => {
            const key = `${s.id}::${opp.weakness}`;
            const action = latestAction.get(key);

            if (!action) {
                all.push(opp);
                return;
            }

            if (action.status === 'OPEN') {
                return;
            }

            if (action.status === 'DONE') {
                const postSupportBatches = batches.filter(
                    b =>
                        b.verifiedAt &&
                        b.verifiedAt > 0 &&
                        typeof b.processingDate === 'number' &&
                        b.processingDate > action.givenAt
                );

                if (postSupportBatches.length < 2) {
                    return;
                }

                const reEvaluated = detectRaw(s, postSupportBatches, trust.verifiedTransactions, trust.confidence)
                    .filter(o => o.weakness === opp.weakness);

                if (reEvaluated.length > 0) {
                    all.push(reEvaluated[0]);
                }
            }
        });
    });

    const severityOrder = { high: 0, medium: 1, low: 2 } as const;
    return all.sort((a, b) => {
        const sev = severityOrder[a.severity] - severityOrder[b.severity];
        if (sev !== 0) return sev;
        return a.supplierName.localeCompare(b.supplierName);
    });
}