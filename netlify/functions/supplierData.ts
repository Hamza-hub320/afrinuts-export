import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
            const { collection, docId, userId } = params;

            // Only allow valid collections
            if (!['supplier_commitments', 'supplier_inspections'].includes(collection)) {
                return { statusCode: 400, body: JSON.stringify({ error: 'Invalid collection' }) };
            }

            await db.collection('farms').doc(fid)
                .collection(collection).doc(docId)
                .update({
                    validatedAt: Date.now(),
                    validatedBy: userId,
                    updatedAt: Date.now()
                });

            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        }

        if (action === 'resolveDispute') {
            const { disputeId, resolution, reviewedBy, originalValue, correctedValue } = params;

            if (!disputeId || !['UPHELD', 'REJECTED'].includes(resolution)) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid params' }) };
            }

            await db.collection('farms').doc(fid)
                .collection('supplier_disputes').doc(disputeId)
                .update({
                    reviewStatus: 'RESOLVED',
                    decision: resolution,
                    reviewedBy: reviewedBy || 'portal-user',
                    resolvedDate: Date.now(),
                    correctionApplied: resolution === 'UPHELD',
                    originalValue: originalValue ?? null,
                    correctedValue: correctedValue ?? null,
                    updatedAt: Date.now(),
                });

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
                body: JSON.stringify({ disputes: snap.docs.map(d => ({ id: d.id, ...d.data() })) }),
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

            const suppliers = suppliersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const batches = batchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            const allCommitments = allCommitmentsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
            const allInspections = allInspectionsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

// Split into validated (has a timestamp) and pending (null or missing)
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
                }),
            };
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