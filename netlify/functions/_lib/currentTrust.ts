// netlify/functions/_lib/currentTrust.ts
//
// S8 — shared write helper for `supplier_current_trust`.
//
// Recomputes a single supplier's trust via computeTrustScoreServer with
// targeted reads for that one supplier only (profile + its batches +
// commitments + inspections), then overwrites its current-trust doc.
//
// Called from:
//   - supplierData.ts  validateEvidence  (after validatedAt stamp)
//   - supplierData.ts  resolveDispute    (after dispute-doc update)
//   - supplierNetwork.ts recalculateTrustBatch (batch path; it already
//     holds trustBySupplier from loadTrustMap, so it writes directly
//     using this file's pure writeCurrentDoc() rather than recomputing).
//
// DO NOT call loadTrustMap from here — that is the full-scan path S8
// removes from every per-request flow (brief correction 4).

import { db } from './firebase';
import {
    computeTrustScoreServer,
    TrustInput,
    TrustResult,
    SCORING_VERSION,
} from './trustFormulas';

/**
 * Pure writer: persists a TrustResult into `supplier_current_trust`.
 * If overall is null the doc is deleted (absence = unscored), matching
 * the pre-S8 `overall: null` semantics.
 *
 * Use this from batch paths that already have the TrustResult in hand.
 */
export async function writeCurrentDoc(
    fid: string,
    supplierId: string,
    trust: TrustResult,
    evidenceCounts: {
        validatedBatches: number;
        validatedCommitments: number;
        validatedInspections: number;
    }
): Promise<void> {
    const ref = db
        .collection('farms').doc(fid)
        .collection('supplier_current_trust')
        .doc(supplierId);

    if (trust.overall === null) {
        // Stale scored doc must not survive a downgrade-to-unscored.
        await ref.delete().catch(() => { /* not-found is fine */ });
        return;
    }

    await ref.set(
        {
            supplierId,
            overall: trust.overall,
            confidence: trust.confidence,
            verifiedTransactions: trust.verifiedTransactions,
            dimensions: trust.dimensions ?? null,
            weights: (trust as any).weights ?? null,
            flags: (trust as any).flags ?? [],
            flagDetails: (trust as any).flagDetails ?? [],
            hasCriticalViolation: trust.hasCriticalViolation ?? false,
            scoringVersion: SCORING_VERSION,
            computedAt: Date.now(),
            overallSortable: trust.overall ?? -1,
            evidenceCounts,
        },
        { merge: false }
    );
}

/**
 * Recompute + write, single-supplier path.
 * Used by supplierData.ts validateEvidence / resolveDispute.
 * All reads are scoped to the one supplier — no full scan.
 */
export async function recomputeAndWriteCurrent(
    fid: string,
    supplierId: string
): Promise<void> {
    const farmRef = db.collection('farms').doc(fid);

    // The evidence collections key supplierId numerically; current-trust
    // keys by supplier doc id string. Coerce here, once.
    const numericSupplierId = Number(supplierId);

    const [supplierDoc, batchesSnap, commitmentsSnap, inspectionsSnap] = await Promise.all([
        farmRef.collection('suppliers').doc(supplierId).get(),
        Number.isFinite(numericSupplierId)
            ? farmRef.collection('quality_batches').where('supplierId', '==', numericSupplierId).get()
            : Promise.resolve({ docs: [] as any[] } as any),
        Number.isFinite(numericSupplierId)
            ? farmRef.collection('supplier_commitments').where('supplierId', '==', numericSupplierId).get()
            : Promise.resolve({ docs: [] as any[] } as any),
        Number.isFinite(numericSupplierId)
            ? farmRef.collection('supplier_inspections').where('supplierId', '==', numericSupplierId).get()
            : Promise.resolve({ docs: [] as any[] } as any),
    ]);

    if (!supplierDoc.exists) {
        // Nothing to score. Do not create a placeholder current doc.
        return;
    }

    const s: any = { id: supplierDoc.id, ...supplierDoc.data() };

    const batches = batchesSnap.docs.map((d: any) => {
        const data: any = d.data();
        return {
            id: d.id,
            supplierId: data.supplierId,
            weightKg: data.weightKg,
            qualityScore: data.qualityScore,
            rcnQualityScore: data.rcnQualityScore,
            defectiveRate: data.defectiveRate,
            moistureContent: data.moistureContent,
            korGPerKg: data.korGPerKg,
            nutCountPerKg: data.nutCountPerKg,
            foreignMatter: data.foreignMatter,
            aflatoxinPpb: data.aflatoxinPpb,
            heavyMetalsPpb: data.heavyMetalsPpb,
            pesticideResiduePpb: data.pesticideResiduePpb,
            farmOsMonitored: data.farmOsMonitored,
            verifiedAt: data.verifiedAt,
            testResults: data.testResults,
        };
    });

    const commitments = commitmentsSnap.docs
        .map((d: any) => ({ firestoreId: d.id, ...d.data() } as any))
        .filter((c: any) => c.validatedAt);

    const inspections = inspectionsSnap.docs
        .map((d: any) => ({ firestoreId: d.id, ...d.data() } as any))
        .filter((i: any) => i.validatedAt);

    const input: TrustInput = {
        supplier: {
            id: s.id,
            name: s.name,
            status: s.status,
            isActive: s.isActive ?? s.status === 'ACTIVE',
            latitude: s.latitude,
            longitude: s.longitude,
            hasLocation: s.hasLocation,
            registrationNumber: s.registrationNumber,
            farmerIdNumber: s.farmerIdNumber,
            dataConsentGiven: s.dataConsentGiven,
            dataConsentScope: s.dataConsentScope,
            dataConsentWithdrawnDate: s.dataConsentWithdrawnDate,
            firebreakProtection: s.firebreakProtection,
            noChildLabor: s.noChildLabor,
            sustainableHarvesting: s.sustainableHarvesting,
            isCertified: s.isCertified,
            certificationType: s.certificationType,
        },
        batches,
        commitments,
        inspections,
    };

    const trust = computeTrustScoreServer(input);

    await writeCurrentDoc(fid, supplierId, trust, {
        validatedBatches: batches.filter((b: any) => b.verifiedAt && b.verifiedAt > 0).length,
        validatedCommitments: commitments.length,
        validatedInspections: inspections.length,
    });
}