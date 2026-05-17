import React from 'react';
import { useTranslation } from 'react-i18next';
import {Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackCtaClick } from '@/utils/analytics';
import {
    FaLeaf,
    FaUsers,
    FaIndustry,
    FaHandshake,
    FaChartLine,
    FaGlobe,
    FaSolarPanel,
    FaWater,
    FaTree,
    FaSeedling, FaCheckCircle, FaArrowRight
} from "react-icons/fa";

import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer, slideInFromLeft, slideInFromRight } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import visionHeroImage from '@/assets/images/vision-hero.webp';
import farmImage from '@/assets/images/farm-vision.webp';
import processingImage from '@/assets/images/processing-vision.webp';
import { IconType } from 'react-icons';
import {TimelineCard} from "@/components/TimelineCard/TimelineCard";

const Vision: React.FC = () => {
    const { t } = useTranslation('vision');
    const navigate = useNavigate();

    // Helper function with proper typing
    const getIconComponent = (iconName: string): IconType => {
        const icons: Record<string, IconType> = {
            FaLeaf,
            FaUsers,
            FaIndustry,
            FaHandshake,
            FaChartLine,
            FaGlobe,
            FaSolarPanel,
            FaWater,
            FaTree,
            FaSeedling
        };
        return icons[iconName] || FaGlobe;
    };

    // Helper for roadmap section: returns an icon based on roadmap item title
    const getRoadmapIcon = (title: string): IconType => {
        // Normalize for case-insensitive matching
        const normalized = title.toLowerCase();
        if (normalized.includes("foundation")) return FaLeaf;
        if (normalized.includes("certification")) return FaHandshake;
        if (normalized.includes("investment")) return FaChartLine;
        if (normalized.includes("construction")) return FaIndustry;
        if (normalized.includes("market entry")) return FaGlobe;
        if (normalized.includes("operations")) return FaIndustry;
        if (normalized.includes("expansion")) return FaGlobe;
        // fallback
        return FaGlobe;
    };

    return (
        <main>
            {/* Hero Section */}
            <Section
                fullHeight={false}
                bgImage={visionHeroImage}
                className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[50vh] pb-24 pr-16 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 mt-32 pt-24 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
            >
                <motion.div
                    className="max-w-2xl px-8 sm:px-12 py-10 relative overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-500 group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.6) 100%)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        boxShadow: '0 8px 32px rgba(165, 105, 66, 0.12), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.05)'
                    }}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {/* Subtle animated gradient blob behind the glass */}
                    <div
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl animate-pulse"
                        style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.3) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full opacity-15 blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(210,125,45,0.3) 0%, transparent 70%)',
                            animation: 'float 6s ease-in-out infinite'
                        }}
                    />

                    {/* Content wrapper with relative z-index */}
                    <div className="relative z-10">
                        <motion.h1
                            className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-4 leading-tight"
                            variants={fadeIn}
                            style={{ letterSpacing: '-0.03em' }}
                        >
                            {t('hero.title')}
                        </motion.h1>
                        <motion.div variants={fadeIn}>
                            <Typography variant="subtitle" className="text-primary/90">
                                {t('hero.subtitle')}
                            </Typography>
                        </motion.div>
                    </div>
                </motion.div>
            </Section>

            {/* Vision Introduction Section */}
            <Section className="py-10">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="text-center"
                    >
                        <motion.div variants={fadeIn}>
                            <Typography
                                variant="h2"
                                className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900"
                            >
                                {t('intro.title')}
                            </Typography>
                        </motion.div>

                        <motion.div variants={fadeIn}>
                            <Typography variant="body" className="max-w-4xl mx-auto">
                                {t('intro.content')}
                            </Typography>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* Sustainability & Stewardship Section */}
            <Section className="py-10">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="text-center mb-16">
                            <Typography variant="h2">
                                {t('sustainability.title')}
                            </Typography>
                            <Typography variant="subtitle" className="mt-4">
                                {t('sustainability.subtitle')}
                            </Typography>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <motion.div
                                className="lg:w-1/2 relative transform-gpu group"
                                variants={fadeIn}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                }}
                            >
                                <motion.div
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg overflow-hidden transform-gpu"
                                    whileHover={{
                                        y: -8,
                                        scale: 1.03,
                                        rotateY: 3,
                                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                    <img
                                        src={farmImage}
                                        alt="Cashew farmers practicing sustainable agriculture in Ivory Coast"
                                        loading="lazy"
                                        className="w-full transform transition-transform duration-500 group-hover:scale-105 relative z-10"
                                    />
                                </motion.div>
                            </motion.div>
                            <div className="lg:w-1/2">
                                <div className="space-y-6">
                                    {(t('sustainability.items', { returnObjects: true }) as Array<{
                                        text: string;
                                        icon?: string;
                                    }>).map((item, index) => (
                                        <motion.div
                                            key={`sustainability-${index}`}
                                            className="flex items-start gap-4 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                            variants={fadeIn}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{
                                                y: -2,
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            {item.icon && (
                                                <motion.div
                                                    className="bg-primary p-2 rounded-full text-white mt-1 shadow-md transform-gpu group-hover:scale-110 transition-transform duration-500"
                                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                >
                                                    {React.createElement(getIconComponent(item.icon), { className: "text-xl" })}
                                                </motion.div>
                                            )}
                                            <Typography variant="body" className="flex-1 text-left">
                                                {item.text}
                                            </Typography>
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.div
                                    variants={fadeIn}
                                    className="mt-8 relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-6 transform-gpu group"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                    whileHover={{
                                        y: -4,
                                        scale: 1.02,
                                        boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.2)',
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                    {/* Border accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />

                                    <Typography variant="body" className="text-primary-dark italic relative z-10">
                                        {t('sustainability.quote')}
                                    </Typography>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Community Empowerment Section */}
            <Section className="py-10">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="text-center mb-16">
                            <Typography variant="h2">
                                {t('community.title')}
                            </Typography>
                            <Typography variant="subtitle" className="mt-2">
                                {t('community.subtitle')}
                            </Typography>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {(t('community.items', { returnObjects: true }) as Array<{
                                title: string;
                                content: string;
                                icon: string;
                            }>).map((item, index) => (
                                <motion.div
                                    key={`community-${index}`}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <InfoCard
                                        icon={getIconComponent(item.icon)}
                                        title={item.title}
                                        iconColor="text-accent"
                                        className="h-full"
                                    >
                                        {item.content}
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Value Addition & Trade Section */}
            <Section className="py-10">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="text-center mb-16">
                            <Typography variant="h2">
                                {t('value.title')}
                            </Typography>
                        </div>

                        <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
                            <motion.div
                                className="lg:w-1/2 relative transform-gpu group"
                                variants={fadeIn}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                }}
                            >
                                <motion.div
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg overflow-hidden transform-gpu"
                                    whileHover={{
                                        y: -8,
                                        scale: 1.03,
                                        rotateY: 3,
                                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                    <img
                                        src={processingImage}
                                        alt="Value-added cashew processing in AfriNuts facility"
                                        loading="lazy"
                                        className="w-full transform transition-transform duration-500 group-hover:scale-105 relative z-10"
                                    />
                                </motion.div>
                            </motion.div>
                            <div className="lg:w-1/2">
                                <motion.div
                                    variants={fadeIn}
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-8 transform-gpu group mb-6"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                    whileHover={{
                                        y: -4,
                                        scale: 1.02,
                                        boxShadow: '0 15px 30px -8px rgba(0, 0, 0, 0.2)',
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                    <Typography variant="body" className="mb-0 relative z-10">
                                        {t('value.subtitle')}
                                    </Typography>
                                </motion.div>
                                <div className="space-y-4">
                                    {(t('value.items', { returnObjects: true }) as string[]).map((item, index) => (
                                        <motion.div
                                            key={`value-${index}`}
                                            className="flex items-start gap-4 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                            variants={fadeIn}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{
                                                y: -2,
                                                transition: { duration: 0.2 }
                                            }}
                                        >
                                            <motion.div
                                                className="bg-accent p-2 rounded-full text-white mt-1 shadow-md transform-gpu group-hover:scale-110 transition-transform duration-500"
                                                whileHover={{ scale: 1.15, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <FaIndustry className="text-xl" />
                                            </motion.div>
                                            <Typography variant="body" className="flex-1 text-left">
                                                {item}
                                            </Typography>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Processing & Facility Links */}
            <Section className="py-10">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="text-center mb-10">
                            <Typography variant="h2" className="mb-4">
                                {t('processingLinks.title', 'Bringing the Vision to Life')}
                            </Typography>
                            <Typography variant="subtitle" className="max-w-3xl mx-auto text-gray-600">
                                {t('processingLinks.subtitle', 'Explore how we are turning raw cashews into premium export-ready products through our processing infrastructure.')}
                            </Typography>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div variants={fadeIn}>
                                <InfoCard
                                    icon={FaIndustry}
                                    title={t('processingLinks.processing.title', 'Our Processing Approach')}
                                    iconColor="text-accent"
                                    showInfoBadge={false}
                                    className="h-full"
                                >
                                    <Typography variant="body" className="mb-4 text-gray-600">
                                        {t('processingLinks.processing.description', 'From raw nut to export-ready product — discover how we add value at every stage of the cashew processing chain.')}
                                    </Typography>
                                    <Link to="/processing" className="inline-flex items-center gap-2 text-accent hover:text-primary font-medium transition-colors">
                                        {t('processingLinks.processing.link', 'Explore Processing')}
                                        <FaArrowRight className="text-sm" />
                                    </Link>
                                </InfoCard>
                            </motion.div>

                            <motion.div variants={fadeIn} transition={{ delay: 0.1 }}>
                                <InfoCard
                                    icon={FaSolarPanel}
                                    title={t('processingLinks.facility.title', 'Future Processing Facility')}
                                    iconColor="text-primary"
                                    showInfoBadge={false}
                                    className="h-full"
                                >
                                    <Typography variant="body" className="mb-4 text-gray-600">
                                        {t('processingLinks.facility.description', 'Take a tour of our planned facility — from quality control labs to worker welfare, see the layout designed for efficiency and sustainability.')}
                                    </Typography>
                                    <Link to="/processing/facility-flowchart" className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors">
                                        {t('processingLinks.facility.link', 'View Facility Flowchart')}
                                        <FaArrowRight className="text-sm" />
                                    </Link>
                                </InfoCard>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* ESG Section */}
            <Section className="py-10">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <Typography variant="h2" className="text-center mb-4">
                            {t('esg.title')}
                        </Typography>
                        <Typography variant="subtitle" className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
                            {t('esg.subtitle')}
                        </Typography>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(t('esg.items', { returnObjects: true }) as Array<{
                                category: string;
                                commitments: string[];
                            }>).map((item, index) => (
                                <motion.div
                                    key={item.category}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <InfoCard
                                        icon={
                                            item.category === 'Environmental' ? FaLeaf :
                                                item.category === 'Social' ? FaUsers :
                                                    FaHandshake
                                        }
                                        title={item.category}
                                        variant={index === 0 ? 'primary' : index === 1 ? 'accent' : 'secondary'}
                                        showInfoBadge={false}
                                        className="h-full"
                                    >
                                        <ul className="space-y-2 mt-3">
                                            {item.commitments.map((commitment, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                                    <span>{commitment}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Mid-page CTA */}
            <Section className="py-10">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <Typography variant="h2" className="mb-6">
                            {t('midCta.title')}
                        </Typography>
                        <motion.button
                            className="group border-2 relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                            variants={fadeIn}
                            onClick={() => {
                                trackCtaClick('partner_with_us', 'vision_mid');
                                navigate('/contact');
                            }}
                            aria-label={t('midCta.button')}
                        >
                            {t('midCta.button')}
                            <FaGlobe className="ml-3 group-hover:rotate-45 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            </Section>

            {/* Ethical Finance Section */}
            <Section className="py-10">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center"
                    >
                        <Typography variant="h2" className="mb-8">
                            {t('finance.title')}
                        </Typography>
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {(t('finance.principles', { returnObjects: true }) as Array<{
                                title: string;
                                content: string;
                                icon: string;
                            }>).map((item, index) => (
                                <motion.div
                                    key={`finance-${index}`}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <InfoCard
                                        icon={getIconComponent(item.icon)}
                                        title={item.title}
                                        iconColor="text-accent"
                                        className="h-full"
                                    >
                                        {item.content}
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Innovation & Transformation Section */}
            <Section className="py-10">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="text-center mb-16">
                            <Typography variant="h2">
                                {t('innovation.title')}
                            </Typography>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(t('innovation.items', { returnObjects: true }) as Array<{
                                title: string;
                                content: string;
                                icon: string;
                            }>).map((item, index) => (
                                <motion.div
                                    key={`innovation-${index}`}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <InfoCard
                                        icon={getIconComponent(item.icon)}
                                        title={item.title}
                                        iconColor="text-accent"
                                        className="h-full"
                                    >
                                        {item.content}
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Operational Transparency Teaser */}
            <Section className="py-10">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="text-center mb-16">
                            <Typography variant="h2" className="mb-4">
                                {t('transparency.title', 'Operational Transparency Built In')}
                            </Typography>
                            <Typography variant="subtitle" className="max-w-3xl mx-auto text-gray-600">
                                {t('transparency.subtitle', 'Every tree, every block, every expense — tracked and reported. Our farm management system brings institutional-grade visibility to agricultural investment.')}
                            </Typography>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: FaChartLine,
                                    title: t('transparency.cards.tracking.title', 'Block-Level Tracking'),
                                    description: t('transparency.cards.tracking.description', 'Our 35-hectare farm is divided into individually monitored blocks. Each block has its own planting date, survival rate, and performance metrics — giving investors granular visibility into farm operations.')
                                },
                                {
                                    icon: FaCheckCircle,
                                    title: t('transparency.cards.reporting.title', 'Investor-Grade Reporting'),
                                    description: t('transparency.cards.reporting.description', 'Quarterly reports include tree survival rates, harvest volumes, quality grades, and profit-and-loss statements by block. No black boxes — just clear, auditable data.')
                                },
                                {
                                    icon: FaIndustry,
                                    title: t('transparency.cards.allocation.title', 'Transparent Cost Allocation'),
                                    description: t('transparency.cards.allocation.description', 'Farm-wide expenses are allocated equally per block. Direct costs are tracked per block. Our investors always know exactly where every FCFA goes.')
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <InfoCard
                                        icon={item.icon}
                                        title={item.title}
                                        iconColor="text-accent"
                                        className="h-full"
                                        showInfoBadge={false}
                                    >
                                        <Typography variant="body" className="text-gray-600 text-sm">
                                            {item.description}
                                        </Typography>
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            variants={fadeIn}
                            className="text-center mt-10"
                        >
                            <Typography variant="body" className="text-gray-500 italic max-w-2xl mx-auto">
                                {t('transparency.note', 'Our operational dashboard and detailed financial reports are available to verified investors through a secure portal.')}
                            </Typography>
                            <motion.button
                                onClick={() => {
                                    trackCtaClick('inquire_investing', 'vision_transparency');
                                    navigate('/contact');
                                }}
                                className="mt-6 relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-full transform-gpu transition-all duration-300 inline-flex items-center gap-2 text-sm font-medium bg-white/30 backdrop-blur-sm"
                                whileHover={{ y: -2, scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaHandshake />
                                {t('transparency.cta', 'Inquire About Investing')}
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* Roadmap Section */}
            <Section className="py-10">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center mb-8"
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('roadmap.title') || "Our Strategic Roadmap: From Farm to Global Brand"}
                        </Typography>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            {t('roadmap.subtitle') || "Our journey towards excellence and global recognition"}
                        </Typography>
                    </motion.div>

                    {/* Use the roadmap data directly */}
                    <TimelineCard
                        title={t('roadmap.title') || "Strategic Roadmap"}
                        subtitle={t('roadmap.subtitle') || "From farm to global brand"}
                        items={t('roadmap', { returnObjects: true })}
                        showProgress={true}
                        expandable={true}
                        emptyText={t('timeline.empty', { defaultValue: 'No roadmap items available' })}
                        progressText={t('timeline.progress', { defaultValue: 'Progress' })}
                        completeText={t('timeline.complete', { defaultValue: 'Complete' })}
                        milestoneText={t('timeline.milestone', { defaultValue: 'Key Milestone' })}
                        showLessText={t('timeline.showLess', { defaultValue: 'Show Less' })}
                        showMoreText={t('timeline.showMore', { defaultValue: 'Show {{count}} More Items' })}
                        trackProgressText={t('timeline.trackProgress', { defaultValue: 'Track Our Progress' })}
                    />
                </div>
            </Section>

            {/* End-of-page CTA - Enhanced with Glassy 3D */}
            <Section className="py-16">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            rotateY: 3,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <motion.div variants={fadeIn}>
                                <Typography variant="h2" className="mb-6 text-primary">
                                    {t('cta.title')}
                                </Typography>
                                <Typography variant="body" className="mb-8 text-gray-700 max-w-3xl mx-auto">
                                    {t('cta.content')}
                                </Typography>
                                <motion.button
                                    className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden"
                                    variants={fadeIn}
                                    onClick={() => {
                                        trackCtaClick('join_vision', 'vision_end');
                                        navigate('/contact');
                                    }}
                                    aria-label={t('cta.button')}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -2,
                                        boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)',
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {/* Button 3D edge effect */}
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover/btn:translate-z-[-6px] transition-all duration-300" />

                                    {/* Button glassy overlay */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover/btn:opacity-70 transition-opacity duration-300" />

                                    {/* Button inner glow */}
                                    <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />

                                    <span className="relative z-10 font-medium text-lg">
                            {t('cta.button')}
                        </span>
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default Vision;