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

/**
 * Verify the Firebase ID token from the Authorization header.
 * Returns the decoded UID or null.
 */
async function getViewerUid(event: HandlerEvent): Promise<string | null> {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return null;

    try {
        const { getAuth } = await import('firebase-admin/auth');
        const token = authHeader.replace('Bearer ', '');
        const decoded = await getAuth().verifyIdToken(token);
        return decoded.uid;
    } catch (err) {
        console.warn('Invalid auth token:', err);
        return null;
    }
}

/**
 * Find the buyer record for the given UID.
 */
interface BuyerRecord {
    id: string;
    uid?: string;
    email: string;
    companyName: string;
    contactPerson: string;
    allowedBatchIds: string[];
    isActive: boolean;
    createdAt?: any;
    lastLoginAt?: string | null;
}

async function getBuyerRecord(fid: string, uid: string): Promise<BuyerRecord | null> {
    // First try: uid already linked
    let snapshot = await db
        .collection('farms').doc(fid)
        .collection('buyers')
        .where('uid', '==', uid)
        .where('isActive', '==', true)
        .limit(1)
        .get();

    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as any;
        return {
            id: doc.id,
            uid: data.uid,
            email: data.email,
            companyName: data.companyName,
            contactPerson: data.contactPerson,
            allowedBatchIds: data.allowedBatchIds || [],
            isActive: data.isActive,
            createdAt: data.createdAt,
            lastLoginAt: data.lastLoginAt,
        };
    }

    // Fallback: link by email
    try {
        const { getAuth } = await import('firebase-admin/auth');
        const userRecord = await getAuth().getUser(uid);
        const email = userRecord.email;

        if (email) {
            snapshot = await db
                .collection('farms').doc(fid)
                .collection('buyers')
                .where('email', '==', email)
                .where('isActive', '==', true)
                .limit(1)
                .get();

            if (!snapshot.empty) {
                const buyerDoc = snapshot.docs[0];
                await buyerDoc.ref.update({
                    uid,
                    lastLoginAt: new Date().toISOString(),
                });
                const data = buyerDoc.data() as any;
                return {
                    id: buyerDoc.id,
                    uid,
                    email: data.email,
                    companyName: data.companyName,
                    contactPerson: data.contactPerson,
                    allowedBatchIds: data.allowedBatchIds || [],
                    isActive: data.isActive,
                    createdAt: data.createdAt,
                    lastLoginAt: data.lastLoginAt,
                };
            }
        }
    } catch (err) {
        console.warn('Email lookup failed:', err);
    }

    return null;
}

function normalizeStringArray(value: any): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            // Not JSON — treat as single value
            return value.trim() ? [value.trim()] : [];
        }
    }
    return [];
}

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const fid = '1';

        // Require authentication — buyer portal has no public access
        const viewerUid = await getViewerUid(event);
        if (!viewerUid) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'unauthenticated' }),
            };
        }

        // Look up the buyer record
        const buyer = await getBuyerRecord(fid, viewerUid);
        if (!buyer) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'not_a_buyer' }),
            };
        }

        const query = event.queryStringParameters || {};
        const action = query.action;

        // ── Action: get my buyer info ─────────────────────────
        if (!action || action === 'me') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    buyer: {
                        id: buyer.id,
                        email: buyer.email,
                        companyName: buyer.companyName,
                        contactPerson: buyer.contactPerson,
                        allowedBatchCount: (buyer.allowedBatchIds || []).length,
                    },
                }),
            };
        }

        // ── Action: list my batches ───────────────────────────
        if (action === 'myBatches') {
            const allowedBatchIds: string[] = buyer.allowedBatchIds || [];

            if (allowedBatchIds.length === 0) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ buyer: { companyName: buyer.companyName, contactPerson: buyer.contactPerson }, batches: [] }),
                };
            }

            // Chunk for Firestore `in` query limit of 10
            const chunks: string[][] = [];
            for (let i = 0; i < allowedBatchIds.length; i += 10) {
                chunks.push(allowedBatchIds.slice(i, i + 10));
            }

            const allBatches: any[] = [];
            for (const chunk of chunks) {
                const snapshot = await db
                    .collection('farms').doc(fid)
                    .collection('quality_batches')
                    .where('batchNumber', 'in', chunk)
                    .get();

                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    allBatches.push({
                        id: doc.id,
                        batchId: data.batchNumber,
                        processingDate: data.processingDate,
                        qualityGrade: data.qualityGrade,
                        sourceType: data.sourceType,
                        weightKg: data.weightKg,
                        isInspected: (data.qualityScore ?? 0) > 0,
                        hasVerification: !!(data.verificationCode),
                    });
                });
            }

            // Fetch traceability records for these batches to get status
            const traceSnapshot = await db
                .collection('farms').doc(fid)
                .collection('batch_traceability')
                .where('batchNumber', 'in', chunks.length === 1 && chunks[0].length <= 10 ? chunks[0] : []) // simplified
                .get()
                .catch(() => ({ docs: [] as any[] }));

            // Map traceability by batchNumber
            const traceMap = new Map<string, any>();
            if (traceSnapshot.docs) {
                traceSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.batchNumber) traceMap.set(data.batchNumber, data);
                });
            }

            // Sort by processingDate descending
            allBatches.sort((a, b) => (b.processingDate || 0) - (a.processingDate || 0));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    buyer: {
                        companyName: buyer.companyName,
                        contactPerson: buyer.contactPerson,
                    },
                    batches: allBatches.map(b => ({
                        ...b,
                        status: traceMap.get(b.batchId) ? 'SHIPPED' : (b.isInspected ? 'QUALITY_VERIFIED' : 'RECEIVED'),
                    })),
                }),
            };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'unknown_action' }),
        };
    } catch (error: any) {
        console.error('Buyer portal error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'internal_error' }),
        };
    }
};