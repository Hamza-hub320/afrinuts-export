import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { FaArrowRight, FaCheck, FaBell, FaClock, FaShoppingCart, FaInfoCircle, FaIndustry, FaLeaf, FaStar } from 'react-icons/fa';
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
    variant?: 'primary' | 'accent' | 'secondary';
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
                                                            product, productionTypeFilter = 'all', variant = 'secondary', compact = false,
                                                            handleContactClick, handlePreorderClick, handleWaitlistClick,
                                                            productImageMap, iconMap, className = '', imageAlt, renderSocialShare,
                                                        }) => {
    const { t } = useTranslation('products');
    const imageSrc = productImageMap[product.backgroundImage];

    const variantStyles = {
        primary: {
            bg: 'from-primary/5 to-accent/5',
            border: 'border-primary/20 hover:border-accent/30',
        },
        accent: {
            bg: 'from-accent/5 to-primary/5',
            border: 'border-accent/20 hover:border-primary/30',
        },
        secondary: {
            bg: 'from-secondary/5 to-primary/5',
            border: 'border-secondary/20 hover:border-primary/30',
        },
    };

    const currentVariant = variantStyles[variant];

    const getProductStatus = () => {
        if (product.available) return 'available';
        if (product.preorder) return 'preorder';
        if (product.waitlist) return 'waitlist';
        return 'coming-soon';
    };

    const showOrganic = productionTypeFilter === 'all' || productionTypeFilter === 'organic';
    const showConventional = productionTypeFilter === 'all' || productionTypeFilter === 'conventional';
    const status = getProductStatus();

    const getStatusBadgeText = () => {
        switch (status) {
            case 'preorder': return product.preorderDate ? t('productCard.preorderBadgeWithDate', { date: product.preorderDate }) : t('productCard.preorderBadge');
            case 'waitlist': return t('productCard.waitlistBadge');
            case 'coming-soon': return product.comingSoon || t('productCard.comingSoon');
            default: return null;
        }
    };

    const getButtonConfig = () => {
        switch (status) {
            case 'available': return { text: t('productCard.requestQuote'), onClick: handleContactClick, icon: FaArrowRight, variant: 'primary' as const };
            case 'preorder': return { text: t('productCard.preorderButton'), onClick: handlePreorderClick || handleContactClick, icon: FaShoppingCart, variant: 'preorder' as const };
            case 'waitlist': return { text: t('productCard.waitlistButton'), onClick: handleWaitlistClick || handleContactClick, icon: FaBell, variant: 'waitlist' as const };
            default: return null;
        }
    };

    const buttonConfig = getButtonConfig();

    return (
        <motion.div
            className={`group relative bg-gradient-to-br ${currentVariant.bg} border-2 ${currentVariant.border} rounded-2xl shadow-xl overflow-hidden flex flex-col transform-gpu transition-all duration-500 ${className}`}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 }, boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            role="region"
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/30 transition-all duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            {/* ===== HERO IMAGE — Now 60% of card height ===== */}
            <div className="relative w-full h-72 sm:h-80 md:h-96 overflow-hidden z-10 flex-shrink-0">
                <div className="relative w-full h-full overflow-hidden rounded-t-2xl rounded-b-[50px]">
                    {imageSrc && (
                        <motion.img
                            src={imageSrc}
                            alt={imageAlt || product.name}
                            className="w-full h-full object-cover"
                            loading={product.loading || 'lazy'}
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.6 }}
                        />
                    )}
                    {/* Gradient overlay — subtle at top, stronger at bottom for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                </div>

                {/* Organic Badge — top left */}
                {showOrganic && product.productionType !== 'conventional' && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-white/40 shadow-lg">
                        <FaLeaf className="text-green-600 text-xs" />
                        <span className="text-green-700 text-sm font-semibold">{t('productCard.organicLabel', 'Organic')}</span>
                    </div>
                )}

                {/* Status Badge — top right */}
                {status !== 'available' && (
                    <div className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/40 shadow-lg text-sm font-semibold ${
                        status === 'preorder' ? 'bg-accent text-white'
                            : status === 'waitlist' ? 'bg-primary text-white'
                                : 'bg-white text-gray-700'
                    }`}>
                        {status === 'preorder' && <FaShoppingCart className="text-[10px]" />}
                        {status === 'waitlist' && <FaBell className="text-[10px]" />}
                        {status === 'coming-soon' && <FaClock className="text-[10px]" />}
                        {getStatusBadgeText()}
                    </div>
                )}

                {/* Product Name Overlay — bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                    <Typography variant="h3" className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
                        {product.name}
                    </Typography>
                    {!compact && (
                        <Typography variant="small" className="text-white/90 mt-1 line-clamp-2 text-sm drop-shadow-md max-w-lg">
                            {product.description}
                        </Typography>
                    )}
                </div>
            </div>

            {/* ===== COMPACT CONTENT SECTION ===== */}
            <div className="relative z-10 flex flex-col flex-grow px-5 pt-4 pb-5">
                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.certifications.slice(0, 3).map((cert, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/40 backdrop-blur-sm text-primary text-xs rounded-full font-medium border border-white/30">
                                {cert}
                            </span>
                        ))}
                        {product.certifications.length > 3 && (
                            <span className="px-2 py-0.5 bg-white/40 backdrop-blur-sm text-gray-400 text-xs rounded-full">
                                +{product.certifications.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Pricing — Replace price ranges with Request Quote */}
                <div className="space-y-1.5 mb-3 flex-shrink-0">
                    {showOrganic && product.variants && product.variants.length > 0 && (
                        <div className="flex items-center justify-between text-sm bg-green-50/50 rounded-lg px-3 py-1.5">
                            <span className="text-green-700 font-medium flex items-center gap-1"><FaLeaf className="text-[10px]" />{t('productCard.organicLabel', 'Organic')}</span>
                            <span className="text-green-700 font-medium text-xs">{t('productCard.inquireForPrice', 'Inquire for Price')}</span>
                        </div>
                    )}
                    {showConventional && product.conventionalVariants && product.conventionalVariants.length > 0 && (
                        <div className="flex items-center justify-between text-sm bg-gray-50/50 rounded-lg px-3 py-1.5">
                            <span className="text-gray-600 font-medium flex items-center gap-1"><FaIndustry className="text-[10px]" />{t('productCard.conventionalLabel', 'Conventional')}</span>
                            <span className="text-gray-700 font-medium text-xs">{t('productCard.inquireForPrice', 'Inquire for Price')}</span>
                        </div>
                    )}
                </div>

                {/* Variants available — show options without prices */}
                {(product.variants?.length || product.conventionalVariants?.length) && (
                    <p className="text-gray-500 text-[10px] mb-2 flex items-center gap-1">
                        <FaStar className="text-[10px] flex-shrink-0" />
                        {t('productCard.customPricing', 'Custom pricing based on volume, grade, and certifications')}
                    </p>
                )}

                {/* Price disclaimer */}
                {!product.available && (product.variants?.length || product.conventionalVariants?.length) && (
                    <p className="text-amber-600 text-[10px] mb-2 flex items-center gap-1">
                        <FaInfoCircle className="text-[10px] flex-shrink-0" />
                        {t('productCard.priceEstimate')}
                    </p>
                )}

                {/* Delivery / Waitlist info */}
                {status === 'preorder' && product.preorderDate && (
                    <p className="mb-2 text-accent text-xs font-medium flex items-center gap-1.5">
                        <FaClock className="text-[10px]" />{t('productCard.estimatedDelivery')}: {product.preorderDate}
                    </p>
                )}
                {status === 'waitlist' && (
                    <p className="mb-2 text-primary text-xs font-medium flex items-center gap-1.5">
                        <FaBell className="text-[10px]" />{t('productCard.beNotified')}
                    </p>
                )}

                {/* CTA Button */}
                <div className="mt-auto pt-2 flex-shrink-0">
                    {buttonConfig ? (
                        <motion.button
                            className={`w-full px-5 py-3 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 transition-all transform-gpu text-sm
                                ${buttonConfig.variant === 'preorder' ? 'bg-gradient-to-r from-accent to-dark-orange text-white' :
                                buttonConfig.variant === 'waitlist' ? 'bg-gradient-to-r from-primary to-olive text-white' :
                                    'bg-gradient-to-r from-primary to-accent text-white'}`}
                            onClick={buttonConfig.onClick}
                            aria-label={buttonConfig.text}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {buttonConfig.text}
                            <buttonConfig.icon className="text-sm" />
                        </motion.button>
                    ) : (
                        <div className="w-full py-3 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 text-center shadow-sm flex items-center justify-center gap-2">
                            <FaClock className="text-primary text-sm" />
                            <span className="text-primary font-semibold text-sm">{product.comingSoon || t('productCard.comingSoon')}</span>
                        </div>
                    )}
                </div>

                {/* Social Share */}
                {renderSocialShare && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                        {renderSocialShare()}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;