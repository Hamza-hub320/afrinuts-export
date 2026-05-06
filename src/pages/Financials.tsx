
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaDollarSign, FaChartLine, FaChartBar, FaChartPie, FaTable } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import { getMockData } from '../services/mockData';
import { callApi } from '../services/api';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Section from '@/components/Section/Section';
import { useNavigate } from 'react-router-dom';

const isDevelopment = import.meta.env.DEV;
const COLORS = ['#5A7411', '#E04E00', '#A0C800', '#253746', '#698714'];

const FinancialReport = ({ revenues, expenses, totalRevenue, totalExpenses, netProfit, profitMargin }: any) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>AfriNuts Export — Financial Report</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 10, marginTop: 4 }}>
                    Generated: {new Date().toLocaleDateString('en-GB')}
                </Text>
            </View>

            {/* KPI Cards */}
            <View style={styles.kpiRow}>
                <View style={styles.kpiCard}>
                    <Text style={{ fontSize: 10, color: '#6B7280' }}>Total Revenue</Text>
                    <Text style={{ fontSize: 18, color: '#16A34A', fontWeight: 'bold' }}>
                        {totalRevenue.toLocaleString('fr-FR')} FCFA
                    </Text>
                </View>
                <View style={{ ...styles.kpiCard, borderLeftColor: '#DC2626' }}>
                    <Text style={{ fontSize: 10, color: '#6B7280' }}>Total Expenses</Text>
                    <Text style={{ fontSize: 18, color: '#DC2626', fontWeight: 'bold' }}>
                        {totalExpenses.toLocaleString('fr-FR')} FCFA
                    </Text>
                </View>
                <View style={styles.kpiCard}>
                    <Text style={{ fontSize: 10, color: '#6B7280' }}>Net Profit</Text>
                    <Text style={{ fontSize: 18, color: '#5A7411', fontWeight: 'bold' }}>
                        {netProfit.toLocaleString('fr-FR')} FCFA
                    </Text>
                    <Text style={{ fontSize: 8, color: '#6B7280' }}>{profitMargin.toFixed(1)}% margin</Text>
                </View>
            </View>

            {/* Revenue Table */}
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#5A7411', marginBottom: 8, marginTop: 20 }}>
                Revenue History
            </Text>
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderCell}>Date</Text>
                    <Text style={styles.tableHeaderCell}>Quality</Text>
                    <Text style={{ ...styles.tableHeaderCell, textAlign: 'right' }}>Amount (FCFA)</Text>
                </View>
                {revenues.map((r: any, i: number) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={{ flex: 1, fontSize: 9 }}>{new Date(r.harvestDate).toLocaleDateString()}</Text>
                        <Text style={{ flex: 1, fontSize: 9 }}>{r.quality}</Text>
                        <Text style={{ flex: 1, fontSize: 9, textAlign: 'right' }}>{r.totalAmount.toLocaleString('fr-FR')}</Text>
                    </View>
                ))}
            </View>

            {/* Footer */}
            <Text style={styles.footer}>AfriNuts Export — Confidential — Page 1</Text>
        </Page>
    </Document>
);

// Styles for the PDF
const styles = StyleSheet.create({
    page: { padding: 40, backgroundColor: '#FFFFFF' },
    header: { backgroundColor: '#5A7411', padding: 20, marginBottom: 20, borderRadius: 8 },
    headerText: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Helvetica-Bold' },
    kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    kpiCard: { flex: 1, backgroundColor: '#F5F5F5', padding: 16, borderRadius: 8, borderLeft: 4, borderLeftColor: '#5A7411' },
    table: { marginTop: 10 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#5A7411', padding: 8, borderRadius: 4 },
    tableHeaderCell: { flex: 1, color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
    tableRow: { flexDirection: 'row', borderBottom: '1px solid #E5E7EB', padding: 8 },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#9CA3AF', fontSize: 8 },
});


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
    const [revenues, setRevenues] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [revenuePage, setRevenuePage] = useState(1);
    const [expensePage, setExpensePage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const handleExportPDF = async () => {
        // Target the dashboard content, not the entire page
        const element = document.querySelector('.dashboard-content') as HTMLElement;
        if (!element) {
            alert('Dashboard content not found. Please try again.');
            return;
        }

        try {
            // Show loading state
            const btn = document.querySelector('.export-btn') as HTMLButtonElement;
            if (btn) btn.textContent = 'Generating PDF...';

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                // Convert SVGs to images for Recharts compatibility
                onclone: (clonedDoc) => {
                    const svgs = clonedDoc.querySelectorAll('svg');
                    svgs.forEach(svg => {
                        svg.style.width = svg.getBoundingClientRect().width + 'px';
                        svg.style.height = svg.getBoundingClientRect().height + 'px';
                    });
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Add branded header
            pdf.setFillColor(90, 116, 17); // Primary color
            pdf.rect(0, 0, 210, 20, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(12);
            pdf.text('AfriNuts Export — Financial Report', 10, 13);

            const today = new Date().toLocaleDateString('en-GB');
            pdf.setFontSize(8);
            pdf.text(`Generated: ${today}`, 180, 13, { align: 'right' });

            // Add content
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 25;

            if (imgHeight <= 250) {
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            } else {
                // Multi-page
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= 270;
                while (heightLeft > 0) {
                    position = heightLeft - imgHeight + 25;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= 270;
                }
            }

            // Footer
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(7);
                pdf.setTextColor(128, 128, 128);
                pdf.text(`AfriNuts Export — Confidential — Page ${i} of ${pageCount}`, 105, 295, { align: 'center' });
            }

            pdf.save(`afrinuts-financial-report-${today.replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            const btn = document.querySelector('.export-btn') as HTMLButtonElement;
            if (btn) btn.innerHTML = '<FaFilePdf /> Export PDF Report';
        }
    };

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
                setRevenues(revenueData.revenues || []);
                setExpenses(expenseData.expenses || []);
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

            {/* Hero Header - matching Dashboard style */}
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
                            <Typography
                                variant="h2"
                                className="mb-4 text-primary"
                            >
                                Financial Performance at a Glance
                            </Typography>
                            <Typography
                                variant="lead"
                                className="text-text-dark max-w-3xl mx-auto mb-8"
                            >
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
                {/* Export Button */}
                <div className="flex justify-end mb-8">
                    {revenues.length > 0 && (
                        <PDFDownloadLink
                            document={
                                <FinancialReport
                                    revenues={revenues}
                                    totalRevenue={totalRevenue}
                                    totalExpenses={totalExpenses}
                                    netProfit={netProfit}
                                    profitMargin={profitMargin}
                                />
                            }
                            fileName={`afrinuts-financial-report-${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`}
                        >
                            {({ loading }) => (
                                <motion.button
                                    className="export-btn flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-md"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={loading}
                                >
                                    <FaFilePdf /> {loading ? 'Generating PDF...' : 'Export PDF Report'}
                                </motion.button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>

                {/* KPI Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <GlassCard>
                        <motion.div variants={fadeIn} className="text-center">
                            <motion.div
                                className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
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
                            <motion.div
                                className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
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
                            <motion.div
                                className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
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

                {/* Charts */}
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
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

                {/* Revenue Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <GlassCard className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FaTable className="text-primary text-xl" />
                            <Typography variant="h4" className="text-primary">Revenue History</Typography>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="pb-3 font-medium text-gray-600">Date</th>
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
                                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                                {revenue.quality}
                                            </span>
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

                {/* Expenses Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
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
                                            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
                                                {expense.category}
                                            </span>
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
                                        Turn Insights Into Action
                                    </Typography>
                                    <Typography variant="body" className="mb-8 text-gray-700 max-w-3xl mx-auto">
                                        Numbers tell the story — now write the next chapter. Dive back into
                                        operations, assign tasks, or generate a shareable PDF report for stakeholders.
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
                                            <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                            <FaChartLine className="text-lg" />
                                            Back to Dashboard
                                        </span>
                                        </motion.button>
                                        <motion.button
                                            className="relative border-2 border-primary/50 text-primary hover:bg-white/20 px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden backdrop-blur-sm"
                                            variants={fadeIn}
                                            onClick={handleExportPDF}
                                            whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 25px -5px rgba(165, 105, 66, 0.2)' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                        <span className="relative z-10 font-medium text-lg flex items-center gap-2">
                                            <FaFilePdf className="text-lg" />
                                            Export PDF Report
                                        </span>
                                        </motion.button>
                                    </div>
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