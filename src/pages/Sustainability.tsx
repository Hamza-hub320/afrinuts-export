import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {Link, useNavigate } from 'react-router-dom';
import { trackCtaClick } from '@/utils/analytics';
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
    FaGlobe, FaArrowDown, FaMobile, FaCheckCircle
} from "react-icons/fa";

import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import sustainabilityHeroImage from '@/assets/images/sustainability-hero.webp';
import agroforestryImage from '@/assets/images/agroforestry.webp';
import farmersImage from '@/assets/images/farmers.webp';
import { IconType } from 'react-icons';
import JsonLd from "@/components/Seo/JsonLd";
import { Helmet } from 'react-helmet-async';

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
            <Helmet>
                <title>Sustainable & Organic Cashew Farming in Ivory Coast | AfriNuts Export</title>
                <meta name="description" content="How AfriNuts Export practices organic farming, water conservation, zero-waste processing, and fair labor on our 35-hectare cashew farm in Odienné, Côte d'Ivoire. Carbon-neutral by 2028." />
                <link rel="canonical" href="https://www.afrinutsexport.com/sustainability" />
                <meta property="og:title" content="Sustainable & Organic Cashew Farming in Ivory Coast | AfriNuts Export" />
                <meta property="og:description" content="Organic farming, zero-waste processing, fair labor, and community reinvestment on our 35-hectare farm in Odienné. Carbon-neutral by 2028." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Sustainable & Organic Cashew Farming | AfriNuts Export",
                "description": "Organic farming, water conservation, zero-waste processing, and fair labor practices at our 35-hectare cashew farm in Odienné, Côte d'Ivoire.",
                "about": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "description": "Sustainable cashew farming with organic practices, zero-waste processing, and community reinvestment in Odienné, Côte d'Ivoire.",
                    "knowsAbout": [
                        "Organic Cashew Farming",
                        "Water Conservation",
                        "Zero-Waste Processing",
                        "Agroforestry",
                        "Fair Labor Practices",
                        "Carbon-Neutral Supply Chain"
                    ]
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "url": "https://www.afrinutsexport.com"
                }
            }} />
            <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-[100px] pb-1">
                <div className="text-sm text-text-dark mb-2 flex items-center gap-1 flex-wrap">
                    <Link to="/" className="hover:text-primary transition-colors">{t('breadcrumbs.home', 'Home')}</Link>
                    <span>/</span>
                    <Link to="/about" className="hover:text-primary transition-colors">{t('breadcrumbs.about', 'About')}</Link>
                    <span>/</span>
                    <span className="text-primary font-medium">{t('breadcrumbs.sustainability', 'Sustainability')}</span>
                </div>
            </div>
            {/* Hero */}
            <Section className="flex items-center justify-center text-center pt-2 pb-8 lg:pb-12">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                    {/* Left: Text Content */}
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaLeaf className="inline mr-2 text-accent" />{t('hero.subtitle', 'Our Sustainability Commitment')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                            {t('hero.title')}
                        </motion.h1>

                        {/* Lead Text */}
                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                            {t('hero.lead', 'Most farms claim to be sustainable. We track it. Our Farm OS logs water usage, organic inputs, waste diversion, and soil health — so buyers and investors can verify our claims instead of trusting them.')}
                        </Typography>

                        {/* Sustainability Intro Card */}
                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaChartLine}
                                title={t('hero.introTitle', 'Measured. Not Marketed.')}
                                variant="accent"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('hero.introBody', 'Our Farm OS doesn\'t just track production. It tracks our environmental footprint — water usage, organic inputs, waste diversion, and soil health metrics. This is not just sustainability — this is verifiable, tech-enabled agriculture.')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    <FaCheckCircle className="text-[10px]" /> {t('hero.badgeOrganic', 'Organic Methods')}
                </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                    <FaChartLine className="text-[10px]" /> {t('hero.badgeTracked', 'Farm OS Tracked')}
                </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                    <FaRecycle className="text-[10px]" /> {t('hero.badgeZeroWaste', 'Zero-Waste Target')}
                </span>
                        </div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <button
                                onClick={() => document.getElementById('sustainability-content')?.scrollIntoView({ behavior: 'smooth' })}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaArrowDown className="text-xs" />{t('hero.ctaExplore', 'Explore Our Practices')}
                            </button>
                            <Link to="/farm-os" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaMobile className="text-xs" />{t('hero.ctaFarmOS', 'See Farm OS')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Sustainability Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-96 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={sustainabilityHeroImage} alt="Sustainable Cashew Farming" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">{t('hero.imageLabel', 'Farm OS Verified')}</span>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </Section>

            {/* Sustainability Introduction Section */}
            <Section className="py-0 md:py-6" id="sustainability-content">
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
                            <Typography variant="h5" className="mb-8 text-center">
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
                                <Typography variant="h5" className="mb-8">
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
                            onClick={() => {
                                trackCtaClick('explore_vision', 'sustainability_page');
                                navigate('/vision');
                            }}
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
                                        onClick={() => {
                                            trackCtaClick('learn_more_vision', 'sustainability_page');
                                            navigate('/vision');
                                        }}
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
                                        onClick={() => {
                                            trackCtaClick('explore_products', 'sustainability_page');
                                            navigate('/products');
                                        }}
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