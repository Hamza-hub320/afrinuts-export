import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Section from "@/components/Section/Section";
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import {
    GiFarmer,
    GiFruitTree,
    GiFactory,
    GiLaurelCrown,
    GiCargoShip,
    GiCastle, GiPaperTray
} from 'react-icons/gi';
import {
    FaTree, FaIndustry, FaCertificate, FaTruck, FaBuilding,
    FaCheckCircle, FaSearch, FaMapMarkerAlt, FaClipboardList,
    FaGlobe, FaShieldAlt, FaCalendarAlt, FaFlask, FaEnvelope, FaArrowRight, FaQrcode,
    FaFileAlt, FaGlobeEurope, FaGlobeAmericas, FaGlobeAsia, FaCopy,
    FaWhatsapp, FaTwitter, FaLinkedin, FaPrint,
    FaArrowLeft, FaShare, FaChartBar, FaDownload, FaLeaf, FaBox,
    FaMobile,
    FaGlobeAfrica
} from "react-icons/fa";
import {fadeIn, staggerContainer} from "@/utils/animations";
import {Helmet} from "react-helmet-async";
import traceHeroImage from '@/assets/images/trace-hero.webp';
import JsonLd from "@/components/Seo/JsonLd";
import {trackCtaClick, trackEvent, trackOutboundClick} from "@/utils/analytics";

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
    moistureContent?: number;
    nutCount?: number;
    kernelRatio?: number;
    defectiveRate?: number;
    overallScore?: number;
    labReportUrl?: string;
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
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'journey' | 'quality' | 'documents'>('journey');

    const handleShare = async (platform?: string) => {
        const url = window.location.href;
        const text = `AfriNuts Batch Traceability: ${batch?.batchId}`;

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        } else if (platform === 'email') {
            window.location.href = `mailto:?subject=${encodeURIComponent('Batch Traceability: ' + batch?.batchId)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
        setShowShareMenu(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            // Reset batch when navigating without batchId
            if (!batchId) {
                setBatch(null);
                setLoading(false);

                // Still fetch all batches and testimonials for the promo page
                try {
                    const allResponse = await fetch('/.netlify/functions/trace');
                    const allData = await allResponse.json();
                    setAllBatches(allData.batches || []);
                } catch (error) {
                    console.error('Error fetching batch data:', error);
                }

                try {
                    const testimonialsResponse = await fetch('/.netlify/functions/blog?contentType=testimonial');
                    const testimonialsData = await testimonialsResponse.json();
                    setTestimonials(testimonialsData.posts || []);
                } catch (error) {
                    console.error('Error fetching testimonials:', error);
                }
                return;
            }

            // Fetch specific batch
            setLoading(true);
            try {
                const allResponse = await fetch('/.netlify/functions/trace');
                const allData = await allResponse.json();
                setAllBatches(allData.batches || []);

                const response = await fetch(`/.netlify/functions/trace?batchId=${encodeURIComponent(batchId)}`);
                const data = await response.json();
                setBatch(data.batch);
            } catch (error) {
                console.error('Error fetching batch data:', error);
            } finally {
                setLoading(false);
            }

            try {
                const testimonialsResponse = await fetch('/.netlify/functions/blog?contentType=testimonial');
                const testimonialsData = await testimonialsResponse.json();
                setTestimonials(testimonialsData.posts || []);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
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
            <main>
                <Section className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
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

    // ========== PROMO PAGE (no batch found) ==========
    if (!batch && !loading) {
        const promoBatchId = query.get("batchId");
        return (
            <main className="text-text-dark font-sans">
                {/* Hero */}
                <Section className="flex items-center justify-center text-center min-h-[90vh]">
                    <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                        {/* Left: Text Content */}
                        <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                                <FaSearch className="inline mr-2 text-accent" />{t('page.title')}
                            </Typography>
                            <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                                {t('promo.heading')}
                            </motion.h1>

                            {/* Lead Text */}
                            <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                                {t('promo.lead', 'Enter a batch ID to see harvest dates, GPS coordinates, quality metrics, and certification records — all pulled directly from our Farm OS. The same data our farm managers use. The same dashboard our investors see. No marketing fluff. No paperwork generated after the fact.')}
                            </Typography>

                            {/* Trace Intro Card */}
                            <motion.div variants={fadeIn} className="mb-5">
                                <InfoCard
                                    icon={FaMobile}
                                    title={t('promo.introTitle', 'Powered by Farm OS')}
                                    variant="secondary"
                                    showInfoBadge={false}
                                >
                                    <Typography variant="small" className="text-gray-600">
                                        {t('promo.subheading')}
                                    </Typography>
                                </InfoCard>
                            </motion.div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                    <FaQrcode className="text-[10px]" /> {t('promo.badgeQr', 'QR Code')}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                    <FaCheckCircle className="text-[10px]" /> {t('promo.badgeVerified', 'Farm OS Verified')}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                                    <FaGlobeAfrica className="text-[10px]" /> {t('promo.badgePublic', 'Publicly Verifiable')}
                                </span>
                            </div>

                            {/* Search Bar with Error Handling */}
                            <motion.div variants={fadeIn} className="flex flex-col items-center lg:items-start gap-3">
                                <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                                    <div className="relative bg-white/50 backdrop-blur-sm border border-gray-300 rounded-full flex items-center">
                                        <FaSearch className="absolute left-3 text-gray-400 text-xs" />
                                        <input
                                            type="text"
                                            placeholder={t('search.placeholder', 'Enter your Batch ID...')}
                                            className="pl-9 pr-20 py-2.5 bg-transparent text-sm focus:outline-none rounded-full w-56 batch-search-input"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const input = e.currentTarget.value.trim();
                                                    if (input) window.location.href = `/trace?batchId=${encodeURIComponent(input)}`;
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.querySelector<HTMLInputElement>('.batch-search-input');
                                                const value = input?.value?.trim();
                                                if (value) window.location.href = `/trace?batchId=${encodeURIComponent(value)}`;
                                            }}
                                            className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-full text-xs font-medium hover:bg-dark-orange transition-colors">
                                            {t('search.button', 'Trace')}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = '/trace?batchId=AFN-2026-001'}
                                        className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                        <FaFlask className="text-xs" />{t('demo.button', 'View Sample Batch')}
                                    </button>
                                </div>

                                {/* Error message for wrong batch ID */}
                                {promoBatchId && promoBatchId.trim() !== '' && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                                        <Typography variant="small" className="text-amber-600 bg-amber-50/80 px-4 py-2 rounded-full inline-block">
                                            {t('search.notFound', 'Batch "{id}" not found. Please check and try again.', { id: promoBatchId })}
                                        </Typography>
                                        <button
                                            onClick={() => window.location.href = '/trace?batchId=AFN-2026-001'}
                                            className="block mt-2 text-accent hover:text-primary text-sm font-medium">
                                            {t('search.trySample', 'Try our sample batch: AFN-2026-001')} →
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Right: Trace Image */}
                        <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                            <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                        whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                                <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <img src={traceHeroImage} alt="Farm OS Traceability" className="w-full h-full object-cover" />
                                <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                    <span className="text-primary text-[11px] font-semibold">Farm OS Verified</span>
                                </div>
                            </motion.div>
                        </motion.div>

                    </motion.div>
                </Section>

                <Section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-10">{t('howItWorks.title', 'How Our Traceability Works')}</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: FaQrcode, title: t('howItWorks.scan.title', '1. Scan the QR Code'), description: t('howItWorks.scan.description'), variant: 'primary' as const },
                                { icon: FaSearch, title: t('howItWorks.trace.title', '2. Enter Your Batch ID'), description: t('howItWorks.trace.description'), variant: 'accent' as const },
                                { icon: FaMapMarkerAlt, title: t('howItWorks.view.title', '3. See the Full Journey'), description: t('howItWorks.view.description'), variant: 'secondary' as const },
                            ].map((step, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <InfoCard icon={step.icon} title={step.title} iconColor="text-accent" variant={step.variant} showInfoBadge={false} className="h-full text-center">
                                        <Typography variant="small" className="text-gray-600">{step.description}</Typography>
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Why Trust Our Traceability + Wholesale CTA */}
                <Section className="py-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaShieldAlt} title={t('trust.title')} iconColor="text-accent" variant="primary" showInfoBadge={false} className="text-center">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                {[
                                    { icon: FaTree, text: t('trust.farm') },
                                    { icon: FaClipboardList, text: t('trust.batch') },
                                    { icon: FaGlobe, text: t('trust.public') },
                                    { icon: FaCertificate, text: t('trust.certs') },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-white/40 rounded-xl text-left">
                                        <item.icon className="text-accent mt-0.5 flex-shrink-0" />
                                        <Typography variant="small" className="text-gray-700">{item.text}</Typography>
                                    </div>
                                ))}
                            </div>

                            {/* Single consolidated CTA */}
                            <div className="mt-6 pt-4 border-t border-gray-200/50">
                                <Typography variant="body" className="text-gray-600 mb-4">
                                    {t('trust.ctaBody', 'Every wholesale order includes Farm OS traceability at no extra cost. Your buyers can verify origin, quality, and certifications — just like this page.')}
                                </Typography>
                                <Link to="/wholesale" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 text-sm font-medium shadow-md">
                                    <FaBox className="text-xs" />
                                    {t('trust.ctaButton', 'Explore Wholesale Options')}
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </InfoCard>
                    </div>
                </Section>
            </main>
        );
    }

    // ========== BATCH FOUND ==========
    const isPreview = !batchId;

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>{t('seo.title')}</title>
                <meta name="description" content="Enter your batch ID to see your cashew shipment's full journey — GPS coordinates, harvest date, quality metrics, and certification verification. Powered by AfriNuts Farm OS. Try AFN-2026-001." />
                <link rel="canonical" href="https://www.afrinutsexport.com/trace" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Cashew Traceability | AfriNuts Export",
                "description": "Block-level traceability from our 35-hectare farm in Odienné, Côte d'Ivoire. Custom Farm OS technology tracks every harvest.",
                "about": {
                    "@type": "Thing",
                    "name": "Farm OS Traceability System",
                    "description": "Offline-first Android application with cloud synchronization for block-level cashew tracking, quality documentation, and export verification."
                }
            }} />
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[50vh]">
                <motion.div className="max-w-3xl px-6 sm:px-8 py-12" variants={fadeIn} initial="hidden" animate="visible">
                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4"><FaQrcode className="inline mr-3 text-accent" />{t('page.title')}</Typography>
                    <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-display text-text-dark mb-6">{batch?.batchId}</Typography>
                    <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">{t('page.description')}</Typography>

                    <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="text" placeholder={t('search.placeholder', 'Enter your Batch ID...')} value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                   className="w-full pl-12 pr-20 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-dark-orange transition">
                                {t('search.button', 'Trace')}
                            </button>
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

            {/* Batch Information Card */}
            <Section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 transform-gpu overflow-hidden"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                whileHover={{ y: -5, scale: 1.01, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2">{t('batchInfo.verified', 'Verified Batch')}</Typography>
                                <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full">
                                    <FaCheckCircle className="text-primary" />
                                    <span className="font-mono text-lg font-bold text-primary">{batch?.batchId}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: t('batch.harvestDate'), value: new Date(batch?.harvestDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: FaCalendarAlt },
                                    { label: t('batch.farmLocation'), value: `${batch?.farmLocation}${batch?.block ? ` · ${batch?.block}` : ''}`, icon: FaMapMarkerAlt },
                                    { label: t('batch.destinationLocation'), value: batch?.destination, icon: FaTruck },
                                    { label: t('batch.receivingCompany'), value: batch?.buyer || '—', icon: FaBuilding },
                                ].map((item, i) => (
                                    <motion.div key={i} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                        <div className="flex items-center gap-2 mb-1"><item.icon className="text-accent text-sm" /><Typography variant="small" className="text-gray-500 font-medium">{item.label}</Typography></div>
                                        <Typography variant="body" className="font-semibold text-gray-800">{item.value}</Typography>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <motion.div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                                    <div className="flex items-center gap-2 mb-1"><FaIndustry className="text-accent text-sm" /><Typography variant="small" className="text-gray-500 font-medium">{t('batch.processingInfo')}</Typography></div>
                                    <Typography variant="body" className="font-semibold text-gray-800">{batch?.processingInfo}</Typography>
                                </motion.div>
                                <motion.div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                                    <div className="flex items-center gap-2 mb-1"><FaFlask className="text-accent text-sm" /><Typography variant="small" className="text-gray-500 font-medium">{t('batch.qualityCheckResults')}</Typography></div>
                                    <Typography variant="body" className="font-semibold text-gray-800">{batch?.qualityResults || batch?.qualityGrade || '—'}</Typography>
                                </motion.div>
                            </div>

                            {batch?.certifications && batch.certifications.length > 0 && (
                                <motion.div className="mt-5 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                                    <div className="flex items-center gap-2 mb-2"><FaCertificate className="text-accent text-sm" /><Typography variant="small" className="text-gray-500 font-medium">{t('batch.certifications')}</Typography></div>
                                    <div className="flex flex-wrap gap-2">
                                        {batch.certifications.map((cert, idx) => (
                                            <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">{cert}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <motion.div className="mt-6 flex items-center justify-center gap-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                                    batch?.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        batch?.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                            batch?.status === 'Processing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                }`}><FaCheckCircle className="text-xs" />{batch?.status}</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Action Bar */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div className="flex flex-wrap justify-between items-center gap-3 mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Link to="/trace" className="text-primary hover:text-accent flex items-center gap-2 text-sm font-medium">
                        <FaArrowLeft className="text-xs" />{t('batch.searchAnother', 'Search Another Batch')}
                    </Link>
                    <div className="flex gap-2">
                        <motion.button onClick={() => window.print()} className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium hover:bg-white/80 transition flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <FaPrint className="text-xs" />{t('batch.print', 'Print')}
                        </motion.button>
                        <div className="relative">
                            <motion.button onClick={() => setShowShareMenu(!showShareMenu)} className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-dark-orange transition flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                {copied ? <FaCheckCircle className="text-xs" /> : <FaShare className="text-xs" />}
                                {copied ? t('batch.copied', 'Copied!') : t('batch.share', 'Share')}
                            </motion.button>
                            {showShareMenu && (
                                <motion.div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                    {[
                                        { icon: FaCopy, label: t('share.copyLink', 'Copy Link'), action: () => handleShare() },
                                        { icon: FaWhatsapp, label: 'WhatsApp', action: () => handleShare('whatsapp') },
                                        { icon: FaTwitter, label: 'Twitter', action: () => handleShare('twitter') },
                                        { icon: FaLinkedin, label: 'LinkedIn', action: () => handleShare('linkedin') },
                                        { icon: FaEnvelope, label: t('share.email', 'Email'), action: () => handleShare('email') },
                                    ].map((item, i) => (
                                        <button key={i} onClick={() => {trackOutboundClick(item.label.toLowerCase(), 'share_menu');
                                                                                            item.action();
                                        }} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition">
                                            <item.icon className="text-gray-500 text-xs" />{item.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                    {[
                        { key: 'journey' as const, icon: FaMapMarkerAlt, label: t('tabs.journey', 'Journey') },
                        { key: 'quality' as const, icon: FaChartBar, label: t('tabs.quality', 'Quality') },
                        { key: 'documents' as const, icon: FaFileAlt, label: t('tabs.documents', 'Documents') },
                    ].map((tab) => (
                        <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                       className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                       whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
                            <tab.icon className="text-xs" />{tab.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'journey' && (
                <>
                    <Section className="py-8 md:py-12">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6">
                            <motion.div
                                className="text-center mb-8"
                                variants={fadeIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <Typography variant="h2" className="text-primary mb-4">
                                    {t('journey.title', "Your Order's Journey")}
                                </Typography>
                                <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">
                                    {t('journey.subtitle')}
                                </Typography>
                            </motion.div>

                            {/* Desktop: Curved SVG Path with Glass Cards */}
                            <div className="hidden md:block relative py-8">
                                {/* Curved SVG Path */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#5A7411" stopOpacity="0.3" />
                                            <stop offset="50%" stopColor="#E04E00" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#5A7411" stopOpacity="0.3" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M40,100 C200,20 300,180 500,100 C650,40 700,160 760,100"
                                        fill="none"
                                        stroke="url(#journeyGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray="8,4"
                                    />
                                </svg>

                                {/* Desktop Grid */}
                                <div className="grid grid-cols-6 gap-6 relative z-10">
                                    {[
                                        { icon: GiFruitTree, title: t('journey.farm', 'Farm'), detail: batch!.farmLocation, sub: batch!.block ? t('journey.farmDesc', { block: batch!.block, defaultValue: 'Block {block}' }) : '', color: 'primary', pos: 'md:mt-16' },
                                        { icon: GiFactory, title: t('journey.process', 'Process'), detail: batch!.processingInfo, sub: batch!.qualityGrade ? t('journey.processDesc', { grade: batch!.qualityGrade, defaultValue: 'Grade: {grade}' }) : '', color: 'accent', pos: 'md:mt-4' },
                                        { icon: FaCertificate, title: t('journey.certify', 'Certify'), detail: batch!.certifications?.[0] || '', sub: t('journey.certifyDesc', { count: batch!.certifications?.length || 0, defaultValue: '{count} verified' }), color: 'primary', pos: 'md:mt-20' },
                                        { icon: GiCargoShip, title: t('journey.ship', 'Ship'), detail: t('journey.shipDesc', 'Via Abidjan Port'), sub: batch!.destination, color: 'accent', pos: 'md:mt-2' },
                                        { icon: FaBuilding, title: t('journey.deliver', 'Deliver'), detail: batch!.buyer || batch!.destination, sub: batch!.status === 'Delivered' ? '✓ Delivered' : 'In Transit', color: 'primary', pos: 'md:mt-14' },
                                        { icon: FaFileAlt, title: t('journey.docs', 'Docs'), detail: t('journey.docsDetail', 'Export Ready'), sub: t('journey.docsDesc', 'COO, Phyto, B/L'), color: 'accent', pos: 'md:mt-6' },
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            className={`relative flex flex-col items-center text-center group ${step.pos}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.15 }}
                                        >
                                            {/* Connection dot */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent shadow-md" />

                                            {/* Glass morphism circle */}
                                            <motion.div
                                                className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3 z-10 border-3 bg-white/80 backdrop-blur-sm transform-gpu group/step"
                                                style={{
                                                    borderColor: i % 2 === 0 ? '#5A7411' : '#E04E00',
                                                    transformStyle: 'preserve-3d',
                                                    perspective: '1000px'
                                                }}
                                                whileHover={{ scale: 1.15, rotate: 5 }}
                                            >
                                                <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover/step:translate-z-[-6px] transition-all duration-500" />
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover/step:opacity-70 transition-opacity duration-300" />
                                                <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_4px_rgba(0,0,0,0.08)]" />
                                                <step.icon className="text-2xl relative z-10" style={{ color: i % 2 === 0 ? '#5A7411' : '#E04E00' }} />
                                            </motion.div>

                                            {/* Step number badge */}
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow z-20"
                                                 style={{ background: i % 2 === 0 ? '#5A7411' : '#E04E00' }}>
                                                {i + 1}
                                            </div>

                                            {/* Content */}
                                            <Typography variant="small" className="font-bold text-primary leading-tight">{step.title}</Typography>
                                            <Typography variant="small" className="text-gray-600 text-xs leading-tight mt-0.5 line-clamp-2">{step.detail}</Typography>
                                            <Typography variant="small" className="text-gray-400 text-[10px] leading-tight line-clamp-1">{step.sub}</Typography>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile: Interactive Swipeable Timeline */}
                            <div className="md:hidden relative">
                                {/* Mobile curved path */}
                                <svg className="absolute top-16 left-0 w-full h-32" viewBox="0 0 400 120" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="mobileJourneyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#5A7411" stopOpacity="0.2" />
                                            <stop offset="25%" stopColor="#E04E00" stopOpacity="0.35" />
                                            <stop offset="50%" stopColor="#5A7411" stopOpacity="0.2" />
                                            <stop offset="75%" stopColor="#E04E00" stopOpacity="0.35" />
                                            <stop offset="100%" stopColor="#5A7411" stopOpacity="0.2" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M10,90 C60,10 100,70 150,40 C200,10 240,80 290,30 C330,-10 370,60 390,20"
                                        fill="none"
                                        stroke="url(#mobileJourneyGradient)"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeDasharray="6,3"
                                    />
                                </svg>

                                {/* Swipe hint */}
                                <motion.div
                                    className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <FaArrowLeft className="text-[10px] animate-pulse" />
                                    <span className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
                            {t('journey.scrollHint', 'Swipe to explore the journey')}
                        </span>
                                    <FaArrowRight className="text-[10px] animate-pulse" />
                                </motion.div>

                                {/* Horizontal scroll container */}
                                <div
                                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 scrollbar-hide"
                                    style={{
                                        scrollSnapType: 'x mandatory',
                                        WebkitOverflowScrolling: 'touch',
                                        scrollBehavior: 'smooth'
                                    }}
                                >
                                    {[
                                        { icon: GiFruitTree, title: t('journey.farm', 'Farm'), detail: batch!.farmLocation, sub: batch!.block ? t('journey.farmDesc', { block: batch!.block, defaultValue: 'Block {block}' }) : '', color: 'primary', pos: 'md:mt-16' },
                                        { icon: GiFactory, title: t('journey.process', 'Process'), detail: batch!.processingInfo, sub: batch!.qualityGrade ? t('journey.processDesc', { grade: batch!.qualityGrade, defaultValue: 'Grade: {grade}' }) : '', color: 'accent', pos: 'md:mt-4' },
                                        { icon: FaCertificate, title: t('journey.certify', 'Certify'), detail: batch!.certifications?.[0] || '', sub: t('journey.certifyDesc', { count: batch!.certifications?.length || 0, defaultValue: '{count} verified' }), color: 'primary', pos: 'md:mt-20' },
                                        { icon: GiCargoShip, title: t('journey.ship', 'Ship'), detail: t('journey.shipDesc', 'Via Abidjan Port'), sub: batch!.destination, color: 'accent', pos: 'md:mt-2' },
                                        { icon: FaBuilding, title: t('journey.deliver', 'Deliver'), detail: batch!.buyer || batch!.destination, sub: batch!.status === 'Delivered' ? '✓ Delivered' : 'In Transit', color: 'primary', pos: 'md:mt-14' },
                                        { icon: FaFileAlt, title: t('journey.docs', 'Docs'), detail: t('journey.docsDetail', 'Export Ready'), sub: t('journey.docsDesc', 'COO, Phyto, B/L'), color: 'accent', pos: 'md:mt-6' },
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            className="snap-center flex-shrink-0 w-[160px] flex flex-col items-center text-center relative"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            {/* Connector dot */}
                                            <div className={`w-3 h-3 rounded-full mb-3 shadow-md ${
                                                i % 2 === 0 ? 'bg-primary/60' : 'bg-accent/60'
                                            }`} />

                                            {/* Glass morphism circle */}
                                            <motion.div
                                                className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4 z-10 border-3 bg-white/80 backdrop-blur-sm"
                                                style={{
                                                    borderColor: i % 2 === 0 ? '#5A7411' : '#E04E00',
                                                    transformStyle: 'preserve-3d',
                                                    perspective: '1000px'
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {/* 3D edge effect */}
                                                <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px]" />

                                                {/* Glassy overlay */}
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />

                                                {/* Inner shadow */}
                                                <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_4px_rgba(0,0,0,0.08)]" />

                                                <step.icon className="text-xl relative z-10" style={{ color: i % 2 === 0 ? '#5A7411' : '#E04E00' }} />
                                            </motion.div>

                                            {/* Step number badge */}
                                            <div className="absolute top-8 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-20 border-2 border-white"
                                                 style={{ background: i % 2 === 0 ? '#5A7411' : '#E04E00' }}>
                                                {i + 1}
                                            </div>

                                            {/* Content card with glass effect */}
                                            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 w-full border border-white/30 shadow-sm">
                                                <Typography variant="small" className="font-bold text-primary leading-tight text-sm">
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-600 text-[11px] leading-tight mt-1 line-clamp-2">
                                                    {step.detail}
                                                </Typography>
                                                {step.sub && (
                                                    <Typography variant="small" className="text-gray-400 text-[10px] leading-tight mt-1 line-clamp-1">
                                                        {step.sub}
                                                    </Typography>
                                                )}
                                            </div>

                                            {/* Progress arrow (except last) */}
                                            {i < 5 && (
                                                <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                                                    <FaArrowRight className="text-gray-300 text-sm" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Dot indicators */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                        <motion.div
                                            key={i}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                i % 2 === 0 ? 'bg-primary/60' : 'bg-accent/60'
                                            }`}
                                            whileHover={{ scale: 1.5 }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                        />
                                    ))}
                                </div>

                                {/* Step counter */}
                                <div className="text-center mt-3">
                                    <Typography variant="small" className="text-gray-400 text-xs">
                                        {t('journey.steps', '6 steps from farm to delivery')}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Trust Section */}
                    <div className="max-w-2xl mx-auto px-4 sm:px-6">
                        <motion.div
                            className="mt-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                        >
                            <InfoCard
                                icon={FaShieldAlt}
                                title={t('trust.title', 'How We Verify Traceability')}
                                iconColor="text-accent"
                                variant="primary"
                                showInfoBadge={false}
                                className="text-center"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                                    {[
                                        { icon: FaMapMarkerAlt, title: t('trust.origin', 'Origin Verified'), desc: t('trust.originDesc') },
                                        { icon: FaClipboardList, title: t('trust.batch', 'Batch Recorded'), desc: t('trust.batchDesc') },
                                        { icon: FaGlobe, title: t('trust.transparent', 'Publicly Visible'), desc: t('trust.transparentDesc') },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30"
                                            whileHover={{ y: -2, scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <item.icon className="text-accent text-xl mx-auto mb-2" />
                                            <Typography variant="small" className="font-semibold text-gray-800">{item.title}</Typography>
                                            <Typography variant="small" className="text-gray-500 text-xs mt-1">{item.desc}</Typography>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    className="mt-6 pt-4 border-t border-gray-200/50"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                >
                                    <Typography variant="small" className="text-gray-500 mb-2">
                                        {t('compliance.description')}
                                    </Typography>
                                    <a
                                        href="/documents/compliance-pack.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-accent hover:text-primary font-medium text-sm transition-colors"
                                    >
                                        <FaFileAlt className="text-xs" />
                                        {t('compliance.link', 'Download Compliance Pack')}
                                    </a>
                                </motion.div>
                            </InfoCard>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            className="mt-6 text-center"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <Typography variant="small" className="text-gray-500 mb-3">
                                {t('ctaQuote.description')}
                            </Typography>
                            <button onClick={() => {
                                trackCtaClick('request_traceable_batch', 'trace_cta');
                                navigate('/contact?type=wholesale');
                            }} className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 text-sm font-medium shadow-md">

                                <FaEnvelope className="text-xs" />
                                {t('ctaQuote.button', 'Request a Traceable Batch')}
                            </button>
                        </motion.div>
                    </div>
                </>
            )}

            {activeTab === 'quality' && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
                    {batch?.overallScore ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Quality Metrics Card */}
                            <InfoCard
                                icon={FaChartBar}
                                title={t('quality.metrics', 'Quality Metrics')}
                                iconColor="text-accent"
                                variant="primary"
                                showInfoBadge={false}
                                className="h-full"
                            >
                                <div className="space-y-4 mt-3">
                                    {[
                                        { label: t('quality.moisture'), value: batch.moistureContent, unit: '%', max: 10, color: 'bg-primary', textColor: 'text-primary', bgLight: 'bg-primary/10' },
                                        { label: t('quality.nutCount'), value: batch.nutCount, unit: '', max: 200, color: 'bg-secondary', textColor: 'text-secondary', bgLight: 'bg-secondary/10' },
                                        { label: t('quality.kernelRatio'), value: batch.kernelRatio, unit: '%', max: 55, color: 'bg-accent', textColor: 'text-accent', bgLight: 'bg-accent/10' },
                                        { label: t('quality.defectiveRate'), value: batch.defectiveRate, unit: '%', max: 10, color: 'bg-dark-orange', textColor: 'text-dark-orange', bgLight: 'bg-dark-orange/10' },
                                    ].filter(m => m.value != null).map((metric, i) => (
                                        <div key={i} className={`${metric.bgLight} rounded-xl p-3 border border-white/30`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <Typography variant="small" className="text-gray-700 font-medium">{metric.label}</Typography>
                                                <Typography variant="small" className={`font-bold ${metric.textColor}`}>{metric.value}{metric.unit}</Typography>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <motion.div
                                                    className={`h-2 rounded-full ${metric.color}`}
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${Math.min((metric.value! / metric.max) * 100, 100)}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: i * 0.2 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {batch.overallScore && (
                                    <div className="mt-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 text-center">
                                        <Typography variant="h3" className="font-bold text-primary">{batch.overallScore}%</Typography>
                                        <Typography variant="small" className="text-gray-500">{t('quality.overallScore')}</Typography>
                                    </div>
                                )}
                            </InfoCard>

                            {/* Certifications Card */}
                            <InfoCard
                                icon={FaCertificate}
                                title={t('batch.certifications')}
                                iconColor="text-accent"
                                variant="accent"
                                showInfoBadge={false}
                                className="h-full"
                            >
                                <div className="space-y-3 mt-3">
                                    {batch.certifications?.map((cert, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-white/40 rounded-xl p-3">
                                            <FaCertificate className="text-accent" />
                                            <div>
                                                <Typography variant="small" className="font-medium text-gray-800">{cert}</Typography>
                                                <Typography variant="small" className="text-green-600 text-xs flex items-center gap-1">
                                                    <FaCheckCircle className="text-[10px]" /> Verified
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </InfoCard>
                        </div>
                    ) : (
                        <InfoCard
                            icon={FaChartBar}
                            title={t('quality.comingSoon', 'Quality Metrics Coming Soon')}
                            iconColor="text-accent"
                            variant="primary"
                            showInfoBadge={false}
                            className="text-center py-12"
                        >
                            <Typography variant="body" className="text-gray-400 max-w-md mx-auto">
                                {t('quality.comingSoonDesc')}
                            </Typography>
                        </InfoCard>
                    )}
                </div>
            )}

            {activeTab === 'documents' && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: t('docs.coo'), icon: FaFileAlt, variant: 'primary' as const },
                            { title: t('docs.phyto'), icon: FaLeaf, variant: 'accent' as const },
                            { title: t('docs.billOfLading'), icon: FaTruck, variant: 'secondary' as const },
                            { title: t('docs.packingList'), icon: FaBox, variant: 'primary' as const },
                            { title: t('docs.invoice'), icon: FaFileAlt, variant: 'accent' as const },
                            { title: t('docs.insurance'), icon: FaShieldAlt, variant: 'secondary' as const },
                        ].map((doc, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                                <InfoCard
                                    icon={doc.icon}
                                    title={doc.title}
                                    subtitle={t('docs.available', 'Available')}
                                    iconColor="text-accent"
                                    variant={doc.variant}
                                    showInfoBadge={false}
                                    className="h-full"
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Compliance Pack CTA */}
                    <Section className="py-10">
                        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                            <InfoCard
                                icon={FaFileAlt}
                                title={t('docs.compliancePack', 'Download Complete Compliance Pack')}
                                iconColor="text-accent"
                                variant="primary"
                                className="text-center"
                            >
                                <Typography variant="body" className="text-gray-600 mb-6">
                                    {t('docs.compliancePackDesc', 'All documents in one file for easy sharing with customs and regulators')}
                                </Typography>
                                <a href="/documents/compliance-pack.pdf" target="_blank" rel="noopener noreferrer"
                                   className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full inline-flex items-center gap-2 font-medium shadow-md">
                                    <FaDownload className="text-sm" />
                                    {t('docs.downloadAll', 'Download All')}
                                </a>
                            </InfoCard>
                        </div>
                    </Section>
                </div>
            )}

            {/* B2B Testimonials */}
            {testimonials.length > 0 && (
                <Section className="py-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-8">{t('testimonials.title', 'Trusted by Importers Worldwide')}</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((item, i) => {
                                const regionIcons: Record<string, any> = { 'Europe': FaGlobeEurope, 'North America': FaGlobeAmericas, 'Middle East': FaGlobeAsia, 'Asia': FaGlobeAsia, 'Africa': FaGlobe };
                                const variants: Array<'primary' | 'accent' | 'secondary'> = ['primary', 'accent', 'secondary'];
                                return (
                                    <motion.div key={item.id || i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                        <InfoCard icon={regionIcons[item.region] || FaGlobe} title={item.buyerName} subtitle={`${item.company || item.region}, ${item.verified ? 'Verified Buyer' : ''}`} iconColor="text-accent" variant={variants[i % 3]} showInfoBadge={false} className="h-full text-center">
                                            <Typography variant="body" className="text-gray-600 italic mt-2">"{item.quote}"</Typography>
                                        </InfoCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </Section>
            )}

            {/* Final CTA */}
            <Section className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <InfoCard icon={FaMapMarkerAlt} title={t('cta.title')} iconColor="text-accent" variant="primary" showInfoBadge={false} className="text-center">
                        <Typography variant="body" className="text-gray-600 mb-6">{t('cta.subtitle')}</Typography>
                        <button onClick={() => {
                            trackCtaClick('contact_us', 'trace_cta');
                            navigate('/contact');
                        }} className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full inline-flex items-center gap-2 font-medium shadow-md">
                            {t('cta.button')}
                        </button>
                    </InfoCard>
                </div>
            </Section>
        </main>
    );
};

export default TracePage;