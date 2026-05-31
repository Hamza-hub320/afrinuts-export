import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaChartLine,
    FaLeaf,
    FaShieldAlt,
    FaUsers,
    FaArrowRight,
    FaDownload,
    FaGlobeAfrica,
    FaBox,
    FaTruck,
    FaFlask,
    FaFileContract,
    FaEnvelope,
    FaSearch,
    FaIndustry,
    FaClipboardList,
    FaChevronUp,
    FaChevronDown,
    FaCheckCircle,
    FaWhatsapp,
    FaTh,
    FaSeedling,
    FaTint, FaCheck, FaHeadset, FaHeart
} from 'react-icons/fa';
import Section from '@/components/Section/Section';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { fadeIn, staggerContainer } from '@/utils/animations';
import JsonLd from '@/components/Seo/JsonLd';
import { Helmet } from 'react-helmet-async';
import cashewKernelsImage from '../assets/images/cashew-kernels.webp';
import productCataloguePdf from '@/assets/documents/afrinuts-products-catalogue.pdf';
import { Link } from 'react-router-dom';
import {trackCtaClick} from "@/utils/analytics";

const Wholesale: React.FC = () => {
    const { t } = useTranslation('wholesale');
    const navigate = useNavigate();

    const whyDifferent = [
        { icon: FaSearch, key: 'traceability' },
        { icon: FaShieldAlt, key: 'consistency' },
        { icon: FaFileContract, key: 'documentation' },
    ];

    const productSpecs = t('products.table', { returnObjects: true }) as any[];

    const qualitySpecs = t('quality.specs', { returnObjects: true }) as any[];

    const logistics = t('logistics.items', { returnObjects: true }) as any[];

    const processSteps = t('process.steps', { returnObjects: true }) as any[];

    const trustSignals = t('trust.items', { returnObjects: true }) as any[];

    const faqItems = t('faq.items', { returnObjects: true }) as any[];

    const iconMap: Record<string, React.ComponentType> = {
        FaUsers, FaLeaf, FaChartLine, FaGlobeAfrica, FaBox, FaIndustry, FaFlask,
        FaSearch, FaShieldAlt, FaFileContract, FaTruck,
    };

    let productCataloguePdf;
    return (
        <div className="text-text-dark font-sans">
            <Helmet>
                <title>{t('seo.title')}</title>
                <meta name="description" content={t('seo.description')} />
                <link rel="canonical" href="https://www.afrinutsexport.com/wholesale" />
            </Helmet>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", "name": t('seo.title'), "description": t('seo.description') }} />

            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[90vh]">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                    {/* Left: Text Content */}
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaBox className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                            {t('hero.title')}
                        </motion.h1>
                        <Typography variant="lead" className="text-text-dark mb-3 text-base lg:text-lg">{t('hero.lead')}</Typography>

                        {/* Wholesale Intro Card */}
                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaShieldAlt}
                                title={t('hero.introTitle', 'What Makes Our Wholesale Different')}
                                variant="secondary"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('hero.introBody', 'Single-origin from our 35-hectare farm. Farm OS traceability on every shipment. Export-ready documentation. No middlemen — just direct, transparent sourcing from Odienné to your container.')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    <FaBox className="text-[10px]" /> {t('hero.moq')}
                </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                    <FaCheckCircle className="text-[10px]" /> {t('hero.available')}
                </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-sm rounded-full font-medium">
                    <FaFlask className="text-xs" /> {t('hero.samples')}
                </span>
                        </div>
                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <motion.button onClick={() => {
                                trackCtaClick('request_wholesale_pricing', 'wholesale_cta');
                                navigate('/contact?type=wholesale');
                            }} className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5" whileHover={{ y: -1 }}>
                                <FaEnvelope className="text-xs" />{t('hero.requestPricing')}
                            </motion.button>
                            <a href="/documents/afrinuts-products-catalogue.pdf" download="AfriNuts-Products-Catalogue.pdf" rel="noopener"
                               className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm"
                               title="Download AfriNuts Export Product Catalogue (PDF)">
                                <FaDownload className="text-xs" />{t('hero.downloadCatalogue')}
                            </a>
                            <a href="https://wa.me/+13854577473" target="_blank" rel="noopener noreferrer" className="relative border border-green-400 text-green-600 hover:bg-green-50 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaWhatsapp className="text-xs" />{t('hero.whatsapp')}
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right: Product Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                    <motion.div className="relative w-96 h-96 sm:w-80 sm:h-80 lg:w-[460px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                        <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                        <img src={cashewKernelsImage} alt="Premium Cashew Kernels" className="w-full h-full object-cover" />
                        <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                            <span className="text-primary text-[11px] font-semibold">{t('hero.imageLabel')}</span>
                        </div>
                    </motion.div>
                    </motion.div>

                </motion.div>
            </Section>

            {/* Why Different */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('whyDifferent.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('whyDifferent.body')}</Typography>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-6">
                    {whyDifferent.map((item, idx) => (
                        <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                            <InfoCard icon={item.icon} title={t(`whyDifferent.cards.${item.key}.title`)} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                <Typography variant="small" className="text-gray-600 mb-3">{t(`whyDifferent.cards.${item.key}.desc`)}</Typography>
                                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-bold">{t(`whyDifferent.cards.${item.key}.stat`)}</span>
                            </InfoCard>
                        </motion.div>
                    ))}
                </div>
            </div></Section>

            {/* Block Tracking Visual Reference */}
            <Section className="py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-0">
                    <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('blockTracking.title', 'Block-Level Tracking: See What Others Can\'t Show')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-xl mx-auto">
                            {t('blockTracking.description', 'Our Farm OS maps every block by row, column, survival rate, and GPS coordinates. Each block has its own planting date, tree count, and harvest history.')}
                        </Typography>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <InfoCard
                            icon={FaTh}
                            title={t('blockTracking.gridLabel', '5×7 block grid — 35 hectares')}
                            variant="secondary"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <div className="flex flex-col items-center gap-4">
                                {/* Grid Visual */}
                                <div className="grid grid-cols-7 gap-[2px] sm:gap-0.5 bg-white/60 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-primary/10 w-fit mx-auto">
                                    {['A', 'B', 'C', 'D', 'E'].map((row) => (
                                        <React.Fragment key={row}>
                                            {Array.from({ length: 7 }, (_, col) => (
                                                <div key={`${row}-${col}`}
                                                     className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm flex items-center justify-center text-[7px] sm:text-[8px] font-bold border
                                            ${col === 0 && row === 'B' ? 'bg-amber-500/80 text-white border-amber-600' :
                                                         col === 4 && row === 'C' ? 'bg-primary/80 text-white border-primary' :
                                                             col === 1 && row === 'D' ? 'bg-green-500/80 text-white border-green-600' :
                                                                 'bg-green-50 text-primary border-green-200'}`}>
                                                    {col === 0 && row === 'B' ? <FaSeedling className="text-[6px] sm:text-[8px]" /> :
                                                        col === 4 && row === 'C' ? <FaTint className="text-[6px] sm:text-[8px]" /> :
                                                            col === 1 && row === 'D' ? <FaCheck className="text-[6px] sm:text-[8px]" /> : ''}
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {/* Legend */}
                                <div className="flex gap-3 text-[10px]">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500/80"></span> {t('blockTracking.legend.planted', 'Planted')}</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500/80"></span> {t('blockTracking.legend.harvested', 'Harvested')}</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary/80"></span> {t('blockTracking.legend.infrastructure', 'Infrastructure')}</span>
                                </div>
                                <div className="text-[10px] text-gray-400">{t('blockTracking.gridLabel', '5×7 block grid — 35 hectares')}</div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {(t('blockTracking.tags', { returnObjects: true }) as string[] || []).map((tag: string) => (
                                        <span key={tag} className="px-1.5 py-0.5 bg-primary/10 text-primary text-[9px] rounded-full font-medium">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </InfoCard>
                    </motion.div>

                    {/* CTA */}
                    <motion.div className="text-center mt-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Link to="/farm-os" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2 rounded-full transform-gpu transition-all duration-300 inline-flex items-center gap-1.5 text-sm font-medium shadow-md">
                            <FaSearch className="text-xs" />
                            {t('blockTracking.viewLiveExample', 'Learn more about Farm OS')}
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </motion.div>
                </div>
            </Section>



            {/* Product Range */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('products.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-xl mx-auto">{t('products.body')}</Typography>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <InfoCard icon={FaClipboardList} title={t('products.cardTitle')} variant="primary" showInfoBadge={false}>
                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-200 text-left">
                                    <th className="pb-2 font-medium text-gray-600">{t('products.product')}</th>
                                    <th className="pb-2 font-medium text-gray-600">{t('products.grade')}</th>
                                    <th className="pb-2 font-medium text-gray-600">{t('products.moq')}</th>
                                    <th className="pb-2 font-medium text-gray-600">{t('products.leadTime')}</th>
                                    <th className="pb-2 font-medium text-gray-600">{t('products.status')}</th>
                                </tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                {productSpecs.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-white/20 transition-colors">
                                        <td className="py-3 font-medium flex items-center gap-2">
                                            <FaBox className="text-primary text-xs" />{item.product}
                                        </td>
                                        <td className="py-3 text-gray-600 text-xs">{item.grade}</td>
                                        <td className="py-3 text-gray-600 text-xs">{item.moq}</td>
                                        <td className="py-3 text-gray-600 text-xs">{item.leadTime}</td>
                                        <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {item.status}
                            </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-3">
                            {productSpecs.map((item, idx) => (
                                <div key={idx} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaBox className="text-primary text-sm" />
                                            <span className="font-semibold text-gray-800 text-sm">{item.product}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {item.status}
                    </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                                        <div><span className="text-gray-400">{t('products.grade')}:</span> <span className="text-gray-700">{item.grade}</span></div>
                                        <div><span className="text-gray-400">{t('products.moq')}:</span> <span className="text-gray-700">{item.moq}</span></div>
                                        <div><span className="text-gray-400">{t('products.leadTime')}:</span> <span className="text-gray-700">{item.leadTime}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 text-center">
                            <a
                                href="/documents/afrinuts-products-catalogue.pdf"
                                download="AfriNuts-Products-Catalogue.pdf"
                                rel="noopener"
                                title="Download AfriNuts Export Product Catalogue (PDF)"
                                className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1"
                            >
                                <FaDownload className="text-xs" /> {t('products.downloadCatalogue')}
                            </a>
                        </div>
                        <div className="mt-3 text-center">
                            <motion.button onClick={() => {
                                trackCtaClick('request_sample_batch', 'wholesale_products');
                                navigate('/contact?type=sample');
                            }}className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1" whileHover={{ x: 2 }}><FaFlask className="text-xs" /> {t('products.requestSample')}</motion.button>
                        </div>
                    </InfoCard>
                </motion.div>
            </div></Section>

            {/* Farm OS Advantage */}
            <Section className="py-10"><div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                    <Typography variant="h2" className="text-primary mb-4">{t('farmOs.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 mb-6 max-w-xl mx-auto">{t('farmOs.body')}</Typography>
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg inline-block"><p className="text-primary font-medium text-sm" dangerouslySetInnerHTML={{ __html: t('farmOs.batchNote') }} /></div>
                    <Link to="/trace" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full transform-gpu transition-all duration-300 inline-flex items-center gap-2 text-sm font-medium shadow-md"><div className="absolute inset-0 rounded-full border-2 border-white/30" /><div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" /><span className="relative z-10">{t('farmOs.cta')}</span><FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" /></Link>
                </motion.div>
            </div></Section>

            {/* Quality + Logistics */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('quality.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('quality.body')}</Typography>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <InfoCard icon={FaFlask} title={t('quality.specsTitle')} variant="primary" showInfoBadge={false}>
                            <div className="grid grid-cols-2 gap-3">{qualitySpecs.map((item, idx) => (<div key={idx} className="bg-white/50 rounded-lg p-3 text-center"><div className="text-lg font-bold text-primary">{item.value}</div><div className="text-xs text-gray-500">{item.label}</div></div>))}</div>
                        </InfoCard>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.1 }}>
                        <InfoCard icon={FaTruck} title={t('logistics.title')} variant="accent" showInfoBadge={false}>
                            {t('logistics.description') && (
                                <Typography variant="small" className="text-gray-600 mb-4">
                                    {t('logistics.description')}
                                </Typography>
                            )}
                            <div className="space-y-3">{logistics.map((item, idx) => {
                                const IconComponent = iconMap[item.icon];
                                return (
                                    <div key={idx} className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                                        {IconComponent ? <IconComponent /> : <FaBox className="text-primary text-lg" />}
                                        <div>
                                            <div className="text-xs text-gray-500">{item.label}</div>
                                            <div className="text-sm font-medium text-gray-800">{item.value}</div>
                                        </div>
                                    </div>
                                );
                            })}</div>
                            <div className="mt-3 p-3 bg-primary/5 rounded-lg text-xs text-gray-600 space-y-1.5">
                                <div className="font-medium text-primary text-sm mb-2">{t('payment.title')}</div>
                                {(t('payment.terms', { returnObjects: true }) as any[]).map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>{item.label}</span>
                                        <span className="font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 p-3 bg-primary/5 rounded-lg text-xs text-gray-600">{t('logistics.documentation')}</div>
                        </InfoCard>
                    </motion.div>
                </div>
            </div></Section>

            {/* Process */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('process.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-xl mx-auto">{t('process.body')}</Typography>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{processSteps.map((item, idx) => (<motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}><InfoCard title={item.title} subtitle={`${t('process.stepLabel')} ${item.step}`} iconColor="text-accent" showInfoBadge={false} className="h-full text-center"><div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">{item.step}</div><Typography variant="small" className="text-gray-600">{item.desc}</Typography></InfoCard></motion.div>))}</div>
            </div></Section>

            {/* Trust Signals */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('trust.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-xl mx-auto">{t('trust.body')}</Typography>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{trustSignals.map((item, idx) => {
                    const IconComponent = iconMap[item.icon] || FaUsers;
    return (
        <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
            <InfoCard icon={IconComponent as any} title={item.value} subtitle={item.label} iconColor="text-accent" showInfoBadge={false} className="h-full text-center">
                <Typography variant="small" className="text-gray-500 text-xs">{item.desc}</Typography>
            </InfoCard>
        </motion.div>
    );
})}</div>
            </div>
                <div className="text-center mt-6">
                    <Link to="/community" className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1">
                        <FaHeart className="text-xs" />
                        {t('trust.community')}
                        <FaArrowRight className="text-xs" />
                    </Link>
                </div></Section>

            {/* FAQ */}
            <Section className="py-10"><div className="max-w-3xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('faq.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-xl mx-auto">{t('faq.body')}</Typography>
                </motion.div>
                <WholesaleFAQ items={faqItems} viewAllLabel={t('faq.viewAll')} />
            </div></Section>

            {/* Final CTA */}
            <Section className="py-16"><div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <motion.div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu" style={{ transformStyle: 'preserve-3d' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} whileHover={{ y: -6, scale: 1.02 }}>
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20" /><div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                    <div className="relative z-10">
                        <Typography variant="h2" className="mb-4 text-primary">{t('cta.title')}</Typography>
                        <Typography variant="body" className="mb-6 text-gray-600 max-w-2xl mx-auto">{t('cta.body')}</Typography>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button onClick={() => {
    trackCtaClick('request_wholesale_pricing', 'wholesale_hero');
    navigate('/contact?type=wholesale');
}} className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center gap-2" whileHover={{ y: -2 }}><div className="absolute inset-0 rounded-full border-2 border-white/30" /><FaEnvelope className="relative z-10" /><span className="relative z-10">{t('cta.requestPricing')}</span></motion.button>
                            <motion.button onClick={() => {
    trackCtaClick('view_certifications', 'wholesale_cta');
    navigate('/certifications');
}} className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full transform-gpu font-medium inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm"><FaShieldAlt /> {t('cta.viewCertifications')}</motion.button>
                        </div>
                    </div>
                </motion.div>
            </div></Section>
        </div>
    );
};

// Foldable FAQ Component
const WholesaleFAQ: React.FC<{
    items: { q: string; a: string; cta?: { text: string; link: string } }[];
    viewAllLabel: string
}> = ({ items, viewAllLabel }) => {
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
    const toggleItem = (idx: number) => setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));

    return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl transform-gpu overflow-hidden"
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)', transition: { duration: 0.3 } }}>
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
            <div className="relative z-10 p-6">
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden">
                            <button className="w-full text-left flex justify-between items-center p-4 group" onClick={() => toggleItem(idx)} aria-expanded={openItems[idx]}>
                                <div className="text-text-dark text-sm font-medium group-hover:text-primary transition-colors pr-4">{item.q}</div>
                                {openItems[idx] ? <FaChevronUp className="text-primary flex-shrink-0" /> : <FaChevronDown className="text-primary flex-shrink-0" />}
                            </button>
                            {openItems[idx] && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                    <div className="px-4 pb-4">
                                        <Typography variant="body" className="text-gray-600">{item.a}</Typography>
                                        {item.cta && (
                                            <Link to={item.cta.link} className="inline-flex items-center gap-1 text-accent hover:text-primary text-xs font-medium mt-2">
                                                {item.cta.text} <FaArrowRight className="text-[10px]" />
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-5 text-center">
                    <Link to="/faq" className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1">{viewAllLabel} <FaArrowRight className="text-xs" /></Link>
                </div>
            </div>
        </motion.div>
    );
};

export default Wholesale;