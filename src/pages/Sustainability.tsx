import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaTree,
    FaWater,
    FaLeaf,
    FaIndustry,
    FaSeedling,
    FaTint,
    FaBug,
    FaRecycle,
    FaHandshake,
    FaUsers,
    FaVenus,
    FaChartLine,
    FaGlobe
} from "react-icons/fa";

import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import sustainabilityHeroImage from '@/assets/images/sustainability-hero.webp';
import agroforestryImage from '@/assets/images/agroforestry.webp';
import farmersImage from '@/assets/images/farmers.webp';
import { IconType } from 'react-icons';

const Sustainability: React.FC = () => {
    const { t } = useTranslation('sustainability');
    const navigate = useNavigate();

    // Helper function with proper typing
    const getIconComponent = (iconName: string): IconType => {
        const icons: Record<string, IconType> = {
            FaTree,
            FaWater,
            FaLeaf,
            FaIndustry,
            FaSeedling,
            FaTint,
            FaBug,
            FaRecycle,
            FaHandshake,
            FaUsers,
            FaVenus,
            FaChartLine,
            FaGlobe
        };
        return icons[iconName] || FaGlobe;
    };

    return (
        <main>
            {/* Hero Section */}
            <Section
                fullHeight={false}
                bgImage={sustainabilityHeroImage}
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

            {/* Sustainability Introduction Section */}
            <Section className="py-0 md:py-0">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 md:p-12 lg:p-16"
                    >
                        <div className="text-center mb-10">
                            <motion.div variants={fadeIn}>
                                <Typography
                                    variant="h2"
                                    className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900"
                                >
                                    {t('intro.title')}
                                </Typography>
                            </motion.div>

                            <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-600">
                                {(t('intro.content', { returnObjects: true }) as string[]).map((paragraph, index) => (
                                <motion.p
                                    variants={fadeIn}
                                    transition={{ delay: 0.1 }}
                                    key={`intro-para-${index}`}
                                    className="leading-relaxed"
                                >
                                    {paragraph}
                                </motion.p>
                                ))}
                            </div>
                        </div>

                        {/* Certification Badges */}
                        <motion.div
                            variants={fadeIn}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap justify-center gap-4 mt-12"
                        >
                            {(t('intro.badges', { returnObjects: true }) as string[]).map((badge) => (
                                <span
                                    key={badge}
                                    className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-white text-sm font-medium"
                                >
            {badge}
          </span>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* Environmental Section */}
            <Section className="py-12 md:py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="text-center mb-16">
                            <Typography variant="h2">
                                {t('environment.title')}
                            </Typography>
                        </div>

                        {/* Challenges */}
                        <motion.div
                            className="mb-20"
                            variants={fadeIn}
                        >
                            <Typography variant="h3" className="mb-8 text-center">
                                {t('environment.challenges.title')}
                            </Typography>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {(t('environment.challenges.items', { returnObjects: true }) as Array<{
                                    title: string;
                                    content: string;
                                    icon: string;
                                }>).map((item, index) => {
                                    const IconComponent = getIconComponent(item.icon);
                                    return (
                                        <motion.div
                                            key={`challenge-${index}`}
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
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Solutions */}
                        <motion.div
                            className="flex flex-col lg:flex-row gap-12 items-center"
                            variants={fadeIn}
                        >
                            <div className="lg:w-1/2">
                                <img
                                    src={agroforestryImage}
                                    alt="Agroforestry practices"
                                    className="rounded-2xl shadow-xl w-full"
                                />
                            </div>
                            <div className="lg:w-1/2">
                                <Typography variant="h3" className="mb-8">
                                    {t('environment.solutions.title')}
                                </Typography>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {(t('environment.solutions.items', { returnObjects: true }) as Array<{
                                        title: string;
                                        content: string;
                                        icon: string;
                                    }>).map((item, index) => {
                                        const IconComponent = getIconComponent(item.icon);
                                        return (
                                            <motion.div
                                                key={`solution-${index}`}
                                                variants={fadeIn}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <InfoCard
                                                    icon={IconComponent}
                                                    title={item.title}
                                                    description={item.content}
                                                    iconColor="text-accent"
                                                    className="h-full bg-white"
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* Social Responsibility Section */}
            <Section className="py-12 md:py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <div className="text-center mb-16">
                            <Typography variant="h2">
                                {t('social.title')}
                            </Typography>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
                            <div className="lg:w-1/2 order-2 lg:order-1">
                                <Typography variant="h3" className="mb-6">
                                    {t('social.farmers.title')}
                                </Typography>
                                <div className="space-y-4">
                                    {(t('social.farmers.content', { returnObjects: true }) as string[]).map((paragraph, index) => (
                                        <motion.p
                                            key={`farmers-para-${index}`}
                                            className="text-text-dark"
                                            variants={fadeIn}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {paragraph}
                                        </motion.p>
                                    ))}
                                </div>
                            </div>
                            <motion.div
                                className="lg:w-1/2 order-1 lg:order-2"
                                variants={fadeIn}
                            >
                                <img
                                    src={farmersImage}
                                    alt="Farmers training"
                                    className="rounded-2xl shadow-xl w-full"
                                />
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div variants={fadeIn}>
                                <InfoCard
                                    icon={FaHandshake}
                                    title={t('social.labor.title')}
                                    description={(t('social.labor.content', { returnObjects: true }) as string[]).join(' ')}
                                    iconColor="text-accent"
                                    className="h-full"
                                />
                            </motion.div>
                            <motion.div variants={fadeIn} transition={{ delay: 0.2 }}>
                                <InfoCard
                                    icon={FaVenus}
                                    title={t('social.gender.title')}
                                    description={(t('social.gender.content', { returnObjects: true }) as string[]).join(' ')}
                                    iconColor="text-primary"
                                    className="h-full"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Future Vision Section */}
            <Section className="py-12 md:py-16">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <Typography variant="h2" className="mb-8">
                            {t('future.title')}
                        </Typography>
                        <div className="space-y-6 mb-10">
                            {(t('future.content', { returnObjects: true }) as string[]).map((item, index) => (
                                <motion.div
                                    key={`future-item-${index}`}
                                    className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="bg-accent p-3 rounded-full text-white">
                                        <FaChartLine className="text-xl" />
                                    </div>
                                    <p className="text-lg text-text-dark text-left flex-1">{item}</p>
                                </motion.div>
                            ))}
                        </div>
                        <motion.button
                            className="mt-6 group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center mx-auto"
                            variants={fadeIn}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate('/vision')}
                        >
                            {t('future.cta')}
                            <FaGlobe className="ml-3 group-hover:rotate-45 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default Sustainability;