const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Verify authentication token from Authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, error: 'Unauthorized' }),
        };
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { action, farmId, entity, entityId } = JSON.parse(event.body);

        // Get user role
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const userRole = userDoc.data()?.role || 'INVESTOR';

        // Role-based access control
        if (action === 'getFarmSummary') {
            const farmDoc = await db.collection('farms').doc(farmId || '1').get();
            const blocksSnapshot = await db.collection('farms').doc(farmId || '1').collection('blocks').get();

            const blocks = [];
            blocksSnapshot.forEach(doc => blocks.push({ id: doc.id, ...doc.data() }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    farm: farmDoc.data(),
                    stats: {
                        totalBlocks: blocks.length,
                        plantedBlocks: blocks.filter(b => b.status === 'PLANTED').length,
                        totalTrees: blocks.length * 100,
                        aliveTrees: blocks.reduce((sum, b) => sum + (b.survivalRate || 0), 0),
                    },
                }),
            };
        }

        // Owner/Manager only endpoints
        if (action === 'getRevenueSummary' && (userRole === 'OWNER' || userRole === 'MANAGER' || userRole === 'INVESTOR')) {
            const revenuesSnapshot = await db.collection('farms').doc(farmId || '1').collection('revenues').get();
            const revenues = [];
            revenuesSnapshot.forEach(doc => revenues.push({ id: doc.id, ...doc.data() }));

            const totalRevenue = revenues.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    revenues,
                    totalRevenue,
                }),
            };
        }

        // Owner/Manager only endpoints
        if (action === 'getExpenseSummary' && (userRole === 'OWNER' || userRole === 'MANAGER')) {
            const expensesSnapshot = await db.collection('farms').doc(farmId || '1').collection('expenses').get();
            const expenses = [];
            expensesSnapshot.forEach(doc => expenses.push({ id: doc.id, ...doc.data() }));

            const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    expenses,
                    totalExpenses,
                }),
            };
        }

        return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ success: false, error: 'Insufficient permissions' }),
        };
    } catch (error) {
        console.error('FarmData function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};