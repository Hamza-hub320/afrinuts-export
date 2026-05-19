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
    FaHeadphones
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import Section from '@/components/Section/Section';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import JsonLd from '@/components/Seo/JsonLd';
import { Helmet } from 'react-helmet-async';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import {staggerContainer} from "@/utils/animations";
import { trackCtaClick } from '@/utils/analytics';
interface BlogPostType {
    slug: string;
    title: string;
    content: any;
    excerpt: string;
    category: string;
    author: string;
    publishedDate: string;
    updatedDate?: string;
    featuredImage?: string;
    metaTitle?: string;
    metaDescription?: string;
}

const calculateReadTime = (content: any): number => {
    if (!content) return 5;
    const text = JSON.stringify(content);
    const wordCount = text.split(/\s+/).length;
    return Math.max(3, Math.ceil(wordCount / 200));
};

const options = {
    renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
            try {
                const target = node?.data?.target;
                if (!target?.fields?.file?.url) {
                    return null;
                }
                const imageUrl = `https:${target.fields.file.url}`;
                const altText = target.fields.description || target.fields.title || 'Blog post image';
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
        [BLOCKS.TABLE]: (node: any, children: any) => (
            <div className="overflow-x-auto my-6">
                <table className="min-w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                    <tbody>{children}</tbody>
                </table>
            </div>
        ),
        [BLOCKS.TABLE_ROW]: (node: any, children: any) => (
            <tr className="border-b border-gray-200 even:bg-gray-50">{children}</tr>
        ),
        [BLOCKS.TABLE_CELL]: (node: any, children: any) => (
            <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0">{children}</td>
        ),
        [BLOCKS.TABLE_HEADER_CELL]: (node: any, children: any) => (
            <th className="px-4 py-3 text-sm font-semibold text-primary bg-primary/5 border-r border-gray-200 last:border-r-0 text-left">{children}</th>
        ),
    },
};

const getAuthorBio = (author: string): string => {
    if (author.includes('Hamza Sangare')) {
        return 'Founder & CEO of AfriNuts Export, a family-owned organic cashew farm in Odienné, Ivory Coast. Hamza combines three generations of farming heritage with modern agribusiness practices.';
    }
    if (author.includes('Sekou')) {
        return 'Co-founder & CFO/COO at AfriNuts Export, overseeing financial strategy and operations across the 35-hectare organic cashew farm.';
    }
    return 'Cashew farming expert at AfriNuts Export, sharing practical insights from our 35-hectare farm in West Africa.';
};

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
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
                const response = await fetch(`/.netlify/functions/blog?slug=${slug}`);
                const data = await response.json();
                setPost(data.post);

                // Fetch related posts by category
                if (data.post?.category) {
                    const relatedResponse = await fetch(
                        `/.netlify/functions/blog?category=${encodeURIComponent(data.post.category)}`
                    );
                    const relatedData = await relatedResponse.json();
                    setRelatedPosts(
                        (relatedData.posts || [])
                            .filter((p: BlogPostType) => p.slug !== data.post.slug)
                            .slice(0, 3)
                    );
                }
            } catch (error) {
                console.error('Error fetching post:', error);
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
                <Typography variant="h3" className="text-gray-400">Post not found</Typography>
            </div>
        );
    }

    const readTime = calculateReadTime(post.content);

    return (
        <div className="min-h-screen pt-[72px]">
            {/* SEO Metadata */}
            <Helmet>
                <title>{post.metaTitle ? `${post.metaTitle} | AfriNuts Export` : `${post.title} | AfriNuts Export`}</title>
                <meta name="description" content={post.metaDescription || post.excerpt || `Learn about ${post.title} from AfriNuts Export's cashew farm in Ivory Coast.`} />
                <link rel="canonical" href={`https://www.afrinutsexport.com/blog/${post.slug}`} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:image" content={post.featuredImage} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={post.publishedDate} />
                <meta property="article:author" content={post.author} />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {/* JSON-LD Structured Data */}
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.excerpt,
                "image": post.featuredImage,
                "datePublished": post.publishedDate,
                "dateModified": post.updatedDate || post.publishedDate,
                "author": {
                    "@type": "Person",
                    "name": post.author,
                    "url": "https://www.afrinutsexport.com/executive-team"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.afrinutsexport.com/logo192.png"
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://www.afrinutsexport.com/blog/${post.slug}`
                }
            }} />

            <Section className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    {/* Breadcrumbs */}
                    <div className="text-sm text-text-darkmb-4 flex items-center gap-1 flex-wrap">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        <span>/</span>
                        <span className="text-primary font-medium truncate max-w-[200px]">{post.title}</span>
                    </div>

                    <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-accent mb-6 transition-colors">
                        <FaArrowLeft /> Back to Blog
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mb-4">
                            {post.category}
                        </span>
                        <Typography variant="h1" id="post-title" className="text-3xl md:text-4xl font-bold mb-4 text-text-dark">
                            {post.title}
                        </Typography>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(post.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                            <span className="flex items-center gap-1"><FaClock /> {readTime} min read</span>
                            {/* Listen Button */}
                            <button
                                onClick={() => {
                                    const content = document.querySelector('.prose');
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

                        {post.featuredImage && (
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full rounded-2xl mb-8 shadow-lg border-2 border-white/20"
                            />
                        )}

                        {/* Social Share Buttons */}
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-sm text-gray-500 mr-1">Share:</span>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-500 transition-colors"
                                aria-label="Share on Twitter"
                            >
                                <FaTwitter className="text-sm" />
                            </a>
                            <a
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                aria-label="Share on LinkedIn"
                            >
                                <FaLinkedin className="text-sm" />
                            </a>
                            <a
                                href={`mailto:?subject=${shareTitle}&body=Check out this article: ${shareUrl}`}
                                className="p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                                aria-label="Share via Email"
                            >
                                <FaEnvelope className="text-sm" />
                            </a>
                        </div>

                        {/* Article Content */}
                        <article aria-labelledby="post-title" role="article">
                            <div
                                className="prose prose-lg max-w-none"
                                role="textbox"
                                aria-label="Article content"
                                tabIndex={0}
                            >
                                {post.content && documentToReactComponents(post.content, options)}
                            </div>
                        </article>
                    </motion.div>

                    {/* Author Bio */}
                    <motion.div
                        className="mt-10 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/20"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <FaUser className="text-accent" />
                            </div>
                            <div>
                                <Typography variant="h5" className="mb-1">About {post.author.split(',')[0]}</Typography>
                                <Typography variant="small" className="text-gray-600">
                                    {getAuthorBio(post.author)}
                                </Typography>
                            </div>
                        </div>
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

                            {/* Explore Products */}
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
                                    <Typography variant="h4" className="mb-2 text-primary">Looking for Premium Cashews?</Typography>
                                    <Typography variant="small" className="text-gray-600 mb-4">
                                        Explore our organic, sustainably-farmed cashew products.
                                    </Typography>
                                    <button onClick={() => {
                                        trackCtaClick('view_products', 'blog_post');
                                        navigate('/products');
                                    }}
                                            className="relative bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-white px-6 py-2.5 rounded-full transform-gpu group/btn overflow-hidden font-medium text-sm">
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                        <span className="relative z-10">View Products</span>
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

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <Section className="py-10 bg-gray-50/50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <Typography variant="h3" className="mb-6 text-center">Related Articles</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((related) => (
                                <Link to={`/blog/${related.slug}`} key={related.slug} className="group">
                                    <motion.div
                                        className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                                        whileHover={{ y: -4 }}
                                    >
                                        {related.featuredImage && (
                                            <img src={related.featuredImage} alt={related.title}
                                                 className="w-full h-36 object-cover" />
                                        )}
                                        <div className="p-4">
                                            <Typography variant="h5" className="group-hover:text-accent transition-colors line-clamp-2">
                                                {related.title}
                                            </Typography>
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

export default BlogPost;