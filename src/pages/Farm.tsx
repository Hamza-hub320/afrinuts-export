import React, { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaTree, FaArrowRight, FaMapMarkerAlt, FaCalendarAlt, FaLeaf, FaTint, FaUsers, FaChartLine, FaSeedling } from 'react-icons/fa';
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
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";

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
            <div className="text-text-dark font-sans leading-relaxed">
                {/* Hero Section */}
                <Section
                    fullHeight={false}
                    bgImage={farmHeroImage}
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

                    {/*Map section*/}
                    <Section className="py-8 sm:py-12 lg:py-16">
                        <div className="w-full max-w-7xl mx-auto">
                            <div className="text-center mb-8 md:mb-12">
                                <Typography variant="h2" className="text-primary mb-4">
                                    {t('farm.map.title')}
                                </Typography>
                                <Typography variant="body" className="max-w-3xl mx-auto text-text-dark">
                                    {t('farm.map.description')}
                                </Typography>
                            </div>

                            <div className="w-full max-w-7xl mx-auto rounded-xl overflow-hidden"
                                 style={{ height: '60vh', minHeight: '300px', maxHeight: '600px' }}>
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

                {/* Live Farm Stats Section */}
                <section className="py-10">
                    <div className="container mx-auto px-4">
                        <LiveFarmStats />
                        {!user && (
                            <motion.div
                                className="text-center mt-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <p className="text-gray-600 mb-4">
                                    Want to access the full farm management dashboard?
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg transition-all group"
                                >
                                    <span>Login to Farm Operations Center</span>
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </section>

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
                                    onClick={() => navigate('/contact')}
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