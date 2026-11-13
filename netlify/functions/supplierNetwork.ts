import type { Handler, HandlerEvent } from '@netlify/functions';
import { db } from './_lib/firebase';
import { detectVisibleOpportunities, SupportAction, computeBatchStats } from './_lib/developmentRules';
import {
    computeTrustScoreServer,
    TrustInput,
    TrustResult,
} from './_lib/trustFormulas';
import { writeCurrentDoc } from './_lib/currentTrust';
import { SCORING_VERSION } from './_lib/trustFormulas';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod === 'OPTIONS') {
        return {statusCode: 200, headers: corsHeaders, body: ''};
    }

    try {
        let params: any = {};
        if (event.httpMethod === 'GET') {
            params = event.queryStringParameters || {};
        } else if (event.httpMethod === 'POST') {
            params = JSON.parse(event.body || '{}');
        }

        const {action, farmId} = params;
        const fid = farmId || '1';

        if (action === 'getSupplierNetworkSummary') {
            const summary = await buildNetworkSummary(fid);
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(summary),
            };
        }

        // ============================================================
        // S2 — listSuppliers
        // Full enrich → search → type → sort pipeline runs in
        // buildFilteredRows; this handler only slices for the page.
        // Sorting happens inside the helper, i.e. before pagination.
        // ============================================================
        if (action === 'listSuppliers') {
            const {
                search = '',
                type = '',
                sort = 'name',
                page = 1,
                pageSize = 25,
            } = params;

            const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
            const sizeNum = Math.min(200, Math.max(1, parseInt(String(pageSize), 10) || 25));

            const {rows: sorted, total} = await buildFilteredRows(fid, {search, type, sort});

            const start = (pageNum - 1) * sizeNum;
            const rows = sorted.slice(start, start + sizeNum);

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({total, page: pageNum, pageSize: sizeNum, rows}),
            };
        }

        // ============================================================
        // Commit A — exportSuppliers
        // Full filtered set (no pagination) → CSV, with a mandatory
        // audit-log write to portal_export_log. No unlogged export.
        // ============================================================
        if (action === 'exportSuppliers') {
            const {
                search = '',
                type = '',
                sort = 'name',
                exportedBy = '',
            } = params;

            const {rows} = await buildFilteredRows(fid, {search, type, sort});

            const esc = (v: any): string => {
                if (v === null || v === undefined) return '';
                const s = String(v);
                return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
            };

            const header = [
                'Name', 'Type', 'Status', 'Contact Person', 'Phone', 'Email', 'Location',
                'Registration Number', 'Trust Overall', 'Confidence',
                'Avg KOR (g/kg)', 'Verified Volume (kg)', 'Annual Volume (kg)', 'Avg RCN Score',
            ];

            const lines: string[] = [header.join(',')];
            for (const r of rows) {
                lines.push([
                    esc(r.name),
                    esc(r.type),
                    esc(r.status),
                    esc(r.contactPerson),
                    esc(r.phone),
                    esc(r.email),
                    esc(r.location),
                    esc(r.registrationNumber),
                    esc(r.overall),
                    esc(r.confidence),
                    esc(r.avgKorGPerKg),
                    esc(r.verifiedVolumeKg),
                    esc(r.annualVolumeKg),
                    esc(r.averageRcnQualityScore),
                ].join(','));
            }
            const csv = '\uFEFF' + lines.join('\r\n') + '\r\n';

            // Mandatory audit log — if this throws, the outer catch
            // returns 500 and the client sees no CSV. No unlogged export.
            await db.collection('portal_export_log').add({
                farmId: fid,
                exportedBy: String(exportedBy || ''),
                exportedAt: Date.now(),
                filters: {search: String(search), type: String(type), sort: String(sort)},
                rowCount: rows.length,
            });

            const stamp = new Date().toISOString().slice(0, 10);
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    filename: `suppliers-export-${stamp}.csv`,
                    csv,
                    rowCount: rows.length,
                }),
            };
        }

        // ============================================================
        // S4 — recalculateTrustBatch
        // Recomputes trust for the next `limit` suppliers after
        // `cursor` (alphabetical by Firestore doc id), writes one
        // supplier_score_history snapshot per processed supplier,
        // and returns { done, processed, nextCursor }.
        //
        // Hard rules:
        //  - Never write an aggregate `__all__` doc. Every write is
        //    one real supplier's snapshot with its real supplierId.
        //  - Idempotent per supplier for the same pass: the snapshot
        //    doc id is the supplier id, so re-running the same cursor
        //    range overwrites, never appends.
        //  - Same v2.0 formulas as loadTrustMap (shared code path).
        // ============================================================
        if (action === 'recalculateTrustBatch') {
            const {cursor = '', limit = 100} = params;
            const limitNum = Math.min(200, Math.max(1, parseInt(String(limit), 10) || 100));

            let suppliersQuery = db
                .collection('farms').doc(fid)
                .collection('suppliers')
                .orderBy('__name__');
            if (cursor) {
                suppliersQuery = suppliersQuery.startAfter(String(cursor));
            }
            const pageSnap = await suppliersQuery.limit(limitNum).get();

            const pageSupplierIds = pageSnap.docs.map(d => d.id);
            const isLastPage = pageSnap.size < limitNum;
            const nextCursor = isLastPage
                ? null
                : pageSupplierIds[pageSupplierIds.length - 1];

            if (pageSupplierIds.length === 0) {
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({done: true, processed: 0, nextCursor: null}),
                };
            }

            // Reuse the shared loader so trust math cannot drift.
            const {trustBySupplier, batchesBySupplier} = await loadTrustMap(fid);

            const calculatedAt = Date.now();
            const batch = db.batch();

            for (const supplierId of pageSupplierIds) {
                const trust = trustBySupplier[supplierId];
                const overall = trust?.overall ?? null;

                // History — append-only snapshot (unchanged from S4).
                batch.set(
                    db.collection('farms').doc(fid)
                        .collection('supplier_score_history')
                        .doc(supplierId),
                    {
                        supplierId,                              // real id, never '__all__'
                        farmId: fid,
                        overall,
                        confidence: trust?.confidence ?? 'preliminary',
                        verifiedTransactions: trust?.verifiedTransactions ?? 0,
                        dimensions: trust?.dimensions ?? null,
                        weightsUsed: trust?.weights ?? null,
                        scoringVersion: 'v2.0',
                        calculatedAt,
                    },
                    {merge: true}
                );

                // S8 — current-trust doc (overwrite, or delete when unscored).
                const currentRef = db.collection('farms').doc(fid)
                    .collection('supplier_current_trust')
                    .doc(supplierId);

                if (trust && overall !== null) {
                    // S8-C1 — batchStats for the summary's development pipeline.
                    const supplierBatches = batchesBySupplier[supplierId] || [];
                    const stats = computeBatchStats(supplierBatches);
                    const verifiedVolumeKg = stats.verifiedBatches.reduce(
                        (sum: number, b: any) => sum + (b.weightKg || 0),
                        0
                    );
                    const batchStats = {
                        verifiedVolumeKg,
                        verifiedCount: stats.verifiedCount,
                        avgMoisture: stats.avgMoisture,
                        avgDefectRate: stats.avgDefectRate,
                        highMoistureShare: stats.highMoistureShare,
                        mediumMoistureShare: stats.mediumMoistureShare,
                        highDefectShare: stats.highDefectShare,
                        mediumDefectShare: stats.mediumDefectShare,
                        highMoistureCount: stats.highMoistureCount,
                        highDefectCount: stats.highDefectCount,
                        verifiedBatches: (stats.verifiedBatches || []).map((b: any) => ({
                            verifiedAt: b.verifiedAt,
                            processingDate: b.processingDate ?? null,
                            moistureContent: b.moistureContent ?? null,
                            defectiveRate: b.defectiveRate ?? null,
                        })),
                    };

                    batch.set(currentRef, {
                        supplierId,
                        overall,
                        confidence: trust.confidence,
                        verifiedTransactions: trust.verifiedTransactions,
                        dimensions: trust.dimensions ?? null,
                        weights: (trust as any).weights ?? null,
                        flags: (trust as any).flags ?? [],
                        flagDetails: (trust as any).flagDetails ?? [],
                        hasCriticalViolation: trust.hasCriticalViolation ?? false,
                        scoringVersion: 'v2.0',
                        computedAt: calculatedAt,
                        overallSortable: overall ?? -1,
                        evidenceCounts: {
                            validatedBatches: trust.verifiedTransactions ?? 0,
                            validatedCommitments: 0,
                            validatedInspections: 0,
                        },
                        batchStats,
                    }, {merge: false});
                } else {
                    batch.delete(currentRef);
                }
            }

                await batch.commit();

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        done: isLastPage,
                        processed: pageSupplierIds.length,
                        nextCursor,
                    }),
                };
            }

            // S7 — seedScaleTest (TEMPORARY; removed in S7 cleanup)
            // Guarded: farmId must start with "scale-test".
            // Refuses if the test farm already has suppliers.
            //
            // If a run errors midway: purge first, then re-seed.
            // ============================================================
            if (action === 'seedScaleTest') {
                if (!String(fid).startsWith('scale-test')) {
                    return {
                        statusCode: 400,
                        headers: corsHeaders,
                        body: JSON.stringify({error: 'seedScaleTest refused — farmId must start with "scale-test"'}),
                    };
                }
                const farmRef = db.collection('farms').doc(fid);
                const existing = await farmRef.collection('suppliers').limit(1).get();
                if (!existing.empty) {
                    return {
                        statusCode: 409,
                        headers: corsHeaders,
                        body: JSON.stringify({error: 'Test farm already seeded — purgeScaleTest first'}),
                    };
                }

                // ---- deterministic PRNG so reruns are identical ----
                let seed = 42;
                const rnd = () => {
                    seed = (seed * 1664525 + 1013904223) >>> 0;
                    return seed / 0xFFFFFFFF;
                };
                const pick = <T, >(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
                const between = (a: number, b: number) => a + rnd() * (b - a);
                const round1 = (n: number) => Number(n.toFixed(1));
                const round0 = (n: number) => Math.round(n);

                // ---- type distribution ----
                const types: string[] = [];
                for (let i = 0; i < 1000; i++) {
                    const r = rnd();
                    if (i === 0) types.push('OWN_FARM');
                    else if (r < 0.55) types.push('INDEPENDENT_FARMER');
                    else if (r < 0.80) types.push('COOPERATIVE');
                    else if (r < 0.90) types.push('REGIONAL_SUPPLIER');
                    else if (r < 0.95) types.push('COMMERCIAL_AGGREGATOR');
                    else types.push('PROCESSOR');
                }

                // ---- Odienné-area GPS jitter ----
                const baseLat = 9.5, baseLng = -7.56;
                const jitter = () => (rnd() - 0.5) * 0.6;

                // ---- 1,000 suppliers ----
                const supplierDocs: Array<{ id: string; data: any }> = [];
                for (let i = 1; i <= 1000; i++) {
                    const consentRoll = rnd();
                    const consentMode =
                        consentRoll < 0.85 ? 'full' :
                            consentRoll < 0.95 ? 'identity_only' : 'none';
                    const scopes =
                        consentMode === 'full' ? ['identity', 'location', 'photo'] :
                            consentMode === 'identity_only' ? ['identity'] : [];
                    const hasGps = consentMode === 'full';
                    const active = rnd() < 0.95;
                    const name = `Scale Test Supplier ${String(i).padStart(4, '0')}`;

                    // Conditional spread: absent means absent (Admin SDK rejects undefined)
                    const geo = hasGps
                        ? {latitude: baseLat + jitter(), longitude: baseLng + jitter()}
                        : {};

                    supplierDocs.push({
                        id: String(i),
                        data: {
                            scaleTest: true,
                            name,
                            type: types[i - 1],
                            status: active ? 'ACTIVE' : 'INACTIVE',
                            isActive: active,
                            contactPerson: `Contact ${i}`,
                            phone: `+225 07 ${String(100000 + i).slice(-6)}`,
                            email: `supplier${i}@scale.test`,
                            location: pick(['Odienné', 'Boundiali', 'Korhogo', 'Séguéla']),
                            region: 'Kabadougou',
                            country: 'Côte d\'Ivoire',
                            ...geo,
                            hasLocation: hasGps,
                            registrationNumber: `RCCM-${i}`,
                            taxId: `TAX-${i}`,
                            farmerIdNumber: `FID-${i}`,
                            farmSize: round0(between(1, 25)),
                            yearsFarming: round0(between(1, 40)),
                            isCertified: rnd() < 0.2,
                            certificationType: 'ORGANIC',
                            firebreakProtection: rnd() < 0.7,
                            noChildLabor: rnd() < 0.9,
                            sustainableHarvesting: rnd() < 0.75,
                            dataConsentGiven: consentMode !== 'none',
                            dataConsentScope: scopes,
                            dataConsentSignedBy: `Farmer ${i}`,
                            dataConsentVersion: '1.0',
                            dataConsentWithdrawnDate: null,
                            dataConsentWithdrawnReason: null,
                            rating: round1(between(3, 5)),
                            notes: 'S7 scale-test seed',
                        },
                    });
                }

                // ---- batches: 3–7 per supplier ----
                // Global numeric counter for batch ids; commitments store
                // linkedBatchIds as numbers (Delivery strict-matches
                // Number(batch.id) === id in linkedBatchIds).
                let batchCounter = 0;
                const batchDocs: Array<{ id: string; data: any }> = [];
                const batchIdsPerSupplier: Record<string, number[]> = {};
                for (let i = 1; i <= 1000; i++) {
                    const n = 3 + Math.floor(rnd() * 5);
                    const numericIds: number[] = [];
                    for (let b = 0; b < n; b++) {
                        batchCounter++;
                        const id = String(batchCounter);
                        numericIds.push(batchCounter);
                        const kor = round0(between(230, 290));
                        const moisture = round1(between(5, 12));
                        const defective = round1(between(0, 8));
                        const qualityScore = round1(between(40, 95));
                        const grade =
                            (moisture > 10 || defective > 5) ? 'REJECT' :
                                (kor >= 270 && moisture <= 7 && defective <= 2) ? 'PREMIUM' :
                                    'STANDARD';
                        const verified = rnd() < 0.90;

                        // Conditional spread: verifiedAt absent when not verified
                        const verifiedFields = verified
                            ? {verifiedAt: Date.now() - Math.floor(rnd() * 86400000 * 30)}
                            : {};

                        batchDocs.push({
                            id,
                            data: {
                                scaleTest: true,
                                supplierId: i,
                                batchNumber: `B-${id}`,
                                weightKg: round0(between(200, 2000)),
                                qualityScore,
                                rcnQualityScore: qualityScore,
                                qualityGrade: grade,
                                moistureContent: moisture,
                                defectiveRate: defective,
                                korGPerKg: kor,
                                nutCountPerKg: round0(between(150, 250)),
                                kernelRatio: round1(between(20, 30)),
                                foreignMatter: round1(between(0, 3)),
                                aflatoxinPpb: round1(between(0, 15)),
                                heavyMetalsPpb: round1(between(0, 1)),
                                pesticideResiduePpb: round1(between(0, 0.5)),
                                farmOsMonitored: rnd() < 0.7,
                                ...verifiedFields,
                                processingDate: Date.now() - Math.floor(rnd() * 86400000 * 60),
                                sustainableHarvesting: rnd() < 0.75,
                                firebreakProtection: rnd() < 0.7,
                                noChildLabor: rnd() < 0.9,
                            },
                        });
                    }
                    batchIdsPerSupplier[String(i)] = numericIds;
                }

                // ---- commitments: 1 per supplier, 80% validated ----
                // linkedBatchIds are NUMBERS, not strings.
                const commitmentDocs: Array<{ id: string; data: any }> = [];
                for (let i = 1; i <= 1000; i++) {
                    const linked = batchIdsPerSupplier[String(i)] || [];
                    const validated = rnd() < 0.80;
                    const linkedWeight = batchDocs
                        .filter(b => b.data.supplierId === i)
                        .reduce((s, b) => s + b.data.weightKg, 0);
                    const committedKg = round0(linkedWeight * between(0.8, 1.2));
                    const statusRoll = rnd();

                    const validatedFields = validated
                        ? {validatedAt: Date.now() - Math.floor(rnd() * 86400000 * 15)}
                        : {};
                    const delayFields = rnd() < 0.05
                        ? {delayReason: 'WEATHER'}
                        : {};

                    commitmentDocs.push({
                        id: `C-${i}`,
                        data: {
                            scaleTest: true,
                            supplierId: i,
                            contractId: `CNT-2026-${String(i).padStart(3, '0')}`,
                            season: '2026',
                            committedKg,
                            deliveredKg: validated ? committedKg : 0,
                            status: statusRoll < 0.80 ? 'FULFILLED' : statusRoll < 0.95 ? 'PARTIAL' : 'MISSED',
                            ...delayFields,
                            buyerRequestedChange: rnd() < 0.03,
                            ...validatedFields,
                            linkedBatchIds: linked, // number[]
                        },
                    });
                }

                // ---- inspections on 30% of suppliers ----
                // First 5 VALIDATED inspections are deterministically
                // CRITICAL + FAIL (critical-violation path must fire at scale).
                // Everything else: PASS / CONDITIONAL / FAIL with MAJOR / MINOR.
                const inspectionDocs: Array<{ id: string; data: any }> = [];
                let criticalForced = 0;
                const CRITICAL_TARGET = 5;
                for (let i = 1; i <= 1000; i++) {
                    if (rnd() >= 0.30) continue;
                    const validated = rnd() < 0.85;

                    const forceCritical = validated && criticalForced < CRITICAL_TARGET;
                    if (forceCritical) criticalForced++;

                    const outcome = forceCritical ? 'FAIL' : pick(['PASS', 'CONDITIONAL', 'FAIL']);
                    const severity = forceCritical
                        ? 'CRITICAL'
                        : (outcome === 'FAIL' ? 'MAJOR' : 'MINOR');

                    const validatedFields = validated
                        ? {validatedAt: Date.now() - Math.floor(rnd() * 86400000 * 20)}
                        : {};

                    inspectionDocs.push({
                        id: `I-${i}`,
                        data: {
                            scaleTest: true,
                            supplierId: i,
                            inspectionType: pick(['FIELD_VISIT', 'DOCUMENT_REVIEW', 'SENSORY_AUDIT']),
                            outcome,
                            severity,
                            findings: 'S7 scale-test seed',
                            ...validatedFields,
                        },
                    });
                }

                // ---- batch writes ≤500/commit ----
                const farmRef2 = db.collection('farms').doc(fid);
                let totalWritten = 0;
                const collectionsToSeed: Array<[string, Array<{ id: string; data: any }>]> = [
                    ['suppliers', supplierDocs],
                    ['quality_batches', batchDocs],
                    ['supplier_commitments', commitmentDocs],
                    ['supplier_inspections', inspectionDocs],
                ];
                const perCollection: Record<string, number> = {};
                for (const [coll, docs] of collectionsToSeed) {
                    perCollection[coll] = docs.length;
                    for (let start = 0; start < docs.length; start += 500) {
                        const batch = db.batch();
                        const slice = docs.slice(start, start + 500);
                        for (const d of slice) {
                            batch.set(farmRef2.collection(coll).doc(d.id), d.data);
                        }
                        await batch.commit();
                        totalWritten += slice.length;
                    }
                }

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        farmId: fid,
                        totalWritten,
                        perCollection,
                        note: 'S7 scale-test seed complete',
                    }),
                };
            }

            // ============================================================
            // S7 — purgeScaleTest (TEMPORARY; removed in S7 cleanup)
            // Guarded: farmId must start with "scale-test".
            // Deletes in ≤500/commit per collection. Returns per-collection
            // counts so the cleanup can be verified.
            // ============================================================
            if (action === 'purgeScaleTest') {
                if (!String(fid).startsWith('scale-test')) {
                    return {
                        statusCode: 400,
                        headers: corsHeaders,
                        body: JSON.stringify({error: 'purgeScaleTest refused — farmId must start with "scale-test"'}),
                    };
                }
                const farmRef = db.collection('farms').doc(fid);
                const collectionsToPurge = [
                    'suppliers', 'quality_batches', 'supplier_commitments',
                    'supplier_inspections', 'supplier_disputes', 'expenses',
                    'revenues', 'supplier_support_actions', 'supplier_score_history',
                    'supplier_current_trust',   // S8-C: S8-A writes here; purge must remove it
                    'supplier_network_meta',    // S8-C1: farm meta doc
                ];
                const deleted: Record<string, number> = {};
                for (const coll of collectionsToPurge) {
                    let count = 0;
                    // Loop until empty — each pass deletes ≤500
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        const snap = await farmRef.collection(coll).limit(500).get();
                        if (snap.empty) break;
                        const batch = db.batch();
                        snap.docs.forEach(d => batch.delete(d.ref));
                        await batch.commit();
                        count += snap.size;
                    }
                    deleted[coll] = count;
                }
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({farmId: fid, deleted}),
                };
            }

            // ============================================================
            // ============================================================
            // S4-prep — getEvidenceQueues
            // ============================================================
            if (action === 'getEvidenceQueues') {
                const [commitmentsSnap, inspectionsSnap, disputesSnap, suppliersSnap] = await Promise.all([
                    db.collection('farms').doc(fid).collection('supplier_commitments').get(),
                    db.collection('farms').doc(fid).collection('supplier_inspections').get(),
                    db.collection('farms').doc(fid).collection('supplier_disputes').get(),
                    db.collection('farms').doc(fid).collection('suppliers').get(),
                ]);

                const supplierNameById = new Map<string, string>();
                suppliersSnap.docs.forEach(d => {
                    const s: any = d.data();
                    if (s?.name) supplierNameById.set(String(d.id), s.name);
                });

                const withName = (item: any) => {
                    const name = supplierNameById.get(String(item.supplierId));
                    return name ? {...item, supplierName: name} : item;
                };

                const pendingCommitments = commitmentsSnap.docs
                    .map(d => ({firestoreId: d.id, ...d.data()} as any))
                    .filter((c: any) => !c.validatedAt)
                    .map(withName);

                const pendingInspections = inspectionsSnap.docs
                    .map(d => ({firestoreId: d.id, ...d.data()} as any))
                    .filter((i: any) => !i.validatedAt)
                    .map(withName);

                const openDisputes = disputesSnap.docs
                    .map(d => ({...d.data(), id: d.id} as any))
                    .filter((d: any) => d.reviewStatus === 'OPEN' || d.reviewStatus === 'UNDER_REVIEW')
                    .map(withName);

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        pendingCommitments,
                        pendingInspections,
                        openDisputes,
                    }),
                };
            }

            // ============================================================
            // S2 — getNetworkMapPoints (unchanged)
            // ============================================================
            if (action === 'getNetworkMapPoints') {
                const snap = await db.collection('farms').doc(fid).collection('suppliers').get();

                const points: Array<{
                    id: string;
                    name: string;
                    type: string;
                    latitude: number;
                    longitude: number;
                    isActive: boolean;
                    location: string;
                }> = [];

                snap.docs.forEach(d => {
                    const s: any = d.data();
                    const scopes = s.dataConsentScope || [];

                    const locationConsented =
                        s.dataConsentGiven &&
                        !s.dataConsentWithdrawnDate &&
                        scopes.includes('location');

                    const hasCoords =
                        s.hasLocation &&
                        typeof s.latitude === 'number' &&
                        typeof s.longitude === 'number' &&
                        s.latitude !== 0 &&
                        s.longitude !== 0;

                    if (!locationConsented || !hasCoords) return;

                    points.push({
                        id: d.id,
                        name: s.name,
                        type: s.type,
                        latitude: s.latitude,
                        longitude: s.longitude,
                        isActive: (s.isActive ?? s.status === 'ACTIVE') && s.status === 'ACTIVE',
                        location: s.location || '',
                    });
                });

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        points,
                        totalSuppliers: snap.size,
                        shownCount: points.length,
                    }),
                };
            }

            // ============================================================
            // S8 — verifyCurrentTrust { farmId, sample? }
            // Read-only drift guard (decision B).
            // Recomputes via loadTrustMap and diffs against
            // supplier_current_trust for a sample (or all) suppliers.
            // Returns { farmId, checked, mismatchCount, mismatches }.
            //
            // sample: number (bounded, sorted by computedAt desc) | 'all'.
            // Use 'all' at farm-1 scale. Use a number at scale-test to bound
            // the compute.
            // ============================================================
            if (action === 'verifyCurrentTrust') {
                const {sample = 'all'} = params;

                const {trustBySupplier, batchesBySupplier} = await loadTrustMap(fid);

                const currentSnap = await db.collection('farms').doc(fid)
                    .collection('supplier_current_trust')
                    .get();
                const currentById = new Map<string, any>();
                currentSnap.docs.forEach(d => currentById.set(d.id, d.data()));

                const allIds = Object.keys(trustBySupplier);
                const idsToCheck = sample === 'all'
                    ? allIds
                    : allIds
                        .sort((a, b) =>
                            (currentById.get(b)?.computedAt ?? 0) - (currentById.get(a)?.computedAt ?? 0)
                        )
                        .slice(0, Math.max(1, parseInt(String(sample), 10) || allIds.length));

                const mismatches: Array<{
                    supplierId: string;
                    fields: Record<string, { expected: any; current: any }>;
                }> = [];

                for (const supplierId of idsToCheck) {
                    const expected = trustBySupplier[supplierId];
                    const current = currentById.get(supplierId);

                    const fields: Record<string, { expected: any; current: any }> = {};
                    const cmp = (k: string) => {
                        const exp = (expected as any)?.[k];
                        const cur = current?.[k];
                        if (JSON.stringify(exp) !== JSON.stringify(cur)) {
                            fields[k] = {expected: exp ?? null, current: cur ?? null};
                        }
                    };

                    cmp('overall');
                    cmp('confidence');
                    cmp('hasCriticalViolation');
                    cmp('dimensions');
                    cmp('scoringVersion');

                    // S8-C1 — compare the materialized batch stats
                    // field-by-field. Recompute from the loader's
                    // batches (already in scope: batchesBySupplier).
                    const supplierBatchesForVerify =
                        (batchesBySupplier as any)[supplierId] || [];
                    const expectedStats = (() => {
                        const stats = computeBatchStats(supplierBatchesForVerify);
                        const verifiedVolumeKg = stats.verifiedBatches.reduce(
                            (sum: number, b: any) => sum + (b.weightKg || 0),
                            0
                        );
                        return {
                            verifiedVolumeKg,
                            verifiedCount: stats.verifiedCount,
                            avgMoisture: stats.avgMoisture,
                            avgDefectRate: stats.avgDefectRate,
                            highMoistureShare: stats.highMoistureShare,
                            mediumMoistureShare: stats.mediumMoistureShare,
                            highDefectShare: stats.highDefectShare,
                            mediumDefectShare: stats.mediumDefectShare,
                            highMoistureCount: stats.highMoistureCount,
                            highDefectCount: stats.highDefectCount,
                        };
                    })();
                    const currentStats = current?.batchStats ?? null;
                    const currentStatsComparable = currentStats && {
                        verifiedVolumeKg: currentStats.verifiedVolumeKg,
                        verifiedCount: currentStats.verifiedCount,
                        avgMoisture: currentStats.avgMoisture,
                        avgDefectRate: currentStats.avgDefectRate,
                        highMoistureShare: currentStats.highMoistureShare,
                        mediumMoistureShare: currentStats.mediumMoistureShare,
                        highDefectShare: currentStats.highDefectShare,
                        mediumDefectShare: currentStats.mediumDefectShare,
                        highMoistureCount: currentStats.highMoistureCount,
                        highDefectCount: currentStats.highDefectCount,
                    };
                    if (JSON.stringify(expectedStats) !== JSON.stringify(currentStatsComparable)) {
                        fields['batchStats'] = {
                            expected: expectedStats,
                            current: currentStatsComparable,
                        };
                    }
                }

                // S8-C1 — verify the farm meta doc against a fresh sum.
                const freshFarmVolume = Object.values(batchesBySupplier)
                    .flat()
                    .filter((b: any) => b.verifiedAt && b.verifiedAt > 0)
                    .reduce((sum: number, b: any) => sum + (b.weightKg || 0), 0);
                const metaSnap = await db.collection('farms').doc(fid)
                    .collection('supplier_network_meta').doc('summary').get();
                const metaVolume = metaSnap.exists
                    ? Number((metaSnap.data() as any).verifiedVolumeKg) || 0
                    : null;
                const farmTotalMismatch = metaVolume === null
                    ? { expected: freshFarmVolume, current: null }
                    : (metaVolume !== freshFarmVolume
                        ? { expected: freshFarmVolume, current: metaVolume }
                        : null);

                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        farmId: fid,
                        checked: idsToCheck.length,
                        mismatchCount: mismatches.length,
                        mismatches,
                        // S8-C1 — farm meta total diff (null when matches)
                        farmTotalMismatch,
                    }),
                };
            }


            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({error: 'Invalid action'}),
            };
        }
    catch
        (error: any)
        {
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({error: error.message}),
            };
        }
    }
    ;

// ============================================================
// loadTrustMap — single source of truth for the trust-input
// shape and for batch slimming. Summary / list / export all read
// from this loader; no second copy of the math or the slimming.
//
// Firestore field projections are applied on the three hot
// collections (batches, commitments, inspections). The suppliers
// read is full because every consent scope and every identity
// field feeds either the trust engine or the row payload.
// ============================================================
    async function loadTrustMap(fid: string): Promise<{
        suppliers: any[];
        trustBySupplier: Record<string, TrustResult>;
        batchesBySupplier: Record<string, any[]>;
    }> {
        const [suppliersSnap, batchesSnap, commitmentsSnap, inspectionsSnap] = await Promise.all([
            db.collection('farms').doc(fid).collection('suppliers').get(),
            db.collection('farms').doc(fid).collection('quality_batches')
                .select(
                    'supplierId', 'weightKg', 'qualityScore', 'rcnQualityScore',
                    'defectiveRate', 'moistureContent', 'korGPerKg', 'nutCountPerKg',
                    'foreignMatter', 'aflatoxinPpb', 'heavyMetalsPpb',
                    'pesticideResiduePpb', 'farmOsMonitored', 'verifiedAt', 'testResults',
                    'processingDate'                                       // <-- S8-C1
                )
                .get(),
            db.collection('farms').doc(fid).collection('supplier_commitments')
                .select(
                    'supplierId', 'validatedAt',
                    'committedKg', 'deliveredKg', 'status',
                    'contractId', 'season', 'delayReason', 'buyerRequestedChange', 'linkedBatchIds'
                )
                .get(),
            db.collection('farms').doc(fid).collection('supplier_inspections')
                .select(
                    'supplierId', 'validatedAt',
                    'inspectionType', 'outcome', 'findings', 'severity'
                )
                .get(),
        ]);

        const batches = batchesSnap.docs.map(d => {
            const data = d.data();
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
                processingDate: data.processingDate,
                testResults: data.testResults,
            };
        });

        const groupBy = (arr: any[], key = 'supplierId') => {
            const out: Record<string, any[]> = {};
            arr.forEach(item => {
                const k = String(item[key]);
                (out[k] = out[k] || []).push(item);
            });
            return out;
        };

        const batchesBySupplier = groupBy(batches);

        const validatedCommitments = commitmentsSnap.docs
            .map(d => ({firestoreId: d.id, ...d.data()} as any))
            .filter((c: any) => c.validatedAt);
        const validatedInspections = inspectionsSnap.docs
            .map(d => ({firestoreId: d.id, ...d.data()} as any))
            .filter((i: any) => i.validatedAt);

        const commitmentsBySupplier = groupBy(validatedCommitments);
        const inspectionsBySupplier = groupBy(validatedInspections);

        const suppliers = suppliersSnap.docs.map(d => ({id: d.id, ...d.data()} as any));

        const trustBySupplier: Record<string, TrustResult> = {};
        suppliers.forEach(s => {
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
                batches: batchesBySupplier[s.id] || [],
                commitments: commitmentsBySupplier[s.id] || [],
                inspections: inspectionsBySupplier[s.id] || [],
            };
            trustBySupplier[s.id] = computeTrustScoreServer(input);
        });

        return {
            suppliers,
            trustBySupplier,
            batchesBySupplier,
        };
    }

// ============================================================
// S8-B — loadCurrentTrustRows
// Reads the materialized `supplier_current_trust` docs (one per
// scored supplier) and joins them with the supplier profile docs
// the table/summary/export need.
//
// This is the S8 read path. loadTrustMap is now only called by
// recalculateTrustBatch and verifyCurrentTrust — the recompute
// engine, not the read engine.
//
// Firestore query shapes:
//   - Current-trust docs: `orderBy('overallSortable', dir)` — scored
//     suppliers sort by their overall; unscored suppliers have no doc
//     (absence = unscored), so they only appear via the profile-side
//     join, which is where the caller must inject `overall: null` rows.
//   - Profile join: `.where('__name__', 'in', chunk)` batched at 10
//     (Firestore's `in` limit). At farm-1 scale this is one chunk; at
//     S7 scale it's ~100 chunks for the 1,000-supplier page, all in
//     parallel.
// ============================================================
    async function loadCurrentTrustRows(fid: string): Promise<{
        trustById: Map<string, any>;
        supplierById: Map<string, any>;
    }> {
        const farmRef = db.collection('farms').doc(fid);

        // 1. Current-trust docs — bounded (one per scored supplier).
        const currentSnap = await farmRef.collection('supplier_current_trust').get();
        const trustById = new Map<string, any>();
        currentSnap.docs.forEach(d => trustById.set(d.id, {id: d.id, ...d.data()}));

        // 2. Profile docs — batched by __name__ `in` (max 10 per query).
        const supplierById = new Map<string, any>();
        const allIds = Array.from(trustById.keys());
        if (allIds.length > 0) {
            const chunks: string[][] = [];
            for (let i = 0; i < allIds.length; i += 10) {
                chunks.push(allIds.slice(i, i + 10));
            }
            const snaps = await Promise.all(
                chunks.map(chunk =>
                    farmRef.collection('suppliers')
                        .where('__name__', 'in', chunk)
                        .get()
                )
            );
            snaps.forEach(snap => {
                snap.docs.forEach(d => supplierById.set(d.id, {id: d.id, ...d.data()}));
            });
        }

        return {trustById, supplierById};
    }

// ============================================================
// S8-B — buildFilteredRows
// Shared pipeline for listSuppliers and exportSuppliers.
//
// Same contract as before S8:
//   enrich → search → type/status filter → sort → (caller paginates)
//
// What changed: trust comes from `supplier_current_trust` (via
// loadCurrentTrustRows) instead of loadTrustMap. Batches still come
// from a targeted read — needed for volume/KOR/RCN aggregates on
// the row.
//
// Query-side vs page-side (brief §3 requirement):
//   - Query-side: `supplier_current_trust` is read in full (bounded:
//     one small doc per scored supplier). The supplier profile docs
//     are joined by doc id.
//   - Page-side (in memory): search, type/status filter, all sorting
//     including trust_desc / trust_asc (because search/type must run
//     before pagination and the client page-number contract is
//     preserved).
//
// If literal cursor pagination is wanted later, the search and type
// fields must move into Firestore (indexed search key on the supplier
// doc; type/status as range filters). That's a separate decision.
// ============================================================
    async function buildFilteredRows(
        fid: string,
        opts: { search?: string; type?: string; sort?: string }
    ): Promise<{ rows: any[]; total: number }> {
        const {search = '', type = '', sort = 'name'} = opts;

        // 1. Current-trust + profile join (scored suppliers only).
        const {trustById, supplierById} = await loadCurrentTrustRows(fid);

        // 2. Full profile read for unscored suppliers too — they appear as
        //    `overall: null` rows in the table, exactly as before S8.
        //    For farm-1 scale this is 24 docs; at S7 scale 1,000 docs.
        const profilesSnap = await db.collection('farms').doc(fid)
            .collection('suppliers').get();
        const allSuppliers = profilesSnap.docs.map(d => ({id: d.id, ...d.data()} as any));

        // 3. Batches for the row-level aggregates (volume / KOR / RCN).
        //    Same projection loadTrustMap uses today. Not the point of S8
        //    to slim this further — that's a follow-up.
        const batchesSnap = await db.collection('farms').doc(fid)
            .collection('quality_batches')
            .select(
                'supplierId', 'weightKg', 'qualityScore', 'rcnQualityScore',
                'defectiveRate', 'moistureContent', 'korGPerKg', 'nutCountPerKg',
                'foreignMatter', 'aflatoxinPpb', 'heavyMetalsPpb',
                'pesticideResiduePpb', 'farmOsMonitored', 'verifiedAt', 'testResults'
            )
            .get();

        const batchesBySupplier: Record<string, any[]> = {};
        batchesSnap.docs.forEach(d => {
            const data: any = d.data();
            const k = String(data.supplierId);
            (batchesBySupplier[k] = batchesBySupplier[k] || []).push({
                id: d.id,
                ...data,
            });
        });

        // 4. Enrich each supplier with trust (from current-trust doc or
        //    null when unscored) + row-level batch aggregates.
        const enriched = allSuppliers.map(s => {
            const trustDoc = trustById.get(String(s.id));
            const trust = trustDoc
                ? {
                    overall: trustDoc.overall ?? null,
                    confidence: trustDoc.confidence ?? 'preliminary',
                    verifiedTransactions: trustDoc.verifiedTransactions ?? 0,
                    dimensions: trustDoc.dimensions ?? {},
                    weights: trustDoc.weights ?? {},
                    flags: trustDoc.flags ?? [],
                    flagDetails: trustDoc.flagDetails ?? [],
                    hasCriticalViolation: !!trustDoc.hasCriticalViolation,
                    scoringVersion: trustDoc.scoringVersion,
                }
                : null;

            const supplierBatches = batchesBySupplier[s.id] || [];

            const verifiedBatches = supplierBatches.filter(
                (b: any) => b.verifiedAt && b.verifiedAt > 0
            );

            const verifiedVolumeKg = verifiedBatches.reduce(
                (sum: number, b: any) => sum + (b.weightKg || 0),
                0
            );

            const korValues = verifiedBatches
                .map((b: any) => b.korGPerKg)
                .filter((v: any): v is number => typeof v === 'number' && v > 0);
            const avgKorGPerKg = korValues.length > 0
                ? Number(
                    (korValues.reduce((a: number, b: number) => a + b, 0) / korValues.length)
                        .toFixed(0)
                )
                : null;

            const annualVolumeKg = supplierBatches.reduce(
                (sum: number, b: any) => sum + (b.weightKg || 0),
                0
            );

            const rcnValues = supplierBatches
                .map((b: any) => b.rcnQualityScore)
                .filter((v: any): v is number => typeof v === 'number' && v > 0);
            const averageRcnQualityScore = rcnValues.length > 0
                ? Number(
                    (rcnValues.reduce((a: number, b: number) => a + b, 0) / rcnValues.length)
                        .toFixed(1)
                )
                : null;

            return {
                id: s.id,
                name: s.name,
                type: s.type,
                status: s.status,
                contactPerson: s.contactPerson,
                phone: s.phone,
                email: s.email,
                location: s.location,
                region: s.region,
                country: s.country,
                latitude: s.latitude,
                longitude: s.longitude,
                hasLocation: s.hasLocation,
                registrationNumber: s.registrationNumber,
                taxId: s.taxId,
                farmerIdNumber: s.farmerIdNumber,
                farmSize: s.farmSize,
                yearsFarming: s.yearsFarming,
                isCertified: s.isCertified,
                certificationType: s.certificationType,
                certificationNumber: s.certificationNumber,
                certificationExpiryDate: s.certificationExpiryDate,
                firebreakProtection: s.firebreakProtection,
                noChildLabor: s.noChildLabor,
                sustainableHarvesting: s.sustainableHarvesting,
                dataConsentGiven: s.dataConsentGiven,
                dataConsentScope: s.dataConsentScope,
                dataConsentSignedBy: s.dataConsentSignedBy,
                dataConsentVersion: s.dataConsentVersion,
                dataConsentWithdrawnDate: s.dataConsentWithdrawnDate,
                dataConsentWithdrawnReason: s.dataConsentWithdrawnReason,
                photoUrl: s.photoUrl,
                bio: s.bio,
                quote: s.quote,
                rating: s.rating,
                notes: s.notes,
                isActive: s.isActive ?? s.status === 'ACTIVE',

                firestoreId: s.id,
                overall: trust?.overall ?? null,
                confidence: trust?.confidence ?? 'preliminary',
                hasCriticalViolation: trust?.hasCriticalViolation ?? false,
                verifiedVolumeKg,
                avgKorGPerKg,
                trust: trust ?? null,
                annualVolumeKg,
                averageRcnQualityScore,
            };
        });

        const q = String(search).trim().toLowerCase();
        const searched = q
            ? enriched.filter(r => {
                const hay = `${r.name || ''} ${r.contactPerson || ''} ${r.location || ''}`.toLowerCase();
                return hay.includes(q);
            })
            : enriched;

        const typeFiltered = type
            ? searched.filter(r => r.type === type || r.status === type)
            : searched;

        const sorters: Record<string, (a: any, b: any) => number> = {
            name: (a, b) => (a.name || '').localeCompare(b.name || ''),
            trust_desc: (a, b) => (b.overall ?? -1) - (a.overall ?? -1),
            trust_asc: (a, b) => {
                const av = a.overall ?? 999;
                const bv = b.overall ?? 999;
                return av - bv;
            },
            volume_desc: (a, b) => b.verifiedVolumeKg - a.verifiedVolumeKg,
            quality_desc: (a, b) => (b.avgKorGPerKg ?? -1) - (a.avgKorGPerKg ?? -1),
        };
        const sorter = sorters[String(sort)] || sorters.name;
        const sorted = [...typeFiltered].sort(sorter);

        return {rows: sorted, total: sorted.length};
    }

// ============================================================
// buildNetworkSummary — S4 restructure.
// Suppliers + trust + slim batches come from loadTrustMap
// (single trust-input shape). Only the four extra collections
// the summary needs are fetched here, plus two cheap
// count-only reads on commitments/inspections for queueCounts.
//
// _timing block removed; if phase timings are needed at S7,
// log via console.time here, never in the payload.
// ============================================================
async function buildNetworkSummary(fid: string) {
    // S8-C1 — reads:
    //   * trust + batchStats from `supplier_current_trust` (per supplier)
    //   * farm verifiedVolumeKg from `supplier_network_meta/summary`
    //   * the four collections the summary needs directly
    //
    // Fallback: if the meta doc is absent OR any scored supplier's
    // current doc is missing `batchStats`, fall back to the live scan
    // used before S8-C1 (correct but slow). The fallback is what makes
    // the summary correct between deploy and the first post-fix
    // recalculate — it self-heals as soon as recalculateTrustBatch runs.
    const {trustById} = await loadCurrentTrustRows(fid);

    // Reconstruct the trustBySupplier shape (TrustResult).
    const trustBySupplier: Record<string, any> = {};
    trustById.forEach((doc, supplierId) => {
        trustBySupplier[supplierId] = {
            overall: doc.overall ?? null,
            confidence: (doc.confidence ?? 'preliminary') as
                'preliminary' | 'developing' | 'established',
            verifiedTransactions: doc.verifiedTransactions ?? 0,
            dimensions: doc.dimensions ?? {},
            weights: doc.weights ?? {},
            flags: doc.flags ?? [],
            flagDetails: doc.flagDetails ?? [],
            hasCriticalViolation: !!doc.hasCriticalViolation,
            scoringVersion: doc.scoringVersion,
        };
    });

    const metaSnap = await db.collection('farms').doc(fid)
        .collection('supplier_network_meta').doc('summary').get();
    const metaData: any = metaSnap.exists ? metaSnap.data() : null;

    // Fallback detection: need meta AND batchStats on every scored doc.
    const allScoredHaveStats = Array.from(trustById.values()).every(
        d => (d as any).overall === null || d.batchStats !== undefined
    );
    const needsFallback = !metaData || !allScoredHaveStats;

    let verifiedVolumeKg: number;
    let batchesBySupplier: Record<string, any[]>;
    let materializedAsOf: number | null;

    if (needsFallback) {
        // PRE-S8-C1 PATH — live scan. Same projection as before.
        const batchesSnap = await db.collection('farms').doc(fid)
            .collection('quality_batches')
            .select(
                'supplierId', 'weightKg', 'qualityScore', 'rcnQualityScore',
                'defectiveRate', 'moistureContent', 'korGPerKg', 'nutCountPerKg',
                'foreignMatter', 'aflatoxinPpb', 'heavyMetalsPpb',
                'pesticideResiduePpb', 'farmOsMonitored', 'verifiedAt', 'testResults',
                'processingDate'
            )
            .get();
        const liveBatches: Record<string, any[]> = {};
        batchesSnap.docs.forEach(d => {
            const data: any = d.data();
            const k = String(data.supplierId);
            (liveBatches[k] = liveBatches[k] || []).push({ id: d.id, ...data });
        });
        verifiedVolumeKg = Object.values(liveBatches)
            .flat()
            .filter((b: any) => b.verifiedAt && b.verifiedAt > 0)
            .reduce((sum: number, b: any) => sum + (b.weightKg || 0), 0);
        batchesBySupplier = liveBatches;
        materializedAsOf = null;
    } else {
        // MATERIALIZED PATH — no batch scan.
        verifiedVolumeKg = Number(metaData.verifiedVolumeKg) || 0;
        materializedAsOf = Number(metaData.computedAt) || null;
        batchesBySupplier = {};
        trustById.forEach((doc, sid) => {
            if (doc.batchStats?.verifiedBatches) {
                batchesBySupplier[sid] = doc.batchStats.verifiedBatches.map((b: any) => ({
                    verifiedAt: b.verifiedAt,
                    processingDate: b.processingDate,
                    moistureContent: b.moistureContent,
                    defectiveRate: b.defectiveRate,
                }));
            }
        });
    }

    const [
        suppliersSnap,
        disputesSnap,
        expensesSnap,
        revenuesSnap,
        supportActionsSnap,
        allCommitmentsSnap,
        allInspectionsSnap,
    ] = await Promise.all([
            // Full supplier docs — name / consent scopes / financial id
            db.collection('farms').doc(fid).collection('suppliers').get(),
            db.collection('farms').doc(fid).collection('supplier_disputes')
                .select('reviewStatus').get(),
            db.collection('farms').doc(fid).collection('expenses')
                .select('category', 'supplierId', 'amount').get(),
            db.collection('farms').doc(fid).collection('revenues')
                .select('supplierId', 'totalAmount').get(),
            db.collection('farms').doc(fid).collection('supplier_support_actions')
                .select('supplierId', 'weakness', 'status', 'givenAt').get(),
            // Queue counts only — the loader ships *validated* items only,
            // so we read the two collections again, projected to one field.
            db.collection('farms').doc(fid).collection('supplier_commitments')
                .select('validatedAt').get(),
            db.collection('farms').doc(fid).collection('supplier_inspections')
                .select('validatedAt').get(),
        ]);

        // ---- KPIs ----
        const totalSuppliers = suppliersSnap.size;

        const activeSuppliers = suppliersSnap.docs.filter(d => {
            const s: any = d.data();
            return (s.isActive ?? s.status === 'ACTIVE') && s.status === 'ACTIVE';
        }).length;

        const buyerReadyCount = suppliersSnap.docs.filter(d => {
            const s: any = d.data();
            const scopes = s.dataConsentScope || [];
            const hasAllScopes =
                scopes.includes('identity') &&
                scopes.includes('location') &&
                scopes.includes('photo');
            return (
                (s.isActive ?? s.status === 'ACTIVE') &&
                s.status === 'ACTIVE' &&
                s.dataConsentGiven &&
                !s.dataConsentWithdrawnDate &&
                hasAllScopes
            );
        }).length;

        const scoredOveralls = Object.values(trustBySupplier)
            .map(t => t.overall)
            .filter((v): v is number => v !== null);

        const avgTrustOverall = scoredOveralls.length > 0
            ? Number((scoredOveralls.reduce((a, b) => a + b, 0) / scoredOveralls.length).toFixed(1))
            : null;
        const scoredCount = scoredOveralls.length;

        // ---- Consent counts ----
        const consentCounts = {full: 0, partial: 0, none: 0, withdrawn: 0};
        suppliersSnap.docs.forEach(d => {
            const s: any = d.data();
            if (s.dataConsentWithdrawnDate) {
                consentCounts.withdrawn++;
                return;
            }
            if (!s.dataConsentGiven) {
                consentCounts.none++;
                return;
            }
            const scopes = s.dataConsentScope || [];
            if (scopes.length >= 3) {
                consentCounts.full++;
            } else if (scopes.length > 0) {
                consentCounts.partial++;
            } else {
                consentCounts.none++;
            }
        });

        // ---- Queue counts ----
        const queueCounts = {
            pendingCommitments: allCommitmentsSnap.docs
                .filter(d => !(d.data() as any).validatedAt).length,
            pendingInspections: allInspectionsSnap.docs
                .filter(d => !(d.data() as any).validatedAt).length,
            openDisputes: disputesSnap.docs.filter(d => {
                const data: any = d.data();
                return data.reviewStatus === 'OPEN' || data.reviewStatus === 'UNDER_REVIEW';
            }).length,
        };

        // ---- Maturity counts ----
        // Count every supplier, not just scored ones: unscored suppliers have no
// current-trust doc, so they count as preliminary (0 verified
// transactions) — same as loadTrustMap did before S8-B.
        const maturityCounts = {preliminary: 0, developing: 0, established: 0};
        suppliersSnap.docs.forEach(d => {
            const t = trustBySupplier[d.id];
            const k = (t?.confidence ?? 'preliminary') as 'preliminary' | 'developing' | 'established';
            if (k in maturityCounts) maturityCounts[k]++;
        });

        // ---- Top trust ----
        const topTrust = Object.entries(trustBySupplier)
            .map(([supplierId, trust]) => {
                const s: any = {
                    id: supplierId,
                    ...(suppliersSnap.docs.find(d => d.id === supplierId)?.data() || {}),
                };
                return {
                    supplierId,
                    name: s.name,
                    overall: trust.overall,
                    confidence: trust.confidence,
                    verifiedTransactions: trust.verifiedTransactions,
                };
            })
            .filter(x => x.overall !== null)
            .sort((a, b) => (b.overall ?? 0) - (a.overall ?? 0))
            .slice(0, 5);

        // ---- Risk preview ----
        const flagged = Object.entries(trustBySupplier).filter(
            ([, t]) => t.hasCriticalViolation || t.flags.length > 0
        );
        const riskCounts = {
            critical: flagged.filter(([, t]) => t.hasCriticalViolation).length,
            high: flagged.filter(([, t]) =>
                !t.hasCriticalViolation && t.overall !== null && t.overall < 40
            ).length,
            medium: flagged.filter(([, t]) =>
                !t.hasCriticalViolation &&
                t.overall !== null &&
                t.overall >= 40 &&
                t.overall < 60
            ).length,
            low: flagged.filter(([, t]) => {
                if (t.hasCriticalViolation) return false;
                if (t.overall === null) return true;
                if (t.overall < 40) return false;
                if (t.overall < 60) return false;
                return true;
            }).length,
        };
        const topRiskEntry = flagged
            .sort((a, b) => {
                const aCrit = a[1].hasCriticalViolation ? 1 : 0;
                const bCrit = b[1].hasCriticalViolation ? 1 : 0;
                if (aCrit !== bCrit) return bCrit - aCrit;
                return (a[1].overall ?? 100) - (b[1].overall ?? 100);
            })[0];
        const topRisk = topRiskEntry
            ? {
                supplierId: topRiskEntry[0],
                name: (suppliersSnap.docs.find(d => d.id === topRiskEntry[0])?.data() as any)?.name || '',
                hasCriticalViolation: topRiskEntry[1].hasCriticalViolation,
                overall: topRiskEntry[1].overall,
            }
            : null;

        // ---- Financial efficiency ----
        const expensesBySupplier = new Map<number, number>();
        expensesSnap.docs.forEach(d => {
            const e: any = d.data();
            if (e.category === 'PROCUREMENT' && typeof e.supplierId === 'number') {
                expensesBySupplier.set(
                    e.supplierId,
                    (expensesBySupplier.get(e.supplierId) || 0) + (e.amount || 0)
                );
            }
        });

        const revenuesBySupplier = new Map<number, number>();
        revenuesSnap.docs.forEach(d => {
            const r: any = d.data();
            if (typeof r.supplierId === 'number') {
                revenuesBySupplier.set(
                    r.supplierId,
                    (revenuesBySupplier.get(r.supplierId) || 0) + (r.totalAmount || 0)
                );
            }
        });

        const financialEfficiency = suppliersSnap.docs
            .map(d => {
                const s: any = d.data();
                const numericId = typeof s.id === 'number' ? s.id : parseInt(String(s.id));
                const procurement = expensesBySupplier.get(numericId) || 0;
                const revenue = revenuesBySupplier.get(numericId) || 0;
                if (procurement === 0) return null;
                return {
                    supplierId: d.id,
                    name: s.name,
                    procurement,
                    revenue,
                    efficiency: Number((revenue / procurement).toFixed(2)),
                };
            })
            .filter((x): x is NonNullable<typeof x> => x !== null)
            .sort((a, b) => b.efficiency - a.efficiency)
            .slice(0, 5);

        // ---- Development counts ----
        const allSupportActions: SupportAction[] = supportActionsSnap.docs.map(d => {
            const data: any = d.data();
            return {
                supplierId: data.supplierId,
                weakness: data.weakness,
                status: data.status,
                givenAt: data.givenAt,
            };
        });

        const openActions = allSupportActions.filter(a => a.status === 'OPEN').length;

        const suppliersForDev = suppliersSnap.docs.map(d => ({
            id: d.id,
            ...d.data(),
        } as any));

        const trustConfidenceMap: Record<string, {
            confidence: 'preliminary' | 'developing' | 'established';
            verifiedTransactions: number;
        }> = {};
        Object.entries(trustBySupplier).forEach(([id, t]) => {
            trustConfidenceMap[id] = {
                confidence: t.confidence,
                verifiedTransactions: t.verifiedTransactions,
            };
        });

        const visibleOpportunities = detectVisibleOpportunities(
            suppliersForDev,
            batchesBySupplier,
            trustConfidenceMap,
            allSupportActions
        );

        const topOpportunity = visibleOpportunities.length > 0
            ? {
                supplierId: visibleOpportunities[0].supplierId,
                name: visibleOpportunities[0].supplierName,
                weakness: visibleOpportunities[0].weakness,
                severity: visibleOpportunities[0].severity,
            }
            : null;

        const developmentCounts = {
            openActions,
            visibleOpportunities: visibleOpportunities.length,
            topOpportunity,
        };

        return {
            generatedAt: Date.now(),
            scoringVersion: 'v2.0',

            totalSuppliers,
            activeSuppliers,
            buyerReadyCount,

            avgTrustOverall,
            scoredCount,

            verifiedVolumeKg,

            consentCounts,
            queueCounts,
            maturityCounts,

            topTrust,
            topRisk,
            riskCounts,

            financialEfficiency,

            developmentCounts,
            materializedAsOf,
        };
    }