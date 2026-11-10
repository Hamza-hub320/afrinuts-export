import React, { useEffect, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers, FaStar, FaBox, FaCheckCircle, FaTimesCircle,
    FaPhone, FaEnvelope, FaMapMarkerAlt,
    FaSearch, FaTimes,
    FaLeaf, FaFireExtinguisher, FaChild, FaHandshake,
    FaDollarSign,
    FaUser, FaChartLine, FaHome, FaShieldAlt, FaCamera,
    FaExclamationTriangle, FaHistory,
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import {
    getSupplierData,
    getSupplierNetworkSummary,
    listSuppliers,
    getNetworkMapPoints,
    getEvidenceQueues,
    exportSuppliers,
} from '../services/api';
import { Dialog, Transition } from '@headlessui/react';
import SupplierMap from '@/components/SupplierMap/SupplierMap';
import Sparkline from '@/components/Sparkline/Sparkline';
import { GiFarmer } from 'react-icons/gi';
import { TrustPanel } from '@/components/TrustBadge/TrustPanel';
import { useNavigate } from 'react-router-dom';

interface Supplier {
    id: string;
    name: string;
    type: string;
    status: string;

    contactPerson: string;
    phone: string;
    email: string;
    location: string;
    region?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    hasLocation?: boolean;

    registrationNumber?: string;
    taxId?: string;
    farmerIdNumber?: string;
    farmSize?: number;
    yearsFarming?: number;
    isCertified: boolean;
    certificationType?: string;
    certificationNumber?: string;
    certificationExpiryDate?: number;

    firebreakProtection?: boolean;
    noChildLabor?: boolean;
    sustainableHarvesting?: boolean;

    dataConsentGiven?: boolean;
    dataConsentScope?: string[];
    dataConsentSignedBy?: string;
    dataConsentVersion?: string;
    dataConsentWithdrawnDate?: number | null;
    dataConsentWithdrawnReason?: string | null;

    photoUrl?: string;
    bio?: string;
    quote?: string;
    rating?: number;
    notes?: string;

    isActive: boolean;

    // Server-computed row fields (fix 1)
    trust: any;                          // full TrustResult from the loader
    overall?: number | null;
    confidence?: string;
    hasCriticalViolation?: boolean;
    verifiedVolumeKg?: number;
    annualVolumeKg?: number;
    averageRcnQualityScore?: number | null;
    avgKorGPerKg?: number | null;
}

interface QualityBatch {
    id: string;
    batchNumber: string;
    supplierId: number;
    weightKg: number;
    qualityGrade: string;
    qualityScore: number;
    moistureContent: number;
    defectiveRate: number;
    kernelRatio: number;
    nutCountPerKg: number;
    processingDate: number;
    testResults?: string;
    sustainableHarvesting?: boolean;
    firebreakProtection?: boolean;
    noChildLabor?: boolean;
    farmOsMonitored?: boolean;
    verifiedAt?: number;
}

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <motion.div
        className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        whileHover={{
            y: -5,
            scale: 1.01,
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
            transition: { duration: 0.3 }
        }}
    >
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
        <div className="relative z-10 p-6">{children}</div>
    </motion.div>
);

const SupplierManagement: React.FC = () => {
    const navigate = useNavigate();

    const [summary, setSummary] = useState<any>(null);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const [tableRows, setTableRows] = useState<any[]>([]);
    const [tableTotal, setTableTotal] = useState(0);
    const [tablePage, setTablePage] = useState(1);
    const [tablePageSize] = useState(25);
    const [tableSearch, setTableSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [tableType, setTableType] = useState('All');
    const [tableSort, setTableSort] = useState<
        'name' | 'trust_desc' | 'trust_asc' | 'volume_desc' | 'quality_desc'
    >('name');
    const [tableLoading, setTableLoading] = useState(true);
    const [tableError, setTableError] = useState<string | null>(null);
    const [exporting, setExporting] = useState(false);

    const [mapData, setMapData] = useState<
        { points: any[]; totalSuppliers: number; shownCount: number } | null
    >(null);

    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [supplierBatches, setSupplierBatches] = useState<QualityBatch[]>([]);
    const [supplierFinancials, setSupplierFinancials] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'quality' | 'financials'>('profile');
    const [modalLoading, setModalLoading] = useState(false);
    const [supplierTrend, setSupplierTrend] = useState<number[]>([]);

    const [pendingCommitments, setPendingCommitments] = useState<any[]>([]);
    const [pendingInspections, setPendingInspections] = useState<any[]>([]);
    const [openDisputes, setOpenDisputes] = useState<any[]>([]);

    const [isRecalculating, setIsRecalculating] = useState(false);

    // (1) Summary
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getSupplierNetworkSummary('1');
                if (!cancelled) setSummary(data);
            } catch (err) {
                console.error('Summary fetch failed:', err);
            } finally {
                if (!cancelled) setSummaryLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [isRecalculating, refreshKey]);

    // (2) Table
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setTableLoading(true);
            setTableError(null);
            try {
                const data = await listSuppliers({
                    farmId: '1',
                    search: debouncedSearch,
                    type: tableType === 'All' ? '' : tableType,
                    sort: tableSort,
                    page: tablePage,
                    pageSize: tablePageSize,
                });
                if (cancelled) return;
                setTableRows(data?.rows || []);
                setTableTotal(data?.total ?? 0);
            } catch (err: any) {
                if (!cancelled) setTableError(err?.message || 'Failed to load suppliers');
            } finally {
                if (!cancelled) setTableLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [debouncedSearch, tableType, tableSort, tablePage, tablePageSize, refreshKey]);

    // (3) Debounce
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(tableSearch), 300);
        return () => clearTimeout(t);
    }, [tableSearch]);

    // (4) Reset page on filter change
    useEffect(() => { setTablePage(1); }, [debouncedSearch, tableType, tableSort]);

    // (5) Map
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getNetworkMapPoints('1');
                if (!cancelled) setMapData(data);
            } catch (err) {
                console.error('Map fetch failed:', err);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // (6) Queues
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await getEvidenceQueues('1');
                if (cancelled) return;
                setPendingCommitments(data?.pendingCommitments || []);
                setPendingInspections(data?.pendingInspections || []);
                setOpenDisputes(data?.openDisputes || []);
            } catch (err) {
                console.error('Queues fetch failed:', err);
            }
        })();
        return () => { cancelled = true; };
    }, [refreshKey]);

    const handleValidate = async (
        collection: 'supplier_commitments' | 'supplier_inspections',
        docId: string
    ) => {
        try {
            await getSupplierData('validateEvidence', {
                collection, docId, userId: 'portal-manager', farmId: '1',
            });
            if (collection === 'supplier_commitments') {
                setPendingCommitments(prev => prev.filter((c: any) => c.firestoreId !== docId));
            } else {
                setPendingInspections(prev => prev.filter((i: any) => i.firestoreId !== docId));
            }
            setRefreshKey(k => k + 1);
        } catch (error) {
            console.error('Validation failed:', error);
            alert('Failed to validate. Check the console for details.');
        }
    };

    const handleResolveDispute = async (disputeId: string, resolution: 'UPHELD' | 'REJECTED') => {
        try {
            await getSupplierData('resolveDispute', {
                disputeId, resolution, reviewedBy: 'portal-manager',
            });
            setOpenDisputes(prev => prev.filter((d: any) => d.id !== disputeId));
            setRefreshKey(k => k + 1);
        } catch (error) {
            console.error('Failed to resolve dispute:', error);
        }
    };

    // ---- Block 1: openSupplierDetail (verbatim) ----
    const openSupplierDetail = async (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setModalLoading(true);
        setActiveTab('profile');
        try {
            const [batchesData, financialsData] = await Promise.all([
                getSupplierData('getSupplierQualityBatches', { supplierId: supplier.id }),
                getSupplierData('getSupplierFinancials', { supplierId: supplier.id }),
            ]);
            const batches = batchesData.batches || [];
            setSupplierBatches(batches);
            setSupplierFinancials(financialsData);

            const last5Batches = batches.slice(0, 5);
            const trendScores = last5Batches
                .map((b: any) => b.rcnQualityScore ?? b.qualityScore)
                .filter((v: number | undefined): v is number => typeof v === 'number' && v > 0)
                .reverse();
            setSupplierTrend(trendScores);
        } catch (error) {
            console.error('Error fetching supplier details:', error);
        } finally {
            setModalLoading(false);
        }
    };

    // ---- Stub: no writes ----
    const handleRecalculateAll = () => {
        if (isRecalculating) return;
        setIsRecalculating(true);
        setTimeout(() => setIsRecalculating(false), 600);
    };

    const handleExport = async () => {
        if (exporting) return;
        setExporting(true);
        setTableError(null);
        try {
            const { filename, csv } = await exportSuppliers({
                farmId: '1',
                search: debouncedSearch,
                type: tableType === 'All' ? '' : tableType,
                sort: tableSort,
                // Reusing this page's existing "portal-manager" identity —
                // validateEvidence/resolveDispute already send the same value.
                // If/when this page gains a user context (like
                // SupplierDevelopmentPage's givenBy source), swap it here.
                exportedBy: 'portal-manager',
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err: any) {
            setTableError(err?.message || 'Export failed');
        } finally {
            setExporting(false);
        }
    };

    if (summaryLoading && !summary) {
        return (
            <main>
                <Section className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <DashboardNavbar />
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <GiFarmer className="text-primary text-3xl" />
                            </div>
                        </div>
                    </div>
                </Section>
            </main>
        );
    }

    // ---- Block 3: typeFilters (BUYER_READY removed per fix 3) + gradeStyle ----
    const typeFilters = [
        'All',
        'OWN_FARM',
        'COOPERATIVE',
        'REGIONAL_SUPPLIER',
        'INDEPENDENT_FARMER',
        'COMMERCIAL_AGGREGATOR',
        'PROCESSOR',
        'ACTIVE',
        'INACTIVE',
    ];

    const gradeStyle = (grade: string): string => {
        if (grade === 'PREMIUM')  return 'bg-amber-100 text-amber-700';
        if (grade === 'REJECT')   return 'bg-red-100 text-red-700';
        return 'bg-blue-100 text-blue-700';
    };

    const totalPages = Math.max(1, Math.ceil(tableTotal / tablePageSize));
    const showingFrom = tableTotal === 0 ? 0 : (tablePage - 1) * tablePageSize + 1;
    const showingTo = Math.min(tablePage * tablePageSize, tableTotal);
    const avgVolumeTonnes = summary ? (summary.verifiedVolumeKg / 1000).toFixed(1) : '—';

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            {/* 1. Hero Header */}
            <Section
                fullHeight={false}
                className="flex items-center justify-center text-center min-h-[40vh] relative"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaUsers className="inline mr-3 text-accent" />
                            Supplier & Partner Network
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Supplier Management
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <motion.div variants={fadeIn}>
                            <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                                Decide who to trust, and why. Every supplier is scored on quality, traceability,
                                sustainability, compliance and cooperation — with the evidence behind each score
                                visible, and confidence stated separately from performance.
                            </Typography>
                            <Typography variant="small" className="text-gray-500 max-w-2xl mx-auto mt-3">
                                Capacity is shown separately from trust. Missing evidence lowers confidence, not the score.
                            </Typography>
                            <motion.button
                                onClick={handleRecalculateAll}
                                disabled={isRecalculating}
                                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-white/60 border border-primary/30 text-primary hover:bg-primary hover:text-white rounded-full text-sm font-medium transition-all duration-300 shadow-sm backdrop-blur-sm disabled:opacity-50"
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaHistory className={isRecalculating ? 'animate-spin' : ''} />
                                {isRecalculating ? 'Recalculating...' : 'Recalculate & Snapshot Scores'}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Section>

            {/* 2. KPI strip */}
            <Section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-5 gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn}>
                            <InfoCard icon={FaUsers} title={String(summary?.totalSuppliers ?? '—')} subtitle="Total Suppliers" iconColor="text-accent" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.05 }}>
                            <InfoCard icon={FaCheckCircle} title={String(summary?.activeSuppliers ?? '—')} subtitle="Active Suppliers" iconColor="text-green-600" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.1 }}>
                            <InfoCard icon={FaHandshake} title={String(summary?.buyerReadyCount ?? '—')} subtitle="Buyer ready (internal)" iconColor="text-primary" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.15 }}>
                            <InfoCard
                                icon={FaStar}
                                title={summary?.avgTrustOverall != null ? summary.avgTrustOverall.toFixed(1) : '—'}
                                subtitle={`Avg Trust · across ${summary?.scoredCount ?? 0} scored`}
                                iconColor="text-yellow-500"
                                showInfoBadge={false}
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.2 }}>
                            <InfoCard icon={FaBox} title={`${avgVolumeTonnes} T`} subtitle="Annual volume (verified)" iconColor="text-primary" showInfoBadge={false} />
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* 3 + 4. Evidence & Disputes — verbatim queue JSX, names from item.supplierName */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InfoCard
                        icon={FaShieldAlt}
                        title="Evidence to review"
                        subtitle={`${(summary?.queueCounts?.pendingCommitments ?? 0) + (summary?.queueCounts?.pendingInspections ?? 0)} record${(summary?.queueCounts?.pendingCommitments ?? 0) + (summary?.queueCounts?.pendingInspections ?? 0) !== 1 ? 's' : ''} awaiting review`}
                        iconColor="text-amber-600"
                        showInfoBadge={false}
                    >
                        <div className="space-y-2 mt-3">
                            <div className="flex justify-between text-sm">
                                <span>Commitments awaiting validation</span>
                                <span className="font-semibold">{summary?.queueCounts?.pendingCommitments ?? 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Inspections awaiting validation</span>
                                <span className="font-semibold">{summary?.queueCounts?.pendingInspections ?? 0}</span>
                            </div>
                        </div>
                        <details className="mt-3" open>
                            <summary className="text-xs text-primary cursor-pointer select-none">Review queue</summary>
                            <div className="mt-3">
                                {pendingCommitments.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                                            <FaHandshake /> Commitments ({pendingCommitments.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {pendingCommitments.map(c => (
                                                <div key={c.id} className="bg-white/40 rounded-xl p-3 border border-white/30 flex items-center gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-gray-900 truncate">
                                                                {c.supplierName || `Supplier #${c.supplierId}`}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500">
                                                                {c.contractId} · {c.season}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-0.5">
                                                            {c.committedKg} kg committed · {c.status}
                                                            {c.delayReason && ` · Delay: ${c.delayReason}`}
                                                            {c.buyerRequestedChange && ` · Buyer-requested`}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleValidate('supplier_commitments', c.firestoreId)}
                                                        className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-full hover:bg-dark-orange transition-colors flex-shrink-0"
                                                    >Validate</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {pendingInspections.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                                            <FaCheckCircle /> Inspections ({pendingInspections.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {pendingInspections.map(i => (
                                                <div key={i.id} className="bg-white/40 rounded-xl p-3 border border-white/30 flex items-center gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-gray-900 truncate">
                                                                {i.supplierName || `Supplier #${i.supplierId}`}
                                                            </span>
                                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                                                i.outcome === 'PASS' ? 'bg-green-100 text-green-700' :
                                                                    i.outcome === 'FAIL' ? 'bg-red-100 text-red-700' :
                                                                        'bg-amber-100 text-amber-700'
                                                            }`}>{i.outcome}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-0.5">
                                                            {i.inspectionType} · {i.findings}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleValidate('supplier_inspections', i.firestoreId)}
                                                        className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-full hover:bg-dark-orange transition-colors flex-shrink-0"
                                                    >Validate</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {pendingCommitments.length === 0 && pendingInspections.length === 0 && (
                                    <p className="text-xs text-gray-400">Queue is clear.</p>
                                )}
                            </div>
                        </details>
                    </InfoCard>

                    <InfoCard
                        icon={FaExclamationTriangle}
                        title="Open disputes"
                        subtitle={`${summary?.queueCounts?.openDisputes ?? 0} open dispute${(summary?.queueCounts?.openDisputes ?? 0) !== 1 ? 's' : ''}`}
                        iconColor="text-red-600"
                        showInfoBadge={false}
                    >
                        <div className="space-y-2 mt-3">
                            {openDisputes.map(d => (
                                <div key={d.id} className="bg-white/40 rounded-xl p-3 border border-white/30">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {d.supplierName || `Supplier #${d.supplierId}`}
                                                </span>
                                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full font-medium">{d.reviewStatus}</span>
                                                <span className="text-[10px] text-gray-500">Target: {d.targetEntity} #{d.targetId}</span>
                                            </div>
                                            <p className="text-xs text-gray-700 mt-1">{d.reason}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleResolveDispute(d.id, 'UPHELD')}
                                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700"
                                            >Upheld</button>
                                            <button
                                                onClick={() => handleResolveDispute(d.id, 'REJECTED')}
                                                className="px-3 py-1.5 bg-gray-500 text-white text-xs font-medium rounded-full hover:bg-gray-600"
                                            >Rejected</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {openDisputes.length === 0 && (
                                <p className="text-xs text-gray-400">No open disputes.</p>
                            )}
                        </div>
                    </InfoCard>
                </div>
            </Section>

            {/* 5. Consent band */}
            <Section className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <InfoCard
                            icon={FaShieldAlt}
                            title="Consent & Data Trust"
                            subtitle="Farmer data is held in trust — shared with buyers only where consent is recorded"
                            iconColor="text-primary"
                            showInfoBadge={false}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                {[
                                    { label: 'Full consent', value: summary?.consentCounts?.full ?? 0, icon: FaShieldAlt, color: 'text-primary' },
                                    { label: 'Partial consent', value: summary?.consentCounts?.partial ?? 0, icon: FaUser, color: 'text-accent' },
                                    { label: 'No consent', value: summary?.consentCounts?.none ?? 0, icon: FaMapMarkerAlt, color: 'text-amber-600' },
                                    { label: 'Withdrawn', value: summary?.consentCounts?.withdrawn ?? 0, icon: FaCamera, color: 'text-red-500' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/40 rounded-xl p-3 border border-white/30 text-center">
                                        <item.icon className={`text-xl mx-auto ${item.color}`} />
                                        <div className="text-lg font-bold mt-1">{item.value}</div>
                                        <div className="text-xs text-gray-500">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            {/* 6. All suppliers table */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <GlassCard>
                            {/* Header — GlassCard has no built-in title/icon */}
                            <div className="flex items-start gap-3 mb-4">
                                <FaUsers className="text-accent text-xl mt-1" />
                                <div>
                                    <h2 className="text-lg font-semibold text-text-dark">All suppliers</h2>
                                    <p className="text-xs text-gray-500">
                                        Search the network and open a profile for batches, trust and financials.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-3">
                                <div className="relative flex-1 min-w-[240px]">
                                    <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search name or contact..."
                                        value={tableSearch}
                                        onChange={(e) => setTableSearch(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/60 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {typeFilters.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setTableType(type)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                                tableType === type
                                                    ? 'bg-primary text-white shadow'
                                                    : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                                            }`}
                                        >
                                            {type === 'All' ? 'All Types' : type.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                                <select
                                    value={tableSort}
                                    onChange={(e) => setTableSort(e.target.value as any)}
                                    className="px-3 py-2 rounded-full border border-gray-300 bg-white/60 text-sm"
                                >
                                    <option value="name">Name</option>
                                    <option value="trust_desc">Trust (high → low)</option>
                                    <option value="trust_asc">Trust (low → high)</option>
                                    <option value="volume_desc">Volume (high → low)</option>
                                    <option value="quality_desc">Quality (high → low)</option>
                                </select>
                                <button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="px-4 py-2 rounded-full bg-white/60 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                                >{exporting ? 'Exporting…' : 'Export'}</button>
                            </div>

                            {tableError && (
                                <div className="mt-3 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                                    {tableError}
                                </div>
                            )}

                            <div className="relative mt-4">
                                {tableLoading && (
                                    <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                )}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="border-b border-gray-200 text-left">
                                            <th className="pb-2 font-medium text-gray-600">Supplier</th>
                                            <th className="pb-2 font-medium text-gray-600">Type</th>
                                            <th className="pb-2 font-medium text-gray-600">Trust</th>
                                            <th className="pb-2 font-medium text-gray-600">Quality — Avg KOR</th>
                                            <th className="pb-2 font-medium text-gray-600">Volume (Verified)</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tableRows.map((row: any) => (
                                            <tr
                                                key={row.id}
                                                onClick={() => openSupplierDetail(row as Supplier)}
                                                className="border-b border-gray-100 last:border-0 hover:bg-white/40 cursor-pointer"
                                            >
                                                <td className="py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                                                            {(row.name || '?').slice(0, 1).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-medium truncate">{row.name}</div>
                                                            <div className="text-[11px] text-gray-500 truncate">
                                                                {row.location} · {row.contactPerson || '—'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-xs">{String(row.type || '').replace(/_/g, ' ')}</td>
                                                <td className="py-3">
                                                    {row.overall == null ? (
                                                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">Evidence pending</span>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold">{row.overall}</span>
                                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                                                row.confidence === 'established' ? 'bg-green-100 text-green-700' :
                                                                    row.confidence === 'developing' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-amber-100 text-amber-700'
                                                            }`}>{row.confidence}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-3 text-sm">
                                                    {row.avgKorGPerKg != null ? `${Number(row.avgKorGPerKg).toFixed(0)} g/kg` : '—'}
                                                </td>
                                                <td className="py-3 text-sm">
                                                    {row.verifiedVolumeKg != null ? `${(Number(row.verifiedVolumeKg) / 1000).toFixed(1)} T` : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                        {!tableLoading && tableRows.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">No suppliers match these filters.</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 text-xs text-gray-600">
                                <span>Showing {showingFrom}–{showingTo} of {tableTotal}</span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={tablePage <= 1}
                                        onClick={() => setTablePage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1.5 rounded-full border border-gray-300 disabled:opacity-40"
                                    >Prev</button>
                                    <button
                                        disabled={tablePage >= totalPages}
                                        onClick={() => setTablePage(p => Math.min(totalPages, p + 1))}
                                        className="px-3 py-1.5 rounded-full border border-gray-300 disabled:opacity-40"
                                    >Next</button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </Section>

            {/* 7. Highest Trust + Maturity — fix 4 */}
            <Section className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InfoCard
                        icon={FaShieldAlt}
                        title="Highest Trust Scores"
                        subtitle="Ranked by evidence-backed performance, not volume"
                        iconColor="text-green-600"
                        showInfoBadge={false}
                    >
                        <div className="space-y-2 mt-3">
                            {(summary?.topTrust || []).slice(0, 5).map((row: any, i: number) => (
                                <div key={row.supplierId ?? row.id ?? i} className="flex items-center gap-3 bg-white/40 rounded-xl p-2.5 border border-white/30">
                                    <span className="w-6 text-sm font-bold text-gray-400 text-center">#{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{row.name}</p>
                                        <p className="text-[10px] text-gray-500">
                                            {row.verifiedTransactions} verified batch{row.verifiedTransactions !== 1 ? 'es' : ''}
                                        </p>
                                    </div>
                                    <span className={`text-sm font-bold ${
                                        (row.overall ?? 0) >= 85 ? 'text-green-600' :
                                            (row.overall ?? 0) >= 70 ? 'text-primary' :
                                                (row.overall ?? 0) >= 50 ? 'text-amber-600' : 'text-red-600'
                                    }`}>{row.overall}</span>
                                </div>
                            ))}
                            {(!summary?.topTrust || summary.topTrust.length === 0) && (
                                <p className="text-sm text-gray-500 text-center py-4">No scored suppliers yet.</p>
                            )}
                        </div>
                    </InfoCard>

                    <InfoCard
                        icon={FaHistory}
                        title="Evidence Maturity"
                        subtitle="How much verified history supports our supplier assessments"
                        iconColor="text-blue-600"
                        showInfoBadge={false}
                    >
                        <div className="space-y-3 mt-3">
                            {(() => {
                                const c = summary?.maturityCounts || { preliminary: 0, developing: 0, established: 0 };
                                const total = c.preliminary + c.developing + c.established;
                                const tiers = [
                                    { key: 'preliminary', label: 'Preliminary', range: '0–2 batches', color: 'bg-amber-500', text: 'text-amber-700' },
                                    { key: 'developing', label: 'Developing', range: '3–9 batches', color: 'bg-blue-500', text: 'text-blue-700' },
                                    { key: 'established', label: 'Established', range: '10+ batches', color: 'bg-green-500', text: 'text-green-700' },
                                ];
                                return tiers.map(t => (
                                    <div key={t.key} className="bg-white/40 rounded-xl p-3 border border-white/30">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={`text-sm font-semibold ${t.text}`}>{t.label}</span>
                                            <span className="text-xl font-bold">{c[t.key] ?? 0}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 mb-1.5">{t.range}</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`${t.color} h-2 rounded-full`} style={{ width: `${total > 0 ? ((c[t.key] ?? 0) / total) * 100 : 0}%` }} />
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 text-center">
                            Missing evidence lowers confidence — never the trust score itself.
                        </p>
                    </InfoCard>
                </div>
            </Section>

            {/* 8 + 9. Risk & Development — GlassCard, two-up */}
            <Section className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Risk & Attention */}
                    <GlassCard>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FaExclamationTriangle className="text-amber-600 text-sm" />
                                <h3 className="text-sm font-semibold text-text-dark">Risk & Attention</h3>
                            </div>
                            {(summary?.riskCounts?.critical ?? 0) > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-medium">
                        {summary.riskCounts.critical} critical
                    </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-3 text-[11px] text-gray-600">
                            <span><span className="font-bold text-red-600">{summary?.riskCounts?.critical ?? 0}</span> critical</span>
                            <span><span className="font-bold text-amber-600">{summary?.riskCounts?.high ?? 0}</span> high</span>
                            <span><span className="font-bold text-yellow-600">{summary?.riskCounts?.medium ?? 0}</span> medium</span>
                            <span><span className="font-bold text-gray-700">{summary?.riskCounts?.low ?? 0}</span> low</span>
                        </div>
                        {summary?.topRisk && (
                            <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-600 truncate">
                    <span className="truncate">
                        Top: <span className="font-medium text-text-dark">{summary.topRisk.name}</span>
                        {summary.topRisk.overall != null && <span className="ml-1 text-gray-500">· {summary.topRisk.overall}</span>}
                    </span>
                                {summary.topRisk.hasCriticalViolation && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-medium shrink-0">critical</span>
                                )}
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/dashboard/suppliers/risk')}
                            className="mt-3 text-[11px] font-medium text-amber-700 hover:text-amber-800"
                        >Open Risk Workbench →</button>
                    </GlassCard>

                    {/* Supplier Development */}
                    <GlassCard>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <FaHandshake className="text-primary text-sm" />
                                <h3 className="text-sm font-semibold text-text-dark">Supplier Development</h3>
                            </div>
                            <span className="text-[10px] text-gray-500">
                    {summary?.developmentCounts?.visibleOpportunities ?? 0} opportunities
                </span>
                        </div>
                        <div className="flex items-baseline gap-3 text-[11px] text-gray-600">
                            <span><span className="font-bold text-primary">{summary?.developmentCounts?.openActions ?? 0}</span> open actions</span>
                            <span><span className="font-bold text-accent">{summary?.developmentCounts?.visibleOpportunities ?? 0}</span> opportunities</span>
                        </div>
                        {summary?.developmentCounts?.topOpportunity && (
                            <div className="mt-2 text-[11px] text-gray-600 truncate">
                                Top: <span className="font-medium text-text-dark">{summary.developmentCounts.topOpportunity.name}</span>
                                {summary.developmentCounts.topOpportunity.weakness && (
                                    <span className="text-gray-500"> · {summary.developmentCounts.topOpportunity.weakness}</span>
                                )}
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/dashboard/suppliers/development')}
                            className="mt-3 text-[11px] font-medium text-primary hover:text-dark-orange"
                        >Open Development Workbench →</button>
                    </GlassCard>
                </div>
            </Section>

            {/* 10. Financial efficiency */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <InfoCard
                        icon={FaDollarSign}
                        title="Supplier Financial Efficiency"
                        subtitle="Revenue generated per 1 FCFA spent on procurement"
                        iconColor="text-primary"
                        showInfoBadge={false}
                    >
                        <div className="overflow-x-auto mt-3">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="pb-2 font-medium text-gray-600">Supplier</th>
                                    <th className="pb-2 font-medium text-gray-600">Procurement</th>
                                    <th className="pb-2 font-medium text-gray-600">Revenue</th>
                                    <th className="pb-2 font-medium text-gray-600">Efficiency</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(summary?.financialEfficiency || []).slice(0, 5).map((row: any, i: number) => (
                                    <tr key={row.id ?? i} className="border-b border-gray-100 last:border-0">
                                        <td className="py-2 font-medium">{row.name || row.supplier}</td>
                                        <td className="py-2">{new Intl.NumberFormat('fr-FR').format(row.procurement || 0)} FCFA</td>
                                        <td className="py-2">{new Intl.NumberFormat('fr-FR').format(row.revenue || 0)} FCFA</td>
                                        <td className="py-2">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    Number(row.efficiency) > 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>{Number(row.efficiency || 0).toFixed(1)}x</span>
                                        </td>
                                    </tr>
                                ))}
                                {(!summary?.financialEfficiency || summary.financialEfficiency.length === 0) && (
                                    <tr><td colSpan={4} className="py-4 text-center text-sm text-gray-500">No linked financials yet.</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </InfoCard>
                </div>
            </Section>

            {/* 11. Map LAST */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-accent text-sm" />
                                <h3 className="text-sm font-semibold text-text-dark">Network locations</h3>
                            </div>
                            <span className="text-[11px] text-gray-500">
                                {mapData
                                    ? `${mapData.shownCount} of ${mapData.totalSuppliers} shown`
                                    : 'Loading map points...'}
                            </span>
                        </div>
                        {mapData && <SupplierMap suppliers={mapData.points} className="mb-2" />}
                        {mapData && (
                            <p className="mt-2 text-[10px] text-gray-400 text-center">
                                Suppliers without location consent are excluded.
                            </p>
                        )}
                    </div>
                </div>
            </Section>

            {/* Detail modal — fix 1: TrustPanel gets selectedSupplier.trust; Annual Volume / Avg RCN restored */}
            <Transition.Root show={!!selectedSupplier} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedSupplier(null)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:scale-95"
                            >
                                <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl text-left shadow-xl backdrop-blur-lg transition-all"
                                              style={{
                                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.9) 100%)',
                                                  border: '1px solid rgba(255,255,255,0.5)',
                                                  boxShadow: '0 8px 32px rgba(165, 105, 66, 0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
                                              }}
                                >
                                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl animate-pulse"
                                         style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }} />
                                    <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full opacity-8 blur-3xl"
                                         style={{ background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)' }} />

                                    <div className="relative z-10 p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <Dialog.Title as="h2" className="text-2xl font-bold text-primary">
                                                    {selectedSupplier?.name}
                                                </Dialog.Title>
                                                <p className="text-sm text-gray-500">{selectedSupplier?.type?.replace(/_/g, ' ')} · {selectedSupplier?.location}</p>
                                            </div>
                                            <button onClick={() => setSelectedSupplier(null)} className="text-gray-400 hover:text-gray-600">
                                                <FaTimes className="text-xl" />
                                            </button>
                                        </div>

                                        <div className="flex border-b border-gray-200 mb-6">
                                            {['profile', 'quality', 'financials'].map(tab => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab as any)}
                                                    className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                                                        activeTab === tab
                                                            ? 'border-b-2 border-primary text-primary'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                >
                                                    {tab === 'profile' ? 'Profile & Compliance' : tab === 'quality' ? 'Quality History' : 'Financials'}
                                                </button>
                                            ))}
                                        </div>

                                        {modalLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {activeTab === 'profile' && selectedSupplier && (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            {selectedSupplier.photoUrl ? (
                                                                <img src={selectedSupplier.photoUrl} alt={selectedSupplier.name}
                                                                     className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
                                                            ) : (
                                                                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                                                                    selectedSupplier.type === 'OWN_FARM' ? 'bg-green-100' : 'bg-primary/10'
                                                                }`}>
                                                                    {selectedSupplier.type === 'OWN_FARM'
                                                                        ? <FaHome className="text-green-600 text-2xl" />
                                                                        : <FaUsers className="text-primary text-2xl" />}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="text-xl font-bold text-primary">{selectedSupplier.name}</h3>
                                                                    {selectedSupplier.type === 'OWN_FARM' && (
                                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Own Farm</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-500">{selectedSupplier.type?.replace(/_/g, ' ')} · {selectedSupplier.status}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FaStar key={i} className={i < (selectedSupplier.rating ?? 0) ? 'text-yellow-500' : 'text-gray-300'} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <TrustPanel trust={selectedSupplier.trust} />

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Contact Information</h4>
                                                                <p className="text-sm flex items-center gap-2"><FaUser className="text-gray-400" /> {selectedSupplier.contactPerson}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaPhone className="text-gray-400" /> {selectedSupplier.phone}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaEnvelope className="text-gray-400" /> {selectedSupplier.email}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {selectedSupplier.location}</p>
                                                            </div>
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Business Information</h4>
                                                                <p className="text-sm"><strong>Region:</strong> {selectedSupplier.region || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Country:</strong> {selectedSupplier.country || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Registration #:</strong> {selectedSupplier.registrationNumber || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Tax ID:</strong> {selectedSupplier.taxId || 'N/A'}</p>
                                                                {selectedSupplier.farmSize ? <p className="text-sm"><strong>Farm Size:</strong> {selectedSupplier.farmSize} ha</p> : null}
                                                                {selectedSupplier.yearsFarming ? <p className="text-sm"><strong>Years Farming:</strong> {selectedSupplier.yearsFarming}</p> : null}
                                                                <p className="text-sm">
                                                                    <strong>Annual Volume:</strong>{' '}
                                                                    {selectedSupplier.annualVolumeKg && selectedSupplier.annualVolumeKg > 0
                                                                        ? `${(selectedSupplier.annualVolumeKg / 1000).toFixed(1)}T`
                                                                        : 'N/A'}
                                                                </p>
                                                                <p className="text-sm">
                                                                    <strong>RCN Quality:</strong>{' '}
                                                                    {selectedSupplier.averageRcnQualityScore != null
                                                                        ? `${selectedSupplier.averageRcnQualityScore.toFixed(1)}`
                                                                        : 'Pending'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2">Certifications</h4>
                                                            {selectedSupplier.isCertified ? (
                                                                <div className="space-y-1">
                                                                    <p className="text-sm"><strong>Type:</strong> {selectedSupplier.certificationType || 'N/A'}</p>
                                                                    <p className="text-sm"><strong>Number:</strong> {selectedSupplier.certificationNumber || 'N/A'}</p>
                                                                    {selectedSupplier.certificationExpiryDate ? (
                                                                        <p className="text-sm"><strong>Expires:</strong> {new Date(selectedSupplier.certificationExpiryDate).toLocaleDateString()}</p>
                                                                    ) : null}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500">Not certified</p>
                                                            )}
                                                        </div>

                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2">Sustainability Compliance</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                <div className="flex items-center gap-2">
                                                                    {selectedSupplier.sustainableHarvesting ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                                                                    <span className="text-sm">Sustainable Harvesting</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {selectedSupplier.firebreakProtection ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                                                                    <span className="text-sm">Firebreak Protection</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {selectedSupplier.noChildLabor ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                                                                    <span className="text-sm">No Child Labor</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-500">Has Location: {selectedSupplier.hasLocation ? 'Yes' : 'No'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                                                                <FaShieldAlt /> Data Consent & Trust
                                                            </h4>
                                                            {selectedSupplier.dataConsentGiven ? (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <FaCheckCircle className="text-green-500" />
                                                                        <span className="text-sm font-medium text-green-700">Consent on record</span>
                                                                        {selectedSupplier.dataConsentVersion && (
                                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">v{selectedSupplier.dataConsentVersion}</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-gray-600">
                                                                        Signed by <strong>{selectedSupplier.dataConsentSignedBy}</strong>
                                                                        {selectedSupplier.farmerIdNumber && <> · Farmer ID: {selectedSupplier.farmerIdNumber}</>}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        {['identity', 'location', 'photo'].map(scope => {
                                                                            const has = selectedSupplier.dataConsentScope?.includes(scope);
                                                                            return (
                                                                                <span key={scope} className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                                                                    has ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 line-through'
                                                                                }`}>
                                                                                    {has ? <FaCheckCircle className="text-[10px]" /> : <FaTimesCircle className="text-[10px]" />}
                                                                                    {scope.charAt(0).toUpperCase() + scope.slice(1)} shared
                                                                                </span>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <FaTimesCircle className="text-amber-500" />
                                                                    <span className="text-sm text-amber-700">No consent on record — identity and location withheld from buyers</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {selectedSupplier.notes && (
                                                            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200">
                                                                <h4 className="font-medium text-amber-700 mb-2">Internal Notes</h4>
                                                                <p className="text-sm text-gray-700">{selectedSupplier.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'quality' && (
                                                    <div>
                                                        {supplierBatches.length === 0 ? (
                                                            <div className="text-center py-8 text-gray-400">
                                                                <FaBox className="text-3xl mx-auto mb-2" />
                                                                <Typography variant="small">No quality batches recorded for this supplier yet.</Typography>
                                                            </div>
                                                        ) : (
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full text-sm">
                                                                    <thead>
                                                                    <tr className="border-b border-gray-200 text-left">
                                                                        <th className="pb-2 font-medium text-gray-600">Batch #</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Date</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Weight</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Grade</th>
                                                                        <th className="pb-2 font-medium text-gray-600">RCN Score</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Moisture</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Defects</th>
                                                                        <th className="pb-2 font-medium text-gray-600">KOR (g/kg)</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {supplierBatches.map(batch => (
                                                                        <tr key={batch.id} className="border-b border-gray-100 last:border-0 hover:bg-white/20">
                                                                            <td className="py-2 font-medium">{batch.batchNumber}</td>
                                                                            <td className="py-2 text-xs">{new Date(batch.processingDate).toLocaleDateString()}</td>
                                                                            <td className="py-2">{batch.weightKg?.toLocaleString()} kg</td>
                                                                            <td className="py-2">
                                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${gradeStyle(batch.qualityGrade)}`}>{batch.qualityGrade}</span>
                                                                            </td>
                                                                            <td className="py-2">{(batch as any).rcnQualityScore != null ? Number((batch as any).rcnQualityScore).toFixed(1) : '—'}</td>
                                                                            <td className="py-2">{Number(batch.moistureContent ?? 0).toFixed(1)}%</td>
                                                                            <td className="py-2">{Number(batch.defectiveRate ?? 0).toFixed(1)}%</td>
                                                                            <td className="py-2">{(batch as any).korGPerKg != null ? `${Number((batch as any).korGPerKg).toFixed(0)} g` : '—'}</td>
                                                                        </tr>
                                                                    ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                        {supplierTrend.length > 0 && (
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30 mt-4">
                                                                <h4 className="font-medium text-primary mb-2">Quality Trend</h4>
                                                                <div className="flex items-center gap-3">
                                                                    <Sparkline data={supplierTrend} width={120} height={36} color="#5A7411" />
                                                                    <div className="text-sm text-gray-600">
                                                                        {supplierTrend.length >= 2
                                                                            ? `${supplierTrend[0].toFixed(1)} → ${supplierTrend[supplierTrend.length - 1].toFixed(1)}`
                                                                            : 'Not enough data'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'financials' && (
                                                    <div>
                                                        {!supplierFinancials || (supplierFinancials.totalProcurement === 0 && supplierFinancials.totalRevenue === 0) ? (
                                                            <div className="text-center py-8 text-gray-400">
                                                                <FaDollarSign className="text-3xl mx-auto mb-2" />
                                                                <Typography variant="small">No financial data recorded for this supplier yet.</Typography>
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="bg-green-50/50 rounded-xl p-4 border border-green-200 text-center">
                                                                    <p className="text-sm text-gray-500">Total Procured</p>
                                                                    <p className="text-2xl font-bold text-green-700">
                                                                        {new Intl.NumberFormat('fr-FR').format(supplierFinancials.totalProcurement)} FCFA
                                                                    </p>
                                                                </div>
                                                                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200 text-center">
                                                                    <p className="text-sm text-gray-500">Revenue from Batches</p>
                                                                    <p className="text-2xl font-bold text-blue-700">
                                                                        {new Intl.NumberFormat('fr-FR').format(supplierFinancials.totalRevenue)} FCFA
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default SupplierManagement;