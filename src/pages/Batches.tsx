import React, { useEffect, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import {
    FaBox, FaSearch, FaTimes, FaCheckCircle, FaTimesCircle,
    FaLeaf, FaFireExtinguisher, FaChild, FaChartBar,
    FaStar, FaCalendarAlt, FaDollarSign, FaUser,
    FaFlask, FaIndustry
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getSupplierData } from '../services/api';
import { Dialog, Transition } from '@headlessui/react';

interface Batch {
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
    notes?: string;
    sourceType?: string;
}

const Batches: React.FC = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGrade, setFilterGrade] = useState('All');
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [batchDetail, setBatchDetail] = useState<any>(null);
    const [modalLoading, setModalLoading] = useState(false);

    const isDevelopment = import.meta.env.DEV;

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const data = await getSupplierData('getAllBatches');
                setBatches(data.batches || []);
            } catch (error) {
                console.error('Error fetching batches:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, []);

    const openBatchDetail = async (batch: Batch) => {
        setSelectedBatch(batch);
        setModalLoading(true);
        try {
            const data = await getSupplierData('getBatchDetail', { batchId: batch.id });
            setBatchDetail(data);
        } catch (error) {
            console.error('Error fetching batch detail:', error);
        } finally {
            setModalLoading(false);
        }
    };

    const parseTestResults = (json: string) => {
        try { return JSON.parse(json); } catch { return {}; }
    };

    const filteredBatches = batches.filter(b => {
        const matchSearch = b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchGrade = filterGrade === 'All' || b.qualityGrade === filterGrade;
        return matchSearch && matchGrade;
    });

    const totalBatches = batches.length;
    const premiumBatches = batches.filter(b => b.qualityGrade === 'PREMIUM').length;
    const avgQuality = batches.length > 0
        ? (batches.reduce((s, b) => s + (b.qualityScore || 0), 0) / batches.length).toFixed(1)
        : '0';
    const totalWeight = batches.reduce((s, b) => s + (b.weightKg || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen pt-[72px]">
                <DashboardNavbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    const gradeFilters = ['All', 'PREMIUM', 'STANDARD'];

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[40vh] relative">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-12" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaBox className="inline mr-3 text-accent" />
                            Quality Control Center
                        </Typography>
                    </motion.div>
                    <motion.h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                        Batch Management
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Track every delivery, monitor quality metrics, and link batches to suppliers and financial records.
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* KPI Cards */}
            <Section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <motion.div variants={fadeIn}>
                            <InfoCard icon={FaBox} title={String(totalBatches)} subtitle="Total Batches" iconColor="text-accent" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.1 }}>
                            <InfoCard icon={FaStar} title={String(premiumBatches)} subtitle="Premium Grade" iconColor="text-yellow-500" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.2 }}>
                            <InfoCard icon={FaChartBar} title={`${avgQuality}%`} subtitle="Avg. Quality Score" iconColor="text-primary" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                            <InfoCard icon={FaIndustry} title={`${(totalWeight / 1000).toFixed(0)}T`} subtitle="Total Weight" iconColor="text-green-600" showInfoBadge={false} />
                        </motion.div>
                    </motion.div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative w-full sm:min-w-[280px] sm:max-w-sm">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="text" placeholder="Search batches..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                   className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/60 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {gradeFilters.map(grade => (
                                <motion.button key={grade} onClick={() => setFilterGrade(grade)}
                                               className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterGrade === grade ? 'bg-primary text-white shadow-md' : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'}`}
                                               whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                    {grade === 'All' ? 'All Grades' : grade}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Batch Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBatches.map((batch, idx) => (
                            <motion.div key={batch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        onClick={() => openBatchDetail(batch)} className="cursor-pointer">
                                <InfoCard title={batch.batchNumber}
                                          subtitle={`${new Date(batch.processingDate).toLocaleDateString()} · ${(batch.weightKg / 1000).toFixed(1)}T`}
                                          icon={FaBox} iconColor="text-accent" showInfoBadge={false} className="h-full hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${batch.qualityGrade === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {batch.qualityGrade}
                                        </span>
                                        <span className="text-xs text-gray-500">Score: {batch.qualityScore?.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs text-gray-500">Moisture: {batch.moistureContent}%</span>
                                        <span className="text-xs text-gray-500">Defects: {batch.defectiveRate}%</span>
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        {batch.sustainableHarvesting && <FaLeaf className="text-green-500 text-xs" />}
                                        {batch.firebreakProtection && <FaFireExtinguisher className="text-orange-500 text-xs" />}
                                        {batch.noChildLabor && <FaChild className="text-blue-500 text-xs" />}
                                    </div>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Batch Detail Modal */}
            <Transition.Root show={!!selectedBatch} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedBatch(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:scale-95">
                                <Dialog.Panel className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl text-left shadow-xl backdrop-blur-lg transition-all"
                                              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.9) 100%)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 32px rgba(165,105,66,0.2), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
                                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }} />

                                    <div className="relative z-10 p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <Dialog.Title as="h2" className="text-2xl font-bold text-primary">{selectedBatch?.batchNumber}</Dialog.Title>
                                                <p className="text-sm text-gray-500">{selectedBatch?.sourceType?.replace(/_/g, ' ')} · {selectedBatch?.processingDate ? new Date(selectedBatch.processingDate).toLocaleDateString() : ''}</p>
                                            </div>
                                            <button onClick={() => setSelectedBatch(null)} className="text-gray-400 hover:text-gray-600"><FaTimes className="text-xl" /></button>
                                        </div>

                                        {modalLoading ? (
                                            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                                        ) : batchDetail ? (
                                            <div className="space-y-6">
                                                {/* Quality Metrics */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {[
                                                        { label: 'Quality Score', value: `${selectedBatch?.qualityScore?.toFixed(1)}%`, color: 'text-primary' },
                                                        { label: 'Moisture', value: `${selectedBatch?.moistureContent}%`, color: 'text-blue-600' },
                                                        { label: 'Defect Rate', value: `${selectedBatch?.defectiveRate}%`, color: 'text-red-600' },
                                                        { label: 'Kernel Ratio', value: `${selectedBatch?.kernelRatio}%`, color: 'text-green-600' },
                                                    ].map((m, i) => (
                                                        <div key={i} className="bg-white/50 rounded-xl p-3 text-center border border-white/30">
                                                            <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                                                            <div className="text-xs text-gray-500">{m.label}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Test Results */}
                                                {selectedBatch?.testResults && (
                                                    <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                        <h4 className="font-medium text-primary mb-2 flex items-center gap-2"><FaFlask /> Test Results</h4>
                                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                                            {Object.entries(parseTestResults(selectedBatch.testResults)).map(([key, value]) => (
                                                                <div key={key} className="text-center">
                                                                    <div className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                                                                    <div className="font-semibold">{String(value)}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Compliance */}
                                                <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                    <h4 className="font-medium text-primary mb-2">Compliance</h4>
                                                    <div className="flex gap-4">
                                                        {selectedBatch?.sustainableHarvesting && <span className="text-green-600 text-sm flex items-center gap-1"><FaCheckCircle /> Sustainable</span>}
                                                        {selectedBatch?.firebreakProtection && <span className="text-orange-500 text-sm flex items-center gap-1"><FaCheckCircle /> Firebreak</span>}
                                                        {selectedBatch?.noChildLabor && <span className="text-blue-500 text-sm flex items-center gap-1"><FaCheckCircle /> No Child Labor</span>}
                                                    </div>
                                                </div>

                                                {/* Linked Supplier */}
                                                {batchDetail.supplier && (
                                                    <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                        <h4 className="font-medium text-primary mb-2 flex items-center gap-2"><FaUser /> Supplier</h4>
                                                        <p className="font-medium">{batchDetail.supplier.name}</p>
                                                        <p className="text-sm text-gray-500">{batchDetail.supplier.contactPerson} · {batchDetail.supplier.phone}</p>
                                                    </div>
                                                )}

                                                {/* Financial Summary */}
                                                {(batchDetail.expenses?.length > 0 || batchDetail.revenues?.length > 0) && (
                                                    <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                        <h4 className="font-medium text-primary mb-2 flex items-center gap-2"><FaDollarSign /> Financial Records</h4>
                                                        {batchDetail.expenses?.map((e: any) => (
                                                            <p key={e.id} className="text-sm">Procurement: {new Intl.NumberFormat('fr-FR').format(e.amount)} FCFA</p>
                                                        ))}
                                                        {batchDetail.revenues?.map((r: any) => (
                                                            <p key={r.id} className="text-sm">Sale: {new Intl.NumberFormat('fr-FR').format(r.totalAmount)} FCFA to {r.buyer}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-400">No details available.</div>
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

export default Batches;