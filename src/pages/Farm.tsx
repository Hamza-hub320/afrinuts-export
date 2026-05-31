import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import { trackCtaClick } from '@/utils/analytics';
import {
    FaTree,
    FaArrowRight,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaLeaf,
    FaTint,
    FaUsers,
    FaChartLine,
    FaSeedling, FaBookOpen, FaBox, FaSearch, FaMobile,
} from 'react-icons/fa';
import { GiFarmer, GiPlantWatering, GiFruitTree } from 'react-icons/gi';
import { MdPrecisionManufacturing } from 'react-icons/md';
import farmImage1 from '@/assets/images/farm-1.webp';
import farmImage2 from '@/assets/images/farm-2.webp';
import farmImage3 from '@/assets/images/farm-3.webp';
import farmImage4 from '@/assets/images/farm-4.webp';
import farmHeroImage from '@/assets/images/farm-hero.webp';
import { useAuth } from '../contexts/AuthContext';
import LiveFarmStats from '@/components/LiveFarmStats';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';

import Section from "../components/Section/Section";
import Typography from "../components/Typography/Typography";
import ImageGallery from '../components/ImageGallery/ImageGallery';
import StatsCounter from '../components/StatsCounter/StatsCounter';
import InteractiveMap from '../components/InteractiveMap/InteractiveMap';
import { InfoCard } from "../components/InfoCard/InfoCard";
import JsonLd from "@/components/Seo/JsonLd";
import {Helmet} from "react-helmet-async";

const Farm = () => {
    const { t } = useTranslation('farm');
    const navigate = useNavigate();
    const { user } = useAuth();

    const farmStats = [
        { icon: FaTree, value: t('stats.area'), label: t('stats.areaLabel') },
        { icon: FaMapMarkerAlt, value: t('stats.location'), label: t('stats.locationLabel') },
        { icon: FaCalendarAlt, value: t('stats.phase'), label: t('stats.phaseLabel') },
        { icon: FaLeaf, value: t('stats.practices'), label: t('stats.practicesLabel') }
    ];

    const keyFeatures = [
        {
            icon: GiFarmer,
            title: t('features.family.title'),
            description: t('features.family.description')
        },
        {
            icon: GiPlantWatering,
            title: t('features.irrigation.title'),
            description: t('features.irrigation.description')
        },
        {
            icon: MdPrecisionManufacturing,
            title: t('features.processing.title'),
            description: t('features.processing.description')
        },
        {
            icon: GiFruitTree,
            title: t('features.harvest.title'),
            description: t('features.harvest.description')
        }
    ];

    const sustainabilityPractices = [
        {
            icon: FaSeedling,
            title: t('sustainability.organic.title'),
            description: t('sustainability.organic.description')
        },
        {
            icon: FaTint,
            title: t('sustainability.water.title'),
            description: t('sustainability.water.description')
        },
        {
            icon: FaUsers,
            title: t('sustainability.community.title'),
            description: t('sustainability.community.description')
        }
    ];

    const galleryImages = [
        { src: farmImage1, alt: t('gallery.alt1'), caption: t('gallery.caption1'), loading: "lazy" },
        { src: farmImage2, alt: t('gallery.alt2'), caption: t('gallery.caption2'), loading: "lazy" },
        { src: farmImage3, alt: t('gallery.alt3'), caption: t('gallery.caption3'), loading: "lazy" },
        { src: farmImage4, alt: t('gallery.alt4'), caption: t('gallery.caption4'), loading: "lazy" }
    ];

    const timelineData = [
        {
            year: t('timeline.land.year'),
            title: t('timeline.land.title'),
            description: t('timeline.land.description'),
            icon: FaMapMarkerAlt
        },
        {
            year: t('timeline.planting.year'),
            title: t('timeline.planting.title'),
            description: t('timeline.planting.description'),
            icon: FaSeedling
        },
        {
            year: t('timeline.harvest.year'),
            title: t('timeline.harvest.title'),
            description: t('timeline.harvest.description'),
            icon: GiFruitTree
        }
    ];

    const impactStats = [
        { icon: FaTree, value: 50, label: t('impact.hectares'), suffix: "+" },
        { icon: FaUsers, value: 150, label: t('impact.jobs'), suffix: "+" },
        { icon: GiFarmer, value: 100, label: t('impact.farmers'), suffix: "%" },
        { icon: FaChartLine, value: 10, label: t('impact.profits'), suffix: "%" }
    ];

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Helmet>
                <title>The AfriNuts Export Farm | 35-Hectare Cashew Plantation in Odienné, Côte d'Ivoire</title>
                <meta name="description" content="Explore our 35-hectare organic cashew farm in Odienné, Côte d'Ivoire. Block-level tracking, sustainable agroforestry, 3,500 trees, and a 200+ farmer cooperative. First harvest expected 2029." />
                <link rel="canonical" href="https://www.afrinutsexport.com/farm" />
            </Helmet>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "The AfriNuts Export Cashew Plantation",
                "description": "Cultivating West Africa's finest cashews through regenerative agriculture on our 35-hectare family-owned plantation in Odienné, Ivory Coast.",
                "about": {
                    "@type": "Place",
                    "name": "AfriNuts Export Cashew Plantation",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Odienné",
                        "addressCountry": "CI"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 9.51,
                        "longitude": -7.5692
                    }
                },
                "mainEntity": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "description": "Family-owned cashew plantation using climate-smart agricultural techniques. Phase 1 development with first commercial harvest projected for 2031.",
                    "knowsAbout": [
                        "Regenerative Agriculture",
                        "Organic Cashew Farming",
                        "Smart Irrigation",
                        "Sustainable Land Management",
                        "Climate-Smart Agriculture"
                    ],
                    "location": {
                        "@type": "Place",
                        "name": "AfriNuts Export Farm",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Odienné",
                            "addressCountry": "CI"
                        }
                    },
                    "potentialAction": {
                        "@type": "OrderAction",
                        "name": "Request Wholesale Quote",
                        "target": "https://www.afrinutsexport.com/contact"
                    }
                }
            }} />
            <div className="text-text-dark font-sans leading-relaxed">
                {/* Hero */}
                <Section className="flex items-center justify-center text-center min-h-[90vh]">
                    <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                        {/* Left: Text Content */}
                        <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                            <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                                <FaTree className="inline mr-2 text-accent" />{t('hero.subtitle_tag', 'Our Farm')}
                            </Typography>
                            <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                                {t('hero.title')}
                            </motion.h1>

                            {/* Lead Text */}
                            <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                                {t('hero.lead', '35 hectares. 3,500 trees. One custom-built Farm OS tracking every block, every harvest, every expense. This is not just a farm — this is where our technology meets the soil.')}
                            </Typography>

                            {/* Farm Intro Card */}
                            <motion.div variants={fadeIn} className="mb-5">
                                <InfoCard
                                    icon={FaMobile}
                                    title={t('hero.introTitle', 'Farm OS Powered')}
                                    variant="secondary"
                                    showInfoBadge={false}
                                >
                                    <Typography variant="small" className="text-gray-600">
                                        {t('hero.introBody', 'Every tree is mapped. Every block is tracked. Every expense is logged. Our farm runs on the same operating system we built for traceability — not paper, not spreadsheets, not guesswork.')}
                                    </Typography>
                                </InfoCard>
                            </motion.div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                     <FaMapMarkerAlt className="text-[10px]" /> {t('hero.badgeLocation', 'Odienné, CI')}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                    <FaTree className="text-[10px]" /> {t('hero.badgeTrees', '3,500 Trees')}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                                     <FaMobile className="text-[10px]" /> {t('hero.badgeFarmOS', 'Farm OS Tracked')}
                                </span>
                            </div>

                            <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                                <Link to="/trace" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                    <FaSearch className="text-xs" />{t('hero.ctaTrace', 'See Traceability')}
                                </Link>
                                <Link to="/wholesale" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                    <FaBox className="text-xs" />{t('hero.ctaWholesale', 'Wholesale Inquiries')}
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right: Farm Image */}
                        <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                            <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"                                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                        whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                                <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <img src={farmHeroImage} alt="AfriNuts Farm in Odienné" className="w-full h-full object-cover" />
                                <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                    <span className="text-primary text-[11px] font-semibold">{t('hero.imageLabel', '35 Hectares — Odienné')}</span>
                                </div>
                            </motion.div>
                        </motion.div>

                    </motion.div>
                </Section>

                {/* Farm Overview */}
                <Section className="py-10 px-6">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-16">
                            <Typography variant="h2" className="text-primary mb-4">
                                {t('overview.heading')}
                            </Typography>
                            <Typography variant="body" className="max-w-3xl mx-auto">
                                {t('overview.description')}
                            </Typography>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {farmStats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <InfoCard
                                        icon={stat.icon}
                                        title={
                                            !isNaN(Number(stat.value)) ? (
                                                <StatsCounter endValue={Number(stat.value)} suffix="+" />
                                            ) : (
                                                stat.value
                                            )
                                        }
                                        iconColor="text-accent"
                                        className="h-full"
                                    >
                                        {stat.label}
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Related Reading */}
                    <div className="text-center mt-6">
                        <Link to="/blog/how-to-grow-cashew-trees-west-africa"  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full text-sm font-medium transition-colors">
                            <FaBookOpen className="text-xs" />
                            {t('relatedReading.growingGuide')}
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>

                    {/* Live Farm Stats Section */}
                    <section className="py-10">
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                            <LiveFarmStats />
                            <motion.div
                                className="text-center mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <p className="text-text-dark mb-2">
                                    {t('farmOs.title', 'AfriNuts Farm OS — Access for team members')}
                                </p>
                                <p className="text-sm text-text-dark mb-4">
                                    {t('farmOs.description', 'Founders, managers, and investors can log in to manage farm operations, track tasks, and view financial reports.')}
                                </p>
                                <button
                                    onClick={() => {
                                        trackCtaClick('login_farm_os', 'farm_page');
                                        navigate('/login');
                                    }}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all group"
                                >
                                    <span>{t('farmOs.button', 'Login to Farm Operations Center')}</span>
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        </div>
                    </section>

                    {/*Map section*/}
                    <Section className="py-8 sm:py-12 lg:py-16 px-0 sm:px-4">
                        <div className="w-full max-w-7xl mx-auto px-2 sm:px-6">
                            <div className="text-center mb-8 md:mb-12">
                                <Typography variant="h2" className="text-primary mb-4">
                                    {t('farm.map.title')}
                                </Typography>
                                <Typography variant="body" className="max-w-3xl mx-auto text-text-dark">
                                    {t('farm.map.description')}
                                </Typography>
                            </div>

                            <div className="w-full max-w-7xl mx-auto rounded-xl overflow-hidden"
                                 style={{ height: '60vh', minHeight: '350px', maxHeight: '600px' }}>
                                <InteractiveMap
                                    location={t('farm.map.location')}
                                    description={t('farm.map.locationDescription')}
                                    className="h-full w-full"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Key Features */}
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-16">
                            {t('features.title')}
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {keyFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <InfoCard
                                        icon={feature.icon}
                                        title={feature.title}
                                        iconColor="text-accent"
                                        className="h-full"
                                    >
                                        {feature.description}
                                    </InfoCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Farm Development Timeline */}
                <Section className="py-10 sm:py-12 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true }}
                        >
                            <Typography variant="h2" className="text-primary text-center mb-8 md:mb-16">
                                {t('timeline.title')}
                            </Typography>
                        </motion.div>

                        {/* Mobile scroll indicator */}
                        <div className="md:hidden text-center text-sm text-primary mb-4">
                            ↓ {t('timeline.scrollIndicator')} ↓
                        </div>

                        <div className="relative">
                            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-1 bg-accent/30 transform -translate-y-1/2 z-0"></div>

                            <div className="flex md:flex-row flex-nowrap overflow-x-auto pb-4 md:pb-0 md:overflow-visible gap-6 md:gap-0 relative
                scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-accent/30 scroll-snap-x">
                                {timelineData.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-col items-center w-[220px] sm:w-[240px] flex-shrink-0 md:w-1/3 px-0 md:px-4 scroll-snap-align-start transform-gpu group"
                                        initial="hidden"
                                        whileInView="visible"
                                        variants={fadeIn}
                                        viewport={{ once: true }}
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            perspective: '1000px',
                                        }}
                                    >
                                        <motion.div
                                            className={`
                                w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center 
                                font-display text-lg md:text-xl font-bold border-4 shadow-lg mb-4 z-10
                                bg-gradient-to-br from-primary/5 to-accent/5 text-primary border-accent
                                transition-all duration-500 transform-gpu
                                relative
                                mt-0 md:mt-8
                            `}
                                            whileHover={{
                                                scale: 1.15,
                                                rotateY: 5,
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                                            }}
                                            style={{
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            {/* 3D edge effect for year circle */}
                                            <div className="absolute inset-0 rounded-full border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-500" />

                                            {/* Glassy overlay for year circle */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                            <span className="relative z-10">{item.year}</span>
                                        </motion.div>

                                        <motion.div
                                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 p-4 md:p-6 rounded-2xl shadow-lg w-full transform-gpu group/card"
                                            style={{
                                                transformStyle: 'preserve-3d',
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
                                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover/card:translate-z-[-10px] transition-all duration-500" />

                                            {/* Glassy overlay */}
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover/card:opacity-60 transition-opacity duration-500" />

                                            {/* Inner shadow effect */}
                                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover/card:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                            {/* Subtle background pattern */}
                                            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-3 md:mb-4">
                                                    <motion.div
                                                        className="text-accent text-lg md:text-xl bg-accent/20 p-2 rounded-full transform-gpu group-hover/card:scale-110 transition-transform duration-300"
                                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    >
                                                        <item.icon />
                                                    </motion.div>
                                                    <Typography variant="h4" className="text-primary text-lg md:text-xl">
                                                        {item.title}
                                                    </Typography>
                                                </div>
                                                <Typography variant="body" className="text-sm md:text-base">
                                                    {item.description}
                                                </Typography>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Mid-page CTA */}
                <Section className="py-8">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                        <motion.div
                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-6 sm:p-8 transform-gpu"
                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)', transition: { duration: 0.3 } }}
                        >
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px]" />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-30" />
                            <div className="relative z-10">
                                <Typography variant="h2" className="text-primary mb-3">
                                    {t('midCta.title', 'How We Turn Blocks Into Business Units')}
                                </Typography>
                                <Typography variant="body" className="text-gray-600 mb-5 max-w-xl mx-auto">
                                    {t('midCta.description', 'Every hectare is tracked, every tree counted, every expense allocated. See how our operational model creates transparency for investors and partners.')}
                                </Typography>
                                <motion.button
                                    onClick={() => {
                                        trackCtaClick('explore_vision', 'farm_mid_cta');
                                        navigate('/vision');
                                    }}
                                    className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-full transform-gpu transition-all duration-300 inline-flex items-center gap-2 text-sm font-medium bg-white/30 backdrop-blur-sm"
                                    whileHover={{ y: -2, scale: 1.03 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaChartLine />
                                    {t('midCta.button', 'Explore Our Vision')}
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </Section>

                {/* Impact Section */}
                <section className="py-10 px-6 text-primary">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true }}
                        >
                            <Typography variant="h2" className="text-center text-primary mb-16">
                                {t('impact.title')}
                            </Typography>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-center">
                            {impactStats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex justify-center transform-gpu group"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                >
                                    <motion.div
                                        className={`
                            relative flex flex-col items-center
                            px-8 py-8
                            rounded-2xl
                            shadow-xl
                            bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30
                            transition-all duration-500
                            min-w-[220px] max-w-full
                            w-fit
                            transform-gpu
                        `}
                                        style={{
                                            transformStyle: 'preserve-3d',
                                        }}
                                        whileHover={{
                                            y: -8,
                                            scale: 1.05,
                                            rotateY: 3,
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

                                        {/* Subtle background pattern */}
                                        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUs IDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                        <div className="relative z-10">
                                            <motion.div
                                                className="mb-3 text-4xl text-accent transform-gpu group-hover:scale-110 transition-transform duration-500"
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <stat.icon />
                                            </motion.div>

                                            <motion.div
                                                className="text-3xl font-bold mb-1 transform-gpu group-hover:scale-105 transition-transform duration-300"
                                                whileHover={{ y: -2 }}
                                            >
                                                <StatsCounter
                                                    endValue={Number(stat.value)}
                                                    suffix={stat.suffix}
                                                />
                                            </motion.div>

                                            <motion.div
                                                className="text-base font-medium text-text-dark text-center transform-gpu group-hover:scale-105 transition-transform duration-300"
                                                whileHover={{ y: -1 }}
                                            >
                                                <div>
                                                  <div className="font-semibold">{stat.label.label}</div>
                                                  <div className="text-sm text-gray-600">{stat.label.description}</div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* Sustainability Section */}
                <Section className="py-10 sm:py-12 px-6">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-16">
                                <Typography variant="h2" className="text-primary mb-4">
                                    {t('sustainability.title')}
                                </Typography>
                                <Typography variant="body" className="max-w-3xl mx-auto">
                                    {t('sustainability.description')}
                                </Typography>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {sustainabilityPractices.map((practice, index) => (
                                    <motion.div
                                        key={index}
                                        variants={fadeIn}
                                        transition={{ delay: index * 0.1 }}
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                    >
                                        <InfoCard
                                            icon={practice.icon}
                                            title={practice.title}
                                            iconColor="text-accent"
                                            className="h-full"
                                        >
                                            {practice.description}
                                        </InfoCard>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Section>



                {/* Gallery Section */}
                <Section className="py-10 sm:py-12 px-6">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-16">
                            {t('gallery.title')}
                        </Typography>
                        <ImageGallery images={galleryImages} />
                    </div>
                </Section>


                {/* Call to Action */}
                {/* Call to Action - Enhanced with Glassy 3D */}
                <section className="py-16 px-6 text-text-dark">
                    <div className="w-full max-w-4xl mx-auto text-center">
                        <motion.div
                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
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
                                <Typography variant="h2" className="mb-6 text-primary">
                                    {t('cta.title')}
                                </Typography>
                                <Typography variant="lead" className="mb-8 max-w-3xl mx-auto text-text-dark">
                                    {t('cta.description')}
                                </Typography>
                                <motion.button
                                    className="group bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center mx-auto transform-gpu relative overflow-hidden"
                                    onClick={() => {
                                        trackCtaClick('contact_from_farm', 'farm_footer_cta');
                                        navigate('/contact');
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -2,
                                        transition: { duration: 0.2 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {/* Button 3D effect */}
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-300" />

                                    {/* Button glassy overlay */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                                    {/* Button inner glow */}
                                    <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />

                                    <span className="relative z-10 font-medium">
                        {t('cta.button')}
                    </span>
                                    <motion.span
                                        className="ml-2 relative z-10"
                                        whileHover={{ x: 3 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                    >
                                        <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                                    </motion.span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </Suspense>
    );
};

export default Farm;