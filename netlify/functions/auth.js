const admin = require('firebase-admin');

// Initialize Firebase Admin only once
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

// CORS headers for all responses
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async (event, context) => {
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    try {
        const { action, email, password, idToken } = JSON.parse(event.body);

        // Verify user session
        if (action === 'verify') {
            if (!idToken) {
                return { statusCode: 401, headers, body: JSON.stringify({ success: false, error: 'No token provided' }) };
            }

            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const userRecord = await admin.auth().getUser(decodedToken.uid);

            // Fetch user role from Firestore
            const db = admin.firestore();
            const userDoc = await db.collection('users').doc(decodedToken.uid).get();
            const userData = userDoc.data() || {};

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    user: {
                        uid: decodedToken.uid,
                        email: userRecord.email,
                        role: userData.role || 'INVESTOR',
                        name: userData.name || userRecord.displayName,
                    },
                }),
            };
        }

        // Sign in
        if (action === 'signin') {
            if (!email || !password) {
                return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Email and password required' }) };
            }

            // Use Firebase Auth REST API
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.VITE_FIREBASE_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            });

            const data = await response.json();

            if (data.error) {
                return {
                    statusCode: 401,
                    headers,
                    body: JSON.stringify({ success: false, error: data.error.message }),
                };
            }

            // Get user role from Firestore
            const db = admin.firestore();
            const userDoc = await db.collection('users').doc(data.localId).get();
            const userData = userDoc.data() || {};

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    idToken: data.idToken,
                    refreshToken: data.refreshToken,
                    user: {
                        uid: data.localId,
                        email: data.email,
                        role: userData.role || 'INVESTOR',
                        name: userData.name || '',
                    },
                }),
            };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, error: 'Invalid action' }),
        };
    } catch (error) {
        console.error('Auth function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};