// src/utils/analytics.js

// Helper to check if gtag is ready
const isGtagReady = () => {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Send event to Google Analytics
export const trackEvent = (eventName, eventParams = {}) => {
    if (isGtagReady()) {
        window.gtag('event', eventName, eventParams);
        console.log(`✅ GA Event: ${eventName}`, eventParams);
    } else {
        console.warn(`⚠️ GTag not ready. Event not sent: ${eventName}`);
        // Optional: queue events for later
        if (typeof window !== 'undefined') {
            window._gaEventsQueue = window._gaEventsQueue || [];
            window._gaEventsQueue.push({ eventName, eventParams });
        }
    }
};

// Retry queued events when gtag becomes available
export const flushQueuedEvents = () => {
    if (isGtagReady() && window._gaEventsQueue && window._gaEventsQueue.length) {
        console.log(`🔄 Flushing ${window._gaEventsQueue.length} queued events`);
        window._gaEventsQueue.forEach(({ eventName, eventParams }) => {
            window.gtag('event', eventName, eventParams);
        });
        window._gaEventsQueue = [];
    }
};

// Pre-defined events for AfriNuts
export const trackFormSubmission = (formType) => {
    trackEvent('form_submission', {
        form_type: formType, // 'contact', 'newsletter', 'quote'
    });
};

export const trackProductInquiry = (productName) => {
    trackEvent('product_inquiry', {
        product_name: productName, // 'Raw Cashews', 'W320', 'CNSL', etc.
    });
};

export const trackDownload = (fileType) => {
    trackEvent('file_download', {
        file_type: fileType, // 'compliance_pack', 'certification', 'brochure'
    });
};

export const trackBlogRead = (blogTitle, blogSlug) => {
    trackEvent('blog_read', {
        blog_title: blogTitle,
        blog_slug: blogSlug,
    });
};

export const trackOutboundClick = (destination, linkText) => {
    trackEvent('outbound_click', {
        destination: destination, // 'linkedin', 'whatsapp', 'email'
        link_text: linkText,
    });
};

export const trackCtaClick = (ctaName, ctaLocation) => {
    trackEvent('cta_click', {
        cta_name: ctaName,
        cta_location: ctaLocation, // 'hero', 'contact_page', 'processing_page'
    });
};

export const trackSearch = (searchQuery, resultsCount) => {
    trackEvent('site_search', {
        search_term: searchQuery,
        results_count: resultsCount,
    });
};

export const trackNewsletterSubscribe = (source) => {
    trackEvent('newsletter_subscribe', {
        source: source, // 'footer', 'blog_post', 'news_page', 'popup'
    });
};

// Initialize queued events on page load (call this in your App component)
export const initAnalytics = () => {
    if (isGtagReady()) {
        flushQueuedEvents();
    } else {
        // Wait for gtag to load
        const checkInterval = setInterval(() => {
            if (isGtagReady()) {
                clearInterval(checkInterval);
                flushQueuedEvents();
            }
        }, 100);
        // Timeout after 5 seconds
        setTimeout(() => clearInterval(checkInterval), 5000);
    }
};