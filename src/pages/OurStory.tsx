import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FaTree, FaHandsHelping, FaWater, FaMosque, FaGlobe, FaChartLine, FaSeedling } from "react-icons/fa";

// Import images
import heritageImage from '@/assets/images/heritage.webp';
import farmImage from '@/assets/images/cashew-farm.webp';
import innovationImage from '@/assets/images/innovation.webp';
import communityImage from '@/assets/images/community.webp';
import futureImage from '@/assets/images/future.webp';

const OurStory: React.FC = () => {
    const { t } = useTranslation('story');

    const storySections = [
        {
            title: t('sections.heritage.title'),
            icon: FaTree,
            image: heritageImage,
            content: t('sections.heritage.content', { returnObjects: true }),
            color: 'bg-primary/10'
        },
        {
            title: t('sections.tradition.title'),
            icon: FaSeedling,
            image: farmImage,
            content: t('sections.tradition.content', { returnObjects: true }),
            color: 'bg-accent/10'
        },
        {
            title: t('sections.innovation.title'),
            icon: FaChartLine,
            image: innovationImage,
            content: t('sections.innovation.content', { returnObjects: true }),
            color: 'bg-primary/10'
        },
        {
            title: t('sections.community.title'),
            icon: FaHandsHelping,
            image: communityImage,
            content: t('sections.community.content', { returnObjects: true }),
            color: 'bg-accent/10'
        },
        {
            title: t('sections.future.title'),
            icon: FaGlobe,
            image: futureImage,
            content: t('sections.future.content', { returnObjects: true }),
            color: 'bg-primary/10'
        }
    ];

    return (
        <main className="text-text-dark font-sans leading-relaxed">
            {/* Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[70vh] bg-gradient-to-b from-primary/20 to-background"
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

            {/* Story Timeline */}
            <Section className="py-16 md:py-24 bg-background">
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
                        {/* Vertical line */}
                        <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-primary/20 transform -translate-x-1/2"></div>

                        {/* Story Sections */}
                        <div className="space-y-16 md:space-y-24">
                            {storySections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    className={`relative ${index % 2 === 0 ? 'md:pr-12 md:pl-0' : 'md:pl-12 md:pr-0'}`}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={fadeIn}
                                >
                                    <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
                                        {/* Image */}
                                        <div className="flex-1">
                                            <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-white/20">
                                                <img
                                                    src={section.image}
                                                    alt={t(`sections.${section.title.toLowerCase()}.alt`)}
                                                    className="w-full h-auto object-cover aspect-video md:aspect-square"
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className={`flex-1 ${section.color} p-8 rounded-3xl shadow-lg`}>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="bg-primary p-3 rounded-full text-white">
                                                    <section.icon className="text-xl" />
                                                </div>
                                                <Typography variant="h3" className="text-text-dark">
                                                    {section.title}
                                                </Typography>
                                            </div>

                                            <div className="space-y-4">
                                                {Array.isArray(section.content) ? (
                                                    section.content.map((paragraph, pIndex) => (
                                                        <Typography key={pIndex} variant="body">
                                                            {paragraph}
                                                        </Typography>
                                                    ))
                                                ) : (
                                                    <Typography variant="body">
                                                        {section.content}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline dot */}
                                    <div className="hidden md:block absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white transform -translate-x-1/2 -translate-y-1/2"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* Call to Action */}
            <Section className="py-16 bg-background text-text-dark">
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
                            <button className="mt-6 group bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center mx-auto">
                                {t('cta.button')}
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default OurStory;