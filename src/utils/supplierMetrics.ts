import type { TrustResult } from './trustScore';

export interface SupplierMetrics {
    // Volume
    annualVolumeKg: number;
    batchCount: number;
    verifiedBatchCount: number;

    // Quality (from rcnQualityScore)
    averageQualityScore: number | null;          // avg rcnQualityScore
    averageRcnQualityScore: number | null;       // explicit alias
    averageMoisture: number | null;
    averageKorGPerKg: number | null;
    averageNutCountPerKg: number | null;
    averageForeignMatter: number | null;
    averageDefectiveRate: number | null;

    // Grade distribution
    premiumBatches: number;
    standardBatches: number;
    rejectBatches: number;
    rejectionRate: number | null;                // % of batches in REJECT grade

    // Time span
    firstBatchDate: number | null;
    lastBatchDate: number | null;
    seasonsActive: number;                       // distinct years with batches

    // Derived intelligence
    trust: TrustResult;
}

export function computeSupplierMetrics(
    supplier: any,
    batches: any[],
    trust: TrustResult
): SupplierMetrics {
    const validBatches = batches.filter(b => (b.weightKg ?? 0) > 0);

    const avg = (arr: number[]) =>
        arr.length > 0 ? arr.reduce((s, v) => s + v, 0) / arr.length : null;

    // Quality — use rcnQualityScore where available, fall back to qualityScore
    const rcnScores = validBatches
        .map(b => b.rcnQualityScore ?? b.qualityScore)
        .filter((v): v is number => typeof v === 'number' && v > 0);

    const moistures = validBatches
        .map(b => b.moistureContent)
        .filter((v): v is number => typeof v === 'number' && v > 0);

    const kors = validBatches
        .map(b => b.korGPerKg)
        .filter((v): v is number => typeof v === 'number' && v > 0);

    const nutCounts = validBatches
        .map(b => b.nutCountPerKg)
        .filter((v): v is number => typeof v === 'number' && v > 0);

    const foreign = validBatches
        .map(b => b.foreignMatter)
        .filter((v): v is number => typeof v === 'number');

    const defects = validBatches
        .map(b => b.defectiveRate)
        .filter((v): v is number => typeof v === 'number');

    // Grades
    const premiumBatches = validBatches.filter(b => b.qualityGrade === 'PREMIUM').length;
    const standardBatches = validBatches.filter(b => b.qualityGrade === 'STANDARD').length;
    const rejectBatches = validBatches.filter(b => b.qualityGrade === 'REJECT').length;
    const rejectionRate = validBatches.length > 0
        ? (rejectBatches / validBatches.length) * 100
        : null;

    // Time span
    const dates = validBatches
        .map(b => b.processingDate)
        .filter((v): v is number => typeof v === 'number' && v > 0);
    const firstBatchDate = dates.length > 0 ? Math.min(...dates) : null;
    const lastBatchDate = dates.length > 0 ? Math.max(...dates) : null;
    const seasonsActive = new Set(
        validBatches.map(b => b.harvestYear).filter(y => typeof y === 'number')
    ).size;

    return {
        annualVolumeKg: validBatches.reduce((s, b) => s + (b.weightKg ?? 0), 0),
        batchCount: validBatches.length,
        verifiedBatchCount: validBatches.filter(b => (b.verifiedAt ?? 0) > 0).length,

        averageQualityScore: avg(rcnScores),
        averageRcnQualityScore: avg(rcnScores),
        averageMoisture: avg(moistures),
        averageKorGPerKg: avg(kors),
        averageNutCountPerKg: avg(nutCounts),
        averageForeignMatter: avg(foreign),
        averageDefectiveRate: avg(defects),

        premiumBatches,
        standardBatches,
        rejectBatches,
        rejectionRate,

        firstBatchDate,
        lastBatchDate,
        seasonsActive,

        trust,
    };
}