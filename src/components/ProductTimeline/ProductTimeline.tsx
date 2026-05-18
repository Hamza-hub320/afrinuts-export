// components/ProductTimeline/ProductTimeline.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaHourglassHalf, FaIndustry, FaCalendarAlt, FaRocket, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface Product {
    name: string;
    description: string;
    icon: string;
    backgroundImage: string;
    features: string[];
    available: boolean;
    comingSoon?: string;
    certifications?: string[];
    variants?: { name: string; priceRange: string }[];
    conventionalVariants?: { name: string; priceRange: string }[];
    productionType?: 'organic' | 'conventional' | 'both';
}

interface TimelinePhase {
    year: string;
    label: string;
    description: string;
    products: string[];
    status: 'available' | 'in-progress' | 'upcoming';
    productCount: number;
    availableCount: number;
}

interface ProductTimelineProps {
    products?: Product[];
    className?: string;
    onPhaseClick?: (phase: TimelinePhase) => void;
    showHeader?: boolean;
    maxPhases?: number;
}

export const ProductTimeline: React.FC<ProductTimelineProps> = ({
                                                                    products = [],
                                                                    className = '',
                                                                    onPhaseClick,
                                                                    showHeader = true,
                                                                    maxPhases = 3
                                                                }) => {
    const { t } = useTranslation('products');

    // Dynamically generate phases based on actual product data
    const phases = useMemo(() => {
        if (!Array.isArray(products) || products.length === 0) {
            // Fallback to default phases if no products provided
            return [
                {
                    year: '2026',
                    label: t('timeline.pilot', 'Pilot Production'),
                    description: t('timeline.pilotDesc', 'Initial production and market testing'),
                    products: ['Raw Cashew Nuts'],
                    status: 'available' as const,
                    productCount: 1,
                    availableCount: 1
                },
                {
                    year: '2030',
                    label: t('timeline.scale', 'Scale Up'),
                    description: t('timeline.scaleDesc', 'Expanding processing capacity'),
                    products: ['Cashew Kernels', 'CNSL'],
                    status: 'in-progress' as const,
                    productCount: 2,
                    availableCount: 0
                },
                {
                    year: '2033+',
                    label: t('timeline.industrial', 'Industrial Scale'),
                    description: t('timeline.industrialDesc', 'Full-scale industrial production'),
                    products: ['Cashew Butter', 'Roasted Cashews', 'Cashew Milk'],
                    status: 'upcoming' as const,
                    productCount: 3,
                    availableCount: 0
                }
            ];
        }

        // Separate products by availability
        const availableProducts = products.filter(p => p.available);
        const comingSoonProducts = products.filter(p => !p.available && p.comingSoon);
        const upcomingProducts = products.filter(p => !p.available && !p.comingSoon);

        const phases: TimelinePhase[] = [];

        // Phase 1: Currently Available
        if (availableProducts.length > 0) {
            phases.push({
                year: new Date().getFullYear().toString(),
                label: t('timeline.available', 'Available Now'),
                description: t('timeline.availableDesc', 'Products ready for immediate order'),
                products: availableProducts.map(p => p.name),
                status: 'available',
                productCount: availableProducts.length,
                availableCount: availableProducts.length
            });
        }

        // Phase 2: Coming Soon / In Progress
        if (comingSoonProducts.length > 0) {
            const comingSoonYears = comingSoonProducts
                .map(p => p.comingSoon)
                .filter(Boolean)
                .sort();

            const yearRange = comingSoonYears.length > 1
                ? `${comingSoonYears[0]}-${comingSoonYears[comingSoonYears.length - 1]}`
                : comingSoonYears[0] || t('timeline.soon', 'Coming Soon');

            phases.push({
                year: yearRange,
                label: t('timeline.inProgress', 'In Development'),
                description: t('timeline.inProgressDesc', 'Products currently in development'),
                products: comingSoonProducts.map(p => p.name),
                status: 'in-progress',
                productCount: comingSoonProducts.length,
                availableCount: 0
            });
        }

        // Phase 3: Future/Upcoming
        if (upcomingProducts.length > 0) {
            phases.push({
                year: t('timeline.future', 'Future'),
                label: t('timeline.planned', 'Planned'),
                description: t('timeline.plannedDesc', 'Products in our future roadmap'),
                products: upcomingProducts.map(p => p.name),
                status: 'upcoming',
                productCount: upcomingProducts.length,
                availableCount: 0
            });
        }

        // If we have fewer than 3 phases, add generic future phases
        while (phases.length < maxPhases) {
            phases.push({
                year: `${new Date().getFullYear() + phases.length}+`,
                label: t(`timeline.phase${phases.length + 1}`, `Future Phase ${phases.length}`),
                description: t('timeline.futureDesc', 'Expanding our product line'),
                products: [],
                status: 'upcoming',
                productCount: 0,
                availableCount: 0
            });
        }

        return phases.slice(0, maxPhases);
    }, [products, t, maxPhases]);

    // Calculate overall progress
    const timelineProgress = useMemo(() => {
        const totalProducts = phases.reduce((sum, phase) => sum + phase.productCount, 0);
        const availableProducts = phases.reduce((sum, phase) => sum + phase.availableCount, 0);

        if (totalProducts === 0) return 0;

        // Weight the progress: available = 100%, in-progress = 50%, upcoming = 0%
        const weightedProgress = phases.reduce((sum, phase) => {
            if (phase.status === 'available') return sum + (phase.productCount * 1);
            if (phase.status === 'in-progress') return sum + (phase.productCount * 0.5);
            return sum;
        }, 0);

        return Math.min((weightedProgress / totalProducts) * 100, 100);
    }, [phases]);

    const statusConfig = {
        'available': {
            icon: FaCheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/60',
            border: 'border-emerald-300/40',
            dot: 'bg-emerald-500',
            badge: 'bg-emerald-100 text-emerald-700',
            glow: 'shadow-emerald-200/50',
            lineGlow: 'shadow-emerald-400/30',
            label: t('timeline.status.available', 'Available Now')
        },
        'in-progress': {
            icon: FaHourglassHalf,
            color: 'text-amber-600',
            bg: 'bg-amber-50/60',
            border: 'border-amber-300/40',
            dot: 'bg-amber-500',
            badge: 'bg-amber-100 text-amber-700',
            glow: 'shadow-amber-200/50',
            lineGlow: 'shadow-amber-400/30',
            label: t('timeline.status.inProgress', 'In Development')
        },
        'upcoming': {
            icon: FaRocket,
            color: 'text-blue-600',
            bg: 'bg-blue-50/60',
            border: 'border-blue-300/40',
            dot: 'bg-blue-500',
            badge: 'bg-blue-100 text-blue-700',
            glow: 'shadow-blue-200/50',
            lineGlow: 'shadow-blue-400/30',
            label: t('timeline.status.upcoming', 'Coming Soon')
        }
    };

    if (phases.length === 0) {
        return null; // Don't render if no phases
    }

    return (
        <motion.div
            className={`relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-2xl shadow-xl p-6 md:p-8 transform-gpu group ${className}`}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{
                y: -2,
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.3 }
            }}
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-8px] transition-all duration-500" />

            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Inner shadow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            <div className="relative z-10">
                {/* Header */}
                {showHeader && (
                    <motion.div
                        className="text-center mb-8 md:mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                            <FaCalendarAlt className="inline-block mr-2" />
                            {t('timeline.badge', 'Production Roadmap')}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                            {t('timeline.title', 'When Can You Order?')}
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                            {t('timeline.subtitle', 'Our strategic growth from pilot to industrial scale')}
                        </p>

                        {/* Overall Progress */}
                        <div className="mt-4 max-w-md mx-auto">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{t('timeline.overallProgress', 'Overall Progress')}</span>
                                <span>{Math.round(timelineProgress)}%</span>
                            </div>
                            <div className="bg-white/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-blue-400"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${timelineProgress}%` }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Horizontal Timeline */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting line */}
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-amber-400 to-blue-400 rounded-full opacity-30" />

                    {/* Animated progress line */}
                    <motion.div
                        className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-emerald-400 via-amber-400 to-transparent rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${timelineProgress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                    />

                    <div className={`grid grid-cols-1 md:grid-cols-${Math.min(phases.length, 3)} gap-8 md:gap-4`}>
                        {phases.map((phase, index) => {
                            const config = statusConfig[phase.status];
                            const StatusIcon = config.icon;
                            const isEmpty = phase.productCount === 0;

                            return (
                                <motion.div
                                    key={`${phase.status}-${index}`}
                                    className="relative"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    onClick={() => onPhaseClick?.(phase)}
                                >
                                    {/* Timeline node */}
                                    <div className="flex justify-center mb-6 relative z-20">
                                        <motion.div
                                            className="relative cursor-pointer"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {/* Outer ring with glass morphism */}
                                            <div className={`relative w-16 h-16 rounded-full border-2 ${config.border} ${config.bg} backdrop-blur-sm flex items-center justify-center shadow-lg ${config.glow} transform-gpu ${isEmpty ? 'opacity-50' : ''}`}
                                                 style={{ transformStyle: 'preserve-3d' }}
                                            >
                                                {/* 3D edge for node */}
                                                <div className="absolute inset-0 rounded-full border border-white/30 transform-gpu translate-z-[-2px]" />

                                                {/* Glassy overlay for node */}
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />

                                                {/* Product count or icon */}
                                                <div className="relative z-10 flex flex-col items-center">
                                                    {phase.productCount > 0 ? (
                                                        <>
                                                            <span className="text-lg font-bold text-gray-700 leading-none">
                                                                {phase.productCount}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 leading-tight">
                                                                {t('timeline.products', 'products')}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <StatusIcon className={`text-xl ${config.color} opacity-50`} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pulse ring for in-progress */}
                                            {phase.status === 'in-progress' && phase.productCount > 0 && (
                                                <motion.div
                                                    className={`absolute inset-0 rounded-full border-2 ${config.border}`}
                                                    animate={{
                                                        scale: [1, 1.8],
                                                        opacity: [0.6, 0],
                                                    }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 2,
                                                        delay: 0.5,
                                                    }}
                                                />
                                            )}

                                            {/* Connection line glow */}
                                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-0.5 ${config.lineGlow} blur-sm -z-10 ${isEmpty ? 'opacity-30' : ''}`} />
                                        </motion.div>
                                    </div>

                                    {/* Content card with glass morphism */}
                                    <motion.div
                                        className={`relative rounded-2xl border ${config.border} ${config.bg} backdrop-blur-sm p-5 shadow-md hover:shadow-lg transition-all duration-300 transform-gpu group/card ${onPhaseClick ? 'cursor-pointer' : ''} ${isEmpty ? 'opacity-60' : ''}`}
                                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                        whileHover={{
                                            y: -5,
                                            scale: 1.02,
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        {/* Card 3D edge */}
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover/card:translate-z-[-6px] transition-all duration-500" />

                                        {/* Card glassy overlay */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-30 group-hover/card:opacity-50 transition-opacity duration-500" />

                                        {/* Card inner shadow */}
                                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_8px_rgba(0,0,0,0.06)] group-hover/card:shadow-[inset_0_2px_12px_rgba(0,0,0,0.1)] transition-shadow duration-500" />

                                        <div className="relative z-10">
                                            {/* Year badge */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.badge} backdrop-blur-sm`}>
                                                    {phase.year}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {phase.availableCount > 0 && (
                                                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                                            {phase.availableCount} {t('timeline.available', 'available')}
                                                        </span>
                                                    )}
                                                    <StatusIcon className={`text-lg ${config.color} ${isEmpty ? 'opacity-50' : ''}`} />
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                                                {phase.label}
                                            </h4>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm mb-4">
                                                {phase.description}
                                            </p>

                                            {/* Products */}
                                            {phase.products.length > 0 ? (
                                                <div className="space-y-2 mb-4">
                                                    {phase.products.map((product, pIndex) => (
                                                        <motion.div
                                                            key={product}
                                                            className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/50"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: index * 0.2 + pIndex * 0.1 }}
                                                        >
                                                            <FaIndustry className={`text-xs ${config.color} opacity-70 flex-shrink-0`} />
                                                            <span className="text-xs font-medium text-gray-700 truncate">
                                                                {product}
                                                            </span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="mb-4 p-3 bg-white/30 rounded-lg border border-dashed border-gray-300 text-center">
                                                    <FaClock className="mx-auto text-gray-400 mb-1" />
                                                    <p className="text-xs text-gray-500">
                                                        {t('timeline.productsTba', 'Products TBA')}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Status indicator */}
                                            <div className="flex items-center gap-2 pt-3 border-t border-white/30">
                                                <span className={`w-2 h-2 rounded-full ${config.dot} ${
                                                    phase.status === 'in-progress' ? 'animate-pulse' : ''
                                                } ${isEmpty ? 'opacity-50' : ''}`} />
                                                <span className={`text-xs font-semibold ${config.color} ${isEmpty ? 'opacity-50' : ''}`}>
                                                    {config.label}
                                                </span>
                                            </div>

                                            {/* Progress bar for in-progress */}
                                            {phase.status === 'in-progress' && phase.productCount > 0 && (
                                                <div className="mt-3 bg-white/50 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
                                                    <motion.div
                                                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: '65%' }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend with glass morphism */}
                <motion.div
                    className="flex flex-wrap justify-center gap-4 mt-10 pt-6 border-t border-white/20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    {Object.entries(statusConfig).map(([status, config]) => (
                        <div key={status} className="flex items-center gap-2 bg-white/30 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/40">
                            <span className={`w-3 h-3 rounded-full ${config.dot}`} />
                            <span className="text-xs font-medium text-gray-600">
                                {config.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ProductTimeline;