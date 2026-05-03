import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    FaMap,
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
        <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #DEDAD4 50%, #F5F5F5 100%)' }}>
            {/* Animated background blobs */}
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
                 style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }}
            />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-8 blur-3xl"
                 style={{
                     background: 'radial-gradient(circle, rgba(210,125,45,0.3) 0%, transparent 70%)',
                     animation: 'float 8s ease-in-out infinite'
                 }}
            />

            {/* Header - Frosted Glass */}
            <div className="sticky top-0 z-10">
                <div className="backdrop-blur-lg bg-white/70 border-b border-white/40 shadow-sm">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <Typography variant="h2" className="text-primary mb-2">
                                    Farm Operations Center
                                </Typography>
                                <Typography variant="body" className="text-text-dark/70">
                                    Welcome back, {user?.name || user?.email}
                                </Typography>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 bg-primary/10 backdrop-blur-sm rounded-full text-sm text-primary border border-primary/20">
                                    Role: {user?.role}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all text-text-dark shadow-sm"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                    {[
                        { icon: FaTree, value: farmData?.stats?.aliveTrees || 0, label: 'Total Trees Alive', delay: 0, color: 'text-primary' },
                        { icon: FaTractor, value: `${farmData?.stats?.plantedBlocks || 0}/${farmData?.stats?.totalBlocks || 35}`, label: 'Planted Blocks', delay: 0.1, color: 'text-accent' },
                        { icon: FaDollarSign, value: `${new Intl.NumberFormat('fr-FR').format(totalRevenue)} FCFA`, label: 'Total Revenue', delay: 0.2, color: 'text-green-600' },
                        { icon: FaTasks, value: pendingTasks.length + inProgressTasks.length, label: 'Active Tasks', delay: 0.3, color: 'text-primary', sub: overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : null },
                        { icon: FaChartLine, value: `${profitMargin.toFixed(1)}%`, label: 'Profit Margin', delay: 0.4, color: 'text-accent' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: item.delay }}
                            className={glassCard}
                            style={{
                                boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.04)'
                            }}
                            whileHover={glassCardHover}
                        >
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/60 rounded-full blur-md" />
                            <item.icon className={`text-3xl ${item.color} mb-4 relative z-10`} />
                            <h3 className="text-2xl font-bold text-gray-900 relative z-10">{item.value}</h3>
                            <p className="text-gray-500 relative z-10">{item.label}</p>
                            {item.sub && <p className="text-xs text-red-500 mt-1 relative z-10">{item.sub}</p>}
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Block Map Card */}
                    <motion.button
                        whileHover={{ y: -8, scale: 1.02, rotateY: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/dashboard/blocks')}
                        className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-xl p-6 text-left overflow-hidden transform-gpu"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                        {/* Decorative blob */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-15 blur-3xl group-hover:scale-150 transition-transform duration-500 animate-pulse"
                             style={{ background: 'radial-gradient(circle, rgba(90,116,17,0.4) 0%, transparent 70%)' }}
                        />

                        <div className="relative z-10">
                            <motion.div
                                className="w-12 h-12 bg-primary/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors shadow-md"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <FaMap className="text-2xl text-primary" />
                            </motion.div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Block Map</h3>
                            <p className="text-sm text-gray-500">View 5x7 grid layout of your farm blocks</p>
                            <div className="mt-3 flex items-center text-primary text-sm font-medium">
                                Explore <FaMap className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.button>

                    {/* Tasks Card */}
                    <motion.button
                        whileHover={{ y: -8, scale: 1.02, rotateY: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/dashboard/tasks')}
                        className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-xl p-6 text-left overflow-hidden transform-gpu"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                        {/* Decorative blob */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-15 blur-3xl group-hover:scale-150 transition-transform duration-500 animate-pulse"
                             style={{ background: 'radial-gradient(circle, rgba(224,78,0,0.4) 0%, transparent 70%)' }}
                        />

                        <div className="relative z-10">
                            <motion.div
                                className="w-12 h-12 bg-accent/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors shadow-md"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <FaTasks className="text-2xl text-accent" />
                            </motion.div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Tasks</h3>
                            <p className="text-sm text-gray-500">Manage and track farm operations</p>
                            <div className="mt-3 flex items-center text-accent text-sm font-medium">
                                View Tasks <FaTasks className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.button>

                    {/* Financials Card */}
                    <motion.button
                        whileHover={{ y: -8, scale: 1.02, rotateY: 2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/dashboard/financials')}
                        className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-xl p-6 text-left overflow-hidden transform-gpu"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                        {/* Decorative blob */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-15 blur-3xl group-hover:scale-150 transition-transform duration-500 animate-pulse"
                             style={{ background: 'radial-gradient(circle, rgba(160,200,0,0.4) 0%, transparent 70%)' }}
                        />

                        <div className="relative z-10">
                            <motion.div
                                className="w-12 h-12 bg-secondary/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors shadow-md"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <FaChartLine className="text-2xl text-secondary" />
                            </motion.div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Financials</h3>
                            <p className="text-sm text-gray-500">Track revenue, expenses, and profits</p>
                            <div className="mt-3 flex items-center text-secondary text-sm font-medium">
                                View Reports <FaChartLine className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.button>
                </div>

                {/* Investor Portal Card */}
                <motion.button
                    whileHover={{ y: -8, scale: 1.02, rotateY: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/investor')}
                    className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 rounded-2xl shadow-xl p-6 text-left overflow-hidden transform-gpu"
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                >
                    {/* 3D edge effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                    {/* Glassy overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                    {/* Inner shadow effect */}
                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                    {/* Decorative blob */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-15 blur-3xl group-hover:scale-150 transition-transform duration-500 animate-pulse"
                         style={{ background: 'radial-gradient(circle, rgba(90,116,17,0.4) 0%, transparent 70%)' }}
                    />

                    <div className="relative z-10">
                        <motion.div
                            className="w-12 h-12 bg-primary/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors shadow-md"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <FaChartLine className="text-2xl text-primary" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Investor Portal</h3>
                        <p className="text-sm text-gray-500">View-only investor summary & projections</p>
                        <div className="mt-3 flex items-center text-primary text-sm font-medium">
                            Explore <FaChartLine className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </motion.button>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Revenue vs Expenses */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={glassCard}
                        style={{
                            boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)'
                        }}
                        whileHover={glassCardHover}
                    >
                        <Typography variant="h4" className="mb-4 text-primary">Revenue vs Expenses</Typography>
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
                    </motion.div>

                    {/* Block Status Pie */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={glassCard}
                        style={{
                            boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)'
                        }}
                        whileHover={glassCardHover}
                    >
                        <Typography variant="h4" className="mb-4 text-primary">Block Status Distribution</Typography>
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
                    </motion.div>
                </div>

                {/* Recent Tasks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={glassCard + " mb-8"}
                    style={{
                        boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)'
                    }}
                    whileHover={glassCardHover}
                >
                    <Typography variant="h4" className="mb-4 text-primary">Recent Tasks</Typography>
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
                </motion.div>

                {/* Financial Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={glassCard}
                    style={{
                        background: 'linear-gradient(135deg, rgba(90,116,17,0.06) 0%, rgba(224,78,0,0.04) 100%)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)'
                    }}
                    whileHover={glassCardHover}
                >
                    <Typography variant="h4" className="mb-4 text-primary">Financial Summary</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Total Revenue', value: totalRevenue, color: 'text-green-600' },
                            { label: 'Total Expenses', value: totalExpenses, color: 'text-red-600' },
                            { label: 'Net Profit', value: netProfit, color: netProfit >= 0 ? 'text-green-600' : 'text-red-600' },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30">
                                <p className="text-sm text-gray-500">{item.label}</p>
                                <p className={`text-2xl font-bold ${item.color}`}>
                                    {new Intl.NumberFormat('fr-FR').format(item.value)} FCFA
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;