import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Section from "@/components/Section/Section";
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import {
    FaTree, FaIndustry, FaCertificate, FaTruck, FaBuilding,
    FaCheckCircle, FaArrowDown, FaSearch, FaMapMarkerAlt
} from "react-icons/fa";
import { fadeIn } from "@/utils/animations";

interface BatchData {
    id: string;
    batchId: string;
    harvestDate: string;
    farmLocation: string;
    block?: string;
    processingInfo: string;
    certifications: string[];
    qualityGrade?: string;
    qualityResults?: string;
    destination: string;
    buyer?: string;
    status: string;
    slug: string;
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const TracePage: React.FC = () => {
    const { t } = useTranslation("trace");
    const query = useQuery();
    const batchId = query.get("batchId");
    const navigate = useNavigate();

    const [batch, setBatch] = useState<BatchData | null>(null);
    const [allBatches, setAllBatches] = useState<BatchData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all batches for the preview grid
                const allResponse = await fetch('/.netlify/functions/trace');
                const allData = await allResponse.json();
                setAllBatches(allData.batches || []);

                // Fetch specific batch if batchId is in URL
                if (batchId) {
                    const response = await fetch(`/.netlify/functions/trace?batchId=${encodeURIComponent(batchId)}`);
                    const data = await response.json();
                    setBatch(data.batch);
                } else if (allData.batches?.length > 0) {
                    setBatch(allData.batches[0]);
                }
            } catch (error) {
                console.error('Error fetching batch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [batchId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/trace?batchId=${encodeURIComponent(searchInput.trim())}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-[72px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="min-h-screen pt-[72px]">
                <Section className="text-center py-20">
                    <Typography variant="h2" className="text-primary mb-4">
                        {t('notFound.title', 'Batch Not Found')}
                    </Typography>
                    <Typography variant="body" className="text-gray-600 mb-6">
                        {t('notFound.description', 'The batch ID you entered was not found. Please check and try again.')}
                    </Typography>
                    <Link to="/trace" className="text-primary hover:text-accent">
                        {t('notFound.backLink', '← Back to Traceability')}
                    </Link>
                </Section>
            </div>
        );
    }

    const isPreview = !batchId;

    return (
        <main className="text-text-dark font-sans">
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[40vh] bg-gradient-to-b from-primary/10 to-transparent">
                <motion.div className="max-w-3xl px-6 sm:px-8 py-12" variants={fadeIn} initial="hidden" animate="visible">
                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                        {t('page.title')}
                    </Typography>
                    <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-display text-text-dark mb-6">
                        {batch.batchId}
                    </Typography>
                    <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">
                        {t('page.description')}
                    </Typography>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search.placeholder', 'Enter Batch ID...')}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </form>

                    {isPreview && (
                        <motion.div className="bg-amber-50/80 text-amber-700 px-4 py-2 rounded-full mt-4 inline-block text-sm border border-amber-200"
                                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
                            {t('batch.previewNotice')}
                        </motion.div>
                    )}
                </motion.div>
            </Section>

            {/* Farm-to-Fork Journey Map */}
            <Section className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-12" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <Typography variant="h2" className="text-primary mb-4">
                            {t('journey.title', "Your Order's Journey")}
                        </Typography>
                        <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">
                            {t('journey.subtitle', 'Follow your cashews from our farm in Odienné to your doorstep.')}
                        </Typography>
                    </motion.div>

                    <div className="relative">
                        <div className="hidden md:block absolute left-0 right-0 top-12 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-30 rounded-full" />

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2">
                            {[
                                { icon: FaTree, title: t('journey.farm', 'Farm'), detail: batch.farmLocation, description: batch.block ? t('journey.farmDesc', 'Block {block}', { block: batch.block }) : '', color: 'primary' },
                                { icon: FaIndustry, title: t('journey.process', 'Process'), detail: batch.processingInfo, description: batch.qualityGrade ? t('journey.processDesc', 'Grade: {grade}', { grade: batch.qualityGrade }) : '', color: 'accent' },
                                { icon: FaCertificate, title: t('journey.certify', 'Certify'), detail: batch.certifications?.join(', ') || '', description: t('journey.certifyDesc', '{count} certifications', { count: batch.certifications?.length || 0 }), color: 'primary' },
                                { icon: FaTruck, title: t('journey.ship', 'Ship'), detail: batch.destination, description: t('journey.shipDesc', 'Via Abidjan Port'), color: 'accent' },
                                { icon: FaBuilding, title: t('journey.deliver', 'Deliver'), detail: batch.buyer || batch.destination, description: batch.status === 'Delivered' ? t('journey.delivered', 'Delivered') : t('journey.inTransit', 'In Transit'), color: 'primary' },
                            ].map((step, i) => (
                                <motion.div key={i} className="relative flex flex-col items-center text-center group"
                                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                                    <motion.div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg mb-4 z-10 border-4 ${step.color === 'primary' ? 'bg-primary/10 border-primary text-primary' : 'bg-accent/10 border-accent text-accent'}`}
                                                whileHover={{ scale: 1.1, rotate: 5 }}>
                                        <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                                        <step.icon className="text-2xl relative z-10" />
                                    </motion.div>
                                    <div className={`absolute top-0 right-0 md:right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${step.color === 'primary' ? 'bg-primary' : 'bg-accent'}`}>{i + 1}</div>
                                    <Typography variant="h5" className="font-bold text-primary mb-1">{step.title}</Typography>
                                    <Typography variant="small" className="text-gray-600 font-medium mb-1">{step.detail}</Typography>
                                    <Typography variant="small" className="text-gray-400 text-xs">{step.description}</Typography>
                                    {i < 4 && <div className="md:hidden flex justify-center my-2"><FaArrowDown className="text-primary/40" /></div>}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Batch Info Summary Card */}
                    <motion.div className="mt-12 relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 max-w-2xl mx-auto"
                                variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20" />
                        <div className="relative z-10">
                            <Typography variant="h4" className="text-primary mb-4 text-center">
                                {t('batchSummary.title', 'Batch Verification')}
                            </Typography>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500">{t('batchSummary.batchId', 'Batch ID')}:</span><span className="font-mono font-bold text-primary ml-2">{batch.batchId}</span></div>
                                <div><span className="text-gray-500">{t('batchSummary.harvestDate', 'Harvested')}:</span><span className="font-medium ml-2">{new Date(batch.harvestDate).toLocaleDateString()}</span></div>
                                <div><span className="text-gray-500">{t('batchSummary.quality', 'Quality')}:</span><span className="font-medium ml-2">{batch.qualityResults || batch.qualityGrade || '—'}</span></div>
                                <div>
                                    <span className="text-gray-500">{t('batchSummary.status', 'Status')}:</span>
                                    <span className={`font-medium ml-2 flex items-center gap-1 ${batch.status === 'Delivered' ? 'text-green-600' : 'text-amber-600'}`}>
                                        <FaCheckCircle className="text-xs" />
                                        {batch.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* All Batches Grid */}
            {allBatches.length > 1 && (
                <Section className="py-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Typography variant="h3" className="text-2xl font-bold text-primary mb-6 text-center">
                            {t('batch.previewAllBatches')}
                        </Typography>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {allBatches.map((b, index) => (
                                <motion.button key={b.batchId}
                                               onClick={() => navigate(`/trace?batchId=${b.batchId}`)}
                                               className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col items-center text-center group"
                                               whileHover={{ y: -5, scale: 1.03 }}
                                               initial={{ opacity: 0, y: 20 }}
                                               whileInView={{ opacity: 1, y: 0 }}
                                               viewport={{ once: true }}
                                               transition={{ duration: 0.4, delay: 0.1 * index }}>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent opacity-50 group-hover:opacity-70" />
                                    <div className="relative z-10">
                                        <Typography variant="h5" className="font-bold text-primary mb-2">{b.batchId}</Typography>
                                        <Typography variant="body-sm" className="text-gray-700">{new Date(b.harvestDate).toLocaleDateString()}</Typography>
                                        <Typography variant="body-sm" className="text-gray-500 mt-1">{b.farmLocation}</Typography>
                                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${b.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </Section>
            )}

            {/* CTA */}
            <Section className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <InfoCard icon={FaMapMarkerAlt} title={t('cta.title')} iconColor="text-accent" variant="primary" showInfoBadge={false} className="text-center">
                        <Typography variant="body" className="text-gray-600 mb-6">{t('cta.subtitle')}</Typography>
                        <Link to="/contact" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full inline-flex items-center gap-2 font-medium shadow-md">
                            {t('cta.button')}
                        </Link>
                    </InfoCard>
                </div>
            </Section>
        </main>
    );
};

export default TracePage;