import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';

const CookiePolicy: React.FC = () => {
    const { t } = useTranslation('cookiePolicy');

    return (
        <main>
            {/* Header Section */}
            <Section className="pt-24 pb-12 border-b border-gray-200">
                <div className="container mx-auto px-4 pt-40 pb-16 max-w-6xl">
                    <Typography variant="h1" className="text-center mb-6 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCookieBite} className="mr-3 h-8 w-8 text-amber-600" />
                        {t('title')}
                    </Typography>
                    <Typography variant="subtitle" className="text-center">
                        {t('lastUpdated')}
                    </Typography>
                </div>
            </Section>

            {/* Introduction */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="body" className="mb-8">
                        {t('introduction')}
                    </Typography>
                </div>
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