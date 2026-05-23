import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUniversalAccess,
    faBullseye,
    faCheckCircle,
    faExclamationTriangle,
    faEnvelope,
    faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from "@/utils/animations";

const Accessibility: React.FC = () => {
    const { t } = useTranslation('accessibility');

    const sections = [
        { key: 'commitment', icon: faBullseye },
        { key: 'standards', icon: faCheckCircle },
        { key: 'features', icon: faUniversalAccess },
        { key: 'limitations', icon: faExclamationTriangle },
        { key: 'feedback', icon: faEnvelope }
    ];

    return (
        <main>
            {/* Hero Section */}
            <Section
                fullHeight={false}
                className="flex items-center justify-center text-center min-h-[40vh]"
            >
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
                            {t('lastUpdated')}
                        </Typography>
                    </motion.div>

                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight flex items-center justify-center"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        <FontAwesomeIcon icon={faUniversalAccess} className="mr-3 h-8 w-8 text-primary" />
                        {t('title')}
                    </motion.h1>

                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            {t('description')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
                </div>
            </motion.div>

            {/* Content Sections */}
            <Section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="space-y-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {sections.map(({ key, icon }) => (
                            <motion.div
                                key={key}
                                variants={fadeIn}
                                className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 transition-all duration-500 rounded-2xl shadow-xl p-6 sm:p-8 transform-gpu"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                }}
                                whileHover={{
                                    y: -5,
                                    scale: 1.01,
                                    boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {/* 3D edge effect */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                                {/* Section icon */}
                                <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md z-20">
                                    <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                                </div>

                                <div className="relative z-10">
                                    <Typography variant="h3" className="mb-4 text-primary">
                                        {t(`${key}.title`)}
                                    </Typography>
                                    <Typography variant="body" className="text-gray-700 leading-relaxed mb-6">
                                        {t(`${key}.description`)}
                                    </Typography>

                                    {/* Features list */}
                                    {key === 'features' && (
                                        <ul className="list-disc pl-6 space-y-3">
                                            {(t(`features.items`, { returnObjects: true }) as string[]).map((item, index) => (
                                                <motion.li
                                                    key={index}
                                                    className="bg-white/50 p-3 rounded-lg"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Typography variant="body">{item}</Typography>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Limitations list */}
                                    {key === 'limitations' && (
                                        <ul className="list-disc pl-6 space-y-3">
                                            {(t(`limitations.items`, { returnObjects: true }) as string[]).map((item, index) => (
                                                <motion.li
                                                    key={index}
                                                    className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <Typography variant="body" className="text-amber-800">{item}</Typography>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Feedback contact */}
                                    {key === 'feedback' && (
                                        <motion.div
                                            className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary space-y-3"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Typography variant="body">
                                                {t('feedback.contactText')}
                                            </Typography>
                                            <a
                                                href={`mailto:${t('feedback.email')}`}
                                                className="text-primary hover:underline font-medium inline-flex items-center"
                                            >
                                                {t('feedback.email')}
                                                <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 h-3 w-3" />
                                            </a>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default Accessibility;