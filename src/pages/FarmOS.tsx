import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'react-icons/fa';
import Section from '@/components/Section/Section';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { fadeIn, staggerContainer } from '@/utils/animations';
import JsonLd from '@/components/Seo/JsonLd';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import farmOsHeroImage from '@/assets/images/farm-os-hero.webp';
import DashboardNavbar from "../components/DashboardNavbar/DashboardNavbar";
import {FaChartLine, FaSatelliteDish, FaShieldAlt} from "react-icons/fa";

const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? Icon : Icons.FaMobile;
};

const FarmOS: React.FC = () => {
    const { t } = useTranslation('farmOs');
    const navigate = useNavigate();

    const heroStats = t('hero.stats', { returnObjects: true }) as { label: string; icon: string; bg: string; text: string }[];
    const whyBuiltCards = t('whyBuilt.cards', { returnObjects: true }) as { old: string; new: string; icon: string }[];
    const howItWorksSteps = t('howItWorks.steps', { returnObjects: true }) as { step: string; title: string; desc: string; icon: string }[];
    const capabilityCategories = t('capabilities.categories', { returnObjects: true }) as {
        name: string; items: { icon: string; title: string; desc: string }[];
    }[];
    const comparisonRows = t('comparison.rows', { returnObjects: true }) as { problem: string; solution: string }[];
    const builtForAfricaTags = t('builtForAfrica.tags', { returnObjects: true }) as { label: string; icon: string }[];
    const roadmapPhases = t('roadmap.phases', { returnObjects: true }) as {
        label: string; status: string; statusClass: string; items: { icon: string; title: string; desc: string }[];
    }[];

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />
        <div className="text-text-dark font-sans">
            <Helmet>
                <title>Farm OS | Proprietary Farm Management Platform | AfriNuts Export</title>
                <meta name="description" content="AfriNuts Farm OS is our proprietary farm management platform — offline-first Android with cloud sync, block-level tracking, and real-time dashboards. Access is restricted to verified investors and partners under NDA." />
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href="https://www.afrinutsexport.com/invest" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "AfriNuts Farm OS",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Android",
                "description": "Proprietary farm management platform — access restricted to verified investors and partners under NDA.",
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock",
                    "description": "Access restricted to verified parties under NDA"
                }
            }} />

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "AfriNuts Farm OS",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Android",
                "description": t('seo.description'),
                "offers": { "@type": "Offer", "availability": "https://schema.org/InStock" }
            }} />
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[90vh]">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-20" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <Icons.FaMobile className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1
                            className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight"
                            variants={fadeIn}
                            style={{ letterSpacing: '-0.03em' }}
                            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
                        />
                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                            {t('hero.lead')}
                        </Typography>

                        {/* Farm OS Intro Card */}
                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={getIcon('FaMobile')}
                                title={t('hero.cardTitle')}
                                variant="secondary"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('hero.cardBody')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        {/* Intro Badge */}
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary mb-5">
                            <Icons.FaMobile className="text-[10px]" />
                            <span>{t('hero.badgeTech')}</span>
                            <span className="text-primary/40">|</span>
                            <span>{t('hero.badgeVersion')}</span>
                        </motion.div>

                        {/* Key Stats Row */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                            {heroStats.map((stat, idx) => {
                                const StatIcon = getIcon(stat.icon);
                                return (
                                    <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 ${stat.bg} ${stat.text} text-xs rounded-full font-medium`}>
                                        <StatIcon className="text-[10px]" /> {stat.label}
                                    </span>
                                );
                            })}
                        </div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <Link to="/trace" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <Icons.FaSearch className="text-xs" />{t('hero.ctaDemo')}
                            </Link>
                            <Link to="/invest" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <Icons.FaChartLine className="text-xs" />{t('hero.ctaInvest')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div className="flex-shrink-0 lg:ml-auto" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={farmOsHeroImage} alt="Farm OS Technology" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">{t('hero.imageLabel')}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Section>
            {/* Confidential Notice */}
            <Section className="py-4">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                                className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-center">
                        <Typography variant="small" className="text-amber-700 flex items-center justify-center gap-2">
                            <FaShieldAlt className="text-amber-500" />
                            Confidential — For verified investors and strategic partners under NDA. Do not distribute.
                        </Typography>
                    </motion.div>
                </div>
            </Section>

            {/* The Problem We Solved */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('whyBuilt.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('whyBuilt.subtitle')}
                        </Typography>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {whyBuiltCards.map((item, idx) => {
                            const ItemIcon = getIcon(item.icon);
                            return (
                                <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                    <InfoCard icon={ItemIcon} title={item.new} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                        <div className="mb-2 px-2 py-0.5 bg-amber-50  text-amber-700 text-sm rounded-full inline-block">
                                            {t('whyBuilt.oldPrefix')} {item.old}
                                        </div>
                                    </InfoCard>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </Section>

            {/* How It Works */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('howItWorks.title')}</Typography>
                    </motion.div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {howItWorksSteps.map((item, idx) => {
                            const StepIcon = getIcon(item.icon);
                            return (
                                <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                    <InfoCard title={item.title} subtitle={`${t('howItWorks.stepPrefix')} ${item.step}`} iconColor="text-accent" showInfoBadge={false} className="h-full text-center">
                                        <StepIcon className="text-4xl text-primary mx-auto mb-3" />
                                        <Typography variant="small" className="text-gray-600">{item.desc}</Typography>
                                    </InfoCard>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </Section>

            {/* Current Capabilities */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('capabilities.title')}</Typography>
                    </motion.div>
                    <div className="space-y-6">
                        {capabilityCategories.map((category, catIdx) => (
                            <div key={catIdx}>
                                <Typography variant="h4" className="text-primary mb-3 flex items-center gap-2">
                                    <Icons.FaCheckCircle className="text-green-500" /> {category.name}
                                </Typography>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {category.items.map((item, idx) => {
                                        const CapIcon = getIcon(item.icon);
                                        return (
                                            <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: (catIdx * 0.1) + (idx * 0.05) }}>
                                                <InfoCard icon={CapIcon} title={item.title} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                                    <Typography variant="small" className="text-gray-600">{item.desc}</Typography>
                                                </InfoCard>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* What This Means for You */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">What Farm OS Means for Your Investment</Typography>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <InfoCard icon={FaChartLine} title="Real-Time Oversight" variant="primary" showInfoBadge={false}>
                            <Typography variant="small" className="text-gray-600">
                                The dashboard you see is the same dashboard our farm managers use. No curated PDFs. No delayed reports. Every tree, every expense, every harvest — live.
                            </Typography>
                        </InfoCard>
                        <InfoCard icon={FaShieldAlt} title="Fraud-Proof Operations" variant="accent" showInfoBadge={false}>
                            <Typography variant="small" className="text-gray-600">
                                Every expense requires photo documentation. Every harvest is logged per block. Every task is assigned and verified. The system creates an audit trail that makes financial misconduct nearly impossible.
                            </Typography>
                        </InfoCard>
                    </div>
                </div>
            </Section>

            {/* Why We Built Instead of Bought */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('comparison.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('comparison.subtitle')}
                        </Typography>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <InfoCard icon={Icons.FaMobile} title={t('comparison.tableTitle')} variant="primary" showInfoBadge={false}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-200 text-left">
                                        <th className="pb-3 font-medium text-gray-600">{t('comparison.colProblem')}</th>
                                        <th className="pb-3 font-medium text-gray-600 text-center w-24">{t('comparison.colSolution')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {comparisonRows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-white/20 transition-colors">
                                            <td className="py-3 text-red-600 text-sm">{row.problem}</td>
                                            <td className="py-3 text-center"><Icons.FaCheckCircle className="text-green-500 mx-auto" /></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3 text-center">
                                <Typography variant="small" className="text-gray-500">{t('comparison.footer')}</Typography>
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            {/* Built for West Africa */}
            <Section className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <InfoCard
                            icon={FaSatelliteDish}
                            title={t('builtForAfrica.title', 'Built for West Africa. Not Adapted for It.')}
                            variant="accent"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto mb-4">
                                {t('builtForAfrica.body', 'Offline-first architecture. Auto-syncs when connectivity returns. Runs on affordable Android devices. Optimized for low-bandwidth environments. This is not Silicon Valley software retrofitted for Africa — it was built here, for here.')}
                            </Typography>
                            <div className="flex flex-wrap justify-center gap-2">
                                {builtForAfricaTags.map((tag, idx) => {
                                    const TagIcon = getIcon(tag.icon);
                                    return (
                                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                                <TagIcon className="text-[10px]" /> {tag.label}
                            </span>
                                    );
                                })}
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            {/* Farm OS v2 Roadmap */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('roadmap.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('roadmap.subtitle')}
                        </Typography>
                    </motion.div>
                    <div className="space-y-8">
                        {roadmapPhases.map((phase, phaseIdx) => (
                            <div key={phaseIdx}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${phase.statusClass}`}>{phase.status}</span>
                                    <Typography variant="h4" className="text-primary">{phase.label}</Typography>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {phase.items.map((item, idx) => {
                                        const ItemIcon = getIcon(item.icon);
                                        return (
                                            <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: (phaseIdx * 0.1) + (idx * 0.05) }}>
                                                <InfoCard icon={ItemIcon} title={item.title} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                                    <Typography variant="small" className="text-gray-600">{item.desc}</Typography>
                                                </InfoCard>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
        </div>
    );
};

export default FarmOS;