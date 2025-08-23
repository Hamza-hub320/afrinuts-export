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
import { fadeIn, staggerContainer } from '@/utils/animations';
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

    return (
        <main>
            {/* Hero Section */}
            <Section
                fullHeight={false}
                bgImage={visionHeroImage}
                loading="lazy"
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
                            <div className="lg:w-1/2">
                                <img
                                    src={farmImage}
                                    alt="Cashew farmers practicing sustainable agriculture in Ivory Coast"
                                    loading="lazy"
                                    className="rounded-2xl shadow-xl w-full transform transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            <div className="lg:w-1/2">
                                <div className="space-y-6">
                                    {(t('sustainability.items', { returnObjects: true }) as Array<{
                                        text: string;
                                        icon?: string;
                                    }>).map((item, index) => (
                                        <motion.div
                                            key={`sustainability-${index}`}
                                            className="flex items-start gap-4"
                                            variants={fadeIn}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {item.icon && (
                                                <div className="bg-primary p-2 rounded-full text-white mt-1">
                                                    {React.createElement(getIconComponent(item.icon), { className: "text-xl" })}
                                                </div>
                                            )}
                                            <Typography variant="body" className="flex-1 text-left">
                                                {item.text}
                                            </Typography>
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.div
                                    variants={fadeIn}
                                    className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20 border-l-4 border-primary pl-4 italic"
                                >
                                    <Typography variant="body" className="text-primary-dark">
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
                                        role="article"
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
                            <div className="lg:w-1/2">
                                <img
                                    src={processingImage}
                                    alt="Value-added cashew processing in AfriNuts facility"
                                    loading="lazy"
                                    className="rounded-2xl shadow-xl w-full transform transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            <div className="lg:w-1/2">
                                <Typography variant="h3" className="mb-6">
                                    {t('value.subtitle')}
                                </Typography>
                                <div className="space-y-4">
                                    {(t('value.items', { returnObjects: true }) as string[]).map((item, index) => (
                                        <motion.div
                                            key={`value-${index}`}
                                            className="flex items-start gap-4"
                                            variants={fadeIn}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="bg-accent p-2 rounded-full text-white mt-1">
                                                <FaIndustry className="text-xl" />
                                            </div>
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
                            className="mt-4 group bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center mx-auto"
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
                                        role="article"
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
                                        role="article"
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
                            {t('roadmap.title')}
                        </Typography>
                        <div className="relative flex flex-col items-center">
                            <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-primary/40 z-0" style={{ top: 32, bottom: 32 }} />
                            <div className="relative z-10 w-full">
                                {(t('roadmap.items', { returnObjects: true }) as Array<{ date: string; title: string; description: string }>).map((item, idx) => (
                                    <div key={`roadmap-${idx}`} className="flex items-center mb-10 last:mb-0">
                                        <div className="w-1/2 pr-4 text-right hidden md:block">
                                            {idx % 2 === 0 && (
                                                <div>
                                                    <Typography variant="subtitle" className="font-bold text-primary">
                                                        {item.date}
                                                    </Typography>
                                                    <Typography variant="h4" className="text-lg">
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body" className="text-gray-600">
                                                        {item.description}
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-center w-12 shrink-0">
                                            <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-lg mb-2">
                                                {idx + 1}
                                            </div>
                                            {idx !== (t('roadmap.items', { returnObjects: true }) as Array<any>).length - 1 && (
                                                <div className="flex-1 w-1 bg-primary/30 mx-auto" style={{ minHeight: 32 }} />
                                            )}
                                        </div>
                                        <div className="w-1/2 pl-4 text-left">
                                            {idx % 2 !== 0 && (
                                                <div>
                                                    <Typography variant="subtitle" className="font-bold text-primary">
                                                        {item.date}
                                                    </Typography>
                                                    <Typography variant="h4" className="text-lg">
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body" className="text-gray-600">
                                                        {item.description}
                                                    </Typography>
                                                </div>
                                            )}
                                            {/* On mobile, always show on right for all */}
                                            <div className="md:hidden">
                                                <Typography variant="subtitle" className="font-bold text-primary">
                                                    {item.date}
                                                </Typography>
                                                <Typography variant="h4" className="text-lg">
                                                    {item.title}
                                                </Typography>
                                                <Typography variant="body" className="text-gray-600">
                                                    {item.description}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Final Call to Action */}
            <Section className="py-10">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <Typography variant="h2" className="mb-8">
                            {t('cta.title')}
                        </Typography>
                        <Typography variant="body" className="mb-8 max-w-3xl mx-auto">
                            {t('cta.content')}
                        </Typography>
                        <motion.button
                            className="mt-6 group bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center mx-auto"
                            variants={fadeIn}
                            onClick={() => navigate('/contact')}
                            aria-label={t('cta.button')}
                        >
                            {t('cta.button')}
                            <FaGlobe className="ml-3 group-hover:rotate-45 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default Vision;