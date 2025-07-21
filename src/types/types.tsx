export interface TranslationResources {
    navbar: {
        home: string;
        about: string;
        products: string;
        farm: string;
        contact: string;
        language: string;
    };
    language: {
        en: string;
        fr: string;
    };
    premiumQuality: string;
    availableNow: string;
    comingSoon: string;
    // Add other shared resource shapes here
}

export type SupportedLanguages = 'en' | 'fr' | 'ar';