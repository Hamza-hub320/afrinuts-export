import React, { useState, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    FaLeaf, FaSeedling, FaIndustry, FaWeightHanging,
    FaStar, FaTrophy, FaChartLine, FaShieldAlt, FaShippingFast, FaArrowDown, FaDownload
} from 'react-icons/fa';
import {fadeIn, slideInFromLeft, slideInFromRight, staggerContainer} from '@/utils/animations';
import Section from '../components/Section/Section';
import { Typography } from "@/components/Typography/Typography";
import { ProductCard } from '@/components/ProductCard/ProductCard';

// Import images
import cashewButterDarkImage from '../assets/images/cashew-butter-dark.webp';
import cashewKernelsImage from '../assets/images/cashew-kernels.webp';
import cashewMilkImage from '../assets/images/cashew-milk.webp';
import cashewShellImage from '../assets/images/cashew-nut-shell-liquid.webp';
import roastedCashewImage from '../assets/images/roasted-cashew.webp';
import ourProductHeroImage from '../assets/images/our-product-hero.webp';
import processImage from '../assets/images/production-process.webp';
import qualityImage from '../assets/images/quality-control.webp';
import packagingImage from '../assets/images/packaging.webp';
import rawCashewImage from '../assets/images/raw-cashew.webp';
import { AvailabilityFilter } from '@/types/filters';

type AvailabilityFilter = 'all' | 'available' | 'coming-soon';
type CertificationFilter = 'organic' | 'halal' | 'fairtrade' | '';

interface Filters {
    availability: AvailabilityFilter;
    searchQuery: string;
    certifications: CertificationFilter[];
}

const productImageMap: Record<string, string> = {
    'cashew-butter.jpg': cashewButterDarkImage,
    'cashew-kernels.jpg': cashewKernelsImage,
    'cashew-milk.jpg': cashewMilkImage,
    'cashew-nut-shell-liquid.jpg': cashewShellImage,
    'roasted-cashew.jpg': roastedCashewImage,
    'raw-cashew.jpg': rawCashewImage,
};

const iconMap = {
    FaSeedling: FaSeedling,
    FaWeightHanging: FaWeightHanging,
    FaIndustry: FaIndustry,
    FaLeaf: FaLeaf,
} as const;

interface Product {
    name: string;
    description: string;
    icon: keyof typeof iconMap;
    backgroundImage: string;
    features: string[];
    available: boolean;
    comingSoon?: string;
    certifications?: string[];
    variants?: { name: string; priceRange: string }[];
}

const Products: React.FC = () => {
    const {t} = useTranslation(['products', 'common']);
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [filters, setFilters] = useState<{
        availability: 'all' | 'available' | 'coming-soon';
        category: 'all' | 'raw' | 'processed' | 'byproducts';
        searchQuery: string;
        certifications: string[];
    }>({
        availability: 'all',
        category: 'all',
        searchQuery: '',
        certifications: []
    });

    const products = t('items', {returnObjects: true}) as Product[];

    const handleContactClick = () => {
        navigate('/contact');
    };

    const handleAvailabilityChange = (value: string) => {
        if (value === 'all' || value === 'available' || value === 'coming-soon') {
            setFilters({...filters, availability: value});
        }
    };

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];

        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

            const matchesAvailability = filters.availability === 'all' ||
                (filters.availability === 'available' && product.available) ||
                (filters.availability === 'coming-soon' && !product.available);

            const matchesCertifications = filters.certifications.length === 0 ||
                (product.certifications &&
                    filters.certifications.some(cert => product.certifications?.includes(cert)));

            return matchesSearch && matchesAvailability && matchesCertifications;
        });
    }, [products, filters]);

    const resetFilters = () => {
        setFilters({
            availability: 'all',
            category: 'all',
            searchQuery: '',
            certifications: []
        });
    };

    // Download Product Catalogue as PDF
    const handleDownloadCatalogue = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('AfriNuts Export Product Catalogue', 14, 20);
        doc.setFontSize(12);
        let y = 32;
        const lineSpacing = 8;
        filteredProducts.forEach((product, idx) => {
            if (y > 270) { // create new page if at the bottom
                doc.addPage();
                y = 20;
            }
            doc.setFont('helvetica', 'bold');
            doc.text(`${idx + 1}. ${product.name}`, 14, y);
            y += lineSpacing;
            doc.setFont('helvetica', 'normal');
            doc.text(`Description: ${product.description}`, 18, y);
            y += lineSpacing;
            doc.text(`Availability: ${product.available ? 'Available' : product.comingSoon ? `Coming Soon (${product.comingSoon})` : 'Coming Soon'}`, 18, y);
            y += lineSpacing;
            if (product.certifications && product.certifications.length > 0) {
                doc.text(`Certifications: ${product.certifications.join(', ')}`, 18, y);
                y += lineSpacing;
            }
            y += 4; // Extra space between products
        });
        doc.save('afrinuts-product-catalogue.pdf');
    };

    return (
        <main>
            {/* Hero Section */}
            <div className=" text-text-dark font-sans leading-relaxed">
                <div className=" text-text-dark font-sans leading-relaxed">
                    <Section
                        fullHeight={false}
                        bgImage={ourProductHeroImage}
                        className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[50vh] pb-24 pr-16 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 mt-32 pt-24 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
                    >
                        <motion.div
                            className="max-w-2xl px-8 sm:px-12 py-10 bg-white/75 backdrop-blur-xs rounded-xl border-2 border-primary/20 hover:border-accent/30 transition-all duration-300"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >  <motion.h1
                            className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-4 leading-tight"
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
                        </motion.div>
                    </Section>
                </div>


                {/* Product Categories Filter */}
                <Section className="py-8 shadow-sm top-0 z-10">
                    {/* Filter Section */}
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <motion.div
                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-2xl shadow-xl p-6 mb-8 top-0 z-10 transform-gpu"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            whileHover={{
                                y: -2,
                                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
                                transition: { duration: 0.3 }
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* 3D edge effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-8px] transition-all duration-500" />

                            {/* Glassy overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                            {/* Inner shadow effect */}
                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                                {/* Search Input */}
                                <div className="flex-1">
                                    <label htmlFor="search" className="block mb-2 font-medium text-text-dark">
                                        {t('filters.searchLabel')}
                                    </label>
                                    <div className="relative">
                                        <motion.input
                                            id="search"
                                            type="text"
                                            placeholder={t('filters.searchPlaceholder')}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300 shadow-md"
                                            value={filters.searchQuery}
                                            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                                            whileFocus={{
                                                scale: 1.02,
                                                boxShadow: '0 0 0 3px rgba(165, 105, 66, 0.1)',
                                                borderColor: 'rgba(165, 105, 66, 0.3)'
                                            }}
                                        />
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/60">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Chips */}
                                <div className="flex flex-wrap gap-4 items-end">
                                    {/* Availability Filter */}
                                    <div className="relative">
                                        <label htmlFor="availability" className="block mb-2 font-medium text-text-dark">
                                            {t('filters.availability.label')}
                                        </label>
                                        <div className="relative">
                                            <motion.select
                                                id="availability"
                                                className="w-full appearance-none bg-white/80 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300 shadow-md cursor-pointer"
                                                value={filters.availability}
                                                onChange={(e) => handleAvailabilityChange(e.target.value)}
                                                whileFocus={{
                                                    scale: 1.02,
                                                    boxShadow: '0 0 0 3px rgba(165, 105, 66, 0.1)',
                                                    borderColor: 'rgba(165, 105, 66, 0.3)'
                                                }}
                                            >
                                                <option value="all">{t('filters.availability.all')}</option>
                                                <option value="available">{t('filters.availability.available')}</option>
                                                <option value="coming-soon">{t('filters.availability.coming-soon')}</option>
                                            </motion.select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-primary/60">
                                                <svg
                                                    className="h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certification Filter */}
                                    <div className="relative">
                                        <label htmlFor="certification" className="block mb-2 font-medium text-text-dark">
                                            {t('filters.certifications.label')}
                                        </label>
                                        <div className="relative">
                                            <motion.select
                                                id="certification"
                                                className="w-full appearance-none bg-white/80 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-300 shadow-md cursor-pointer"
                                                value={filters.certifications[0] || ''}
                                                onChange={(e) => setFilters({
                                                    ...filters,
                                                    certifications: e.target.value ? [e.target.value] : []
                                                })}
                                                whileFocus={{
                                                    scale: 1.02,
                                                    boxShadow: '0 0 0 3px rgba(165, 105, 66, 0.1)',
                                                    borderColor: 'rgba(165, 105, 66, 0.3)'
                                                }}
                                            >
                                                <option value="">{t('filters.certifications.all')}</option>
                                                <option value="organic">{t('certifications.organic.title')}</option>
                                                <option value="halal">{t('certifications.halal.title')}</option>
                                                <option value="fairtrade">{t('certifications.fairtrade.title')}</option>
                                            </motion.select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-primary/60">
                                                <svg
                                                    className="h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reset Button */}
                                    {(filters.availability !== 'all' || filters.searchQuery || filters.certifications.length > 0) && (
                                        <motion.button
                                            onClick={resetFilters}
                                            className="px-5 py-3 bg-white/80 backdrop-blur-sm border-2 border-white/30 text-text-dark rounded-2xl hover:bg-white transition-all duration-300 shadow-md transform-gpu hover:scale-105"
                                            whileHover={{
                                                y: -2,
                                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {t('filters.reset')}
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Product Count */}
                        <motion.div
                            className="mb-6 text-text-dark bg-white/80 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-5 py-3 inline-block shadow-md"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {t('filters.results', { count: filteredProducts.length }).replace('{count}', String(filteredProducts.length))}
                        </motion.div>
                    </div>

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.name}
                                        whileHover={{
                                            y: -6,
                                            scale: 1.025,
                                            rotateY: 2,
                                            boxShadow: '0 16px 32px -8px rgba(255, 140, 0, 0.10)',
                                            transition: { duration: 0.25 }
                                        }}
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            perspective: '1000px',
                                        }}
                                    >
                                      <ProductCard
                                        product={product}
                                        handleContactClick={handleContactClick}
                                        productImageMap={productImageMap}
                                        iconMap={iconMap}
                                        variants={fadeIn}
                                        compact={false}
                                      />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                className="text-center py-12"
                                whileHover={{
                                    scale: 1.025,
                                    boxShadow: '0 8px 24px -6px rgba(255, 140, 0, 0.10)',
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <h3 className="text-xl font-medium text-gray-700 mb-2">
                                    {t('products.noResults')}
                                </h3>
                                <p className="text-gray-500">
                                    {t('products.tryDifferentFilters')}
                                </p>
                                <motion.button
                                    onClick={resetFilters}
                                    className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-dark-orange transition-colors"
                                    whileHover={{
                                        scale: 1.10,
                                        transition: { duration: 0.16 }
                                    }}
                                >
                                    {t('filters.resetAll')}
                                </motion.button>
                            </motion.div>
                        )}

                </Section>
                {/* Unified Offline Payment & Catalogue Section */}
                <Section className="mb-12 py-12">
                    <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12">
                        {/* Offline Payment motion div */}
                        <motion.div
                            className="relative bg-gradient-to-br from-yellow-50/80 to-amber-50/80 border-2 border-yellow-400/30 rounded-2xl shadow-xl p-6 lg:p-8 flex-1 transform-gpu group min-h-[300px] flex flex-col justify-center"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            whileHover={{
                                y: -6,
                                scale: 1.02,
                                rotateY: 2,
                                boxShadow: '0 20px 35px -10px rgba(180, 83, 9, 0.15)',
                                transition: { duration: 0.3 }
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* 3D edge effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-yellow-300/40 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                            {/* Glassy overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

                            {/* Inner shadow effect */}
                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(180,83,9,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(180,83,9,0.12)] transition-shadow duration-500" />

                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTgwLCA4MywgOSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-30" />

                            {/* Outer glow */}
                            <div className="absolute -inset-2 rounded-2xl bg-yellow-400/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10 flex flex-col justify-center h-full">
                                <Typography variant="h3" className="text-yellow-700 mb-3 text-center font-bold">
                                    {t('offlinePayment.title')}
                                </Typography>
                                <Typography variant="body" className="text-yellow-800 mb-6 text-center">
                                    {t('offlinePayment.description')}
                                </Typography>

                                <motion.button
                                    onClick={handleContactClick}
                                    className="text-white bg-yellow-700  px-4 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto text-base font-semibold min-w-[140px] transform-gpu hover:scale-105"
                                    style={{ minHeight: 42 }}
                                    whileHover={{
                                        scale: 1.10,
                                        transition: { duration: 0.18, type: "spring", stiffness: 320 }
                                    }}
                                >
                                    {t('offlinePayment.button')}
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Catalogue Description and Download Button motion div */}
                        <motion.div
                            className="relative flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-6 lg:p-10 rounded-3xl shadow-2xl border-2 border-primary/20 flex-1 transform-gpu transition-all duration-500 min-h-[300px]"
                            style={{
                                perspective: 1200,
                                willChange: 'transform',
                                transformStyle: 'preserve-3d',
                            }}
                            whileHover={{
                                scale: 1.03,
                                rotateX: 5,
                                rotateY: -5,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                transition: { duration: 0.35, type: "spring", stiffness: 200 },
                            }}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {/* 3D edge effect */}
                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-8px] group-hover:translate-z-[-12px] transition-all duration-500" />

                            {/* Glassy overlay */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                            {/* Inner shadow effect */}
                            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                            <div className="relative z-10 flex flex-col justify-center h-full">
                                <Typography variant="h3" className="text-primary mb-4 text-center">
                                    {t('catalogue.title')}
                                </Typography>
                                <Typography variant="body" className="text-text-dark mb-8 text-center">
                                    {t('catalogue.description')}
                                </Typography>
                                <motion.button
                                    onClick={handleDownloadCatalogue}
                                    className="group bg-primary hover:bg-orange-700 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto text-base font-semibold transform-gpu hover:scale-105"
                                    whileHover={{
                                        scale: 1.08,
                                        transition: { duration: 0.18, type: "spring", stiffness: 320 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaDownload className="mr-2 text-xl" />
                                    {t('catalogue.download')}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </Section>

                {/* Our Process Section */}
                <Section className="py-10">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 transform-gpu">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={fadeIn}
                        >
                            <Typography variant="h2" className="text-center text-primary mb-4">
                                {t('process.title')}
                            </Typography>
                            <Typography variant="subtitle" className="text-center max-w-2xl mx-auto mb-12">
                                {t('process.subtitle')}
                            </Typography>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {(t('process.steps', {returnObjects: true}) as Array<{
                                title: string;
                                description: string;
                            }>).map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-lg overflow-hidden transform-gpu group"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                    variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{once: true}}
                                    whileHover={{
                                        y: -8,
                                        scale: 1.03,
                                        rotateY: 3,
                                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                    {/* Inner shadow effect */}
                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                    {/* Subtle background pattern */}
                                    <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                    <div className="h-48 bg-gray-100 overflow-hidden relative z-10 rounded-t-2xl">
                                        <motion.img
                                            src={index === 0 ? processImage : index === 1 ? qualityImage : packagingImage}
                                            alt={step.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        {/* Image overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                    </div>
                                    <div className="p-6 relative z-10">
                                        <div className="flex items-center mb-4">
                                            <motion.div
                                                className="bg-white/40 backdrop-blur-md p-3 rounded-full mr-4 shadow-md transform-gpu group-hover:scale-110 transition-transform duration-500"
                                                whileHover={{ scale: 1.15, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                {index === 0 ? <FaSeedling className="text-accent text-xl"/> :
                                                    index === 1 ? <FaShieldAlt className="text-accent text-xl"/> :
                                                        <FaShippingFast className="text-accent text-xl"/>}
                                            </motion.div>
                                            <Typography variant="h4" className="mb-0">
                                                {step.title}
                                            </Typography>
                                        </div>
                                        <Typography variant="body" className="text-text-dark">
                                            {step.description}
                                        </Typography>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Quality Assurance */}
                <Section className="py-10">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <motion.div
                                className="flex-1 relative transform-gpu group"
                                variants={slideInFromLeft}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true}}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                }}
                            >
                                <motion.div
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg overflow-hidden transform-gpu"
                                    whileHover={{
                                        y: -8,
                                        scale: 1.03,
                                        rotateY: 3,
                                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                    {/* Inner shadow effect */}
                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                    <img
                                        src={qualityImage}
                                        alt={t('quality.title')}
                                        className="rounded-2xl w-full transition-transform duration-500 transform-gpu group-hover:scale-105 relative z-10"
                                        loading="lazy"
                                    />
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="flex-1 relative transform-gpu"
                                variants={slideInFromRight}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true}}
                            >
                                <motion.div
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-8 transform-gpu group"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                    whileHover={{
                                        y: -8,
                                        scale: 1.02,
                                        rotateY: 2,
                                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                    {/* Inner shadow effect */}
                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                    {/* Subtle background pattern */}
                                    <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                    <div className="relative z-10">
                                        <Typography variant="h2" className="text-primary mb-6">
                                            {t('quality.title')}
                                        </Typography>
                                        <Typography variant="body" className="mb-8">
                                            {t('quality.description')}
                                        </Typography>
                                        <div className="space-y-4">
                                            {(t('quality.bullets', {returnObjects: true}) as string[]).map((bullet, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="flex items-start gap-4 bg-white/30 backdrop-blur-sm rounded-lg p-3"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    viewport={{ once: true }}
                                                    whileHover={{
                                                        scale: 1.04,
                                                        backgroundColor: 'rgba(255, 200, 100, 0.18)',
                                                        transition: { duration: 0.18 }
                                                    }}
                                                >
                                                    <div className="text-accent mt-1 bg-accent/20 p-1 rounded-full">
                                                        {index === 0 ? <FaStar className="text-lg"/> :
                                                            index === 1 ? <FaTrophy className="text-lg"/> :
                                                                <FaChartLine className="text-lg"/>}
                                                    </div>
                                                    <Typography variant="body" className="text-text-dark">
                                                        {bullet}
                                                    </Typography>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </Section>

                {/* Certifications */}
                <Section className="py-10">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={fadeIn}
                        >
                            <Typography variant="h2" className="text-center text-primary mb-4">
                                {t('certifications.title')}
                            </Typography>
                            <Typography variant="subtitle" className="text-center max-w-2xl mx-auto mb-12">
                                {t('certifications.subtitle')}
                            </Typography>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={staggerContainer}
                        >
                            {['organic', 'fairtrade', 'iso', 'halal', 'rainforest'].map((cert) => (
                                <motion.div
                                    key={cert}
                                    variants={fadeIn}
                                    className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 p-6 rounded-2xl shadow-lg flex flex-col items-center transform-gpu"
                                    whileHover={{
                                        y: -10,
                                        scale: 1.05,
                                        rotateY: 5,
                                        transition: { duration: 0.3 }
                                    }}
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/30 transform-gpu translate-z-[-8px] group-hover:translate-z-[-12px] transition-all duration-500" />

                                    {/* Certificate background pattern */}
                                    <div className="absolute inset-2 rounded-xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMTY1LCAxMDUsIDY2LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')] opacity-30" />

                                    {/* Glossy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                                    {/* Inner shadow effect */}
                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] group-hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] transition-shadow duration-500" />

                                    <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/40 rounded-full flex items-center justify-center mb-4 transform-gpu group-hover:scale-110 transition-transform duration-500 shadow-md">
                                        <FaShieldAlt className="text-accent text-2xl transform-gpu group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <Typography variant="h4" className="text-center relative z-10 font-semibold text-text-dark">
                                        {t(`certifications.${cert}.title`)}
                                    </Typography>

                                    {/* Subtle certification badge */}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center transform-gpu group-hover:scale-125 transition-transform duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* CTA Section */}
                <Section className="py-10 text-text-dark">
                    <motion.div
                        className="container mx-auto px-6 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="text-text-dark mb-4">
                            {t('cta.title')}
                        </Typography>
                        <Typography variant="subtitle" className="text-text-dark/90 mb-8 max-w-2xl mx-auto">
                            {t('cta.subtitle')}
                        </Typography>
                        <div className="flex justify-center">
                            <button
                                className="bg-primary hover:bg-orange-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg sm:text-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                onClick={() => navigate('/contact')}
                            >
                                {t('cta.contact')}
                            </button>
                        </div>
                    </motion.div>
                </Section>
            </div>
        </main>
    );
}
export default Products;