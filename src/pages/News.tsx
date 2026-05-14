import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaNewspaper, FaGlobe, FaBullhorn, FaSearch, FaShareSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from '@/components/Typography/Typography';
import newsConfig from '@/data/newsConfig.json';
import newsFeeds from '@/data/newsFeeds.json';
import newsImage from '@/assets/images/news.webp';

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
}

interface AfriNutsUpdate {
    slug: string;
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    image?: string;
    tags: string[];
    author?: string;
}

interface NewsFeed {
    url: string;
    name: string;
    icon: string;
    category: string;
    defaultEnabled?: boolean;
}

const News: React.FC = () => {
    const { t } = useTranslation('news');
    const [articles, setArticles] = useState<RSSItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTabs, setActiveTabs] = useState<string[]>([newsConfig.page.sections.tabs[0].id]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [afrinutsUpdates, setAfrinutsUpdates] = useState<AfriNutsUpdate[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<RSSItem | null>(null);
    const articleDialogRef = useRef<HTMLDivElement>(null);

    const { sections: { tabs } } = newsConfig.page;
    const rssFeeds: NewsFeed[] = newsFeeds.feeds;
    const rssLimit = newsFeeds.defaultLimit || 15;
    const rssPageSize = 10;
    const [articlesPage, setArticlesPage] = useState(1);
    const [updatesPage, setUpdatesPage] = useState(1);

    // Focus trap for article modal
    useEffect(() => {
        if (selectedArticle && articleDialogRef.current) {
            articleDialogRef.current.focus();
        }
    }, [selectedArticle]);

    // Fetch AfriNuts updates from Contentful
    const fetchAfriNutsUpdates = async () => {
        try {
            const response = await fetch('/.netlify/functions/blog?contentType=newsUpdate');
            const data = await response.json();
            const updates = (data.posts || []).map((post: any) => ({
                id: post.id,
                slug: post.slug,
                title: post.title,
                date: post.publishedDate,
                excerpt: post.excerpt,
                content: post.content,
                image: post.image,
                tags: post.tags || [],
                author: post.author || 'AfriNuts',
            }));
            setAfrinutsUpdates(updates);
        } catch (error) {
            console.error('Error fetching AfriNuts updates:', error);
        }
    };

    // Fetch RSS feeds
    const loadFeeds = async () => {
        setLoading(true);
        try {
            const enabledFeeds = rssFeeds.filter(feed => feed.defaultEnabled !== false);
            const feedsToUse = enabledFeeds.length > 0 ? enabledFeeds : [
                { url: 'https://www.commodafrica.com/rss.xml', name: 'CommodAfrica', category: 'cashew', icon: 'FaGlobe' },
                { url: 'https://www.foodnavigator-africa.com/feeds/news.rss', name: 'Food Navigator Africa', category: 'agriculture', icon: 'FaLeaf' },
            ];

            const allArticles = await Promise.all(
                feedsToUse.map(async (feed) => {
                    try {
                        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
                        const data = await res.json();
                        if (!data.items) return [];
                        return data.items.map((item: any): RSSItem => {
                            const content = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();
                            return {
                                title: item.title,
                                link: item.link || '#',
                                pubDate: item.pubDate || new Date().toISOString(),
                                contentSnippet: item.contentSnippet?.substring(0, 200) || item.description?.substring(0, 200) || '',
                                creator: item.author || feed.name,
                                source: feed.name,
                                category: feed.category,
                                searchBoost: (content.includes('cashew') || content.includes('ivory coast') || content.includes("côte d'ivoire")) ? 2 : 1,
                                guid: item.guid,
                                isoDate: item.isoDate,
                            };
                        });
                    } catch { return []; }
                })
            );

            const processedArticles = allArticles.flat()
                .filter(article => {
                    const content = `${article.title} ${article.contentSnippet}`.toLowerCase();
                    const articleDate = new Date(article.pubDate);
                    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    const keywords = ['cashew', 'ivory coast', "côte d'ivoire", 'anacardium', 'nut', 'export', 'farmer', 'crop', 'agribusiness', 'noix de cajou', 'agriculture', 'ferme', 'cultures', 'exportation'];
                    return articleDate >= sevenDaysAgo && keywords.some(kw => content.includes(kw));
                })
                .sort((a, b) => (b.searchBoost - a.searchBoost) || (new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()))
                .slice(0, rssLimit);

            setArticles(processedArticles);
        } catch { /* silently fail */ }
        finally { setLoading(false); }
    };

    useEffect(() => {
        loadFeeds();
        fetchAfriNutsUpdates();
        const interval = setInterval(loadFeeds, 3600000);
        return () => clearInterval(interval);
    }, []);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchQuery), 350);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Tab logic
    const toggleTab = (tabId: string) => {
        setActiveTabs(prev => {
            if (tabId === 'all') return ['all'];
            if (prev.includes('all')) return [tabId];
            if (prev.includes(tabId)) return prev.length === 1 ? prev : prev.filter(id => id !== tabId);
            return [...prev, tabId];
        });
        setArticlesPage(1);
        setUpdatesPage(1);
    };

    // Filtering
    const filteredUpdates = afrinutsUpdates.filter(u =>
        !debouncedSearch || u.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || u.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    const filteredArticles = articles.filter(a =>
        !debouncedSearch || `${a.title} ${a.contentSnippet}`.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    // Pagination
    const paginatedUpdates = filteredUpdates.slice(0, updatesPage * rssPageSize);
    const paginatedArticles = filteredArticles.slice(0, articlesPage * rssPageSize);

    // Highlight search terms
    function highlightText(text: string, query: string) {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.split(regex).map((part, i) => regex.test(part) ? <mark key={i} className="bg-yellow-200 text-accent px-1 rounded">{part}</mark> : part);
    }

    // Render AfriNuts Updates
    const renderAfriNutsUpdates = () => (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-16">
            <Typography variant="h3" className="flex items-center gap-2 mb-6"><FaBullhorn className="text-accent" />{t('sections.afrinutsUpdates')}</Typography>
            {paginatedUpdates.length === 0 ? (
                <Typography variant="body" className="text-center py-10 text-gray-500">{t('sections.noUpdatesFound')}</Typography>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedUpdates.map((update, index) => (
                        <motion.div key={update.id} variants={fadeIn} transition={{ delay: index * 0.1 }}>
                            <motion.div
                                className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-accent h-full transform-gpu"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                whileHover={{ y: -8, scale: 1.03, rotateY: 2, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.25)', transition: { duration: 0.3 } }}
                                tabIndex={0}
                            >
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                                <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                                <div className="h-48 overflow-hidden relative z-10">
                                    <motion.img src={update.image || newsImage} alt={update.title} className="w-full h-full object-cover" loading="lazy" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                                </div>
                                <div className="p-6 relative z-10">
                                    <Typography variant="h4" className="mb-3 text-primary">{highlightText(update.title, debouncedSearch)}</Typography>
                                    <Typography variant="body" className="text-gray-600 mb-4 whitespace-pre-line">{highlightText(update.excerpt, debouncedSearch)}</Typography>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {update.tags?.map(tag => <span key={tag} className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs rounded-full font-medium">{t(`categories.${tag}`)}</span>)}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <Typography variant="caption" className="text-gray-400">{update.author || 'AfriNuts'}</Typography>
                                        <Typography variant="caption" className="text-gray-400">{new Date(update.date).toLocaleDateString()}</Typography>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <Link to={`/news/${update.slug}`} className="text-accent hover:underline text-sm">{t('sections.readMore')}</Link>
                                        <button className="ml-2 px-3 py-1 rounded-full bg-accent text-white hover:bg-accent-dark text-xs flex items-center justify-center transform-gpu hover:scale-105 transition-transform"
                                                onClick={() => { if (navigator.share) navigator.share({ title: update.title, url: window.location.href }); }}>
                                            <FaShareSquare className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            )}
            {paginatedUpdates.length < filteredUpdates.length && (
                <div className="flex justify-center mt-8">
                    <motion.button className="px-6 py-2 rounded-full bg-primary text-white hover:bg-dark-orange transition-colors transform-gpu hover:scale-105" onClick={() => setUpdatesPage(p => p + 1)} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>{t('sections.loadMore')}</motion.button>
                </div>
            )}
        </motion.div>
    );

    // Render External News
    const renderExternalNews = () => (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <Typography variant="h3" className="flex items-center gap-2 mb-6"><FaGlobe className="text-accent" />{t('sections.industryNews')}</Typography>
            {paginatedArticles.length === 0 ? (
                <div className="text-center py-10">
                    <Typography variant="h4" className="text-gray-500 mb-4">{t('emptyState.noArticles.title')}</Typography>
                    <Typography variant="body" className="mb-6">{t('emptyState.noArticles.description')}</Typography>
                    <button onClick={() => setSearchQuery('')} className="text-accent hover:underline">{t('emptyState.noArticles.resetFilters')}</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedArticles.map((article, index) => (
                        <motion.div key={`${article.link}-${index}`} variants={fadeIn} transition={{ delay: index * 0.1 }}>
                            <motion.div
                                className="block relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-accent p-6 h-full transform-gpu"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px', cursor: 'pointer' }}
                                whileHover={{ y: -8, scale: 1.03, rotateY: 2, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.25)', transition: { duration: 0.3 } }}
                                tabIndex={0} role="button" onClick={() => setSelectedArticle(article)}
                            >
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                                <div className="flex flex-wrap gap-2 mb-2 relative z-10">
                                    <span className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs rounded-full font-medium">{t(`categories.${article.category}`)}</span>
                                </div>
                                <Typography variant="h4" className="mb-2 text-primary relative z-10">{highlightText(article.title, debouncedSearch)}</Typography>
                                <Typography variant="body" className="text-gray-600 mb-3 relative z-10">{highlightText(article.contentSnippet?.substring(0, 150) ?? '', debouncedSearch)}...</Typography>
                                <div className="flex justify-between items-center mt-4 relative z-10">
                                    <Typography variant="caption" className="text-gray-400">{article.source}</Typography>
                                    <Typography variant="caption" className="text-gray-400">{new Date(article.pubDate).toLocaleDateString()}</Typography>
                                </div>
                                <div className="flex mt-4 relative z-10">
                                    <button className="ml-0 px-3 py-1 rounded-full bg-accent text-white hover:bg-accent-dark text-xs flex items-center justify-center transform-gpu hover:scale-105 transition-transform"
                                            onClick={e => { e.stopPropagation(); if (navigator.share) navigator.share({ title: article.title, url: article.link }); }}>
                                        <FaShareSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            )}
            {paginatedArticles.length < filteredArticles.length && (
                <div className="flex justify-center mt-8">
                    <motion.button className="px-6 py-2 rounded-full bg-primary text-white hover:bg-dark-orange transition-colors transform-gpu hover:scale-105" onClick={() => setArticlesPage(p => p + 1)} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>{t('sections.loadMore')}</motion.button>
                </div>
            )}
        </motion.div>
    );

    // Newsletter
    const [newsSubscribeStatus, setNewsSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [newsSubscribeMessage, setNewsSubscribeMessage] = useState('');

    const handleNewsSubscribe = async (email: string, form: HTMLFormElement) => {
        setNewsSubscribeStatus('loading'); setNewsSubscribeMessage('');
        try {
            const response = await fetch('/.netlify/functions/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
            const data = await response.json();
            if (!response.ok) {
                const map: Record<string, string> = {
                    INVALID_EMAIL: t('sections.newsletter.invalidEmail', 'Invalid email.'),
                    ALREADY_SUBSCRIBED: t('sections.newsletter.alreadySubscribed', 'Already subscribed.'),
                    SUBSCRIBE_FAILED: t('sections.newsletter.error', 'Something went wrong.'),
                    SERVER_ERROR: t('sections.newsletter.error', 'Something went wrong.'),
                };
                throw new Error(map[data.error] || 'Something went wrong.');
            }
            setNewsSubscribeStatus('success');
            setNewsSubscribeMessage(t('sections.newsletter.success', 'Successfully subscribed!'));
            form.reset();
            setTimeout(() => { setNewsSubscribeStatus('idle'); setNewsSubscribeMessage(''); }, 5000);
        } catch (error: any) {
            setNewsSubscribeStatus('error');
            setNewsSubscribeMessage(error.message);
        }
    };

    return (
        <main>
            {/* Hero */}
            <Section fullHeight={false} className="flex items-center justify-center text-center min-h-[40vh] bg-gradient-to-b from-primary/10 to-transparent">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-12" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}><Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">{t('hero.subtitle')}</Typography></motion.div>
                    <motion.h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>{t('hero.title')}</motion.h1>
                    <motion.div variants={fadeIn}><Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">{t('hero.description')}</Typography></motion.div>
                </motion.div>
            </Section>

            {/* News Intro */}
            <Section className="py-12 text-center">
                <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
                    <motion.div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 p-8 transform-gpu" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                whileHover={{ y: -4, scale: 1.02, rotateY: 1, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }}>
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-4px]" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-30" />
                        <Typography variant="h2" className="mb-4 relative z-10">{t('sections.newsIntro.title')}</Typography>
                        <Typography variant="lead" className="mb-2 relative z-10">{t('sections.newsIntro.description')}</Typography>
                    </motion.div>
                </div>
            </Section>

            {/* News Content */}
            <Section className="py-6">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tabs & Search */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-wrap gap-2">
                                {tabs.map(tab => (
                                    <motion.button key={tab.id} onClick={() => toggleTab(tab.id)}
                                                   className={`px-4 py-2 rounded-full flex items-center gap-2 ${activeTabs.includes(tab.id) ? 'bg-primary text-white' : 'bg-background text-gray-700 hover:bg-gray-200'} transition-colors`}
                                                   aria-pressed={activeTabs.includes(tab.id)} whileHover={{ y: -2, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <FaNewspaper className="text-lg" />{t(tab.translationKey as string)}
                                    </motion.button>
                                ))}
                            </div>
                            <div className="relative w-full md:w-64">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input type="text" placeholder={t('filters.searchPlaceholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                       className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Typography variant="body" className="text-primary">{t('loading')}</Typography></div>
                    ) : (
                        <>
                            {(activeTabs.includes('all') || activeTabs.includes('afrinuts')) && renderAfriNutsUpdates()}
                            {(activeTabs.includes('all') || activeTabs.includes('industry')) && renderExternalNews()}
                        </>
                    )}

                    {/* Article Modal (Industry News only) */}
                    <Transition.Root show={!!selectedArticle} as={Fragment}>
                        <Dialog as="div" className="relative z-50" onClose={() => setSelectedArticle(null)} initialFocus={articleDialogRef}>
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <div className="fixed inset-0 bg-black bg-opacity-30" />
                            </Transition.Child>
                            <div className="fixed inset-0 z-50 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4">
                                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:scale-95">
                                        <Dialog.Panel ref={articleDialogRef} tabIndex={-1}
                                                      className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl text-left shadow-xl backdrop-blur-lg"
                                                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.8) 100%)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 32px rgba(165,105,66,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
                                            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-15 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }} />
                                            <div className="p-6 relative z-10">
                                                <Dialog.Title as="h3" className="text-lg font-semibold text-primary">{selectedArticle?.title}</Dialog.Title>
                                                {selectedArticle?.category && <span className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs rounded-full mt-2">{t(`categories.${selectedArticle.category}`)}</span>}
                                                <p className="text-sm text-gray-500 mt-1">{selectedArticle?.pubDate && new Date(selectedArticle.pubDate).toLocaleString()}</p>
                                                <p className="text-gray-700 mt-4">{selectedArticle?.contentSnippet}</p>
                                                <div className="mt-6 flex justify-end gap-2">
                                                    <motion.a href={selectedArticle?.link} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-primary text-white px-4 py-2 rounded-md text-sm" whileHover={{ y: -2 }}>{t('sections.readFullArticle')}</motion.a>
                                                    <motion.button onClick={() => setSelectedArticle(null)} className="text-sm text-gray-600 hover:underline" whileHover={{ y: -2 }}>{t('sections.close')}</motion.button>
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

            {/* Newsletter */}
            <Section className="py-16">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <motion.div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 p-8 transform-gpu" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ y: -4, scale: 1.02, rotateY: 1, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-4px]" />
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-30" />
                            <Typography variant="h2" className="mb-6 relative z-10">{t('sections.newsletter.title')}</Typography>
                            <Typography variant="body" className="mb-6 max-w-3xl mx-auto relative z-10">{t('sections.newsletter.description')}</Typography>
                            <form className="flex flex-col items-center gap-2 max-w-md mx-auto relative z-10"
                                  onSubmit={async (e) => { e.preventDefault(); const form = e.target as HTMLFormElement; await handleNewsSubscribe((form.querySelector('#news-email') as HTMLInputElement).value, form); }}>
                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                    <input type="email" id="news-email" placeholder={t('sections.newsletter.placeholder')} required className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent" />
                                    <motion.button type="submit" disabled={newsSubscribeStatus === 'loading'}
                                                   className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg disabled:opacity-50"
                                                   whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                        {newsSubscribeStatus === 'loading' ? t('sections.newsletter.loading', 'Subscribing...') : t('sections.newsletter.subscribe')}
                                    </motion.button>
                                </div>
                                {newsSubscribeStatus !== 'idle' && <p className={`text-sm mt-2 ${newsSubscribeStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{newsSubscribeMessage}</p>}
                            </form>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default News;