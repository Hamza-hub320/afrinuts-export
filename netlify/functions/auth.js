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

// Helper to get IP address from request
const getClientIp = (event) => {
    // Check for Cloudflare-Forwarded-For header (if using Cloudflare)
    const cfConnectingIp = event.headers?.['cf-connecting-ip'];
    if (cfConnectingIp) return cfConnectingIp;

    // Check for X-Forwarded-For header
    const forwardedFor = event.headers?.['x-forwarded-for'];
    if (forwardedFor) {
        // Get the first IP from the list
        return forwardedFor.split(',')[0].trim();
    }

    // Fallback to remote address
    const remoteAddress = event.requestContext?.http?.sourceIp ||
        event.requestContext?.identity?.sourceIp ||
        event.headers?.['x-real-ip'];
    if (remoteAddress) return remoteAddress;

    return 'Unknown';
};

// Helper to get device info from User-Agent
const getDeviceInfo = (userAgent) => {
    if (!userAgent) return 'Unknown';

    // Parse User-Agent for device/browser info
    let device = 'Unknown';
    let os = 'Unknown';
    let browser = 'Unknown';

    // OS detection
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS X')) os = 'macOS';
    else if (userAgent.includes('Linux') && !userAgent.includes('Android')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) os = 'iOS';

    // Browser detection
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    device = `${browser}/${os}`;
    return device;
};

// Helper to get current timestamp
const getTimestamp = () => Date.now();

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
            const userRef = db.collection('users').doc(data.localId);
            const userDoc = await userRef.get();
            const userData = userDoc.data() || {};

            // ✅ UPDATE FIRESTORE WITH LOGIN TRACKING INFO
            const now = getTimestamp();
            const clientIp = getClientIp(event);
            const userAgent = event.headers?.['user-agent'] || '';
            const deviceInfo = getDeviceInfo(userAgent);

            const updateData = {
                lastLoginAt: now,
                lastLoginIp: clientIp,
                lastLoginDevice: deviceInfo,
                lastUpdatedAt: now,
                updatedAt: now,
                emailVerified: true, // Set to true on successful login
                // Preserve existing fields if they exist
                ...(userData.bio !== undefined && { bio: userData.bio }),
                ...(userData.company !== undefined && { company: userData.company }),
                ...(userData.title !== undefined && { title: userData.title }),
            };

            await userRef.set(updateData, { merge: true });
            console.log(`✅ Updated login tracking for user: ${data.localId} at ${new Date(now).toISOString()}`);

            // Fetch updated user data after update
            const updatedDoc = await userRef.get();
            const updatedData = updatedDoc.data() || {};

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
                        role: updatedData.role || 'INVESTOR',
                        name: updatedData.name || '',
                        lastLoginAt: updatedData.lastLoginAt || null,
                        lastLoginIp: updatedData.lastLoginIp || null,
                        lastLoginDevice: updatedData.lastLoginDevice || null,
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