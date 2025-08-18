import React, {Suspense, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import landClearingImage from '@/assets/images/land-clearing.webp';
import signingImage from '@/assets/images/partnership-signing.webp';
import {
    FaChevronDown, FaLeaf, FaSeedling,
    FaGlobeAfrica, FaArrowRight, FaBullhorn
} from 'react-icons/fa';
import {
    fadeIn,
    slideInFromLeft,
    slideInFromRight,
    scaleUp,
    staggerContainer,
} from '@/utils/animations';
import { Typography } from '@/components/Typography/Typography';
import {NewsItem, Product, FarmHighlight, SustainabilityFeature} from '@/types/translations';
import heroImage from '../assets/images/hero.webp';
import farmImage from '../assets/images/farm.webp';
import sustainabilityImage from '../assets/images/sustainability.webp';
import newsImage from '../assets/images/news.webp';
import valueAddedImage from '../assets/images/value-added.webp';
import organicCashewImage from '../assets/images/organic-cashew.webp';
import rawCashewImage from '../assets/images/raw-cashew.webp';
import afrinutsUpdatesData from '@/data/afrinutsUpdates.json';

import Section from '../components/Section/Section';
import ProductCard from '../components/ProductCard/ProductCard';

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

    return (
        <div className="min-h-[80vh] md:min-h-screen overflow-hidden text-balance">
            {/* Hero Section */}
            <Section
                fullHeight={false}
                bgImage={heroImage}
                className="flex items-end justify-center text-center min-h-[60vh] sm:min-h-[80vh] pb-8 sm:pb-12 px-4 sm:px-8 mt-24 sm:mt-32 pt-12 sm:pt-16 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
            >
              <motion.div
                  className="max-w-2xl px-6 py-4 sm:py-6 bg-white/75 backdrop-blur-xs rounded-xl border-2 border-primary/20 hover:border-accent/30 transition-all duration-300"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
              >
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
                {/* CTA Buttons - Responsive sizes */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mt-8 sm:mt-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary hover:bg-orange-700 text-white px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-base sm:text-lg md:text-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        onClick={() => navigate('/products')}
                    >
                        {t('hero.ctaButtons.exploreProducts')}
                        <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border-2 border-primary text-primary hover:bg-white/10 px-5 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-base sm:text-lg md:text-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        onClick={() => scrollToSection('about-preview')}
                    >
                        {t('hero.ctaButtons.learnMore')}
                        <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-y-1" />
                    </motion.button>
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
                        <div className=" bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-300  rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-12 w-full">
                            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
                                <motion.div
                                    className="text-orange-600 text-5xl p-5 bg-background rounded-xl shadow-inner"
                                    variants={fadeIn}
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
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group bg-primary hover:bg-dark-orange text-white px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center text-sm md:text-base"
                                        onClick={() => navigate('/about')}
                                    >
                                        {t('aboutPreview.ctaButton')}
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </Section>
            </Suspense>


            {/* 3. Products Showcase */}
            <Suspense fallback={<div>{t('loading.products')}</div>}>
                <Section className="py-10">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                            className="text-center mb-16"
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
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {(t('products.items', { returnObjects: true }) as Product[]).map((product) => (
                                <ProductCard
                                    key={product.key}
                                    product={{
                                        ...product,
                                        icon: product.icon.toLowerCase().replace(/\s+/g, '-'),
                                        backgroundImage: product.icon.toLowerCase().replace(/\s+/g, '-'),
                                        features: product.features || []
                                    }}
                                    handleContactClick={handleContactClick}
                                    productImageMap={productImageMap}
                                    iconMap={iconMap}
                                />
                            ))}
                        </motion.div>

                        <motion.div
                            className="text-center mt-16"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-primary hover:bg-dark-orange text-white hover:text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                                onClick={() => navigate('/products')}
                            >
                                {t('products.ctaButton')}
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    </div>
                </Section>
            </Suspense>

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
                                    <div key={highlight.key} className="bg-white/10 p-4 rounded-xl">
                                        <div className="text-accent text-2xl mb-2">
                                            {highlight.icon === 'FaLeaf' ? <FaLeaf /> : <FaGlobeAfrica />}
                                        </div>
                                        <Typography variant="h4" className="mb-2">
                                            {highlight.title}
                                        </Typography>
                                        <Typography variant="small">
                                            {highlight.description}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group border-2 border-primary text-primary hover:bg-accent hover:text-white hover:border-accent px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                                onClick={() => navigate('/farm')}
                            >
                                {t('farm.ctaButton')}
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                        <motion.div
                            className="flex-1 w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromRight}
                        >
                            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl aspect-video w-full">
                                <img
                                    src={farmImage}
                                    alt={t('farm.imageAlt')}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-6 md:p-8">
                                    <Typography variant="h4" className="text-white">
                                        {t('farm.location')}
                                    </Typography>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* 5. Sustainability */}
            <Section className="py-10 bg-gradient-to-r from-primary/30 via-white/30
  bg-[length:400%_400%] bg-gradient-animate-slow px-4 sm:px-6 rounded-b-[80px] md:rounded-b-[100px] overflow-hidden pt-24 pb-8 relative">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                <motion.div
                        className=" bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl overflow-hidden w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto border-2 border-primary/20 hover:border-accent/30 transition-all duration-300"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleUp}
                    >
                        <div className="flex flex-col md:flex-row gap-0">
                            <div
                                className="w-full md:w-1/2 bg-cover bg-center h-48 sm:h-64 md:h-auto min-h-[200px] md:min-h-[400px]"
                                style={{ backgroundImage: `url(${sustainabilityImage})` }}
                            />
                            <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 text-gray-900">
                                <div className="text-accent text-3xl sm:text-4xl mb-4 md:mb-6">
                                    <FaLeaf />
                                </div>
                                <Typography variant="h2" className="mb-4 md:mb-6 text-lg sm:text-xl md:text-2xl text-gray-900">
                                    {t('sustainability.title')}
                                </Typography>
                                <Typography variant="body" className="mb-6 md:mb-8 text-sm sm:text-base text-gray-900">
                                    {t('sustainability.description')}
                                </Typography>
                                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                    {(t('sustainability.features', { returnObjects: true }) as SustainabilityFeature[]).map((feature) => (
                                        <div key={feature.key} className="flex items-start gap-3 md:gap-4">
                                            <div className="text-accent text-lg md:text-xl mt-1">
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
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center md:justify-start">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group border-2 border-primary text-primary hover:bg-accent hover:text-white hover:border-accent px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                                        onClick={() => navigate('/sustainability')}
                                    >
                                        {t('sustainability.ctaButton')}
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* 6. News & Updates - Updated to match news.tsx style */}
            <Suspense fallback={<div>{t('loading.news')}</div>}>
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

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {(afrinutsUpdatesData.updates as AfriNutsUpdate[])
                                .filter((update: AfriNutsUpdate) => update.isFeatured)
                                .slice(0, 2)
                                .map((update: AfriNutsUpdate, index: number) => (
                                    <motion.div
                                        key={update.id}
                                        variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                                        className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-accent"
                                    >
                                        <div className="h-48 overflow-hidden rounded-t-lg">
                                            {update.id === 'update-2024-001' ? (
                                                <img
                                                    src={landClearingImage}
                                                    alt="Land Clearing"
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : update.id === 'update-2024-002' ? (
                                                <img
                                                    src={signingImage}
                                                    alt="Partnership Signing"
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <img
                                                    src={update.image || newsImage}
                                                    alt={update.title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FaBullhorn className="text-accent" />
                                                <Typography variant="caption" className="text-gray-500">
                                                    {new Date(update.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </Typography>
                                            </div>
                                            <Typography variant="h3" className="mb-3 text-primary">
                                                {update.translationKeys?.title ? t(update.translationKeys.title) : update.title}
                                            </Typography>
                                            <Typography variant="body" className="mb-4 text-gray-600 whitespace-pre-line">
                                                {update.translationKeys?.excerpt ? t(update.translationKeys.excerpt) : update.excerpt}
                                            </Typography>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {update.tags.map((tag: string) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                                                    >
                      {tag}
                    </span>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => navigate('/news')}
                                                className="text-accent hover:text-primary font-medium flex items-center gap-1 transition-colors"
                                            >
                                                {t('newsCard.readMore')}
                                                <FaArrowRight className="text-sm" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                        </motion.div>

                        <motion.div
                            className="text-center"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                                onClick={() => navigate('/news')}
                            >
                                {t('news.ctaButton')}
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    </div>
                </Section>
            </Suspense>

            {/* 7. Contact CTA */}
            <Suspense fallback={<div>{t('loading.contact')}</div>}>
                <Section className="py-10 text-text-dark relative overflow-hidden">
                    <div className="w-full px-4 sm:px-6">
                        <div className="relative z-10 container mx-auto text-center max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
                            <motion.div
                                className="max-w-4xl mx-auto"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={scaleUp}
                            >
                                <Typography variant="h2" className="mb-6">
                                    {t('contact.title')}
                                </Typography>
                                <Typography variant="subhead" className="mb-8 max-w-2xl mx-auto">
                                    {t('contact.subtitle')}
                                </Typography>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group bg-primary hover:bg-dark-orange text-white hover:text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                                    onClick={() => navigate('/contact')}
                                >
                                    {t('contact.ctaButton')}
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </Section>
            </Suspense>
        </div>
    );
};

export default Home;