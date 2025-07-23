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
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';

import Section from "../components/Section/Section";
import Typography from "../components/Typography/Typography";
import ImageGallery from '../components/ImageGallery/ImageGallery';
import StatsCounter from '../components/StatsCounter/StatsCounter';
import GlowingCard from '../components/GlowingCard/GlowingCard';

const Farm = () => {
    const { t } = useTranslation('farm');

    const farmStats = [
        { icon: <FaTree className="text-3xl" />, value: t('stats.area'), label: t('stats.areaLabel') },
        { icon: <FaMapMarkerAlt className="text-3xl" />, value: t('stats.location'), label: t('stats.locationLabel') },
        { icon: <FaCalendarAlt className="text-3xl" />, value: t('stats.phase'), label: t('stats.phaseLabel') },
        { icon: <FaLeaf className="text-3xl" />, value: t('stats.practices'), label: t('stats.practicesLabel') }
    ];

    const keyFeatures = [
        {
            icon: <GiFarmer className="text-4xl text-afri-secondary text-orange-500" />,
            title: t('features.family.title'),
            description: t('features.family.description')
        },
        {
            icon: <GiPlantWatering className="text-4xl text-afri-secondary text-orange-500" />,
            title: t('features.irrigation.title'),
            description: t('features.irrigation.description')
        },
        {
            icon: <MdPrecisionManufacturing className="text-4xl text-afri-secondary text-orange-500" />,
            title: t('features.processing.title'),
            description: t('features.processing.description')
        },
        {
            icon: <GiFruitTree className="text-4xl text-afri-secondary text-orange-500" />,
            title: t('features.harvest.title'),
            description: t('features.harvest.description')
        }
    ];

    const sustainabilityPractices = [
        {
            icon: <FaSeedling className="text-2xl" />,
            title: t('sustainability.organic.title'),
            description: t('sustainability.organic.description')
        },
        {
            icon: <FaTint className="text-2xl" />,
            title: t('sustainability.water.title'),
            description: t('sustainability.water.description')
        },
        {
            icon: <FaUsers className="text-2xl" />,
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
            icon: <FaMapMarkerAlt />
        },
        {
            year: t('timeline.planting.year'),
            title: t('timeline.planting.title'),
            description: t('timeline.planting.description'),
            icon: <FaSeedling />
        },
        {
            year: t('timeline.harvest.year'),
            title: t('timeline.harvest.title'),
            description: t('timeline.harvest.description'),
            icon: <GiFruitTree />
        }
    ];

    const impactStats = [
        { value: 50, label: t('impact.hectares'), suffix: "+", icon: <FaTree /> },
        { value: 150, label: t('impact.jobs'), suffix: "+", icon: <FaUsers /> },
        { value: 100, label: t('impact.farmers'), suffix: "%", icon: <GiFarmer /> },
        { value: 10, label: t('impact.profits'), suffix: "%", icon: <FaChartLine /> }
    ];

    const navigate = useNavigate();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className=" text-text-dark font-sans leading-relaxed">
                {/* Hero Section */}
                <Section
                    fullHeight={false}
                    bgImage={farmHeroImage}
                    overlay
                    overlayColor="bg-primary/"
                    className="flex items-end justify-start text-center min-h-[35vh] md:min-h-[60vh] pb-12 mx-4 sm:mx-8 mt-32 pt-16 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
                >
                    <motion.div
                        className="max-w-2xl px-6 py-10 bg-white/75 backdrop-blur-xs rounded-xl"
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

                {/* Farm Overview */}
                <section className="py-16 px-6">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
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
                                    <GlowingCard key={index}>
                                        <div className="text-ccent mb-4 flex justify-center">{stat.icon}</div>
                                        <Typography variant="h3" className="text-primary text-2xl font-bold mb-2">
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body" className="text-primary">
                                            {stat.label}
                                        </Typography>
                                    </GlowingCard>
                                ))}
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                            <Typography variant="h3" className="text-primary text-center mb-8">
                                {t('features.title')}
                            </Typography>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {keyFeatures.map((feature, index) => (
                                    <GlowingCard key={index} hoverEffect="scale">
                                        <div className="mb-4">{feature.icon}</div>
                                        <Typography variant="h4" className="text-primary mb-2">
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body" className="text-primary">
                                            {feature.description}
                                        </Typography>
                                    </GlowingCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Farm Development Timeline */}
                <section className="py-16 md:py-20 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto">
                        <Typography variant="h2" className="text-primary text-center mb-8 md:mb-16">
                            {t('timeline.title')}
                        </Typography>

                        {/* Mobile scroll indicator */}
                        <div className="md:hidden text-center text-sm text-primary mb-4">
                            ↓ {t('timeline.scrollIndicator')} ↓
                        </div>

                        <div className="relative">
                            <div className="hidden md:block absolute left-0 right-0 top-1/2 h-1 bg-accent transform -translate-y-1/2"></div>

                            <div className="flex md:flex-row flex-nowrap overflow-x-auto pb-4 md:pb-0 md:overflow-visible gap-8 md:gap-0 relative">
                                {timelineData.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex flex-col items-center w-[280px] flex-shrink-0 md:w-1/3 px-0 md:px-4"
                                        initial="hidden"
                                        whileInView="visible"
                                        variants={fadeIn}
                                        viewport={{ once: true }}
                                    >
                                        <div className={`
                                        w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center 
                                        font-display text-lg md:text-xl font-bold border-4 shadow-lg mb-4 z-10
                                        bg-white text-accent border-accent
                                        transition-all duration-300 md:hover:scale-110
                                        touch-target
                                        relative
                                    `}>
                                            {item.year}
                                        </div>

                                        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg w-full md:mt-8 border border-gray-100">
                                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                                <div className="text-accent text-lg md:text-xl">
                                                    {item.icon}
                                                </div>
                                                <Typography variant="h4" className="text-primary text-lg md:text-xl">
                                                    {item.title}
                                                </Typography>
                                            </div>
                                            <Typography variant="body" className="text-sm md:text-base">
                                                {item.description}
                                            </Typography>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Impact Section */}
                <section className="py-16 px-6 text-white">
                    <div className="max-w-6xl mx-auto">
                        <Typography variant="h2" className="text-center text-primary mb-16">
                            {t('impact.title')}
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {impactStats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial="hidden"
                                    whileInView="visible"
                                    variants={fadeIn}
                                    viewport={{ once: true }}
                                >
                                    <StatsCounter
                                        endValue={stat.value}
                                        suffix={stat.suffix}
                                        className="text-4xl font-bold mb-2 text-afri-secondary"
                                    />
                                    <Typography variant="body" className="text-lg font-medium text-text-dark/90">
                                        {stat.label}
                                    </Typography>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section className="py-16 px-6">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <Typography variant="h2" className="text-primary text-center mb-16">
                            {t('gallery.title')}
                        </Typography>
                        <ImageGallery images={galleryImages} />
                    </div>
                </section>

                {/* Sustainability Section */}
                <section className="py-20 px-6">
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
                                    <GlowingCard key={index}>
                                        <div className="flex flex-col items-center text-center h-full">
                                            <div className="text-accent text-3xl mb-4">{practice.icon}</div>
                                            <Typography variant="h4" className="text-primary mb-2">
                                                {practice.title}
                                            </Typography>
                                            <Typography variant="body" className="text-primary">
                                                {practice.description}
                                            </Typography>
                                        </div>
                                    </GlowingCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 px-6 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <Typography variant="h2" className="mb-6">
                            {t('cta.title')}
                        </Typography>
                        <Typography variant="body" className="mb-8">
                            {t('cta.description')}
                        </Typography>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                            onClick={() => navigate('/contact')}
                        >
                            {t('cta.button')}
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>
                </section>
            </div>
        </Suspense>
    );
};

export default Farm;