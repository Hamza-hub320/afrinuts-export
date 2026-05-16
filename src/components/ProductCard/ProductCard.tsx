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
                return { text: t('productCard.requestQuote'), onClick: handleContactClick, icon: FaArrowRight, variant: 'primary' as const };
            case 'preorder':
                return { text: t('productCard.preorderButton'), onClick: handlePreorderClick || handleContactClick, icon: FaShoppingCart, variant: 'preorder' as const };
            case 'waitlist':
                return { text: t('productCard.waitlistButton'), onClick: handleWaitlistClick || handleContactClick, icon: FaBell, variant: 'waitlist' as const };
            default:
                return null;
        }
    };

    const buttonConfig = getButtonConfig();

    return (
        <motion.div
            className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-2xl shadow-xl overflow-hidden flex flex-col transform-gpu transition-all duration-500 ${className}`}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            whileHover={{
                y: -8,
                scale: 1.02,
                rotateY: 3,
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                transition: { duration: 0.3 }
            }}
            whileTap={{ y: -2, scale: 0.97 }}
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            {/* Inner shadow */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
            {/* Background pattern */}
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            {/* ===== IMAGE SECTION ===== */}
            <div className="relative w-full h-64 md:h-72 overflow-hidden z-10 flex-shrink-0">
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
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/40 shadow-lg">
                        <FaLeaf className="text-green-600 text-xs" />
                        <span className="text-green-700 text-sm font-semibold">{t('productCard.organicLabel', 'Organic')}</span>
                    </div>
                )}

                {/* Status Badge */}
                {status !== 'available' && (
                    <div className={`absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/40 shadow-lg text-sm font-semibold ${
                        status === 'preorder' ? 'bg-accent/80 text-white' :
                            status === 'waitlist' ? 'bg-primary/80 text-white' :
                                'bg-white/80 text-gray-700'
                    }`}>
                        {status === 'preorder' && <FaShoppingCart className="text-[10px]" />}
                        {status === 'waitlist' && <FaBell className="text-[10px]" />}
                        {status === 'coming-soon' && <FaClock className="text-[10px]" />}
                        {getStatusBadgeText()}
                    </div>
                )}
            </div>

            {/* ===== CONTENT SECTION ===== */}
            <div className="relative z-10 flex flex-col flex-grow p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                    {IconComponent && (
                        <div className="bg-white/40 backdrop-blur-md p-2.5 rounded-full flex-shrink-0 shadow-md transform-gpu group-hover:scale-110 transition-transform duration-500 border border-white/30">
                            <IconComponent className="text-primary text-lg" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <Typography variant="h4" className="text-text-dark font-bold text-lg">
                            {product.name}
                        </Typography>
                        {!compact && (
                            <Typography variant="small" className="text-text-dark mt-1 line-clamp-2 text-sm">
                                {product.description}
                            </Typography>
                        )}
                    </div>
                </div>

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.certifications.map((cert, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white/40 backdrop-blur-sm text-primary text-xs rounded-full font-medium border border-white/30 flex items-center gap-1">
                                <FaStar className="text-[10px] opacity-40" />{cert}
                            </span>
                        ))}
                    </div>
                )}

                {/* Features */}
                {!compact && product.features?.length > 0 && (
                    <div className="mb-4 flex-grow">
                        <ul className="space-y-1.5">
                            {product.features.slice(0, 4).map((feature, i) => (
                                <motion.li
                                    key={i}
                                    className="flex items-start gap-2 bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="bg-primary/20 p-1 rounded-full mt-0.5 flex-shrink-0">
                                        <FaCheck className="text-primary text-[10px]" />
                                    </div>
                                    <Typography variant="small" className="text-gray-700 text-xs leading-tight">
                                        {feature}
                                    </Typography>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Pricing */}
                <div className="space-y-2 mb-3 flex-shrink-0">
                    {showOrganic && product.variants && product.variants.length > 0 && (
                        <div className="rounded-xl bg-white/30 backdrop-blur-sm border border-white/20 p-3">
                            <Typography variant="small" className="text-green-700 font-semibold mb-1.5 flex items-center gap-1.5 text-sm">
                                <FaLeaf className="text-[10px]" />{t('productCard.organicLabel', 'Organic')}
                            </Typography>
                            <div className="space-y-1">
                                {product.variants.map((variant, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-700">{variant.name.replace(/^Organic\s+/i, '')}</span>
                                        <span className="text-green-700 font-bold">{variant.priceRange}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {showConventional && product.conventionalVariants && product.conventionalVariants.length > 0 && (
                        <div className="rounded-xl bg-white/30 backdrop-blur-sm border border-white/20 p-3">
                            <Typography variant="small" className="text-gray-600 font-semibold mb-1.5 flex items-center gap-1.5">
                                <FaIndustry className="text-[10px]" />{t('productCard.conventionalLabel', 'Conventional')}
                            </Typography>
                            <div className="space-y-1">
                                {product.conventionalVariants.map((variant, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{variant.name.replace(/^Conventional\s+/i, '')}</span>
                                        <span className="text-gray-700 font-bold">{variant.priceRange}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!product.available && (product.variants?.length || product.conventionalVariants?.length) && (
                        <div className="flex items-center gap-1 text-amber-600 text-[10px] px-1">
                            <FaInfoCircle className="text-[10px] flex-shrink-0" />
                            <span>{t('productCard.priceEstimate')}</span>
                        </div>
                    )}
                </div>

                {/* Pre-order / Waitlist info */}
                {status === 'preorder' && product.preorderDate && (
                    <div className="mb-2 flex items-center justify-center gap-2 text-accent font-medium bg-white/30 backdrop-blur-sm rounded-lg py-2 px-3 border border-white/20 text-sm">
                        <FaClock className="text-xs" />
                        {t('productCard.estimatedDelivery')}: {product.preorderDate}
                    </div>
                )}
                {status === 'waitlist' && (
                    <div className="mb-2 flex items-center justify-center gap-2 text-primary font-medium bg-white/30 backdrop-blur-sm rounded-lg py-2 px-3 border border-white/20 text-sm">
                        <FaBell className="text-xm" />
                        {t('productCard.beNotified')}
                    </div>
                )}

                {/* CTA Button */}
                <div className="mt-auto pt-2 flex-shrink-0">
                    {buttonConfig ? (
                        <motion.button
                            className={`w-full px-5 py-3 rounded-full font-semibold shadow-md flex items-center justify-center gap-2 transition-all transform-gpu text-base
                                ${buttonConfig.variant === 'preorder' ? 'bg-gradient-to-r from-accent to-dark-orange text-white' :
                                buttonConfig.variant === 'waitlist' ? 'bg-gradient-to-r from-primary to-olive text-white' :
                                    'bg-gradient-to-r from-primary to-accent text-white'}`}
                            onClick={buttonConfig.onClick}
                            aria-label={buttonConfig.text}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">{buttonConfig.text}</span>
                            <buttonConfig.icon className="relative z-10 text-base" />
                        </motion.button>
                    ) : (
                        <div className="w-full py-3 rounded-full bg-white/40 backdrop-blur-sm border border-white/30 text-center shadow-md flex items-center justify-center gap-2">
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