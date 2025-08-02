import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/Typography/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import { InfoCard } from "../components/InfoCard/InfoCard";
import FAQAccordion from '../components/FAQAccordion';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: any[];
  category: string;
  order?: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface StrapiResponse {
    data: FAQItem[];
    meta: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

const FAQ: React.FC = () => {
    const { t } = useTranslation('faq');
    const [searchTerm, setSearchTerm] = useState('');
    const [faqData, setFaqData] = useState<Record<string, FAQItem[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openItems, setOpenItems] = useState<Record<string, number | null>>({});

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const apiUrl = `${import.meta.env.VITE_STRAPI_URL}/api/faqs?populate=*`;
                console.log('Fetching FAQs from:', apiUrl);

                const response = await fetch(apiUrl);

                const result = await response.json();
                const rawFAQs = result.data;

                console.log('API response data:', rawFAQs);

                const grouped = rawFAQs.reduce((acc: Record<string, FAQItem[]>, item: any) => {
                    const category = item.category || 'Uncategorized';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(item);
                    return acc;
                }, {});

                setFaqData(grouped);
            } catch (err) {
                console.error('Full fetch error:', err);
                setError(`Failed to load FAQs. ${err instanceof Error ? err.message : 'Unknown error'}`);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQs();
    }, []);


    const toggleItem = (category: string, id: number) => {
        setOpenItems(prev => ({
            ...prev,
            [category]: prev[category] === id ? null : id
        }));
    };

    const filteredData = Object.entries(faqData)
        .map(([category, items]) => ({
            category,
            items: items.filter(item =>
                item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                JSON.stringify(item.answer).toLowerCase().includes(searchTerm.toLowerCase())
            )
        }))
        .filter(({ items }) => items.length > 0);

    if (loading) {
        return (
            <div className="text-center py-16">
                <Typography variant="h2" className="mb-4">{t('loading')}</Typography>
                <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-6 bg-gray-200 rounded w-4/6"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-16">
                <Typography variant="h2" className="mb-4 text-red-500">{t('errorTitle')}</Typography>
                <Typography variant="body" className="text-text-dark max-w-2xl mx-auto">
                    {error}
                </Typography>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-primary hover:bg-dark-orange text-white px-6 py-2 rounded-full"
                >
                    {t('tryAgain')}
                </button>
            </div>
        );
    }

    if (Object.keys(faqData).length === 0) {
        return (
            <div className="text-center py-16">
                <Typography variant="h2" className="mb-4">{t('noFaqsTitle')}</Typography>
                <Typography variant="body" className="text-text-dark max-w-2xl mx-auto">
                    {t('noFaqsDescription')}
                </Typography>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-40 pb-16 max-w-6xl">
            <div className="text-center mb-16">
                <Typography variant="h1" className="mb-4 text-primary">
                    {t('pageTitle')}
                </Typography>
                <Typography variant="subtitle" className="text-text-dark max-w-3xl mx-auto">
                    {t('pageSubtitle')}
                </Typography>
            </div>

            <div className="mb-8 mx-auto max-w-2xl relative">
                <div className="relative">
                    <label htmlFor="faq-search" className="sr-only">
                        {t('searchAriaLabel')}
                    </label>
                    <input
                        id="faq-search"
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        aria-label={t('searchAriaLabel')}
                        className="w-full px-4 py-3 pl-10 border border-warm-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-grey" />
                </div>
            </div>

            {filteredData.length === 0 ? (
                <div className="text-center py-12">
                    <Typography variant="h3" className="text-text-dark mb-4">
                        {t('noResultsTitle')}
                    </Typography>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="text-accent hover:underline"
                    >
                        {t('clearSearch')}
                    </button>
                </div>
            ) : (
                filteredData.map(({ category, items }) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-warm-grey mb-8"
                    >
                      <div className="bg-primary/10 p-6 border-b border-warm-grey">
                        <Typography variant="h3" className="text-primary">
                          {category}
                        </Typography>
                      </div>

                      <div className="p-6">
                        <FAQAccordion
                          items={items.map((faq) => ({
                            id: faq.id,
                            question: faq.question,
                            answer: faq.answer
                              ?.map((block) => {
                                if (block.type === 'paragraph') {
                                  return block.children.map((child: any) => child.text).join('');
                                }
                                if (block.type === 'heading') {
                                  return `\n\n${block.children[0].text}\n\n`;
                                }
                                if (block.type === 'list') {
                                  return block.children
                                    .map((item: any) => `• ${item.children[0].text}`)
                                    .join('\n');
                                }
                                return '';
                              })
                              .join('\n\n') || ''
                          }))}
                        />
                      </div>
                    </motion.div>
                ))
            )}

            <div className="mt-16 text-center">
                <Typography variant="h4" className="mb-4 text-primary">
                    {t('contactTitle')}
                </Typography>
                <Typography variant="body" className="mb-6 text-text-dark max-w-2xl mx-auto">
                    {t('contactSubtitle')}
                </Typography>
                <Link to="/contact">
                    <button className="bg-primary hover:bg-dark-orange text-white px-8 py-3 rounded-full transition-colors duration-300">
                        {t('contactButton')}
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default FAQ;