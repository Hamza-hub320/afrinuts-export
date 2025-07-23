import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
import homeEN from './locales/en/home.json';
import commonEN from './locales/en/common.json';
import aboutEN from './locales/en/about.json';
import productsEN from './locales/en/products.json';
import farmEN from './locales/en/farm.json';
import contactEN from './locales/en/contact.json';
import footerEN from './locales/en/footer.json';
import sustainabilityEN from './locales/en/sustainability.json';

// French translations
import homeFR from './locales/fr/home.json';
import commonFR from './locales/fr/common.json';
import aboutFR from './locales/fr/about.json';
import productsFR from './locales/fr/products.json';
import farmFR from './locales/fr/farm.json';
import contactFR from './locales/fr/contact.json';
import footerFR from './locales/fr/footer.json';
import sustainabilityFR from './locales/fr/sustainability.json';

// Arabic translations
import homeAR from './locales/ar/home.json';
import commonAR from './locales/ar/common.json';
import aboutAR from './locales/ar/about.json';
import productsAR from './locales/ar/products.json';
import farmAR from './locales/ar/farm.json';
import contactAR from './locales/ar/contact.json';
import footerAR from './locales/ar/footer.json';
import sustainabilityAR from './locales/ar/sustainability.json';

// Type definitions
type SupportedLanguages = 'en' | 'fr' | 'ar';

interface TranslationResources {
    home: typeof homeEN;
    common: typeof commonEN;
    about: typeof aboutEN;
    products: typeof productsEN;
    farm: typeof farmEN;
    contact: typeof contactEN;
    footer: typeof footerEN;
    sustainability: typeof sustainabilityEN;
}

interface I18nOptions {
    fallbackLng: SupportedLanguages;
    debug: boolean;
    supportedLngs: SupportedLanguages[];
    ns: Array<keyof TranslationResources>;
    defaultNS: keyof TranslationResources;
    resources: Record<SupportedLanguages, TranslationResources>;
    interpolation: {
        escapeValue: boolean;
    };
    detection: {
        order: string[];
        caches: string[];
        lookupQuerystring: string;
        lookupCookie: string;
        lookupLocalStorage: string;
    };
}

const resources: Record<SupportedLanguages, TranslationResources> = {
    en: {
        home: homeEN,
        common: commonEN,
        about: aboutEN,
        products: productsEN,
        farm: farmEN,
        contact: contactEN,
        footer: footerEN,
        sustainability: sustainabilityEN
    },
    fr: {
        home: homeFR,
        common: commonFR,
        about: aboutFR,
        products: productsFR,
        farm: farmFR,
        contact: contactFR,
        footer: footerFR,
        sustainability: sustainabilityFR
    },
    ar: {
        home: homeAR,
        common: commonAR,
        about: aboutAR,
        products: productsAR,
        farm: farmAR,
        contact: contactAR,
        footer: footerAR,
        sustainability: sustainabilityAR
    }
};

const options: I18nOptions = {
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: ['en', 'fr', 'ar'],
    ns: ['home', 'common', 'about', 'products', 'farm', 'contact', 'footer', 'sustainability'],
    defaultNS: 'common',
    resources,
    interpolation: {
        escapeValue: false
    },
    detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage', 'cookie'],
        lookupQuerystring: 'lng',
        lookupCookie: 'i18next',
        lookupLocalStorage: 'i18nextLng'
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(options)
    .then(() => {
        console.log('i18n initialized successfully');
        // Set RTL/LTR direction based on language
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    })
    .catch((err) => {
        console.error('i18n initialization failed:', err);
    });

// Handle language changes
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;