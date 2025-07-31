import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaNewspaper, FaGlobe, FaBullhorn, FaFilter, FaSearch } from 'react-icons/fa';

import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import newsHeroImage from '../assets/images/news-hero.webp';
import landClearingImage from '@/assets/images/land-clearing.webp';
import signingImage from '@/assets/images/partnership-signing.webp';
import afrinutsUpdatesData from '@/data/afrinutsUpdates.json';
import newsConfig from '@/data/newsConfig.json';
import newsFeeds from '@/data/newsFeeds.json';
import newsImage from "@/assets/images/news.webp";

interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet?: string;
    creator?: string;
    source: string;
    category: string;
    searchBoost: number;
    guid?: string;
    isoDate?: string;
    enclosure?: {
        url?: string;
        length?: string;
        type?: string;
    };

}

interface NewsTab {
    id: string;
    label: string;
    icon: string;
}

interface NewsFilter {
    id: string;
    label: string;
    icon: string;
}

interface AfriNutsUpdate {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    image?: string;
    tags: string[];
    author?: string;
    isFeatured?: boolean;
    translationKeys?: {
        title?: string;
        excerpt?: string;
    };
}

interface NewsFeed {
    url: string;
    name: string;
    icon: string;
    category: string;
    defaultEnabled?: boolean;
    refreshInterval?: number;
    searchTerms?: string[];
}

const News: React.FC = () => {
    const { t } = useTranslation('news');
    const [articles, setArticles] = useState<RSSItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>(newsConfig.page.sections.tabs[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const {
        page: {
            title: pageTitle,
            subtitle: pageSubtitle,
            sections: {
                hero,
                tabs,
                filters,
                newsletter
            }
        }
    } = newsConfig;

    const afrinutsUpdates: AfriNutsUpdate[] = afrinutsUpdatesData.updates;
    const rssFeeds: NewsFeed[] = newsFeeds.feeds;
    const rssLimit = newsFeeds.defaultLimit || 15;


    const loadFeeds = async () => {
        setLoading(true);
        try {
            const enabledFeeds = rssFeeds.filter(feed =>
                feed.defaultEnabled !== false
            );

            const feedsToUse = enabledFeeds.length > 0 ? enabledFeeds : [
                {
                    url: "https://www.commodafrica.com/rss.xml",
                    name: "CommodAfrica",
                    category: "cashew",
                    icon: "FaGlobe"
                },
                {
                    url: "https://www.foodnavigator-africa.com/feeds/news.rss",
                    name: "Food Navigator Africa",
                    category: "agriculture",
                    icon: "FaLeaf"
                }
            ];

            const allArticles = await Promise.all(
                feedsToUse.map(async (feed) => {
                    try {
                        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
                        const data = await res.json();
                        if (!data.items) return [];

                        const feedArticles = data.items.map((item: any): RSSItem => {
                            const content = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();
                            const searchBoost =
                                (content.includes('cashew') || content.includes('ivory coast') || content.includes("côte d'ivoire"))
                                    ? 2 : 1;

                            return {
                                title: item.title,
                                link: item.link || '#',
                                pubDate: item.pubDate || new Date().toISOString(),
                                contentSnippet: item.contentSnippet?.substring(0, 200) || item.description?.substring(0, 200) || '',
                                creator: item.author || feed.name,
                                source: feed.name,
                                category: feed.category,
                                searchBoost,
                                guid: item.guid,
                                isoDate: item.isoDate
                            };
                        });
                        // Debug: log how many articles fetched from this feed
                        console.log(`[${feed.name}] Articles fetched: ${feedArticles.length}`);
                        return feedArticles;
                    } catch (error) {
                        console.error(`Failed to fetch ${feed.name}:`, error);
                        return [];
                    }
                })
            );

            // After flattening, log total articles collected
            console.log(`Total articles collected: ${allArticles.flat().length}`);

            const processedArticles = allArticles
                .flat()
                .filter(article => {
                    const content = `${article.title} ${article.contentSnippet}`.toLowerCase();
                    const articleDate = new Date(article.pubDate);
                    const now = new Date();
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(now.getDate() - 7);

                    const isRecent = articleDate >= sevenDaysAgo;

                    // Expanded keywords: Arabic, French, English
                    const keywords = [
                        'cashew', 'ivory coast', "côte d'ivoire", 'anacardium', 'nut', 'export',
                        'farmer', 'crop', 'agribusiness',
                        'كاجو', 'ساحل العاج', 'الزراعة', 'المزارع', 'تصدير',
                        'noix de cajou', 'agriculture', 'ferme', 'cultures', 'exportation'
                    ];

                    const matched = keywords.some(keyword => content.includes(keyword));

                    if (isRecent && matched) {
                        // Print matched article with feed/source
                        console.log(`[${article.source}] Matched article: ${article.title}`);
                    }

                    return isRecent && matched;
                })
                .sort((a, b) => {
                    const boostDiff = b.searchBoost - a.searchBoost;
                    if (boostDiff !== 0) return boostDiff;
                    const dateA = new Date(a.pubDate).getTime();
                    const dateB = new Date(b.pubDate).getTime();
                    return dateB - dateA;
                })
                .slice(0, rssLimit);

            setArticles(processedArticles);

            if (processedArticles.length === 0) {
                const fallbackArticles = await fetchFallbackNews();
                setArticles(fallbackArticles);
            }

        } catch (error) {
            console.error('News fetch failed:', error);
            const fallbackArticles = await fetchFallbackNews();
            setArticles(fallbackArticles);
        } finally {
            setLoading(false);
        }
    };

    const fetchFallbackNews = async () => {
        try {
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=cashew+ivory+coast&sortBy=publishedAt&pageSize=${rssLimit}&apiKey=YOUR_API_KEY`
            );
            const data = await response.json();

            return data.articles?.map((article: any) => ({
                title: article.title,
                link: article.url,
                pubDate: article.publishedAt,
                contentSnippet: article.description,
                creator: article.author,
                source: article.source?.name || 'NewsAPI',
                category: 'fallback',
                searchBoost: 1
            })) || [];
        } catch (e) {
            console.error("Fallback API failed:", e);
            return [];
        }
    };

    useEffect(() => {
        loadFeeds();
        const interval = setInterval(loadFeeds, 3600000);
        return () => clearInterval(interval);
    }, []);


    const safeTranslate = (key?: string, fallback = '') => key ? t(key) : fallback;

    const filteredUpdates = afrinutsUpdates.filter((update) => {
        const matchesSearch =
            update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            update.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            activeFilters.length === 0 ||
            update.tags?.some(tag => activeFilters.includes(tag));

        return matchesSearch && matchesCategory;
    });

    const filteredArticles = articles.filter((article) => {
        const content = `${article.title} ${article.contentSnippet}`.toLowerCase();

        if (activeFilters.includes('cashew') &&
            !content.includes('cashew') &&
            !content.includes('anacardium')){
            return false;
        }

        if (activeFilters.includes('ivory-coast') &&
            !content.includes('ivory coast') &&
            !content.includes('côte d\'ivoire') &&
            !content.includes('cote d\'ivoire')) {
            return false;
        }

        if (searchQuery && !content.includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    const [selectedUpdate, setSelectedUpdate] = useState<AfriNutsUpdate | null>(null);

    const getContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Typography variant="body" className="text-primary">
                        {t('loading')}
                    </Typography>
                </div>
            );
        }

        switch (activeTab) {
            case 'afrinuts':
                return renderAfriNutsUpdates();
            case 'industry':
                return renderExternalNews();
            default:
                return (
                    <>
                        {renderAfriNutsUpdates()}
                        {renderExternalNews()}
                    </>
                );
        }
    };

    // State to track which update is expanded
    const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null);

    const renderAfriNutsUpdates = () => (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
        >
            <Typography variant="h3" className="flex items-center gap-2 mb-6">
                <FaBullhorn className="text-accent" />
                {t('sections.afrinutsUpdates')}
            </Typography>

            {filteredUpdates.length === 0 ? (
                <Typography variant="body" className="text-center py-10 text-gray-500">
                    {t('sections.noUpdatesFound')}
                </Typography>
            ) : (
                <div className="flex flex-col items-center gap-8">
                    {filteredUpdates.map((update, index) => (
                        <motion.div
                            key={update.id}
                            variants={fadeIn}
                            transition={{ delay: index * 0.1 }}
                            className="w-full max-w-2xl"
                        >
                            <div className=" bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-accent p-6">
                                <div className="h-64 overflow-hidden mb-4 rounded-lg"> {/* Increased height for better image display */}
                                    {update.id === 'update-2024-001' ? (
                                        <img
                                            src={landClearingImage}
                                            alt="Land Clearing"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : update.id === 'update-2024-002' ? (
                                        <img
                                            src={signingImage}
                                            alt="Partnership Signing"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <img
                                            src={update.image || newsImage}
                                            alt={update.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    )}
                                </div>

                                <div className="prose max-w-none">
                                    <Typography variant="h4" className="mb-3 text-primary">
                                        {update.translationKeys?.title ? t(update.translationKeys.title) : update.title}
                                    </Typography>

                                    {/* Paragraph-formatted excerpt */}
                                    <Typography variant="body" className="text-gray-600 mb-4 whitespace-pre-line">
                                        {update.translationKeys?.excerpt ? t(update.translationKeys.excerpt) : update.excerpt}
                                    </Typography>

                                    {/* Expanded content with proper paragraph formatting */}
                                    {expandedUpdateId === update.id && (
                                        <div className="space-y-4 mb-4">
                                            {update.content.split('\n').map((paragraph, i) => (
                                                <Typography key={i} variant="body" className="text-gray-700">
                                                    {paragraph}
                                                </Typography>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <Typography variant="caption" className="text-gray-400">
                                        {update.author || "AfriNuts"}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-400">
                                        {new Date(update.date).toLocaleDateString()}
                                    </Typography>
                                </div>

                                <button
                                    onClick={() => setExpandedUpdateId(expandedUpdateId === update.id ? null : update.id)}
                                    className="mt-4 text-accent hover:underline text-sm"
                                >
                                    {expandedUpdateId === update.id ? t('sections.readLess') : t('sections.readMore')}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );

    const [selectedArticle, setSelectedArticle] = useState<RSSItem | null>(null);

    const renderExternalNews = () => (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
        >
            <Typography variant="h3" className="flex items-center gap-2 mb-6">
                <FaGlobe className="text-accent" />
                {t('sections.industryNews')}
            </Typography>

            {filteredArticles.length === 0 ? (
                <div className="text-center py-10">
                    <Typography variant="h4" className="text-gray-500 mb-4">
                        {t('emptyState.noArticles.title')}
                    </Typography>
                    <Typography variant="body" className="mb-6">
                        {t('emptyState.noArticles.description')}
                    </Typography>
                    <button
                        onClick={() => {
                            setActiveFilters([]);
                            setSearchQuery('');
                        }}
                        className="text-accent hover:underline"
                    >
                        {t('emptyState.noArticles.resetFilters')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredArticles.map((article, index) => (
                        <motion.div
                            key={`${article.link}-${index}`}
                            variants={fadeIn}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div
                                onClick={() => setSelectedArticle(article)}
                                className="cursor-pointer block bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-l-4 border-accent p-6 h-full"
                            >
                                <Typography variant="h4" className="mb-2 text-primary ">
                                    {article.title}
                                </Typography>
                                <Typography variant="body" className="text-gray-600 mb-3">
                                    {article.contentSnippet?.substring(0, 150)}...
                                </Typography>
                                <div className="flex justify-between items-center mt-4">
                                    <Typography variant="caption" className="text-gray-400">
                                        {article.source}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-400">
                                        {article.pubDate && new Date(article.pubDate).toLocaleDateString()}
                                    </Typography>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );

    const toggleFilter = (filterId: string) => {
        setActiveFilters(prev =>
            prev.includes(filterId)
                ? prev.filter(id => id !== filterId)
                : [...prev, filterId]
        );
    };

    return (
        <main>
            {/* Hero Section */}
            <Section
                fullHeight={false}
                bgImage={newsHeroImage}
                className="flex items-end justify-start text-center min-h-[50vh] md:min-h-[50vh] pb-24 pr-16 mx-6 sm:mx-12 lg:mx-32 xl:mx-48 mt-32 pt-24 rounded-[2rem] shadow-2xl overflow-hidden border border-white/40"
            >
                <motion.div
                    className="max-w-2xl px-8 sm:px-12 py-10 bg-white/75 backdrop-blur-xs rounded-xl border-2 border-primary/20 hover:border-accent/30 transition-all duration-300"
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

            {/* News Content Section */}
            <Section className="py-10">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters and Search */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="mb-12"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex flex-wrap gap-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                                            activeTab === tab.id
                                                ? 'bg-primary text-white'
                                                : 'bg-background text-gray-700 hover:bg-gray-200'
                                        } transition-colors`}
                                    >
                                        {React.createElement(FaNewspaper, { className: "text-lg" })}
                                        {t(tab.translationKey as string)}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder={t('filters.searchPlaceholder')}
                                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        {activeTab !== 'afrinuts' && (
                            <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-gray-700">
                            {t('filters.title')}
                            </span>
                                {filters.map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => toggleFilter(filter.id)}
                                        className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                                            activeFilters.includes(filter.id)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        } transition-colors`}
                                    >
                                        {React.createElement(FaFilter, { size: 12 })}
                                        {t(filter.translationKey)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* News Content */}
                    {getContent()}
                    <Transition.Root show={!!selectedArticle} as={Fragment}>
                        <Dialog as="div" className="relative z-50" onClose={() => setSelectedArticle(null)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-50 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden bg-background  rounded-3xl border-2 border-primary/20 hover:border-accent/30 hover:shadow-xl transition-shadow duration-300  text-left shadow-xl">
                                            <div className="p-6">
                                                <Dialog.Title as="h3" className="text-lg font-semibold text-primary">
                                                    {selectedArticle?.title}
                                                </Dialog.Title>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {selectedArticle?.pubDate && new Date(selectedArticle.pubDate).toLocaleString()}
                                                </p>
                                                <p className="text-gray-700 mt-4">{selectedArticle?.contentSnippet}</p>
                                                <div className="mt-4 flex justify-end gap-2">
                                                    <a
                                                        href={selectedArticle?.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-accent hover:bg-primary text-white px-4 py-2 rounded-md text-sm"
                                                    >
                                                        Read full article
                                                    </a>
                                                    <button
                                                        onClick={() => setSelectedArticle(null)}
                                                        className="text-sm text-gray-600 hover:underline"
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </div>
            </Section>

            {/* Newsletter Section */}
            <Section className="py-16">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <Typography variant="h2" className="mb-6">
                            {t('sections.newsletter.title')}
                        </Typography>
                        <Typography variant="body" className="mb-6 max-w-3xl mx-auto">
                            {t('sections.newsletter.description')}
                        </Typography>
                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder={t('sections.newsletter.placeholder')}
                                className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                            <button className="bg-primary hover:bg-dark-orange text-white px-6 py-2 rounded-full transition-colors">
                                {t('sections.newsletter.subscribe')}
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default News;
