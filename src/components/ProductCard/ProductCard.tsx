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
                                                            height = 'h-72'
                                                        }) => {
    const IconComponent = iconMap[product.icon];
    const imageSrc = productImageMap[product.backgroundImage];

    // Determine glow intensity based on card type
    const glowIntensity = compact ? 'glow-accent-sm' : 'glow-accent-md';
    const directionalGlow = 'glow-left'; // Change to 'glow-right' or 'glow-bottom' as needed

    return (
        <motion.div
            className={`group relative bg-white rounded-xl shadow-lg border border-warm-grey/20 ${
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
                        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                            <Typography variant="small" className="text-text-dark font-medium">
                                Coming Soon
                            </Typography>
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    {/* Header with icon */}
                    <div className="flex items-start mb-4">
                        <div className="
              bg-accent/10 p-3 rounded-full mr-4 flex-shrink-0
              group-hover:bg-accent/20 group-hover:shadow-glow-accent-xs
              transition-all duration-300
            ">
                            {IconComponent && React.createElement(IconComponent, {
                                className: "text-accent text-xl group-hover:text-accent/90 transition-colors"
                            })}
                        </div>
                        <div>
                            <Typography variant="h4" className="text-primary font-bold text-lg group-hover:text-dark">
                                {product.name}
                            </Typography>
                            {!compact && (
                                <Typography variant="body" className="text-text-dark text-sm mt-2 group-hover:text-dark/90">
                                    {product.description}
                                </Typography>
                            )}
                        </div>
                    </div>

                    {/* Features list */}
                    {!compact && product.features && (
                        <div className="mb-5">
                            <Typography variant="h4" className="text-primary text-sm font-semibold mb-3">
                                KEY FEATURES
                            </Typography>
                            <ul className="space-y-2">
                                {product.features.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-start group/feature">
                                        <span className="text-accent mr-2 mt-0.5 group-hover/feature:text-dark-orange transition-colors">•</span>
                                        <Typography variant="body" className="text-text-dark text-sm group-hover/feature:text-dark/90">
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
                                className={`w-full group/btn bg-accent hover:bg-dark-orange text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-glow-accent transition-all flex items-center justify-center`}
                                onClick={handleContactClick}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Request Quote
                                <FaArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </motion.button>
                        ) : (
                            <div className="text-center py-3 bg-warm-grey/20 rounded-lg group-hover:bg-warm-grey/30 transition-colors">
                                <Typography variant="body" className="text-text-dark font-medium">
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