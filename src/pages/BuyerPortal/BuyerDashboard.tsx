import React, { useEffect, useState } from 'react';
import { auth } from '@/services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBox, FaShip, FaCheckCircle, FaClock, FaSignOutAlt,
    FaArrowRight, FaUser, FaDownload, FaShieldAlt,
    FaFileAlt, FaCertificate, FaMapMarkerAlt, FaPercentage,
    FaFlask, FaLeaf, FaChild, FaMobile, FaTree, FaCalendarAlt, FaBuilding,
    FaIndustry, FaChartBar, FaTruck,
} from 'react-icons/fa';
import { GiFarmer, GiFruitTree, GiFactory, GiCargoShip } from 'react-icons/gi';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getBuyerPortalData } from '@/services/api';
import { buyerLogout, onBuyerAuthChange } from '@/services/buyerAuth';
import type { User } from 'firebase/auth';
import BatchLocationMap from '@/components/BatchLocationMap/BatchLocationMap';
import { Reveal, StaggerList, StaggerItem, CountUp } from '@/components/Reveal';

interface MyBatch {
    id: string;
    batchId: string;
    harvestDate: string;
    farmLocation: string;
    block?: string;
    processingInfo: string;
    processingFacility?: string;
    processingLocation?: string;
    processingMethod?: string;
    shellingMethod?: string;
    gradingMethod?: string;
    yieldPercentage?: number | null;
    certifications: string[];
    qualityGrade?: string;
    verificationCode?: string | null;
    digitalSignature?: {
        code: string;
        signedDate: string;
        signature: string;
    } | null;
    qualityResults?: string;
    qualityScore?: number;
    testResults?: {
        aflatoxin?: number;
        heavyMetals?: number;
        pesticideResidue?: number;
    };
    destination: string;
    buyer?: string;
    status: string;
    moistureContent?: number;
    nutCount?: number;
    kernelRatio?: number;
    defectiveRate?: number;
    overallScore?: number;
    weightKg?: number;
    kernelWeightKg?: number;
    rawWeightKg?: number;
    latitude?: number;
    longitude?: number;
    documents?: {
        coo?: string | null;
        phyto?: string | null;
        billOfLading?: string | null;
        packingList?: string | null;
        invoice?: string | null;
        insurance?: string | null;
        compliancePack?: string | null;
    };
    farmer?: {
        id?: string;
        name: string;
        role: string;
        photo: string;
        yearsFarming: string;
        location: string;
        bio: string;
        quote?: string;
    } | null;
    sustainability?: {
        noChildLabor: boolean;
        farmOsMonitored: boolean;
        firebreak: boolean;
        sustainableHarvesting: boolean;
    } | null;
    farmOsMetadata?: {
        recordId: string;
        created: string;
        lastUpdated: string;
        verificationStatus: string;
    };
    sourceType?: string;
}

interface BuyerInfo {
    companyName: string;
    contactPerson: string;
}

const BuyerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(null);
    const [batches, setBatches] = useState<MyBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'journey' | 'quality' | 'documents'>('journey');

    useEffect(() => {
        const unsubscribe = onBuyerAuthChange(setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBuyerPortalData('myBatches');
                setBuyerInfo(data.buyer);
                // Assume the backend now returns the enriched data for the portal
                setBatches(data.batches || []);
            } catch (err: any) {
                console.error('Portal fetch error:', err);
                setError(err.message || 'Failed to load your batches');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const handleLogout = async () => {
        await buyerLogout();
        navigate('/portal/login');
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
            SHIPPED: { bg: 'bg-green-100', text: 'text-green-700', icon: <FaShip className="text-xs" />, label: 'Shipped' },
            DELIVERED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <FaCheckCircle className="text-xs" />, label: 'Delivered' },
            QUALITY_VERIFIED: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <FaCheckCircle className="text-xs" />, label: 'Quality Verified' },
            RECEIVED: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <FaClock className="text-xs" />, label: 'Received' },
            Processing: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <FaIndustry className="text-xs" />, label: 'Processing' },
        };
        const s = styles[status] || styles.RECEIVED;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                {s.icon}{s.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-[72px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-[72px] px-4">
                <div className="max-w-md w-full">
                    <InfoCard icon={FaShieldAlt} title="Access Error" variant="accent" showInfoBadge={false}>
                        <Typography variant="body" className="text-gray-700 mb-4">{error}</Typography>
                        <button onClick={handleLogout} className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium">
                            Sign Out
                        </button>
                    </InfoCard>
                </div>
            </div>
        );
    }

    const totalWeight = batches.reduce((s, b) => s + (b.weightKg || 0), 0);
    const inspected = batches.filter(b => b.qualityScore && b.qualityScore > 0);
    const avgQuality = inspected.length > 0 ? (inspected.reduce((s, b) => s + (b.qualityScore || 0), 0) / inspected.length).toFixed(1) : null;
    const totalDocsAvailable = batches.reduce((s, b) => s + (b.documents ? Object.values(b.documents).filter(Boolean).length : 0), 0);
    const premiumCount = batches.filter(b => b.qualityGrade === 'PREMIUM').length;

    return (
        <div className="min-h-screen pt-[72px] bg-gradient-to-br from-primary/5 to-accent/5">
            <Section className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {/* Header */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2 text-sm">
                                <FaShieldAlt className="inline mr-2 text-accent" /> Buyer Portal
                            </Typography>
                            <Typography variant="h1" className="text-3xl md:text-4xl font-display text-text-dark">
                                {buyerInfo?.companyName || 'Welcome'}
                            </Typography>
                            {buyerInfo?.contactPerson && (
                                <Typography variant="small" className="text-gray-500 mt-1">
                                    {buyerInfo.contactPerson} · {user?.email}
                                </Typography>
                            )}
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium hover:bg-white/80 transition">
                            <FaSignOutAlt className="text-xs" /> Sign Out
                        </button>
                    </motion.div>

                    {/* KPI Cards */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <motion.div variants={fadeIn}><InfoCard icon={FaBox} title={String(batches.length)} subtitle="Batches" iconColor="text-accent" showInfoBadge={false} /></motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.05 }}><InfoCard icon={FaShip} title={String(batches.filter(b => b.status === 'Shipped' || b.status === 'SHIPPED').length)} subtitle="Shipped" iconColor="text-green-600" showInfoBadge={false} /></motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.1 }}><InfoCard icon={FaCertificate} title={String(premiumCount)} subtitle="Premium Grade" iconColor="text-amber-500" showInfoBadge={false} /></motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.15 }}><InfoCard icon={FaPercentage} title={avgQuality ? `${avgQuality}%` : '—'} subtitle="Avg. Quality" iconColor="text-primary" showInfoBadge={false} /></motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.2 }}><InfoCard icon={FaDownload} title={String(totalDocsAvailable)} subtitle="Docs Available" iconColor="text-blue-600" showInfoBadge={false} /></motion.div>
                    </motion.div>

                    {/* Batches List */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        <Typography variant="h2" className="text-primary mb-4">Your Batches</Typography>

                        {batches.length === 0 ? (
                            <InfoCard icon={FaBox} title="No batches yet" variant="primary" showInfoBadge={false} className="text-center">
                                <Typography variant="body" className="text-gray-500">
                                    You don't have any batches assigned yet. We'll notify you when your first shipment is processed.
                                </Typography>
                            </InfoCard>
                        ) : (
                            <div className="space-y-8">
                                {batches.map((batch, idx) => {
                                    const isExpanded = expandedBatch === batch.id;

                                    // Determine status for Journey
                                    const status = batch.status;
                                    const isProcessing = status === 'Processing' || status === 'QUALITY_VERIFIED';
                                    const isShipped = status === 'Shipped' || status === 'SHIPPED';
                                    const isDelivered = status === 'Delivered' || status === 'DELIVERED';

                                    const journeySteps = [
                                        { icon: GiFruitTree, title: 'Farm', detail: batch.farmLocation || 'Odienné, Côte d\'Ivoire', sub: batch.block ? `Block ${batch.block}` : 'Main Farm', status: 'complete' },
                                        { icon: GiFactory, title: 'Process', detail: batch.processingFacility || 'AfriNuts NDC', sub: batch.qualityGrade ? `Grade: ${batch.qualityGrade}` : '', status: isProcessing || isShipped || isDelivered ? 'complete' : 'active' },
                                        { icon: FaCertificate, title: 'Certify', detail: batch.certifications?.[0] || 'Pending', sub: `${batch.certifications?.length || 0} certifications`, status: isShipped || isDelivered ? 'complete' : isProcessing ? 'active' : 'upcoming' },
                                        { icon: GiCargoShip, title: 'Ship', detail: batch.destination || 'Awaiting', sub: isShipped || isDelivered ? 'Via Port of Abidjan' : 'Not yet shipped', status: isShipped || isDelivered ? 'complete' : 'upcoming' },
                                        { icon: FaBuilding, title: 'Deliver', detail: batch.buyer || batch.destination || 'Awaiting', sub: isDelivered ? '✓ Delivered' : isShipped ? 'In Transit' : 'Pending', status: isDelivered ? 'complete' : isShipped ? 'active' : 'upcoming' },
                                        { icon: FaFileAlt, title: 'Docs', detail: batch.documents && Object.values(batch.documents).some(Boolean) ? 'Export Ready' : 'Processing', sub: batch.documents && Object.values(batch.documents).filter(Boolean).length > 0 ? `${Object.values(batch.documents).filter(Boolean).length} documents` : 'Available after export', status: isDelivered ? 'complete' : 'upcoming' },
                                    ];

                                    return (
                                        <motion.div key={batch.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                                    className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-3xl shadow-md overflow-hidden">

                                            {/* Card Header */}
                                            <div className="p-6 border-b border-gray-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                        <span className="font-mono text-lg font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                                                            {batch.batchId}
                                                        </span>
                                                        {batch.sourceType === 'OWN_FARM' && (
                                                            <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">AfriNuts Farm</span>
                                                        )}
                                                        {getStatusBadge(batch.status)}
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mt-3">
                                                        <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-gray-400" /> {new Date(batch.harvestDate).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1.5"><FaBox className="text-gray-400" /> {batch.rawWeightKg ? `${(batch.rawWeightKg / 1000).toFixed(1)}T raw` : '—'}</span>
                                                        {batch.kernelWeightKg && <span className="flex items-center gap-1.5"><FaPercentage className="text-gray-400" /> {(batch.kernelWeightKg / 1000).toFixed(1)}T kernel</span>}
                                                        <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-gray-400" /> {batch.farmLocation}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}
                                                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${isExpanded ? 'bg-gray-200 text-gray-700' : 'bg-primary text-white hover:bg-dark-orange'}`}>
                                                    {isExpanded ? 'Close Details' : 'View Full Dossier'}
                                                </button>
                                            </div>

                                            {/* Expanded Rich Details */}
                                            {isExpanded && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-white/30 p-6">

                                                    {/* Tabs */}
                                                    <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                                                        {[
                                                            { key: 'journey' as const, icon: FaMapMarkerAlt, label: 'Journey' },
                                                            { key: 'quality' as const, icon: FaChartBar, label: 'Quality' },
                                                            { key: 'documents' as const, icon: FaFileAlt, label: 'Documents' },
                                                        ].map((tab) => (
                                                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                                                <tab.icon className="text-xs" />{tab.label}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Tab Content: Journey */}
                                                    {activeTab === 'journey' && (
                                                        <div className="mb-8">
                                                            <div className="hidden md:block relative py-8">
                                                                <StaggerList className="grid grid-cols-6 gap-6 relative z-10">
                                                                    {journeySteps.map((step, i) => (
                                                                        <StaggerItem key={i} className="relative flex flex-col items-center text-center">
                                                                            <motion.div className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3 z-10 bg-white/80 backdrop-blur-sm`}
                                                                                        style={{ borderColor: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#d1d5db' }}>
                                                                                <step.icon className="text-2xl relative z-10" style={{ color: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#9ca3af' }} />
                                                                            </motion.div>
                                                                            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 w-full border border-white/30">
                                                                                <Typography variant="small" className="font-bold text-primary text-sm">{step.title}</Typography>
                                                                                <Typography variant="small" className="text-gray-600 text-[11px] mt-1 line-clamp-2">{step.detail}</Typography>
                                                                                {step.sub && <Typography variant="small" className="text-gray-400 text-[10px] mt-1 line-clamp-1">{step.sub}</Typography>}
                                                                            </div>
                                                                        </StaggerItem>
                                                                    ))}
                                                                </StaggerList>
                                                            </div>
                                                            {/* Mobile Journey */}
                                                            <div className="md:hidden">
                                                                <StaggerList className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4">
                                                                    {journeySteps.map((step, i) => (
                                                                        <StaggerItem key={i} className="snap-center flex-shrink-0 w-[160px] flex flex-col items-center text-center">
                                                                            <motion.div className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4 bg-white/80 backdrop-blur-sm`}
                                                                                        style={{ borderColor: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#d1d5db' }}>
                                                                                <step.icon className="text-xl" style={{ color: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#9ca3af' }} />
                                                                            </motion.div>
                                                                            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 w-full border border-white/30">
                                                                                <Typography variant="small" className="font-bold text-primary text-sm">{step.title}</Typography>
                                                                                <Typography variant="small" className="text-gray-600 text-[11px] mt-1 line-clamp-2">{step.detail}</Typography>
                                                                            </div>
                                                                        </StaggerItem>
                                                                    ))}
                                                                </StaggerList>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Tab Content: Quality */}
                                                    {activeTab === 'quality' && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                            <div className="bg-white/40 rounded-xl p-5 border border-white/30">
                                                                <div className="flex items-center gap-2 mb-4">
                                                                    <FaChartBar className="text-accent" />
                                                                    <Typography variant="h4" className="text-primary text-base">Quality Metrics</Typography>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    {[
                                                                        { label: 'Moisture', value: batch.moistureContent, unit: '%', max: 10, color: 'bg-primary' },
                                                                        { label: 'Nut Count', value: batch.nutCount, unit: '', max: 200, color: 'bg-secondary' },
                                                                        { label: 'Kernel Ratio', value: batch.kernelRatio, unit: '%', max: 55, color: 'bg-accent' },
                                                                        { label: 'Defects', value: batch.defectiveRate, unit: '%', max: 10, color: 'bg-dark-orange' },
                                                                    ].filter(m => m.value != null).map((metric, i) => (
                                                                        <div key={i} className="bg-white/50 rounded-lg p-3">
                                                                            <div className="flex justify-between items-center mb-1">
                                                                                <span className="text-sm text-gray-600 font-medium">{metric.label}</span>
                                                                                <span className="font-bold text-primary">{metric.value}{metric.unit}</span>
                                                                            </div>
                                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                                <motion.div className={`h-2 rounded-full ${metric.color}`} initial={{ width: 0 }} whileInView={{ width: `${Math.min((metric.value! / metric.max) * 100, 100)}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.2 }} />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                {batch.overallScore && (
                                                                    <div className="mt-4 bg-primary/10 rounded-xl p-4 text-center">
                                                                        <Typography variant="h3" className="font-bold text-primary"><CountUp to={batch.overallScore} duration={1.4} suffix="%" /></Typography>
                                                                        <Typography variant="small" className="text-gray-500">Overall Quality Score</Typography>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="bg-white/40 rounded-xl p-5 border border-white/30">
                                                                    <div className="flex items-center gap-2 mb-3"><FaFlask className="text-accent" /><Typography variant="h4" className="text-primary text-base">Lab Results</Typography></div>
                                                                    {batch.testResults ? (
                                                                        <div className="space-y-2">
                                                                            {[
                                                                                { label: 'Aflatoxin', value: batch.testResults.aflatoxin, limit: 4, unit: 'ppb' },
                                                                                { label: 'Heavy Metals', value: batch.testResults.heavyMetals, limit: 0.5, unit: 'ppb' },
                                                                                { label: 'Pesticides', value: batch.testResults.pesticideResidue, limit: 0.5, unit: 'ppb' },
                                                                            ].map((test, i) => (
                                                                                <div key={i} className="flex justify-between items-center bg-white/50 p-2.5 rounded-lg text-sm">
                                                                                    <span className="text-gray-600">{test.label}</span>
                                                                                    <span className={`font-bold ${test.value! < test.limit ? 'text-green-600' : 'text-red-600'}`}>
                                                                                        {test.value} {test.unit} {test.value! < test.limit ? '✓' : '⚠'}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : <div className="text-sm text-gray-500">Pending</div>}
                                                                </div>

                                                                <div className="bg-white/40 rounded-xl p-5 border border-white/30">
                                                                    <div className="flex items-center gap-2 mb-3"><FaLeaf className="text-green-600" /><Typography variant="h4" className="text-primary text-base">Sustainability</Typography></div>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        {[
                                                                            { label: 'No Child Labor', active: batch.sustainability?.noChildLabor, icon: FaChild },
                                                                            { label: 'Farm OS Monitored', active: batch.sustainability?.farmOsMonitored, icon: FaMobile },
                                                                            { label: 'Firebreak', active: batch.sustainability?.firebreak, icon: FaShieldAlt },
                                                                            { label: 'Sust. Harvest', active: batch.sustainability?.sustainableHarvesting, icon: FaTree },
                                                                        ].map((s, i) => (
                                                                            <div key={i} className={`p-2 rounded-lg text-center text-xs border ${s.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                                                                <s.icon className={`mx-auto mb-1 ${s.active ? 'text-green-600' : 'text-gray-400'}`} />
                                                                                {s.label} {s.active && '✓'}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Tab Content: Documents */}
                                                    {activeTab === 'documents' && (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                                            {[
                                                                { title: 'Certificate of Origin', key: 'coo', icon: FaFileAlt },
                                                                { title: 'Phytosanitary', key: 'phyto', icon: FaLeaf },
                                                                { title: 'Bill of Lading', key: 'billOfLading', icon: FaTruck },
                                                                { title: 'Packing List', key: 'packingList', icon: FaBox },
                                                                { title: 'Commercial Invoice', key: 'invoice', icon: FaFileAlt },
                                                                { title: 'Insurance', key: 'insurance', icon: FaShieldAlt },
                                                            ].map((doc, i) => {
                                                                const docUrl = batch.documents?.[doc.key as keyof typeof batch.documents];
                                                                return (
                                                                    <div key={i} className="bg-white/50 rounded-xl p-4 border border-white/30 flex flex-col justify-between">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <doc.icon className={docUrl ? 'text-green-600' : 'text-gray-400'} />
                                                                            <span className="font-semibold text-sm text-gray-800">{doc.title}</span>
                                                                        </div>
                                                                        {docUrl ? (
                                                                            <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary text-xs font-medium flex items-center gap-1 mt-2">
                                                                                <FaDownload className="text-[10px]" /> Download
                                                                            </a>
                                                                        ) : (
                                                                            <span className="text-gray-400 text-xs mt-2">Pending</span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* GPS Map & Digital Signature Row */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                                        {/* GPS Map */}
                                                        {batch.latitude && batch.longitude && (
                                                            <div className="bg-white/40 rounded-xl p-1 border border-white/30">
                                                                <BatchLocationMap latitude={batch.latitude} longitude={batch.longitude} farmName={batch.farmLocation} block={batch.block} />
                                                            </div>
                                                        )}

                                                        {/* Digital Signature */}
                                                        {batch.verificationCode && (
                                                            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-5 border border-primary/20">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <FaShieldAlt className="text-green-600" />
                                                                    <span className="font-semibold text-primary">Digital Signature Verified</span>
                                                                </div>
                                                                <div className="bg-white/50 rounded-lg p-3 text-center mb-3">
                                                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Verification Code</div>
                                                                    <div className="font-mono text-sm font-bold text-primary tracking-wider">{batch.verificationCode}</div>
                                                                </div>
                                                                <div className="text-[10px] text-gray-500 text-center">
                                                                    Signed: {batch.digitalSignature?.signedDate || 'Just now'}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Farmer Profile */}
                                                    {batch.farmer && (
                                                        <div className="mt-6 bg-white/40 rounded-xl p-5 border border-white/30">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <GiFarmer className="text-accent text-xl" />
                                                                <Typography variant="h4" className="text-primary text-base">The Farmer Behind This Batch</Typography>
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/5 flex items-center justify-center flex-shrink-0">
                                                                    {batch.farmer.photo ? <img src={batch.farmer.photo} className="w-full h-full object-cover" /> : <GiFarmer className="text-3xl text-primary/40" />}
                                                                </div>
                                                                <div className="text-center sm:text-left">
                                                                    <div className="font-bold text-lg text-gray-800">{batch.farmer.name}</div>
                                                                    <div className="text-sm text-accent font-medium">{batch.farmer.role} · {batch.farmer.yearsFarming}</div>
                                                                    <div className="text-xs text-gray-500 mt-1">{batch.farmer.bio}</div>
                                                                    {batch.farmer.quote && (
                                                                        <div className="mt-2 text-sm italic text-primary-dark border-l-2 border-primary/30 pl-3">"{batch.farmer.quote}"</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Help */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-8">
                        <InfoCard icon={FaUser} title="Need Help?" variant="primary" showInfoBadge={false}>
                            <Typography variant="body" className="text-gray-600 mb-3 text-sm">
                                Questions about your batches, documentation, or the portal? Our team is here to help.
                            </Typography>
                            <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-dark-orange transition">
                                Contact Us <FaArrowRight className="text-xs" />
                            </Link>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default BuyerDashboard;