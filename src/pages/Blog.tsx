import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';

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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <motion.button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
                        <div className="relative w-full sm:w-48">
                            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Posts Grid */}
                    {filteredPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <Typography variant="h4" className="text-gray-400">No posts found</Typography>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post, idx) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link to={`/blog/${post.slug}`}>
                                        <motion.div
                                            className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg h-full transform-gpu"
                                            whileHover={{ y: -6, scale: 1.02 }}
                                        >
                                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20" />
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

                                            {post.featuredImage && (
                                                <div className="h-48 overflow-hidden relative z-10">
                                                    <img
                                                        src={post.featuredImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-5 relative z-10">
                                                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mb-3">
                                                    {post.category}
                                                </span>
                                                <Typography variant="h4" className="mb-2 text-primary group-hover:text-accent transition-colors">
                                                    {post.title}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-600 mb-4 line-clamp-2">
                                                    {post.excerpt}
                                                </Typography>
                                                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                                                    <span className="flex items-center gap-1">
                                                        <FaCalendarAlt /> {new Date(post.publishedDate).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaUser /> {post.author}
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
        </div>
    );
};

export default Blog;