import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaCertificate,
    FaLeaf,
    FaHandshake,
    FaShieldAlt,
    FaGlobe,
    FaCheckCircle,
    FaClock,
    FaAward,
    FaKaaba,
    FaCrown,
    FaIndustry,
    FaMapMarkerAlt,
    FaMedal,
    FaArrowRight,
    FaInfoCircle,
    FaShoppingCart,
    FaChartLine,
    FaHandsHelping, FaClipboardCheck, FaBox
} from "react-icons/fa";
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Reveal, StaggerList, StaggerItem } from '@/components/Reveal';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import CertModal from "../components/CertModal/CertModal";
import CertCard from "../components/CertCard/CertCard";
import certificationHeroImage from '../assets/images/certification-hero.webp';
import { IconType } from "react-icons";
import { trackCtaClick, trackDownload } from '@/utils/analytics';
import { Helmet } from 'react-helmet-async';
import JsonLd from "@/components/Seo/JsonLd";
type CertStatus = "achieved" | "upcoming" | "in-progress";

const getIcon = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
        FaShoppingCart: FaShoppingCart,
        FaChartLine: FaChartLine,
        FaHandsHelping: FaHandsHelping
    };
    return icons[iconName] || FaShoppingCart;
};

const Certifications: React.FC = () => {
    const { t } = useTranslation('certifications');
    const navigate = useNavigate();
    const [activeCert, setActiveCert] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'achieved' | 'upcoming'>('all');

    interface Certification {
        id: string;
        title: string;
        icon: IconType;
        status: CertStatus;
        description: string;
        benefits: string[];
        validity: string;
        issuer: string;
        color: string;
        borderColor: string;
        iconColor: string;
    }

    const certifications: Certification[] = [
        {
            id: "organic",
            title: t('certifications.organic.title'),
            icon: FaLeaf,
            status: "upcoming",
            description: t('certifications.organic.description'),
            benefits: t('certifications.organic.benefits', { returnObjects: true }) as string[],
            validity: t('certifications.organic.validity'),
            issuer: 'ECOCERT',
            color: 'from-teal-500/20 to-green-400/20',
            borderColor: 'border-teal-400/30',
            iconColor: 'text-green-600'
        },
        {
            id: "fairtrade",
            title: t('certifications.fairtrade.title'),
            icon: FaHandshake,
            status: "upcoming",
            description: t('certifications.fairtrade.description'),
            benefits: t('certifications.fairtrade.benefits', { returnObjects: true }) as string[],
            validity: t('certifications.fairtrade.validity'),
            issuer: 'Fair Trade International',
            color: 'from-teal-500/20 to-green-400/20',
            borderColor: 'border-teal-400/30',
            iconColor: 'text-blue-600'
        },
        {
            id: "iso22000",
            title: t('certifications.iso22000.title'),
            icon: FaShieldAlt,
            status: "upcoming",
            description: t('certifications.iso22000.description'),
            benefits: t('certifications.iso22000.benefits', { returnObjects: true }) as string[],
            validity: t('certifications.iso22000.validity'),
            issuer: 'International Organization for Standardization',
            color: 'from-teal-500/20 to-green-400/20',
            borderColor: 'border-teal-400/30',
            iconColor: 'text-purple-600'
        },
        {
            id: "halal",
            title: t('certifications.halal.title'),
            icon: FaKaaba,
            status: "upcoming",
            description: t('certifications.halal.description'),
            benefits: t('certifications.halal.benefits', { returnObjects: true }) as string[],
            validity: t('certifications.halal.validity'),
            issuer: 'Halal Certification Authority',
            color: 'from-teal-500/20 to-green-400/20',
            borderColor: 'border-teal-400/30',
            iconColor: 'text-amber-600'
        },
        {
            id: "rainforest",
            title: t('certifications.rainforest.title'),
            icon: FaGlobe,
            status: "upcoming",
            description: t('certifications.rainforest.description'),
            benefits: t('certifications.rainforest.benefits', { returnObjects: true }) as string[],
            validity: t('certifications.rainforest.validity'),
            issuer: 'Rainforest Alliance',
            color: 'from-teal-500/20 to-green-400/20',
            borderColor: 'border-teal-400/30',
            iconColor: 'text-teal-600'
        }
    ];

    const filteredCerts = certifications.filter(cert =>
        filter === 'all' || cert.status === filter
    );

    const currentCert = activeCert ? certifications.find(c => c.id === activeCert) : null;

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>Certifications & Quality | Organic, Halal, ISO 22000 | AfriNuts Export</title>
                <meta name="description" content="Five international certifications in progress: Organic (ECOCERT), Halal, ISO 22000, Fair Trade, and Rainforest Alliance. Each certification unlocks a specific premium market for AfriNuts Export cashews." />
                <link rel="canonical" href="https://www.afrinutsexport.com/certifications" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Certifications & Quality Standards | AfriNuts Export",
                "description": "AfriNuts Export is pursuing Organic (ECOCERT), Halal, ISO 22000, Fair Trade, and Rainforest Alliance certifications for our cashew farm and future processing center in Odienné, Côte d'Ivoire.",
                "about": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "description": "Premium organic cashew exporter pursuing international certifications for farm-to-export traceability."
                }
            }} />

            {/* HERO — own mount animation */}
            <Section className="flex items-center justify-center text-center min-h-[90vh]" animate={false}>
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaCertificate className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                            {t('hero.title')}
                        </motion.h1>

                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                            {t('hero.lead', 'Most suppliers show you logos. We show you the audit trail behind them — digital records, batch-level tracking, and verifiable compliance data. Because a certificate without documentation is just a promise.')}
                        </Typography>

                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaShieldAlt}
                                title={t('hero.introTitle', 'Audit-Ready. Not Audit-Prepared.')}
                                variant="secondary"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('hero.description')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                <FaCheckCircle className="text-[10px]" /> {t('hero.badgeOrganic', 'Organic (2027)')}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                <FaCheckCircle className="text-[10px]" /> {t('hero.badgeHalal', 'Halal (2029)')}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                                <FaCheckCircle className="text-[10px]" /> {t('hero.badgeISO', 'ISO 22000 (2029)')}
                            </span>
                        </div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <button
                                onClick={() => document.getElementById('certifications-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaCertificate className="text-xs" />{t('hero.ctaView', 'View Certifications')}
                            </button>
                            <Link to="/wholesale" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaBox className="text-xs" />{t('hero.ctaWholesale', 'For Buyers')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={certificationHeroImage} alt="Certifications & Compliance" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">Certified & Compliant</span>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </Section>

            {/* INTRODUCTION */}
            <Section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-12">
                        <Typography variant="h2" className="mb-6">
                            {t('introduction.title')}
                        </Typography>
                        <Typography variant="body" className="max-w-4xl mx-auto text-base md:text-lg leading-relaxed">
                            {t('introduction.description')}
                        </Typography>
                    </Reveal>

                    <StaggerList className="grid md:grid-cols-3 gap-8 mb-16">
                        <StaggerItem>
                            <InfoCard icon={FaShieldAlt} title={t('values.quality.title')} variant="primary">
                                {t('values.quality.description')}
                            </InfoCard>
                        </StaggerItem>
                        <StaggerItem>
                            <InfoCard icon={FaHandshake} title={t('values.trust.title')} variant="accent">
                                {t('values.trust.description')}
                            </InfoCard>
                        </StaggerItem>
                        <StaggerItem>
                            <InfoCard icon={FaGlobe} title={t('values.global.title')} variant="secondary">
                                {t('values.global.description')}
                            </InfoCard>
                        </StaggerItem>
                    </StaggerList>
                </div>
            </Section>

            {/* CERTIFICATION FILTER */}
            <Section className="py-12" id="certifications-grid">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-12">
                        {/* Progress / Roadmap */}
                        {(() => {
                            const achievedCount = certifications.filter(c => c.status === 'achieved').length;
                            const upcomingCount = certifications.filter(c => c.status === 'upcoming').length;
                            const totalCount = certifications.length;
                            const percent = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;
                            return (
                                <div className="mb-8 flex flex-col items-center">
                                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                                        <div className="flex items-center justify-between mb-1 text-xs font-medium text-gray-700">
                                            <span className="text-primary">{achievedCount}/{totalCount} achieved</span>
                                            <span className="text-gray-500">{upcomingCount} upcoming</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        <Typography variant="h2" className="mb-4">
                            {t('certifications.title')}
                        </Typography>
                        <Typography variant="body" className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-8">
                            {t('certifications.description')}
                        </Typography>

                        {/* Filter buttons */}
                        <StaggerList className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm sm:text-base">
                            {[
                                { key: 'all', label: t('filters.all'), icon: FaCertificate },
                                { key: 'achieved', label: t('filters.achieved'), icon: FaCheckCircle },
                                { key: 'upcoming', label: t('filters.upcoming'), icon: FaClock }
                            ].map((filterItem) => (
                                <StaggerItem key={filterItem.key}>
                                    <motion.button
                                        onClick={() => setFilter(filterItem.key as 'all' | 'achieved' | 'upcoming')}
                                        className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                                            filter === filterItem.key
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'bg-white text-primary border-2 border-primary/30 hover:border-primary/50'
                                        }`}
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <filterItem.icon />
                                        <span>{filterItem.label}</span>
                                    </motion.button>
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    </Reveal>
                </div>
            </Section>

            {/* CERTIFICATIONS GRID */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {filteredCerts.length > 0 ? (
                        <StaggerList className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCerts.map((cert) => (
                                <StaggerItem key={cert.id} className="h-full">
                                    <CertCard
                                        icon={cert.icon}
                                        title={cert.title}
                                        description={cert.description}
                                        issuer={cert.issuer}
                                        status={cert.status}
                                        benefits={Array.isArray(cert.benefits) ? cert.benefits : []}
                                        validity={cert.validity}
                                        color={cert.color}
                                        borderColor={cert.borderColor}
                                        iconColor={cert.iconColor}
                                        onClick={() => setActiveCert(cert.id)}
                                    />
                                </StaggerItem>
                            ))}
                        </StaggerList>
                    ) : (
                        <Reveal className="text-center py-12">
                            <Typography variant="h3" className="mb-4 text-text-dark/60">
                                {t('noCertifications')}
                            </Typography>
                            <Typography variant="body">
                                {t('tryDifferentFilter')}
                            </Typography>
                        </Reveal>
                    )}
                </div>
            </Section>

            {/* MODAL */}
            {currentCert && (
                <CertModal
                    isOpen={!!currentCert}
                    onClose={() => setActiveCert(null)}
                    icon={currentCert.icon}
                    title={currentCert.title}
                    description={currentCert.description}
                    issuer={currentCert.issuer}
                    status={currentCert.status}
                    benefits={currentCert.benefits}
                    validity={currentCert.validity}
                    color={currentCert.color}
                    borderColor={currentCert.borderColor}
                    iconColor={currentCert.iconColor}
                />
            )}

            {/* COMPLIANCE FRAMEWORK */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-12">
                        <Typography variant="h2" className="mb-4">
                            {t('framework.title')}
                        </Typography>
                        <Typography variant="body" className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                            {t('framework.description')}
                        </Typography>
                    </Reveal>

                    <StaggerList className="grid md:grid-cols-2 gap-8">
                        <StaggerItem>
                            {(() => {
                                const qualityFeatures = t('framework.quality.features', { returnObjects: true }) as string[];
                                return (
                                    <InfoCard icon={FaAward} title={t('framework.quality.title')} variant="primary" className="h-full">
                                        <ul className="space-y-3">
                                            {Array.isArray(qualityFeatures) && qualityFeatures.map((feature, index) => (
                                                <li key={index} className="flex items-start">
                                                    <FaCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                                                    <Typography variant="body">{feature}</Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </InfoCard>
                                );
                            })()}
                        </StaggerItem>

                        <StaggerItem>
                            {(() => {
                                const complianceFeatures = t('framework.compliance.features', { returnObjects: true }) as string[];
                                return (
                                    <InfoCard icon={FaShieldAlt} title={t('framework.compliance.title')} variant="accent" className="h-full">
                                        <ul className="space-y-3">
                                            {Array.isArray(complianceFeatures) && complianceFeatures.map((feature, index) => (
                                                <li key={index} className="flex items-start">
                                                    <FaCheckCircle className="text-accent mt-1 mr-3 flex-shrink-0" />
                                                    <Typography variant="body">{feature}</Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </InfoCard>
                                );
                            })()}
                        </StaggerItem>
                    </StaggerList>
                </div>
            </Section>

            {/* COMPETITIVE ADVANTAGE */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-12">
                        <Typography variant="h2" className="mb-4">
                            {t('competitiveLandscape.title', "Our Competitive Advantage")}
                        </Typography>
                        <Typography variant="body" className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                            {t('competitiveLandscape.description', "In a crowded global market, AfriNuts stands apart through our unique combination of origin story, quality certifications, and vertical integration.")}
                        </Typography>
                    </Reveal>

                    <StaggerList className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StaggerItem>
                            <InfoCard icon={FaMapMarkerAlt} title={t('competitiveLandscape.origin.title', "Single-Origin")} variant="primary" className="text-center">
                                {t('competitiveLandscape.origin.description', "Direct from Ivory Coast, the world's largest producer")}
                            </InfoCard>
                        </StaggerItem>
                        <StaggerItem>
                            <InfoCard icon={FaMedal} title={t('competitiveLandscape.quality.title', "Premium Quality")} variant="accent" className="text-center">
                                {t('competitiveLandscape.quality.description', "Certified organic and fair trade practices")}
                            </InfoCard>
                        </StaggerItem>
                        <StaggerItem>
                            <InfoCard icon={FaIndustry} title={t('competitiveLandscape.vertical.title', "Vertical Integration")} variant="secondary" className="text-center">
                                {t('competitiveLandscape.vertical.description', "Full control from farm to export")}
                            </InfoCard>
                        </StaggerItem>
                        <StaggerItem>
                            <InfoCard icon={FaCrown} title={t('competitiveLandscape.premium.title', "Premium Positioning")} variant="primary" className="text-center">
                                {t('competitiveLandscape.premium.description', "Competing on quality, not just price")}
                            </InfoCard>
                        </StaggerItem>
                    </StaggerList>

                    {/* Why Certifications Matter */}
                    <Section className="py-0">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <Reveal className="text-center mb-12">
                                <Typography variant="h2" className="mb-4">
                                    {t('whyCertifications.title')}
                                </Typography>
                                <Typography variant="body" className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                                    {t('whyCertifications.subtitle')}
                                </Typography>
                            </Reveal>

                            {(() => {
                                let itemsArray: any[] = [];
                                try {
                                    const result = t('whyCertifications.items', { returnObjects: true });
                                    if (Array.isArray(result)) {
                                        itemsArray = result;
                                    }
                                } catch (error) {
                                    console.error('Error loading whyCertifications.items:', error);
                                }

                                if (itemsArray.length === 0) {
                                    return (
                                        <div className="text-center py-8">
                                            <Typography variant="body" className="text-gray-500">
                                                Loading certification information...
                                            </Typography>
                                        </div>
                                    );
                                }

                                return (
                                    <StaggerList className="grid md:grid-cols-3 gap-8">
                                        {itemsArray.map((item: any, index: number) => {
                                            const getIconComponent = (iconName: string) => {
                                                switch (iconName) {
                                                    case 'FaShoppingCart': return <FaShoppingCart />;
                                                    case 'FaChartLine': return <FaChartLine />;
                                                    case 'FaHandsHelping': return <FaHandsHelping />;
                                                    default: return <FaShoppingCart />;
                                                }
                                            };

                                            return (
                                                <StaggerItem key={item.title || index}>
                                                    <InfoCard
                                                        icon={() => getIconComponent(item.icon)}
                                                        title={item.title}
                                                        iconColor="text-accent"
                                                        className="h-full"
                                                    >
                                                        <div className="space-y-4">
                                                            <ul className="space-y-2">
                                                                {(item.points || []).map((point: string, idx: number) => (
                                                                    <li key={idx} className="flex items-start gap-2">
                                                                        <FaCheckCircle className="text-accent mt-1 flex-shrink-0 text-sm" />
                                                                        <Typography variant="body" className="text-text-dark text-sm">
                                                                            {point}
                                                                        </Typography>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {item.ctaText && (
                                                                <motion.button
                                                                    onClick={() => {
                                                                        trackCtaClick(item.ctaText || 'certification_cta', 'why_certifications');
                                                                        navigate(item.ctaLink || '/contact');
                                                                    }}
                                                                    className="text-primary hover:text-accent font-medium flex items-center gap-2 transition-colors text-sm mt-2"
                                                                    whileHover={{ x: 3 }}
                                                                >
                                                                    {item.ctaText}
                                                                    <FaArrowRight className="text-sm" />
                                                                </motion.button>
                                                            )}
                                                        </div>
                                                    </InfoCard>
                                                </StaggerItem>
                                            );
                                        })}
                                    </StaggerList>
                                );
                            })()}

                            <Reveal className="mt-8 text-center p-4 bg-amber-50/80 rounded-xl border border-amber-200">
                                <Typography variant="small" className="text-amber-700">
                                    <FaInfoCircle className="inline mr-2" />
                                    {t('whyCertifications.note')}
                                </Typography>
                            </Reveal>
                        </div>
                    </Section>

                    {/* COMPETITIVE TABLE */}
                    <Reveal className="mt-12">
                        <motion.div
                            className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl overflow-hidden transform-gpu"
                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                            whileHover={{
                                y: -5,
                                scale: 1.01,
                                rotateY: 1,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                            <div className="relative z-10">
                                <div className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-white">
                                    <Typography variant="h3" className="!text-white">
                                        {t('competitiveLandscape.tableTitle', "Market Positioning Analysis")}
                                    </Typography>
                                </div>

                                <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-200">
                                    <div className="flex items-start gap-2">
                                        <FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0 text-xs" />
                                        <Typography variant="small" className="text-amber-700 text-xs">
                                            {t('competitiveLandscape.competitiveDisclaimer')}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="bg-white/30 backdrop-blur-sm">
                                            <th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveLandscape.competitorType', "Competitor Type")}</th>
                                            <th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveLandscape.theirAdvantage', "Their Advantage")}</th>
                                            <th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveLandscape.theirDisadvantage', "Their Disadvantage")}</th>
                                            <th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveLandscape.ourStrategy', "AfriNuts' Counter-Strategy")}</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200/50">
                                        <tr className="group/row hover:bg-white/20 transition-colors duration-300">
                                            <td className="px-6 py-4 font-medium text-text-dark">{t('competitiveLandscape.asianProcessors', "Large Asian Processors")}</td>
                                            <td className="px-6 py-4">{t('competitiveLandscape.asianAdvantage', "Scale, established infrastructure, low-cost labor")}</td>
                                            <td className="px-6 py-4">{t('competitiveLandscape.asianDisadvantage', "Geographic disconnect from source, rising labor costs")}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start">
                                                    <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                                                        <FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                                                    </motion.div>
                                                    <span>{t('competitiveLandscape.asianStrategy', "Origin Story & Traceability: Single-Origin Ivory Coast traceability")}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="bg-white/10 group/row hover:bg-white/20 transition-colors duration-300">
                                            <td className="px-6 py-4 font-medium text-text-dark">{t('competitiveLandscape.localProcessors', "Local Ivorian Processors")}</td>
                                            <td className="px-6 py-4">{t('competitiveLandscape.localAdvantage', "Local presence, access to raw nuts")}</td>
                                            <td className="px-6 py-4">{t('competitiveLandscape.localDisadvantage', "Lack scale, international certifications, market access")}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start">
                                                    <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                                                        <FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                                                    </motion.div>
                                                    <span>{t('competitiveLandscape.localStrategy', "Certification & Quality: Meet highest international standards")}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="group/row hover:bg-white/20 transition-colors duration-300">
                                            <td className="px-6 py-4 font-medium text-text-dark">{t('competitiveLandscape.westernBrands', "Western Brands")}</td>
                                            <td className="px-6 py-4">{t('competitiveLandscape.westernAdvantage', "Strong consumer brands, market access")}</td>
                                            <td className="px-6 py-4">{t('competitiveLandscape.westernDisadvantage', "Reliant on imported kernels, disconnected from source")}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start">
                                                    <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                                                        <FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                                                    </motion.div>
                                                    <span>{t('competitiveLandscape.westernStrategy', "Vertical Integration: Control entire chain, ensure quality")}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile cards */}
                                <div className="md:hidden p-4 space-y-4">
                                    {[
                                        { titleKey: 'asianProcessors', advKey: 'asianAdvantage', disKey: 'asianDisadvantage', stratKey: 'asianStrategy', defaultTitle: 'Large Asian Processors', defaultAdv: 'Scale, established infrastructure, low-cost labor', defaultDis: 'Geographic disconnect from source, rising labor costs', defaultStrat: 'Origin Story & Traceability: Single-Origin Ivory Coast traceability' },
                                        { titleKey: 'localProcessors', advKey: 'localAdvantage', disKey: 'localDisadvantage', stratKey: 'localStrategy', defaultTitle: 'Local Ivorian Processors', defaultAdv: 'Local presence, access to raw nuts', defaultDis: 'Lack scale, international certifications, market access', defaultStrat: 'Certification & Quality: Meet highest international standards' },
                                        { titleKey: 'westernBrands', advKey: 'westernAdvantage', disKey: 'westernDisadvantage', stratKey: 'westernStrategy', defaultTitle: 'Western Brands', defaultAdv: 'Strong consumer brands, market access', defaultDis: 'Reliant on imported kernels, disconnected from source', defaultStrat: 'Vertical Integration: Control entire chain, ensure quality' }
                                    ].map((row, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                                            whileHover={{ y: -2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <h4 className="font-semibold text-primary mb-2">{t(`competitiveLandscape.${row.titleKey}`, row.defaultTitle)}</h4>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium">✓ {t('competitiveLandscape.theirAdvantage', "Their Advantage")}:</span>
                                                    <p>{t(`competitiveLandscape.${row.advKey}`, row.defaultAdv)}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium">✗ {t('competitiveLandscape.theirDisadvantage', "Their Disadvantage")}:</span>
                                                    <p>{t(`competitiveLandscape.${row.disKey}`, row.defaultDis)}</p>
                                                </div>
                                                <div className="bg-primary/10 p-3 rounded-lg mt-2">
                                                    <span className="font-medium flex items-center gap-2">
                                                        <FaCrown className="text-primary" />
                                                        {t('competitiveLandscape.ourStrategy', "AfriNuts' Counter-Strategy")}:
                                                    </span>
                                                    <p>{t(`competitiveLandscape.${row.stratKey}`, row.defaultStrat)}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </Reveal>

                    {/* UNIQUE VALUE PROP */}
                    <Reveal className="mt-12">
                        <motion.div
                            className="group relative bg-gradient-to-r from-primary to-accent border-2 border-primary/30 transition-all duration-500 rounded-2xl p-8 text-white text-center transform-gpu overflow-hidden"
                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                            whileHover={{
                                y: -5,
                                scale: 1.02,
                                boxShadow: '0 25px 50px -12px rgba(165, 105, 66, 0.4)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.2)_0%,_rgba(255,255,255,0)_70%)] opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-10" />

                            <div className="relative z-10">
                                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }} className="inline-block mb-4">
                                    <FaCrown className="text-4xl mx-auto text-white/90" />
                                </motion.div>
                                <Typography variant="h3" className="!text-white mb-4">
                                    {t('competitiveLandscape.uniqueValue.title', "AfriNuts' Unique Competitive Edge")}
                                </Typography>
                                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                                    <Typography variant="lead" className="!text-white/90 max-w-4xl mx-auto">
                                        {t('competitiveLandscape.uniqueValue.description', "Our vertical integration combined with local expertise and certification strategy allows us to offer what no other player can: premium, certified, traceable cashews from a transparent, socially responsible source in the heart of the world's largest producing region.")}
                                    </Typography>
                                </motion.div>
                            </div>
                        </motion.div>
                    </Reveal>
                </div>
            </Section>

            {/* CALL TO ACTION */}
            <Section className="py-16 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <Reveal>
                        <InfoCard icon={FaCertificate} title={t('cta.title')} variant="primary" className="text-center">
                            <Typography variant="lead" className="text-text-dark mb-8">
                                {t('cta.description')}
                            </Typography>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    className="group relative bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md transform-gpu"
                                    whileHover={{ y: -2, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        trackCtaClick('request_info', 'certifications_page');
                                        navigate('/contact');
                                    }}
                                >
                                    {t('cta.contactButton')}
                                </motion.button>
                                <motion.button
                                    className="px-8 py-3 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary/10 transition-colors"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('cta.downloadButton')}
                                </motion.button>
                            </div>
                        </InfoCard>
                    </Reveal>
                </div>
            </Section>
        </main>
    );
};

export default Certifications;