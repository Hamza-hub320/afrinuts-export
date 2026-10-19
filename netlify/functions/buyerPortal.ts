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

        // ── Action: list my batches (FULL ENRICHED VERSION) ───
        if (action === 'myBatches') {
            const allowedBatchIds: string[] = buyer.allowedBatchIds || [];

            if (allowedBatchIds.length === 0) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        buyer: { companyName: buyer.companyName, contactPerson: buyer.contactPerson },
                        batches: []
                    }),
                };
            }

            // Chunk for Firestore `in` query limit of 10
            const chunks: string[][] = [];
            for (let i = 0; i < allowedBatchIds.length; i += 10) {
                chunks.push(allowedBatchIds.slice(i, i + 10));
            }

            const rawBatches: any[] = [];
            for (const chunk of chunks) {
                const snapshot = await db
                    .collection('farms').doc(fid)
                    .collection('quality_batches')
                    .where('batchNumber', 'in', chunk)
                    .get();
                snapshot.docs.forEach(doc => rawBatches.push({ id: doc.id, ...doc.data() }));
            }

            // Fetch traceability records
            const rawTraces: any[] = [];
            for (const chunk of chunks) {
                const snapshot = await db
                    .collection('farms').doc(fid)
                    .collection('batch_traceability')
                    .where('batchNumber', 'in', chunk)
                    .get();
                snapshot.docs.forEach(doc => rawTraces.push({ id: doc.id, ...doc.data() }));
            }

            // Fetch revenues (kernel weights)
            const rawRevenues: any[] = [];
            for (const chunk of chunks) {
                const snapshot = await db
                    .collection('farms').doc(fid)
                    .collection('revenues')
                    .where('batchNumber', 'in', chunk)
                    .get();
                snapshot.docs.forEach(doc => rawRevenues.push({ id: doc.id, ...doc.data() }));
            }

            // Fetch suppliers (farmer names)
            const supplierIds = [...new Set(rawBatches.map(b => b.supplierId).filter(Boolean))];
            const supplierMap = new Map<number, any>();
            if (supplierIds.length > 0) {
                const supplierSnapshot = await db.collection('farms').doc(fid).collection('suppliers').get();
                supplierSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.id) supplierMap.set(data.id, data);
                });
            }

            // Merge everything by batchNumber
            const traceByBatch = new Map(rawTraces.map(t => [t.batchNumber, t]));
            const revenueByBatch = new Map(rawRevenues.map(r => [r.batchNumber, r]));

            const enriched = rawBatches.map(b => {
                const trace = traceByBatch.get(b.batchNumber);
                const revenue = revenueByBatch.get(b.batchNumber);
                const supplier = supplierMap.get(b.supplierId);

                // Count documents
                let documentsAvailable = 0;
                let documentsTotal = 6;
                if (trace?.documents) {
                    try {
                        const docs = typeof trace.documents === 'string' ? JSON.parse(trace.documents) : trace.documents;
                        documentsAvailable = Object.values(docs).filter(Boolean).length;
                    } catch { /* ignore */ }
                }

                const inspected = (b.qualityScore ?? 0) > 0;

                return {
                    id: b.id,
                    batchId: b.batchNumber,
                    processingDate: b.processingDate,
                    qualityGrade: b.qualityGrade,
                    sourceType: b.sourceType,
                    weightKg: b.weightKg,
                    isInspected: inspected,
                    hasVerification: !!(trace?.verificationCode || b.verificationCode),
                    verificationCode: trace?.verificationCode || b.verificationCode || null,

                    // Quality metrics
                    qualityScore: inspected ? b.qualityScore : null,
                    moistureContent: inspected ? b.moistureContent : null,
                    defectiveRate: inspected ? b.defectiveRate : null,

                    // Location & buyer
                    destination: trace?.destination || null,
                    destinationCountry: trace?.destination ? trace.destination.split(',').pop()?.trim() : null,
                    buyer: trace?.buyer || revenue?.buyer || null,
                    exportDate: trace?.exportDate || null,

                    // Farmer
                    farmerName: supplier?.contactPerson || null,

                    // Certifications
                    certifications: trace?.certificationIds
                        ? String(trace.certificationIds).split(',').map((c: string) => c.trim()).filter(Boolean)
                        : [],

                    // Weights
                    rawWeightKg: b.weightKg,
                    kernelWeightKg: revenue?.quantityKg || null,

                    // Documents
                    documentsAvailable,
                    documentsTotal,

                    // Status
                    status: trace ? 'SHIPPED' : (inspected ? 'QUALITY_VERIFIED' : 'RECEIVED'),
                };
            });

            enriched.sort((a, b) => (b.processingDate || 0) - (a.processingDate || 0));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    buyer: {
                        companyName: buyer.companyName,
                        contactPerson: buyer.contactPerson,
                    },
                    batches: enriched,
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