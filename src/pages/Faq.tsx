import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    FaChevronDown,
    FaChevronUp,
    FaGlobe,
    FaTree,
    FaLeaf,
    FaMosque,
    FaIndustry,
    FaQuestion, FaArrowRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQTopic {
    id: string;
    icon: React.ReactNode;
    title: string;
    questions: FAQItem[];
}

const Faq: React.FC = () => {
    const { t } = useTranslation('faq');
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const [activeTopic, setActiveTopic] = useState<string>('general');
    const navigate = useNavigate();

    // Get all topics data from translations
    const getTopics = (): FAQTopic[] => [
        {
            id: 'general',
            icon: <FaGlobe className="mr-2" />,
            title: t('general.title'),
            questions: t('general.questions', { returnObjects: true }) as FAQItem[]
        },
        {
            id: 'farming',
            icon: <FaTree className="mr-2" />,
            title: t('farming.title'),
            questions: t('farming.questions', { returnObjects: true }) as FAQItem[]
        },
        {
            id: 'sustainability',
            icon: <FaLeaf className="mr-2" />,
            title: t('sustainability.title'),
            questions: t('sustainability.questions', { returnObjects: true }) as FAQItem[]
        },
        {
            id: 'islamic',
            icon: <FaMosque className="mr-2" />,
            title: t('islamic.title'),
            questions: t('islamic.questions', { returnObjects: true }) as FAQItem[]
        },
        {
            id: 'processing',
            icon: <FaIndustry className="mr-2" />,
            title: t('processing.title'),
            questions: t('processing.questions', { returnObjects: true }) as FAQItem[]
        },
        {
            id: 'quality',
            icon: <FaLeaf className="mr-2" />,
            title: t('quality.title'),
            questions: t('quality.questions', { returnObjects: true }) as FAQItem[]
        },
        {
            id: 'investment',
            icon: <FaIndustry className="mr-2" />,
            title: t('investment.title'),
            questions: t('investment.questions', { returnObjects: true }) as FAQItem[]
        },
        {
            id: 'leadership',
            icon: <FaGlobe className="mr-2" />,
            title: t('leadership.title'),
            questions: t('leadership.questions', { returnObjects: true }) as FAQItem[]
        },
        {
            id: 'finance',
            icon: <FaQuestion className="mr-2" />,
            title: t('finance.title'),
            questions: t('finance.questions', { returnObjects: true }) as FAQItem[]
        }
    ];

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const topics = getTopics();

    return (
        <main className="bg-afri-light">
            {/* Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[45vh] bg-gradient-to-b from-primary/20 to-background"
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
            <Section className="py-16 bg-background">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Removed Sidebar Navigation */}

                        {/* FAQ Content */}
                        <div className="w-full space-y-6">
                            {topics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 shadow-sm"
                                >
                                    <button
                                        onClick={() => setActiveTopic(prev => (prev === topic.id ? '' : topic.id))}
                                        className={`w-full flex justify-between items-center px-6 py-4 text-left rounded-t-xl ${
                                            activeTopic === topic.id ? 'bg-primary text-white': ''
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
                                            {topic.questions.map((item, index) => (
                                                <div key={`${topic.id}-${index}`}>
                                                    <button
                                                        className="w-full text-left flex justify-between items-center group py-2"
                                                        onClick={() => toggleSection(`${topic.id}-${index}`)}
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

                                                    <motion.div
                                                        initial={false}
                                                        animate={{
                                                            height: openSections[`${topic.id}-${index}`] ? 'auto' : 0,
                                                            opacity: openSections[`${topic.id}-${index}`] ? 1 : 0
                                                        }}
                                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pb-2 pl-1">
                                                            <Typography variant="body" className="text-text-dark leading-relaxed">
                                                                {item.answer}
                                                            </Typography>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Still have questions? */}
                            <div className="mt-12 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <Typography variant="h3" className="text-text-dark font-medium flex items-center">
                                        {t('stillQuestions.title')}
                                        <FaQuestion className="text-primary text-lg mr-3" />
                                    </Typography>
                                </div>
                                <Typography variant="body" className="text-text-dark mb-5 pl-8">
                                    {t('stillQuestions.content')}
                                </Typography>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group bg-primary hover:bg-dark-orange text-white hover:text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center mx-auto"
                                    onClick={() => navigate('/contact')}
                                >
                                    {t('stillQuestions.button')}
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
};

export default Faq;