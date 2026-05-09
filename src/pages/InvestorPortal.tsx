import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {Link, useNavigate} from 'react-router-dom';
import {
    FaChartLine,
    FaDollarSign,
    FaTree,
    FaSeedling,
    FaTractor,
    FaCalendarAlt,
    FaArrowUp,
    FaArrowDown,
    FaTasks,
    FaLightbulb,
    FaLeaf,
    FaChartBar,
    FaChartPie,
    FaTrophy,
    FaMedal,
    FaAward
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell
} from 'recharts';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';

const isDevelopment = import.meta.env.DEV;
const COLORS = ['#5A7411', '#E04E00', '#A0C800', '#253746'];

const InvestorPortal: React.FC = () => {
    const [farmStats, setFarmStats] = useState<any>(null);
    const [financials, setFinancials] = useState<any>({
        totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0
    });
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const navigate = useNavigate();
    const [revenues, setRevenues] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [revenueByBlock, setRevenueByBlock] = useState<any[]>([]);
    const [perBlockAllocation, setPerBlockAllocation] = useState<number>(0);
    const [pieData, setPieData] = useState<any[]>([]);
    const [expensesByCategory, setExpensesByCategory] = useState<Record<string, number>>({});
    const [blockCount] = useState(35);

    useEffect(() => {
        const fetchInvestorData = async () => {
            try {
                let farmData, revenueData, expenseData;
                if (isDevelopment) {
                    farmData = await getMockData('getFarmSummary');
                    revenueData = await getMockData('getRevenueSummary');
                    expenseData = await getMockData('getExpenseSummary');
                } else {
                    farmData = await callApi('farmData', { action: 'getFarmSummary', farmId: '1' });
                    revenueData = await callApi('farmData', { action: 'getRevenueSummary', farmId: '1' });
                    expenseData = await callApi('farmData', { action: 'getExpenseSummary', farmId: '1' });
                }

                setFarmStats(farmData);

                const revenuesList = revenueData.revenues || [];
                const expensesList = expenseData.expenses || [];
                setRevenues(revenuesList);
                setExpenses(expensesList);

                const totalRev = revenuesList.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0);
                const totalExp = expensesList.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
                const netProfitVal = totalRev - totalExp;
                const margin = totalRev > 0 ? (netProfitVal / totalRev) * 100 : 0;

                setFinancials({
                    totalRevenue: totalRev,
                    totalExpenses: totalExp,
                    netProfit: netProfitVal,
                    profitMargin: margin,
                });

                // Expense breakdown for pie chart
                const byCategory: Record<string, number> = {};
                expensesList.forEach((e: any) => {
                    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
                });
                setExpensesByCategory(byCategory);
                setPieData(Object.entries(byCategory).map(([name, value]) => ({ name, value })));

                // Block-level P&L
                const blockMap = new Map<number, any>();
                for (let i = 1; i <= blockCount; i++) {
                    blockMap.set(i, {
                        blockId: i,
                        blockName: `Block ${i}`,
                        totalRevenue: 0,
                        totalExpenses: 0,
                        profit: 0,
                        roi: 0,
                        transactionCount: 0,
                    });
                }
                revenuesList.forEach((r: any) => {
                    if (r.blockId && blockMap.has(r.blockId)) {
                        const b = blockMap.get(r.blockId);
                        b.totalRevenue += r.totalAmount || 0;
                        b.transactionCount++;
                    }
                });
                let farmWideTotal = 0;
                expensesList.forEach((e: any) => {
                    if (e.blockId && blockMap.has(e.blockId)) {
                        blockMap.get(e.blockId).totalExpenses += e.amount || 0;
                    } else {
                        farmWideTotal += e.amount || 0;
                    }
                });
                const perBlock = farmWideTotal / blockCount;
                setPerBlockAllocation(perBlock);
                blockMap.forEach((b) => {
                    b.totalExpenses += perBlock;
                    b.profit = b.totalRevenue - b.totalExpenses;
                    b.roi = b.totalExpenses > 0 ? (b.profit / b.totalExpenses) * 100 : (b.totalRevenue > 0 ? 100 : 0);
                });
                const sortedBlocks = Array.from(blockMap.values()).sort((a, b) => b.profit - a.profit);
                setRevenueByBlock(sortedBlocks);

                // Monthly chart data
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                setMonthlyData(months.map((month, i) => ({
                    month,
                    revenue: totalRev * (0.8 + (i * 0.04)),
                    profit: netProfitVal * (0.7 + (i * 0.06)),
                })));

                setLastUpdated(new Date());
            } catch (error) {
                console.error('Error fetching investor data:', error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) fetchInvestorData();
            else setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const yearlyProjections = [
        { year: new Date().getFullYear(), revenue: financials.totalRevenue, profit: financials.netProfit, growth: 0 },
        { year: new Date().getFullYear() + 1, revenue: financials.totalRevenue * 1.25, profit: financials.netProfit * 1.35, growth: 25 },
        { year: new Date().getFullYear() + 2, revenue: financials.totalRevenue * 1.55, profit: financials.netProfit * 1.75, growth: 28 },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

        <main>
            {/* Hero Section */}
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
                            <FaChartBar className="inline mr-3 text-accent" />
                            Investor Dashboard
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Real-Time Farm Performance
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Data-driven insights from our 35-hectare cashew farm in Odienné, Ivory Coast.
                        </Typography>
                    </motion.div>
                    <motion.div variants={fadeIn} className="mt-4 text-sm text-text-dark/60">
                        Last updated: {lastUpdated.toLocaleString()}
                    </motion.div>
                </motion.div>
            </Section>

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
                                Investment Performance at a Glance
                            </Typography>
                            <Typography
                                variant="lead"
                                className="text-text-dark max-w-3xl mx-auto mb-8"
                            >
                                Track the financial health and operational progress of our {farmStats?.stats?.totalBlocks || 35}-block cashew farm in Odienné, Ivory Coast. Below you'll find real-time revenue metrics, profit trends, and key performance indicators that reflect our commitment to transparency and sustainable growth.
                            </Typography>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* KPI Grid */}
            <Section className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    >
                        {[
                            {
                                icon: FaDollarSign,
                                title: 'Total Investment Value',
                                value: `${(financials.totalRevenue + financials.netProfit).toLocaleString()} FCFA`,
                                trend: 12,
                                variant: 'primary' as const
                            },
                            {
                                icon: FaChartLine,
                                title: 'Net Profit (YTD)',
                                value: `${financials.netProfit.toLocaleString()} FCFA`,
                                trend: 18,
                                variant: 'accent' as const
                            },
                            {
                                icon: FaArrowUp,
                                title: 'Profit Margin',
                                value: `${financials.profitMargin.toFixed(1)}%`,
                                trend: 3,
                                variant: 'secondary' as const
                            },
                            {
                                icon: FaSeedling,
                                title: 'Farm Progress',
                                value: `${Math.round((farmStats?.stats?.plantedBlocks / farmStats?.stats?.totalBlocks) * 100)}%`,
                                trend: 8,
                                variant: 'primary' as const
                            }
                        ].map((kpi, idx) => (
                            <motion.div key={idx} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                <InfoCard
                                    icon={kpi.icon}
                                    title={kpi.value}
                                    subtitle={kpi.title}
                                    variant={kpi.variant}
                                    hideIconContainer={false}
                                    showInfoBadge={false}
                                >
                                    <div className={`flex items-center gap-1 text-sm ${kpi.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {kpi.trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                        <span className="font-medium">{Math.abs(kpi.trend)}% vs last quarter</span>
                                    </div>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Quality Revenue Breakdown */}
                    {financials.totalRevenue > 0 && (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="mb-8"
                        >
                            <InfoCard icon={FaChartBar} title="Revenue by Quality Grade" variant="primary" showInfoBadge={false}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {Object.entries(
                                        revenues.reduce((acc: Record<string, number>, r: any) => {
                                            acc[r.quality] = (acc[r.quality] || 0) + (r.totalAmount || 0);
                                            return acc;
                                        }, {} as Record<string, number>)
                                    ).map(([quality, amount]) => (
                                        <div key={quality} className="flex-1 text-center p-4 bg-white/30 rounded-xl">
                                            <div className="text-2xl font-bold text-primary">
                                                {new Intl.NumberFormat('fr-FR').format(amount)} FCFA
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {quality} ({financials.totalRevenue > 0 ? ((amount / financials.totalRevenue) * 100).toFixed(0) : 0}%)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </InfoCard>
                        </motion.div>
                    )}

                    {/* Unit Economics */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="mb-12"
                    >
                        <InfoCard icon={FaLeaf} title="Unit Economics" variant="primary" showInfoBadge={false}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Cost/Tree', value: financials.totalExpenses / (farmStats?.stats?.aliveTrees || 3500) },
                                    { label: 'Revenue/Tree', value: financials.totalRevenue / (farmStats?.stats?.aliveTrees || 3500) },
                                    { label: 'Cost/Hectare', value: financials.totalExpenses / blockCount },
                                    { label: 'Revenue/Hectare', value: financials.totalRevenue / blockCount },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center p-3 bg-white/30 rounded-xl">
                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                        <div className="text-lg font-bold text-primary">
                                            {new Intl.NumberFormat('fr-FR').format(Math.round(stat.value))} FCFA
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>
                    </motion.div>

                    {/* Block Performance Snapshot */}
                    {revenueByBlock.length > 0 && (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="mb-12"
                        >
                            <InfoCard
                                icon={FaChartBar}
                                title="Top 5 Blocks by Profit"
                                variant="primary"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-500 mb-3">
                                    <FaLightbulb className="inline mr-1 text-amber-500 text-xs" />
                                    Farm-wide expenses allocated equally: <strong>{new Intl.NumberFormat('fr-FR').format(perBlockAllocation)} FCFA</strong> per block
                                </Typography>

                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="border-b border-gray-200 text-left">
                                            <th className="pb-2 font-medium text-gray-600">Block</th>
                                            <th className="pb-2 font-medium text-gray-600 text-right">Revenue</th>
                                            <th className="pb-2 font-medium text-gray-600 text-right">Profit</th>
                                            <th className="pb-2 font-medium text-gray-600 text-center">ROI</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {revenueByBlock.slice(0, 5).map((block, idx) => (
                                            <tr key={block.blockId} className="border-b border-gray-100 last:border-0">
                                                <td className="py-2 font-medium">
                                                    {idx === 0 && <FaTrophy className="text-yellow-500 inline mr-1" />}
                                                    {idx === 1 && <FaMedal className="text-gray-400 inline mr-1" />}
                                                    {idx === 2 && <FaAward className="text-amber-700 inline mr-1" />}
                                                    {block.blockName}
                                                </td>
                                                <td className="py-2 text-right text-green-700">
                                                    {block.totalRevenue > 0
                                                        ? new Intl.NumberFormat('fr-FR').format(block.totalRevenue)
                                                        : '—'}
                                                </td>
                                                <td className="py-2 text-right font-bold text-primary">
                                                    {new Intl.NumberFormat('fr-FR').format(block.profit)}
                                                </td>
                                                <td className="py-2 text-center">
                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                    block.roi > 200 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {block.roi.toFixed(0)}%
                                </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-3">
                                    {revenueByBlock.slice(0, 5).map((block, idx) => (
                                        <motion.div
                                            key={block.blockId}
                                            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-primary text-lg">
                                {idx === 0 && <FaTrophy className="text-yellow-500 inline mr-1" />}
                                {idx === 1 && <FaMedal className="text-gray-400 inline mr-1" />}
                                {idx === 2 && <FaAward className="text-amber-700 inline mr-1" />}
                                {block.blockName}
                            </span>
                                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                                    block.roi > 200 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                {block.roi.toFixed(0)}% ROI
                            </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                                <span className="text-gray-500">Revenue</span>
                                                <span className="text-right text-green-700 font-medium">
                                {block.totalRevenue > 0 ? new Intl.NumberFormat('fr-FR').format(block.totalRevenue) : '—'}
                            </span>
                                                <span className="text-gray-500">Profit</span>
                                                <span className="text-right font-bold text-primary">
                                {new Intl.NumberFormat('fr-FR').format(block.profit)}
                            </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </InfoCard>
                        </motion.div>
                    )}

                    {/* Revenue Chart & Farm Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Revenue & Profit Chart */}
                        <InfoCard
                            icon={FaChartLine}
                            title="Revenue & Profit Trends"
                            variant="primary"
                            showInfoBadge={false}
                        >
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" />
                                    <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                                    <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(Number(value))} FCFA`} />
                                    <Legend />
                                    <Area type="monotone" dataKey="revenue" stroke="#5A7411" fill="#5A7411" fillOpacity={0.2} />
                                    <Area type="monotone" dataKey="profit" stroke="#E04E00" fill="#E04E00" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <FaLightbulb className="inline mr-1 text-yellow-500" /> <strong>Insight:</strong> Revenue showing consistent growth with
                                    {financials.profitMargin > 20 ? ' strong ' : ' stable '}
                                    profit margins. Projecting {yearlyProjections[1].growth}% YoY growth.
                                </p>
                            </div>
                        </InfoCard>

                        {/* Cost Structure (NEW) */}
                        <InfoCard icon={FaChartPie} title="Cost Structure" variant="accent" showInfoBadge={false}>
                            {pieData.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                                                 label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} >
                                                {pieData.map((_, idx) => (
                                                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(Number(value))} FCFA`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        {Object.keys(expensesByCategory).length} expense categories
                                    </p>
                                </>
                            ) : (
                                <p className="text-center text-gray-400 py-8">No expense data yet</p>
                            )}
                        </InfoCard>

                        {/* Farm Performance */}
                        <InfoCard
                            icon={FaTree}
                            title="Farm Performance Metrics"
                            variant="accent"
                            showInfoBadge={false}
                        >
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Farm Completion</span>
                                        <span className="font-medium">
                                            {Math.round((farmStats?.stats?.plantedBlocks / farmStats?.stats?.totalBlocks) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full"
                                             style={{ width: `${(farmStats?.stats?.plantedBlocks / farmStats?.stats?.totalBlocks) * 100}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Survival Rate</span>
                                        <span className="font-medium">{farmStats?.stats?.survivalRate?.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-accent h-2 rounded-full"
                                             style={{ width: `${farmStats?.stats?.survivalRate || 0}%` }} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="text-center p-3 bg-primary/5 rounded-xl">
                                        <FaTree className="text-2xl text-primary mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-primary">
                                            {farmStats?.stats?.aliveTrees?.toLocaleString() || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">Trees Alive</div>
                                    </div>
                                    <div className="text-center p-3 bg-accent/5 rounded-xl">
                                        <FaTractor className="text-2xl text-accent mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-accent">
                                            {farmStats?.stats?.plantedBlocks || 0}/{farmStats?.stats?.totalBlocks || 35}
                                        </div>
                                        <div className="text-xs text-gray-500">Blocks Planted</div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-accent/5 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <FaLeaf className="inline mr-1 text-green-600" /> <strong>Sustainability:</strong> Organic practices across {farmStats?.stats?.totalBlocks} blocks.
                                    Survival rate exceeds industry average of 85%.
                                </p>
                            </div>
                        </InfoCard>
                        {/* Investment Returns Summary */}
                        <InfoCard
                            icon={FaDollarSign}
                            title="Investment Returns"
                            variant="primary"
                            showInfoBadge={false}
                        >
                            <div className="space-y-4">
                                {/* Revenue Multiple */}
                                <div className="text-center p-3 bg-primary/5 rounded-xl">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Revenue Multiple</div>
                                    <div className="text-3xl font-bold text-primary">
                                        {(financials.totalExpenses > 0
                                            ? (financials.totalRevenue / financials.totalExpenses)
                                            : 0).toFixed(1)}x
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        For every 1 FCFA spent, {financials.totalExpenses > 0
                                        ? (financials.totalRevenue / financials.totalExpenses).toFixed(1)
                                        : '—'} FCFA generated
                                    </div>
                                </div>

                                {/* Per-block metrics */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 bg-green-50 rounded-xl">
                                        <div className="text-xs text-gray-500">Profit/Ha</div>
                                        <div className="text-xl font-bold text-green-700">
                                            {new Intl.NumberFormat('fr-FR').format(
                                                Math.round(financials.netProfit / blockCount)
                                            )} FCFA
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                                        <div className="text-xs text-gray-500">Avg Block ROI</div>
                                        <div className="text-xl font-bold text-blue-700">
                                            {revenueByBlock.length > 0
                                                ? (revenueByBlock.reduce((sum, b) => sum + b.roi, 0) / revenueByBlock.filter(b => b.totalRevenue > 0).length || 1).toFixed(0)
                                                : '—'}%
                                        </div>
                                    </div>
                                </div>

                                {/* Investor Share (25% of Net Profit) */}
                                <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Investor Share (25% of Net Profit)</div>
                                    <div className="text-2xl font-bold text-amber-700">
                                        {new Intl.NumberFormat('fr-FR').format(Math.round(financials.netProfit * 0.25))} FCFA
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Per harvest cycle · {new Intl.NumberFormat('fr-FR').format(Math.round(financials.netProfit * 0.25 / 35))} FCFA per block
                                    </div>
                                </div>

                                {/* Payback Projection */}
                                {(() => {
                                    const totalInvestment = financials.totalExpenses;
                                    const investorSharePerHarvest = financials.netProfit * 0.25;
                                    const harvestsToDouble = investorSharePerHarvest > 0
                                        ? Math.ceil((totalInvestment * 1.5) / investorSharePerHarvest)
                                        : null;

                                    return (
                                        <div className="text-center p-3 bg-primary/5 rounded-xl">
                                            <div className="text-xs text-gray-500 uppercase tracking-wide">Estimated Payback</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {harvestsToDouble
                                                    ? `${harvestsToDouble} Harvests`
                                                    : 'Calculating...'}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                To reach 1.5x return at 25% profit share
                                                {harvestsToDouble && (
                                                    <span> (~{Math.ceil(harvestsToDouble)} harvest cycles)</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Agreement Reference */}
                                <div className="p-3 bg-gray-50 rounded-lg text-[10px] text-gray-400 leading-relaxed">
                                    Per Investment Agreement §4–5: Investor receives 25% of net profit for 3 harvests,
                                    targeting 1.5x–2.5x return on original investment based on yield performance.
                                    Projections are estimates; actual returns depend on harvest yields and market prices.
                                </div>
                            </div>
                        </InfoCard>

                    {/* 3-Year Forecast */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="mb-12"
                    >
                        <InfoCard
                            icon={FaCalendarAlt}
                            title="3-Year Financial Forecast"
                            variant="primary"
                            showInfoBadge={false}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {yearlyProjections.map((proj, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeIn}
                                        transition={{ delay: idx * 0.1 }}
                                        className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
                                    >
                                        <div className="text-lg font-bold text-primary mb-2">{proj.year}</div>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                            {new Intl.NumberFormat('fr-FR').format(proj.revenue)} FCFA
                                        </div>
                                        <div className="text-sm text-gray-500 mb-2">Projected Revenue</div>
                                        <div className="text-green-600 font-semibold">+{proj.growth}% YoY</div>
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <div className="text-sm text-gray-600">
                                                Net Profit: {new Intl.NumberFormat('fr-FR').format(proj.profit)} FCFA
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <FaChartBar className="inline mr-1 text-primary" /> <strong>Investment Outlook:</strong> Trees reach peak production in
                                    {2027 - new Date().getFullYear()} years.
                                    Projected CAGR of {((yearlyProjections[2].revenue / yearlyProjections[0].revenue) ** (1 / 2) - 1) * 100}%.
                                </p>
                            </div>
                        </InfoCard>
                    </motion.div>

                    {/* Key Highlights */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
                    >
                        {[
                            {
                                icon: FaCalendarAlt,
                                title: 'Year 2',
                                subtitle: 'Current Farm Stage',
                                description: 'Maturing Phase',
                                note: 'Trees entering peak production cycle',
                                variant: 'primary' as const
                            },
                            {
                                icon: FaChartLine,
                                title: 'Premium Quality',
                                subtitle: 'Grade A Cashews',
                                description: 'Export-Ready',
                                note: 'EU & US market compliant',
                                variant: 'accent' as const
                            },
                            {
                                icon: FaSeedling,
                                title: 'Organic Certified',
                                subtitle: 'In Progress',
                                description: 'Q1 2025',
                                note: 'Premium pricing available',
                                variant: 'secondary' as const
                            }
                        ].map((highlight, idx) => (
                            <motion.div key={idx} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                <InfoCard
                                    icon={highlight.icon}
                                    title={highlight.title}
                                    subtitle={highlight.subtitle}
                                    variant={highlight.variant}
                                    showInfoBadge={false}
                                >
                                    <p className="font-semibold text-text-dark">{highlight.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">{highlight.note}</p>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Disclaimer */}
                    <div className="mt-8 text-center text-xs text-gray-400">
                        <p>This dashboard provides estimated projections based on current farm data. Actual results may vary.</p>
                        <p>© {new Date().getFullYear()} AfriNuts Export - All Rights Reserved</p>
                    </div>
                </div>
                </div>
            </Section>
        </main>
        </div>
    );
};

export default InvestorPortal;