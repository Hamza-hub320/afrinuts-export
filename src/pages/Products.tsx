import React, {useRef, useState, useEffect, useMemo} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    FaLeaf, FaSeedling, FaIndustry, FaWeightHanging,
    FaStar, FaTrophy, FaChartLine, FaShieldAlt, FaShippingFast, FaArrowRight
} from 'react-icons/fa';
import { fadeIn, slideInFromLeft, slideInFromRight, staggerContainer } from '@/utils/animations';
import Section from '../components/Section/Section';
import { Typography } from "@/components/Typography/Typography";
import {ProductCard} from '@/components/ProductCard/ProductCard';

// Import images
import cashewButterImage from '@/assets/images/cashew-butter.jpg';
import cashewKernelsImage from '@/assets/images/cashew-kernels.jpg';
import cashewMilkImage from '@/assets/images/cashew-milk.jpg';
import cashewShellImage from '@/assets/images/cashew-nut-shell-liquid.jpg';
import roastedCashewImage from '@/assets/images/roasted-cashew.jpg';
import rawCashewImage from '@/assets/images/raw-cashew.jpg';
import ourProductHeroImage from '@/assets/images/our-product-hero.jpg';
import processImage from '@/assets/images/production-process.jpg';
import qualityImage from '@/assets/images/quality-control.jpg';
import packagingImage from '@/assets/images/packaging.jpg';

const productImageMap: Record<string, string> = {
    'cashew-butter.jpg': cashewButterImage,
    'cashew-kernels.jpg': cashewKernelsImage,
    'cashew-milk.jpg': cashewMilkImage,
    'cashew-nut-shell-liquid.jpg': cashewShellImage,
    'roasted-cashew.jpg': roastedCashewImage,
    'raw-cashew.jpg': rawCashewImage,
};

interface ProductVariant {
    name: string;
    priceRange: string;
}

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
    height?: string;
}

const iconMap = {
    FaSeedling: FaSeedling,
    FaWeightHanging: FaWeightHanging,
    FaIndustry: FaIndustry,
    FaLeaf: FaLeaf,
} as const;

const Products: React.FC = () => {
    const { t } = useTranslation('products');
    const navigate = useNavigate();
    const products = t('items', { returnObjects: true }) as Product[];
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'coming-soon'>('all');

    // Properly typed filter function
    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];

        const clonedProducts = [...products]; // avoid stale reference

        switch (activeFilter) {
            case 'available':
                return clonedProducts.filter((product: Product) => product.available === true);
            case 'coming-soon':
                return clonedProducts.filter((product: Product) => product.available === false);
            case 'all':
            default:
                return clonedProducts;
        }
    }, [products, activeFilter]);

    const handleContactClick = () => {
        navigate('/contact');
    };


    return (
        <main className="bg-background">
            {/* Hero Section (kept as requested) */}
            <Section
                fullHeight={false}
                bgImage={ourProductHeroImage}
                overlay
                overlayColor="bg-primary/"
                className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[60vh] pb-12 px-6"
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

            {/* Product Categories Filter */}
            <Section className="py-16 bg-white shadow-sm">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="flex flex-wrap justify-center gap-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {['all', 'available', 'coming-soon'].map((filter) => (
                            <motion.button
                                key={filter}
                                variants={fadeIn}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                    activeFilter === filter
                                        ? 'bg-accent text-white shadow-md'
                                        : 'bg-gray-100 text-primary hover:bg-gray-200'
                                }`}
                                onClick={() => {
                                    setActiveFilter(filter as 'all' | 'available' | 'coming-soon');
                                }}
                            >
                                {t(`filters.${filter}`)}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* Featured Products Grid */}
            <Section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {filteredProducts.slice(0, 3).map((product: Product, index: number) => (
                            <ProductCard
                                key={`featured-${index}`}
                                product={{
                                    ...product,
                                    height: 'h-48',
                                    features: product.features || [
                                        `Premium quality ${product.name.toLowerCase()}`,
                                        product.available ? 'Available now' : 'Coming soon',
                                        ...(product.certifications || []),
                                    ],
                                }}
                                productImageMap={productImageMap}
                                iconMap={iconMap}
                                handleContactClick={handleContactClick}
                                variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                                compact={false}
                                loading="lazy"
                            />
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* Full Product Showcase */}
            <Section className="py-16 from-background">
                <div className="container mx-auto px-6">
                    <div className="relative">
                        <motion.div
                            ref={scrollRef}
                            className="grid md:grid-cols-3 gap-8"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                        >
                            {filteredProducts.map((product: Product, index: number) => (
                                <ProductCard
                                    key={`full-${index}`}
                                    product={{
                                        ...product,
                                        height: 'h-48',
                                        features: product.features || [
                                            `Premium quality ${product.name.toLowerCase()}`,
                                            product.available ? 'Available now' : 'Coming soon',
                                            ...(product.certifications || []),
                                            ...(product.variants?.map((v: ProductVariant) => v.name) || [])
                                        ],
                                    }}
                                    productImageMap={productImageMap}
                                    iconMap={iconMap}
                                    handleContactClick={handleContactClick}
                                    variants={fadeIn}
                                    compact={false}
                                    loading="lazy"
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* Our Process Section */}
            <Section className="py-16 bg-gradient-to-br from-background to-primary/10">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
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
                        {[
                            {
                                title: t('process.steps.0.title'),
                                description: t('process.steps.0.description'),
                                icon: FaSeedling,
                                image: processImage
                            },
                            {
                                title: t('process.steps.1.title'),
                                description: t('process.steps.1.description'),
                                icon: FaShieldAlt,
                                image: qualityImage
                            },
                            {
                                title: t('process.steps.2.title'),
                                description: t('process.steps.2.description'),
                                icon: FaShippingFast,
                                image: packagingImage
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                variants={index % 2 === 0 ? slideInFromLeft : slideInFromRight}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                <div className="h-48 bg-gray-100 overflow-hidden">
                                    <img
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-accent/10 p-3 rounded-full mr-4">
                                            <step.icon className="text-accent text-xl" />
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
                            viewport={{ once: true }}
                        >
                            <img
                                src={qualityImage}
                                alt="Quality Control"
                                className="rounded-2xl shadow-xl w-full"
                                loading="lazy"
                            />
                        </motion.div>
                        <motion.div
                            className="flex-1"
                            variants={slideInFromRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Typography variant="h2" className="text-primary mb-6">
                                {t('quality.title')}
                            </Typography>
                            <Typography variant="body" className="mb-8">
                                {t('quality.description')}
                            </Typography>
                            <div className="space-y-4">
                                {[
                                    { icon: FaStar, text: t('quality.bullets.0') },
                                    { icon: FaTrophy, text: t('quality.bullets.1') },
                                    { icon: FaChartLine, text: t('quality.bullets.2') }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="text-accent mt-1">
                                            <item.icon />
                                        </div>
                                        <Typography variant="body" className="text-text-dark">
                                            {item.text}
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
                        viewport={{ once: true }}
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
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {['organic', 'fairtrade', 'iso', 'halal'].map((cert, index) => (
                            <motion.div
                                key={cert}
                                variants={fadeIn}
                                className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center"
                            >
                                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                                    <FaShieldAlt className="text-accent text-2xl" />
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
            <Section className="py-16 bg-primary text-white">
                <motion.div
                    className="container mx-auto px-6 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <Typography variant="h2" className="text-white mb-4">
                        {t('cta.title')}
                    </Typography>
                    <Typography variant="subtitle" className="text-white/90 mb-8 max-w-2xl mx-auto">
                        {t('cta.subtitle')}
                    </Typography>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            className="border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300 font-medium"
                            onClick={() => navigate('/contact')}
                        >
                            {t('cta.contact')}
                        </button>
                        <button
                            className="bg-white text-primary px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 font-medium"
                            onClick={() => navigate('/products#full-range')}
                        >
                            {t('cta.viewAll')}
                        </button>
                    </div>
                </motion.div>
            </Section>
        </main>
    );
};

export default Products;