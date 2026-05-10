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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { action, farmId, blockId, expenseId, taskId } = event.queryStringParameters || {};

        if (action === 'getPhotos') {
            const fid = farmId || '1';
            let allPhotos: any[] = [];

            if (blockId) {
                // Query subcollection: farms/{farmId}/blocks/{blockId}/photos
                const photosRef = db
                    .collection('farms').doc(fid)
                    .collection('blocks').doc(blockId)
                    .collection('photos');
                const snapshot = await photosRef.orderBy('takenAt', 'desc').get();
                allPhotos = snapshot.docs.map(doc => ({ id: doc.data().id, ...doc.data() }));
            } else if (expenseId) {
                // Query subcollection: farms/{farmId}/expenses/{expenseId}/photos
                const photosRef = db
                    .collection('farms').doc(fid)
                    .collection('expenses').doc(expenseId)
                    .collection('photos');
                const snapshot = await photosRef.orderBy('takenAt', 'desc').get();
                allPhotos = snapshot.docs.map(doc => ({ id: doc.data().id, ...doc.data() }));
            } else if (taskId) {
                // Query subcollection: farms/{farmId}/tasks/{taskId}/photos
                const photosRef = db
                    .collection('farms').doc(fid)
                    .collection('tasks').doc(taskId)
                    .collection('photos');
                const snapshot = await photosRef.orderBy('takenAt', 'desc').get();
                allPhotos = snapshot.docs.map(doc => ({ id: doc.data().id, ...doc.data() }));
            } else {
                // Fetch all photos across all blocks
                const blocksSnapshot = await db
                    .collection('farms').doc(fid)
                    .collection('blocks').get();

                for (const blockDoc of blocksSnapshot.docs) {
                    const photosSnapshot = await db
                        .collection('farms').doc(fid)
                        .collection('blocks').doc(blockDoc.id)
                        .collection('photos')
                        .orderBy('takenAt', 'desc').get();

                    const blockPhotos = photosSnapshot.docs.map(doc => ({
                        id: doc.data().id,
                        blockId: parseInt(blockDoc.id),
                        ...doc.data(),
                    }));
                    allPhotos.push(...blockPhotos);
                }
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ photos: allPhotos }),
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