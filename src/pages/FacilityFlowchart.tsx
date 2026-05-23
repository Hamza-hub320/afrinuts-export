import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    FaWarehouse,
    FaIndustry,
    FaBox,
    FaTruck,
    FaShower,
    FaPray,
    FaChalkboardTeacher,
    FaUtensils,
    FaWater,
    FaSolarPanel,
    FaExpand,
    FaInfoCircle,
    FaArrowLeft,
    FaCertificate,
    FaArrowRight,
    FaArrowLeft as FaPrev,
    FaArrowRight as FaNext,
    FaPlay,
    FaPause,
    FaGlobe,
    FaShieldAlt,
    FaCogs,
    FaLeaf,
    FaRecycle,
    FaChartLine,
    FaUsers,
    FaTree,
    FaFlask,
    FaCalendarAlt,
    FaHeart, FaHandSparkles, FaClock, FaDrawPolygon
} from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import { trackCtaClick } from '@/utils/analytics';
import JsonLd from "@/components/Seo/JsonLd";
import { Helmet } from 'react-helmet-async';

const FacilityFlowchart: React.FC = () => {
    const { t } = useTranslation('facility');
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState<'process' | 'staff' | 'utilities'>('process');
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    const iconMap: Record<string, React.ComponentType> = {
        FaIndustry,
        FaWarehouse,
        FaBox,
        FaTruck,
        FaShower,
        FaPray,
        FaChalkboardTeacher,
        FaUtensils,
        FaWater,
        FaSolarPanel,
        FaExpand,
        FaCertificate,
        FaTree,
        FaUsers,
        FaChartLine,
        FaRecycle,
        FaLeaf,
        FaCogs,
        FaShieldAlt,
        FaGlobe, FaFlask,
        FaCalendarAlt,
        FaHeart,
        FaHandSparkles,
    };

    // Facility zones by category
    const facilityZones = {
        process: [
            {
                title: 'Raw Nut Reception & Weighbridge',
                icon: FaTruck,
                description: t('zones.reception.description'),
                features: t('zones.reception.features', { returnObjects: true }),
            },
            {
                title: 'Raw Nut Storage Warehouse',
                icon: FaWarehouse,
                description: t('zones.storage.description'),
                features: t('zones.storage.features', { returnObjects: true }),
            },
            {
                title: 'Processing Hall - Dirty Zone',
                icon: FaIndustry,
                description: t('zones.dirtyZone.description'),
                features: t('zones.dirtyZone.features', { returnObjects: true }),
            },
            {
                title: 'Processing Hall - Clean Zone',
                icon: FaIndustry,
                description: t('zones.cleanZone.description'),
                features: t('zones.cleanZone.features', { returnObjects: true }),
            },
            {
                title: 'Grading & Packing Section',
                icon: FaBox,
                description: t('zones.grading.description'),
                features: t('zones.grading.features', { returnObjects: true }),
            },
            {
                title: 'Finished Goods Warehouse',
                icon: FaWarehouse,
                description: t('zones.finished.description'),
                features: t('zones.finished.features', { returnObjects: true }),
            },
            {
                title: 'Dispatch & Export Bay',
                icon: FaTruck,
                description: t('zones.dispatch.description'),
                features: t('zones.dispatch.features', { returnObjects: true }),
            }
        ],
        staff: [
            {
                title: 'Locker Rooms & Hygiene Stations',
                icon: FaShower,
                description: t('zones.locker.description'),
                features: t('zones.locker.features', { returnObjects: true }),
            },
            {
                title: 'Prayer Space & Rest Area',
                icon: FaPray,
                description: t('zones.prayer.description'),
                features: t('zones.prayer.features', { returnObjects: true }),
            },
            {
                title: 'Training / Meeting Room',
                icon: FaChalkboardTeacher,
                description: t('zones.training.description'),
                features: t('zones.training.features', { returnObjects: true }),
            },
            {
                title: 'Canteen',
                icon: FaUtensils,
                description: t('zones.canteen.description'),
                features: t('zones.canteen.features', { returnObjects: true }),
            }
        ],
        utilities: [
            {
                title: 'Water Treatment Plant',
                icon: FaWater,
                description: t('zones.water.description'),
                features: t('zones.water.features', { returnObjects: true }),
            },
            {
                title: 'Biomass Boiler / Solar PV',
                icon: FaSolarPanel,
                description: t('zones.energy.description'),
                features: t('zones.energy.features', { returnObjects: true }),
            },
            {
                title: 'Future Expansion Area',
                icon: FaExpand,
                description: t('zones.expansion.description'),
                features: t('zones.expansion.features', { returnObjects: true }),
            }
        ]
    };

    const currentZones = facilityZones[activeCategory];
    const currentZone = currentZones[activeStep];

    // Auto-play animation
    useEffect(() => {
        if (isPlaying) {
            animationRef.current = setInterval(() => {
                setActiveStep(prev => (prev + 1) % currentZones.length);
            }, 4000);
        } else if (animationRef.current) {
            clearInterval(animationRef.current);
        }

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isPlaying, activeStep, currentZones.length]);

    const nextStep = () => {
        setActiveStep(prev => (prev + 1) % currentZones.length);
    };

    const prevStep = () => {
        setActiveStep(prev => (prev - 1 + currentZones.length) % currentZones.length);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Helper to get features array safely
    const getFeatures = (key: string): string[] => {
        const result = t(key, { returnObjects: true });
        return Array.isArray(result) ? result.map(String) : [];
    };

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>Cashew Processing Facility Flowchart | AfriNuts Export</title>
                <meta name="description" content="Explore the layout of AfriNuts Export's future cashew processing facility in Odienné, Côte d'Ivoire. Zone-by-zone breakdown of reception, processing, grading, staff facilities, and utilities." />
                <link rel="canonical" href="https://www.afrinutsexport.com/processing/facility-flowchart" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Cashew Processing Facility Flowchart | AfriNuts Export",
                "description": "Detailed zone-by-zone layout of AfriNuts Export's planned cashew processing center in Odienné, Côte d'Ivoire — from raw nut reception to export dispatch.",
                "about": {
                    "@type": "Place",
                    "name": "AfriNuts Export Processing Center",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Odienné",
                        "addressCountry": "CI"
                    }
                }
            }} />
            <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-[88px] pb-2">
            <div className="text-sm text-gray-400 mb-4 flex items-center gap-1 flex-wrap">
                <Link to="/" className="hover:text-primary transition-colors">{t('breadcrumbs.home', 'Home')}</Link>
                <span>/</span>
                <Link to="/farm" className="hover:text-primary transition-colors">{t('breadcrumbs.farm', 'Farm')}</Link>
                <span>/</span>
                <Link to="/processing" className="hover:text-primary transition-colors">{t('breadcrumbs.processing', 'Processing')}</Link>
                <span>/</span>
                <span className="text-primary font-medium">{t('breadcrumbs.facilityFlowchart', 'Facility Flowchart')}</span>
            </div>
            </div>
            {/* Hero Section */}
            <Section  fullHeight={false} className="flex items-center justify-center text-center min-h-[40vh]">
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="subhead"
                            className="uppercase tracking-widest text-primary mb-4"
                        >
                            <FaDrawPolygon className="inline mr-3 text-accent" />{t('hero.subtitle')}
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        {t('hero.title')}
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="lead"
                            className="text-text-dark max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('hero.description')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Introduction */}
            <Section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-6">
                            {t('introduction.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-4xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('introduction.description')}
                        </Typography>
                    </motion.div>

                    {/* Facility at a Glance */}
                    <Section className="py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">
                            <motion.div
                                className="text-center mb-12"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                            >
                                <Typography variant="h3" className="mb-4">
                                    {t('facilityStats.title')}
                                </Typography>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {(t('facilityStats.stats', { returnObjects: true }) as { label: string; value: string; icon: string }[]).map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true }}
                                        variants={fadeIn}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <InfoCard
                                            icon={iconMap[stat.icon] || FaIndustry}
                                            title={stat.value}
                                            subtitle={stat.label}
                                            iconColor="text-primary"
                                            showInfoBadge={false}
                                            className="h-full"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* Key Features Grid */}
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {[
                            {
                                title: t('features.hygiene.title'),
                                description: t('features.hygiene.description'),
                                icon: FaShower,
                                variant: 'primary' as const
                            },
                            {
                                title: t('features.efficiency.title'),
                                description: t('features.efficiency.description'),
                                icon: FaIndustry,
                                variant: 'accent' as const
                            },
                            {
                                title: t('features.sustainability.title'),
                                description: t('features.sustainability.description'),
                                icon: FaSolarPanel,
                                variant: 'secondary' as const
                            }
                        ].map((feature, index) => (
                            <InfoCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                showInfoBadge={false}
                                variant={feature.variant}
                                className="h-full"
                            >
                                <Typography variant="body">
                                    {feature.description}
                                </Typography>
                            </InfoCard>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* Facility Zones Navigation */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-6">
                            {t('facilityLayout.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto mb-8 text-base md:text-lg leading-relaxed"
                        >
                            {t('facilityLayout.description')}
                        </Typography>

                        {/* Category Selection */}
                        <div className="flex justify-center space-x-4 mb-12">
                            {[
                                { key: 'process', label: t('categories.process'), icon: FaIndustry },
                                { key: 'staff', label: t('categories.staff'), icon: FaShower },
                                { key: 'utilities', label: t('categories.utilities'), icon: FaSolarPanel }
                            ].map((category) => (
                                <motion.button
                                    key={category.key}
                                    onClick={() => {
                                        setActiveCategory(category.key as 'process' | 'staff' | 'utilities');
                                        setActiveStep(0);
                                        setIsPlaying(false);
                                    }}
                                    className={`px-2 py-1 text-xs sm:px-6 sm:py-3 sm:text-base rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                                        activeCategory === category.key
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-white text-primary border-2 border-primary/30 hover:border-primary/50'
                                    }`}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <category.icon />
                                    <span>{category.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Zone Carousel */}
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 shadow-xl overflow-hidden transform-gpu"
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
                            rotateY: 2,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <Typography variant="h3" className="mb-2">
                                    {currentZone.title}
                                </Typography>
                                <Typography
                                    variant="body-sm"
                                    className="text-text-dark/70"
                                >
                                    {t('facilityLayout.zone')} {activeStep + 1} of {currentZones.length}
                                </Typography>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
                                {/* Zone Icon/Visual */}
                                <div className="flex-1">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 flex justify-center items-center h-48">
                                        <div className="text-6xl text-primary">
                                            <currentZone.icon />
                                        </div>
                                    </div>
                                </div>

                                {/* Zone Description */}
                                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                                    <Typography variant="body" className="mb-4">
                                        {currentZone.description}
                                    </Typography>

                                    <Typography variant="h5" className="mb-3">
                                        {t('featuresTitle')}
                                    </Typography>
                                    <ul className="space-y-2">
                                        {(Array.isArray(currentZone.features) ? currentZone.features : []).map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                                <Typography variant="body-sm">
                                                    {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex justify-center items-center space-x-4">
                                <motion.button
                                    onClick={prevStep}
                                    className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Previous zone"
                                >
                                    <FaPrev />
                                </motion.button>

                                <motion.button
                                    onClick={togglePlay}
                                    className="px-6 py-3 bg-primary text-white rounded-full flex items-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>{isPlaying ? t('controls.pause') : t('controls.play')}</span>
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                </motion.button>

                                <motion.button
                                    onClick={nextStep}
                                    className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Next zone"
                                >
                                    <FaNext />
                                </motion.button>
                            </div>

                            {/* Progress indicators */}
                            <div className="mt-6 flex justify-center space-x-2">
                                {currentZones.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            index === activeStep
                                                ? 'bg-primary scale-125'
                                                : 'bg-primary/30 hover:bg-primary/50'
                                        }`}
                                        aria-label={`Go to zone ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Quality Control Lab */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('qualityLab.title')}
                        </Typography>
                        <Typography variant="lead" className="max-w-3xl mx-auto text-text-dark/70">
                            {t('qualityLab.subtitle')}
                        </Typography>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(t('qualityLab.capabilities', { returnObjects: true }) as Array<{ test: string; method: string; standard: string }>).map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <InfoCard
                                    icon={FaFlask}
                                    title={item.test}
                                    showInfoBadge={false}
                                    iconColor="text-primary"
                                    className="h-full"
                                >
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium text-gray-700">{t('qualityLab.method')}:</span> {item.method}</p>
                                        <p><span className="font-medium text-gray-700">{t('qualityLab.standard')}:</span> {item.standard}</p>
                                    </div>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        className="mt-8 p-4 bg-primary/5 rounded-xl text-center"
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Typography variant="small" className="text-primary">{t('qualityLab.note')}</Typography>
                    </motion.div>
                </div>
            </Section>

            {/* Worker Safety & Welfare */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">{t('workerWelfare.title')}</Typography>
                        <Typography variant="lead" className="max-w-3xl mx-auto text-text-dark/70">{t('workerWelfare.subtitle')}</Typography>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(t('workerWelfare.features', { returnObjects: true }) as Array<{ area: string; details: string; icon: string }>).map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <InfoCard
                                    icon={iconMap[item.icon] || FaShieldAlt}
                                    title={item.area}
                                    showInfoBadge={false}
                                    iconColor="text-accent"
                                    className="h-full"
                                >
                                    <Typography variant="small">{item.details}</Typography>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Compliance & Standards Section */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('compliance.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('compliance.description')}
                        </Typography>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <InfoCard
                            icon={FaShower}
                            title={t('compliance.hygiene.title')}
                            showInfoBadge={false}
                            variant="primary"
                        >
                            <ul className="space-y-3">
                                {getFeatures('compliance.hygiene.features').map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <FaInfoCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                                        <Typography variant="body">
                                            {feature}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </InfoCard>

                        <InfoCard
                            icon={FaCertificate}
                            title={t('compliance.certifications.title')}
                            showInfoBadge={false}
                            variant="accent"
                        >
                            {t('compliance.certifications.description') && (
                                <Typography variant="small" className="text-gray-500 mb-4 italic">
                                    {t('compliance.certifications.description')}
                                </Typography>
                            )}
                            <ul className="space-y-3">
                                {getFeatures('compliance.certifications.standards').map((standard, index) => (
                                    <li key={index} className="flex items-start">
                                        <FaClock className="text-amber-500 mt-1 mr-3 flex-shrink-0" />
                                        <Typography variant="body">
                                            {standard}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </InfoCard>
                    </div>
                </div>
            </Section>

            {/* Project Timeline */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">{t('projectTimeline.title')}</Typography>
                        <Typography variant="lead" className="max-w-3xl mx-auto text-text-dark/70">{t('projectTimeline.description')}</Typography>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {(t('projectTimeline.milestones', { returnObjects: true }) as Array<{ phase: string; milestone: string; status: string; icon: string }>).map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <InfoCard
                                    icon={iconMap[item.icon] || FaCalendarAlt}
                                    title={item.phase}
                                    subtitle={item.milestone}
                                    iconColor={
                                        item.status === 'In Progress' ? 'text-yellow-500' :
                                            item.status === 'Completed' ? 'text-green-500' : 'text-gray-400'
                                    }
                                    showInfoBadge={false}
                                    className="h-full"
                                >
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                            item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                            {item.status}
                        </span>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Call to Action */}
            <Section className="py-16 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <InfoCard
                        icon={FaIndustry}
                        title={t('cta.title')}
                        showInfoBadge={false}
                        variant="primary"
                        className="text-center"
                    >
                        <Typography variant="lead" className="text-text-dark mb-8">
                            {t('cta.description')}
                        </Typography>
                        <motion.button
                            className="group relative bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-medium shadow-lg transform-gpu hover:scale-105"
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                trackCtaClick('contact', 'facility_page');
                                navigate('/contact');
                            }}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {t('cta.button')}
                                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                            </span>
                        </motion.button>
                    </InfoCard>
                </div>
            </Section>
            <div className="text-center mt-4 pb-8">
                <Link to="/farm" className="text-primary hover:text-accent text-sm flex items-center justify-center gap-1">
                    <FaArrowLeft /> {t('cta.backToFarm', 'Back to Farm')}
                </Link>
            </div>
        </main>
    );
};

export default FacilityFlowchart;