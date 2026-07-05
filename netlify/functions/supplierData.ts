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