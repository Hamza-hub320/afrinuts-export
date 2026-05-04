import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Typography } from '@/components/Typography/Typography';
import {
    FaTractor,
    FaChartLine,
    FaUsers,
    FaTree,
    FaSignOutAlt,
    FaDollarSign,
    FaTasks,
    FaCalendarAlt,
    FaMap, FaChartPie,
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
    ResponsiveContainer
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
        acc[block.status] = (acc[block.status] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.entries(blockStatusCount).map(([name, value]) => ({ name, value }));

    const monthlyData = [
        { month: 'Jan', revenue: 1250000, expenses: 850000 },
        { month: 'Feb', revenue: 1870000, expenses: 920000 },
        { month: 'Mar', revenue: 2100000, expenses: 1100000 },
        { month: 'Apr', revenue: 1950000, expenses: 1050000 },
        { month: 'May', revenue: 2300000, expenses: 1180000 },
        { month: 'Jun', revenue: 2750000, expenses: 1250000 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
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
        <div className="min-h-screen relative overflow-hidden">

            {/* Hero Header */}
            <Section
                fullHeight={false}
                className="flex items-center justify-center text-center min-h-[60vh] bg-gradient-to-b from-primary/10 to-transparent relative"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
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
                            Data-driven insights from our 35-hectare cashew farm in Odienné, Ivory Coast.
                        </Typography>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex items-center justify-center gap-4 mt-6">
                        <div className="px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-sm text-primary border border-primary/20">
                            Role: {user?.role}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all text-text-dark shadow-sm"
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </motion.div>
                </motion.div>
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
                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                        <InfoCard
                            icon={FaTree}
                            title={String(farmData?.stats?.aliveTrees || 0)}
                            subtitle="Total Trees Alive"
                            iconColor="text-primary"
                            showInfoBadge={false}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <InfoCard
                            icon={FaTractor}
                            title={`${farmData?.stats?.plantedBlocks || 0}/${farmData?.stats?.totalBlocks || 35}`}
                            subtitle="Planted Blocks"
                            iconColor="text-accent"
                            showInfoBadge={false}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <InfoCard
                            icon={FaDollarSign}
                            title={`${new Intl.NumberFormat('fr-FR').format(totalRevenue)} FCFA`}
                            subtitle="Total Revenue"
                            iconColor="text-green-600"
                            showInfoBadge={false}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <InfoCard
                            icon={FaTasks}
                            title={String(pendingTasks.length + inProgressTasks.length)}
                            subtitle={`Active Tasks${overdueTasks.length > 0 ? ` • ${overdueTasks.length} overdue` : ''}`}
                            iconColor="text-primary"
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

                {/* Dashboard Navigation Bar */}
                <div className="group relative overflow-hidden rounded-2xl p-2 mb-8 transition-all duration-500"
                     style={{
                         background: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.65) 100%)',
                         border: '1px solid rgba(255,255,255,0.5)',
                         boxShadow: '0 8px 32px rgba(165, 105, 66, 0.12), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.05)',
                         transformStyle: 'preserve-3d',
                         perspective: '1000px',
                     }}
                >
                    {/* 3D edge effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-500" />

                    {/* Animated blobs */}
                    <div
                        className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-10 blur-2xl animate-pulse"
                        style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-8 blur-2xl"
                        style={{
                            background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)',
                            animation: 'float 6s ease-in-out infinite'
                        }}
                    />

                    {/* Inner glow overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-wrap items-center gap-1">
                        {/* Block Map */}
                        <motion.button
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/dashboard/blocks')}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(255,255,255,0.4)',
                            }}
                        >
                            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                                 style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }}>
                                <FaMap className="text-primary" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-gray-800">Block Map</span>
                                <span className="text-xs text-gray-400">Farm grid</span>
                            </div>
                        </motion.button>

                        {/* Separator */}
                        <div className="w-px h-8 bg-white/50 mx-1 hidden sm:block" />

                        {/* Tasks */}
                        <motion.button
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/dashboard/tasks')}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(255,255,255,0.4)',
                            }}
                        >
                            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                                 style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }}>
                                <FaTasks className="text-accent" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-gray-800">Tasks</span>
                                <span className="text-xs text-gray-400">Operations</span>
                            </div>
                        </motion.button>

                        {/* Separator */}
                        <div className="w-px h-8 bg-white/50 mx-1 hidden sm:block" />

                        {/* Financials */}
                        <motion.button
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/dashboard/financials')}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                            style={{
                                background: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(255,255,255,0.4)',
                            }}
                        >
                            <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                                 style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }}>
                                <FaChartLine className="text-secondary" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-gray-800">Financials</span>
                                <span className="text-xs text-gray-400">Reports</span>
                            </div>
                        </motion.button>

                        {/* Separator */}
                        <div className="w-px h-8 bg-white/50 mx-1 hidden sm:block" />

                        {/* Investor Portal */}
                        <motion.button
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/investor')}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ml-auto"
                            style={{
                                background: 'rgba(255,255,255,0.5)',
                                border: '1px solid rgba(255,255,255,0.4)',
                            }}
                        >
                            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                                 style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)' }}>
                                <FaDollarSign className="text-primary" />
                            </div>
                            <div className="text-left">
                                <span className="block font-semibold text-gray-800">Investor Portal</span>
                                <span className="text-xs text-gray-400">View-only</span>
                            </div>
                        </motion.button>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Revenue vs Expenses */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <InfoCard
                            icon={() => <FaChartLine className="text-primary text-xl" />}
                            title="Revenue vs Expenses"
                            iconColor="text-primary"
                            className="h-full"
                            showInfoBadge={false}
                        >
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(Number(value))} FCFA`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#5A7411" strokeWidth={2} />
                                    <Line type="monotone" dataKey="expenses" stroke="#E04E00" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </InfoCard>
                    </motion.div>

                    {/* Block Status Pie */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <InfoCard
                            icon={() => <FaChartPie className="text-primary text-xl" />}
                            title="Block Status Distribution"
                            iconColor="text-primary"
                            className="h-full"
                            showInfoBadge={false}
                        >
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </InfoCard>
                    </motion.div>
                </div>

                {/* Recent Tasks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <InfoCard
                        icon={() => <FaTasks className="text-primary text-xl" />}
                        title="Recent Tasks"
                        iconColor="text-primary"
                        className="h-full"
                        showInfoBadge={false}
                    >
                        {tasks.slice(0, 5).map((task) => (
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
                    </InfoCard>
                </motion.div>

                {/* Financial Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 transition-all duration-500 rounded-2xl shadow-xl p-6 sm:p-8 transform-gpu"
                    style={{
                        transformStyle: 'preserve-3d',
                        perspective: '1000px',
                    }}
                    whileHover={{
                        y: -5,
                        scale: 1.01,
                        boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
                        transition: { duration: 0.3 }
                    }}
                >
                    {/* 3D edge effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/30 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                    {/* Glassy overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

                    {/* Inner shadow effect */}
                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.05)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                    <div className="relative z-10">
                        <Typography variant="h3" className="mb-4 text-primary">Financial Summary</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Total Revenue', value: totalRevenue, color: 'text-green-600' },
                                { label: 'Total Expenses', value: totalExpenses, color: 'text-red-600' },
                                { label: 'Net Profit', value: netProfit, color: netProfit >= 0 ? 'text-green-600' : 'text-red-600' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="text-center p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                                    style={{
                                        background: 'rgba(255,255,255,0.5)',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.04)'
                                    }}
                                >
                                    <p className="text-sm text-gray-500">{item.label}</p>
                                    <p className={`text-2xl font-bold ${item.color}`}>
                                        {new Intl.NumberFormat('fr-FR').format(item.value)} FCFA
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;