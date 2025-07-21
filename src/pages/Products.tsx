import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    FaLeaf, FaSeedling, FaIndustry, FaWeightHanging,
    FaStar, FaTrophy, FaChartLine, FaShieldAlt, FaShippingFast
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
import { ProductFilters, AvailabilityFilter } from '@/types/filters';

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

    return (
            <main className="bg-background">
                {/* Hero Section */}
                <Section
                    fullHeight={false}
                    bgImage={ourProductHeroImage}
                    overlay
                    overlayColor="bg-primary/"
                    className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[80vh] pb-12 px-6"
                >
                    <motion.div
                        className="max-w-2xl px-6 py-10 bg-white/75 backdrop-blur-xs rounded-xl"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.h1
                            className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-4 leading-tight"
                            variants={fadeIn}
                            style={{letterSpacing: '-0.03em'}}
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

                {/* Product Categories Filter */}
                <Section className="py-8 bg-white shadow-sm top-0 z-10">
                    {/* Filter Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8 top-0 z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Search Input */}
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('filters.searchPlaceholder')}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        value={filters.searchQuery}
                                        onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                                    />
                                    <div className="absolute left-3 top-3.5 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Filter Chips */}
                            <div className="flex flex-wrap gap-3 items-center">
                                {/* Availability Filter */}
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        value={filters.availability}
                                        onChange={(e) => handleAvailabilityChange(e.target.value)}
                                    >
                                        <option value="all">{t('filters.availability.all')}</option>
                                        <option value="available">{t('filters.availability.available')}</option>
                                        <option value="coming-soon">{t('filters.availability.coming-soon')}</option>
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Certification Filter */}
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        value={filters.certifications[0] || ''}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            certifications: e.target.value ? [e.target.value] : []
                                        })}
                                    >
                                        <option value="">{t('filters.certifications.all')}</option>
                                        <option value="organic">{t('certifications.organic.title')}</option>
                                        <option value="halal">{t('certifications.halal.title')}</option>
                                        <option value="fairtrade">{t('certifications.fairtrade.title')}</option>
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                {(filters.availability !== 'all' ||
                                    filters.searchQuery ||
                                    filters.certifications.length > 0) && (
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        {t('filters.reset')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Count */}
                    <div className="mb-6 text-text-dark">
                        {t('filters.results', { count: filteredProducts.length }).replace('{count}', String(filteredProducts.length))}
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.name}
                                    product={product}
                                    handleContactClick={handleContactClick}
                                    productImageMap={productImageMap}
                                    iconMap={iconMap}
                                    variants={fadeIn}
                                    compact={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                {t('products.noResults')}
                            </h3>
                            <p className="text-gray-500">
                                {t('products.tryDifferentFilters')}
                            </p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                {t('filters.resetAll')}
                            </button>
                        </div>
                    )}
                </Section>


                {/* Our Process Section */}
                <Section className="py-16 bg-gradient-to-br from-background to-primary/10">
                    <div className="container mx-auto px-6">
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
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                    variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{once: true}}
                                >
                                    <div className="h-48 bg-gray-100 overflow-hidden">
                                        <img
                                            src={index === 0 ? processImage : index === 1 ? qualityImage : packagingImage}
                                            alt={step.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-accent/10 p-3 rounded-full mr-4">
                                                {index === 0 ? <FaSeedling className="text-accent text-xl"/> :
                                                    index === 1 ? <FaShieldAlt className="text-accent text-xl"/> :
                                                        <FaShippingFast className="text-accent text-xl"/>}
                                            </div>
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
                <Section className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <motion.div
                                className="flex-1"
                                variants={slideInFromLeft}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true}}
                            >
                                <img
                                    src={qualityImage}
                                    alt={t('quality.title')}
                                    className="rounded-2xl shadow-xl w-full"
                                    loading="lazy"
                                />
                            </motion.div>
                            <motion.div
                                className="flex-1"
                                variants={slideInFromRight}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true}}
                            >
                                <Typography variant="h2" className="text-primary mb-6">
                                    {t('quality.title')}
                                </Typography>
                                <Typography variant="body" className="mb-8">
                                    {t('quality.description')}
                                </Typography>
                                <div className="space-y-4">
                                    {(t('quality.bullets', {returnObjects: true}) as string[]).map((bullet, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="text-accent mt-1">
                                                {index === 0 ? <FaStar/> :
                                                    index === 1 ? <FaTrophy/> :
                                                        <FaChartLine/>}
                                            </div>
                                            <Typography variant="body" className="text-text-dark">
                                                {bullet}
                                            </Typography>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Section>

                {/* Certifications */}
                <Section className="py-16 bg-background">
                    <div className="container mx-auto px-6">
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
                            className="grid grid-cols-2 md:grid-cols-4 gap-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={staggerContainer}
                        >
                            {['organic', 'fairtrade', 'iso', 'halal'].map((cert) => (
                                <motion.div
                                    key={cert}
                                    variants={fadeIn}
                                    className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center"
                                >
                                    <div
                                        className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                                        <FaShieldAlt className="text-accent text-2xl"/>
                                    </div>
                                    <Typography variant="h4" className="text-center">
                                        {t(`certifications.${cert}.title`)}
                                    </Typography>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </Section>

                {/* CTA Section */}
                <Section className="py-16  bg-background text-text-dark">
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
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg sm:text-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                onClick={() => navigate('/contact')}
                            >
                                {t('cta.contact')}
                            </button>
                        </div>
                    </motion.div>
                </Section>
            </main>
    )
}
export default Products;