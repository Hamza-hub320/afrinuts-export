import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons';

const TermsOfService: React.FC = () => {
    const { t } = useTranslation('terms');

    return (
        <main>
            {/* Header Section */}
            <Section className="pt-24 pb-12 border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Typography variant="h1" className="text-center mb-6 flex items-center justify-center">
                        <FontAwesomeIcon icon={faScaleBalanced} className="mr-3 h-8 w-8" />
                        {t('title')}
                    </Typography>
                    <Typography variant="subtitle" className="text-center">
                        {t('effectiveDate')}
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