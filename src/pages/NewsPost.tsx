import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaCalendarAlt,
    FaUser,
    FaArrowLeft,
    FaTwitter,
    FaLinkedin,
    FaEnvelope,
    FaClock,
    FaTag,
    FaHeadphones
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import Section from '@/components/Section/Section';
import { Helmet } from 'react-helmet-async';
import newsImage from '@/assets/images/news.webp';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import {staggerContainer} from "@/utils/animations";
import { trackCtaClick } from '@/utils/analytics';
import JsonLd from "@/components/Seo/JsonLd";

interface NewsUpdateType {
    id: string;
    title: string;
    slug: string;
    content: any;
    excerpt: string;
    author: string;
    publishedDate: string;
    image?: string;
    tags?: string[];
}

const calculateReadTime = (content: any): number => {
    if (!content) return 3;
    // Handle both string and Rich text Document
    const text = typeof content === 'string'
        ? content
        : JSON.stringify(content);
    const wordCount = text.split(/\s+/).length;
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
        <div className="min-h-screen pt-[90px]">
            <Helmet>
                <title>{post.title} | AfriNuts Export News</title>
                <meta name="description" content={post.excerpt || `Read "${post.title}" — the latest update from AfriNuts Export's cashew farm and processing operations in Odienné, Côte d'Ivoire.`} />
                <link rel="canonical" href={`https://www.afrinutsexport.com/news/${post.slug}`} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.image} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={post.publishedDate} />
                <meta property="article:author" content={post.author || 'AfriNuts Export'} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                <meta name="twitter:image" content={post.image} />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                "headline": post.title,
                "description": post.excerpt,
                "image": post.image,
                "datePublished": post.publishedDate,
                "author": {
                    "@type": "Person",
                    "name": post.author || 'AfriNuts Export'
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "url": "https://www.afrinutsexport.com"
                }
            }} />

            <Section className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    {/* Breadcrumbs */}
                    <div className="text-sm text-text-dark mb-4 flex items-center gap-1 flex-wrap">
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
                        <Typography variant="h1" id="news-post-title" className="text-3xl md:text-4xl font-bold mb-4 text-text-dark">
                            {post.title}
                        </Typography>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                            <span className="flex items-center gap-1"><FaClock /> {readTime} min read</span>
                            {/* Listen Button */}
                            <button
                                onClick={() => {
                                    const content = document.querySelector('[role="textbox"]');
                                    if (content) {
                                        content.setAttribute('tabindex', '-1');
                                        (content as HTMLElement).focus();
                                    }
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                                aria-label="Focus article content for screen reader"
                                title="Use your device's built-in screen reader to listen"
                            >
                                <FaHeadphones className="text-xs" />
                                <span>Listen</span>
                            </button>
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
                        <article aria-labelledby="news-post-title" role="article">
                            <div
                                className="prose prose-lg max-w-none"
                                role="textbox"
                                aria-label="News article content"
                                tabIndex={0}
                            >
                                {post.content ? (
                                    typeof post.content === 'string' ? (
                                        // Plain text fallback
                                        post.content.split('\n').map((paragraph: string, i: number) => (
                                            <Typography key={i} variant="body" className="text-gray-700 mb-4 leading-relaxed">
                                                {paragraph}
                                            </Typography>
                                        ))
                                    ) : (
                                        // Rich text (Document object)
                                        documentToReactComponents(post.content, {
                                            renderNode: {
                                                [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
                                                    try {
                                                        const target = node?.data?.target;
                                                        if (!target?.fields?.file?.url) {
                                                            return null;
                                                        }
                                                        const imageUrl = `https:${target.fields.file.url}`;
                                                        const altText = target.fields.description || target.fields.title || 'News image';
                                                        const imageDetails = target.fields.file.details?.image;
                                                        const isPortrait = imageDetails && imageDetails.height > imageDetails.width;

                                                        return (
                                                            <div className="my-8 flex justify-center">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={altText}
                                                                    className={`rounded-2xl shadow-lg border-2 border-white/20 object-contain ${
                                                                        isPortrait
                                                                            ? 'max-h-[500px] w-auto'
                                                                            : 'max-w-full max-h-[400px]'
                                                                    }`}
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                        );
                                                    } catch {
                                                        return null;
                                                    }
                                                },
                                                [BLOCKS.HEADING_2]: (_node, children) => (
                                                    <Typography variant="h3" className="text-xl font-bold text-primary mt-8 mb-4">{children}</Typography>
                                                ),
                                                [BLOCKS.HEADING_3]: (_node, children) => (
                                                    <Typography variant="h4" className="text-lg font-semibold text-text-dark mt-6 mb-3">{children}</Typography>
                                                ),
                                                [BLOCKS.PARAGRAPH]: (_node, children) => (
                                                    <Typography variant="body" className="text-gray-700 mb-4 leading-relaxed">{children}</Typography>
                                                ),
                                                [BLOCKS.UL_LIST]: (_node, children) => (
                                                    <ul className="list-disc pl-6 mb-4 space-y-2" role="list">{children}</ul>
                                                ),
                                                [BLOCKS.OL_LIST]: (_node, children) => (
                                                    <ol className="list-decimal pl-6 mb-4 space-y-2" role="list">{children}</ol>
                                                ),
                                                [BLOCKS.LIST_ITEM]: (_node, children) => (
                                                    <li className="text-gray-700">{children}</li>
                                                ),
                                            },
                                            renderMark: {
                                                [MARKS.BOLD]: (text) => <strong className="font-bold text-text-dark">{text}</strong>,
                                            },
                                        })
                                    )
                                ) : null}
                            </div>
                        </article>
                    </motion.div>


                    {/* Post Footer CTA */}
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Newsletter Form */}
                            <motion.div
                                className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-6 text-center overflow-hidden transform-gpu"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                whileHover={{ y: -6, scale: 1.02, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)', transition: { duration: 0.3 } }}
                            >
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
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
                                        <label htmlFor="news-newsletter" className="sr-only">Email address</label>
                                        <input type="email" id="news-newsletter" placeholder="Your email address" required
                                               className="w-full px-4 py-2 rounded-full border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                        <button type="submit" disabled={subscribeStatus === 'loading'}
                                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full transform-gpu group/btn overflow-hidden disabled:opacity-50 font-medium text-sm">
                                            <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                            <span className="relative z-10">
                            {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                        </span>
                                        </button>
                                        {subscribeStatus !== 'idle' && (
                                            <p className={`text-xs ${subscribeStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{subscribeMessage}</p>
                                        )}
                                    </form>
                                </div>
                            </motion.div>

                            {/* Explore Blog */}
                            <motion.div
                                className="relative bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-accent/20 rounded-3xl shadow-xl p-6 text-center overflow-hidden transform-gpu"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                whileHover={{ y: -6, scale: 1.02, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)', transition: { duration: 0.3 } }}
                            >
                                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
                                <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                                <div className="relative z-10">
                                    <Typography variant="h4" className="mb-2 text-primary">Explore Our Blog</Typography>
                                    <Typography variant="small" className="text-gray-600 mb-4">
                                        Read in-depth articles on cashew farming, sustainability, and industry insights.
                                    </Typography>
                                    <button onClick={() => {
                                        trackCtaClick('visit_blog', 'news_post');
                                        navigate('/blog');
                                    }}
                                            className="relative bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-white px-6 py-2.5 rounded-full transform-gpu group/btn overflow-hidden font-medium text-sm">
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                        <span className="relative z-10">Visit Blog</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Back to News */}
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
                                        <img src={related.image || newsImage} alt={related.title} className="w-full h-64 object-cover" />
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