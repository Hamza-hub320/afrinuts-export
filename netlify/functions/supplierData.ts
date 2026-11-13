import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { recomputeAndWriteCurrent } from './_lib/currentTrust';

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = getFirestore();

// ============================================================
// D5 — shared spawn helper for inspection follow-up tasks.
// Called from validateEvidence (after stamp + S8 recompute) and
// from backfillInspectionTasks. Dedupe by inspectionId, so
// re-validation and re-backfill are both no-ops.
//
// Rules:
//  - Only CONDITIONAL or FAIL spawns.
//  - PASS spawns nothing (the PASS is a closure signal, not a task).
//  - CRITICAL FAIL is not special-cased: the task fires AND the
//    critical violation flag fires independently via trustFormulas.
//  - Spawn failure never fails the caller's main write.
// ============================================================
async function spawnInspectionTaskIfNeeded(
    fid: string,
    inspectionDoc: { id: string; data: any },
    givenBy: string
): Promise<{ created: boolean; actionId?: string; skippedReason?: string }> {
    const insp: any = inspectionDoc.data;
    const inspectionId = inspectionDoc.id;

    if (!insp) return { created: false, skippedReason: 'no inspection data' };
    if (insp.outcome !== 'CONDITIONAL' && insp.outcome !== 'FAIL') {
        return { created: false, skippedReason: `outcome ${insp.outcome} does not spawn` };
    }

    const farmRef = db.collection('farms').doc(fid);
    const existing = await farmRef.collection('supplier_inspection_actions')
        .where('inspectionId', '==', inspectionId)
        .limit(1)
        .get();
    if (!existing.empty) {
        return { created: false, skippedReason: 'task already exists for this inspection' };
    }

    // Due trigger: parse the corrective-action text.
    // "before the next delivery" ⇒ next_batch; explicit date ⇒ date;
    // otherwise default to next_batch with the default-applied flag recorded.
    const correctiveAction: string = insp.correctiveAction || '';
    let dueTrigger: { type: 'date'; date: number } | { type: 'next_batch' } = { type: 'next_batch' };
    let dueTriggerDefaulted = true;
    if (/before the next delivery|next delivery|next batch/i.test(correctiveAction)) {
        dueTrigger = { type: 'next_batch' };
        dueTriggerDefaulted = false;
    } else {
        const dateMatch = correctiveAction.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            const ts = Date.parse(dateMatch[1]);
            if (!Number.isNaN(ts)) {
                dueTrigger = { type: 'date', date: ts };
                dueTriggerDefaulted = false;
            }
        }
    }

    const now = Date.now();
    const ref = await farmRef.collection('supplier_inspection_actions').add({
        supplierId: insp.supplierId,
        inspectionId,
        inspectionNumericId: typeof insp.id === 'number' ? insp.id : null,
        inspectionType: insp.inspectionType || null,
        outcome: insp.outcome,
        severity: insp.severity || null,
        finding: insp.findings || '',
        correctiveAction: correctiveAction,
        owner: insp.inspector || '',
        assignedTo: insp.inspector || '',
        dueTrigger,
        dueTriggerDefaulted,
        status: 'OPEN',
        givenAt: now,
        givenBy,
        scoringVersion: 'v2.0',
        closedAt: null,
        closedBy: null,
        reInspectionId: null,
        reInspectionNumericId: null,
    });
    return { created: true, actionId: ref.id };
}

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        let params: any = {};
        if (event.httpMethod === 'GET') {
            params = event.queryStringParameters || {};
        } else if (event.httpMethod === 'POST') {
            params = JSON.parse(event.body || '{}');
        }

        const { action, farmId, supplierId } = params;
        const fid = farmId || '1';

        if (action === 'getSuppliers') {
            const snapshot = await db
                .collection('farms').doc(fid)
                .collection('suppliers')
                .get();

            const suppliers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ suppliers }),
            };
        }

        if (action === 'getAllTraceability') {
            const snapshot = await db
                .collection('farms').doc(fid)
                .collection('batch_traceability')
                .orderBy('exportDate', 'desc')
                .get();

            const traceability = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ traceability }),
            };
        }

        if (action === 'getAllRevenues') {
            const snapshot = await db
                .collection('farms').doc(fid)
                .collection('revenues')
                .orderBy('harvestDate', 'desc')
                .limit(50)
                .get();

            const revenues = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ revenues }),
            };
        }

        if (action === 'getAllMasterTraceability') {
            const snapshot = await db
                .collection('farms').doc(fid)
                .collection('master_traceability')
                .orderBy('exportDate', 'desc')
                .get();

            const masterTraceability = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ masterTraceability }),
            };
        }

        if (action === 'getSupplierQualityBatches' && supplierId) {
            const snapshot = await db
                .collection('farms').doc(fid)
                .collection('quality_batches')
                .where('supplierId', '==', parseInt(supplierId))
                .orderBy('processingDate', 'desc')
                .get();

            const batches = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ batches }),
            };
        }

        if (action === 'getSupplierFinancials' && supplierId) {
            const expensesSnapshot = await db
                .collection('farms').doc(fid)
                .collection('expenses')
                .where('supplierId', '==', parseInt(supplierId))
                .get();

            const revenuesSnapshot = await db
                .collection('farms').doc(fid)
                .collection('revenues')
                .where('supplierId', '==', parseInt(supplierId))
                .get();

            const expenses = expensesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const revenues = revenuesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            const totalProcurement = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
            const totalRevenue = revenues.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ expenses, revenues, totalProcurement, totalRevenue }),
            };
        }

        if (action === 'getAllBatches') {
            const snapshot = await db
                .collection('farms').doc(fid)
                .collection('quality_batches')
                .orderBy('processingDate', 'desc')
                .limit(50)
                .get();

            const batches = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ batches }),
            };
        }

        if (action === 'getBatchDetail' && params.batchId) {
            const batchDoc = await db
                .collection('farms').doc(fid)
                .collection('quality_batches')
                .doc(params.batchId)
                .get();

            if (!batchDoc.exists) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Batch not found' }),
                };
            }

            const batchData = { id: batchDoc.id, ...batchDoc.data() } as any;

            // Fetch traceability and merge verification code
            const traceSnapshot = await db
                .collection('farms').doc(fid)
                .collection('batch_traceability')
                .where('qualityBatchId', '==', parseInt(params.batchId))
                .limit(1)
                .get();

            const traceability = !traceSnapshot.empty
                ? { id: traceSnapshot.docs[0].id, ...traceSnapshot.docs[0].data() }
                : null;

            let verificationCode = batchData.verificationCode || null;
            let updatedAt = batchData.updatedAt;

            if (!traceSnapshot.empty) {
                const traceData = traceSnapshot.docs[0].data();
                if (traceData.verificationCode) {
                    verificationCode = traceData.verificationCode;
                }
                if (traceData.updatedAt) {
                    updatedAt = traceData.updatedAt;
                }
            }

            const batch = {
                ...batchData,
                verificationCode,
                updatedAt
            };

            // Fetch linked supplier
            let supplier = null;
            if (batch.supplierId) {
                const supplierDoc = await db
                    .collection('farms').doc(fid)
                    .collection('suppliers')
                    .doc(String(batch.supplierId))
                    .get();
                if (supplierDoc.exists) {
                    supplier = { id: supplierDoc.id, ...supplierDoc.data() };
                }
            }

            // Fetch linked expenses
            const expensesSnapshot = await db
                .collection('farms').doc(fid)
                .collection('expenses')
                .where('batchId', '==', parseInt(params.batchId))
                .get();
            const expenses = expensesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Fetch linked revenues
            const revenuesSnapshot = await db
                .collection('farms').doc(fid)
                .collection('revenues')
                .where('batchId', '==', parseInt(params.batchId))
                .get();
            const revenues = revenuesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ batch, supplier, expenses, revenues, traceability }),
            };
        }

        if (action === 'validateEvidence') {
            const {collection, docId, userId} = params;

            if (!['supplier_commitments', 'supplier_inspections'].includes(collection)) {
                return {statusCode: 400, headers, body: JSON.stringify({error: 'Invalid collection'})};
            }

            const docRef = db.collection('farms').doc(fid).collection(collection).doc(docId);
            const docSnap = await docRef.get();

            if (!docSnap.exists) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({error: `No ${collection} document at ${docId}`}),
                };
            }

            await docRef.update({
                validatedAt: Date.now(),
                validatedBy: userId,
                updatedAt: Date.now(),
            });

            // S8 — synchronous single-supplier current-trust recompute.
            // Validation is the moment a score can appear or a critical
            // violation can fire; must not wait for a recalculate click.
            //
            // D5 merge-order note (brief correction 8): if the D5 spawn
            // hook lands in this branch after this call, it must not
            // early-return before this runs. Order: stamp → spawn (D5)
            // → recompute (S8), or stamp → recompute (S8) → spawn (D5).
            // Never an early return between them.
            //
            // Failure here must NOT fail the validation. The validatedAt
            // stamp is the durable truth; if the recompute throws, log and
            // continue — the next recalculateTrustBatch heals this doc.
            try {
                const evidenceData: any = docSnap.data();
                const evidenceSupplierId = evidenceData?.supplierId;
                if (evidenceSupplierId !== undefined && evidenceSupplierId !== null) {
                    await recomputeAndWriteCurrent(fid, String(evidenceSupplierId));
                }
            } catch (recomputeErr: any) {
                console.error(
                    'S8 current-trust recompute failed after validateEvidence:',
                    recomputeErr?.message || recomputeErr
                );
            }
            if (collection === 'supplier_inspections') {
                try {
                    const inspData: any = docSnap.data();
                    await spawnInspectionTaskIfNeeded(
                        fid,
                        {id: docId, data: inspData},
                        userId || 'portal-manager'
                    );
                } catch (spawnErr: any) {
                    console.error(
                        'D5 spawnInspectionTaskIfNeeded failed after validateEvidence:',
                        spawnErr?.message || spawnErr
                    );
                }
            }

            return {statusCode: 200, headers, body: JSON.stringify({success: true})};
        }

        if (action === 'logSupportAction') {
            const { supportActionData } = params;

            if (!supportActionData) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing supportActionData' })
                };
            }

            const {
                supplierId: supId,
                weakness,
                supportType,
                notes,
                assignedTo,
                givenBy,
                baselineMetricLabel,
                baselineValue,
                scoringVersion,
            } = supportActionData;

            const ref = await db
                .collection('farms').doc(fid)
                .collection('supplier_support_actions')
                .add({
                    supplierId: supId,
                    weakness,
                    supportType,
                    notes: notes || '',
                    assignedTo: assignedTo || '',
                    givenBy: givenBy || 'unknown',
                    givenAt: Date.now(),
                    status: 'OPEN',
                    baselineMetricLabel,
                    baselineValue,
                    scoringVersion,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, id: ref.id }),
            };
        }

        if (action === 'resolveDispute') {
            const { disputeId, resolution, reviewedBy, originalValue, correctedValue } = params;

            if (!disputeId || !['UPHELD', 'REJECTED'].includes(resolution)) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid params' }) };
            }

            const disputeRef = db.collection('farms').doc(fid)
                .collection('supplier_disputes').doc(disputeId);
            const disputeSnap = await disputeRef.get();
            const disputeData: any = disputeSnap.exists ? disputeSnap.data() : null;

            await disputeRef.update({
                reviewStatus: 'RESOLVED',
                decision: resolution,
                reviewedBy: reviewedBy || 'portal-user',
                resolvedDate: Date.now(),
                correctionApplied: resolution === 'UPHELD',
                originalValue: originalValue ?? null,
                correctedValue: correctedValue ?? null,
                updatedAt: Date.now(),
            });

            // S8 — synchronous single-supplier current-trust recompute.
            // Same reasoning as validateEvidence. Dispute resolution can
            // change what counts as validated evidence (an UPHELD dispute
            // may flip a batch or commitment outcome) and must not wait
            // for a recalculate click.
            //
            // KNOWN DRIFT EDGE (brief correction 5): resolveDispute itself
            // only stamps the dispute document. A batch correction applied
            // later via Farm OS sync (not through this branch) does NOT
            // refresh supplier_current_trust until the next validation or
            // recalculate. Do not "fix" this by adding a new trigger —
            // the drift guard (verifyCurrentTrust) covers it.
            try {
                const disputeSupplierId = disputeData?.supplierId;
                if (disputeSupplierId !== undefined && disputeSupplierId !== null) {
                    await recomputeAndWriteCurrent(fid, String(disputeSupplierId));
                }
            } catch (recomputeErr: any) {
                console.error(
                    'S8 current-trust recompute failed after resolveDispute:',
                    recomputeErr?.message || recomputeErr
                );
            }

            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }
        if (action === 'getOpenDisputes') {
            const snap = await db.collection('farms').doc(fid)
                .collection('supplier_disputes')
                .where('reviewStatus', 'in', ['OPEN', 'UNDER_REVIEW'])
                .get();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ disputes: snap.docs.map(d => ({ ...d.data(), id: d.id })) }),
            };
        }

        // ============================================================
        // D5 — getInspectionActions
        // Returns the farm's supplier_inspection_actions, optionally
        // filtered to a single supplier. Full row per task — the
        // Development and Risk pages both consume this.
        // ============================================================
        if (action === 'getInspectionActions') {
            const { supplierId: taskSupplierId } = params;
            let q: any = db.collection('farms').doc(fid).collection('supplier_inspection_actions');
            if (taskSupplierId !== undefined && taskSupplierId !== null && taskSupplierId !== '') {
                const numeric = Number(taskSupplierId);
                if (Number.isFinite(numeric)) {
                    q = q.where('supplierId', '==', numeric);
                }
            }
            const snap = await q.get();
            const actions = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ actions }),
            };
        }

        // ============================================================
        // D5 — updateInspectionActionDone
        // Gated DONE: the caller passes the re-inspection's Firestore
        // doc id. Verification before write:
        //   - re-inspection exists, same supplier, validated;
        //   - inspectionDate > task.givenAt (must be a NEW inspection);
        //   - outcome is PASS.
        // Any check fails ⇒ 400, task stays OPEN.
        // ============================================================
        if (action === 'updateInspectionActionDone') {
            const { actionId, reInspectionId, closedBy } = params;

            if (!actionId || !reInspectionId) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing actionId or reInspectionId' }),
                };
            }

            const farmRef = db.collection('farms').doc(fid);
            const actionRef = farmRef.collection('supplier_inspection_actions').doc(actionId);
            const actionSnap = await actionRef.get();
            if (!actionSnap.exists) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: `No inspection action at ${actionId}` }),
                };
            }
            const task: any = actionSnap.data();
            if (task.status === 'DONE') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Task is already DONE' }),
                };
            }

            const reInspRef = farmRef.collection('supplier_inspections').doc(reInspectionId);
            const reInspSnap = await reInspRef.get();
            if (!reInspSnap.exists) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: `No re-inspection at ${reInspectionId}` }),
                };
            }
            const reInsp: any = reInspSnap.data();

            const sameSupplier =
                String(reInsp.supplierId) === String(task.supplierId);
            if (!sameSupplier) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Re-inspection belongs to a different supplier' }),
                };
            }
            if (!reInsp.validatedAt) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Re-inspection is not validated' }),
                };
            }
            const reInspDate =
                typeof reInsp.inspectionDate === 'number' ? reInsp.inspectionDate : null;
            if (reInspDate === null || reInspDate <= (task.givenAt || 0)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Re-inspection date must be after the task was created' }),
                };
            }
            if (reInsp.outcome !== 'PASS') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: `Re-inspection outcome is ${reInsp.outcome}; DONE requires PASS` }),
                };
            }

            await actionRef.update({
                status: 'DONE',
                closedAt: Date.now(),
                closedBy: closedBy || 'portal-user',
                reInspectionId,
                reInspectionNumericId: typeof reInsp.id === 'number' ? reInsp.id : null,
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true }),
            };
        }

        // ============================================================
        // D5 — backfillInspectionTasks (TEMPORARY; removed in the D5
        // cleanup commit after the deploy run).
        // One-off: scans validated CONDITIONAL/FAIL inspections with
        // no existing task, creates one per. Dedupe by inspectionId
        // (same rule as the spawn). Idempotent — re-running after
        // the backfill creates zero tasks.
        // ============================================================
        if (action === 'backfillInspectionTasks') {
            const farmRef = db.collection('farms').doc(fid);
            const inspSnap = await farmRef.collection('supplier_inspections').get();
            const existingSnap = await farmRef.collection('supplier_inspection_actions').get();
            const existingIds = new Set<string>();
            existingSnap.docs.forEach(d => {
                const data: any = d.data();
                if (data?.inspectionId) existingIds.add(String(data.inspectionId));
            });

            const created: Array<{ actionId: string; inspectionId: string; supplierId: any; outcome: string; severity: any }> = [];
            const skipped: Array<{ inspectionId: string; reason: string }> = [];

            for (const doc of inspSnap.docs) {
                const data: any = doc.data();
                if (!data.validatedAt) {
                    continue;
                }
                if (data.outcome !== 'CONDITIONAL' && data.outcome !== 'FAIL') {
                    continue;
                }
                if (existingIds.has(doc.id)) {
                    skipped.push({ inspectionId: doc.id, reason: 'task already exists' });
                    continue;
                }
                const result = await spawnInspectionTaskIfNeeded(
                    fid,
                    { id: doc.id, data },
                    'portal-manager (backfill)'
                );
                if (result.created && result.actionId) {
                    created.push({
                        actionId: result.actionId,
                        inspectionId: doc.id,
                        supplierId: data.supplierId,
                        outcome: data.outcome,
                        severity: data.severity ?? null,
                    });
                    existingIds.add(doc.id);
                } else {
                    skipped.push({ inspectionId: doc.id, reason: result.skippedReason || 'unknown' });
                }
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ farmId: fid, created, skipped }),
            };
        }

        if (action === 'saveScoreSnapshot') {
            const { supplierId, snapshotData } = params;

            if (!supplierId || !snapshotData) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing params' }) };
            }

            const historyRef = db
                .collection('farms').doc(fid)
                .collection('suppliers').doc(String(supplierId))
                .collection('supplier_score_history');

            await historyRef.add({
                ...snapshotData,
                calculatedAt: Date.now(),
            });

            await db
                .collection('farms').doc(fid)
                .collection('suppliers').doc(String(supplierId))
                .update({
                    latestTrustScore: snapshotData.overall,
                    latestConfidence: snapshotData.confidence,
                    lastScoredAt: Date.now(),
                });

            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        if (action === 'getSuppliersWithTrust') {
            const suppliersSnap = await db.collection('farms').doc(fid).collection('suppliers').get();
            const batchesSnap = await db.collection('farms').doc(fid).collection('quality_batches').get();
            const allCommitmentsSnap = await db.collection('farms').doc(fid).collection('supplier_commitments').get();
            const allInspectionsSnap = await db.collection('farms').doc(fid).collection('supplier_inspections').get();

            // NEW — support actions
            let allSupportActions: any[] = [];
            try {
                const supportSnap = await db.collection('farms').doc(fid).collection('supplier_support_actions').get();
                allSupportActions = supportSnap.docs.map(d => ({
                    id: d.id,
                    ...d.data(),
                } as any));
            } catch (err: any) {
                // Collection may not exist yet — treat as empty rather than crash
                console.warn('supplier_support_actions fetch failed:', err.message);
            }

            const suppliers = suppliersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            // Only ship what the Trust Engine reads — not the full document
            const batches = batchesSnap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    supplierId: data.supplierId,
                    weightKg: data.weightKg,
                    qualityGrade: data.qualityGrade,
                    rcnQualityScore: data.rcnQualityScore,
                    qualityScore: data.qualityScore,
                    moistureContent: data.moistureContent,
                    defectiveRate: data.defectiveRate,
                    korGPerKg: data.korGPerKg,
                    aflatoxinPpb: data.aflatoxinPpb,
                    verifiedAt: data.verifiedAt,
                    farmOsMonitored: data.farmOsMonitored,
                    firestoreId: d.id,
                    batchNumber: data.batchNumber,
                };
            });

            const allCommitments = allCommitmentsSnap.docs.map(d => ({
                firestoreId: d.id,           // ← the real path
                ...d.data(),                 // ← numeric id lives here, doesn't clobber firestoreId
            } as any));

            const allInspections = allInspectionsSnap.docs.map(d => ({
                firestoreId: d.id,
                ...d.data(),
            } as any));

            const commitments = allCommitments.filter((c: any) => c.validatedAt);
            const pendingCommitments = allCommitments.filter((c: any) => !c.validatedAt);

            const inspections = allInspections.filter((i: any) => i.validatedAt);
            const pendingInspections = allInspections.filter((i: any) => !i.validatedAt);

            const groupBy = (arr: any[], key = 'supplierId') => {
                const out: Record<string, any[]> = {};
                arr.forEach(item => {
                    const k = String(item[key]);
                    (out[k] = out[k] || []).push(item);
                });
                return out;
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    suppliers,
                    batchesBySupplier: groupBy(batches),
                    commitmentsBySupplier: groupBy(commitments),
                    inspectionsBySupplier: groupBy(inspections),
                    pendingCommitments,
                    pendingInspections,
                    supportActions: allSupportActions,
                }),
            };
        }

        // Add to params destructuring: action, farmId, supplierId, supportActionData, supportActionId, newStatus

        if (action === 'logSupportAction') {
            const { supportActionData } = params;

            if (!supportActionData) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing supportActionData' }) };
            }

            const {
                supplierId: supId,
                weakness,
                supportType,
                notes,
                assignedTo,
                givenBy,
                baselineMetricLabel,
                baselineValue,
                scoringVersion,
            } = supportActionData;

            // NEW: Guard against out-of-bounds shares
            if (
                baselineMetricLabel?.endsWith('share') &&
                (baselineValue < 0 || baselineValue > 100)
            ) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: `Invalid baselineValue for share metric: ${baselineValue}` })
                };
            }

            const ref = await db
                .collection('farms').doc(fid)
                .collection('supplier_support_actions')
                .add({
                    supplierId: supId,
                    weakness,
                    supportType,
                    notes: notes || '',
                    assignedTo: assignedTo || '',
                    givenBy: givenBy || 'unknown',
                    givenAt: Date.now(),
                    status: 'OPEN',
                    baselineMetricLabel,
                    baselineValue,
                    scoringVersion,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, id: ref.id }),
            };
        }

        if (action === 'updateSupportActionStatus') {
            const { supportActionId, newStatus } = params;

            if (!supportActionId || !['OPEN', 'DONE'].includes(newStatus)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Missing supportActionId or invalid newStatus' })
                };
            }

            await db
                .collection('farms').doc(fid)
                .collection('supplier_support_actions')
                .doc(supportActionId)
                .update({
                    status: newStatus,
                    updatedAt: Date.now(),
                });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true }),
            };
        }

        if (action === 'updateSupportActionStatus') {
            await db.collection('farms').doc(fid).collection('supplier_support_actions').doc(supportActionId).update({
                status: newStatus,
                updatedAt: Date.now(),
            });
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action' }),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};