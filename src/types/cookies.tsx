// src/types/cookies.ts
export interface CookiePreferences {
    essential: boolean;
    performance: boolean;
    functional: boolean;
    advertising: boolean;
}

export interface CookiePreferencesProps {
    show: boolean;
    onClose: () => void;
    onSave: (prefs: CookiePreferences) => void;
}