import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

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
        const { action, uid, email, password, displayName, role } = JSON.parse(event.body || '{}');

        // Verify admin token
        const authHeader = event.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        const decoded = await auth.verifyIdToken(token);

        // Only owners can manage users
        const userRecord = await auth.getUser(decoded.uid);
        const userRole = userRecord.customClaims?.role;
        if (userRole !== 'OWNER') {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Only owners can manage users' }),
            };
        }

        if (action === 'listUsers') {
            const listResult = await auth.listUsers(100);
            const users = listResult.users.map(u => ({
                uid: u.uid,
                email: u.email,
                displayName: u.displayName,
                role: u.customClaims?.role || 'INVESTOR',
                disabled: u.disabled,
                lastSignIn: u.metadata.lastSignInTime,
                createdAt: u.metadata.creationTime,
            }));
            return { statusCode: 200, headers, body: JSON.stringify({ users }) };
        }

        if (action === 'setRole' && uid && role) {
            await auth.setCustomUserClaims(uid, { role });
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        if (action === 'disableUser' && uid) {
            await auth.updateUser(uid, { disabled: true });
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        if (action === 'enableUser' && uid) {
            await auth.updateUser(uid, { disabled: false });
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