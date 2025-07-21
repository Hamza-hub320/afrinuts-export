// src/i18n.ts
import i18n, { InitOptions } from 'i18next';
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

// French translations
import homeFR from './locales/fr/home.json';
import commonFR from './locales/fr/common.json';
import aboutFR from './locales/fr/about.json';
import productsFR from './locales/fr/products.json';
import farmFR from './locales/fr/farm.json';
import contactFR from './locales/fr/contact.json';
import footerFR from './locales/fr/footer.json';

// Arabic translations
import homeAR from './locales/ar/home.json';
import commonAR from './locales/ar/common.json';
import aboutAR from './locales/ar/about.json';
import productsAR from './locales/ar/products.json';
import farmAR from './locales/ar/farm.json';
import contactAR from './locales/ar/contact.json';
import footerAR from './locales/ar/footer.json';

// Type definition for your translation resources
interface TranslationResources {
    home: typeof homeEN;
    common: typeof commonEN;
    about: typeof aboutEN;
    products: typeof productsEN;
    farm: typeof farmEN;
    contact: typeof contactEN;
    footer: typeof footerEN;
}

// Extended type for all supported languages
type SupportedLanguages = 'en' | 'fr' | 'ar';

// Type definition for your i18n configuration
interface I18nOptions extends InitOptions {
    fallbackLng: SupportedLanguages;
    debug: boolean;
    ns: Array<keyof TranslationResources>;
    defaultNS: keyof TranslationResources;
    resources: Record<SupportedLanguages, TranslationResources>;
    detection: {
        order: string[];
        caches: string[];
        lookupQuerystring: string;
        lookupCookie: string;
        lookupLocalStorage: string;
    };
}

const options: I18nOptions = {
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    supportedLngs: ['en', 'fr', 'ar'],
    ns: ['home', 'common', 'about', 'products', 'farm', 'contact', 'footer'],
    defaultNS: 'common',
    resources: {
        en: {
            home: homeEN,
            common: commonEN,
            about: aboutEN,
            products: productsEN,
            farm: farmEN,
            contact: contactEN,
            footer: footerEN
        },
        fr: {
            home: homeFR,
            common: commonFR,
            about: aboutFR,
            products: productsFR,
            farm: farmFR,
            contact: contactFR,
            footer: footerFR
        },
        ar: {
            home: homeAR,
            common: commonAR,
            about: aboutAR,
            products: productsAR,
            farm: farmAR,
            contact: contactAR,
            footer: footerAR
        }
    },
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
    .init(options);

// Handle RTL direction for Arabic
i18n.on('languageChanged', (lng) => {
    if (lng === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lng;
    }
});

export default i18n;