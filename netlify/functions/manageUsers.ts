import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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

const auth = getAuth();
const db = getFirestore();

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { action, uid, role } = JSON.parse(event.body || '{}');

        // Verify auth token
        const authHeader = event.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        const decoded = await auth.verifyIdToken(token);

        // listUsers — no role check (route already protected)
        if (action === 'listUsers') {
            const firestoreSnapshot = await db.collection('users').get();
            const firestoreUsers = firestoreSnapshot.docs.map(doc => ({
                uid: doc.id,
                email: doc.data().email || '',
                displayName: doc.data().name || doc.data().displayName || '',
                role: doc.data().role || 'INVESTOR',
                disabled: doc.data().isActive === false,
                lastSignIn: doc.data().lastSignIn || null,
                createdAt: doc.data().createdAt || null,
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ users: firestoreUsers }),
            };
        }

        // Protected actions — require OWNER role from Firestore
        const userDoc = await db.collection('users').doc(decoded.uid).get();
        const userRole = userDoc.exists ? userDoc.data()?.role : null;

        if (userRole !== 'OWNER') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Only owners can manage users' }),
            };
        }

        if (action === 'setRole' && uid && role) {
            await db.collection('users').doc(uid).update({ role });
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        if (action === 'disableUser' && uid) {
            await db.collection('users').doc(uid).update({ isActive: false });
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        if (action === 'enableUser' && uid) {
            await db.collection('users').doc(uid).update({ isActive: true });
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