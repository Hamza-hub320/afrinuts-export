import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Section from "@/components/Section/Section";
import { Reveal, StaggerList, StaggerItem } from "@/components/Reveal";
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import {
    FaSearch, FaMapMarkerAlt, FaClipboardList, FaGlobeAfrica,
    FaShieldAlt, FaCertificate, FaTruck, FaBuilding, FaCheckCircle,
    FaClock, FaFlask, FaBox, FaMobile, FaChevronDown, FaHeart,
    FaQrcode, FaFileAlt, FaLeaf, FaChild, FaTree, FaPrint, FaShip,
    FaArrowLeft, FaShare, FaCopy, FaWhatsapp, FaTwitter, FaLinkedin, FaEnvelope, FaCalendarAlt
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
                    // We only take the public data
                    setBulkData(data as BulkData);
                    setBatch(null);
                } else {
                    // We only take the public data
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
            <main className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </main>
        );
    }

    // ========== PROMO PAGE (no batch found) ==========
    if (!batch && !bulkData) {
        const promoBatchId = query.get("batchId");
        return (
            <main className="text-text-dark font-sans">
                <Helmet>
                    <title>{t('seo.title', 'Cashew Traceability | Farm OS Verified Batch Tracking | AfriNuts Export')}</title>
                </Helmet>

                <Section className="flex items-center justify-center text-center min-h-[90vh]" animate={false}>
                    <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                                <FaQrcode className="inline mr-2 text-accent" />{t('page.title', 'AfriNuts Batch Traceability')}
                            </Typography>
                            <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                                {t('promo.heading', 'Not Just a Paper Trail. Farm OS Verified.')}
                            </motion.h1>
                            <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                                {t('promo.lead', 'Enter a batch ID to see harvest dates, GPS coordinates, quality metrics, and certification records — all pulled directly from our Farm OS.')}
                            </Typography>

                            <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto lg:mx-0">
                                <div className="relative">
                                    <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                                    <input type="text" placeholder={t('search.placeholder', 'Enter your Batch ID...')} value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                                           className="w-full pl-12 pr-20 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-dark-orange transition">
                                        {t('search.button', 'Trace')}
                                    </button>
                                </div>
                                {promoBatchId && promoBatchId.trim() !== '' && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-center lg:text-left">
                                        <Typography variant="small" className="text-amber-600 bg-amber-50/80 px-4 py-2 rounded-full inline-block">
                                            {t('search.notFound', 'Batch "{id}" not found. Please check and try again.', { id: promoBatchId })}
                                        </Typography>
                                    </motion.div>
                                )}
                            </form>

                            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                                <button onClick={() => window.location.href = '/trace?batchId=AFN-FARM-ORG-260710-34D1'} className="border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                    <FaFlask className="text-xs" />{t('demo.button', 'View Demo Batch')}
                                </button>
                                <button onClick={() => window.location.href = '/trace?batchId=MB-20260710-085'} className="border border-blue-400/40 text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                    <FaShip className="text-xs" />{t('demo.bulkButton', 'View Bulk Shipment')}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div className="flex-shrink-0 lg:ml-auto" variants={fadeIn} transition={{ delay: 0.2 }}>
                            <div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40">
                                <img src={traceHeroImage} alt="Farm OS Traceability" className="w-full h-full object-cover" />
                                <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                    <span className="text-primary text-[11px] font-semibold">Farm OS Verified</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </Section>

                <Section className="py-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Reveal className="text-center mb-8">
                            <Typography variant="h2" className="text-primary mb-3">{t('faq.title', 'Common Questions')}</Typography>
                        </Reveal>
                        <StaggerList className="space-y-3">
                            {[
                                { q: 'How do I find my batch ID?', a: 'Your batch ID is printed on the QR code sticker attached to every 50kg bag and on your Bill of Lading and Certificate of Origin.' },
                                { q: 'What if the batch ID doesn\'t work?', a: 'Check for typos — batch IDs are case-sensitive. If it still doesn\'t work, contact us at contact@afrinutsexport.com with your invoice number.' },
                                { q: 'Can I verify the digital signature independently?', a: 'Yes — every batch has a tamper-proof verification code you can check without login. The signature proves the data hasn\'t been altered since signing.' },
                                { q: "Who can see my batch record?", a: "Only someone with your unique tracking code. The code appears on the QR sticker on each bag, your Bill of Lading, and your Certificate of Origin. We don't publish batch records publicly." },
                            ].map((item, i) => (
                                <StaggerItem key={i}>
                                    <details className="group bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden">
                                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-white/30 transition-colors">
                                            <Typography variant="small" className="font-semibold text-primary">{item.q}</Typography>
                                            <FaChevronDown className="text-accent text-xs transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="px-4 pb-4">
                                            <Typography variant="small" className="text-gray-600 text-sm leading-relaxed">{item.a}</Typography>
                                        </div>
                                    </details>
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    </div>
                </Section>
            </main>
        );
    }

    // ========== SINGLE OR BULK FOUND (Public UI) ==========
    const displayTitle = bulkData ? bulkData.masterBatch.masterBatchNumber : batch?.batchId;
    const batchesToRender = bulkData ? bulkData.batches : (batch ? [batch] : []);

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>{displayTitle} | AfriNuts Traceability</title>
                <meta name="description" content={`Traceability record for ${displayTitle}. View harvest data, quality metrics, GPS coordinates, and certification verification. Powered by AfriNuts Farm OS.`} />
            </Helmet>

            {/* HERO */}
            <Section className="flex items-center justify-center text-center min-h-[50vh]" animate={false}>
                <motion.div className="max-w-3xl px-6 sm:px-8 py-12" variants={fadeIn} initial="hidden" animate="visible">
                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                        {bulkData ? <FaShip className="inline mr-3 text-blue-600" /> : <FaQrcode className="inline mr-3 text-accent" />}
                        {bulkData ? 'Bulk Shipment Traceability' : t('page.title')}
                    </Typography>
                    <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl font-display text-text-dark mb-6">{displayTitle}</Typography>
                    {bulkData && (
                        <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto">
                            {bulkData.masterBatch.shipmentName} · {bulkData.masterBatch.totalBatches} batches consolidated
                        </Typography>
                    )}
                    <Typography variant="lead" className="text-text-dark max-w-2xl mx-auto mt-2">
                        View block-level traceability data for your cashew shipment — harvest dates, GPS coordinates, quality metrics, certification verification, and tamper-proof digital signature. Powered by AfriNuts Farm OS.
                    </Typography>

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

            {/* Login CTA */}
            <Section className="py-4">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <Reveal>
                        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-blue-600 text-xl flex-shrink-0" />
                                <div>
                                    <Typography variant="small" className="font-semibold text-blue-800">{t('loginCta.title', 'You are viewing the public record')}</Typography>
                                    <Typography variant="small" className="text-blue-700 text-xs">{t('loginCta.body', 'Buyers can log in to see full documentation, lab results, farmer details, and chain of custody.')}</Typography>
                                </div>
                            </div>
                            <Link to="/portal/login" className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                {t('loginCta.button', 'Buyer Login')} →
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </Section>

            {/* Bulk Summary Banner */}
            {bulkData && (
                <Section className="py-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <InfoCard icon={FaShip} title={`Bulk Shipment: ${bulkData.masterBatch.masterBatchNumber}`}
                                  subtitle={`${bulkData.masterBatch.shipmentName} · ${bulkData.masterBatch.totalBatches} batches consolidated`}
                                  iconColor="text-blue-600" showInfoBadge={false}>
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
                                {t('batch.dossierName', 'The Batch Dossier')}
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