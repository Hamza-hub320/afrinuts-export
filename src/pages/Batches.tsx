import React, { useEffect, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Cell
} from 'recharts';
import {
    FaBox, FaSearch, FaTimes, FaCheckCircle, FaTimesCircle,
    FaLeaf, FaFireExtinguisher, FaChild, FaChartBar,
    FaStar, FaCalendarAlt, FaDollarSign, FaUser,
    FaFlask, FaIndustry, FaExclamationTriangle, FaTint, FaGlobeEurope, FaShip
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
    const [supplierNames, setSupplierNames] = useState<Map<number, string>>(new Map());

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [batchesData, suppliersData] = await Promise.all([
                    getSupplierData('getAllBatches'),
                    getSupplierData('getSuppliers'),
                ]);
                setBatches(batchesData.batches || []);

                const names = new Map<number, string>();
                (suppliersData.suppliers || []).forEach((s: any) => {
                    names.set(parseInt(s.id), s.name);
                });
                setSupplierNames(names);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

                    {/* Grade Distribution */}
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCard
                                icon={FaStar}
                                title="Grade Distribution"
                                iconColor="text-yellow-500"
                                showInfoBadge={false}
                            >
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex-1 text-center">
                                        <div className="text-3xl font-bold text-amber-600">{premiumBatches}</div>
                                        <div className="text-xs text-gray-500">Premium</div>
                                        <div className="text-xs text-gray-400">{batches.length > 0 ? ((premiumBatches / batches.length) * 100).toFixed(0) : 0}%</div>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="text-3xl font-bold text-blue-600">{totalBatches - premiumBatches}</div>
                                        <div className="text-xs text-gray-500">Standard</div>
                                        <div className="text-xs text-gray-400">{batches.length > 0 ? (((totalBatches - premiumBatches) / batches.length) * 100).toFixed(0) : 0}%</div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 mt-3 overflow-hidden">
                                    <div className="bg-amber-500 h-3 float-left rounded-l-full" style={{ width: `${batches.length > 0 ? (premiumBatches / batches.length) * 100 : 0}%` }} />
                                </div>
                            </InfoCard>

                            {/* Defect Rate Trend */}
                            <InfoCard
                                icon={FaTimesCircle}
                                title="Average Defect Rate"
                                subtitle="Lower is better — industry target: <3%"
                                iconColor="text-red-500"
                                showInfoBadge={false}
                            >
                                <div className="mt-3 text-center">
                                    <div className="text-3xl font-bold text-red-600">
                                        {batches.length > 0 ? (batches.reduce((s, b) => s + b.defectiveRate, 0) / batches.length).toFixed(2) : 0}%
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {batches.length > 0 && (batches.reduce((s, b) => s + b.defectiveRate, 0) / batches.length) < 3
                                            ? '✓ Within industry target'
                                            : '⚠ Above industry target'}
                                    </div>
                                </div>
                            </InfoCard>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Supplier Quality Comparison - Bar Chart */}
                            <InfoCard
                                icon={FaChartBar}
                                title="Supplier Quality Comparison"
                                subtitle="Average quality score by supplier"
                                iconColor="text-primary"
                                showInfoBadge={false}
                            >
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart
                                        data={(() => {
                                            const supplierMap = new Map<number, { name: string; scores: number[] }>();
                                            batches.forEach(b => {
                                                if (!supplierMap.has(b.supplierId)) {
                                                    supplierMap.set(b.supplierId, {
                                                        name: supplierNames.get(b.supplierId) || `Supplier #${b.supplierId}`,
                                                        scores: []
                                                    });
                                                }
                                                supplierMap.get(b.supplierId)!.scores.push(b.qualityScore);
                                            });
                                            return Array.from(supplierMap.entries())
                                                .map(([id, data]) => ({
                                                    name: supplierNames.get(id) || `Supplier #${id}`,
                                                    score: parseFloat((data.scores.reduce((s, v) => s + v, 0) / data.scores.length).toFixed(1)),
                                                    batches: data.scores.length,
                                                }))
                                                .sort((a, b) => b.score - a.score)
                                                .slice(0, 5);
                                        })()}
                                        layout="vertical"
                                        margin={{ left: 80, right: 20, top: 10, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                        <YAxis type="category" dataKey="name" stroke="#6b7280" fontSize={12} width={80} />
                                        <Tooltip formatter={(value) => `${value}%`} />
                                        <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                                            {(() => {
                                                const supplierMap = new Map<number, { name: string; scores: number[] }>();
                                                batches.forEach(b => {
                                                    if (!supplierMap.has(b.supplierId)) {
                                                        supplierMap.set(b.supplierId, { name: `Supplier #${b.supplierId}`, scores: [] });
                                                    }
                                                    supplierMap.get(b.supplierId)!.scores.push(b.qualityScore);
                                                });
                                                return Array.from(supplierMap.entries())
                                                    .sort((a, b) => {
                                                        const avgA = a[1].scores.reduce((s, v) => s + v, 0) / a[1].scores.length;
                                                        const avgB = b[1].scores.reduce((s, v) => s + v, 0) / b[1].scores.length;
                                                        return avgB - avgA;
                                                    })
                                                    .slice(0, 5)
                                                    .map((_, i) => (
                                                        <Cell key={i} fill={['#5A7411', '#E04E00', '#A0C800', '#253746', '#698714'][i]} />
                                                    ));
                                            })()}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </InfoCard>

                            {/* Delivery Volume Trend - Area Chart */}
                            <InfoCard
                                icon={FaCalendarAlt}
                                title="Delivery Volume Trend"
                                subtitle="Total weight delivered over time"
                                iconColor="text-primary"
                                showInfoBadge={false}
                            >
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart
                                        data={(() => {
                                            const monthlyData = new Map<string, number>();
                                            batches.forEach(b => {
                                                const month = new Date(b.processingDate).toLocaleString('default', { month: 'short', year: '2-digit' });
                                                monthlyData.set(month, (monthlyData.get(month) || 0) + (b.weightKg || 0));
                                            });
                                            return Array.from(monthlyData.entries())
                                                .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                                                .slice(-6)
                                                .map(([month, vol]) => ({ month, tonnes: parseFloat((vol / 1000).toFixed(1)) }));
                                        })()}
                                        margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v}T`} />
                                        <Tooltip formatter={(value) => `${value} tonnes`} />
                                        <Area type="monotone" dataKey="tonnes" stroke="#5A7411" fill="#5A7411" fillOpacity={0.2} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </InfoCard>
                        </div>
                    </div>

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
                                <InfoCard
                                    title={batch.batchNumber}
                                    subtitle={`${new Date(batch.processingDate).toLocaleDateString()} · ${(batch.weightKg / 1000).toFixed(1)}T`}
                                    icon={FaBox} iconColor="text-accent" showInfoBadge={false} className="h-full hover:shadow-lg transition-all">
                                    <div className="flex items-center gap-2 mt-3">
                                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${batch.qualityGrade === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                 {batch.qualityGrade}
                                        </span>
                                        <span className="text-xs text-gray-500">Score: {batch.qualityScore?.toFixed(1)}%</span>
                                        {batch.defectiveRate > 5 && <FaExclamationTriangle className="text-red-500 text-xs" title="High defect rate" />}
                                        {batch.moistureContent > 7 && <FaTint className="text-blue-500 text-xs" title="High moisture" />}
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
                                        ) : batchDetail && batchDetail.batch ? (
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
            {/* Export Readiness */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                <InfoCard
                    icon={FaIndustry}
                    title="Export Readiness"
                    iconColor="text-green-600"
                    showInfoBadge={false}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-center">
                        {[
                            { label: 'EU Compliant', value: batches.filter(b => (parseTestResults(b.testResults || '{}').aflatoxin || 99) < 4).length, total: batches.length, icon: FaGlobeEurope, color: 'text-blue-500' },
                            { label: 'Organic Grade', value: batches.filter(b => b.qualityGrade === 'PREMIUM' && b.defectiveRate < 3).length, total: batches.length, icon: FaLeaf, color: 'text-green-500' },
                            { label: 'Export Ready', value: batches.filter(b => b.qualityScore >= 95 && b.defectiveRate < 5).length, total: batches.length, icon: FaShip, color: 'text-primary' },
                            { label: 'Needs Review', value: batches.filter(b => b.defectiveRate > 5 || b.moistureContent > 7).length, total: batches.length, icon: FaSearch, color: 'text-amber-500' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/40 rounded-xl p-3 border border-white/30">
                                <item.icon className={`text-2xl mx-auto ${item.color}`} />
                                <div className="text-lg font-bold mt-1">{item.value}/{item.total}</div>
                                <div className="text-xs text-gray-500">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </InfoCard>
            </div>
        </div>
    );
};

export default Batches;