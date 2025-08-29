import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaCertificate,
    FaLeaf,
    FaHandshake,
    FaShieldAlt,
    FaStar,
    FaGlobe,
    FaDownload,
    FaArrowRight,
    FaArrowLeft,
    FaCheckCircle,
    FaClock,
    FaAward,
    FaKaaba
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
                                className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-accent transition-colors"
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