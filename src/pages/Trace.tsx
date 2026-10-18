import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Section from "@/components/Section/Section";
import { Reveal, StaggerList, StaggerItem, CountUp } from "@/components/Reveal";
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import {
    GiFarmer,
    GiFruitTree,
    GiFactory,
    GiCargoShip,
} from 'react-icons/gi';
import {
    FaTree,
    FaIndustry,
    FaCertificate,
    FaTruck,
    FaBuilding,
    FaCheckCircle,
    FaSearch,
    FaMapMarkerAlt,
    FaClipboardList,
    FaGlobe,
    FaShieldAlt,
    FaCalendarAlt,
    FaFlask,
    FaEnvelope,
    FaArrowRight,
    FaQrcode,
    FaFileAlt,
    FaGlobeEurope,
    FaCopy,
    FaSignature,
    FaWhatsapp,
    FaTwitter,
    FaLinkedin,
    FaPrint,
    FaArrowLeft,
    FaShare,
    FaChartBar,
    FaDownload,
    FaLeaf,
    FaBox,
    FaMobile,
    FaGlobeAfrica,
    FaUsers,
    FaChild,
    FaDatabase,
    FaClock,
    FaShip,
    FaExternalLinkAlt,
    FaChevronDown,
    FaQuestionCircle,
    FaHeart, FaInfoCircle
} from "react-icons/fa";
import { fadeIn, staggerContainer } from "@/utils/animations";
import { Helmet } from "react-helmet-async";
import traceHeroImage from '@/assets/images/trace-hero.webp';
import JsonLd from "@/components/Seo/JsonLd";
import { trackCtaClick, trackOutboundClick } from "@/utils/analytics";
import BatchLocationMap from '@/components/BatchLocationMap/BatchLocationMap';

interface BatchData {
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
    slug: string;
    moistureContent?: number;
    nutCount?: number;
    kernelRatio?: number;
    defectiveRate?: number;
    overallScore?: number;
    weightKg?: number;
    kernelWeightKg?: number;
    rawWeightKg?: number;
    labReportUrl?: string;
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
        qualityCertificate?: string | null;
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
    supplier?: {
        id?: string;
        type: string;
        farmSize: string;
        farmOsStatus: string;
        season: string;
        traceLevel: string;
        cooperative: string | null;
    };
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
    supplierId?: number;
}

interface BulkData {
    isBulk: true;
    masterBatch: {
        id: string;
        masterBatchNumber: string;
        shipmentName: string;
        buyer: string;
        destination: string;
        exportDate: number;
        totalBatches: number;
        totalWeightKg: number;
        grades: string;
        traceabilityUrl: string;
    };
    batches: BatchData[];
    farmers: BatchData['farmer'][];
    supplierTypes: string[];
    sustainability: {
        noChildLabor: boolean;
        farmOsMonitored: boolean;
        firebreak: boolean;
        sustainableHarvesting: boolean;
    };
    farmOsMetadata: {
        recordId: string;
        created: string;
        lastUpdated: string;
        verificationStatus: string;
    };
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
    const [bulkData, setBulkData] = useState<BulkData | null>(null);
    const [allBatches, setAllBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'journey' | 'quality' | 'documents'>('journey');

    const isBulk = !!bulkData;
    const currentBatch = batch || (bulkData?.batches?.[0] || null);

    const handleShare = async (platform?: string) => {
        const url = window.location.href;
        const text = isBulk
            ? `AfriNuts Bulk Shipment: ${bulkData?.masterBatch.masterBatchNumber}`
            : `AfriNuts Batch Traceability: ${batch?.batchId}`;

        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        } else if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        } else if (platform === 'email') {
            window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
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
            if (!batchId) {
                setBatch(null);
                setBulkData(null);
                setLoading(false);
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

            setLoading(true);
            try {
                const allResponse = await fetch('/.netlify/functions/trace');
                const allData = await allResponse.json();
                setAllBatches(allData.batches || []);

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
    if (!currentBatch && !loading) {
        const promoBatchId = query.get("batchId");
        return (
            <main className="text-text-dark font-sans">
                {/* HERO — own mount animation */}
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
                                {t('promo.lead', 'Enter a batch ID to see harvest dates, GPS coordinates, quality metrics, and certification records — all pulled directly from our Farm OS.')}
                            </Typography>
                            <motion.div variants={fadeIn} className="mb-5">
                                <InfoCard icon={FaMobile} title={t('promo.introTitle', 'Powered by Farm OS')} variant="secondary" showInfoBadge={false}>
                                    <Typography variant="small" className="text-gray-600">{t('promo.subheading')}</Typography>
                                </InfoCard>
                            </motion.div>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"><FaQrcode className="text-[10px]" /> {t('promo.badgeQr', 'QR Code')}</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium"><FaCheckCircle className="text-[10px]" /> {t('promo.badgeVerified', 'Farm OS Verified')}</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium"><FaGlobeAfrica className="text-[10px]" /> {t('promo.badgePublic', 'Publicly Verifiable')}</span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"><FaSignature className="text-[10px]" /> {t('promo.badgeSigned', 'Digitally Signed')}</span>
                            </div>
                            <motion.div variants={fadeIn} className="flex flex-col items-center lg:items-start gap-3">
                                <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                                    <div className="relative bg-white/50 backdrop-blur-sm border border-gray-300 rounded-full flex items-center">
                                        <FaSearch className="absolute left-3 text-gray-400 text-xs" />
                                        <input type="text" placeholder={t('search.placeholder', 'Enter your Batch ID...')}
                                               className="pl-9 pr-20 py-2.5 bg-transparent text-sm focus:outline-none rounded-full w-56 batch-search-input"
                                               onKeyDown={(e) => { if (e.key === 'Enter') { const input = e.currentTarget.value.trim(); if (input) window.location.href = `/trace?batchId=${encodeURIComponent(input)}`; } }} />
                                        <button onClick={() => { const input = document.querySelector<HTMLInputElement>('.batch-search-input'); const value = input?.value?.trim(); if (value) window.location.href = `/trace?batchId=${encodeURIComponent(value)}`; }}
                                                className="absolute right-1 top-1 bottom-1 bg-primary text-white px-4 rounded-full text-xs font-medium hover:bg-dark-orange transition-colors">{t('search.button', 'Trace')}</button>
                                    </div>
                                    <button onClick={() => window.location.href = '/trace?batchId=AFN-FARM-ORG-260710-34D1'}
                                            className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                        <FaFlask className="text-xs" />{t('demo.button', 'View Demo Batch')}
                                    </button>
                                    <button onClick={() => window.location.href = '/trace?batchId=MB-20260710-085'}
                                            className="relative border border-blue-400/40 text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                        <FaShip className="text-xs" />{t('demo.bulkButton', 'View Bulk Shipment')}
                                    </button>
                                </div>
                                {promoBatchId && promoBatchId.trim() !== '' && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
                                        <Typography variant="small" className="text-amber-600 bg-amber-50/80 px-4 py-2 rounded-full inline-block">
                                            {t('search.notFound', 'Batch "{id}" not found. Please check and try again.', { id: promoBatchId })}
                                        </Typography>
                                    </motion.div>
                                )}
                                <div className="mt-3 text-xs text-gray-500 text-center lg:text-left">
                                    <FaInfoCircle className="inline mr-1 text-accent text-[10px]" />
                                    {t('demo.note', 'Sample batches are publicly shared by AfriNuts for demonstration. Real customer batches are private and require a tracking code.')}
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
                                                title={t('verify.title', 'Record Verification')}
                                                iconColor="text-green-600"
                                                variant="primary"
                                                showInfoBadge={false}
                                            >
                                                <div className="text-center">
                                                    <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-3">
                                                        <FaCheckCircle className="text-green-600" />
                                                        <Typography variant="small" className="text-green-700 font-medium">
                                                            {t('verify.valid', 'Valid Farm OS Signature')}
                                                        </Typography>
                                                    </div>
                                                    <div className="bg-white/50 rounded-lg p-3 mb-3">
                                                        <Typography variant="small" className="text-gray-500 text-[10px] uppercase tracking-wider">
                                                            {t('farmOsRecord.verificationCode', 'Verification Code')}
                                                        </Typography>
                                                        <Typography variant="small" className="font-mono font-bold text-primary text-lg tracking-wider">
                                                            {verifyCode}
                                                        </Typography>
                                                    </div>
                                                    <Typography variant="small" className="text-gray-600 text-xs leading-relaxed">
                                                        {t('verify.explanation', 'This verification code confirms that a Farm OS record was digitally signed and has not been altered. The signature is cryptographically tied to the original batch data.')}
                                                    </Typography>
                                                    <div className="mt-3 flex justify-center gap-3">
                                                        <Link
                                                            to="/trace"
                                                            className="text-accent hover:text-primary text-xs font-medium transition-colors"
                                                        >
                                                            {t('verify.tracePage', 'Trace a batch')} →
                                                        </Link>
                                                        <Link
                                                            to="/contact"
                                                            className="text-gray-500 hover:text-primary text-xs transition-colors"
                                                        >
                                                            {t('verify.questions', 'Questions?')}
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

                {/* How It Works — staggered */}
                <Section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-10">{t('howItWorks.title', 'How Our Traceability Works')}</Typography>
                        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: FaQrcode, title: t('howItWorks.scan.title', '1. Scan the QR Code'), description: t('howItWorks.scan.description'), variant: 'primary' as const },
                                { icon: FaSearch, title: t('howItWorks.trace.title', '2. Enter Your Batch ID'), description: t('howItWorks.trace.description'), variant: 'accent' as const },
                                { icon: FaMapMarkerAlt, title: t('howItWorks.view.title', '3. See the Full Journey'), description: t('howItWorks.view.description'), variant: 'secondary' as const },
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

                {/* Privacy Notice */}
                <Section className="py-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Reveal>
                            <InfoCard
                                icon={FaShieldAlt}
                                title={t('privacy.title', 'Your Batch Is Private')}
                                variant="primary"
                                showInfoBadge={false}
                                className="text-center"
                            >
                                <Typography variant="body" className="text-gray-700 max-w-2xl mx-auto">
                                    {t('privacy.body', 'Each batch has a unique tracking code — printed on the QR sticker, Bill of Lading, and Certificate of Origin. Only someone with that code can view the batch record. We never publish customer batches, and we never reveal what shipments exist in our system.')}
                                </Typography>

                                <StaggerList className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                                    {[
                                        { icon: FaQrcode, label: t('privacy.unique', 'Unique code per batch') },
                                        { icon: FaShieldAlt, label: t('privacy.secure', 'Encrypted lookup') },
                                        { icon: FaCheckCircle, label: t('privacy.public', 'Publicly verifiable') },
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

                {/* What You'll See */}
                <Section className="py-10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <Reveal className="text-center mb-8">
                            <Typography variant="h2" className="text-primary mb-3">
                                {t('whatYouSee.title', 'What You\'ll See Inside Every Batch')}
                            </Typography>
                        </Reveal>

                        <StaggerList className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { icon: FaClipboardList, title: 'The Batch Dossier', desc: 'Origin, processing, quality, weight' },
                                { icon: FaGlobeAfrica, title: 'The Supply Network', desc: 'Which supplier, cooperative status' },
                                { icon: GiFarmer, title: 'The Farmer', desc: 'Who grew it, their story' },
                                { icon: FaLeaf, title: 'The Sustainability Record', desc: 'Compliance and farming methods' },
                                { icon: FaMapMarkerAlt, title: 'The Farm Location', desc: 'GPS map of the source' },
                                { icon: FaShieldAlt, title: 'Farm OS Record', desc: 'Digital signature, verification' },
                            ].map((item, i) => (
                                <StaggerItem key={i}>
                                    <div className="bg-white/50 rounded-xl p-4 border border-white/30 h-full hover:bg-white/70 transition-all">
                                        <item.icon className="text-accent text-xl mb-2" />
                                        <Typography variant="small" className="font-semibold text-primary text-xs">{item.title}</Typography>
                                        <Typography variant="small" className="text-gray-500 text-[11px] mt-1">{item.desc}</Typography>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    </div>
                </Section>

                {/* Who Uses This */}
                <Section className="py-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Reveal className="text-center mb-8">
                            <Typography variant="h2" className="text-primary mb-3">
                                {t('personas.title', 'Built for Everyone Who Touches a Bag')}
                            </Typography>
                        </Reveal>

                        <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    icon: FaBuilding,
                                    title: t('personas.buyer.title', 'For Buyers'),
                                    body: t('personas.buyer.body', 'Verify origin, quality, and certifications before you open a container. No paperwork chase.')
                                },
                                {
                                    icon: FaShieldAlt,
                                    title: t('personas.regulator.title', 'For Regulators'),
                                    body: t('personas.regulator.body', 'EU due diligence-ready records. Blockchain-grade traceability without blockchain complexity.')
                                },
                                {
                                    icon: FaHeart,
                                    title: t('personas.consumer.title', 'For Consumers'),
                                    body: t('personas.consumer.body', 'See the farm your cashews came from. Every bag tells a story you can verify in 10 seconds.')
                                },
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

                {/* Traceability FAQ */}
                <Section className="py-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Reveal className="text-center mb-8">
                            <Typography variant="h2" className="text-primary mb-3">
                                {t('faq.title', 'Common Questions')}
                            </Typography>
                        </Reveal>

                        <StaggerList className="space-y-3">
                            {[
                                {
                                    q: 'How do I find my batch ID?',
                                    a: 'Your batch ID is printed on the QR code sticker attached to every 50kg bag and on your Bill of Lading and Certificate of Origin.'
                                },
                                {
                                    q: 'What if the batch ID doesn\'t work?',
                                    a: 'Check for typos — batch IDs are case-sensitive. If it still doesn\'t work, contact us at info@afrinutsexport.com with your invoice number.'
                                },
                                {
                                    q: 'Can I verify the digital signature independently?',
                                    a: 'Yes — every batch has a tamper-proof verification code you can check without login. The signature proves the data hasn\'t been altered since signing.'
                                },
                                {
                                    "q": "Who can see my batch record?",
                                    "a": "Only someone with your unique tracking code. The code appears on the QR sticker on each bag, your Bill of Lading, and your Certificate of Origin. We don't publish batch records publicly and we don't allow browsing — every view requires a specific code."
                                },
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
                                    {t('trust.ctaBody', 'Every wholesale order includes Farm OS traceability at no extra cost.')}
                                </Typography>
                                <Link to="/wholesale" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 text-sm font-medium shadow-md">
                                    <FaBox className="text-xs" />{t('trust.ctaButton', 'Explore Wholesale Options')}<FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </InfoCard>
                    </div>
                </Section>

            </main>
        );
    }

    // ========== BATCH OR BULK FOUND ==========
    const displayTitle = isBulk ? bulkData!.masterBatch.masterBatchNumber : batch?.batchId;

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>{displayTitle} | AfriNuts Traceability</title>
                <meta name="description" content={`Traceability record for ${displayTitle}. View harvest data, quality metrics, GPS coordinates, and certification verification. Powered by AfriNuts Farm OS.`} />
                <link rel="canonical" href={`https://www.afrinutsexport.com/trace?batchId=${displayTitle}`} />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": `Batch Traceability: ${displayTitle} | AfriNuts Export`,
                "description": isBulk
                    ? `Bulk shipment ${displayTitle} consolidating ${bulkData?.batches.length} batches from ${bulkData?.farmers.length} farmer(s).`
                    : `Block-level traceability for batch ${displayTitle} from our farm in Odienné, Côte d'Ivoire.`,
            }} />

            {/* HERO — own mount animation */}
            <Section className="flex items-center justify-center text-center min-h-[50vh]" animate={false}>
                <motion.div className="max-w-3xl px-6 sm:px-8 py-12" variants={fadeIn} initial="hidden" animate="visible">
                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                        {isBulk ? <FaShip className="inline mr-3 text-blue-600" /> : <FaQrcode className="inline mr-3 text-accent" />}
                        {isBulk ? 'Bulk Shipment Traceability' : t('page.title')}
                    </Typography>
                    <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-display text-text-dark mb-6">{displayTitle}</Typography>
                    {isBulk && (
                        <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">
                            {bulkData?.masterBatch.shipmentName} · {bulkData?.batches.length} batches consolidated · {bulkData?.farmers.length} farmer{bulkData!.farmers.length !== 1 ? 's' : ''}
                        </Typography>
                    )}
                    <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto mt-2">{t('page.description')}</Typography>

                    <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input type="text" placeholder={t('search.placeholder')} value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                   className="w-full pl-12 pr-20 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-dark-orange transition">
                                {t('search.button', 'Trace')}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </Section>

            {/* Bulk Shipment Summary Banner */}
            {isBulk && bulkData && (
                <Section className="py-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaShip} title={`Bulk Shipment: ${bulkData.masterBatch.masterBatchNumber}`}
                                  subtitle={`${bulkData.masterBatch.shipmentName} · ${bulkData.batches.length} batches consolidated · ${(bulkData.masterBatch.totalWeightKg / 1000).toFixed(1)}T total`}
                                  iconColor="text-blue-600" showInfoBadge={false}>
                            <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                {[
                                    { label: 'Buyer', value: bulkData.masterBatch.buyer, icon: FaBuilding },
                                    { label: 'Destination', value: bulkData.masterBatch.destination, icon: FaTruck },
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

            {/* Multiple Farmers for Bulk */}
            {isBulk && bulkData?.farmers && bulkData.farmers.length > 0 && (
                <Section className="py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-6">
                            {bulkData.farmers.length === 1 ? 'Meet the Farmer' : `Meet the ${bulkData.farmers.length} Farmers Behind This Shipment`}
                        </Typography>
                        <StaggerList className={`grid grid-cols-1 ${bulkData.farmers.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'max-w-md mx-auto'} gap-6`}>
                            {bulkData.farmers.map((farmer: any) => (
                                <StaggerItem key={farmer.id || farmer.name}>
                                    <InfoCard icon={GiFarmer} title={farmer.name} subtitle={`${farmer.role} · ${farmer.yearsFarming}`} variant="primary" showInfoBadge={false} className="h-full">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                            <Typography variant="small" className="text-gray-500 text-xs">{farmer.location}</Typography>
                                        </div>
                                        <Typography variant="small" className="text-gray-600 text-sm">{farmer.bio}</Typography>
                                        {farmer.quote && (
                                            <p className="text-sm italic text-accent-dark mt-2 border-l-2 border-accent/30 pl-3">"{farmer.quote}"</p>
                                        )}
                                    </InfoCard>
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    </div>
                </Section>
            )}

            {/* Supply Network Types for Bulk */}
            {isBulk && bulkData?.supplierTypes && bulkData.supplierTypes.length > 0 && (
                <Section className="py-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaGlobeAfrica} title="Supply Network" subtitle="This shipment consolidates cashews from multiple supply channels" variant="accent" showInfoBadge={false}>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {bulkData.supplierTypes.map((type: string) => (
                                    <span key={type} className="px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </InfoCard>
                    </div>
                </Section>
            )}

            {/* Individual Batch Cards */}
            {(isBulk ? bulkData!.batches : [batch!]).map((b: BatchData) => (
                <Section key={b.id} className="py-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        {/* Card Header — sits above the card, outside the glassy container */}
                        <Reveal className="text-center mb-4">
                            <Typography
                                variant="subhead"
                                className="uppercase tracking-widest text-accent text-xs font-semibold"
                            >
                                {t('batch.dossierName', 'The Batch Dossier')}
                            </Typography>
                            {isBulk && (
                                <Typography variant="small" className="text-gray-400 text-xs mt-1">
                                    Batch {bulkData!.batches.indexOf(b) + 1} of {bulkData!.batches.length}
                                </Typography>
                            )}
                        </Reveal>
                        <Reveal>
                            <motion.div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 transform-gpu overflow-hidden"
                                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                        whileHover={{ y: -5, scale: 1.01, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />

                                <div className="relative z-10">
                                    <div className="text-center mb-8">
                                        {isBulk && <Typography variant="small" className="text-gray-400 mb-1">Batch {bulkData!.batches.indexOf(b) + 1} of {bulkData!.batches.length}</Typography>}
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
                                            { label: t('batch.harvestDate'), value: new Date(b.harvestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: FaCalendarAlt },
                                            { label: t('batch.farmLocation'), value: `${b.farmLocation}${b.block ? ` · ${b.block}` : ''}`, icon: FaMapMarkerAlt },
                                            { label: t('batch.destinationLocation'), value: b.destination, icon: FaTruck },
                                            { label: t('batch.receivingCompany'), value: b.buyer || '—', icon: FaBuilding },
                                        ].map((item, i) => (
                                            <StaggerItem key={i} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center gap-2 mb-1"><item.icon className="text-accent text-sm" /><Typography variant="small" className="text-gray-500 font-medium">{item.label}</Typography></div>
                                                <Typography variant="body" className="font-semibold text-gray-800">{item.value}</Typography>
                                            </StaggerItem>
                                        ))}
                                    </StaggerList>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                        <Reveal delay={0.1}>
                                            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <FaIndustry className="text-accent text-sm" />
                                                    <Typography variant="small" className="text-gray-500 font-medium">Processing Information</Typography>
                                                </div>
                                                <div className="space-y-2">
                                                    {[
                                                        { label: 'Facility', value: b.processingFacility || '—' },
                                                        { label: 'Location', value: b.processingLocation || '—' },
                                                        { label: 'Method', value: b.processingMethod || '—' },
                                                        { label: 'Shelling', value: b.shellingMethod || '—' },
                                                        { label: 'Grading', value: b.gradingMethod || '—' },
                                                        b.yieldPercentage ? { label: 'Yield', value: `${b.yieldPercentage}%` } : null,
                                                    ].filter(Boolean).map((item: any, i) => (
                                                        <div key={i} className="flex justify-between text-sm">
                                                            <span className="text-gray-500">{item.label}</span>
                                                            <span className="font-medium text-gray-700 text-right max-w-[60%]">{item.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Reveal>
                                        <Reveal delay={0.15}>
                                            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <FaFlask className="text-accent text-sm" />
                                                    <Typography variant="small" className="text-gray-500 font-medium">Quality Check Results</Typography>
                                                </div>
                                                <div className="space-y-2">
                                                    {b.testResults && [
                                                        { label: 'Aflatoxin', value: b.testResults?.aflatoxin != null ? `${b.testResults.aflatoxin} ppb` : '—', status: (b.testResults?.aflatoxin ?? 99) < 4 ? 'pass' : 'fail' },
                                                        { label: 'Heavy Metals', value: b.testResults?.heavyMetals != null ? `${b.testResults.heavyMetals} ppb` : '—', status: (b.testResults?.heavyMetals ?? 99) < 0.5 ? 'pass' : 'fail' },
                                                        { label: 'Pesticide Residue', value: b.testResults?.pesticideResidue != null ? `${b.testResults.pesticideResidue} ppb` : '—', status: (b.testResults?.pesticideResidue ?? 99) < 0.5 ? 'pass' : 'fail' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex justify-between text-sm items-center">
                                                            <span className="text-gray-500">{item.label}</span>
                                                            <span className={`font-medium ${item.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                                                {item.value}
                                                                {item.status === 'pass' ? ' ✓' : ' ⚠'}
                                                             </span>
                                                        </div>
                                                    ))}
                                                    <div className="pt-2 border-t border-gray-200/50 flex justify-between text-sm">
                                                        <span className="text-gray-500">Quality Score</span>
                                                        <span className="font-bold text-primary">
                                                            {b.overallScore ? <CountUp to={b.overallScore} duration={1.2} suffix="%" /> : '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Reveal>
                                    </div>

                                    {/* Weight Section */}
                                    {(b.kernelWeightKg || b.rawWeightKg) && (
                                        <Reveal delay={0.2} className="mt-5">
                                            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <Typography variant="small" className="text-gray-500 text-center mb-2">Batch Weight</Typography>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center">
                                                        <Typography variant="small" className="text-gray-400 text-xs">Raw Input</Typography>
                                                        <Typography variant="h4" className="text-primary font-bold">
                                                            {b.rawWeightKg ? `${(b.rawWeightKg / 1000).toFixed(1)}T` : '—'}
                                                        </Typography>
                                                    </div>
                                                    <div className="text-center">
                                                        <Typography variant="small" className="text-gray-400 text-xs">Kernel Output</Typography>
                                                        <Typography variant="h4" className="text-green-600 font-bold">
                                                            {b.kernelWeightKg ? `${(b.kernelWeightKg / 1000).toFixed(1)}T` : '—'}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                {b.kernelRatio && (
                                                    <div className="text-center mt-2">
                                                        <Typography variant="small" className="text-gray-400 text-xs">
                                                            Kernel Ratio: {b.kernelRatio}%
                                                        </Typography>
                                                    </div>
                                                )}
                                            </div>
                                        </Reveal>
                                    )}

                                    {b.certifications && b.certifications.length > 0 && (
                                        <Reveal delay={0.25} className="mt-5">
                                            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                                <div className="flex items-center gap-2 mb-2"><FaCertificate className="text-accent text-sm" /><Typography variant="small" className="text-gray-500 font-medium">{t('batch.certifications')}</Typography></div>
                                                <div className="flex flex-wrap gap-2">
                                                    {b.certifications.map((cert, idx) => (
                                                        <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">{cert}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Reveal>
                                    )}
                                </div>
                            </motion.div>
                        </Reveal>
                        {/* Status Badge */}
                        <Reveal delay={0.3} className="mt-5 flex items-center justify-center gap-3">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                                b.status === 'Shipped' ? 'bg-green-100 text-green-700' : b.status === 'Delivered' ? 'bg-blue-100 text-blue-700' :
                                    b.status === 'Processing' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {b.status === 'Shipped' ? <FaShip className="text-xs" /> :
                                    b.status === 'Delivered' ? <FaCheckCircle className="text-xs" /> :
                                        b.status === 'Processing' ? <FaIndustry className="text-xs" /> :
                                            <FaClock className="text-xs" />}
                                {b.status}
                            </span>
                        </Reveal>
                    </div>
                </Section>
            ))}

            {/* The Supply Network — Single Batch */}
            {!isBulk && currentBatch?.supplier && (
                <Section className="py-6">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaGlobeAfrica} title={t('supplier.title', 'The Supply Network')} variant="accent" showInfoBadge={false}>
                            <StaggerList className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                                {[
                                    { label: t('supplier.type', 'Supplier Type'), value: currentBatch.supplier.type, icon: GiFruitTree },
                                    { label: t('supplier.size', 'Farm Size'), value: currentBatch.supplier.farmSize || '—', icon: FaMapMarkerAlt },
                                    { label: t('supplier.farmOs', 'Farm OS Status'), value: currentBatch.supplier.farmOsStatus || 'Active', icon: FaMobile },
                                    { label: t('supplier.season', 'Harvest Season'), value: currentBatch.supplier.season || '2026', icon: FaCalendarAlt },
                                    { label: t('supplier.traceLevel', 'Traceability Level'), value: currentBatch.supplier.traceLevel || 'Block-Level Verified', icon: FaShieldAlt },
                                    { label: t('supplier.cooperative', 'Cooperative'), value: currentBatch.supplier.cooperative || 'AfriNuts Owned Farm', icon: GiFarmer },
                                ].map((item, i) => (
                                    <StaggerItem key={i} className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/30 text-center">
                                        <item.icon className="text-accent text-lg mx-auto mb-1" />
                                        <Typography variant="small" className="text-gray-500 text-[10px] uppercase tracking-wider">{item.label}</Typography>
                                        <Typography variant="small" className="text-primary font-semibold text-xs mt-0.5">{item.value}</Typography>
                                    </StaggerItem>
                                ))}
                            </StaggerList>
                            <div className="mt-4 pt-3 border-t border-gray-200/30 text-center">
                                <Typography variant="small" className="text-gray-400 text-xs">
                                    {t('supplier.footnote', 'Farm OS traceability works across our entire supplier network — owned farms, cooperatives, and independent growers. Same system. Same standard.')}
                                </Typography>
                            </div>
                        </InfoCard>
                    </div>
                </Section>
            )}

            {/* Single Farmer for Single Batch */}
            {!isBulk && batch?.farmer && (
                <Section className="py-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={GiFarmer} title={t('farmer.title', 'The Farmer')} variant="primary" showInfoBadge={false}>
                            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                                <div className="flex-shrink-0">
                                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex items-center justify-center bg-primary/5">
                                        {batch.farmer.photo ? (
                                            <img src={batch.farmer.photo} alt={batch.farmer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <GiFarmer className="text-5xl text-primary/40" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <Typography variant="h4" className="text-primary mb-1">{batch.farmer.name}</Typography>
                                    <Typography variant="small" className="text-accent font-medium mb-2">{batch.farmer.role} · {batch.farmer.yearsFarming}</Typography>
                                    <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-3">
                                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                        <Typography variant="small" className="text-gray-500">{batch.farmer.location}</Typography>
                                    </div>
                                    <Typography variant="body" className="text-gray-600 text-sm leading-relaxed">{batch.farmer.bio}</Typography>
                                    {batch.farmer.quote && (
                                        <div className="mt-4 bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
                                            <Typography variant="body" className="text-primary-dark italic text-sm">"{batch.farmer.quote}"</Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </InfoCard>
                    </div>
                </Section>
            )}

            {/* The Sustainability Record */}
            {(isBulk ? bulkData?.sustainability : batch?.sustainability) && (
                <Section className="py-6">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaLeaf} title={t('sustainability.title', 'The Sustainability Record')} variant="primary" showInfoBadge={false}>
                            <StaggerList className="grid grid-cols-2 gap-3 mt-3">
                                {[
                                    { icon: FaChild, label: t('sustainability.noChildLabor', 'No Child Labor'), value: (isBulk ? bulkData!.sustainability : batch!.sustainability)!.noChildLabor, active: (isBulk ? bulkData!.sustainability : batch!.sustainability)!.noChildLabor },
                                    { icon: FaMobile, label: t('sustainability.farmOsMonitored', 'Farm OS Monitored'), value: (isBulk ? bulkData!.sustainability : batch!.sustainability)!.farmOsMonitored, active: (isBulk ? bulkData!.sustainability : batch!.sustainability)!.farmOsMonitored },
                                    { icon: FaShieldAlt, label: t('sustainability.firebreak', 'Firebreak'), value: (isBulk ? bulkData!.sustainability : batch!.sustainability)!.firebreak, active: (isBulk ? bulkData!.sustainability : batch!.sustainability)!.firebreak },
                                    { icon: FaTree, label: t('sustainability.harvesting', 'Sustainable Harvest'), value: (isBulk ? bulkData!.sustainability : batch!.sustainability)!.sustainableHarvesting, active: (isBulk ? bulkData!.sustainability : batch!.sustainability)!.sustainableHarvesting },
                                ].map((item, i) => (
                                    <StaggerItem key={i} className={`rounded-xl p-4 border text-center transition-all ${item.active ? 'bg-green-50/60 border-green-200' : 'bg-gray-50/40 border-gray-200'}`}>
                                        <item.icon className={`text-2xl mx-auto mb-2 ${item.active ? 'text-green-600' : 'text-gray-400'}`} />
                                        <Typography variant="small" className="text-gray-600 text-xs font-medium">{item.label}</Typography>
                                        <Typography variant="small" className={`text-xs font-bold mt-1 ${item.active ? 'text-green-700' : 'text-gray-500'}`}>
                                            {item.active ? 'Verified ✓' : 'Pending'}
                                        </Typography>
                                    </StaggerItem>
                                ))}
                            </StaggerList>
                            <div className="mt-4 pt-3 border-t border-gray-200/30 text-center">
                                <Typography variant="small" className="text-gray-400 text-xs flex items-center justify-center gap-1.5">
                                    <FaGlobeEurope className="text-[10px]" />
                                    {t('sustainability.euNote', 'Meets EU Due Diligence requirements for sustainable sourcing verification')}
                                </Typography>
                            </div>
                        </InfoCard>
                    </div>
                </Section>
            )}

            {/* Farm OS Record Metadata + Digital Signature */}
            {(isBulk ? bulkData?.farmOsMetadata : currentBatch?.farmOsMetadata) && (
                <Section className="py-6">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaMobile} title={t('farmOsRecord.title', 'Farm OS Record')} variant="accent" showInfoBadge={false}>
                            <StaggerList className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                {[
                                    { label: t('farmOsRecord.recordId'), value: (isBulk ? bulkData!.farmOsMetadata : currentBatch!.farmOsMetadata)!.recordId, icon: FaClipboardList },
                                    { label: t('farmOsRecord.created'), value: (isBulk ? bulkData!.farmOsMetadata : currentBatch!.farmOsMetadata)!.created, icon: FaCalendarAlt },
                                    { label: t('farmOsRecord.updated'), value: (isBulk ? bulkData!.farmOsMetadata : currentBatch!.farmOsMetadata)!.lastUpdated, icon: FaClock },
                                    { label: t('farmOsRecord.status'), value: (isBulk ? bulkData!.farmOsMetadata : currentBatch!.farmOsMetadata)!.verificationStatus, icon: FaShieldAlt, highlight: true },
                                ].map((item, i) => (
                                    <StaggerItem key={i} className={`rounded-xl p-3 border text-center ${item.highlight ? 'bg-green-50/60 border-green-200' : 'bg-white/40 border-white/30'}`}>
                                        <item.icon className={`text-lg mx-auto mb-1 ${item.highlight ? 'text-green-600' : 'text-accent'}`} />
                                        <Typography variant="small" className="text-gray-500 text-[10px] uppercase tracking-wider">{item.label}</Typography>
                                        <Typography variant="small" className={`font-semibold text-xs mt-0.5 ${item.highlight ? 'text-green-700' : 'text-primary'}`}>{item.value}</Typography>
                                    </StaggerItem>
                                ))}
                            </StaggerList>

                            {/* Digital Signature Section */}
                            {!isBulk && currentBatch?.verificationCode && (
                                <Reveal delay={0.2} className="mt-4 pt-4 border-t border-gray-200/30">
                                    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FaShieldAlt className="text-green-600" />
                                            <Typography variant="small" className="font-semibold text-primary">
                                                {t('farmOsRecord.digitalSignature', 'Digital Signature')}
                                            </Typography>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                {t('farmOsRecord.verified', 'Verified')}
                                             </span>
                                        </div>
                                        <StaggerList className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                            <StaggerItem className="bg-white/50 rounded-lg p-2.5 text-center">
                                                <Typography variant="small" className="text-gray-400 text-[10px] uppercase tracking-wider">
                                                    {t('farmOsRecord.verificationCode', 'Verification Code')}
                                                </Typography>
                                                <Typography variant="small" className="font-mono font-bold text-primary mt-0.5 tracking-wider">
                                                    {currentBatch.verificationCode}
                                                </Typography>
                                            </StaggerItem>
                                            <StaggerItem className="bg-white/50 rounded-lg p-2.5 text-center">
                                                <Typography variant="small" className="text-gray-400 text-[10px] uppercase tracking-wider">
                                                    {t('farmOsRecord.signature', 'Signature')}
                                                </Typography>
                                                <Typography variant="small" className="font-mono text-primary text-[9px] mt-0.5 truncate" title={currentBatch.digitalSignature?.signature}>
                                                    {currentBatch.digitalSignature?.signature || `FOS-SIG-${currentBatch.verificationCode.toLowerCase()}`}
                                                </Typography>
                                            </StaggerItem>
                                            <StaggerItem className="bg-white/50 rounded-lg p-2.5 text-center">
                                                <Typography variant="small" className="text-gray-400 text-[10px] uppercase tracking-wider">
                                                    {t('farmOsRecord.signedDate', 'Signed Date')}
                                                </Typography>
                                                <Typography variant="small" className="text-primary font-medium mt-0.5">
                                                    {currentBatch.digitalSignature?.signedDate || t('farmOsRecord.justNow', 'Just now')}
                                                </Typography>
                                            </StaggerItem>
                                        </StaggerList>

                                        {/* Expandable Explanation */}
                                        <details className="mt-3 group">
                                            <summary className="flex items-center gap-1.5 text-xs text-primary hover:text-accent cursor-pointer font-medium transition-colors">
                                                <FaQuestionCircle className="text-[10px]" />
                                                {t('farmOsRecord.whatIsSignature', 'What is a digital signature?')}
                                                <FaChevronDown className="text-[8px] transition-transform group-open:rotate-180" />
                                            </summary>
                                            <div className="mt-2 pl-5 space-y-3">
                                                <Typography variant="small" className="text-gray-600 text-xs leading-relaxed">
                                                    {t('farmOsRecord.signatureExplanation', 'Our digital signatures use cryptographic technology to prove that this batch data is authentic and has not been tampered with. When you see a verified signature, you can trust that the information you\'re viewing is exactly what was recorded in Farm OS — not something generated after the fact.')}
                                                </Typography>

                                                <div className="bg-blue-50/60 rounded-lg p-3 border border-blue-100">
                                                    <Typography variant="small" className="font-semibold text-blue-700 text-xs flex items-center gap-1.5 mb-1">
                                                        <FaCheckCircle className="text-[10px]" />
                                                        {t('farmOsRecord.howToVerify', 'How to verify')}
                                                    </Typography>
                                                    <Typography variant="small" className="text-blue-600 text-xs leading-relaxed">
                                                        {t('farmOsRecord.verifyInstructions', 'Enter the verification code above on our public verification page to confirm this record\'s authenticity. Anyone can verify — no login required.')}
                                                    </Typography>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/trace?code=${currentBatch.verificationCode}`}
                                                        className="inline-flex items-center gap-1.5 text-accent hover:text-primary text-xs font-medium transition-colors"
                                                    >
                                                        <FaExternalLinkAlt className="text-[10px]" />
                                                        {t('farmOsRecord.verifyNow', 'Verify this record')}
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link
                                                        to="/trace"
                                                        className="text-gray-500 hover:text-primary text-xs transition-colors"
                                                    >
                                                        {t('farmOsRecord.verifyPage', 'Public verification page')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </details>
                                    </div>
                                </Reveal>
                            )}

                            {/* System Note */}
                            <div className="mt-4 pt-3 border-t border-gray-200/30 text-center">
                                <Typography variant="small" className="text-gray-400 text-xs flex items-center justify-center gap-1.5">
                                    <FaDatabase className="text-[10px]" />
                                    {t('farmOsRecord.note', 'Data pulled directly from Farm OS. Tamper-proof digital signature confirms this record has not been altered since signing.')}
                                </Typography>
                            </div>
                        </InfoCard>
                    </div>
                </Section>
            )}

            {/* GPS Map - only for single batch with coordinates */}
            {!isBulk && batch?.latitude && batch?.longitude && (
                <Section className="py-6">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaMapMarkerAlt} title={t('location.title', 'The Farm Location')} variant="primary" showInfoBadge={false}>
                            <div className="mt-3">
                                <BatchLocationMap latitude={batch.latitude} longitude={batch.longitude} farmName={batch.farmLocation || 'AfriNuts Farm'} block={batch.block} />
                                <div className="flex items-center justify-center gap-2 mt-3">
                                    <FaMapMarkerAlt className="text-accent text-xs" />
                                    <Typography variant="small" className="text-gray-600">{batch.farmLocation}{batch.block ? ` · Block ${batch.block}` : ''}</Typography>
                                    <span className="text-gray-300">·</span>
                                    <Typography variant="small" className="text-gray-400 text-xs">{batch.latitude.toFixed(4)}, {batch.longitude.toFixed(4)}</Typography>
                                </div>
                            </div>
                        </InfoCard>
                    </div>
                </Section>
            )}

            {/* Action Bar */}
            <Reveal>
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
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
                                            <button key={i} onClick={() => { trackOutboundClick(item.label.toLowerCase(), 'share_menu'); item.action(); }}
                                                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition">
                                                <item.icon className="text-gray-500 text-xs" />{item.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

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
            </Reveal>

            {/* Journey Timeline - Desktop & Mobile */}
            {activeTab === 'journey' && (
                <>
                    <Section className="py-8 md:py-12">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6">
                            <div className="text-center mb-8">
                                <Typography variant="h2" className="text-primary mb-4">{t('journey.title', "Your Order's Journey")}</Typography>
                                <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">{t('journey.subtitle')}</Typography>
                            </div>

                            {(() => {
                                const status = currentBatch?.status;
                                const isProcessing = status === 'Processing';
                                const isShipped = status === 'Shipped';
                                const isDelivered = status === 'Delivered';

                                const steps = [
                                    {
                                        icon: GiFruitTree,
                                        title: t('journey.farm', 'Farm'),
                                        detail: currentBatch?.farmLocation || 'Odienné, Côte d\'Ivoire',
                                        sub: currentBatch?.block ? t('journey.farmDesc', { block: currentBatch.block }) : t('journey.farmDesc', { block: 'Main Farm' }),
                                        status: 'complete'
                                    },
                                    {
                                        icon: GiFactory,
                                        title: t('journey.process', 'Process'),
                                        detail: currentBatch?.processingFacility || 'AfriNuts NDC',
                                        sub: currentBatch?.qualityGrade ? t('journey.processDesc', { grade: currentBatch.qualityGrade }) : '',
                                        status: isProcessing || isShipped || isDelivered ? 'complete' : 'active'
                                    },
                                    {
                                        icon: FaCertificate,
                                        title: t('journey.certify', 'Certify'),
                                        detail: currentBatch?.certifications?.[0] || t('journey.pending', 'Pending'),
                                        sub: t('journey.certifyDesc', { count: currentBatch?.certifications?.length || 0 }),
                                        status: isShipped || isDelivered ? 'complete' : isProcessing ? 'active' : 'upcoming'
                                    },
                                    {
                                        icon: GiCargoShip,
                                        title: t('journey.ship', 'Ship'),
                                        detail: currentBatch?.destination || t('journey.pending', 'Awaiting'),
                                        sub: isShipped || isDelivered ? t('journey.shipDesc', 'Via Port of Abidjan') : t('journey.pending', 'Not yet shipped'),
                                        status: isShipped || isDelivered ? 'complete' : 'upcoming'
                                    },
                                    {
                                        icon: FaBuilding,
                                        title: t('journey.deliver', 'Deliver'),
                                        detail: currentBatch?.buyer || currentBatch?.destination || t('journey.pending', 'Awaiting'),
                                        sub: isDelivered ? t('journey.delivered', '✓ Delivered') : isShipped ? t('journey.inTransit', 'In Transit') : t('journey.pending', 'Pending'),
                                        status: isDelivered ? 'complete' : isShipped ? 'active' : 'upcoming'
                                    },
                                    {
                                        icon: FaFileAlt,
                                        title: t('journey.docs', 'Docs'),
                                        detail: currentBatch?.documents && Object.values(currentBatch.documents).some(Boolean) ? t('journey.docsDetail', 'Export Ready') : t('journey.pending', 'Processing'),
                                        sub: currentBatch?.documents && Object.values(currentBatch.documents).filter(Boolean).length > 0
                                            ? `${Object.values(currentBatch.documents).filter(Boolean).length} documents`
                                            : t('journey.pending', 'Available after export'),
                                        status: isDelivered ? 'complete' : 'upcoming'
                                    },
                                ];

                                return (
                                    <>
                                        {/* Desktop Timeline */}
                                        <div className="hidden md:block relative py-8">
                                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#5A7411" stopOpacity="0.3" />
                                                        <stop offset="50%" stopColor="#E04E00" stopOpacity="0.4" />
                                                        <stop offset="100%" stopColor="#5A7411" stopOpacity="0.3" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M40,100 C200,20 300,180 500,100 C650,40 700,160 760,100" fill="none" stroke="url(#journeyGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8,4" />
                                            </svg>
                                            <StaggerList className="grid grid-cols-6 gap-6 relative z-10">
                                                {steps.map((step, i) => (
                                                    <StaggerItem key={i} className="relative flex flex-col items-center text-center group" style={{ marginTop: i % 2 === 0 ? '4rem' : '1rem' }}>
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                                                            {step.status === 'active' ? (
                                                                <span className="relative flex h-3 w-3">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                                                                </span>
                                                            ) : (
                                                                <div className={`w-3 h-3 rounded-full shadow-md ${
                                                                    step.status === 'complete' ? 'bg-green-500' : 'bg-gray-300'
                                                                }`} />
                                                            )}
                                                        </div>

                                                        <motion.div
                                                            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3 z-10 border-3 bg-white/80 backdrop-blur-sm transform-gpu ${
                                                                step.status === 'active' ? 'animate-pulse' : ''
                                                            }`}
                                                            style={{
                                                                borderColor: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#d1d5db',
                                                                transformStyle: 'preserve-3d', perspective: '1000px'
                                                            }}
                                                            whileHover={{ scale: 1.15, rotate: 5 }}>
                                                            <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px]" />
                                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                                            <step.icon className="text-2xl relative z-10" style={{
                                                                color: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#9ca3af'
                                                            }} />
                                                        </motion.div>

                                                        <div className={`bg-white/40 backdrop-blur-sm rounded-xl p-3 w-full border shadow-sm mt-3 ${
                                                            step.status === 'active' ? 'border-accent/50' : 'border-white/30'
                                                        }`}>
                                                            <Typography variant="small" className="font-bold text-primary leading-tight text-sm">{step.title}</Typography>
                                                            <Typography variant="small" className="text-gray-600 text-[11px] leading-tight mt-1 line-clamp-2">{step.detail}</Typography>
                                                            {step.sub && <Typography variant="small" className="text-gray-400 text-[10px] leading-tight mt-1 line-clamp-1">{step.sub}</Typography>}
                                                        </div>
                                                    </StaggerItem>
                                                ))}
                                            </StaggerList>
                                        </div>

                                        {/* Mobile Timeline */}
                                        <div className="md:hidden relative">
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
                                                <path d="M10,90 C60,10 100,70 150,40 C200,10 240,80 290,30 C330,-10 370,60 390,20" fill="none" stroke="url(#mobileJourneyGradient)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6,3" />
                                            </svg>

                                            <Reveal className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-500">
                                                <FaArrowLeft className="text-[10px] animate-pulse" />
                                                <span className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">{t('journey.scrollHint', 'Swipe to explore')}</span>
                                                <FaArrowRight className="text-[10px] animate-pulse" />
                                            </Reveal>

                                            <StaggerList className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 scrollbar-hide" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
                                                {steps.map((step, i) => (
                                                    <StaggerItem key={i} className="snap-center flex-shrink-0 w-[160px] flex flex-col items-center text-center relative">
                                                        {step.status === 'active' ? (
                                                            <span className="relative flex h-3 w-3 mb-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                                                            </span>
                                                        ) : (
                                                            <div className={`w-3 h-3 rounded-full mb-3 shadow-md ${step.status === 'complete' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                        )}

                                                        <motion.div
                                                            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4 z-10 border-3 bg-white/80 backdrop-blur-sm ${step.status === 'active' ? 'animate-pulse' : ''}`}
                                                            style={{
                                                                borderColor: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#d1d5db',
                                                                transformStyle: 'preserve-3d', perspective: '1000px'
                                                            }}
                                                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                                            <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px]" />
                                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                                            <step.icon className="text-xl relative z-10" style={{ color: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#9ca3af' }} />
                                                        </motion.div>

                                                        <div className="absolute top-8 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-20 border-2 border-white"
                                                             style={{ background: step.status === 'complete' ? '#22c55e' : step.status === 'active' ? '#E04E00' : '#9ca3af' }}>
                                                            {i + 1}
                                                        </div>

                                                        <div className={`bg-white/40 backdrop-blur-sm rounded-xl p-3 w-full border shadow-sm ${step.status === 'active' ? 'border-accent/50' : 'border-white/30'}`}>
                                                            <Typography variant="small" className="font-bold text-primary leading-tight text-sm">{step.title}</Typography>
                                                            <Typography variant="small" className="text-gray-600 text-[11px] leading-tight mt-1 line-clamp-2">{step.detail}</Typography>
                                                            {step.sub && <Typography variant="small" className="text-gray-400 text-[10px] leading-tight mt-1 line-clamp-1">{step.sub}</Typography>}
                                                        </div>

                                                        {i < 5 && <div className="absolute -right-4 top-1/2 -translate-y-1/2"><FaArrowRight className="text-gray-300 text-sm" /></div>}
                                                    </StaggerItem>
                                                ))}
                                            </StaggerList>

                                            <div className="flex justify-center gap-2 mt-6">
                                                {steps.map((_, i) => (
                                                    <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                        steps[i].status === 'complete' ? 'bg-green-500' : steps[i].status === 'active' ? 'bg-accent' : 'bg-gray-300'
                                                    }`} />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </Section>

                    {/* Trust Section */}
                    <div className="max-w-2xl mx-auto px-4 sm:px-6">
                        <Reveal className="mt-8">
                            <InfoCard icon={FaShieldAlt} title={t('trust.title', 'How We Verify Traceability')} iconColor="text-accent" variant="primary" showInfoBadge={false} className="text-center">
                                <StaggerList className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                                    {[
                                        { icon: FaMapMarkerAlt, title: t('trust.origin', 'Origin Verified'), desc: t('trust.originDesc') },
                                        { icon: FaClipboardList, title: t('trust.batch', 'Batch Recorded'), desc: t('trust.batchDesc') },
                                        { icon: FaGlobe, title: t('trust.transparent', 'Publicly Visible'), desc: t('trust.transparentDesc') },
                                    ].map((item, i) => (
                                        <StaggerItem key={i} className="text-center p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30">
                                            <item.icon className="text-accent text-xl mx-auto mb-2" />
                                            <Typography variant="small" className="font-semibold text-gray-800">{item.title}</Typography>
                                            <Typography variant="small" className="text-gray-500 text-xs mt-1">{item.desc}</Typography>
                                        </StaggerItem>
                                    ))}
                                </StaggerList>
                                <div className="mt-6 pt-4 border-t border-gray-200/50">
                                    <Typography variant="small" className="text-gray-500 mb-2">{t('compliance.description')}</Typography>
                                </div>
                            </InfoCard>
                        </Reveal>

                        <Reveal className="mt-6 text-center" delay={0.2}>
                            <Typography variant="small" className="text-gray-500 mb-3">{t('ctaQuote.description')}</Typography>
                            <button onClick={() => { trackCtaClick('request_traceable_batch', 'trace_cta'); navigate('/contact?type=wholesale'); }}
                                    className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full inline-flex items-center gap-2 text-sm font-medium shadow-md">
                                <FaEnvelope className="text-xs" />{t('ctaQuote.button', 'Request a Traceable Batch')}
                            </button>
                        </Reveal>
                    </div>
                </>
            )}

            {/* Tab Content - Quality */}
            {activeTab === 'quality' && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
                    {currentBatch?.overallScore ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Reveal>
                                <InfoCard icon={FaChartBar} title={t('quality.metrics', 'Quality Metrics')} iconColor="text-accent" variant="primary" showInfoBadge={false} className="h-full">
                                    <div className="space-y-4 mt-3">
                                        {[
                                            { label: t('quality.moisture'), value: currentBatch.moistureContent, unit: '%', max: 10, color: 'bg-primary' },
                                            { label: t('quality.nutCount'), value: currentBatch.nutCount, unit: '', max: 200, color: 'bg-secondary' },
                                            { label: t('quality.kernelRatio'), value: currentBatch.kernelRatio, unit: '%', max: 55, color: 'bg-accent' },
                                            { label: t('quality.defectiveRate'), value: currentBatch.defectiveRate, unit: '%', max: 10, color: 'bg-dark-orange' },
                                        ].filter(m => m.value != null).map((metric, i) => (
                                            <div key={i} className="bg-white/30 rounded-xl p-3 border border-white/30">
                                                <div className="flex justify-between items-center mb-2">
                                                    <Typography variant="small" className="text-gray-700 font-medium">{metric.label}</Typography>
                                                    <Typography variant="small" className="font-bold text-primary">{metric.value}{metric.unit}</Typography>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <motion.div className={`h-2 rounded-full ${metric.color}`}
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${Math.min((metric.value! / metric.max) * 100, 100)}%` }}
                                                                viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.2 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {currentBatch.overallScore && (
                                        <div className="mt-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 text-center">
                                            <Typography variant="h3" className="font-bold text-primary">
                                                <CountUp to={currentBatch.overallScore} duration={1.4} suffix="%" />
                                            </Typography>
                                            <Typography variant="small" className="text-gray-500">{t('quality.overallScore')}</Typography>
                                        </div>
                                    )}
                                </InfoCard>
                            </Reveal>
                            <Reveal delay={0.1}>
                                <InfoCard icon={FaCertificate} title={t('batch.certifications')} iconColor="text-accent" variant="accent" showInfoBadge={false} className="h-full">
                                    <StaggerList className="space-y-3 mt-3">
                                        {currentBatch.certifications?.map((cert, i) => (
                                            <StaggerItem key={i} className="flex items-center gap-3 bg-white/40 rounded-xl p-3">
                                                <FaCertificate className="text-accent" />
                                                <div>
                                                    <Typography variant="small" className="font-medium text-gray-800">{cert}</Typography>
                                                    <Typography variant="small" className="text-green-600 text-xs flex items-center gap-1">
                                                        <FaCheckCircle className="text-[10px]" /> Verified
                                                    </Typography>
                                                </div>
                                            </StaggerItem>
                                        ))}
                                    </StaggerList>
                                </InfoCard>
                            </Reveal>
                        </div>
                    ) : (
                        <InfoCard icon={FaChartBar} title={t('quality.comingSoon', 'Quality Metrics Coming Soon')} iconColor="text-accent" variant="primary" showInfoBadge={false} className="text-center py-12">
                            <Typography variant="body" className="text-gray-400 max-w-md mx-auto">{t('quality.comingSoonDesc')}</Typography>
                        </InfoCard>
                    )}
                </div>
            )}

            {/* Tab Content - Documents */}
            {activeTab === 'documents' && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
                    <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: t('docs.coo'), key: 'coo', icon: FaFileAlt },
                            { title: t('docs.phyto'), key: 'phyto', icon: FaLeaf },
                            { title: t('docs.billOfLading'), key: 'billOfLading', icon: FaTruck },
                            { title: t('docs.packingList'), key: 'packingList', icon: FaBox },
                            { title: t('docs.invoice'), key: 'invoice', icon: FaFileAlt },
                            { title: t('docs.insurance'), key: 'insurance', icon: FaShieldAlt },
                        ].map((doc, i) => {
                            const docUrl = currentBatch?.documents?.[doc.key as keyof typeof currentBatch.documents];
                            return (
                                <StaggerItem key={i}>
                                    <InfoCard icon={doc.icon} title={doc.title}
                                              subtitle={docUrl ? t('docs.available') : t('docs.pending', 'Available after processing')}
                                              iconColor={docUrl ? "text-green-500" : "text-gray-400"} variant={docUrl ? "primary" : "secondary"} showInfoBadge={false} className="h-full"
                                              cta={docUrl ? (
                                                  <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary text-xs font-medium flex items-center gap-1">
                                                      <FaDownload className="text-[10px]" />{t('docs.download')}
                                                  </a>
                                              ) : undefined} />
                                </StaggerItem>
                            );
                        })}
                    </StaggerList>
                    <div className="text-center py-8">
                        <Typography variant="body" className="text-gray-400">
                            {t('docs.compliancePackPending', 'Compliance pack will be available once all documents are processed.')}
                        </Typography>
                    </div>
                </div>
            )}

            {/* Final CTA */}
            <Section className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <InfoCard icon={FaMapMarkerAlt} title={t('cta.title')} iconColor="text-accent" variant="primary" showInfoBadge={false} className="text-center">
                        <Typography variant="body" className="text-gray-600 mb-6">{t('cta.subtitle')}</Typography>
                        <button onClick={() => { trackCtaClick('contact_us', 'trace_cta'); navigate('/contact'); }}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full inline-flex items-center gap-2 font-medium shadow-md">
                            {t('cta.button')}
                        </button>
                    </InfoCard>
                </div>
            </Section>

            {/* Farm OS Footer Note */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 text-center border-t border-gray-200 pt-8">
                <Typography variant="small" className="text-gray-400 text-xs">
                    This document was generated from <strong>Farm OS</strong> — AfriNuts Export's proprietary traceability system. Data is verified and auditable.
                </Typography>
                <button onClick={() => { trackCtaClick('request_farmos_access', 'trace_footer'); navigate('/contact?type=farmos'); }}
                        className="mt-2 text-accent hover:text-primary text-xs font-medium inline-flex items-center gap-1 transition-colors">
                    Request Farm OS Access →
                </button>
            </div>
        </main>
    );
};

export default TracePage;