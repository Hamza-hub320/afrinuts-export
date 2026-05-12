import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaArrowLeft } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import Section from '@/components/Section/Section';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/.netlify/functions/blog?slug=${slug}`);
                const data = await response.json();
                setPost(data.post);
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

    return (
        <div className="min-h-screen pt-[72px]">
            <Section className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-accent mb-6 transition-colors">
                        <FaArrowLeft /> Back to Blog
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full mb-4">
                            {post.category}
                        </span>
                        <Typography variant="h1" className="text-3xl md:text-4xl font-bold mb-4 text-text-dark">
                            {post.title}
                        </Typography>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                            <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(post.publishedDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><FaUser /> {post.author}</span>
                        </div>

                        {post.featuredImage && (
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full rounded-2xl mb-8 shadow-lg border-2 border-white/20"
                            />
                        )}

                        <div className="prose prose-lg max-w-none">
                            {post.content && documentToReactComponents(post.content)}
                        </div>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default BlogPost;