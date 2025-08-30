import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaCertificate,
    FaLeaf,
    FaHandshake,
    FaShieldAlt,
    FaGlobe,
    FaArrowLeft,
    FaCheckCircle,
    FaClock,
    FaAward,
    FaKaaba,
    FaCrown, FaIndustry, FaMapMarkerAlt, FaMedal
} from "react-icons/fa";
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import CertModal from "../components/CertModal/CertModal";
import CertCard from "../components/CertCard/CertCard";
type CertStatus = "achieved" | "upcoming";

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
            status: "achieved",
            description: t('certifications.organic.description'),
            benefits: t('certifications.organic.benefits', { returnObjects: true }) as string[],
            validity: t('certifications.organic.validity'),
            issuer: 'ECOCERT',
            color: 'from-green-500/20 to-emerald-400/20',
            borderColor: 'border-green-400/30',
            iconColor: 'text-green-600'
        },
        {
            id: "fairtrade",
            title: t('certifications.fairtrade.title'),
            icon: FaHandshake,
            status: "achieved",
            description: t('certifications.fairtrade.description'),
            benefits: t('certifications.fairtrade.benefits', { returnObjects: true }) as string[],
            validity: t('certifications.fairtrade.validity'),
            issuer: 'Fair Trade International',
            color: 'from-blue-500/20 to-cyan-400/20',
            borderColor: 'border-blue-400/30',
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
            color: 'from-purple-500/20 to-indigo-400/20',
            borderColor: 'border-purple-400/30',
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
            color: 'from-amber-500/20 to-yellow-400/20',
            borderColor: 'border-amber-400/30',
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
            {/* Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[60vh] bg-gradient-to-b from-primary/10 to-transparent"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="subhead"
                            className="uppercase tracking-widest text-primary mb-4"
                        >
                            {t('hero.subtitle')}
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        {t('hero.title')}
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="lead"
                            className="text-text-dark max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('hero.description')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
                </div>
            </motion.div>

            {/* Back Button */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.button
                        onClick={() => navigate('/products')}
                        className="flex items-center text-primary hover:text-accent transition-colors"
                        whileHover={{ x: -5 }}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        <FaArrowLeft className="mr-2" />
                        {t('backToProducts')}
                    </motion.button>
                </div>
            </Section>

            {/* Introduction */}
            <Section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-6">
                            {t('introduction.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-4xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('introduction.description')}
                        </Typography>
                    </motion.div>

                    {/* Value Proposition Grid */}
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <InfoCard
                            icon={FaShieldAlt}
                            title={t('values.quality.title')}
                            variant="primary"
                        >
                            {t('values.quality.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaHandshake}
                            title={t('values.trust.title')}
                            variant="accent"
                        >
                            {t('values.trust.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaGlobe}
                            title={t('values.global.title')}
                            variant="secondary"
                        >
                            {t('values.global.description')}
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            {/* Certification Filter */}
            <Section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        {/* Progress / Roadmap Section */}
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
                        {/* Filter Title and Description */}
                        <Typography variant="h2" className="mb-4">
                            {t('certifications.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-8"
                        >
                            {t('certifications.description')}
                        </Typography>
                        {/* Filter Buttons */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-sm sm:text-base">
                            {[
                                { key: 'all', label: t('filters.all'), icon: FaCertificate },
                                { key: 'achieved', label: t('filters.achieved'), icon: FaCheckCircle },
                                { key: 'upcoming', label: t('filters.upcoming'), icon: FaClock }
                            ].map((filterItem) => (
                                <motion.button
                                    key={filterItem.key}
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
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Certifications Grid */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {filteredCerts.length > 0 ? filteredCerts.map((cert) => (
                            <div
                                key={cert.id}
                                className="h-full"
                            >
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
                            </div>
                        )) : (
                            <motion.div
                                className="text-center py-12"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                            >
                                <Typography variant="h3" className="mb-4 text-text-dark/60">
                                    {t('noCertifications')}
                                </Typography>
                                <Typography variant="body">
                                    {t('tryDifferentFilter')}
                                </Typography>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </Section>

            {/* Certification Detail Modal */}
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

            {/* Compliance Framework */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('framework.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('framework.description')}
                        </Typography>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {(() => {
                            const qualityFeatures = t('framework.quality.features', { returnObjects: true }) as string[];
                            return (
                                <InfoCard
                                    icon={FaAward}
                                    title={t('framework.quality.title')}
                                    variant="primary"
                                >
                                    <ul className="space-y-3">
                                        {Array.isArray(qualityFeatures) ? qualityFeatures.map((feature: string, index: number) => (
                                            <li key={index} className="flex items-start">
                                                <FaCheckCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                                                <Typography variant="body">
                                                    {feature}
                                                </Typography>
                                            </li>
                                        )) : null}
                                    </ul>
                                </InfoCard>
                            );
                        })()}

                        {(() => {
                            const complianceFeatures = t('framework.compliance.features', { returnObjects: true }) as string[];
                            return (
                                <InfoCard
                                    icon={FaShieldAlt}
                                    title={t('framework.compliance.title')}
                                    variant="accent"
                                >
                                    <ul className="space-y-3">
                                        {Array.isArray(complianceFeatures) ? complianceFeatures.map((feature: string, index: number) => (
                                            <li key={index} className="flex items-start">
                                                <FaCheckCircle className="text-accent mt-1 mr-3 flex-shrink-0" />
                                                <Typography variant="body">
                                                    {feature}
                                                </Typography>
                                            </li>
                                        )) : null}
                                    </ul>
                                </InfoCard>
                            );
                        })()}
                    </div>
                </div>
            </Section>

            {/* Competitive Advantage Section */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('competitiveLandscape.title', "Our Competitive Advantage")}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('competitiveLandscape.description', "In a crowded global market, AfriNuts stands apart through our unique combination of origin story, quality certifications, and vertical integration.")}
                        </Typography>
                    </motion.div>

                    {/* Competitive Advantage Summary */}
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <InfoCard
                            icon={FaMapMarkerAlt}
                            title={t('competitiveLandscape.origin.title', "Single-Origin")}
                            variant="primary"
                            className="text-center"
                        >
                            {t('competitiveLandscape.origin.description', "Direct from Ivory Coast, the world's largest producer")}
                        </InfoCard>

                        <InfoCard
                            icon={FaMedal}
                            title={t('competitiveLandscape.quality.title', "Premium Quality")}
                            variant="accent"
                            className="text-center"
                        >
                            {t('competitiveLandscape.quality.description', "Certified organic and fair trade practices")}
                        </InfoCard>

                        <InfoCard
                            icon={FaIndustry}
                            title={t('competitiveLandscape.vertical.title', "Vertical Integration")}
                            variant="secondary"
                            className="text-center"
                        >
                            {t('competitiveLandscape.vertical.description', "Full control from farm to export")}
                        </InfoCard>

                        <InfoCard
                            icon={FaCrown}
                            title={t('competitiveLandscape.premium.title', "Premium Positioning")}
                            variant="primary"
                            className="text-center"
                        >
                            {t('competitiveLandscape.premium.description', "Competing on quality, not just price")}
                        </InfoCard>
                    </motion.div>

                    {/* Competitive Analysis Table - Responsive */}
                    <motion.div
                        className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl overflow-hidden transform-gpu"
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        whileHover={{
                            y: -5,
                            scale: 1.01,
                            rotateY: 1,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <div className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-white">
                                <Typography variant="h3" className="!text-white">
                                    {t('competitiveLandscape.tableTitle', "Market Positioning Analysis")}
                                </Typography>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="bg-white/30 backdrop-blur-sm">
                                        <th className="px-6 py-4 text-left font-semibold text-text-dark">
                                            {t('competitiveLandscape.competitorType', "Competitor Type")}
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-text-dark">
                                            {t('competitiveLandscape.theirAdvantage', "Their Advantage")}
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-text-dark">
                                            {t('competitiveLandscape.theirDisadvantage', "Their Disadvantage")}
                                        </th>
                                        <th className="px-6 py-4 text-left font-semibold text-text-dark">
                                            {t('competitiveLandscape.ourStrategy', "AfriNuts' Counter-Strategy")}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200/50">
                                    <tr className="group/row hover:bg-white/20 transition-colors duration-300">
                                        <td className="px-6 py-4 font-medium text-text-dark">
                                            {t('competitiveLandscape.asianProcessors', "Large Asian Processors")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t('competitiveLandscape.asianAdvantage', "Scale, established infrastructure, low-cost labor")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t('competitiveLandscape.asianDisadvantage', "Geographic disconnect from source, rising labor costs")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <motion.div
                                                    whileHover={{ scale: 1.2 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                                                </motion.div>
                                                <span>{t('competitiveLandscape.asianStrategy', "Origin Story & Traceability: Single-Origin Ivory Coast traceability")}</span>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="bg-white/10 group/row hover:bg-white/20 transition-colors duration-300">
                                        <td className="px-6 py-4 font-medium text-text-dark">
                                            {t('competitiveLandscape.localProcessors', "Local Ivorian Processors")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t('competitiveLandscape.localAdvantage', "Local presence, access to raw nuts")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t('competitiveLandscape.localDisadvantage', "Lack scale, international certifications, market access")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <motion.div
                                                    whileHover={{ scale: 1.2 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                                                </motion.div>
                                                <span>{t('competitiveLandscape.localStrategy', "Certification & Quality: Meet highest international standards")}</span>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr className="group/row hover:bg-white/20 transition-colors duration-300">
                                        <td className="px-6 py-4 font-medium text-text-dark">
                                            {t('competitiveLandscape.westernBrands', "Western Brands")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t('competitiveLandscape.westernAdvantage', "Strong consumer brands, market access")}
                                        </td>
                                        <td className="px-6 py-4">
                                            {t('competitiveLandscape.westernDisadvantage', "Reliant on imported kernels, disconnected from source")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <motion.div
                                                    whileHover={{ scale: 1.2 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                                                </motion.div>
                                                <span>{t('competitiveLandscape.westernStrategy', "Vertical Integration: Control entire chain, ensure quality")}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden p-4 space-y-4">
                                {/* Asian Processors Card */}
                                <motion.div
                                    className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h4 className="font-semibold text-primary mb-2">
                                        {t('competitiveLandscape.asianProcessors', "Large Asian Processors")}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">✓ {t('competitiveLandscape.theirAdvantage', "Their Advantage")}:</span>
                                            <p>{t('competitiveLandscape.asianAdvantage', "Scale, established infrastructure, low-cost labor")}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">✗ {t('competitiveLandscape.theirDisadvantage', "Their Disadvantage")}:</span>
                                            <p>{t('competitiveLandscape.asianDisadvantage', "Geographic disconnect from source, rising labor costs")}</p>
                                        </div>
                                        <div className="bg-primary/10 p-3 rounded-lg mt-2">
                                            <span className="font-medium flex items-center gap-2">
                                                <FaCrown className="text-primary" />
                                                {t('competitiveLandscape.ourStrategy', "AfriNuts' Counter-Strategy")}:
                                            </span>
                                            <p>{t('competitiveLandscape.asianStrategy', "Origin Story & Traceability: Single-Origin Ivory Coast traceability")}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Local Processors Card */}
                                <motion.div
                                    className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h4 className="font-semibold text-primary mb-2">
                                        {t('competitiveLandscape.localProcessors', "Local Ivorian Processors")}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">✓ {t('competitiveLandscape.theirAdvantage', "Their Advantage")}:</span>
                                            <p>{t('competitiveLandscape.localAdvantage', "Local presence, access to raw nuts")}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">✗ {t('competitiveLandscape.theirDisadvantage', "Their Disadvantage")}:</span>
                                            <p>{t('competitiveLandscape.localDisadvantage', "Lack scale, international certifications, market access")}</p>
                                        </div>
                                        <div className="bg-primary/10 p-3 rounded-lg mt-2">
                                            <span className="font-medium flex items-center gap-2">
                                                <FaCrown className="text-primary" />
                                                {t('competitiveLandscape.ourStrategy', "AfriNuts' Counter-Strategy")}:
                                            </span>
                                            <p>{t('competitiveLandscape.localStrategy', "Certification & Quality: Meet highest international standards")}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Western Brands Card */}
                                <motion.div
                                    className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h4 className="font-semibold text-primary mb-2">
                                        {t('competitiveLandscape.westernBrands', "Western Brands")}
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">✓ {t('competitiveLandscape.theirAdvantage', "Their Advantage")}:</span>
                                            <p>{t('competitiveLandscape.westernAdvantage', "Strong consumer brands, market access")}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">✗ {t('competitiveLandscape.theirDisadvantage', "Their Disadvantage")}:</span>
                                            <p>{t('competitiveLandscape.westernDisadvantage', "Reliant on imported kernels, disconnected from source")}</p>
                                        </div>
                                        <div className="bg-primary/10 p-3 rounded-lg mt-2">
                                            <span className="font-medium flex items-center gap-2">
                                                <FaCrown className="text-primary" />
                                                {t('competitiveLandscape.ourStrategy', "AfriNuts' Counter-Strategy")}:
                                            </span>
                                            <p>{t('competitiveLandscape.westernStrategy', "Vertical Integration: Control entire chain, ensure quality")}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>


                    {/* Unique Value Proposition */}
                    <div className="mt-12">
                        <motion.div
                            className="group relative bg-gradient-to-r from-primary to-accent border-2 border-primary/30 transition-all duration-500 rounded-2xl p-8 text-white text-center transform-gpu overflow-hidden"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            whileHover={{
                                y: -5,
                                scale: 1.02,
                                boxShadow: '0 25px 50px -12px rgba(165, 105, 66, 0.4)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* 3D edge effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                            {/* Glassy overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                            {/* Inner shine effect */}
                            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.2)_0%,_rgba(255,255,255,0)_70%)] opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-10" />

                            <div className="relative z-10">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="inline-block mb-4"
                                >
                                    <FaCrown className="text-4xl mx-auto text-white/90" />
                                </motion.div>

                                <Typography variant="h3" className="!text-white mb-4">
                                    {t('competitiveLandscape.uniqueValue.title', "AfriNuts' Unique Competitive Edge")}
                                </Typography>

                                <motion.div
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Typography variant="lead" className="!text-white/90 max-w-4xl mx-auto">
                                        {t('competitiveLandscape.uniqueValue.description', "Our vertical integration combined with local expertise and certification strategy allows us to offer what no other player can: premium, certified, traceable cashews from a transparent, socially responsible source in the heart of the world's largest producing region.")}
                                    </Typography>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* Call to Action */}
            <Section className="py-16 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <InfoCard
                        icon={FaCertificate}
                        title={t('cta.title')}
                        variant="primary"
                        className="text-center"
                    >
                        <Typography variant="lead" className="text-text-dark mb-8">
                            {t('cta.description')}
                        </Typography>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                className="group relative bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md transform-gpu hover:scale-105"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/contact')}
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
                </div>
            </Section>
        </main>
    );
};

export default Certifications;