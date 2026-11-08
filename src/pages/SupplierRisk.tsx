import React, { useEffect, useState, useMemo, Fragment } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaExclamationTriangle, FaSearch, FaCheckCircle, FaTimes,
    FaFilter, FaSortAmountDown, FaChevronLeft
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getSupplierData } from '../services/api';
import { computeTrustScore, TrustResult } from '@/utils/trustScore';
import { GiFarmer } from 'react-icons/gi';

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
type SortMode = 'trust_asc' | 'trust_desc' | 'name_asc' | 'flags_desc';

const PAGE_SIZE = 20;

const SupplierRisk: React.FC = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [batchesBySupplier, setBatchesBySupplier] = useState<Record<string, any[]>>({});
    const [commitmentsBySupplier, setCommitmentsBySupplier] = useState<Record<string, any[]>>({});
    const [inspectionsBySupplier, setInspectionsBySupplier] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
    const [sortMode, setSortMode] = useState<SortMode>('trust_asc');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSupplierData('getSuppliersWithTrust');
                setSuppliers(data.suppliers || []);
                setBatchesBySupplier(data.batchesBySupplier || {});
                setCommitmentsBySupplier(data.commitmentsBySupplier || {});
                setInspectionsBySupplier(data.inspectionsBySupplier || {});
            } catch (error) {
                console.error('Error fetching risk data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const severityOf = (trust: TrustResult): SeverityFilter => {
        if (trust.hasCriticalViolation) return 'critical';
        if ((trust.overall ?? 100) < 40) return 'high';
        if ((trust.overall ?? 100) < 60) return 'medium';
        return 'low';
    };

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return suppliers
            .map(s => ({ supplier: s, trust: trustBySupplier[s.id] }))
            .filter(x => x.trust && x.trust.flags.length > 0)
            .filter(x => {
                if (severityFilter !== 'all' && severityOf(x.trust) !== severityFilter) return false;
                if (q && !x.supplier.name.toLowerCase().includes(q)) return false;
                return true;
            })
            .sort((a, b) => {
                if (sortMode === 'trust_asc') return (a.trust.overall ?? 100) - (b.trust.overall ?? 100);
                if (sortMode === 'trust_desc') return (b.trust.overall ?? 0) - (a.trust.overall ?? 0);
                if (sortMode === 'flags_desc') return b.trust.flags.length - a.trust.flags.length;
                return a.supplier.name.localeCompare(b.supplier.name);
            });
    }, [suppliers, trustBySupplier, severityFilter, searchQuery, sortMode]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => { setPage(1); }, [severityFilter, searchQuery, sortMode]);

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

            <Section className="flex items-center justify-center text-center min-h-[30vh] relative">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-12" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-amber-600 mb-4">
                            <FaExclamationTriangle className="inline mr-3" />
                            Risk Review
                        </Typography>
                    </motion.div>
                    <motion.h1 className="font-display text-4xl md:text-5xl text-text-dark mb-4" variants={fadeIn}>
                        Supplier Risk & Attention
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Every supplier with evidence flags. Sortable by severity, trust, or name. Click a supplier to review.
                        </Typography>
                    </motion.div>
                    <motion.div variants={fadeIn}>
                        <button
                            onClick={() => navigate('/dashboard/suppliers')}
                            className="mt-4 text-sm text-primary hover:text-accent inline-flex items-center gap-1"
                        >
                            <FaChevronLeft className="text-xs" /> Back to Supplier Management
                        </button>
                    </motion.div>
                </motion.div>
            </Section>

            <Section className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Filters */}
                    <div className="flex flex-col gap-4 mb-6">
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
                                        return t && t.flags.length > 0 && severityOf(t) === sev;
                                    }).length;
                                const active = severityFilter === sev;
                                const colors = sev === 'critical' ? 'bg-red-600' :
                                    sev === 'high' ? 'bg-orange-500' :
                                        sev === 'medium' ? 'bg-amber-500' :
                                            sev === 'low' ? 'bg-blue-500' : 'bg-primary';
                                return (
                                    <button
                                        key={sev}
                                        onClick={() => setSeverityFilter(sev)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            active
                                                ? `${colors} text-white shadow-md`
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

                    {/* Results */}
                    {filtered.length === 0 ? (
                        <InfoCard icon={FaCheckCircle} title="No suppliers require attention" iconColor="text-green-600" showInfoBadge={false}>
                            <p className="text-sm text-gray-500 text-center py-4">
                                {searchQuery || severityFilter !== 'all'
                                    ? 'No suppliers match these filters.'
                                    : 'All suppliers are currently within thresholds.'}
                            </p>
                        </InfoCard>
                    ) : (
                        <>
                            <div className="space-y-2 mb-4">
                                {paginated.map(({ supplier, trust }) => {
                                    const sev = severityOf(trust);
                                    const sevColor = sev === 'critical' ? 'bg-red-600' :
                                        sev === 'high' ? 'bg-orange-500' :
                                            sev === 'medium' ? 'bg-amber-500' : 'bg-blue-500';
                                    return (
                                        <motion.div
                                            key={supplier.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => navigate(`/dashboard/suppliers?open=${supplier.firestoreId || supplier.id}`)}
                                            className="bg-white/40 rounded-xl p-4 border border-white/30 cursor-pointer hover:bg-white/60 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`px-2 py-0.5 ${sevColor} text-white text-[10px] uppercase rounded-full font-bold`}>
                                                            {sev}
                                                        </span>
                                                        <p className="text-sm font-semibold truncate">{supplier.name}</p>
                                                        <span className="text-[10px] text-gray-400">
                                                            {supplier.type?.replace(/_/g, ' ')}
                                                        </span>
                                                        {trust.hasCriticalViolation && (
                                                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] rounded-full font-medium">
                                                                ⚠ CRITICAL VIOLATION
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className={`text-lg font-bold ${
                                                        (trust.overall ?? 0) < 40 ? 'text-red-600' :
                                                            (trust.overall ?? 0) < 60 ? 'text-amber-600' :
                                                                'text-gray-700'
                                                    }`}>
                                                        {trust.overall ?? '—'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400">{trust.confidence}</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {trust.flags.map(f => (
                                                    <span key={f} className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full">
                                                        {f}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1.5 bg-white/60 border border-gray-200 rounded-full text-sm disabled:opacity-40"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-xs text-gray-500">
                                        Page {page} of {totalPages} · {filtered.length} total
                                    </span>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        className="px-3 py-1.5 bg-white/60 border border-gray-200 rounded-full text-sm disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Section>
        </div>
    );
};

export default SupplierRisk;