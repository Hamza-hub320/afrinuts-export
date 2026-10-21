import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FaUserPlus, FaUsers, FaBox, FaCheckCircle,
    FaTrash, FaEdit, FaPlus, FaMinus, FaSearch,
    FaSave, FaTimes, FaUserShield, FaUserClock,
    FaExclamationTriangle, FaLink, FaTrophy,
    FaEnvelope, FaLock, FaChartLine, FaShip, FaLightbulb,
} from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getAdminData } from '@/services/api';
import { GiFarmer } from 'react-icons/gi';

interface Buyer {
    id: string;
    email: string;
    companyName: string;
    contactPerson: string;
    allowedBatchIds: string[];
    allowedBatchCount: number;
    allowedMasterBatchIds: string[];
    allowedMasterCount: number;
    isActive: boolean;
    uid: string | null;
    createdAt: string;
    lastLoginAt: string | null;
}

interface BatchSummary {
    id: string;
    batchId: string;
    processingDate: number;
    qualityGrade: string;
    sourceType: string;
    weightKg: number;
}

interface MasterBatchSummary {
    id: string;
    masterBatchNumber: string;
    shipmentName: string | null;
    buyer: string | null;
    destination: string | null;
    exportDate: number | null;
    totalBatches: number;
    totalWeightKg: number;
    grades: string | null;
    batchNumbers: string[];
    traceabilityUrl: string | null;
}

// ── Helpers ─────────────────────────────────────────────
const relativeTime = (iso: string | null): string => {
    if (!iso) return 'Never';
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
};

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

const AdminBuyers: React.FC = () => {
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [allBatches, setAllBatches] = useState<BatchSummary[]>([]);
    const [allMasters, setAllMasters] = useState<MasterBatchSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [createOpen, setCreateOpen] = useState(false);
    const [editBuyer, setEditBuyer] = useState<Buyer | null>(null);
    const [assignBuyer, setAssignBuyer] = useState<Buyer | null>(null);
    const [assignKind, setAssignKind] = useState<'batch' | 'master'>('batch');

    const [formEmail, setFormEmail] = useState('');
    const [formCompany, setFormCompany] = useState('');
    const [formContact, setFormContact] = useState('');
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            const [buyersRes, batchesRes, mastersRes] = await Promise.all([
                getAdminData('admin_listBuyers'),
                getAdminData('admin_listBatches'),
                getAdminData('admin_listMasterBatches'),
            ]);
            setBuyers(buyersRes.buyers || []);
            setAllBatches(batchesRes.batches || []);
            setAllMasters(mastersRes.masters || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError(null);
        try {
            await getAdminData('admin_createBuyer', {
                email: formEmail,
                companyName: formCompany,
                contactPerson: formContact,
                allowedBatchIds: [],
                allowedMasterBatchIds: [],
            });
            setCreateOpen(false);
            setFormEmail('');
            setFormCompany('');
            setFormContact('');
            await loadData();
        } catch (err: any) {
            setFormError(err.message || 'Failed to create buyer');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editBuyer) return;
        setSaving(true);
        setFormError(null);
        try {
            await getAdminData('admin_updateBuyer', {
                buyerId: editBuyer.id,
                companyName: formCompany,
                contactPerson: formContact,
            });
            setEditBuyer(null);
            await loadData();
        } catch (err: any) {
            setFormError(err.message || 'Failed to update');
        } finally {
            setSaving(false);
        }
    };

    const handleAssignToggle = async (id: string, kind: 'batch' | 'master' = 'batch') => {
        if (!assignBuyer) return;
        const list = kind === 'master' ? assignBuyer.allowedMasterBatchIds : assignBuyer.allowedBatchIds;
        const isAssigned = list.includes(id);
        try {
            const result = await getAdminData('admin_assignBatches', {
                buyerId: assignBuyer.id,
                batchIds: [id],
                kind,
                mode: isAssigned ? 'remove' : 'add',
            });
            const updated: Buyer = {
                ...assignBuyer,
                allowedBatchIds: result.allowedBatchIds || [],
                allowedBatchCount: (result.allowedBatchIds || []).length,
                allowedMasterBatchIds: result.allowedMasterBatchIds || [],
                allowedMasterCount: (result.allowedMasterBatchIds || []).length,
            };
            setAssignBuyer(updated);
            setBuyers(prev => prev.map(b => (b.id === assignBuyer.id ? updated : b)));
        } catch (err: any) {
            // Surface server-side hint if buyer already has the other kind
            const msg = err?.message || '';
            alert('Failed to update assignment: ' + msg);
        }
    };

    const handleDelete = async (buyer: Buyer) => {
        if (!window.confirm(`Delete buyer "${buyer.companyName}"? This cannot be undone.`)) return;
        try {
            await getAdminData('admin_deleteBuyer', { buyerId: buyer.id });
            await loadData();
        } catch (err: any) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const openEdit = (buyer: Buyer) => {
        setEditBuyer(buyer);
        setFormCompany(buyer.companyName);
        setFormContact(buyer.contactPerson || '');
        setFormError(null);
    };

    const openAssign = (buyer: Buyer) => {
        setAssignBuyer(buyer);
        setAssignKind(buyer.allowedMasterCount > 0 ? 'master' : 'batch');
    };

    const filteredBuyers = buyers.filter(b =>
        b.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        || b.email.toLowerCase().includes(searchQuery.toLowerCase())
        || b.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── Intelligence metrics ────────────────────────────
    const intel = useMemo(() => {
        const total = buyers.length;
        const active = buyers.filter(b => b.isActive).length;
        const totalAssignments = buyers.reduce((s, b) => s + b.allowedBatchCount, 0);
        const totalBulk = buyers.reduce((s, b) => s + b.allowedMasterCount, 0);
        const unassigned = buyers.filter(b => b.allowedBatchCount === 0 && b.allowedMasterCount === 0).length;
        const neverLoggedIn = buyers.filter(b => !b.uid).length;
        const avgAssignments = total > 0 ? (totalAssignments + totalBulk) / total : 0;
        const topBuyer = [...buyers].sort(
            (a, b) => (b.allowedBatchCount + b.allowedMasterCount) - (a.allowedBatchCount + a.allowedMasterCount)
        )[0];
        return { total, active, totalAssignments, totalBulk, unassigned, neverLoggedIn, avgAssignments, topBuyer };
    }, [buyers]);

    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden pt-[72px]">
                <DashboardNavbar />
                <Section className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <GiFarmer className="text-primary text-3xl" />
                        </div>
                    </div>
                </Section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen relative overflow-hidden pt-[72px]">
                <DashboardNavbar />
                <Section className="py-12">
                    <div className="max-w-md mx-auto">
                        <InfoCard icon={FaUserShield} title="Access Error" variant="accent" showInfoBadge={false}>
                            <Typography variant="body" className="text-gray-700 mb-4 text-sm">{error}</Typography>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium"
                            >
                                Retry
                            </button>
                        </InfoCard>
                    </div>
                </Section>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            {/* ── Hero ──────────────────────────────────────── */}
            <Section fullHeight={false} className="flex items-center justify-center text-center min-h-[38vh] relative">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-12" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaUsers className="inline mr-3 text-accent" />
                            Buyer Relations
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Buyer Management
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Provision buyer accounts, grant portal access, and assign the exact batches or bulk shipments each buyer can see.
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            <div className="dashboard-content container mx-auto px-4 py-6 relative z-10 max-w-6xl">
                {/* ── Workflow banner ────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <GlassCard className="!p-0">
                        <div className="p-4 sm:p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <FaLightbulb className="text-amber-500" />
                                <Typography variant="small" className="font-semibold text-primary">
                                    How buyer onboarding works
                                </Typography>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                {[
                                    { icon: FaUserPlus, label: 'Create buyer', hint: 'Company + email' },
                                    { icon: FaLink,     label: 'Assign shipments', hint: 'Batches or bulk' },
                                    { icon: FaEnvelope, label: 'Buyer receives link', hint: 'Via /portal/login' },
                                    { icon: FaCheckCircle, label: 'Buyer sees shipments', hint: 'Only assigned' },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <step.icon className="text-primary text-sm" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-primary">{step.label}</div>
                                            <div className="text-xs text-gray-500">{step.hint}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* ── KPI Cards ─────────────────────────────── */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <GlassCard>
                        <motion.div variants={fadeIn} className="text-center">
                            <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-2">
                                <FaUsers className="text-xl text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-primary">{intel.total}</div>
                            <div className="text-xs text-gray-600 mt-1">Total Buyers</div>
                        </motion.div>
                    </GlassCard>
                    <GlassCard>
                        <motion.div variants={fadeIn} className="text-center">
                            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                                <FaCheckCircle className="text-xl text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600">{intel.active}</div>
                            <div className="text-xs text-gray-600 mt-1">Active</div>
                        </motion.div>
                    </GlassCard>
                    <GlassCard>
                        <motion.div variants={fadeIn} className="text-center">
                            <div className="bg-accent/10 p-3 rounded-full w-fit mx-auto mb-2">
                                <FaBox className="text-xl text-accent" />
                            </div>
                            <div className="text-2xl font-bold text-accent">
                                {intel.totalAssignments}
                                {intel.totalBulk > 0 && (
                                    <span className="text-sm text-blue-600 ml-1">+ {intel.totalBulk} bulk</span>
                                )}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Assignments</div>
                        </motion.div>
                    </GlassCard>
                    <GlassCard>
                        <motion.div variants={fadeIn} className="text-center">
                            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-2">
                                <FaChartLine className="text-xl text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600">{intel.avgAssignments.toFixed(1)}</div>
                            <div className="text-xs text-gray-600 mt-1">Avg. per buyer</div>
                        </motion.div>
                    </GlassCard>
                </motion.div>

                {/* ── Intelligence strip ────────────────────── */}
                {(intel.unassigned > 0 || intel.neverLoggedIn > 0 || (intel.topBuyer && (intel.topBuyer.allowedBatchCount + intel.topBuyer.allowedMasterCount) > 0)) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
                    >
                        {intel.unassigned > 0 && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50/60 backdrop-blur-sm p-3 flex items-start gap-3">
                                <FaExclamationTriangle className="text-amber-600 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-amber-800">{intel.unassigned} unassigned buyer{intel.unassigned !== 1 ? 's' : ''}</div>
                                    <div className="text-xs text-amber-700">Created but no shipments yet — assign to activate.</div>
                                </div>
                            </div>
                        )}
                        {intel.neverLoggedIn > 0 && (
                            <div className="rounded-xl border border-blue-200 bg-blue-50/60 backdrop-blur-sm p-3 flex items-start gap-3">
                                <FaUserClock className="text-blue-600 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-blue-800">{intel.neverLoggedIn} never logged in</div>
                                    <div className="text-xs text-blue-700">Buyer hasn't clicked their magic link yet.</div>
                                </div>
                            </div>
                        )}
                        {intel.topBuyer && (intel.topBuyer.allowedBatchCount + intel.topBuyer.allowedMasterCount) > 0 && (
                            <div className="rounded-xl border border-green-200 bg-green-50/60 backdrop-blur-sm p-3 flex items-start gap-3">
                                <FaTrophy className="text-green-600 mt-0.5" />
                                <div className="text-sm">
                                    <div className="font-medium text-green-800">Top buyer: {intel.topBuyer.companyName}</div>
                                    <div className="text-xs text-green-700">
                                        {intel.topBuyer.allowedBatchCount + intel.topBuyer.allowedMasterCount} shipment{
                                        (intel.topBuyer.allowedBatchCount + intel.topBuyer.allowedMasterCount) !== 1 ? 's' : ''
                                    } assigned
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── Actions row (Create + Search) ─────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by company, email, or contact…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button
                        onClick={() => { setCreateOpen(true); setFormError(null); setFormEmail(''); setFormCompany(''); setFormContact(''); }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-5 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition text-sm"
                    >
                        <FaUserPlus /> Create Buyer
                    </button>
                </div>

                {/* ── Buyers list ───────────────────────────── */}
                {filteredBuyers.length === 0 ? (
                    <GlassCard>
                        <div className="text-center py-10">
                            <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                                <FaUsers className="text-3xl text-primary" />
                            </div>
                            <Typography variant="h4" className="text-primary mb-2">
                                {buyers.length === 0 ? 'No buyers yet' : 'No matches'}
                            </Typography>
                            <Typography variant="body" className="text-gray-500 mb-4 text-sm max-w-md mx-auto">
                                {buyers.length === 0
                                    ? 'Create your first buyer to start granting portal access.'
                                    : 'Try a different search term.'}
                            </Typography>
                            {buyers.length === 0 && (
                                <button
                                    onClick={() => setCreateOpen(true)}
                                    className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2"
                                >
                                    <FaUserPlus /> Create First Buyer
                                </button>
                            )}
                        </div>
                    </GlassCard>
                ) : (
                    <div className="space-y-3">
                        {filteredBuyers.map((buyer) => {
                            const totalAssigned = buyer.allowedBatchCount + buyer.allowedMasterCount;
                            const isUnassigned = totalAssigned === 0;
                            const statusColor = !buyer.isActive
                                ? 'bg-gray-400'
                                : isUnassigned
                                    ? 'bg-amber-400'
                                    : buyer.allowedMasterCount > 0
                                        ? 'bg-blue-500'
                                        : 'bg-green-500';
                            return (
                                <motion.div
                                    key={buyer.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusColor}`} />
                                        <div className="p-5 pl-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    {/* Header row */}
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className="font-semibold text-primary text-lg truncate">{buyer.companyName}</span>
                                                        {buyer.isActive ? (
                                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">Inactive</span>
                                                        )}
                                                        {buyer.uid ? (
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full inline-flex items-center gap-1">
                                                                <FaLock className="text-[9px]" /> Activated
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full inline-flex items-center gap-1">
                                                                <FaUserClock className="text-[9px]" /> Not logged in
                                                            </span>
                                                        )}
                                                        {isUnassigned && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full inline-flex items-center gap-1">
                                                                <FaExclamationTriangle className="text-[9px]" /> No shipments
                                                            </span>
                                                        )}
                                                        {buyer.allowedMasterCount > 0 && (
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full inline-flex items-center gap-1">
                                                                <FaShip className="text-[9px]" /> Bulk
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Contact info */}
                                                    <div className="text-sm text-gray-600 space-y-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <FaEnvelope className="text-[10px] text-gray-400" />
                                                            <span className="truncate">{buyer.email}</span>
                                                        </div>
                                                        {buyer.contactPerson && (
                                                            <div className="text-xs text-gray-500 pl-4">{buyer.contactPerson}</div>
                                                        )}
                                                    </div>

                                                    {/* Meta strip */}
                                                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                                                        <span className="inline-flex items-center gap-1">
                                                            <FaBox className="text-[10px]" />
                                                            <strong className={buyer.allowedBatchCount > 0 ? 'text-primary' : 'text-gray-400'}>
                                                                {buyer.allowedBatchCount}
                                                            </strong>
                                                            {' '}batch{buyer.allowedBatchCount !== 1 ? 'es' : ''}
                                                        </span>
                                                        {buyer.allowedMasterCount > 0 && (
                                                            <>
                                                                <span className="text-gray-300">·</span>
                                                                <span className="inline-flex items-center gap-1 text-blue-700">
                                                                    <FaShip className="text-[10px]" />
                                                                    <strong>{buyer.allowedMasterCount}</strong> bulk shipment{buyer.allowedMasterCount !== 1 ? 's' : ''}
                                                                </span>
                                                            </>
                                                        )}
                                                        <span className="text-gray-300">·</span>
                                                        <span title={buyer.lastLoginAt || 'Never'}>
                                                            {buyer.uid ? `Last seen ${relativeTime(buyer.lastLoginAt)}` : 'Awaiting first login'}
                                                        </span>
                                                        <span className="text-gray-300">·</span>
                                                        <span title={buyer.createdAt}>
                                                            Created {relativeTime(buyer.createdAt)}
                                                        </span>
                                                    </div>

                                                    {/* Chips preview: individual batches + bulk masters */}
                                                    {(buyer.allowedBatchIds.length > 0 || buyer.allowedMasterBatchIds.length > 0) && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {buyer.allowedBatchIds.slice(0, 4).map((bid) => (
                                                                <span key={bid} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-mono">
                                                                    {bid}
                                                                </span>
                                                            ))}
                                                            {buyer.allowedBatchIds.length > 4 && (
                                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                                                                    +{buyer.allowedBatchIds.length - 4} more
                                                                </span>
                                                            )}
                                                            {buyer.allowedMasterBatchIds.slice(0, 2).map((mid) => (
                                                                <span key={mid} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-mono inline-flex items-center gap-1">
                                                                    <FaShip className="text-[8px]" />
                                                                    {mid}
                                                                </span>
                                                            ))}
                                                            {buyer.allowedMasterBatchIds.length > 2 && (
                                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                                                                    +{buyer.allowedMasterBatchIds.length - 2} bulk
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 flex-wrap md:flex-nowrap md:items-start">
                                                    <button
                                                        onClick={() => openAssign(buyer)}
                                                        className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition flex items-center gap-1.5"
                                                    >
                                                        <FaBox className="text-[10px]" />
                                                        Assign
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(buyer)}
                                                        className="px-3 py-2 bg-white/70 border border-gray-200 rounded-lg text-xs font-medium hover:bg-white transition flex items-center gap-1.5"
                                                    >
                                                        <FaEdit className="text-[10px]" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(buyer)}
                                                        className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition flex items-center gap-1.5"
                                                    >
                                                        <FaTrash className="text-[10px]" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Create Modal ───────────────────────────────── */}
            <Transition.Root show={createOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setCreateOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-lg font-semibold text-primary">Create Buyer</Dialog.Title>
                                    <button onClick={() => setCreateOpen(false)} className="text-gray-400 hover:text-gray-600">
                                        <FaTimes />
                                    </button>
                                </div>
                                <form onSubmit={handleCreate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                            placeholder="procurement@nutriglobal.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                                        <input
                                            type="text"
                                            value={formCompany}
                                            onChange={(e) => setFormCompany(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                            placeholder="NutriGlobal BV"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                        <input
                                            type="text"
                                            value={formContact}
                                            onChange={(e) => setFormContact(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                            placeholder="Jan de Vries"
                                        />
                                    </div>
                                    {formError && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                                            <Typography variant="small" className="text-red-700 text-xs">{formError}</Typography>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2">
                                        <button type="button" onClick={() => setCreateOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={saving} className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                                            {saving ? 'Creating...' : 'Create Buyer'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* ── Edit Modal ──────────────────────────────────── */}
            <Transition.Root show={!!editBuyer} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setEditBuyer(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-lg font-semibold text-primary">Edit Buyer</Dialog.Title>
                                    <button onClick={() => setEditBuyer(null)} className="text-gray-400 hover:text-gray-600">
                                        <FaTimes />
                                    </button>
                                </div>
                                <form onSubmit={handleUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" value={editBuyer?.email || ''} disabled className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            value={formCompany}
                                            onChange={(e) => setFormCompany(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                        <input
                                            type="text"
                                            value={formContact}
                                            onChange={(e) => setFormContact(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        />
                                    </div>
                                    {formError && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                                            <Typography variant="small" className="text-red-700 text-xs">{formError}</Typography>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2">
                                        <button type="button" onClick={() => setEditBuyer(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={saving} className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                                            <FaSave className="text-xs" />
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* ── Assign Batches / Bulk Modal ────────────────── */}
            <Transition.Root show={!!assignBuyer} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAssignBuyer(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 max-h-[85vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-2">
                                    <Dialog.Title className="text-lg font-semibold text-primary">
                                        Assign shipments to {assignBuyer?.companyName}
                                    </Dialog.Title>
                                    <button onClick={() => setAssignBuyer(null)} className="text-gray-400 hover:text-gray-600">
                                        <FaTimes />
                                    </button>
                                </div>
                                <Typography variant="small" className="text-gray-500 text-xs mb-4">
                                    A buyer can hold either individual batches or bulk shipments — not both. Click to toggle.
                                </Typography>

                                {/* Kind toggle */}
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setAssignKind('batch')}
                                        className={`py-2 rounded-lg text-xs font-medium transition ${
                                            assignKind === 'batch' ? 'bg-primary text-white shadow' : 'text-gray-600'
                                        }`}
                                    >
                                        Individual Batches ({assignBuyer?.allowedBatchCount || 0})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAssignKind('master')}
                                        className={`py-2 rounded-lg text-xs font-medium transition ${
                                            assignKind === 'master' ? 'bg-primary text-white shadow' : 'text-gray-600'
                                        }`}
                                    >
                                        Bulk Shipments ({assignBuyer?.allowedMasterCount || 0})
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {assignKind === 'batch' ? (
                                        allBatches.map((b) => {
                                            const isAssigned = assignBuyer?.allowedBatchIds.includes(b.batchId);
                                            return (
                                                <button
                                                    key={b.id}
                                                    onClick={() => handleAssignToggle(b.batchId, 'batch')}
                                                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                                                        isAssigned
                                                            ? 'bg-primary/10 border-primary/40'
                                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                                isAssigned ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                                                            }`}>
                                                                {isAssigned ? <FaMinus className="text-[10px]" /> : <FaPlus className="text-[10px]" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-mono text-sm font-medium truncate">{b.batchId}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    {new Date(b.processingDate).toLocaleDateString()} · {b.qualityGrade} · {(b.weightKg / 1000).toFixed(1)}T
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isAssigned && (
                                                            <FaCheckCircle className="text-primary text-sm flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        allMasters.map((m) => {
                                            const isAssigned = assignBuyer?.allowedMasterBatchIds.includes(m.masterBatchNumber);
                                            return (
                                                <button
                                                    key={m.id}
                                                    onClick={() => handleAssignToggle(m.masterBatchNumber, 'master')}
                                                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                                                        isAssigned
                                                            ? 'bg-blue-50 border-blue-300'
                                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                                isAssigned ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                                            }`}>
                                                                {isAssigned ? <FaMinus className="text-[10px]" /> : <FaPlus className="text-[10px]" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-mono text-sm font-medium truncate">{m.masterBatchNumber}</div>
                                                                <div className="text-xs text-gray-500 truncate">
                                                                    {m.shipmentName || '—'} · {m.totalBatches} batches · {(m.totalWeightKg / 1000).toFixed(1)}T
                                                                    {m.destination ? ` · ${m.destination}` : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isAssigned && <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0" />}
                                                    </div>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>

                                {assignKind === 'batch' && assignBuyer && assignBuyer.allowedMasterCount > 0 && (
                                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                                        This buyer currently holds {assignBuyer.allowedMasterCount} bulk shipment{assignBuyer.allowedMasterCount !== 1 ? 's' : ''}. Remove those first before assigning individual batches.
                                    </div>
                                )}
                                {assignKind === 'master' && assignBuyer && assignBuyer.allowedBatchCount > 0 && (
                                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                                        This buyer currently holds {assignBuyer.allowedBatchCount} individual batch{assignBuyer.allowedBatchCount !== 1 ? 'es' : ''}. Remove those first before assigning bulk shipments.
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setAssignBuyer(null)}
                                        className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Done
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default AdminBuyers;