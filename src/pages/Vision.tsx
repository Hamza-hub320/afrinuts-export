import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    FaSeedling
} from "react-icons/fa";

import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer, slideInFromLeft, slideInFromRight } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import visionHeroImage from '@/assets/images/vision-hero.webp';
import farmImage from '@/assets/images/farm-vision.webp';
import processingImage from '@/assets/images/processing-vision.webp';
import { IconType } from 'react-icons';

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
                    className="max-w-2xl px-8 sm:px-12 py-10 bg-white/75 backdrop-blur-xs rounded-xl border-2 border-primary/20 hover:border-accent/30 transition-all duration-300"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
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

            {/* ESG Section */}
            <Section className="py-10">
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <Typography variant="h2" className="text-center mb-6">
                    {t('esg.title')}
                  </Typography>
                  <InfoCard className="bg-primary/5 border-primary/20 p-6 text-center">
                    {t('esg.content')}
                  </InfoCard>
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
                            className="group border-2 border-primary text-primary hover:bg-accent hover:text-white hover:border-accent px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                            variants={fadeIn}
                            onClick={() => navigate('/contact')}
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

            {/* Roadmap Section */}
            <Section className="py-10">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center"
                    >
                        <Typography variant="h2" className="mb-8">
                            {t('roadmap.title') || "Our Strategic Roadmap: From Farm to Global Brand"}
                        </Typography>
                        {(() => {
                            const roadmap = t('roadmap', { returnObjects: true }) as {
                                title?: string;
                                items: Array<{ date: string; title: string; description: string }>;
                            };
                            const items = roadmap?.items || [];
                            return (
                                <>
                                    {/* Mobile Roadmap - Horizontal Scroll */}
                                    <div className="md:hidden w-full overflow-x-auto py-4">
                                        <div className="flex gap-4 px-2">
                                            {items.map((item, idx) => (
                                                <motion.div
                                                    key={`roadmap-mobile-${idx}`}
                                                    className="flex-shrink-0 w-64 relative bg-gradient-to-br from-primary/5 to-accent/5 text-center border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-lg p-6 flex flex-col items-center transform-gpu group"
                                                    style={{
                                                        transformStyle: 'preserve-3d',
                                                        perspective: '1000px',
                                                    }}
                                                    whileHover={{
                                                        y: -8,
                                                        scale: 1.05,
                                                        rotateY: 5,
                                                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                                        transition: { duration: 0.3 }
                                                    }}
                                                >
                                                    {/* 3D edge effect */}
                                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                                    {/* Glassy overlay */}
                                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                                    {/* Inner shadow effect */}
                                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                                    {/* Roadmap icon */}
                                                    <div className="bg-accent p-2 rounded-full text-white shadow-md mb-3">
                                                        {React.createElement(getRoadmapIcon(item.title), { className: "text-xl" })}
                                                    </div>

                                                    <Typography variant="subtitle" className="text-primary text-center font-bold relative z-10">
                                                        {item.date}
                                                    </Typography>
                                                    <Typography variant="h4" className="text-lg font-semibold text-center mt-1 relative z-10">
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body" className="text-gray-600 text-center mt-2 relative z-10">
                                                        {item.description}
                                                    </Typography>

                                                    {/* Step number */}
                                                    <div className="absolute -top-1 -left-3 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg z-20">
                                                        {idx + 1}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Desktop vertical timeline */}
                                    <div className="hidden md:flex flex-col items-center relative">
                                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-primary/40 z-0" style={{ top: 32, bottom: 32 }} />
                                        <div className="relative z-10 w-full">
                                            {items.map((item, idx, arr) => (
                                                <div key={`roadmap-${idx}`} className="flex items-center mb-10 last:mb-0">
                                                    <div className="w-1/2 pr-4 text-right">
                                                        {idx % 2 === 0 && (
                                                            <motion.div
                                                                variants={slideInFromLeft}
                                                            >
                                                                <motion.div
                                                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-lg p-6 transform-gpu group"
                                                                    style={{
                                                                        transformStyle: 'preserve-3d',
                                                                        perspective: '1000px',
                                                                    }}
                                                                    whileHover={{
                                                                        y: -8,
                                                                        scale: 1.03,
                                                                        rotateY: 3,
                                                                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                                                        transition: { duration: 0.3 }
                                                                    }}
                                                                >
                                                                    {/* 3D edge effect */}
                                                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500 pointer-events-none" />
                                                                    {/* Glassy overlay */}
                                                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

                                                                    {/* Roadmap icon */}
                                                                    <div className="bg-accent p-2 rounded-full text-white shadow-md mb-3">
                                                                        {React.createElement(getRoadmapIcon(item.title), { className: "text-xl" })}
                                                                    </div>

                                                                    <Typography variant="h4" className="text-lg font-semibold text-primary">
                                                                        {item.title}
                                                                    </Typography>
                                                                    <Typography variant="subtitle" className="font-bold text-primary mb-2">
                                                                        {item.date}
                                                                    </Typography>
                                                                    <Typography variant="body" className="text-gray-600">
                                                                        {item.description}
                                                                    </Typography>
                                                                </motion.div>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-center w-12 shrink-0">
                                                        <motion.div
                                                            className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg mb-2 transform-gpu group-hover:scale-110 transition-transform duration-500 relative z-20"
                                                            whileHover={{ scale: 1.2, rotate: 360 }}
                                                            transition={{ type: 'spring', stiffness: 300 }}
                                                        >
                                                            {idx + 1}
                                                        </motion.div>
                                                        {idx !== arr.length - 1 && (
                                                            <div className="flex-1 w-1 bg-primary/30 mx-auto" style={{ minHeight: 32 }} />
                                                        )}
                                                    </div>
                                                    <div className="w-1/2 pl-4 text-left">
                                                        {idx % 2 !== 0 && (
                                                            <motion.div
                                                                variants={slideInFromRight}
                                                            >
                                                                <motion.div
                                                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-lg p-6 transform-gpu group"
                                                                    style={{
                                                                        transformStyle: 'preserve-3d',
                                                                        perspective: '1000px',
                                                                    }}
                                                                    whileHover={{
                                                                        y: -8,
                                                                        scale: 1.03,
                                                                        rotateY: -3,
                                                                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                                                        transition: { duration: 0.3 }
                                                                    }}
                                                                >
                                                                    {/* 3D edge effect */}
                                                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500 pointer-events-none" />
                                                                    {/* Glassy overlay */}
                                                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

                                                                    {/* Roadmap icon */}
                                                                    <div className="bg-accent p-2 rounded-full text-white shadow-md mb-3">
                                                                        {React.createElement(getRoadmapIcon(item.title), { className: "text-xl" })}
                                                                    </div>

                                                                    <Typography variant="h4" className="text-lg font-semibold text-primary">
                                                                        {item.title}
                                                                    </Typography>
                                                                    <Typography variant="subtitle" className="font-bold text-primary mb-2">
                                                                        {item.date}
                                                                    </Typography>
                                                                    <Typography variant="body" className="text-gray-600">
                                                                        {item.description}
                                                                    </Typography>
                                                                </motion.div>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>
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
                                    onClick={() => navigate('/contact')}
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