import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTree, FaChartLine, FaSeedling, FaTractor } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';

interface FarmStats {
    totalTrees: number;
    plantedBlocks: number;
    totalBlocks: number;
    survivalRate: number;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
}

const isDevelopment = import.meta.env.DEV;

const LiveFarmStats: React.FC = () => {
    const [stats, setStats] = useState<FarmStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let data;
                if (isDevelopment) {
                    data = await getMockData('getFarmSummary');
                } else {
                    data = await callApi('farmData', { action: 'getFarmSummary', farmId: '1' });
                }
                if (data.success) {
                    setStats({
                        totalTrees: data.stats?.aliveTrees || 0,
                        plantedBlocks: data.stats?.plantedBlocks || 0,
                        totalBlocks: data.stats?.totalBlocks || 35,
                        survivalRate: data.stats?.totalBlocks ?
                            (data.stats.aliveTrees / (data.stats.totalBlocks * 100)) * 100 : 0,
                        totalRevenue: 0,
                        totalExpenses: 0,
                        netProfit: 0,
                    });
                } else {
                    throw new Error(data.error || 'Failed to fetch stats');
                }
            } catch (err) {
                console.error('Failed to fetch farm stats:', err);
                setError('Unable to load live farm data');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{error || 'Stats unavailable'}</p>
                {isDevelopment && (
                    <p className="text-sm text-gray-400 mt-2">Development mode: Using mock data</p>
                )}
            </div>
        );
    }

    const statsCards = [
        {
            icon: FaTree,
            title: 'Trees Planted',
            value: `${Math.round(stats.totalTrees).toLocaleString()}`,
            subtitle: `${stats.plantedBlocks}/${stats.totalBlocks} blocks planted`,
            iconColor: 'text-green-600',
        },
        {
            icon: FaChartLine,
            title: 'Survival Rate',
            value: `${Math.round(stats.survivalRate)}%`,
            subtitle: 'Trees successfully established',
            iconColor: 'text-orange-500',
        },
        {
            icon: FaSeedling,
            title: 'Farm Progress',
            value: `${Math.round((stats.plantedBlocks / stats.totalBlocks) * 100)}%`,
            subtitle: `${stats.plantedBlocks} of ${stats.totalBlocks} blocks planted`,
            iconColor: 'text-teal-500',
        },
        {
            icon: FaTractor,
            title: 'Active Farm',
            value: '35 ha',
            subtitle: 'Total cultivated area',
            iconColor: 'text-purple-500',
        },
    ];

    return (
        <div className="py-12">
            <div className="text-center mb-8">
                <Typography variant="h2" className="mb-4">
                    Live Farm Dashboard
                </Typography>
                <Typography variant="subtitle" className="text-gray-600">
                    Real-time statistics from our Odienné cashew farm
                </Typography>
                {isDevelopment && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 rounded-full">
                        <span className="text-xs text-yellow-700">Development Mode - Using Mock Data</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden"
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px',
                            }}
                            whileHover={{
                                y: -8,
                                scale: 1.02,
                                rotateY: 3,
                                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            {/* 3D edge effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            {/* Glassy overlay */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                            {/* Inner shadow */}
                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                            {/* Background pattern */}
                            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                            <div className="relative z-10 p-6">
                                <div className="bg-white/40 backdrop-blur-md p-3 rounded-full mb-4 w-fit transform-gpu group-hover:scale-110 transition-transform duration-500 shadow-md">
                                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                                </div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    {card.title}
                                </h3>
                                <div className="text-3xl font-bold text-primary mb-2">
                                    {card.value}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {card.subtitle}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <p className="text-xs text-gray-400">
                    Data updates in real-time • Last sync: {new Date().toLocaleString()}
                </p>
            </motion.div>
        </div>
    );
};

export default LiveFarmStats;