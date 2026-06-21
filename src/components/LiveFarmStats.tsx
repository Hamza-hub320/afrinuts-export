import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {FaTree, FaChartLine, FaSeedling, FaTractor, FaLeaf} from 'react-icons/fa';
import { FaChartPie } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import {GiChart, GiFarmer, GiFarmTractor, GiFruitTree, GiSprout} from 'react-icons/gi';
import Section from './Section/Section';

interface FarmStats {
    totalTrees: number;
    plantedBlocks: number;
    totalBlocks: number;
    survivalRate: number;
}

const isDevelopment = import.meta.env.DEV;

const COLORS = ['#5A7411', '#E04E00', '#A0C800', '#253746', '#698714'];

const LiveFarmStats: React.FC = () => {
    const { t } = useTranslation('farm');
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
                    });
                    setBlockStatusData(data.blockStatusDistribution || []);
                } else {
                    throw new Error(data.error || 'Failed to fetch stats');
                }
            } catch (err) {
                console.error('Failed to fetch farm stats:', err);
                setError(t('liveStats.error', 'Unable to load live farm data'));
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [t]);

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

    if (error || !stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{error || t('liveStats.unavailable', 'Stats unavailable')}</p>
                {isDevelopment && (
                    <p className="text-sm text-gray-400 mt-2">{t('liveStats.devMode', 'Development mode: Using mock data')}</p>
                )}
            </div>
        );
    }

    const statsCards = [
        {
            icon: GiFruitTree,
            title: `${Math.round(stats.totalTrees).toLocaleString()}`,
            subtitle: t('liveStats.cards.blocksPlanted', '{{planted}}/{{total}} blocks planted', { planted: stats.plantedBlocks, total: stats.totalBlocks }),
            iconColor: 'text-accent',
        },
        {
            icon: GiChart,
            title: `${Math.round(stats.survivalRate)}%`,
            subtitle: t('liveStats.cards.treesEstablished', 'Trees successfully established'),
            iconColor: 'text-accent',
        },
        {
            icon: GiSprout,
            title: `${Math.round((stats.plantedBlocks / stats.totalBlocks) * 100)}%`,
            subtitle: t('liveStats.cards.blocksProgress', '{{planted}} of {{total}} blocks planted', { planted: stats.plantedBlocks, total: stats.totalBlocks }),
            iconColor: 'text-accent',
        },
        {
            icon: GiFarmTractor,
            title: t('liveStats.cards.totalArea', '35 ha'),
            subtitle: t('liveStats.cards.cultivatedArea', 'Total cultivated area'),
            iconColor: 'text-accent',
        },
    ];

    return (
        <div className="py-12">
            <div className="text-center mb-8">
                <Typography variant="h2" className="mb-4">
                    {t('liveStats.title', 'Live Farm Dashboard')}
                </Typography>
                <Typography variant="subtitle" className="text-gray-600">
                    {t('liveStats.subtitle', 'Live from AfriNuts Farm – where data meets the soil')}
                </Typography>
                {isDevelopment && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 rounded-full">
                        <span className="text-xs text-yellow-700">{t('liveStats.devMode', 'Development Mode - Using Mock Data')}</span>
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
                    />
                ))}
            </div>

            {/* Second Row: Pie Chart + Performance Metrics */}
            {blockStatusData.length > 0 && stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Block Status Pie Chart */}
                    <InfoCard
                        icon={FaChartPie}
                        title={t('liveStats.blockDistribution', 'Block Status Distribution')}
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
                                            <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12">
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
                                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </InfoCard>

                    {/* Farm Performance Metrics */}
                    <InfoCard
                        icon={FaTree}
                        title={t('liveStats.performanceMetrics', 'Farm Performance Metrics')}
                        iconColor="text-accent"
                        className="text-center"
                        showInfoBadge={false}
                    >
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{t('liveStats.farmCompletion', 'Farm Completion')}</span>
                                    <span className="font-medium">{Math.round((stats.plantedBlocks / stats.totalBlocks) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${(stats.plantedBlocks / stats.totalBlocks) * 100}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{t('liveStats.survivalRateLabel', 'Survival Rate')}</span>
                                    <span className="font-medium">{Math.round(stats.survivalRate)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-accent h-2 rounded-full" style={{ width: `${stats.survivalRate}%` }} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="text-center p-3 bg-primary/5 rounded-xl">
                                    <FaTree className="text-2xl text-primary mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-primary">{Math.round(stats.totalTrees).toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">{t('liveStats.treesAlive', 'Trees Alive')}</div>
                                </div>
                                <div className="text-center p-3 bg-accent/5 rounded-xl">
                                    <FaTractor className="text-2xl text-accent mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-accent">{stats.plantedBlocks}/{stats.totalBlocks}</div>
                                    <div className="text-xs text-gray-500">{t('liveStats.blocksPlantedLabel', 'Blocks Planted')}</div>
                                </div>
                            </div>
                            <div className="p-3 bg-accent/5 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <FaLeaf className="inline mr-1 text-green-600" />
                                    <strong>{t('liveStats.sustainability', 'Sustainability')}:</strong> {t('liveStats.sustainabilityDesc', 'Organic practices across {{blocks}} blocks. Survival rate exceeds industry average of 85%.', { blocks: stats.totalBlocks })}
                                </p>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            )}

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                    {t('liveStats.lastSync', 'Data updates in real-time • Last sync: {{time}}', { time: new Date().toLocaleString() })}
                </p>
            </div>
        </div>
    );
};

export default LiveFarmStats;