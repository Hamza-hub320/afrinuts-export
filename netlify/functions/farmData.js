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

const db = admin.firestore();

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

    // Public data that doesn't require authentication (for LiveFarmStats)
    const { action, farmId } = JSON.parse(event.body || '{}');

    // For public stats (no auth required)
    if (action === 'getPublicFarmStats') {
        try {
            const farmDoc = await db.collection('farms').doc(farmId || '1').get();
            const blocksSnapshot = await db.collection('farms').doc(farmId || '1').collection('blocks').get();

            const blocks = [];
            blocksSnapshot.forEach(doc => blocks.push({ id: doc.id, ...doc.data() }));

            const plantedBlocks = blocks.filter(b => b.status === 'PLANTED').length;
            const aliveTrees = blocks.reduce((sum, b) => sum + (b.survivalRate || 0), 0);

            // Block status distribution for pie chart
            const statusCount = {};
            blocks.forEach(b => {
                statusCount[b.status] = (statusCount[b.status] || 0) + 1;
            });
            const blockStatusDistribution = Object.entries(statusCount).map(([name, value]) => ({ name, value }));


            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    farm: farmDoc.data(),
                    stats: {
                        totalBlocks: blocks.length,
                        plantedBlocks: plantedBlocks,
                        totalTrees: blocks.length * 100,
                        aliveTrees: aliveTrees,
                        survivalRate: (aliveTrees / (blocks.length * 100)) * 100,
                    },
                    blockStatusDistribution,
                }),
            };
        } catch (error) {
            console.error('Public farm stats error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, error: error.message }),
            };
        }
    }

    // For authenticated requests - verify token
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, error: 'Unauthorized - No token provided' }),
        };
    }

    const idToken = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        const userRole = userDoc.data()?.role || 'INVESTOR';

        // Public data accessible by all authenticated users
        if (action === 'getFarmSummary') {
            const farmDoc = await db.collection('farms').doc(farmId || '1').get();
            const blocksSnapshot = await db.collection('farms').doc(farmId || '1').collection('blocks').get();

            const blocks = [];
            blocksSnapshot.forEach(doc => blocks.push({ id: doc.id, ...doc.data() }));

            const plantedBlocks = blocks.filter(b => b.status === 'PLANTED').length;
            const aliveTrees = blocks.reduce((sum, b) => sum + (b.survivalRate || 0), 0);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    farm: farmDoc.data(),
                    stats: {
                        totalBlocks: blocks.length,
                        plantedBlocks: plantedBlocks,
                        totalTrees: blocks.length * 100,
                        aliveTrees: aliveTrees,
                        survivalRate: (aliveTrees / (blocks.length * 100)) * 100,
                    },
                }),
            };
        }

        // Get Tasks - accessible by Owner, Manager, and Investor (read-only)
        if (action === 'getTasks' && (userRole === 'OWNER' || userRole === 'MANAGER')) {
            const tasksSnapshot = await db.collection('farms').doc(farmId || '1').collection('tasks').get();
            const tasks = [];
            tasksSnapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, tasks }),
            };
        }

        // Get Assignments - accessible by Owner, Manager,(read-only)
        if (action === 'getAssignments' && (userRole === 'OWNER' || userRole === 'MANAGER')) {
            try {
                const assignmentsSnapshot = await db.collection('farms')
                    .doc(farmId || '1')
                    .collection('task_assignments')
                    .orderBy('assignedAt', 'desc')
                    .get();

                const assignments = [];
                assignmentsSnapshot.forEach(doc => assignments.push({ id: doc.id, ...doc.data() }));

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true, assignments }),
                };
            } catch (error) {
                // If collection doesn't exist yet, return empty
                console.log('Assignments query error (may not exist yet):', error.message);
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true, assignments: [] }),
                };
            }
        }

        // Get Blocks - accessible by Owner and Manager only
        if (action === 'getBlocks' && (userRole === 'OWNER' || userRole === 'MANAGER')) {
            const blocksSnapshot = await db.collection('farms').doc(farmId || '1').collection('blocks').get();
            const blocks = [];
            blocksSnapshot.forEach(doc => blocks.push({ id: doc.id, ...doc.data() }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, blocks }),
            };
        }

        // Revenue Summary - accessible by all authenticated users (read-only)
        if (action === 'getRevenueSummary' && (userRole === 'OWNER' || userRole === 'MANAGER' || userRole === 'INVESTOR')) {
            const revenuesSnapshot = await db.collection('farms').doc(farmId || '1').collection('revenues').get();
            const revenues = [];
            revenuesSnapshot.forEach(doc => revenues.push({ id: doc.id, ...doc.data() }));

            const totalRevenue = revenues.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, revenues, totalRevenue }),
            };
        }

        // Expense Summary - accessible by Owner and Manager only
        if (action === 'getExpenseSummary' && (userRole === 'OWNER' || userRole === 'MANAGER' || userRole === 'INVESTOR')) {
            const expensesSnapshot = await db.collection('farms').doc(farmId || '1').collection('expenses').get();
            const expenses = [];
            expensesSnapshot.forEach(doc => expenses.push({ id: doc.id, ...doc.data() }));

            const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, expenses, totalExpenses }),
            };
        }

        return {
            statusCode: 403,
            headers,
            body: JSON.stringify({ success: false, error: 'Insufficient permissions for action: ' + action }),
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