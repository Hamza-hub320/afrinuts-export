import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTree, FaSeedling, FaTractor, FaCheckCircle, FaHourglassHalf, FaMapMarkerAlt } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import {fadeIn, staggerContainer} from "@/utils/animations";
import Section from '../components/Section/Section';
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";

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
                            5×7 Grid Layout • 35 Blocks • 100 Trees per Block • 1.0 ha each
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            <div className="container mx-auto px-4 py-8 relative z-10">

            {/* Legend - Glassy Card */}
            <motion.div
                className="relative overflow-hidden rounded-2xl mb-8 transition-all duration-500"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.75) 100%)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 20px rgba(165, 105, 66, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-10 blur-2xl"
                     style={{ background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)' }}
                />
                <div className="relative z-10 p-5 flex flex-wrap gap-4 items-center justify-center">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50/80 backdrop-blur-sm">
                        <FaTree className="text-green-500" />
                        <span className="text-sm font-medium text-green-700">Planted</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50/80 backdrop-blur-sm">
                        <FaTractor className="text-blue-500" />
                        <span className="text-sm font-medium text-blue-700">Plowed</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50/80 backdrop-blur-sm">
                        <FaSeedling className="text-orange-500" />
                        <span className="text-sm font-medium text-orange-700">Cleared</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50/80 backdrop-blur-sm">
                        <FaHourglassHalf className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Not Cleared</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 backdrop-blur-sm ml-auto">
                        <FaCheckCircle className="text-primary" />
                        <span className="text-sm text-primary font-medium">Click block for details</span>
                    </div>
                </div>
            </motion.div>

            {/* 5×7 Grid */}
            <div className="overflow-x-auto pb-4">
                <div className="min-w-[600px] space-y-2">
                    {grid.map((rowBlocks, rowIdx) => (
                        <div key={rowIdx} className="flex gap-2 items-center">
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
                                            {/* Glassy overlay */}
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                            {/* Inner highlight */}
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
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
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
                                    { label: 'Trees', value: '100 trees (standard)' },
                                    { label: 'Hectares', value: '1.0 ha' },
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
        </div>
        </div>
    );
};

export default BlockMap;