// src/utils/analytics.js

// Send event to Google Analytics
export const trackEvent = (eventName, eventParams = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventParams);
        console.log(`GA Event: ${eventName}`, eventParams);
    } else {
        console.warn('GTag not available');
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