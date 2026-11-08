import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaHandshake, FaSearch, FaCheckCircle, FaChevronLeft,
    FaChartLine, FaUser
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getSupplierData } from '../services/api';
import { computeTrustScore, TrustResult } from '@/utils/trustScore';
import { detectDevelopmentOpportunities, DevelopmentOpportunity } from '@/utils/supplierDevelopment';
import { GiFarmer } from 'react-icons/gi';

interface Supplier { id: string; firestoreId?: string; name: string; type: string; status: string; isActive: boolean; [key: string]: any; }

type SeverityFilter = 'all' | 'high' | 'medium' | 'low';

const SupplierDevelopmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [batchesBySupplier, setBatchesBySupplier] = useState<Record<string, any[]>>({});
    const [commitmentsBySupplier, setCommitmentsBySupplier] = useState<Record<string, any[]>>({});
    const [inspectionsBySupplier, setInspectionsBySupplier] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSupplierData('getSuppliersWithTrust');
                setSuppliers(data.suppliers || []);
                setBatchesBySupplier(data.batchesBySupplier || {});
                setCommitmentsBySupplier(data.commitmentsBySupplier || {});
                setInspectionsBySupplier(data.inspectionsBySupplier || {});
            } catch (error) {
                console.error('Error fetching development data:', error);
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

    const allOpportunities = useMemo(() =>
            detectDevelopmentOpportunities(suppliers, batchesBySupplier, trustBySupplier),
        [suppliers, batchesBySupplier, trustBySupplier]
    );

    // Group by supplier
    const grouped = useMemo(() => {
        const q = searchQuery.toLowerCase();
        const groups = new Map<string, { supplier: Supplier; opportunities: DevelopmentOpportunity[] }>();

        allOpportunities.forEach(opp => {
            const supplier = suppliers.find(s => s.id === opp.supplierId);
            if (!supplier) return;
            if (q && !supplier.name.toLowerCase().includes(q)) return;
            if (severityFilter !== 'all' && opp.severity !== severityFilter) return;

            if (!groups.has(opp.supplierId)) {
                groups.set(opp.supplierId, { supplier, opportunities: [] });
            }
            groups.get(opp.supplierId)!.opportunities.push(opp);
        });

        // Sort groups: highest severity first, then name
        const sevOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return Array.from(groups.values()).sort((a, b) => {
            const aSev = Math.min(...a.opportunities.map(o => sevOrder[o.severity] ?? 3));
            const bSev = Math.min(...b.opportunities.map(o => sevOrder[o.severity] ?? 3));
            if (aSev !== bSev) return aSev - bSev;
            return a.supplier.name.localeCompare(b.supplier.name);
        });
    }, [allOpportunities, suppliers, searchQuery, severityFilter]);

    const totalHigh = allOpportunities.filter(o => o.severity === 'high').length;
    const totalMedium = allOpportunities.filter(o => o.severity === 'medium').length;
    const totalLow = allOpportunities.filter(o => o.severity === 'low').length;
    const uniqueSuppliers = new Set(allOpportunities.map(o => o.supplierId)).size;

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
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaHandshake className="inline mr-3 text-accent" />
                            Supplier Development
                        </Typography>
                    </motion.div>
                    <motion.h1 className="font-display text-4xl md:text-5xl text-text-dark mb-4" variants={fadeIn}>
                        Development Opportunities
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            {uniqueSuppliers} supplier{uniqueSuppliers !== 1 ? 's' : ''} with {allOpportunities.length} development opportunit{allOpportunities.length === 1 ? 'y' : 'ies'}. Grouped by supplier for targeted support.
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
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-red-50/60 rounded-xl p-4 border border-red-200 text-center">
                            <div className="text-3xl font-bold text-red-600">{totalHigh}</div>
                            <div className="text-xs text-gray-500 mt-1">High priority</div>
                        </div>
                        <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200 text-center">
                            <div className="text-3xl font-bold text-amber-600">{totalMedium}</div>
                            <div className="text-xs text-gray-500 mt-1">Medium priority</div>
                        </div>
                        <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200 text-center">
                            <div className="text-3xl font-bold text-blue-600">{totalLow}</div>
                            <div className="text-xs text-gray-500 mt-1">Capacity building</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search supplier name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/60 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'high', 'medium', 'low'] as SeverityFilter[]).map(sev => (
                                <button
                                    key={sev}
                                    onClick={() => setSeverityFilter(sev)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        severityFilter === sev
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                                    }`}
                                >
                                    {sev === 'all' ? 'All Priorities' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grouped by supplier */}
                    {grouped.length === 0 ? (
                        <InfoCard icon={FaCheckCircle} title="No development opportunities" iconColor="text-green-600" showInfoBadge={false}>
                            <p className="text-sm text-gray-500 text-center py-4">
                                {searchQuery || severityFilter !== 'all'
                                    ? 'No opportunities match these filters.'
                                    : 'Every supplier is meeting current thresholds.'}
                            </p>
                        </InfoCard>
                    ) : (
                        <div className="space-y-4">
                            {grouped.map(({ supplier, opportunities }) => (
                                <motion.div
                                    key={supplier.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/40 rounded-xl p-4 border border-white/30"
                                >
                                    {/* Supplier header */}
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                                        <FaUser className="text-primary" />
                                        <span className="text-sm font-semibold">{supplier.name}</span>
                                        <span className="text-[10px] text-gray-400">
                                            {supplier.type?.replace(/_/g, ' ')}
                                        </span>
                                        <span className="ml-auto text-[10px] text-gray-500">
                                            {opportunities.length} opportunit{opportunities.length === 1 ? 'y' : 'ies'}
                                        </span>
                                    </div>
                                    {/* Opportunities for this supplier */}
                                    <div className="space-y-2">
                                        {opportunities.map((opp, i) => {
                                            const borderColor =
                                                opp.severity === 'high' ? 'border-l-red-400' :
                                                    opp.severity === 'medium' ? 'border-l-amber-400' :
                                                        'border-l-blue-400';
                                            const badgeColor =
                                                opp.severity === 'high' ? 'bg-red-100 text-red-700' :
                                                    opp.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-100 text-blue-700';
                                            return (
                                                <div
                                                    key={`${opp.supplierId}-${opp.weakness}-${i}`}
                                                    className={`bg-white/60 rounded-lg p-3 border border-white/30 border-l-4 ${borderColor}`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${badgeColor}`}>
                                                            {opp.severity}
                                                        </span>
                                                        <span className="text-xs font-medium text-gray-800">
                                                            {opp.weakness}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 mb-1">{opp.metric}</p>
                                                    <p className="text-[11px] text-primary flex items-center gap-1">
                                                        <FaHandshake className="text-[10px]" />
                                                        <span className="font-medium">Suggested support:</span>
                                                        <span className="text-gray-600">{opp.suggestedSupport}</span>
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Footer insight */}
                    <div className="mt-6 p-3 bg-primary/5 rounded-lg text-[11px] text-gray-600">
                        <FaChartLine className="inline mr-1 text-primary" />
                        <strong>Continuous improvement cycle:</strong> measure performance → identify weaknesses → provide targeted support → measure improvements in later cycles.
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default SupplierDevelopmentPage;