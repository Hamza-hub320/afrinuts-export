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
                fullHeight={false}
                className="bg-cashew-gradient flex items-end justify-start py-20 text-center min-h-[50vh] md:min-h-[15vh] pb-24 pr-16 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 mt-32 pt-24 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
            >
                <motion.div
                    className="max-w-4xl w-full px-6"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-6 text-center"
                        variants={fadeIn}
                    >
                        {t('hero.title')}
                    </motion.h1>
                    <motion.div variants={fadeIn} className="text-center">
                        <Typography variant="subtitle" className="text-primary-dark max-w-2xl mx-auto">
                            {t('hero.subtitle')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* FAQ Content */}
            <Section className="py-16">
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