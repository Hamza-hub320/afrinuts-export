import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaSearch, FaChevronDown } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { useNavigate } from 'react-router-dom';

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

const CATEGORIES = ['All', 'Farming & Agriculture', 'Cashew Industry', 'Sustainability', 'Behind the Scenes', 'Health & Nutrition'];

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
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[40vh]">
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            Insights from Our Cashew Farm in Odienné
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        The AfriNuts Blog: <br className="hidden sm:block" />
                        Organic Cashews, Sustainable Farming & West African Agriculture
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Expert advice on growing organic cashews, sustainable farm management, market trends, and building a vertically integrated agribusiness — straight from our 35-hectare family farm in Ivory Coast.
                        </Typography>
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

                    {/* Posts Grid with InfoCard Styling */}
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
                                    <Link to={`/blog/${post.slug}`}>
                                        <InfoCard
                                            title={post.title}
                                            subtitle={post.excerpt}
                                            iconColor="text-accent"
                                            className="h-full cursor-pointer"
                                            showInfoBadge={false}
                                        >
                                            {post.featuredImage && (
                                                <div className="h-44 overflow-hidden rounded-xl mb-3 -mt-2 border-2 border-white/30 shadow-md">
                                                    <img
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}
                                            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mb-2">
                                                {post.category}
                                            </span>
                                            <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100/50 mt-auto">
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt /> {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaUser /> {post.author.split(',')[0]}
                                                </span>
                                            </div>
                                        </InfoCard>
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