import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {Link, useNavigate} from 'react-router-dom';
import {
    FaChevronDown,
    FaChevronUp,
    FaGlobe,
    FaMosque,
    FaIndustry,
    FaQuestion,
    FaArrowRight,
    FaBuilding,
    FaHandshake,
    FaChartLine,
    FaDownload,
    FaFileAlt,
    FaInfoCircle,
    FaSeedling,
    FaSearch,
    FaRecycle,
    FaShieldAlt,
    FaHandHoldingUsd,
    FaUsers, FaQuestionCircle, FaMobile, FaArrowDown, FaEnvelope
} from 'react-icons/fa';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from '@/components/Typography/Typography';
import { trackCtaClick, trackDownload, trackFormSubmission } from '@/utils/analytics';
import investorProspectus from '@/assets/documents/investor-prospectus.pdf';
import wholesalePriceList from '@/assets/documents/wholesale-price-list.pdf';
import certificationRoadmap from '@/assets/documents/certification-roadmap.pdf';
import faqHeroImage from '@/assets/images/faq-hero.webp';
import JsonLd from "@/components/Seo/JsonLd";
import { Helmet } from 'react-helmet-async';
import { InfoCard } from '@/components/InfoCard/InfoCard';

interface FAQItem {
    question: string;
    answer: string;
    audience?: string[];
    visualAid?: {
        type: 'image' | 'video';
        src: string;
        alt: string;
        caption?: string;
    };
    actions?: {
        contact?: boolean;
        download?: string;
        request?: string;
    };
}

interface FAQTopic {
    id: string;
    icon: React.ReactNode;
    title: string;
    questions: FAQItem[];
    audience?: string[];
}

const Faq: React.FC = () => {
    const { t } = useTranslation('faq');
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const [activeTopic, setActiveTopic] = useState<string>('');
    const [activeAudience, setActiveAudience] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [visibleTopics, setVisibleTopics] = useState<number>(5);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlAudience = params.get('audience');
        if (urlAudience && ['all', 'b2b', 'partners', 'investors', 'customers'].includes(urlAudience)) {
            setActiveAudience(urlAudience);
        }
    }, []);

    const audienceFilters = [
        { id: 'all', label: t('audience.all', 'All Users'), icon: <FaGlobe className="mr-1" /> },
        { id: 'b2b', label: t('audience.b2b', 'B2B/Wholesale'), icon: <FaBuilding className="mr-1" /> },
        { id: 'partners', label: t('audience.partners', 'Partners'), icon: <FaHandshake className="mr-1" /> },
        { id: 'investors', label: t('audience.investors', 'Investors'), icon: <FaChartLine className="mr-1" /> },
        { id: 'customers', label: t('audience.customers', 'Customers'), icon: <FaUsers className="mr-1" /> }
    ];

    const getTopics = (): FAQTopic[] => [
        { id: 'general', icon: <FaInfoCircle />, title: t('general.title'), questions: t('general.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'customers'] },
        { id: 'farming', icon: <FaSeedling />, title: t('farming.title'), questions: t('farming.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'b2b'] },
        { id: 'sustainability', icon: <FaRecycle />, title: t('sustainability.title'), questions: t('sustainability.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'b2b', 'investors'] },
        { id: 'islamic', icon: <FaMosque />, title: t('islamic.title'), questions: t('islamic.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'investors'] },
        { id: 'processing', icon: <FaIndustry />, title: t('processing.title'), questions: t('processing.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'b2b', 'partners'] },
        { id: 'quality', icon: <FaShieldAlt />, title: t('quality.title'), questions: t('quality.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'b2b'] },
        { id: 'investment', icon: <FaChartLine />, title: t('investment.title'), questions: t('investment.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'investors'] },
        { id: 'b2b', icon: <FaBuilding />, title: t('b2b.title'), questions: t('b2b.questions', { returnObjects: true }) as FAQItem[], audience: ['b2b', 'partners'] },
        { id: 'partners', icon: <FaHandshake />, title: t('partners.title'), questions: t('partners.questions', { returnObjects: true }) as FAQItem[], audience: ['partners'] },
        { id: 'leadership', icon: <FaUsers />, title: t('leadership.title'), questions: t('leadership.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'investors'] },
        { id: 'finance', icon: <FaHandHoldingUsd />, title: t('finance.title'), questions: t('finance.questions', { returnObjects: true }) as FAQItem[], audience: ['all', 'investors'] }
    ];

    const topics = getTopics();

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const handleKeyDown = (e: React.KeyboardEvent, topicId: string, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSection(`${topicId}-${index}`);
        }
    };

    const handleActionClick = (action: any, item?: FAQItem) => {
        switch (action.type) {
            case 'contact':
                navigate('/contact', { state: { subject: item?.question, audience: activeAudience !== 'all' ? activeAudience : undefined } });
                trackFormSubmission('faq_contact');
                break;
            case 'download':
                let pdfLink = action.link;
                if (pdfLink === 'Investor Prospectus') pdfLink = investorProspectus;
                else if (pdfLink === 'Certification Roadmap') pdfLink = certificationRoadmap;
                else if (pdfLink === 'Wholesale Price List') pdfLink = wholesalePriceList;
                window.open(pdfLink, '_blank');
                break;
            case 'request':
                navigate('/contact', { state: { subject: item?.question, audience: activeAudience !== 'all' ? activeAudience : undefined } });
                trackFormSubmission('faq_request');
                break;
        }
    };

    const filteredTopics = topics
        .filter(topic => activeAudience === 'all' || topic.audience?.includes(activeAudience) || topic.questions.some(q => !q.audience || q.audience.includes(activeAudience)))
        .filter(topic => topic.questions.some(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) || q.answer.toLowerCase().includes(searchTerm.toLowerCase())));

    const topQuestions = topics.find(t => t.id === 'general')?.questions.slice(0, 3) || [];

    const getButtonLabel = (item: FAQItem) => {
        if ((item as any).ctaLabelKey) return t((item as any).ctaLabelKey);
        if (item.actions?.download) {
            if (item.actions.download === 'Investor Prospectus') return t('cta.downloadInvestor');
            if (item.actions.download === 'Certification Roadmap') return t('cta.downloadCertification');
            if (item.actions.download === 'Wholesale Price List') return t('cta.downloadWholesale');
            return t('cta.downloadPdf');
        }
        if (item.actions?.contact || item.actions?.request) return t('cta.requestInfo');
        return '';
    };

    // Shared glassy card style
    const glassCard = "group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl transition-all duration-500 transform-gpu overflow-hidden";
    const glassEffects = (
        <>
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
        </>
    );

    return (
        <main>
            <Helmet>
                <title>Frequently Asked Questions | AfriNuts Export | Organic Cashews & Ethical Investment</title>
                <meta name="description" content="Get clear answers about our organic cashew farm in Odienné, Côte d'Ivoire. Learn about sustainability, processing plans, community impact, and how to partner with us." />
                <link rel="canonical" href="https://www.afrinutsexport.com/faq" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "name": "AfriNuts Export Frequently Asked Questions",
                "description": "Answers about organic cashew farming, sustainability, processing, and investment in Côte d'Ivoire.",
                "mainEntity": [{
                    "@type": "Question",
                    "name": "What is AfriNuts Export?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "AfriNuts Export is a family-owned cashew farm and future processing company based in Odienné, Ivory Coast. We grow organic cashews, plan to build a local processing facility, and reinvest 10% of our profits into community development."
                    }
                }]
            }} />
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[50vh]">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                    {/* Left: Text Content */}
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaQuestionCircle className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                            {t('hero.title')}
                        </motion.h1>

                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                            {t('hero.lead')}
                        </Typography>

                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard icon={FaQuestionCircle} title={t('hero.introTitle')} variant="accent" showInfoBadge={false}>
                                <Typography variant="small" className="text-gray-600">{t('hero.description')}</Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                            {[
                                { label: t('hero.badgeFarm'), icon: FaSeedling },
                                { label: t('hero.badgeTech'), icon: FaMobile },
                                { label: t('hero.badgeInvest'), icon: FaChartLine },
                                { label: t('hero.badgePartner'), icon: FaHandshake },
                            ].map((badge, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                    <badge.icon className="text-[10px]" /> {badge.label}
                                </span>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <button
                                onClick={() => {
                                    const firstTopic = document.querySelector('[class*="space-y-4"]');
                                    firstTopic?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaArrowDown className="text-xs" />{t('hero.ctaBrowse', 'Browse Questions')}
                            </button>
                            <Link to="/contact" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaEnvelope className="text-xs" />{t('hero.ctaContact', 'Still Have Questions?')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: FAQ Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-96 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[640px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={faqHeroImage} alt="Frequently Asked Questions" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">Got Questions?</span>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </Section>

            {/* FAQ Content */}
            <Section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Search */}
                    <motion.div className="mb-8" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <div className="relative max-w-xl mx-auto">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder={t('searchPlaceholder', 'Search questions...')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                   className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" />
                        </div>
                    </motion.div>

                    {/* Audience Filters */}
                    <motion.div className="mb-10" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <Typography variant="small" className="text-gray-500 mb-3 text-center">{t('filterBy', 'Filter by:')}</Typography>
                        <div className="flex flex-wrap justify-center gap-2">
                            {audienceFilters.map(filter => (
                                <motion.button key={filter.id} onClick={() => setActiveAudience(filter.id)}
                                               className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center backdrop-blur-sm ${
                                                   activeAudience === filter.id ? 'bg-primary text-white shadow-md' : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                                               }`}
                                               whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                    {filter.icon}{filter.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Top Questions */}
                    {activeAudience === 'all' && searchTerm === '' && (
                        <motion.div className={`${glassCard} p-6 mb-10`} style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                                    whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)', transition: { duration: 0.3 } }}>
                            {glassEffects}
                            <div className="relative z-10">
                                <Typography variant="h3" className="text-primary mb-6 flex items-center gap-2"><FaQuestion className="text-accent" />{t('topQuestions.title', 'Top Questions')}</Typography>
                                <div className="space-y-3">
                                    {topQuestions.map((item, index) => (
                                        <motion.div key={`top-${index}`}
                                                    className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden"
                                                    whileHover={{ y: -1 }}>
                                            <button className="w-full text-left flex justify-between items-center p-4 group"
                                                    onClick={() => toggleSection(`top-${index}`)} onKeyDown={e => handleKeyDown(e, 'top', index)}
                                                    aria-expanded={openSections[`top-${index}`]}>
                                                <Typography variant="h5" className="text-text-dark text-base font-medium group-hover:text-primary transition-colors pr-4">{item.question}</Typography>
                                                {openSections[`top-${index}`] ? <FaChevronUp className="text-primary flex-shrink-0" /> : <FaChevronDown className="text-primary flex-shrink-0" />}
                                            </button>
                                            <LazyMotion features={domAnimation}>
                                                <motion.div initial={false} animate={{ height: openSections[`top-${index}`] ? 'auto' : 0, opacity: openSections[`top-${index}`] ? 1 : 0 }}
                                                            transition={{ duration: 0.2 }} className="overflow-hidden">
                                                    <div className="px-4 pb-4"><Typography variant="body" className="text-gray-600">{item.answer}</Typography></div>
                                                </motion.div>
                                            </LazyMotion>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Topic Accordions */}
                    <div className="space-y-4">
                        {filteredTopics.slice(0, visibleTopics).map((topic) => (
                            <motion.div key={topic.id} className={glassCard} style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                                        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)', transition: { duration: 0.3 } }}>
                                {glassEffects}
                                <div className="relative z-10">
                                    <button onClick={() => setActiveTopic(prev => prev === topic.id ? '' : topic.id)}
                                            className={`w-full flex justify-between items-center px-6 py-4 text-left rounded-2xl transition-all ${
                                                activeTopic === topic.id ? 'bg-primary text-white rounded-b-none' : 'hover:bg-white/30'
                                            }`}>
                                        <div className="flex items-center gap-3 text-lg font-semibold">
                                            <span className={`${activeTopic === topic.id ? 'text-white' : 'text-accent'}`}>{topic.icon}</span>
                                            {topic.title}
                                        </div>
                                        <span className={`text-sm px-3 py-1 rounded-full ${activeTopic === topic.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                            {topic.questions.length}
                                        </span>
                                    </button>

                                    {activeTopic === topic.id && (
                                        <div className="px-4 pb-4 space-y-3">
                                            {topic.questions
                                                .filter(q => !q.audience || q.audience.includes(activeAudience) || activeAudience === 'all')
                                                .filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) || q.answer.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .map((item, index) => (
                                                    <motion.div key={`${topic.id}-${index}`}
                                                                className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden"
                                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                                                                whileHover={{ y: -1 }}>
                                                        <button className="w-full text-left flex justify-between items-center p-4 group"
                                                                onClick={() => toggleSection(`${topic.id}-${index}`)} onKeyDown={e => handleKeyDown(e, topic.id, index)}
                                                                aria-expanded={openSections[`${topic.id}-${index}`]}>
                                                            <Typography variant="h5" className="text-text-dark text-sm font-medium group-hover:text-primary transition-colors pr-4">{item.question}</Typography>
                                                            {openSections[`${topic.id}-${index}`] ? <FaChevronUp className="text-primary flex-shrink-0" /> : <FaChevronDown className="text-primary flex-shrink-0" />}
                                                        </button>
                                                        <LazyMotion features={domAnimation}>
                                                            <motion.div initial={false} animate={{ height: openSections[`${topic.id}-${index}`] ? 'auto' : 0, opacity: openSections[`${topic.id}-${index}`] ? 1 : 0 }}
                                                                        transition={{ duration: 0.2 }} className="overflow-hidden">
                                                                <div className="px-4 pb-4">
                                                                    <Typography variant="body" className="text-gray-600 mb-3">{item.answer}</Typography>
                                                                    {(item.actions?.contact || item.actions?.download || item.actions?.request) && (
                                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                            {item.actions?.contact && (
                                                                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                                                               className="px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-dark-orange transition-colors flex items-center shadow-sm"
                                                                                               onClick={() => handleActionClick({ type: 'contact' }, item)}>
                                                                                    <FaFileAlt className="mr-1.5" />{getButtonLabel(item)}
                                                                                </motion.button>
                                                                            )}
                                                                            {item.actions?.download && !["What certifications do you have?", "Do you provide sustainability audits?", "Are your products traceable?", "What is your approach to ESG?"].includes(item.question) && (
                                                                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                                                               className="px-4 py-2 bg-accent text-white rounded-full text-xs font-medium hover:bg-orange-700 transition-colors flex items-center shadow-sm"
                                                                                               onClick={() => {
                                                                                                   trackDownload(item.actions?.download || 'faq_document');
                                                                                                   handleActionClick({ type: 'download', link: item.actions?.download }, item);
                                                                                               }}>
                                                                                    <FaDownload className="mr-1.5" />{getButtonLabel(item)}
                                                                                </motion.button>
                                                                            )}
                                                                            {item.actions?.request && (
                                                                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                                                               className="px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-dark-orange transition-colors flex items-center shadow-sm"
                                                                                               onClick={() => handleActionClick({ type: 'request', link: item.actions?.request }, item)}>
                                                                                    <FaFileAlt className="mr-1.5" />{getButtonLabel(item)}
                                                                                </motion.button>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        </LazyMotion>
                                                    </motion.div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Load More */}
                    {visibleTopics < filteredTopics.length && (
                        <div className="text-center mt-8">
                            <motion.button onClick={() => setVisibleTopics(prev => prev + 3)}
                                           className="px-6 py-3 bg-white/60 backdrop-blur-md text-gray-700 rounded-full hover:bg-white/80 transition-all shadow-md border border-gray-200 text-sm font-medium"
                                           whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                {t('loadMore', 'Load More Topics')}
                            </motion.button>
                        </div>
                    )}

                    {/* Still Have Questions CTA */}
                    <motion.div className="mt-12 max-w-lg mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <motion.div className={`${glassCard} p-8 text-center`} style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ y: -6, scale: 1.02, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)', transition: { duration: 0.3 } }}>
                            {glassEffects}
                            <div className="relative z-10">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-accent/20 p-4 rounded-full"><FaQuestion className="text-accent text-2xl" /></div>
                                </div>
                                <Typography variant="h3" className="text-primary mb-3">{t('stillQuestions.title')}</Typography>
                                <Typography variant="body" className="text-gray-600 mb-6">{t('stillQuestions.content')}</Typography>
                                <motion.button onClick={() => {
                                    trackCtaClick('still_questions', 'faq_page');
                                    navigate('/contact');
                                }}
                                               className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-md"
                                               whileHover={{ y: -2, scale: 1.03, boxShadow: '0 10px 25px -5px rgba(165,105,66,0.4)' }} whileTap={{ scale: 0.95 }}>
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                    <span className="relative z-10 flex items-center gap-2">{t('stillQuestions.button')}<FaArrowRight /></span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default Faq;