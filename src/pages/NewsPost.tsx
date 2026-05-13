import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaTwitter, FaLinkedin, FaEnvelope, FaClock, FaTag } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import Section from '@/components/Section/Section';
import { Helmet } from 'react-helmet-async';
import newsImage from '@/assets/images/news.webp';

interface NewsUpdateType {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    publishedDate: string;
    image?: string;
    tags?: string[];
}

const calculateReadTime = (content: string): number => {
    if (!content) return 3;
    const wordCount = content.split(/\s+/).length;
    return Math.max(2, Math.ceil(wordCount / 200));
};

const NewsPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<NewsUpdateType | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState<NewsUpdateType[]>([]);
    const navigate = useNavigate();
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subscribeMessage, setSubscribeMessage] = useState('');

    const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
    const shareTitle = post ? encodeURIComponent(post.title) : '';

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
        const fetchPost = async () => {
            try {
                const response = await fetch(`/.netlify/functions/blog?contentType=newsUpdate&slug=${slug}`);
                const data = await response.json();
                const fetched = data.post;
                if (fetched) {
                    setPost({
                        id: fetched.id,
                        title: fetched.title,
                        slug: fetched.slug,
                        content: fetched.content,
                        excerpt: fetched.excerpt,
                        author: fetched.author || 'AfriNuts',
                        publishedDate: fetched.publishedDate,
                        image: fetched.image,
                        tags: fetched.tags || [],
                    });

                    // Fetch related updates
                    const relatedResponse = await fetch('/.netlify/functions/blog?contentType=newsUpdate');
                    const relatedData = await relatedResponse.json();
                    setRelatedPosts(
                        (relatedData.posts || [])
                            .filter((p: any) => p.slug !== fetched.slug)
                            .slice(0, 3)
                            .map((p: any) => ({
                                id: p.id,
                                title: p.title,
                                slug: p.slug,
                                content: p.content,
                                excerpt: p.excerpt,
                                author: p.author || 'AfriNuts',
                                publishedDate: p.publishedDate,
                                image: p.image,
                                tags: p.tags || [],
                            }))
                    );
                }
            } catch (error) {
                console.error('Error fetching news post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-[72px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-[72px]">
                <Typography variant="h3" className="text-gray-400">Update not found</Typography>
            </div>
        );
    }

    const readTime = calculateReadTime(post.content);

    return (
        <div className="min-h-screen pt-[72px]">
            <Helmet>
                <title>{post.title} | AfriNuts Export News</title>
                <meta name="description" content={post.excerpt} />
                <link rel="canonical" href={`https://www.afrinutsexport.com/news/${post.slug}`} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.image} />
                <meta property="og:type" content="article" />
            </Helmet>

            <Section className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    {/* Breadcrumbs */}
                    <div className="text-sm text-gray-400 mb-4 flex items-center gap-1 flex-wrap">
                        <Link to="/" className="hover:text-primary">Home</Link>
                        <span>/</span>
                        <Link to="/news" className="hover:text-primary">News</Link>
                        <span>/</span>
                        <span className="text-primary font-medium truncate max-w-[200px]">{post.title}</span>
                    </div>

                    <Link to="/news" className="inline-flex items-center gap-2 text-primary hover:text-accent mb-6 transition-colors">
                        <FaArrowLeft /> Back to News
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mb-4">
                            AfriNuts Update
                        </span>
                        <Typography variant="h1" className="text-3xl md:text-4xl font-bold mb-4 text-text-dark">
                            {post.title}
                        </Typography>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                            <span className="flex items-center gap-1"><FaClock /> {readTime} min read</span>
                        </div>

                        {post.image && (
                            <img src={post.image} alt={post.title}
                                 className="w-full rounded-2xl mb-8 shadow-lg border-2 border-white/20 object-cover max-h-[400px]" />
                        )}

                        {/* Social Share */}
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-sm text-gray-500 mr-1">Share:</span>
                            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer"
                               className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-500 transition-colors">
                                <FaTwitter className="text-sm" />
                            </a>
                            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer"
                               className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors">
                                <FaLinkedin className="text-sm" />
                            </a>
                            <a href={`mailto:?subject=${shareTitle}&body=Check out this update: ${shareUrl}`}
                               className="p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors">
                                <FaEnvelope className="text-sm" />
                            </a>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map((tag: string) => (
                                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                        <FaTag className="text-[10px]" /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            {post.content.split('\n').map((paragraph, i) => (
                                <Typography key={i} variant="body" className="text-gray-700 mb-4 leading-relaxed">
                                    {paragraph}
                                </Typography>
                            ))}
                        </div>
                    </motion.div>

                    {/* Post Footer CTA */}
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl p-6 text-center overflow-hidden"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                whileHover={{ y: -4, scale: 1.01 }}
                            >
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/20" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <div className="relative z-10">
                                    <Typography variant="h4" className="mb-2 text-primary">Stay Updated</Typography>
                                    <Typography variant="small" className="text-gray-600 mb-4">
                                        Get the latest AfriNuts news delivered to your inbox.
                                    </Typography>
                                    <form className="flex flex-col gap-3" onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const emailInput = form.querySelector('#news-newsletter') as HTMLInputElement;
                                        await handleSubscribe(emailInput.value, form);
                                    }}>
                                        <input type="email" id="news-newsletter" placeholder="Your email address" required
                                               className="w-full px-4 py-2 rounded-full border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                        <button type="submit" disabled={subscribeStatus === 'loading'}
                                                className="w-full px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-dark-orange transition-colors disabled:opacity-50">
                                            {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                                        </button>
                                        {subscribeStatus !== 'idle' && (
                                            <p className={`text-xs ${subscribeStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{subscribeMessage}</p>
                                        )}
                                    </form>
                                </div>
                            </motion.div>
                            <motion.div
                                className="relative bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-accent/20 rounded-2xl p-6 text-center overflow-hidden"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                whileHover={{ y: -4, scale: 1.01 }}
                            >
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/20" />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                                <div className="relative z-10">
                                    <Typography variant="h4" className="mb-2 text-primary">Explore Our Blog</Typography>
                                    <Typography variant="small" className="text-gray-600 mb-4">
                                        Read in-depth articles on cashew farming, sustainability, and industry insights.
                                    </Typography>
                                    <button onClick={() => navigate('/blog')}
                                            className="w-full px-4 py-2 bg-accent text-white rounded-full text-sm font-medium hover:bg-orange-700 transition-colors">
                                        Visit Blog
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                        <div className="text-center mt-6">
                            <Link to="/news" className="text-primary hover:text-accent text-sm flex items-center justify-center gap-1">
                                <FaArrowLeft /> Back to all updates
                            </Link>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Related Updates */}
            {relatedPosts.length > 0 && (
                <Section className="py-10 bg-gray-50/50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Typography variant="h3" className="mb-6 text-center">Related Updates</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((related) => (
                                <Link to={`/news/${related.slug}`} key={related.id} className="group">
                                    <motion.div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100" whileHover={{ y: -4 }}>
                                        <img src={related.image || newsImage} alt={related.title} className="w-full h-36 object-cover" />
                                        <div className="p-4">
                                            <Typography variant="h5" className="group-hover:text-accent transition-colors line-clamp-2">{related.title}</Typography>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                                <FaCalendarAlt />
                                                <span>{new Date(related.publishedDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Section>
            )}
        </div>
    );
};

export default NewsPost;