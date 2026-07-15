import React, { useEffect, useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import {
    FaUsers, FaStar, FaBox, FaCheckCircle, FaTimesCircle,
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaSeedling,
    FaSearch, FaChevronDown, FaTimes, FaFileAlt, FaChartBar,
    FaLeaf, FaFireExtinguisher, FaChild, FaHandshake,
    FaTractor, FaCalendarAlt, FaDollarSign, FaIndustry,
    FaAward, FaUser, FaTrophy, FaChartLine, FaHome
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getSupplierData } from '../services/api';
import { Dialog, Transition } from '@headlessui/react';
import SupplierMap from '@/components/SupplierMap/SupplierMap';
import Sparkline from '@/components/Sparkline/Sparkline';
import {GiFarmer} from "react-icons/gi";

interface Supplier {
    id: string;
    name: string;
    type: string;
    status: string;
    location: string;
    region?: string;           // ADD
    country?: string;          // ADD
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
    registrationNumber?: string;  // ADD
    taxId?: string;               // ADD
    notes?: string;               // ADD
    hasLocation?: boolean;        // ADD
    firebreakProtection?: boolean;
    noChildLabor?: boolean;
    sustainableHarvesting?: boolean;
    photoUrl?: string;
    bio?: string;
    quote?: string;
    latitude?: number;
    longitude?: number;
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
    farmOsMonitored?: boolean;  // ADD
    verifiedAt?: number;        // ADD
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
    const [gradeDistribution, setGradeDistribution] = useState<{ grade: string; count: number }[]>([]);
    const [supplierTrend, setSupplierTrend] = useState<number[]>([]);

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
            const batches = batchesData.batches || [];
            setSupplierBatches(batches);
            setSupplierFinancials(financialsData);

            // Compute trend from batches
            const last5Batches = batches.slice(0, 5);
            const trendScores = last5Batches.map((b: QualityBatch) => b.qualityScore).reverse();
            setSupplierTrend(trendScores);
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
            <main>
                <Section className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <DashboardNavbar />
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <GiFarmer className="text-primary text-3xl" />
                            </div>
                        </div>
                    </div>
                </Section>
            </main>
        );
    }

    const typeFilters = [
        'All',
        'OWN_FARM',
        'COOPERATIVE',
        'REGIONAL_SUPPLIER',
        'INDEPENDENT',
        'COMMERCIAL_AGGREGATOR',
        'PROCESSOR',
        'ACTIVE',
        'INACTIVE'
    ];

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

            {/* Supply Intelligence Banner */}
            <Section className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <InfoCard
                            icon={FaChartLine}
                            title="Supply Intelligence"
                            subtitle="Transforming supplier data into procurement foresight"
                            iconColor="text-accent"
                            showInfoBadge={false}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {suppliers.reduce((sum, s) => sum + (s.annualVolumeKg || 0), 0) > 0
                                            ? `${(suppliers.reduce((sum, s) => sum + (s.annualVolumeKg || 0), 0) / 1000).toFixed(0)}T`
                                            : '—'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Estimated Network Capacity</div>
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        {suppliers.filter(s => s.annualVolumeKg > 0).length} supplier{suppliers.filter(s => s.annualVolumeKg > 0).length !== 1 ? 's' : ''} with volume data
                                    </div>
                                </div>
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {suppliers.length > 0
                                            ? `${suppliers.filter(s => s.yearsFarming && s.yearsFarming >= 10).length}/${suppliers.length}`
                                            : '—'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Experienced Farmers (10+ yrs)</div>
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        Institutional knowledge in the network
                                    </div>
                                </div>
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-2xl font-bold text-amber-600">
                                        {suppliers.length > 0
                                            ? `${suppliers.filter(s => s.averageQualityScore >= 95).length}/${suppliers.length}`
                                            : '—'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Premium-Grade Suppliers</div>
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        {suppliers.length > 0 && suppliers.filter(s => s.averageQualityScore >= 95).length === suppliers.length
                                            ? 'All suppliers at premium level'
                                            : 'Tracking toward full premium network'}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg text-xs text-gray-600 text-center">
                                <FaChartLine className="inline mr-1 text-primary" />
                                Every delivery, every quality check, every supplier relationship builds this intelligence.
                                The more data that flows in, the more accurately we can forecast procurement before harvest begins.
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
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
                        <div className="relative w-full sm:min-w-[280px] sm:max-w-sm">
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
                                    icon={supplier.type === 'OWN_FARM' ? FaHome : FaUsers}
                                    iconColor={supplier.type === 'OWN_FARM' ? 'text-green-600' : 'text-accent'}
                                    showInfoBadge={false}
                                    className={`h-full hover:shadow-lg transition-all ${supplier.type === 'OWN_FARM' ? 'border-green-400/30 ring-1 ring-green-400/20' : ''}`}
                                >
                                    {/* OWN FARM Badge */}
                                    {supplier.type === 'OWN_FARM' && (
                                        <div className="mb-2">
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1 w-fit">
                                             <FaStar className="text-[10px]" />
                                                     Own Farm
                                        </span>
                                        </div>
                                    )}

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

            {/* Supplier Leaderboard */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="mb-8"
                    >
                        <Typography variant="h3" className="mb-4 text-primary flex items-center gap-2">
                            <FaTrophy className="text-yellow-500" />
                            Supplier Leaderboard
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {suppliers
                                .filter(s => s.annualVolumeKg > 0)
                                .sort((a, b) => {
                                    const scoreA = (a.averageQualityScore * (a.annualVolumeKg / 1000)) * (a.sustainableHarvesting ? 1.2 : 1);
                                    const scoreB = (b.averageQualityScore * (b.annualVolumeKg / 1000)) * (b.sustainableHarvesting ? 1.2 : 1);
                                    return scoreB - scoreA;
                                })
                                .slice(0, 6)
                                .map((supplier, idx) => (
                                    <motion.div
                                        key={supplier.id}
                                        variants={fadeIn}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30"
                                        whileHover={{ y: -2 }}
                                    >
                            <span className="text-lg font-bold text-primary w-8">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                            </span>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{supplier.name}</p>
                                            <p className="text-xs text-gray-500">
                                                Score: {supplier.averageQualityScore?.toFixed(1)}% · {(supplier.annualVolumeKg / 1000).toFixed(0)}T/yr
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            {supplier.sustainableHarvesting && <FaLeaf className="text-green-500 text-xs" title="Sustainable" />}
                                            {supplier.firebreakProtection && <FaFireExtinguisher className="text-orange-500 text-xs" title="Firebreak" />}
                                            {supplier.noChildLabor && <FaChild className="text-blue-500 text-xs" title="No Child Labor" />}
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Supplier Map */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <Typography variant="h3" className="mb-4 text-primary flex items-center gap-2">
                            <FaMapMarkerAlt className="text-accent" />
                            Supplier Locations
                        </Typography>
                        <SupplierMap
                            suppliers={suppliers.map(s => ({
                                id: s.id,
                                name: s.name,
                                latitude: s.latitude || 0,
                                longitude: s.longitude || 0,
                                isActive: s.status === 'ACTIVE',
                                type: s.type,
                                location: s.location,
                            }))}
                            className="mb-6"
                        />
                    </motion.div>
                </div>
            </Section>

            {/* Charts Row */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quality Tier Distribution - Pie Chart */}
                    <InfoCard
                        icon={FaChartBar}
                        title="Quality Tier Distribution"
                        iconColor="text-primary"
                        showInfoBadge={false}
                    >
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Premium (≥95%)', value: suppliers.filter(s => s.averageQualityScore >= 95).length, fill: '#f59e0b' },
                                        { name: 'Standard (80-94%)', value: suppliers.filter(s => s.averageQualityScore >= 80 && s.averageQualityScore < 95).length, fill: '#3b82f6' },
                                        { name: 'Developing (<80%)', value: suppliers.filter(s => s.averageQualityScore < 80).length, fill: '#9ca3af' },
                                    ].filter(d => d.value > 0)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, value }) => `${(name || '').split(' ')[0]}: ${value}`}
                                >
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </InfoCard>

                    {/* Sustainability Compliance - Bar Chart */}
                    <InfoCard
                        icon={FaLeaf}
                        title="Sustainability Compliance"
                        subtitle="Percentage of suppliers meeting each standard"
                        iconColor="text-green-600"
                        showInfoBadge={false}
                    >
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                                data={[
                                    { name: 'Sustainable\nHarvesting', value: parseFloat((suppliers.filter(s => s.sustainableHarvesting).length / suppliers.length * 100).toFixed(0)), fill: '#22c55e' },
                                    { name: 'Firebreak\nProtection', value: parseFloat((suppliers.filter(s => s.firebreakProtection).length / suppliers.length * 100).toFixed(0)), fill: '#f97316' },
                                    { name: 'No Child\nLabor', value: parseFloat((suppliers.filter(s => s.noChildLabor).length / suppliers.length * 100).toFixed(0)), fill: '#3b82f6' },
                                ]}
                                margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="#6b7280" fontSize={12} />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {[
                                        { name: 'Sustainable\nHarvesting', value: 0, fill: '#22c55e' },
                                        { name: 'Firebreak\nProtection', value: 0, fill: '#f97316' },
                                        { name: 'No Child\nLabor', value: 0, fill: '#3b82f6' },
                                    ].map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </InfoCard>
                </div>
            </div>

            {/* Financial Efficiency */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <InfoCard
                        icon={FaDollarSign}
                        title="Supplier Financial Efficiency"
                        subtitle="Revenue generated per 1 FCFA spent on procurement"
                        iconColor="text-primary"
                        showInfoBadge={false}
                    >
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto mt-3">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="pb-2 font-medium text-gray-600">Supplier</th>
                                    <th className="pb-2 font-medium text-gray-600">Procurement</th>
                                    <th className="pb-2 font-medium text-gray-600">Revenue</th>
                                    <th className="pb-2 font-medium text-gray-600">Efficiency</th>
                                </tr>
                                </thead>
                                <tbody>
                                {suppliers.slice(0, 5).map(supplier => {
                                    const procurement = supplier.annualVolumeKg * 500;
                                    const revenue = supplier.annualVolumeKg * 1500;
                                    const efficiency = (revenue / (procurement || 1)).toFixed(1);
                                    return (
                                        <tr key={supplier.id} className="border-b border-gray-100 last:border-0 hover:bg-white/20">
                                            <td className="py-2 font-medium">{supplier.name}</td>
                                            <td className="py-2">{new Intl.NumberFormat('fr-FR').format(procurement)} FCFA</td>
                                            <td className="py-2">{new Intl.NumberFormat('fr-FR').format(revenue)} FCFA</td>
                                            <td className="py-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${Number(efficiency) > 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {efficiency}x
                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3 mt-3">
                            {suppliers.slice(0, 5).map(supplier => {
                                const procurement = supplier.annualVolumeKg * 500;
                                const revenue = supplier.annualVolumeKg * 1500;
                                const efficiency = (revenue / (procurement || 1)).toFixed(1);
                                return (
                                    <motion.div
                                        key={supplier.id}
                                        className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                                        whileHover={{ y: -2 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-primary text-sm">{supplier.name}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${Number(efficiency) > 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {efficiency}x
                                </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-gray-500">Procurement</span>
                                                <p className="font-medium text-gray-700">{new Intl.NumberFormat('fr-FR').format(procurement)} FCFA</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Revenue</span>
                                                <p className="font-medium text-gray-700">{new Intl.NumberFormat('fr-FR').format(revenue)} FCFA</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </InfoCard>
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
                                                        {/* Photo + Name Header */}
                                                        <div className="flex items-center gap-4">
                                                            {selectedSupplier.photoUrl ? (
                                                                <img src={selectedSupplier.photoUrl} alt={selectedSupplier.name}
                                                                     className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
                                                            ) : (
                                                                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                                                                    selectedSupplier.type === 'OWN_FARM' ? 'bg-green-100' : 'bg-primary/10'
                                                                }`}>
                                                                    {selectedSupplier.type === 'OWN_FARM' ? (
                                                                        <FaHome className="text-green-600 text-2xl" />
                                                                    ) : (
                                                                        <FaUsers className="text-primary text-2xl" />
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="text-xl font-bold text-primary">{selectedSupplier.name}</h3>
                                                                    {selectedSupplier.type === 'OWN_FARM' && (
                                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                                            Own Farm
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-500">{selectedSupplier.type?.replace(/_/g, ' ')} · {selectedSupplier.status}</p>
                                                                {selectedSupplier.type === 'OWN_FARM' && selectedSupplier.quote && (
                                                                    <p className="text-xs text-green-700 italic mt-1 max-w-md">"{selectedSupplier.quote}"</p>
                                                                )}
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FaStar key={i} className={i < selectedSupplier.rating ? 'text-yellow-500' : 'text-gray-300'} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Own Farm Banner */}
                                                        {selectedSupplier.type === 'OWN_FARM' && (
                                                            <div className="bg-green-50/80 border border-green-200 rounded-xl p-4 mb-4">
                                                                <div className="flex items-start gap-3">
                                                                    <FaHome className="text-green-600 text-xl mt-0.5" />
                                                                    <div>
                                                                        <h4 className="font-medium text-green-800">AfriNuts Own Farm Production</h4>
                                                                        <p className="text-sm text-green-700 mt-1">
                                                                            This represents cashews grown on our 35-hectare farm in Odienné. Managed by {selectedSupplier.contactPerson},
                                                                            our farm serves as the quality benchmark for all supplier-sourced cashews.
                                                                        </p>
                                                                        <div className="flex gap-4 mt-2 text-xs text-green-600">
                                                                            <span>{selectedSupplier.farmSize} hectares</span>
                                                                            <span>{selectedSupplier.yearsFarming} years farming</span>
                                                                            <span>100% Farm OS monitored</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Bio / Quote */}
                                                        {selectedSupplier.bio && (
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-1">About</h4>
                                                                <p className="text-sm text-gray-700">{selectedSupplier.bio}</p>
                                                            </div>
                                                        )}
                                                        {selectedSupplier.quote && (
                                                            <div className="bg-accent/10 rounded-xl p-4 italic text-accent-dark text-sm">
                                                                "{selectedSupplier.quote}"
                                                            </div>
                                                        )}

                                                        {/* Contact + Business Details Grid */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Contact Information</h4>
                                                                <p className="text-sm flex items-center gap-2"><FaUser className="text-gray-400" /> {selectedSupplier.contactPerson}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaPhone className="text-gray-400" /> {selectedSupplier.phone}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaEnvelope className="text-gray-400" /> {selectedSupplier.email}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {selectedSupplier.location}</p>
                                                            </div>
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Business Information</h4>
                                                                <p className="text-sm"><strong>Region:</strong> {selectedSupplier.region || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Country:</strong> {selectedSupplier.country || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Registration #:</strong> {selectedSupplier.registrationNumber || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Tax ID:</strong> {selectedSupplier.taxId || 'N/A'}</p>
                                                                {selectedSupplier.farmSize ? <p className="text-sm"><strong>Farm Size:</strong> {selectedSupplier.farmSize} ha</p> : null}
                                                                {selectedSupplier.yearsFarming ? <p className="text-sm"><strong>Years Farming:</strong> {selectedSupplier.yearsFarming}</p> : null}
                                                                <p className="text-sm"><strong>Annual Volume:</strong> {selectedSupplier.annualVolumeKg ? `${(selectedSupplier.annualVolumeKg / 1000).toFixed(1)}T` : 'N/A'}</p>
                                                            </div>
                                                        </div>

                                                        {/* Certifications */}
                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2">Certifications</h4>
                                                            {selectedSupplier.isCertified ? (
                                                                <div className="space-y-1">
                                                                    <p className="text-sm"><strong>Type:</strong> {selectedSupplier.certificationType || 'N/A'}</p>
                                                                    <p className="text-sm"><strong>Number:</strong> {selectedSupplier.certificationNumber || 'N/A'}</p>
                                                                    {selectedSupplier.certificationExpiryDate ? (
                                                                        <p className="text-sm"><strong>Expires:</strong> {new Date(selectedSupplier.certificationExpiryDate).toLocaleDateString()}</p>
                                                                    ) : null}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500">Not certified</p>
                                                            )}
                                                        </div>

                                                        {/* Sustainability Compliance */}
                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2">Sustainability Compliance</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-500">Has Location: {selectedSupplier.hasLocation ? 'Yes' : 'No'}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Internal Notes (for management) */}
                                                        {selectedSupplier.notes && (
                                                            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200">
                                                                <h4 className="font-medium text-amber-700 mb-2">Internal Notes</h4>
                                                                <p className="text-sm text-gray-700">{selectedSupplier.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'quality' && (
                                                    <div>
                                                        {supplierBatches.length === 0 ? (
                                                            <div className="text-center py-8 text-gray-400">
                                                                <FaBox className="text-3xl mx-auto mb-2" />
                                                                <Typography variant="small">No quality batches recorded for this supplier yet.</Typography>
                                                                <Typography variant="small" className="text-xs mt-1">
                                                                    Batch data will appear here as deliveries are processed through quality control.
                                                                </Typography>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Batch Summary */}
                                                                <div className="grid grid-cols-3 gap-3 mb-4">
                                                                    <div className="bg-white/50 rounded-xl p-3 text-center border border-white/30">
                                                                        <div className="text-2xl font-bold text-primary">{supplierBatches.length}</div>
                                                                        <div className="text-xs text-gray-500">Total Batches</div>
                                                                    </div>
                                                                    <div className="bg-white/50 rounded-xl p-3 text-center border border-white/30">
                                                                        <div className="text-2xl font-bold text-primary">
                                                                            {supplierBatches.reduce((sum, b) => sum + (b.weightKg || 0), 0).toLocaleString()} kg
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">Total Delivered</div>
                                                                    </div>
                                                                    <div className="bg-white/50 rounded-xl p-3 text-center border border-white/30">
                                                                        <div className="text-2xl font-bold text-primary">
                                                                            {(supplierBatches.reduce((sum, b) => sum + (b.qualityScore || 0), 0) / supplierBatches.length).toFixed(1)}%
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">Avg Quality</div>
                                                                    </div>
                                                                </div>

                                                                {/* Batch Table */}
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-sm">
                                                                        <thead>
                                                                        <tr className="border-b border-gray-200 text-left">
                                                                            <th className="pb-2 font-medium text-gray-600">Batch #</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Date</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Weight</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Grade</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Score</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Moisture</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Defects</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Kernel</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Compliance</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {supplierBatches.map(batch => (
                                                                            <tr key={batch.id} className="border-b border-gray-100 last:border-0 hover:bg-white/20">
                                                                                <td className="py-2 font-medium">{batch.batchNumber}</td>
                                                                                <td className="py-2 text-xs">{new Date(batch.processingDate).toLocaleDateString()}</td>
                                                                                <td className="py-2">{batch.weightKg?.toLocaleString()} kg</td>
                                                                                <td className="py-2">
                                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                                     batch.qualityGrade === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                                                     }`}>{batch.qualityGrade}</span>
                                                                                </td>
                                                                                <td className="py-2">{batch.qualityScore?.toFixed(1)}%</td>
                                                                                <td className="py-2">{batch.moistureContent}%</td>
                                                                                <td className="py-2">{batch.defectiveRate}%</td>
                                                                                <td className="py-2">{batch.kernelRatio}%</td>
                                                                                <td className="py-2">
                                                                                    <div className="flex gap-1">
                                                                                        {batch.sustainableHarvesting && <FaLeaf className="text-green-500 text-xs" title="Sustainable" />}
                                                                                        {batch.firebreakProtection && <FaFireExtinguisher className="text-orange-500 text-xs" title="Firebreak" />}
                                                                                        {batch.noChildLabor && <FaChild className="text-blue-500 text-xs" title="No Child Labor" />}
                                                                                        {batch.farmOsMonitored && <FaChartBar className="text-purple-500 text-xs" title="FarmOS" />}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                                {/* Quality Trend Sparkline */}
                                                                {supplierTrend.length > 0 && (
                                                                    <div className="bg-white/50 rounded-xl p-4 border border-white/30 mt-4">
                                                                        <h4 className="font-medium text-primary mb-2">Quality Trend (Last {supplierTrend.length} Batches)</h4>
                                                                        <div className="flex items-center gap-3">
                                                                            <Sparkline data={supplierTrend} width={120} height={36} color="#5A7411" />
                                                                            <div className="text-sm text-gray-600">
                                                                                {supplierTrend.length >= 2 ? (
                                                                                    <>
                                                                                        {supplierTrend[0].toFixed(1)}% → {supplierTrend[supplierTrend.length-1].toFixed(1)}%
                                                                                        <span className="ml-2 text-xs">
                                                                                            {supplierTrend[supplierTrend.length-1] > supplierTrend[0] ? (
                                                                                        <span className="text-green-600">↑ Improving</span>
                                                                                            ) : supplierTrend[supplierTrend.length-1] < supplierTrend[0] ? (
                                                                                         <span className="text-red-600">↓ Declining</span>
                                                                                             ) : (
                                                                                        <span className="text-gray-500">→ Stable</span>
                                                                                                 )}
                                                                                          </span>
                                                                                    </>
                                                                                ) : 'Not enough data'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'financials' && (
                                                    <div>
                                                        {!supplierFinancials || (supplierFinancials.totalProcurement === 0 && supplierFinancials.totalRevenue === 0) ? (
                                                            <div className="text-center py-8 text-gray-400">
                                                                <FaDollarSign className="text-3xl mx-auto mb-2" />
                                                                <Typography variant="small">No financial data recorded for this supplier yet.</Typography>
                                                                <Typography variant="small" className="text-xs mt-1">
                                                                    Financial records will appear as procurement expenses and sales revenues are linked to this supplier's batches.
                                                                </Typography>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Summary Cards */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                                    <div className="bg-green-50/50 rounded-xl p-4 border border-green-200 text-center">
                                                                        <p className="text-sm text-gray-500">Total Procured</p>
                                                                        <p className="text-2xl font-bold text-green-700">
                                                                            {new Intl.NumberFormat('fr-FR').format(supplierFinancials.totalProcurement)} FCFA
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {supplierFinancials.expenses?.length || 0} expense record{(supplierFinancials.expenses?.length || 0) !== 1 ? 's' : ''}
                                                                        </p>
                                                                    </div>
                                                                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200 text-center">
                                                                        <p className="text-sm text-gray-500">Revenue from Batches</p>
                                                                        <p className="text-2xl font-bold text-blue-700">
                                                                            {new Intl.NumberFormat('fr-FR').format(supplierFinancials.totalRevenue)} FCFA
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {supplierFinancials.revenues?.length || 0} sale record{(supplierFinancials.revenues?.length || 0) !== 1 ? 's' : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Expenses Table */}
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
                                                                                    <th className="pb-2">Description</th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {supplierFinancials.expenses.map((exp: any) => (
                                                                                    <tr key={exp.id} className="border-b border-gray-100">
                                                                                        <td className="py-1">{new Date(exp.date).toLocaleDateString()}</td>
                                                                                        <td className="py-1 font-medium">{new Intl.NumberFormat('fr-FR').format(exp.amount)} FCFA</td>
                                                                                        <td className="py-1">{exp.batchNumber || '—'}</td>
                                                                                        <td className="py-1 text-xs text-gray-500">{exp.description || '—'}</td>
                                                                                    </tr>
                                                                                ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
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