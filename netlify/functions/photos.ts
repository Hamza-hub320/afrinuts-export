import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (only once)
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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { action, farmId, blockId, expenseId, taskId } = event.queryStringParameters || {};

        if (action === 'getPhotos') {
            let query = db.collection('photos').where('farmId', '==', farmId || '1');

            if (blockId) query = query.where('blockId', '==', parseInt(blockId));
            if (expenseId) query = query.where('expenseId', '==', parseInt(expenseId));
            if (taskId) query = query.where('taskId', '==', parseInt(taskId));

            const snapshot = await query.orderBy('takenAt', 'desc').get();
            const photos = snapshot.docs.map(doc => ({
                id: doc.data().id,
                ...doc.data(),
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ photos }),
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