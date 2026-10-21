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
    allowedMasterBatchIds: string[];
    isActive: boolean;
}

async function getBuyerRecord(fid: string, uid: string): Promise<BuyerRecord | null> {
    let snapshot = await db.collection('farms').doc(fid).collection('buyers').where('uid', '==', uid).where('isActive', '==', true).limit(1).get();

    if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as any;
        return {
            id: doc.id, uid: data.uid, email: data.email, companyName: data.companyName,
            contactPerson: data.contactPerson,
            allowedBatchIds: data.allowedBatchIds || [],
            allowedMasterBatchIds: data.allowedMasterBatchIds || [],
            isActive: data.isActive,
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
                    contactPerson: data.contactPerson,
                    allowedBatchIds: data.allowedBatchIds || [],
                    allowedMasterBatchIds: data.allowedMasterBatchIds || [],
                    isActive: data.isActive,
                };
            }
        }
    } catch (err) {
        console.warn('Email lookup failed:', err);
    }
    return null;
}

// ── Helper: find another buyer that already owns a given batch / master ──
async function findBuyerOwner(
    fid: string,
    id: string,
    kind: 'batch' | 'master',
    excludeBuyerId: string
): Promise<{ id: string; companyName: string; viaMaster?: string } | null> {
    // 1. Direct ownership on the same field
    const directField = kind === 'master' ? 'allowedMasterBatchIds' : 'allowedBatchIds';
    const direct = await db
        .collection('farms').doc(fid)
        .collection('buyers')
        .where(directField, 'array-contains', id)
        .limit(5)
        .get();
    for (const doc of direct.docs) {
        if (doc.id === excludeBuyerId) continue;
        const data = doc.data();
        return { id: doc.id, companyName: data.companyName || 'another buyer' };
    }

    // 2. If we're checking a batch, also check whether it lives inside
    //    some other buyer's bulk shipment.
    if (kind === 'batch') {
        // Find every master that contains this batch as a child
        // (search is done in-memory since batchNumbers is a JSON string).
        const mastersSnap = await db
            .collection('farms').doc(fid)
            .collection('master_traceability')
            .get();
        const parentMasters: string[] = [];
        mastersSnap.docs.forEach(m => {
            const children = parseMasterBatchNumbers(m.data().batchNumbers);
            if (children.includes(id)) parentMasters.push(m.data().masterBatchNumber);
        });

        if (parentMasters.length > 0) {
            const ownersSnap = await db
                .collection('farms').doc(fid)
                .collection('buyers')
                .where('allowedMasterBatchIds', 'array-contains-any', parentMasters.slice(0, 10))
                .limit(5)
                .get();
            for (const doc of ownersSnap.docs) {
                if (doc.id === excludeBuyerId) continue;
                const data = doc.data();
                return {
                    id: doc.id,
                    companyName: data.companyName || 'another buyer',
                    viaMaster: parentMasters[0],
                };
            }
        }
    }

    return null;
}

// ── Helper: check if the viewer is an admin (reuses users/{uid}.role) ──
const ADMIN_ROLES = new Set(['OWNER', 'MANAGER']);

async function isAdmin(uid: string): Promise<boolean> {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) return false;
    const role = userDoc.data()?.role;
    return typeof role === 'string' && ADMIN_ROLES.has(role);
}

// ── Helper: get child batch numbers for a given master batch number ──
async function getMasterChildBatches(fid: string, masterBatchNumber: string): Promise<string[]> {
    const snap = await db
        .collection('farms').doc(fid)
        .collection('master_traceability')
        .where('masterBatchNumber', '==', masterBatchNumber)
        .limit(1)
        .get();
    if (snap.empty) return [];
    return parseMasterBatchNumbers(snap.docs[0].data().batchNumbers);
}

// ── Helper: generate a buyer document ID ───────────────────
function generateBuyerId(): string {
    const ts = Date.now();
    const rand = Math.random().toString(36).substring(2, 8);
    return `buyer_${ts}_${rand}`;
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

function parseMasterBatchNumbers(raw: any): string[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(String(raw)); } catch { return []; }
}

// ── Shared batch enrichment (used by single-batch and bulk paths) ──
async function enrichBatches(fid: string, batchNumbers: string[]): Promise<any[]> {
    if (batchNumbers.length === 0) return [];

    const chunks: string[][] = [];
    for (let i = 0; i < batchNumbers.length; i += 10) {
        chunks.push(batchNumbers.slice(i, i + 10));
    }

    const rawBatches: any[] = [];
    const rawTraces: any[] = [];
    const rawRevenues: any[] = [];

    for (const chunk of chunks) {
        const [bSnap, tSnap, rSnap] = await Promise.all([
            db.collection('farms').doc(fid).collection('quality_batches').where('batchNumber', 'in', chunk).get(),
            db.collection('farms').doc(fid).collection('batch_traceability').where('batchNumber', 'in', chunk).get(),
            db.collection('farms').doc(fid).collection('revenues').where('batchNumber', 'in', chunk).get(),
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

    const enriched = rawBatches.map(b => {
        const trace = traceByBatch.get(b.batchNumber);
        const revenue = revenueByBatch.get(b.batchNumber);
        const supplier = supplierMap.get(b.supplierId);
        const testResults = parseTestResults(b);
        const docs = parseDocuments(trace);
        const inspected = isBatchInspected(b);

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

            farmLocation: supplier?.location || "Odienné, Côte d'Ivoire",
            block: b.blockId ? `Block ${b.blockId}` : null,
            latitude: supplier?.latitude || 9.51,
            longitude: supplier?.longitude || -7.5692,
            destination: trace?.destination || null,
            destinationCountry: extractCountry(trace?.destination),
            buyer: trace?.buyer || revenue?.buyer || null,

            processingInfo: `${b.sourceType?.replace(/_/g, ' ')} · ${b.qualityGrade}`,
            processingFacility: trace?.processingFacility || 'AfriNuts NDC (Nuts Distribution Center)',
            processingLocation: trace?.processingLocation || "Odienné, Côte d'Ivoire",
            processingMethod: trace?.processingMethod || 'Steam roasting (100% chemical-free)',
            shellingMethod: trace?.shellingMethod || 'Semi-automated',
            gradingMethod: trace?.gradingMethod || 'Manual inspection + electronic sorting',
            yieldPercentage: trace?.yieldPercentage || null,

            qualityScore: inspected ? b.qualityScore : null,
            moistureContent: inspected ? b.moistureContent : null,
            defectiveRate: inspected ? b.defectiveRate : null,
            kernelRatio: inspected ? b.kernelRatio : null,
            nutCount: inspected ? b.nutCountPerKg : null,
            overallScore: inspected ? Math.round((b.qualityScore ?? 0) * 10) / 10 : null,
            testResults: inspected ? { aflatoxin: testResults.aflatoxin ?? null, heavyMetals: testResults.heavyMetals ?? null, pesticideResidue: testResults.pesticideResidue ?? null } : null,

            rawWeightKg: b.weightKg || null,
            kernelWeightKg: revenue?.quantityKg || null,

            supplier: supplier ? {
                id: supplier.id,
                type: supplier.type?.replace(/_/g, ' ') || 'Independent',
                farmSize: supplier.farmSize ? `${supplier.farmSize} ha` : 'N/A',
                farmOsStatus: 'Active',
                season: '2026',
                traceLevel: 'Block-Level Verified',
                cooperative: supplier.type === 'COOPERATIVE' ? supplier.name : 'AfriNuts Network',
            } : null,

            documents: {
                coo: docs.certificateOfOrigin || docs.coo || docs.qualityCertificate || null,
                phyto: docs.phytosanitary || docs.phyto || null,
                billOfLading: docs.billOfLading || null,
                packingList: docs.packingList || null,
                invoice: docs.commercialInvoice || docs.invoice || null,
                insurance: docs.insurance || null,
                compliancePack: '/documents/compliance-pack.pdf',
            },

            digitalSignature: verificationCode ? {
                code: verificationCode,
                signature: `FOS-SIG-${verificationCode.toLowerCase()}`,
                signedDate: sigTimestamp ? new Date(sigTimestamp).toLocaleString() : null,
            } : null,

            sustainability: {
                noChildLabor: b.noChildLabor || false,
                farmOsMonitored: b.farmOsMonitored || false,
                firebreak: b.firebreakProtection || false,
                sustainableHarvesting: b.sustainableHarvesting || false,
            },

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

            farmOsMetadata: {
                recordId: `FOS-${b.batchNumber}`,
                created: new Date(b.createdAt).toLocaleDateString(),
                lastUpdated: new Date(b.updatedAt).toLocaleDateString(),
                verificationStatus: b.verifiedAt ? 'Verified' : 'Pending',
            },

            certifications: trace?.certificationIds ? String(trace.certificationIds).split(',').map((c: string) => c.trim()).filter(Boolean) : [],
        };
    });

    enriched.sort((a, b) => new Date(b.processingDate).getTime() - new Date(a.processingDate).getTime());
    return enriched;
}

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    try {
        const fid = '1';
        const viewerUid = await getViewerUid(event);
        if (!viewerUid) return { statusCode: 401, headers, body: JSON.stringify({ error: 'unauthenticated' }) };

        const query = event.queryStringParameters || {};
        const action = query.action;

        // ── ADMIN ACTIONS: gate on users/{uid}.role, do NOT require a buyer record ──
        const adminActions = [
            'admin_listBuyers',
            'admin_createBuyer',
            'admin_updateBuyer',
            'admin_deleteBuyer',
            'admin_assignBatches',
            'admin_listBatches',
            'admin_listMasterBatches',
            'admin_listAssignments',
        ];

        if (adminActions.includes(action || '')) {
            const adminOk = await isAdmin(viewerUid);
            if (!adminOk) {
                return { statusCode: 403, headers, body: JSON.stringify({ error: 'not_authorized' }) };
            }

            // ── Action: list all buyers (admin only) ───────────────
            if (action === 'admin_listBuyers') {
                const snapshot = await db
                    .collection('farms').doc(fid)
                    .collection('buyers')
                    .orderBy('createdAt', 'desc')
                    .get();

                const buyers = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const masterIds: string[] = data.allowedMasterBatchIds || [];
                    return {
                        id: doc.id,
                        email: data.email,
                        companyName: data.companyName,
                        contactPerson: data.contactPerson,
                        allowedBatchIds: data.allowedBatchIds || [],
                        allowedBatchCount: (data.allowedBatchIds || []).length,
                        allowedMasterBatchIds: masterIds,
                        allowedMasterCount: masterIds.length,
                        isActive: data.isActive !== false,
                        uid: data.uid || null,
                        createdAt: data.createdAt,
                        lastLoginAt: data.lastLoginAt || null,
                    };
                });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ buyers }),
                };
            }

            // ── Action: create new buyer (admin only) ──────────────
            if (action === 'admin_createBuyer') {
                if (event.httpMethod !== 'POST') {
                    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
                }

                const body = JSON.parse(event.body || '{}');
                const { email, companyName, contactPerson, allowedBatchIds, allowedMasterBatchIds } = body;

                if (!email || !companyName) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'email and companyName are required' }),
                    };
                }

                const existing = await db
                    .collection('farms').doc(fid)
                    .collection('buyers')
                    .where('email', '==', email.trim().toLowerCase())
                    .limit(1)
                    .get();

                if (!existing.empty) {
                    return {
                        statusCode: 409,
                        headers,
                        body: JSON.stringify({ error: 'buyer_with_email_exists' }),
                    };
                }

                const buyerId = generateBuyerId();
                await db
                    .collection('farms').doc(fid)
                    .collection('buyers')
                    .doc(buyerId)
                    .set({
                        uid: '',
                        email: email.trim().toLowerCase(),
                        companyName: companyName.trim(),
                        contactPerson: (contactPerson || '').trim(),
                        allowedBatchIds: Array.isArray(allowedBatchIds) ? allowedBatchIds : [],
                        allowedMasterBatchIds: Array.isArray(allowedMasterBatchIds) ? allowedMasterBatchIds : [],
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        lastLoginAt: null,
                        createdBy: viewerUid,
                    });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ id: buyerId, success: true }),
                };
            }

            // ── Action: update buyer (admin only) ──────────────────
            if (action === 'admin_updateBuyer') {
                if (event.httpMethod !== 'POST') {
                    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
                }

                const body = JSON.parse(event.body || '{}');
                const { buyerId, companyName, contactPerson, isActive, allowedMasterBatchIds } = body;

                if (!buyerId) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'buyerId is required' }),
                    };
                }

                const updates: Record<string, any> = {};
                if (companyName !== undefined) updates.companyName = companyName.trim();
                if (contactPerson !== undefined) updates.contactPerson = contactPerson.trim();
                if (isActive !== undefined) updates.isActive = !!isActive;
                if (allowedMasterBatchIds !== undefined && Array.isArray(allowedMasterBatchIds)) {
                    updates.allowedMasterBatchIds = allowedMasterBatchIds;
                }

                if (Object.keys(updates).length === 0) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'no_updates' }),
                    };
                }

                await db
                    .collection('farms').doc(fid)
                    .collection('buyers')
                    .doc(buyerId)
                    .update(updates);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true }),
                };
            }

            // ── Action: assign or remove batches / master batches (admin only) ──
            if (action === 'admin_assignBatches') {
                if (event.httpMethod !== 'POST') {
                    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
                }

                const body = JSON.parse(event.body || '{}');
                const { buyerId, batchIds, mode } = body;
                const kind: 'batch' | 'master' = body.kind === 'master' ? 'master' : 'batch';
                // mode: 'add' | 'remove' | 'set'

                if (!buyerId || !Array.isArray(batchIds)) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'buyerId and batchIds[] are required' }),
                    };
                }

                const buyerRef = db
                    .collection('farms').doc(fid)
                    .collection('buyers')
                    .doc(buyerId);

                const buyerDoc = await buyerRef.get();
                if (!buyerDoc.exists) {
                    return { statusCode: 404, headers, body: JSON.stringify({ error: 'buyer_not_found' }) };
                }

                // ── Exclusivity: batch/master can only belong to one buyer ──
                if (mode === 'add') {
                    for (const id of batchIds as string[]) {
                        const owner = await findBuyerOwner(fid, id, kind, buyerId);
                        if (owner) {
                            return {
                                statusCode: 409,
                                headers,
                                body: JSON.stringify({
                                    error: 'already_assigned_to_other_buyer',
                                    hint: owner.viaMaster
                                        ? `Batch ${id} is part of bulk shipment ${owner.viaMaster} already assigned to ${owner.companyName}.`
                                        : kind === 'master'
                                            ? `Bulk shipment ${id} is already assigned to ${owner.companyName}.`
                                            : `Batch ${id} is already assigned to ${owner.companyName}.`,
                                    batchId: id,
                                    ownerBuyerId: owner.id,
                                    ownerCompanyName: owner.companyName,
                                    viaMaster: owner.viaMaster || null,
                                }),
                            };
                        }
                    }
                }

                // Prevent mixing individual batches with master shipments on the same buyer
                const otherField = kind === 'master' ? 'allowedBatchIds' : 'allowedMasterBatchIds';
                const otherCurrent: string[] = buyerDoc.data()?.[otherField] || [];
                if (mode === 'add' && otherCurrent.length > 0) {
                    return {
                        statusCode: 409,
                        headers,
                        body: JSON.stringify({
                            error: 'buyer_already_has_other_kind',
                            hint: `Buyer already has ${otherCurrent.length} ${otherField}. Remove those first.`,
                        }),
                    };
                }

                const field = kind === 'master' ? 'allowedMasterBatchIds' : 'allowedBatchIds';
                const current: string[] = buyerDoc.data()?.[field] || [];
                let next: string[];

                if (mode === 'add') {
                    next = Array.from(new Set([...current, ...batchIds]));
                } else if (mode === 'remove') {
                    next = current.filter(id => !batchIds.includes(id));
                } else {
                    next = batchIds;
                }

                await buyerRef.update({ [field]: next });

                const fresh = (await buyerRef.get()).data() || {};
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        kind,
                        allowedBatchIds: fresh.allowedBatchIds || [],
                        allowedMasterBatchIds: fresh.allowedMasterBatchIds || [],
                    }),
                };
            }

            // ── Action: delete buyer (admin only) ──────────────────
            if (action === 'admin_deleteBuyer') {
                if (event.httpMethod !== 'POST') {
                    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
                }

                const body = JSON.parse(event.body || '{}');
                const { buyerId } = body;

                if (!buyerId) {
                    return { statusCode: 400, headers, body: JSON.stringify({ error: 'buyerId is required' }) };
                }

                await db
                    .collection('farms').doc(fid)
                    .collection('buyers')
                    .doc(buyerId)
                    .delete();

                return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
            }

            // ── Action: list all available batches (admin only) ────
            if (action === 'admin_listBatches') {
                const snapshot = await db
                    .collection('farms').doc(fid)
                    .collection('quality_batches')
                    .orderBy('processingDate', 'desc')
                    .limit(100)
                    .get();

                const batches = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        batchId: data.batchNumber,
                        processingDate: data.processingDate,
                        qualityGrade: data.qualityGrade,
                        sourceType: data.sourceType,
                        weightKg: data.weightKg,
                    };
                });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ batches }),
                };
            }

            // ── Action: list master batches / bulk shipments (admin only) ──
            if (action === 'admin_listMasterBatches') {
                const snapshot = await db
                    .collection('farms').doc(fid)
                    .collection('master_traceability')
                    .orderBy('exportDate', 'desc')
                    .limit(100)
                    .get();

                const masters = snapshot.docs.map(doc => {
                    const d = doc.data();
                    const childBatchNumbers = parseMasterBatchNumbers(d.batchNumbers);
                    return {
                        id: doc.id,
                        masterBatchNumber: d.masterBatchNumber,
                        shipmentName: d.shipmentName || null,
                        buyer: d.buyer || null,
                        destination: d.destination || null,
                        exportDate: d.exportDate || null,
                        totalBatches: d.totalBatches || childBatchNumbers.length,
                        totalWeightKg: d.totalWeightKg || 0,
                        grades: d.grades || null,
                        batchNumbers: childBatchNumbers,
                        traceabilityUrl: d.traceabilityUrl || null,
                    };
                });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ masters }),
                };
            }

            // ── Action: assignment ownership map (admin only) ──────
            if (action === 'admin_listAssignments') {
                const [buyersSnap, mastersSnap] = await Promise.all([
                    db.collection('farms').doc(fid).collection('buyers').get(),
                    db.collection('farms').doc(fid).collection('master_traceability').get(),
                ]);

                const batchOwners: Record<string, string> = {};
                const masterOwners: Record<string, string> = {};

                buyersSnap.docs.forEach(doc => {
                    const d = doc.data();
                    (d.allowedBatchIds || []).forEach((b: string) => { batchOwners[b] = d.companyName || 'Buyer'; });
                    (d.allowedMasterBatchIds || []).forEach((m: string) => { masterOwners[m] = d.companyName || 'Buyer'; });
                });

                // childBatchNumber → parent masterBatchNumber (used by the UI to gray out
                // batches that are already inside someone's bulk shipment)
                const childToMaster: Record<string, string> = {};
                mastersSnap.docs.forEach(doc => {
                    const d = doc.data();
                    const children = parseMasterBatchNumbers(d.batchNumbers);
                    children.forEach(c => { childToMaster[c] = d.masterBatchNumber; });
                });

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ batchOwners, masterOwners, childToMaster }),
                };
            }

            return { statusCode: 400, headers, body: JSON.stringify({ error: 'unknown_admin_action' }) };
        }

        // ── BUYER ACTIONS: require a buyer record ──────────────────
        const buyer = await getBuyerRecord(fid, viewerUid);
        if (!buyer) return { statusCode: 403, headers, body: JSON.stringify({ error: 'not_a_buyer' }) };

        if (!action || action === 'me') {
            return {
                statusCode: 200, headers,
                body: JSON.stringify({
                    buyer: {
                        id: buyer.id,
                        email: buyer.email,
                        companyName: buyer.companyName,
                        contactPerson: buyer.contactPerson,
                        allowedBatchCount: (buyer.allowedBatchIds || []).length,
                        allowedMasterCount: (buyer.allowedMasterBatchIds || []).length,
                    },
                }),
            };
        }

        if (action === 'myBatches') {
            const allowedBatchIds: string[] = buyer.allowedBatchIds || [];
            const allowedMasterBatchIds: string[] = buyer.allowedMasterBatchIds || [];

            // ── Bulk path: exactly one master assigned, no individual batches ──
            if (allowedMasterBatchIds.length === 1 && allowedBatchIds.length === 0) {
                const masterSnap = await db
                    .collection('farms').doc(fid)
                    .collection('master_traceability')
                    .where('masterBatchNumber', '==', allowedMasterBatchIds[0])
                    .limit(1)
                    .get();

                if (!masterSnap.empty) {
                    const masterData = masterSnap.docs[0].data();
                    const childBatchNumbers = parseMasterBatchNumbers(masterData.batchNumbers);
                    const enriched = await enrichBatches(fid, childBatchNumbers);

                    return {
                        statusCode: 200, headers,
                        body: JSON.stringify({
                            isBulk: true,
                            masterBatch: {
                                masterBatchNumber: masterData.masterBatchNumber,
                                shipmentName: masterData.shipmentName || null,
                                buyer: masterData.buyer || null,
                                destination: masterData.destination || null,
                                totalBatches: masterData.totalBatches || childBatchNumbers.length,
                                totalWeightKg: masterData.totalWeightKg || 0,
                                grades: masterData.grades || null,
                                exportDate: masterData.exportDate || null,
                            },
                            buyer: { companyName: buyer.companyName, contactPerson: buyer.contactPerson },
                            batches: enriched,
                        }),
                    };
                }
            }

            // ── Single-batch path (unchanged) ──
            if (allowedBatchIds.length === 0) {
                return {
                    statusCode: 200, headers,
                    body: JSON.stringify({
                        buyer: { companyName: buyer.companyName, contactPerson: buyer.contactPerson },
                        batches: [],
                    }),
                };
            }

            const enriched = await enrichBatches(fid, allowedBatchIds);

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