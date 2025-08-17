import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import {fadeIn, staggerContainer} from "@/utils/animations";

const CookiePolicy: React.FC = () => {
    const { t } = useTranslation('cookiePolicy');

    return (
        <main>
            {/* Cookies Policy Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[40vh] bg-gradient-to-b bg-transparent"
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

            {/* What Are Cookies */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('whatAreCookies.title')}
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        {t('whatAreCookies.description')}
                    </Typography>
                </div>
            </Section>

            {/* Why We Use Cookies */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('whyWeUseCookies.title')}
                    </Typography>

                    {/* Essential Cookies */}
                    <div className="mb-6">
                        <Typography variant="h4" className="mb-3 text-primary">
                            {t('whyWeUseCookies.essential.title')}
                        </Typography>
                        <Typography variant="body" className="mb-2">
                            {t('whyWeUseCookies.essential.description')}
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            {(t('whyWeUseCookies.essential.examples', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={`essential-${index}`}>
                                    <Typography variant="body">{item}</Typography>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Performance Cookies */}
                    <div className="mb-6">
                        <Typography variant="h4" className="mb-3 text-primary">
                            {t('whyWeUseCookies.performance.title')}
                        </Typography>
                        <Typography variant="body" className="mb-2">
                            {t('whyWeUseCookies.performance.description')}
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            {(t('whyWeUseCookies.performance.examples', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={`performance-${index}`}>
                                    <Typography variant="body">{item}</Typography>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Functional Cookies */}
                    <div className="mb-6">
                        <Typography variant="h4" className="mb-3 text-primary">
                            {t('whyWeUseCookies.functional.title')}
                        </Typography>
                        <Typography variant="body" className="mb-2">
                            {t('whyWeUseCookies.functional.description')}
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            {(t('whyWeUseCookies.functional.examples', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={`functional-${index}`}>
                                    <Typography variant="body">{item}</Typography>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Advertising Cookies */}
                    <div className="mb-6">
                        <Typography variant="h4" className="mb-3 text-primary">
                            {t('whyWeUseCookies.advertising.title')}
                        </Typography>
                        <Typography variant="body" className="mb-2">
                            {t('whyWeUseCookies.advertising.description')}
                        </Typography>
                        <ul className="list-disc pl-6 space-y-2">
                            {(t('whyWeUseCookies.advertising.examples', { returnObjects: true }) as string[]).map((item, index) => (
                                <li key={`advertising-${index}`}>
                                    <Typography variant="body">{item}</Typography>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Section>

            {/* Managing Cookie Preferences */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('managingPreferences.title')}
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        {t('managingPreferences.description')}
                    </Typography>
                    <ul className="list-disc pl-6 space-y-2">
                        {(t('managingPreferences.steps', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={`steps-${index}`}>
                                <Typography variant="body">{item}</Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            {/* Third-Party Cookies */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('thirdPartyCookies.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('thirdPartyCookies.description')}
                    </Typography>
                </div>
            </Section>

            {/* Data Retention */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('dataRetention.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('dataRetention.description')}
                    </Typography>
                </div>
            </Section>

            {/* Your Rights */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('yourRights.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('yourRights.description')}
                    </Typography>
                </div>
            </Section>

            {/* Changes to Policy */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('changesToPolicy.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('changesToPolicy.description')}
                    </Typography>
                </div>
            </Section>

            {/* Contact Us */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('contactUs.title')}
                    </Typography>
                    <Typography variant="body" className="space-y-2">
                        <div>{t('contactUs.address')}</div>
                        <div className="flex items-center">
                            <span className="mr-2">📧</span>
                            <a href={`mailto:${t('contactUs.email')}`} className="text-primary hover:underline">
                                {t('contactUs.email')}
                            </a>
                        </div>
                    </Typography>
                </div>
            </Section>
        </main>
    );
};

export default CookiePolicy;