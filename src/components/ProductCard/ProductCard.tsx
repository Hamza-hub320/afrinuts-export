import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import {FaArrowRight, FaCheck, FaBell, FaClock, FaShoppingCart, FaInfoCircle, FaIndustry, FaLeaf} from 'react-icons/fa';
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
        preorder?: boolean;
        preorderDate?: string;
        waitlist?: boolean;
        status?: 'available' | 'preorder' | 'waitlist' | 'coming-soon';
        productionType?: 'organic' | 'conventional' | 'both';
        variants?: { name: string; priceRange: string }[];
        conventionalVariants?: { name: string; priceRange: string }[];
        certifications?: string[];
        loading?: 'lazy' | 'eager';
        title?: string;
    };
    productionTypeFilter?: 'all' | 'organic' | 'conventional';
    compact?: boolean;
    handleContactClick: () => void;
    handlePreorderClick?: () => void;
    handleWaitlistClick?: () => void;
    productImageMap: Record<string, string>;
    iconMap: Record<string, React.ComponentType<{ className?: string }>>;
    className?: string;
    imageAlt?: string;
    ariaLabel?: string;
    renderSocialShare?: () => React.ReactNode;
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            product,
                                                            productionTypeFilter = 'all',
                                                            compact = false,
                                                            handleContactClick,
                                                            handlePreorderClick,
                                                            handleWaitlistClick,
                                                            productImageMap,
                                                            iconMap,
                                                            className = '',
                                                            imageAlt,
                                                            renderSocialShare,
                                                        }) => {
    const { t } = useTranslation('products');
    const IconComponent = iconMap[product.icon];
    const imageSrc = productImageMap[product.backgroundImage];

    // Determine product status
    const getProductStatus = () => {
        if (product.available) return 'available';
        if (product.preorder) return 'preorder';
        if (product.waitlist) return 'waitlist';
        return 'coming-soon';
    };

    const showOrganic = productionTypeFilter === 'all' || productionTypeFilter === 'organic';
    const showConventional = productionTypeFilter === 'all' || productionTypeFilter === 'conventional';
    const isOrganicOnly = productionTypeFilter === 'organic';
    const isConventionalOnly = productionTypeFilter === 'conventional';

    const status = getProductStatus();

    // Get status badge text
    const getStatusBadgeText = () => {
        switch (status) {
            case 'preorder':
                return product.preorderDate
                    ? t('productCard.preorderBadgeWithDate', { date: product.preorderDate })
                    : t('productCard.preorderBadge');
            case 'waitlist':
                return t('productCard.waitlistBadge');
            case 'coming-soon':
                return product.comingSoon || t('productCard.comingSoon');
            default:
                return null;
        }
    };

    // Get button configuration
    const getButtonConfig = () => {
        switch (status) {
            case 'available':
                return {
                    text: t('productCard.requestQuote'),
                    onClick: handleContactClick,
                    icon: FaArrowRight,
                    variant: 'primary'
                };
            case 'preorder':
                return {
                    text: t('productCard.preorderButton'),
                    onClick: handlePreorderClick || handleContactClick,
                    icon: FaShoppingCart,
                    variant: 'preorder'
                };
            case 'waitlist':
                return {
                    text: t('productCard.waitlistButton'),
                    onClick: handleWaitlistClick || handleContactClick,
                    icon: FaBell,
                    variant: 'waitlist'
                };
            default:
                return null;
        }
    };

    const buttonConfig = getButtonConfig();

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
            <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none">
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
                {/* Organic Badge */}
                {showOrganic && product.productionType !== 'conventional' && (
                    <div className="absolute top-4 left-4 z-20 bg-green-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md border border-green-300/30">
                        <FaLeaf className="text-[10px]" />
                        {t('productCard.organic', 'Organic')}
                    </div>
                )}
                {imageSrc && (
                    <motion.img
                        src={imageSrc}
                        alt={imageAlt || product.name}
                        className="w-full h-full object-cover"
                        loading={product.loading || 'lazy'}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    />
                )}
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                {/* Status Badge */}
                {status !== 'available' && (
                    <motion.div
                        className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-white/30 text-xs md:text-sm font-semibold transform-gpu flex items-center gap-1 ${
                            status === 'preorder'
                                ? 'bg-accent/90 text-white'
                                : status === 'waitlist'
                                    ? 'bg-primary/90 text-white'
                                    : 'bg-white/90 text-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        {status === 'preorder' && <FaShoppingCart className="text-xs" />}
                        {status === 'waitlist' && <FaBell className="text-xs" />}
                        {status === 'coming-soon' && <FaClock className="text-xs" />}
                        {getStatusBadgeText()}
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

                {/* Pre-order Info Text */}
                {status === 'preorder' && product.preorderDate && (
                    <motion.div className="mb-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Typography variant="small" className="text-accent font-medium flex items-center justify-center gap-1.5">
                            <FaClock className="text-xs" />
                            {t('productCard.estimatedDelivery')}: {product.preorderDate}
                        </Typography>
                    </motion.div>
                )}

                {/* Waitlist Info Text */}
                {status === 'waitlist' && (
                    <motion.div className="mb-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Typography variant="small" className="text-primary font-medium flex items-center justify-center gap-1.5">
                            <FaBell className="text-xs" />
                            {t('productCard.beNotified')}
                        </Typography>
                    </motion.div>
                )}

                {/* Organic Variants */}
                {showOrganic && product.variants && product.variants.length > 0 && (
                    <div className="mb-3">
                        <Typography variant="small" className="text-green-700 font-medium mb-1.5 flex items-center gap-1">
                            <FaLeaf className="text-xs" />
                            {!isConventionalOnly ? 'Organic' : ''}:
                        </Typography>
                        <div className="space-y-1">
                            {product.variants.map((variant, i) => (
                                <div key={i} className="flex justify-between items-center bg-green-50/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm border border-green-100">
                                    <span className="text-gray-700">{variant.name.replace(/^Organic\s+/i, '')}</span>
                                    <span className="text-green-700 font-semibold">{variant.priceRange}</span>
                                </div>
                            ))}
                        </div>
                        {!product.available && (
                            <Typography variant="small" className="text-amber-600 text-xs mt-2 flex items-center gap-1">
                                <FaInfoCircle className="text-[10px]" />
                                {t('productCard.priceEstimate', 'Estimated pricing — subject to change based on market conditions at launch.')}
                            </Typography>
                        )}
                    </div>
                )}

                {/* Conventional Variants */}
                {showConventional && product.conventionalVariants && product.conventionalVariants.length > 0 && (
                    <div className="mb-3">
                        <Typography variant="small" className="text-gray-600 font-medium mb-1.5 flex items-center gap-1">
                            <FaIndustry className="text-xs" />
                            {!isOrganicOnly ? 'Conventional' : ''}:
                        </Typography>
                        <div className="space-y-1">
                            {product.conventionalVariants.map((variant, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-50/50 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm border border-gray-200">
                                    <span className="text-gray-600">{variant.name.replace(/^Conventional\s+/i, '')}</span>
                                    <span className="text-gray-700 font-semibold">{variant.priceRange}</span>
                                </div>
                            ))}
                        </div>
                        {!product.available && (
                            <Typography variant="small" className="text-amber-600 text-xs mt-2 flex items-center gap-1">
                                <FaInfoCircle className="text-[10px]" />
                                {t('productCard.priceEstimate', 'Estimated pricing — subject to change based on market conditions at launch.')}
                            </Typography>
                        )}
                    </div>
                )}

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.certifications.map((cert, i) => (
                            <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                {cert}
            </span>
                        ))}
                    </div>
                )}

                {/* CTA Button */}
                <div className="mt-auto">
                    {buttonConfig ? (
                        <motion.button
                            className={`w-full px-5 py-3 rounded-full font-medium shadow-md flex items-center justify-center transition-all transform-gpu hover:scale-105 group/btn gap-2 ${
                                buttonConfig.variant === 'preorder'
                                    ? 'bg-gradient-to-r from-accent to-dark-orange text-white'
                                    : buttonConfig.variant === 'waitlist'
                                        ? 'bg-gradient-to-r from-primary to-olive text-white'
                                        : 'bg-gradient-to-r from-primary to-accent text-white'
                            }`}
                            onClick={buttonConfig.onClick}
                            aria-label={buttonConfig.text}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">{buttonConfig.text}</span>
                            <motion.span whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400 }}>
                                <buttonConfig.icon className="transition-transform group-hover/btn:translate-x-1" />
                            </motion.span>
                        </motion.button>
                    ) : (
                        <motion.div
                            className="text-center py-3 bg-white/30 backdrop-blur-sm rounded-full border border-white/20"
                            whileHover={{ y: -2 }}
                        >
                            <Typography variant="body" className="text-primary font-medium flex items-center justify-center gap-2">
                                <FaClock className="text-sm" />
                                {product.comingSoon || t('productCard.comingSoon')}
                            </Typography>
                        </motion.div>
                    )}
                </div>
                {/* Social Share */}
                {renderSocialShare && (
                    <div className="px-5 pb-4 pt-1 relative z-10">
                        {renderSocialShare()}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;