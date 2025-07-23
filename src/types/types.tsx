export interface TranslationResources {
    navbar: {
        home: string;
        about: string;
        products: string;
        farm: string;
        contact: string;
        sustainability: string;
        title: string;
        content: string;
        icon: string;
        language: string;
    };
    language: {
        en: string;
        fr: string;
    };
    premiumQuality: string;
    availableNow: string;
    comingSoon: string;

}

export type SupportedLanguages = 'en' | 'fr' | 'ar';