import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';

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

// ── Role hierarchy ──────────────────────────────────────────
const ROLE_RANK: Record<string, number> = { OWNER: 2, MANAGER: 1 };

async function getUserProfile(uid: string): Promise<{ role: string; name: string; email?: string } | null> {
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return null;
    const data = doc.data() || {};
    if (typeof data.role !== 'string' || !ROLE_RANK[data.role]) return null;
    return {
        role: data.role,
        name: data.name || data.email || 'Admin',
        email: data.email,
    };
}

async function canApprove(
    approverUid: string,
    requesterUid: string
): Promise<{ ok: boolean; reason?: string }> {
    if (approverUid === requesterUid) {
        return { ok: false, reason: 'cannot_approve_own_request' };
    }
    const approver = await getUserProfile(approverUid);
    const requester = await getUserProfile(requesterUid);
    if (!approver) return { ok: false, reason: 'approver_not_an_admin' };
    if (!requester) return { ok: false, reason: 'requester_not_an_admin' };

    const approverRank = ROLE_RANK[approver.role];
    const requesterRank = ROLE_RANK[requester.role];

    // Strictly higher rank can approve
    if (approverRank > requesterRank) return { ok: true };

    // Same rank: only OWNERs may cross-approve (peer check for C-suite)
    if (approverRank === requesterRank && approver.role === 'OWNER') return { ok: true };

    return {
        ok: false,
        reason:
            approverRank === requesterRank
                ? 'same_role_cannot_approve'
                : 'insufficient_role_to_approve',
    };
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

// ── Email helper (Resend) ─────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'AfriNuts Export <noreply@afrinutsexport.com>';

async function sendBuyerNotification(params: {
    emailBounced: boolean;
    to: string;
    companyName: string;
    contactPerson?: string;
    kind: 'batch' | 'master';
    ids: string[];
    masterSummary?: string;
}): Promise<{ ok: boolean; error?: string }> {
    if (params.emailBounced) {
        console.warn(`Skipping email to bounced buyer: ${params.to}`);
        return { ok: false, error: 'email_bounced' };
    }
    if (!RESEND_API_KEY) {
        console.warn('RESEND_API_KEY missing — skipping buyer notification');
        return { ok: false, error: 'no_api_key' };
    }

    // Generate a sign-in link server-side
    let magicLink = 'https://www.afrinutsexport.com/portal/login';
    try {
        const { getAuth } = await import('firebase-admin/auth');
        magicLink = await getAuth().generateSignInWithEmailLink(params.to, {
            url: 'https://www.afrinutsexport.com/portal/auth/callback?redirect=%2Fportal',
            handleCodeInApp: true,
        });
    } catch (err) {
        console.warn('generateSignInWithEmailLink failed, falling back to /portal/login', err);
    }

    const headline = params.kind === 'master'
        ? `Bulk shipment ${params.masterSummary || params.ids[0]} is now available`
        : `${params.ids.length} new batch${params.ids.length !== 1 ? 'es' : ''} assigned`;

    // Batch chips styled like mini InfoCards
    const idListHtml = params.kind === 'master'
        ? `<div style="margin-top:16px;padding:16px;background:#ffffff;border-radius:12px;border:2px solid #5A7411;text-align:center;box-shadow:0 4px 12px rgba(90,116,17,0.1);">
             <p style="margin:0;color:#5A4D47;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Bulk Shipment</p>
             <p style="margin:6px 0 0;color:#5A7411;font-family:ui-monospace,SFMono-Regular,monospace;font-size:15px;font-weight:700;">${params.masterSummary || params.ids[0]}</p>
           </div>`
        : params.ids.map(id => `
            <div style="margin-top:12px;padding:12px 16px;background:#ffffff;border-radius:12px;border:1px solid #DEDAD4;box-shadow:0 2px 8px rgba(90,77,71,0.05);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-family:ui-monospace,SFMono-Regular,monospace;font-size:13px;color:#5A7411;font-weight:600;">
                    <span style="color:#E04E00;margin-right:8px;">▸</span>${id}
                  </td>
                  <td align="right" style="font-size:11px;font-weight:800;color:#E04E00;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">
                    Assigned
                  </td>
                </tr>
              </table>
            </div>
          `).join('');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { margin: 0; padding: 0; background-color: #F5F5F5; }
                @media (max-width: 600px) {
                    .email-container { padding: 16px !important; }
                    .email-card { border-radius: 16px !important; }
                }
            </style>
        </head>
        <body style="margin:0;padding:0;background-color:#F5F5F5;">
            <!-- Background matching your body gradient -->
            <div class="email-container" style="background: linear-gradient(145deg, #F5F5F5 0%, #DEDAD4 100%); padding:40px 20px;font-family:'Inter',system-ui,-apple-system,sans-serif;">
                
                <!-- Main InfoCard Wrapper -->
                <div class="email-card" style="max-width:540px;margin:0 auto;background: linear-gradient(135deg, rgba(90,116,17,0.05) 0%, rgba(224,78,0,0.05) 100%); border-radius:24px; border:2px solid rgba(90,116,17,0.2); overflow:hidden; box-shadow:0 20px 40px rgba(90,77,71,0.15);">

                     <!-- Header -->
                    <div style="background: rgba(255,255,255,0.4); padding:32px 24px 24px; text-align:center; border-bottom:1px solid rgba(90,116,17,0.1);">
                        
                        <!-- Replaced 'A' with live logo URL -->
                        <img src="https://www.afrinutsexport.com/logo-email.webp" 
                             alt="AfriNuts Export" 
                             width="64" 
                             style="display:inline-block; width:64px; height:auto; margin-bottom:12px; border-radius:8px;" />
                             
                        <h1 style="color:#5A7411;font-size:24px;font-weight:700;margin:0;letter-spacing:-0.5px;font-family:'Playfair Display',serif;">AfriNuts Export</h1>
                        <p style="color:#E04E00;font-size:11px;font-weight:700;margin:6px 0 0;text-transform:uppercase;letter-spacing:2px;">Buyer Portal</p>
                    </div>

                    <!-- Body -->
                    <div style="padding:32px 24px;">
                        <p style="color:#5A4D47;font-size:16px;margin:0 0 20px; font-weight: 500;">
                            Hello <strong style="color:#5A7411;">${params.contactPerson || params.companyName}</strong>,
                        </p>

                        <!-- Status banner (Accent styled) -->
                        <div style="background-color:rgba(224,78,0,0.08); border:1px solid rgba(224,78,0,0.2); border-radius:12px; padding:14px 16px; margin-bottom:20px; box-shadow:inset 0 2px 4px rgba(255,255,255,0.5);">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td width="24" valign="middle" style="font-size:16px;color:#E04E00;">✦</td>
                                    <td style="padding-left:10px;color:#9C3D10;font-size:14px;font-weight:700;line-height:1.4;">
                                        ${headline}
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <p style="color:#5A4D47;font-size:14px;line-height:1.6;margin:0 0 12px;">
                            Assigned to <strong style="color:#5A7411;">${params.companyName}</strong> in your buyer portal.
                        </p>

                        <!-- Batch / bulk chips -->
                        ${idListHtml}

                        <!-- CTA button (Primary gradient) -->
                        <div style="margin-top:32px;text-align:center;">
                            <a href="${magicLink}"
                               style="display:inline-block; background: linear-gradient(90deg, #5A7411, #E04E00); color:#ffffff; text-decoration:none; padding:14px 32px; border-radius:100px; font-weight:700; font-size:15px; box-shadow:0 8px 20px rgba(224,78,0,0.3); letter-spacing:0.5px;">
                                Open Buyer Portal →
                            </a>
                        </div>

                        <p style="color:#8A7C74;font-size:12px;text-align:center;margin-top:28px;line-height:1.6;">
                            This secure link is one-time use and expires in <strong style="color:#5A4D47;">1 hour</strong>.<br/>
                            If you didn't request this, you can safely ignore this email.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background: rgba(255,255,255,0.4); padding:24px; text-align:center; border-top:1px solid rgba(90,116,17,0.1);">
                        <p style="color:#5A4D47;font-size:12px;margin:0 0 8px; font-weight:500;">
                            AfriNuts Export · Odienné, Côte d'Ivoire
                        </p>
                        <p style="margin:0;">
                            <a href="https://www.afrinutsexport.com" style="color:#5A7411;text-decoration:none;font-size:12px;font-weight:700;">www.afrinutsexport.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: params.to,
                subject: params.kind === 'master'
                    ? `✦ Bulk shipment available: ${params.masterSummary?.split('·')[0]?.trim() || params.ids[0]}`
                    : `✦ ${params.ids.length} new batch${params.ids.length !== 1 ? 'es' : ''} assigned to ${params.companyName}`,
                html,
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            console.warn('Resend error:', res.status, text);
            return { ok: false, error: `resend_${res.status}` };
        }
        return { ok: true };
    } catch (err: any) {
        console.warn('sendBuyerNotification failed:', err?.message);
        return { ok: false, error: err?.message || 'unknown' };
    }
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
            'admin_approveAssignment',
            'admin_rejectAssignment',
            'admin_listPendingApprovals',
        ];

        if (adminActions.includes(action || '')) {
            const adminOk = await isAdmin(viewerUid);
            if (!adminOk) {
                return { statusCode: 403, headers, body: JSON.stringify({ error: 'not_authorized' }) };
            }

            if (action === 'admin_approveAssignment') {
                if (event.httpMethod !== 'POST') {
                    return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
                }

                const { buyerId, pendingId } = JSON.parse(event.body || '{}');
                if (!buyerId || !pendingId) {
                    return { statusCode: 400, headers, body: JSON.stringify({ error: 'buyerId and pendingId required' }) };
                }

                const buyerRef = db.collection('farms').doc(fid).collection('buyers').doc(buyerId);
                const buyerDoc = await buyerRef.get();
                if (!buyerDoc.exists) {
                    return { statusCode: 404, headers, body: JSON.stringify({ error: 'buyer_not_found' }) };
                }

                const buyer = buyerDoc.data() || {};
                const pendingList: any[] = buyer.pendingAssignments || [];
                const pending = pendingList.find((p: any) => p.id === pendingId);
                if (!pending) {
                    return { statusCode: 404, headers, body: JSON.stringify({ error: 'pending_not_found' }) };
                }

                // ── Hierarchy check ──
                const gate = await canApprove(viewerUid, pending.requestedBy);
                if (!gate.ok) {
                    return {
                        statusCode: 403,
                        headers,
                        body: JSON.stringify({
                            error: gate.reason,
                            hint:
                                gate.reason === 'cannot_approve_own_request' ? 'A second admin must approve this request.' :
                                    gate.reason === 'same_role_cannot_approve' ? 'Only a senior role (OWNER) can approve this request.' :
                                        gate.reason === 'insufficient_role_to_approve' ? "Your role is below the requester's — only a senior admin can approve." :
                                            'You cannot approve this request.',
                        }),
                    };
                }

                // ── Re-check exclusivity (state may have drifted since request) ──
                for (const id of pending.items as string[]) {
                    const owner = await findBuyerOwner(fid, id, pending.kind, buyerId);
                    if (owner) {
                        return {
                            statusCode: 409,
                            headers,
                            body: JSON.stringify({
                                error: 'already_assigned_to_other_buyer',
                                hint: `${pending.kind === 'master' ? 'Bulk shipment' : 'Batch'} ${id} was assigned to ${owner.companyName} since this request was created.`,
                            }),
                        };
                    }
                }

                // ── Re-check kind-mixing ──
                const field = pending.kind === 'master' ? 'allowedMasterBatchIds' : 'allowedBatchIds';
                const current: string[] = buyer[field] || [];

                // ── Compute next: 'set' replaces, 'add' appends ──
                let next: string[];
                const items = Array.isArray(pending.items) ? pending.items : [];
                if (pending.mode === 'set') {
                    next = items;
                } else {
                    next = Array.from(new Set([...current, ...items]));
                }

                const approver = await getUserProfile(viewerUid);
                const now = new Date().toISOString();


                const auditPayload: Record<string, any> = { pendingId };
                if (pending.kind !== undefined) auditPayload.kind = pending.kind;
                if (pending.items !== undefined) auditPayload.items = pending.items;
                if (pending.mode !== undefined) auditPayload.mode = pending.mode;
                else auditPayload.mode = 'add'; // legacy entries were always 'add' behavior
                if (pending.requestedBy !== undefined) auditPayload.requestedBy = pending.requestedBy;

                await buyerRef.update({
                    [field]: next,
                    pendingAssignments: pendingList.filter((p: any) => p.id !== pendingId),
                    auditTrail: FieldValue.arrayUnion({
                        ts: now,
                        action: 'pending_assign_approved',
                        actor: viewerUid,
                        actorName: approver?.name || 'Admin',
                        actorRole: approver?.role || 'OWNER',
                        payload: auditPayload,
                    }),
                });

                // ── Send email — only about items the buyer didn't already have ──
                const currentSet = new Set(current);
                const newlyAssigned = (pending.items as string[]).filter((id: string) => !currentSet.has(id));

                let notified = false;
                if (newlyAssigned.length > 0 && buyer.email && buyer.emailBounced !== true) {
                    try {
                        let masterSummary: string | undefined;
                        if (pending.kind === 'master') {
                            const mSnap = await db.collection('farms').doc(fid)
                                .collection('master_traceability')
                                .where('masterBatchNumber', '==', newlyAssigned[0])
                                .limit(1).get();
                            if (!mSnap.empty) {
                                const m = mSnap.docs[0].data();
                                masterSummary = `${m.masterBatchNumber} · ${m.totalBatches} batches · ${((m.totalWeightKg||0)/1000).toFixed(1)}T${m.destination ? ` · ${m.destination}` : ''}`;
                            }
                        }
                        const result = await sendBuyerNotification({
                            emailBounced: false,
                            to: buyer.email,
                            companyName: buyer.companyName || 'Buyer',
                            contactPerson: buyer.contactPerson,
                            kind: pending.kind,
                            ids: newlyAssigned,
                            masterSummary,
                        });
                        notified = result.ok;
                    } catch (err) {
                        console.warn('Notification after approval failed (non-fatal):', err);
                    }
                }

                const fresh = (await buyerRef.get()).data() || {};
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        approved: true,
                        notified,
                        allowedBatchIds: fresh.allowedBatchIds || [],
                        allowedMasterBatchIds: fresh.allowedMasterBatchIds || [],
                        emailBounced: fresh.emailBounced === true,
                    }),
                };
            }

            if (action === 'admin_rejectAssignment') {
                if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };

                const { buyerId, pendingId, reason } = JSON.parse(event.body || '{}');
                if (!buyerId || !pendingId) {
                    return { statusCode: 400, headers, body: JSON.stringify({ error: 'buyerId and pendingId required' }) };
                }

                const buyerRef = db.collection('farms').doc(fid).collection('buyers').doc(buyerId);
                const buyerDoc = await buyerRef.get();
                if (!buyerDoc.exists) return { statusCode: 404, headers, body: JSON.stringify({ error: 'buyer_not_found' }) };

                const buyer = buyerDoc.data() || {};
                const pendingList: any[] = buyer.pendingAssignments || [];
                const pending = pendingList.find((p: any) => p.id === pendingId);
                if (!pending) return { statusCode: 404, headers, body: JSON.stringify({ error: 'pending_not_found' }) };

                const gate = await canApprove(viewerUid, pending.requestedBy);
                if (!gate.ok) {
                    return { statusCode: 403, headers, body: JSON.stringify({ error: gate.reason }) };
                }

                const rejecter = await getUserProfile(viewerUid);
                await buyerRef.update({
                    pendingAssignments: pendingList.filter((p: any) => p.id !== pendingId),
                    auditTrail: FieldValue.arrayUnion({
                        ts: new Date().toISOString(),
                        action: 'pending_assign_rejected',
                        actor: viewerUid,
                        actorName: rejecter?.name || 'Admin',
                        actorRole: rejecter?.role || 'OWNER',
                        payload: { pendingId, kind: pending.kind, items: pending.items, reason: reason || null },
                    }),
                });

                return { statusCode: 200, headers, body: JSON.stringify({ success: true, rejected: true }) };
            }

            if (action === 'admin_listPendingApprovals') {
                const snapshot = await db.collection('farms').doc(fid).collection('buyers').get();
                const pending: any[] = [];
                snapshot.docs.forEach(doc => {
                    const d = doc.data();
                    (d.pendingAssignments || []).forEach((p: any) => {
                        if (p.status === 'pending') {
                            pending.push({
                                buyerId: doc.id,
                                buyerName: d.companyName || 'Buyer',
                                ...p,
                            });
                        }
                    });
                });
                pending.sort((a, b) => (b.requestedAt || '').localeCompare(a.requestedAt || ''));
                return { statusCode: 200, headers, body: JSON.stringify({ pending }) };
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
                    const pendingList: any[] = data.pendingAssignments || [];
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
                        emailBounced: data.emailBounced === true,
                        emailBounceType: data.emailBounceType || null,
                        lastBounceAt: data.lastBounceAt || null,
                        pendingCount: pendingList.length,
                        pendingAssignments: pendingList,
                        auditTrail: (data.auditTrail || []).slice(-20),
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
                const { buyerId, companyName, contactPerson, isActive, allowedMasterBatchIds, emailBounced, email } = body;

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

                // Handle email change
                if (email !== undefined) {
                    const cleanEmail = email.trim().toLowerCase();

                    // Check for conflict — another buyer already has this email
                    const existing = await db.collection('farms').doc(fid)
                        .collection('buyers')
                        .where('email', '==', cleanEmail)
                        .get();

                    const hasConflict = existing.docs.some(doc => doc.id !== buyerId);
                    if (hasConflict) {
                        return {
                            statusCode: 409,
                            headers,
                            body: JSON.stringify({
                                error: 'email_already_exists',
                                hint: 'Another buyer already uses this email.',
                            }),
                        };
                    }

                    updates.email = cleanEmail;

                    // Editing the email auto-clears bounce state (unless the caller explicitly sent emailBounced)
                    if (emailBounced === undefined) {
                        updates.emailBounced = false;
                        updates.emailBounceType = null;
                        updates.emailBounceReason = null;
                        updates.lastBounceAt = null;
                    }
                }

                // Handle explicit bounce flag changes (e.g. "Clear bounce flag" button without changing email)
                if (emailBounced !== undefined) {
                    updates.emailBounced = !!emailBounced;
                    if (!emailBounced) {
                        updates.emailBounceType = null;
                        updates.emailBounceReason = null;
                        updates.lastBounceAt = null;
                    }
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

                // ── APPROVAL GATE: mode 'add' creates a pending request, does not apply ──
                if (mode === 'add') {
                    const buyerRef = db.collection('farms').doc(fid).collection('buyers').doc(buyerId);
                    const buyerDoc = await buyerRef.get();
                    if (!buyerDoc.exists) {
                        return { statusCode: 404, headers, body: JSON.stringify({ error: 'buyer_not_found' }) };
                    }

                    // Early validity checks (fail fast so we don't queue impossible requests)
                    for (const id of batchIds as string[]) {
                        const owner = await findBuyerOwner(fid, id, kind, buyerId);
                        if (owner) {
                            return {
                                statusCode: 409,
                                headers,
                                body: JSON.stringify({
                                    error: 'already_assigned_to_other_buyer',
                                    hint: owner.viaMaster
                                        ? `Batch ${id} is part of bulk ${owner.viaMaster} already assigned to ${owner.companyName}.`
                                        : `${kind === 'master' ? 'Bulk shipment' : 'Batch'} ${id} is already assigned to ${owner.companyName}.`,
                                }),
                            };
                        }
                    }

                    // 3. Duplicate pending check  👈 NEW — goes here
                    const existingPending: any[] = buyerDoc.data()?.pendingAssignments || [];
                    const duplicate = existingPending.find((p: any) =>
                        p.kind === kind &&
                        p.mode === mode &&
                        p.items.length === batchIds.length &&
                        p.items.every((existingId: string) => batchIds.includes(existingId))
                    );
                    if (duplicate) {
                        return {
                            statusCode: 409,
                            headers,
                            body: JSON.stringify({
                                error: 'pending_already_exists',
                                hint: 'This exact assignment is already pending approval.',
                                existingPendingId: duplicate.id,
                            }),
                        };
                    }

                    // Create pending entry + audit trail in one write
                    const requester = await getUserProfile(viewerUid);
                    if (!requester) {
                        return { statusCode: 403, headers, body: JSON.stringify({ error: 'not_authorized' }) };
                    }

                    const pendingId = `pa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                    const now = new Date().toISOString();

                    await buyerRef.update({
                        pendingAssignments: FieldValue.arrayUnion({
                            id: pendingId,
                            kind,
                            items: batchIds,
                            requestedBy: viewerUid,
                            requestedByName: requester.name,
                            requestedByRole: requester.role,
                            requestedAt: now,
                            status: 'pending',
                        }),
                        auditTrail: FieldValue.arrayUnion({
                            ts: now,
                            action: 'pending_assign_requested',
                            actor: viewerUid,
                            actorName: requester.name,
                            actorRole: requester.role,
                            payload: { pendingId, kind, items: batchIds },
                        }),
                    });

                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: true,
                            pending: true,
                            pendingId,
                            message: 'Submitted for approval. A senior admin must approve before the buyer is notified.',
                        }),
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

                // Notify buyer of newly assigned shipments (best-effort, non-blocking)
                if (mode === 'add') {
                    const buyerData = buyerDoc.data() || {};
                    const alreadyHad: string[] = buyerData?.[field] || [];
                    const newlyAssigned = (batchIds as string[]).filter(id => !alreadyHad.includes(id));

                    if (newlyAssigned.length > 0 && buyerData.email) {
                        try {
                            let masterSummary: string | undefined;
                            if (kind === 'master') {
                                // Fetch the master doc for a nicer summary
                                const mSnap = await db.collection('farms').doc(fid)
                                    .collection('master_traceability')
                                    .where('masterBatchNumber', '==', newlyAssigned[0])
                                    .limit(1).get();
                                if (!mSnap.empty) {
                                    const m = mSnap.docs[0].data();
                                    masterSummary = `${m.masterBatchNumber} · ${m.totalBatches} batches · ${((m.totalWeightKg||0)/1000).toFixed(1)}T${m.destination ? ` · ${m.destination}` : ''}`;
                                }
                            }
                            await sendBuyerNotification({
                                emailBounced: buyerData.emailBounced === true,
                                to: buyerData.email,
                                companyName: buyerData.companyName || 'Buyer',
                                contactPerson: buyerData.contactPerson,
                                kind,
                                ids: newlyAssigned,
                                masterSummary,
                            });
                        } catch (notifyErr) {
                            // Never fail the assignment because of email
                            console.warn('Buyer notification failed (non-fatal):', notifyErr);
                        }
                    }
                }

                const fresh = (await buyerRef.get()).data() || {};

                let notified = false;
                if (mode === 'add') {
                    const buyerData = buyerDoc.data() || {};
                    const alreadyHad: string[] = buyerData?.[field] || [];
                    const newlyAssigned = (batchIds as string[]).filter(id => !alreadyHad.includes(id));

                    if (newlyAssigned.length > 0 && buyerData.email) {
                        try {
                            let masterSummary: string | undefined;
                            if (kind === 'master') {
                                const mSnap = await db.collection('farms').doc(fid)
                                    .collection('master_traceability')
                                    .where('masterBatchNumber', '==', newlyAssigned[0])
                                    .limit(1).get();
                                if (!mSnap.empty) {
                                    const m = mSnap.docs[0].data();
                                    masterSummary = `${m.masterBatchNumber} · ${m.totalBatches} batches · ${((m.totalWeightKg||0)/1000).toFixed(1)}T${m.destination ? ` · ${m.destination}` : ''}`;
                                }
                            }

                            // This is the only place we call sendBuyerNotification
                            const result = await sendBuyerNotification({
                                emailBounced: buyerData.emailBounced === true,
                                to: buyerData.email,
                                companyName: buyerData.companyName || 'Buyer',
                                contactPerson: buyerData.contactPerson,
                                kind,
                                ids: newlyAssigned,
                                masterSummary,
                            });
                            notified = result.ok;
                        } catch (notifyErr) {
                            console.warn('Buyer notification failed (non-fatal):', notifyErr);
                        }
                    }
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        kind,
                        allowedBatchIds: fresh.allowedBatchIds || [],
                        allowedMasterBatchIds: fresh.allowedMasterBatchIds || [],
                        notified,
                        emailBounced: fresh.emailBounced === true,
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

            // ── Resolve any assigned masters ──
            const masters: any[] = [];
            for (const masterNumber of allowedMasterBatchIds) {
                const masterSnap = await db
                    .collection('farms').doc(fid)
                    .collection('master_traceability')
                    .where('masterBatchNumber', '==', masterNumber)
                    .limit(1)
                    .get();
                if (masterSnap.empty) continue;
                const m = masterSnap.docs[0].data();
                masters.push({
                    masterBatchNumber: m.masterBatchNumber,
                    shipmentName: m.shipmentName || null,
                    buyer: m.buyer || null,
                    destination: m.destination || null,
                    totalBatches: m.totalBatches || parseMasterBatchNumbers(m.batchNumbers).length,
                    totalWeightKg: m.totalWeightKg || 0,
                    grades: m.grades || null,
                    exportDate: m.exportDate || null,
                });
            }

            // ── Enrich individual batches ──
            const enrichedBatches = allowedBatchIds.length > 0
                ? await enrichBatches(fid, allowedBatchIds)
                : [];

            // ── Enrich master children (each master becomes a group) ──
            const mastersWithChildren: any[] = [];
            for (const master of masters) {
                const masterSnap = await db
                    .collection('farms').doc(fid)
                    .collection('master_traceability')
                    .where('masterBatchNumber', '==', master.masterBatchNumber)
                    .limit(1)
                    .get();
                if (masterSnap.empty) continue;
                const childBatchNumbers = parseMasterBatchNumbers(masterSnap.docs[0].data().batchNumbers);
                const children = await enrichBatches(fid, childBatchNumbers);
                mastersWithChildren.push({ ...master, batches: children });
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    buyer: { companyName: buyer.companyName, contactPerson: buyer.contactPerson },
                    // ── New shape: both arrays present, either may be empty ──
                    batches: enrichedBatches,
                    masters: mastersWithChildren,
                    // ── Legacy flags for backward compat with the current buyer dashboard ──
                    isBulk: masters.length > 0 && enrichedBatches.length === 0,
                    masterBatch: masters.length > 0 ? masters[0] : null,
                }),
            };
        }

        return { statusCode: 400, headers, body: JSON.stringify({ error: 'unknown_action' }) };
    } catch (error: any) {
        console.error('Buyer portal error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'internal_error' }) };
    }
};