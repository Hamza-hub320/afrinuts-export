import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Section from "@/components/Section/Section";
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import {
    FaTree, FaIndustry, FaCertificate, FaTruck, FaBuilding,
    FaCheckCircle, FaArrowDown, FaSearch, FaMapMarkerAlt, FaClipboardList,
    FaGlobe, FaShieldAlt, FaCalendarAlt, FaFlask, FaEnvelope, FaArrowRight, FaQrcode,
    FaFileAlt, FaGlobeEurope, FaGlobeAmericas, FaGlobeAsia
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

    if (!batch && !loading) {
        return (
            <main className="text-text-dark font-sans min-h-screen pt-[72px]">
                {/* Hero */}
                <Section className="flex items-center justify-center text-center min-h-[40vh]">
                    <motion.div className="max-w-3xl px-6 sm:px-8 py-12" variants={fadeIn} initial="hidden" animate="visible">
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            {t('page.title')}
                        </Typography>
                        <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-display text-text-dark mb-6">
                            {t('promo.heading', 'Audit-Ready Traceability for Serious Importers')}
                        </Typography>
                        <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">
                            {t('promo.subheading', 'Every AfriNuts shipment comes with a unique traceability code. Scan your QR code or enter your batch ID to see the full journey — from our farm to your doorstep.')}
                        </Typography>
                    </motion.div>
                </Section>

                {/* Search Bar */}
                <Section className="py-8">
                    <div className="max-w-xl mx-auto px-4 sm:px-6">
                        <form onSubmit={handleSearch} className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('search.placeholder', 'Enter your Batch ID...')}
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-300 bg-white/70 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                            />
                            <button type="submit" className="absolute right-2 top-1.5 bg-primary text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-dark-orange transition">
                                {t('search.button', 'Trace')}
                            </button>
                        </form>
                        {batchId && (
                            <motion.div className="mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Typography variant="small" className="text-amber-600 bg-amber-50/80 px-4 py-2 rounded-full inline-block">
                                    {t('search.notFound', 'Batch "{id}" not found. Please check and try again.', { id: batchId })}
                                </Typography>
                            </motion.div>
                        )}
                    </div>
                    {/* Demo CTA */}
                    <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                        <Typography variant="small" className="text-gray-500 mb-3">
                            {t('demo.note', 'Try it yourself — enter AFN-2026-001 in the search box above')}
                        </Typography>
                        <button
                            onClick={() => {
                                setSearchInput('AFN-2026-001');
                                navigate('/trace?batchId=AFN-2026-001');
                            }}
                            className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 text-sm font-medium bg-white/30 backdrop-blur-sm transition-all"
                        >
                            <FaSearch className="text-sm" />
                            {t('demo.button', 'View Sample Batch')}
                        </button>
                    </motion.div>
                </Section>

                {/* How It Works */}
                <Section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-10">
                            {t('howItWorks.title', 'How Our Traceability Works')}
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: FaQrcode,
                                    title: t('howItWorks.scan.title', '1. Scan the QR Code'),
                                    description: t('howItWorks.scan.description', 'Every product bag or container includes a unique QR code linked to its batch.'),
                                    variant: 'primary' as const,
                                },
                                {
                                    icon: FaSearch,
                                    title: t('howItWorks.trace.title', '2. Enter Your Batch ID'),
                                    description: t('howItWorks.trace.description', 'Or type your batch ID above to pull up your order\'s complete journey.'),
                                    variant: 'accent' as const,
                                },
                                {
                                    icon: FaMapMarkerAlt,
                                    title: t('howItWorks.view.title', '3. See the Full Journey'),
                                    description: t('howItWorks.view.description', 'From the exact block in Odienné to processing, certification, and delivery.'),
                                    variant: 'secondary' as const,
                                },
                            ].map((step, i) => (
                                <motion.div key={i}
                                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                    <InfoCard
                                        icon={step.icon}
                                        title={step.title}
                                        iconColor="text-accent"
                                        variant={step.variant}
                                        showInfoBadge={false}
                                        className="h-full text-center"
                                    >
                                        <Typography variant="small" className="text-gray-600">{step.description}</Typography>
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Trust Signals */}
                <Section className="py-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <InfoCard
                            icon={FaShieldAlt}
                            title={t('trust.title', 'Why You Can Trust Our Traceability')}
                            iconColor="text-accent"
                            variant="primary"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                {[
                                    { icon: FaTree, text: t('trust.farm', 'Single-origin from our 35-hectare farm in Odienné, Ivory Coast') },
                                    { icon: FaClipboardList, text: t('trust.batch', 'Unique batch IDs tracked from harvest through delivery') },
                                    { icon: FaGlobe, text: t('trust.public', 'Publicly verifiable — anyone with the batch ID can check') },
                                    { icon: FaCertificate, text: t('trust.certs', 'Certifications verified and displayed per batch') },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-white/40 rounded-xl text-left">
                                        <item.icon className="text-accent mt-0.5 flex-shrink-0" />
                                        <Typography variant="small" className="text-gray-700">{item.text}</Typography>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>
                    </div>
                </Section>

                {/* CTA */}
                <Section className="py-12">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                        <InfoCard
                            icon={FaEnvelope}
                            title={t('promoCta.title', 'Want This for Your Orders?')}
                            iconColor="text-accent"
                            variant="primary"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <Typography variant="body" className="text-gray-600 mb-6">
                                {t('promoCta.description', 'Every wholesale order from AfriNuts Export includes traceability. Contact us to place your first order and experience full supply chain transparency.')}
                            </Typography>
                            <Link to="/contact" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full inline-flex items-center gap-2 font-medium shadow-md">
                                {t('promoCta.button', 'Request a Quote')}
                                <FaArrowRight />
                            </Link>
                        </InfoCard>
                    </div>
                </Section>
            </main>
        );
    }

    const isPreview = !batchId;

    return (
        <main className="text-text-dark font-sans">
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[40vh]">
                <motion.div className="max-w-3xl px-6 sm:px-8 py-12" variants={fadeIn} initial="hidden" animate="visible">
                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                        {t('page.title')}
                    </Typography>
                    <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-display text-text-dark mb-6">
                        {batch?.batchId}
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
                            {t('batch?.previewNotice')}
                        </motion.div>
                    )}
                </motion.div>
            </Section>

            {/* Batch Information & Trust Section */}
            <Section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 transform-gpu overflow-hidden"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                        whileHover={{ y: -5, scale: 1.01, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', transition: { duration: 0.3 } }}
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            {/* Header with Batch ID */}
                            <div className="text-center mb-8">
                                <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2">
                                    {t('batchInfo.verified', 'Verified Batch')}
                                </Typography>
                                <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full">
                                    <FaCheckCircle className="text-primary" />
                                    <span className="font-mono text-lg font-bold text-primary">{batch?.batchId}</span>
                                </div>
                            </div>

                            {/* Two Column Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: t('batch.harvestDate'), value: new Date(batch?.harvestDate || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: FaCalendarAlt },
                                    { label: t('batch?.farmLocation'), value: `${batch?.farmLocation}${batch?.block ? ` · ${batch?.block}` : ''}`, icon: FaMapMarkerAlt },
                                    { label: t('batch?.destinationLocation'), value: batch?.destination, icon: FaTruck },
                                    { label: t('batch?.receivingCompany'), value: batch?.buyer || '—', icon: FaBuilding },
                                ].map((item, i) => (
                                    <motion.div key={i}
                                                className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <item.icon className="text-accent text-sm" />
                                            <Typography variant="small" className="text-gray-500 font-medium">{item.label}</Typography>
                                        </div>
                                        <Typography variant="body" className="font-semibold text-gray-800">{item.value}</Typography>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Processing & Quality Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                <motion.div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaIndustry className="text-accent text-sm" />
                                        <Typography variant="small" className="text-gray-500 font-medium">{t('batch?.processingInfo')}</Typography>
                                    </div>
                                    <Typography variant="body" className="font-semibold text-gray-800">{batch?.processingInfo}</Typography>
                                </motion.div>
                                <motion.div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <FaFlask className="text-accent text-sm" />
                                        <Typography variant="small" className="text-gray-500 font-medium">{t('batch?.qualityCheckResults')}</Typography>
                                    </div>
                                    <Typography variant="body" className="font-semibold text-gray-800">{batch?.qualityResults || batch?.qualityGrade || '—'}</Typography>
                                </motion.div>
                            </div>

                            {/* Certifications */}
                            {batch?.certifications && batch?.certifications.length > 0 && (
                                <motion.div className="mt-5 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaCertificate className="text-accent text-sm" />
                                        <Typography variant="small" className="text-gray-500 font-medium">{t('batch?.certifications')}</Typography>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {batch?.certifications.map((cert, idx) => (
                                            <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                                    {cert}
                                </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Status Bar */}
                            <motion.div className="mt-6 flex items-center justify-center gap-3"
                                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                        batch?.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            batch?.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                batch?.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                                    'bg-gray-100 text-gray-600'
                    }`}>
                        <FaCheckCircle className="text-xs" />
                        {batch?.status}
                    </span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Farm-to-Fork Curved Journey Map */}
                    <Section className="py-16">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6">
                            <motion.div className="text-center mb-8" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                <Typography variant="h2" className="text-primary mb-4">
                                    {t('journey.title', "Your Order's Journey")}
                                </Typography>
                                <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">
                                    {t('journey.subtitle', 'Follow your cashews from our farm in Odienné to your doorstep.')}
                                </Typography>
                            </motion.div>

                            {/* Curved Path Container */}
                            <div className="relative py-8">
                                {/* Curved SVG Path */}
                                <svg className="absolute inset-0 w-full h-full hidden md:block" viewBox="0 0 800 200" preserveAspectRatio="none">
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

                                {/* Journey Steps */}
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
                                    {[
                                        { icon: FaTree, title: t('journey.farm', 'Farm'), detail: batch!.farmLocation, sub: batch!.block ? t('journey.farmDesc', 'Block {block}', { block: batch!.block }) : '', pos: 'md:mt-16' },
                                        { icon: FaIndustry, title: t('journey.process', 'Process'), detail: batch!.processingInfo, sub: batch!.qualityGrade ? t('journey.processDesc', 'Grade: {grade}', { grade: batch!.qualityGrade }) : '', pos: 'md:mt-4' },
                                        { icon: FaCertificate, title: t('journey.certify', 'Certify'), detail: batch!.certifications?.[0] || '', sub: t('journey.certifyDesc', '{count} verified', { count: batch!.certifications?.length || 0 }), pos: 'md:mt-20' },
                                        { icon: FaTruck, title: t('journey.ship', 'Ship'), detail: t('journey.shipDesc', 'Via Abidjan Port'), sub: batch!.destination, pos: 'md:mt-2' },
                                        { icon: FaBuilding, title: t('journey.deliver', 'Deliver'), detail: batch!.buyer || batch!.destination, sub: batch!.status === 'Delivered' ? '✓ Delivered' : 'In Transit', pos: 'md:mt-14' },
                                        { icon: FaFileAlt, title: t('journey.docs', 'Docs'), detail: t('journey.docsDetail', 'Export Ready'), sub: t('journey.docsDesc', 'COO, Phyto, B/L'), pos: 'md:mt-6' },
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            className={`relative flex flex-col items-center text-center group ${step.pos}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.15 }}
                                        >
                                            {/* Curved connector dot */}
                                            <div className="hidden md:block absolute -top-8 left-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent shadow-md" />

                                            {/* Step circle */}
                                            <motion.div
                                                className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg mb-3 z-10 border-3 bg-white/80 backdrop-blur-sm"
                                                style={{ borderColor: i % 2 === 0 ? '#5A7411' : '#E04E00' }}
                                                whileHover={{ scale: 1.15, rotate: 5 }}
                                            >
                                                <step.icon className="text-xl md:text-2xl" style={{ color: i % 2 === 0 ? '#5A7411' : '#E04E00' }} />
                                            </motion.div>

                                            {/* Step number */}
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow"
                                                 style={{ background: i % 2 === 0 ? '#5A7411' : '#E04E00' }}>
                                                {i + 1}
                                            </div>

                                            {/* Content */}
                                            <Typography variant="small" className="font-bold text-primary leading-tight">{step.title}</Typography>
                                            <Typography variant="small" className="text-gray-600 text-xs leading-tight mt-0.5">{step.detail}</Typography>
                                            <Typography variant="small" className="text-gray-400 text-[10px] leading-tight">{step.sub}</Typography>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile - Vertical connector line */}
                                <div className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30" />
                            </div>
                        </div>
                    </Section>

                    {/* Trust Section */}
                    <motion.div className="mt-8 max-w-2xl mx-auto"
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
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
                                    { icon: FaMapMarkerAlt, title: t('trust.origin', 'Origin Verified'), desc: t('trust.originDesc', 'GPS coordinates recorded at harvest from our farm in Odienné') },
                                    { icon: FaClipboardList, title: t('trust.batch', 'Batch Recorded'), desc: t('trust.batchDesc', 'Each batch assigned a unique ID tracked through every stage') },
                                    { icon: FaGlobe, title: t('trust.transparent', 'Publicly Visible'), desc: t('trust.transparentDesc', 'Anyone with the batch ID can verify this information') },
                                ].map((item, i) => (
                                    <div key={i} className="text-center p-3 bg-white/40 rounded-xl">
                                        <item.icon className="text-accent text-xl mx-auto mb-2" />
                                        <Typography variant="small" className="font-semibold text-gray-800">{item.title}</Typography>
                                        <Typography variant="small" className="text-gray-500 text-xs mt-1">{item.desc}</Typography>
                                    </div>
                                ))}
                            </div>
                            {/* Compliance Pack Link */}
                            <motion.div className="mt-6 pt-4 border-t border-gray-200/50" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                                <Typography variant="small" className="text-gray-500 mb-2">
                                    {t('compliance.description', 'Every traceable batch comes with full compliance documentation.')}
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
                </div>
            </Section>

            {/* Mini CTA - After batch details */}
            <motion.div className="mt-6 text-center"
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                <Typography variant="small" className="text-gray-500 mb-3">
                    {t('ctaQuote.description', 'Every wholesale order includes full traceability. Get your quote today.')}
                </Typography>
                <Link to="/contact" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 text-sm font-medium shadow-md">
                    <FaEnvelope className="text-xs" />
                    {t('ctaQuote.button', 'Request a Traceable Batch')}
                </Link>
            </motion.div>

            {/* B2B Testimonials */}
            <Section className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Typography variant="h3" className="text-primary text-center mb-8">
                        {t('testimonials.title', 'Trusted by Importers Worldwide')}
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { quote: t('testimonials.eu', 'The traceability system gave us complete confidence in our supply chain.'), buyer: t('testimonials.euBuyer', 'European Importer'), icon: FaGlobeEurope },
                            { quote: t('testimonials.us', 'Audit-ready documentation that makes compliance straightforward.'), buyer: t('testimonials.usBuyer', 'North American Distributor'), icon: FaGlobeAmericas },
                            { quote: t('testimonials.me', 'Full transparency from farm to container. Exactly what our market demands.'), buyer: t('testimonials.meBuyer', 'Middle East Buyer'), icon: FaGlobeAsia },
                        ].map((item, i) => (
                            <motion.div key={i}
                                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-5 text-center"
                                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/20" />
                                <div className="relative z-10">
                                    <item.icon className="text-accent text-2xl mx-auto mb-3" />
                                    <Typography variant="body" className="text-gray-600 italic mb-3">"{item.quote}"</Typography>
                                    <Typography variant="small" className="text-primary font-semibold">{item.buyer}</Typography>
                                    <div className="flex items-center justify-center gap-1 mt-1 text-green-600 text-xs">
                                        <FaCheckCircle className="text-[10px]" />
                                        {t('testimonials.verified', 'Verified Buyer')}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

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