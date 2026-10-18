import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLock,
    faShieldAlt,
    faUserLock,
    faCookie,
    faKey,
    faExchangeAlt,
    faChild,
    faSyncAlt,
    faTractor,
    faLeaf
} from '@fortawesome/free-solid-svg-icons';
import { fadeIn, staggerContainer } from "@/utils/animations";
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation('privacy');

    // Content sections with icons — includes new supplier & farmer data section
    const sections = [
        { key: 'collection', icon: faUserLock },
        { key: 'use', icon: faShieldAlt },
        { key: 'cookies', icon: faCookie },
        { key: 'security', icon: faKey },
        { key: 'rights', icon: faUserLock },
        { key: 'thirdPartyServices', icon: faExchangeAlt },
        { key: 'childrenPrivacy', icon: faChild },
        { key: 'supplierData', icon: faTractor },      // NEW — Section 9
        { key: 'changes', icon: faSyncAlt }
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
                            {t('effectiveDate')}
                        </Typography>
                    </motion.div>

                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight flex items-center justify-center"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        <FontAwesomeIcon icon={faLock} className="mr-3 h-8 w-8" />
                        {t('title')}
                    </motion.h1>

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
                        {sections.map(({ key, icon }, index) => (
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
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                                <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md z-20">
                                    <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                                </div>

                                <div className="relative z-10">
                                    <Typography variant="h3" className="mb-4 text-primary">
                                        {t(`${key}.title`)}
                                    </Typography>
                                    <Typography variant="body" className="text-gray-700 leading-relaxed mb-4">
                                        {t(`${key}.description`)}
                                    </Typography>

                                    {/* List items for sections that have them */}
                                    {(key === 'collection' || key === 'use' || key === 'cookies' || key === 'security' || key === 'rights') && (
                                        <ul className="list-disc pl-6 space-y-2 mb-4">
                                            {(t(`${key}.items`, { returnObjects: true }) as string[]).map((item, itemIndex) => (
                                                <motion.li
                                                    key={`${key}-${itemIndex}`}
                                                    className="bg-white/50 p-2 rounded-lg"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: itemIndex * 0.1 }}
                                                >
                                                    <Typography variant="body">{item}</Typography>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Additional note for collection, use, cookies, and rights sections */}
                                    {(key === 'collection' || key === 'use' || key === 'cookies' || key === 'rights') && t(`${key}.note`) && (
                                        <Typography variant="body" className="mt-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                                            {t(`${key}.note`)}
                                        </Typography>
                                    )}

                                    {/* Supplier & Farmer Data — custom structured rendering */}
                                    {key === 'supplierData' && (
                                        <div className="space-y-4">
                                            {/* Principle callout */}
                                            {t('supplierData.principle') && (
                                                <motion.div
                                                    className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                >
                                                    <Typography variant="body" className="font-medium text-primary">
                                                        <FontAwesomeIcon icon={faLeaf} className="mr-2 text-accent" />
                                                        {t('supplierData.principle')}
                                                    </Typography>
                                                </motion.div>
                                            )}

                                            {/* Structured subsections */}
                                            {[
                                                { subKey: 'whatWeCollect', icon: faTractor },
                                                { subKey: 'howWeUseIt', icon: faShieldAlt },
                                                { subKey: 'whatWeNeverDo', icon: faLock },
                                                { subKey: 'whatBuyersSee', icon: faExchangeAlt },
                                                { subKey: 'farmerRights', icon: faUserLock },
                                            ].map(({ subKey, icon: SubIcon }, idx) => (
                                                <motion.div
                                                    key={subKey}
                                                    className="bg-white/50 p-4 rounded-lg border border-gray-100"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: idx * 0.08 }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-primary/10 p-2 rounded-full flex-shrink-0 mt-0.5">
                                                            <FontAwesomeIcon icon={SubIcon} className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Typography variant="h4" className="text-primary text-base mb-1">
                                                                {t(`supplierData.${subKey}.title`)}
                                                            </Typography>
                                                            <Typography variant="body" className="text-gray-700 leading-relaxed">
                                                                {t(`supplierData.${subKey}.body`)}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {/* Contact line for supplier data concerns */}
                                            {t('supplierData.contactEmail') && (
                                                <motion.div
                                                    className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary flex items-center"
                                                    whileHover={{ x: 5 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <a
                                                        href={`mailto:${t('supplierData.contactEmail')}`}
                                                        className="text-primary hover:underline font-medium"
                                                    >
                                                        {t('supplierData.contactEmail')}
                                                    </a>
                                                </motion.div>
                                            )}
                                        </div>
                                    )}

                                    {/* Contact email for rights section (existing) */}
                                    {key === 'rights' && t('rights.contactEmail') && (
                                        <motion.div
                                            className="mt-4 p-4 bg-primary/5 rounded-lg border-l-4 border-primary flex items-center"
                                            whileHover={{ x: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <a
                                                href={`mailto:${t('rights.contactEmail')}`}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                {t('rights.contactEmail')}
                                            </a>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* Last Updated */}
            <Section className="py-16">
                <motion.div
                    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 transform-gpu">
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] transition-all duration-500" />
                        <div className="relative z-10">
                            <Typography variant="body" className="text-gray-500">
                                {t('lastUpdated')}
                            </Typography>
                        </div>
                    </div>
                </motion.div>
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

export default PrivacyPolicy;