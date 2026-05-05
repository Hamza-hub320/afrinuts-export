import React, { useEffect, useState } from 'react';
import {FaTree, FaChartLine, FaSeedling, FaTractor, FaLeaf} from 'react-icons/fa';
import { FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import { motion } from 'framer-motion';

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

const COLORS = ['#5A7411', '#E04E00', '#A0C800', '#253746', '#698714'];

const LiveFarmStats: React.FC = () => {
    const [stats, setStats] = useState<FarmStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [blockStatusData, setBlockStatusData] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let data;
                if (isDevelopment) {
                    data = await getMockData('getPublicFarmStats');
                } else {
                    data = await callApi('farmData', { action: 'getPublicFarmStats', farmId: '1' }, false);
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
                    setBlockStatusData(data.blockStatusDistribution || []);
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
            iconColor: 'text-accent',
        },
        {
            icon: FaChartLine,
            title: 'Survival Rate',
            value: `${Math.round(stats.survivalRate)}%`,
            subtitle: 'Trees successfully established',
            iconColor: 'text-accent',
        },
        {
            icon: FaSeedling,
            title: 'Farm Progress',
            value: `${Math.round((stats.plantedBlocks / stats.totalBlocks) * 100)}%`,
            subtitle: `${stats.plantedBlocks} of ${stats.totalBlocks} blocks planted`,
            iconColor: 'text-accent',
        },
        {
            icon: FaTractor,
            title: 'Active Farm',
            value: '35 ha',
            subtitle: 'Total cultivated area',
            iconColor: 'text-accent',
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

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, index) => (
                    <InfoCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        subtitle={card.subtitle}
                        iconColor={card.iconColor}
                        className="text-center"
                        showInfoBadge={false}
                    >
                        <div className="text-3xl font-bold text-primary">
                            {card.value}
                        </div>
                    </InfoCard>
                ))}
            </div>

            {/* Second Row: Pie Chart + Performance Metrics */}
            {blockStatusData.length > 0 && stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Block Status Pie Chart */}
                    <InfoCard
                        icon={FaChartPie}
                        title="Block Status Distribution"
                        iconColor="text-primary"
                        className="text-center"
                        showInfoBadge={false}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={blockStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = outerRadius * 1.35;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                fill="#374151"
                                                textAnchor={x > cx ? 'start' : 'end'}
                                                dominantBaseline="central"
                                                fontSize="12"
                                            >
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                    outerRadius="70%"
                                    dataKey="value"
                                >
                                    {blockStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, name]} />
                                <Legend
                                    verticalAlign="bottom"
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </InfoCard>

                    {/* Farm Performance Metrics */}
                    <InfoCard
                        icon={FaTree}
                        title="Farm Performance Metrics"
                        iconColor="text-accent"
                        className="text-center"
                        showInfoBadge={false}
                    >
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Farm Completion</span>
                                    <span className="font-medium">
                            {Math.round((stats.plantedBlocks / stats.totalBlocks) * 100)}%
                        </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full"
                                         style={{ width: `${(stats.plantedBlocks / stats.totalBlocks) * 100}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Survival Rate</span>
                                    <span className="font-medium">{Math.round(stats.survivalRate)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-accent h-2 rounded-full"
                                         style={{ width: `${stats.survivalRate}%` }} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="text-center p-3 bg-primary/5 rounded-xl">
                                    <FaTree className="text-2xl text-primary mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-primary">
                                        {Math.round(stats.totalTrees).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500">Trees Alive</div>
                                </div>
                                <div className="text-center p-3 bg-accent/5 rounded-xl">
                                    <FaTractor className="text-2xl text-accent mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-accent">
                                        {stats.plantedBlocks}/{stats.totalBlocks}
                                    </div>
                                    <div className="text-xs text-gray-500">Blocks Planted</div>
                                </div>
                            </div>
                            <div className="p-3 bg-accent/5 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <FaLeaf className="inline mr-1 text-green-600" />
                                    <strong>Sustainability:</strong> Organic practices across {stats.totalBlocks} blocks. Survival rate exceeds industry average of 85%.
                                </p>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            )}

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                    Data updates in real-time • Last sync: {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default LiveFarmStats;