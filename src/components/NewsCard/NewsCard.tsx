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
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg"
            variants={variants}
            whileHover={{
                y: -10,
                transition: { duration: 0.3 }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {/* Card Content */}
            <div className="relative z-10 h-full flex flex-col bg-white rounded-xl overflow-hidden">
                <div className="h-64 bg-cover bg-center relative">
                    <img
                        src={newsItem.image}
                        alt=""
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <FaNewspaper className="text-orange-600" />
                        <span className="text-orange-600 text-sm font-medium">
                            {newsItem.category} • {newsItem.date}
                        </span>
                    </div>
                    <Typography variant="h4" className="mb-4 text-gray-900">
                        {newsItem.title}
                    </Typography>
                    <Typography variant="body" className="mb-6 text-gray-700">
                        {newsItem.description}
                    </Typography>
                    <button
                        className="text-orange-600 font-medium inline-flex items-center hover:text-orange-700"
                        onClick={onClick}
                    >
                        Read more
                        <FaArrowRight className="ml-2 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default NewsCard;