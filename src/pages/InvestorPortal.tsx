import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaChartLine, FaDollarSign, FaTree, FaSeedling, FaTractor,
    FaCalendarAlt, FaArrowUp, FaArrowDown, FaLightbulb, FaLeaf,
    FaChartBar, FaChartPie, FaTrophy, FaMedal, FaAward, FaIndustry, FaBox, FaGlobeAfrica, FaUsers
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import { auth } from '../services/firebase';
import { GiFarmer } from 'react-icons/gi';
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
    const [completedHarvestCycles, setCompletedHarvestCycles] = useState<number>(0);
    const [completedHarvestYears, setCompletedHarvestYears] = useState<number>(0);
    const [totalHarvestsRecorded, setTotalHarvestsRecorded] = useState<number>(0);
    const [cycleCompletionPercent, setCycleCompletionPercent] = useState<number>(0);
    const [blocksList, setBlocksList] = useState<any[]>([]);

    useEffect(() => {
        const fetchInvestorData = async () => {
            try {
                let farmData, revenueData, expenseData, blocksData;
                if (isDevelopment) {
                    farmData = await getMockData('getFarmSummary');
                    revenueData = await getMockData('getRevenueSummary');
                    expenseData = await getMockData('getExpenseSummary');
                    blocksData = await getMockData('getBlocks');
                } else {
                    [farmData, revenueData, expenseData, blocksData] = await Promise.all([
                        callApi('farmData', { action: 'getFarmSummary', farmId: '1' }),
                        callApi('farmData', { action: 'getRevenueSummary', farmId: '1' }),
                        callApi('farmData', { action: 'getExpenseSummary', farmId: '1' }),
                        callApi('farmData', { action: 'getBlocks', farmId: '1' }),
                    ]);
                }

                setFarmStats(farmData);

                const revenuesList = revenueData.revenues || [];
                const expensesList = expenseData.expenses || [];
                const blocksList = blocksData.blocks || [];
                const blocksListData = blocksData.blocks || [];
                setBlocksList(blocksListData);
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
                     const cat = e.category === 'PROCUREMENT' ? 'Supplier Procurement' : e.category?.replace(/_/g, ' ');
                     byCategory[cat] = (byCategory[cat] || 0) + e.amount;
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
                    if (r.supplierId === 10 && r.batchId) {
                        // AfriNuts own farm batch — allocate by harvest contribution
                        const totalFarmHarvest = blocksList.reduce((sum: number, b: any) => sum + (b.totalHarvestQuantity || 0), 0);
                        if (totalFarmHarvest > 0) {
                            blocksList.forEach((b: any) => {
                                if (b.totalHarvestQuantity && b.totalHarvestQuantity > 0 && blockMap.has(b.id)) {
                                    const share = b.totalHarvestQuantity / totalFarmHarvest;
                                    const blockRevenue = Math.round(r.totalAmount * share);
                                    const blockEntry = blockMap.get(b.id);
                                    blockEntry.totalRevenue += blockRevenue;
                                    blockEntry.transactionCount++;
                                }
                            });
                        }
                    } else if (r.blockId && blockMap.has(r.blockId)) {
                        const blockEntry = blockMap.get(r.blockId);
                        blockEntry.totalRevenue += r.totalAmount || 0;
                        blockEntry.transactionCount++;
                    }
                });
                let farmWideTotal = 0;
                expensesList.forEach((e: any) => {
                    if (e.category === 'PROCUREMENT') return; // Skip procurement
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

                // Compute farm stats from blocks if farmStats is missing
                const effectiveStats = farmStats?.stats || {
                    totalBlocks: blocksList.length || 35,
                    plantedBlocks: blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length,
                    totalTrees: blocksList.length * 100,
                    aliveTrees: blocksList.reduce((sum: number, b: any) => sum + Math.round((b.survivalRate || 0) * 100 / 100), 0),
                    survivalRate: blocksList.length > 0
                        ? blocksList.reduce((sum: number, b: any) => sum + (b.survivalRate || 0), 0) / blocksList.length
                        : 0,
                };

                // Track completed harvest CYCLES from Firestore data
                const uniqueCycles = new Set<string>();
                const cyclesByYear = new Map<number, Set<string>>();
                let totalHarvestsAcrossAllCycles = 0;

                revenuesList.forEach((r: any) => {
                    if (r.harvestCycleId) {
                        uniqueCycles.add(r.harvestCycleId);
                        totalHarvestsAcrossAllCycles++;
                        if (r.harvestYear) {
                            if (!cyclesByYear.has(r.harvestYear)) {
                                cyclesByYear.set(r.harvestYear, new Set());
                            }
                            cyclesByYear.get(r.harvestYear)!.add(r.harvestCycleId);
                        }
                    }
                });

                const completedSeasons = uniqueCycles.size;
                const completedYears = cyclesByYear.size;
                const totalPossible = 35 * 3;
                const cyclePct = totalPossible > 0 ? (completedSeasons / totalPossible) * 100 : 0;

                setCompletedHarvestCycles(completedSeasons);
                setCompletedHarvestYears(completedYears);
                setTotalHarvestsRecorded(totalHarvestsAcrossAllCycles);
                setCycleCompletionPercent(cyclePct);

                // Monthly chart data
                // Monthly chart data from real revenues
                const monthlyMap = new Map<string, { revenue: number; profit: number }>();
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                revenuesList.forEach((r: any) => {
                    const date = new Date(r.harvestDate || r.createdAt);
                    const key = monthNames[date.getMonth()];
                    if (!monthlyMap.has(key)) {
                        monthlyMap.set(key, { revenue: 0, profit: 0 });
                    }
                    const entry = monthlyMap.get(key)!;
                    entry.revenue += r.totalAmount || 0;

                    // Estimate profit using the calculated margin
                    const estimatedCost = (r.totalAmount || 0) * (1 - margin / 100);
                    entry.profit += (r.totalAmount || 0) - estimatedCost;
                });

                const orderedMonths = monthNames.filter(m => monthlyMap.has(m));
                setMonthlyData(orderedMonths.map(month => ({
                    month,
                    revenue: monthlyMap.get(month)!.revenue,
                    profit: monthlyMap.get(month)!.profit,
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

                {/* Executive Summary */}
                <Section className="py-6">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <InfoCard
                                icon={FaChartLine}
                                title="Executive Summary"
                                subtitle={`As of ${lastUpdated.toLocaleDateString()}`}
                                iconColor="text-accent"
                                showInfoBadge={false}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm text-gray-700">
                                    <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                                        <h4 className="font-medium text-primary mb-1">Farm Status</h4>
                                        <p>
                                            {blocksList.filter((b: any) => b.status === 'HARVESTED').length} of{' '}
                                            {blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length} planted blocks
                                            have been harvested, producing{' '}
                                            {blocksList.reduce((s: number, b: any) => s + (b.totalHarvestQuantity || 0), 0) > 0
                                                ? `${(blocksList.reduce((s: number, b: any) => s + (b.totalHarvestQuantity || 0), 0) / 1000).toFixed(1)}T`
                                                : '—'} of cashews.
                                            Survival rate: {blocksList.length > 0
                                            ? (blocksList.reduce((s: number, b: any) => s + (b.survivalRate || 0), 0) / blocksList.length).toFixed(1)
                                            : 0}%.
                                        </p>
                                    </div>
                                    <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                                        <h4 className="font-medium text-primary mb-1">Financial Position</h4>
                                        <p>
                                            Revenue of {new Intl.NumberFormat('fr-FR').format(financials.totalRevenue)} FCFA
                                            with {financials.profitMargin.toFixed(0)}% profit margin.
                                            {revenues.filter(r => r.supplierId && r.supplierId !== 10).length > 0
                                                ? ` Revenue is diversified across own farm and ${new Set(revenues.filter(r => r.supplierId && r.supplierId !== 10).map(r => r.supplierName)).size} supplier(s).`
                                                : ''}
                                        </p>
                                    </div>
                                    <div className="bg-white/40 rounded-xl p-3 border border-white/30">
                                        <h4 className="font-medium text-primary mb-1">Outlook</h4>
                                        <p>
                                            {blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length < 35
                                                ? `${35 - blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length} blocks remaining to develop. `
                                                : 'All 35 blocks planted. '}
                                            Trees entering peak production window.
                                            Revenue projected to grow as more blocks mature.
                                        </p>
                                    </div>
                                </div>
                            </InfoCard>
                        </motion.div>
                    </div>
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
                                <Typography variant="h2" className="mb-4 text-primary">
                                    Investment Performance at a Glance
                                </Typography>
                                <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto mb-8">
                                    Track the financial health and operational progress of our {farmStats?.stats?.totalBlocks || 35}-block cashew farm in Odienné, Ivory Coast.
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
                                    title: `${new Intl.NumberFormat('fr-FR').format(financials.totalRevenue)} FCFA`,
                                    subtitle: 'Total Revenue',
                                    variant: 'primary' as const
                                },
                                {
                                    icon: FaChartLine,
                                    title: `${new Intl.NumberFormat('fr-FR').format(financials.netProfit)} FCFA`,
                                    subtitle: 'Net Profit',
                                    variant: 'accent' as const
                                },
                                {
                                    icon: FaLeaf,
                                    title: `${financials.profitMargin.toFixed(1)}%`,
                                    subtitle: 'Profit Margin',
                                    variant: 'secondary' as const
                                },
                                {
                                    icon: FaTree,
                                    title: `${blocksList.filter((b: any) => b.status === 'HARVESTED').length}/${blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length}`,
                                    subtitle: 'Blocks Harvested',
                                    variant: 'primary' as const
                                }
                            ].map((kpi, idx) => (
                                <motion.div key={idx} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                    <InfoCard
                                        icon={kpi.icon}
                                        title={kpi.title}
                                        subtitle={kpi.subtitle}
                                        variant={kpi.variant}
                                        hideIconContainer={false}
                                        showInfoBadge={false}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Revenue Concentration */}
                        {financials.totalRevenue > 0 && (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="mb-8"
                            >
                                <InfoCard
                                    icon={FaUsers}
                                    title="Revenue Diversification"
                                    subtitle="How revenue is distributed across suppliers"
                                    iconColor="text-accent"
                                    showInfoBadge={false}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-600 mb-2">By Source</h4>
                                            <div className="space-y-2">
                                                {(() => {
                                                    const ownFarmRev = revenues.filter(r => r.supplierId === 10).reduce((s, r) => s + (r.totalAmount || 0), 0);
                                                    const supplierRev = financials.totalRevenue - ownFarmRev;
                                                    const ownFarmPct = financials.totalRevenue > 0 ? (ownFarmRev / financials.totalRevenue * 100) : 0;
                                                    const supplierPct = 100 - ownFarmPct;

                                                    return [
                                                        { label: 'Own Farm', value: ownFarmRev, pct: ownFarmPct, color: 'bg-green-500' },
                                                        { label: 'Suppliers', value: supplierRev, pct: supplierPct, color: 'bg-accent' },
                                                    ].map((item, i) => (
                                                        <div key={i}>
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span>{item.label}</span>
                                                                <span className="font-medium">{item.pct.toFixed(0)}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <motion.div
                                                                    className={`${item.color} h-2 rounded-full`}
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${item.pct}%` }}
                                                                    transition={{ duration: 1, delay: i * 0.2 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-600 mb-2">Top Supplier Concentration</h4>
                                            <div className="space-y-2">
                                                {(() => {
                                                    const supplierMap = new Map<string, number>();
                                                    revenues.filter(r => r.supplierId && r.supplierId !== 10).forEach(r => {
                                                        const name = r.supplierName || `Supplier #${r.supplierId}`;
                                                        supplierMap.set(name, (supplierMap.get(name) || 0) + (r.totalAmount || 0));
                                                    });
                                                    const totalSupplierRev = Array.from(supplierMap.values()).reduce((s, v) => s + v, 0);
                                                    return Array.from(supplierMap.entries())
                                                        .sort((a, b) => b[1] - a[1])
                                                        .slice(0, 3)
                                                        .map(([name, rev], i) => {
                                                            const pct = totalSupplierRev > 0 ? (rev / totalSupplierRev * 100) : 0;
                                                            return (
                                                                <div key={i}>
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="truncate max-w-[120px]">{name}</span>
                                                                        <span className="font-medium">{pct.toFixed(0)}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                                        <motion.div
                                                                            className="bg-blue-500 h-2 rounded-full"
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${pct}%` }}
                                                                            transition={{ duration: 1, delay: i * 0.2 }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 p-2 bg-primary/5 rounded-lg text-[10px] text-gray-500">
                                        <FaLightbulb className="inline mr-1 text-amber-500" />
                                        {(() => {
                                            const supplierMap = new Map<string, number>();
                                            revenues.filter(r => r.supplierId && r.supplierId !== 10).forEach(r => {
                                                const name = r.supplierName || `Supplier #${r.supplierId}`;
                                                supplierMap.set(name, (supplierMap.get(name) || 0) + (r.totalAmount || 0));
                                            });
                                            const topSupplier = Array.from(supplierMap.entries()).sort((a, b) => b[1] - a[1])[0];
                                            const totalSupplierRev = Array.from(supplierMap.values()).reduce((s, v) => s + v, 0);
                                            const topPct = totalSupplierRev > 0 && topSupplier ? (topSupplier[1] / totalSupplierRev * 100) : 0;
                                            return topPct > 50
                                                ? `⚠ High concentration: ${topSupplier?.[0]} represents ${topPct.toFixed(0)}% of supplier revenue. Consider diversifying.`
                                                : `✓ Healthy diversification: No single supplier exceeds 50% of supplier revenue.`;
                                        })()}
                                    </div>
                                </InfoCard>
                            </motion.div>
                        )}

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

                        {/* Unit Economics — Per Tonne Processing */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="mb-12"
                        >
                            <InfoCard
                                icon={FaIndustry}
                                title="Unit Economics"
                                subtitle="Per 1 MT Raw Cashew Nuts — from procurement to export"
                                variant="primary"
                                showInfoBadge={false}
                            >
                                <div className="space-y-6 mt-3">
                                    {/* Step 1: Procurement */}
                                    <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                        <h4 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                            <FaBox className="text-amber-500" />
                                            Step 1: Raw Material Procurement
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            <div>
                                                <div className="text-xs text-gray-500">Quantity</div>
                                                <div className="font-bold text-primary">1.00 MT</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Planning Price</div>
                                                <div className="font-bold text-primary">400 FCFA/kg</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Procurement Cost</div>
                                                <div className="font-bold text-red-600">400,000 FCFA</div>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2">
                                            Planning assumption — actual costs vary by source (own farm, cooperative, independent) and market conditions.
                                        </p>
                                    </div>

                                    {/* Step 2: Processing Output */}
                                    <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                        <h4 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                            <FaIndustry className="text-accent" />
                                            Step 2: Processing Output (25% Recovery Rate)
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3 text-center">
                                            {[
                                                { label: 'Premium Kernels', value: '250 kg', color: 'text-amber-600' },
                                                { label: 'Cashew Shells', value: '700 kg', color: 'text-gray-600' },
                                                { label: 'Processing Loss', value: '50 kg', color: 'text-red-500' },
                                            ].map((item, i) => (
                                                <div key={i}>
                                                    <div className="text-xs text-gray-500">{item.label}</div>
                                                    <div className={`font-bold ${item.color}`}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 3: Estimated Revenue */}
                                    <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                        <h4 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                            <FaDollarSign className="text-green-600" />
                                            Step 3: Estimated Revenue (per 1 MT)
                                        </h4>
                                        <div className="space-y-2">
                                            {[
                                                { product: 'Premium Export Kernels', qty: '250 kg', price: '$6,500/MT', revenue: '$1,625', primary: true },
                                                { product: 'CNSL (Future)', qty: '—', price: '$600/MT', revenue: 'Additional', primary: false },
                                                { product: 'Shell Biomass (Future)', qty: '—', price: '$100/MT', revenue: 'Additional', primary: false },
                                            ].map((item, i) => (
                                                <div key={i} className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm ${item.primary ? 'bg-green-50/50 border border-green-100' : 'bg-gray-50/30'}`}>
                                                    <span className="text-gray-700">{item.product}</span>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs text-gray-500">{item.qty} · {item.price}</span>
                                                        <span className={`font-bold ${item.primary ? 'text-green-700' : 'text-gray-500'}`}>
                                    {item.revenue}
                                </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2">
                                            *CNSL and shell biomass revenue represents potential upside — not included in conservative projections.
                                        </p>
                                    </div>

                                    {/* Step 4: Value Creation Summary */}
                                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
                                        <h4 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                            <FaChartLine className="text-primary" />
                                            Step 4: Value Creation
                                        </h4>
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-3">
                                            <span className="font-bold">1 MT Raw Cashew Nuts</span>
                                            <span>→</span>
                                            <span className="font-bold text-green-700">250 kg Premium Kernels</span>
                                            <span>+</span>
                                            <span className="text-gray-500">By-products</span>
                                            <span>+</span>
                                            <span className="text-gray-500">Traceability</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500">
                                            <div className="bg-white/30 rounded-lg py-1.5">Quality Grading</div>
                                            <div className="bg-white/30 rounded-lg py-1.5">Certifications</div>
                                            <div className="bg-white/30 rounded-lg py-1.5">Farm OS Traceability</div>
                                        </div>
                                    </div>

                                    {/* Actual vs Planning Comparison */}
                                    <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                        <h4 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                            <FaChartBar className="text-primary" />
                                            Actual Performance vs Planning Assumptions
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                                            {(() => {
                                                const ownFarmRevenues = revenues.filter(r => r.supplierId === 10);
                                                const ownFarmQty = ownFarmRevenues.reduce((s, r) => s + (r.quantityKg || 0), 0);
                                                const ownFarmRev = ownFarmRevenues.reduce((s, r) => s + (r.totalAmount || 0), 0);
                                                const farmCost = expenses.filter(e => e.category !== 'PROCUREMENT').reduce((s, e) => s + (e.amount || 0), 0);

                                                const actualPricePerKg = ownFarmQty > 0 ? ownFarmRev / ownFarmQty : 0;
                                                const actualCostPerKg = ownFarmQty > 0 ? farmCost / ownFarmQty : 0;
                                                const actualMargin = ownFarmRev > 0 ? ((ownFarmRev - farmCost) / ownFarmRev * 100) : 0;

                                                return [
                                                    { label: 'Avg Price/kg', actual: `${Math.round(actualPricePerKg).toLocaleString()} FCFA`, plan: '2,600 FCFA*', status: actualPricePerKg > 2600 ? 'above' : 'below' },
                                                    { label: 'Farm Cost/kg', actual: `${Math.round(actualCostPerKg).toLocaleString()} FCFA`, plan: '400 FCFA', status: actualCostPerKg < 400 ? 'below' : 'above' },
                                                    { label: 'Farm Margin', actual: `${actualMargin.toFixed(0)}%`, plan: '>30%', status: actualMargin > 30 ? 'above' : 'below' },
                                                    { label: 'Kernel Recovery', actual: '25% est.', plan: '25%', status: 'on-track' },
                                                ].map((item, i) => (
                                                    <div key={i}>
                                                        <div className="text-xs text-gray-500">{item.label}</div>
                                                        <div className="font-bold text-primary">{item.actual}</div>
                                                        <div className={`text-[10px] ${item.status === 'above' ? 'text-green-600' : item.status === 'below' ? 'text-red-500' : 'text-gray-400'}`}>
                                                            Plan: {item.plan}
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2">
                                            *Planning price of $6,500/MT converted at ~400 FCFA/USD. Actuals based on own farm production only.
                                        </p>
                                    </div>
                                </div>
                            </InfoCard>
                        </motion.div>

                        {/* Harvest & Production Overview */}
                        {blocksList && blocksList.length > 0 && (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="mb-8"
                            >
                                <InfoCard
                                    icon={FaCalendarAlt}
                                    title="Harvest & Production Overview"
                                    variant="primary"
                                    showInfoBadge={false}
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            {
                                                label: 'Blocks Harvested',
                                                value: blocksList.filter((b: any) => b.status === 'HARVESTED').length,
                                                total: blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length,
                                                hint: 'of planted blocks'
                                            },
                                            {
                                                label: 'Total Harvests',
                                                value: blocksList.reduce((sum: number, b: any) => sum + (b.harvestCount || 0), 0),
                                                hint: 'across all blocks'
                                            },
                                            {
                                                label: 'Total Volume',
                                                value: blocksList.reduce((sum: number, b: any) => sum + (b.totalHarvestQuantity || 0), 0) > 0
                                                    ? `${(blocksList.reduce((sum: number, b: any) => sum + (b.totalHarvestQuantity || 0), 0) / 1000).toFixed(1)}T`
                                                    : '—',
                                                hint: 'cumulative production'
                                            },
                                            {
                                                label: 'Last Harvest',
                                                value: blocksList
                                                    .filter((b: any) => b.lastHarvestDate)
                                                    .sort((a: any, b: any) => (b.lastHarvestDate || 0) - (a.lastHarvestDate || 0))[0]?.lastHarvestDate
                                                    ? new Date(blocksList.filter((b: any) => b.lastHarvestDate).sort((a: any, b: any) => (b.lastHarvestDate || 0) - (a.lastHarvestDate || 0))[0].lastHarvestDate!).toLocaleDateString()
                                                    : '—',
                                                hint: 'most recent activity'
                                            },
                                        ].map((item, i) => (
                                            <div key={i} className="text-center p-3 bg-white/30 rounded-xl">
                                                <div className="text-2xl font-bold text-primary">
                                                    {item.total !== undefined ? `${item.value}/${item.total}` : item.value}
                                                </div>
                                                <div className="text-xs text-gray-500">{item.label}</div>
                                                <div className="text-[10px] text-gray-400">{item.hint}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Recently Harvested Blocks */}
                                    {blocksList.filter((b: any) => b.status === 'HARVESTED').length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-600 mb-2">Recently Harvested</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {blocksList
                                                    .filter((b: any) => b.status === 'HARVESTED' && b.lastHarvestDate)
                                                    .sort((a: any, b: any) => (b.lastHarvestDate || 0) - (a.lastHarvestDate || 0))
                                                    .slice(0, 4)
                                                    .map((block: any) => {
                                                        const history = block.harvestHistory
                                                            ? (typeof block.harvestHistory === 'string' ? JSON.parse(block.harvestHistory) : block.harvestHistory)
                                                            : [];
                                                        const lastHarvest = Array.isArray(history) ? history[history.length - 1] : null;
                                                        return (
                                                            <div key={block.id} className="flex items-center justify-between bg-white/30 rounded-lg px-3 py-2 text-sm">
                                                                <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                                                {block.blockName}
                                            </span>
                                                                    <span>{block.blockName}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <span>{block.harvestCount}×</span>
                                                                    <span>{block.totalHarvestQuantity ? `${(block.totalHarvestQuantity / 1000).toFixed(1)}T` : '—'}</span>
                                                                    {lastHarvest?.grade && (
                                                                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                                                                            lastHarvest.grade === 'Premium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                                        }`}>{lastHarvest.grade}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}
                                </InfoCard>
                            </motion.div>
                        )}

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

                            {/* Cost Structure */}
                            <InfoCard icon={FaChartPie} title="Cost Structure" variant="accent" showInfoBadge={false}>
                                {(() => {
                                    const farmOpsCost = expenses
                                        .filter(e => e.category !== 'PROCUREMENT')
                                        .reduce((sum, e) => sum + (e.amount || 0), 0);
                                    const procurementCost = expenses
                                        .filter(e => e.category === 'PROCUREMENT')
                                        .reduce((sum, e) => sum + (e.amount || 0), 0);
                                    const totalCost = farmOpsCost + procurementCost;

                                    if (totalCost === 0) {
                                        return <p className="text-center text-gray-400 py-8">No expense data yet</p>;
                                    }

                                    return (
                                        <div className="space-y-4 mt-3">
                                            {/* Procurement Bar */}
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">Supplier Procurement</span>
                                                    <span className="text-gray-500">
                                                        {new Intl.NumberFormat('fr-FR').format(procurementCost)} FCFA · {((procurementCost / totalCost) * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <motion.div
                                                        className="bg-accent h-3 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(procurementCost / totalCost) * 100}%` }}
                                                        transition={{ duration: 1 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Farm Operations Bar */}
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">Farm Operations</span>
                                                    <span className="text-gray-500">
                                                        {new Intl.NumberFormat('fr-FR').format(farmOpsCost)} FCFA · {((farmOpsCost / totalCost) * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <motion.div
                                                        className="bg-primary h-3 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(farmOpsCost / totalCost) * 100}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Farm Operations Breakdown */}
                                            <div className="pt-3 border-t border-gray-200">
                                                <p className="text-xs text-gray-500 mb-2">Farm Operations Breakdown</p>
                                                {(() => {
                                                    const opsCategories: Record<string, number> = {};
                                                    expenses
                                                        .filter(e => e.category !== 'PROCUREMENT')
                                                        .forEach(e => {
                                                            const cat = e.category?.replace(/_/g, ' ');
                                                            opsCategories[cat] = (opsCategories[cat] || 0) + (e.amount || 0);
                                                        });

                                                    return Object.entries(opsCategories)
                                                        .sort((a, b) => b[1] - a[1])
                                                        .slice(0, 5)
                                                        .map(([name, value], i) => (
                                                            <div key={i} className="mb-2">
                                                                <div className="flex justify-between text-[11px] mb-0.5">
                                                                    <span className="text-gray-600">{name}</span>
                                                                    <span className="text-gray-400">{((value / farmOpsCost) * 100).toFixed(0)}%</span>
                                                                </div>
                                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                                    <motion.div
                                                                        className="bg-primary/60 h-1.5 rounded-full"
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${(value / farmOpsCost) * 100}%` }}
                                                                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ));
                                                })()}
                                            </div>

                                            {/* Total */}
                                            <div className="pt-3 border-t border-gray-200 flex justify-between text-sm">
                                                <span className="font-semibold text-gray-700">Total</span>
                                                <span className="font-bold text-primary">{new Intl.NumberFormat('fr-FR').format(totalCost)} FCFA</span>
                                            </div>
                                        </div>
                                    );
                                })()}
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
                                title="Production & Revenue Forecast"
                                subtitle="Based on tree maturity curve and current performance"
                                variant="primary"
                                showInfoBadge={false}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {(() => {
                                        const currentYear = new Date().getFullYear();
                                        const plantedBlocks = blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length;
                                        const harvestedBlocks = blocksList.filter((b: any) => b.status === 'HARVESTED').length;
                                        const avgRevenuePerBlock = harvestedBlocks > 0 && revenueByBlock.length > 0
                                            ? revenueByBlock.filter(b => b.totalRevenue > 0).reduce((s, b) => s + b.totalRevenue, 0) / harvestedBlocks
                                            : 0;
                                        const farmOperationalCost = expenses
                                            .filter(e => e.category !== 'PROCUREMENT')
                                            .reduce((s, e) => s + (e.amount || 0), 0);
                                        const avgCostPerBlock = plantedBlocks > 0 ? farmOperationalCost / plantedBlocks : 0;
                                        const currentMargin = financials.totalRevenue > 0 ? (financials.netProfit / financials.totalRevenue) * 100 : 0;

                                        return [
                                            {
                                                year: currentYear,
                                                label: 'Current Year',
                                                blocks: harvestedBlocks,
                                                revenue: financials.totalRevenue,
                                                profit: financials.netProfit,
                                                note: `${harvestedBlocks} blocks harvested`
                                            },
                                            {
                                                year: currentYear + 1,
                                                label: 'Next Year',
                                                blocks: Math.min(plantedBlocks + 5, 35),
                                                revenue: Math.round(avgRevenuePerBlock * Math.min(plantedBlocks + 5, 35) * 1.15),
                                                profit: Math.round(avgRevenuePerBlock * Math.min(plantedBlocks + 5, 35) * 1.15 * (currentMargin / 100)),
                                                note: `${Math.min(plantedBlocks + 5, 35)} blocks projected`
                                            },
                                            {
                                                year: currentYear + 2,
                                                label: 'Year 3',
                                                blocks: 35,
                                                revenue: Math.round(avgRevenuePerBlock * 35 * 1.3),
                                                profit: Math.round(avgRevenuePerBlock * 35 * 1.3 * (currentMargin / 100)),
                                                note: 'Full 35-block production'
                                            },
                                        ].map((proj, idx) => (
                                            <motion.div
                                                key={idx}
                                                variants={fadeIn}
                                                transition={{ delay: idx * 0.1 }}
                                                className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
                                            >
                                                <div className="text-xs text-gray-500 uppercase mb-1">{proj.label}</div>
                                                <div className="text-lg font-bold text-primary mb-2">{proj.year}</div>
                                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                                    {new Intl.NumberFormat('fr-FR').format(proj.revenue)} FCFA
                                                </div>
                                                <div className="text-sm text-gray-500 mb-2">Projected Revenue</div>
                                                <div className="mt-2 pt-2 border-t border-gray-200">
                                                    <div className="text-sm text-green-700 font-medium">
                                                        Profit: {new Intl.NumberFormat('fr-FR').format(proj.profit)} FCFA
                                                    </div>
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-1">{proj.note}</div>
                                            </motion.div>
                                        ));
                                    })()}
                                </div>
                                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <FaLightbulb className="inline mr-1 text-yellow-500" />
                                        <strong>Methodology:</strong> Based on {blocksList.filter((b: any) => b.status === 'HARVESTED').length} harvested blocks averaging{' '}
                                        {new Intl.NumberFormat('fr-FR').format(Math.round(
                                            blocksList.filter((b: any) => b.status === 'HARVESTED').length > 0 && revenueByBlock.filter(b => b.totalRevenue > 0).length > 0
                                                ? revenueByBlock.filter(b => b.totalRevenue > 0).reduce((s, b) => s + b.totalRevenue, 0) / blocksList.filter((b: any) => b.status === 'HARVESTED').length
                                                : 0
                                        ))} FCFA per block. Projections assume 15% annual yield improvement as trees mature. Actual results depend on weather, market prices, and operational execution.
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
                                    icon: FaTree,
                                    title: `${blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length} Blocks Planted`,
                                    subtitle: 'Farm Development',
                                    description: `${blocksList.filter((b: any) => b.status === 'HARVESTED').length} harvesting`,
                                    note: `${blocksList.length - blocksList.filter((b: any) => b.status === 'PLANTED' || b.status === 'HARVESTED').length} remaining to develop`,
                                    variant: 'primary' as const
                                },
                                {
                                    icon: FaChartLine,
                                    title: `${financials.profitMargin.toFixed(0)}% Profit Margin`,
                                    subtitle: 'Financial Health',
                                    description: `${revenues.filter(r => r.quality === 'PREMIUM').length} Premium sales`,
                                    note: `${revenues.filter(r => r.quality === 'STANDARD').length} Standard sales`,
                                    variant: 'accent' as const
                                },
                                {
                                    icon: FaGlobeAfrica,
                                    title: `${revenues.filter(r => r.supplierId && r.supplierId !== 10).length} Supplier Sales`,
                                    subtitle: 'Supply Network',
                                    description: `${revenues.filter(r => r.supplierId === 10).length} Own Farm sales`,
                                    note: 'Diversified revenue streams',
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
            </main>
        </div>
    );
};

export default InvestorPortal;