import React, { useEffect, useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaUserPlus, FaUsers, FaBox, FaCheckCircle,
    FaArrowLeft, FaTrash, FaEdit, FaPlus, FaMinus, FaSearch,
    FaSave, FaTimes, FaShieldAlt,
} from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@/components/Section/Section';
import { getAdminData } from '@/services/api';

interface Buyer {
    id: string;
    email: string;
    companyName: string;
    contactPerson: string;
    allowedBatchIds: string[];
    allowedBatchCount: number;
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

const AdminBuyers: React.FC = () => {
    const navigate = useNavigate();
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [allBatches, setAllBatches] = useState<BatchSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [createOpen, setCreateOpen] = useState(false);
    const [editBuyer, setEditBuyer] = useState<Buyer | null>(null);
    const [assignBuyer, setAssignBuyer] = useState<Buyer | null>(null);

    // Form state
    const [formEmail, setFormEmail] = useState('');
    const [formCompany, setFormCompany] = useState('');
    const [formContact, setFormContact] = useState('');
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const loadData = async () => {
        try {
            const [buyersRes, batchesRes] = await Promise.all([
                getAdminData('admin_listBuyers'),
                getAdminData('admin_listBatches'),
            ]);
            setBuyers(buyersRes.buyers || []);
            setAllBatches(batchesRes.batches || []);
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

    const handleAssignToggle = async (batchId: string) => {
        if (!assignBuyer) return;
        const isAssigned = assignBuyer.allowedBatchIds.includes(batchId);
        try {
            const result = await getAdminData('admin_assignBatches', {
                buyerId: assignBuyer.id,
                batchIds: [batchId],
                mode: isAssigned ? 'remove' : 'add',
            });
            const updated = { ...assignBuyer, allowedBatchIds: result.allowedBatchIds };
            setAssignBuyer(updated);
            setBuyers(prev => prev.map(b => b.id === assignBuyer.id ? { ...b, allowedBatchIds: result.allowedBatchIds, allowedBatchCount: result.allowedBatchIds.length } : b));
        } catch (err: any) {
            alert('Failed to update assignment: ' + err.message);
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

    const filteredBuyers = buyers.filter(b =>
        b.companyName.toLowerCase().includes(searchQuery.toLowerCase())
        || b.email.toLowerCase().includes(searchQuery.toLowerCase())
        || b.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-[72px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-[72px] px-4">
                <div className="max-w-md mx-auto mt-12">
                    <InfoCard icon={FaShieldAlt} title="Access Error" variant="accent" showInfoBadge={false}>
                        <Typography variant="body" className="text-gray-700 mb-4">{error}</Typography>
                        <Link to="/" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium">
                            Back to Home
                        </Link>
                    </InfoCard>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-[72px] bg-gradient-to-br from-primary/5 to-accent/5">
            <Section className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <Link to="/portal" className="inline-flex items-center gap-2 text-primary hover:text-accent mb-3 text-sm">
                                <FaArrowLeft className="text-xs" /> Back to Portal
                            </Link>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2 text-sm">
                                <FaShieldAlt className="inline mr-2 text-accent" />
                                Admin
                            </Typography>
                            <Typography variant="h1" className="text-3xl md:text-4xl font-display text-text-dark">
                                Buyer Management
                            </Typography>
                        </div>
                        <button
                            onClick={() => { setCreateOpen(true); setFormError(null); setFormEmail(''); setFormCompany(''); setFormContact(''); }}
                            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition"
                        >
                            <FaUserPlus />
                            Create Buyer
                        </button>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        <InfoCard icon={FaUsers} title={String(buyers.length)} subtitle="Total Buyers" iconColor="text-accent" showInfoBadge={false} />
                        <InfoCard icon={FaCheckCircle} title={String(buyers.filter(b => b.isActive).length)} subtitle="Active" iconColor="text-green-600" showInfoBadge={false} />
                        <InfoCard icon={FaBox} title={String(buyers.reduce((s, b) => s + b.allowedBatchCount, 0))} subtitle="Total Assignments" iconColor="text-primary" showInfoBadge={false} />
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by company, email, or contact..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Buyers List */}
                    {filteredBuyers.length === 0 ? (
                        <InfoCard icon={FaUsers} title="No buyers yet" variant="primary" showInfoBadge={false} className="text-center">
                            <Typography variant="body" className="text-gray-500 mb-4">
                                Create your first buyer to start granting portal access.
                            </Typography>
                            <button
                                onClick={() => setCreateOpen(true)}
                                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium"
                            >
                                Create First Buyer
                            </button>
                        </InfoCard>
                    ) : (
                        <div className="space-y-3">
                            {filteredBuyers.map((buyer) => (
                                <motion.div
                                    key={buyer.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-5 shadow-md">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="font-semibold text-primary text-lg">{buyer.companyName}</span>
                                                    {buyer.isActive ? (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">Inactive</span>
                                                    )}
                                                    {buyer.uid && (
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Logged in</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600 space-y-0.5">
                                                    <div>{buyer.email}</div>
                                                    {buyer.contactPerson && <div className="text-xs text-gray-500">{buyer.contactPerson}</div>}
                                                </div>
                                                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                                                    <span><FaBox className="inline mr-1 text-[10px]" />{buyer.allowedBatchCount} batches assigned</span>
                                                    {buyer.lastLoginAt && (
                                                        <span>Last login: {new Date(buyer.lastLoginAt).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                                                <button
                                                    onClick={() => setAssignBuyer(buyer)}
                                                    className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition flex items-center gap-1.5"
                                                >
                                                    <FaBox className="text-[10px]" />
                                                    Assign Batches
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
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </Section>

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

            {/* ── Assign Batches Modal ────────────────────────── */}
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
                                        Assign Batches to {assignBuyer?.companyName}
                                    </Dialog.Title>
                                    <button onClick={() => setAssignBuyer(null)} className="text-gray-400 hover:text-gray-600">
                                        <FaTimes />
                                    </button>
                                </div>
                                <Typography variant="small" className="text-gray-500 text-xs mb-4">
                                    Click a batch to toggle assignment. Assigned batches are highlighted.
                                </Typography>

                                <div className="space-y-2">
                                    {allBatches.map((b) => {
                                        const isAssigned = assignBuyer?.allowedBatchIds.includes(b.batchId);
                                        return (
                                            <button
                                                key={b.id}
                                                onClick={() => handleAssignToggle(b.batchId)}
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
                                    })}
                                </div>

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