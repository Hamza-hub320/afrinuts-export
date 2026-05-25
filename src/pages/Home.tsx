import React, {Suspense, useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import {Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaChevronDown,
    FaLeaf,
    FaSeedling,
    FaGlobeAfrica,
    FaArrowRight,
    FaBullhorn,
    FaTwitter,
    FaLinkedin,
    FaFacebook,
    FaShareSquare,
    FaSadTear,
    FaSearch,
    FaBox, FaPenFancy, FaMapSigns,
} from 'react-icons/fa';
import {
    fadeIn,
    slideInFromLeft,
    slideInFromRight,
    scaleUp,
    staggerContainer,
} from '@/utils/animations';
import { Typography } from '@/components/Typography/Typography';
import { Product, FarmHighlight, SustainabilityFeature} from '@/types/translations';
import heroImage from '../assets/images/hero.webp';
import farmImage from '../assets/images/farm.webp';
import sustainabilityImage from '../assets/images/sustainability.webp';
import newsImage from '../assets/images/news.webp';
import valueAddedImage from '../assets/images/value-added.webp';
import organicCashewImage from '../assets/images/organic-cashew.webp';
import rawCashewImage from '../assets/images/raw-cashew.webp';

import Section from '../components/Section/Section';
import ProductCard from '../components/ProductCard/ProductCard';
import JsonLd from "@/components/Seo/JsonLd";
import { trackCtaClick, trackProductInquiry, trackOutboundClick } from '@/utils/analytics';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import {Helmet} from "react-helmet-async";


interface AfriNutsUpdate {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    image?: string;
    tags: string[];
    author?: string;
    isFeatured?: boolean;

}

// Add this interface
interface AfriNutsUpdate {
    id: string;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    image?: string;
    tags: string[];
    author?: string;
}

const Home: React.FC = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();

    // Define product data and mappings
    const productImageMap = {
        'raw-cashews': rawCashewImage,
        'organic-cashews': organicCashewImage,
        'value-added': valueAddedImage
    };

    const iconMap = {
        'raw-cashews': FaSeedling,
        'organic-cashews': FaLeaf,
        'value-added': FaGlobeAfrica
    };

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleContactClick = () => {
        navigate('/contact');
    };

    // For News Load More
    const [newsToShow, setNewsToShow] = useState(2);
    const [homeUpdates, setHomeUpdates] = useState<AfriNutsUpdate[]>([]);

    // Social share handler (dummy)
    const handleShare = (url: string, title: string, platform: string) => {
        trackOutboundClick(platform, title);
        if (navigator.share) {
            navigator.share({ title, url });
        } else {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        }
    };

    useEffect(() => {
        const fetchHomeUpdates = async () => {
            try {
                const response = await fetch('/.netlify/functions/blog?contentType=newsUpdate');
                const data = await response.json();
                const updates = (data.posts || []).map((post: any) => ({
                    id: post.id,
                    slug: post.slug,
                    title: post.title,
                    date: post.publishedDate,
                    excerpt: post.excerpt,
                    content: post.content,
                    image: post.image,
                    tags: post.tags || [],
                    author: post.author || 'AfriNuts',
                }));
                setHomeUpdates(updates);
            } catch (error) {
                console.error('Error fetching home updates:', error);
            }
        };
        fetchHomeUpdates();
    }, []);

    return (
        <div className="min-h-[80vh] md:min-h-screen overflow-hidden text-balance">
            <Helmet>
                <title>AfriNuts Export | Traceable Cashews from Côte d'Ivoire | Wholesale & Investment</title>
                <meta name="description" content="Traceable cashews from our 35-hectare farm in Odienné, Côte d'Ivoire. Block-level tracking, export-ready documentation, and custom Farm OS technology. Wholesale, investment, and partnership inquiries welcome." />
                <link rel="canonical" href="https://www.afrinutsexport.com" />
                <meta property="og:title" content="AfriNuts Export | Traceable Cashews from Côte d'Ivoire" />
                <meta property="og:description" content="Block-level tracking, Farm OS technology, and export-ready documentation. Direct from our 35-hectare farm in Odienné." />
                <meta property="og:image" content="https://www.afrinutsexport.com/logo192.png" />
                <meta property="og:url" content="https://www.afrinutsexport.com" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Premium Organic Cashews from Ivory Coast | AfriNuts Export",
                "description": "Sustainably grown on our 35-hectare family farm in Odienné. Certified organic cashews for wholesale buyers, retailers, and distributors worldwide.",
                "mainEntity": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "foundingDate": "2023",
                    "founders": [
                        {"@type": "Person", "name": "Hamza S. Ralsan Sangare"},
                        {"@type": "Person", "name": "Sekou Hakim Peters"}
                    ],
                    "knowsAbout": ["Organic Cashew Farming", "Wholesale Cashew Export", "Sustainable Agriculture", "Islamic Finance"],
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Odienné",
                        "addressCountry": "CI"
                    }
                }
            }} />
            {/* Hero Section */}
            <Section
                fullHeight={false}
                bgImage={heroImage}
                className="flex items-end justify-center text-center min-h-[60vh] sm:min-h-[80vh] pb-24 pr-16 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 mt-32 pt-24 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
            >
                <motion.div
                    className="max-w-2xl px-6 py-4 sm:py-6 relative overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-500 group"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.6) 100%)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        boxShadow: '0 8px 32px rgba(165, 105, 66, 0.12), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.05)'
                    }}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {/* Animated gradient blobs */}
                    <div
                        className="absolute -top-16 -right-16 w-36 h-36 rounded-full opacity-20 blur-3xl animate-pulse"
                        style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.3) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full opacity-15 blur-3xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(210,125,45,0.3) 0%, transparent 70%)',
                            animation: 'float 6s ease-in-out infinite'
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                        <motion.h1
                            className="font-display text-3xl md:text-5xl lg:text-6xl text-primary mb-2 leading-snug"
                            variants={fadeIn}
                            style={{ letterSpacing: '-0.03em' }}
                        >
                            {t('hero.title')}
                        </motion.h1>
                        <motion.div variants={fadeIn}>
                            <Typography variant="subtitle" className="text-primary/90">
                                {t('hero.subtitle')}
                            </Typography>
                        </motion.div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mt-8 sm:mt-10">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="overflow-hidden relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-base sm:text-lg md:text-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
                                onClick={() => {
                                    trackCtaClick('explore_products', 'hero');
                                    navigate('/products');
                                }}
                            >
                                {/* Button glass highlight */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                <span className="relative z-10 flex items-center gap-2">
                {t('hero.ctaButtons.exploreProducts')}
                                    <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1" />
            </span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="overflow-hidden relative border-primary/50 text-primary hover:bg-white/20 px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-base sm:text-lg md:text-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
                                style={{
                                    backdropFilter: 'blur(4px)'
                                }}
                                onClick={() => {
                                    trackCtaClick('learn_more', 'hero');
                                    scrollToSection('about-preview');
                                }}
                            >
            <span className="relative z-10 flex items-center gap-2">
                {t('hero.ctaButtons.learnMore')}
                <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-y-1" />
            </span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </Section>


            {/* 2. About Preview Section */}
            <Suspense fallback={<div>{t('loading.about')}</div>}>
                <Section id="about-preview" className="py-10 -mt-1 px-4 sm:px-6">
                    <motion.div
                        className="w-full max-w-7xl mx-auto px-4 sm:px-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={scaleUp}
                    >
                        <motion.div
                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-12 w-full transform-gpu"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            whileHover={{
                                y: -5,
                                scale: 1.01,
                                rotateY: 2,
                                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* 3D edge effect */}
                            <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                            {/* Glassy overlay */}
                            <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                            {/* Inner shadow effect */}
                            <div className="absolute inset-0 rounded-2xl md:rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-12 relative z-10">
                                <motion.div
                                    className="text-orange-600 text-5xl p-5 bg-white/80 backdrop-blur-md rounded-xl shadow-inner transform-gpu group-hover:scale-110 transition-transform duration-500"
                                    variants={fadeIn}
                                    aria-label={t('aboutPreview.iconAria')}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <FaGlobeAfrica />
                                </motion.div>
                                <motion.div
                                    className="flex-1"
                                    variants={fadeIn}
                                >
                                    <Typography variant="h2" className="mb-4 md:mb-6">
                                        {t('aboutPreview.title')}
                                    </Typography>
                                    <Typography variant="body" className="mb-6 md:mb-8">
                                        {t('aboutPreview.description')}
                                    </Typography>

                                    {/* Two Button Row — Now Three */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Farm Story Button — Primary Green */}
                                        <motion.button
                                            whileHover={{ scale: 1.08, y: -2, boxShadow: '0 10px 25px -5px rgba(90, 116, 17, 0.4)' }}
                                            whileTap={{ scale: 0.96 }}
                                            className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5"
                                            onClick={() => navigate('/about')}
                                            aria-label={t('aboutPreview.ctaButton')}
                                        >
                                            <FaMapSigns className="mr-2" />
                                            {t('aboutPreview.ctaButton')}
                                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </motion.button>

                                        {/* Blog Button — Accent Orange */}
                                        <motion.button
                                            whileHover={{ scale: 1.08, y: -2, boxShadow: '0 10px 25px -5px rgba(224, 78, 0, 0.4)' }}
                                            whileTap={{ scale: 0.96 }}
                                            className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm"
                                            onClick={() => navigate('/blog')}
                                            aria-label="Visit our blog"
                                        >
                                            <FaPenFancy className="mr-2" />
                                            {t('aboutPreview.blogButton')}
                                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </motion.button>

                                        {/* Wholesale Button — Navy/Teal */}
                                        <motion.button
                                            whileHover={{ scale: 1.08, y: -2, boxShadow: '0 10px 25px -5px rgba(37, 55, 70, 0.4)' }}
                                            whileTap={{ scale: 0.96 }}
                                            className="relative border border-accent/40 text-accent hover:bg-accent/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm"
                                            onClick={() => navigate('/wholesale')}
                                            aria-label={t('aboutPreview.wholesaleButton', 'Wholesale Inquiry')}
                                        >
                                            <FaBox className="mr-2" />
                                            {t('aboutPreview.wholesaleButton', 'Wholesale Inquiry')}
                                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </Section>
            </Suspense>


            {/* 3. Products Showcase */}
            <Suspense fallback={<div>{t('loading.products')}</div>}>
                <Section className="py-10">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <motion.div
                            className="text-center mb-16 h-full"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                        >
                            <Typography variant="h2" className="mb-4">
                                {t('products.title')}
                            </Typography>
                            <Typography variant="subhead" className="max-w-3xl mx-auto">
                                {t('products.subtitle')}
                            </Typography>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 overflow-visible"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {(t('products.items', { returnObjects: true }) as Product[]).map((product) => (
                                <motion.div
                                    key={product.key}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full relative z-0 overflow-visible h-full"
                                >
                                    <ProductCard
                                        product={{
                                            ...product,
                                            icon: product.icon.toLowerCase().replace(/\s+/g, '-'),
                                            backgroundImage: product.icon.toLowerCase().replace(/\s+/g, '-'),
                                            features: product.features || []
                                        }}
                                        className="h-full"
                                        handleContactClick={() => {
                                            trackProductInquiry(product.name);
                                            handleContactClick();
                                        }}
                                        productImageMap={productImageMap}
                                        iconMap={iconMap}
                                        // Pass i18n alt texts and aria labels
                                        imageAlt={t(`products.itemsAlt.${product.key}`)}
                                        ariaLabel={t(`products.itemsAria.${product.key}`)}
                                        // Social share
                                        renderSocialShare={() => (
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    aria-label={t('products.share.facebook')}
                                                    className="rounded-full p-2 hover:bg-primary/10 transition"
                                                    onClick={() => handleShare(window.location.href, product.name, 'facebook')}
                                                    type="button"
                                                >
                                                    <FaFacebook className="w-4 h-4 text-primary" />
                                                </button>
                                                <button
                                                    aria-label={t('products.share.twitter')}
                                                    className="rounded-full p-2 hover:bg-accent/10 transition"
                                                    onClick={() => handleShare(window.location.href, product.name, 'twitter')}
                                                    type="button"
                                                >
                                                    <FaTwitter className="w-4 h-4 text-accent" />
                                                </button>
                                                <button
                                                    aria-label={t('products.share.linkedin')}
                                                    className="rounded-full p-2 hover:bg-primary/10 transition"
                                                    onClick={() => handleShare(window.location.href, product.name, 'linkedin')}
                                                    type="button"
                                                >
                                                    <FaLinkedin className="w-4 h-4 text-primary" />
                                                </button>
                                            </div>
                                        )}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </Section>
            </Suspense>

            {/* Product CTA */}
            <Section className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <Typography variant="h2" className="text-primary mb-3">
                            {t('products.cta.heading', 'Find the Right Cashew Product for Your Business')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 mb-5 max-w-xl mx-auto">
                            {t('products.cta.description', 'Browse our full catalog with organic and conventional options, pricing details, certifications, and availability timelines.')}
                        </Typography>
                        <motion.button
                            onClick={() => navigate('/products')}
                            className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full transform-gpu transition-all duration-300 inline-flex items-center gap-2 text-sm font-medium shadow-md"
                            whileHover={{ y: -2, scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                            <span className="relative z-10">{t('products.cta.button', 'Explore All Products')}</span>
                            <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            </Section>

            {/* Traceability Teaser */}
            <Section className="py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <InfoCard
                            icon={FaSearch}
                            title={t('traceability.title', 'Traceable from Tree to Container')}
                            variant="primary"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <Typography variant="body" className="text-gray-600 mb-5 max-w-xl mx-auto">
                                {t('traceability.description', 'Our custom Farm OS tracks every cashew from the block it was harvested to the container it ships in. Buyers and investors get real-time visibility into origin, quality, and handling — not just a paper trail.')}
                            </Typography>
                            <motion.button
                                onClick={() => navigate('/trace')}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full transform-gpu transition-all duration-300 inline-flex items-center gap-2 text-sm font-medium shadow-md"
                                whileHover={{ y: -2, scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                <span className="relative z-10">{t('traceability.cta', 'See How Traceability Works')}</span>
                                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            {/* 4. Farm Story */}
            <Section className="py-10 bg-gradient-to-r from-primary/30 via-white/30
  bg-[length:300%_300%] bg-gradient-animate-slow text-text-dark px-4 sm:px-6 rounded-t-[80px] md:rounded-t-[100px] overflow-hidden pt-24 pb-8 relative">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
                        <motion.div
                            className="flex-1 w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromLeft}
                        >
                            <Typography variant="h2" className="mb-4 md:mb-6">
                                {t('farm.title')}
                            </Typography>
                            <Typography variant="body" className="mb-6 md:mb-8">
                                {t('farm.description')}
                            </Typography>
                            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                                {(t('farm.highlights', { returnObjects: true }) as FarmHighlight[]).map((highlight) => (
                                    <motion.div
                                        key={highlight.key}
                                        className="relative bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-xl transform-gpu"
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            perspective: '1000px',
                                        }}
                                        whileHover={{
                                            y: -5,
                                            scale: 1.02,
                                            rotateY: 2,
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        {/* 3D edge effect */}
                                        <div className="absolute inset-0 rounded-xl border-2 border-white/20 transform-gpu translate-z-[-4px] hover:translate-z-[-8px] transition-all duration-500" />

                                        {/* Glassy overlay */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent opacity-30 hover:opacity-50 transition-opacity duration-500" />

                                        <div className="relative z-10">
                                            <div className="text-accent text-2xl mb-2" aria-label={t(`farm.highlightsAria.${highlight.key}`)}>
                                                {highlight.icon === 'FaLeaf' ? <FaLeaf /> : <FaGlobeAfrica />}
                                            </div>
                                            <Typography variant="h4" className="mb-2">
                                                {highlight.title}
                                            </Typography>
                                            <Typography variant="small">
                                                {highlight.description}
                                            </Typography>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                className="group border-2 relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                                onClick={() => {
                                    trackCtaClick('explore_farm', 'farm_section');
                                    navigate('/farm');
                                }}
                                aria-label={t('farm.ctaButton')}
                            >
                                {t('farm.ctaButton')}
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true"/>
                            </motion.button>
                        </motion.div>
                        <motion.div
                            className="flex-1 w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromRight}
                        >
                            <motion.div
                                className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl aspect-video w-full transform-gpu"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                }}
                                whileHover={{
                                    scale: 1.04,
                                    rotateY: 3,
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.97 }}
                            >
                                {/* 3D edge effect */}
                                <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500 z-10" />

                                {/* Glassy overlay */}
                                <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500 z-10" />

                                <img
                                    src={farmImage}
                                    alt={t('farm.imageAlt')}
                                    width={1200}
                                    height={800}
                                    loading="eager"
                                    fetchPriority="high"
                                    className="w-full h-full object-cover relative z-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent flex items-end p-6 md:p-8 z-10">
                                    <Typography variant="h4" className="text-white">
                                        {t('farm.location')}
                                    </Typography>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* 5. Sustainability */}
            <Section className="py-10 bg-gradient-to-r from-primary/30 via-white/30
  bg-[length:400%_400%] bg-gradient-animate-slow px-4 sm:px-6 rounded-b-[80px] md:rounded-b-[100px] overflow-hidden pt-24 pb-8 relative">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 transform-gpu"
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleUp}
                        whileHover={{
                            y: -5,
                            scale: 1.01,
                            rotateY: 2,
                            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="flex flex-col md:flex-row gap-0 relative z-10">
                            <motion.div
                                className="w-full md:w-1/2 bg-cover bg-center h-48 sm:h-64 md:h-auto min-h-[200px] md:min-h-[400px] relative overflow-hidden"
                                style={{ backgroundImage: `url(${sustainabilityImage})` }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                aria-label={t('sustainability.imageAlt')}
                            >
                                {/* Image 3D effect */}
                                <div className="absolute inset-0 rounded-l-2xl md:rounded-l-3xl border-r-2 border-white/20 transform-gpu translate-z-[-4px] hover:translate-z-[-8px] transition-all duration-500" />

                                <img
                                    src={sustainabilityImage}
                                    alt={t('sustainability.imageAlt')}
                                    className="w-full h-full object-cover rounded-none"
                                    width={1200}
                                    height={800}
                                    loading="lazy"
                                    aria-label={t('sustainability.imageAlt')}
                                    style={{ display: 'none' }}
                                />
                            </motion.div>
                            <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 text-gray-900 relative z-10">
                                <motion.div
                                    className="text-accent text-3xl sm:text-4xl mb-4 md:mb-6 inline-block bg-accent/10 p-3 rounded-full backdrop-blur-sm"
                                    aria-label={t('sustainability.iconAria')}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <FaLeaf />
                                </motion.div>
                                <Typography variant="h2" className="mb-4 md:mb-6 text-lg sm:text-xl md:text-2xl text-gray-900">
                                    {t('sustainability.title')}
                                </Typography>
                                <Typography variant="body" className="mb-6 md:mb-8 text-sm sm:text-base text-gray-900">
                                    {t('sustainability.description')}
                                </Typography>
                                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                    {(t('sustainability.features', { returnObjects: true }) as SustainabilityFeature[]).map((feature, index) => (
                                        <motion.div
                                            key={feature.key}
                                            className="flex items-start gap-3 md:gap-4 bg-white/30 backdrop-blur-sm p-3 rounded-lg transform-gpu hover:scale-[1.02] transition-transform duration-300"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ x: 3 }}
                                        >
                                            <div className="text-accent text-lg md:text-xl mt-1 bg-accent/10 p-2 rounded-full" aria-label={t(`sustainability.featuresAria.${feature.key}`)}>
                                                {feature.icon === 'FaSeedling' ? <FaSeedling /> :
                                                    feature.icon === 'FaGlobeAfrica' ? <FaGlobeAfrica /> :
                                                        <FaLeaf />}
                                            </div>
                                            <div>
                                                <Typography variant="h4" className="mb-1 text-sm md:text-base text-gray-900">
                                                    {feature.title}
                                                </Typography>
                                                <Typography variant="small" className="text-xs sm:text-sm text-gray-900">
                                                    {feature.description}
                                                </Typography>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="flex justify-center md:justify-start">
                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="group border-2 relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                                        onClick={() => {
                                            trackCtaClick('sustainability', 'sustainability_section');
                                            navigate('/sustainability');
                                        }}
                                        aria-label={t('sustainability.ctaButton')}
                                    >
                                        {t('sustainability.ctaButton')}
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true"/>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* 6. News & Updates - Dynamic from Contentful */}
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('news.title')}
                        </Typography>
                        <Typography variant="subhead" className="max-w-3xl mx-auto">
                            {t('news.subtitle')}
                        </Typography>
                    </motion.div>

                    {homeUpdates.length === 0 ? (
                        <div className="text-center py-10">
                            <FaSadTear className="text-4xl text-gray-300 mx-auto mb-3" />
                            <Typography variant="body" className="text-gray-500">{t('news.noUpdates')}</Typography>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {homeUpdates.slice(0, newsToShow).map((update: AfriNutsUpdate, index: number) => (
                                <motion.div key={update.id} variants={fadeIn}>
                                    <Link to={`/news/${update.slug}`} className="block h-full">
                                        <motion.div
                                            className="group relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-accent h-full transform-gpu"
                                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                            whileHover={{ y: -8, scale: 1.03, rotateY: 2, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.25)', transition: { duration: 0.3 } }}
                                        >
                                            {/* 3D edge effect */}
                                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                                            {/* Glassy overlay */}
                                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                            {/* Inner shadow */}
                                            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                                            {/* Background pattern */}
                                            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                            {/* Image with asymmetrical corners */}
                                            <div className="relative h-64 overflow-hidden z-10 rounded-t-3xl rounded-bl-3xl rounded-br-[80px]">
                                                <motion.img
                                                    src={update.image || newsImage}
                                                    alt={update.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                                            </div>

                                            {/* Share button - top right corner */}
                                            <button
                                                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-md flex items-center justify-center text-primary hover:text-accent hover:bg-white/90 transition-all transform-gpu hover:scale-110"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const url = `${window.location.origin}/news/${update.slug}`;
                                                    if (navigator.share) {
                                                        navigator.share({ title: update.title, url });
                                                    } else {
                                                        navigator.clipboard.writeText(url);
                                                    }
                                                }}
                                                aria-label={t('newsCard.share', 'Share')}
                                            >
                                                <FaShareSquare className="w-4 h-4" />
                                            </button>

                                            <div className="p-6 relative z-10">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="bg-accent/20 p-2 rounded-full">
                                                        <FaBullhorn className="text-accent" />
                                                    </div>
                                                    <Typography variant="caption" className="text-gray-500">
                                                        {new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </Typography>
                                                </div>
                                                <Typography variant="h3" className="mb-3">{update.title}</Typography>
                                                <Typography variant="body" className="mb-4 text-gray-600">{update.excerpt}</Typography>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {update.tags?.map((tag: string) => (
                                                        <span key={tag} className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">{tag}</span>
                                                    ))}
                                                </div>
                                                <span className="text-accent hover:text-primary font-medium flex items-center gap-1 transition-colors">
                                        {t('newsCard.readMore')}
                                                    <FaArrowRight className="text-sm" />
                                    </span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        {newsToShow < homeUpdates.length && (
                            <button
                                onClick={() => setNewsToShow(prev => Math.min(prev + 2, homeUpdates.length))}
                                className="group border-2 border-primary text-primary hover:bg-accent hover:text-white hover:border-accent px-8 py-3 rounded-full transition-all duration-300 shadow-md inline-flex items-center mb-4 backdrop-blur-sm bg-white/80"
                            >
                                {t('news.loadMore')}
                            </button>
                        )}
                        <Link
                            to="/news"
                            className="group border-2 relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                        >
                            {t('news.ctaButton')}
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </Section>

            {/* 7. Contact CTA */}
            <Suspense fallback={<div>{t('loading.contact')}</div>}>
                <Section className="py-16 text-text-dark relative overflow-hidden">
                    <div className="w-full px-4 sm:px-6">
                        <div className="relative z-10 container mx-auto text-center max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
                            <motion.div
                                className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu mx-auto max-w-4xl"
                                style={{
                                    transformStyle: 'preserve-3d',
                                }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={scaleUp}
                                whileHover={{
                                    y: -5,
                                    scale: 1.02,
                                    rotateY: 2,
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {/* 3D edge effect */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                                {/* Glassy overlay */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                                {/* Inner shadow effect */}
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                {/* Subtle background pattern */}
                                <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                <div className="relative z-10">
                                    <Typography variant="h2" className="mb-6">
                                        {t('contact.title')}
                                    </Typography>
                                    <Typography variant="subhead" className="mb-8 max-w-2xl mx-auto">
                                        {t('contact.subtitle')}
                                    </Typography>
                                    <motion.button
                                        className="group bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center mx-auto transform-gpu relative overflow-hidden"
                                        onClick={() => {
                                            trackCtaClick('get_in_touch', 'contact_section');
                                            navigate('/contact');
                                        }}
                                        aria-label={t('contact.ctaButton')}
                                        whileHover={{
                                            scale: 1.08,
                                            y: -2,
                                            boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)'
                                        }}
                                        whileTap={{ scale: 0.96 }}
                                    >
                                        {/* Button 3D edge effect */}
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-300" />

                                        {/* Button glassy overlay */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                                        {/* Button inner glow */}
                                        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />

                                        <span className="relative z-10 font-medium">
                                {t('contact.ctaButton')}
                            </span>
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform relative z-10" aria-hidden="true"/>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Section>
            </Suspense>
        </div>
    );
};

export default Home;