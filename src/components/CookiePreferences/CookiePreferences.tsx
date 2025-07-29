import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite, faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface CookiePreferencesProps {
    show: boolean;
    onClose: () => void;
    showOnlySettings?: boolean;
}

export interface CookiePreferences {
    essential: boolean;
    performance: boolean;
    functional: boolean;
    advertising: boolean;
}

const CookiePreferences: React.FC<CookiePreferencesProps> = ({
                                                                 show,
                                                                 onClose,
                                                                 showOnlySettings = false
                                                             }) => {
    const { t } = useTranslation('cookies');
    const [preferences, setPreferences] = useState<CookiePreferences>({
        essential: true,
        performance: false,
        functional: false,
        advertising: false
    });

    useEffect(() => {
        // Load saved preferences or initialize
        const savedPrefs = localStorage.getItem('cookiePreferences');
        setPreferences(savedPrefs ? JSON.parse(savedPrefs) : {
            essential: true,
            performance: false,
            functional: false,
            advertising: false
        });
    }, []);

    const handleToggle = (type: keyof CookiePreferences) => {
        if (type === 'essential') return;
        setPreferences(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleSave = () => {
        localStorage.setItem('cookieConsent', 'true');
        localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
        onClose();
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-background rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-warm-grey"
                    >
                        <div className="p-6">
                            {!showOnlySettings && (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-2xl font-bold flex items-center text-primary">
                                            <FontAwesomeIcon
                                                icon={faCookieBite}
                                                className="mr-3 text-accent"
                                                size="lg"
                                            />
                                            {t('title')}
                                        </h3>
                                        <button
                                            onClick={onClose}
                                            className="text-text-dark hover:text-accent transition-colors"
                                            aria-label={t('close')}
                                        >
                                            <FontAwesomeIcon icon={faTimes} size="lg" />
                                        </button>
                                    </div>
                                    <p className="mb-6 text-text-dark">{t('description')}</p>
                                </>
                            )}

                            {/* Cookie Type Sections */}
                            <div className="space-y-4">
                                {/* Essential Cookies */}
                                <div className="p-4 rounded-lg bg-white border border-warm-grey">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-text-dark">{t('essential.title')}</h4>
                                        <span className="text-sm font-medium text-primary px-2 py-1 bg-highlight rounded-full">
                                            {t('status.active')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-dark">{t('essential.description')}</p>
                                </div>

                                {/* Performance Cookies */}
                                <div className="p-4 rounded-lg bg-white border border-warm-grey">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-text-dark">{t('performance.title')}</h4>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="performance"
                                                    checked={preferences.performance}
                                                    onChange={() => handleToggle('performance')}
                                                    className="form-radio h-4 w-4 text-primary border-2 border-primary focus:ring-primary"
                                                />
                                                <span className="text-text-dark">{t('allow')}</span>
                                            </label>
                                            <label className="inline-flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="performance"
                                                    checked={!preferences.performance}
                                                    onChange={() => handleToggle('performance')}
                                                    className="form-radio h-4 w-4 text-primary border-2 border-primary focus:ring-primary"
                                                />
                                                <span className="text-text-dark">{t('block')}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-dark mt-2">{t('performance.description')}</p>
                                </div>

                                {/* Functional Cookies */}
                                <div className="p-4 rounded-lg bg-white border border-warm-grey">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-text-dark">{t('functional.title')}</h4>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="functional"
                                                    checked={preferences.functional}
                                                    onChange={() => handleToggle('functional')}
                                                    className="form-radio h-4 w-4 text-primary border-2 border-primary focus:ring-primary"
                                                />
                                                <span className="text-text-dark">{t('allow')}</span>
                                            </label>
                                            <label className="inline-flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="functional"
                                                    checked={!preferences.functional}
                                                    onChange={() => handleToggle('functional')}
                                                    className="form-radio h-4 w-4 text-primary border-2 border-primary focus:ring-primary"
                                                />
                                                <span className="text-text-dark">{t('block')}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-dark mt-2">{t('functional.description')}</p>
                                </div>

                                {/* Advertising Cookies */}
                                <div className="p-4 rounded-lg bg-white border border-warm-grey">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-text-dark">{t('advertising.title')}</h4>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="advertising"
                                                    checked={preferences.advertising}
                                                    onChange={() => handleToggle('advertising')}
                                                    className="form-radio h-4 w-4 text-primary border-2 border-primary focus:ring-primary"
                                                />
                                                <span className="text-text-dark">{t('allow')}</span>
                                            </label>
                                            <label className="inline-flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="advertising"
                                                    checked={!preferences.advertising}
                                                    onChange={() => handleToggle('advertising')}
                                                    className="form-radio h-4 w-4 text-primary border-2 border-primary focus:ring-primary"
                                                />
                                                <span className="text-text-dark">{t('block')}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-dark mt-2">{t('advertising.description')}</p>
                                </div>
                            </div>

                            {/* Cookie Policy Link */}
                            <div className="mt-6 text-center">
                                <Link
                                    to="/cookie-policy"
                                    className="inline-flex items-center text-sm text-primary hover:text-accent transition-colors"
                                    onClick={onClose}
                                >
                                    {t('viewFullPolicy')}
                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1.5 h-3 w-3" />
                                </Link>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-text-dark hover:bg-highlight rounded-lg transition-colors border border-warm-grey"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-olive transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    {t('save')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CookiePreferences;