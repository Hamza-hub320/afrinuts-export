import React, { useEffect, useState } from 'react';
import { auth } from '@/services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBox, FaShip, FaCheckCircle, FaClock, FaSignOutAlt,
    FaArrowRight, FaUser, FaDownload, FaShieldAlt,
    FaFileAlt, FaCertificate, FaMapMarkerAlt, FaPercentage,
    FaFlask, FaLeaf, FaChild, FaMobile, FaTree, FaCalendarAlt, FaBuilding
} from 'react-icons/fa';
import { GiFarmer } from 'react-icons/gi';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getBuyerPortalData } from '@/services/api';
import { buyerLogout, onBuyerAuthChange } from '@/services/buyerAuth';
import type { User } from 'firebase/auth';
import BatchLocationMap from '@/components/BatchLocationMap/BatchLocationMap';

interface MyBatch {
    id: string;
    batchId: string;
    processingDate: number;
    qualityGrade: string;
    sourceType: string;
    weightKg: number;
    isInspected: boolean;
    status: string;

    // Private enriched fields
    qualityScore?: number | null;
    moistureContent?: number | null;
    defectiveRate?: number | null;
    buyer?: string | null;
    destination?: string | null;
    destinationCountry?: string | null;
    documentsAvailable?: number;
    documentsTotal?: number;
    farmerName?: string | null;
    certifications?: string[];
    verificationCode?: string | null;
    exportDate?: number | null;
    rawWeightKg?: number | null;
    kernelWeightKg?: number | null;

    // Assuming the backend `myBatches` returns these or you can fetch them individually
    farmLocation?: string;
    block?: string;
    latitude?: number;
    longitude?: number;
    farmerBio?: string;
    farmerPhoto?: string;
    farmerQuote?: string;
    processingFacility?: string;
    processingMethod?: string;
    shellingMethod?: string;
    gradingMethod?: string;
    testResults?: {
        aflatoxin?: number | null;
        heavyMetals?: number | null;
        pesticideResidue?: number | null;
    };
    sustainability?: {
        noChildLabor: boolean;
        farmOsMonitored: boolean;
        firebreak: boolean;
        sustainableHarvesting: boolean;
    };
    yieldPercentage?: number | null;
    kernelRatio?: number | null;
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
            QUALITY_VERIFIED: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <FaCheckCircle className="text-xs" />, label: 'Quality Verified' },
            RECEIVED: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <FaClock className="text-xs" />, label: 'Received' },
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

    // KPIs
    const totalWeight = batches.reduce((s, b) => s + (b.weightKg || 0), 0);
    const inspected = batches.filter(b => b.isInspected);
    const avgQuality = inspected.length > 0 ? (inspected.reduce((s, b) => s + (b.qualityScore || 0), 0) / inspected.length).toFixed(1) : null;
    const totalDocsAvailable = batches.reduce((s, b) => s + (b.documentsAvailable || 0), 0);
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
                        <motion.div variants={fadeIn} transition={{ delay: 0.05 }}><InfoCard icon={FaShip} title={String(batches.filter(b => b.status === 'SHIPPED').length)} subtitle="Shipped" iconColor="text-green-600" showInfoBadge={false} /></motion.div>
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
                            <div className="space-y-6">
                                {batches.map((batch, idx) => {
                                    const isExpanded = expandedBatch === batch.id;
                                    return (
                                        <motion.div key={batch.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                                    className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl shadow-md overflow-hidden">

                                            {/* Card Header */}
                                            <div className="p-5 cursor-pointer hover:bg-white/40 transition-colors" onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}>
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                                {batch.batchId}
                                                            </span>
                                                            {batch.sourceType === 'OWN_FARM' && (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">AfriNuts Farm</span>
                                                            )}
                                                            {getStatusBadge(batch.status)}
                                                        </div>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                                                            <span className="flex items-center gap-1"><FaCalendarAlt className="text-gray-400" /> {new Date(batch.processingDate).toLocaleDateString()}</span>
                                                            <span className="flex items-center gap-1"><FaBox className="text-gray-400" /> {(batch.weightKg / 1000).toFixed(1)}T raw</span>
                                                            {batch.kernelWeightKg && <span className="flex items-center gap-1"><FaPercentage className="text-gray-400" /> {(batch.kernelWeightKg / 1000).toFixed(1)}T kernel</span>}
                                                            <span className={`px-2 py-0.5 rounded-full ${batch.qualityGrade === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                {batch.qualityGrade}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className="text-xs text-gray-500 hover:text-primary px-3 py-2">
                                                        {isExpanded ? 'Hide details' : 'View full details'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-gray-200/50 bg-white/30 p-5">

                                                    {/* Quality & Origin Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                                        {batch.qualityScore != null && (
                                                            <div className="bg-white/60 rounded-xl p-3 border border-white/40">
                                                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Quality Score</div>
                                                                <div className="font-bold text-primary text-lg">{batch.qualityScore.toFixed(1)}%</div>
                                                            </div>
                                                        )}
                                                        {batch.moistureContent != null && (
                                                            <div className="bg-white/60 rounded-xl p-3 border border-white/40">
                                                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Moisture</div>
                                                                <div className="font-bold text-blue-600 text-lg">{batch.moistureContent}%</div>
                                                            </div>
                                                        )}
                                                        {batch.defectiveRate != null && (
                                                            <div className="bg-white/60 rounded-xl p-3 border border-white/40">
                                                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Defects</div>
                                                                <div className="font-bold text-red-600 text-lg">{batch.defectiveRate}%</div>
                                                            </div>
                                                        )}
                                                        {batch.destinationCountry && (
                                                            <div className="bg-white/60 rounded-xl p-3 border border-white/40">
                                                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Destination</div>
                                                                <div className="font-bold text-gray-700 text-sm">{batch.destinationCountry}</div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Farmer */}
                                                    {batch.farmerName && (
                                                        <div className="bg-white/40 rounded-xl p-4 flex items-center gap-4 mb-4">
                                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                                {batch.farmerPhoto ? <img src={batch.farmerPhoto} className="w-full h-full rounded-full object-cover" /> : <GiFarmer className="text-xl text-primary" />}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-gray-500">Grown by</div>
                                                                <div className="font-bold text-gray-800">{batch.farmerName}</div>
                                                                {batch.farmerBio && <div className="text-xs text-gray-600 line-clamp-1">{batch.farmerBio}</div>}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Processing Info */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                                            <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2"><FaFlask className="text-accent"/> Processing Details</div>
                                                            <div className="space-y-1 text-sm">
                                                                <div className="flex justify-between"><span className="text-gray-500">Facility:</span> <span className="font-medium text-right">{batch.processingFacility || 'AfriNuts NDC'}</span></div>
                                                                <div className="flex justify-between"><span className="text-gray-500">Method:</span> <span className="font-medium text-right">{batch.processingMethod || 'Steam Roasted'}</span></div>
                                                                <div className="flex justify-between"><span className="text-gray-500">Yield:</span> <span className="font-medium text-right">{batch.yieldPercentage ? `${batch.yieldPercentage.toFixed(1)}%` : '—'}</span></div>
                                                            </div>
                                                        </div>

                                                        {/* Lab Results */}
                                                        <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                                            <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2"><FaShieldAlt className="text-green-600"/> Quality Lab Results</div>
                                                            {batch.testResults ? (
                                                                <div className="space-y-1 text-sm">
                                                                    <div className="flex justify-between"><span className="text-gray-500">Aflatoxin:</span> <span className={`font-medium ${batch.testResults.aflatoxin! < 4 ? 'text-green-600' : 'text-red-600'}`}>{batch.testResults.aflatoxin} ppb {batch.testResults.aflatoxin! < 4 ? '✓' : '⚠'}</span></div>
                                                                    <div className="flex justify-between"><span className="text-gray-500">Heavy Metals:</span> <span className={`font-medium ${batch.testResults.heavyMetals! < 0.5 ? 'text-green-600' : 'text-red-600'}`}>{batch.testResults.heavyMetals} ppb {batch.testResults.heavyMetals! < 0.5 ? '✓' : '⚠'}</span></div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-gray-500">Lab results pending</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Sustainability */}
                                                    {batch.sustainability && (
                                                        <div className="bg-white/40 rounded-xl p-4 border border-white/30 mb-4">
                                                            <div className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2"><FaLeaf className="text-green-600"/> Sustainability Verification</div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                                {[
                                                                    { label: 'No Child Labor', active: batch.sustainability.noChildLabor, icon: FaChild },
                                                                    { label: 'Farm OS Monitored', active: batch.sustainability.farmOsMonitored, icon: FaMobile },
                                                                    { label: 'Firebreak Protected', active: batch.sustainability.firebreak, icon: FaShieldAlt },
                                                                    { label: 'Sustainable Harvest', active: batch.sustainability.sustainableHarvesting, icon: FaTree },
                                                                ].map((s, i) => (
                                                                    <div key={i} className={`p-2 rounded-lg text-center text-xs border ${s.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                                                        <s.icon className={`mx-auto mb-1 ${s.active ? 'text-green-600' : 'text-gray-400'}`} />
                                                                        {s.label} {s.active && '✓'}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* GPS Map */}
                                                    {batch.latitude && batch.longitude && (
                                                        <div className="bg-white/40 rounded-xl p-1 border border-white/30 mb-4">
                                                            <BatchLocationMap latitude={batch.latitude} longitude={batch.longitude} farmName={batch.farmLocation || 'AfriNuts Farm'} block={batch.block || null} />
                                                        </div>
                                                    )}

                                                    {/* Digital Signature */}
                                                    {batch.verificationCode && (
                                                        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/20 text-center">
                                                            <div className="text-xs font-semibold text-primary mb-1 flex items-center justify-center gap-2"><FaShieldAlt className="text-green-600"/> Digital Signature Verified</div>
                                                            <div className="font-mono text-sm tracking-wider text-gray-700">{batch.verificationCode}</div>
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