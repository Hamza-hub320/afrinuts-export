// src/components/NewsCard/NewsCard.tsx
import { motion } from 'framer-motion';
import { FaNewspaper, FaArrowRight } from 'react-icons/fa';
import { Typography } from '../Typography/Typography';

interface NewsCardProps {
    newsItem: {
        title: string;
        date: string;
        category: string;
        description: string;
        image: string;
    };
    onClick: () => void;
    variants?: any;
}

export const NewsCard: React.FC<NewsCardProps> = ({ newsItem, onClick, variants }) => {
    return (
        <motion.div
            className="group relative bg-background rounded-2xl overflow-hidden"
            variants={variants}
            whileHover={{
                y: -10,
                transition: { duration: 0.3 }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {/* Glow Effect - Fixed implementation */}
            <div className="
        absolute -inset-0.5 rounded-[15px]
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
        shadow-glow-accent-md
        z-0
      "></div>

            {/* Border Glow */}
            <div className="
        absolute -inset-px rounded-[15px]
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        pointer-events-none
        border border-accent/30
        z-0
      "></div>

            {/* Card Content */}
            <div className="relative z-10 h-full flex flex-col bg-background rounded-xl overflow-hidden">
                <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${newsItem.image})` }} />
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                        <FaNewspaper className="text-accent" />
                        <span className="text-accent text-sm font-medium">
              {newsItem.category} • {newsItem.date}
            </span>
                    </div>
                    <Typography variant="h4" className="mb-4">
                        {newsItem.title}
                    </Typography>
                    <Typography variant="body" className="mb-6">
                        {newsItem.description}
                    </Typography>
                    <button
                        className="text-accent font-medium inline-flex items-center group"
                        onClick={onClick}
                    >
                        Read more
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};