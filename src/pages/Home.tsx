import React, {Suspense, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import landClearingImage from '@/assets/images/land-clearing.webp';
import signingImage from '@/assets/images/partnership-signing.webp';
import {
    FaChevronDown, FaLeaf, FaSeedling,
    FaGlobeAfrica, FaArrowRight, FaBullhorn,
    FaBuilding, FaIndustry, FaStore
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

    // For News Load More
    const [newsToShow, setNewsToShow] = useState(2);
    const allUpdates = afrinutsUpdatesData.updates as AfriNutsUpdate[];
    const featuredUpdates = allUpdates.filter((u) => u.isFeatured);
    const nonFeaturedUpdates = allUpdates.filter((u) => !u.isFeatured);

    // Social share handler (dummy)
    const handleShare = (url: string, title: string) => {
      if (navigator.share) {
        navigator.share({ title, url });
      } else {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
      }
    };

    return (
        <div className="min-h-[80vh] md:min-h-screen overflow-hidden text-balance">
            {/* Hero Section */}
            <Section
                fullHeight={false}
                bgImage={heroImage}
                className="flex items-end justify-center text-center min-h-[60vh] sm:min-h-[80vh] pb-24 pr-16 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 mt-32 pt-24 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
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
                            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-12">
                                <motion.div
                                    className="text-orange-600 text-5xl p-5 bg-background rounded-xl shadow-inner"
                                    variants={fadeIn}
                                    aria-label={t('aboutPreview.iconAria')}
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
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="group bg-primary hover:bg-dark-orange text-white px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center text-sm md:text-base"
                                        onClick={() => navigate('/about')}
                                        aria-label={t('aboutPreview.ctaButton')}
                                    >
                                        {t('aboutPreview.ctaButton')}
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true"/>
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
                                <motion.div
                                  key={product.key}
                                  whileHover={{ scale: 1.04 }}
                                  whileTap={{ scale: 0.97 }}
                                  className="w-full"
                                >
                                  <ProductCard
                                    product={{
                                        ...product,
                                        icon: product.icon.toLowerCase().replace(/\s+/g, '-'),
                                        backgroundImage: product.icon.toLowerCase().replace(/\s+/g, '-'),
                                        features: product.features || []
                                    }}
                                    handleContactClick={handleContactClick}
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
                                          className="rounded-full p-2 hover:bg-gray-100 transition"
                                          onClick={() => handleShare(window.location.href, product.title)}
                                          type="button"
                                        >
                                          <svg aria-hidden="true" className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 5.006 3.66 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.876h2.773l-.443 2.89h-2.33v6.987C18.34 21.128 22 17.006 22 12"></path></svg>
                                        </button>
                                        <button
                                          aria-label={t('products.share.twitter')}
                                          className="rounded-full p-2 hover:bg-gray-100 transition"
                                          onClick={() => handleShare(window.location.href, product.title)}
                                          type="button"
                                        >
                                          <svg aria-hidden="true" className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.644.59-2.538.698a4.482 4.482 0 0 0 1.967-2.48 8.964 8.964 0 0 1-2.828 1.082 4.478 4.478 0 0 0-7.635 4.083A12.713 12.713 0 0 1 3.16 4.797a4.478 4.478 0 0 0 1.386 5.976 4.444 4.444 0 0 1-2.029-.561v.057a4.48 4.48 0 0 0 3.589 4.393 4.486 4.486 0 0 1-2.024.077 4.483 4.483 0 0 0 4.183 3.112A8.978 8.978 0 0 1 2 19.54a12.687 12.687 0 0 0 6.88 2.018c8.264 0 12.787-6.84 12.787-12.787 0-.195-.004-.39-.013-.583A9.18 9.18 0 0 0 24 4.59a8.936 8.936 0 0 1-2.54.697z"></path></svg>
                                        </button>
                                        <button
                                          aria-label={t('products.share.linkedin')}
                                          className="rounded-full p-2 hover:bg-gray-100 transition"
                                          onClick={() => handleShare(window.location.href, product.title)}
                                          type="button"
                                        >
                                          <svg aria-hidden="true" className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M19.994 19.994h-3.554v-5.568c0-1.328-.028-3.037-1.849-3.037-1.851 0-2.134 1.445-2.134 2.938v5.667H8.902V9h3.413v1.494h.048c.476-.9 1.637-1.849 3.37-1.849 3.605 0 4.27 2.372 4.27 5.456v5.893zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.773 12.561H3.563V9h3.547v10.994zM22.225 0H1.771C.792 0 0 .771 0 1.726v20.547C0 23.229.792 24 1.771 24h20.451C23.208 24 24 23.229 24 22.273V1.726C24 .771 23.208 0 22.225 0z"></path></svg>
                                        </button>
                                      </div>
                                    )}
                                  />
                                </motion.div>
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
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                className="group bg-primary hover:bg-dark-orange text-white hover:text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                                onClick={() => navigate('/products')}
                                aria-label={t('products.ctaButton')}
                            >
                                {t('products.ctaButton')}
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true"/>
                            </motion.button>
                        </motion.div>
                    </div>
                </Section>
            </Suspense>

            {/* B2B Testimonials Section */}
            <Section className="py-14">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('testimonials.title')}
                        </Typography>
                        <Typography variant="subhead" className="max-w-3xl mx-auto">
                            {t('testimonials.subtitle')}
                        </Typography>
                    </motion.div>
                    <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 md:grid md:grid-cols-3 md:gap-8">
                      {/* Testimonial 1 - Europe */}
                      <div className="flex-shrink-0 w-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 text-center border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 shadow-lg flex flex-col items-center">
                          <FaBuilding className="text-primary text-4xl mb-4" aria-label={t('testimonials.europe.iconAria')} />
                          <blockquote className="text-lg italic text-gray-800 mb-4">
                              &ldquo;{t('testimonials.europe.quote')}&rdquo;
                          </blockquote>
                          <div className="font-semibold text-primary">{t('testimonials.europe.name')}</div>
                          <div className="text-sm text-gray-600">{t('testimonials.europe.position')}</div>
                      </div>
                      {/* Testimonial 2 - America */}
                      <div className="flex-shrink-0 w-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 text-center border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 shadow-lg flex flex-col items-center">
                          <FaIndustry className="text-primary text-4xl mb-4" aria-label={t('testimonials.america.iconAria')} />
                          <blockquote className="text-lg italic text-gray-800 mb-4">
                              &ldquo;{t('testimonials.america.quote')}&rdquo;
                          </blockquote>
                          <div className="font-semibold text-primary">{t('testimonials.america.name')}</div>
                          <div className="text-sm text-gray-600">{t('testimonials.america.position')}</div>
                      </div>
                      {/* Testimonial 3 - Middle East */}
                      <div className="flex-shrink-0 w-80 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 text-center border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 shadow-lg flex flex-col items-center">
                          <FaStore className="text-primary text-4xl mb-4" aria-label={t('testimonials.me.iconAria')} />
                          <blockquote className="text-lg italic text-gray-800 mb-4">
                              &ldquo;{t('testimonials.me.quote')}&rdquo;
                          </blockquote>
                          <div className="font-semibold text-primary">{t('testimonials.me.name')}</div>
                          <div className="text-sm text-gray-600">{t('testimonials.me.position')}</div>
                      </div>
                    </div>
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
                                    <div key={highlight.key} className="bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-xl">
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
                                ))}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                className="group border-2 border-primary text-primary hover:bg-accent hover:text-white hover:border-accent px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                                onClick={() => navigate('/farm')}
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
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl aspect-video w-full">
                                <img
                                    src={farmImage}
                                    alt={t('farm.imageAlt')}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                    aria-label={t('farm.imageAlt')}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent  flex items-end p-6 md:p-8">
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
                            <motion.div
                                className="w-full md:w-1/2 bg-cover bg-center h-48 sm:h-64 md:h-auto min-h-[200px] md:min-h-[400px]"
                                style={{ backgroundImage: `url(${sustainabilityImage})` }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                aria-label={t('sustainability.imageAlt')}
                            >
                                <img
                                  src={sustainabilityImage}
                                  alt={t('sustainability.imageAlt')}
                                  className="w-full h-full object-cover rounded-none"
                                  loading="lazy"
                                  aria-label={t('sustainability.imageAlt')}
                                  style={{ display: 'none' }}
                                />
                            </motion.div>
                            <div className="w-full md:w-1/2 p-6 md:p-8 lg:p-12 text-gray-900">
                                <div className="text-accent text-3xl sm:text-4xl mb-4 md:mb-6" aria-label={t('sustainability.iconAria')}>
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
                                            <div className="text-accent text-lg md:text-xl mt-1" aria-label={t(`sustainability.featuresAria.${feature.key}`)}>
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
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="group border-2 border-primary text-primary hover:bg-accent hover:text-white hover:border-accent px-6 py-2 md:px-8 md:py-3 rounded-full transition-all duration-300 inline-flex items-center text-sm md:text-base"
                                        onClick={() => navigate('/sustainability')}
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
                            {[...featuredUpdates, ...nonFeaturedUpdates].slice(0, newsToShow).map((update: AfriNutsUpdate, index: number) => (
                                <motion.div
                                    key={update.id}
                                    variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                                    className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-accent"
                                >
                                    <div className="h-48 overflow-hidden rounded-t-lg">
                                        {update.id === 'update-2024-001' ? (
                                            <img
                                                src={landClearingImage}
                                                alt={t('news.images.landClearingAlt')}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                aria-label={t('news.images.landClearingAlt')}
                                            />
                                        ) : update.id === 'update-2024-002' ? (
                                            <img
                                                src={signingImage}
                                                alt={t('news.images.partnershipSigningAlt')}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                aria-label={t('news.images.partnershipSigningAlt')}
                                            />
                                        ) : (
                                            <img
                                                src={update.image || newsImage}
                                                alt={update.title}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                                aria-label={update.title}
                                            />
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FaBullhorn className="text-accent" aria-label={t('newsCard.announcementAria')} />
                                            <Typography variant="caption" className="text-gray-500">
                                                {new Date(update.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Typography>
                                        </div>
                                        <Typography variant="h3" className="mb-3">
                                            {update.title}
                                        </Typography>
                                        <Typography variant="body" className="mb-4 text-gray-600">
                                            {update.excerpt}
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
                                            aria-label={t('newsCard.readMore')}
                                        >
                                            {t('newsCard.readMore')}
                                            <FaArrowRight className="text-sm" aria-hidden="true"/>
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
                            {newsToShow < allUpdates.length && (
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="group border-2 border-primary text-primary hover:bg-accent hover:text-white hover:border-accent px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto mb-4"
                                    onClick={() => setNewsToShow((prev) => Math.min(prev + 2, allUpdates.length))}
                                    aria-label={t('news.loadMore')}
                                >
                                    {t('news.loadMore')}
                                </motion.button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                className="group bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                                onClick={() => navigate('/news')}
                                aria-label={t('news.ctaButton')}
                            >
                                {t('news.ctaButton')}
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true"/>
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
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.96 }}
                                    className="group bg-primary hover:bg-dark-orange text-white hover:text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                                    onClick={() => navigate('/contact')}
                                    aria-label={t('contact.ctaButton')}
                                >
                                    {t('contact.ctaButton')}
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true"/>
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