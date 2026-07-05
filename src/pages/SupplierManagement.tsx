import React, { useEffect, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers, FaStar, FaBox, FaCheckCircle, FaTimesCircle,
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaSeedling,
    FaSearch, FaChevronDown, FaTimes, FaFileAlt, FaChartBar,
    FaLeaf, FaFireExtinguisher, FaChild, FaHandshake,
    FaTractor, FaCalendarAlt, FaDollarSign, FaIndustry,
    FaAward, FaUser
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getSupplierData } from '../services/api';
import { Dialog, Transition } from '@headlessui/react';

interface Supplier {
    id: string;
    name: string;
    type: string;
    status: string;
    location: string;
    contactPerson: string;
    phone: string;
    email: string;
    averageQualityScore: number;
    annualVolumeKg: number;
    rating: number;
    farmSize?: number;
    yearsFarming?: number;
    isCertified: boolean;
    certificationType?: string;
    certificationNumber?: string;
    certificationExpiryDate?: number;
    firebreakProtection?: boolean;
    noChildLabor?: boolean;
    sustainableHarvesting?: boolean;
    photoUrl?: string;
    bio?: string;
    quote?: string;
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
}

const SupplierManagement: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [supplierBatches, setSupplierBatches] = useState<QualityBatch[]>([]);
    const [supplierFinancials, setSupplierFinancials] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'quality' | 'financials'>('profile');
    const [modalLoading, setModalLoading] = useState(false);

    const isDevelopment = import.meta.env.DEV;

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getSupplierData('getSuppliers');
                setSuppliers(data.suppliers || []);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, []);

    const openSupplierDetail = async (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setModalLoading(true);
        setActiveTab('profile');
        try {
            const [batchesData, financialsData] = await Promise.all([
                getSupplierData('getSupplierQualityBatches', { supplierId: supplier.id }),
                getSupplierData('getSupplierFinancials', { supplierId: supplier.id }),
            ]);
            setSupplierBatches(batchesData.batches || []);
            setSupplierFinancials(financialsData);
        } catch (error) {
            console.error('Error fetching supplier details:', error);
        } finally {
            setModalLoading(false);
        }
    };

    const filteredSuppliers = suppliers.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = filterType === 'All' || s.type === filterType || s.status === filterType;
        return matchSearch && matchType;
    });

    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'ACTIVE').length;
    const avgQualityScore = suppliers.length > 0
        ? (suppliers.reduce((sum, s) => sum + (s.averageQualityScore || 0), 0) / suppliers.length).toFixed(1)
        : '0';
    const totalVolume = suppliers.reduce((sum, s) => sum + (s.annualVolumeKg || 0), 0);

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

    const typeFilters = ['All', 'COOPERATIVE', 'REGIONAL_SUPPLIER', 'INDEPENDENT', 'ACTIVE', 'INACTIVE'];

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            {/* Hero Header */}
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
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Track supplier performance, quality history, sustainability compliance, and financial contributions across your supply chain.
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* KPI Cards */}
            <Section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn}>
                            <InfoCard icon={FaUsers} title={String(totalSuppliers)} subtitle="Total Suppliers" iconColor="text-accent" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.1 }}>
                            <InfoCard icon={FaCheckCircle} title={String(activeSuppliers)} subtitle="Active Suppliers" iconColor="text-green-600" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.2 }}>
                            <InfoCard icon={FaStar} title={`${avgQualityScore}%`} subtitle="Avg. Quality Score" iconColor="text-yellow-500" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                            <InfoCard icon={FaBox} title={`${(totalVolume / 1000).toFixed(0)}T`} subtitle="Annual Volume" iconColor="text-primary" showInfoBadge={false} />
                        </motion.div>
                    </motion.div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                        <div className="flex flex-wrap gap-2">
                            {typeFilters.map(type => (
                                <motion.button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        filterType === type
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {type === 'All' ? 'All Types' : type.replace(/_/g, ' ')}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Supplier Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSuppliers.map((supplier, idx) => (
                            <motion.div
                                key={supplier.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => openSupplierDetail(supplier)}
                                className="cursor-pointer"
                            >
                                <InfoCard
                                    title={supplier.name}
                                    subtitle={`${supplier.type?.replace(/_/g, ' ')} · ${supplier.location}`}
                                    icon={FaUsers}
                                    iconColor="text-accent"
                                    showInfoBadge={false}
                                    className="h-full hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            Quality: {supplier.averageQualityScore?.toFixed(1)}%
                                        </span>
                                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                                            {supplier.annualVolumeKg > 0 ? `${(supplier.annualVolumeKg / 1000).toFixed(0)}T/yr` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        {supplier.sustainableHarvesting && (
                                            <span className="text-green-600 text-xs flex items-center gap-1"><FaLeaf /> Sustainable</span>
                                        )}
                                        {supplier.firebreakProtection && (
                                            <span className="text-orange-500 text-xs flex items-center gap-1"><FaFireExtinguisher /> Firebreak</span>
                                        )}
                                        {supplier.noChildLabor && (
                                            <span className="text-blue-500 text-xs flex items-center gap-1"><FaChild /> No Child Labor</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                        <FaPhone className="text-[10px]" /> {supplier.phone}
                                    </div>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Supplier Detail Modal */}
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
                                    {/* Animated blobs */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl animate-pulse"
                                         style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }} />
                                    <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full opacity-8 blur-3xl"
                                         style={{ background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)' }} />

                                    <div className="relative z-10 p-6">
                                        {/* Header */}
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

                                        {/* Tabs */}
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

                                        {/* Tab Content */}
                                        {modalLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {activeTab === 'profile' && selectedSupplier && (
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Contact Information</h4>
                                                                <p className="text-sm flex items-center gap-2"><FaUser className="text-gray-400" /> {selectedSupplier.contactPerson}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaPhone className="text-gray-400" /> {selectedSupplier.phone}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaEnvelope className="text-gray-400" /> {selectedSupplier.email}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {selectedSupplier.location}</p>
                                                            </div>
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Farming Details</h4>
                                                                <p className="text-sm">Farm Size: {selectedSupplier.farmSize ? `${selectedSupplier.farmSize} ha` : 'N/A'}</p>
                                                                <p className="text-sm">Years Farming: {selectedSupplier.yearsFarming || 'N/A'}</p>
                                                                <p className="text-sm">Annual Volume: {selectedSupplier.annualVolumeKg ? `${(selectedSupplier.annualVolumeKg / 1000).toFixed(1)}T` : 'N/A'}</p>
                                                                <p className="text-sm">Quality Score: {selectedSupplier.averageQualityScore?.toFixed(1)}%</p>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2">Sustainability Compliance</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                                                            </div>
                                                        </div>

                                                        {selectedSupplier.bio && (
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Bio</h4>
                                                                <p className="text-sm text-gray-700">{selectedSupplier.bio}</p>
                                                            </div>
                                                        )}
                                                        {selectedSupplier.quote && (
                                                            <div className="bg-accent/10 rounded-xl p-4 italic text-accent-dark">
                                                                "{selectedSupplier.quote}"
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'quality' && (
                                                    <div>
                                                        {supplierBatches.length === 0 ? (
                                                            <p className="text-center text-gray-400 py-8">No quality batches recorded.</p>
                                                        ) : (
                                                            <div className="overflow-x-auto">
                                                                <table className="w-full text-sm">
                                                                    <thead>
                                                                    <tr className="border-b border-gray-200 text-left">
                                                                        <th className="pb-2 font-medium text-gray-600">Batch #</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Date</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Weight (kg)</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Grade</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Score</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Moisture</th>
                                                                        <th className="pb-2 font-medium text-gray-600">Defects</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {supplierBatches.map(batch => (
                                                                        <tr key={batch.id} className="border-b border-gray-100 last:border-0 hover:bg-white/20">
                                                                            <td className="py-2">{batch.batchNumber}</td>
                                                                            <td className="py-2">{new Date(batch.processingDate).toLocaleDateString()}</td>
                                                                            <td className="py-2">{batch.weightKg.toLocaleString()}</td>
                                                                            <td className="py-2">
                                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                                        batch.qualityGrade === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                                                    }`}>{batch.qualityGrade}</span>
                                                                            </td>
                                                                            <td className="py-2">{batch.qualityScore.toFixed(1)}%</td>
                                                                            <td className="py-2">{batch.moistureContent}%</td>
                                                                            <td className="py-2">{batch.defectiveRate}%</td>
                                                                        </tr>
                                                                    ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'financials' && supplierFinancials && (
                                                    <div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                            <div className="bg-green-50/50 rounded-xl p-4 border border-green-200">
                                                                <p className="text-sm text-gray-500">Total Procured</p>
                                                                <p className="text-2xl font-bold text-green-700">
                                                                    {new Intl.NumberFormat('fr-FR').format(supplierFinancials.totalProcurement)} FCFA
                                                                </p>
                                                            </div>
                                                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
                                                                <p className="text-sm text-gray-500">Revenue from Batches</p>
                                                                <p className="text-2xl font-bold text-blue-700">
                                                                    {new Intl.NumberFormat('fr-FR').format(supplierFinancials.totalRevenue)} FCFA
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {supplierFinancials.expenses?.length > 0 && (
                                                            <div className="mb-4">
                                                                <h4 className="font-medium text-primary mb-2">Procurement Expenses</h4>
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-sm">
                                                                        <thead>
                                                                        <tr className="border-b border-gray-200 text-left">
                                                                            <th className="pb-2">Date</th>
                                                                            <th className="pb-2">Amount</th>
                                                                            <th className="pb-2">Batch</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {supplierFinancials.expenses.map((exp: any) => (
                                                                            <tr key={exp.id} className="border-b border-gray-100">
                                                                                <td className="py-1">{new Date(exp.date).toLocaleDateString()}</td>
                                                                                <td className="py-1">{new Intl.NumberFormat('fr-FR').format(exp.amount)} FCFA</td>
                                                                                <td className="py-1">{exp.batchNumber || '—'}</td>
                                                                            </tr>
                                                                        ))}
                                                                        </tbody>
                                                                    </table>
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