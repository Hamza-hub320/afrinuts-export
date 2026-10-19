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

// ============================================================
// DATA FETCHING
// ============================================================

async function fetchBatchDetails(fid: string, batchNumber: string) {
    const batchSnapshot = await db
        .collection('farms').doc(fid)
        .collection('quality_batches')
        .where('batchNumber', '==', batchNumber)
        .limit(1)
        .get();

    if (batchSnapshot.empty) return null;

    const batchDoc = batchSnapshot.docs[0];
    const batchData = { id: batchDoc.id, ...batchDoc.data() } as any;

    let supplier: any = null;
    if (batchData.supplierId) {
        const supplierDoc = await db
            .collection('farms').doc(fid)
            .collection('suppliers')
            .doc(String(batchData.supplierId))
            .get();
        if (supplierDoc.exists) {
            supplier = { id: supplierDoc.id, ...supplierDoc.data() };
        }
    }

    const traceSnapshot = await db
        .collection('farms').doc(fid)
        .collection('batch_traceability')
        .where('batchNumber', '==', batchNumber)
        .limit(1)
        .get();
    let traceability: any = null;
    if (!traceSnapshot.empty) {
        const traceDoc = traceSnapshot.docs[0];
        traceability = { id: traceDoc.id, ...traceDoc.data() };
    }

    const revSnapshot = await db
        .collection('farms').doc(fid)
        .collection('revenues')
        .where('batchNumber', '==', batchNumber)
        .limit(1)
        .get();
    const revenues = revSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

    return { batchData, supplier, traceability, revenues };
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Extract country from a destination string.
 * "Rotterdam, Netherlands" → "Netherlands"
 * "Oman" → "Oman"
 */
function extractCountry(destination: string | undefined | null): string | null {
    if (!destination) return null;
    const parts = destination.split(',').map(p => p.trim()).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}

/**
 * Safely parse the documents JSON string/object from traceability.
 */
function parseDocuments(traceability: any): Record<string, any> {
    if (!traceability?.documents) return {};
    try {
        return typeof traceability.documents === 'string'
            ? JSON.parse(traceability.documents)
            : traceability.documents || {};
    } catch {
        return {};
    }
}

/**
 * Parse test results JSON from the batch.
 */
function parseTestResults(batchData: any): Record<string, any> {
    if (!batchData.testResults) return {};
    try {
        return typeof batchData.testResults === 'string'
            ? JSON.parse(batchData.testResults)
            : batchData.testResults || {};
    } catch {
        return {};
    }
}

/**
 * Determine if a batch has been quality-inspected.
 * A batch is inspected when it has a positive quality score OR
 * any real moisture/defect/kernel measurements.
 */
function isBatchInspected(batchData: any): boolean {
    return (batchData.qualityScore ?? 0) > 0
        || (batchData.moistureContent ?? 0) > 0
        || (batchData.defectiveRate ?? 0) > 0
        || (batchData.kernelRatio ?? 0) > 0;
}

// ============================================================
// PUBLIC VIEW MAPPER
// Safe for anyone with the batch ID. No buyer, no farmer, no
// lab results, no documents, no exact weights, no prices.
// ============================================================

function mapToPublicBatch(batchData: any, supplier: any, traceability: any) {
    const inspected = isBatchInspected(batchData);

    // Status is a public, high-level indicator
    let status: string;
    if (!inspected) {
        status = 'RECEIVED';
    } else if (traceability) {
        status = 'SHIPPED';
    } else {
        status = 'QUALITY_VERIFIED';
    }

    return {
        id: batchData.id,
        batchId: batchData.batchNumber,

        // Origin — country and region only, never exact GPS
        originCountry: "Côte d'Ivoire",
        originRegion: 'Odienné',

        // Batch metadata already printed on the bag
        sourceType: batchData.sourceType,
        processingDate: new Date(batchData.processingDate).toISOString(),

        // Quality grade only (grade is stamped on bags anyway)
        qualityGrade: batchData.qualityGrade,
        isInspected: inspected,

        // Certifications — already stamped on bags
        certifications: traceability?.certificationIds
            ? String(traceability.certificationIds).split(',').map((c: string) => c.trim()).filter(Boolean)
            : [],

        // Destination country only — never the full address
        destinationCountry: extractCountry(traceability?.destination),

        // High-level status
        status,

        // Rough weight class — rounded, never exact
        weightClass: batchData.weightKg
            ? `~${Math.round(batchData.weightKg / 1000)}T`
            : null,

        // Existence of a digital signature only — never the code
        hasDigitalSignature: !!(traceability?.verificationCode || batchData.verificationCode),
    };
}

// ============================================================
// PRIVATE VIEW MAPPER
// Only returned when the requesting user is authorized.
// Includes everything: buyer, farmer, quality metrics, lab
// results, documents, financials, full signature.
// ============================================================

function mapToPrivateBatch(
    batchData: any,
    supplier: any,
    traceability: any,
    revenues: any[]
) {
    const publicData = mapToPublicBatch(batchData, supplier, traceability);
    const testResults = parseTestResults(batchData);
    const docs = parseDocuments(traceability);
    const inspected = isBatchInspected(batchData);

    const verificationCode = traceability?.verificationCode || batchData.verificationCode || null;
    const sigTimestamp = traceability?.updatedAt || traceability?.createdAt || batchData.updatedAt;

    return {
        ...publicData,

        // ── Buyer & destination (exact) ────────────────────────
        destination: traceability?.destination || null,
        buyer: traceability?.buyer || revenues[0]?.buyer || null,

        // ── Exact farm location ────────────────────────────────
        farmLocation: supplier?.location || "Odienné, Côte d'Ivoire",
        block: batchData.blockId ? `Block ${batchData.blockId}` : null,
        latitude: supplier?.latitude ?? null,
        longitude: supplier?.longitude ?? null,

        // ── Farmer profile ─────────────────────────────────────
        farmer: supplier
            ? {
                id: supplier.id,
                name: supplier.contactPerson,
                role: supplier.type?.replace(/_/g, ' ') || 'Farmer',
                photo: supplier.photoUrl || '',
                yearsFarming: `${supplier.yearsFarming || 0}+ years`,
                location: supplier.location || 'Odienné',
                bio: supplier.bio || 'Dedicated cashew farmer in the Odienné region.',
                quote: supplier.quote || null,
            }
            : null,

        // ── Supplier details ───────────────────────────────────
        supplier: supplier
            ? {
                id: supplier.id,
                type: supplier.type?.replace(/_/g, ' ') || 'Independent',
                farmSize: supplier.farmSize ? `${supplier.farmSize} ha` : 'N/A',
                farmOsStatus: 'Active',
                season: '2026',
                traceLevel: 'Block-Level Verified',
                cooperative:
                    supplier.type === 'COOPERATIVE' ? supplier.name : 'AfriNuts Network',
            }
            : null,

        // ── Processing info ────────────────────────────────────
        processingInfo: `${batchData.sourceType?.replace(/_/g, ' ')} · ${batchData.qualityGrade}`,
        processingMethod: traceability?.processingMethod || 'Steam roasting (100% chemical-free)',
        processingFacility:
            traceability?.processingFacility || 'AfriNuts NDC (Nuts Distribution Center)',
        processingLocation: traceability?.processingLocation || "Odienné, Côte d'Ivoire",
        shellingMethod: traceability?.shellingMethod || 'Semi-automated',
        gradingMethod: traceability?.gradingMethod || 'Manual inspection + electronic sorting',

        // ── Quality metrics (only when inspected) ──────────────
        qualityScore: inspected ? batchData.qualityScore : null,
        moistureContent: inspected ? batchData.moistureContent : null,
        defectiveRate: inspected ? batchData.defectiveRate : null,
        kernelRatio: inspected ? batchData.kernelRatio : null,
        nutCount: inspected ? batchData.nutCountPerKg : null,
        overallScore: inspected ? Math.round((batchData.qualityScore ?? 0) * 10) / 10 : null,

        testResults: inspected
            ? {
                aflatoxin: testResults.aflatoxin ?? null,
                heavyMetals: testResults.heavyMetals ?? null,
                pesticideResidue: testResults.pesticideResidue ?? null,
            }
            : null,

        // ── Exact weights ──────────────────────────────────────
        rawWeightKg: batchData.weightKg || null,
        kernelWeightKg: revenues[0]?.quantityKg || null,
        yieldPercentage:
            batchData.weightKg && revenues[0]?.quantityKg
                ? (revenues[0].quantityKg / batchData.weightKg) * 100
                : traceability?.yieldPercentage || null,

        // ── Financials ─────────────────────────────────────────
        pricePerKg: revenues[0]?.pricePerKg || null,
        totalAmount: revenues[0]?.totalAmount || null,

        // ── Export documents ───────────────────────────────────
        documents: {
            coo: docs.certificateOfOrigin || docs.coo || docs.qualityCertificate || null,
            phyto: docs.phytosanitary || docs.phyto || null,
            billOfLading: docs.billOfLading || null,
            packingList: docs.packingList || null,
            invoice: docs.commercialInvoice || docs.invoice || null,
            insurance: docs.insurance || null,
            compliancePack: '/documents/compliance-pack.pdf',
        },

        // ── Digital signature (full) ───────────────────────────
        verificationCode,
        digitalSignature: verificationCode
            ? {
                code: verificationCode,
                signature: `FOS-SIG-${verificationCode.toLowerCase()}`,
                signedDate: sigTimestamp
                    ? new Date(sigTimestamp).toLocaleString()
                    : null,
            }
            : null,

        // ── Sustainability (detailed) ──────────────────────────
        sustainability: {
            noChildLabor: batchData.noChildLabor || false,
            farmOsMonitored: batchData.farmOsMonitored || false,
            firebreak: batchData.firebreakProtection || false,
            sustainableHarvesting: batchData.sustainableHarvesting || false,
        },

        // ── Farm OS metadata ───────────────────────────────────
        farmOsMetadata: {
            recordId: `FOS-${batchData.batchNumber}`,
            created: new Date(batchData.createdAt).toLocaleDateString(),
            lastUpdated: new Date(batchData.updatedAt).toLocaleDateString(),
            verificationStatus: batchData.verifiedAt ? 'Verified' : 'Pending',
        },

        // ── Source metadata ────────────────────────────────────
        sourceType: batchData.sourceType,
        supplierId: batchData.supplierId,
        slug: batchData.batchNumber?.toLowerCase(),
    };
}

// ============================================================
// AUTHENTICATION
// ============================================================

/**
 * Verify the incoming Authorization header and return the buyer's UID.
 * Returns null if there's no valid token.
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
 * Check if a viewer is authorized to see the full record for a batch.
 *
 * Two authorization paths (checked in order):
 *   1. Batch's buyerIds array contains the viewer's UID
 *   2. Buyers collection has an active buyer whose allowedBatchIds includes this batch
 */
async function isViewerAuthorized(
    fid: string,
    viewerUid: string,
    batchNumber: string,
    batchData: any
): Promise<boolean> {
    // Path 1: batch.buyerIds
    const buyerIds: string[] = batchData.buyerIds || [];
    if (buyerIds.includes(viewerUid)) return true;

    // Path 2: buyers collection
    try {
        const buyerSnapshot = await db
            .collection('farms').doc(fid)
            .collection('buyers')
            .where('uid', '==', viewerUid)
            .where('isActive', '==', true)
            .limit(1)
            .get();

        if (!buyerSnapshot.empty) {
            const buyerData = buyerSnapshot.docs[0].data();
            const allowedBatchIds: string[] = buyerData.allowedBatchIds || [];
            if (allowedBatchIds.includes(batchNumber)) return true;
        }
    } catch (err) {
        console.warn('Buyer lookup failed:', err);
    }

    return false;
}

// ============================================================
// HANDLER
// ============================================================

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
        const query = event.queryStringParameters || {};
        const batchId = query.batchId;
        const fid = '1';

        // ── Get the viewer (may be null) ───────────────────────
        const viewerUid = await getViewerUid(event);

        // ═══════════════════════════════════════════════════════
        // CASE: No batchId → return list of available batch IDs
        // (used by the promo page to show "sample batches")
        // ═══════════════════════════════════════════════════════
        if (!batchId) {
            const [batchesSnapshot, masterSnapshot] = await Promise.all([
                db.collection('farms').doc(fid).collection('quality_batches').limit(20).get(),
                db.collection('farms').doc(fid).collection('master_traceability').limit(10).get(),
            ]);

            const batches = batchesSnapshot.docs.map(doc => ({
                id: doc.id,
                batchId: doc.data().batchNumber,
            }));

            const masterBatches = masterSnapshot.docs.map(doc => ({
                id: doc.id,
                batchId: doc.data().masterBatchNumber,
                isBulk: true,
            }));

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ batches: [...batches, ...masterBatches] }),
            };
        }

        // ═══════════════════════════════════════════════════════
        // CASE: Master (bulk) batch
        // ═══════════════════════════════════════════════════════
        const allMasterSnapshot = await db
            .collection('farms').doc(fid)
            .collection('master_traceability')
            .get();

        const masterDoc = allMasterSnapshot.docs.find(
            doc => doc.data().masterBatchNumber === batchId
        );

        if (masterDoc) {
            const masterData = { id: masterDoc.id, ...masterDoc.data() } as any;

            const batchNumbers: string[] = typeof masterData.batchNumbers === 'string'
                ? JSON.parse(masterData.batchNumbers)
                : masterData.batchNumbers || [];

            const batchDetails = await Promise.all(
                batchNumbers.map((bn: string) => fetchBatchDetails(fid, bn))
            );

            const validDetails = batchDetails.filter(Boolean) as any[];

            // Determine authorization for the bulk shipment:
            // authorized if the viewer is authorized for ALL batches in the shipment.
            let isAuthorized = false;
            if (viewerUid && validDetails.length > 0) {
                const authChecks = await Promise.all(
                    validDetails.map(d =>
                        isViewerAuthorized(fid, viewerUid, d.batchData.batchNumber, d.batchData)
                    )
                );
                isAuthorized = authChecks.every(Boolean);
            }

            // Map each batch with the appropriate mapper
            const batches = validDetails.map(d =>
                isAuthorized
                    ? mapToPrivateBatch(d.batchData, d.supplier, d.traceability, d.revenues)
                    : mapToPublicBatch(d.batchData, d.supplier, d.traceability)
            );

            // Public-safe summaries
            const farmers = isAuthorized
                ? batches
                    .map((b: any) => b.farmer)
                    .filter(
                        (f: any, i: number, arr: any[]) =>
                            f && arr.findIndex((x: any) => x?.id === f.id) === i
                    )
                : null;

            const supplierTypes = isAuthorized
                ? [...new Set(batches.map((b: any) => b.supplier?.type).filter(Boolean))]
                : null;

            const sustainability = isAuthorized
                ? {
                    noChildLabor: batches.every((b: any) => b.sustainability?.noChildLabor),
                    farmOsMonitored: batches.some((b: any) => b.sustainability?.farmOsMonitored),
                    firebreak: batches.every((b: any) => b.sustainability?.firebreak),
                    sustainableHarvesting: batches.every(
                        (b: any) => b.sustainability?.sustainableHarvesting
                    ),
                }
                : null;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    isBulk: true,
                    view: isAuthorized ? 'private' : 'public',
                    masterBatch: {
                        id: masterData.id,
                        masterBatchNumber: masterData.masterBatchNumber,
                        shipmentName: masterData.shipmentName,
                        // Buyer & destination only when authorized
                        buyer: isAuthorized ? masterData.buyer : null,
                        destination: isAuthorized ? masterData.destination : null,
                        destinationCountry: extractCountry(masterData.destination),
                        exportDate: masterData.exportDate,
                        totalBatches: masterData.totalBatches,
                        totalWeightKg: masterData.totalWeightKg,
                        grades: masterData.grades,
                        traceabilityUrl: masterData.traceabilityUrl,
                    },
                    batches,
                    farmers,
                    supplierTypes,
                    sustainability,
                    farmOsMetadata: {
                        recordId: `FOS-MB-${masterData.masterBatchNumber}`,
                        created: new Date(masterData.createdAt).toLocaleDateString(),
                        lastUpdated: new Date(masterData.updatedAt).toLocaleDateString(),
                        verificationStatus: 'Verified',
                    },
                    requiresAuthForFullRecord: !isAuthorized,
                }),
            };
        }

        // ═══════════════════════════════════════════════════════
        // CASE: Single batch
        // ═══════════════════════════════════════════════════════
        const detail = await fetchBatchDetails(fid, batchId);

        if (!detail) {
            // Return a generic 404 for both public and private — never
            // reveal whether a batch exists to an unauthorized viewer.
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ batch: null }),
            };
        }

        // Check authorization
        let isAuthorized = false;
        if (viewerUid) {
            isAuthorized = await isViewerAuthorized(
                fid,
                viewerUid,
                detail.batchData.batchNumber,
                detail.batchData
            );
        }

        if (isAuthorized) {
            // ── Private view ───────────────────────────────────
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    isBulk: false,
                    view: 'private',
                    batch: mapToPrivateBatch(
                        detail.batchData,
                        detail.supplier,
                        detail.traceability,
                        detail.revenues
                    ),
                }),
            };
        } else {
            // ── Public view ────────────────────────────────────
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    isBulk: false,
                    view: 'public',
                    batch: mapToPublicBatch(
                        detail.batchData,
                        detail.supplier,
                        detail.traceability
                    ),
                    requiresAuthForFullRecord: true,
                }),
            };
        }
    } catch (error: any) {
        console.error('Trace handler error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'internal_error' }),
        };
    }
};