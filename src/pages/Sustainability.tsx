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
    FaGlobe, FaCircle
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

            {/* Sustainability Introduction Section */}
            <Section className="py-0 md:py-6">
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



            {/* Environmental Section */}
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
                                                iconColor="text-accent"
                                                className="h-full"
                                            >
                                                {item.content}
                                            </InfoCard>
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
                                    className="rounded-2xl shadow-xl w-full transition-transform duration-300 hover:scale-105"
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
                                                    iconColor="text-accent"
                                                    className="h-full"
                                                >
                                                    {item.content}
                                                </InfoCard>
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
                                    alt={t('social.farmers.title')}
                                    className="rounded-2xl shadow-xl w-full transition-transform duration-300 hover:scale-105"
                                />
                            </motion.div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div variants={fadeIn}>
                                <InfoCard
                                    icon={FaHandshake}
                                    title={t('social.labor.title')}
                                    iconColor="text-accent"
                                    className="h-full"
                                >
                                    {(t('social.labor.content', { returnObjects: true }) as string[]).join(' ')}
                                </InfoCard>
                            </motion.div>
                            <motion.div variants={fadeIn} transition={{ delay: 0.2 }}>
                                <InfoCard
                                    icon={FaVenus}
                                    title={t('social.gender.title')}
                                    iconColor="text-primary"
                                    className="h-full"
                                >
                                    {(t('social.gender.content', { returnObjects: true }) as string[]).join(' ')}
                                </InfoCard>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Future Vision Section */}
            <Section className="py-10">
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
                                    className="group relative flex items-center gap-4 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 backdrop-blur-md p-4 rounded-xl shadow-lg transform-gpu"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{
                                        y: -6,
                                        scale: 1.02,
                                        rotateY: 2,
                                        boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.15)',
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                    {/* Inner shadow effect */}
                                    <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] group-hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.1)] transition-shadow duration-500" />

                                    {/* Subtle background pattern */}
                                    <div className="absolute inset-0 rounded-xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjAiLz48L2c+PC9zdmc+')] opacity-15" />

                                    <p className="text-lg text-text-dark text-left flex-1 relative z-10">{item}</p>
                                </motion.div>
                            ))}
                        </div>
                        <motion.button
                            className="group bg-primary hover:bg-dark-orange text-white hover:text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                            aria-label={t('future.cta')}
                            variants={fadeIn}
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                                boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)'
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/vision')}
                        >
                            <span className="relative z-10">{t('future.cta')}</span>
                            <motion.span
                                className="hidden sm:inline-flex ml-3 relative z-10"
                                whileHover={{ rotate: 45 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FaGlobe className="transition-transform" />
                            </motion.span>
                        </motion.button>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default Sustainability;