import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    FaNewspaper,
    FaGlobe,
    FaBullhorn,
    FaSearch,
    FaShareSquare,
    FaSadTear,
    FaGlobeAfrica,
    FaEnvelope
} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from '@/components/Typography/Typography';
import newsConfig from '@/data/newsConfig.json';
import newsFeeds from '@/data/newsFeeds.json';
import newsImage from '@/assets/images/news.webp';
import { trackCtaClick, trackOutboundClick } from '@/utils/analytics';
import JsonLd from "@/components/Seo/JsonLd";
import {Helmet} from "react-helmet-async";
import { GiFarmer } from 'react-icons/gi';
import { InfoCard } from '@/components/InfoCard/InfoCard';

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
    icon?: string;
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
    const navigate = useNavigate();

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

    const loadFeeds = async () => {
        setLoading(true);
        try {
            const enabledFeeds = rssFeeds.filter(feed => feed.defaultEnabled !== false);

            if (enabledFeeds.length === 0) {
                setArticles([]);
                setLoading(false);
                return;
            }

            const allArticles = await Promise.all(
                enabledFeeds.map(async (feed) => {
                    try {
                        const res = await fetch(
                            `/.netlify/functions/rss?url=${encodeURIComponent(feed.url)}&name=${encodeURIComponent(feed.name)}`
                        );

                        if (!res.ok) {
                            console.warn(`[${feed.name}] RSS function returned ${res.status}`);
                            return [];
                        }

                        const data = await res.json();
                        if (!data.items?.length) {
                            console.warn(`[${feed.name}] No items`);
                            return [];
                        }

                        console.log(`[${feed.name}] Loaded ${data.items.length} items via Netlify Function`);

                        return data.items.map((item: any): RSSItem => {
                            const content = `${item.title} ${item.contentSnippet || ''}`.toLowerCase();
                            return {
                                title: item.title,
                                link: item.link || '#',
                                pubDate: item.pubDate || new Date().toISOString(),
                                contentSnippet: (item.contentSnippet || '').substring(0, 200),
                                creator: item.creator || feed.name,
                                source: feed.name,
                                category: feed.category,
                                searchBoost: (content.includes('cashew') || content.includes('ivory coast') || content.includes("côte d'ivoire")) ? 2 : 1,
                                guid: item.guid,
                                isoDate: item.isoDate,
                            };
                        });
                    } catch (err) {
                        console.warn(`[${feed.name}] Failed:`, err);
                        return [];
                    }
                })
            );

            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

            const keywords = [
                'cashew', 'ivory coast', "côte d'ivoire", 'anacardium', 'nut', 'export',
                'farmer', 'crop', 'agribusiness', 'noix de cajou', 'agriculture', 'ferme',
                'cultures', 'exportation', 'africa', 'west africa', 'processing', 'anacarde'
            ];

            const processedArticles = allArticles.flat()
                .filter(article => {
                    const content = `${article.title} ${article.contentSnippet}`.toLowerCase();
                    const articleDate = new Date(article.pubDate);
                    return articleDate >= threeDaysAgo && keywords.some(kw => content.includes(kw));
                })
                .sort((a, b) => (b.searchBoost - a.searchBoost) || (new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()))
                .slice(0, rssLimit);

            setArticles(processedArticles);
        } catch (err) {
            console.error('News fetch failed:', err);
        } finally {
            setLoading(false);
        }
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
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} animate="visible" variants={staggerContainer}
                    className="mb-16">
            <Typography variant="h3" className="flex items-center gap-2 mb-6"><FaBullhorn className="text-accent" />{t('sections.afrinutsUpdates')}</Typography>
            {paginatedUpdates.length === 0 ? (
                <div className="text-center py-10">
                    <FaSadTear className="text-4xl text-gray-300 mx-auto mb-3" />
                    <Typography variant="body" className="text-gray-500">{t('sections.noUpdatesFound')}</Typography>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedUpdates.map((update, index) => (
                        <motion.div key={update.id} variants={fadeIn} transition={{ delay: index * 0.1 }}>
                            <Link
                                to={`/news/${update.slug}`}
                                onClick={() => trackCtaClick('read_update', 'news_page')}
                                className="block"
                            >
                                <motion.div
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-accent h-full transform-gpu"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ y: -8, scale: 1.03, rotateY: 2, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.25)', transition: { duration: 0.3 } }}
                                >
                                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                    <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                                    <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                    {/* Share button - top right corner */}
                                    <button
                                        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/40 shadow-md flex items-center justify-center text-primary hover:text-accent hover:bg-white/90 transition-all transform-gpu hover:scale-110"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const url = `${window.location.origin}/news/${update.slug}`;
                                            if (navigator.share) {
                                                navigator.share({ title: update.title, url });
                                            } else {
                                                navigator.clipboard.writeText(url);
                                            }
                                        }}
                                        aria-label={t('sections.share', 'Share')}
                                    >
                                        <FaShareSquare className="w-4 h-4" />
                                    </button>

                                    <div className="p-6 relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="bg-accent/20 p-2 rounded-full">
                                                <FaBullhorn className="text-accent text-sm" />
                                            </div>
                                            <Typography variant="caption" className="text-gray-400">
                                                {new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </Typography>
                                        </div>
                                        <Typography variant="h4" className="mb-3 text-primary">{highlightText(update.title, debouncedSearch)}</Typography>
                                        <Typography variant="body" className="text-gray-600 mb-4">{highlightText(update.excerpt, debouncedSearch)}</Typography>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {update.tags?.map(tag => <span key={tag} className="inline-block bg-accent/10 text-accent px-3 py-1 text-xs rounded-full font-medium">{t(`categories.${tag}`)}</span>)}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Typography variant="caption" className="text-gray-400">{update.author || 'AfriNuts'}</Typography>
                                            <span className="text-accent hover:underline text-sm font-medium">{t('sections.readMore')}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
            {paginatedUpdates.length < filteredUpdates.length && (
                <div className="flex justify-center mt-8">
                    <motion.button className="px-6 py-2 rounded-full bg-primary text-white hover:bg-dark-orange transition-colors transform-gpu hover:scale-105" onClick={() => {
                        trackCtaClick('load_more_updates', 'news_page');
                        setUpdatesPage(p => p + 1);
                    }} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>Load More</motion.button>
                </div>
            )}
        </motion.div>
    );

    // Render External News
    const renderExternalNews = () => (
        <motion.div initial="hidden" whileInView="visible" animate="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mb-16">
            <Typography variant="h3" className="flex items-center gap-2 mb-6"><FaGlobe className="text-accent" />{t('sections.industryNews')}</Typography>
            {paginatedArticles.length === 0 ? (
                <div className="text-center py-12">
                    <FaGlobeAfrica className="text-5xl text-gray-300 mx-auto mb-4" />
                    <Typography variant="h4" className="text-gray-500 mb-3">{t('emptyState.noArticles.title')}</Typography>
                    <Typography variant="body" className="text-gray-400 mb-6 max-w-md mx-auto">
                        {t('emptyState.noArticles.description')}
                    </Typography>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {['cashew', 'Ivory Coast', 'agriculture', 'export'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSearchQuery(tag)}
                                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setSearchQuery('')} className="text-accent hover:underline text-sm">
                        {t('emptyState.noArticles.resetFilters')}
                    </button>
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
                                            onClick={e => {
                                                e.stopPropagation();
                                                trackOutboundClick('share', article.title);
                                                if (navigator.share) navigator.share({ title: article.title, url: article.link });
                                            }}>
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
                    <motion.button className="px-6 py-2 rounded-full bg-primary text-white hover:bg-dark-orange transition-colors transform-gpu hover:scale-105" onClick={() => {
                        trackCtaClick('load_more_articles', 'news_page');
                        setArticlesPage(p => p + 1);
                    }} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>{t('sections.loadMore')}</motion.button>
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

    if (loading) {
        return (
            <main>
                <Section className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <GiFarmer className="text-primary text-xl" />
                            </div>
                        </div>
                        <Typography variant="body" className="text-text-dark">
                            {t('loading', 'Loading latest news...')}
                        </Typography>
                    </div>
                </Section>
            </main>
        );
    }

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>AfriNuts News & Updates | Cashew Industry News & Farm Updates</title>
                <meta name="description" content="Latest updates from AfriNuts Export — farm progress, industry news, processing center developments, and community impact stories from Odienné, Côte d'Ivoire." />
                <link rel="canonical" href="https://www.afrinutsexport.com/news" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "AfriNuts News & Updates",
                "description": "Latest updates from AfriNuts Export — farm progress, industry news, and community impact stories.",
                "url": "https://www.afrinutsexport.com/news",
                "publisher": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "url": "https://www.afrinutsexport.com"
                }
            }} />
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[90vh]">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-20" initial="hidden" animate="visible" variants={staggerContainer}>

                    {/* Left: Text Content */}
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaGlobeAfrica className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                            {t('hero.title')}
                        </motion.h1>
                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">{t('hero.description')}</Typography>

                        {/* News Intro Card — Inside Hero */}
                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaBullhorn}
                                title={t('sections.newsIntro.title')}
                                variant="secondary"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('sections.newsIntro.description')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <button
                                onClick={() => {
                                    const newsletterSection = document.getElementById('newsletter-section');
                                    newsletterSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaEnvelope className="text-xs" />{t('hero.cta')}
                            </button>
                            <Link to="/blog"
                                  className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaNewspaper className="text-xs" />{t('hero.ctaSecondary')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: News Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={newsImage} alt="AfriNuts News & Updates" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">Latest Updates</span>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </Section>

            {/* News Content */}
            <Section className="py-6">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tabs & Search */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-wrap gap-2">
                                {tabs.map(tab => (
                                    <motion.button key={tab.id} onClick={() => {
                                        trackCtaClick(`tab_${tab.id}`, 'news_page');
                                        toggleTab(tab.id);
                                    }}
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
            <Section className="py-16" id="newsletter-section">
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