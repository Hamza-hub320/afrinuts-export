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

        if (action === 'getSuppliersWithTrust') {
            const suppliersSnap = await db.collection('farms').doc(fid).collection('suppliers').get();
            const batchesSnap = await db.collection('farms').doc(fid).collection('quality_batches').get();

            // NEW: fetch validated commitments and inspections
            const commitmentsSnap = await db.collection('farms').doc(fid)
                .collection('supplier_commitments')
                .where('validatedAt', '!=', null)
                .get();
            const inspectionsSnap = await db.collection('farms').doc(fid)
                .collection('supplier_inspections')
                .where('validatedAt', '!=', null)
                .get();

            const suppliers = suppliersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const batches = batchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const commitments = commitmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const inspections = inspectionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            const batchesBySupplier: Record<string, any[]> = {};
            batches.forEach((b: any) => {
                if (b.supplierId != null) {
                    const key = String(b.supplierId);
                    (batchesBySupplier[key] = batchesBySupplier[key] || []).push(b);
                }
            });

            const commitmentsBySupplier: Record<string, any[]> = {};
            commitments.forEach((c: any) => {
                if (c.supplierId != null) {
                    const key = String(c.supplierId);
                    (commitmentsBySupplier[key] = commitmentsBySupplier[key] || []).push(c);
                }
            });

            const inspectionsBySupplier: Record<string, any[]> = {};
            inspections.forEach((i: any) => {
                if (i.supplierId != null) {
                    const key = String(i.supplierId);
                    (inspectionsBySupplier[key] = inspectionsBySupplier[key] || []).push(i);
                }
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    suppliers,
                    batchesBySupplier,
                    commitmentsBySupplier,
                    inspectionsBySupplier,
                }),
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