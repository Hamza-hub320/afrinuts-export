import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation('privacy');

    return (
        <main>
            {/* Header Section */}
            <Section className="pt-24 pb-12 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h1" className="text-center mb-6 flex items-center justify-center">
                        <FontAwesomeIcon icon={faLock} className="mr-3 h-8 w-8" />
                        {t('title')}
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

            {/* Information Collection */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('collection.title')}
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        {t('collection.description')}
                    </Typography>
                    <ul className="list-disc pl-6 space-y-2">
                        {(t('collection.items', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={`collection-${index}`}>
                                <Typography variant="body">{item}</Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            {/* Information Use */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('use.title')}
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        {t('use.description')}
                    </Typography>
                    <ul className="list-disc pl-6 space-y-2">
                        {(t('use.items', { returnObjects: true }) as string[]).map((item, index) => (
                            <li key={`use-${index}`}>
                                <Typography variant="body">{item}</Typography>
                            </li>
                        ))}
                    </ul>
                    <Typography variant="body" className="mt-6">
                        {t('use.note')}
                    </Typography>
                </div>
            </Section>

            {/* Cookies */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('cookies.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('cookies.description')}
                    </Typography>
                </div>
            </Section>

            {/* Data Security */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('security.title')}
                    </Typography>
                    <Typography variant="body">
                        {t('security.description')}
                    </Typography>
                </div>
            </Section>

            {/* Your Rights */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h3" className="mb-6">
                        {t('rights.title')}
                    </Typography>
                    <Typography variant="body" className="mb-4">
                        {t('rights.description')}
                    </Typography>
                    <Typography variant="body" className="flex items-center">
                        <span className="mr-2">📧</span>
                        <a href={`mailto:${t('rights.contactEmail')}`} className="text-primary hover:underline">
                            {t('rights.contactEmail')}
                        </a>
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

export default PrivacyPolicy;