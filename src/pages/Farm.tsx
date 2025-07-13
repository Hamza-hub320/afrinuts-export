import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTree, FaMapMarkerAlt, FaCalendarAlt, FaLeaf, FaTint, FaUsers, FaChartLine, FaSeedling } from 'react-icons/fa';
import { GiFarmer, GiPlantWatering, GiFruitTree } from 'react-icons/gi';
import { MdPrecisionManufacturing } from 'react-icons/md';
import farmImage1 from '../assets/images/farm-1.jpg';
import farmImage2 from '../assets/images/farm-2.jpg';
import farmImage3 from '../assets/images/farm-3.jpg';
import farmImage4 from '../assets/images/farm-4.jpg';
import farmHeroImage from '../assets/images/farm-hero.jpg';
import farmTimelineImage from '../assets/images/farm-timeline.jpg';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Section from "../components/Section/Section";
import { Typography } from "../components/Typography/Typography";
import FarmTimeline from '../components/FarmTimeline/FarmTimeline';
import SustainabilityBadge from '../components/SustainabilityBadge/SustainabilityBadge';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import StatsCounter from '../components/StatsCounter/StatsCounter';

const Farm = () => {
    const { t } = useTranslation('farm');

    const farmStats = [
        { icon: <FaTree className="text-3xl" />, value: "50 hectares", label: t('stats.areaLabel') },
        { icon: <FaMapMarkerAlt className="text-3xl" />, value: "Odienné", label: t('stats.locationLabel') },
        { icon: <FaCalendarAlt className="text-3xl" />, value: "Phase 1", label: t('stats.phaseLabel') },
        { icon: <FaLeaf className="text-3xl" />, value: "Organic", label: t('stats.practicesLabel') }
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
        { src: farmImage1, alt: t('gallery.alt1'), caption: t('gallery.caption1') },
        { src: farmImage2, alt: t('gallery.alt2'), caption: t('gallery.caption2') },
        { src: farmImage3, alt: t('gallery.alt3'), caption: t('gallery.caption3') },
        { src: farmImage4, alt: t('gallery.alt4'), caption: t('gallery.caption4') }
    ];

    const timelineData = [
        {
            year: 2026,
            title: t('timeline.land.title'),
            description: t('timeline.land.description'),
            icon: <FaMapMarkerAlt />
        },
        {
            year: 2027,
            title: t('timeline.planting.title'),
            description: t('timeline.planting.description'),
            icon: <FaSeedling />
        },
        {
            year: 2031,
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

    return (
        <div className="bg-background text-text-dark font-sans leading-relaxed">
            {/* Hero Section */}
            <Section
                fullHeight={false}
                bgImage={farmHeroImage}
                overlay
                overlayColor="bg-primary/"
                className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[60vh] pb-12 px-6"
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
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
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
                                className="bg-afri-light rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
                                whileHover={{ y: -5 }}
                            >
                                <div className="text-orange-500 mb-4 flex justify-center">{stat.icon}</div>
                                <Typography variant="h3" className="text-primary text-2xl font-bold mb-2">
                                    {stat.value}
                                </Typography>
                                <Typography variant="body" className="text-primary">
                                    {stat.label}
                                </Typography>
                            </motion.div>
                        ))}
                    </div>

                    {/* Key Features */}
                    <div className="mb-16">
                        <Typography variant="h3" className="text-primary text-center mb-8">
                            {t('features.title')}
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {keyFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-white border border-afri-light rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className="mb-4">{feature.icon}</div>
                                    <Typography variant="h4" className="text-primary mb-2">
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body" className="text-primary">
                                        {feature.description}
                                    </Typography>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Farm Development Timeline */}
            <section
                className="py-20 px-6 bg-afri-light bg-cover bg-center"
                style={{ backgroundImage: `url(${farmTimelineImage})` }}
            >
                <div className="max-w-6xl mx-auto">
                    <Typography variant="h2" className="text-primary text-center mb-16">
                        {t('timeline.title')}
                    </Typography>
                    <FarmTimeline items={timelineData} />
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-20 px-6 bg-afri-primary text-white">
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
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <Typography variant="h2" className="text-primary text-center mb-16">
                        {t('gallery.title')}
                    </Typography>
                    <ImageGallery images={galleryImages} />
                </div>
            </section>

            {/* Sustainability Section */}
            <section className="py-20 px-6 bg-afri-light">
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
                            <SustainabilityBadge
                                key={index}
                                icon={practice.icon}
                                title={practice.title}
                                description={practice.description}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 bg-afri-secondary text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <Typography variant="h2" className="mb-6">
                        {t('cta.title')}
                    </Typography>
                    <Typography variant="body" className="mb-8">
                        {t('cta.description')}
                    </Typography>
                    <motion.button
                        className="mt-6 group bg-accent hover:bg-dark-orange text-white px-6 py-2 rounded-full transition-all duration-300 inline-flex items-center mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('cta.button')}
                    </motion.button>
                </div>
            </section>
        </div>
    );
};

export default Farm;