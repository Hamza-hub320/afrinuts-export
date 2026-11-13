import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaHandshake, FaSearch, FaCheckCircle, FaChevronLeft,
    FaChartLine, FaUser, FaCheck, FaTimes, FaHistory, FaClipboardCheck, FaExclamationTriangle
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
interface SupportAction { id: string; supplierId: string; weakness: string; status: 'OPEN'|'DONE'; supportType: string; givenBy: string; givenAt: number; baselineValue: number; baselineMetricLabel: string;  assignedTo: string; notes: string; }
interface InspectionTask {
    id: string;
    supplierId: number | string;
    inspectionId: string;
    inspectionType: string | null;
    outcome: 'CONDITIONAL' | 'FAIL';
    severity: 'MINOR' | 'MAJOR' | 'CRITICAL' | null;
    finding: string;
    correctiveAction: string;
    owner: string;
    assignedTo: string;
    dueTrigger: { type: 'date'; date: number } | { type: 'next_batch' };
    dueTriggerDefaulted?: boolean;
    status: 'OPEN' | 'DONE';
    givenAt: number;
    givenBy: string;
    scoringVersion: string;
    closedAt: number | null;
    closedBy: string | null;
    reInspectionId: string | null;
    reInspectionNumericId: number | null;
}

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

    const [inspectionTasks, setInspectionTasks] = useState<InspectionTask[]>([]);
    const [doneModalTarget, setDoneModalTarget] = useState<InspectionTask | null>(null);
    const [doneSelectedReInspectionId, setDoneSelectedReInspectionId] = useState('');

    const fetchAll = async () => {
        try {
            const [data, disputesRes, inspectionActionsRes] = await Promise.allSettled([
                getSupplierData('getSuppliersWithTrust'),
                getSupplierData('getOpenDisputes'),
                getSupplierData('getInspectionActions', { farmId: '1' }),
            ]);

            if (data.status === 'fulfilled' && data.value) {
                setSuppliers(data.value.suppliers || []);
                setBatchesBySupplier(data.value.batchesBySupplier || {});
                setCommitmentsBySupplier(data.value.commitmentsBySupplier || {});
                setInspectionsBySupplier(data.value.inspectionsBySupplier || {});
                setSupportActions(data.value.supportActions || []);
            }
            if (inspectionActionsRes.status === 'fulfilled' && inspectionActionsRes.value) {
                setInspectionTasks(inspectionActionsRes.value.actions || []);
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
        const groups = new Map<string, {
            supplier: Supplier;
            opportunities: DevelopmentOpportunity[];
            actions: SupportAction[];
            inspectionTasks: InspectionTask[];
        }>();

        // 1. Process opportunities (existing logic)
        allOpportunities.forEach(opp => {
            const supplier = suppliers.find(s => s.id === opp.supplierId);
            if (!supplier) return;
            if (q && !supplier.name.toLowerCase().includes(q)) return;
            if (severityFilter !== 'all' && opp.severity !== severityFilter) return;

            const supplierActions = supportActions.filter(a => a.supplierId === opp.supplierId && a.weakness === opp.weakness);
            const latestAction = supplierActions.sort((a, b) => b.givenAt - a.givenAt)[0];

            if (latestAction) {
                if (latestAction.status === 'OPEN') return;

                if (latestAction.status === 'DONE') {
                    const batches = batchesBySupplier[opp.supplierId] || [];
                    const newBatches = batches.filter(b => b.verifiedAt && b.verifiedAt > latestAction.givenAt);
                    if (newBatches.length < 2) return;

                    const reMeasuredOpp = detectDevelopmentOpportunities(
                        [supplier],
                        { [supplier.id]: newBatches },
                        { [supplier.id]: computeTrustScore({ supplier, batches: newBatches, commitments: [], inspections: [] }) }
                    ).find(o => o.weakness === opp.weakness);

                    if (!reMeasuredOpp) return;
                    opp = reMeasuredOpp;
                }
            }

            if (!groups.has(opp.supplierId)) {
                groups.set(opp.supplierId, { supplier, opportunities: [], actions: [], inspectionTasks: [] });
            }
            groups.get(opp.supplierId)!.opportunities.push(opp);
        });

        // 2. Process support actions (NEW FIX)
        // Any supplier with a support action who doesn't have a group yet needs one created.
        supportActions.forEach(action => {
            const supplier = suppliers.find(s => s.id === action.supplierId);
            if (!supplier) return;
            if (q && !supplier.name.toLowerCase().includes(q)) return;

            if (!groups.has(action.supplierId)) {
                groups.set(action.supplierId, { supplier, opportunities: [], actions: [], inspectionTasks: [] });
            }
            // Only push if it's not already in the list (though we initialized with empty)
            const group = groups.get(action.supplierId)!;
            if (!group.actions.find(a => a.id === action.id)) {
                group.actions.push(action);
            }
        });

        // supplier with only an inspection task is visible.
        inspectionTasks.forEach(task => {
            const supplier = suppliers.find(s => String(s.id) === String(task.supplierId));
            if (!supplier) return;
            if (q && !supplier.name.toLowerCase().includes(q)) return;
            if (!groups.has(String(supplier.id))) {
                groups.set(String(supplier.id), { supplier, opportunities: [], actions: [], inspectionTasks: [] });
            }
            const group = groups.get(String(supplier.id))!;
            if (!group.inspectionTasks.find(t => t.id === task.id)) {
                group.inspectionTasks.push(task);
            }
        });

        // 3. Apply filters and sort
        let result = Array.from(groups.values());

        // Has open support filter
        if (hasOpenSupportFilter) {
            result = result.filter(g =>
                g.actions.some(a => a.status === 'OPEN') ||
                g.inspectionTasks.some(t => t.status === 'OPEN')
            );
        }

        // Sort groups: highest severity first, then name
        const sevOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return result.sort((a, b) => {
            // Guard against empty opportunity arrays (Math.min of empty array is Infinity)
            const aSev = a.opportunities.length > 0
                ? Math.min(...a.opportunities.map(o => sevOrder[o.severity] ?? 3))
                : 3; // Default to lowest priority if no opportunities
            const bSev = b.opportunities.length > 0
                ? Math.min(...b.opportunities.map(o => sevOrder[o.severity] ?? 3))
                : 3;

            if (aSev !== bSev) return aSev - bSev;
            return a.supplier.name.localeCompare(b.supplier.name);
        });
    }, [allOpportunities, suppliers, searchQuery, severityFilter, hasOpenSupportFilter, supportActions, inspectionTasks, batchesBySupplier]);

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

    const handleInspectionTaskDone = async () => {
        if (!doneModalTarget || !doneSelectedReInspectionId) return;
        try {
            const res = await getSupplierData('updateInspectionActionDone', {
                farmId: '1',
                actionId: doneModalTarget.id,
                reInspectionId: doneSelectedReInspectionId,
                closedBy: user?.email || 'portal-manager',
            });
            if (!res || !res.success) {
                throw new Error(res?.error || 'Failed to close inspection task');
            }
            setDoneModalTarget(null);
            setDoneSelectedReInspectionId('');
            fetchAll();
        } catch (error: any) {
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                        {[
                            { label: 'High Priority', count: totalHigh, icon: FaExclamationTriangle, iconColor: 'text-red-600' },
                            { label: 'Medium Priority', count: totalMedium, icon: FaExclamationTriangle, iconColor: 'text-amber-500' },
                            { label: 'Capacity Building', count: totalLow, icon: FaCheckCircle, iconColor: 'text-blue-500' },
                            { label: 'Open Support Actions', count: openActions, icon: FaHandshake, iconColor: 'text-primary' },
                            { label: 'Awaiting Re-measurement', count: awaitingReMeasure, icon: FaHistory, iconColor: 'text-gray-600' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <InfoCard
                                    icon={item.icon}
                                    title={String(item.count)}
                                    subtitle={item.label}
                                    iconColor={item.iconColor}
                                    showInfoBadge={false}
                                    className="h-full"
                                />
                            </motion.div>
                        ))}
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
                            {paginatedGroups.map(({ supplier, opportunities, actions, inspectionTasks: group_inspectionTasks }) => (
                                <motion.div key={supplier.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/40 rounded-2xl border border-white/30 overflow-hidden">

                                    {/* Supplier Header */}
                                    <div className="bg-white/60 px-4 py-3 border-b border-white/30 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{supplier.name}</span>
                                            <span className="text-xs text-gray-500">· {supplier.type.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {opportunities.length > 0 ? `${opportunities.length} opportunities` : '0 opportunities'}
                                            {' · '}
                                            {(actions.filter(a => a.status === 'OPEN').length +
                                              group_inspectionTasks.filter(t => t.status === 'OPEN').length)} action open
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

                                        {/* D5 — Inspection corrective actions (second stream) */}
                                        {group_inspectionTasks.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                                                    Inspection corrective action
                                                </div>
                                                {group_inspectionTasks.map(task => {
                                                    const isOpen = task.status === 'OPEN';
                                                    const taskSupplierBatches =
                                                        batchesBySupplier[String(task.supplierId)] || [];
                                                    const overdueNextBatch =
                                                        task.dueTrigger?.type === 'next_batch' &&
                                                        isOpen &&
                                                        taskSupplierBatches.some(b =>
                                                            b.verifiedAt && b.verifiedAt > task.givenAt
                                                        );
                                                    const overdueDate =
                                                        task.dueTrigger?.type === 'date' &&
                                                        isOpen &&
                                                        Date.now() > task.dueTrigger.date;
                                                    const overdue = overdueNextBatch || overdueDate;

                                                    const provingInspections = (inspectionsBySupplier[String(task.supplierId)] || [])
                                                        .filter(i =>
                                                            i.validatedAt &&
                                                            typeof i.inspectionDate === 'number' &&
                                                            i.inspectionDate > task.givenAt &&
                                                            i.outcome === 'PASS'
                                                        )
                                                        // D5 follow-up §3.3 — latest first, so [0]
                                                        // is both the card's proof line and the
                                                        // modal's pre-selected default.
                                                        .sort((a, b) => (b.inspectionDate as number) - (a.inspectionDate as number));

                                                    return (
                                                        <div key={task.id} className={`flex gap-3 bg-white/50 p-3 rounded-xl border-l-4 ${
                                                            isOpen ? 'border-l-amber-400' : 'border-l-green-400'
                                                        }`}>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700">
                                                                        {task.inspectionType || 'Inspection'}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-500 uppercase">
                                                                        {task.outcome}{task.severity ? ` · ${task.severity}` : ''}
                                                                    </span>
                                                                    {overdue && isOpen && (
                                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                                                                            OVERDUE
                                                                        </span>
                                                                    )}
                                                                    {task.status === 'DONE' && (
                                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">DONE</span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-800 mb-1">
                                                                    <strong>{task.finding}</strong>
                                                                </div>
                                                                <div className="text-xs text-primary mb-1">
                                                                    Action: <span className="text-gray-700">{task.correctiveAction}</span>
                                                                </div>
                                                                <div className="text-[10px] text-gray-500">
                                                                    Owner: {task.owner || task.assignedTo || '—'}
                                                                    {' · '}
                                                                    Due: {task.dueTrigger?.type === 'date'
                                                                    ? new Date(task.dueTrigger.date).toLocaleDateString()
                                                                    : 'next delivery'}
                                                                    {task.dueTrigger?.type === 'date' && task.dueTriggerDefaulted && (
                                                                        <span className="ml-1 text-gray-400">(default)</span>
                                                                    )}
                                                                </div>
                                                                {!isOpen && task.reInspectionId && (() => {
                                                                    // D5 follow-up §4 — closed-by line on DONE cards.
                                                                    // Looks up the re-inspection by firestoreId in the
                                                                    // validated-inspections map. Missing lookup ⇒ no line.
                                                                    const closed = (inspectionsBySupplier[String(task.supplierId)] || [])
                                                                        .find(i => (i.firestoreId || i.id) === task.reInspectionId);
                                                                    if (!closed) return null;
                                                                    const cFinding = (closed as any).findings;
                                                                    const cType = (closed as any).inspectionType || 'Inspection';
                                                                    const cDate = closed.inspectionDate
                                                                        ? new Date(closed.inspectionDate).toLocaleDateString()
                                                                        : null;
                                                                    return (
                                                                        <div className="mt-1 text-[10px] text-green-700">
                                                                            Closed by: <strong>{cType} PASS</strong>
                                                                            {cFinding ? <> — "{cFinding}"</> : null}
                                                                            {cDate ? <> · {cDate}</> : null}
                                                                        </div>
                                                                    );
                                                                })()}
                                                                {isOpen && (
                                                                    <div className="mt-2">
                                                                        {provingInspections.length === 0 ? (
                                                                            <span className="text-[10px] text-gray-500">
                                                                                No validated PASS re-inspection yet
                                                                            </span>
                                                                        ) : (() => {
                                                                            // D5 follow-up §3.1 — proof line above
                                                                            // the button. Original finding stays above
                                                                            // it (audit trail); we ADD the proof, we
                                                                            // do not replace.
                                                                            const proof = provingInspections[0];
                                                                            const moreCount = provingInspections.length - 1;
                                                                            const proofFinding = (proof as any).findings;
                                                                            const proofType = (proof as any).inspectionType || 'Inspection';
                                                                            const proofInspector = (proof as any).inspector || null;
                                                                            const proofValidatedAt = (proof as any).validatedAt;
                                                                            const proofDateLabel = proofValidatedAt
                                                                                ? new Date(proofValidatedAt).toLocaleDateString()
                                                                                : 'date unknown';
                                                                            return (
                                                                                <>
                                                                                    <div className="text-[10px] text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 mb-1">
                                                                                        Re-inspection: <strong>{proofType} PASS</strong>
                                                                                        {proofFinding ? <> — "{proofFinding}"</> : null}
                                                                                        {' · '}validated {proofDateLabel}
                                                                                        {proofInspector ? <> · {proofInspector}</> : null}
                                                                                        {moreCount > 0 ? <> · (+{moreCount} more)</> : null}
                                                                                    </div>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setDoneModalTarget(task);
                                                                                                setDoneSelectedReInspectionId(proof.firestoreId || proof.id);
                                                                                            }}
                                                                                            className="px-2 py-0.5 bg-green-600 text-white text-[10px] rounded-full hover:bg-green-700"
                                                                                        >
                                                                                            Mark DONE
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Support History */}
                                        {actions.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Support History</h4>
                                                {actions.map(action => {
                                                    const isDone = action.status === 'DONE';
                                                    const actionBatches = (batchesBySupplier[supplier.id] || []).filter(
                                                        b => b.verifiedAt && b.verifiedAt > action.givenAt
                                                    );

                                                    return (
                                                        <div key={action.id} className="text-xs flex items-start gap-2 mb-3 p-2 bg-white/40 rounded-lg">
                                                            <FaCheck className={`mt-0.5 ${isDone ? 'text-green-500' : 'text-gray-300'}`} />
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-800 flex flex-wrap items-center gap-2">
                                                                    {action.supportType}
                                                                    <span className="text-gray-500 font-normal">— {new Date(action.givenAt).toLocaleDateString()}
                                                                        {isDone ? ' · ' : ' · '}
                                                                        <strong className="text-gray-700">Assigned to {action.assignedTo || 'Unassigned'}</strong>
                                                                        {' · Logged by '}{action.givenBy}</span>

                                                                    {!isDone ? (
                                                                        <button onClick={() => handleMarkDone(action.id)} className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[9px] hover:bg-gray-300">
                                                                            Mark DONE
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-green-600 font-bold text-[10px]">DONE</span>
                                                                    )}
                                                                </div>

                                                                {action.notes && (
                                                                    <div className="text-[10px] text-gray-500 italic mt-1">"{action.notes}"</div>
                                                                )}

                                                                {/* Re-measurement Chip (Problem 3) */}
                                                                {isDone && (
                                                                    <div className="mt-1.5">
                                                                        {actionBatches.length < 2 ? (
                                                                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Awaiting re-measurement — {actionBatches.length} of 2 new verified batches</span>
                                                                        ) : (
                                                                            <SinceSupportChip
                                                                                action={action}
                                                                                newBatches={actionBatches}
                                                                                weakness={action.weakness}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
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
            {/* D5 — Close inspection task modal */}
            <AnimatePresence>
                {doneModalTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-gray-900">Close Inspection Task</h3>
                                <button onClick={() => { setDoneModalTarget(null); setDoneSelectedReInspectionId(''); }} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">
                                Select the validated PASS re-inspection that proves this corrective action was addressed.
                                The task closes only when the re-inspection is new (after task creation) and validated.
                            </p>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Proving re-inspection</label>
                            <select
                                value={doneSelectedReInspectionId}
                                onChange={e => setDoneSelectedReInspectionId(e.target.value)}
                                className="w-full p-2 rounded-lg text-sm border mb-3"
                            >
                                <option value="">— select —</option>
                                {((inspectionsBySupplier[String(doneModalTarget.supplierId)] || [])
                                        .filter(i =>
                                            i.validatedAt &&
                                            typeof i.inspectionDate === 'number' &&
                                            i.inspectionDate > doneModalTarget.givenAt &&
                                            i.outcome === 'PASS'
                                        )
                                        // D5 follow-up §3.3 — same latest-first sort
                                        // as the card, so the pre-selected option is
                                        // the same proof the card showed.
                                        .sort((a, b) => (b.inspectionDate as number) - (a.inspectionDate as number))
                                ).map(i => {
                                    const findingText = (i as any).findings;
                                    const dateLabel = new Date(i.inspectionDate).toLocaleDateString();
                                    return (
                                        <option key={i.firestoreId || i.id} value={i.firestoreId || i.id}>
                                            {i.inspectionType} · {dateLabel} · PASS
                                            {findingText ? ` — "${findingText}"` : ''}
                                        </option>
                                    );
                                })}
                            </select>
                            <button
                                onClick={handleInspectionTaskDone}
                                disabled={!doneSelectedReInspectionId}
                                className="w-full py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 disabled:opacity-50"
                            >
                                Mark DONE
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SupplierDevelopmentPage;


const SinceSupportChip: React.FC<{ action: SupportAction; newBatches: any[]; weakness: string }> = ({ action, newBatches, weakness }) => {
    // Compute the current metric on the new batches
    let currentValue = 0;

    if (weakness === 'Moisture management') {
        // Replicate the moisture share logic from the detector
        const threshold = action.baselineMetricLabel.includes('>10%') ? 10 : 8;
        const wetBatches = newBatches.filter(b => (b.moistureContent ?? 0) > threshold);
        currentValue = Math.round((wetBatches.length / newBatches.length) * 100);
    } else if (weakness.includes('defects')) {
        // Replicate the defect share logic
        const threshold = action.baselineMetricLabel.includes('>10%') ? 10 : 5;
        const defectiveBatches = newBatches.filter(b => (b.defectiveRate ?? 0) > threshold);
        currentValue = Math.round((defectiveBatches.length / newBatches.length) * 100);
    } else if (weakness === 'Insufficient supplier history') {
        currentValue = newBatches.length;
    }

    const baseline = action.baselineValue;
    const diff = currentValue - baseline;

    let label = 'no change';
    let color = 'text-gray-600';
    let icon = '—';

    // For "history" a higher number is better. For shares, lower is better.
    const isHistory = weakness === 'Insufficient supplier history';
    const improved = isHistory ? diff > 0 : diff < 0;
    const worsened = isHistory ? diff < 0 : diff > 0;

    if (improved) {
        label = 'improved';
        color = 'text-green-600';
        icon = '▼'; // Or ▲ for history
    } else if (worsened) {
        label = 'worsened';
        color = 'text-red-600';
        icon = '▲'; // Or ▼ for history
    }

    // Fix icons for history (higher is better)
    if (isHistory) {
        icon = improved ? '▲' : worsened ? '▼' : '—';
    }

    return (
        <span className={`text-[10px] font-medium bg-white/60 border border-white/40 px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${color}`}>
            Since support: {action.baselineMetricLabel} {baseline}% → {currentValue}% {icon} {label}
        </span>
    );
};