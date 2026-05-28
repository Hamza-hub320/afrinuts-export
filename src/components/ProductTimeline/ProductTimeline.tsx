// components/ProductTimeline/ProductTimeline.tsx
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCheckCircle,
    FaHourglassHalf,
    FaRocket,
    FaCalendarAlt,
    FaClock,
    FaChevronLeft,
    FaChevronRight,
    FaBox
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Typography from '../Typography/Typography';
import {InfoCard} from "@/components/InfoCard/InfoCard";

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
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const phases = useMemo(() => {
        if (!Array.isArray(products) || products.length === 0) {
            return [
                { year: '2026', label: t('timeline.pilot', 'Pilot Production'), description: t('timeline.pilotDesc', 'Initial production and market testing'), products: ['Raw Cashew Nuts'], status: 'available' as const, productCount: 1, availableCount: 1 },
                { year: '2030', label: t('timeline.scale', 'Scale Up'), description: t('timeline.scaleDesc', 'Expanding processing capacity'), products: ['Cashew Kernels', 'CNSL'], status: 'in-progress' as const, productCount: 2, availableCount: 0 },
                { year: '2033+', label: t('timeline.industrial', 'Industrial Scale'), description: t('timeline.industrialDesc', 'Full-scale industrial production'), products: ['Cashew Butter', 'Roasted Cashews', 'Cashew Milk'], status: 'upcoming' as const, productCount: 3, availableCount: 0 }
            ];
        }

        const availableProducts = products.filter(p => p.available);
        const comingSoonProducts = products.filter(p => !p.available && p.comingSoon);
        const upcomingProducts = products.filter(p => !p.available && !p.comingSoon);
        const phases: TimelinePhase[] = [];

        if (availableProducts.length > 0) {
            phases.push({
                year: new Date().getFullYear().toString(),
                label: t('timeline.available', 'Available Now'),
                description: t('timeline.availableDesc', 'Ready for immediate order'),
                products: availableProducts.map(p => p.name),
                status: 'available',
                productCount: availableProducts.length,
                availableCount: availableProducts.length
            });
        }

        if (comingSoonProducts.length > 0) {
            const comingSoonYears = comingSoonProducts.map(p => p.comingSoon).filter(Boolean).sort();
            const yearRange = comingSoonYears.length > 1 ? `${comingSoonYears[0]}-${comingSoonYears[comingSoonYears.length - 1]}` : comingSoonYears[0] || t('timeline.soon', 'Coming Soon');
            phases.push({
                year: yearRange,
                label: t('timeline.inProgress', 'In Development'),
                description: t('timeline.inProgressDesc', 'Currently in development'),
                products: comingSoonProducts.map(p => p.name),
                status: 'in-progress',
                productCount: comingSoonProducts.length,
                availableCount: 0
            });
        }

        if (upcomingProducts.length > 0) {
            phases.push({
                year: t('timeline.future', 'Future'),
                label: t('timeline.planned', 'Planned'),
                description: t('timeline.plannedDesc', 'On our future roadmap'),
                products: upcomingProducts.map(p => p.name),
                status: 'upcoming',
                productCount: upcomingProducts.length,
                availableCount: 0
            });
        }

        return phases.slice(0, maxPhases);
    }, [products, t, maxPhases]);

    const timelineProgress = useMemo(() => {
        const totalProducts = phases.reduce((sum, phase) => sum + phase.productCount, 0);
        if (totalProducts === 0) return 0;
        const weightedProgress = phases.reduce((sum, phase) => {
            if (phase.status === 'available') return sum + (phase.productCount * 1);
            if (phase.status === 'in-progress') return sum + (phase.productCount * 0.5);
            return sum;
        }, 0);
        return Math.min((weightedProgress / totalProducts) * 100, 100);
    }, [phases]);

    const nextPhase = useCallback(() => setActiveIndex(prev => Math.min(prev + 1, phases.length - 1)), [phases.length]);
    const prevPhase = useCallback(() => setActiveIndex(prev => Math.max(prev - 1, 0)), []);

    // Brand-aligned status config
    const statusConfig = {
        'available': {
            icon: FaCheckCircle,
            color: 'text-primary',
            bg: 'bg-primary/5',
            border: 'border-primary/30',
            dot: 'bg-primary',
            badge: 'bg-primary/10 text-primary',
            label: t('timeline.status.available', 'Available Now')
        },
        'in-progress': {
            icon: FaHourglassHalf,
            color: 'text-accent',
            bg: 'bg-accent/5',
            border: 'border-accent/30',
            dot: 'bg-accent',
            badge: 'bg-accent/10 text-accent',
            label: t('timeline.status.inProgress', 'In Development')
        },
        'upcoming': {
            icon: FaRocket,
            color: 'text-gray-500',
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            dot: 'bg-gray-400',
            badge: 'bg-gray-100 text-gray-600',
            label: t('timeline.status.upcoming', 'Planned')
        }
    };

    if (phases.length === 0) return null;

    const PhaseCard = ({ phase, index, isActive }: { phase: TimelinePhase; index: number; isActive: boolean }) => {
        const config = statusConfig[phase.status];
        const StatusIcon = config.icon;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
            >
                <InfoCard
                    icon={StatusIcon}
                    title={phase.label}
                    subtitle={phase.year}
                    iconColor={config.color}
                    variant={phase.status === 'available' ? 'primary' : phase.status === 'in-progress' ? 'accent' : 'secondary'}
                    showInfoBadge={false}
                    className="h-full cursor-pointer"
                >
                    <Typography variant="small" className="text-gray-600 mb-3">{phase.description}</Typography>

                    {/* Products list */}
                    {phase.products.length > 0 ? (
                        <div className="space-y-1.5">
                            {phase.products.slice(0, 4).map((product, pIndex) => (
                                <div key={product} className="flex items-center gap-2 text-xs text-gray-700">
                                    <FaBox className={`text-[10px] ${config.color} flex-shrink-0`} />
                                    <span className="truncate">{product}</span>
                                </div>
                            ))}
                            {phase.products.length > 4 && (
                                <p className="text-xs text-gray-400 pl-4">+{phase.products.length - 4} more</p>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <FaClock className="text-[10px]" />
                            <span>{t('timeline.productsTba', 'Products to be announced')}</span>
                        </div>
                    )}

                    {/* Progress bar for in-progress */}
                    {phase.status === 'in-progress' && (
                        <div className="mt-3 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-accent to-dark-orange"
                                initial={{ width: 0 }}
                                whileInView={{ width: '65%' }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 1 }}
                            />
                        </div>
                    )}
                </InfoCard>
            </motion.div>
        );
    };

    return (
        <motion.div
            className={`relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 transform-gpu ${className}`}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)', transition: { duration: 0.3 } }}
        >
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

            <div className="relative z-10">
                {/* Header */}
                {showHeader && (
                    <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold mb-3">
                            <FaCalendarAlt className="inline mr-1.5 text-xs" />{t('timeline.badge', 'Production Roadmap')}
                        </span>
                        <Typography variant="h2" className="mb-2">{t('timeline.title', 'When Can You Order?')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-xl mx-auto text-sm">{t('timeline.subtitle', 'From pilot production to industrial scale')}</Typography>
                    </motion.div>
                )}

                {/* Mobile: Carousel */}
                {isMobile ? (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={prevPhase} disabled={activeIndex === 0}
                                    className={`w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center ${activeIndex === 0 ? 'opacity-30' : ''}`}>
                                <FaChevronLeft className="text-gray-600 text-sm" />
                            </button>
                            <span className="text-xs font-medium text-gray-500">{activeIndex + 1} / {phases.length}</span>
                            <button onClick={nextPhase} disabled={activeIndex === phases.length - 1}
                                    className={`w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center ${activeIndex === phases.length - 1 ? 'opacity-30' : ''}`}>
                                <FaChevronRight className="text-gray-600 text-sm" />
                            </button>
                        </div>
                        <PhaseCard phase={phases[activeIndex]} index={activeIndex} isActive={true} />
                        <div className="flex justify-center gap-2 mt-4">
                            {phases.map((_, idx) => (
                                <button key={idx} onClick={() => setActiveIndex(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeIndex ? 'bg-primary scale-125' : 'bg-gray-300'}`} />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Desktop: Grid */
                    <div className="grid grid-cols-3 gap-6">
                        {phases.map((phase, index) => (
                            <PhaseCard key={index} phase={phase} index={index} isActive={index === activeIndex} />
                        ))}
                    </div>
                )}

                {/* Overall Progress */}
                <div className="mt-6 max-w-md mx-auto">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{t('timeline.overallProgress', 'Overall Progress')}</span>
                        <span>{Math.round(timelineProgress)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${timelineProgress}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 1 }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductTimeline;