import React, { useEffect, useState } from 'react';
import { auth } from '@/services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBox, FaShip, FaCheckCircle, FaClock, FaSignOutAlt,
    FaArrowRight, FaUser, FaDownload, FaShieldAlt,
    FaFileAlt, FaCertificate, FaMapMarkerAlt, FaPercentage,
    FaFlask, FaLeaf, FaChild, FaMobile, FaTree, FaCalendarAlt, FaBuilding,
    FaIndustry, FaChartBar, FaTruck, FaPrint, FaShare, FaEnvelope,
    FaArrowLeft, FaCopy, FaWhatsapp, FaTwitter, FaLinkedin
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

// Shared components
import { BatchFarmerCard } from '@/components/batch/BatchFarmerCard';
import { BatchSustainabilityCard } from '@/components/batch/BatchSustainabilityCard';
import { BatchSignatureCard } from '@/components/batch/BatchSignatureCard';

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
    digitalSignature?: { code: string; signedDate: string; signature: string } | null;
    qualityScore?: number;
    testResults?: { aflatoxin?: number; heavyMetals?: number; pesticideResidue?: number };
    destination: string;
    buyer?: string;
    status: string;
    moistureContent?: number;
    nutCount?: number;
    kernelRatio?: number;
    defectiveRate?: number;
    overallScore?: number;
    rawWeightKg?: number;
    kernelWeightKg?: number;
    latitude?: number | null;
    longitude?: number | null;
    documents?: Record<string, string | null | undefined>;
    farmer?: any;
    sustainability?: any;
    farmOsMetadata?: any;
    sourceType?: string;
}

interface BulkData {
    isBulk: true;
    masterBatch: {
        masterBatchNumber: string;
        shipmentName: string;
        buyer: string;
        destination: string;
        totalBatches: number;
        totalWeightKg: number;
        grades: string;
        exportDate: number;
    };
    batches: MyBatch[];
}

interface BuyerInfo {
    companyName: string;
    contactPerson: string;
}

const BuyerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(null);
    const [portalData, setPortalData] = useState<BulkData | MyBatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'journey' | 'quality' | 'documents'>('journey');
    const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const unsubscribe = onBuyerAuthChange(setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBuyerPortalData('myBatches');
                setBuyerInfo(data.buyer);
                if (data.isBulk) {
                    setPortalData(data as BulkData);
                } else {
                    setPortalData(data.batches || []);
                }
            } catch (err: any) {
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

    const handleShare = async (batchId: string, platform?: string) => {
        const url = `${window.location.origin}/trace?batchId=${encodeURIComponent(batchId)}`;
        const text = `AfriNuts Batch Traceability: ${batchId}`;

        if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        else if (platform === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        else if (platform === 'email') window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) { console.error('Failed to copy:', err); }
        }
        setShowShareMenu(null);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-[72px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center pt-[72px] px-4"><InfoCard icon={FaShieldAlt} title="Access Error" variant="accent" showInfoBadge={false}><Typography variant="body" className="text-gray-700 mb-4">{error}</Typography><button onClick={handleLogout} className="bg-primary text-white px-6 py-2 rounded-full text-sm">Sign Out</button></InfoCard></div>;

    const isBulk = !Array.isArray(portalData) && (portalData as BulkData).isBulk;
    const bulkData = isBulk ? (portalData as BulkData) : null;
    const batches = isBulk ? bulkData!.batches : (portalData as MyBatch[]);

    // KPIs
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

                        {/* Bulk Master Card */}
                        {isBulk && bulkData && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                                <InfoCard
                                    icon={FaShip}
                                    title={`Bulk Shipment: ${bulkData.masterBatch.masterBatchNumber}`}
                                    subtitle={`${bulkData.masterBatch.shipmentName} · ${bulkData.masterBatch.totalBatches} batches consolidated`}
                                    iconColor="text-blue-600"
                                    showInfoBadge={false}
                                    className="border-2 border-blue-200 bg-blue-50/50"
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        <div className="bg-white/60 rounded-xl p-3 text-center border border-white">
                                            <div className="text-gray-500 text-xs uppercase">Buyer</div>
                                            <div className="font-semibold text-gray-800">{bulkData.masterBatch.buyer}</div>
                                        </div>
                                        <div className="bg-white/60 rounded-xl p-3 text-center border border-white">
                                            <div className="text-gray-500 text-xs uppercase">Destination</div>
                                            <div className="font-semibold text-gray-800">{bulkData.masterBatch.destination}</div>
                                        </div>
                                        <div className="bg-white/60 rounded-xl p-3 text-center border border-white">
                                            <div className="text-gray-500 text-xs uppercase">Total Weight</div>
                                            <div className="font-semibold text-gray-800">{(bulkData.masterBatch.totalWeightKg / 1000).toFixed(1)}T</div>
                                        </div>
                                        <div className="bg-white/60 rounded-xl p-3 text-center border border-white">
                                            <div className="text-gray-500 text-xs uppercase">Grades</div>
                                            <div className="font-semibold text-gray-800">{bulkData.masterBatch.grades}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-blue-200/50 text-center">
                                        <Typography variant="small" className="text-blue-700">
                                            This shipment consolidates {bulkData.masterBatch.totalBatches} individual batches. Scroll down to view the detailed traceability for each batch.
                                        </Typography>
                                    </div>
                                </InfoCard>
                            </motion.div>
                        )}

                        {batches.length === 0 ? (
                            <InfoCard icon={FaBox} title="No batches yet" variant="primary" showInfoBadge={false} className="text-center">
                                <Typography variant="body" className="text-gray-500">You don't have any batches assigned yet. We'll notify you when your first shipment is processed.</Typography>
                            </InfoCard>
                        ) : (
                            <div className="space-y-12">
                                {batches.map((batch, idx) => {
                                    const status = batch.status;
                                    const isProcessing = status === 'Processing' || status === 'QUALITY_VERIFIED';
                                    const isShipped = status === 'Shipped' || status === 'SHIPPED';
                                    const isDelivered = status === 'Delivered' || status === 'DELIVERED';

                                    const journeySteps = [
                                        { icon: GiFruitTree, title: 'Farm', detail: batch.farmLocation || 'Odienné', sub: batch.block ? `Block ${batch.block}` : 'Main Farm', status: 'complete' },
                                        { icon: GiFactory, title: 'Process', detail: batch.processingFacility || 'AfriNuts NDC', sub: batch.qualityGrade ? `Grade: ${batch.qualityGrade}` : '', status: isProcessing || isShipped || isDelivered ? 'complete' : 'active' },
                                        { icon: FaCertificate, title: 'Certify', detail: batch.certifications?.[0] || 'Pending', sub: `${batch.certifications?.length || 0} certifications`, status: isShipped || isDelivered ? 'complete' : isProcessing ? 'active' : 'upcoming' },
                                        { icon: GiCargoShip, title: 'Ship', detail: batch.destination || 'Awaiting', sub: isShipped || isDelivered ? 'Via Port of Abidjan' : 'Not yet shipped', status: isShipped || isDelivered ? 'complete' : 'upcoming' },
                                        { icon: FaBuilding, title: 'Deliver', detail: batch.buyer || batch.destination || 'Awaiting', sub: isDelivered ? '✓ Delivered' : isShipped ? 'In Transit' : 'Pending', status: isDelivered ? 'complete' : isShipped ? 'active' : 'upcoming' },
                                        { icon: FaFileAlt, title: 'Docs', detail: batch.documents && Object.values(batch.documents).some(Boolean) ? 'Export Ready' : 'Processing', sub: batch.documents && Object.values(batch.documents).filter(Boolean).length > 0 ? `${Object.values(batch.documents).filter(Boolean).length} documents` : 'Available after export', status: isDelivered ? 'complete' : 'upcoming' },
                                    ];

                                    return (
                                        <motion.div key={batch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="space-y-6">

                                            {/* Dossier Card */}
                                            <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 transform-gpu overflow-hidden">
                                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                                <div className="relative z-10">
                                                    <div className="text-center mb-8">
                                                        <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full">
                                                            <FaCheckCircle className="text-primary" />
                                                            <span className="font-mono text-lg font-bold text-primary">{batch.batchId}</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        {[
                                                            { label: 'Harvest Date', value: new Date(batch.harvestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: FaCalendarAlt },
                                                            { label: 'Farm Location', value: `${batch.farmLocation}${batch.block ? ` · ${batch.block}` : ''}`, icon: FaMapMarkerAlt },
                                                            { label: 'Destination', value: batch.destination || '—', icon: FaTruck },
                                                            { label: 'Receiving Company', value: batch.buyer || '—', icon: FaBuilding },
                                                        ].map((item, i) => (
                                                            <div key={i} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <item.icon className="text-accent text-sm" />
                                                                    <span className="text-gray-500 font-medium text-xs uppercase">{item.label}</span>
                                                                </div>
                                                                <div className="font-semibold text-gray-800">{item.value}</div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Quality & Processing details grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                                        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                            <div className="flex items-center gap-2 mb-3"><FaIndustry className="text-accent text-sm" /><span className="text-gray-500 font-medium text-xs uppercase">Processing Info</span></div>
                                                            <div className="space-y-2">
                                                                {[
                                                                    { label: 'Facility', value: batch.processingFacility || '—' },
                                                                    { label: 'Method', value: batch.processingMethod || '—' },
                                                                    { label: 'Shelling', value: batch.shellingMethod || '—' },
                                                                    { label: 'Grading', value: batch.gradingMethod || '—' },
                                                                ].map((item, i) => (
                                                                    <div key={i} className="flex justify-between text-sm"><span className="text-gray-500">{item.label}</span><span className="font-medium text-gray-700 text-right max-w-[60%]">{item.value}</span></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                            <div className="flex items-center gap-2 mb-3"><FaFlask className="text-accent text-sm" /><span className="text-gray-500 font-medium text-xs uppercase">Quality Results</span></div>
                                                            <div className="space-y-2">
                                                                {batch.testResults && [
                                                                    { label: 'Aflatoxin', value: batch.testResults?.aflatoxin != null ? `${batch.testResults.aflatoxin} ppb` : '—', status: (batch.testResults?.aflatoxin ?? 99) < 4 ? 'pass' : 'fail' },
                                                                    { label: 'Heavy Metals', value: batch.testResults?.heavyMetals != null ? `${batch.testResults.heavyMetals} ppb` : '—', status: (batch.testResults?.heavyMetals ?? 99) < 0.5 ? 'pass' : 'fail' },
                                                                    { label: 'Pesticides', value: batch.testResults?.pesticideResidue != null ? `${batch.testResults.pesticideResidue} ppb` : '—', status: (batch.testResults?.pesticideResidue ?? 99) < 0.5 ? 'pass' : 'fail' },
                                                                ].map((item, i) => (
                                                                    <div key={i} className="flex justify-between text-sm items-center">
                                                                        <span className="text-gray-500">{item.label}</span>
                                                                        <span className={`font-medium ${item.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>{item.value} {item.status === 'pass' ? ' ✓' : ' ⚠'}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Shared Components */}
                                            <BatchFarmerCard farmer={batch.farmer} />
                                            <BatchSustainabilityCard sustainability={batch.sustainability} />

                                            {/* GPS Map */}
                                            {batch.latitude && batch.longitude && (
                                                <InfoCard icon={FaMapMarkerAlt} title="GPS Verified Location" variant="primary" showInfoBadge={false}>
                                                    <div className="mt-3">
                                                        <BatchLocationMap latitude={batch.latitude} longitude={batch.longitude} farmName={batch.farmLocation || 'AfriNuts Farm'} block={batch.block} />
                                                    </div>
                                                </InfoCard>
                                            )}

                                            <BatchSignatureCard metadata={batch.farmOsMetadata} signature={batch.digitalSignature} />

                                            {/* Tabs */}
                                            <div className="mt-8">
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

                                                {activeTab === 'journey' && (
                                                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
                                                        <h3 className="text-center text-primary font-bold text-xl mb-6">Your Order's Journey</h3>
                                                        <div className="hidden md:block relative py-8">
                                                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                                                                <path d="M40,100 C200,20 300,180 500,100 C650,40 700,160 760,100" fill="none" stroke="url(#journeyGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8,4" />
                                                            </svg>
                                                            <div className="grid grid-cols-6 gap-6 relative z-10">
                                                                {journeySteps.map((step, i) => (
                                                                    <div key={i} className="relative flex flex-col items-center text-center" style={{ marginTop: i % 2 === 0 ? '4rem' : '1rem' }}>
                                                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3 z-10 bg-white/80 backdrop-blur-sm border-3 ${step.status === 'complete' ? 'border-green-500' : step.status === 'active' ? 'border-accent animate-pulse' : 'border-gray-300'}`}>
                                                                            <step.icon className={`text-2xl ${step.status === 'complete' ? 'text-green-500' : step.status === 'active' ? 'text-accent' : 'text-gray-400'}`} />
                                                                        </div>
                                                                        <div className={`bg-white/40 backdrop-blur-sm rounded-xl p-3 w-full border shadow-sm mt-3 ${step.status === 'active' ? 'border-accent/50' : 'border-white/30'}`}>
                                                                            <div className="font-bold text-primary text-sm">{step.title}</div>
                                                                            <div className="text-gray-600 text-[11px] mt-1 line-clamp-2">{step.detail}</div>
                                                                            {step.sub && <div className="text-gray-400 text-[10px] mt-1 line-clamp-1">{step.sub}</div>}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {activeTab === 'quality' && (
                                                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
                                                        {batch.overallScore ? (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-4">
                                                                    <h3 className="text-primary font-bold text-lg mb-3">Quality Metrics</h3>
                                                                    {[
                                                                        { label: 'Moisture', value: batch.moistureContent, unit: '%', max: 10, color: 'bg-primary' },
                                                                        { label: 'Nut Count', value: batch.nutCount, unit: '', max: 200, color: 'bg-secondary' },
                                                                        { label: 'Kernel Ratio', value: batch.kernelRatio, unit: '%', max: 55, color: 'bg-accent' },
                                                                        { label: 'Defects', value: batch.defectiveRate, unit: '%', max: 10, color: 'bg-dark-orange' },
                                                                    ].filter(m => m.value != null).map((metric, i) => (
                                                                        <div key={i} className="bg-white/50 rounded-xl p-3 border border-white/30">
                                                                            <div className="flex justify-between items-center mb-2">
                                                                                <span className="text-gray-700 font-medium text-sm">{metric.label}</span>
                                                                                <span className="font-bold text-primary">{metric.value}{metric.unit}</span>
                                                                            </div>
                                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                                <div className={`h-2 rounded-full ${metric.color}`} style={{ width: `${Math.min((metric.value! / metric.max) * 100, 100)}%` }} />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    <div className="mt-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 text-center">
                                                                        <div className="font-bold text-primary text-3xl">{batch.overallScore}%</div>
                                                                        <div className="text-gray-500 text-sm">Overall Quality Score</div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <h3 className="text-primary font-bold text-lg mb-3">Certifications</h3>
                                                                    {batch.certifications?.map((cert, i) => (
                                                                        <div key={i} className="flex items-center gap-3 bg-white/40 rounded-xl p-3 border border-white/30">
                                                                            <FaCertificate className="text-accent" />
                                                                            <div>
                                                                                <div className="font-medium text-gray-800">{cert}</div>
                                                                                <div className="text-green-600 text-xs flex items-center gap-1"><FaCheckCircle className="text-[10px]" /> Verified</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 text-gray-400">Quality metrics coming soon.</div>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'documents' && (
                                                    <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {[
                                                                { title: 'Certificate of Origin', key: 'coo', icon: FaFileAlt },
                                                                { title: 'Phytosanitary', key: 'phyto', icon: FaLeaf },
                                                                { title: 'Bill of Lading', key: 'billOfLading', icon: FaTruck },
                                                                { title: 'Packing List', key: 'packingList', icon: FaBox },
                                                                { title: 'Commercial Invoice', key: 'invoice', icon: FaFileAlt },
                                                                { title: 'Insurance', key: 'insurance', icon: FaShieldAlt },
                                                            ].map((doc, i) => {
                                                                const docUrl = batch.documents?.[doc.key];
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
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Bar (Print & Share) */}
                                            <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
                                                <div className="text-gray-500 text-sm">Batch {idx + 1} of {batches.length}</div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => window.print()} className="px-4 py-2 bg-white/50 border border-gray-200 rounded-full text-sm font-medium hover:bg-white/80 transition flex items-center gap-2">
                                                        <FaPrint className="text-xs" /> Print
                                                    </button>
                                                    <div className="relative">
                                                        <button onClick={() => setShowShareMenu(showShareMenu === batch.id ? null : batch.id)} className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-dark-orange transition flex items-center gap-2">
                                                            <FaShare className="text-xs" /> Share
                                                        </button>
                                                        {showShareMenu === batch.id && (
                                                            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                                                                {[
                                                                    { icon: FaCopy, label: 'Copy Link', action: () => handleShare(batch.batchId) },
                                                                    { icon: FaWhatsapp, label: 'WhatsApp', action: () => handleShare(batch.batchId, 'whatsapp') },
                                                                    { icon: FaTwitter, label: 'Twitter', action: () => handleShare(batch.batchId, 'twitter') },
                                                                    { icon: FaLinkedin, label: 'LinkedIn', action: () => handleShare(batch.batchId, 'linkedin') },
                                                                    { icon: FaEnvelope, label: 'Email', action: () => handleShare(batch.batchId, 'email') },
                                                                ].map((item, i) => (
                                                                    <button key={i} onClick={item.action} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition">
                                                                        <item.icon className="text-gray-500 text-xs" />{item.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="border-gray-200/50 my-6" />
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