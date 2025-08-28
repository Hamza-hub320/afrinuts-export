import React, { useState, useRef, useEffect, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, Variants } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@/components/Section/Section';
import {FaTree, FaHandsHelping, FaGlobe, FaChartLine, FaSeedling, FaArrowLeft} from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom';
import heritageImage from '@/assets/images/heritage.webp';
import farmImage from '@/assets/images/farm.webp';
import innovationImage from '@/assets/images/innovation.webp';
import communityImage from '@/assets/images/community.webp';
import futureImage from '@/assets/images/future.webp';

interface StorySection {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    image: string;
    content: string[] | string;
    color: string;
    altKey: string;
    cta?: {
        text: string;
        link: string;
    };
    milestone?: {
        label: string;
        description: string;
    };
    communityImpact?: string | { label: string; statements: string[] };
    videoPlaceholder?: React.ReactNode;
}

const COLLAPSE_LIMIT = 200;

const OurStory: React.FC = () => {
    const { t, i18n } = useTranslation('story');
    const isRTL = i18n.dir() === 'rtl';
    const navigate = useNavigate();

    // Refs for each section to scroll to
    const sectionRefs: RefObject<HTMLDivElement>[] = [];

    const storySections = [
        {
            title: t('sections.heritage.title'),
            icon: FaTree,
            image: heritageImage,
            description: t('sections.heritage.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.heritage.alt'
        },
        {
            title: t('sections.tradition.title'),
            icon: FaSeedling,
            image: farmImage,
            description: t('sections.tradition.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/5 to-accent/10 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.tradition.alt'
        },
        {
            title: t('sections.innovation.title'),
            icon: FaChartLine,
            image: innovationImage,
            description: t('sections.innovation.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.innovation.alt'
        },
        {
            title: t('sections.community.title'),
            icon: FaHandsHelping,
            image: communityImage,
            description: t('sections.community.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/5 to-accent/10 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.community.alt'
        },
        {
            title: t('sections.future.title'),
            icon: FaGlobe,
            image: futureImage,
            description: t('sections.future.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.future.alt'
        }
    ];

    // State for expanded paragraphs (for collapsible content)
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

    // Scroll to section on timeline dot click
    const handleDotClick = (index: number) => {
        const ref = sectionRefs[index];
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Helper to toggle expanded content
    const toggleExpand = (index: number) => {
        setExpandedSections((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Enhanced Framer motion variants for glassy 3D effect
    const contentBoxVariants: Variants = {
        rest: {
            scale: 1,
            y: 0,
            rotateY: 0,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        },
        hover: {
            scale: 1.03,
            y: -8,
            rotateY: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transition: { duration: 0.3 }
        }
    };

    // RTL-aware flex direction helper
    const getFlexDirection = (index: number) => {
        if (isRTL) {
            return index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row';
        }
        return index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse';
    };

    // RTL-aware margin helper for content box
    const getContentMargin = (index: number) => {
        if (isRTL) {
            return index % 2 === 0 ? 'md:ml-16' : 'md:mr-16';
        }
        return index % 2 === 0 ? 'md:mr-16' : 'md:ml-16';
    };

    // RTL-aware margin helper for image box
    const getImagePadding = (index: number) => {
        if (isRTL) {
            return index % 2 === 0 ? 'md:pl-16' : 'md:pr-16';
        }
        return index % 2 === 0 ? 'md:pr-16' : 'md:pl-16';
    };

    return (
        <main className={`text-text-dark font-sans leading-relaxed ${isRTL ? 'direction-rtl' : 'direction-ltr'}`}>
            {/* Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[50vh] md:min-h-[50vh] bg-gradient-to-b bg-transparent"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            {t('hero.subtitle')}
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
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            {t('hero.quote')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Back Button */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.button
                        onClick={() => navigate('/executive-team')}
                        className="flex items-center text-primary hover:text-accent transition-colors"
                        whileHover={{ x: -5 }}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        <FaArrowLeft className="mr-2" />
                        {t('hero.backToExecutive')}
                    </motion.button>
                </div>
            </Section>

            {/* Intro Section - Enhanced with Glassy 3D */}
            <motion.div
                className="py-16 md:py-24 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 transform-gpu"
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
            >
                <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu">
                    {/* 3D edge effect */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] transition-all duration-500" />

                    {/* Glassy overlay */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 transition-opacity duration-500" />

                    {/* Inner shadow effect */}
                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                    <div className="relative z-10 text-center max-w-4xl mx-auto">
                        <Typography variant="h2" className="mb-6 text-primary">
                            {t('intro.title')}
                        </Typography>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            {t('intro.description')}
                        </Typography>
                    </div>
                </div>
            </motion.div>

            {/* Story Timeline */}
            <Section className="py-16 md:py-24">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('timeline.title')}
                        </Typography>
                        <Typography variant="body" className="max-w-3xl mx-auto">
                            {t('timeline.subtitle')}
                        </Typography>
                    </motion.div>

                    <div className="relative">
                        {/* Vertical line - thicker for better visibility */}
                        <div className={`hidden md:block absolute left-1/2 h-full w-1 bg-primary/30 transform -translate-x-1/2`}></div>

                        {/* Story Sections */}
                        <div className="space-y-16 md:space-y-24">
                            {storySections.map((section, index) => {
                                const isExpanded = expandedSections[index] ?? false;
                                const descriptionArray = Array.isArray(section.description) ? section.description : [section.description];
                                // Determine if content needs collapsing (not used here, but left for possible future use)
                                const combinedDescription = descriptionArray.join(' ');
                                // Keep layout and timeline dot, but replace content card with InfoCard
                                return (
                                    <motion.div
                                        key={index}
                                        className="relative"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={fadeIn}
                                        ref={sectionRefs[index]}
                                        id={`section-${index}`}
                                        dir={isRTL ? 'rtl' : 'ltr'}
                                    >
                                        <div className={`flex flex-col ${getFlexDirection(index)} gap-8 md:gap-16 items-center`}>
                                            {/* Image or video placeholder */}
                                            <div className={`flex-1 ${getImagePadding(index)}`}>
                                                <motion.div
                                                    className="rounded-3xl overflow-hidden shadow-xl border-2 border-white/20"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <img
                                                        src={section.image}
                                                        alt={t(section.altKey)}
                                                        className="w-full h-auto object-cover aspect-video md:aspect-square"
                                                        loading="lazy"
                                                    />
                                                </motion.div>
                                            </div>
                                            {/* InfoCard content */}
                                            <div className={`flex-1 ${getContentMargin(index)}`}>
                                                <InfoCard
                                                    title={section.title}
                                                    image={section.image}
                                                    icon={section.icon}
                                                    alt={t(section.altKey)}
                                                    color={section.color}
                                                >
                                                    {Array.isArray(section.description)
                                                        ? section.description.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
                                                        : section.description}
                                                </InfoCard>
                                            </div>
                                        </div>
                                        {/* Static Timeline dot */}
                                        <div
                                            className="hidden md:block absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-primary border-4 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-10 transform-gpu"
                                            aria-hidden="true"
                                        >
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Section>

            {/* Call to Action - Enhanced with Glassy 3D */}
            <Section className="py-16 text-text-dark">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        whileHover={{
                            y: -5,
                            rotateY: 2,
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 transition-opacity duration-500" />

                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <Typography variant="h2" className="mb-6">
                                {t('cta.title')}
                            </Typography>
                            <Typography variant="lead" className="mb-8 max-w-3xl mx-auto">
                                {t('cta.subtitle')}
                            </Typography>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link
                                    to="/contact"
                                    className="group bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center mx-auto transform-gpu relative overflow-hidden"
                                >
                                    {t('cta.button')}
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default OurStory;