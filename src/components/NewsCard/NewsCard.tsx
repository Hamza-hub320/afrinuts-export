import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface NewsCardProps {
    newsItem: {
        title: string;
        date: string;
        excerpt: string;
        image: string;
        url: string;
    };
    variants?: any;
    className?: string;
    loading?: 'lazy' | 'eager';
}

export const NewsCard: React.FC<NewsCardProps> = ({
                                                      newsItem,
                                                      variants,
                                                      className = '',
                                                      loading = 'lazy'
                                                  }) => {
    const { t } = useTranslation('home'); // Using 'home' namespace

    return (
        <motion.div
            className={`group relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col ${className}`}
            variants={variants}
            whileHover={{
                y: -8,
                transition: { duration: 0.3 }
            }}
        >
            {/* Glow overlay (AWS-style) */}
            <div className="
                absolute -inset-[2px] rounded-xl
                opacity-0 group-hover:opacity-100
                transition-opacity duration-300
                pointer-events-none
                shadow-glow-accent-md
                z-0
            "></div>

            {/* Image */}
            <div className="h-48 relative overflow-hidden">
                <img
                    src={newsItem.image}
                    alt={newsItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading={loading}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                    <Typography variant="caption" className="text-gray-500">
                        {newsItem.date}
                    </Typography>
                    <Typography variant="h4" className="text-gray-900 font-bold text-lg mt-1">
                        {newsItem.title}
                    </Typography>
                    <Typography variant="body" className="text-gray-700 text-sm mt-2">
                        {newsItem.excerpt}
                    </Typography>
                </div>

                {/* Read More Button */}
                <div className="mt-auto">
                    <a
                        href={newsItem.url}
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                    >
                        {t('newsCard.readMore')}
                        <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default NewsCard;