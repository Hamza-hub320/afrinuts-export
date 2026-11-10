import type { Handler, HandlerEvent } from '@netlify/functions';
import { db } from './_lib/firebase';
import { detectVisibleOpportunities, SupportAction } from './_lib/developmentRules';
import {
    computeTrustScoreServer,
    TrustInput,
    TrustResult,
} from './_lib/trustFormulas';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: corsHeaders, body: '' };
    }

    try {
        let params: any = {};
        if (event.httpMethod === 'GET') {
            params = event.queryStringParameters || {};
        } else if (event.httpMethod === 'POST') {
            params = JSON.parse(event.body || '{}');
        }

        const { action, farmId } = params;
        const fid = farmId || '1';

        if (action === 'getSupplierNetworkSummary') {
            const summary = await buildNetworkSummary(fid);
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify(summary),
            };
        }

        if (action === 'getNetworkMapPoints') {
            const snap = await db.collection('farms').doc(fid).collection('suppliers').get();

            const points: Array<{ id: string; name: string; type: string; lat: number; lng: number }> = [];
            snap.docs.forEach(d => {
                const s: any = d.data();
                const scopes = s.dataConsentScope || [];
                // Consent enforced server-side — the pin never leaves the DB without it
                const locationConsented =
                    s.dataConsentGiven &&
                    !s.dataConsentWithdrawnDate &&
                    scopes.includes('location');
                const hasCoords =
                    s.hasLocation &&
                    typeof s.latitude === 'number' &&
                    typeof s.longitude === 'number' &&
                    s.latitude !== 0 &&
                    s.longitude !== 0;

                if (!locationConsented || !hasCoords) return;

                points.push({
                    id: d.id,
                    name: s.name,
                    type: s.type,
                    lat: s.latitude,
                    lng: s.longitude,
                });
            });

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    points,
                    totalSuppliers: snap.size,
                    shownCount: points.length,
                }),
            };
        }

        // ============================================================
// S2 — listSuppliers
// Computes trust for ALL suppliers, then filters, sorts, slices.
// Sorting before pagination is required for correct page rows.
// ============================================================
        if (action === 'listSuppliers') {
            const {
                search = '',
                type = '',
                sort = 'name',
                page = 1,
                pageSize = 25,
            } = params;

            const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
            const sizeNum = Math.min(200, Math.max(1, parseInt(String(pageSize), 10) || 25));

            const t0 = Date.now();
            const { suppliers, trustBySupplier, batchesBySupplier } = await loadTrustMap(fid);
            const tLoadMap = Date.now() - t0;

            // Computed per-supplier fields the table renders
            const t1 = Date.now();
            const enriched = suppliers.map(s => {
                const trust = trustBySupplier[s.id];
                const supplierBatches = batchesBySupplier[s.id] || [];

                const verifiedBatches = supplierBatches.filter(
                    (b: any) => b.verifiedAt && b.verifiedAt > 0
                );

                const verifiedVolumeKg = verifiedBatches.reduce(
                    (sum: number, b: any) => sum + (b.weightKg || 0),
                    0
                );

                const korValues = verifiedBatches
                    .map((b: any) => b.korGPerKg)
                    .filter((v: any): v is number => typeof v === 'number' && v > 0);
                const avgKorGPerKg = korValues.length > 0
                    ? Number(
                        (korValues.reduce((a: number, b: number) => a + b, 0) / korValues.length)
                            .toFixed(0)
                    )
                    : null;

                return {
                    // Full supplier profile — modal Profile tab needs no extra fetch
                    id: s.id,
                    name: s.name,
                    type: s.type,
                    status: s.status,
                    contactPerson: s.contactPerson,
                    phone: s.phone,
                    email: s.email,
                    location: s.location,
                    region: s.region,
                    country: s.country,
                    latitude: s.latitude,
                    longitude: s.longitude,
                    hasLocation: s.hasLocation,
                    registrationNumber: s.registrationNumber,
                    taxId: s.taxId,
                    farmerIdNumber: s.farmerIdNumber,
                    farmSize: s.farmSize,
                    yearsFarming: s.yearsFarming,
                    isCertified: s.isCertified,
                    certificationType: s.certificationType,
                    certificationNumber: s.certificationNumber,
                    certificationExpiryDate: s.certificationExpiryDate,
                    firebreakProtection: s.firebreakProtection,
                    noChildLabor: s.noChildLabor,
                    sustainableHarvesting: s.sustainableHarvesting,
                    dataConsentGiven: s.dataConsentGiven,
                    dataConsentScope: s.dataConsentScope,
                    dataConsentSignedBy: s.dataConsentSignedBy,
                    dataConsentVersion: s.dataConsentVersion,
                    dataConsentWithdrawnDate: s.dataConsentWithdrawnDate,
                    dataConsentWithdrawnReason: s.dataConsentWithdrawnReason,
                    photoUrl: s.photoUrl,
                    bio: s.bio,
                    quote: s.quote,
                    rating: s.rating,
                    notes: s.notes,
                    isActive: s.isActive ?? s.status === 'ACTIVE',

                    // Computed trust + metrics
                    firestoreId: s.id,
                    overall: trust?.overall ?? null,
                    confidence: trust?.confidence ?? 'preliminary',
                    hasCriticalViolation: trust?.hasCriticalViolation ?? false,
                    verifiedVolumeKg,
                    avgKorGPerKg,
                };
            });

            // Search: name + contactName + location (per approved decision)
            const q = String(search).trim().toLowerCase();
            const searched = q
                ? enriched.filter(r => {
                    const hay = `${r.name || ''} ${r.contactPerson || ''} ${r.location || ''}`.toLowerCase();
                    return hay.includes(q);
                })
                : enriched;

            // Type filter
            const typeFiltered = type
                ? searched.filter(r => r.type === type || r.status === type)
                : searched;

            // Sort BEFORE pagination
            const sorters: Record<string, (a: any, b: any) => number> = {
                name: (a, b) => (a.name || '').localeCompare(b.name || ''),
                trust_desc: (a, b) => (b.overall ?? -1) - (a.overall ?? -1),
                trust_asc: (a, b) => {
                    // null-overall sinks to the bottom even in ascending
                    const av = a.overall ?? 999;
                    const bv = b.overall ?? 999;
                    return av - bv;
                },
                volume_desc: (a, b) => b.verifiedVolumeKg - a.verifiedVolumeKg,
                quality_desc: (a, b) => (b.avgKorGPerKg ?? -1) - (a.avgKorGPerKg ?? -1),
            };
            const sorter = sorters[String(sort)] || sorters.name;
            const sorted = [...typeFiltered].sort(sorter);

            const total = sorted.length;
            const start = (pageNum - 1) * sizeNum;
            const rows = sorted.slice(start, start + sizeNum);
            const tCompute = Date.now() - t1;

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    total, page: pageNum, pageSize: sizeNum, rows,
                    _timing: {
                        loadTrustMapMs: tLoadMap,
                        enrichSortSliceMs: tCompute,
                        totalMs: Date.now() - t0,
                    },
                }),
            };
        }

// ============================================================
// S2 — getNetworkMapPoints (pulled forward from S6)
// Consent enforced server-side: pins never leave the DB without
// explicit location consent + coordinates.
// ============================================================
        if (action === 'getNetworkMapPoints') {
            const snap = await db.collection('farms').doc(fid).collection('suppliers').get();

            const points: Array<{
                id: string;
                name: string;
                type: string;
                lat: number;
                lng: number;
                isActive: boolean;
                location: string;
            }> = [];

            snap.docs.forEach(d => {
                const s: any = d.data();
                const scopes = s.dataConsentScope || [];

                const locationConsented =
                    s.dataConsentGiven &&
                    !s.dataConsentWithdrawnDate &&
                    scopes.includes('location');

                const hasCoords =
                    s.hasLocation &&
                    typeof s.latitude === 'number' &&
                    typeof s.longitude === 'number' &&
                    s.latitude !== 0 &&
                    s.longitude !== 0;

                if (!locationConsented || !hasCoords) return;

                points.push({
                    id: d.id,
                    name: s.name,
                    type: s.type,
                    lat: s.latitude,
                    lng: s.longitude,
                    isActive: (s.isActive ?? s.status === 'ACTIVE') && s.status === 'ACTIVE',
                    location: s.location || '',
                });
            });

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    points,
                    totalSuppliers: snap.size,
                    shownCount: points.length,
                }),
            };
        }

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Invalid action' }),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

// Loads every collection the trust engine reads and returns a map
// of supplierId → TrustResult. Shared by listSuppliers and any
// future action that needs per-supplier trust without a summary.
async function loadTrustMap(fid: string): Promise<{
    suppliers: any[];
    trustBySupplier: Record<string, TrustResult>;
    batchesBySupplier: Record<string, any[]>;
    _timing?: { fetchMs: number; computeMs: number };
}> {
    const tFetch = Date.now();
    const [suppliersSnap, batchesSnap, commitmentsSnap, inspectionsSnap] = await Promise.all([
        db.collection('farms').doc(fid).collection('suppliers').get(),
        db.collection('farms').doc(fid).collection('quality_batches').get(),
        db.collection('farms').doc(fid).collection('supplier_commitments').get(),
        db.collection('farms').doc(fid).collection('supplier_inspections').get(),
    ]);
    const tAfterFetch = Date.now() - tFetch;

    const tCompute = Date.now();
    const batches = batchesSnap.docs.map(d => {
        const data = d.data();
        return {
            id: d.id,
            supplierId: data.supplierId,
            weightKg: data.weightKg,
            qualityScore: data.qualityScore,
            rcnQualityScore: data.rcnQualityScore,
            defectiveRate: data.defectiveRate,
            moistureContent: data.moistureContent,
            korGPerKg: data.korGPerKg,
            nutCountPerKg: data.nutCountPerKg,
            foreignMatter: data.foreignMatter,
            aflatoxinPpb: data.aflatoxinPpb,
            heavyMetalsPpb: data.heavyMetalsPpb,
            pesticideResiduePpb: data.pesticideResiduePpb,
            farmOsMonitored: data.farmOsMonitored,
            verifiedAt: data.verifiedAt,
            testResults: data.testResults,
        };
    });

    const groupBy = (arr: any[], key = 'supplierId') => {
        const out: Record<string, any[]> = {};
        arr.forEach(item => {
            const k = String(item[key]);
            (out[k] = out[k] || []).push(item);
        });
        return out;
    };

    const batchesBySupplier = groupBy(batches);

    const validatedCommitments = commitmentsSnap.docs
        .map(d => ({ firestoreId: d.id, ...d.data() } as any))
        .filter((c: any) => c.validatedAt);
    const validatedInspections = inspectionsSnap.docs
        .map(d => ({ firestoreId: d.id, ...d.data() } as any))
        .filter((i: any) => i.validatedAt);

    const commitmentsBySupplier = groupBy(validatedCommitments);
    const inspectionsBySupplier = groupBy(validatedInspections);

    const suppliers = suppliersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

    const trustBySupplier: Record<string, TrustResult> = {};
    suppliers.forEach(s => {
        const input: TrustInput = {
            supplier: {
                id: s.id,
                name: s.name,
                status: s.status,
                isActive: s.isActive ?? s.status === 'ACTIVE',
                latitude: s.latitude,
                longitude: s.longitude,
                hasLocation: s.hasLocation,
                registrationNumber: s.registrationNumber,
                farmerIdNumber: s.farmerIdNumber,
                dataConsentGiven: s.dataConsentGiven,
                dataConsentScope: s.dataConsentScope,
                dataConsentWithdrawnDate: s.dataConsentWithdrawnDate,
                firebreakProtection: s.firebreakProtection,
                noChildLabor: s.noChildLabor,
                sustainableHarvesting: s.sustainableHarvesting,
                isCertified: s.isCertified,
                certificationType: s.certificationType,
            },
            batches: batchesBySupplier[s.id] || [],
            commitments: commitmentsBySupplier[s.id] || [],
            inspections: inspectionsBySupplier[s.id] || [],
        };
        trustBySupplier[s.id] = computeTrustScoreServer(input);
    });
    const tAfterCompute = Date.now() - tCompute;

    return {
        suppliers,
        trustBySupplier,
        batchesBySupplier,
        _timing: { fetchMs: tAfterFetch, computeMs: tAfterCompute },
    };
}

async function buildNetworkSummary(fid: string) {
    const t0 = Date.now();
    const [
        suppliersSnap,
        batchesSnap,
        commitmentsSnap,
        inspectionsSnap,
        disputesSnap,
        expensesSnap,
        revenuesSnap,
        supportActionsSnap,
    ] = await Promise.all([
        db.collection('farms').doc(fid).collection('suppliers').get(),
        db.collection('farms').doc(fid).collection('quality_batches').get(),
        db.collection('farms').doc(fid).collection('supplier_commitments').get(),
        db.collection('farms').doc(fid).collection('supplier_inspections').get(),
        db.collection('farms').doc(fid).collection('supplier_disputes').get(),
        db.collection('farms').doc(fid).collection('expenses').get(),
        db.collection('farms').doc(fid).collection('revenues').get(),
        db.collection('farms').doc(fid).collection('supplier_support_actions').get(),
    ]);
    const tFetch = Date.now() - t0;

    // Slim batch payload — same fields the client engine reads
    const t1 = Date.now();
    const batches = batchesSnap.docs.map(d => {
        const data = d.data();
        const tCompute = Date.now() - t1;
        return {
            id: d.id,
            supplierId: data.supplierId,
            weightKg: data.weightKg,
            qualityScore: data.qualityScore,
            rcnQualityScore: data.rcnQualityScore,
            defectiveRate: data.defectiveRate,
            moistureContent: data.moistureContent,
            korGPerKg: data.korGPerKg,
            nutCountPerKg: data.nutCountPerKg,
            foreignMatter: data.foreignMatter,
            aflatoxinPpb: data.aflatoxinPpb,
            heavyMetalsPpb: data.heavyMetalsPpb,
            pesticideResiduePpb: data.pesticideResiduePpb,
            farmOsMonitored: data.farmOsMonitored,
            verifiedAt: data.verifiedAt,
            testResults: data.testResults,
            _timing: {
                fetchMs: tFetch,
                computeMs: tCompute,
                totalMs: Date.now() - t0,
            },
        };
    });

    const groupBy = (arr: any[], key = 'supplierId') => {
        const out: Record<string, any[]> = {};
        arr.forEach(item => {
            const k = String(item[key]);
            (out[k] = out[k] || []).push(item);
        });
        return out;
    };

    const batchesBySupplier = groupBy(batches);

    const allCommitments = commitmentsSnap.docs.map(d => ({
        firestoreId: d.id,
        ...d.data(),
    } as any));
    const allInspections = inspectionsSnap.docs.map(d => ({
        firestoreId: d.id,
        ...d.data(),
    } as any));

    // Only validated evidence feeds trust
    const validatedCommitments = allCommitments.filter((c: any) => c.validatedAt);
    const validatedInspections = allInspections.filter((i: any) => i.validatedAt);

    const commitmentsBySupplier = groupBy(validatedCommitments);
    const inspectionsBySupplier = groupBy(validatedInspections);

    // Compute trust per supplier
    const trustBySupplier: Record<string, TrustResult> = {};
    suppliersSnap.docs.forEach(d => {
        const s: any = { id: d.id, ...d.data() };
        const input: TrustInput = {
            supplier: {
                id: s.id,
                name: s.name,
                status: s.status,
                isActive: s.isActive ?? s.status === 'ACTIVE',
                latitude: s.latitude,
                longitude: s.longitude,
                hasLocation: s.hasLocation,
                registrationNumber: s.registrationNumber,
                farmerIdNumber: s.farmerIdNumber,
                dataConsentGiven: s.dataConsentGiven,
                dataConsentScope: s.dataConsentScope,
                dataConsentWithdrawnDate: s.dataConsentWithdrawnDate,
                firebreakProtection: s.firebreakProtection,
                noChildLabor: s.noChildLabor,
                sustainableHarvesting: s.sustainableHarvesting,
                isCertified: s.isCertified,
                certificationType: s.certificationType,
            },
            batches: batchesBySupplier[s.id] || [],
            commitments: commitmentsBySupplier[s.id] || [],
            inspections: inspectionsBySupplier[s.id] || [],
        };
        trustBySupplier[s.id] = computeTrustScoreServer(input);
    });

    // KPIs
    const totalSuppliers = suppliersSnap.size;
    const activeSuppliers = suppliersSnap.docs.filter(d => {
        const s: any = d.data();
        return (s.isActive ?? s.status === 'ACTIVE') && s.status === 'ACTIVE';
    }).length;

    const buyerReadyCount = suppliersSnap.docs.filter(d => {
        const s: any = d.data();
        const scopes = s.dataConsentScope || [];
        const hasAllScopes =
            scopes.includes('identity') &&
            scopes.includes('location') &&
            scopes.includes('photo');
        return (
            (s.isActive ?? s.status === 'ACTIVE') &&
            s.status === 'ACTIVE' &&
            s.dataConsentGiven &&
            !s.dataConsentWithdrawnDate &&
            hasAllScopes
        );
    }).length;

    const scoredOveralls = Object.values(trustBySupplier)
        .map(t => t.overall)
        .filter((v): v is number => v !== null);

    const avgTrustOverall = scoredOveralls.length > 0
        ? Number((scoredOveralls.reduce((a, b) => a + b, 0) / scoredOveralls.length).toFixed(1))
        : null;
    const scoredCount = scoredOveralls.length;

    const verifiedVolumeKg = batches
        .filter(b => b.verifiedAt && b.verifiedAt > 0)
        .reduce((sum, b) => sum + (b.weightKg || 0), 0);

    // Consent counts
    const consentCounts = { full: 0, partial: 0, none: 0, withdrawn: 0 };
    suppliersSnap.docs.forEach(d => {
        const s: any = d.data();
        if (s.dataConsentWithdrawnDate) {
            consentCounts.withdrawn++;
            return;
        }
        if (!s.dataConsentGiven) {
            consentCounts.none++;
            return;
        }
        const scopes = s.dataConsentScope || [];
        if (scopes.length >= 3) {
            consentCounts.full++;
        } else if (scopes.length > 0) {
            consentCounts.partial++;
        } else {
            consentCounts.none++;
        }
    });

    // Queue counts
    const queueCounts = {
        pendingCommitments: allCommitments.filter((c: any) => !c.validatedAt).length,
        pendingInspections: allInspections.filter((i: any) => !i.validatedAt).length,
        openDisputes: disputesSnap.docs.filter(d => {
            const data: any = d.data();
            return data.reviewStatus === 'OPEN' || data.reviewStatus === 'UNDER_REVIEW';
        }).length,
    };

    // Maturity counts
    const maturityCounts = { preliminary: 0, developing: 0, established: 0 };
    Object.values(trustBySupplier).forEach(t => { maturityCounts[t.confidence]++; });

    // Top 5 trust
    const topTrust = Object.entries(trustBySupplier)
        .map(([supplierId, trust]) => {
            const s: any = { id: supplierId, ...(suppliersSnap.docs.find(d => d.id === supplierId)?.data() || {}) };
            return {
                supplierId,
                name: s.name,
                overall: trust.overall,
                confidence: trust.confidence,
                verifiedTransactions: trust.verifiedTransactions,
            };
        })
        .filter(x => x.overall !== null)
        .sort((a, b) => (b.overall ?? 0) - (a.overall ?? 0))
        .slice(0, 5);

    // Risk summary
    const flagged = Object.entries(trustBySupplier).filter(
        ([, t]) => t.hasCriticalViolation || t.flags.length > 0
    );
    // Mirrors severityOf() in src/pages/SupplierRisk.tsx so the dashboard
// preview and the Risk Workbench classify identically.
//   critical  → hasCriticalViolation
//   high      → not critical, overall < 40
//   medium    → not critical, overall 40–59
//   low       → flagged, but none of the above
//              (includes overall ≥ 60 AND overall null)
    const riskCounts = {
        critical: flagged.filter(([, t]) => t.hasCriticalViolation).length,
        high: flagged.filter(([, t]) =>
            !t.hasCriticalViolation && t.overall !== null && t.overall < 40
        ).length,
        medium: flagged.filter(([, t]) =>
            !t.hasCriticalViolation &&
            t.overall !== null &&
            t.overall >= 40 &&
            t.overall < 60
        ).length,
        low: flagged.filter(([, t]) => {
            if (t.hasCriticalViolation) return false;
            if (t.overall === null) return true;         // unscored flagged = low
            if (t.overall < 40) return false;             // caught by high
            if (t.overall < 60) return false;             // caught by medium
            return true;                                   // ≥ 60 = low
        }).length,
    };
    const topRiskEntry = flagged
        .sort((a, b) => {
            const aCrit = a[1].hasCriticalViolation ? 1 : 0;
            const bCrit = b[1].hasCriticalViolation ? 1 : 0;
            if (aCrit !== bCrit) return bCrit - aCrit;
            return (a[1].overall ?? 100) - (b[1].overall ?? 100);
        })[0];
    const topRisk = topRiskEntry
        ? {
            supplierId: topRiskEntry[0],
            name: (suppliersSnap.docs.find(d => d.id === topRiskEntry[0])?.data() as any)?.name || '',
            hasCriticalViolation: topRiskEntry[1].hasCriticalViolation,
            overall: topRiskEntry[1].overall,
        }
        : null;

    // Financial efficiency — real records
    const expensesBySupplier = new Map<number, number>();
    expensesSnap.docs.forEach(d => {
        const e: any = d.data();
        if (e.category === 'PROCUREMENT' && typeof e.supplierId === 'number') {
            expensesBySupplier.set(
                e.supplierId,
                (expensesBySupplier.get(e.supplierId) || 0) + (e.amount || 0)
            );
        }
    });

    const revenuesBySupplier = new Map<number, number>();
    revenuesSnap.docs.forEach(d => {
        const r: any = d.data();
        if (typeof r.supplierId === 'number') {
            revenuesBySupplier.set(
                r.supplierId,
                (revenuesBySupplier.get(r.supplierId) || 0) + (r.totalAmount || 0)
            );
        }
    });

    const financialEfficiency = suppliersSnap.docs
        .map(d => {
            const s: any = d.data();
            const numericId = typeof s.id === 'number' ? s.id : parseInt(String(s.id));
            const procurement = expensesBySupplier.get(numericId) || 0;
            const revenue = revenuesBySupplier.get(numericId) || 0;
            if (procurement === 0) return null;
            return {
                supplierId: d.id,
                name: s.name,
                procurement,
                revenue,
                efficiency: Number((revenue / procurement).toFixed(2)),
            };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, 5);

    // Support actions (all statuses)
    const allSupportActions: SupportAction[] = supportActionsSnap.docs.map(d => {
        const data: any = d.data();
        return {
            supplierId: data.supplierId,
            weakness: data.weakness,
            status: data.status,
            givenAt: data.givenAt,
        };
    });

    const openActions = allSupportActions.filter(a => a.status === 'OPEN').length;

// Visible opportunities — ported detectors + suppression
    const suppliersForDev = suppliersSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
    } as any));

    const trustConfidenceMap: Record<string, {
        confidence: 'preliminary' | 'developing' | 'established';
        verifiedTransactions: number;
    }> = {};
    Object.entries(trustBySupplier).forEach(([id, t]) => {
        trustConfidenceMap[id] = {
            confidence: t.confidence,
            verifiedTransactions: t.verifiedTransactions,
        };
    });

    const visibleOpportunities = detectVisibleOpportunities(
        suppliersForDev,
        batchesBySupplier,
        trustConfidenceMap,
        allSupportActions
    );

    const topOpportunity = visibleOpportunities.length > 0
        ? {
            supplierId: visibleOpportunities[0].supplierId,
            name: visibleOpportunities[0].supplierName,
            weakness: visibleOpportunities[0].weakness,
            severity: visibleOpportunities[0].severity,
        }
        : null;

    const developmentCounts = {
        openActions,
        visibleOpportunities: visibleOpportunities.length,
        topOpportunity,
    };

    return {
        generatedAt: Date.now(),
        scoringVersion: 'v2.0',

        totalSuppliers,
        activeSuppliers,
        buyerReadyCount,

        avgTrustOverall,
        scoredCount,

        verifiedVolumeKg,

        consentCounts,
        queueCounts,
        maturityCounts,

        topTrust,
        topRisk,
        riskCounts,

        financialEfficiency,

        developmentCounts,
    };
}