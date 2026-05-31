import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaCalendarAlt,
    FaUser,
    FaSearch,
    FaChevronDown,
    FaPenFancy,
    FaBookOpen,
    FaQuestionCircle,
    FaNewspaper, FaLeaf
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { trackCtaClick, trackBlogRead } from '@/utils/analytics';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet-async";
import JsonLd from "@/components/Seo/JsonLd";
import blogHeroImage from '@/assets/images/blog-hero.webp';
import { InfoCard } from '@/components/InfoCard/InfoCard';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    author: string;
    publishedDate: string;
    featuredImage?: string;
}

const CATEGORIES = ['All', 'Farming & Agriculture', 'Cashew Industry', 'Sustainability', 'Behind the Scenes', 'Health & Nutrition', 'Cashew Education', 'Ivory Coast', 'Technology', 'Governance', 'Investment'];

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subscribeMessage, setSubscribeMessage] = useState('');

    const handleSubscribe = async (email: string, form: HTMLFormElement) => {
        setSubscribeStatus('loading');
        setSubscribeMessage('');

        try {
            const response = await fetch('/.netlify/functions/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMap: Record<string, string> = {
                    'INVALID_EMAIL': 'Please enter a valid email address.',
                    'ALREADY_SUBSCRIBED': 'You are already subscribed.',
                    'SUBSCRIBE_FAILED': 'Something went wrong. Please try again.',
                    'SERVER_ERROR': 'Something went wrong. Please try again.',
                };
                throw new Error(errorMap[data.error] || 'Something went wrong.');
            }

            setSubscribeStatus('success');
            setSubscribeMessage('Successfully subscribed!');
            form.reset();

            setTimeout(() => {
                setSubscribeStatus('idle');
                setSubscribeMessage('');
            }, 5000);
        } catch (error: any) {
            setSubscribeStatus('error');
            setSubscribeMessage(error.message);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/.netlify/functions/blog');
                const data = await response.json();
                setPosts(data.posts || []);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = posts
        .filter(post => selectedCategory === 'All' || post.category === selectedCategory)
        .filter(post =>
            searchQuery === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-[72px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="text-text-dark font-sans">
            <Helmet>
                <title>AfriNuts Blog | Cashew Farming, Industry Insights & Sustainability</title>
                <meta name="description" content="Expert insights on cashew farming, sustainable agriculture, and the West African nut industry. Articles on organic farming, market trends, and behind-the-scenes at our Odienné farm." />
                <link rel="canonical" href="https://www.afrinutsexport.com/blog" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": "AfriNuts Export Blog",
                "description": "Expert insights on cashew farming, sustainable agriculture, and the West African nut industry.",
                "url": "https://www.afrinutsexport.com/blog",
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
                            <FaPenFancy className="inline mr-2 text-accent" />Insights from Our Cashew Farm in Odienné
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                            The AfriNuts Blog
                        </motion.h1>
                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                            Expert advice on growing organic cashews, sustainable farm management, market trends, and building a vertically integrated agribusiness — straight from our 35-hectare family farm in Ivory Coast.
                        </Typography>

                        {/* Blog Intro Card */}
                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaLeaf}
                                title="What You'll Find Here"
                                variant="secondary"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    Practical farming guides, industry analysis, behind-the-scenes stories, and data-backed insights from our tech-enabled cashew operation. Updated regularly by our team in Odienné.
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <Link to="/news"
                                  className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaNewspaper className="text-xs" />Industry News
                            </Link>
                            <Link to="/faq"
                                  className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaQuestionCircle className="text-xs" />Frequently Asked Questions
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Blog Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={blogHeroImage} alt="AfriNuts Blog" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">Farm Insights & Stories</span>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </Section>

            {/* Filters & Search */}
            <Section className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Search Bar - Always Visible */}
                    <div className="relative w-full mb-4">
                        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                        <label htmlFor="blog-search" className="sr-only">Search blog posts</label>
                        <input
                            type="text"
                            id="blog-search"
                            placeholder="Search blog posts..."
                            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/60 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200 text-sm font-medium text-gray-700 mb-3"
                    >
                        <span>Filter: {selectedCategory}</span>
                        <FaChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Category Filters */}
                    <div className={`flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden'} md:flex`}>
                        {CATEGORIES.map(cat => (
                            <motion.button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setShowFilters(false);
                                    trackCtaClick(`category_${cat.toLowerCase().replace(/\s+/g, '_')}`, 'blog_filter');
                                }}
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200 backdrop-blur-sm'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                    {/* Posts Grid */}
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <Typography variant="h4" className="text-gray-400">No posts found</Typography>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {filteredPosts.map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={`/blog/${post.slug}`}
                                        onClick={() => trackBlogRead(post.title, post.slug)}
                                    >
                                        <motion.div
                                            className="group relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 border-l-4 border-accent h-full transform-gpu flex flex-col"
                                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                            whileHover={{ y: -8, scale: 1.03, rotateY: 2, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.25)', transition: { duration: 0.3 } }}
                                        >
                                            {/* 3D edge effect */}
                                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                            {/* Glassy overlay */}
                                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                            {/* Inner shadow */}
                                            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                                            {/* Background pattern */}
                                            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                            {/* Featured Image */}
                                            {post.featuredImage && (
                                                <div className="relative h-48 overflow-hidden z-10 rounded-t-3xl rounded-bl-3xl rounded-br-[80px] flex-shrink-0">
                                                    <img
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="relative z-10 flex flex-col flex-grow p-5">
                            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mb-3 w-fit">
                                {post.category}
                            </span>
                                                <Typography variant="h4" className="mb-2 text-primary group-hover:text-accent transition-colors line-clamp-2">
                                                    {post.title}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                                                    {post.excerpt}
                                                </Typography>
                                                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100/50 mt-auto">
                                <span className="flex items-center gap-1">
                                    <FaCalendarAlt /> {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                                    <span className="flex items-center gap-1">
                                    <FaUser /> {post.author.split(',')[0]}
                                </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </Section>
            {/* End-of-page CTA */}
            <Section className="py-10 mt-8">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        whileHover={{
                            y: -8, scale: 1.02, rotateY: 3,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <motion.div variants={fadeIn}>
                                <Typography variant="h2" className="mb-6 text-primary">
                                    Get More Cashew Insights
                                </Typography>
                                <Typography variant="body" className="mb-6 text-gray-700 max-w-3xl mx-auto">
                                    Subscribe to our newsletter for expert articles on cashew farming, industry trends, and sustainable agriculture delivered straight to your inbox.
                                </Typography>
                                <form
                                    className="flex flex-col items-center gap-3 max-w-md mx-auto"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const emailInput = form.querySelector('#blog-cta-email') as HTMLInputElement;
                                        trackCtaClick('newsletter_subscribe', 'blog_cta');
                                        await handleSubscribe(emailInput.value, form);
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                                        <label htmlFor="blog-cta-email" className="sr-only">Email address</label>
                                        <input
                                            type="email"
                                            id="blog-cta-email"
                                            placeholder="Your email address"
                                            required
                                            className="flex-grow px-5 py-3 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <button
                                            type="submit"
                                            disabled={subscribeStatus === 'loading'}
                                            className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-3 rounded-full transform-gpu group/btn overflow-hidden disabled:opacity-50 font-medium"
                                        >
                                            <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                            <span className="relative z-10">
                                                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                            </span>
                                        </button>
                                    </div>
                                    {subscribeStatus !== 'idle' && (
                                        <p className={`text-sm ${subscribeStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                            {subscribeMessage}
                                        </p>
                                    )}
                                </form>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default Blog;