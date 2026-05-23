import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCookieBite,
    faInfoCircle,
    faChartLine,
    faCogs,
    faAd,
    faSlidersH,
    faDatabase,
    faShieldAlt,
    faSyncAlt,
    faEnvelope,
    faChild,
    faGavel
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import {fadeIn, staggerContainer} from "@/utils/animations";

const CookiePolicy: React.FC = () => {
    const { t } = useTranslation('cookiePolicy');

    // Content sections with icons - updated with new sections
    const sections = [
        { key: 'whatAreCookies', icon: faInfoCircle },
        { key: 'whyWeUseCookies', icon: faChartLine, subsections: ['essential', 'performance', 'functional', 'advertising'] },
        { key: 'managingPreferences', icon: faSlidersH },
        { key: 'thirdPartyCookies', icon: faShieldAlt },
        { key: 'dataRetention', icon: faDatabase },
        { key: 'yourRights', icon: faGavel },
        { key: 'childrenPrivacy', icon: faChild },
        { key: 'changesToPolicy', icon: faSyncAlt },
        { key: 'contactUs', icon: faEnvelope }
    ];

    const cookieTypes = [
        { key: 'essential', icon: faCogs, color: 'text-green-600' },
        { key: 'performance', icon: faChartLine, color: 'text-blue-600' },
        { key: 'functional', icon: faSlidersH, color: 'text-purple-600' },
        { key: 'advertising', icon: faAd, color: 'text-orange-600' }
    ];

    return (
        <main>
            {/* Cookies Policy Hero Section - Kept exactly the same */}
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
                    {/* Subtitle / Last Updated */}
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="subhead"
                            className="uppercase tracking-widest text-primary mb-4"
                        >
                            {t('lastUpdated')}
                        </Typography>
                    </motion.div>

                    {/* Title with Icon */}
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight flex items-center justify-center"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        <FontAwesomeIcon icon={faCookieBite} className="mr-3 h-8 w-8 text-amber-600" />
                        {t('title')}
                    </motion.h1>

                    {/* Description */}
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="lead"
                            className="text-text-dark max-w-3xl mx-auto"
                        >
                            {t('description')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Scroll indicator - Kept exactly the same */}
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
                        {sections.map(({ key, icon, subsections }, index) => (
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

                                {/* Glassy overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                                {/* Inner shadow effect */}
                                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                                {/* Section icon */}
                                <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md z-20">
                                    <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                                </div>

                                <div className="relative z-10">
                                    <Typography variant="h3" className="mb-4 text-primary">
                                        {t(`${key}.title`)}
                                    </Typography>

                                    {/* Main description */}
                                    <Typography variant="body" className="text-gray-700 leading-relaxed mb-6">
                                        {t(`${key}.description`)}
                                    </Typography>

                                    {/* Cookie types section */}
                                    {key === 'whyWeUseCookies' && (
                                        <div className="space-y-6">
                                            {cookieTypes.map((cookieType, cookieIndex) => (
                                                <motion.div
                                                    key={cookieType.key}
                                                    className="bg-white/80 p-4 rounded-xl border-l-4 border-primary/50 shadow-sm"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: cookieIndex * 0.1 }}
                                                >
                                                    <div className="flex items-center mb-3">
                                                        <FontAwesomeIcon
                                                            icon={cookieType.icon}
                                                            className={`mr-2 ${cookieType.color}`}
                                                        />
                                                        <Typography variant="h4" className={cookieType.color}>
                                                            {t(`whyWeUseCookies.${cookieType.key}.title`)}
                                                        </Typography>
                                                    </div>
                                                    <Typography variant="body" className="mb-3">
                                                        {t(`whyWeUseCookies.${cookieType.key}.description`)}
                                                    </Typography>
                                                    <ul className="list-disc pl-6 space-y-2">
                                                        {(t(`whyWeUseCookies.${cookieType.key}.examples`, { returnObjects: true }) as string[]).map((item, itemIndex) => (
                                                            <motion.li
                                                                key={`${cookieType.key}-${itemIndex}`}
                                                                className="text-gray-600"
                                                                initial={{ opacity: 0 }}
                                                                whileInView={{ opacity: 1 }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: itemIndex * 0.05 + cookieIndex * 0.1 }}
                                                            >
                                                                {item}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Steps for managing preferences */}
                                    {key === 'managingPreferences' && (
                                        <div className="space-y-4">
                                            <ul className="list-disc pl-6 space-y-3">
                                                {(t(`managingPreferences.steps`, { returnObjects: true }) as string[]).map((item, itemIndex) => (
                                                    <motion.li
                                                        key={`steps-${itemIndex}`}
                                                        className="bg-white/50 p-3 rounded-lg"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: itemIndex * 0.1 }}
                                                    >
                                                        <Typography variant="body">{item}</Typography>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                            {t('managingPreferences.note') && (
                                                <motion.div
                                                    className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg"
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <Typography variant="body-sm" className="text-amber-800">
                                                        {t('managingPreferences.note')}
                                                    </Typography>
                                                </motion.div>
                                            )}
                                        </div>
                                    )}

                                    {/* Your Rights items */}
                                    {key === 'yourRights' && (
                                        <ul className="list-disc pl-6 space-y-3">
                                            {(t(`yourRights.items`, { returnObjects: true }) as string[]).map((item, itemIndex) => (
                                                <motion.li
                                                    key={`rights-${itemIndex}`}
                                                    className="bg-white/50 p-3 rounded-lg"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: itemIndex * 0.1 }}
                                                >
                                                    <Typography variant="body">{item}</Typography>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Contact information */}
                                    {key === 'contactUs' && (
                                        <motion.div
                                            className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary space-y-3"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="flex items-center">
                                                <Typography variant="body">
                                                    {t('contactUs.address')}
                                                </Typography>
                                            </div>
                                            <div className="flex items-center">
                                                <a
                                                    href={`mailto:${t('contactUs.email')}`}
                                                    className="text-primary hover:underline font-medium"
                                                >
                                                    {t('contactUs.email')}
                                                </a>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* Back to top button */}
            <motion.button
                className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-accent transition-colors duration-300 z-50"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Back to top"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </motion.button>
        </main>
    );
};

export default CookiePolicy;