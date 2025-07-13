import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { FaArrowRight } from 'react-icons/fa';

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
    };
    variants?: any;
    compact?: boolean;
    handleContactClick: () => void;
    productImageMap: Record<string, string>;
    iconMap: Record<string, React.ComponentType>;
    height?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            product,
                                                            variants,
                                                            compact = false,
                                                            handleContactClick,
                                                            productImageMap,
                                                            iconMap,
                                                            height = 'h-72' // Slightly taller default
                                                        }) => {
    const IconComponent = iconMap[product.icon];
    const imageSrc = productImageMap[product.backgroundImage];

    return (
        <motion.div
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-warm-grey/20 ${
                compact ? 'h-full' : 'flex flex-col'
            }`}
            variants={variants}
            whileHover={{
                y: -8,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
        >
            {/* Image with gradient overlay */}
            <div className={`${height} relative overflow-hidden`}>
                {imageSrc && (
                    <>
                        <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                    </>
                )}
                {!product.available && (
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                        <Typography variant="small" className="text-text-dark font-medium">
                            Coming Soon
                        </Typography>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start mb-4">
                    <div className="bg-accent/10 p-3 rounded-full mr-4 flex-shrink-0">
                        {IconComponent && React.createElement(IconComponent, { className: "text-accent text-xl" })}
                    </div>
                    <div>
                        <Typography variant="h4" className="font-bold text-primary">
                            {product.name}
                        </Typography>
                        {!compact && (
                            <Typography variant="body" className="text-text-dark mt-2">
                                {product.description}
                            </Typography>
                        )}
                    </div>
                </div>

                {!compact && product.features && (
                    <div className="mb-5">
                        <Typography variant="h4" className="text-sm font-medium text-primary mb-3">
                            KEY FEATURES
                        </Typography>
                        <ul className="space-y-2">
                            {product.features.map((feature: string, i: number) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-accent mr-2 mt-0.5">•</span>
                                    <Typography variant="body" className="text-sm text-text-dark">
                                        {feature}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-auto">
                    {product.available ? (
                        <motion.button
                            className={`w-full group bg-accent hover:bg-dark-orange text-white ${
                                compact ? 'px-4 py-2 text-sm' : 'px-6 py-3'
                            } rounded-lg transition-all duration-300 font-medium flex items-center justify-center`}
                            onClick={handleContactClick}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Request Quote
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    ) : (
                        <div className="text-center py-3 bg-warm-grey/20 rounded-lg">
                            <Typography variant="body" className="text-text-dark font-medium">
                                {product.comingSoon}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};