import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Typography } from '@/components/Typography/Typography';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import DashboardWeatherWidget from '@/components/DashboardWeatherWidget';
import { GiFarmer } from 'react-icons/gi';
import {
    FaTractor,
    FaChartLine,
    FaTree,
    FaDollarSign,
    FaTasks,
    FaCalendarAlt,
    FaChartPie,
    FaCloudSun,
    FaTachometerAlt,
    FaSeedling,
    FaTrophy,
    FaArrowRight,
    FaMedal,
    FaAward, FaHourglassHalf, FaClipboardList, FaBox, FaChartBar,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import {InfoCard} from "@/components/InfoCard/InfoCard";
import Section from '@/components/Section/Section';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';

const isDevelopment = import.meta.env.DEV;

const COLORS = ['#5A7411', '#E04E00', '#A0C800', '#253746', '#698714'];

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [farmData, setFarmData] = useState<any>(null);
    const [blocks, setBlocks] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [revenues, setRevenues] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMobileWeather, setShowMobileWeather] = useState(false);
    const getFarmGrowthStage = (): {
        stage: string;
        icon: React.ElementType;
        color: string;
        description: string;
        progressPercent: number;
    } => {
        const totalBlocks = blocks.length || 35;
        const harvestedBlocks = blocks.filter(b => b.status === 'HARVESTED').length;
        const plantedBlocks = blocks.filter(b => b.status === 'PLANTED').length;
        const plowedBlocks = blocks.filter(b => b.status === 'PLOWED').length;
        const clearedBlocks = blocks.filter(b => b.status === 'CLEARED').length;
        const notClearedBlocks = blocks.filter(b => b.status === 'NOT_CLEARED').length;

        // All blocks harvested = mature farm
        if (harvestedBlocks === totalBlocks) {
            const harvestDates = blocks
                .filter(b => b.lastHarvestDate)
                .map(b => b.lastHarvestDate!);
            if (harvestDates.length > 0) {
                const oldestHarvest = Math.min(...harvestDates);
                const monthsSinceFirstHarvest = (Date.now() - oldestHarvest) / (1000 * 60 * 60 * 24 * 30);
                const totalHarvested = blocks.reduce((sum, b) => sum + (b.totalHarvestQuantity || 0), 0);
                const harvestCount = blocks.reduce((sum, b) => sum + (b.harvestCount || 0), 0);
                const avgHarvestsPerBlock = harvestCount / harvestedBlocks;

                if (avgHarvestsPerBlock >= 2) {
                    return {
                        stage: 'Established Production',
                        icon: FaTrophy,
                        color: 'text-yellow-500',
                        description: `${harvestCount} total harvests across ${harvestedBlocks} blocks — ${(totalHarvested / 1000).toFixed(1)}T produced`,
                        progressPercent: 100,
                    };
                }
                return {
                    stage: 'Early Production',
                    icon: FaChartLine,
                    color: 'text-green-600',
                    description: `${harvestedBlocks} blocks harvested · ${harvestCount} harvest(s) · ${(totalHarvested / 1000).toFixed(1)}T total yield`,
                    progressPercent: 100,
                };
            }
        }

        // Some harvested
        if (harvestedBlocks > 0 && harvestedBlocks < totalBlocks) {
            const activeBlocks = harvestedBlocks + plantedBlocks + plowedBlocks + clearedBlocks;
            const progressPercent = (activeBlocks / totalBlocks) * 100;
            return {
                stage: 'Active Production',
                icon: FaTractor,
                color: 'text-green-500',
                description: `${harvestedBlocks} harvested · ${plantedBlocks} planted · ${totalBlocks - activeBlocks} undeveloped`,
                progressPercent,
            };
        }

        // Planted but not yet harvested
        if (plantedBlocks > 0) {
            const plantedDates = blocks
                .filter(b => b.plantedDate)
                .map(b => new Date(b.plantedDate).getTime());
            const avgSurvival = plantedBlocks > 0
                ? blocks.filter(b => b.status === 'PLANTED').reduce((sum, b) => sum + (b.survivalRate || 0), 0) / plantedBlocks
                : 0;

            if (plantedDates.length > 0) {
                const oldestPlanting = Math.min(...plantedDates);
                const monthsSincePlanting = (Date.now() - oldestPlanting) / (1000 * 60 * 60 * 24 * 30);

                if (monthsSincePlanting < 12) {
                    return {
                        stage: 'Young Orchard',
                        icon: FaTree,
                        color: 'text-green-500',
                        description: `${plantedBlocks} blocks planted · ${avgSurvival.toFixed(0)}% survival · trees establishing`,
                        progressPercent: (plantedBlocks / totalBlocks) * 100,
                    };
                }
                return {
                    stage: 'Maturing Orchard',
                    icon: FaTree,
                    color: 'text-green-600',
                    description: `${plantedBlocks} blocks maturing · first harvest expected soon`,
                    progressPercent: (plantedBlocks / totalBlocks) * 100,
                };
            }
        }

        // No work started
        const progressedBlocks = harvestedBlocks + plantedBlocks + plowedBlocks + clearedBlocks;
        const progressPercent = (progressedBlocks / totalBlocks) * 100;

        if (progressedBlocks === 0) {
            return {
                stage: 'Pre-Development',
                icon: FaClipboardList,
                color: 'text-gray-500',
                description: 'Farm planning & preparation — no blocks cleared yet',
                progressPercent: 0,
            };
        }

        if (plantedBlocks === 0 && plowedBlocks === 0 && clearedBlocks > 0) {
            return {
                stage: 'Land Preparation',
                icon: FaTractor,
                color: 'text-orange-500',
                description: `${clearedBlocks} block${clearedBlocks > 1 ? 's' : ''} cleared — preparing for planting`,
                progressPercent,
            };
        }

        if (plantedBlocks === 0 && plowedBlocks > 0) {
            return {
                stage: 'Soil Preparation',
                icon: FaTractor,
                color: 'text-blue-500',
                description: `${plowedBlocks} block${plowedBlocks > 1 ? 's' : ''} plowed — soil being prepared`,
                progressPercent,
            };
        }

        return {
            stage: 'In Development',
            icon: FaTractor,
            color: 'text-blue-500',
            description: 'Farm under active development',
            progressPercent,
        };
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                let farmSummary, blocksData, tasksData, revenuesData, expensesData;
                if (isDevelopment) {
                    farmSummary = await getMockData('getFarmSummary');
                    blocksData = await getMockData('getBlocks');
                    tasksData = await getMockData('getTasks');
                    revenuesData = await getMockData('getRevenueSummary');
                    expensesData = await getMockData('getExpenseSummary');
                } else {
                    farmSummary = await callApi('farmData', { action: 'getFarmSummary', farmId: '1' });
                    blocksData = await callApi('farmData', { action: 'getBlocks', farmId: '1' });
                    tasksData = await callApi('farmData', { action: 'getTasks', farmId: '1' });
                    revenuesData = await callApi('farmData', { action: 'getRevenueSummary', farmId: '1' });
                    expensesData = await callApi('farmData', { action: 'getExpenseSummary', farmId: '1' });
                }
                setFarmData(farmSummary);
                setBlocks(blocksData.blocks || []);
                setTasks(tasksData.tasks || []);
                setRevenues(revenuesData.revenues || []);
                setExpenses(expensesData.expenses || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const totalRevenue = revenues.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const pendingTasks = tasks.filter(t => t.status === 'PENDING');
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
    const overdueTasks = tasks.filter(t => t.dueDate < Date.now() && t.status !== 'COMPLETED');

    const blockStatusCount = blocks.reduce((acc: any, block) => {
        const status = block.status === 'HARVESTED' ? 'HARVESTED' : block.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.entries(blockStatusCount).map(([name, value]) => ({ name, value }));

    // Build monthly data from real revenues
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<string, { revenue: number; expenses: number }>();

    revenues.forEach(r => {
        const date = new Date(r.harvestDate || r.createdAt);
        const key = monthNames[date.getMonth()];
        if (!monthlyMap.has(key)) {
            monthlyMap.set(key, { revenue: 0, expenses: 0 });
        }
        monthlyMap.get(key)!.revenue += r.totalAmount || 0;
    });

    expenses.forEach(e => {
        const date = new Date(e.date);
        const key = monthNames[date.getMonth()];
        if (!monthlyMap.has(key)) {
            monthlyMap.set(key, { revenue: 0, expenses: 0 });
        }
        monthlyMap.get(key)!.expenses += e.amount || 0;
    });

    const orderedMonths = monthNames.filter(m => monthlyMap.has(m));
    const monthlyData = orderedMonths.map(month => ({
        month,
        revenue: monthlyMap.get(month)!.revenue,
        expenses: monthlyMap.get(month)!.expenses,
    }));

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

    // Shared glassy card style
    const glassCard = "group relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg p-6 transform-gpu transition-all duration-500";
    const glassCardHover = {
        y: -4,
        scale: 1.01,
        boxShadow: '0 15px 30px -8px rgba(165, 105, 66, 0.15)',
        transition: { duration: 0.3 }
    };

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
                            <FaTachometerAlt className="inline mr-3 text-accent" />
                            Farm Operations Center
                        </Typography>
                    </motion.div>

                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Welcome back, {user?.name || user?.email}
                    </motion.h1>

                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Real-time intelligence from 35 hectares of organic cashew farming in Odienné, Ivory Coast.
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Dashboard Overview Intro */}
            <Section className="py-8">
                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="text-center"
                    >
                        <motion.div variants={fadeIn}>
                            <Typography
                                variant="h2"
                                className="mb-4 text-primary"
                            >
                                Farm Operations at a Glance
                            </Typography>
                            <Typography
                                variant="lead"
                                className="text-text-dark max-w-3xl mx-auto mb-8"
                            >
                                Monitor tree health, track tasks, and analyze financial performance across all {farmData?.stats?.totalBlocks || 35} blocks of our Odienné farm. Below you'll find real-time metrics, revenue trends, and task management tools to keep operations running smoothly.
                            </Typography>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* Development Mode Indicator */}
            {isDevelopment && (
                <div className="bg-yellow-100/80 backdrop-blur-sm border-b border-yellow-200">
                    <div className="container mx-auto px-4 py-2 text-center">
                        <span className="text-sm text-yellow-700">Development Mode - Using Mock Data</span>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Desktop Weather - Always visible */}
                <div className="hidden lg:block mb-8">
                    <DashboardWeatherWidget location="Odienne" />
                </div>

                {/* Mobile Weather - Collapsible */}
                <motion.div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowMobileWeather(!showMobileWeather)}
                        className="w-full flex items-center justify-between bg-white/80 backdrop-blur-md rounded-xl px-4 py-2 border border-white/40 text-sm font-medium text-gray-700"
                    >
                        <span className="flex items-center gap-2">
                            <FaCloudSun className="text-accent" />
                            Odienné Weather
                        </span>
                        <span>{showMobileWeather ? 'Hide' : 'Show'}</span>
                    </button>
                    {showMobileWeather && (
                        <div className="mt-2">
                            <DashboardWeatherWidget location="Odienne" compact />
                        </div>
                    )}
                </motion.div>
                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                        <InfoCard
                            icon={FaTree}
                            title={String(blocks.reduce((sum, b) => sum + Math.round((b.survivalRate || 0) * 100 / 100), 0))}
                            subtitle="Total Trees Alive"
                            iconColor="text-accent"
                            showInfoBadge={false}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <InfoCard
                            icon={FaTractor}
                            title={`${blocks.filter(b => b.status === 'HARVESTED').length}/${blocks.filter(b => b.status === 'PLANTED' || b.status === 'HARVESTED').length}`}
                            subtitle="Blocks Harvested"
                            iconColor="text-accent"
                            showInfoBadge={false}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <InfoCard
                            icon={FaDollarSign}
                            title={`${new Intl.NumberFormat('fr-FR').format(totalRevenue)} FCFA`}
                            subtitle="Total Revenue"
                            iconColor="text-accent"
                            showInfoBadge={false}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <InfoCard
                            icon={FaTasks}
                            title={String(pendingTasks.length + inProgressTasks.length)}
                            subtitle={`Active Tasks${overdueTasks.length > 0 ? ` • ${overdueTasks.length} overdue` : ''}`}
                            iconColor={overdueTasks.length > 0 ? 'text-red-500' : 'text-accent'}
                            showInfoBadge={false}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <InfoCard
                            icon={FaChartLine}
                            title={`${profitMargin.toFixed(1)}%`}
                            subtitle="Profit Margin"
                            iconColor="text-accent"
                            showInfoBadge={false}
                        />
                    </motion.div>
                </div>
                {/* Farm Health & Season Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Survival Rate */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <InfoCard
                            icon={FaTree}
                            title="Tree Survival Rate"
                            subtitle={`${farmData?.stats?.totalAliveTrees?.toLocaleString() || 0} trees alive`}
                            iconColor="text-primary"
                            showInfoBadge={false}
                        >
                            <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Survival Rate</span>
                                    <span className="font-semibold text-green-700">
                        {farmData?.stats?.avgSurvivalRate?.toFixed(1) || 0}%
                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <motion.div
                                        className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${farmData?.stats?.avgSurvivalRate || 0}%` }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {farmData?.stats?.avgSurvivalRate > 85
                                        ? 'Exceeds industry average of 85%'
                                        : 'Below industry average - attention needed'}
                                </p>
                            </div>
                        </InfoCard>
                    </motion.div>

                    {/* Farm Growth Stage (Data-Driven) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <InfoCard
                            icon={FaCloudSun}
                            title="Farm Growth Stage"
                            subtitle={`Odienné, Ivory Coast`}
                            iconColor="text-amber-500"
                            showInfoBadge={false}
                        >
                            {(() => {
                                const growth = getFarmGrowthStage();
                                return (
                                    <div className="mt-3 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-amber-100 p-3 rounded-full">
                                                <growth.icon className={`text-2xl ${growth.color}`} />
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-primary">{growth.stage}</div>
                                                <div className="text-xs text-gray-500">{growth.description}</div>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <motion.div
                                                className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${growth.progressPercent}%` }}
                                                transition={{ duration: 1, delay: 0.3 }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Farm Development</span>
                                            <span>{growth.progressPercent.toFixed(0)}% complete</span>
                                        </div>

                                        {/* Stage indicators */}
                                        <div className="flex gap-2 text-xs overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                                            {[
                                                { key: 'Pre-Development', label: 'Planning' },
                                                { key: 'Land Preparation', label: 'Clearing' },
                                                { key: 'Soil Preparation', label: 'Plowing' },
                                                { key: 'Active Planting', label: 'Planting' },
                                                { key: 'Young Orchard', label: 'Young' },
                                                { key: 'Maturing Orchard', label: 'Maturing' },
                                                { key: 'Early Production', label: 'Production' },
                                                { key: 'Mature Orchard', label: 'Mature' },
                                            ].map((s) => {
                                                const stages = ['Pre-Development', 'Land Preparation', 'Soil Preparation', 'Active Planting', 'Young Orchard', 'Maturing Orchard', 'Early Production', 'Mature Orchard'];
                                                const currentIdx = stages.indexOf(growth.stage);
                                                const stageIdx = stages.indexOf(s.key);
                                                const isCurrent = growth.stage === s.key;
                                                const isPast = stageIdx < currentIdx;

                                                return (
                                                    <span
                                                        key={s.key}
                                                        className={`px-2 py-1 rounded-full whitespace-nowrap ${
                                                            isCurrent
                                                                ? 'bg-primary text-white'
                                                                : isPast
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                    >
                                    {s.label}
                                </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </InfoCard>
                    </motion.div>
                </div>

                {/* Revenue by Quality Grade */}
                {revenues.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8"
                    >
                        <InfoCard
                            icon={FaChartPie}
                            title="Revenue by Quality Grade"
                            iconColor="text-primary"
                            showInfoBadge={false}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {Object.entries(
                                    revenues.reduce((acc: Record<string, { amount: number; count: number }>, r: any) => {
                                        const quality = r.quality || 'UNKNOWN';
                                        if (!acc[quality]) acc[quality] = { amount: 0, count: 0 };
                                        acc[quality].amount += r.totalAmount || 0;
                                        acc[quality].count++;
                                        return acc;
                                    }, {} as Record<string, { amount: number; count: number }>)
                                )
                                    .sort(([, a], [, b]) => b.amount - a.amount)
                                    .map(([quality, data]) => (
                                        <motion.div
                                            key={quality}
                                            className={`text-center p-4 rounded-xl border transition-all hover:shadow-md ${
                                                quality === 'PREMIUM'
                                                    ? 'bg-amber-50 border-amber-200'
                                                    : quality === 'STANDARD'
                                                        ? 'bg-blue-50 border-blue-200'
                                                        : 'bg-gray-50 border-gray-200'
                                            }`}
                                            whileHover={{ y: -2, scale: 1.02 }}
                                        >
                                            <div className={`text-xs font-semibold uppercase mb-2 ${
                                                quality === 'PREMIUM' ? 'text-amber-700' :
                                                    quality === 'STANDARD' ? 'text-blue-700' : 'text-gray-600'
                                            }`}>
                                                {quality}
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {new Intl.NumberFormat('fr-FR').format(data.amount)} FCFA
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {data.count} transaction{data.count !== 1 ? 's' : ''} • {' '}
                                                {totalRevenue > 0 ? ((data.amount / totalRevenue) * 100).toFixed(0) : 0}% of revenue
                                            </div>
                                            {/* Mini progress bar */}
                                            <div  className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                <div
                                                    className={`h-1.5 rounded-full ${
                                                        quality === 'PREMIUM' ? 'bg-amber-500' :
                                                            quality === 'STANDARD' ? 'bg-blue-500' : 'bg-gray-400'
                                                    }`}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                            </div>
                        </InfoCard>
                    </motion.div>
                )}

                {/* Top 3 Performing Blocks */}
                {blocks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Typography variant="h4" className="text-primary flex items-center gap-2">
                                <FaTrophy className="text-yellow-500" />
                                Top Performing Blocks
                            </Typography>
                            <button
                                onClick={() => navigate('/dashboard/financials')}
                                className="text-sm text-primary hover:text-accent transition-colors flex items-center gap-1"
                            >
                                View All <FaArrowRight className="text-xs" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {blocks
                                .sort((a, b) => (b.survivalRate || 0) - (a.survivalRate || 0))
                                .slice(0, 3)
                                .map((block, idx) => {
                                    const treeCount = Math.round((block.survivalRate || 0) * 100 / 100); // survivalRate % × 100 trees
                                    return (
                                        <motion.div
                                            key={block.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                        >
                                            <InfoCard
                                                icon={idx === 0 ? FaTrophy : idx === 1 ? FaMedal : FaAward}
                                                title={`Block ${block.blockName || block.id}`}
                                                subtitle={`${treeCount} trees · ${block.survivalRate?.toFixed(0) || 0}% survival${block.status === 'HARVESTED' ? ` · ${block.totalHarvestQuantity ? (block.totalHarvestQuantity / 1000).toFixed(1) + 'T harvested' : ''}` : ''}`}
                                                iconColor={
                                                    idx === 0 ? 'text-yellow-500' :
                                                        idx === 1 ? 'text-gray-400' :
                                                            'text-amber-700'
                                                }
                                                showInfoBadge={false}
                                            >
                                                <div className="mt-2 space-y-1">
                                                    {block.plantedDate && (
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Planted</span>
                                                            <span className="text-gray-700">
                                        {new Date(block.plantedDate).toLocaleDateString()}
                                    </span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-500">Status</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                            block.status === 'PLANTED' ? 'bg-green-100 text-green-700' :
                                                                block.status === 'PLOWED' ? 'bg-blue-100 text-blue-700' :
                                                                    block.status === 'CLEARED' ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-gray-100 text-gray-600'
                                                        }`}>
                                    {block.status}
                                </span>
                                                    </div>
                                                </div>
                                            </InfoCard>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </motion.div>
                )}

                {/* Block Status Quick Summary */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
                    {[
                        { label: 'Harvested', count: blocks.filter(b => b.status === 'HARVESTED').length, icon: FaTractor, iconColor: 'text-amber-500' },
                        { label: 'Planted', count: blocks.filter(b => b.status === 'PLANTED').length, icon: FaTree, iconColor: 'text-green-500' },
                        { label: 'Plowed', count: blocks.filter(b => b.status === 'PLOWED').length, icon: FaTractor, iconColor: 'text-blue-500' },
                        { label: 'Cleared', count: blocks.filter(b => b.status === 'CLEARED').length, icon: FaSeedling, iconColor: 'text-orange-500' },
                        { label: 'Not Cleared', count: blocks.filter(b => b.status === 'NOT_CLEARED').length, icon: FaHourglassHalf, iconColor: 'text-gray-400' },
                    ].map((item, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}>
                            <InfoCard
                                icon={item.icon}
                                title={String(item.count)}
                                subtitle={item.label}
                                iconColor={item.iconColor}
                                showInfoBadge={false}
                                className="h-full"
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Revenue vs Expenses */}
                    {/* Revenue by Source Over Time */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <InfoCard
                            icon={() => <FaChartBar className="text-primary text-xl" />}
                            title="Revenue by Source"
                            subtitle="Own farm vs supplier trading"
                            iconColor="text-primary"
                            className="h-full"
                            showInfoBadge={false}
                        >
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={(() => {
                                        const byYear: Record<string, { year: string; ownFarm: number; supplier: number }> = {};
                                        revenues.forEach(r => {
                                            const year = r.harvestYear ? String(r.harvestYear) : new Date(r.harvestDate || r.createdAt).getFullYear().toString();
                                            if (!byYear[year]) byYear[year] = { year, ownFarm: 0, supplier: 0 };
                                            if (r.supplierId === 10) {
                                                byYear[year].ownFarm += r.totalAmount || 0;
                                            } else if (r.supplierId) {
                                                byYear[year].supplier += r.totalAmount || 0;
                                            }
                                        });
                                        return Object.values(byYear).sort((a, b) => a.year.localeCompare(b.year));
                                    })()}
                                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="year" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" width={80} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                                    <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(Number(value))} FCFA`} />
                                    <Legend />
                                    <Bar dataKey="ownFarm" name="Own Farm" fill="#5A7411" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="supplier" name="Suppliers" fill="#E04E00" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </InfoCard>
                    </motion.div>

                    {/* Harvest Volume by Block */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <InfoCard
                            icon={() => <FaChartBar className="text-primary text-xl" />}
                            title="Harvest Volume by Block"
                            subtitle="Total production per harvested block"
                            iconColor="text-primary"
                            className="h-full"
                            showInfoBadge={false}
                        >
                            {blocks.filter(b => b.totalHarvestQuantity && b.totalHarvestQuantity > 0).length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={blocks
                                            .filter(b => b.totalHarvestQuantity && b.totalHarvestQuantity > 0)
                                            .sort((a, b) => (a.blockName || '').localeCompare(b.blockName || ''))
                                            .map(b => ({
                                                name: b.blockName || `Block ${b.id}`,
                                                tonnes: parseFloat(((b.totalHarvestQuantity || 0) / 1000).toFixed(2)),
                                            }))}
                                        margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#6b7280" fontSize={10} angle={-45} textAnchor="end" />
                                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v}T`} />
                                        <Tooltip formatter={(value) => `${value} tonnes`} />
                                        <Bar dataKey="tonnes" fill="#5A7411" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <FaBox className="text-3xl mx-auto mb-2" />
                                    <p className="text-sm">No harvest data recorded yet</p>
                                </div>
                            )}
                        </InfoCard>
                    </motion.div>
                </div>

                {/* Recent Tasks */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
                    <InfoCard
                        icon={() => <FaTasks className="text-primary text-xl" />}
                        title={`Recent Tasks (${pendingTasks.length + inProgressTasks.length} active)`}
                        iconColor={overdueTasks.length > 0 ? 'text-red-500' : 'text-primary'}
                        className="h-full"
                        showInfoBadge={false}
                    >
                        {/* Overdue alert badge */}
                        {overdueTasks.length > 0 && (
                            <div className="mb-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-full w-fit">
                                <FaTasks className="text-[10px]" />
                                <span>{overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} overdue</span>
                            </div>
                        )}

                        {/* Task list */}
                        {tasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center justify-between py-3 border-b border-gray-100/50 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900">{task.title}</p>
                                    <p className="text-sm text-gray-500">Block {task.blockId} • {task.type}</p>
                                </div>
                                <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                    }`}>
                        {task.status}
                    </span>
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <FaCalendarAlt />
                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Empty state */}
                        {tasks.length === 0 && (
                            <p className="text-center text-gray-400 py-4 text-sm">No tasks yet</p>
                        )}
                    </InfoCard>
                </motion.div>

                {/* Financial Summary */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mb-12"
                >
                    <InfoCard title="Financial Summary" variant="primary" showInfoBadge={false}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Farm Revenue', value: revenues.filter(r => r.supplierId === 10).reduce((s, r) => s + (r.totalAmount || 0), 0), color: 'text-green-600' },
                                { label: 'Trading Revenue', value: revenues.filter(r => r.supplierId && r.supplierId !== 10).reduce((s, r) => s + (r.totalAmount || 0), 0), color: 'text-blue-600' },
                                { label: 'Operational Costs', value: expenses.filter(e => e.category !== 'PROCUREMENT').reduce((s, e) => s + (e.amount || 0), 0), color: 'text-red-600' },
                                { label: 'Net Profit', value: netProfit, color: netProfit >= 0 ? 'text-green-600' : 'text-red-600' },
                            ].map((item, i) => (
                                <motion.div key={i} variants={fadeIn} transition={{ delay: i * 0.1 }}
                                            className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                    <p className={`text-2xl font-bold ${item.color}`}>
                                        {new Intl.NumberFormat('fr-FR').format(item.value)} FCFA
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </InfoCard>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;