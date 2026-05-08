import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaDollarSign, FaChartLine, FaChartBar, FaChartPie, FaTable, FaBorderAll, FaMapMarkerAlt, FaTrophy, FaMedal, FaAward } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Section from '@/components/Section/Section';
import { useNavigate } from 'react-router-dom';

const isDevelopment = import.meta.env.DEV;
const COLORS = ['#5A7411', '#E04E00', '#A0C800', '#253746', '#698714'];

// Add block name mapping
const BLOCK_NAMES: { [key: number]: string } = {
    1: 'A1', 2: 'A2', 3: 'A3', 4: 'A4', 5: 'A5', 6: 'A6', 7: 'A7',
    8: 'B1', 9: 'B2', 10: 'B3', 11: 'B4', 12: 'B5', 13: 'B6', 14: 'B7',
    15: 'C1', 16: 'C2', 17: 'C3', 18: 'C4', 19: 'C5', 20: 'C6', 21: 'C7',
    22: 'D1', 23: 'D2', 24: 'D3', 25: 'D4', 26: 'D5', 27: 'D6', 28: 'D7',
    29: 'E1', 30: 'E2', 31: 'E3', 32: 'E4', 33: 'E5', 34: 'E6', 35: 'E7',
};

interface RevenueByBlock {
    blockId: number;
    blockName: string;
    totalRevenue: number;
    directExpenses: number;
    allocatedExpenses: number;
    totalExpenses: number;
    profit: number;
    roi: number;
    transactionCount: number;
    quality: string;
}

interface RevenueTransaction {
    id: number;
    blockId: number;
    totalAmount: number;
    harvestDate: number;
    quality: string;
    quantityKg: number;
    pricePerKg: number;
    buyer?: string;
}

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <motion.div
        className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        whileHover={{
            y: -5,
            scale: 1.01,
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
            transition: { duration: 0.3 }
        }}
    >
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
        <div className="relative z-10 p-6">{children}</div>
    </motion.div>
);

const Financials: React.FC = () => {
    const [revenues, setRevenues] = useState<RevenueTransaction[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [revenueByBlock, setRevenueByBlock] = useState<RevenueByBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [revenuePage, setRevenuePage] = useState(1);
    const [expensePage, setExpensePage] = useState(1);
    const [viewMode, setViewMode] = useState<'transactions' | 'blocks'>('transactions');
    const ITEMS_PER_PAGE = 5;
    const [perBlockAllocation, setPerBlockAllocation] = useState<number>(0);

    useEffect(() => {
            const fetchFinancials = async () => {
                try {
                    let revenueData, expenseData;
                    if (isDevelopment) {
                        revenueData = await getMockData('getRevenueSummary');
                        expenseData = await getMockData('getExpenseSummary');
                    } else {
                        revenueData = await callApi('farmData', { action: 'getRevenueSummary', farmId: '1' });
                        expenseData = await callApi('farmData', { action: 'getExpenseSummary', farmId: '1' });
                    }

                    const revenuesList = revenueData.revenues || [];
                    const expensesList = expenseData.expenses || [];
                    setRevenues(revenuesList);
                    setExpenses(expensesList);

                    // Calculate revenue AND expenses by block
                    const blockCount = Object.keys(BLOCK_NAMES).length;
                    const blockMap = new Map<number, any>();

// Initialize all 35 blocks even if no revenue yet
                    Object.keys(BLOCK_NAMES).forEach(key => {
                        const id = parseInt(key);
                        blockMap.set(id, {
                            blockId: id,
                            blockName: BLOCK_NAMES[id],
                            totalRevenue: 0,
                            directExpenses: 0,
                            allocatedExpenses: 0,
                            totalExpenses: 0,
                            transactionCount: 0,
                            quality: 'N/A',
                        });
                    });

// Process revenues
                    revenuesList.forEach((revenue: any) => {
                        if (revenue.blockId && blockMap.has(revenue.blockId)) {
                            const block = blockMap.get(revenue.blockId);
                            block.totalRevenue += revenue.totalAmount || 0;
                            block.transactionCount++;
                            if (revenue.quality) block.quality = revenue.quality;
                        }
                    });

// Process expenses: separate direct vs farm-wide
                    let totalFarmWideExpenses = 0;
                    expensesList.forEach((expense: any) => {
                        if (expense.blockId && blockMap.has(expense.blockId)) {
                            blockMap.get(expense.blockId).directExpenses += expense.amount || 0;
                        } else {
                            totalFarmWideExpenses += expense.amount || 0;
                        }
                    });

// Allocate farm-wide expenses equally
                    const perBlockAllocation = totalFarmWideExpenses / blockCount;
                    blockMap.forEach((block) => {
                        block.allocatedExpenses = perBlockAllocation;
                        block.totalExpenses = block.directExpenses + block.allocatedExpenses;
                        block.profit = block.totalRevenue - block.totalExpenses;
                        block.roi = block.totalExpenses > 0
                            ? ((block.totalRevenue - block.totalExpenses) / block.totalExpenses * 100)
                            : (block.totalRevenue > 0 ? 100 : 0);
                    });

// Convert to array and sort by profit
                    const blockRevenueArray = Array.from(blockMap.values())
                        .sort((a, b) => b.profit - a.profit);

                    setRevenueByBlock(blockRevenueArray);
                    setPerBlockAllocation(perBlockAllocation);

                } catch (error) {
                    console.error('Error fetching financials:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchFinancials();
        }, []);

    const totalRevenue = revenues.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const expensesByCategory = expenses.reduce((acc: any, e: any) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
    }, {});
    const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

    // Revenue by block chart data
    const blockChartData = revenueByBlock.slice(0, 10).map(block => ({
        name: block.blockName,
        revenue: block.totalRevenue,
        transactions: block.transactionCount,
    }));

    // Top 5 performing blocks
    const topBlocks = revenueByBlock.slice(0, 5);

    if (loading) {
        return (
            <div className="min-h-screen pt-[72px]">
                <DashboardNavbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

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
                            <FaChartPie className="inline mr-3 text-accent" />
                            Financial Reports
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Financial Dashboard
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                            Revenue, expenses, and profit insights from our 35-hectare cashew farm.
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Summary Overview Section */}
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
                            <Typography variant="h2" className="mb-4 text-primary">
                                Financial Performance at a Glance
                            </Typography>
                            <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto mb-8">
                                Below you'll find a complete breakdown of revenue streams, expense categories, and net profitability across our 35-hectare Odienné farm. Use the charts to identify trends and the tables to drill into individual transactions.
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

            <div className="dashboard-content container mx-auto px-4 py-8 relative z-10">
                {/* KPI Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <GlassCard>
                        <motion.div variants={fadeIn} className="text-center">
                            <motion.div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4" whileHover={{ scale: 1.1, rotate: 5 }}>
                                <FaDollarSign className="text-3xl text-green-600" />
                            </motion.div>
                            <div className="text-2xl font-bold text-green-600">
                                {new Intl.NumberFormat('fr-FR').format(totalRevenue)} FCFA
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Total Revenue</div>
                        </motion.div>
                    </GlassCard>

                    <GlassCard>
                        <motion.div variants={fadeIn} className="text-center">
                            <motion.div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4" whileHover={{ scale: 1.1, rotate: 5 }}>
                                <FaDollarSign className="text-3xl text-red-600" />
                            </motion.div>
                            <div className="text-2xl font-bold text-red-600">
                                {new Intl.NumberFormat('fr-FR').format(totalExpenses)} FCFA
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Total Expenses</div>
                        </motion.div>
                    </GlassCard>

                    <GlassCard>
                        <motion.div variants={fadeIn} className="text-center">
                            <motion.div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4" whileHover={{ scale: 1.1, rotate: 5 }}>
                                <FaChartLine className="text-3xl text-primary" />
                            </motion.div>
                            <div className="text-2xl font-bold text-primary">
                                {new Intl.NumberFormat('fr-FR').format(netProfit)} FCFA
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                Net Profit ({profitMargin.toFixed(1)}% margin)
                            </div>
                        </motion.div>
                    </GlassCard>
                </motion.div>

                {/* Revenue by Block Section */}
                {revenueByBlock.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-8"
                    >
                        <GlassCard>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-accent text-xl" />
                                    <Typography variant="h4" className="text-primary">Revenue by Block</Typography>
                                </div>
                                <div className="text-sm text-gray-500 bg-white/30 px-3 py-1 rounded-full">
                                    {revenueByBlock.length} blocks have generated revenue
                                </div>
                            </div>

                            {/* Bar Chart for Block Revenue */}
                            <div className="mb-8">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={blockChartData} layout="vertical" margin={{ left: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                                        <YAxis type="category" dataKey="name" stroke="#6b7280" width={50} />
                                        <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(Number(value))} FCFA`} />
                                        <Bar dataKey="revenue" fill="#5A7411" radius={[0, 6, 6, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Top Performing Blocks Grid */}
                            <div>
                                <Typography variant="h5" className="text-primary mb-4">
                                    <FaTrophy className="inline mr-2 text-yellow-500" />
                                    Top Performing Blocks
                                </Typography>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                    {topBlocks.map((block, idx) => (
                                        <motion.div
                                            key={block.blockId}
                                            className="bg-white/30 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/40 transition-all"
                                            whileHover={{ y: -2, scale: 1.02 }}
                                        >
                                            <div className="text-lg font-bold text-primary">{block.blockName}</div>
                                            <div className="text-sm font-semibold text-gray-800 mt-1">
                                                {new Intl.NumberFormat('fr-FR').format(block.totalRevenue)} FCFA
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {block.transactionCount} transaction{block.transactionCount !== 1 ? 's' : ''}
                                            </div>
                                            <div className="mt-2">
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                                    {block.quality}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {/* Charts - Revenue by Quality & Expenses by Category */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <GlassCard>
                        <motion.div variants={fadeIn}>
                            <div className="flex items-center gap-2 mb-4">
                                <FaChartBar className="text-primary text-xl" />
                                <Typography variant="h4" className="text-primary">Revenue by Quality</Typography>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenues}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="quality" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(Number(value))} FCFA`} />
                                    <Bar dataKey="totalAmount" fill="#5A7411" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </GlassCard>

                    <GlassCard>
                        <motion.div variants={fadeIn}>
                            <div className="flex items-center gap-2 mb-4">
                                <FaChartPie className="text-primary text-xl" />
                                <Typography variant="h4" className="text-primary">Expenses by Category</Typography>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%" cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </GlassCard>
                </motion.div>

                {/* View Toggle for Revenue Tables */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={() => setViewMode('transactions')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                            viewMode === 'transactions'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white/30 text-gray-600 hover:bg-white/50'
                        }`}
                    >
                        <FaTable className="inline mr-2" />
                        Transaction View
                    </button>
                    <button
                        onClick={() => setViewMode('blocks')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                            viewMode === 'blocks'
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white/30 text-gray-600 hover:bg-white/50'
                        }`}
                    >
                        <FaBorderAll className="inline mr-2" />
                        Block Summary
                    </button>
                </div>

                {/* Revenue Table - Transaction View */}
                {viewMode === 'transactions' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <GlassCard className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <FaTable className="text-primary text-xl" />
                                <Typography variant="h4" className="text-primary">Revenue History (Transaction View)</Typography>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-200 text-left">
                                        <th className="pb-3 font-medium text-gray-600">Date</th>
                                        <th className="pb-3 font-medium text-gray-600">Block</th>
                                        <th className="pb-3 font-medium text-gray-600">Quality</th>
                                        <th className="pb-3 font-medium text-gray-600 text-right">Amount (FCFA)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {revenues.slice(0, revenuePage * ITEMS_PER_PAGE).map((revenue: any, i: number) => (
                                        <motion.tr
                                            key={revenue.id}
                                            className="border-b border-gray-100 last:border-0 hover:bg-white/30 transition-colors"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <td className="py-3">{new Date(revenue.harvestDate).toLocaleDateString()}</td>
                                            <td className="py-3">
                                                {revenue.blockId ? BLOCK_NAMES[revenue.blockId] || `Block ${revenue.blockId}` : 'Processing Center'}
                                            </td>
                                            <td className="py-3">
                                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{revenue.quality}</span>
                                            </td>
                                            <td className="py-3 text-right font-medium">
                                                {new Intl.NumberFormat('fr-FR').format(revenue.totalAmount)}
                                            </td>
                                        </motion.tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            {revenues.length > revenuePage * ITEMS_PER_PAGE && (
                                <div className="flex justify-center mt-4">
                                    <motion.button
                                        onClick={() => setRevenuePage(p => p + 1)}
                                        className="px-6 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                                        whileHover={{ y: -2, scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Load More ({revenues.length - revenuePage * ITEMS_PER_PAGE} remaining)
                                    </motion.button>
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                )}

                {/* Revenue Table - Block Summary View */}
                {viewMode === 'blocks' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        {/* ROI Insights */}
                        <GlassCard className="mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FaChartLine className="text-accent text-xl" />
                                <Typography variant="h5" className="text-primary">Block Performance Insights</Typography>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <motion.div
                                    className="relative overflow-hidden rounded-xl p-4 text-center border transition-all duration-300 hover:shadow-md"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.03) 100%)',
                                        borderColor: 'rgba(34,197,94,0.3)'
                                    }}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                >
                                    <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20 blur-2xl"
                                         style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.5) 0%, transparent 70%)' }}
                                    />
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Highest Profit</div>
                                    <div className="text-lg font-bold text-green-700">
                                        {revenueByBlock.length > 0 ? revenueByBlock[0].blockName : '—'}
                                    </div>
                                    <div className="text-sm text-green-600 font-medium">
                                        {revenueByBlock.length > 0
                                            ? new Intl.NumberFormat('fr-FR').format(revenueByBlock[0].profit) + ' FCFA'
                                            : '—'}
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="relative overflow-hidden rounded-xl p-4 text-center border transition-all duration-300 hover:shadow-md"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 100%)',
                                        borderColor: 'rgba(59,130,246,0.3)'
                                    }}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                >
                                    <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20 blur-2xl"
                                         style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)' }}
                                    />
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Best ROI</div>
                                    <div className="text-lg font-bold text-blue-700">
                                        {revenueByBlock.length > 0
                                            ? [...revenueByBlock].sort((a, b) => b.roi - a.roi)[0].blockName
                                            : '—'}
                                    </div>
                                    <div className="text-sm text-blue-600 font-medium">
                                        {revenueByBlock.length > 0
                                            ? [...revenueByBlock].sort((a, b) => b.roi - a.roi)[0].roi.toFixed(0) + '%'
                                            : '—'}
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="relative overflow-hidden rounded-xl p-4 text-center border transition-all duration-300 hover:shadow-md"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.03) 100%)',
                                        borderColor: 'rgba(245,158,11,0.3)'
                                    }}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                >
                                    <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20 blur-2xl"
                                         style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)' }}
                                    />
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Needs Attention</div>
                                    <div className="text-sm text-amber-600 font-medium">
                                        {revenueByBlock[revenueByBlock.length - 1]?.profit < 0
                                            ? 'Negative profit'
                                            : 'Lowest profit block'}
                                    </div>
                                </motion.div>
                            </div>
                        </GlassCard>
                        <GlassCard className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <FaBorderAll className="text-primary text-xl" />
                                <Typography variant="h4" className="text-primary">Block Profit & Loss</Typography>
                                <Typography variant="small" className="text-gray-500">
                                    Farm-wide expenses allocated equally: <strong>{new Intl.NumberFormat('fr-FR').format(perBlockAllocation)} FCFA</strong> per block
                                </Typography>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-200 text-left">
                                        <th className="pb-3 font-medium text-gray-600">Rank</th>
                                        <th className="pb-3 font-medium text-gray-600">Block</th>
                                        <th className="pb-3 font-medium text-gray-600 text-right">Revenue</th>
                                        <th className="pb-3 font-medium text-gray-600 text-right">Direct Exp.</th>
                                        <th className="pb-3 font-medium text-gray-600 text-right">Allocated</th>
                                        <th className="pb-3 font-medium text-gray-600 text-right">Profit</th>
                                        <th className="pb-3 font-medium text-gray-600 text-center">ROI</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {revenueByBlock.map((block, idx) => (
                                        <motion.tr
                                            key={block.blockId}
                                            className="border-b border-gray-100 last:border-0 hover:bg-white/30 transition-colors"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                        >
                                            <td className="py-3 font-medium">
                                                {idx === 0 && <FaTrophy className="text-yellow-500" />}
                                                {idx === 1 && <FaMedal className="text-gray-400" />}
                                                {idx === 2 && <FaAward className="text-amber-700" />}
                                                {idx > 2 && `${idx + 1}`}
                                            </td>
                                            <td className="py-3 font-medium">{block.blockName}</td>
                                            <td className="py-3 text-right text-green-700">
                                                {block.totalRevenue > 0
                                                    ? new Intl.NumberFormat('fr-FR').format(block.totalRevenue)
                                                    : '—'}
                                            </td>
                                            <td className="py-3 text-right text-red-600">
                                                {block.directExpenses > 0
                                                    ? new Intl.NumberFormat('fr-FR').format(block.directExpenses)
                                                    : '—'}
                                            </td>
                                            <td className="py-3 text-right">
                <span className="text-amber-600">
                    {new Intl.NumberFormat('fr-FR').format(block.allocatedExpenses)}
                </span>
                                                <span className="block text-[10px] text-gray-400 leading-tight">farm-wide</span>
                                            </td>
                                            <td className="py-3 text-right font-bold">
                <span className={block.profit >= 0 ? 'text-primary' : 'text-red-600'}>
                    {new Intl.NumberFormat('fr-FR').format(block.profit)}
                </span>
                                            </td>
                                            <td className="py-3 text-center">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    block.roi > 200 ? 'bg-green-100 text-green-700' :
                        block.roi > 100 ? 'bg-blue-100 text-blue-700' :
                            block.roi > 0 ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                }`}>
                    {block.roi.toFixed(0)}%
                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            {revenueByBlock.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    No block revenue data available yet.
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                )}

                {/* Expenses Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <GlassCard>
                        <div className="flex items-center gap-2 mb-4">
                            <FaTable className="text-primary text-xl" />
                            <Typography variant="h4" className="text-primary">Expense History</Typography>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="pb-3 font-medium text-gray-600">Date</th>
                                    <th className="pb-3 font-medium text-gray-600">Category</th>
                                    <th className="pb-3 font-medium text-gray-600 text-right">Amount (FCFA)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {expenses.slice(0, expensePage * ITEMS_PER_PAGE).map((expense: any, i: number) => (
                                    <motion.tr
                                        key={expense.id}
                                        className="border-b border-gray-100 last:border-0 hover:bg-white/30 transition-colors"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <td className="py-3">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="py-3">
                                            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">{expense.category}</span>
                                        </td>
                                        <td className="py-3 text-right font-medium">
                                            {new Intl.NumberFormat('fr-FR').format(expense.amount)}
                                        </td>
                                    </motion.tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        {expenses.length > expensePage * ITEMS_PER_PAGE && (
                            <div className="flex justify-center mt-4">
                                <motion.button
                                    onClick={() => setExpensePage(p => p + 1)}
                                    className="px-6 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Load More ({expenses.length - expensePage * ITEMS_PER_PAGE} remaining)
                                </motion.button>
                            </div>
                        )}
                    </GlassCard>
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
                                y: -8, scale: 1.02, rotateY: 3,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <motion.div variants={fadeIn}>
                                    <Typography variant="h2" className="mb-6 text-primary">
                                        Turn Insights Into Action
                                    </Typography>
                                    <Typography variant="body" className="mb-8 text-gray-700 max-w-3xl mx-auto">
                                        Numbers tell the story — now write the next chapter. Dive back into operations, assign tasks, or review key metrics in the farm dashboard.
                                    </Typography>
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
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default Financials;