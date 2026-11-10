/**
 * Server-side Trust Engine formulas.
 *
 * SOURCE OF TRUTH: src/utils/trustScore.ts (v2.0)
 * Mirrored on: 2026-11-10
 * Cross-check via S1 acceptance test: for any supplier, the
 * `overall` returned by getSupplierNetworkSummary must equal
 * computeTrustScore(...).overall on the same evidence.
 *
 * ANY change to this file must be mirrored to src/utils/trustScore.ts
 * in the same commit. The two are read by different runtimes and
 * cannot share code without a build step we don't have.
 *
 * Do not add Firestore calls to this module. Do not add business
 * rules that don't exist in the client version.
 */

export const SCORING_VERSION = 'v2.0';

export interface TrustInput {
    supplier: {
        id: string;
        name: string;
        status: string;
        isActive: boolean;
        latitude?: number;
        longitude?: number;
        hasLocation?: boolean;
        registrationNumber?: string;
        farmerIdNumber?: string;
        dataConsentGiven?: boolean;
        dataConsentScope?: string[];
        dataConsentWithdrawnDate?: number | null;
        firebreakProtection?: boolean;
        noChildLabor?: boolean;
        sustainableHarvesting?: boolean;
        isCertified?: boolean;
        certificationType?: string;
    };
    batches: Array<{
        id?: string | number;
        weightKg?: number;
        qualityScore?: number;
        rcnQualityScore?: number;
        kernelQualityScore?: number;
        defectiveRate?: number;
        moistureContent?: number;
        korGPerKg?: number;
        nutCountPerKg?: number;
        foreignMatter?: number;
        aflatoxinPpb?: number;
        heavyMetalsPpb?: number;
        pesticideResiduePpb?: number;
        farmOsMonitored?: boolean;
        verifiedAt?: number;
        testResults?: string;
    }>;
    commitments?: Array<{
        id: string;
        committedKg: number;
        committedDate: number;
        status: string;
        linkedBatchIds?: number[] | string;
        delayReason?: string;
        buyerRequestedChange?: boolean;
    }>;
    inspections?: Array<{
        id: string;
        inspectionType: string;
        outcome: 'PASS' | 'FAIL' | 'CONDITIONAL';
        severity?: 'MINOR' | 'MAJOR' | 'CRITICAL';
        status: string;
    }>;
}

export interface TrustResult {
    overall: number | null;
    confidence: 'preliminary' | 'developing' | 'established';
    verifiedTransactions: number;
    dimensions: {
        quality: number | null;
        traceability: number | null;
        sustainability: number | null;
        compliance: number | null;
        delivery: number | null;
        cooperation: number | null;
    };
    weights: Record<string, number>;
    capacityKg: number;
    scoringVersion: string;
    flags: string[];
    hasCriticalViolation: boolean;
}

export const V2_WEIGHTS = {
    quality: 25,
    delivery: 20,
    traceability: 20,
    compliance: 15,
    sustainability: 10,
    cooperation: 10,
};

const clamp = (n: number): number => Math.max(0, Math.min(100, n));

function parseAflatoxin(testResults?: string, aflatoxinPpb?: number): number | null {
    if (typeof aflatoxinPpb === 'number') return aflatoxinPpb;
    if (!testResults) return null;
    try {
        const parsed = typeof testResults === 'string' ? JSON.parse(testResults) : testResults;
        return typeof parsed.aflatoxin === 'number' ? parsed.aflatoxin : null;
    } catch {
        return null;
    }
}

function computeQuality(batches: TrustInput['batches']): number | null {
    const scored = batches.filter(b =>
        (typeof b.rcnQualityScore === 'number' && b.rcnQualityScore > 0) ||
        (typeof b.qualityScore === 'number' && b.qualityScore > 0)
    );
    if (scored.length === 0) return null;

    const scores = scored.map(b => b.rcnQualityScore ?? b.qualityScore ?? 0);
    const avgScore = scores.reduce((s, v) => s + v, 0) / scores.length;

    const withMoisture = batches.filter(b => typeof b.moistureContent === 'number' && b.moistureContent > 0);
    const moistureCompliant = withMoisture.filter(b => (b.moistureContent ?? 0) <= 7).length;
    const moistureScore = withMoisture.length > 0
        ? (moistureCompliant / withMoisture.length) * 100
        : null;

    const withKor = batches.filter(b => typeof b.korGPerKg === 'number' && b.korGPerKg > 0);
    let korScore: number | null = null;
    if (withKor.length >= 2) {
        const kors = withKor.map(b => b.korGPerKg!);
        const mean = kors.reduce((s, v) => s + v, 0) / kors.length;
        const variance = kors.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / kors.length;
        const stdDev = Math.sqrt(variance);
        korScore = Math.max(70, 100 - stdDev * 2);
    }

    const parts = [{ value: avgScore, weight: 0.5 }];
    if (moistureScore !== null) parts.push({ value: moistureScore, weight: 0.3 });
    if (korScore !== null) parts.push({ value: korScore, weight: 0.2 });

    const totalWeight = parts.reduce((s, p) => s + p.weight, 0);
    const weighted = parts.reduce((s, p) => s + p.value * p.weight, 0) / totalWeight;
    return clamp(weighted);
}

function computeTraceability(input: TrustInput): number {
    let score = 0;
    const s = input.supplier;

    if (s.hasLocation && s.latitude && s.longitude) score += 30;
    if (s.registrationNumber || s.farmerIdNumber) score += 20;
    if (
        s.dataConsentGiven &&
        !s.dataConsentWithdrawnDate &&
        (s.dataConsentScope?.includes('identity') || s.dataConsentScope?.includes('location'))
    ) {
        score += 30;
    }
    if (input.batches.some(b => b.verifiedAt && b.verifiedAt > 0)) score += 20;

    return clamp(score);
}

function computeSustainability(input: TrustInput): number {
    const s = input.supplier;
    const flags = [
        s.firebreakProtection,
        s.noChildLabor,
        s.sustainableHarvesting,
        input.batches.some(b => b.farmOsMonitored),
    ].filter(Boolean).length;
    return clamp(flags * 25);
}

function computeCompliance(input: TrustInput): number {
    let score = 0;
    if (input.supplier.isCertified) score += 20;

    const withTests = input.batches
        .map(b => parseAflatoxin(b.testResults, b.aflatoxinPpb))
        .filter((v): v is number => v !== null);

    if (withTests.length > 0) {
        const passing = withTests.filter(v => v < 4).length;
        score += (passing / withTests.length) * 40;
    }

    const inspections = input.inspections || [];
    if (inspections.length > 0) {
        let inspectionSum = 0;
        inspections.forEach(i => {
            if (i.outcome === 'PASS') inspectionSum += 1.0;
            else if (i.outcome === 'CONDITIONAL') inspectionSum += 0.5;
        });
        score += (inspectionSum / inspections.length) * 40;
    }

    return clamp(score);
}

function computeDelivery(input: TrustInput): number | null {
    const commitments = input.commitments || [];
    const valid = commitments.filter(c => c.status !== 'CANCELLED');
    if (valid.length === 0) return null;

    let totalCommitted = 0;
    let totalDelivered = 0;

    valid.forEach(c => {
        if (c.buyerRequestedChange) return;

        totalCommitted += c.committedKg || 0;

        let linkedIds: number[] = [];
        if (typeof c.linkedBatchIds === 'string') {
            try { linkedIds = JSON.parse(c.linkedBatchIds); } catch { linkedIds = []; }
        } else if (Array.isArray(c.linkedBatchIds)) {
            linkedIds = c.linkedBatchIds;
        }

        const delivered = input.batches
            .filter(b => linkedIds.includes(Number(b.id)))
            .reduce((sum, b) => sum + (b.weightKg || 0), 0);

        totalDelivered += delivered;
    });

    if (totalCommitted === 0) return null;

    const fulfillmentRate = (totalDelivered / totalCommitted) * 100;

    const weatherMisses = valid.filter(c =>
        c.delayReason === 'WEATHER' && c.status !== 'FULFILLED'
    ).length;
    const excusedBoost = weatherMisses > 0 ? Math.min(15, weatherMisses * 5) : 0;

    return clamp(fulfillmentRate + excusedBoost);
}

function computeCooperation(input: TrustInput): number {
    let score = 0;
    if (input.supplier.isActive && input.supplier.status === 'ACTIVE') score += 40;
    if (input.supplier.dataConsentGiven && !input.supplier.dataConsentWithdrawnDate) score += 40;
    if ((input.inspections?.length ?? 0) > 0) score += 20;
    return clamp(score);
}

function classifyConfidence(count: number): TrustResult['confidence'] {
    if (count >= 10) return 'established';
    if (count >= 3) return 'developing';
    return 'preliminary';
}

export function computeTrustScoreServer(input: TrustInput): TrustResult {
    const verifiedTransactions = input.batches.filter(b => b.verifiedAt && b.verifiedAt > 0).length;
    const capacityKg = input.batches.reduce((s, b) => s + (b.weightKg || 0), 0);

    const dimensions = {
        quality: computeQuality(input.batches),
        delivery: computeDelivery(input),
        traceability: computeTraceability(input),
        compliance: computeCompliance(input),
        sustainability: computeSustainability(input),
        cooperation: computeCooperation(input),
    };

    const hasCriticalViolation = (input.inspections || []).some(
        i => i.severity === 'CRITICAL' && i.outcome === 'FAIL'
    );

    const canScore =
        dimensions.quality !== null &&
        dimensions.delivery !== null &&
        dimensions.traceability !== null;

    let overall: number | null = null;
    if (canScore) {
        let weightedSum = 0;
        let weightTotal = 0;
        (Object.keys(V2_WEIGHTS) as Array<keyof typeof V2_WEIGHTS>).forEach(k => {
            const dim = dimensions[k];
            if (dim !== null) {
                weightedSum += dim * V2_WEIGHTS[k];
                weightTotal += V2_WEIGHTS[k];
            }
        });
        overall = weightTotal > 0 ? clamp(weightedSum / weightTotal) : null;
    }

    const flags: string[] = [];
    if (verifiedTransactions < 3) flags.push('limited evidence');
    if (dimensions.quality !== null && dimensions.quality < 50) flags.push('low recorded quality');
    if (!input.supplier.dataConsentGiven) flags.push('no data consent on record');
    if (dimensions.compliance !== null && dimensions.compliance < 40) flags.push('compliance gaps');
    if (dimensions.delivery === null) flags.push('no validated commitments');
    if (hasCriticalViolation) flags.push('CRITICAL: verified critical violation');

    return {
        overall: overall !== null ? Math.round(overall * 10) / 10 : null,
        confidence: classifyConfidence(verifiedTransactions),
        verifiedTransactions,
        dimensions,
        weights: V2_WEIGHTS,
        capacityKg,
        scoringVersion: SCORING_VERSION,
        flags,
        hasCriticalViolation,
    };
}