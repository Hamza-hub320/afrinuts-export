import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {Link, useNavigate } from 'react-router-dom';
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
                                <div className="mt-4 text-center">
                                    <Link to="/processing/facility-flowchart" className="text-primary hover:text-accent text-sm flex items-center justify-center gap-1">
                                        <FaIndustry className="text-xs" />
                                        {t('environment.seeFacility', 'See how our facility supports these practices →')}
                                    </Link>
                                </div>
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
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="text-center mb-16"
                            variants={fadeIn}
                        >
                            <Typography variant="h2">
                                {t('social.title')}
                            </Typography>
                        </motion.div>

                        <motion.div
                            className="flex flex-col lg:flex-row gap-12 items-center mb-16 transform-gpu"
                            variants={fadeIn}
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* Content Section */}
                            <motion.div
                                className="lg:w-1/2 order-2 lg:order-1 relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 transform-gpu"
                                style={{
                                    transformStyle: 'preserve-3d',
                                }}
                                whileHover={{
                                    y: -5,
                                    scale: 1.01,
                                    rotateY: 1,
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
                                    transition: { duration: 0.3 }
                                }}
                                variants={fadeIn}
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
                                    <Typography variant="h3" className="mb-6 text-primary">
                                        {t('social.farmers.title')}
                                    </Typography>
                                    <div className="space-y-4">
                                        {(t('social.farmers.content', { returnObjects: true }) as string[]).map((paragraph, index) => (
                                            <motion.p
                                                key={`farmers-para-${index}`}
                                                className="text-text-dark bg-white/30 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                                                variants={fadeIn}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{
                                                    y: -2,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                {paragraph}
                                            </motion.p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Image Section */}
                            <motion.div
                                className="lg:w-1/2 order-1 lg:order-2 relative transform-gpu"
                                variants={fadeIn}
                                style={{
                                    transformStyle: 'preserve-3d',
                                }}
                                whileHover={{
                                    y: -5,
                                    rotateY: 2,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <div className="relative rounded-3xl overflow-hidden transform-gpu group">
                                    {/* 3D edge effect for image container */}
                                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                    {/* Glassy overlay for image container */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500 z-10" />
                                    <img
                                        src={farmersImage}
                                        alt={t('social.farmers.title')}
                                        className="rounded-3xl shadow-xl w-full transform-gpu transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Image gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl" />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Labor & Gender InfoCards */}
                        <div className="grid md:grid-cols-2 gap-8 mt-12">
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
                            className="group bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center mx-auto transform-gpu relative overflow-hidden"
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
            {/* End-of-page CTA */}
            <Section className="py-10">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{ transformStyle: 'preserve-3d' }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        whileHover={{
                            y: -8, scale: 1.02, rotateY: 3,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <motion.div variants={fadeIn}>
                                <Typography variant="h2" className="mb-6 text-primary">
                                    {t('endCta.title', 'See Sustainability in Action')}
                                </Typography>
                                <Typography variant="body" className="mb-8 text-gray-700 max-w-3xl mx-auto">
                                    {t('endCta.content', 'Our sustainability practices are part of a larger vision. Explore how we\'re building a vertically integrated, ethical cashew business from farm to global markets.')}
                                </Typography>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <motion.button
                                        className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden"
                                        variants={fadeIn}
                                        onClick={() => navigate('/vision')}
                                        whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                        <span className="relative z-10 font-medium text-lg">{t('endCta.visionButton', 'Our Vision')}</span>
                                    </motion.button>
                                    <motion.button
                                        className="relative border-2 border-primary/50 text-primary hover:bg-white/20 px-8 py-4 rounded-full transform-gpu backdrop-blur-sm"
                                        variants={fadeIn}
                                        onClick={() => navigate('/products')}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="relative z-10 font-medium text-lg">{t('endCta.productsButton', 'View Products')}</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default Sustainability;