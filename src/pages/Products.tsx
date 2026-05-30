import React, { useState, useMemo, useRef } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { trackCtaClick, trackProductInquiry } from '@/utils/analytics';
import {
    FaLeaf,
    FaSeedling,
    FaIndustry,
    FaWeightHanging,
    FaStar,
    FaTrophy,
    FaChartLine,
    FaShieldAlt,
    FaShippingFast,
    FaDownload,
    FaCertificate,
    FaAward,
    FaRibbon, FaArrowRight, FaBookOpen, FaBox, FaTruck, FaFileContract, FaSearch, FaCheckCircle
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
import processImage from '../assets/images/production-process.webp';
import qualityImage from '../assets/images/quality-control.webp';
import qualityAssuranceImage from '../assets/images/quality-assurance.webp';
import packagingImage from '../assets/images/packaging.webp';
import rawCashewImage from '../assets/images/raw-cashew.webp';
import productCataloguePdf from '../assets/documents/afrinuts-products-catalogue.pdf';
import { AvailabilityFilter } from '@/types/filters';
import JsonLd from "@/components/Seo/JsonLd";
import {CertificationsCard} from "@/components/CertificationsCard/CertificationsCard";
import ProductTimeline from "@/components/ProductTimeline/ProductTimeline";
import {Helmet} from "react-helmet-async";
import {InfoCard} from "@/components/InfoCard/InfoCard";

type AvailabilityFilter = 'all' | 'available' | 'coming-soon';
type CertificationFilter = 'Organic' | 'Halal' | 'Fair Trade' | 'ISO 22000' | '';

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
    'roasted-cashew.jpg': qualityImage,
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
    conventionalVariants?: { name: string; priceRange: string }[];
    productionType?: 'organic' | 'conventional' | 'both';
}

const Products: React.FC = () => {
    const {t} = useTranslation(['products', 'common']);
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [productionType, setProductionType] = useState<'all' | 'organic' | 'conventional'>('organic');

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
                    filters.certifications.some(cert =>
                        product.certifications?.some(productCert =>
                            productCert.toLowerCase() === cert.toLowerCase()
                        )
                    ));

            // Production type filter
            const matchesProductionType = productionType === 'all' ||
                (productionType === 'organic' && (product.productionType === 'organic' || product.productionType === 'both')) ||
                (productionType === 'conventional' && (product.productionType === 'conventional' || product.productionType === 'both'));

            return matchesSearch && matchesAvailability && matchesCertifications && matchesProductionType;
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
        <main>
            <Helmet>
                <title>Premium Cashew Products | Organic & Conventional | AfriNuts Export</title>
                <meta name="description" content="Explore AfriNuts Export's premium cashew products — raw nuts, kernels, butter, roasted cashews, and CNSL. Organic and conventional options available for wholesale buyers." />
                <link rel="canonical" href="https://www.afrinutsexport.com/products" />
                <meta property="og:title" content="Premium Cashew Products | AfriNuts Export" />
                <meta property="og:description" content="Raw nuts, kernels, butter, roasted cashews, and CNSL — organic and conventional options from our farm in Odienné, Côte d'Ivoire." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Our Premium Cashew Products - AfriNuts Export",
                "description": "Ethically sourced premium cashew products from Odienné, Ivory Coast. Raw nuts, kernels, butter, and value-added goods for B2B clients.",
                "about": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "makesOffer": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Raw Cashew Nuts",
                                "description": "Sun-dried, hand-sorted Grade A cashews with 95% whole nuts"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Cashew Kernels",
                                "description": "W320, W240, W180 grade kernels, HACCP-certified processing"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Cashew Butter",
                                "description": "100% pure single-origin cashew butter, organic and halal certified"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Roasted Cashews",
                                "description": "Premium dry-roasted cashews in natural, salted, and spiced varieties"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Cashew Milk",
                                "description": "Creamy plant-based milk alternative, fortified with calcium and vitamin D"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "Cashew Nut Shell Liquid (CNSL)",
                                "description": "Industrial-grade byproduct for paints, varnishes, and brake linings"
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": "Raw Cashew Nuts",
                            "description": "Grade A raw cashews from Ivory Coast",
                            "offers": {
                                "@type": "Offer",
                                "price": "1200",
                                "priceCurrency": "USD",
                                "availability": "https://schema.org/InStock"
                            }
                        }
                    ]
                }
            }} />
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[90vh]">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                    {/* Left: Text Content */}
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaBox className="inline mr-2 text-accent" />{t('hero.subtitle', 'Premium Cashew Products')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                            {t('hero.title')}
                        </motion.h1>

                        {/* Lead Text */}
                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                            {t('hero.lead', 'Single-origin from our 35-hectare farm in Odienné, Côte d\'Ivoire. Organic and conventional options. Block-level traceability. Export-ready documentation.')}
                        </Typography>

                        {/* Products Intro Card */}
                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaLeaf}
                                title={t('hero.introTitle', 'Not Just Products. Verified Products.')}
                                variant="accent"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('hero.introBody', 'Every product in our catalogue is backed by Farm OS data — block-level tracking, harvest dates, quality metrics, and certification verification. Filter by organic or conventional, check availability, and request pricing with full traceability documentation.')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    <FaCheckCircle className="text-[10px]" /> {t('hero.badgeOrganic', 'Organic & Conventional')}
                </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                    <FaSearch className="text-[10px]" /> {t('hero.badgeTraceable', 'Farm OS Traceable')}
                </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                    <FaFileContract className="text-[10px]" /> {t('hero.badgeExport', 'Export Ready')}
                </span>
                        </div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <button
                                onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaBox className="text-xs" />{t('hero.ctaExplore', 'Explore Products')}
                            </button>
                            <Link to="/wholesale" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaTruck className="text-xs" />{t('hero.ctaWholesale', 'Wholesale Pricing')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Product Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-96 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={qualityImage} alt="AfriNuts Premium Cashew Products" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">Premium Cashew Products</span>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </Section>


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
                                                <option value="Organic">{t('certifications.organic.title')}</option>
                                                <option value="Halal">{t('certifications.halal.title')}</option>
                                                <option value="ISO 22000">{t('certifications.iso.title')}</option>
                                                <option value="Fair Trade">{t('certifications.fairtrade.title')}</option>
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

                                    {/* Production Type Filter */}
                                    <div className="flex gap-2">
                                        {[
                                            { key: 'all', label: t('filters.productionType.all', 'All') },
                                            { key: 'organic', label: t('filters.productionType.organic', 'Organic') },
                                            { key: 'conventional', label: t('filters.productionType.conventional', 'Conventional') }
                                        ].map((type) => (
                                            <motion.button
                                                key={type.key}
                                                onClick={() => setProductionType(type.key as any)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                    productionType === type.key
                                                        ? 'bg-primary text-white shadow-md'
                                                        : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                                                }`}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {type.label}
                                            </motion.button>
                                        ))}
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
                                    className="h-full"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                >
                                    <ProductCard
                                        product={product}
                                        className="h-full"
                                        productionTypeFilter={productionType}
                                        handleContactClick={() => {
                                            trackProductInquiry(product.name);
                                            navigate('/contact?type=wholesale');
                                        }}
                                        handlePreorderClick={() => {
                                            trackProductInquiry(product.name);
                                            navigate('/contact?type=preorder');
                                        }}
                                        handleWaitlistClick={() => {
                                            trackProductInquiry(product.name);
                                            navigate('/contact?type=waitlist');
                                        }}
                                        productImageMap={productImageMap}
                                        iconMap={iconMap}
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

                    {/* Product Education & Wholesale Links */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                        <Link to="/blog/raw-cashews-vs-roasted-cashews-whats-the-difference"
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full text-sm font-medium transition-colors">
                            <FaBookOpen className="text-xs" />
                            {t('relatedReading.rawVsRoasted')}
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>

                    {/* CTA After Products */}
                    {filteredProducts.length > 0 && (
                        <motion.div
                            className="text-center mt-12 mb-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <Typography variant="h2" className="text-primary mb-4">
                                {t('midCta.title')}
                            </Typography>
                            <motion.button
                                onClick={() => {
                                    trackCtaClick('contact_inquiry', 'products_page');
                                    navigate('/wholesale');
                                }}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-md"
                                whileHover={{ y: -2, scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                <span className="relative z-10 flex items-center gap-2">
                {t('midCta.button')}
            </span>
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Product Availability Timeline */}
                    <Section className="py-8">
                        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
                            <ProductTimeline
                                products={filteredProducts}
                                onPhaseClick={(phase) => {
                                    // Filter products by the clicked phase
                                    if (phase.status === 'available') {
                                        setFilters({...filters, availability: 'available'});
                                    } else if (phase.status === 'in-progress' || phase.status === 'upcoming') {
                                        setFilters({...filters, availability: 'coming-soon'});
                                    }
                                    // Scroll to products
                                    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                showHeader={true}
                                maxPhases={3}
                            />
                        </div>
                    </Section>

                    {/* Unified Offline Payment & Catalogue Section */}
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
                                    onClick={() => {
                                        trackCtaClick('request_quote', 'products_page');
                                        handleContactClick();
                                    }}
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
                                <motion.a
                                    href={productCataloguePdf}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-primary hover:bg-orange-700 text-white px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto text-base font-semibold transform-gpu hover:scale-105"
                                    whileHover={{
                                        scale: 1.08,
                                        transition: { duration: 0.18, type: "spring", stiffness: 320 }
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FaDownload className="mr-2 text-xl" />
                                    {t('catalogue.download')}
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                </Section>

                {/* Our Process Section */}
                <Section className="py-16 bg-gradient-to-r from-primary/30 via-white/30
  bg-[length:400%_400%] animate-gradient-x-slow rounded-t-[80px] md:rounded-t-[100px] overflow-hidden pt-24 pb-8 relative">
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

                                    <div className="h-64 bg-gray-100 overflow-hidden relative z-10 rounded-t-2xl">
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
                <Section className="py-10 bg-gradient-to-r from-primary/30 via-white/30
  bg-[length:400%_400%] animate-gradient-x-slow rounded-b-[80px] md:rounded-b-[100px] overflow-hidden pt-24 pb-8 relative">
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
                                        src={qualityAssuranceImage}
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

                {/* CTA: Visit Processing Page */}
                <Section className="py-16">
                    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
                        <motion.div
                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-10 transform-gpu"
                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            whileHover={{ y: -6, scale: 1.02, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)', transition: { duration: 0.3 } }}
                        >
                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
                            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                            <div className="relative z-10">
                                <Typography variant="h2" className="text-primary mb-4">
                                    {t('processCta.title', 'See How We Process Our Cashews')}
                                </Typography>
                                <Typography variant="body" className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    {t('processCta.description', 'From harvest to packaging — tour our state-of-the-art processing facility and see how we maintain quality at every step.')}
                                </Typography>
                                <motion.button
                                    onClick={() => {
                                        trackCtaClick('view_processing', 'products_page');
                                        navigate('/processing');
                                    }}
                                    className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-md"
                                    whileHover={{ y: -2, scale: 1.03, boxShadow: '0 10px 25px -5px rgba(165,105,66,0.4)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                    <span className="relative z-10 flex items-center gap-2">
                        {t('processCta.button', 'Visit Processing Facility')}
                                        <FaArrowRight />
                    </span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </Section>

                {/* Certifications */}
                <Section className="py-10">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                        <CertificationsCard
                            certifications={[
                                {
                                    id: 'organic',
                                    title: t('certifications.organic.title'),
                                    status: 'in-progress',
                                    targetDate: t('certifications.organic.targetDate'),
                                    icon: FaLeaf,
                                },
                                {
                                    id: 'fairtrade',
                                    title: t('certifications.fairtrade.title'),
                                    status: 'planned',
                                    targetDate: t('certifications.fairtrade.targetDate'),
                                    icon: FaRibbon,
                                },
                                {
                                    id: 'iso',
                                    title: t('certifications.iso.title'),
                                    status: 'planned',
                                    targetDate: t('certifications.iso.targetDate'),
                                    icon: FaShieldAlt,
                                },
                                {
                                    id: 'halal',
                                    title: t('certifications.halal.title'),
                                    status: 'planned',
                                    targetDate: t('certifications.halal.targetDate'),
                                    icon: FaAward,
                                },
                                {
                                    id: 'rainforest',
                                    title: t('certifications.rainforest.title'),
                                    status: 'planned',
                                    targetDate: t('certifications.rainforest.targetDate'),
                                    icon: FaCertificate,
                                },
                            ]}
                            title={t('certifications.title')}
                            subtitle={t('certifications.subtitle')}
                            variant="primary"
                            columns={5}
                        />
                    </div>
                </Section>

                {/* CTA Section */}
                <Section className="py-16 text-text-dark">
                    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <motion.div
                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                rotateY: 3,
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
                                <Typography variant="h2" className="text-text-dark mb-6">
                                    {t('cta.title')}
                                </Typography>
                                <Typography variant="lead" className="text-text-dark/90 mb-8 max-w-3xl mx-auto">
                                    {t('cta.subtitle')}
                                </Typography>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                >
                                    <motion.button
                                        onClick={() => {
                                            trackCtaClick('contact', 'products_footer');
                                            navigate('/contact');
                                        }}
                                        className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full text-lg font-medium transform-gpu relative overflow-hidden group"
                                        style={{
                                            transformStyle: 'preserve-3d',
                                        }}
                                        whileHover={{
                                            y: -3,
                                            boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.5)',
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        {/* Button 3D edge effect */}
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-300" />

                                        {/* Button glassy overlay */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                                        {/* Button inner glow */}
                                        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />

                                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {t('cta.contact')}
                                            <motion.svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                initial={{ x: 0 }}
                                                whileHover={{ x: 3 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </motion.svg>
                        </span>
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </Section>
        </main>
    );
}
export default Products;