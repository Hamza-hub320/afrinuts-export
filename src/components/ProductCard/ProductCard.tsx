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
            className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[480px] transform-gpu ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -10,
                scale: 1.03,
                rotateY: 3,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transition: { duration: 0.3 }
            }}
            whileTap={{ y: -2, scale: 0.98 }}
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Inner shadow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

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
            <div className="relative w-full h-64 md:h-72 overflow-hidden z-10 rounded-t-2xl">
                {imageSrc && (
                    <motion.img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading={product.loading || 'lazy'}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    />
                )}
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                {!product.available && (
                    <motion.div
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-white/30 text-xs md:text-sm font-semibold transform-gpu"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        {product.comingSoon || t('productCard.comingSoon')}
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow relative z-10">
                {/* Header */}
                <div className="flex items-start mb-4">
                    {IconComponent && (
                        <motion.div
                            className="bg-white/40 backdrop-blur-md p-3 rounded-full mr-4 flex-shrink-0 shadow-md transform-gpu group-hover:scale-110 transition-transform duration-500"
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <IconComponent className="text-primary text-xl transform-gpu group-hover:scale-110 transition-transform duration-300" />
                        </motion.div>
                    )}
                    <div>
                        <Typography variant="h4" className="text-gray-900 font-bold text-lg relative z-10">
                            {product.name}
                        </Typography>
                        {!compact && (
                            <Typography variant="body" className="text-gray-700 text-sm mt-2 relative z-10">
                                {product.description}
                            </Typography>
                        )}
                    </div>
                </div>

                {/* Features */}
                {!compact && product.features?.length > 0 && (
                    <div className="mb-5">
                        <ul className="space-y-2">
                            {product.features.map((feature, i) => (
                                <motion.li
                                    key={i}
                                    className="flex items-start bg-white/30 backdrop-blur-sm rounded-lg p-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="bg-primary/20 p-1 rounded-full mr-2 mt-1 min-w-[20px] min-h-[20px] flex items-center justify-center">
                                        <FaCheck className="text-primary text-xs" />
                                    </div>
                                    <Typography variant="body" className="text-gray-700 text-sm">
                                        {feature}
                                    </Typography>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* CTA Button */}
                <div className="mt-auto">
                    {product.available ? (
                        <motion.button
                            className="w-full bg-gradient-to-r from-primary to-accent text-white px-5 py-3 rounded-lg font-medium shadow-md flex items-center justify-center transition-all transform-gpu hover:scale-105 group/btn"
                            onClick={handleContactClick}
                            aria-label={t('productCard.requestQuote')}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('productCard.requestQuote')}
                            <motion.span
                                className="ml-2"
                                whileHover={{ x: 3 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <FaArrowRight className="transition-transform group-hover/btn:translate-x-1" />
                            </motion.span>
                        </motion.button>
                    ) : (
                        <motion.div
                            className="text-center py-3 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20"
                            whileHover={{ y: -2 }}
                        >
                            <Typography variant="body" className="text-gray-700 font-medium">
                                {t('productCard.comingSoon')}
                            </Typography>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;