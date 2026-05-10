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
        // Support both GET (query params) and POST (body)
        let params: any = {};
        if (event.httpMethod === 'GET') {
            params = event.queryStringParameters || {};
        } else if (event.httpMethod === 'POST') {
            params = JSON.parse(event.body || '{}');
        }

        const { action, farmId, blockId, expenseId, taskId } = params;
        const fid = farmId || '1';
        let allPhotos: any[] = [];

        if (action === 'getPhotos') {
            // Query root-level photos collection
            const rootPhotosSnapshot = await db
                .collection('farms').doc(fid)
                .collection('photos')
                .get();

            const rootPhotos = rootPhotosSnapshot.docs.map(doc => ({
                id: doc.data().id,
                ...doc.data(),
            }));
            allPhotos.push(...rootPhotos);

            // Query block subcollection photos
            if (blockId) {
                const blockPhotosSnapshot = await db
                    .collection('farms').doc(fid)
                    .collection('blocks').doc(String(blockId))
                    .collection('photos')
                    .orderBy('takenAt', 'desc')
                    .get();

                const blockPhotos = blockPhotosSnapshot.docs.map(doc => ({
                    id: doc.data().id,
                    blockId: parseInt(String(blockId)),
                    ...doc.data(),
                }));
                allPhotos.push(...blockPhotos);
            } else {
                const blocksSnapshot = await db
                    .collection('farms').doc(fid)
                    .collection('blocks')
                    .get();

                for (const blockDoc of blocksSnapshot.docs) {
                    const photosSnapshot = await db
                        .collection('farms').doc(fid)
                        .collection('blocks').doc(blockDoc.id)
                        .collection('photos')
                        .orderBy('takenAt', 'desc')
                        .get();

                    const blockPhotos = photosSnapshot.docs.map(doc => ({
                        id: doc.data().id,
                        blockId: parseInt(blockDoc.id),
                        ...doc.data(),
                    }));
                    allPhotos.push(...blockPhotos);
                }
            }

            if (blockId) {
                allPhotos = allPhotos.filter(p => p.blockId === parseInt(String(blockId)));
            }
            if (expenseId) {
                allPhotos = allPhotos.filter(p => p.expenseId === parseInt(String(expenseId)));
            }
            if (taskId) {
                allPhotos = allPhotos.filter(p => p.taskId === parseInt(String(taskId)));
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