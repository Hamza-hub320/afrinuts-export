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
            className={`relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-2xl shadow-xl overflow-hidden flex flex-col transform-gpu ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -6,
                scale: 1.025,
                rotateY: 2,
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.3 }
            }}
            whileTap={{ y: -2, scale: 0.98 }}
        >
            {/* ===== Decorative layers ===== */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px]hover:translate-z-[-8px] transition-all duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            {/* ===== IMAGE SECTION ===== */}
            <div className="relative w-full h-72 md:h-80 overflow-hidden z-10">
                <div className="relative w-full h-full overflow-hidden rounded-t-2xl rounded-b-[40px]">
                    {imageSrc && (
                        <motion.img
                            src={imageSrc}
                            alt={imageAlt || product.name}
                            className="w-full h-full object-cover"
                            loading={product.loading || 'lazy'}
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Organic Badge */}
                {showOrganic && product.productionType !== 'conventional' && (
                    <motion.div
                        className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                  bg-white/80 backdrop-blur-sm border border-white/40 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FaLeaf className="text-green-600 text-xs" />
                        <span className="text-green-700 text-sm font-semibold">
                            {t('productCard.organicLabel', 'Organic')}
                        </span>
                    </motion.div>
                )}

                {/* Status Badge */}
                {status !== 'available' && (
                    <motion.div
                        className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                  backdrop-blur-sm border border-white/40 shadow-lg text-sm font-semibold ${
                            status === 'preorder'
                                ? 'bg-accent/80 text-white'
                                : status === 'waitlist'
                                    ? 'bg-primary/80 text-white'
                                    : 'bg-white/80 text-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                    >
                        {status === 'preorder' && <FaShoppingCart className="text-xs" />}
                        {status === 'waitlist' && <FaBell className="text-xs" />}
                        {status === 'coming-soon' && <FaClock className="text-xs" />}
                        {getStatusBadgeText()}
                    </motion.div>
                )}
            </div>

            {/* ===== CONTENT SECTION ===== */}
            <div className="relative z-10 flex flex-col flex-grow p-5">
                {/* ----- HEADER ----- */}
                <div className="flex items-start gap-4 mb-4">
                    {IconComponent && (
                        <motion.div
                            className="bg-white/60 backdrop-blur-sm p-3 rounded-xl flex-shrink-0 shadow-md
                                      group-hover:bg-white/80 group-hover:shadow-lg transition-all duration-500
                                      border border-white/30"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <IconComponent className="text-primary text-xl" />
                        </motion.div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 font-bold text-lg leading-tight">
                            {product.name}
                        </h3>
                        {!compact && (
                            <p className="text-gray-600 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                                {product.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* ----- CERTIFICATIONS ----- */}
                {product.certifications && product.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.certifications.map((cert, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 bg-white/50 backdrop-blur-sm text-primary text-xs rounded-full
                                          font-medium border border-white/30 flex items-center gap-1"
                            >
                                <FaStar className="text-[10px] opacity-50" />
                                {cert}
                            </span>
                        ))}
                    </div>
                )}

                {/* ----- FEATURES ----- */}
                {!compact && product.features?.length > 0 && (
                    <div className="mb-5 flex-grow">
                        <ul className="space-y-2">
                            {product.features.slice(0, 4).map((feature, i) => (
                                <motion.li
                                    key={i}
                                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg
                                              bg-white/50 backdrop-blur-sm border border-white/30
                                              hover:bg-white/70 transition-all duration-300"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    whileHover={{ x: 3 }}
                                >
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center">
                                        <FaCheck className="text-primary text-[11px]" />
                                    </div>
                                    <span className="text-gray-700 text-sm leading-tight">
                                        {feature}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ----- PRICING SECTION ----- */}
                <div className="space-y-2.5 mb-4 flex-shrink-0">
                    {/* Organic Variants */}
                    {showOrganic && product.variants && product.variants.length > 0 && (
                        <div className="rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 p-4">
                            <p className="text-green-700 font-semibold mb-2 flex items-center gap-1.5 text-sm">
                                <FaLeaf className="text-xs" />
                                {t('productCard.organicLabel', 'Organic')}
                            </p>
                            <div className="space-y-1.5">
                                {product.variants.map((variant, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700 font-medium">
                                            {variant.name.replace(/^Organic\s+/i, '')}
                                        </span>
                                        <span className="text-green-700 font-bold">
                                            {variant.priceRange}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Conventional Variants */}
                    {showConventional && product.conventionalVariants && product.conventionalVariants.length > 0 && (
                        <div className="rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 p-4">
                            <p className="text-gray-600 font-semibold mb-2 flex items-center gap-1.5 text-sm">
                                <FaIndustry className="text-xs" />
                                {t('productCard.conventionalLabel', 'Conventional')}
                            </p>
                            <div className="space-y-1.5">
                                {product.conventionalVariants.map((variant, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 font-medium">
                                            {variant.name.replace(/^Conventional\s+/i, '')}
                                        </span>
                                        <span className="text-gray-700 font-bold">
                                            {variant.priceRange}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Estimate Note */}
                    {!product.available && (product.variants?.length || product.conventionalVariants?.length) && (
                        <div className="flex items-center gap-1.5 text-amber-600 text-xs px-2">
                            <FaInfoCircle className="text-xs flex-shrink-0" />
                            <span>{t('productCard.priceEstimate')}</span>
                        </div>
                    )}
                </div>

                {/* ----- PRE-ORDER / WAITLIST INFO ----- */}
                {status === 'preorder' && product.preorderDate && (
                    <motion.div
                        className="mb-3 flex items-center justify-center gap-2 text-accent font-medium
                                  bg-white/50 backdrop-blur-sm rounded-lg py-2.5 px-4 border border-white/30 text-sm"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        <FaClock className="text-sm" />
                        {t('productCard.estimatedDelivery')}: {product.preorderDate}
                    </motion.div>
                )}

                {status === 'waitlist' && (
                    <motion.div
                        className="mb-3 flex items-center justify-center gap-2 text-primary font-medium
                                  bg-white/50 backdrop-blur-sm rounded-lg py-2.5 px-4 border border-white/30 text-sm"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        <FaBell className="text-sm" />
                        {t('productCard.beNotified')}
                    </motion.div>
                )}

                {/* ----- CTA BUTTON ----- */}
                <div className="mt-auto pt-2 flex-shrink-0">
                    {buttonConfig ? (
                        <motion.button
                            className={`w-full px-6 py-3.5 rounded-xl font-semibold shadow-lg flex items-center justify-center 
                                      gap-2.5 transition-all transform-gpu text-base
                                      ${buttonConfig.variant === 'preorder'
                                ? 'bg-gradient-to-r from-accent to-dark-orange text-white'
                                : buttonConfig.variant === 'waitlist'
                                    ? 'bg-gradient-to-r from-primary to-olive text-white'
                                    : 'bg-gradient-to-r from-primary to-accent text-white'
                            }`}
                            onClick={buttonConfig.onClick}
                            aria-label={buttonConfig.text}
                            whileHover={{ y: -3, scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">{buttonConfig.text}</span>
                            <motion.span
                                className="relative z-10"
                                whileHover={{ x: 4 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                            >
                                <buttonConfig.icon className="text-lg" />
                            </motion.span>
                        </motion.button>
                    ) : (
                        <motion.div
                            className="w-full py-3.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30
                                      text-center shadow-md flex items-center justify-center gap-2"
                            whileHover={{ y: -2 }}
                        >
                            <FaClock className="text-primary text-base" />
                            <span className="text-primary font-semibold text-base">
                                {product.comingSoon || t('productCard.comingSoon')}
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* ----- SOCIAL SHARE ----- */}
                {renderSocialShare && (
                    <div className="mt-4 pt-3 border-t border-white/20">
                        {renderSocialShare()}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;