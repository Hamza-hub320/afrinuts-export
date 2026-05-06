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
    FaChartLine
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import {fadeIn, staggerContainer} from "@/utils/animations";
import Section from '../components/Section/Section';
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import { InfoCard } from '@/components/InfoCard/InfoCard';


const isDevelopment = import.meta.env.DEV;

interface Block {
    id: number;
    blockName: string;
    status: string;
    survivalRate: number;
}

const getStatusIcon = (status: string) => {
    switch (status) {
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
            } catch (error) {
                console.error('Error fetching blocks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlocks();
    }, []);

    const roadNames = {
        horizontal: ['Farmers Branch', 'Farmers Lane', 'Farmers Parkway', 'Farmers Trail', 'Farmers Crest'],
        vertical: ['Harvest Drive', 'Sunrise Drive', 'Heritage Drive', 'Unity Drive', 'Prosperity Drive', 'Cashew Creek Drive'],
    };

    const getBlockAccess = (blockName: string): string => {
        const col = parseInt(blockName.substring(1));
        const row = blockName.charAt(0);
        const roads = [];

        // Horizontal roads
        if (row === 'A') roads.push('Farmers Branch (S)');
        if (row === 'E') roads.push('Farmers Crest (N)');

        // Vertical roads
        if (col === 1) roads.push('Prosperity Dr (W)');
        if (col === 7) roads.push('Harvest Dr (E)');

        return roads.length > 0 ? roads.join(', ') : 'Internal block';
    };

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const grid = rows.map(row =>
        blocks.filter(block => block.blockName.startsWith(row))
            .sort((a, b) => parseInt(a.blockName[1]) - parseInt(b.blockName[1]))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const plantedCount = blocks.filter(b => b.status === 'PLANTED').length;
    const plowedCount = blocks.filter(b => b.status === 'PLOWED').length;
    const clearedCount = blocks.filter(b => b.status === 'CLEARED').length;
    const notClearedCount = blocks.filter(b => b.status === 'NOT_CLEARED').length;

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
                            Farm Block Map
                        </Typography>
                    </motion.div>

                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        <FaMapMarkerAlt className="inline mr-3 text-accent" />
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

                {/* 5×7 Grid */}
                <div className="overflow-x-auto pb-4">
                    <div className="min-w-[750px] space-y-1">
                        {/* Column Road Labels at Top */}
                        <div className="flex gap-2 items-end">
                            <div className="w-10"></div>
                            {Array.from({ length: 7 }, (_, colIdx) => (
                                <div key={colIdx} className="flex-1 flex flex-col items-center">
                                    {/* Road name to the right of each column (except last) */}
                                    {colIdx < 6 && (
                                        <span className="text-[9px] text-gray-400 italic font-medium mb-1 whitespace-nowrap transform -rotate-30">
                            {roadNames.vertical[colIdx]}
                        </span>
                                    )}
                                    <div className="text-xs text-gray-500 font-bold">{colIdx + 1}</div>
                                </div>
                            ))}
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

                                            return (
                                                <motion.div
                                                    key={block.id}
                                                    whileHover={{ scale: 1.08, y: -6 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedBlock(block)}
                                                    className={`aspect-square rounded-xl cursor-pointer transition-all shadow-md hover:shadow-2xl p-2 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br ${colors.bg} border-2 ${colors.border}`}
                                                    style={{
                                                        transformStyle: 'preserve-3d',
                                                        perspective: '1000px',
                                                    }}
                                                >
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                                    <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.5)]" />

                                                    <div className="relative z-10 flex flex-col items-center">
                                                        <div className="text-sm font-bold text-gray-800">{block.blockName}</div>
                                                        <div className={`text-xl my-1 p-1.5 rounded-full ${colors.icon}`}>
                                                            {getStatusIcon(block.status)}
                                                        </div>
                                                        {block.status === 'PLANTED' && (
                                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                                                {block.survivalRate?.toFixed(0)}%
                                            </span>
                                                        )}
                                                        {/* Infrastructure Markers */}
                                                        {block.blockName === 'A1' && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
                                                                 title="Guard Post (SW corner)" />
                                                        )}
                                                        {block.blockName === 'C4' && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                                                                 title="Water Tank & Borehole (center)" />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

            {/* Summary Stats */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Planted Blocks', count: plantedCount, icon: FaTree, color: 'text-green-500', bg: 'from-green-50 to-emerald-50', border: 'border-green-200' },
                    { label: 'Plowed Blocks', count: plowedCount, icon: FaTractor, color: 'text-blue-500', bg: 'from-blue-50 to-sky-50', border: 'border-blue-200' },
                    { label: 'Cleared Blocks', count: clearedCount, icon: FaSeedling, color: 'text-orange-500', bg: 'from-orange-50 to-amber-50', border: 'border-orange-200' },
                    { label: 'Not Cleared', count: notClearedCount, icon: FaHourglassHalf, color: 'text-gray-400', bg: 'from-gray-50 to-slate-50', border: 'border-gray-200' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bg} border-2 ${stat.border} p-5 text-center backdrop-blur-sm transition-all duration-500`}
                        style={{
                            boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.03 }}
                    >
                        <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-15 blur-xl"
                             style={{ background: `radial-gradient(circle, currentColor 0%, transparent 70%)` }}
                        />
                        <stat.icon className={`${stat.color} text-2xl mx-auto mb-2`} />
                        <div className="text-2xl font-bold text-primary">{stat.count}</div>
                        <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Block Details Modal - Liquid Glassy Morphism */}
            {selectedBlock && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedBlock(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="relative max-w-md w-full rounded-2xl overflow-hidden backdrop-blur-lg"
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

                            <button
                                onClick={() => setSelectedBlock(null)}
                                className="mt-6 w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 transform-gpu hover:scale-[1.02]"
                            >
                                Close
                            </button>
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
                                <p className="font-semibold text-primary text-sm mb-2">North ↔ South (Vertical)</p>
                                <ul className="space-y-1">
                                    {[
                                        'Harvest Drive (East edge)',
                                        'Sunrise Drive',
                                        'Heritage Drive',
                                        'Unity Drive',
                                        'Prosperity Drive',
                                        'Cashew Creek Drive (West edge)',
                                    ].map((road, idx) => (
                                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0"></span>
                                            {road}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Horizontal Roads */}
                            <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                                <p className="font-semibold text-primary text-sm mb-2">West ↔ East (Horizontal)</p>
                                <ul className="space-y-1">
                                    {[
                                        'Farmers Branch (South edge)',
                                        'Farmers Lane',
                                        'Farmers Parkway',
                                        'Farmers Trail',
                                        'Farmers Crest (North edge)',
                                    ].map((road, idx) => (
                                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0"></span>
                                            {road}
                                        </li>
                                    ))}
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

                {/* End-of-page CTA */}
                <Section className="py-10">
                    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <motion.div
                            className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                            style={{ transformStyle: 'preserve-3d' }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                rotateY: 3,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
                            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                            <div className="relative z-10">
                                <motion.div variants={fadeIn}>
                                    <Typography variant="h2" className="mb-6 text-primary">
                                        Explore More Farm Insights
                                    </Typography>
                                    <Typography variant="body" className="mb-8 text-gray-700 max-w-3xl mx-auto">
                                        Each block tells a story. Monitor survival rates, track planting progress,
                                        and make data-driven decisions from the field to the balance sheet.
                                    </Typography>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <motion.button
                                            className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden"
                                            variants={fadeIn}
                                            onClick={() => navigate('/dashboard')}
                                            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.4)' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover/btn:translate-z-[-6px] transition-all duration-300" />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover/btn:opacity-70 transition-opacity duration-300" />
                                            <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                <FaChartLine className="text-lg" />
                                Back to Dashboard
                            </span>
                                        </motion.button>
                                        <motion.button
                                            className="relative border-2 border-primary/50 text-primary hover:bg-white/20 px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden backdrop-blur-sm"
                                            variants={fadeIn}
                                            onClick={() => navigate('/dashboard/tasks')}
                                            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.2)' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                            <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                <FaTasks className="text-lg" />
                                Manage Tasks
                            </span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default BlockMap;