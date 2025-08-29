import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaNewspaper, FaGlobe, FaBullhorn, FaFilter, FaSearch } from 'react-icons/fa';
import { FaShareSquare } from 'react-icons/fa';

import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
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
    link?: string; // added
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
    const [activeTabs, setActiveTabs] = useState<string[]>([newsConfig.page.sections.tabs[0].id]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

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
    const rssPageSize = 10;
    const [articlesPage, setArticlesPage] = useState(1);
    const [updatesPage, setUpdatesPage] = useState(1);


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

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchQuery), 350);
        return () => clearTimeout(handler);
    }, [searchQuery]);


    const safeTranslate = (key?: string, fallback = '') => key ? t(key) : fallback;

    // Tab logic: "all" tab shows both AfriNuts and Industry news
    const toggleTab = (tabId: string) => {
        setActiveTabs((prev) => {
            if (tabId === 'all') {
                // Selecting "all" deselects others, only "all" is active
                return ['all'];
            }
            if (prev.includes(tabId)) {
                // If "all" is active, switch to only the clicked tab
                if (prev.includes('all')) {
                    return [tabId];
                }
                // Prevent deselecting last tab
                if (prev.length === 1) return prev;
                return prev.filter(id => id !== tabId);
            }
            // If "all" is active, replace with clicked tab
            if (prev.includes('all')) {
                return [tabId];
            }
            // Add the new tab
            return [...prev, tabId];
        });
        // Reset pagination when tabs change
        setArticlesPage(1);
        setUpdatesPage(1);
    };

    // Filtering
    const filteredUpdates = afrinutsUpdates.filter((update) => {
        const matchesSearch =
            debouncedSearch === '' ||
            update.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            update.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesSearch;
    });

    const filteredArticles = articles.filter((article) => {
        const content = `${article.title} ${article.contentSnippet}`.toLowerCase();
        if (debouncedSearch && !content.includes(debouncedSearch.toLowerCase())) {
            return false;
        }
        return true;
    });

    const [selectedUpdate, setSelectedUpdate] = useState<AfriNutsUpdate | null>(null);

    // Pagination
    const paginatedUpdates = filteredUpdates.slice(0, updatesPage * rssPageSize);
    const paginatedArticles = filteredArticles.slice(0, articlesPage * rssPageSize);
    const hasMoreUpdates = paginatedUpdates.length < filteredUpdates.length;
    const hasMoreArticles = paginatedArticles.length < filteredArticles.length;

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
        // If "all" tab is selected, show both sections
        if (activeTabs.includes('all')) {
            return (
                <>
                    {renderAfriNutsUpdates()}
                    {renderExternalNews()}
                </>
            );
        }
        // Otherwise, show selected sections
        const showAfrinuts = activeTabs.includes('afrinuts');
        const showIndustry = activeTabs.includes('industry');
        return (
            <>
                {showAfrinuts && renderAfriNutsUpdates()}
                {showIndustry && renderExternalNews()}
            </>
        );
    };

    // State to track which update is expanded
    const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null);

    // Highlighting function for search terms
    function highlightText(text: string, query: string) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return (
            <>
                {text.split(regex).map((part, i) =>
                    regex.test(part) ? (
                        <mark key={i} className="bg-yellow-200 text-accent px-1 rounded">{part}</mark>
                    ) : (
                        part
                    )
                )}
            </>
        );
    }

    // Focus trap for modal
    const updateDialogRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (selectedUpdate && updateDialogRef.current) {
            updateDialogRef.current.focus();
        }
    }, [selectedUpdate]);

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

            {paginatedUpdates.length === 0 ? (
                <Typography variant="body" className="text-center py-10 text-gray-500">
                    {t('sections.noUpdatesFound')}
                </Typography>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedUpdates.map((update, index) => (
                        <motion.div
                            key={update.id}
                            variants={fadeIn}
                            transition={{ delay: index * 0.1 }}
                        >
                                    <motion.div
                                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-accent h-full transform-gpu"
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            perspective: '1000px',
                                        }}
                                        whileHover={{
                                            y: -8,
                                            scale: 1.03,
                                            rotateY: 2,
                                            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.25)',
                                            transition: { duration: 0.3 }
                                        }}
                                        tabIndex={0}
                                    >
                                {/* 3D edge effect */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                {/* Glassy overlay */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                {/* Inner shadow effect */}
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                {/* Subtle background pattern */}
                                <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                <div className="h-64 overflow-hidden relative z-10">
                                    {update.id === 'update-2024-001' ? (
                                        <motion.img
                                            src={landClearingImage}
                                            alt="Land Clearing"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    ) : update.id === 'update-2024-002' ? (
                                        <motion.img
                                            src={signingImage}
                                            alt="Partnership Signing"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    ) : (
                                        <motion.img
                                            src={update.image || newsImage}
                                            alt={update.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    )}
                                </div>

                                <div className="p-6 relative z-10">
                                    <Typography variant="h4" className="mb-3 text-primary">
                                        {highlightText(
                                            update.translationKeys?.title ? t(update.translationKeys.title) : update.title,
                                            debouncedSearch
                                        )}
                                    </Typography>

                                    <Typography variant="body" className="text-gray-600 mb-4 whitespace-pre-line">
                                        {highlightText(
                                            update.translationKeys?.excerpt ? t(update.translationKeys.excerpt) : update.excerpt,
                                            debouncedSearch
                                        )}
                                    </Typography>

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {update.tags?.map(tag => (
                                            <span key={tag} className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs rounded-full font-medium">
                                                {t(`categories.${tag}`)}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <Typography variant="caption" className="text-gray-400">
                                            {update.author || "AfriNuts"}
                                        </Typography>
                                        <Typography variant="caption" className="text-gray-400">
                                            {new Date(update.date).toLocaleDateString()}
                                        </Typography>
                                    </div>

                                    <div className="flex items-center mt-4">
                                        <button
                                            onClick={() => setSelectedUpdate(update)}
                                            className="text-accent hover:underline text-sm"
                                        >
                                            {t('sections.readMore')}
                                        </button>
                                        <button
                                            className="ml-2 px-3 py-1 rounded-full bg-accent text-white hover:bg-accent-dark text-xs flex items-center justify-center transform-gpu hover:scale-105 transition-transform"
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({ title: update.title, url: update.link || window.location.href });
                                                } else {
                                                    alert('Share feature not supported');
                                                }
                                            }}
                                        >
                                            <FaShareSquare className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            )}

            {hasMoreUpdates && (
                <div className="flex justify-center mt-8">
                    <motion.button
                        className="px-6 py-2 rounded-full bg-primary text-white hover:bg-dark-orange transition-colors transform-gpu hover:scale-105"
                        onClick={() => setUpdatesPage(p => p + 1)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('sections.loadMore')}
                    </motion.button>
                </div>
            )}

            {/* Update Modal */}
            <Transition.Root show={!!selectedUpdate} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setSelectedUpdate(null)}
                    initialFocus={updateDialogRef}
                    aria-label={t('sections.afrinutsUpdateModalAriaLabel')}
                >
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
                                <Dialog.Panel
                                    ref={updateDialogRef}
                                    tabIndex={-1}
                                    className="relative w-full max-w-2xl transform overflow-hidden bg-background rounded-3xl border-2 border-primary/20 hover:border-accent/30 hover:shadow-xl transition-shadow duration-300 text-left shadow-xl focus:outline-none transform-gpu"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        perspective: '1000px',
                                    }}
                                >
                                    {/* 3D edge effect for modal */}
                                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />

                                    {/* Glassy overlay for modal */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

                                    <div className="p-6 relative z-10">
                                        {selectedUpdate && (
                                            <>
                                                <div className="h-64 overflow-hidden mb-4 rounded-lg">
                                                    {selectedUpdate.id === 'update-2024-001' ? (
                                                        <img
                                                            src={landClearingImage}
                                                            alt="Land Clearing"
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : selectedUpdate.id === 'update-2024-002' ? (
                                                        <img
                                                            src={signingImage}
                                                            alt="Partnership Signing"
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={selectedUpdate.image || newsImage}
                                                            alt={selectedUpdate.title}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </div>

                                                <Dialog.Title as="h3" className="text-lg font-semibold text-primary">
                                                    {selectedUpdate.translationKeys?.title ? t(selectedUpdate.translationKeys.title) : selectedUpdate.title}
                                                </Dialog.Title>

                                                <div className="flex flex-wrap gap-2 mb-2 mt-2">
                                                    {selectedUpdate.tags?.map(tag => (
                                                        <span key={tag} className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs rounded-full font-medium">
                                                            {t(`categories.${tag}`)}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex justify-between items-center mt-2 mb-4">
                                                    <Typography variant="caption" className="text-gray-400">
                                                        {selectedUpdate.author || "AfriNuts"}
                                                    </Typography>
                                                    <Typography variant="caption" className="text-gray-400">
                                                        {new Date(selectedUpdate.date).toLocaleDateString()}
                                                    </Typography>
                                                </div>

                                                <div className="prose max-w-none">
                                                    {selectedUpdate.content.split('\n').map((paragraph, i) => (
                                                        <Typography key={i} variant="body" className="text-gray-700 mb-4">
                                                            {paragraph}
                                                        </Typography>
                                                    ))}
                                                </div>

                                                <div className="mt-6 flex justify-end">
                                                    <motion.button
                                                        onClick={() => setSelectedUpdate(null)}
                                                        className="bg-primary hover:bg-dark-orange text-white px-4 py-2 rounded-md text-sm transform-gpu hover:scale-105"
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {t('sections.close')}
                                                    </motion.button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </motion.div>
    );

    const [selectedArticle, setSelectedArticle] = useState<RSSItem | null>(null);

    // Focus trap for article modal
    const articleDialogRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (selectedArticle && articleDialogRef.current) {
            articleDialogRef.current.focus();
        }
    }, [selectedArticle]);

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

            {paginatedArticles.length === 0 ? (
                <div className="text-center py-10">
                    <Typography variant="h4" className="text-gray-500 mb-4">
                        {t('emptyState.noArticles.title')}
                    </Typography>
                    <Typography variant="body" className="mb-6">
                        {t('emptyState.noArticles.description')}
                    </Typography>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                        }}
                        className="text-accent hover:underline"
                    >
                        {t('emptyState.noArticles.resetFilters')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedArticles.map((article, index) => (
                        <motion.div
                            key={`${article.link}-${index}`}
                            variants={fadeIn}
                            transition={{ delay: index * 0.1 }}
                        >
                            <motion.div
                                className="block relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-accent p-6 h-full transform-gpu"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px',
                                    cursor: "pointer",
                                }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.03,
                                    rotateY: 2,
                                    boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.25)',
                                    transition: { duration: 0.3 }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={t('sections.openArticleModalAriaLabel', { title: article.title })}
                                onClick={() => setSelectedArticle(article)}
                            >
                                {/* 3D edge effect */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                                {/* Glassy overlay */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                                {/* Inner shadow effect */}
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                                <div className="flex flex-wrap gap-2 mb-2 relative z-10">
                                    <span className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs rounded-full font-medium">
                                        {t(`categories.${article.category}`)}
                                    </span>
                                </div>
                                <Typography variant="h4" className="mb-2 text-primary relative z-10">
                                    {highlightText(article.title, debouncedSearch)}
                                </Typography>
                                <Typography variant="body" className="text-gray-600 mb-3 relative z-10">
                                    {highlightText(article.contentSnippet?.substring(0, 150) ?? '', debouncedSearch)}...
                                </Typography>
                                <div className="flex justify-between items-center mt-4 relative z-10">
                                    <Typography variant="caption" className="text-gray-400">
                                        {article.source}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-400">
                                        {article.pubDate && new Date(article.pubDate).toLocaleDateString()}
                                    </Typography>
                                </div>
                                <div className="flex mt-4 relative z-10">
                                    <button
                                        className="ml-0 px-3 py-1 rounded-full bg-accent text-white hover:bg-accent-dark text-xs flex items-center justify-center transform-gpu hover:scale-105 transition-transform"
                                        onClick={e => {
                                            e.stopPropagation();
                                            if (navigator.share) {
                                                navigator.share({ title: article.title, url: article.link || window.location.href });
                                            } else {
                                                alert('Share feature not supported');
                                            }
                                        }}
                                    >
                                        <FaShareSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            )}
            {hasMoreArticles && (
                <div className="flex justify-center mt-8">
                    <motion.button
                        className="px-6 py-2 rounded-full bg-primary text-white hover:bg-dark-orange transition-colors transform-gpu hover:scale-105"
                        onClick={() => setArticlesPage(p => p + 1)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t('sections.loadMore')}
                    </motion.button>
                </div>
            )}
        </motion.div>
    );


    return (
        <main>
            {/* Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[60vh] bg-gradient-to-b from-primary/10 to-transparent"
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

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
                </div>
            </motion.div>

            {/* News Intro Section */}
            <Section className="py-12 text-center">
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 p-8 transform-gpu"
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                        }}
                        whileHover={{
                            y: -4,
                            scale: 1.02,
                            rotateY: 1,
                            boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.15)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                        <Typography variant="h2" className="mb-4 relative z-10">
                            {t('sections.newsIntro.title')}
                        </Typography>
                        <Typography variant="lead" className="mb-2 relative z-10">
                            {t('sections.newsIntro.description')}
                        </Typography>
                    </motion.div>
                </div>
            </Section>

            {/* News Content Section */}
            <Section className="py-6">
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
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => toggleTab(tab.id)}
                                        className={`px-4 py-2 rounded-full flex items-center gap-2 transform-gpu ${
                                            activeTabs.includes(tab.id)
                                                ? 'bg-primary text-white'
                                                : 'bg-background text-gray-700 hover:bg-gray-200'
                                        } transition-colors`}
                                        aria-pressed={activeTabs.includes(tab.id)}
                                        whileHover={{ y: -2, scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {React.createElement(FaNewspaper, { className: "text-lg" })}
                                        {t(tab.translationKey as string)}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="relative w-full md:w-64">
                                <label htmlFor="news-search" className="sr-only">
                                    {t('filters.searchPlaceholder')}
                                </label>
                                <motion.div
                                    className="relative"
                                    whileHover={{ y: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <input
                                        type="text"
                                        id="news-search"
                                        placeholder={t('filters.searchPlaceholder')}
                                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transform-gpu"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        aria-label={t('filters.searchAriaLabel')}
                                    />
                                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                </motion.div>
                            </div>
                        </div>

                    </motion.div>

                    {/* News Content */}
                    {getContent()}
                    <Transition.Root show={!!selectedArticle} as={Fragment}>
                        <Dialog
                            as="div"
                            className="relative z-50"
                            onClose={() => setSelectedArticle(null)}
                            initialFocus={articleDialogRef}
                            aria-label={t('sections.articleModalAriaLabel')}
                        >
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
                                        <Dialog.Panel
                                            ref={articleDialogRef}
                                            tabIndex={-1}
                                            className="relative w-full max-w-2xl transform overflow-hidden bg-background rounded-3xl border-2 border-primary/20 hover:border-accent/30 hover:shadow-xl transition-shadow duration-300 text-left shadow-xl focus:outline-none transform-gpu"
                                            style={{
                                                transformStyle: 'preserve-3d',
                                                perspective: '1000px',
                                            }}
                                        >
                                            {/* 3D edge effect for modal */}
                                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />

                                            {/* Glassy overlay for modal */}
                                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

                                            <div className="p-6 relative z-10">
                                                <Dialog.Title as="h3" className="text-lg font-semibold text-primary">
                                                    {selectedArticle?.title}
                                                </Dialog.Title>
                                                <div className="flex flex-wrap gap-2 mb-2 mt-2">
                                                    {selectedArticle?.category && (
                                                        <span className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs rounded-full font-medium">
                                                            {t(`categories.${selectedArticle.category}`)}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {selectedArticle?.pubDate && new Date(selectedArticle?.pubDate).toLocaleString()}
                                                </p>
                                                <p className="text-gray-700 mt-4">{selectedArticle?.contentSnippet}</p>
                                                <div className="mt-4 flex justify-end gap-2">
                                                    <motion.a
                                                        href={selectedArticle?.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-accent hover:bg-primary text-white px-4 py-2 rounded-md text-sm transform-gpu hover:scale-105"
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {t('sections.readFullArticle')}
                                                    </motion.a>
                                                    <motion.button
                                                        onClick={() => setSelectedArticle(null)}
                                                        className="text-sm text-gray-600 hover:underline transform-gpu hover:scale-105"
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {t('sections.close')}
                                                    </motion.button>
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
                        <motion.div
                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 p-8 transform-gpu"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            whileHover={{
                                y: -4,
                                scale: 1.02,
                                rotateY: 1,
                                boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.15)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* 3D edge effect */}
                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" />

                            {/* Glassy overlay */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                            <Typography variant="h2" className="mb-6 relative z-10">
                                {t('sections.newsletter.title')}
                            </Typography>
                            <Typography variant="body" className="mb-6 max-w-3xl mx-auto relative z-10">
                                {t('sections.newsletter.description')}
                            </Typography>
                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto relative z-10">
                                <label htmlFor="email" className="sr-only">
                                    {t('sections.newsletter.placeholder')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder={t('sections.newsletter.placeholder')}
                                    className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent transform-gpu"
                                />
                                <motion.button
                                    className="group bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center mx-auto transform-gpu relative overflow-hidden"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('sections.newsletter.subscribe')}
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default News;