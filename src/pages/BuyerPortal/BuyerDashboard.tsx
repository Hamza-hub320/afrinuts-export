import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBox, FaShip, FaSearch, FaLeaf, FaSignOutAlt,
    FaChevronDown, FaChevronRight,
    FaCheckCircle, FaWeightHanging, FaCertificate, FaArrowLeft,
    FaExternalLinkAlt, FaCalendarAlt, FaClipboardCheck,
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import Section from '@/components/Section/Section';
import { staggerContainer } from '@/utils/animations';
import { getAdminData, getBuyerPortalData } from '@/services/api';
import { buyerLogout, onBuyerAuthChange } from '@/services/buyerAuth';
import type { User } from 'firebase/auth';

import { BatchDossier } from '@/components/buyer/BatchDossier';
import { BatchListItem } from '@/components/buyer/BatchListItem';

// ── Shared Types ──
export interface GatedFarmer {
    id?: number;
    name: string;
    role: string;
    bio: string | null;
    quote: string | null;
    yearsFarming: string | null;
    photo: string;
    location: string;
    traceLevel?: string | null;
    cooperative?: string | null;
    consentShared?: { identity: boolean; location: boolean; photo: boolean };
    identityWithheld?: boolean;
    locationWithheld?: boolean;
    photoWithheld?: boolean;
}

export interface MyBatch {
    id: string;
    batchId: string;
    harvestDate: string;
    processingDate?: string;
    farmLocation: string;
    block?: string;
    processingFacility?: string;
    processingMethod?: string;
    shellingMethod?: string;
    gradingMethod?: string;
    certifications: string[];
    qualityGrade?: string;
    digitalSignature?: any;
    qualityScore?: number;
    testResults?: any;
    destination: string;
    buyer?: string;
    status: string;
    moistureContent?: number;
    nutCount?: number;
    kernelRatio?: number;
    defectiveRate?: number;
    overallScore?: number;
    rawWeightKg?: number;
    kernelWeightKg?: number;
    latitude?: number | null;
    longitude?: number | null;
    documents?: Record<string, string | null | undefined>;
    farmer?: GatedFarmer;
    sustainability?: any;
    supplier?: any;
    farmOsMetadata?: any;
}

export interface MasterBatch {
    masterBatchNumber: string;
    shipmentName: string | null;
    buyer: string | null;
    destination: string | null;
    totalBatches: number;
    totalWeightKg: number;
    grades: string | null;
    exportDate: number | null;
}

export interface MasterGroup {
    master: MasterBatch;
    batches: MyBatch[];
}

export interface BuyerInfo {
    companyName: string;
    contactPerson: string;
}

export interface MyBatchesResponse {
    buyer?: BuyerInfo;
    batches?: MyBatch[];
    masters?: MasterBatch[];
    isBulk?: boolean;
    masterBatch?: MasterBatch | null;
}

interface BuyerComplianceMilestone {
    label: string;
    date: number;
}

interface BuyerComplianceProgramme {
    certificationId: string;
    certificationName: string;
    effectiveStatus: string;
    certificationBody: string;
    scope: string;
    targetDate: number;
    approvalDate: number;
    expiryDate: number;
    milestones: BuyerComplianceMilestone[];
}

interface BuyerComplianceSummary {
    total: number;
    closed: number;
    open: number;
    closurePct: number | null;
}

interface BuyerComplianceDetail {
    programme: BuyerComplianceProgramme;
    certificate?: {
        documentId: string;
        documentName: string;
        issueDate: number;
        expiryDate: number;
        fileUrl: string | null;
    };
    audits?: Array<{
        auditId: string;
        auditType: string;
        auditDate: number;
        auditorName: string;
        auditorBody: string;
        scope: string;
        status: string;
        reportUrl: string | null;
        findingsSummary: BuyerComplianceSummary;
    }>;
    inspections?: Array<{
        inspectionId: string;
        inspectionDate: number;
        inspectorName: string;
        inspectorBody: string;
        status: string;
        correctiveActionsSummary: BuyerComplianceSummary;
    }>;
    verifications?: Array<{
        verificationId: string;
        verificationType: string;
        verificationDate: number;
        verifiedBy: string;
        status: string;
        evidenceCount: number;
    }>;
}

function complianceDate(value: number): string {
    if (!Number.isFinite(value) || value <= 0) return '—';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function BuyerComplianceStatus({ status }: { status: string }) {
    const normalized = (status || 'UNKNOWN').toUpperCase();
    const color = normalized === 'CERTIFIED'
        ? 'bg-green-100 text-green-800'
        : normalized === 'EXPIRED' || normalized === 'SUSPENDED'
            ? 'bg-red-100 text-red-800'
            : 'bg-amber-100 text-amber-800';
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{normalized.replace(/_/g, ' ')}</span>;
}

function BuyerComplianceSummaryView({ summary, label }: { summary: BuyerComplianceSummary; label: string }) {
    return (
        <div className="mt-3 rounded-xl bg-white/50 p-3">
            <div className="text-xs font-semibold text-gray-700">{label}</div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
                <span>{summary.total} total</span>
                <span>{summary.closed} closed</span>
                <span>{summary.open} open</span>
                <span>Closure: {summary.closurePct == null ? '—' : `${summary.closurePct}%`}</span>
            </div>
        </div>
    );
}

// ── GlassCard (matches AdminBuyers) ──
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <motion.div
        className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        whileHover={{
            y: -5,
            scale: 1.01,
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
            transition: { duration: 0.3 },
        }}
    >
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
        <div className="relative z-10 p-5">{children}</div>
    </motion.div>
);

const BuyerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(null);
    const [response, setResponse] = useState<MyBatchesResponse | null>(null);
    const [complianceProgrammes, setComplianceProgrammes] = useState<BuyerComplianceProgramme[]>([]);
    const [selectedComplianceId, setSelectedComplianceId] = useState<string | null>(null);
    const [selectedComplianceDetail, setSelectedComplianceDetail] = useState<BuyerComplianceDetail | null>(null);
    const [complianceListLoading, setComplianceListLoading] = useState(true);
    const [complianceDetailLoading, setComplianceDetailLoading] = useState(false);
    const [complianceError, setComplianceError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Selection & Layout State
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
    const [openBulkIds, setOpenBulkIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const unsubscribe = onBuyerAuthChange(setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBuyerPortalData('myBatches');
                if (data.error === 'not_a_buyer') {
                    try {
                        await getAdminData('admin_listBuyers');
                        navigate('/dashboard/buyers');
                        return;
                    } catch {
                        throw new Error('You do not have access to this portal.');
                    }
                }
                setBuyerInfo(data.buyer || null);
                setResponse(data as MyBatchesResponse);
            } catch (err: any) {
                setError(err.message || 'Failed to load your batches');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        setComplianceListLoading(true);
        getBuyerPortalData('complianceProgrammes')
            .then((data: { programmes?: BuyerComplianceProgramme[]; error?: string }) => {
                if (!Array.isArray(data.programmes)) throw new Error(data.error || 'Could not load compliance programmes.');
                if (!cancelled) setComplianceProgrammes(data.programmes);
            })
            .catch((err: any) => {
                if (!cancelled) setComplianceError(err.message || 'Could not load compliance programmes.');
            })
            .finally(() => {
                if (!cancelled) setComplianceListLoading(false);
            });
        return () => { cancelled = true; };
    }, [user]);

    useEffect(() => {
        if (!selectedComplianceId) {
            setSelectedComplianceDetail(null);
            setComplianceDetailLoading(false);
            return;
        }
        let cancelled = false;
        setComplianceDetailLoading(true);
        setComplianceError(null);
        getBuyerPortalData('complianceProgramme', { certificationId: selectedComplianceId })
            .then((data: BuyerComplianceDetail) => {
                if (!data?.programme) throw new Error('Could not load this compliance programme.');
                if (!cancelled) setSelectedComplianceDetail(data);
            })
            .catch((err: any) => {
                if (!cancelled) setComplianceError(err.message || 'Could not load this compliance programme.');
            })
            .finally(() => {
                if (!cancelled) setComplianceDetailLoading(false);
            });
        return () => { cancelled = true; };
    }, [selectedComplianceId]);

    // ── Data Normalization ──
    const { individualBatches, masterGroups, allBatchesForKpis } = useMemo(() => {
        if (!response) return { individualBatches: [], masterGroups: [], allBatchesForKpis: [] };
        let individual: MyBatch[] = response.batches || [];
        let groups: MasterGroup[] = [];

        if (response.masters && Array.isArray(response.masters)) {
            groups = (response.masters as any[]).map((m: any) => ({ master: m, batches: m.batches || [] }));
        } else if (response.isBulk && response.masterBatch) {
            groups = [{ master: response.masterBatch, batches: response.batches || [] }];
            individual = [];
        }

        const allBatches = [...individual, ...groups.flatMap(g => g.batches)];
        return { individualBatches: individual, masterGroups: groups, allBatchesForKpis: allBatches };
    }, [response]);

    // Auto-select first batch and open first bulk
    useEffect(() => {
        if (allBatchesForKpis.length > 0 && !selectedBatchId) {
            setSelectedBatchId(allBatchesForKpis[0].id);
        }
        if (masterGroups.length > 0 && openBulkIds.size === 0) {
            setOpenBulkIds(new Set([masterGroups[0].master.masterBatchNumber]));
        }
    }, [allBatchesForKpis, masterGroups]);

    // Filter logic for search
    const filteredMasters = masterGroups.filter(g =>
        !searchQuery ||
        g.master.masterBatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.batches.some(b => b.batchId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const filteredIndividuals = individualBatches.filter(b =>
        !searchQuery || b.batchId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedBatch = allBatchesForKpis.find(b => b.id === selectedBatchId) || null;
    const selectedComplianceProgramme = complianceProgrammes.find(programme => programme.certificationId === selectedComplianceId) || null;

    // Derived KPIs
    const totalWeight = allBatchesForKpis.reduce((s, b) => s + (b.rawWeightKg || 0), 0);
    const premiumCount = allBatchesForKpis.filter(b => b.qualityGrade === 'PREMIUM').length;
    const premiumPct = allBatchesForKpis.length > 0 ? Math.round((premiumCount / allBatchesForKpis.length) * 100) : 0;

    const handleLogout = async () => {
        await buyerLogout();
        navigate('/portal/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-6 bg-white rounded-xl shadow-md text-red-600">{error}</div>
        </div>
    );

    return (
        <div className="min-h-screen pt-[72px] font-sans">
            <Section className="py-6">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

                    {/* ── HERO & KPIs ── */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-8">
                        <GlassCard className="!p-0">
                            <div className="p-6 md:p-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative overflow-hidden">
                                {/* Pattern overlay */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-30 mix-blend-overlay pointer-events-none" />

                                <div className="relative z-10 lg:w-1/3">
                                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2 text-xs font-bold">
                                        Your Shipments
                                    </Typography>
                                    <Typography variant="h2" className="text-3xl md:text-4xl font-display text-gray-900 mb-2">
                                        Track your cashew shipments
                                    </Typography>
                                    <Typography variant="body" className="text-gray-600 text-sm">
                                        Complete transparency from farm to port. Verify quality, origin and impact.
                                    </Typography>

                                    {/* Sign-out — bottom of hero copy on mobile, inline with text on desktop */}
                                    <button
                                        onClick={handleLogout}
                                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-white hover:text-red-600 transition"
                                    >
                                        <FaSignOutAlt className="text-xs" />
                                        Sign Out
                                    </button>
                                </div>

                                <div className="relative z-10 flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                    {/* KPI 1 */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-blue-50 text-accent rounded-md"><FaBox size={14} /></div>
                                            <span className="text-xs text-gray-500 font-medium">Total Shipments</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{allBatchesForKpis.length}</div>
                                        <div className="text-[10px] text-green-600 font-medium mt-1">↑ Updated today</div>
                                    </div>

                                    {/* KPI 2 */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-indigo-50 text-accent rounded-md"><FaWeightHanging size={14} /></div>
                                            <span className="text-xs text-gray-500 font-medium">Total Weight</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{(totalWeight / 1000).toFixed(1)} MT</div>
                                        <div className="text-[10px] text-green-600 font-medium mt-1">↑ Verified weights</div>
                                    </div>

                                    {/* KPI 3 */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-emerald-50 text-primary rounded-md"><FaCertificate size={14} /></div>
                                            <span className="text-xs text-gray-500 font-medium">Avg. Quality Grade</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">Premium</div>
                                        <div className="text-[10px] text-green-600 font-medium mt-1">{premiumPct}% premium grade</div>
                                    </div>

                                    {/* KPI 4 */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-green-50 text-primary rounded-md"><FaLeaf size={14} /></div>
                                            <span className="text-xs text-gray-500 font-medium">Origin</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">Côte d'Ivoire</div>
                                        <div className="text-[10px] text-green-600 font-medium mt-1">100% traceable</div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* ── SPLIT LAYOUT: Sidebar + Detail ── */}
                    {allBatchesForKpis.length === 0 ? (
                        <GlassCard>
                            <div className="text-center py-16">
                                <FaBox className="text-4xl text-primary/40 mx-auto mb-4" />
                                <Typography variant="h4" className="text-gray-900 mb-2">No shipments yet</Typography>
                                <Typography variant="body" className="text-gray-500">
                                    We'll notify you when your first shipment is processed.
                                </Typography>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

                            {/* ── LEFT SIDEBAR ── */}
                            <aside className="lg:sticky lg:top-[90px] lg:max-h-[calc(100vh-120px)]">
                                <GlassCard className="!p-0 flex flex-col max-h-[calc(100vh-120px)]">
                                    <div className="p-4 border-b border-white/30">
                                        <div className="flex justify-between items-center mb-4">
                                            <Typography variant="h4" className="font-bold text-gray-900">
                                                Your Shipments
                                            </Typography>
                                        </div>
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                                            <input
                                                type="text"
                                                placeholder="Search batch ID..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 bg-white/60 border border-white/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-hide">
                                        {/* Bulk Groups */}
                                        {filteredMasters.map((group) => {
                                            const isOpen = openBulkIds.has(group.master.masterBatchNumber);
                                            return (
                                                <div key={group.master.masterBatchNumber} className="bg-blue-50/60 backdrop-blur-sm rounded-xl border border-blue-200/60 overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            setOpenBulkIds(prev => {
                                                                const next = new Set(prev);
                                                                next.has(group.master.masterBatchNumber)
                                                                    ? next.delete(group.master.masterBatchNumber)
                                                                    : next.add(group.master.masterBatchNumber);
                                                                return next;
                                                            });
                                                        }}
                                                        className="w-full flex items-center justify-between p-3 hover:bg-blue-100/40 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                                <FaShip size={14} />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="font-mono text-sm font-bold text-blue-900">
                                                                    {group.master.masterBatchNumber}
                                                                </div>
                                                                <div className="text-[11px] text-blue-700">
                                                                    {group.batches.length} batches · {((group.master.totalWeightKg || 0) / 1000).toFixed(1)}T
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isOpen ? (
                                                            <FaChevronDown className="text-blue-500 text-xs" />
                                                        ) : (
                                                            <FaChevronRight className="text-blue-500 text-xs" />
                                                        )}
                                                    </button>

                                                    {isOpen && (
                                                        <div className="p-2 space-y-1 bg-white/50">
                                                            {group.batches.map(b => (
                                                                <BatchListItem
                                                                    key={b.id}
                                                                    batch={b}
                                                                    isSelected={selectedBatchId === b.id}
                                                                    onClick={() => setSelectedBatchId(b.id)}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Individual Batches */}
                                        {filteredIndividuals.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 px-2 mb-2 mt-4">
                                                    <FaBox className="text-gray-400 text-xs" />
                                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                                        Individual Batches
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    {filteredIndividuals.map(b => (
                                                        <BatchListItem
                                                            key={b.id}
                                                            batch={b}
                                                            isSelected={selectedBatchId === b.id}
                                                            onClick={() => setSelectedBatchId(b.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-green-50/70 backdrop-blur-sm border-t border-green-200/60">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-green-600 text-xs" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-green-900">
                                                    All shipments are 100% traceable
                                                </div>
                                                <div className="text-[10px] text-green-700">
                                                    From our farmers to your facility.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </aside>

                            {/* ── RIGHT DOSSIER ── */}
                            <main className="min-w-0">
                                {selectedBatch ? (
                                    <BatchDossier batch={selectedBatch} />
                                ) : (
                                    <GlassCard>
                                        <div className="flex flex-col items-center justify-center p-12 text-center">
                                            <FaSearch className="text-3xl text-primary/30 mb-4" />
                                            <Typography variant="h4" className="text-gray-900 mb-1">
                                                Select a shipment
                                            </Typography>
                                            <Typography variant="body" className="text-gray-500">
                                                Choose a batch from the list to view its full dossier.
                                            </Typography>
                                        </div>
                                    </GlassCard>
                                )}
                            </main>
                        </div>
                    )}

                    {/* ── CERTIFICATION COMPLIANCE ── */}
                    <section className="mt-8" aria-labelledby="buyer-compliance-title">
                        <div className="mb-4">
                            <Typography variant="h4" className="font-bold text-gray-900" id="buyer-compliance-title">
                                Certification compliance
                            </Typography>
                            <Typography variant="body" className="mt-1 text-sm text-gray-600">
                                View programme progress and published certification evidence.
                            </Typography>
                        </div>

                        {complianceError && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{complianceError}</div>}

                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr] items-start">
                            <div className="space-y-3">
                                {complianceListLoading ? (
                                    <GlassCard><div className="py-8 text-center text-sm text-gray-500">Loading programmes…</div></GlassCard>
                                ) : complianceProgrammes.length === 0 ? (
                                    <GlassCard><div className="py-8 text-center text-sm text-gray-500">No certification programmes are available.</div></GlassCard>
                                ) : complianceProgrammes.map(programme => (
                                    <GlassCard key={programme.certificationId} className="!p-0">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedComplianceId(programme.certificationId)}
                                            aria-current={selectedComplianceId === programme.certificationId ? 'true' : undefined}
                                            className={`w-full rounded-2xl p-5 text-left transition-colors ${selectedComplianceId === programme.certificationId ? 'bg-white/50' : 'hover:bg-white/35'}`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{programme.certificationName || programme.certificationId}</div>
                                                    <div className="mt-1 text-xs text-gray-500">{programme.certificationBody || 'Certification programme'}</div>
                                                </div>
                                                <BuyerComplianceStatus status={programme.effectiveStatus} />
                                            </div>
                                            {programme.milestones.length > 0 && (
                                                <div className="mt-3 space-y-1 border-t border-gray-200/70 pt-3">
                                                    {programme.milestones.slice(-3).map((milestone, index) => (
                                                        <div key={`${programme.certificationId}-${milestone.label}-${index}`} className="flex justify-between gap-3 text-xs text-gray-600">
                                                            <span>{milestone.label}</span><span>{complianceDate(milestone.date)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    </GlassCard>
                                ))}
                            </div>

                            <div className="min-w-0">
                                {complianceDetailLoading ? (
                                    <GlassCard><div className="py-12 text-center text-sm text-gray-500">Loading programme details…</div></GlassCard>
                                ) : selectedComplianceDetail ? (
                                    <GlassCard>
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900">{selectedComplianceDetail.programme.certificationName || selectedComplianceDetail.programme.certificationId}</h3>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {selectedComplianceDetail.programme.certificationBody || 'Certification programme'}
                                                    {selectedComplianceDetail.programme.scope ? ` · ${selectedComplianceDetail.programme.scope}` : ''}
                                                </p>
                                            </div>
                                            <BuyerComplianceStatus status={selectedComplianceDetail.programme.effectiveStatus} />
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 gap-2 rounded-xl bg-white/35 p-3 text-xs sm:grid-cols-3">
                                            <div><span className="text-gray-500">Target</span><div className="mt-1 font-medium text-gray-800">{complianceDate(selectedComplianceDetail.programme.targetDate)}</div></div>
                                            <div><span className="text-gray-500">Approved</span><div className="mt-1 font-medium text-gray-800">{complianceDate(selectedComplianceDetail.programme.approvalDate)}</div></div>
                                            <div><span className="text-gray-500">Expiry</span><div className="mt-1 font-medium text-gray-800">{complianceDate(selectedComplianceDetail.programme.expiryDate)}</div></div>
                                        </div>

                                        <div className="mt-5">
                                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"><FaCalendarAlt className="text-accent" />Programme milestones</div>
                                            {selectedComplianceDetail.programme.milestones.length === 0 ? (
                                                <p className="text-sm text-gray-500">No milestones recorded.</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {selectedComplianceDetail.programme.milestones.map((milestone, index) => (
                                                        <div key={`${milestone.label}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white/45 px-3 py-2 text-sm">
                                                            <span className="text-gray-700">{milestone.label}</span><span className="text-xs text-gray-500">{complianceDate(milestone.date)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {selectedComplianceDetail.certificate ? (
                                            <div className="mt-5 space-y-4">
                                                <div className="rounded-xl border border-primary/10 bg-white/45 p-4">
                                                    <div className="flex items-center gap-2 font-semibold text-gray-900"><FaCertificate className="text-primary" />Certificate</div>
                                                    <div className="mt-2 text-sm text-gray-700">{selectedComplianceDetail.certificate.documentName || 'Current certificate'}</div>
                                                    <div className="mt-1 text-xs text-gray-500">Issued {complianceDate(selectedComplianceDetail.certificate.issueDate)} · Expires {complianceDate(selectedComplianceDetail.certificate.expiryDate)}</div>
                                                    {selectedComplianceDetail.certificate.fileUrl && <a className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" href={selectedComplianceDetail.certificate.fileUrl} target="_blank" rel="noreferrer">Open certificate <FaExternalLinkAlt size={11} /></a>}
                                                </div>

                                                <div>
                                                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"><FaClipboardCheck className="text-accent" />Audit reports</div>
                                                    {!selectedComplianceDetail.audits?.length ? <p className="text-sm text-gray-500">No validated audit reports are available.</p> : (
                                                        <div className="space-y-3">{selectedComplianceDetail.audits.map(audit => (
                                                            <div key={audit.auditId} className="rounded-xl border border-primary/10 bg-white/35 p-4">
                                                                <div className="flex flex-wrap items-start justify-between gap-2"><div className="font-semibold text-gray-900">{audit.auditType || 'Audit'}</div><BuyerComplianceStatus status={audit.status} /></div>
                                                                <div className="mt-1 text-xs text-gray-600">{audit.auditorName || 'Auditor not listed'}{audit.auditorBody ? ` · ${audit.auditorBody}` : ''} · {complianceDate(audit.auditDate)}</div>
                                                                {audit.scope && <div className="mt-1 text-xs text-gray-600">Scope: {audit.scope}</div>}
                                                                <BuyerComplianceSummaryView summary={audit.findingsSummary} label="Findings summary" />
                                                                {audit.reportUrl && <a className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" href={audit.reportUrl} target="_blank" rel="noreferrer">Open audit report <FaExternalLinkAlt size={11} /></a>}
                                                            </div>
                                                        ))}</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"><FaClipboardCheck className="text-accent" />Inspections</div>
                                                    {!selectedComplianceDetail.inspections?.length ? <p className="text-sm text-gray-500">No validated inspections are available.</p> : (
                                                        <div className="space-y-3">{selectedComplianceDetail.inspections.map(inspection => (
                                                            <div key={inspection.inspectionId} className="rounded-xl border border-primary/10 bg-white/35 p-4">
                                                                <div className="flex flex-wrap items-start justify-between gap-2"><div className="font-semibold text-gray-900">Inspection · {complianceDate(inspection.inspectionDate)}</div><BuyerComplianceStatus status={inspection.status} /></div>
                                                                <div className="mt-1 text-xs text-gray-600">{inspection.inspectorName || 'Inspector not listed'}{inspection.inspectorBody ? ` · ${inspection.inspectorBody}` : ''}</div>
                                                                <BuyerComplianceSummaryView summary={inspection.correctiveActionsSummary} label="Corrective actions summary" />
                                                            </div>
                                                        ))}</div>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"><FaCheckCircle className="text-accent" />Verifications</div>
                                                    {!selectedComplianceDetail.verifications?.length ? <p className="text-sm text-gray-500">No validated verifications are available.</p> : (
                                                        <div className="space-y-3">{selectedComplianceDetail.verifications.map(verification => (
                                                            <div key={verification.verificationId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/10 bg-white/35 p-4">
                                                                <div><div className="font-semibold text-gray-900">{verification.verificationType || 'Verification'}</div><div className="mt-1 text-xs text-gray-600">{verification.verifiedBy || 'Verifier not listed'} · {complianceDate(verification.verificationDate)} · {verification.evidenceCount} evidence items</div></div>
                                                                <BuyerComplianceStatus status={verification.status} />
                                                            </div>
                                                        ))}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-5 rounded-xl bg-white/45 p-4 text-sm text-gray-600">
                                                Buyer evidence is not available for this programme’s current status or publication state.
                                            </div>
                                        )}
                                    </GlassCard>
                                ) : (
                                    <GlassCard>
                                        <div className="flex flex-col items-center justify-center p-12 text-center">
                                            <FaSearch className="mb-4 text-3xl text-primary/30" />
                                            <Typography variant="h4" className="mb-1 text-gray-900">Select a programme</Typography>
                                            <Typography variant="body" className="text-gray-500">Choose a certification programme to view its status, milestones, and buyer evidence.</Typography>
                                        </div>
                                    </GlassCard>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </Section>
        </div>
    );
};

export default BuyerDashboard;
