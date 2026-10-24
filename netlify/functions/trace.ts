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
// RATE LIMITING (Upstash Redis)
// ============================================================
// Add to Netlify env:
//   UPSTASH_REDIS_URL   = https://xxx.upstash.io
//   UPSTASH_REDIS_TOKEN = xxx
// Free tier: 10,000 commands/day — plenty for a public trace page.
//
// If unset, rate limiting is skipped (dev-friendly).
// ============================================================

const RATE_LIMIT_MAX = 30;      // 30 requests
const RATE_LIMIT_WINDOW = 60;   // per 60 seconds, per IP

async function checkRateLimit(ip: string): Promise<{ ok: boolean; remaining?: number }> {
    const url = process.env.UPSTASH_REDIS_URL;
    const token = process.env.UPSTASH_REDIS_TOKEN;
    if (!url || !token) return { ok: true }; // skip if not configured

    const key = `rl:trace:${ip}`;
    try {
        const res = await fetch(`${url}/pipeline`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                ['INCR', key],
                ['EXPIRE', key, RATE_LIMIT_WINDOW],
            ]),
        });
        if (!res.ok) return { ok: true }; // fail-open
        const data = await res.json();
        const count = data?.[0]?.result ?? 0;
        return { ok: count <= RATE_LIMIT_MAX, remaining: Math.max(0, RATE_LIMIT_MAX - count) };
    } catch {
        return { ok: true }; // fail-open: never break the API because Redis is down
    }
}

// ============================================================
// LOGGING
// ============================================================

function log(level: 'info' | 'warn' | 'error', event: string, data: Record<string, any> = {}) {
    const payload = { ts: new Date().toISOString(), level, event, ...data };
    if (level === 'error') console.error(JSON.stringify(payload));
    else if (level === 'warn') console.warn(JSON.stringify(payload));
    else console.info(JSON.stringify(payload));
}

function requestId(event: HandlerEvent): string {
    // Netlify sets `x-nf-request-id`; fall back to a short random ID
    return (event.headers['x-nf-request-id'] as string) || Math.random().toString(36).slice(2, 10);
}

// ============================================================
// DATA FETCHING (unchanged)
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
// HELPERS (unchanged)
// ============================================================

function extractCountry(destination: string | undefined | null): string | null {
    if (!destination) return null;
    const parts = destination.split(',').map(p => p.trim()).filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}

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

function isBatchInspected(batchData: any): boolean {
    return (batchData.qualityScore ?? 0) > 0
        || (batchData.moistureContent ?? 0) > 0
        || (batchData.defectiveRate ?? 0) > 0
        || (batchData.kernelRatio ?? 0) > 0;
}

// ============================================================
// PUBLIC VIEW MAPPER (unchanged)
// ============================================================

function mapToPublicBatch(batchData: any, supplier: any, traceability: any) {
    const inspected = isBatchInspected(batchData);

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
        originCountry: "Côte d'Ivoire",
        originRegion: 'Odienné',
        sourceType: batchData.sourceType,
        processingDate: new Date(batchData.processingDate).toISOString(),
        qualityGrade: batchData.qualityGrade,
        isInspected: inspected,
        certifications: traceability?.certificationIds
            ? String(traceability.certificationIds).split(',').map((c: string) => c.trim()).filter(Boolean)
            : [],
        destinationCountry: extractCountry(traceability?.destination),
        status,
        weightClass: batchData.weightKg
            ? `~${Math.round(batchData.weightKg / 1000)}T`
            : null,
        hasDigitalSignature: !!(traceability?.verificationCode || batchData.verificationCode),
        isDemo: batchData.isDemo === true,
    };
}

// ============================================================
// PRIVATE VIEW MAPPER (unchanged)
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
        destination: traceability?.destination || null,
        buyer: traceability?.buyer || revenues[0]?.buyer || null,
        farmLocation: supplier?.location || "Odienné, Côte d'Ivoire",
        block: batchData.blockId ? `Block ${batchData.blockId}` : null,
        latitude: supplier?.latitude ?? null,
        longitude: supplier?.longitude ?? null,
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
        processingInfo: `${batchData.sourceType?.replace(/_/g, ' ')} · ${batchData.qualityGrade}`,
        processingMethod: traceability?.processingMethod || 'Steam roasting (100% chemical-free)',
        processingFacility:
            traceability?.processingFacility || 'AfriNuts NDC (Nuts Distribution Center)',
        processingLocation: traceability?.processingLocation || "Odienné, Côte d'Ivoire",
        shellingMethod: traceability?.shellingMethod || 'Semi-automated',
        gradingMethod: traceability?.gradingMethod || 'Manual inspection + electronic sorting',
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
        rawWeightKg: batchData.weightKg || null,
        kernelWeightKg: revenues[0]?.quantityKg || null,
        yieldPercentage:
            batchData.weightKg && revenues[0]?.quantityKg
                ? (revenues[0].quantityKg / batchData.weightKg) * 100
                : traceability?.yieldPercentage || null,
        pricePerKg: revenues[0]?.pricePerKg || null,
        totalAmount: revenues[0]?.totalAmount || null,
        documents: {
            coo: docs.certificateOfOrigin || docs.coo || docs.qualityCertificate || null,
            phyto: docs.phytosanitary || docs.phyto || null,
            billOfLading: docs.billOfLading || null,
            packingList: docs.packingList || null,
            invoice: docs.commercialInvoice || docs.invoice || null,
            insurance: docs.insurance || null,
            compliancePack: '/documents/compliance-pack.pdf',
        },
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
        sustainability: {
            noChildLabor: batchData.noChildLabor || false,
            farmOsMonitored: batchData.farmOsMonitored || false,
            firebreak: batchData.firebreakProtection || false,
            sustainableHarvesting: batchData.sustainableHarvesting || false,
        },
        farmOsMetadata: {
            recordId: `FOS-${batchData.batchNumber}`,
            created: new Date(batchData.createdAt).toLocaleDateString(),
            lastUpdated: new Date(batchData.updatedAt).toLocaleDateString(),
            verificationStatus: batchData.verifiedAt ? 'Verified' : 'Pending',
        },
        sourceType: batchData.sourceType,
        supplierId: batchData.supplierId,
        slug: batchData.batchNumber?.toLowerCase(),
    };
}

// ============================================================
// AUTHENTICATION (unchanged)
// ============================================================

async function getViewerUid(event: HandlerEvent): Promise<string | null> {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return null;

    try {
        const { getAuth } = await import('firebase-admin/auth');
        const token = authHeader.replace('Bearer ', '');
        const decoded = await getAuth().verifyIdToken(token);
        return decoded.uid;
    } catch (err) {
        log('warn', 'invalid_token', { err: String(err) });
        return null;
    }
}

async function isViewerAuthorizedForBatch(
    fid: string,
    viewerUid: string,
    batchNumber: string,
    batchData: any
): Promise<boolean> {
    const buyerIds: string[] = batchData.buyerIds || [];
    if (buyerIds.includes(viewerUid)) return true;

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
        log('warn', 'buyer_lookup_failed', { err: String(err) });
    }

    return false;
}

/**
 * New helper: check whether a viewer is authorized for a MASTER (bulk)
 * shipment — based on the buyer record's allowedMasterBatchIds, NOT
 * per-child batch ownership. This matches the admin assignment model.
 */
async function isViewerAuthorizedForMaster(
    fid: string,
    viewerUid: string,
    masterBatchNumber: string
): Promise<boolean> {
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
            const allowedMasterBatchIds: string[] = buyerData.allowedMasterBatchIds || [];
            if (allowedMasterBatchIds.includes(masterBatchNumber)) return true;
        }
    } catch (err) {
        log('warn', 'buyer_master_lookup_failed', { err: String(err) });
    }
    return false;
}

// ============================================================
// HANDLER
// ============================================================

export const handler: Handler = async (event: HandlerEvent) => {
    const rid = requestId(event);
    const baseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'X-Request-Id': rid,
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: baseHeaders, body: '' };
    }

    // ── Rate limit (only GET) ─────────────────────────────
    const ip =
        (event.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        (event.headers['client-ip'] as string) ||
        'unknown';

    const rl = await checkRateLimit(ip);
    if (!rl.ok) {
        log('warn', 'rate_limited', { rid, ip });
        return {
            statusCode: 429,
            headers: { ...baseHeaders, 'Retry-After': String(RATE_LIMIT_WINDOW) },
            body: JSON.stringify({ error: 'rate_limited', message: 'Too many requests. Try again shortly.' }),
        };
    }

    try {
        const query = event.queryStringParameters || {};
        const batchId = query.batchId;
        const fid = '1';

        const viewerUid = await getViewerUid(event);

        // ── Case: no batchId → reject (no public index) ────────────
        if (!batchId || batchId.trim() === '') {
            return {
                statusCode: 400,
                headers: { ...baseHeaders, 'Cache-Control': 'no-store' },
                body: JSON.stringify({
                    error: 'batch_id_required',
                    message: 'A batchId query parameter is required to fetch traceability data.',
                }),
            };
        }

        // ── Case: master (bulk) ───────────────────────────
        // IMPORTANT: query directly by masterBatchNumber instead of loading
        // the whole collection. This is what was slow at scale.
        const masterSnap = await db
            .collection('farms').doc(fid)
            .collection('master_traceability')
            .where('masterBatchNumber', '==', batchId)
            .limit(1)
            .get();

        if (!masterSnap.empty) {
            const masterData = { id: masterSnap.docs[0].id, ...masterSnap.docs[0].data() } as any;

            const batchNumbers: string[] = typeof masterData.batchNumbers === 'string'
                ? JSON.parse(masterData.batchNumbers)
                : masterData.batchNumbers || [];

            const batchDetails = await Promise.all(
                batchNumbers.map((bn: string) => fetchBatchDetails(fid, bn))
            );
            const validDetails = batchDetails.filter(Boolean) as any[];

            // ── Authorize via the master doc, not per-child ──
            let isAuthorized = false;
            if (viewerUid) {
                isAuthorized = await isViewerAuthorizedForMaster(fid, viewerUid, batchId);
            }

            const batches = validDetails.map(d =>
                isAuthorized
                    ? mapToPrivateBatch(d.batchData, d.supplier, d.traceability, d.revenues)
                    : mapToPublicBatch(d.batchData, d.supplier, d.traceability)
            );

            const farmers = isAuthorized
                ? batches
                    .map((b: any) => b.farmer)
                    .filter((f: any, i: number, arr: any[]) =>
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
                    sustainableHarvesting: batches.every((b: any) => b.sustainability?.sustainableHarvesting),
                }
                : null;

            log('info', 'master_resolved', {
                rid, masterBatchNumber: batchId, view: isAuthorized ? 'private' : 'public',
                childBatches: validDetails.length,
            });

            return {
                statusCode: 200,
                headers: {
                    ...baseHeaders,
                    'Cache-Control': isAuthorized
                        ? 'private, no-store'
                        : 'public, max-age=300, s-maxage=600',
                },
                body: JSON.stringify({
                    isBulk: true,
                    view: isAuthorized ? 'private' : 'public',
                    masterBatch: {
                        id: masterData.id,
                        masterBatchNumber: masterData.masterBatchNumber,
                        shipmentName: masterData.shipmentName,
                        buyer: isAuthorized ? masterData.buyer : null,
                        destination: isAuthorized ? masterData.destination : null,
                        destinationCountry: extractCountry(masterData.destination),
                        exportDate: masterData.exportDate,
                        totalBatches: masterData.totalBatches,
                        totalWeightKg: masterData.totalWeightKg,
                        grades: masterData.grades,
                        traceabilityUrl: masterData.traceabilityUrl,
                        isDemo: masterData.isDemo === true,
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

        // ── Case: single batch ────────────────────────────
        const detail = await fetchBatchDetails(fid, batchId);
        if (!detail) {
            log('info', 'batch_not_found', { rid, batchId });
            return {
                statusCode: 200,
                headers: { ...baseHeaders, 'Cache-Control': 'public, max-age=60' },
                body: JSON.stringify({ batch: null }),
            };
        }

        let isAuthorized = false;
        if (viewerUid) {
            isAuthorized = await isViewerAuthorizedForBatch(
                fid, viewerUid, detail.batchData.batchNumber, detail.batchData
            );
        }

        log('info', 'batch_resolved', {
            rid, batchId, view: isAuthorized ? 'private' : 'public',
        });

        if (isAuthorized) {
            return {
                statusCode: 200,
                headers: { ...baseHeaders, 'Cache-Control': 'private, no-store' },
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
            return {
                statusCode: 200,
                headers: { ...baseHeaders, 'Cache-Control': 'public, max-age=300, s-maxage=600' },
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
        log('error', 'handler_exception', { rid, err: error?.message, stack: error?.stack });
        return {
            statusCode: 500,
            headers: baseHeaders,
            body: JSON.stringify({ error: 'internal_error', rid }),
        };
    }
};