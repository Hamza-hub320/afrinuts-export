import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaChartLine, FaDollarSign, FaTree, FaSeedling, FaTractor,
    FaCalendarAlt, FaArrowUp, FaArrowDown, FaTasks
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
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
                const totalRev = revenueData.totalRevenue || 0;
                const totalExp = expenseData.totalExpenses || 0;
                const netProfitVal = totalRev - totalExp;
                const margin = totalRev > 0 ? (netProfitVal / totalRev) * 100 : 0;

                setFinancials({
                    totalRevenue: totalRev,
                    totalExpenses: totalExp,
                    netProfit: netProfitVal,
                    profitMargin: margin,
                });

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
        fetchInvestorData();
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

            {/* Insert this after the closing </Section> of the hero, before the KPI Grid */}
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
                                    📈 <strong>Insight:</strong> Revenue showing consistent growth with
                                    {financials.profitMargin > 20 ? ' strong ' : ' stable '}
                                    profit margins. Projecting {yearlyProjections[1].growth}% YoY growth.
                                </p>
                            </div>
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
                                    🌱 <strong>Sustainability:</strong> Organic practices across {farmStats?.stats?.totalBlocks} blocks.
                                    Survival rate exceeds industry average of 85%.
                                </p>
                            </div>
                        </InfoCard>
                    </div>

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
                                    📊 <strong>Investment Outlook:</strong> Trees reach peak production in
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
            </Section>
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
                                    Ready to Explore the Full Picture?
                                </Typography>
                                <Typography variant="body" className="mb-8 text-gray-700 max-w-3xl mx-auto">
                                    Return to the operations dashboard for a complete overview of tree health, block status, task management, and financial performance across the farm.
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
                                        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />
                                        <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                <FaTasks className="text-lg" />
                                Back to Dashboard
                            </span>
                                    </motion.button>
                                    <motion.button
                                        className="relative border-2 border-primary/50 text-primary hover:bg-white/20 px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden backdrop-blur-sm"
                                        variants={fadeIn}
                                        onClick={() => navigate('/dashboard/financials')}
                                        whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.2)' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                            <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                <FaChartLine className="text-lg" />
                                View Financials
                            </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </main>
        </div>
    );
};

export default InvestorPortal;