import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaChevronDown, FaLeaf, FaSeedling,
    FaGlobeAfrica, FaNewspaper, FaEnvelope, FaArrowRight
} from 'react-icons/fa';
import Section from '../components/Section/Section';
import {
    fadeIn,
    slideInFromLeft,
    slideInFromRight,
    scaleUp,
    staggerContainer,
    bounceArrow
} from '../utils/animations';

import heroImage from '../assets/images/hero.jpg';
import farmImage from '../assets/images/farm.jpg';
import productsImage from '../assets/images/products.jpg';
import sustainabilityImage from '../assets/images/sustainability.jpg';
import newsImage from '../assets/images/news.jpg';

const Home: React.FC = () => {
    const { t } = useTranslation('home');
    const navigate = useNavigate();

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen overflow-hidden">
            {/* 1. Hero Section */}
            <section className="relative bg-primary text-white min-h-[90vh] flex items-center justify-center overflow-hidden">
                <img
                  src={heroImage}
                  alt="Hero"
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 text-white opacity-20" />
                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                    <h1 className="text-4xl md:text-6xl font-display font-semibold mb-6 leading-tight tracking-tight text-primary">
                        From <span className="italic font-light"> Our Family Farm</span> to Your Table
                    </h1>
                    <p className="text-lg md:text-xl font-medium mb-8 text-text-dark">
                      Sustainably grown, ethically sourced, and packed with flavor — connecting Ivory Coast's harvest to the world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        className="bg-accent hover:bg-dark-orange text-white px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => navigate('/about')}
                      >
                        {t('hero.learnMore')}
                      </button>
                      <button
                        className="border-2 border-primary hover:border-accent text-primary hover:text-accent px-8 py-4 rounded-full text-lg transition-all duration-300 hover:bg-white/10"
                        onClick={() => navigate('/farm')}
                      >
                        {t('hero.contact')}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 w-full">
                  <svg viewBox="0 0 1440 320" className="w-full h-[120px]" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#ffffff" d="M0,160L1440,320L1440,0L0,0Z" />
                  </svg>
                </div>
            </section>

            {/* 2. About Preview Section */}
            <Section id="about-preview" className="bg-background py-16">
                <motion.div
                    className="container mx-auto px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={scaleUp}
                >
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 -mt-24 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-10">
                            <motion.div
                                className="text-accent text-6xl p-4 bg-background rounded-2xl shadow-inner"
                                variants={fadeIn}
                            >
                                <FaGlobeAfrica />
                            </motion.div>
                            <motion.div
                                className="flex-1"
                                variants={fadeIn}
                            >
                                <h2 className="font-display text-display-lg md:text-display-xl text-primary mb-6 leading-tight">
                                    {t('aboutPreview.title')}
                                </h2>
                                <p className="font-sans text-lg text-text-dark mb-8 leading-relaxed tracking-normal">
                                    {t('aboutPreview.description')}
                                </p>
                                <button
                                    className="group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center"
                                    onClick={() => navigate('/about')}
                                >
                                    {t('aboutPreview.readMore')}
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </Section>


            {/* 3. Products Showcase */}
            <Section
                bgImage={productsImage}
                overlay
                overlayColor="bg-primary/20"
                className="py-16 bg-background"
            >
                <motion.div
                    className="container mx-auto px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div
                        className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
                        variants={scaleUp}
                    >
                        <div className="flex flex-col md:flex-row">
                            <div className="p-10 flex-1">
                                <motion.div
                                    className="text-accent text-5xl mb-6"
                                    variants={fadeIn}
                                >
                                    <FaSeedling />
                                </motion.div>
                                <motion.h2
                                    className="text-3xl font-bold text-primary mb-6"
                                    variants={fadeIn}
                                >
                                    {t('products.title')}
                                </motion.h2>
                                <motion.p
                                    className="text-lg text-text-dark mb-8 leading-relaxed"
                                    variants={fadeIn}
                                >
                                    {t('products.description')}
                                </motion.p>
                                <motion.div variants={fadeIn}>
                                    <button
                                        className="group border-2 border-accent text-accent px-8 py-3 rounded-full hover:bg-accent/10 transition-all duration-300 hover:text-dark-orange hover:border-dark-orange inline-flex items-center"
                                        onClick={() => navigate('/products')}
                                    >
                                        {t('products.viewProducts')}
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            </div>
                            <div className="hidden md:block flex-1 bg-cover bg-center" style={{ backgroundImage: `url(${productsImage})` }} />
                        </div>
                    </motion.div>
                </motion.div>
            </Section>

            {/* 4. Farm Story */}
            <Section className="bg-background border border-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-[0_0_25px_rgba(253,129,4,0.5)] transition duration-300 py-16">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            className="flex-1"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromLeft}
                        >
                            <div className="bg-white p-8 rounded-3xl shadow-lg">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                                    {t('farm.title')}
                                </h2>
                                <p className="text-lg text-text-dark mb-8 leading-relaxed">
                                    {t('farm.description')}
                                </p>
                                <button
                                    className="group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center"
                                    onClick={() => navigate('/farm')}
                                >
                                    {t('farm.visitFarm')}
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex-1"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromRight}
                        >
                            <img
                                src={farmImage}
                                alt="AfriNuts Farm"
                                className="rounded-3xl shadow-2xl w-full h-auto object-cover aspect-video"
                            />
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* 5. Sustainability */}
            <Section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="bg-white rounded-3xl shadow-xl overflow-hidden"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleUp}
                    >
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 bg-cover bg-center min-h-[400px]" style={{ backgroundImage: `url(${sustainabilityImage})` }} />
                            <div className="md:w-1/2 p-10">
                                <motion.div
                                    className="text-accent text-5xl mb-6"
                                    variants={fadeIn}
                                >
                                    <FaLeaf />
                                </motion.div>
                                <motion.h2
                                    className="text-3xl md:text-4xl font-bold text-primary mb-6"
                                    variants={fadeIn}
                                >
                                    {t('sustainability.title')}
                                </motion.h2>
                                <motion.p
                                    className="text-lg text-text-dark mb-8 leading-relaxed"
                                    variants={fadeIn}
                                >
                                    {t('sustainability.description')}
                                </motion.p>
                                <motion.div variants={fadeIn}>
                                    <button
                                        className="group border-2 border-accent text-accent px-8 py-3 rounded-full hover:bg-accent/10 transition-all duration-300 hover:text-dark-orange hover:border-dark-orange inline-flex items-center"
                                        onClick={() => navigate('/sustainability')}
                                    >
                                        {t('sustainability.learnMore')}
                                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* 6. News & Updates */}
            <Section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                            {t('news.title')}
                        </h2>
                        <p className="text-lg text-text-dark max-w-3xl mx-auto">
                            {t('news.description')}
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-[0_0_25px_rgba(253,129,4,0.5)] transition duration-300"
                            whileHover={{ y: -10 }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromLeft}
                        >
                            <div className="h-48 md:h-56 bg-cover bg-center" style={{ backgroundImage: `url(${newsImage})` }} />
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-primary mb-4">Latest Harvest Report</h3>
                                <p className="text-text-dark mb-6">Discover our record-breaking cashew yields this season.</p>
                                <button
                                    className="text-accent font-medium inline-flex items-center group"
                                    onClick={() => navigate('/news')}
                                >
                                    Read more
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-[0_0_25px_rgba(253,129,4,0.5)] transition duration-300"
                            whileHover={{ y: -10 }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideInFromRight}
                        >
                            <div className="h-48 md:h-56 bg-cover bg-center" style={{ backgroundImage: `url(${farmImage})` }} />
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-primary mb-4">Sustainable Practices</h3>
                                <p className="text-text-dark mb-6">How we're revolutionizing cashew farming in West Africa.</p>
                                <button
                                    className="text-accent font-medium inline-flex items-center group"
                                    onClick={() => navigate('/news')}
                                >
                                    Read more
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="text-center mt-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <button
                            className="group bg-accent hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                            onClick={() => navigate('/news')}
                        >
                            {t('news.readMore')}
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </Section>

            {/* 7. Contact CTA */}
            <Section className="py-16 bg-background relative z-10 rounded-b-[5rem] overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        className="max-w-4xl mx-auto"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t('contact.title')}
                        </h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            {t('contact.description')}
                        </p>
                        <button
                            className="group border-2 border-accent text-accent px-8 py-3 rounded-full hover:bg-accent/10 transition-all duration-300 hover:text-dark-orange hover:border-dark-orange inline-flex items-center"
                            onClick={() => navigate('/contact')}
                        >
                            {t('contact.getInTouch')}
                        </button>
                    </motion.div>
                </div>
            </Section>
            <div className="relative -mt-24 z-0">
              <svg className="w-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#5A7411" d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z"></path>
              </svg>
            </div>
        </div>
    );
};

export default Home;