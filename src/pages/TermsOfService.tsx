import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import {fadeIn, staggerContainer} from "@/utils/animations";
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
    const { t } = useTranslation('terms');

    return (
        <main>
            {/* Terms of Service Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[60vh] bg-gradient-to-b from-primary/10 to-transparent"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {/* Subtitle / Effective Date */}
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="subhead"
                            className="uppercase tracking-widest text-primary mb-4"
                        >
                            {t('effectiveDate')}
                        </Typography>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
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

            {/* Website Use */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('websiteUse.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('websiteUse.description')}
                    </Typography>
                </div>
            </Section>

            {/* Intellectual Property */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('intellectualProperty.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('intellectualProperty.description')}
                    </Typography>
                </div>
            </Section>

            {/* Contact & Quote Requests */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('contact.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('contact.description')}
                    </Typography>
                </div>
            </Section>

            {/* Third-Party Links */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('thirdPartyLinks.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('thirdPartyLinks.description')}
                    </Typography>
                </div>
            </Section>

            {/* Disclaimers */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('disclaimers.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('disclaimers.description')}
                    </Typography>
                </div>
            </Section>

            {/* Last Updated */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Typography variant="body" className="text-gray-500">
                        {t('lastUpdated')}
                    </Typography>
                </div>
            </Section>
        </main>
    );
};

export default TermsOfService;