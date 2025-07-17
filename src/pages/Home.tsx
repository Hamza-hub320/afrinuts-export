import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaChevronDown, FaLeaf, FaSeedling,
    FaGlobeAfrica, FaNewspaper, FaEnvelope, FaArrowRight
} from 'react-icons/fa';
const Section = React.lazy(() => import('../components/Section/Section'));
import {
    fadeIn,
    slideInFromLeft,
    slideInFromRight,
    scaleUp,
    staggerContainer,
    bounceArrow
} from '../utils/animations';
import { Typography } from '../components/Typography/Typography';

import heroImage from '../assets/images/hero.jpg';
import farmImage from '../assets/images/farm.jpg';
import productsImage from '../assets/images/products.jpg';
import sustainabilityImage from '../assets/images/sustainability.jpg';
import newsImage from '../assets/images/news.jpg';
const ProductCard = React.lazy(() => import('../components/ProductCard/ProductCard'));
const NewsCard = React.lazy(() => import('../components/NewsCard/NewsCard'));


const newsItems = [
    {
        title: "Record-Breaking Cashew Yields",
        date: "June 2024",
        category: "Harvest Report",
        description: "Our farm achieves highest-ever production with sustainable methods",
        image: newsImage
    },
    {
        title: "New Solar-Powered Processing",
        date: "May 2024",
        category: "Sustainability",
        description: "We've installed solar panels to power our processing facility",
        image: farmImage
    },
    {
        title: "Introducing Organic Cashew Butter",
        date: "April 2024",
        category: "Product News",
        description: "Our newest product line now available in European markets",
        image: productsImage
    }
];

const Home: React.FC = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();

    // Define product data and mappings
    const productImageMap = {
        'raw-cashews': productsImage,
        'organic-cashews': sustainabilityImage,
        'value-added': farmImage
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
        <div className="min-h-screen overflow-hidden">
            {/* 1. Hero Section */}
            <section className="relative bg-primary text-white min-h-screen flex items-center justify-center overflow-hidden">
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/40 z-0" />

                <img
                    src={heroImage}
                    alt="Cashew farm in Ivory Coast"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                <div className="relative z-10 container mx-auto px-6">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Improved H1 */}
                        <Typography variant="display-xl" className="mb-6 text-white drop-shadow-md bg-black/20 backdrop-blur-sm px-6 py-4 rounded-lg">
                            Premium Cashews from the Heart of <span className="text-accent">Ivory Coast</span>
                        </Typography>

                        {/* Enhanced Paragraph */}
                        <Typography
                            variant="subhead"
                            className="mb-8 text-white/90 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed drop-shadow-md bg-black/20 backdrop-blur-sm px-6 py-4 rounded-lg"
                        >
                            Sustainably grown, ethically sourced, and packed with flavor — connecting West Africa's finest harvest to global markets.
                        </Typography>

                        {/* Improved Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-accent hover:bg-dark-orange text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                                onClick={() => navigate('/products')}
                            >
                                Explore Products
                                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="border-2 border-accent hover:border-accent text-accent hover:text-accent px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:bg-white/10 flex items-center gap-2"
                                onClick={() => scrollToSection('about-preview')}
                            >
                                Learn More
                                <FaChevronDown className="transition-transform group-hover:translate-y-1" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative wave at bottom */}
                <div className="absolute bottom-0 left-0 w-full z-10">
                    <svg viewBox="0 0 1440 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#F5F5F5" fillOpacity="1" d="M0,64L80,74.7C160,85,320,107,480,101.3C640,96,800,64,960,58.7C1120,53,1280,75,1360,85.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                    </svg>
                </div>
            </section>

            {/* 2. About Preview Section */}
            <Suspense fallback={<div>Loading about preview...</div>}>
            <Section id="about-preview" className="bg-background py-16 -mt-1">
                <motion.div
                    className="container mx-auto px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={scaleUp}
                >
                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <motion.div
                                className="text-accent text-6xl p-6 bg-background rounded-2xl shadow-inner"
                                variants={fadeIn}
                            >
                                <FaGlobeAfrica />
                            </motion.div>
                            <motion.div
                                className="flex-1"
                                variants={fadeIn}
                            >
                                <Typography variant="h2" className="mb-6">
                                    Rooted in Tradition, Growing for the Future
                                </Typography>
                                <Typography variant="body" className="mb-8">
                                    AfriNuts Export is a family-owned agribusiness based in Odienné, Ivory Coast. With over 50 hectares of prime cashew farmland, we combine traditional farming knowledge with modern sustainable practices to produce premium quality cashews for global markets.
                                </Typography>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center"
                                    onClick={() => navigate('/about')}
                                >
                                    Our Story
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </Section>
            </Suspense>

            {/* 3. Products Showcase */}
            <Suspense fallback={<div>Loading products...</div>}>
            <Section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            Our Premium Products
                        </Typography>
                        <Typography variant="subhead" className="max-w-3xl mx-auto">
                            From raw cashews to value-added products, we offer the finest quality from our farm to your table
                        </Typography>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <ProductCard
                            product={{
                                name: "Raw Cashews",
                                description: "Premium quality raw cashews, carefully selected and packed for export",
                                icon: "raw-cashews",
                                backgroundImage: "raw-cashews",
                                features: [
                                    "Direct from our 50-hectare farm",
                                    "Premium grade selection",
                                    "Sustainable farming practices",
                                    "Ethically sourced"
                                ],
                                available: true
                            }}
                            handleContactClick={handleContactClick}
                            productImageMap={productImageMap}
                            iconMap={iconMap}
                        />

                        <ProductCard
                            product={{
                                name: "Organic Cashews",
                                description: "Certified organic cashews grown without synthetic pesticides or fertilizers",
                                icon: "organic-cashews",
                                backgroundImage: "organic-cashews",
                                features: [
                                    "100% organic certified",
                                    "No synthetic chemicals",
                                    "Higher nutritional value",
                                    "Environmentally friendly"
                                ],
                                available: true
                            }}
                            handleContactClick={handleContactClick}
                            productImageMap={productImageMap}
                            iconMap={iconMap}
                        />

                        <ProductCard
                            product={{
                                name: "Value-Added Products",
                                description: "Roasted cashews, cashew butter, and other premium processed products",
                                icon: "value-added",
                                backgroundImage: "value-added",
                                features: [
                                    "Premium roasted cashews",
                                    "Organic cashew butter",
                                    "Cashew milk powder",
                                    "Coming soon: Cashew oil"
                                ],
                                available: false,
                                comingSoon: "Available Q1 2025"
                            }}
                            handleContactClick={handleContactClick}
                            productImageMap={productImageMap}
                            iconMap={iconMap}
                        />
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
                            className="group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                            onClick={() => navigate('/products')}
                        >
                            View All Products
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            </Section>
            </Suspense>

            {/* 4. Farm Story */}
            <Section className="py-16 bg-background text-text-dark">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            className="flex-1"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromLeft}
                        >
                            <Typography variant="h2" className="mb-6">
                                Our Sustainable Farm
                            </Typography>
                            <Typography variant="body" className="mb-8">
                                Located in the heart of Ivory Coast's cashew belt, our 50-hectare family farm combines traditional knowledge with modern sustainable practices. We're committed to ethical farming that benefits both people and the planet.
                            </Typography>
                            <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <div className="text-accent text-2xl mb-2">
                                        <FaLeaf />
                                    </div>
                                    <Typography variant="h4" className="mb-2">
                                        Sustainable Practices
                                    </Typography>
                                    <Typography variant="small">
                                        Organic farming methods that protect the environment
                                    </Typography>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl">
                                    <div className="text-accent text-2xl mb-2">
                                        <FaGlobeAfrica />
                                    </div>
                                    <Typography variant="h4" className="mb-2">
                                        Community Focus
                                    </Typography>
                                    <Typography variant="small">
                                        Supporting local farmers and creating jobs
                                    </Typography>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group border-2 border-accent text-accent hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300 inline-flex items-center"
                                onClick={() => navigate('/farm')}
                            >
                                Visit Our Farm
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                        <motion.div
                            className="flex-1"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromRight}
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video">
                                <img
                                    src={farmImage}
                                    alt="AfriNuts Farm"
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                                    <Typography variant="h4" className="text-white">
                                        Odienné, Ivory Coast
                                    </Typography>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* 5. Sustainability */}
            <Section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleUp}
                    >
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 bg-cover bg-center min-h-[500px]" style={{ backgroundImage: `url(${sustainabilityImage})` }} />
                            <div className="md:w-1/2 p-12">
                                <div className="text-accent text-5xl mb-6">
                                    <FaLeaf />
                                </div>
                                <Typography variant="h2" className="mb-6">
                                    Our Commitment to Sustainability
                                </Typography>
                                <Typography variant="body" className="mb-8">
                                    At AfriNuts Export, we believe in farming practices that protect the environment and support local communities. From water conservation to fair wages, sustainability is at the core of everything we do.
                                </Typography>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="text-accent text-xl mt-1">
                                            <FaSeedling />
                                        </div>
                                        <div>
                                            <Typography variant="h4" className="mb-1">
                                                Organic Farming
                                            </Typography>
                                            <Typography variant="small">
                                                No synthetic pesticides or fertilizers
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="text-accent text-xl mt-1">
                                            <FaGlobeAfrica />
                                        </div>
                                        <div>
                                            <Typography variant="h4" className="mb-1">
                                                Fair Trade Practices
                                            </Typography>
                                            <Typography variant="small">
                                                Ethical treatment and fair wages for workers
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="text-accent text-xl mt-1">
                                            <FaLeaf />
                                        </div>
                                        <div>
                                            <Typography variant="h4" className="mb-1">
                                                Zero Waste Processing
                                            </Typography>
                                            <Typography variant="small">
                                                Utilizing byproducts like CNSL for biofuels
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group border-2 border-accent text-accent px-8 py-3 rounded-full hover:bg-accent/10 transition-all duration-300 hover:text-dark-orange hover:border-dark-orange inline-flex items-center"
                                    onClick={() => navigate('/sustainability')}
                                >
                                    Our Sustainability Promise
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* 6. News & Updates */}
            <Suspense fallback={<div>Loading news...</div>}>
            <Section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            Latest News & Updates
                        </Typography>
                        <Typography variant="subhead" className="max-w-3xl mx-auto">
                            Stay informed about our farm, products, and industry developments
                        </Typography>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* News Card 1 */}
                        <NewsCard
                            newsItem={{
                                title: "Record-Breaking Cashew Yields",
                                date: "June 2024",
                                category: "Harvest Report",
                                description: "Our farm achieves highest-ever production with sustainable methods",
                                image: newsImage
                            }}
                            onClick={() => navigate('/news')}
                            variants={slideInFromLeft}
                        />

                        {/* News Card 2 */}
                        <NewsCard
                            newsItem={{
                                title: "New Solar-Powered Processing",
                                date: "May 2024",
                                category: "Sustainability",
                                description: "We've installed solar panels to power our processing facility",
                                image: farmImage
                            }}
                            onClick={() => navigate('/news')}
                            variants={scaleUp}
                        />

                        {/* News Card 3 */}
                        <NewsCard
                            newsItem={{
                                title: "Introducing Organic Cashew Butter",
                                date: "April 2024",
                                category: "Product News",
                                description: "Our newest product line now available in European markets",
                                image: productsImage
                            }}
                            onClick={() => navigate('/news')}
                            variants={slideInFromRight}
                        />
                    </div>

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
                            className="group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                            onClick={() => navigate('/news')}
                        >
                            View All News
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            </Section>
            </Suspense>

            {/* 7. Contact CTA */}
            <Suspense fallback={<div>Loading contact...</div>}>
            <Section className="py-16 bg-white text-text-dark relative overflow-hidden">
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <motion.div
                        className="max-w-4xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleUp}
                    >
                        <Typography variant="h2" className="mb-6">
                            Ready to Experience Premium Cashews?
                        </Typography>
                        <Typography variant="subhead" className="mb-8 max-w-2xl mx-auto">
                            Whether you're a wholesaler, retailer, or just love quality cashews, we'd love to hear from you.
                        </Typography>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                            onClick={() => navigate('/contact')}
                        >
                            Get In Touch
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>
            </Section>
            </Suspense>
        </div>
    );
};

export default Home;