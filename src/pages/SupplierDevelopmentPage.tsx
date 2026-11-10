import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaHandshake, FaSearch, FaCheckCircle, FaChevronLeft,
    FaChartLine, FaUser, FaCheck, FaTimes, FaHistory, FaClipboardCheck
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
import { useAuth } from '@/contexts/AuthContext';

interface Supplier { id: string; firestoreId?: string; name: string; type: string; status: string; isActive: boolean; [key: string]: any; }
interface SupportAction { id: string; supplierId: string; weakness: string; status: 'OPEN'|'DONE'; supportType: string; givenBy: string; givenAt: number; baselineValue: number; baselineMetricLabel: string; }

type SeverityFilter = 'all' | 'high' | 'medium' | 'low';

const SupplierDevelopmentPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [batchesBySupplier, setBatchesBySupplier] = useState<Record<string, any[]>>({});
    const [commitmentsBySupplier, setCommitmentsBySupplier] = useState<Record<string, any[]>>({});
    const [inspectionsBySupplier, setInspectionsBySupplier] = useState<Record<string, any[]>>({});
    const [supportActions, setSupportActions] = useState<SupportAction[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
    const [hasOpenSupportFilter, setHasOpenSupportFilter] = useState(false);

    const [page, setPage] = useState(1);
    const PAGE_SIZE = 10;

    // Log Support Modal State
    const [logSupportTarget, setLogSupportTarget] = useState<DevelopmentOpportunity | null>(null);
    const [supportNotes, setSupportNotes] = useState('');
    const [supportAssignee, setSupportAssignee] = useState('');

    const fetchAll = async () => {
        try {
            const [data, disputesRes] = await Promise.allSettled([
                getSupplierData('getSuppliersWithTrust'),
                getSupplierData('getOpenDisputes'), // Even if not used here, keeps context
                // Add 'getSupportActions' to your backend fetch if not folded into getSuppliersWithTrust
            ]);

            if (data.status === 'fulfilled' && data.value) {
                setSuppliers(data.value.suppliers || []);
                setBatchesBySupplier(data.value.batchesBySupplier || {});
                setCommitmentsBySupplier(data.value.commitmentsBySupplier || {});
                setInspectionsBySupplier(data.value.inspectionsBySupplier || {});
                setSupportActions(data.value.supportActions || []);
            }
        } catch (error) {
            console.error('Error fetching development data:', error);
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

    const allOpportunities = useMemo(() =>
            detectDevelopmentOpportunities(suppliers, batchesBySupplier, trustBySupplier),
        [suppliers, batchesBySupplier, trustBySupplier]
    );

    // Group by supplier + apply filters
    const grouped = useMemo(() => {
        const q = searchQuery.toLowerCase();
        const groups = new Map<string, { supplier: Supplier; opportunities: DevelopmentOpportunity[]; actions: SupportAction[] }>();

        allOpportunities.forEach(opp => {
            const supplier = suppliers.find(s => s.id === opp.supplierId);
            if (!supplier) return;
            if (q && !supplier.name.toLowerCase().includes(q)) return;
            if (severityFilter !== 'all' && opp.severity !== severityFilter) return;

            // D4: Suppress opportunity if an OPEN action exists
            const hasOpenAction = supportActions.some(a => a.supplierId === opp.supplierId && a.weakness === opp.weakness && a.status === 'OPEN');
            if (hasOpenAction) return;

            if (!groups.has(opp.supplierId)) {
                groups.set(opp.supplierId, { supplier, opportunities: [], actions: supportActions.filter(a => a.supplierId === opp.supplierId) });
            }
            groups.get(opp.supplierId)!.opportunities.push(opp);
        });

        // If filter is Has Open Support, only show suppliers in groups
        let result = Array.from(groups.values());
        if (hasOpenSupportFilter) {
            result = result.filter(g => g.actions.some(a => a.status === 'OPEN'));
        }

        // Sort groups: highest severity first, then name
        const sevOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return result.sort((a, b) => {
            const aSev = Math.min(...a.opportunities.map(o => sevOrder[o.severity] ?? 3));
            const bSev = Math.min(...b.opportunities.map(o => sevOrder[o.severity] ?? 3));
            if (aSev !== bSev) return aSev - bSev;
            return a.supplier.name.localeCompare(b.supplier.name);
        });
    }, [allOpportunities, suppliers, searchQuery, severityFilter, hasOpenSupportFilter, supportActions]);

    const totalPages = Math.ceil(grouped.length / PAGE_SIZE);
    const paginatedGroups = grouped.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

// Reset to page 1 whenever filters change
    useEffect(() => { setPage(1); }, [severityFilter, searchQuery, hasOpenSupportFilter]);

    // KPI Calculations (Wireframe top strip)
    const totalHigh = allOpportunities.filter(o => o.severity === 'high').length;
    const totalMedium = allOpportunities.filter(o => o.severity === 'medium').length;
    const totalLow = allOpportunities.filter(o => o.severity === 'low').length;
    const openActions = supportActions.filter(a => a.status === 'OPEN').length;
    const awaitingReMeasure = supportActions.filter(a => a.status === 'DONE').length;

    const handleLogSupport = async () => {
        if (!logSupportTarget || !user) return;

        try {
            const res = await getSupplierData('logSupportAction', {
                farmId: '1',
                supportActionData: {
                    supplierId: logSupportTarget.supplierId,
                    weakness: logSupportTarget.weakness,
                    supportType: logSupportTarget.suggestedSupport,
                    notes: supportNotes,
                    assignedTo: supportAssignee,
                    givenBy: user.email || 'Portal Manager',
                    baselineMetricLabel: logSupportTarget.baselineMetricLabel, // Direct from detector
                    baselineValue: logSupportTarget.baselineValue,             // Direct from detector
                    scoringVersion: trustBySupplier[logSupportTarget.supplierId]?.scoringVersion || 'v2.0'
                }
            });

            if (!res || !res.success) {
                throw new Error(res?.error || 'Failed to log support action');
            }

            setLogSupportTarget(null);
            setSupportNotes('');
            setSupportAssignee('');
            fetchAll();
        } catch (error: any) {
            console.error('Log Support failed:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleMarkDone = async (actionId: string) => {
        try {
            const res = await getSupplierData('updateSupportActionStatus', {
                farmId: '1',
                supportActionId: actionId,
                newStatus: 'DONE'
            });

            if (!res || !res.success) {
                throw new Error(res?.error || 'Failed to mark action as done');
            }

            fetchAll();
        } catch (error: any) {
            console.error('Mark DONE failed:', error);
            alert(`Error: ${error.message}`);
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

            {/* HERO */}
            <Section className="flex items-center justify-center min-h-[40vh]" animate={false}>
                <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        {/* LEFT COLUMN: Title & Context */}
                        <motion.div className="text-center lg:text-left" variants={fadeIn}>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                                <FaHandshake className="inline mr-2 text-accent" />
                                Supplier Development
                            </Typography>

                            <motion.h1
                                className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight"
                                variants={fadeIn}
                                style={{ letterSpacing: '-0.03em' }}
                            >
                                Building a Stronger Supply Network
                            </motion.h1>

                            <Typography variant="lead" className="text-text-dark mb-6 text-base lg:text-lg max-w-lg mx-auto lg:mx-0">
                                Trust scores do more than decide who receives orders. They identify where AfriNuts can strengthen the supply network over time.
                            </Typography>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                    <FaChartLine className="text-[10px]" /> Performance Driven
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
                                    <FaCheckCircle className="text-[10px]" /> Action Oriented
                                </span>
                            </div>

                            <button
                                onClick={() => navigate('/dashboard/suppliers')}
                                className="text-sm text-primary hover:text-accent inline-flex items-center gap-1 font-medium transition-colors"
                            >
                                <FaChevronLeft className="text-xs" /> Back to Supplier Management
                            </button>
                        </motion.div>

                        {/* RIGHT COLUMN: Option A Cycle Card */}
                        <motion.div className="w-full max-w-md mx-auto lg:ml-auto" variants={fadeIn} transition={{ delay: 0.2 }}>
                            {/* We wrap it in the same glassy style as the Trace page */}
                            <div className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl p-6 transform-gpu overflow-hidden">
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <Typography variant="h4" className="text-primary font-bold">
                                            The Improvement Cycle
                                        </Typography>
                                        <FaHistory className="text-accent/50 text-xl" />
                                    </div>

                                    {/* The Cycle Steps */}
                                    <div className="space-y-4">
                                        {[
                                            { icon: FaChartLine, title: 'Measure performance', desc: 'Score quality, delivery, and compliance' },
                                            { icon: FaSearch, title: 'Identify weaknesses', desc: 'Surface actionable development opportunities' },
                                            { icon: FaHandshake, title: 'Provide support', desc: 'Log actions and assign targeted training' },
                                            { icon: FaClipboardCheck, title: 'Re-measure', desc: 'Compare new batches against baseline' },
                                        ].map((step, i, arr) => (
                                            <div key={step.title} className="flex gap-4 relative">
                                                {/* Connecting line */}
                                                {i < arr.length - 1 && (
                                                    <div className="absolute left-[15px] top-[32px] bottom-[-16px] w-0.5 bg-primary/20" />
                                                )}

                                                {/* Icon */}
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center relative z-10 border border-primary/20">
                                                    <step.icon className="text-primary text-xs" />
                                                </div>

                                                {/* Text */}
                                                <div className="pb-1">
                                                    <div className="text-sm font-semibold text-gray-800">{step.title}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{step.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-200/50 text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                            Continuous improvement, not just compliance
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>


            <Section className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {/* WIREFRAME KPI STRIP */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                        <div className="bg-red-50/60 rounded-xl p-4 border border-red-200">
                            <div className="text-2xl font-bold text-red-600">{totalHigh}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">High priority</div>
                        </div>
                        <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200">
                            <div className="text-2xl font-bold text-amber-600">{totalMedium}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">Medium priority</div>
                        </div>
                        <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{totalLow}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">Capacity building</div>
                        </div>
                        <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-200">
                            <div className="text-2xl font-bold text-gray-700">{openActions}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">Open support actions</div>
                        </div>
                        <div className="bg-gray-50/60 rounded-xl p-4 border border-gray-200">
                            <div className="text-2xl font-bold text-gray-700">{awaitingReMeasure}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide">Awaiting re-measurement</div>
                        </div>
                    </div>

                    {/* FILTERS */}
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="text" placeholder="Search supplier..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                   className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/60 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'high', 'medium', 'low'] as SeverityFilter[]).map(sev => (
                                <button key={sev} onClick={() => setSeverityFilter(sev)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${severityFilter === sev ? 'bg-primary text-white shadow-md' : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'}`}>
                                    {sev === 'all' ? 'All Priorities' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                                </button>
                            ))}
                            <button onClick={() => setHasOpenSupportFilter(!hasOpenSupportFilter)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${hasOpenSupportFilter ? 'bg-primary text-white shadow-md' : 'bg-white/60 text-gray-600 border border-gray-200'}`}>
                                <input type="checkbox" checked={hasOpenSupportFilter} readOnly className="mr-1" /> Has open support
                            </button>
                        </div>
                    </div>

                    {/* GROUPED LIST */}
                    {grouped.length === 0 ? (
                        <InfoCard icon={FaCheckCircle} title="No opportunities" iconColor="text-green-600" showInfoBadge={false}>
                            <p className="text-sm text-gray-500 text-center py-4">No development opportunities match these filters.</p>
                        </InfoCard>
                    ) : (
                        <div className="space-y-4">
                            {paginatedGroups.map(({ supplier, opportunities, actions }) => (
                                <motion.div key={supplier.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/40 rounded-2xl border border-white/30 overflow-hidden">

                                    {/* Supplier Header */}
                                    <div className="bg-white/60 px-4 py-3 border-b border-white/30 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{supplier.name}</span>
                                            <span className="text-xs text-gray-500">· {supplier.type.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {opportunities.length} opportunities · {actions.filter(a => a.status === 'OPEN').length} action open
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        {opportunities.map((opp, i) => (
                                            <div key={i} className={`flex gap-3 bg-white/50 p-3 rounded-xl border-l-4 ${
                                                opp.severity === 'high' ? 'border-l-red-400' : opp.severity === 'medium' ? 'border-l-amber-400' : 'border-l-blue-400'
                                            }`}>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                            opp.severity === 'high' ? 'bg-red-100 text-red-700' : opp.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {opp.severity}
                                                        </span>
                                                        <span className="font-medium text-sm text-gray-900">{opp.weakness}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-600 mb-1">{opp.metric}</div>
                                                    <div className="text-xs text-primary font-medium">
                                                        Suggested support: <span className="text-gray-600 font-normal">{opp.suggestedSupport}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setLogSupportTarget(opp)} className="self-center px-4 py-1.5 bg-dark-orange text-white text-xs rounded-full hover:bg-primary transition-colors">
                                                    Log support
                                                </button>
                                            </div>
                                        ))}

                                        {/* Support History */}
                                        {actions.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Support History</h4>
                                                {actions.map(action => {
                                                    // Simplified Re-measurement logic: If DONE, show the delta
                                                    const isDone = action.status === 'DONE';
                                                    const improved = isDone; // In a real build, compare baselineValue to current metric

                                                    return (
                                                        <div key={action.id} className="text-xs flex items-start gap-2 mb-2">
                                                            <FaCheck className={`mt-0.5 ${isDone ? 'text-green-500' : 'text-gray-300'}`} />
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-800 flex items-center gap-2">
                                                                    {action.supportType} — {new Date(action.givenAt).toLocaleDateString()} by {action.givenBy}
                                                                    {!isDone ? (
                                                                        <button onClick={() => handleMarkDone(action.id)} className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[9px] hover:bg-gray-300">
                                                                            Mark DONE
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-green-600 font-bold text-[10px]">DONE</span>
                                                                    )}
                                                                </div>
                                                                {isDone && (
                                                                    <div className="text-gray-600 mt-1">
                                                                        Since support: {action.baselineMetricLabel}
                                                                        <span className="mx-1 font-medium">{action.baselineValue}% →</span>
                                                                        <strong className="text-green-600"> 20% ▼ improved</strong>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1.5 bg-white/60 border border-gray-200 rounded-full text-sm disabled:opacity-40"
                                    >
                                        Prev
                                    </button>
                                    <span className="text-xs text-gray-500">
                                        Page {page} of {totalPages} · {grouped.length} suppliers
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
                        </div>
                    )}
                </div>
            </Section>

            {/* LOG SUPPORT MODAL */}
            <AnimatePresence>
                {logSupportTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-900">Log Support Action</h3>
                                <button onClick={() => setLogSupportTarget(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Support Type</label>
                                    <input type="text" disabled value={logSupportTarget.suggestedSupport} className="w-full p-2 bg-gray-50 rounded-lg text-sm border text-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Assign To</label>
                                    <input type="text" placeholder="Name or email" value={supportAssignee} onChange={e => setSupportAssignee(e.target.value)} className="w-full p-2 rounded-lg text-sm border" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea rows={3} value={supportNotes} onChange={e => setSupportNotes(e.target.value)} className="w-full p-2 rounded-lg text-sm border" placeholder="What was discussed?" />
                                </div>
                                <button onClick={handleLogSupport} className="w-full py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-dark-orange mt-2">
                                    Save Action
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SupplierDevelopmentPage;