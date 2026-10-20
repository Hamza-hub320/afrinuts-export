import React, { useEffect, useState } from 'react';
import { auth } from '@/services/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBox, FaShip, FaCheckCircle, FaClock, FaSignOutAlt, FaArrowRight, FaUser, FaDownload, FaShieldAlt, FaPercentage, FaCertificate } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getBuyerPortalData } from '@/services/api';
import { buyerLogout, onBuyerAuthChange } from '@/services/buyerAuth';
import type { User } from 'firebase/auth';
import { Reveal, StaggerList, StaggerItem } from '@/components/Reveal';
import { BatchDossierCard, MyBatch } from '@/components/BatchDossierCard/BatchDossierCard';

interface BulkData {
    isBulk: true;
    masterBatch: {
        id: string;
        masterBatchNumber: string;
        shipmentName: string;
        buyer: string;
        destination: string;
        destinationCountry?: string | null;
        exportDate: number;
        totalBatches: number;
        totalWeightKg: number;
        grades: string;
    };
    batches: MyBatch[];
    farmers: any[];
    sustainability: any;
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
    const [bulkShipments, setBulkShipments] = useState<BulkData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setBulkShipments(data.bulkShipments || []);
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

    const handleShare = async (batchId: string) => {
        const url = `${window.location.origin}/trace?batchId=${encodeURIComponent(batchId)}`;
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    if (error) return (
        <div className="min-h-screen flex items-center justify-center pt-[72px] px-4">
            <div className="max-w-md w-full"><InfoCard icon={FaShieldAlt} title="Access Error" variant="accent" showInfoBadge={false}><Typography variant="body" className="mb-4">{error}</Typography><button onClick={handleLogout} className="bg-primary text-white px-6 py-2 rounded-full text-sm">Sign Out</button></InfoCard></div>
        </div>
    );

    const totalWeight = batches.reduce((s, b) => s + (b.rawWeightKg || 0), 0);
    const avgQuality = batches.filter(b => b.overallScore).length > 0
        ? (batches.filter(b => b.overallScore).reduce((s, b) => s + (b.overallScore || 0), 0) / batches.filter(b => b.overallScore).length).toFixed(1)
        : null;
    const premiumCount = batches.filter(b => b.qualityGrade === 'PREMIUM').length;

    return (
        <div className="min-h-screen pt-[72px] bg-gradient-to-br from-primary/5 to-accent/5">
            <Section className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {/* Header */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex justify-between items-start mb-8">
                        <div>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2 text-sm"><FaShieldAlt className="inline mr-2 text-accent" /> Buyer Portal</Typography>
                            <Typography variant="h1" className="text-3xl md:text-4xl font-display text-text-dark">{buyerInfo?.companyName || 'Welcome'}</Typography>
                            {buyerInfo?.contactPerson && <Typography variant="small" className="text-gray-500 mt-1">{buyerInfo.contactPerson} · {user?.email}</Typography>}
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-gray-200 rounded-full text-sm hover:bg-white/80"><FaSignOutAlt className="text-xs" /> Sign Out</button>
                    </motion.div>

                    {/* KPIs */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <InfoCard icon={FaBox} title={String(batches.length + bulkShipments.length)} subtitle="Total Shipments" iconColor="text-accent" showInfoBadge={false} />
                        <InfoCard icon={FaShip} title={String(batches.filter(b => b.status === 'Shipped' || b.status === 'SHIPPED').length)} subtitle="Shipped" iconColor="text-green-600" showInfoBadge={false} />
                        <InfoCard icon={FaCertificate} title={String(premiumCount)} subtitle="Premium Grade" iconColor="text-amber-500" showInfoBadge={false} />
                        <InfoCard icon={FaPercentage} title={avgQuality ? `${avgQuality}%` : '—'} subtitle="Avg. Quality" iconColor="text-primary" showInfoBadge={false} />
                    </motion.div>

                    {/* THE LOGIC: Bulk Shipments first, then Single Batches */}
                    <div className="space-y-16">

                        {/* 1. BULK SHIPMENTS LOOP */}
                        {bulkShipments.map((bulk, bulkIdx) => (
                            <div key={bulk.masterBatch.id} className="space-y-8">

                                {/* Bulk Header Banner (Styled exactly like Trace.tsx) */}
                                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600"><FaShip className="text-2xl" /></div>
                                        <div>
                                            <h3 className="text-xl font-bold text-blue-900">Bulk Shipment: {bulk.masterBatch.masterBatchNumber}</h3>
                                            <p className="text-blue-700 text-sm">{bulk.masterBatch.shipmentName} · {bulk.masterBatch.totalBatches} batches consolidated</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="bg-white rounded-xl p-3 text-center border border-blue-100"><div className="text-xs text-gray-500 uppercase">Buyer</div><div className="font-semibold text-sm">{bulk.masterBatch.buyer}</div></div>
                                        <div className="bg-white rounded-xl p-3 text-center border border-blue-100"><div className="text-xs text-gray-500 uppercase">Destination</div><div className="font-semibold text-sm">{bulk.masterBatch.destination}</div></div>
                                        <div className="bg-white rounded-xl p-3 text-center border border-blue-100"><div className="text-xs text-gray-500 uppercase">Weight</div><div className="font-semibold text-sm">{(bulk.masterBatch.totalWeightKg / 1000).toFixed(1)}T</div></div>
                                        <div className="bg-white rounded-xl p-3 text-center border border-blue-100"><div className="text-xs text-gray-500 uppercase">Grades</div><div className="font-semibold text-sm">{bulk.masterBatch.grades}</div></div>
                                    </div>
                                </div>

                                {/* Loop through individual batches inside the bulk shipment using the component */}
                                {bulk.batches.map((batch, idx) => (
                                    <BatchDossierCard
                                        key={batch.id}
                                        batch={batch}
                                        index={idx}
                                        total={bulk.batches.length}
                                        onShare={handleShare}
                                    />
                                ))}
                            </div>
                        ))}

                        {/* 2. SINGLE BATCHES LOOP (Standalone) */}
                        {batches.map((batch, idx) => (
                            <BatchDossierCard
                                key={batch.id}
                                batch={batch}
                                index={idx}
                                total={batches.length}
                                onShare={handleShare}
                            />
                        ))}

                        {/* Empty State */}
                        {batches.length === 0 && bulkShipments.length === 0 && (
                            <InfoCard icon={FaBox} title="No batches yet" variant="primary" showInfoBadge={false} className="text-center">
                                <Typography variant="body" className="text-gray-500">You don't have any batches assigned yet. We'll notify you when your first shipment is processed.</Typography>
                            </InfoCard>
                        )}

                    </div>

                    {/* Help */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-12">
                        <InfoCard icon={FaUser} title="Need Help?" variant="primary" showInfoBadge={false}>
                            <Typography variant="body" className="text-gray-600 mb-3 text-sm">Questions about your batches, documentation, or the portal? Our team is here to help.</Typography>
                            <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-dark-orange transition">Contact Us <FaArrowRight className="text-xs" /></Link>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default BuyerDashboard;