import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaChartLine, FaIndustry, FaLeaf, FaShieldAlt, FaUsers,
    FaArrowRight, FaDownload, FaHandshake, FaCalendarAlt, FaFileContract, FaCheckCircle,
    FaHeart, FaSolarPanel, FaGlobeAfrica, FaChartPie,
    FaMoneyBillWave, FaBuilding, FaSeedling, FaInfoCircle, FaChartBar, FaCrown, FaRecycle
} from 'react-icons/fa';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Legend
} from 'recharts';
import { Cell as PieCell } from 'recharts';
import Section from '@/components/Section/Section';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { CertificationsCard } from '@/components/CertificationsCard/CertificationsCard';
import { fadeIn, staggerContainer } from '@/utils/animations';
import JsonLd from '@/components/Seo/JsonLd';
import { Helmet } from 'react-helmet-async';
import ndaPDF from '@/assets/documents/nda-afrinuts.pdf';
import ceoImage from '@/assets/images/ceo.webp';
import cfoImage from '@/assets/images/cfo.webp';
import ccoImage from '@/assets/images/cco.webp';
import opsImage from '@/assets/images/ops-manager.webp';
import adminImage from '@/assets/images/admin-manager.webp';
import farmManagerImage from '@/assets/images/farm-manager.webp';

const Invest: React.FC = () => {
    const { t } = useTranslation('invest');
    const navigate = useNavigate();

    const capitalAllocation = [
        { name: t('capitalAllocation.construction'), value: 350000, color: '#5A7411' },
        { name: t('capitalAllocation.machinery'), value: 400000, color: '#E04E00' },
        { name: t('capitalAllocation.workingCapital'), value: 275000, color: '#A0C800' },
        { name: t('capitalAllocation.powerWater'), value: 120000, color: '#253746' },
        { name: t('capitalAllocation.certifications'), value: 50000, color: '#698714' },
        { name: t('capitalAllocation.contingency'), value: 25000, color: '#9C3D10' },
    ];

    const certifications = t('certifications.items', { returnObjects: true }) as any[];

    const heroKPIs = [
        { icon: FaMoneyBillWave, label: t('hero.kpis.targetRaise'), value: '$1.25M' },
        { icon: FaChartPie, label: t('hero.kpis.equityOffered'), value: '25%' },
        { icon: FaBuilding, label: t('hero.kpis.postMoneyVal'), value: '$5M' },
        { icon: FaCalendarAlt, label: t('hero.kpis.dividendsStart'), value: '2033' },
    ];

    const opportunityCards = [
        { icon: FaGlobeAfrica, key: 'producer' },
        { icon: FaIndustry, key: 'firstMover' },
        { icon: FaChartLine, key: 'margin' },
    ];

    const operationalItems = [
        { text: t('funding.operational.items.farm'), icon: FaSeedling },
        { text: t('funding.operational.items.organic'), icon: FaLeaf },
        { text: t('funding.operational.items.financed'), icon: FaMoneyBillWave },
    ];

    const supplyChainItems = [
        { text: t('funding.supplyChain.items.harvest'), icon: FaCalendarAlt },
        { text: t('funding.supplyChain.items.cooperative'), icon: FaUsers },
        { text: t('funding.supplyChain.items.supply'), icon: FaIndustry },
    ];

    const returnKPIs = [
        { label: t('returns.kpis.investment'), value: '$1,250,000', sub: t('returns.kpis.equityStake'), icon: FaMoneyBillWave },
        { label: t('returns.kpis.postMoneyVal'), value: '$5,000,000', sub: t('returns.kpis.assetBacked'), icon: FaBuilding },
        { label: t('returns.kpis.dividendsBegin'), value: '2033', sub: t('returns.kpis.yearThree'), icon: FaCalendarAlt },
        { label: t('returns.kpis.annualDividend'), value: '$56,250', sub: t('returns.kpis.growingTo'), icon: FaChartLine },
    ];

    const dividendRows = t('returns.dividendTable.rows', { returnObjects: true }) as any[];

    const unitEconomics = [
        { label: t('returns.unitEconomics.rcnCost'), value: '~$1,200/ton', desc: t('returns.unitEconomics.rcnDesc'), icon: FaSeedling, color: 'text-accent' },
        { label: t('returns.unitEconomics.kernelPrice'), value: '~$6,500/ton', desc: t('returns.unitEconomics.kernelDesc'), icon: FaChartLine, color: 'text-accent' },
        { label: t('returns.unitEconomics.valueAdded'), value: '5.4x', desc: t('returns.unitEconomics.valueDesc'), icon: FaIndustry, color: 'text-accent' },
        { label: t('returns.unitEconomics.cnsl'), value: '~$450/ton', desc: t('returns.unitEconomics.cnslDesc'), icon: FaRecycle, color: 'text-accent' },
    ];

    const competitiveRows = t('competitiveAnalysis.rows', { returnObjects: true }) as any[];

    const riskItems = (t('risk.items', { returnObjects: true }) as { risk: string; mitigation: string }[]) || [];

    const impactMetrics = [
        { icon: FaUsers, value: '150+', label: t('impact.jobs'), desc: t('impact.jobsDesc'), color: 'text-accent' },
        { icon: FaHeart, value: '200+', label: t('impact.farmers'), desc: t('impact.farmersDesc'), color: 'text-accent' },
        { icon: FaChartLine, value: '10%', label: t('impact.reinvestment'), desc: t('impact.reinvestmentDesc'), color: 'text-accent' },
        { icon: FaSolarPanel, value: '40%', label: t('impact.energy'), desc: t('impact.energyDesc'), color: 'text-accent' },
    ];

    const teamMembers = t('team.members', { returnObjects: true }) as any[];
    const teamImageMap: Record<string, string> = {
        ceo: ceoImage, cfo: cfoImage, cco: ccoImage, ops: opsImage, admin: adminImage, farm: farmManagerImage,
    };

    return (
        <div className="min-h-screen pt-[72px] font-sans bg-[var(--background)] text-[var(--text-dark)]">
            <Helmet>
                <title>{t('seo.title')}</title>
                <meta name="description" content={t('seo.description')} />
                <link rel="canonical" href="https://www.afrinutsexport.com/invest" />
            </Helmet>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", "name": t('seo.title'), "description": t('seo.description') }} />

            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[50vh]">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-12" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaChartPie className="inline mr-3 text-accent" />{t('hero.subtitle')}
                        </Typography>
                    </motion.div>
                    <motion.h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>{t('hero.title')}</motion.h1>
                    <motion.div variants={fadeIn}><Typography variant="lead" className="text-text-dark max-w-3xl mx-auto mb-8">{t('hero.tagline')}</Typography></motion.div>
                    <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                        {heroKPIs.map((kpi, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}>
                                <InfoCard icon={kpi.icon} title={kpi.value} subtitle={kpi.label} iconColor="text-accent" showInfoBadge={false} className="h-full text-center" />
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href={ndaPDF} download className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center gap-2">
                            <div className="absolute inset-0 rounded-full border-2 border-white/30" /><div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                            <FaDownload className="relative z-10" /><span className="relative z-10">{t('hero.downloadNda')}</span>
                        </a>
                        <motion.button onClick={() => navigate('/contact')} className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full transform-gpu font-medium inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm" whileHover={{ y: -2 }}>
                            <FaHandshake />{t('hero.scheduleCall')}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Opportunity */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('opportunity.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">{t('opportunity.body')}</Typography>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-6">
                    {opportunityCards.map((item, idx) => (
                        <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                            <InfoCard icon={item.icon} title={t(`opportunity.cards.${item.key}.title`)} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                <Typography variant="small" className="text-gray-600 mb-4">{t(`opportunity.cards.${item.key}.desc`)}</Typography>
                                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-bold mb-3">{t(`opportunity.cards.${item.key}.stat`)}</span>
                                <ul className="space-y-1.5 border-t border-gray-100 pt-3">
                                    {(t(`opportunity.cards.${item.key}.highlights`, { returnObjects: true }) as string[]).map((h, i) => (
                                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600"><FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-[10px]" />{h}</li>
                                    ))}
                                </ul>
                            </InfoCard>
                        </motion.div>
                    ))}
                </div>
            </div></Section>

            {/* Total Addressable Market */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('marketSize.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">{t('marketSize.subtitle')}</Typography>
                    </motion.div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { value: '$8.5B+', label: t('marketSize.globalMarket.title'), sub: t('marketSize.globalMarket.growth'), icon: FaGlobeAfrica },
                            { value: '1.2M+ MT', label: t('marketSize.ivoryCoast.title'), sub: t('marketSize.ivoryCoast.gap'), icon: FaChartBar },
                            { value: '$500M+', label: t('marketSize.ourTarget.title'), sub: t('marketSize.ourTarget.description'), icon: FaChartLine },
                            { value: '4-5%', label: t('marketSize.growthRate'), sub: t('marketSize.growthDesc'), icon: FaArrowRight },
                        ].map((item, idx) => (
                            <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                <InfoCard icon={item.icon} title={item.value} subtitle={item.label} iconColor="text-accent" showInfoBadge={false} className="h-full text-center">
                                    <Typography variant="small" className="text-gray-500 text-xs">{item.sub}</Typography>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-primary/5 rounded-xl p-4">
                        <Typography variant="small" className="text-gray-600 text-center">
                            <strong className="text-primary">{t('marketSize.driversTitle')}</strong>
                        </Typography>
                        <ul className="mt-2 space-y-1 text-xs text-gray-600 max-w-2xl mx-auto">
                            {(t('marketSize.drivers', { returnObjects: true }) as string[]).map((d, i) => (
                                <li key={i} className="flex items-start gap-1.5"><FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-[10px]" />{d}</li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </Section>

            {/* What You're Funding */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('funding.title')}</Typography>
                    <Typography variant="lead" className="max-w-3xl mx-auto text-gray-600">{t('funding.subtitle')}</Typography>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h3" className="text-primary flex items-center gap-2 mb-5"><FaCheckCircle className="text-green-500" />{t('funding.operational.title')}</Typography>
                        <div className="space-y-3">{operationalItems.map((item, idx) => (
                            <motion.div key={idx} className="flex items-start gap-4 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20" variants={fadeIn} transition={{ delay: idx * 0.1 }} whileHover={{ y: -2 }}>
                                <motion.div className="bg-primary p-2 rounded-full text-white mt-0.5 shadow-md" whileHover={{ scale: 1.15, rotate: 5 }}><item.icon className="text-lg" /></motion.div>
                                <Typography variant="body" className="flex-1 text-left">{item.text}</Typography>
                            </motion.div>
                        ))}</div>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.1 }}>
                        <Typography variant="h3" className="text-primary flex items-center gap-2 mb-5"><FaUsers className="text-accent" />{t('funding.supplyChain.title')}</Typography>
                        <div className="space-y-3">{supplyChainItems.map((item, idx) => (
                            <motion.div key={idx} className="flex items-start gap-4 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20" variants={fadeIn} transition={{ delay: idx * 0.1 }} whileHover={{ y: -2 }}>
                                <motion.div className="bg-accent p-2 rounded-full text-white mt-0.5 shadow-md" whileHover={{ scale: 1.15, rotate: 5 }}><item.icon className="text-lg" /></motion.div>
                                <Typography variant="body" className="flex-1 text-left">{item.text}</Typography>
                            </motion.div>
                        ))}</div>
                    </motion.div>
                </div>
                <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-6 relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-5 transform-gpu group max-w-2xl mx-auto" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }} whileHover={{ y: -4, scale: 1.02, boxShadow: '0 15px 30px -8px rgba(0,0,0,0.2)', transition: { duration: 0.3 } }}>
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" /><div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" /><div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
                    <Typography variant="body" className="text-primary-dark italic relative z-10 text-center">{t('funding.quote')}</Typography>
                </motion.div>
            </div></Section>

            {/* Charts Row — The Opportunity + Your Capital */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('charts.sectionTitle')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">
                            {t('charts.sectionBody')}
                        </Typography>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Bar Chart: Ivory Coast Processing Gap */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                            <InfoCard icon={FaChartBar} title={t('charts.processingGap.title')} subtitle={t('charts.processingGap.subtitle')} variant="primary" showInfoBadge={false}>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={[{ name: t('charts.processingGap.produced'), value: 1.2 }, { name: t('charts.processingGap.processed'), value: 0.18 }, { name: t('charts.processingGap.exported'), value: 1.02 }]} layout="vertical" margin={{ left: 60, right: 30, top: 10, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis type="number" domain={[0, 1.4]} tickFormatter={(v) => `${v}M MT`} /><YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} /><Tooltip formatter={(value: any) => `${Number(value).toFixed(2)}M MT`} />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]}><PieCell fill="#5A7411" /><PieCell fill="#E04E00" /><PieCell fill="#DEDAD4" /></Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-3 p-3 bg-primary/5 rounded-lg text-center"><Typography variant="small" className="text-gray-600"><span dangerouslySetInnerHTML={{ __html: t('charts.processingGap.note')}} /></Typography></div>
                            </InfoCard>
                        </motion.div>

                        {/* Capital Allocation — Donut Chart */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                            <InfoCard icon={() => <FaChartPie className="text-primary text-xl" />} title={t('charts.capitalAllocation.title')} subtitle="$1,250,000 Total" iconColor="text-primary" variant="accent" className="h-full" showInfoBadge={false}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart><Pie data={capitalAllocation} cx="50%" cy="50%" labelLine={true} label={({ name, percent }) => `${(name || 'Unknown').length > 12 ? (name || 'Unknown').substring(0, 12) + '…' : (name || 'Unknown')}: ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">{capitalAllocation.map((entry, index) => (<PieCell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} /><Legend /></PieChart>
                                </ResponsiveContainer>
                                <div className="mt-3 p-3 bg-primary/5 rounded-lg text-center"><Typography variant="small" className="text-gray-500">{t('charts.capitalAllocation.note')}</Typography></div>
                            </InfoCard>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* Returns */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('returns.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('returns.subtitle')}</Typography>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {returnKPIs.map((item, idx) => (
                        <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                            <InfoCard icon={item.icon} title={item.value} subtitle={item.label} iconColor="text-accent" showInfoBadge={false} className="h-full text-center"><Typography variant="small" className="text-gray-500 text-xs">{item.sub}</Typography></InfoCard>
                        </motion.div>
                    ))}
                </div>
                {/* Dividend Projection Table — Responsive */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-8">
                    <InfoCard icon={FaChartLine} title={t('returns.dividendTable.title')} variant="primary" showInfoBadge={false}>

                        {/* Desktop Table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="pb-2 font-medium text-gray-600">{t('returns.dividendTable.year')}</th>
                                    <th className="pb-2 font-medium text-gray-600 text-right">{t('returns.dividendTable.netProfit')}</th>
                                    <th className="pb-2 font-medium text-gray-600 text-right">{t('returns.dividendTable.dividendPool')}</th>
                                    <th className="pb-2 font-medium text-gray-600 text-right">{t('returns.dividendTable.investorShare')}</th>
                                    <th className="pb-2 font-medium text-gray-600 text-right">{t('returns.dividendTable.cumulative')}</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {dividendRows.map((row, idx) => (
                                    <tr key={idx} className={idx === 2 ? 'bg-primary/5 font-semibold' : 'hover:bg-white/20 transition-colors'}>
                                        <td className="py-2.5">{row.year}</td>
                                        <td className="py-2.5 text-right">${row.profit.toLocaleString()}</td>
                                        <td className="py-2.5 text-right">${row.pool.toLocaleString()}</td>
                                        <td className="py-2.5 text-right text-primary font-bold">${row.share.toLocaleString()}</td>
                                        <td className="py-2.5 text-right text-gray-500">${row.cum.toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-3">
                            {dividendRows.map((row, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`rounded-xl p-4 border ${idx === 2 ? 'bg-primary/5 border-primary/30' : 'bg-white/40 border-white/30 backdrop-blur-sm'}`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-lg font-bold ${idx === 2 ? 'text-primary' : 'text-gray-800'}`}>
                            {row.year}
                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${idx === 2 ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                            ${row.share.toLocaleString()}
                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                        <div>
                                            <span className="text-gray-400">{t('returns.dividendTable.netProfit')}</span>
                                            <p className="font-medium text-gray-700">${row.profit.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">{t('returns.dividendTable.dividendPool')}</span>
                                            <p className="font-medium text-gray-700">${row.pool.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">{t('returns.dividendTable.investorShare')}</span>
                                            <p className="font-bold text-primary">${row.share.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">{t('returns.dividendTable.cumulative')}</span>
                                            <p className="font-medium text-gray-600">${row.cum.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                            <Typography variant="small" className="text-gray-600 text-xs">
                                <span dangerouslySetInnerHTML={{ __html: t('returns.dividendTable.summary') }} />
                            </Typography>
                        </div>
                    </InfoCard>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {unitEconomics.map((item, idx) => (
                        <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }} className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-5 text-center transform-gpu overflow-hidden" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }} whileHover={{ y: -8, scale: 1.05, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" /><div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" /><div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.05)]" /><div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                            <div className="relative z-10"><motion.div className="p-3 rounded-full w-fit mx-auto mb-3 bg-white/50 backdrop-blur-md shadow-md" whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}><item.icon className={`text-xl ${item.color}`} /></motion.div><div className="text-2xl font-bold text-primary">{item.value}</div><div className="text-xs text-gray-500 mt-1 font-medium">{item.label}</div><div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div></div>
                        </motion.div>
                    ))}
                </div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-6 bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center max-w-2xl mx-auto"><Typography variant="small" className="text-amber-700 text-xs">{t('returns.disclaimer')}</Typography></motion.div>
            </div></Section>

            {/* Exit Strategy */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('exitStrategy.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('exitStrategy.subtitle')}</Typography>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {(t('exitStrategy.options', { returnObjects: true }) as any[]).map((opt, idx) => (
                            <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}
                                        className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                <Typography variant="h5" className="text-primary text-sm mb-1 flex items-center gap-1.5">
                                    <FaShieldAlt className="text-accent text-xs" />{opt.title}
                                </Typography>
                                <Typography variant="small" className="text-gray-600">{opt.description}</Typography>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                                className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center max-w-2xl mx-auto">
                        <Typography variant="small" className="text-amber-700 text-xs">{t('exitStrategy.liquidation')}</Typography>
                    </motion.div>
                </div>
            </Section>

            {/* Certifications */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('certifications.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">{t('certifications.body')}</Typography>
                </motion.div>
                <CertificationsCard certifications={certifications} title={t('certifications.cardTitle')} subtitle={t('certifications.cardSubtitle')} variant="primary" columns={5} />
            </div></Section>

            {/* Competitive Analysis */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}><Typography variant="h2" className="mb-4">{t('competitiveAnalysis.title')}</Typography></motion.div>
                <motion.div className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl overflow-hidden transform-gpu" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} whileHover={{ y: -5, scale: 1.01, rotateY: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', transition: { duration: 0.3 } }}>
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" /><div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" /><div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" /><div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                    <div className="relative z-10">
                        <div className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-white"><Typography variant="h3" className="!text-white">{t('competitiveAnalysis.tableTitle')}</Typography></div>
                        <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-200"><div className="flex items-start gap-2"><FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0 text-xs" /><Typography variant="small" className="text-amber-700 text-xs">{t('competitiveAnalysis.disclaimer')}</Typography></div></div>
                        <div className="hidden md:block overflow-x-auto"><table className="w-full"><thead><tr className="bg-white/30 backdrop-blur-sm"><th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveAnalysis.competitorType')}</th><th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveAnalysis.theirAdvantage')}</th><th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveAnalysis.theirDisadvantage')}</th><th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveAnalysis.ourStrategy')}</th></tr></thead><tbody className="divide-y divide-gray-200/50">{competitiveRows.map((row, idx) => (<tr key={idx} className={`${idx === 1 ? 'bg-white/10' : ''} hover:bg-white/20 transition-colors duration-300`}><td className="px-6 py-4 font-medium text-text-dark">{row.competitor}</td><td className="px-6 py-4 text-sm text-gray-600">{row.advantage}</td><td className="px-6 py-4 text-sm text-red-600">{row.weakness}</td><td className="px-6 py-4"><div className="flex items-start"><FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" /><span className="text-sm text-green-700">{row.strategy}</span></div></td></tr>))}</tbody></table></div>
                        <div className="md:hidden p-4 space-y-4">{competitiveRows.map((row, idx) => (<motion.div key={idx} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30" whileHover={{ y: -2 }}><h4 className="font-semibold text-primary mb-2">{row.competitor}</h4><div className="space-y-2 text-sm"><div><span className="font-medium">✓ {t('competitiveAnalysis.theirAdvantage')}:</span><p className="text-gray-600">{row.advantage}</p></div><div><span className="font-medium">✗ {t('competitiveAnalysis.theirDisadvantage')}:</span><p className="text-red-600">{row.weakness}</p></div><div className="bg-primary/10 p-3 rounded-lg mt-2"><span className="font-medium flex items-center gap-2"><FaShieldAlt className="text-primary" />{t('competitiveAnalysis.ourStrategy')}:</span><p className="text-green-700 mt-0.5">{row.strategy}</p></div></div></motion.div>))}</div>
                    </div>
                </motion.div>
                <div className="mt-8"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}><InfoCard icon={FaCrown} title={t('competitiveAnalysis.uniqueValueTitle')} variant="primary" showInfoBadge={false} className="text-center"><Typography variant="body" className="text-gray-700 max-w-3xl mx-auto">{t('competitiveAnalysis.uniqueValueDesc')}</Typography></InfoCard></motion.div></div>
            </div></Section>

            {/* Shariah + Risk */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="grid md:grid-cols-2 gap-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4 text-center">{t('shariah.title')}</Typography>
                    <InfoCard icon={FaHandshake} title={t('shariah.cardTitle')} variant="primary" showInfoBadge={false}>
                        <Typography variant="body" className="text-gray-600 mb-4">{t('shariah.body')}</Typography>
                        <ul className="space-y-2 text-sm">{(t('shariah.items', { returnObjects: true }) as string[]).map((item, i) => (<li key={i} className="flex items-start gap-2"><FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" /><span className="text-gray-700">{item}</span></li>))}</ul>
                    </InfoCard>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.1 }}>
                    <Typography variant="h2" className="mb-4 text-center">{t('risk.title')}</Typography>
                    <InfoCard icon={FaShieldAlt} title={t('risk.cardTitle')} variant="accent" showInfoBadge={false}>
                        <div className="space-y-3">{riskItems.map((item, idx) => (<div key={idx} className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/30"><Typography variant="h5" className="text-primary text-sm mb-1 flex items-center gap-1.5"><FaShieldAlt className="text-accent text-xs" />{item.risk}</Typography><Typography variant="small" className="text-gray-600">{item.mitigation}</Typography></div>))}</div>
                    </InfoCard>
                </motion.div>
            </div></div></Section>

            {/* Investor Protections */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('investorProtections.title')}</Typography>
                    </motion.div>
                    <InfoCard icon={FaShieldAlt} title={t('investorProtections.subtitle')} variant="primary" showInfoBadge={false}>
                        <div className="grid md:grid-cols-2 gap-3">
                            {(t('investorProtections.items', { returnObjects: true }) as string[]).map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2 bg-white/50 rounded-lg p-3 border border-white/30">
                                    <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                    <Typography variant="small" className="text-gray-700">{item}</Typography>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </div>
            </Section>

            {/* Impact */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}><Typography variant="h2" className="mb-4">{t('impact.title')}</Typography><Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('impact.subtitle')}</Typography></motion.div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{impactMetrics.map((metric, idx) => (<motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}><InfoCard icon={metric.icon} title={metric.value} subtitle={metric.label} iconColor={metric.color} showInfoBadge={false} className="h-full text-center"><Typography variant="small" className="text-gray-500 text-xs mt-2">{metric.desc}</Typography></InfoCard></motion.div>))}</div>
            </div></Section>

            {/* Social Proof */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('socialProof.title')}</Typography>
                    </motion.div>
                    <div className="max-w-2xl mx-auto">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-6 transform-gpu overflow-hidden"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ y: -4, scale: 1.02 }}>
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <div className="relative z-10 text-center">
                                <Typography variant="body" className="text-gray-700 italic mb-4">
                                    "{t('socialProof.testimonial')}"
                                </Typography>
                                <Typography variant="small" className="text-primary font-medium">{t('socialProof.attribution')}</Typography>
                                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                    <Typography variant="small" className="text-gray-600">{t('socialProof.description')}</Typography>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Section>

            {/* Team */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}><Typography variant="h2" className="mb-4">{t('team.title')}</Typography><Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('team.subtitle')}</Typography></motion.div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{teamMembers.map((member, idx) => (<motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }} className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-5 transform-gpu overflow-hidden" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }} whileHover={{ y: -6, scale: 1.03, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }}>
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" /><div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" /><div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.05)]" /><div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="relative mb-4"><img src={teamImageMap[member.imageKey]} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-white/40 shadow-md group-hover:scale-105 transition-transform duration-300" /><div className="absolute -bottom-1 -right-1 bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">{member.name.charAt(0)}</div></div>
                        <Typography variant="h4" className="text-primary">{member.name}</Typography><Typography variant="small" className="text-accent text-xs font-medium mt-0.5 mb-2">{member.position}</Typography><Typography variant="small" className="text-gray-600 text-xs leading-relaxed">{member.bio}</Typography>
                    </div>
                </motion.div>))}</div>
                <motion.div className="text-center mt-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <motion.button onClick={() => navigate('/executive-team')} className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-full transform-gpu transition-all duration-300 inline-flex items-center gap-2 text-sm font-medium bg-white/30 backdrop-blur-sm" whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }}><FaUsers className="text-sm" />{t('team.viewAll')}<FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" /></motion.button>
                </motion.div>
            </div></Section>

            {/* Final CTA */}
            <Section className="py-16"><div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <motion.div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu" style={{ transformStyle: 'preserve-3d' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} whileHover={{ y: -6, scale: 1.02 }}>
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20" /><div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                    <div className="relative z-10">
                        <Typography variant="h2" className="mb-4 text-primary">{t('cta.title')}</Typography>
                        <Typography variant="body" className="mb-6 text-gray-600 max-w-2xl mx-auto">{t('cta.body')}</Typography>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href={ndaPDF} download className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center gap-2"><div className="absolute inset-0 rounded-full border-2 border-white/30" /><FaFileContract className="relative z-10" /><span className="relative z-10">{t('cta.downloadNda')}</span></a>
                            <motion.button onClick={() => navigate('/contact')} className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full transform-gpu font-medium inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm" whileHover={{ y: -2 }}><FaHandshake />{t('cta.scheduleCall')}</motion.button>
                        </div>
                    </div>
                </motion.div>
            </div></Section>
            {/* Legal Disclaimer */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10 text-center">
                <Typography variant="small" className="text-gray-400 text-xs">
                    {t('legalDisclaimer.text')}
                </Typography>
                <Typography variant="small" className="text-gray-400 text-xs mt-2">
                    {t('legalDisclaimer.ndaRequired')}
                </Typography>
            </div>
        </div>
    );
};

export default Invest;