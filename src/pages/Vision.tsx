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
                className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[90vh] pb-12 mx-6 sm:mx-12 lg:mx-24 mt-32 pt-20 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
            >
                <motion.div
                    className="max-w-2xl px-8 sm:px-12 py-10 bg-white/75 backdrop-blur-xs rounded-xl"
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
                                    alt="Sustainable farming"
                                    className="rounded-2xl shadow-xl w-full"
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
                                    className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20"
                                >
                                    <Typography variant="body" className="italic text-primary-dark">
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
                                        description={item.content}
                                        iconColor="text-accent"
                                        className="h-full"
                                    />
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
                                    alt="Value added processing"
                                    className="rounded-2xl shadow-xl w-full"
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
                                        description={item.content}
                                        iconColor="text-primary"
                                        className="h-full"
                                    />
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
                                        description={item.content}
                                        iconColor="text-accent"
                                        className="h-full bg-white"
                                    />
                                </motion.div>
                            ))}
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
                            className="mt-6 group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center mx-auto"
                            variants={fadeIn}
                            onClick={() => navigate('/contact')}
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