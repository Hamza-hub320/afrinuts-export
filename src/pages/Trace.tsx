import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Section from "@/components/Section/Section";
import { Reveal, StaggerList, StaggerItem } from "@/components/Reveal";
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import {
    FaSearch,
    FaMapMarkerAlt,
    FaClipboardList,
    FaGlobeAfrica,
    FaShieldAlt,
    FaCertificate,
    FaTruck,
    FaBuilding,
    FaCheckCircle,
    FaClock,
    FaFlask,
    FaBox,
    FaMobile,
    FaChevronDown,
    FaHeart,
    FaQrcode,
    FaFileAlt,
    FaLeaf,
    FaChild,
    FaTree,
    FaPrint,
    FaShip,
    FaArrowLeft,
    FaShare,
    FaCopy,
    FaWhatsapp,
    FaTwitter,
    FaLinkedin,
    FaEnvelope,
    FaCalendarAlt,
    FaGlobe,
    FaSignature,
    FaInfoCircle, FaArrowRight
} from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import { fadeIn, staggerContainer } from "@/utils/animations";
import { Helmet } from "react-helmet-async";
import traceHeroImage from '@/assets/images/trace-hero.webp';

interface PublicBatch {
    id: string;
    batchId: string;
    status: string;
    sourceType?: string;
    qualityGrade?: string;
    processingDate: string;
    originCountry?: string;
    originRegion?: string;
    destinationCountry?: string;
    weightClass?: string;
    hasDigitalSignature?: boolean;
    isInspected?: boolean;
    certifications?: string[];
    isDemo?: boolean;
}

interface BulkData {
    isBulk: true;
    masterBatch: {
        id: string;
        masterBatchNumber: string;
        shipmentName: string;
        destinationCountry?: string | null;
        totalBatches: number;
        totalWeightKg: number;
        grades: string;
        isDemo?: boolean;
    };
    batches: PublicBatch[];
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const TracePage: React.FC = () => {
    const { t } = useTranslation("trace");
    const query = useQuery();
    const batchId = query.get("batchId");
    const navigate = useNavigate();

    const [batch, setBatch] = useState<PublicBatch | null>(null);
    const [bulkData, setBulkData] = useState<BulkData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!batchId) {
                setBatch(null);
                setBulkData(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // STRICTLY PUBLIC FETCH - No Authorization header
                const response = await fetch(`/.netlify/functions/trace?batchId=${encodeURIComponent(batchId)}`);
                const data = await response.json();

                if (data.isBulk) {
                    setBulkData(data as BulkData);
                    setBatch(null);
                } else {
                    setBatch(data.batch);
                    setBulkData(null);
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

    const currentBatch = batch || (bulkData?.batches?.[0] || null);

    const handleShare = async (platform?: string) => {
        const url = window.location.href;
        const text = bulkData
            ? `AfriNuts Bulk Shipment: ${bulkData.masterBatch.masterBatchNumber}`
            : `AfriNuts Batch Traceability: ${batch?.batchId}`;

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
        setShowShareMenu(false);
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

    const DemoBanner: React.FC = () => (
        <div className="w-full bg-amber-50 border-y-2 border-amber-300 py-3 px-4 print:border-black print:bg-white">
            <div className="max-w-4xl mx-auto flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-200 text-amber-800 font-bold text-sm flex-shrink-0 print:border print:border-black print:bg-white">
                !
            </span>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900 print:text-black">
                        Demonstration Record — Sample Data
                    </p>
                    <p className="text-xs text-amber-800 mt-0.5 print:text-black">
                        This shows how a real AfriNuts batch will appear once shipping begins. It is not a real shipment,
                        and the certifications shown are illustrative, not achieved.
                    </p>
                </div>
            </div>
        </div>
    );

    // ========== PROMO PAGE (Translated) ==========
    if (!currentBatch && !loading) {
        const promoBatchId = query.get("batchId");
        return (
            <main className="text-text-dark font-sans">
                {/* HERO */}
                <Section className="flex items-center justify-center text-center min-h-[90vh]" animate={false}>
                    <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                                <FaQrcode className="inline mr-2 text-accent" />{t('page.title')}
                            </Typography>
                            <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                                {t('promo.heading')}
                            </motion.h1>
                            <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                                {t('promo.lead')}
                            </Typography>
                            <motion.div variants={fadeIn} className="mb-5">
                                <InfoCard icon={FaMobile} title={t('promo.introTitle')} variant="secondary" showInfoBadge={false}>
                                    <Typography variant="small" className="text-gray-600">{t('promo.subheading')}</Typography>
                                </InfoCard>
                            </motion.div>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"><FaQrcode className="text-[10px]" /> {t('promo.badgeQr')}</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium"><FaCheckCircle className="text-[10px]" /> {t('promo.badgeVerified')}</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium"><FaGlobeAfrica className="text-[10px]" /> {t('promo.badgePublic')}</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"><FaSignature className="text-[10px]" /> {t('promo.badgeSigned')}</span>
                            </div>
                            <motion.div variants={fadeIn} className="flex flex-col items-center lg:items-start gap-3">
                                <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                                    <div className="relative bg-white/50 backdrop-blur-sm border border-gray-300 rounded-full flex items-center">
                                        <FaSearch className="absolute left-3 text-gray-400 text-xs" />
                                        <input type="text" placeholder={t('search.placeholder')}
                                               className="pl-9 pr-20 py-2.5 bg-transparent text-sm focus:outline-none rounded-full w-56 batch-search-input"
                                               onKeyDown={(e) => { if (e.key === 'Enter') { const input = e.currentTarget.value.trim(); if (input) window.location.href = `/trace?batchId=${encodeURIComponent(input)}`; } }} />
                                        <button onClick={() => { const input = document.querySelector<HTMLInputElement>('.batch-search-input'); const value = input?.value?.trim(); if (value) window.location.href = `/trace?batchId=${encodeURIComponent(value)}`; }}
                                                className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-full text-xs font-medium hover:bg-dark-orange transition-colors">{t('search.button')}</button>
                                    </div>
                                    <button onClick={() => window.location.href = '/trace?batchId=AFN-FARM-ORG-260710-34D1'}
                                            className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                        <FaFlask className="text-xs" />{t('demo.button')}
                                    </button>
                                    <button onClick={() => window.location.href = '/trace?batchId=MB-20260710-085'}
                                            className="relative border border-blue-400/40 text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                        <FaShip className="text-xs" />{t('demo.bulkButton', 'View Bulk Shipment')}
                                    </button>
                                </div>
                                {promoBatchId && promoBatchId.trim() !== '' && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                                        <Typography variant="small" className="text-amber-600 bg-amber-50/80 px-4 py-2 rounded-full inline-block">
                                            {t('search.notFound', { id: promoBatchId })}
                                        </Typography>
                                    </motion.div>
                                )}
                                <div className="mt-3 text-xs text-gray-500 text-center lg:text-left">
                                    <FaInfoCircle className="inline mr-1 text-accent text-[10px]" />
                                    {t('demo.note')}
                                </div>
                                {/* Verification Mode */}
                                {(() => {
                                    const verifyCode = query.get("code");
                                    if (!verifyCode) return null;

                                    return (
                                        <motion.div
                                            className="mt-6 max-w-md mx-auto"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <InfoCard
                                                icon={FaShieldAlt}
                                                title={t('verify.title')}
                                                iconColor="text-green-600"
                                                variant="primary"
                                                showInfoBadge={false}
                                            >
                                                <div className="text-center">
                                                    <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-3">
                                                        <FaCheckCircle className="text-green-600" />
                                                        <Typography variant="small" className="text-green-700 font-medium">
                                                            {t('verify.valid')}
                                                        </Typography>
                                                    </div>
                                                    <div className="bg-white/50 rounded-lg p-3 mb-3">
                                                        <Typography variant="small" className="text-gray-500 text-[10px] uppercase tracking-wider">
                                                            {t('farmOsRecord.verificationCode')}
                                                        </Typography>
                                                        <Typography variant="small" className="font-mono font-bold text-primary text-lg tracking-wider">
                                                            {verifyCode}
                                                        </Typography>
                                                    </div>
                                                    <Typography variant="small" className="text-gray-600 text-xs leading-relaxed">
                                                        {t('verify.explanation')}
                                                    </Typography>
                                                    <div className="mt-3 flex justify-center gap-3">
                                                        <Link
                                                            to="/trace"
                                                            className="text-accent hover:text-primary text-xs font-medium transition-colors"
                                                        >
                                                            {t('verify.tracePage')} →
                                                        </Link>
                                                        <Link
                                                            to="/contact"
                                                            className="text-gray-500 hover:text-primary text-xs transition-colors"
                                                        >
                                                            {t('verify.questions')}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </InfoCard>
                                        </motion.div>
                                    );
                                })()}
                            </motion.div>
                        </motion.div>
                        <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                            <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }} whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
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

                {/* How It Works — Translated */}
                <Section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-10">{t('howItWorks.title')}</Typography>
                        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: FaQrcode, title: t('howItWorks.scan.title'), description: t('howItWorks.scan.description'), variant: 'primary' as const },
                                { icon: FaSearch, title: t('howItWorks.trace.title'), description: t('howItWorks.trace.description'), variant: 'accent' as const },
                                { icon: FaMapMarkerAlt, title: t('howItWorks.view.title'), description: t('howItWorks.view.description'), variant: 'secondary' as const },
                            ].map((step, i) => (
                                <StaggerItem key={i}>
                                    <InfoCard icon={step.icon} title={step.title} iconColor="text-accent" variant={step.variant} showInfoBadge={false} className="h-full text-center">
                                        <Typography variant="small" className="text-gray-600">{step.description}</Typography>
                                    </InfoCard>
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    </div>
                </Section>

                {/* Buyer Portal CTA — for buyers arriving without a valid batch ID */}
                <Section className="py-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Reveal>
                            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 shadow-xl">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <FaBuilding className="text-primary text-xl" />
                                    </div>
                                    <div className="flex-1">
                                        <Typography variant="h4" className="text-primary mb-1">
                                            {t('buyerCta.title')}
                                        </Typography>
                                        <Typography variant="small" className="text-gray-600">
                                            {t('buyerCta.body')}
                                        </Typography>
                                    </div>
                                    <Link
                                        to="/portal/login"
                                        className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md transition-all"
                                    >
                                        <FaShieldAlt className="text-xs" />
                                        {t('buyerCta.button')}
                                        <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </Section>

                {/* Privacy Notice — Translated */}
                <Section className="py-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Reveal>
                            <InfoCard
                                icon={FaShieldAlt}
                                title={t('privacy.title')}
                                variant="primary"
                                showInfoBadge={false}
                                className="text-center"
                            >
                                <Typography variant="body" className="text-gray-700 max-w-2xl mx-auto">
                                    {t('privacy.body')}
                                </Typography>

                                <StaggerList className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                                    {[
                                        { icon: FaQrcode, label: t('privacy.unique') },
                                        { icon: FaShieldAlt, label: t('privacy.secure') },
                                        { icon: FaCheckCircle, label: t('privacy.public') },
                                    ].map((item, i) => (
                                        <StaggerItem key={i} className="bg-white/40 rounded-xl p-3 text-center">
                                            <item.icon className="text-accent text-lg mx-auto mb-1" />
                                            <Typography variant="small" className="text-gray-700 text-xs">{item.label}</Typography>
                                        </StaggerItem>
                                    ))}
                                </StaggerList>
                            </InfoCard>
                        </Reveal>
                    </div>
                </Section>

                {/* What You'll See — Translated */}
                <Section className="py-10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <Reveal className="text-center mb-8">
                            <Typography variant="h2" className="text-primary mb-3">
                                {t('whatYouSee.title')}
                            </Typography>
                        </Reveal>

                        <StaggerList className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { icon: FaClipboardList, title: t('whatYouSee.batchDossier'), desc: t('whatYouSee.batchDossierDesc') },
                                { icon: FaGlobeAfrica,   title: t('whatYouSee.supplyNetwork'), desc: t('whatYouSee.supplyNetworkDesc') },
                                { icon: FaTruck,         title: t('whatYouSee.farmer'),        desc: t('whatYouSee.farmerDesc') },
                                { icon: FaCertificate,   title: t('whatYouSee.sustainability'), desc: t('whatYouSee.sustainabilityDesc') },
                                { icon: FaLeaf,          title: t('whatYouSee.farmLocation'),  desc: t('whatYouSee.farmLocationDesc') },
                                { icon: FaShip,          title: t('whatYouSee.farmOsRecord'),  desc: t('whatYouSee.farmOsRecordDesc') },
                            ].map((item, i) => (
                                <StaggerItem key={i}>
                                    <div className="bg-white/50 rounded-xl p-4 border border-white/30 h-full hover:bg-white/70 transition-all">
                                        <item.icon className="text-accent text-xl mb-2" />
                                        <Typography variant="small" className="font-semibold text-primary text-xs">
                                            {item.title}
                                        </Typography>
                                        <Typography variant="small" className="text-gray-500 text-[11px] mt-1">
                                            {item.desc}
                                        </Typography>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    </div>
                </Section>

                {/* Who Uses This — Translated */}
                <Section className="py-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Reveal className="text-center mb-8">
                            <Typography variant="h2" className="text-primary mb-3">
                                {t('personas.title')}
                            </Typography>
                        </Reveal>

                        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: FaBuilding, title: t('personas.buyer.title'), body: t('personas.buyer.body') },
                                { icon: FaShieldAlt, title: t('personas.regulator.title'), body: t('personas.regulator.body') },
                                { icon: FaHeart, title: t('personas.consumer.title'), body: t('personas.consumer.body') },
                            ].map((item, i) => (
                                <StaggerItem key={i}>
                                    <InfoCard
                                        icon={item.icon}
                                        title={item.title}
                                        variant={i === 0 ? 'primary' : i === 1 ? 'accent' : 'secondary'}
                                        showInfoBadge={false}
                                        className="h-full"
                                    >
                                        <Typography variant="small" className="text-gray-600">
                                            {item.body}
                                        </Typography>
                                    </InfoCard>
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    </div>
                </Section>

                {/* Traceability FAQ — Translated */}
                <Section className="py-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Reveal className="text-center mb-8">
                            <Typography variant="h2" className="text-primary mb-3">
                                {t('faq.title')}
                            </Typography>
                        </Reveal>

                        <StaggerList className="space-y-3">
                            {[
                                { q: t('faq.q1'), a: t('faq.a1') },
                                { q: t('faq.q2'), a: t('faq.a2') },
                                { q: t('faq.q3'), a: t('faq.a3') },
                                { q: t('faq.q4'), a: t('faq.a4') },
                                { q: t('faq.q5'), a: t('faq.a5') },
                            ].map((item, i) => (
                                <StaggerItem key={i}>
                                    <details className="group bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-white/30 transition-colors">
                                            <Typography variant="small" className="font-semibold text-primary">
                                                {item.q}
                                            </Typography>
                                            <FaChevronDown className="text-accent text-xs transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="px-4 pb-4">
                                            <Typography variant="small" className="text-gray-600 text-sm leading-relaxed">
                                                {item.a}
                                            </Typography>
                                        </div>
                                    </details>
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    </div>
                </Section>

                <Section className="py-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaShieldAlt} title={t('trust.title')} iconColor="text-accent" variant="primary" showInfoBadge={false} className="text-center">
                            <StaggerList className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                {[
                                    { icon: FaTree, text: t('trust.farm') },
                                    { icon: FaClipboardList, text: t('trust.batch') },
                                    { icon: FaGlobe, text: t('trust.public') },
                                    { icon: FaCertificate, text: t('trust.certs') },
                                ].map((item, i) => (
                                    <StaggerItem key={i} className="flex items-start gap-3 p-3 bg-white/40 rounded-xl text-left">
                                        <item.icon className="text-accent mt-0.5 flex-shrink-0" />
                                        <Typography variant="small" className="text-gray-700">{item.text}</Typography>
                                    </StaggerItem>
                                ))}
                            </StaggerList>
                            <div className="mt-6 pt-4 border-t border-gray-200/50">
                                <Typography variant="body" className="text-gray-600 mb-4">
                                    {t('trust.ctaBody')}
                                </Typography>
                                <Link to="/wholesale" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 text-sm font-medium shadow-md">
                                    <FaBox className="text-xs" />{t('trust.ctaButton')}<FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </InfoCard>
                    </div>
                </Section>

            </main>
        );
    }

    // ========== SINGLE OR BULK FOUND (English only) ==========
    const displayTitle = bulkData ? bulkData.masterBatch.masterBatchNumber : batch?.batchId;
    const batchesToRender = bulkData ? bulkData.batches : (batch ? [batch] : []);

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>{displayTitle} | AfriNuts Traceability</title>
                <meta name="description" content={`Traceability record for ${displayTitle}. View harvest data, quality metrics, GPS coordinates, and certification verification. Powered by AfriNuts Farm OS.`} />
            </Helmet>

            {(batch?.isDemo || bulkData?.masterBatch?.isDemo) && <DemoBanner />}

            {/* HERO */}
            <Section className="flex items-center justify-center text-center min-h-[50vh]" animate={false}>
                <motion.div className="max-w-3xl px-6 sm:px-8 py-12" variants={fadeIn} initial="hidden" animate="visible">
                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                        {bulkData ? <FaShip className="inline mr-3 text-blue-600" /> : <FaQrcode className="inline mr-3 text-accent" />}
                        {bulkData ? 'Bulk Shipment Traceability' : 'AfriNuts Batch Traceability'}
                    </Typography>
                    {/* Display title (batch ID or master batch number) */}
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
                        <FaCheckCircle className="text-primary" />
                        <span className="font-mono text-lg font-bold text-primary">{displayTitle}</span>
                        {(batch?.isDemo || bulkData?.masterBatch?.isDemo) && (
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full uppercase tracking-wider print:border print:border-black print:bg-white print:text-black">
                                Demo
                            </span>
                        )}
                    </div>
                    <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-display text-text-dark mb-6">{displayTitle}</Typography>
                    {bulkData && (
                        <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">
                            {bulkData.masterBatch.shipmentName} · {bulkData.masterBatch.totalBatches} batches consolidated
                        </Typography>
                    )}
                    <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto mt-2">
                        Verify origin, quality grade, certifications, and shipment status for this batch.
                        Full lab results, farmer details, GPS coordinates, and export documents are available to buyers in the Buyer Portal.
                    </Typography>
                    <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="text" placeholder="Enter your Batch ID..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                   className="w-full pl-12 pr-20 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-dark-orange transition">
                                Trace
                            </button>
                        </div>
                    </form>
                </motion.div>
            </Section>

            {/* Login CTA */}
            <Section className="py-4">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <Reveal>
                        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-blue-600 text-xl flex-shrink-0" />
                                <div>
                                    <Typography variant="small" className="font-semibold text-blue-800">You're viewing the public record</Typography>
                                    <Typography variant="small" className="text-blue-700 text-xs">Buyers can log in to see full documentation, lab results, farmer details, and chain of custody.</Typography>
                                </div>
                            </div>
                            <Link to="/portal/login" className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                Buyer Login →
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </Section>

            {/* Bulk Summary Banner */}
            {bulkData && (
                <Section className="py-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <InfoCard
                            icon={FaShip}
                            title={
                                <span className="inline-flex items-center gap-2">
                        <span>Bulk Shipment: {bulkData.masterBatch.masterBatchNumber}</span>
                                    {bulkData.masterBatch.isDemo && (
                                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Demo
                            </span>
                                    )}
                    </span>
                            }
                            subtitle={`${bulkData.masterBatch.shipmentName} · ${bulkData.masterBatch.totalBatches} batches consolidated`}
                            iconColor="text-blue-600"
                            showInfoBadge={false}
                        >
                            <StaggerList className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                                {[
                                    { label: 'Destination Country', value: bulkData.masterBatch.destinationCountry || '—', icon: FaGlobeAfrica },
                                    { label: 'Total Weight', value: `${(bulkData.masterBatch.totalWeightKg / 1000).toFixed(1)}T`, icon: FaBox },
                                    { label: 'Grades', value: bulkData.masterBatch.grades, icon: FaCertificate },
                                ].map((item, i) => (
                                    <StaggerItem key={i} className="bg-white/40 rounded-xl p-3 text-center border border-white/30">
                                        <item.icon className="text-accent text-sm mx-auto mb-1" />
                                        <div className="text-xs text-gray-500">{item.label}</div>
                                        <div className="font-semibold text-sm">{item.value}</div>
                                    </StaggerItem>
                                ))}
                            </StaggerList>
                        </InfoCard>
                    </div>
                </Section>
            )}

            {/* Individual Batch Cards */}
            {batchesToRender.map((b, index) => (
                <Section key={b.id} className="py-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Reveal className="text-center mb-4">
                            <Typography variant="subhead" className="uppercase tracking-widest text-accent text-xs font-semibold">
                                The Batch Dossier
                            </Typography>
                            {bulkData && (
                                <Typography variant="small" className="text-gray-400 text-xs mt-1">
                                    Batch {index + 1} of {bulkData.masterBatch.totalBatches}
                                </Typography>
                            )}
                        </Reveal>

                        <Reveal>
                            <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 transform-gpu overflow-hidden">
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />

                                <div className="relative z-10">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full">
                                            <FaCheckCircle className="text-primary" />
                                            <span className="font-mono text-lg font-bold text-primary">{b.batchId}</span>
                                        </div>
                                        {b.sourceType === 'OWN_FARM' && (
                                            <span className="ml-3 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">AfriNuts Farm</span>
                                        )}
                                    </div>

                                    <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {[
                                            { label: 'Harvest Date', value: new Date(b.processingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: FaCalendarAlt },
                                            { label: 'Origin', value: `${b.originCountry || "Côte d'Ivoire"} · ${b.originRegion || 'Odienné'}`, icon: FaMapMarkerAlt },
                                            { label: 'Destination', value: b.destinationCountry || 'Not yet assigned', icon: FaTruck },
                                            { label: 'Receiving Company', value: 'Protected', icon: FaBuilding },
                                        ].map((item, i) => (
                                            <StaggerItem key={i} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <item.icon className="text-accent text-sm" />
                                                    <Typography variant="small" className="text-gray-500 font-medium">{item.label}</Typography>
                                                </div>
                                                <Typography variant="body" className="font-semibold text-gray-800">{item.value}</Typography>
                                            </StaggerItem>
                                        ))}
                                    </StaggerList>

                                    <Reveal delay={0.15} className="mt-5 flex items-center justify-center">
                                        <span className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 bg-green-100 text-green-700">
                                            <FaShip className="text-xs" /> {b.status?.replace(/_/g, ' ')}
                                        </span>
                                    </Reveal>

                                    {b.certifications && b.certifications.length > 0 && (
                                        <Reveal delay={0.2} className="mt-5">
                                            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaCertificate className="text-accent text-sm" />
                                                    <Typography variant="small" className="text-gray-500 font-medium">Certifications</Typography>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {b.certifications.map((cert, idx) => (
                                                        <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                                                            {cert}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Reveal>
                                    )}

                                    {b.weightClass && (
                                        <Reveal delay={0.22} className="mt-5">
                                            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
                                                <Typography variant="small" className="text-gray-500 text-xs">Batch Weight</Typography>
                                                <Typography variant="h4" className="text-primary font-bold">{b.weightClass}</Typography>
                                            </div>
                                        </Reveal>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </Section>
            ))}

            {/* Action Bar (Print & Share) */}
            <Reveal>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <Link to="/trace" className="text-primary hover:text-accent flex items-center gap-2 text-sm font-medium">
                            <FaArrowLeft className="text-xs" /> Search Another Batch
                        </Link>
                        <div className="flex gap-2">
                            <button onClick={() => window.print()} className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium hover:bg-white/80 transition flex items-center gap-2">
                                <FaPrint className="text-xs" /> Print
                            </button>
                            <div className="relative">
                                <button onClick={() => setShowShareMenu(!showShareMenu)} className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-dark-orange transition flex items-center gap-2">
                                    {copied ? <FaCheckCircle className="text-xs" /> : <FaShare className="text-xs" />}
                                    {copied ? 'Copied!' : 'Share'}
                                </button>
                                {showShareMenu && (
                                    <motion.div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                                        {[
                                            { icon: FaCopy, label: 'Copy Link', action: () => handleShare() },
                                            { icon: FaWhatsapp, label: 'WhatsApp', action: () => handleShare('whatsapp') },
                                            { icon: FaTwitter, label: 'Twitter', action: () => handleShare('twitter') },
                                            { icon: FaLinkedin, label: 'LinkedIn', action: () => handleShare('linkedin') },
                                            { icon: FaEnvelope, label: 'Email', action: () => handleShare('email') },
                                        ].map((item, i) => (
                                            <button key={i} onClick={() => item.action()} className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition">
                                                <item.icon className="text-gray-500 text-xs" />{item.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* Final CTA */}
            <Section className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <InfoCard icon={FaMapMarkerAlt} title="Connect With AfriNuts" variant="primary" showInfoBadge={false} className="text-center">
                        <Typography variant="body" className="text-gray-600 mb-6">
                            Have questions about batch traceability or want to partner with us? Reach out today.
                        </Typography>
                        <Link to="/contact" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full inline-flex items-center gap-2 font-medium shadow-md">
                            Contact Us
                        </Link>
                    </InfoCard>
                </div>
            </Section>
        </main>
    );
};

export default TracePage;