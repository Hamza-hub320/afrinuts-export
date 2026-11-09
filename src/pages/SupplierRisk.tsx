import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaExclamationTriangle, FaSearch, FaCheckCircle, FaTimes,
    FaShieldAlt, FaClipboardCheck, FaBalanceScale, FaHistory,
    FaArrowDown, FaArrowUp, FaChevronLeft, FaFileAlt
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getSupplierData } from '../services/api';
import { computeTrustScore, TrustResult } from '@/utils/trustScore';
import { GiFarmer } from 'react-icons/gi';
import { useAuth } from '@/contexts/AuthContext';

interface Supplier {
    id: string;
    firestoreId?: string;
    name: string;
    type: string;
    status: string;
    isActive: boolean;
    yearsFarming?: number;
    [key: string]: any;
}

type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
type SortMode = 'severity' | 'trust_asc' | 'trust_desc' | 'name_asc' | 'flags_desc';

const PAGE_SIZE = 4;

const severityOf = (trust: TrustResult): 'critical' | 'high' | 'medium' | 'low' => {
    if (trust.hasCriticalViolation) return 'critical';
    if ((trust.overall ?? 100) < 40) return 'high';
    if ((trust.overall ?? 100) < 60) return 'medium';
    return 'low';
};

const severityColor = (sev: SeverityFilter): string =>
    sev === 'critical' ? 'bg-red-600' :
        sev === 'high' ? 'bg-orange-500' :
            sev === 'medium' ? 'bg-amber-500' : 'bg-blue-500';

const SupplierRisk: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [batchesBySupplier, setBatchesBySupplier] = useState<Record<string, any[]>>({});
    const [commitmentsBySupplier, setCommitmentsBySupplier] = useState<Record<string, any[]>>({});
    const [inspectionsBySupplier, setInspectionsBySupplier] = useState<Record<string, any[]>>({});
    const [pendingCommitments, setPendingCommitments] = useState<any[]>([]);
    const [pendingInspections, setPendingInspections] = useState<any[]>([]);
    const [openDisputes, setOpenDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [correctedValues, setCorrectedValues] = useState<Record<string, string>>({});


    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
    const [sortMode, setSortMode] = useState<SortMode>('trust_asc');
    const [page, setPage] = useState(1);

    const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAll = async () => {
        try {
            const [data, disputesRes] = await Promise.allSettled([
                getSupplierData('getSuppliersWithTrust'),
                getSupplierData('getOpenDisputes'),
            ]);

            if (data.status === 'fulfilled' && data.value) {
                setSuppliers(data.value.suppliers || []);
                setBatchesBySupplier(data.value.batchesBySupplier || {});
                setCommitmentsBySupplier(data.value.commitmentsBySupplier || {});
                setInspectionsBySupplier(data.value.inspectionsBySupplier || {});
                setPendingCommitments(data.value.pendingCommitments || []);
                setPendingInspections(data.value.pendingInspections || []);
            }
            if (disputesRes.status === 'fulfilled' && disputesRes.value) {
                setOpenDisputes(disputesRes.value.disputes || []);
            }
        } catch (error) {
            console.error('Error fetching risk data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const trustBySupplier = useMemo(() => {
        const map: Record<string, TrustResult> = {};
        suppliers.forEach(s => {
            map[s.id] = computeTrustScore({
                supplier: { ...s, isActive: s.isActive ?? s.status === 'ACTIVE' },
                batches: batchesBySupplier[s.id] || [],
                commitments: commitmentsBySupplier[s.id] || [],
                inspections: inspectionsBySupplier[s.id] || [],
            });
        });
        return map;
    }, [suppliers, batchesBySupplier, commitmentsBySupplier, inspectionsBySupplier]);

    const counts = useMemo(() => {
        const c = { critical: 0, high: 0, medium: 0, low: 0 };
        suppliers.forEach(s => {
            const t = trustBySupplier[s.id];
            if (t && (t.flags.length > 0 || t.hasCriticalViolation)) {
                const sev = severityOf(t);
                c[sev]++;
            }
        });
        return c;
    }, [suppliers, trustBySupplier]);

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return suppliers
            .map(s => ({ supplier: s, trust: trustBySupplier[s.id] }))
            .filter(x => x.trust && (x.trust.flags.length > 0 || x.trust.hasCriticalViolation))
            .filter(x => {
                if (severityFilter !== 'all' && severityOf(x.trust) !== severityFilter) return false;
                if (q && !x.supplier.name.toLowerCase().includes(q)) return false;
                return true;
            })
            .sort((a, b) => {
                const sevOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                if (sortMode === 'severity') {
                    const sevA = sevOrder[severityOf(a.trust)];
                    const sevB = sevOrder[severityOf(b.trust)];
                    if (sevA !== sevB) return sevA - sevB;
                    return (a.trust.overall ?? 100) - (b.trust.overall ?? 100);
                }
                if (sortMode === 'trust_asc') return (a.trust.overall ?? 100) - (b.trust.overall ?? 100);
                if (sortMode === 'trust_desc') return (b.trust.overall ?? 0) - (a.trust.overall ?? 0);
                if (sortMode === 'flags_desc') return b.trust.flagDetails.length - a.trust.flagDetails.length;
                return a.supplier.name.localeCompare(b.supplier.name);
            });
    }, [suppliers, trustBySupplier, severityFilter, searchQuery, sortMode]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    useEffect(() => { setPage(1); }, [severityFilter, searchQuery, sortMode]);

    // Selected supplier workspace
    const selected = selectedSupplierId
        ? suppliers.find(s => s.id === selectedSupplierId) || null
        : null;
    const selectedTrust = selectedSupplierId ? trustBySupplier[selectedSupplierId] : null;
    const selectedBatches = selectedSupplierId ? batchesBySupplier[selectedSupplierId] || [] : [];
    const selectedPendingCommitments = selectedSupplierId
        ? pendingCommitments.filter((c: any) => String(c.supplierId) === selectedSupplierId)
        : [];
    const selectedPendingInspections = selectedSupplierId
        ? pendingInspections.filter((i: any) => String(i.supplierId) === selectedSupplierId)
        : [];
    const selectedDisputes = selectedSupplierId
        ? openDisputes.filter((d: any) => String(d.supplierId) === selectedSupplierId)
        : [];

    const handleValidate = async (
        collection: 'supplier_commitments' | 'supplier_inspections',
        firestoreId: string
    ) => {
        setActionLoading(true);
        try {
            await getSupplierData('validateEvidence', {
                collection,
                docId: firestoreId,
                userId: 'portal-manager',
                farmId: '1',
            });
            await fetchAll();
        } catch (error) {
            console.error('Validation failed:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const findCriticalSource = (
        inspections: any[],
        batches: any[]
    ): { inspection: any; batch: any } | null => {
        const criticalFail = inspections.find(
            i => i.severity === 'CRITICAL' && i.outcome === 'FAIL' && i.validatedAt
        );
        if (!criticalFail) return null;
        const linkedBatch = criticalFail.linkedBatchIds
            ? batches.find(b => criticalFail.linkedBatchIds.includes(Number(b.id)))
            : null;
        return { inspection: criticalFail, batch: linkedBatch };
    };

    const handleResolveDispute = async (disputeId: string, resolution: 'UPHELD' | 'REJECTED') => {
        setActionLoading(true);
        try {
            const dispute = openDisputes.find((d: any) => (d.firestoreId || d.id) === disputeId);
            const payload: any = {
                disputeId,
                resolution,
                reviewedBy: user?.email || 'portal-manager',
            };

            // R4 — if batch dispute is upheld and a corrected value was entered, send it
            if (
                resolution === 'UPHELD' &&
                dispute?.targetEntity === 'batch' &&
                correctedValues[disputeId]
            ) {
                payload.originalValue = dispute.originalValue ?? null;
                payload.correctedValue = parseFloat(correctedValues[disputeId]);
                payload.correctionApplied = true;
            }

            await getSupplierData('resolveDispute', payload);
            await fetchAll();
        } catch (error) {
            console.error('Dispute resolution failed:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRecalculate = async () => {
        if (!selected || !selectedTrust) return;
        setActionLoading(true);
        try {
            await getSupplierData('saveScoreSnapshot', {
                supplierId: selected.firestoreId || selected.id,
                snapshotData: {
                    overall: selectedTrust.overall,
                    confidence: selectedTrust.confidence,
                    verifiedTransactions: selectedTrust.verifiedTransactions,
                    dimensions: selectedTrust.dimensions,
                    weightsUsed: selectedTrust.weights,
                    scoringVersion: selectedTrust.scoringVersion,
                    evidenceRefs: {
                        batchIds: selectedBatches.map((b: any) => b.firestoreId || b.id),
                    },
                },
            });
            await fetchAll();
        } catch (error) {
            console.error('Recalculate failed:', error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <main>
                <DashboardNavbar />
                <Section className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <GiFarmer className="text-primary text-3xl" />
                        </div>
                    </div>
                </Section>
            </main>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            <Section className="flex items-center justify-center text-center min-h-[25vh] relative">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-8" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-amber-600 mb-3">
                            <FaExclamationTriangle className="inline mr-3" />
                            Risk Workbench
                        </Typography>
                    </motion.div>
                    <motion.h1 className="font-display text-3xl md:text-4xl text-text-dark mb-3" variants={fadeIn}>
                        Supplier Risk & Attention
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto text-sm">
                            Review flags, validate evidence, and resolve disputes — all in one workspace.
                        </Typography>
                    </motion.div>
                    <motion.div variants={fadeIn}>
                        <button
                            onClick={() => navigate('/dashboard/suppliers')}
                            className="mt-3 text-sm text-primary hover:text-accent inline-flex items-center gap-1"
                        >
                            <FaChevronLeft className="text-xs" /> Back to Supplier Management
                        </button>
                    </motion.div>
                </motion.div>
            </Section>

            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Summary Strip */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
                        {[
                            { label: 'Critical', count: counts.critical, color: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50/60' },
                            { label: 'High', count: counts.high, color: 'text-orange-600', border: 'border-orange-200', bg: 'bg-orange-50/60' },
                            { label: 'Medium', count: counts.medium, color: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-50/60' },
                            { label: 'Low', count: counts.low, color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50/60' },
                            { label: 'Pending Validation', count: pendingCommitments.length + pendingInspections.length, color: 'text-gray-700', border: 'border-gray-200', bg: 'bg-gray-50/60' },
                            { label: 'Open Disputes', count: openDisputes.length, color: 'text-gray-700', border: 'border-gray-200', bg: 'bg-gray-50/60' },
                        ].map((item, i) => (
                            <div key={i} className={`${item.bg} rounded-xl p-3 border ${item.border} text-center`}>
                                <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wide">{item.label}</div>
                            </div>
                        ))}
                    </div>
                    {/* Filters */}
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search suppliers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/60 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <select
                                value={sortMode}
                                onChange={(e) => setSortMode(e.target.value as SortMode)}
                                className="px-4 py-3 rounded-full border border-gray-300 bg-white/60 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="severity">Sort: Severity</option>
                                <option value="trust_asc">Trust: Low → High</option>
                                <option value="trust_desc">Trust: High → Low</option>
                                <option value="flags_desc">Most flags</option>
                                <option value="name_asc">Name A → Z</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(['all', 'critical', 'high', 'medium', 'low'] as SeverityFilter[]).map(sev => {
                                const count = sev === 'all'
                                    ? filtered.length
                                    : suppliers.filter(s => {
                                        const t = trustBySupplier[s.id];
                                        return t && (t.flags.length > 0 || t.hasCriticalViolation) && severityOf(t) === sev;
                                    }).length;
                                const active = severityFilter === sev;
                                return (
                                    <button
                                        key={sev}
                                        onClick={() => setSeverityFilter(sev)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            active
                                                ? `${severityColor(sev)} text-white shadow-md`
                                                : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                                        }`}
                                    >
                                        {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                                        <span className={`ml-2 text-xs ${active ? 'opacity-80' : 'text-gray-400'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Split layout: list + detail panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Left: supplier list */}
                        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-5'} transition-all flex flex-col`}>
                            {filtered.length === 0 ? (
                                <InfoCard icon={FaCheckCircle} title="No suppliers require attention" iconColor="text-green-600" showInfoBadge={false}>
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        All suppliers are within thresholds.
                                    </p>
                                </InfoCard>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        {paginated.map(({ supplier, trust }) => {
                                            const sev = severityOf(trust);
                                            const isActive = selectedSupplierId === supplier.id;

                                            // R1: list rows carry conduct flags only — evidence/documentation
                                            // live in the detail panel where they have room to breathe.
                                            const conductFlags = trust.flagDetails
                                                .filter(f => f.kind === 'conduct')
                                                .map(f => f.label);

                                            return (
                                                <motion.div
                                                    key={supplier.id}
                                                    onClick={() => setSelectedSupplierId(supplier.id)}
                                                    className={`rounded-xl p-3 border cursor-pointer transition-all ${
                                                        isActive
                                                            ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                                                            : 'bg-white/40 border-white/30 hover:bg-white/60'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                        <span className={`px-1.5 py-0.5 ${severityColor(sev)} text-white text-[9px] uppercase rounded-full font-bold flex-shrink-0`}>
                                                            {sev === 'critical' ? 'CRIT' : sev === 'high' ? 'HIGH' : sev === 'medium' ? 'MED' : 'LOW'}
                                                        </span>
                                                            <p className="text-sm font-medium truncate">{supplier.name}</p>
                                                        </div>
                                                        <span className={`text-sm font-bold flex-shrink-0 ${
                                                            (trust.overall ?? 0) < 40 ? 'text-red-600' :
                                                                (trust.overall ?? 0) < 60 ? 'text-amber-600' : 'text-gray-700'}`}>{trust.overall ?? '—'}</span>
                                                    </div>

                                                    {/* R1: conduct flags only */}
                                                    {conductFlags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {conductFlags.slice(0, 2).map(f => (
                                                                <span
                                                                    key={f}
                                                                    className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                                                                        f.startsWith('CRITICAL')
                                                                            ? 'bg-red-100 text-red-700 font-medium'
                                                                            : 'bg-amber-100 text-amber-700'
                                                                    }`}
                                                                > {f}
                                                                </span>
                                                            ))}
                                                            {conductFlags.length > 2 && (
                                                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">+{conductFlags.length - 2}</span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* R1 placeholder: deterioration marker (R5 wires the data) */}
                                                    {conductFlags.length === 0 && (
                                                        <p className="text-[10px] text-gray-400">
                                                            no conduct flags — evidence backlog only
                                                        </p>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between bg-white/40 rounded-xl p-2 border border-white/30 mt-2">
                                            <button
                                                disabled={page === 1}
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                className="px-3 py-1.5 text-xs font-medium text-primary bg-white/60 border border-gray-200 rounded-full hover:bg-white disabled:opacity-40 transition-colors"
                                            >
                                                Prev
                                            </button>
                                            <span className="text-xs text-gray-500 font-medium">Page {page} of {totalPages}</span>
                                            <button
                                                disabled={page === totalPages}
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                className="px-3 py-1.5 text-xs font-medium text-primary bg-white/60 border border-gray-200 rounded-full hover:bg-white disabled:opacity-40 transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right: detail panel */}
                        <AnimatePresence>
                            {selected && selectedTrust && (
                                <motion.div
                                    className="lg:col-span-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    {/* Glass Card Container */}
                                    <motion.div
                                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden sticky top-24 p-6"
                                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                        whileHover={{
                                            y: -2,
                                            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        {/* 3D edge effect */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                        {/* Glassy overlay */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                        {/* Inner shadow effect */}
                                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                                        <div className="relative z-10">
                                            {/* Header & Close Button */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h2 className="text-xl font-bold text-primary">{selected.name}</h2>
                                                    <p className="text-xs text-gray-500 capitalize">{selected.type?.replace(/_/g, ' ')}</p>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedSupplierId(null)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-gray-500 hover:text-gray-800 transition-colors"
                                                    aria-label="Close panel"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>

                                            {/* Score snapshot */}
                                            <div className="flex items-end justify-between gap-3 mb-6 pb-4 border-b border-white/30">
                                                <div>
                                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Trust Score</div>
                                                    <div className="text-xs font-medium text-gray-600 mt-0.5">
                                                        {selectedTrust.confidence} · {selectedTrust.verifiedTransactions} verified batch{selectedTrust.verifiedTransactions !== 1 ? 'es' : ''}
                                                    </div>
                                                </div>
                                                <div className={`text-5xl font-bold ${
                                                    (selectedTrust.overall ?? 0) < 40 ? 'text-red-600' :
                                                        (selectedTrust.overall ?? 0) < 60 ? 'text-amber-600' : 'text-primary'
                                                }`}>
                                                    {selectedTrust.overall ?? '—'}
                                                </div>
                                            </div>

                                            {/* ============================== */}
                                            {/* R2 — CRITICAL VIOLATION BANNER */}
                                            {/* ============================== */}
                                            {selectedTrust.hasCriticalViolation && (() => {
                                                const source = findCriticalSource(
                                                    inspectionsBySupplier[selected.id] || [],
                                                    batchesBySupplier[selected.id] || []
                                                );
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-red-50/90 border-2 border-red-300 rounded-xl p-3 mb-4"
                                                    >
                                                        <div className="flex items-start gap-2 mb-1.5">
                                                            <FaExclamationTriangle className="text-red-600 mt-0.5 flex-shrink-0" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-red-700">
                                                                    CRITICAL VIOLATION — procurement restricted pending review
                                                                </p>
                                                                {source ? (
                                                                    <>
                                                                        <p className="text-xs text-red-600 mt-1">
                                                                            Source: <strong>{source.inspection.inspectionType?.replace(/_/g, ' ')}</strong>
                                                                            {' '}inspection · {source.inspection.inspectionDate
                                                                            ? new Date(source.inspection.inspectionDate).toLocaleDateString()
                                                                            : 'date unknown'}
                                                                            {source.inspection.inspector && ` · Inspector: ${source.inspection.inspector}`}
                                                                        </p>
                                                                        {source.inspection.findings && (
                                                                            <p className="text-xs text-red-600 mt-1 italic">
                                                                                Findings: "{source.inspection.findings}"
                                                                            </p>
                                                                        )}
                                                                        {source.batch && (
                                                                            <p className="text-[10px] text-red-500 mt-1">
                                                                                Linked batch: {source.batch.batchNumber}
                                                                            </p>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <p className="text-xs text-red-600 mt-1">
                                                                        Source inspection details unavailable — verify in Firestore.
                                                                    </p>
                                                                )}
                                                                <p className="text-[10px] text-red-500 mt-2 pt-2 border-t border-red-200">
                                                                    Clears automatically when a later validated PASS of the same inspection type is recorded.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })()}

                                            {/* Dimension grid */}
                                            <div className="grid grid-cols-3 gap-2 mb-6">
                                                {Object.entries(selectedTrust.dimensions).map(([k, v]) => {
                                                    if (k === 'delivery' && v === null) {
                                                        return (
                                                            <div key={k} className="bg-white/40 rounded-lg p-2 text-center border border-white/40">
                                                                <div className="text-xs text-gray-400">—</div>
                                                                <div className="text-[9px] text-gray-500 mt-0.5">Delivery</div>
                                                            </div>
                                                        );
                                                    }
                                                    if (v === null) return null;
                                                    return (
                                                        <div key={k} className="bg-white/40 rounded-lg p-2 text-center border border-white/40 shadow-sm">
                                                            <div className="text-sm font-bold text-gray-800">{Math.round(v)}</div>
                                                            <div className="text-[9px] text-gray-500 mt-0.5 capitalize">{k}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* ============================== */}
                                            {/* R1 — FLAGS GROUPED BY KIND     */}
                                            {/* ============================== */}
                                            {selectedTrust.flagDetails.length > 0 && (() => {
                                                const conduct = selectedTrust.flagDetails.filter(f => f.kind === 'conduct');
                                                const evidence = selectedTrust.flagDetails.filter(f => f.kind === 'evidence');
                                                const docs = selectedTrust.flagDetails.filter(f => f.kind === 'documentation');

                                                const renderGroup = (label: string, items: typeof conduct) => {
                                                    if (items.length === 0) {
                                                        return (
                                                            <div key={label} className="flex items-baseline gap-2 text-xs py-1">
                                                                <span className="text-gray-500 font-medium w-28 flex-shrink-0">{label}</span>
                                                                <span className="text-gray-400 italic">none</span>
                                                            </div>
                                                        );
                                                    }
                                                    return (
                                                        <div key={label} className="flex items-baseline gap-2 text-xs py-1">
                                                            <span className="text-gray-500 font-medium w-28 flex-shrink-0">{label}</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {items.map(f => (
                                                                    <span
                                                                        key={f.label}
                                                                        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                                                            f.label.startsWith('CRITICAL')
                                                                                ? 'bg-red-100 text-red-700 font-medium'
                                                                                : f.kind === 'conduct'
                                                                                    ? 'bg-amber-100 text-amber-700'
                                                                                    : f.kind === 'evidence'
                                                                                        ? 'bg-blue-100 text-blue-700'
                                                                                        : 'bg-gray-100 text-gray-600'
                                                                        }`}
                                                                    >
                                                {f.label}
                                            </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                };

                                                return (
                                                    <div className="mb-4 pb-4 border-b border-white/30">
                                                        <h4 className="text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Flags</h4>
                                                        <div className="space-y-0.5">
                                                            {renderGroup('Conduct', conduct)}
                                                            {renderGroup('Evidence status', evidence)}
                                                            {renderGroup('Documentation', docs)}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Pending evidence */}
                                            {(selectedPendingCommitments.length > 0 || selectedPendingInspections.length > 0) && (
                                                <div className="mb-4">
                                                    <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1 uppercase tracking-wide">
                                                        <FaClipboardCheck /> Pending Validation ({selectedPendingCommitments.length + selectedPendingInspections.length})
                                                    </h4>
                                                    <div className="space-y-1.5">
                                                        {selectedPendingCommitments.map((c: any) => (
                                                            <div key={c.firestoreId || c.id} className="bg-white/60 rounded-lg p-2 border border-white/40 flex items-center gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs font-medium truncate text-gray-800">
                                                                        Commitment {c.contractId} · {c.committedKg}kg
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-500">{c.status}</div>
                                                                </div>
                                                                <button
                                                                    disabled={actionLoading}
                                                                    onClick={() => handleValidate('supplier_commitments', c.firestoreId || c.id)}
                                                                    className="px-2 py-1 bg-primary text-white text-[10px] rounded-full hover:bg-dark-orange disabled:opacity-50 transition-colors"
                                                                >
                                                                    Validate
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {selectedPendingInspections.map((i: any) => (
                                                            <div key={i.firestoreId || i.id} className="bg-white/60 rounded-lg p-2 border border-white/40 flex items-center gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs font-medium truncate text-gray-800">
                                                                        {i.inspectionType} · {i.outcome}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-500 truncate">{i.findings}</div>
                                                                </div>
                                                                <button
                                                                    disabled={actionLoading}
                                                                    onClick={() => handleValidate('supplier_inspections', i.firestoreId || i.id)}
                                                                    className="px-2 py-1 bg-primary text-white text-[10px] rounded-full hover:bg-dark-orange disabled:opacity-50 transition-colors"
                                                                >
                                                                    Validate
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Disputes */}
                                            {selectedDisputes.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1 uppercase tracking-wide">
                                                        <FaBalanceScale /> Open Disputes ({selectedDisputes.length})
                                                    </h4>
                                                    <div className="space-y-1.5">
                                                        {selectedDisputes.map((d: any) => {
                                                            const key = d.firestoreId || d.id;
                                                            const isBatchTarget = d.targetEntity === 'batch';

                                                            return (
                                                                <div key={key} className="bg-red-50/80 rounded-lg p-2 border border-red-200">
                                                                    <div className="text-xs font-medium text-gray-800 truncate mb-1">
                                                                        {d.reason}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-500 mb-1.5">
                                                                        Target: {d.targetEntity} #{d.targetId}
                                                                    </div>

                                                                    {isBatchTarget && (
                                                                        <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] text-gray-600">
                                                        Original: <strong>{d.originalValue ?? '—'}</strong>
                                                    </span>
                                                                            <span className="text-[10px] text-gray-400">→</span>
                                                                            <span className="text-[10px] text-gray-600">Corrected:</span>
                                                                            <input
                                                                                type="number"
                                                                                placeholder={String(d.correctedValue ?? '')}
                                                                                value={correctedValues[key] || ''}
                                                                                onChange={(e) =>
                                                                                    setCorrectedValues(prev => ({ ...prev, [key]: e.target.value }))
                                                                                }
                                                                                className="w-16 px-1 py-0.5 text-[10px] border border-gray-300 rounded focus:outline-none focus:border-primary"
                                                                            />
                                                                        </div>
                                                                    )}

                                                                    <div className="flex gap-1.5">
                                                                        <button
                                                                            disabled={actionLoading}
                                                                            onClick={() => handleResolveDispute(key, 'UPHELD')}
                                                                            className="flex-1 px-2 py-1 bg-green-600 text-white text-[10px] rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                                        >
                                                                            Upheld
                                                                        </button>
                                                                        <button
                                                                            disabled={actionLoading}
                                                                            onClick={() => handleResolveDispute(key, 'REJECTED')}
                                                                            className="flex-1 px-2 py-1 bg-gray-500 text-white text-[10px] rounded-full hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                                                        >
                                                                            Rejected
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recent deliveries */}
                                            {selectedBatches.length > 0 && (
                                                <div className="mb-4">
                                                    <h4 className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1 uppercase tracking-wide">
                                                        <FaFileAlt /> Recent Deliveries ({selectedBatches.length})
                                                    </h4>
                                                    <div className="space-y-1">
                                                        {selectedBatches.slice(0, 3).map((b: any) => (
                                                            <div key={b.firestoreId || b.id} className="flex items-center justify-between text-[10px] bg-white/40 px-2 py-1.5 rounded-lg border border-white/30">
                                                                <span className="truncate font-medium text-gray-700">{b.batchNumber}</span>
                                                                <div className="flex gap-2 flex-shrink-0">
                                            <span className={`px-1.5 py-0.5 rounded-full ${
                                                b.qualityGrade === 'PREMIUM' ? 'bg-amber-100 text-amber-700' :
                                                    b.qualityGrade === 'REJECT' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }`}>{b.qualityGrade}</span>
                                                                    <span className="text-gray-500">{(b.weightKg / 1000).toFixed(1)}T</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions footer */}
                                            <div className="pt-4 border-t border-white/30 flex flex-wrap gap-2">
                                                <button
                                                    disabled={actionLoading}
                                                    onClick={handleRecalculate}
                                                    className="flex-1 min-w-[140px] py-2 bg-primary text-white text-xs font-medium rounded-full hover:bg-dark-orange disabled:opacity-50 flex items-center justify-center gap-1 transition-colors"
                                                >
                                                    <FaHistory /> Recalculate & Snapshot
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/dashboard/suppliers?open=${selected.firestoreId || selected.id}`)}
                                                    className="flex-1 min-w-[120px] py-2 bg-white/60 border border-gray-200 text-xs font-medium rounded-full hover:bg-white/80 text-gray-700 transition-colors"
                                                >
                                                    Full Profile →
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/dashboard/suppliers/development?supplier=${selected.firestoreId || selected.id}`)}
                                                    className="flex-1 min-w-[140px] py-2 bg-white/60 border border-gray-200 text-xs font-medium rounded-full hover:bg-white/80 text-gray-700 transition-colors"
                                                >
                                                    View in Development →
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default SupplierRisk;