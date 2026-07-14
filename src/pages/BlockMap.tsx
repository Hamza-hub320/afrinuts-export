import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaTree,
    FaSeedling,
    FaTractor,
    FaCheckCircle,
    FaHourglassHalf,
    FaMapMarkerAlt,
    FaTasks,
    FaChartLine, FaBorderAll, FaArrowsAltV, FaArrowsAltH, FaChartBar, FaBox, FaCalendarAlt
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import {fadeIn, staggerContainer} from "@/utils/animations";
import Section from '../components/Section/Section';
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import {FarmBlock} from "@/components/FarmBlock/FarmBlock";
import { GiFarmer } from 'react-icons/gi';
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';


const isDevelopment = import.meta.env.DEV;
interface Block {
    id: number;
    blockName: string;
    status: 'PLANTED' | 'PLOWED' | 'CLEARED' | 'NOT_CLEARED' | 'HARVESTED';
    survivalRate: number;
    harvestCount?: number;
    lastHarvestDate?: number;
    lastHarvestQuantity?: number;
    totalHarvestQuantity?: number;
    harvestHistory?: string;
    clearedDate?: number;
    plowedDate?: number;
    plantedDate?: number;
}

interface Photo {
    id: number;
    filePath: string;
    caption?: string;
    takenAt: number;
    photoType: 'BLOCK' | 'EXPENSE' | 'TASK';
    blockId?: number;
    expenseId?: number;
    taskId?: number;
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'HARVESTED': return <FaTractor className="text-amber-500" />;
        case 'PLANTED': return <FaTree className="text-green-500" />;
        case 'PLOWED': return <FaTractor className="text-blue-500" />;
        case 'CLEARED': return <FaSeedling className="text-orange-500" />;
        default: return <FaHourglassHalf className="text-gray-400" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PLANTED': return {
            bg: 'from-green-50 to-emerald-50',
            border: 'border-green-300 hover:border-green-400',
            badge: 'bg-green-500/20 text-green-700',
            icon: 'bg-green-500/10 text-green-600'
        };
        case 'PLOWED': return {
            bg: 'from-blue-50 to-sky-50',
            border: 'border-blue-300 hover:border-blue-400',
            badge: 'bg-blue-500/20 text-blue-700',
            icon: 'bg-blue-500/10 text-blue-600'
        };
        case 'CLEARED': return {
            bg: 'from-orange-50 to-amber-50',
            border: 'border-orange-300 hover:border-orange-400',
            badge: 'bg-orange-500/20 text-orange-700',
            icon: 'bg-orange-500/10 text-orange-600'
        };
        case 'HARVESTED': return {
            bg: 'from-amber-50 to-yellow-50',
            border: 'border-amber-300 hover:border-amber-400',
            badge: 'bg-amber-500/20 text-amber-700',
            icon: 'bg-amber-500/10 text-amber-600'
        };
        default: return {
            bg: 'from-gray-50 to-slate-50',
            border: 'border-gray-300 hover:border-gray-400',
            badge: 'bg-gray-500/20 text-gray-700',
            icon: 'bg-gray-500/10 text-gray-600'
        };
    }
};

const BlockMap: React.FC = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
    const [blockPhotos, setBlockPhotos] = useState<Photo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                let data;
                if (isDevelopment) {
                    data = await getMockData('getBlocks');
                } else {
                    data = await callApi('farmData', { action: 'getBlocks', farmId: '1' });
                }
                setBlocks(data.blocks || []);

                // Fetch photos for all blocks
                if (data.blocks && data.blocks.length > 0) {
                    const photosData = await callApi('photos', {
                        action: 'getPhotos',
                        farmId: '1'
                    });
                    setBlockPhotos(photosData.photos || []);
                }
            } catch (error) {
                console.error('Error fetching blocks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlocks();
    }, []);

    const roadNames = {
        horizontal: ['Farmers Branch', 'Farmers Lane', 'Farmers Parkway', 'Farmers Trail'],
        vertical: ['Harvest Drive', 'Sunrise Drive', 'Heritage Drive', 'Unity Drive', 'Prosperity Drive', 'Cashew Creek Drive'],
    };

    const getBlockAccess = (blockName: string): string => {
        const col = parseInt(blockName.substring(1));
        const row = blockName.charAt(0);
        const rowIndex = rows.indexOf(row);

        const distToMainLoopN = rowIndex + 0.5;
        const distToMainLoopS = (rows.length - 1 - rowIndex) + 0.5;
        const distToMainLoopW = col - 0.5;
        const distToMainLoopE = (7 - col) + 0.5;

        type Access = { name: string; distance: number; direction: string };

        const horizontalOptions: Access[] = [
            { name: 'AfriNuts Main Loop', distance: distToMainLoopN, direction: 'head North' },
            { name: 'AfriNuts Main Loop', distance: distToMainLoopS, direction: 'head South' },
        ];

        for (let i = 0; i < roadNames.horizontal.length; i++) {
            const roadPosition = i + 1;
            const dist = Math.abs(rowIndex - roadPosition) + 0.5;
            const dir = rowIndex < roadPosition ? 'head South' : 'head North';
            horizontalOptions.push({ name: roadNames.horizontal[i], distance: dist, direction: dir });
        }

        const verticalOptions: Access[] = [
            { name: 'AfriNuts Main Loop', distance: distToMainLoopW, direction: 'head West' },
            { name: 'AfriNuts Main Loop', distance: distToMainLoopE, direction: 'head East' },
        ];

        for (let i = 0; i < roadNames.vertical.length; i++) {
            const roadPosition = i + 1;
            const dist = Math.abs(col - roadPosition) + 0.5;
            const dir = col < roadPosition ? 'head East' : 'head West';
            verticalOptions.push({ name: roadNames.vertical[i], distance: dist, direction: dir });
        }

        const allOptions = [...horizontalOptions, ...verticalOptions];
        allOptions.sort((a, b) => a.distance - b.distance);

        const best = allOptions[0];
        return `Take ${best.name} — ${best.direction}`;
    };

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const grid = rows.map(row =>
        blocks.filter(block => block.blockName.startsWith(row))
            .sort((a, b) => parseInt(a.blockName[1]) - parseInt(b.blockName[1]))
    );

    const getBlockStage = (block: Block): 'PLANTED' | 'PLOWED' | 'CLEARED' | 'NOT_CLEARED' | 'HARVESTED' => {
        if (block.harvestCount && block.harvestCount > 0) return 'HARVESTED';
        if (block.plantedDate) return 'PLANTED';
        if (block.plowedDate) return 'PLOWED';
        if (block.clearedDate) return 'CLEARED';
        return 'NOT_CLEARED';
    };

    if (loading) {
        return (
            <main>
                <Section className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <GiFarmer className="text-primary text-3xl" />
                            </div>
                        </div>
                    </div>
                </Section>
            </main>
        );
    }

    const clearedCount = blocks.filter(b => b.clearedDate).length;
    const plowedCount = blocks.filter(b => b.plowedDate).length;
    const plantedCount = blocks.filter(b => b.plantedDate).length;
    const harvestedCount = blocks.filter(b => b.harvestCount && b.harvestCount > 0).length;
    const notClearedCount = blocks.length - clearedCount;

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            {/* Hero Header */}
            <Section
                fullHeight={false}
                className="flex items-center justify-center text-center min-h-[40vh] relative"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaBorderAll className="inline mr-3 text-accent" />
                            Farm Block Map
                        </Typography>
                    </motion.div>

                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Block Overview
                    </motion.h1>

                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Our farm is organized into 35 individually monitored blocks across a 5×7 grid.
                            Each block spans 1 hectare and hosts 100 cashew trees, giving you a clear view
                            of planting status, survival rates, and field operations at a glance.
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Overview Section */}
            <Section className="py-6">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn}>
                            <Typography variant="h2" className="mb-4 text-primary">
                                Farm Block Overview
                            </Typography>
                            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                                Each colored tile below represents a farm block. Click any block to see
                                its current status, tree survival rate, and operational details. The legend
                                helps you quickly identify which blocks are planted, plowed, cleared, or
                                awaiting preparation.
                            </Typography>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            <div className="container mx-auto px-4 py-8 relative z-10">

                {/* Legend - Using InfoCard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <InfoCard
                        icon={FaMapMarkerAlt}
                        title="Block Status Legend"
                        variant="primary"
                        showInfoBadge={false}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                            {[
                                { icon: FaTractor, label: 'Harvested', variant: 'secondary' as const },
                                { icon: FaTree, label: 'Planted', variant: 'secondary' as const },
                                { icon: FaTractor, label: 'Plowed', variant: 'accent' as const },
                                { icon: FaSeedling, label: 'Cleared', variant: 'primary' as const },
                                { icon: FaHourglassHalf, label: 'Not Cleared', variant: 'primary' as const },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 backdrop-blur-sm">
                                    <item.icon className="text-primary flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-4 px-3 py-2 rounded-xl bg-primary/5 backdrop-blur-sm">
                            <FaCheckCircle className="text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-primary font-medium text-center">Click any block for details</span>
                        </div>
                    </InfoCard>
                </motion.div>

                {/* Farm Overview Panel - Using InfoCard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6"
                >
                    <InfoCard
                        icon={FaChartLine}
                        title="Farm Overview"
                        variant="accent"
                        showInfoBadge={false}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-center">
                            {[
                                { label: 'Total Area', value: '35 ha', icon: FaMapMarkerAlt },
                                { label: 'Total Trees', value: '3,500', icon: FaTree },
                                { label: 'Block Size', value: '100m × 100m', icon: FaTasks },
                                { label: 'Tree Spacing', value: '10m × 10m', icon: FaSeedling },
                            ].map((item, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                                    <item.icon className="text-primary text-xl mx-auto mb-1" />
                                    <div className="text-lg font-bold text-primary">{item.value}</div>
                                    <div className="text-xs text-gray-500">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </motion.div>

                {/* Spacer */}
                <div className="my-8"></div>

                {/* 5×7 Grid */}
                <div className="overflow-x-auto pb-4">
                    <div className="min-w-[750px] space-y-1 px-3 py-3">
                        {/* AfriNuts Main Loop - Above grid */}
                        <div className="flex items-center gap-2 py-1">
                            <div className="w-10"></div>
                            <div className="flex-1 text-center">
                <span className="text-[10px] text-accent italic font-medium px-3 py-0.5 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20">
                    AfriNuts Main Loop (North Perimeter)
                </span>
                            </div>
                        </div>

                        {/* Column Road Labels */}
                        <div className="flex gap-2 items-end mb-2">
                            <div className="w-10"></div>
                            {/* Main Loop - West */}
                            <div className="flex-1 flex flex-col items-center">
                <span className="text-[8px] text-accent italic font-medium mb-1 whitespace-nowrap">
                    Main Loop
                </span>
                                <div className="text-xs text-accent font-bold">←</div>
                            </div>
                            {/* Column labels 1-7 with road names between */}
                            {Array.from({ length: 7 }, (_, colIdx) => (
                                <React.Fragment key={colIdx}>
                                    <div className="flex-1 flex flex-col items-center">
                                        <div className="text-xs text-gray-500 font-bold">{colIdx + 1}</div>
                                    </div>
                                    {/* Road name after each column (except last) */}
                                    {colIdx < 6 && (
                                        <div className="flex-1 flex flex-col items-center">
                            <span className="text-[8px] text-gray-400 italic font-medium mb-1 whitespace-nowrap">
                                {roadNames.vertical[colIdx]}
                            </span>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                            {/* Main Loop - East */}
                            <div className="flex-1 flex flex-col items-center">
                <span className="text-[8px] text-accent italic font-medium mb-1 whitespace-nowrap">
                    Main Loop
                </span>
                                <div className="text-xs text-accent font-bold">→</div>
                            </div>
                        </div>

                        {grid.map((rowBlocks, rowIdx) => (
                            <React.Fragment key={rowIdx}>
                                {/* Horizontal road label between rows */}
                                {rowIdx > 0 && (
                                    <div className="flex items-center gap-2 py-1">
                                        <div className="w-10"></div>
                                        <div className="flex-1 text-center">
                            <span className="text-[10px] text-gray-400 italic font-medium px-3 py-0.5 rounded-full bg-white/40 backdrop-blur-sm">
                                {roadNames.horizontal[rowIdx - 1]}
                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 items-center">
                                    {/* Row Label */}
                                    <div className="w-10 h-10 flex items-center justify-center font-bold text-primary text-xl bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-white/40">
                                        {rows[rowIdx]}
                                    </div>

                                    {/* Blocks in Row */}
                                    <div className="flex-1 grid grid-cols-7 gap-2">
                                        {Array.from({ length: 7 }, (_, colIdx) => {
                                            const block = rowBlocks[colIdx];
                                            if (!block) {
                                                return (
                                                    <div key={colIdx} className="aspect-square rounded-xl bg-gray-100/50 backdrop-blur-sm flex items-center justify-center text-gray-300 border border-dashed border-gray-200 text-xs">
                                                        Empty
                                                    </div>
                                                );
                                            }

                                            const colors = getStatusColor(block.status);

                                            const infrastructure =
                                                block.blockName === 'A1'
                                                    ? { type: 'guard-post' as const, label: 'Guard Post (SW corner)' }
                                                    : block.blockName === 'C4'
                                                        ? { type: 'water-tank' as const, label: 'Water Tank & Borehole (center)' }
                                                        : undefined;

                                            return (
                                                <FarmBlock
                                                    key={block.id}
                                                    blockName={block.blockName}
                                                    status={getBlockStage(block)}
                                                    survivalRate={block.survivalRate}
                                                    icon={getStatusIcon(getBlockStage(block))}
                                                    colors={getStatusColor(getBlockStage(block))}
                                                    infrastructure={infrastructure}
                                                    onClick={() => setSelectedBlock(block)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}

                        {/* AfriNuts Main Loop - Below grid */}
                        <div className="flex items-center gap-2 py-1 mt-1">
                            <div className="w-10"></div>
                            <div className="flex-1 text-center">
                <span className="text-[10px] text-accent italic font-medium px-3 py-0.5 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20">
                    AfriNuts Main Loop (South Perimeter)
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Stats - Using InfoCard */}
                <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Cleared', count: clearedCount, total: blocks.length, icon: FaSeedling, variant: 'primary' as const },
                        { label: 'Plowed', count: plowedCount, total: blocks.length, icon: FaTractor, variant: 'accent' as const },
                        { label: 'Planted', count: plantedCount, total: blocks.length, icon: FaTree, variant: 'secondary' as const },
                        { label: 'Harvested', count: harvestedCount, total: plantedCount, icon: FaTractor, variant: 'secondary' as const },
                        { label: 'Not Cleared', count: notClearedCount, total: blocks.length, icon: FaHourglassHalf, variant: 'primary' as const },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                        >
                            <InfoCard
                                icon={stat.icon}
                                title={`${stat.count}/${stat.total}`}
                                subtitle={stat.label}
                                variant={stat.variant}
                                showInfoBadge={false}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Harvest Intelligence Section */}
                <Section className="py-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <InfoCard
                                icon={FaTractor}
                                title="Harvest Intelligence"
                                subtitle="Block-level production tracking — every harvest recorded"
                                iconColor="text-amber-500"
                                showInfoBadge={false}
                            >
                                {/* Harvest KPIs */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                    {[
                                        {
                                            label: 'Blocks Harvested',
                                            value: blocks.filter(b => b.status === 'HARVESTED').length,
                                            total: blocks.filter(b => b.status === 'PLANTED' || b.status === 'HARVESTED').length,
                                            icon: FaTractor,
                                            color: 'text-amber-600',
                                        },
                                        {
                                            label: 'Total Harvests',
                                            value: blocks.reduce((sum, b) => sum + (b.harvestCount || 0), 0),
                                            icon: FaChartBar,
                                            color: 'text-primary',
                                        },
                                        {
                                            label: 'Total Volume',
                                            value: blocks.reduce((sum, b) => sum + (b.totalHarvestQuantity || 0), 0) > 0
                                                ? `${(blocks.reduce((sum, b) => sum + (b.totalHarvestQuantity || 0), 0) / 1000).toFixed(1)}T`
                                                : '—',
                                            icon: FaBox,
                                            color: 'text-green-600',
                                        },
                                        {
                                            label: 'Last Harvest',
                                            value: blocks
                                                .filter(b => b.lastHarvestDate)
                                                .sort((a, b) => (b.lastHarvestDate || 0) - (a.lastHarvestDate || 0))[0]?.lastHarvestDate
                                                ? new Date(blocks.filter(b => b.lastHarvestDate).sort((a, b) => (b.lastHarvestDate || 0) - (a.lastHarvestDate || 0))[0].lastHarvestDate!).toLocaleDateString()
                                                : '—',
                                            icon: FaCalendarAlt,
                                            color: 'text-accent',
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/40 rounded-xl p-3 border border-white/30 text-center">
                                            <item.icon className={`text-xl mx-auto ${item.color}`} />
                                            <div className="text-lg font-bold mt-1">
                                                {item.total !== undefined ? `${item.value}/${item.total}` : item.value}
                                            </div>
                                            <div className="text-xs text-gray-500">{item.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recently Harvested Blocks */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">Recently Harvested Blocks</h4>
                                    <div className="space-y-2">
                                        {blocks
                                            .filter(b => b.status === 'HARVESTED' && b.lastHarvestDate)
                                            .sort((a, b) => (b.lastHarvestDate || 0) - (a.lastHarvestDate || 0))
                                            .slice(0, 5)
                                            .map((block, i) => {
                                                const history = block.harvestHistory
                                                    ? (typeof block.harvestHistory === 'string' ? JSON.parse(block.harvestHistory) : block.harvestHistory)
                                                    : [];
                                                const lastHarvest = Array.isArray(history) ? history[history.length - 1] : null;
                                                return (
                                                    <div key={block.id} className="flex items-center justify-between bg-white/30 rounded-lg px-3 py-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                                                {block.blockName}
                                            </span>
                                                            <span className="font-medium">{block.blockName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span>{block.harvestCount} harvest{block.harvestCount !== 1 ? 's' : ''}</span>
                                                            <span>{block.totalHarvestQuantity ? `${(block.totalHarvestQuantity / 1000).toFixed(1)}T` : '—'}</span>
                                                            {lastHarvest?.grade && (
                                                                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                                                                    lastHarvest.grade === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                                }`}>{lastHarvest.grade}</span>
                                                            )}
                                                            <span>{block.lastHarvestDate ? new Date(block.lastHarvestDate).toLocaleDateString() : '—'}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </InfoCard>
                        </motion.div>
                    </div>
                </Section>

                {/* Harvest Distribution Chart */}
                <Section className="py-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <InfoCard
                                icon={FaChartBar}
                                title="Block Production Distribution"
                                subtitle="Total harvest quantity by harvested block"
                                iconColor="text-primary"
                                showInfoBadge={false}
                            >
                                {blocks.filter(b => b.totalHarvestQuantity && b.totalHarvestQuantity > 0).length > 0 ? (
                                    <div className="space-y-2 mt-3">
                                        {blocks
                                            .filter(b => b.totalHarvestQuantity && b.totalHarvestQuantity > 0)
                                            .sort((a, b) => (b.totalHarvestQuantity || 0) - (a.totalHarvestQuantity || 0))
                                            .slice(0, 8)
                                            .map((block, i) => {
                                                const maxQty = Math.max(...blocks.filter(b => b.totalHarvestQuantity).map(b => b.totalHarvestQuantity || 0));
                                                const pct = maxQty > 0 ? ((block.totalHarvestQuantity || 0) / maxQty) * 100 : 0;
                                                return (
                                                    <div key={block.id}>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="font-medium">{block.blockName}</span>
                                                            <span className="text-gray-500">{(block.totalHarvestQuantity! / 1000).toFixed(1)}T · {block.harvestCount} harvest{block.harvestCount !== 1 ? 's' : ''}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                            <motion.div
                                                                className="bg-amber-500 h-2.5 rounded-full"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${pct}%` }}
                                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400">
                                        <FaBox className="text-2xl mx-auto mb-2" />
                                        <p className="text-sm">No harvest data recorded yet</p>
                                    </div>
                                )}
                            </InfoCard>
                        </motion.div>
                    </div>
                </Section>

                {/* Block Details Modal */}
                {selectedBlock && (
                    <motion.div
                        className="fixed inset-0 top-0 z-[100] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedBlock(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="relative max-w-lg w-full max-h-[85vh] overflow-y-auto overflow-x-hidden rounded-2xl backdrop-blur-lg"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.85) 100%)',
                                border: '1px solid rgba(255,255,255,0.5)',
                                boxShadow: '0 8px 32px rgba(165, 105, 66, 0.2), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.05)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Animated blobs */}
                            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-15 blur-3xl animate-pulse"
                                 style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }}
                            />
                            <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full opacity-10 blur-3xl"
                                 style={{ background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)', animation: 'float 6s ease-in-out infinite' }}
                            />

                            <div className="relative z-10 p-6">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-full ${getStatusColor(selectedBlock.status).icon}`}>
                                            {getStatusIcon(selectedBlock.status)}
                                        </div>
                                        <Typography variant="h3" className="text-primary">
                                            Block {selectedBlock.blockName}
                                        </Typography>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBlock(null)}
                                        className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-all"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Block Details */}
                                <div className="space-y-3">
                                    {[
                                        { label: 'Status', value: selectedBlock.status },
                                        { label: 'Survival Rate', value: selectedBlock.survivalRate > 0 ? `${selectedBlock.survivalRate.toFixed(1)}%` : 'N/A' },
                                        { label: 'Trees', value: '100 trees (10×10 grid)' },
                                        { label: 'Area', value: '1.0 hectare (100m × 100m)' },
                                        { label: 'Row', value: selectedBlock.blockName.charAt(0) },
                                        { label: 'Column', value: selectedBlock.blockName.substring(1) },
                                        { label: 'Access', value: getBlockAccess(selectedBlock.blockName) },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-3 px-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30">
                                            <span className="font-medium text-gray-700">{item.label}</span>
                                            <span className="capitalize text-gray-900 font-semibold">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Harvest History */}
                                {selectedBlock.harvestCount && selectedBlock.harvestCount > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                                            <FaCalendarAlt className="text-amber-500" />
                                            Harvest History ({selectedBlock.harvestCount} record{selectedBlock.harvestCount !== 1 ? 's' : ''})
                                        </h4>
                                        <div className="space-y-2">
                                            {(() => {
                                                const history = selectedBlock.harvestHistory
                                                    ? (typeof selectedBlock.harvestHistory === 'string' ? JSON.parse(selectedBlock.harvestHistory) : selectedBlock.harvestHistory)
                                                    : [];
                                                return (Array.isArray(history) ? history : []).map((h: any, i: number) => (
                                                    <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/30 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500">{new Date(h.harvestDate).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                                h.grade === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>{h.grade}</span>
                                                            <span className="font-medium">{h.quantityKg?.toLocaleString()} kg</span>
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}
                                {/* Photo Gallery INSIDE the modal */}
                                <div className="mt-6">
                                    <PhotoGallery
                                        photos={blockPhotos}
                                        entityType="block"
                                        entityId={selectedBlock.id}
                                        entityName={`Block ${selectedBlock.blockName}`}
                                        title={`Block ${selectedBlock.blockName} Photos`}
                                        compact
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Road Map Reference - Using InfoCard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6"
                >
                    <InfoCard
                        icon={FaMapMarkerAlt}
                        title="Road Map & Access Network"
                        variant="primary"
                        showInfoBadge={false}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {/* Vertical Roads */}
                            <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                                <p className="font-semibold text-primary text-sm mb-2">North <FaArrowsAltV className="inline mr-1" /> South (Vertical, between columns)</p>
                                <ul className="space-y-1">
                                    <li className="text-xs text-accent flex items-center gap-2">
                                        <span className="w-1 h-1 bg-accent rounded-full"></span>
                                        AfriNuts Main Loop (West perimeter)
                                    </li>
                                    {roadNames.vertical.map((road, idx) => (
                                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                                            {road}
                                        </li>
                                    ))}
                                    <li className="text-xs text-accent flex items-center gap-2">
                                        <span className="w-1 h-1 bg-accent rounded-full"></span>
                                        AfriNuts Main Loop (East perimeter)
                                    </li>
                                </ul>
                            </div>

                            {/* Horizontal Roads */}
                            <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                                <p className="font-semibold text-primary text-sm mb-2 mt-3">West <FaArrowsAltH className="inline mr-1" /> East (Horizontal, between rows)</p>
                                <ul className="space-y-1">
                                    <li className="text-xs text-accent flex items-center gap-2">
                                        <span className="w-1 h-1 bg-accent rounded-full"></span>
                                        AfriNuts Main Loop (North perimeter)
                                    </li>
                                    {roadNames.horizontal.map((road, idx) => (
                                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-accent rounded-full"></span>
                                            {road}
                                        </li>
                                    ))}
                                    <li className="text-xs text-accent flex items-center gap-2">
                                        <span className="w-1 h-1 bg-accent rounded-full"></span>
                                        AfriNuts Main Loop (South perimeter)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Perimeter */}
                        <div className="mt-3 p-3 rounded-xl bg-primary/5 backdrop-blur-sm">
                            <p className="font-semibold text-primary text-sm">Perimeter</p>
                            <p className="text-xs text-gray-600">AfriNuts Main Loop (encircles entire farm)</p>
                        </div>

                        {/* Infrastructure Markers */}
                        <div className="mt-3 flex flex-wrap gap-3">
                            {[
                                { color: 'bg-red-500', label: 'Guard Post (SW corner)' },
                                { color: 'bg-blue-500', label: 'Water Tank & Borehole (center)' },
                            ].map((marker, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className={`w-2.5 h-2.5 ${marker.color} rounded-full`}></span>
                                    {marker.label}
                </span>
                            ))}
                        </div>
                    </InfoCard>
                </motion.div>
            </div>
        </div>
    );
};

export default BlockMap;