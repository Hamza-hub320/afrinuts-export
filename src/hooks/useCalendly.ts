import { useCallback } from 'react';

const CALENDLY_URL = 'https://calendly.com/contact-afrinutsexport/30min?hide_gdpr_banner=1&primary_color=5A7411';

declare global {
    interface Window {
        Calendly?: {
            initPopupWidget: (options: { url: string }) => void;
        };
    }
}

export const useCalendly = () => {
    const openCalendly = useCallback(() => {
        if (typeof window !== 'undefined' && window.Calendly) {
            window.Calendly.initPopupWidget({ url: CALENDLY_URL });
        } else {
            // Fallback: open in new tab if popup script hasn't loaded yet
            window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
        }
    }, []);

    return { openCalendly };
};