import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { FaArrowRight, FaCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
    product: {
        name: string;
        description: string;
        icon: string;
        backgroundImage: string;
        features: string[];
        available: boolean;
        comingSoon?: string;
        loading?: 'lazy' | 'eager';
    };
    compact?: boolean;
    handleContactClick: () => void;
    productImageMap: Record<string, string>;
    iconMap: Record<string, React.ComponentType<{ className?: string }>>;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    compact = false,
    handleContactClick,
    productImageMap,
    iconMap,
    className = ''
}) => {
    const { t } = useTranslation('products');
    const IconComponent = iconMap[product.icon];
    const imageSrc = productImageMap[product.backgroundImage];

    return (
        <motion.div
            className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-300 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[480px] ${className}`}
            whileHover={{ y: -8, boxShadow: '0 15px 30px -5px rgba(0,0,0,0.2)', scale: 1.02 }}
            whileTap={{ y: -2, scale: 0.98 }}
        >

            {/* Advanced Glow Effect */}
            <div
                aria-hidden="true"
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div className="absolute inset-0 scale-105 blur-2xl opacity-80"
                    style={{
                        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255, 186, 73, 0.25) 0%, rgba(255,255,255,0.10) 60%, rgba(255,186,73,0.08) 100%)'
                    }}
                />
                <div className="absolute inset-0 scale-110 blur-3xl opacity-60"
                    style={{
                        background: 'radial-gradient(ellipse 60% 40% at 50% 60%, rgba(255, 120, 0, 0.12) 0%, rgba(255,255,255,0.02) 100%)'
                    }}
                />
            </div>
            {/* Image Section */}
            <div className="relative w-full h-64 md:h-72 overflow-hidden z-10">
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading={product.loading || 'lazy'}
                    />
                )}
                {!product.available && (
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200 text-xs md:text-sm font-semibold">
                        {product.comingSoon || t('productCard.comingSoon')}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow relative z-10">
                {/* Header */}
                <div className="flex items-start mb-4">
                    {IconComponent && (
                        <div className="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                            <IconComponent className="text-orange-600 text-xl" />
                        </div>
                    )}
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

                {/* Features */}
                {!compact && product.features?.length > 0 && (
                    <div className="mb-5">
                        <ul className="space-y-1">
                            {product.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                    <FaCheck className="text-primary mr-2 mt-1 min-w-[16px]" />
                                    <Typography variant="body" className="text-gray-700 text-sm">
                                        {feature}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* CTA Button */}
                <div className="mt-auto">
                    {product.available ? (
                        <motion.button
                            className="w-full bg-primary hover:bg-accent text-white px-5 py-3 rounded-lg font-medium shadow-md flex items-center justify-center transition-all"
                            onClick={handleContactClick}
                            aria-label={t('productCard.requestQuote')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {t('productCard.requestQuote')}
                            <FaArrowRight className="ml-2 transition-transform" />
                        </motion.button>
                    ) : (
                        <div className="text-center py-3 bg-gray-100 rounded-lg">
                            <Typography variant="body" className="text-gray-700 font-medium">
                                {t('productCard.comingSoon')}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;