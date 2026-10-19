import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBox, FaShip, FaCheckCircle, FaClock, FaSignOutAlt,
    FaArrowRight, FaUser, FaBuilding, FaMapMarkerAlt,
    FaDownload, FaShieldAlt, FaFileAlt, FaExternalLinkAlt,
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getBuyerPortalData } from '@/services/api';
import { buyerLogout, onBuyerAuthChange } from '@/services/buyerAuth';
import type { User } from 'firebase/auth';

interface MyBatch {
    id: string;
    batchId: string;
    processingDate: number;
    qualityGrade: string;
    sourceType: string;
    weightKg: number;
    isInspected: boolean;
    hasVerification: boolean;
    status: string;
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

    useEffect(() => {
        const unsubscribe = onBuyerAuthChange((u) => {
            setUser(u);
        });
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
        const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
            SHIPPED: { bg: 'bg-green-100', text: 'text-green-700', icon: <FaShip className="text-xs" /> },
            QUALITY_VERIFIED: { bg: 'bg-amber-100', text: 'text-amber-700', icon: <FaCheckCircle className="text-xs" /> },
            RECEIVED: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <FaClock className="text-xs" /> },
        };
        const style = styles[status] || styles.RECEIVED;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                {style.icon}
                {status.replace(/_/g, ' ')}
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
                        <Typography variant="body" className="text-gray-700 mb-4">
                            {error}
                        </Typography>
                        <button
                            onClick={handleLogout}
                            className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium"
                        >
                            Sign Out
                        </button>
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
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
                    >
                        <div>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2 text-sm">
                                <FaShieldAlt className="inline mr-2 text-accent" />
                                Buyer Portal
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
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium hover:bg-white/80 transition"
                        >
                            <FaSignOutAlt className="text-xs" />
                            Sign Out
                        </button>
                    </motion.div>

                    {/* KPI Cards */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                        <motion.div variants={fadeIn}>
                            <InfoCard icon={FaBox} title={String(batches.length)} subtitle="Your Batches" iconColor="text-accent" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.1 }}>
                            <InfoCard
                                icon={FaShip}
                                title={String(batches.filter(b => b.status === 'SHIPPED').length)}
                                subtitle="Shipped"
                                iconColor="text-green-600"
                                showInfoBadge={false}
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.2 }}>
                            <InfoCard
                                icon={FaCheckCircle}
                                title={String(batches.filter(b => b.isInspected).length)}
                                subtitle="Quality Verified"
                                iconColor="text-amber-500"
                                showInfoBadge={false}
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                            <InfoCard
                                icon={FaMapMarkerAlt}
                                title={`${(batches.reduce((s, b) => s + (b.weightKg || 0), 0) / 1000).toFixed(0)}T`}
                                subtitle="Total Volume"
                                iconColor="text-primary"
                                showInfoBadge={false}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Batches List */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        <Typography variant="h2" className="text-primary mb-4">
                            Your Batches
                        </Typography>

                        {batches.length === 0 ? (
                            <InfoCard icon={FaBox} title="No batches yet" variant="primary" showInfoBadge={false} className="text-center">
                                <Typography variant="body" className="text-gray-500">
                                    You don't have any batches assigned yet. We'll notify you when your first shipment is processed.
                                </Typography>
                            </InfoCard>
                        ) : (
                            <div className="space-y-3">
                                {batches.map((batch, idx) => (
                                    <motion.div
                                        key={batch.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Link to={`/trace?batchId=${encodeURIComponent(batch.batchId)}`}>
                                            <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                                {batch.batchId}
                                                            </span>
                                                            {batch.sourceType === 'OWN_FARM' && (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                                    AfriNuts Farm
                                                                </span>
                                                            )}
                                                            {getStatusBadge(batch.status)}
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                                                            <span>
                                                                {new Date(batch.processingDate).toLocaleDateString('en-US', {
                                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                                })}
                                                            </span>
                                                            <span>·</span>
                                                            <span>{(batch.weightKg / 1000).toFixed(1)}T</span>
                                                            <span>·</span>
                                                            <span className={`px-2 py-0.5 rounded-full ${
                                                                batch.qualityGrade === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {batch.qualityGrade}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                                                        View Full Record
                                                        <FaArrowRight className="text-xs" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Help Section */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="mt-8"
                    >
                        <InfoCard icon={FaUser} title="Need Help?" variant="primary" showInfoBadge={false}>
                            <Typography variant="body" className="text-gray-600 mb-3 text-sm">
                                Questions about your batches, documentation, or the portal? Our team is here to help.
                            </Typography>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-dark-orange transition"
                            >
                                Contact Us
                                <FaArrowRight className="text-xs" />
                            </Link>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default BuyerDashboard;