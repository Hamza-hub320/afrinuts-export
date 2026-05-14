import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
    FaUsers
} from 'react-icons/fa';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
// PDF assets
import investorProspectus from '@/assets/documents/investor-prospectus.pdf';
import wholesalePriceList from '@/assets/documents/wholesale-price-list.pdf';
import certificationRoadmap from '@/assets/documents/certification-roadmap.pdf';
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

    // Phase 1: On mount, detect URL query param "audience" and set activeAudience
    useEffect(() => {
        // Parse query parameter
        const params = new URLSearchParams(window.location.search);
        const urlAudience = params.get('audience');
        if (urlAudience && ['all', 'b2b', 'partners', 'investors', 'customers'].includes(urlAudience)) {
            setActiveAudience(urlAudience);
        } else {
            // Optionally: Detect document.referrer for pre-selecting audience
            const ref = document.referrer;
            if (ref) {
                // Example: If referrer contains "investor", set audience to investors, etc.
                if (/investor/i.test(ref)) setActiveAudience('investors');
                else if (/partner/i.test(ref)) setActiveAudience('partners');
                else if (/b2b|wholesale/i.test(ref)) setActiveAudience('b2b');
                else if (/customer/i.test(ref)) setActiveAudience('customers');
                // else keep 'all'
            }
        }
    }, []);

    // Audience filter options
    const audienceFilters = [
        { id: 'all', label: t('audience.all', 'All Users'), icon: <FaGlobe className="mr-1" /> },
        { id: 'b2b', label: t('audience.b2b', 'B2B/Wholesale'), icon: <FaBuilding className="mr-1" /> },
        { id: 'partners', label: t('audience.partners', 'Partners'), icon: <FaHandshake className="mr-1" /> },
        { id: 'investors', label: t('audience.investors', 'Investors'), icon: <FaChartLine className="mr-1" /> },
        { id: 'customers', label: t('audience.customers', 'Customers'), icon: <FaUsers className="mr-1" /> }
    ];

    // Get all topics data from translations
    const getTopics = (): FAQTopic[] => [
        {
            id: 'general',
            icon: <FaInfoCircle className="mr-2" />,
            title: t('general.title'),
            questions: t('general.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'customers']
        },
        {
            id: 'farming',
            icon: <FaSeedling className="mr-2" />,
            title: t('farming.title'),
            questions: t('farming.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'b2b']
        },
        {
            id: 'sustainability',
            icon: <FaRecycle className="mr-2" />,
            title: t('sustainability.title'),
            questions: t('sustainability.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'b2b', 'investors']
        },
        // Removed 'certifications' topic from the topics array
        {
            id: 'islamic',
            icon: <FaMosque className="mr-2" />,
            title: t('islamic.title'),
            questions: t('islamic.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'investors']
        },
        {
            id: 'processing',
            icon: <FaIndustry className="mr-2" />,
            title: t('processing.title'),
            questions: t('processing.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'b2b', 'partners']
        },
        {
            id: 'quality',
            icon: <FaShieldAlt className="mr-2" />,
            title: t('quality.title'),
            questions: t('quality.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'b2b']
        },
        {
            id: 'investment',
            icon: <FaChartLine className="mr-2" />,
            title: t('investment.title'),
            questions: t('investment.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'investors']
        },
        {
            id: 'b2b',
            icon: <FaBuilding className="mr-2" />,
            title: t('b2b.title'),
            questions: t('b2b.questions', { returnObjects: true }) as FAQItem[],
            audience: ['b2b', 'partners']
        },
        {
            id: 'partners',
            icon: <FaHandshake className="mr-2" />,
            title: t('partners.title'),
            questions: t('partners.questions', { returnObjects: true }) as FAQItem[],
            audience: ['partners']
        },
        {
            id: 'leadership',
            icon: <FaUsers className="mr-2" />,
            title: t('leadership.title'),
            questions: t('leadership.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'investors']
        },
        {
            id: 'finance',
            icon: <FaHandHoldingUsd className="mr-2" />,
            title: t('finance.title'),
            questions: t('finance.questions', { returnObjects: true }) as FAQItem[],
            audience: ['all', 'investors']
        }
    ];

    // Move topics above useEffect for structured data
    const topics = getTopics();

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));

        // Track this event in your analytics
        if (!openSections[sectionId]) {
            // This is an open event
            const [topicId, questionIndex] = sectionId.split('-');
            const topicTitle = topics.find(t => t.id === topicId)?.title;
            const question = topics.find(t => t.id === topicId)?.questions[parseInt(questionIndex)]?.question;

            // Send to analytics (replace with your actual tracking function)
            console.log('FAQ opened:', topicTitle, question);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, topicId: string, index: number) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSection(`${topicId}-${index}`);
        }
    };

    // Phase 4: Conversion-oriented enhancements
    const handleActionClick = (action: any, item?: FAQItem) => {
        switch (action.type) {
            case 'contact':
                // Example: Pass pre-filled subject based on question
                navigate('/contact', {
                    state: {
                        subject: item?.question || undefined,
                        audience: activeAudience !== 'all' ? activeAudience : undefined
                    }
                });
                break;
            case 'download':
                // Download PDF - map descriptive titles to correct PDF assets
                let pdfLink = action.link;
                if (pdfLink === 'Investor Prospectus') {
                    pdfLink = investorProspectus;
                } else if (pdfLink === 'Certification Roadmap') {
                    pdfLink = certificationRoadmap;
                } else if (pdfLink === 'Wholesale Price List') {
                    pdfLink = wholesalePriceList;
                }
                window.open(pdfLink, '_blank');
                break;
            case 'request':
                // Now navigates to /contact with subject and audience as state
                navigate('/contact', {
                    state: {
                        subject: item?.question || undefined,
                        audience: activeAudience !== 'all' ? activeAudience : undefined
                    }
                });
                break;
            default:
                break;
        }
    };

    const showMoreTopics = () => {
        setVisibleTopics(prev => prev + 3);
    };

    // Visual Aid Component (Phase 3: Visual Storytelling)
    const VisualAid = ({ type, src, alt, caption }: {
        type: 'image' | 'video';
        src: string;
        alt: string;
        caption?: string;
    }) => {
        return (
            <div className="my-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/30">
                {type === 'image' && <img src={src} alt={alt} className="w-full h-auto rounded-md max-h-64 object-contain" />}
                {type === 'video' && (
                    <video controls className="w-full rounded-md">
                        <source src={src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
                {caption && <p className="text-sm text-gray-600 mt-2 text-center">{caption}</p>}
            </div>
        );
    };

    // Add FAQ structured data for SEO
    useEffect(() => {
        const faqStructuredData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": topics.flatMap(topic =>
                topic.questions.map(question => ({
                    "@type": "Question",
                    "name": question.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": question.answer
                    }
                }))
            )
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(faqStructuredData);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [topics]);

    // Filter topics based on selected audience and search term
    const filteredTopics = (activeAudience === 'all' ? topics : topics.filter(topic =>
        topic.audience?.includes(activeAudience) ||
        topic.questions.some(q => !q.audience || q.audience.includes(activeAudience))
    ))
        .filter(topic =>
            topic.questions.some(q =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

    // Get top questions (first 3 from general category)
    const topQuestions = topics
        .find(topic => topic.id === 'general')?.questions
        .slice(0, 3) || [];

    // Helper function for CTA button label translation
    const getButtonLabel = (item: FAQItem) => {
        if ((item as any).ctaLabelKey) return t((item as any).ctaLabelKey);

        if (item.actions?.download) {
            switch (item.actions.download) {
                case 'Investor Prospectus':
                    return t('cta.downloadInvestor');
                case 'Certification Roadmap':
                    return t('cta.downloadCertification');
                case 'Wholesale Price List':
                    return t('cta.downloadWholesale');
                default:
                    return t('cta.downloadPdf');
            }
        }

        if (item.actions?.contact || item.actions?.request) {
            // Use downloadCertification and downloadWholesale if request is for those
            if (item.actions?.request === 'Certification Roadmap') {
                return t('cta.downloadCertification');
            }
            if (item.actions?.request === 'Wholesale Price List') {
                return t('cta.downloadWholesale');
            }
            return t('cta.requestInfo');
        }

        return '';
    };

    return (
        <main>
            {/* Hero Section */}
            <Section
                fullHeight={false}
                className="flex items-center justify-center text-center min-h-[40vh] bg-gradient-to-b from-primary/10 to-transparent"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="subhead"
                            className="uppercase tracking-widest text-primary mb-4"
                        >
                            {t('hero.subtitle')}
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        {t('hero.title')}
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="lead"
                            className="text-text-dark max-w-3xl mx-auto"
                        >
                            {t('hero.description')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* FAQ Content */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Certifications Section */}
                    <InfoCard
                        icon={FaShieldAlt}
                        title={t('certifications.title')}
                        variant="primary"
                        className="mb-8 max-w-3xl mx-auto"
                        hideIconContainer={false}
                    >
                        <ul className="list-disc list-inside space-y-2 text-text-dark mt-4">
                            {t('certifications.list', { returnObjects: true }).map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </InfoCard>
                </div>

                    {/* Search Bar */}
                    <motion.div
                        className="mb-8"
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="relative max-w-xl mx-auto">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder', 'Search questions...')}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm bg-white/80"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </motion.div>

                    {/* Audience Filter Tabs */}
                    <motion.div
                        className="mb-8"
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Typography variant="h4" className="mb-4 text-text-dark">
                            {t('filterBy', 'Filter by:')}
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                            {audienceFilters.map(filter => (
                                <motion.button
                                    key={filter.id}
                                    onClick={() => setActiveAudience(filter.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center transform-gpu hover:scale-105 ${
                                        activeAudience === filter.id
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-background backdrop-blur-sm text-text-dark hover:bg-gray-100 shadow-md'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {filter.icon}
                                    {filter.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Top Questions Section */}
                    {activeAudience === 'all' && searchTerm === '' && (
                        <motion.div
                            className="mb-12 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 rounded-2xl p-6 transform-gpu"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            whileHover={{
                                y: -5,
                                rotateY: 2,
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* 3D edge effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                            {/* Glassy overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <Typography variant="h3" className="text-text-dark mb-6 flex items-center">
                                    <FaQuestion className="text-primary mr-3" />
                                    {t('topQuestions.title', 'Top Questions')}
                                </Typography>
                                <div className="space-y-4">
                                    {topQuestions.map((item, index) => (
                                        <motion.div
                                            key={`top-${index}`}
                                            className="bg-background backdrop-blur-sm p-4 rounded-lg border border-white/30 shadow-sm"
                                            whileHover={{ y: -2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <button
                                                className="w-full text-left flex justify-between items-center group"
                                                onClick={() => toggleSection(`top-${index}`)}
                                                onKeyDown={(e) => handleKeyDown(e, 'top', index)}
                                                aria-expanded={openSections[`top-${index}`]}
                                                aria-controls={`answer-top-${index}`}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    className="text-text-dark text-base font-medium group-hover:text-primary transition-colors"
                                                >
                                                    {item.question}
                                                </Typography>
                                                {openSections[`top-${index}`] ? (
                                                    <FaChevronUp className="text-primary ml-4 flex-shrink-0" />
                                                ) : (
                                                    <FaChevronDown className="text-primary ml-4 flex-shrink-0 group-hover:text-primary transition-colors" />
                                                )}
                                            </button>

                                            <LazyMotion features={domAnimation}>
                                                <motion.div
                                                    id={`answer-top-${index}`}
                                                    role="region"
                                                    aria-labelledby={`question-top-${index}`}
                                                    initial={false}
                                                    animate={{
                                                        height: openSections[`top-${index}`] ? 'auto' : 0,
                                                        opacity: openSections[`top-${index}`] ? 1 : 0
                                                    }}
                                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-2 pb-1">
                                                        {/* Phase 3: Visual storytelling - allow images/timelines in answers */}
                                                        <Typography variant="body" className="text-text-dark leading-relaxed mb-2">
                                                            {item.answer}
                                                        </Typography>
                                                        {/* Visual Aid (image or video) */}
                                                        {item.visualAid && (
                                                            <VisualAid
                                                                type={item.visualAid.type}
                                                                src={item.visualAid.src}
                                                                alt={item.visualAid.alt}
                                                                caption={item.visualAid.caption}
                                                            />
                                                        )}
                                                        {/* Placeholder: Step-by-step numbered list */}
                                                        {Array.isArray((item as any).steps) && (item as any).steps.length > 0 && (
                                                            <ol className="list-decimal ml-6 my-4">
                                                                {(item as any).steps.map((step: string, idx: number) => (
                                                                    <li key={idx} className="mb-2">{step}</li>
                                                                ))}
                                                            </ol>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </LazyMotion>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* FAQ Content */}
                        <div className="w-full space-y-6">
                            {filteredTopics.slice(0, visibleTopics).map((topic) => (
                                <motion.div
                                    key={topic.id}
                                    className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 shadow-lg transform-gpu"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                    whileHover={{
                                        y: -5,
                                        rotateY: 2,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    {/* 3D edge effect */}
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                                    {/* Glassy overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                                    <div className="relative z-10">
                                        <button
                                            onClick={() => setActiveTopic(prev => (prev === topic.id ? '' : topic.id))}
                                            className={`w-full flex justify-between items-center px-6 py-4 text-left rounded-t-2xl ${
                                                activeTopic === topic.id ? 'bg-primary text-white' : ''
                                            }`}
                                        >
                                            <div className="flex items-center text-lg font-semibold">
                                                {topic.icon}
                                                <span className="ml-2">{topic.title}</span>
                                            </div>
                                            <span className="text-sm bg-primary/10 text-primary-dark px-2 py-1 rounded">
                                                {topic.questions.length}
                                            </span>
                                        </button>

                                        {activeTopic === topic.id && (
                                            <div className="px-6 pb-4 space-y-4">
                                                {topic.questions
                                                    .filter(q => !q.audience || q.audience.includes(activeAudience) || activeAudience === 'all')
                                                    .filter(q =>
                                                        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
                                                    )
                                                    .map((item, index) => (
                                                        <motion.div
                                                            key={`${topic.id}-${index}`}
                                                            className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0 bg-white/50 backdrop-blur-sm rounded-lg p-4"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                        >
                                                            <button
                                                                className="w-full text-left flex justify-between items-center group py-2"
                                                                onClick={() => toggleSection(`${topic.id}-${index}`)}
                                                                onKeyDown={(e) => handleKeyDown(e, topic.id, index)}
                                                                aria-expanded={openSections[`${topic.id}-${index}`]}
                                                                aria-controls={`answer-${topic.id}-${index}`}
                                                            >
                                                                <Typography
                                                                    variant="h5"
                                                                    className="text-text-dark text-base font-medium group-hover:text-primary transition-colors"
                                                                >
                                                                    {item.question}
                                                                </Typography>
                                                                {openSections[`${topic.id}-${index}`] ? (
                                                                    <FaChevronUp className="text-primary ml-4 flex-shrink-0" />
                                                                ) : (
                                                                    <FaChevronDown className="text-primary ml-4 flex-shrink-0 group-hover:text-primary transition-colors" />
                                                                )}
                                                            </button>

                                                            <LazyMotion features={domAnimation}>
                                                                <motion.div
                                                                    id={`answer-${topic.id}-${index}`}
                                                                    role="region"
                                                                    aria-labelledby={`question-${topic.id}-${index}`}
                                                                    initial={false}
                                                                    animate={{
                                                                        height: openSections[`${topic.id}-${index}`] ? 'auto' : 0,
                                                                        opacity: openSections[`${topic.id}-${index}`] ? 1 : 0
                                                                    }}
                                                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="pb-2 pl-1">
                                                                        <Typography variant="body" className="text-text-dark leading-relaxed mb-3">
                                                                            {item.answer}
                                                                        </Typography>

                                                                        {(item.actions?.contact || item.actions?.download || item.actions?.request) && (
                                                                            <div className="mt-4 flex flex-wrap gap-2">
                                                                                {item.actions?.contact && (
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.05 }}
                                                                                        whileTap={{ scale: 0.95 }}
                                                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center shadow-md"
                                                                                        onClick={() => handleActionClick({ type: 'request', link: item.actions?.request }, item)}
                                                                                    >
                                                                                        <FaFileAlt className="mr-2" />
                                                                                        {getButtonLabel(item)}
                                                                                    </motion.button>
                                                                                )}
                                                                                {/* Remove Download PDF button for specific questions */}
                                                                                {item.actions?.download && (
                                                                                    (() => {
                                                                                        const removedDownloadQuestions = [
                                                                                            "What certifications do you have?",
                                                                                            "Do you provide sustainability audits?",
                                                                                            "Are your products traceable?",
                                                                                            "What is your approach to ESG?"
                                                                                        ];
                                                                                        if (!removedDownloadQuestions.includes(item.question)) {
                                                                                            return (
                                                                                                <motion.button
                                                                                                    whileHover={{ scale: 1.05 }}
                                                                                                    whileTap={{ scale: 0.95 }}
                                                                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center shadow-md"
                                                                                                    onClick={() => handleActionClick({ type: 'download', link: item.actions?.download }, item)}
                                                                                                >
                                                                                                    <FaDownload className="mr-2" />
                                                                                                    {getButtonLabel(item)}
                                                                                                </motion.button>
                                                                                            );
                                                                                        }
                                                                                        return null;
                                                                                    })()
                                                                                )}
                                                                                {item.actions?.request && (
                                                                                    <motion.button
                                                                                        whileHover={{ scale: 1.05 }}
                                                                                        whileTap={{ scale: 0.95 }}
                                                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center shadow-md"
                                                                                        onClick={() => handleActionClick({ type: 'request', link: item.actions?.request }, item)}
                                                                                    >
                                                                                        <FaFileAlt className="mr-2" />
                                                                                        {getButtonLabel(item)}
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

                            {visibleTopics < filteredTopics.length && (
                                <div className="text-center mt-8">
                                    <motion.button
                                        onClick={showMoreTopics}
                                        className="px-6 py-3 bg-background backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-md transform-gpu hover:scale-105"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {t('loadMore', 'Load More Topics')}
                                    </motion.button>
                                </div>
                            )}

                            {/* Still have questions? */}
                            <motion.div
                                className="mt-12 relative max-w-md mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl p-6 text-center transform-gpu"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                whileHover={{
                                    y: -5,
                                    scale: 1.02,
                                    rotateY: 2,
                                    boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {/* 3D edge effect */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                                {/* Glassy overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                                {/* Inner shadow effect */}
                                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                {/* Subtle background pattern */}
                                <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="flex items-center justify-center mb-3">
                                        <Typography variant="h3" className="text-text-dark font-medium flex items-center justify-center">
                                            <FaQuestion className="text-primary text-lg mr-3" />
                                            {t('stillQuestions.title')}
                                        </Typography>
                                    </div>
                                    <Typography variant="body" className="text-text-dark mb-5">
                                        {t('stillQuestions.content')}
                                    </Typography>
                                    <div className="flex justify-center">
                                        <motion.button
                                            className="group relative bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md transform-gpu hover:scale-105"
                                            style={{
                                                transformStyle: 'preserve-3d',
                                            }}
                                            whileHover={{
                                                y: -2,
                                                boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)',
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/contact')}
                                        >
                                            {/* Button 3D edge effect */}
                                            <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-300" />

                                            {/* Button glassy overlay */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                                            <div className="relative z-10 flex items-center justify-center">
                                                {t('stillQuestions.button')}
                                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
            </Section>
        </main>
    );
};

export default Faq;