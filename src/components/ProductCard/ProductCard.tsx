import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import {t} from "i18next";

interface ProductCardProps {
    product: {
        name: string;
        height?: string;
        description: string;
        icon: string;
        backgroundImage: string;
        features: string[];
        available: boolean;
        comingSoon?: string;
        loading?: 'lazy' | 'eager';
    };
    variants?: any;
    compact?: boolean;
    handleContactClick: () => void;
    productImageMap: Record<string, string>;
    iconMap: Record<string, React.ComponentType>;
    height?: string;
    className?: string;
    loading?: 'lazy' | 'eager';
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            product,
                                                            variants,
                                                            compact = false,
                                                            handleContactClick,
                                                            productImageMap,
                                                            iconMap,
                                                            height = 'h-72'
                                                        }) => {
    const IconComponent = iconMap[product.icon];
    const imageSrc = productImageMap[product.backgroundImage];
    // Determine glow intensity based on card type
    const glowIntensity = compact ? 'glow-accent-sm' : 'glow-accent-md';
    const directionalGlow = 'glow-left';


    return (
        <motion.div
            className={`group relative bg-white rounded-xl shadow-lg border border-gray-200 ${
                compact ? 'h-full' : 'flex flex-col'
            }`}
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

            {/* Main content */}
            <div className="relative z-10 h-full flex flex-col bg-white rounded-xl overflow-hidden">
                {/* Image with gradient overlay */}
                <div className={`${height} relative overflow-hidden`}>
                    {imageSrc && (
                        <>
                            <img
                                src={imageSrc}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                        </>
                    )}
                    {!product.available && (
                        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                            <Typography variant="small" className="text-gray-800 font-medium">
                                Coming Soon
                            </Typography>
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    {/* Header with icon */}
                    <div className="flex items-start mb-4">
                        <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                            {IconComponent && React.createElement(IconComponent, {
                                className: "text-orange-600 text-xl"
                            })}
                        </div>
                        <div>
                            <Typography variant="h4" className="text-gray-900 font-bold text-lg">
                                {product.name}
                            </Typography>
                            {!compact && (
                                <Typography variant="body" className="text-gray-700 text-sm mt-2">
                                    {product.description}
                                </Typography>
                            )}
                        </div>
                    </div>

                    {/* Features list */}
                    {!compact && product.features && (
                        <div className="mb-5">
                            <ul className="space-y-2">
                                {product.features.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-start">
                                        <span className="text-gray-900 group-hover/feature:text-orange-600 mr-2 mt-0.5 transition-colors">•</span>
                                        <Typography variant="body" className="text-gray-700 text-sm">
                                            {feature}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Button */}
                    <div className="mt-auto">
                        {product.available ? (
                            <motion.button
                                className={`w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all flex items-center justify-center`}
                                onClick={handleContactClick}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Request Quote
                                <FaArrowRight className="ml-2 transition-transform" />
                            </motion.button>
                        ) : (
                            <div className="text-center py-3 bg-gray-100 rounded-lg">
                                <Typography variant="body" className="text-gray-700 font-medium">
                                    {product.comingSoon}
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;