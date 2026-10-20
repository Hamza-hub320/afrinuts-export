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

interface BuyerRecord {
    id: string;
    uid?: string;
    email: string;
    companyName: string;
    contactPerson: string;
    allowedBatchIds: string[];
    isActive: boolean;
}

async function getBuyerRecord(fid: string, uid: string): Promise<BuyerRecord | null> {
    let snapshot = await db.collection('farms').doc(fid).collection('buyers').where('uid', '==', uid).where('isActive', '==', true).limit(1).get();

    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as any;
        return {
            id: doc.id, uid: data.uid, email: data.email, companyName: data.companyName,
            contactPerson: data.contactPerson, allowedBatchIds: data.allowedBatchIds || [], isActive: data.isActive,
        };
    }

    try {
        const { getAuth } = await import('firebase-admin/auth');
        const userRecord = await getAuth().getUser(uid);
        const email = userRecord.email;

        if (email) {
            snapshot = await db.collection('farms').doc(fid).collection('buyers').where('email', '==', email).where('isActive', '==', true).limit(1).get();
            if (!snapshot.empty) {
                const buyerDoc = snapshot.docs[0];
                await buyerDoc.ref.update({ uid, lastLoginAt: new Date().toISOString() });
                const data = buyerDoc.data() as any;
                return {
                    id: buyerDoc.id, uid, email: data.email, companyName: data.companyName,
                    contactPerson: data.contactPerson, allowedBatchIds: data.allowedBatchIds || [], isActive: data.isActive,
                };
            }
        }
    } catch (err) {
        console.warn('Email lookup failed:', err);
    }
    return null;
}

function extractCountry(destination: string | undefined | null): string | null {
    if (!destination) return null;
    const parts = destination.split(',').map(p => p.trim()).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}

function parseDocuments(traceability: any): Record<string, any> {
    if (!traceability?.documents) return {};
    try {
        return typeof traceability.documents === 'string' ? JSON.parse(traceability.documents) : traceability.documents || {};
    } catch { return {}; }
}

function parseTestResults(batchData: any): Record<string, any> {
    if (!batchData.testResults) return {};
    try {
        return typeof batchData.testResults === 'string' ? JSON.parse(batchData.testResults) : batchData.testResults || {};
    } catch { return {}; }
}

function isBatchInspected(batchData: any): boolean {
    return (batchData.qualityScore ?? 0) > 0 || (batchData.moistureContent ?? 0) > 0 || (batchData.defectiveRate ?? 0) > 0 || (batchData.kernelRatio ?? 0) > 0;
}

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    try {
        const fid = '1';
        const viewerUid = await getViewerUid(event);
        if (!viewerUid) return { statusCode: 401, headers, body: JSON.stringify({ error: 'unauthenticated' }) };

        const buyer = await getBuyerRecord(fid, viewerUid);
        if (!buyer) return { statusCode: 403, headers, body: JSON.stringify({ error: 'not_a_buyer' }) };

        const query = event.queryStringParameters || {};
        const action = query.action;

        if (!action || action === 'me') {
            return {
                statusCode: 200, headers,
                body: JSON.stringify({
                    buyer: { id: buyer.id, email: buyer.email, companyName: buyer.companyName, contactPerson: buyer.contactPerson, allowedBatchCount: (buyer.allowedBatchIds || []).length },
                }),
            };
        }

        if (action === 'myBatches') {
            const allowedBatchIds: string[] = buyer.allowedBatchIds || [];

            if (allowedBatchIds.length === 0) {
                return {
                    statusCode: 200, headers,
                    body: JSON.stringify({ buyer: { companyName: buyer.companyName, contactPerson: buyer.contactPerson }, batches: [] }),
                };
            }

            // Chunking for Firestore limit
            const chunks: string[][] = [];
            for (let i = 0; i < allowedBatchIds.length; i += 10) { chunks.push(allowedBatchIds.slice(i, i + 10)); }

            const rawBatches: any[] = [];
            const rawTraces: any[] = [];
            const rawRevenues: any[] = [];

            for (const chunk of chunks) {
                const [bSnap, tSnap, rSnap] = await Promise.all([
                    db.collection('farms').doc(fid).collection('quality_batches').where('batchNumber', 'in', chunk).get(),
                    db.collection('farms').doc(fid).collection('batch_traceability').where('batchNumber', 'in', chunk).get(),
                    db.collection('farms').doc(fid).collection('revenues').where('batchNumber', 'in', chunk).get()
                ]);
                bSnap.docs.forEach(doc => rawBatches.push({ id: doc.id, ...doc.data() }));
                tSnap.docs.forEach(doc => rawTraces.push({ id: doc.id, ...doc.data() }));
                rSnap.docs.forEach(doc => rawRevenues.push({ id: doc.id, ...doc.data() }));
            }

            const supplierIds = [...new Set(rawBatches.map(b => b.supplierId).filter(Boolean))];
            const supplierMap = new Map<number, any>();
            if (supplierIds.length > 0) {
                const supplierSnapshot = await db.collection('farms').doc(fid).collection('suppliers').get();
                supplierSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.id) supplierMap.set(data.id, data);
                });
            }

            const traceByBatch = new Map(rawTraces.map(t => [t.batchNumber, t]));
            const revenueByBatch = new Map(rawRevenues.map(r => [r.batchNumber, r]));

            // Inside your enriched mapping in buyer-portal.ts

            const enriched = rawBatches.map(b => {
                const trace = traceByBatch.get(b.batchNumber);
                const revenue = revenueByBatch.get(b.batchNumber);
                const supplier = supplierMap.get(b.supplierId);
                const testResults = parseTestResults(b);
                const docs = parseDocuments(trace);
                const inspected = isBatchInspected(b);

                // GPS fallback logic
                const latitude = supplier?.latitude ?? supplier?.location?.latitude ?? b.latitude ?? 9.51;
                const longitude = supplier?.longitude ?? supplier?.location?.longitude ?? b.longitude ?? -7.5692;

                const verificationCode = trace?.verificationCode || b.verificationCode || null;
                const sigTimestamp = trace?.updatedAt || trace?.createdAt || b.updatedAt;

                return {
                    id: b.id,
                    batchId: b.batchNumber,
                    processingDate: new Date(b.processingDate).toISOString(),
                    harvestDate: new Date(b.processingDate).toISOString(),
                    qualityGrade: b.qualityGrade,
                    sourceType: b.sourceType,
                    isInspected: inspected,
                    status: trace ? 'SHIPPED' : (inspected ? 'QUALITY_VERIFIED' : 'RECEIVED'),
                    verificationCode,

                    // Location (Now with proper fallback)
                    farmLocation: supplier?.location || "Odienné, Côte d'Ivoire",
                    block: b.blockId ? `Block ${b.blockId}` : null,
                    latitude,
                    longitude,
                    destination: trace?.destination || null,
                    destinationCountry: extractCountry(trace?.destination),
                    buyer: trace?.buyer || revenue?.buyer || null,

                    // Processing
                    processingInfo: `${b.sourceType?.replace(/_/g, ' ')} · ${b.qualityGrade}`,
                    processingFacility: trace?.processingFacility || 'AfriNuts NDC (Nuts Distribution Center)',
                    processingLocation: trace?.processingLocation || "Odienné, Côte d'Ivoire",
                    processingMethod: trace?.processingMethod || 'Steam roasting (100% chemical-free)',
                    shellingMethod: trace?.shellingMethod || 'Semi-automated',
                    gradingMethod: trace?.gradingMethod || 'Manual inspection + electronic sorting',
                    yieldPercentage: trace?.yieldPercentage || null,

                    // Quality
                    qualityScore: inspected ? b.qualityScore : null,
                    moistureContent: inspected ? b.moistureContent : null,
                    defectiveRate: inspected ? b.defectiveRate : null,
                    kernelRatio: inspected ? b.kernelRatio : null,
                    nutCount: inspected ? b.nutCountPerKg : null,
                    overallScore: inspected ? Math.round((b.qualityScore ?? 0) * 10) / 10 : null,
                    testResults: inspected ? { aflatoxin: testResults.aflatoxin ?? null, heavyMetals: testResults.heavyMetals ?? null, pesticideResidue: testResults.pesticideResidue ?? null } : null,

                    // Weights
                    rawWeightKg: b.weightKg || null,
                    kernelWeightKg: revenue?.quantityKg || null,

                    // Documents
                    documents: {
                        coo: docs.certificateOfOrigin || docs.coo || docs.qualityCertificate || null,
                        phyto: docs.phytosanitary || docs.phyto || null,
                        billOfLading: docs.billOfLading || null,
                        packingList: docs.packingList || null,
                        invoice: docs.commercialInvoice || docs.invoice || null,
                        insurance: docs.insurance || null,
                        compliancePack: '/documents/compliance-pack.pdf',
                    },

                    // Digital Signature
                    digitalSignature: verificationCode ? {
                        code: verificationCode,
                        signature: `FOS-SIG-${verificationCode.toLowerCase()}`,
                        signedDate: sigTimestamp ? new Date(sigTimestamp).toLocaleString() : null,
                    } : null,

                    // Sustainability
                    sustainability: {
                        noChildLabor: b.noChildLabor || false,
                        farmOsMonitored: b.farmOsMonitored || false,
                        firebreak: b.firebreakProtection || false,
                        sustainableHarvesting: b.sustainableHarvesting || false,
                    },

                    // Farmer Profile
                    farmer: supplier ? {
                        id: supplier.id,
                        name: supplier.contactPerson,
                        role: supplier.type?.replace(/_/g, ' ') || 'Farmer',
                        photo: supplier.photoUrl || '',
                        yearsFarming: `${supplier.yearsFarming || 0}+ years`,
                        location: supplier.location || 'Odienné',
                        bio: supplier.bio || 'Dedicated cashew farmer in the Odienné region.',
                        quote: supplier.quote || null,
                    } : null,

                    // Farm OS Metadata
                    farmOsMetadata: {
                        recordId: `FOS-${b.batchNumber}`,
                        created: new Date(b.createdAt).toLocaleDateString(),
                        lastUpdated: new Date(b.updatedAt).toLocaleDateString(),
                        verificationStatus: b.verifiedAt ? 'Verified' : 'Pending',
                    },

                    // Certifications
                    certifications: trace?.certificationIds ? String(trace.certificationIds).split(',').map((c: string) => c.trim()).filter(Boolean) : [],
                };
            });

            enriched.sort((a, b) => new Date(b.processingDate).getTime() - new Date(a.processingDate).getTime());

            return {
                statusCode: 200, headers,
                body: JSON.stringify({
                    buyer: { companyName: buyer.companyName, contactPerson: buyer.contactPerson },
                    batches: enriched,
                }),
            };
        }

        return { statusCode: 400, headers, body: JSON.stringify({ error: 'unknown_action' }) };
    } catch (error: any) {
        console.error('Buyer portal error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'internal_error' }) };
    }
};