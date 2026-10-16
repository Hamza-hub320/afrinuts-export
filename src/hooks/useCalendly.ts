import { useCallback } from 'react';

const CALENDLY_URL = 'https://calendly.com/contact-afrinutsexport/30min?hide_gdpr_banner=1&primary_color=5A7411';

declare global {
    interface Window {
        Calendly?: {
            initPopupWidget: (options: { url: string }) => void;
        };
    }
}

const loadCalendlyAssets = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Already loaded
        if (window.Calendly) {
            resolve();
            return;
        }

        // Add CSS if not present
        if (!document.getElementById('calendly-css')) {
            const link = document.createElement('link');
            link.id = 'calendly-css';
            link.rel = 'stylesheet';
            link.href = 'https://assets.calendly.com/assets/external/widget.css';
            document.head.appendChild(link);
        }

        // Add JS if not present
        if (!document.getElementById('calendly-js')) {
            const script = document.createElement('script');
            script.id = 'calendly-js';
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Calendly'));
            document.head.appendChild(script);
        } else {
            // Script tag exists but window.Calendly isn't ready yet — poll briefly
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (window.Calendly) {
                    clearInterval(interval);
                    resolve();
                } else if (attempts > 20) {
                    clearInterval(interval);
                    reject(new Error('Calendly timeout'));
                }
            }, 100);
        }
    });
};

export const useCalendly = () => {
    const openCalendly = useCallback(async () => {
        try {
            await loadCalendlyAssets();
            if (window.Calendly) {
                window.Calendly.initPopupWidget({ url: CALENDLY_URL });
            } else {
                window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
            }
        } catch {
            // Fallback: open Calendly in a new tab if loading fails
            window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
        }
    }, []);

    return { openCalendly };
};