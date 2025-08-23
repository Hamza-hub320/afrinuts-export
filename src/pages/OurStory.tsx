import React, { useState, useRef, useEffect, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, Variants } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FaTree, FaHandsHelping, FaWater, FaMosque, FaGlobe, FaChartLine, FaSeedling } from "react-icons/fa";
import { Link } from 'react-router-dom';
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

    // Refs for each section to scroll to
    const sectionRefs: RefObject<HTMLDivElement>[] = [];

    const storySections: StorySection[] = [
        {
            title: t('sections.heritage.title'),
            icon: FaTree,
            image: heritageImage,
            content: t('sections.heritage.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.heritage.alt',
            cta: {
                text: t('sections.heritage.cta', 'Learn More About Our Heritage'),
                link: '/heritage'
            },
            milestone: {
                label: t('sections.heritage.milestone.label', '100+ Years'),
                description: t('sections.heritage.milestone.description', 'A century of preserving our culture')
            },
            communityImpact: t('sections.heritage.communityImpact'),
        },
        {
            title: t('sections.tradition.title'),
            icon: FaSeedling,
            image: farmImage,
            content: t('sections.tradition.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/5 to-accent/10 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.tradition.alt',
            cta: {
                text: t('sections.tradition.cta', 'Learn More About Our Farms'),
                link: '/farms'
            },
            milestone: {
                label: t('sections.tradition.milestone.label', '500+ Acres'),
                description: t('sections.tradition.milestone.description', 'Sustainably farmed land')
            },
            communityImpact: t('sections.tradition.communityImpact'),
        },
        {
            title: t('sections.innovation.title'),
            icon: FaChartLine,
            image: innovationImage,
            content: t('sections.innovation.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.innovation.alt',
            cta: {
                text: t('sections.innovation.cta', 'Discover Our Innovations'),
                link: '/innovation'
            },
            milestone: {
                label: t('sections.innovation.milestone.label', '50+ Patents'),
                description: t('sections.innovation.milestone.description', 'Cutting-edge technology in agriculture')
            },
            communityImpact: t('sections.innovation.communityImpact'),
        },
        {
            title: t('sections.community.title'),
            icon: FaHandsHelping,
            image: communityImage,
            content: t('sections.community.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/5 to-accent/10 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.community.alt',
            cta: {
                text: t('sections.community.cta', 'Join Our Community'),
                link: '/community'
            },
            milestone: {
                label: t('sections.community.milestone.label', '10,000+ Members'),
                description: t('sections.community.milestone.description', 'A thriving and supportive network')
            },
            communityImpact: t('sections.community.communityImpact'),
        },
        {
            title: t('sections.future.title'),
            icon: FaGlobe,
            image: futureImage,
            content: t('sections.future.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.future.alt',
            cta: {
                text: t('sections.future.cta', 'Explore Our Vision'),
                link: '/future'
            },
            milestone: {
                label: t('sections.future.milestone.label', '2030+ Goals'),
                description: t('sections.future.milestone.description', 'Sustainable growth and impact')
            },
            communityImpact: t('sections.future.communityImpact'),
        }
    ];

    // Create refs for each section
    storySections.forEach(() => sectionRefs.push(React.createRef<HTMLDivElement>()));

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

    // Framer motion variants for hover effect on content box
    const contentBoxVariants: Variants = {
        rest: { scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)' },
        hover: {
            scale: 1.03,
            boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
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

            {/* Intro Section */}
            <Section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-3xl shadow-lg mx-6 sm:mx-12 lg:mx-32 xl:mx-48">
                <motion.div
                    className="text-center max-w-4xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography variant="h2" className="mb-6 text-primary">
                            {t('intro.title')}
                        </Typography>
                    </motion.div>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            {t('intro.description')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Community Impact Section removed */}

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

                        {/* Interactive timeline dots removed */}

                        {/* Story Sections */}
                        <div className="space-y-16 md:space-y-24">
                            {storySections.map((section, index) => {
                                const isExpanded = expandedSections[index] ?? false;
                                const contentArray = Array.isArray(section.content) ? section.content : [section.content];

                                // Determine if content needs collapsing
                                const combinedContent = contentArray.join(' ');
                                const needsCollapse = combinedContent.length > COLLAPSE_LIMIT;

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

                                            {/* Content box with hover animation */}
                                            <motion.div
                                                className={`flex-1 ${section.color} p-8 rounded-3xl shadow-lg cursor-default ${getContentMargin(index)}`}
                                                variants={contentBoxVariants}
                                                initial="rest"
                                                whileHover="hover"
                                                animate="rest"
                                            >
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="bg-primary p-3 rounded-full text-white flex items-center justify-center">
                                                        <section.icon className="text-xl" aria-hidden="true" />
                                                    </div>
                                                    <Typography variant="h3" className="text-text-dark">
                                                        {section.title}
                                                    </Typography>
                                                </div>

                                                <div className="space-y-4">
                                                    {contentArray.map((paragraph, pIndex) => (
                                                        <Typography key={pIndex} variant="body">
                                                            {paragraph}
                                                        </Typography>
                                                    ))}
                                                </div>

                                                {/* Community impact highlight */}
                                                {/* Removed: Community impact rendering from inside timeline cards */}
                                            </motion.div>
                                        </div>

                                        {/* Timeline dot - large and prominent on md+ */}
                                        <div
                                            className="hidden md:block absolute top-1/2 left-1/2 w-10 h-10 rounded-full bg-primary border-4 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-10"
                                            aria-hidden="true"
                                        ></div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Section>

            {/* Call to Action */}
            <Section className="py-16 text-text-dark">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn}>
                            <Typography variant="h2" className="mb-6">
                                {t('cta.title')}
                            </Typography>
                        </motion.div>
                        <motion.div variants={fadeIn}>
                            <Typography variant="lead" className="mb-8 max-w-3xl mx-auto">
                                {t('cta.subtitle')}
                            </Typography>
                        </motion.div>
                        <motion.div variants={fadeIn}>
                            <Link
                                to="/contact"
                                className="mt-6 group bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center mx-auto focus:outline-none focus:ring-4 focus:ring-primary"
                            >
                                {t('cta.button')}
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default OurStory;