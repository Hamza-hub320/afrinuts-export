import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaDollarSign,
    FaChartLine,
    FaChartBar,
    FaChartPie,
    FaTable,
    FaBorderAll,
    FaMapMarkerAlt,
    FaTrophy,
    FaMedal,
    FaAward,
    FaLightbulb, FaMapPin, FaGlobeAfrica, FaTimes, FaUsers, FaBox, FaHome, FaTractor
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import PhotoGallery from '@/components/PhotoGallery/PhotoGallery';
import { GiFarmer } from 'react-icons/gi';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
    Legend, Area,
    AreaChart
} from 'recharts';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Section from '@/components/Section/Section';
import { useNavigate } from 'react-router-dom';
import { InfoCard } from '@/components/InfoCard/InfoCard';

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
    createdAt?: number;
    harvestCycleId?: string;
    harvestYear?: number;
    harvestSeason?: number;
    supplierId?: number;
    supplierName?: string;
    batchId?: number;
    batchNumber?: string;
}

interface Photo {
    id: number;
    filePath: string;
    caption?: string;
    takenAt: number;
    photoType: 'BLOCK' | 'EXPENSE' | 'TASK';
    blockId?: number;
    expenseId?: number;
    taskId?: number;
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
    const [expensePhotos, setExpensePhotos] = useState<Photo[]>([]);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [supplierCapacity, setSupplierCapacity] = useState<number>(0);
    const [supplierCount, setSupplierCount] = useState<number>(0);



    useEffect(() => {
        const fetchFinancials = async () => {
            try {
                let revenueData, expenseData, blocksData, suppliersData;
                if (isDevelopment) {
                    revenueData = await getMockData('getRevenueSummary');
                    expenseData = await getMockData('getExpenseSummary');
                    blocksData = await getMockData('getBlocks');
                    suppliersData = await getMockData('getSuppliers');
                } else {
                    [revenueData, expenseData, blocksData, suppliersData] = await Promise.all([
                        callApi('farmData', { action: 'getRevenueSummary', farmId: '1' }),
                        callApi('farmData', { action: 'getExpenseSummary', farmId: '1' }),
                        callApi('farmData', { action: 'getBlocks', farmId: '1' }),
                        callApi('supplierData', { action: 'getSuppliers', farmId: '1' }),
                    ]);
                }

                const revenuesList = revenueData.revenues || [];
                const expensesList = expenseData.expenses || [];
                const blocksList = blocksData.blocks || [];
                const suppliersList = suppliersData.suppliers || [];
                setSupplierCount(suppliersList.length);

                setRevenues(revenuesList);
                setExpenses(expensesList);

                const blockCount = Object.keys(BLOCK_NAMES).length;
                const blockMap = new Map<number, any>();
                const totalCapacity = suppliersList.reduce((sum: number, s: any) => sum + (s.annualVolumeKg || 0), 0);
                setSupplierCapacity(totalCapacity);

                // Initialize all 35 blocks
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

                // Process revenues — allocate farm batch to blocks by harvest contribution
                revenuesList.forEach((revenue: any) => {
                    if (revenue.supplierId === 10 && revenue.batchId) {
                        // AfriNuts own farm batch — allocate proportionally
                        const totalFarmHarvest = blocksList.reduce((sum: number, b: any) => sum + (b.totalHarvestQuantity || 0), 0);

                        if (totalFarmHarvest > 0) {
                            blocksList.forEach((b: any) => {
                                if (b.totalHarvestQuantity && b.totalHarvestQuantity > 0 && blockMap.has(b.id)) {
                                    const share = b.totalHarvestQuantity / totalFarmHarvest;
                                    const blockRevenue = Math.round(revenue.totalAmount * share);
                                    const blockEntry = blockMap.get(b.id);
                                    blockEntry.totalRevenue += blockRevenue;
                                    blockEntry.transactionCount++;
                                    if (revenue.quality) blockEntry.quality = revenue.quality;
                                }
                            });
                        }
                    } else if (revenue.blockId && blockMap.has(revenue.blockId)) {
                        // Legacy: direct block revenue
                        const blockEntry = blockMap.get(revenue.blockId);
                        blockEntry.totalRevenue += revenue.totalAmount || 0;
                        blockEntry.transactionCount++;
                        if (revenue.quality) blockEntry.quality = revenue.quality;
                    }
                });

                // Process expenses: separate direct, farm-wide, and procurement
                let totalFarmWideExpenses = 0;
                expensesList.forEach((expense: any) => {
                    if (expense.category === 'PROCUREMENT') {
                        // Skip procurement — it's tracked in Supplier Financial Performance table
                        return;
                    }
                    if (expense.blockId && blockMap.has(expense.blockId)) {
                        blockMap.get(expense.blockId).directExpenses += expense.amount || 0;
                    } else {
                        totalFarmWideExpenses += expense.amount || 0;
                    }
                });

                // Allocate farm-wide expenses equally
                const perBlockAllocation = totalFarmWideExpenses / blockCount;
                blockMap.forEach((blockEntry) => {
                    blockEntry.allocatedExpenses = perBlockAllocation;
                    blockEntry.totalExpenses = blockEntry.directExpenses + blockEntry.allocatedExpenses;
                    blockEntry.profit = blockEntry.totalRevenue - blockEntry.totalExpenses;
                    blockEntry.roi = blockEntry.totalExpenses > 0
                        ? ((blockEntry.totalRevenue - blockEntry.totalExpenses) / blockEntry.totalExpenses * 100)
                        : (blockEntry.totalRevenue > 0 ? 100 : 0);
                });

                const blockRevenueArray = Array.from(blockMap.values())
                    .sort((a, b) => b.profit - a.profit);

                setRevenueByBlock(blockRevenueArray);
                setPerBlockAllocation(perBlockAllocation);

                // Fetch photos
                if (!isDevelopment) {
                    const photosData = await callApi('photos', { action: 'getPhotos', farmId: '1' });
                    setExpensePhotos(photosData.photos || []);
                }

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
                                Track revenue, expenses, and profitability across all 35 blocks.
                                Farm harvest revenue is allocated to blocks proportionally based on each block's
                                harvest contribution. Farm-wide costs are shared equally for fair comparison.
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

                {/* Supplier Financial Performance */}
                <Section className="py-6">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <InfoCard
                                icon={FaUsers}
                                title="Supplier Financial Performance"
                                subtitle="Procurement cost vs revenue generated per supplier"
                                iconColor="text-accent"
                                showInfoBadge={false}
                            >
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto mt-3">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="border-b border-gray-200 text-left">
                                            <th className="pb-2 font-medium text-gray-600">Supplier</th>
                                            <th className="pb-2 font-medium text-gray-600 text-right">Procurement</th>
                                            <th className="pb-2 font-medium text-gray-600 text-right">Revenue</th>
                                            <th className="pb-2 font-medium text-gray-600 text-right">Margin</th>
                                            <th className="pb-2 font-medium text-gray-600 text-center">Efficiency</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {(() => {
                                            // Group expenses and revenues by supplier
                                            const supplierMap = new Map<number, { name: string; procurement: number; revenue: number }>();

                                            // Calculate total farm-wide operational cost (for AfriNuts own farm)
                                            const totalFarmOperationalCost = expenses
                                                .filter(e => e.category !== 'PROCUREMENT')
                                                .reduce((sum, e) => sum + (e.amount || 0), 0);

                                            expenses.forEach(e => {
                                                if (e.supplierId) {
                                                    if (!supplierMap.has(e.supplierId)) {
                                                        supplierMap.set(e.supplierId, {
                                                            name: e.supplierName || `Supplier #${e.supplierId}`,
                                                            procurement: 0,
                                                            revenue: 0
                                                        });
                                                    }
                                                    supplierMap.get(e.supplierId)!.procurement += e.amount || 0;
                                                }
                                            });

                                            revenues.forEach(r => {
                                                if (r.supplierId) {
                                                    if (!supplierMap.has(r.supplierId)) {
                                                        supplierMap.set(r.supplierId, {
                                                            name: r.supplierName || `Supplier #${r.supplierId}`,
                                                            procurement: 0,
                                                            revenue: 0
                                                        });
                                                    }
                                                    supplierMap.get(r.supplierId)!.revenue += r.totalAmount || 0;
                                                }
                                            });

                                            // Set AfriNuts own farm procurement to farm-wide operational cost
                                            const afriNutsId = 10;
                                            if (supplierMap.has(afriNutsId)) {
                                                supplierMap.get(afriNutsId)!.procurement = totalFarmOperationalCost;
                                            }

                                            return Array.from(supplierMap.entries())
                                                .sort((a, b) => (b[1].revenue - b[1].procurement) - (a[1].revenue - a[1].procurement))
                                                .map(([id, data]) => {
                                                    const margin = data.revenue - data.procurement;
                                                    const efficiency = data.procurement > 0 ? (data.revenue / data.procurement).toFixed(1) : '—';
                                                    const isOwnFarm = id === afriNutsId;
                                                    return (
                                                        <tr key={id} className={`border-b border-gray-100 last:border-0 hover:bg-white/20 ${isOwnFarm ? 'bg-green-50/30' : ''}`}>
                                                            <td className="py-2 font-medium">
                                                                {data.name}
                                                                {isOwnFarm && (
                                                                    <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full">Own Farm</span>
                                                                )}
                                                            </td>
                                                            <td className="py-2 text-right">
                                                                {new Intl.NumberFormat('fr-FR').format(data.procurement)} FCFA
                                                                {isOwnFarm && (
                                                                    <div className="text-[10px] text-gray-400">farm operational cost</div>
                                                                )}
                                                            </td>
                                                            <td className="py-2 text-right">{new Intl.NumberFormat('fr-FR').format(data.revenue)} FCFA</td>
                                                            <td className={`py-2 text-right font-medium ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {new Intl.NumberFormat('fr-FR').format(margin)} FCFA
                                                            </td>
                                                            <td className="py-2 text-center">
                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${Number(efficiency) > 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                     {efficiency}x
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                });
                                        })()}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mobile Cards */}
                                <div className="md:hidden space-y-3 mt-3">
                                    {(() => {
                                        const supplierMap = new Map<number, { name: string; procurement: number; revenue: number }>();
                                        const totalFarmOperationalCost = expenses
                                            .filter(e => e.category !== 'PROCUREMENT')
                                            .reduce((sum, e) => sum + (e.amount || 0), 0);

                                        expenses.forEach(e => {
                                            if (e.supplierId) {
                                                if (!supplierMap.has(e.supplierId)) {
                                                    supplierMap.set(e.supplierId, { name: e.supplierName || `Supplier #${e.supplierId}`, procurement: 0, revenue: 0 });
                                                }
                                                supplierMap.get(e.supplierId)!.procurement += e.amount || 0;
                                            }
                                        });

                                        revenues.forEach(r => {
                                            if (r.supplierId) {
                                                if (!supplierMap.has(r.supplierId)) {
                                                    supplierMap.set(r.supplierId, { name: r.supplierName || `Supplier #${r.supplierId}`, procurement: 0, revenue: 0 });
                                                }
                                                supplierMap.get(r.supplierId)!.revenue += r.totalAmount || 0;
                                            }
                                        });

                                        const afriNutsId = 10;
                                        if (supplierMap.has(afriNutsId)) {
                                            supplierMap.get(afriNutsId)!.procurement = totalFarmOperationalCost;
                                        }

                                        return Array.from(supplierMap.entries())
                                            .sort((a, b) => (b[1].revenue - b[1].procurement) - (a[1].revenue - a[1].procurement))
                                            .map(([id, data]) => {
                                                const margin = data.revenue - data.procurement;
                                                const efficiency = data.procurement > 0 ? (data.revenue / data.procurement).toFixed(1) : '—';
                                                const isOwnFarm = id === afriNutsId;
                                                return (
                                                    <motion.div
                                                        key={id}
                                                        className={`bg-white/40 backdrop-blur-sm rounded-xl p-4 border ${isOwnFarm ? 'border-green-300 bg-green-50/30' : 'border-white/30'}`}
                                                        whileHover={{ y: -2 }}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                <span className="font-medium text-primary text-sm">
                                    {data.name}
                                    {isOwnFarm && (
                                        <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full">Own Farm</span>
                                    )}
                                </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${Number(efficiency) > 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {efficiency}x
                                </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                                            <div>
                                                                <span className="text-gray-500">Procurement</span>
                                                                <p className="font-medium text-gray-700">{new Intl.NumberFormat('fr-FR').format(data.procurement)} FCFA</p>
                                                                {isOwnFarm && <p className="text-[10px] text-gray-400">farm operational cost</p>}
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Revenue</span>
                                                                <p className="font-medium text-gray-700">{new Intl.NumberFormat('fr-FR').format(data.revenue)} FCFA</p>
                                                            </div>
                                                            <div className="col-span-2 pt-2 border-t border-gray-100">
                                                                <span className="text-gray-500">Margin</span>
                                                                <p className={`font-semibold text-sm ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {new Intl.NumberFormat('fr-FR').format(margin)} FCFA
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            });
                                    })()}
                                </div>
                            </InfoCard>
                        </motion.div>
                    </div>
                </Section>

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
                                    Revenue allocated from {revenues.filter(r => r.supplierId === 10).length} farm batch{revenues.filter(r => r.supplierId === 10).length !== 1 ? 'es' : ''} across {revenueByBlock.filter(b => b.totalRevenue > 0).length} blocks
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
                                <Typography variant="h4" className="text-primary">Revenue by Quality & Source</Typography>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={(() => {
                                        const grouped: Record<string, { ownFarm: number; supplier: number }> = {};

                                        revenues.forEach(r => {
                                            const quality = r.quality || 'UNKNOWN';
                                            if (!grouped[quality]) {
                                                grouped[quality] = { ownFarm: 0, supplier: 0 };
                                            }
                                            // supplierId 10 = FARM-AOS = own farm
                                            if (r.supplierId === 10) {
                                                grouped[quality].ownFarm += r.totalAmount || 0;
                                            } else if (r.supplierId) {
                                                grouped[quality].supplier += r.totalAmount || 0;
                                            }
                                        });

                                        return Object.entries(grouped).map(([quality, data]) => ({
                                            quality,
                                            'Own Farm': data.ownFarm,
                                            'Suppliers': data.supplier,
                                        }));
                                    })()}
                                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="quality" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" width={80} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                                    <Tooltip formatter={(value) => `${new Intl.NumberFormat('fr-FR').format(Number(value))} FCFA`} />
                                    <Legend />
                                    <Bar dataKey="Own Farm" fill="#5A7411" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Suppliers" fill="#E04E00" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </GlassCard>

                    <GlassCard>
                        <motion.div variants={fadeIn}>
                            <div className="flex items-center gap-2 mb-4">
                                <FaChartLine className="text-primary text-xl" />
                                <Typography variant="h4" className="text-primary">Revenue by Source Over Time</Typography>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart
                                    data={(() => {
                                        // Group by harvest year
                                        const byYear: Record<string, { year: string; ownFarm: number; supplier: number }> = {};

                                        revenues.forEach(r => {
                                            const year = r.harvestYear ? String(r.harvestYear) : 'Unknown';
                                            if (!byYear[year]) {
                                                byYear[year] = { year, ownFarm: 0, supplier: 0 };
                                            }
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
                                    <Area type="monotone" dataKey="ownFarm" name="Own Farm" stroke="#5A7411" fill="#5A7411" fillOpacity={0.2} strokeWidth={2} />
                                    <Area type="monotone" dataKey="supplier" name="Suppliers" stroke="#E04E00" fill="#E04E00" fillOpacity={0.2} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </GlassCard>
                </motion.div>

                {/* Expenses Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Farm Operational Expenses */}
                    <GlassCard>
                        <motion.div variants={fadeIn}>
                            <div className="flex items-center gap-2 mb-4">
                                <FaTractor className="text-primary text-xl" />
                                <Typography variant="h4" className="text-primary">Farm Operational Costs</Typography>
                            </div>
                            {(() => {
                                const farmExpenses = expenses.filter(e => e.category !== 'PROCUREMENT');
                                const totalFarm = farmExpenses.reduce((s, e) => s + (e.amount || 0), 0);

                                if (totalFarm === 0) {
                                    return <p className="text-center text-gray-400 py-8">No operational expenses recorded</p>;
                                }

                                const categories: Record<string, number> = {};
                                farmExpenses.forEach(e => {
                                    const cat = e.category?.replace(/_/g, ' ');
                                    categories[cat] = (categories[cat] || 0) + (e.amount || 0);
                                });
                                const data = Object.entries(categories)
                                    .map(([name, value]) => ({ name, value, pct: ((value / totalFarm) * 100).toFixed(0) }))
                                    .sort((a, b) => b.value - a.value);

                                return (
                                    <>
                                        <div className="text-2xl font-bold text-primary mb-2">
                                            {new Intl.NumberFormat('fr-FR').format(totalFarm)} FCFA
                                        </div>
                                        <div className="space-y-3">
                                            {data.map((item, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-600">{item.name}</span>
                                                        <span className="font-medium">{item.pct}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <motion.div
                                                            className="bg-primary h-2.5 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.pct}%` }}
                                                            transition={{ duration: 1, delay: i * 0.1 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </GlassCard>

                    {/* Supplier Procurement Costs */}
                    <GlassCard>
                        <motion.div variants={fadeIn}>
                            <div className="flex items-center gap-2 mb-4">
                                <FaUsers className="text-accent text-xl" />
                                <Typography variant="h4" className="text-primary">Supplier Procurement</Typography>
                            </div>
                            {(() => {
                                const procurementExpenses = expenses.filter(e => e.category === 'PROCUREMENT');
                                const totalProcurement = procurementExpenses.reduce((s, e) => s + (e.amount || 0), 0);

                                if (totalProcurement === 0) {
                                    return <p className="text-center text-gray-400 py-8">No procurement expenses recorded</p>;
                                }

                                // Group by supplier
                                const bySupplier: Record<string, number> = {};
                                procurementExpenses.forEach(e => {
                                    const name = e.supplierName || 'Unknown';
                                    bySupplier[name] = (bySupplier[name] || 0) + (e.amount || 0);
                                });
                                const data = Object.entries(bySupplier)
                                    .map(([name, value]) => ({ name, value, pct: ((value / totalProcurement) * 100).toFixed(0) }))
                                    .sort((a, b) => b.value - a.value);

                                return (
                                    <>
                                        <div className="text-2xl font-bold text-accent mb-2">
                                            {new Intl.NumberFormat('fr-FR').format(totalProcurement)} FCFA
                                        </div>
                                        <div className="space-y-3">
                                            {data.map((item, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-600">{item.name}</span>
                                                        <span className="font-medium">{item.pct}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <motion.div
                                                            className="bg-accent h-2.5 rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.pct}%` }}
                                                            transition={{ duration: 1, delay: i * 0.1 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </GlassCard>
                </div>

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

                            {/* Recent Harvests Banner */}
                            {(() => {
                                const now = Date.now();
                                const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
                                const recentHarvests = revenues.filter((r: any) => {
                                    const harvestTime = r.harvestDate || r.createdAt;
                                    return harvestTime && harvestTime > sevenDaysAgo;
                                });

                                if (recentHarvests.length === 0) return null;

                                const recentRevenue = recentHarvests.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0);
                                const recentSuppliers = new Set(recentHarvests.map((r: any) => r.supplierName).filter(Boolean));

                                return (
                                    <motion.div
                                        className="mb-4 p-4 bg-green-50/60 backdrop-blur-sm rounded-xl border border-green-200"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                                <Typography variant="small" className="font-semibold text-green-800">
                                                    {recentHarvests.length} recent sale{recentHarvests.length !== 1 ? 's' : ''}
                                                </Typography>
                                            </div>
                                            <div className="flex gap-4 text-sm">
                                        <span className="text-green-700">
                                            <strong>{recentSuppliers.size}</strong> source{recentSuppliers.size !== 1 ? 's' : ''}
                                        </span>
                                                <span className="text-green-700 font-bold">
                        {new Intl.NumberFormat('fr-FR').format(recentRevenue)} FCFA
                    </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })()}

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-200 text-left">
                                        <th className="pb-3 font-medium text-gray-600">Date</th>
                                        <th className="pb-3 font-medium text-gray-600">Source</th>
                                        <th className="pb-3 font-medium text-gray-600">Batch</th>
                                        <th className="pb-3 font-medium text-gray-600">Buyer</th>
                                        <th className="pb-3 font-medium text-gray-600">Quality</th>
                                        <th className="pb-3 font-medium text-gray-600 text-right">Amount (FCFA)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {revenues
                                        .slice()
                                        .sort((a, b) => (b.harvestDate || b.createdAt || 0) - (a.harvestDate || a.createdAt || 0))
                                        .slice(0, revenuePage * ITEMS_PER_PAGE)
                                        .map((revenue: any, i: number) => {
                                            const isRecent = (revenue.harvestDate || revenue.createdAt) > (Date.now() - 7 * 24 * 60 * 60 * 1000);
                                            return (
                                                <motion.tr
                                                    key={revenue.id}
                                                    className="border-b border-gray-100 last:border-0 hover:bg-white/30 transition-colors"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <td className="py-3 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {new Date(revenue.harvestDate || revenue.createdAt).toLocaleDateString()}
                                                            {isRecent && (
                                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-medium">
                                        NEW
                                    </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        {revenue.supplierId === 10 ? (
                                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full inline-flex items-center gap-1">
                                    <FaHome className="text-[10px]" /> Own Farm
                                </span>
                                                        ) : revenue.supplierName ? (
                                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full inline-flex items-center gap-1">
                                    <FaUsers className="text-[10px]" /> {revenue.supplierName}
                                </span>
                                                        ) : revenue.blockId ? (
                                                            <span className="text-xs">Block {BLOCK_NAMES[revenue.blockId] || revenue.blockId}</span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">—</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-xs text-gray-500">
                                                        {revenue.batchNumber || '—'}
                                                    </td>
                                                    <td className="py-3 text-xs text-gray-500">
                                                        {revenue.buyer || '—'}
                                                    </td>
                                                    <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                revenue.quality === 'PREMIUM'
                                    ? 'bg-amber-100 text-amber-700'
                                    : revenue.quality === 'STANDARD'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600'
                            }`}>
                                {revenue.quality}
                            </span>
                                                    </td>
                                                    <td className="py-3 text-right font-medium">
                                                        {new Intl.NumberFormat('fr-FR').format(revenue.totalAmount)}
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3">
                                {revenues
                                    .slice()
                                    .sort((a, b) => (b.harvestDate || b.createdAt || 0) - (a.harvestDate || a.createdAt || 0))
                                    .slice(0, revenuePage * ITEMS_PER_PAGE)
                                    .map((revenue: any, i: number) => {
                                        const isRecent = (revenue.harvestDate || revenue.createdAt) > (Date.now() - 7 * 24 * 60 * 60 * 1000);
                                        return (
                                            <motion.div
                                                key={revenue.id}
                                                className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30 space-y-2"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            revenue.quality === 'PREMIUM'
                                ? 'bg-amber-100 text-amber-700'
                                : revenue.quality === 'STANDARD'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600'
                        }`}>
                            {revenue.quality}
                        </span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                            {new Date(revenue.harvestDate || revenue.createdAt).toLocaleDateString()}
                                                        {isRecent && (
                                                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-medium">
                                    NEW
                                </span>
                                                        )}
                        </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            {revenue.supplierId === 10 ? (
                                <span className="flex items-center gap-1">
                                    <FaHome className="text-green-500 text-xs" /> Own Farm
                                </span>
                            ) : revenue.supplierName ? (
                                <span className="flex items-center gap-1">
                                    <FaUsers className="text-blue-500 text-xs" /> {revenue.supplierName}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <FaMapPin className="text-gray-400 text-xs" /> Processing
                                </span>
                            )}
                        </span>
                                                    <span className="text-lg font-bold text-green-700">
                            {new Intl.NumberFormat('fr-FR').format(revenue.totalAmount)}
                        </span>
                                                </div>

                                                <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                                                    <span>Batch: {revenue.batchNumber || '—'}</span>
                                                    {revenue.buyer && <span>Buyer: {revenue.buyer}</span>}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
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
                                    <div className="text-lg font-bold text-amber-700">
                                        {revenueByBlock.length > 0
                                            ? revenueByBlock[revenueByBlock.length - 1].blockName
                                            : '—'}
                                    </div>
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
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <Typography variant="small" className="text-gray-500">
                                    <FaLightbulb className="inline mr-1 text-amber-500 text-xs" />
                                    Farm-wide expenses allocated equally: <strong>{new Intl.NumberFormat('fr-FR').format(perBlockAllocation)} FCFA</strong> per block
                                </Typography>
                            </div>
                            <div className="hidden md:block overflow-x-auto">
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
                                                {block.totalRevenue > 0 ? new Intl.NumberFormat('fr-FR').format(block.totalRevenue) : '—'}
                                            </td>
                                            <td className="py-3 text-right text-red-600">
                                                {block.directExpenses > 0 ? new Intl.NumberFormat('fr-FR').format(block.directExpenses) : '—'}
                                            </td>
                                            <td className="py-3 text-right">
                                                <span className="text-amber-600">{new Intl.NumberFormat('fr-FR').format(block.allocatedExpenses)}</span>
                                                <span className="block text-[10px] text-gray-400 leading-tight">farm-wide</span>
                                            </td>
                                            <td className="py-3 text-right font-bold">
                                            <span className={block.profit >= 0 ? 'text-primary' : 'text-red-600'}>
                                                {new Intl.NumberFormat('fr-FR').format(block.profit)}
                                            </span>
                                            </td>
                                            <td className="py-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                 block.roi > 200 ? 'bg-green-100 text-green-700' : block.roi > 100 ? 'bg-blue-100 text-blue-700' :
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
                            {/* Mobile Cards - visible only on mobile */}
                            <div className="md:hidden space-y-3">
                                {revenueByBlock.map((block, idx) => (
                                    <motion.div
                                        key={block.blockId}
                                        className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30 space-y-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg">
                                                 {idx === 0 && <FaTrophy className="text-yellow-500 inline" />}
                                                {idx === 1 && <FaMedal className="text-gray-400 inline" />}
                                                {idx === 2 && <FaAward className="text-amber-700 inline" />}
                                                     {idx > 2 && `#${idx + 1}`}
                                            </span>
                                                <span className="font-bold text-primary text-lg">{block.blockName}</span>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                                block.roi > 200 ? 'bg-green-100 text-green-700' :
                                                    block.roi > 100 ? 'bg-blue-100 text-blue-700' :
                                                        block.roi > 0 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                            }`}>
                    {block.roi.toFixed(0)}% ROI
                </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                            <span className="text-gray-500">Revenue</span>
                                            <span className="text-right text-green-700 font-medium">
                    {block.totalRevenue > 0 ? new Intl.NumberFormat('fr-FR').format(block.totalRevenue) : '—'}
                </span>
                                            <span className="text-gray-500">Direct Exp.</span>
                                            <span className="text-right text-red-600">
                    {block.directExpenses > 0 ? new Intl.NumberFormat('fr-FR').format(block.directExpenses) : '—'}
                </span>
                                            <span className="text-gray-500">Allocated</span>
                                            <span className="text-right text-amber-600">
                    {new Intl.NumberFormat('fr-FR').format(block.allocatedExpenses)}
                </span>
                                            <span className="text-gray-500 font-semibold">Profit</span>
                                            <span className={`text-right font-bold ${block.profit >= 0 ? 'text-primary' : 'text-red-600'}`}>
                    {new Intl.NumberFormat('fr-FR').format(block.profit)}
                </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {revenueByBlock.length === 0 && (
                                <div className="text-center py-8 text-gray-400">
                                    No block revenue data available yet.
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                )}

                {/* Phase 3: Harvest Cycle Intelligence */}
                <Section className="py-6">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <InfoCard
                                icon={FaChartLine}
                                title="Harvest Cycle Intelligence"
                                subtitle="Profit per kg, margin trends, and procurement forecasting"
                                iconColor="text-primary"
                                showInfoBadge={false}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                    {/* Profit per kg by source */}
                                    <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                        <h4 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                            <FaDollarSign className="text-green-600" />
                                            Profit per kg
                                        </h4>
                                        {(() => {
                                            const farmRevenues = revenues.filter(r => r.supplierId === 10);
                                            const farmQty = farmRevenues.reduce((s, r) => s + (r.quantityKg || 0), 0);
                                            const farmRev = farmRevenues.reduce((s, r) => s + (r.totalAmount || 0), 0);
                                            const farmCost = expenses.filter(e => e.category !== 'PROCUREMENT').reduce((s, e) => s + (e.amount || 0), 0);
                                            const farmProfitPerKg = farmQty > 0 ? (farmRev - farmCost) / farmQty : 0;

                                            const supplierRevenues = revenues.filter(r => r.supplierId && r.supplierId !== 10);
                                            const supplierQty = supplierRevenues.reduce((s, r) => s + (r.quantityKg || 0), 0);
                                            const supplierRev = supplierRevenues.reduce((s, r) => s + (r.totalAmount || 0), 0);
                                            const supplierCost = expenses.filter(e => e.category === 'PROCUREMENT').reduce((s, e) => s + (e.amount || 0), 0);
                                            const supplierProfitPerKg = supplierQty > 0 ? (supplierRev - supplierCost) / supplierQty : 0;

                                            return (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FaHome className="text-green-500 text-[10px]" /> Own Farm
                                        </span>
                                                        <span className={`font-bold text-sm ${farmProfitPerKg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {new Intl.NumberFormat('fr-FR').format(Math.round(farmProfitPerKg))} FCFA/kg
                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FaUsers className="text-blue-500 text-[10px]" /> Suppliers
                                        </span>
                                                        <span className={`font-bold text-sm ${supplierProfitPerKg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {new Intl.NumberFormat('fr-FR').format(Math.round(supplierProfitPerKg))} FCFA/kg
                                        </span>
                                                    </div>
                                                    <div className="pt-2 border-t border-gray-200">
                                                        <p className="text-[10px] text-gray-400">
                                                            {farmProfitPerKg > supplierProfitPerKg
                                                                ? 'Own farm yields more profit per kg than supplier sourcing.'
                                                                : 'Supplier sourcing yields more profit per kg than own farm.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Margin Trend */}
                                    <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                        <h4 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                            <FaChartLine className="text-accent" />
                                            Margin Summary
                                        </h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Own Farm Margin', value: (() => {
                                                        const rev = revenues.filter(r => r.supplierId === 10).reduce((s, r) => s + (r.totalAmount || 0), 0);
                                                        const cost = expenses.filter(e => e.category !== 'PROCUREMENT').reduce((s, e) => s + (e.amount || 0), 0);
                                                        return rev > 0 ? ((rev - cost) / rev * 100) : 0;
                                                    })(), color: 'text-green-600', bar: 'bg-green-500' },
                                                { label: 'Supplier Margin', value: (() => {
                                                        const rev = revenues.filter(r => r.supplierId && r.supplierId !== 10).reduce((s, r) => s + (r.totalAmount || 0), 0);
                                                        const cost = expenses.filter(e => e.category === 'PROCUREMENT').reduce((s, e) => s + (e.amount || 0), 0);
                                                        return rev > 0 ? ((rev - cost) / rev * 100) : 0;
                                                    })(), color: 'text-blue-600', bar: 'bg-blue-500' },
                                                { label: 'Overall Margin', value: profitMargin, color: 'text-primary', bar: 'bg-primary' },
                                            ].map((item, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-500">{item.label}</span>
                                                        <span className={`font-medium ${item.color}`}>{item.value.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <motion.div
                                                            className={`${item.bar} h-2 rounded-full`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min(item.value, 100)}%` }}
                                                            transition={{ duration: 1, delay: i * 0.1 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Procurement Forecast */}
                                    <div className="bg-white/40 rounded-xl p-4 border border-white/30">
                                        <h4 className="text-sm font-medium text-primary mb-3 flex items-center gap-2">
                                            <FaBox className="text-amber-500" />
                                            Procurement Forecast
                                        </h4>
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    label: 'Network Capacity',
                                                    value: supplierCapacity > 0 ? `${(supplierCapacity / 1000).toFixed(0)}T` : '—',
                                                    hint: `${supplierCount} suppliers with volume data`
                                                },
                                                {
                                                    label: 'Current Cycle Procured',
                                                    value: (() => {
                                                        const qty = revenues.reduce((s, r) => s + (r.quantityKg || 0), 0);
                                                        return qty > 0 ? `${(qty / 1000).toFixed(0)}T` : '—';
                                                    })(),
                                                    hint: `${revenues.length} transactions`
                                                },
                                                {
                                                    label: 'Utilization Rate',
                                                    value: (() => {
                                                        const procured = revenues.reduce((s, r) => s + (r.quantityKg || 0), 0);
                                                        return supplierCapacity > 0 ? `${((procured / supplierCapacity) * 100).toFixed(0)}%` : '—';
                                                    })(),
                                                    hint: supplierCapacity > 0 && revenues.reduce((s, r) => s + (r.quantityKg || 0), 0) < supplierCapacity
                                                        ? `${(supplierCapacity - revenues.reduce((s, r) => s + (r.quantityKg || 0), 0)) > 0 ? `${((supplierCapacity - revenues.reduce((s, r) => s + (r.quantityKg || 0), 0)) / 1000).toFixed(0)}T` : '0'} untapped capacity`
                                                        : 'Fully utilized'
                                                },
                                            ].map((item, i) => (
                                                <div key={i} className="text-center">
                                                    <div className="text-lg font-bold text-primary">{item.value}</div>
                                                    <div className="text-xs text-gray-500">{item.label}</div>
                                                    <div className="text-[10px] text-gray-400">{item.hint}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>
                        </motion.div>
                    </div>
                </Section>

                {/* Expenses Table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <GlassCard>
                        <div className="flex flex-col gap-1 mb-4">
                            <div className="flex items-center gap-2">
                                <FaTable className="text-primary text-xl" />
                                <Typography variant="h4" className="text-primary">Expense History</Typography>
                            </div>
                            <Typography variant="small" className="text-gray-500">
                                <FaLightbulb className="inline mr-1 text-amber-500 text-xs" />
                                Farm-wide operational expenses are divided equally across 35 blocks. Procurement costs are tracked separately per supplier.
                            </Typography>
                        </div>
                        {/* Desktop Table - hidden on mobile */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="pb-3 font-medium text-gray-600">Date</th>
                                    <th className="pb-3 font-medium text-gray-600">Category</th>
                                    <th className="pb-3 font-medium text-gray-600">Scope</th>
                                    <th className="pb-3 font-medium text-gray-600">Description</th>
                                    <th className="pb-3 font-medium text-gray-600 text-right">Amount</th>
                                    <th className="pb-3 font-medium text-gray-600 text-right">Per Block</th>
                                </tr>
                                </thead>
                                <tbody>
                                {expenses
                                    .sort((a, b) => (b.date || 0) - (a.date || 0))
                                    .slice(0, expensePage * ITEMS_PER_PAGE)
                                    .map((expense: any, i: number) => {
                                        const isFarmWide = !expense.blockId && expense.category !== 'PROCUREMENT';
                                        const isProcurement = expense.category === 'PROCUREMENT';
                                        const perBlockAmount = isFarmWide ? (expense.amount || 0) / 35 : expense.amount;
                                        return (
                                            <motion.tr
                                                key={expense.id}
                                                className="border-b border-gray-100 last:border-0 hover:bg-white/30 transition-colors cursor-pointer"
                                                onClick={() => setSelectedExpense(expense)}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <td className="py-3 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                                                <td className="py-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                expense.category === 'LAND_CLEARING' ? 'bg-amber-50 text-amber-700' :
                                    expense.category === 'LABOR' ? 'bg-blue-50 text-blue-700' :
                                        expense.category === 'PLOWING' ? 'bg-green-50 text-green-700' :
                                            expense.category === 'FENCING' ? 'bg-purple-50 text-purple-700' :
                                                expense.category === 'SEEDLINGS' ? 'bg-emerald-50 text-emerald-700' :
                                                    expense.category === 'FERTILIZER' ? 'bg-lime-50 text-lime-700' :
                                                        expense.category === 'IRRIGATION' ? 'bg-cyan-50 text-cyan-700' :
                                                            expense.category === 'SECURITY' ? 'bg-slate-100 text-slate-700' :
                                                                'bg-red-50 text-red-600'
                            }`}>
                                {expense.category?.replace(/_/g, ' ')}
                            </span>
                                                </td>
                                                <td className="py-3">
                                                    {isProcurement ? (
                                                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full inline-flex items-center gap-1">
                                                            <FaBox className="text-[10px]" /> Procurement
                                                        </span>
                                                    ) : isFarmWide ? (
                                                        <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full inline-flex items-center gap-1">
                                                            <FaGlobeAfrica className="text-[10px]" /> Farm-wide
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full inline-flex items-center gap-1">
                                                            <FaMapPin className="text-[10px]" /> Block {BLOCK_NAMES[expense.blockId] || expense.blockId}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-gray-600 text-xs max-w-[200px] truncate" title={expense.description}>
                                                    {expense.description || '—'}
                                                </td>
                                                <td className="py-3 text-right font-medium text-red-600">
                                                    {new Intl.NumberFormat('fr-FR').format(expense.amount)}
                                                </td>
                                                <td className="py-3 text-right text-xs">
                                                    {isProcurement ? (
                                                        <span className="text-gray-400">N/A</span>
                                                    ) : isFarmWide ? (
                                                        <span className="text-gray-500">
                                                            {new Intl.NumberFormat('fr-FR').format(perBlockAmount)}
                                                            <span className="block text-[10px] text-gray-400">÷ 35 blocks</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards - visible only on mobile */}
                        <div className="md:hidden space-y-3">
                            {expenses
                                .sort((a, b) => (b.date || 0) - (a.date || 0))
                                .slice(0, expensePage * ITEMS_PER_PAGE)
                                .map((expense: any, i: number) => {
                                    const isFarmWide = !expense.blockId && expense.category !== 'PROCUREMENT';
                                    const isProcurement = expense.category === 'PROCUREMENT';
                                    const perBlockAmount = isFarmWide ? (expense.amount || 0) / 35 : expense.amount;
                                    return (
                                        <motion.div
                                            key={expense.id}
                                            className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30 space-y-2 cursor-pointer"
                                            onClick={() => setSelectedExpense(expense)}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            expense.category === 'LAND_CLEARING' ? 'bg-amber-50 text-amber-700' :
                                expense.category === 'LABOR' ? 'bg-blue-50 text-blue-700' :
                                    expense.category === 'PLOWING' ? 'bg-green-50 text-green-700' :
                                        expense.category === 'FENCING' ? 'bg-purple-50 text-purple-700' :
                                            expense.category === 'SEEDLINGS' ? 'bg-emerald-50 text-emerald-700' :
                                                expense.category === 'FERTILIZER' ? 'bg-lime-50 text-lime-700' :
                                                    expense.category === 'IRRIGATION' ? 'bg-cyan-50 text-cyan-700' :
                                                        expense.category === 'SECURITY' ? 'bg-slate-100 text-slate-700' :
                                                            'bg-red-50 text-red-600'
                        }`}>
                            {expense.category?.replace(/_/g, ' ')}
                        </span>
                                                <span className="text-xs text-gray-400">
                            {new Date(expense.date).toLocaleDateString()}
                        </span>
                                            </div>

                                            <p className="text-xs text-gray-600">{expense.description || '—'}</p>

                                            <div className="flex items-center justify-between">
                                                {isProcurement ? (
                                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full inline-flex items-center gap-1">
                                                        <FaBox className="text-[10px]" /> Procurement
                                                    </span>
                                                ) : isFarmWide ? (
                                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full inline-flex items-center gap-1">
                                                        <FaGlobeAfrica className="text-[10px]" /> Farm-wide
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full inline-flex items-center gap-1">
                                                        <FaMapPin className="text-[10px]" /> Block {BLOCK_NAMES[expense.blockId] || expense.blockId}
                                                    </span>
                                                )}
                                                <div className="text-right">
                                                    <div className="font-bold text-red-600">
                                                        {new Intl.NumberFormat('fr-FR').format(expense.amount)}
                                                    </div>
                                                    {isFarmWide && (
                                                        <div className="text-[10px] text-gray-400">
                                                            {new Intl.NumberFormat('fr-FR').format(perBlockAmount)} / block
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
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


                {/* Photo Gallery */}
                {selectedExpense && expensePhotos.filter(p => p.expenseId === selectedExpense.id).length > 0 && (
                    <div className="mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 mb-20 max-w-2xl mx-auto relative z-20"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <Typography variant="small" className="text-gray-500">
                                    Showing photos for: <span className="font-medium text-primary">{selectedExpense.description || `Expense #${selectedExpense.id}`}</span>
                                </Typography>
                                <button
                                    onClick={() => setSelectedExpense(null)}
                                    className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                                >
                                    <FaTimes className="text-xs" />
                                    Clear selection
                                </button>
                            </div>
                            <PhotoGallery
                                photos={expensePhotos}
                                entityType="expense"
                                entityId={selectedExpense.id}
                                entityName={selectedExpense.description || `Expense #${selectedExpense.id}`}
                                title="Expense Photos"
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Financials;