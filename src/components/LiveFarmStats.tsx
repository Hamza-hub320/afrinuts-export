import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FaTree, FaSeedling, FaTractor, FaLeaf, FaCalendarAlt,
    FaChartLine, FaCloudSun, FaMapMarkerAlt, FaCheckCircle,
    FaArrowRight
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Section from './Section/Section';
import { GiFarmer } from 'react-icons/gi';

interface Block {
    id: number;
    blockName: string;
    status: string;
    survivalRate: number;
    plantedDate?: number;
    clearedDate?: number;
    plowedDate?: number;
    harvestCount?: number;
    totalHarvestQuantity?: number;
    lastHarvestDate?: number;
}

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <motion.div
        className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        whileHover={{
            y: -4,
            scale: 1.01,
            boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)',
            transition: { duration: 0.3 }
        }}
    >
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
        <div className="relative z-10 p-6">{children}</div>
    </motion.div>
);

const isDevelopment = import.meta.env.DEV;

const LiveFarmStats: React.FC = () => {
    const { t } = useTranslation('farm');
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                if (isDevelopment) {
                    const data = await getMockData('getBlocks');
                    setBlocks(data.blocks || []);
                } else {
                    const data: any = await callApi('farmData', { action: 'getPublicFarmStats', farmId: '1' }, false);
                    if (data?.blocks) {
                        setBlocks(data.blocks);
                    } else {
                        // Fallback: try authenticated endpoint
                        const blocksData: any = await callApi('farmData', { action: 'getBlocks', farmId: '1' }, false);
                        setBlocks(blocksData?.blocks || []);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch farm data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlocks();
    }, []);

    if (loading) {
        return (
            <Section className="flex items-center justify-center min-h-[40vh]">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <GiFarmer className="text-primary text-2xl" />
                        </div>
                    </div>
                    <Typography variant="small" className="text-gray-500">{t('liveStats.loading', 'Connecting to farm...')}</Typography>
                </div>
            </Section>
        );
    }

    // Compute dynamic stats from blocks
    const totalBlocks = blocks.length || 35;
    const clearedBlocks = blocks.filter(b => b.status === 'CLEARED').length;
    const plowedBlocks = blocks.filter(b => b.status === 'PLOWED').length;
    const plantedBlocks = blocks.filter(b => b.status === 'PLANTED').length;
    const harvestedBlocks = blocks.filter(b => b.status === 'HARVESTED').length;
    const activeBlocks = clearedBlocks + plowedBlocks + plantedBlocks + harvestedBlocks;
    const undevelopedBlocks = totalBlocks - activeBlocks;

    const totalTreesPlanted = (plantedBlocks + harvestedBlocks) * 100;
    const avgSurvivalRate = (plantedBlocks + harvestedBlocks) > 0
        ? blocks.filter(b => b.status === 'PLANTED' || b.status === 'HARVESTED')
        .reduce((sum, b) => sum + (b.survivalRate || 0), 0) / (plantedBlocks + harvestedBlocks)
        : 0;
    const totalHarvested = blocks.reduce((sum, b) => sum + (b.totalHarvestQuantity || 0), 0);
    const totalHarvestCount = blocks.reduce((sum, b) => sum + (b.harvestCount || 0), 0);

    // Determine farm narrative stage
    const getFarmNarrative = () => {
        if (harvestedBlocks > 0) {
            return {
                stage: 'producing',
                title: t('liveStats.narrative.producing.title', 'The Orchard is Producing'),
                description: t('liveStats.narrative.producing.description',
                    'Our cashew trees are bearing fruit. Each harvest brings us closer to our vision of premium Ivorian cashews on the global market.'),
                highlight: harvestedBlocks === totalBlocks
                    ? t('liveStats.narrative.producing.allBlocks', 'All {{count}} blocks have been harvested — the farm is at full production.', { count: totalBlocks })
                    : t('liveStats.narrative.producing.someBlocks', '{{harvested}} of {{total}} blocks are producing — the rest are maturing.', { harvested: harvestedBlocks, total: totalBlocks }),
            };
        }
        if (plantedBlocks > 0) {
            const oldestPlanted = blocks
                .filter(b => b.plantedDate)
                .sort((a, b) => (a.plantedDate || 0) - (b.plantedDate || 0))[0];
            const monthsSincePlanting = oldestPlanted?.plantedDate
                ? Math.floor((Date.now() - oldestPlanted.plantedDate) / (1000 * 60 * 60 * 24 * 30))
                : 0;

            if (monthsSincePlanting > 12) {
                return {
                    stage: 'maturing',
                    title: t('liveStats.narrative.maturing.title', 'Trees are Maturing'),
                    description: t('liveStats.narrative.maturing.description',
                        'Our young cashew trees are developing strong root systems. First flowering is expected soon as we enter the next growth phase.'),
                    highlight: t('liveStats.narrative.maturing.highlight', '{{blocks}} blocks planted · trees {{months}} months into establishment', { blocks: plantedBlocks, months: monthsSincePlanting }),
                };
            }
            return {
                stage: 'growing',
                title: t('liveStats.narrative.growing.title', 'The Orchard is Taking Root'),
                description: t('liveStats.narrative.growing.description',
                    'Young cashew seedlings are being nurtured across our farm. Each tree represents a long-term investment in Ivorian agriculture.'),
                highlight: t('liveStats.narrative.growing.highlight', '{{blocks}} blocks planted · {{trees}} trees in the ground', { blocks: plantedBlocks, trees: plantedBlocks * 100 }),
            };
        }
        if (plowedBlocks > 0 || clearedBlocks > 0) {
            return {
                stage: 'preparing',
                title: t('liveStats.narrative.preparing.title', 'Land is Being Prepared'),
                description: t('liveStats.narrative.preparing.description',
                    'Our team is clearing and preparing the land for planting. Every hectare is being carefully readied for cashew cultivation.'),
                highlight: t('liveStats.narrative.preparing.highlight', '{{active}} of {{total}} blocks under development', { active: activeBlocks, total: totalBlocks }),
            };
        }
        return {
            stage: 'beginning',
            title: t('liveStats.narrative.beginning.title', 'A Farm is Born'),
            description: t('liveStats.narrative.beginning.description',
                'We are at the beginning of an ambitious journey — transforming family land into a world-class cashew farm in the heart of Ivory Coast.'),
            highlight: t('liveStats.narrative.beginning.highlight', '{{total}} hectares of potential ready to be unlocked', { total: totalBlocks }),
        };
    };

    const narrative = getFarmNarrative();

    // Seasonal insight based on current month
    const getSeasonalInsight = () => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return t('liveStats.seasonal.flowering', 'Flowering season is underway — a critical period for pollination and nut development.');
        if (month >= 5 && month <= 7) return t('liveStats.seasonal.development', 'Cashew apples are forming on the trees — the nuts are developing inside each fruit.');
        if (month >= 8 && month <= 10) return t('liveStats.seasonal.harvest', 'Harvest season — the busiest time on the farm as we collect, dry, and sort the cashew crop.');
        return t('liveStats.seasonal.maintenance', 'Maintenance season — our team is pruning trees, preparing land, and maintaining farm infrastructure.');
    };

    return (
        <div className="py-12">
            {/* Narrative Banner */}
            <GlassCard className="mb-10 p-6 sm:p-8 text-center rounded-3xl">
                <motion.div variants={fadeIn}>
                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2">
                        <FaMapMarkerAlt className="inline mr-2 text-accent" />
                        Odienné, Ivory Coast
                    </Typography>
                </motion.div>
                <motion.h2 variants={fadeIn} className="font-display text-3xl md:text-4xl text-primary mb-3">
                    {narrative.title}
                </motion.h2>
                <motion.div variants={fadeIn}>
                    <Typography variant="lead" className="text-gray-700 max-w-3xl mx-auto">
                        {narrative.description}
                    </Typography>
                </motion.div>
                {narrative.highlight && (
                    <motion.div variants={fadeIn} className="mt-3">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {narrative.highlight}
            </span>
                    </motion.div>
                )}
            </GlassCard>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    {
                        label: t('liveStats.metrics.blocks', 'Blocks Under Cultivation'),
                        value: `${activeBlocks}/${totalBlocks}`,
                        icon: FaMapMarkerAlt,
                        color: 'text-primary'
                    },
                    {
                        label: t('liveStats.metrics.trees', 'Cashew Trees'),
                        value: totalTreesPlanted.toLocaleString(),
                        icon: FaTree,
                        color: 'text-green-600'
                    },
                    {
                        label: t('liveStats.metrics.survival', 'Tree Survival Rate'),
                        value: activeBlocks > 0 ? `${avgSurvivalRate.toFixed(0)}%` : '—',
                        icon: FaLeaf,
                        color: 'text-accent'
                    },
                    {
                        label: harvestedBlocks > 0 ? t('liveStats.metrics.harvested', 'Total Harvested') : t('liveStats.metrics.progress', 'Farm Progress'),
                        value: harvestedBlocks > 0
                            ? totalHarvested > 0 ? `${(totalHarvested / 1000).toFixed(1)}T` : '—'
                            : `${Math.round((activeBlocks / totalBlocks) * 100)}%`,
                        icon: harvestedBlocks > 0 ? FaTractor : FaChartLine,
                        color: harvestedBlocks > 0 ? 'text-amber-600' : 'text-primary'
                    },
                ].map((metric, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <InfoCard
                            icon={metric.icon}
                            title={metric.value}
                            subtitle={metric.label}
                            iconColor={metric.color}
                            showInfoBadge={false}
                            className="h-full text-center"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Farm Timeline */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="mb-8"
            >
                <InfoCard
                    icon={FaCalendarAlt}
                    title={t('liveStats.timeline.title', 'Farm Development Timeline')}
                    iconColor="text-primary"
                    showInfoBadge={false}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        {[
                            { stage: 'cleared', label: t('liveStats.timeline.cleared', 'Land Cleared'), count: clearedBlocks + plowedBlocks + plantedBlocks + harvestedBlocks, total: totalBlocks, icon: FaSeedling, color: 'text-orange-500', bg: 'bg-orange-50' },
                            { stage: 'plowed', label: t('liveStats.timeline.plowed', 'Soil Plowed'), count: plowedBlocks + plantedBlocks + harvestedBlocks, total: totalBlocks, icon: FaTractor, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { stage: 'planted', label: t('liveStats.timeline.planted', 'Trees Planted'), count: plantedBlocks + harvestedBlocks, total: totalBlocks, icon: FaTree, color: 'text-green-500', bg: 'bg-green-50' },
                            { stage: 'harvested', label: t('liveStats.timeline.harvested', 'First Harvest'), count: harvestedBlocks, total: totalBlocks, icon: FaTractor, color: 'text-amber-500', bg: 'bg-amber-50' },
                        ].map((stage, idx) => (
                            <div key={idx} className={`${stage.bg} rounded-xl p-4 text-center border border-white/30`}>
                                <stage.icon className={`text-2xl mx-auto mb-2 ${stage.color}`} />
                                <div className="text-2xl font-bold text-gray-800">{stage.count}/{stage.total}</div>
                                <div className="text-xs text-gray-500 mt-1">{stage.label}</div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div className={`h-1.5 rounded-full ${stage.color.replace('text-', 'bg-')}`}
                                         style={{ width: `${(stage.count / stage.total) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </InfoCard>
            </motion.div>

            {/* Seasonal Insight */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="mb-8"
            >
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <FaCloudSun className="text-amber-500" />
                        <Typography variant="small" className="font-medium text-amber-700">
                            {t('liveStats.seasonal.title', 'Seasonal Insight')}
                        </Typography>
                    </div>
                    <Typography variant="body" className="text-amber-700">
                        {getSeasonalInsight()}
                    </Typography>
                </div>
            </motion.div>

            {/* Recent Activity — only show if there's something to report */}
            {(harvestedBlocks > 0 || plantedBlocks > 0) && (
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mb-8"
                >
                    <InfoCard
                        icon={FaCheckCircle}
                        title={t('liveStats.activity.title', 'Recent Farm Activity')}
                        iconColor="text-green-600"
                        showInfoBadge={false}
                    >
                        <div className="space-y-2 mt-3">
                            {harvestedBlocks > 0 && (
                                <div className="flex items-center gap-3 bg-white/40 rounded-lg px-4 py-2.5 text-sm">
                                    <FaTractor className="text-amber-500" />
                                    <span>
                                        {t('liveStats.activity.harvested', '{{count}} block(s) have been harvested, producing {{volume}} of cashews.', {
                                            count: harvestedBlocks,
                                            volume: totalHarvested > 0 ? `${(totalHarvested / 1000).toFixed(1)} tonnes` : 'their first yield'
                                        })}
                                    </span>
                                </div>
                            )}
                            {plantedBlocks > 0 && (
                                <div className="flex items-center gap-3 bg-white/40 rounded-lg px-4 py-2.5 text-sm">
                                    <FaSeedling className="text-green-500" />
                                    <span>
                                        {t('liveStats.activity.planted', '{{count}} block(s) planted with cashew seedlings.', { count: plantedBlocks })}
                                    </span>
                                </div>
                            )}
                            {blocks.filter(b => b.lastHarvestDate).length > 0 && (
                                <div className="flex items-center gap-3 bg-white/40 rounded-lg px-4 py-2.5 text-sm">
                                    <FaCalendarAlt className="text-blue-500" />
                                    <span>
                                        {t('liveStats.activity.lastHarvest', 'Most recent harvest: {{date}}', {
                                            date: new Date(Math.max(...blocks.filter(b => b.lastHarvestDate).map(b => b.lastHarvestDate!))).toLocaleDateString()
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </InfoCard>
                </motion.div>
            )}

            <div className="text-center mt-8">
                <p className="text-xs text-gray-400">
                    {t('liveStats.footer', 'Data updates automatically as farm operations progress. This page reflects the current state of our farm in real time.')}
                </p>
            </div>
        </div>
    );
};

export default LiveFarmStats;