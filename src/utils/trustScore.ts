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
        weightKg?: number;
        qualityScore?: number;
        defectiveRate?: number;
        moistureContent?: number;
        farmOsMonitored?: boolean;
        verifiedAt?: number;
        testResults?: string;
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
        delivery: null;      // v2 — commitments not yet recorded
        cooperation: number | null;
    };
    weights: Record<string, number>;
    capacityKg: number;
    scoringVersion: string;
    flags: string[];
}

// Weights normalized to 100% over the dimensions we can actually measure in v1.
// delivery (20%) is deliberately excluded — no commitment records exist yet.
const V1_WEIGHTS = {
    quality: 40,
    traceability: 30,
    sustainability: 15,
    compliance: 10,
    cooperation: 5,
};

function clamp(n: number): number {
    return Math.max(0, Math.min(100, n));
}

function parseAflatoxin(testResults?: string): number | null {
    if (!testResults) return null;
    try {
        const parsed = typeof testResults === 'string' ? JSON.parse(testResults) : testResults;
        return typeof parsed.aflatoxin === 'number' ? parsed.aflatoxin : null;
    } catch {
        return null;
    }
}

/**
 * Quality (0-100):
 *  - average qualityScore across batches (70% of dimension)
 *  - penalty for batches with defectiveRate > 5 (30% of dimension)
 */
function computeQuality(batches: TrustInput['batches']): number | null {
    const scored = batches.filter(b => typeof b.qualityScore === 'number');
    if (scored.length === 0) return null;

    const avgScore = scored.reduce((s, b) => s + (b.qualityScore || 0), 0) / scored.length;
    const total = scored.length;
    const highDefect = scored.filter(b => (b.defectiveRate || 0) > 5).length;
    const defectPenalty = (highDefect / total) * 100; // % of batches failing defect threshold

    return clamp(avgScore * 0.7 + (100 - defectPenalty) * 0.3);
}

/**
 * Traceability (0-100) — summed from evidence checks:
 *  - GPS present (30)
 *  - registration or farmer ID (20)
 *  - consent given, not withdrawn, with at least identity scope (30)
 *  - at least one verified batch (20)
 */
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

/**
 * Sustainability (0-100) — 4 flags × 25.
 * Deliberately honest: no flags verified = 0, but confidence label protects new suppliers.
 */
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

/**
 * Compliance (0-100):
 *  - certified (40)
 *  - every verified batch has aflatoxin < 4 ppb (60)
 */
function computeCompliance(input: TrustInput): number {
    let score = 0;
    if (input.supplier.isCertified) score += 40;

    const withTests = input.batches
        .map(b => parseAflatoxin(b.testResults))
        .filter((v): v is number => v !== null);

    if (withTests.length > 0) {
        const passing = withTests.filter(v => v < 4).length;
        score += (passing / withTests.length) * 60;
    }

    return clamp(score);
}

/**
 * Cooperation (0-100) — v1 proxy using only what we have:
 *  - active status (50)
 *  - consent on record (50)
 * This is a weak signal in v1 and is labeled as such in the UI.
 */
function computeCooperation(input: TrustInput): number {
    let score = 0;
    if (input.supplier.isActive && input.supplier.status === 'ACTIVE') score += 50;
    if (input.supplier.dataConsentGiven && !input.supplier.dataConsentWithdrawnDate) score += 50;
    return clamp(score);
}

function classifyConfidence(count: number): TrustResult['confidence'] {
    if (count >= 10) return 'established';
    if (count >= 3) return 'developing';
    return 'preliminary';
}

export function computeTrustScore(input: TrustInput): TrustResult {
    const verifiedTransactions = input.batches.filter(b => b.verifiedAt && b.verifiedAt > 0).length;
    const capacityKg = input.batches.reduce((s, b) => s + (b.weightKg || 0), 0);

    const dimensions = {
        quality: computeQuality(input.batches),
        traceability: computeTraceability(input),
        sustainability: computeSustainability(input),
        compliance: computeCompliance(input),
        delivery: null,
        cooperation: computeCooperation(input),
    };

    // Weighted average over dimensions that actually produced a value.
    let weightedSum = 0;
    let weightTotal = 0;
    (Object.keys(V1_WEIGHTS) as Array<keyof typeof V1_WEIGHTS>).forEach(k => {
        const dim = dimensions[k];
        if (dim !== null) {
            weightedSum += dim * V1_WEIGHTS[k];
            weightTotal += V1_WEIGHTS[k];
        }
    });

    const overall = weightTotal > 0 ? clamp(weightedSum / weightTotal) : null;

    const flags: string[] = [];
    if (verifiedTransactions < 3) flags.push('limited evidence');
    if (dimensions.quality !== null && dimensions.quality < 50) flags.push('low recorded quality — check evidence count');
    if (!input.supplier.dataConsentGiven) flags.push('no data consent on record');
    if (dimensions.compliance !== null && dimensions.compliance < 40) flags.push('compliance gaps');

    return {
        overall: overall !== null ? Math.round(overall * 10) / 10 : null,
        confidence: classifyConfidence(verifiedTransactions),
        verifiedTransactions,
        dimensions,
        weights: V1_WEIGHTS,
        capacityKg,
        scoringVersion: 'v1.0',
        flags,
    };
}