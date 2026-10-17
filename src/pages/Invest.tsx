import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Reveal, StaggerList, StaggerItem, CountUp } from "@/components/Reveal";
import { Link, useNavigate } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import {
    FaChartLine,
    FaIndustry,
    FaLeaf,
    FaShieldAlt,
    FaUsers,
    FaArrowRight,
    FaDownload,
    FaHandshake,
    FaCalendarAlt,
    FaFileContract,
    FaCheckCircle,
    FaHeart,
    FaSolarPanel,
    FaGlobeAfrica,
    FaChartPie,
    FaMoneyBillWave,
    FaBuilding,
    FaSeedling,
    FaInfoCircle,
    FaChartBar,
    FaCrown,
    FaMobile,
    FaStar,
    FaMapMarkerAlt, FaSearch, FaBullseye, FaQuestionCircle
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
import investHeroImage from '@/assets/images/invest-hero.webp';
import ceoImage from '@/assets/images/ceo.webp';
import landMapImage from '@/assets/images/land-map-odienne.webp';
import { trackCtaClick } from "@/utils/analytics";
import ProfilePlaceholder from "@/components/ProfilePlaceholder/ProfilePlaceholder";
import { HeroSection } from '@/components/HeroSection/HeroSection';
import {InvestorLetter} from "@/components/InvestorLetter/InvestorLetter";


const Invest: React.FC = () => {
    const { t } = useTranslation('invest');
    const navigate = useNavigate();


    const capitalAllocation = [
        { name: t('capitalAllocationItems.workingCapital'), value: 90000, color: '#698714' },
        { name: t('capitalAllocationItems.headquarters'), value: 80000, color: '#5A7411' },
        { name: t('capitalAllocationItems.vehicles'), value: 60000, color: '#E04E00' },
        { name: t('capitalAllocationItems.supplierDev'), value: 50000, color: '#A0C800' },
        { name: t('capitalAllocationItems.aos'), value: 40000, color: '#253746' },
        { name: t('capitalAllocationItems.recruitment'), value: 20000, color: '#9C3D10' },
        { name: t('capitalAllocationItems.contingency'), value: 10000, color: '#DEDAD4' },
    ];

    const certifications = t('certifications.items', { returnObjects: true }) as any[];

    const heroKPIs = [
        { icon: FaMoneyBillWave, label: t('hero.kpis.targetRaise'), value: '$350K' },
        { icon: FaChartPie, label: t('hero.kpis.equityOffered'), value: '10%' },
        { icon: FaBuilding, label: t('hero.kpis.postMoneyVal'), value: '$3.5M' },
        { icon: FaBullseye, label: t('hero.kpis.minimumInvestment'), value: '$50K' },
    ];

    const opportunityCards = [
        { icon: FaGlobeAfrica, key: 'producer' },
        { icon: FaIndustry, key: 'firstMover' },
        { icon: FaChartLine, key: 'margin' },
    ];

    const operationalItems = [
        { text: t('funding.operational.items.farm'), icon: FaSeedling },
        { text: t('funding.operational.items.organic'), icon: FaLeaf },
        { text: t('funding.operational.items.farmOs'), icon: FaMobile },
    ];

    const supplyChainItems = [
        { text: t('funding.supplyChain.items.trading'), icon: FaMoneyBillWave },
        { text: t('funding.supplyChain.items.supplier'), icon: FaUsers },
        { text: t('funding.supplyChain.items.intelligence'), icon: FaChartLine },
    ];

    const [isDesktop, setIsDesktop] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => {
            setIsDesktop(window.innerWidth >= 768);
            setIsMobile(window.matchMedia('(max-width: 767px)').matches);
        };
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const teamImageMap: Record<string, string | null> = {
        ceo: ceoImage,
        cfo: null,
        cco: null,
        ops: null,
        admin: null,
        farm: null,
    };

    const competitiveRows = t('competitiveAnalysis.rows', { returnObjects: true }) as any[];

    const riskItems = (t('risk.items', { returnObjects: true }) as { risk: string; mitigation: string }[]) || [];

    const impactMetrics = [
        { icon: FaUsers, value: '150+', label: t('impact.jobs'), desc: t('impact.jobsDesc'), color: 'text-accent' },
        { icon: FaHeart, value: '200+', label: t('impact.farmers'), desc: t('impact.farmersDesc'), color: 'text-accent' },
        { icon: FaChartLine, value: '10%', label: t('impact.reinvestment'), desc: t('impact.reinvestmentDesc'), color: 'text-accent' },
        { icon: FaSolarPanel, value: '40%', label: t('impact.energy'), desc: t('impact.energyDesc'), color: 'text-accent' },
    ];

    const teamMembers = t('team.members', { returnObjects: true }) as any[];

    return (
        <MotionConfig reducedMotion={isMobile ? 'always' : 'never'}>
        <div className="text-text-dark font-sans">
            <Helmet>
                <title>{t('seo.title')}</title>
                <meta name="description" content={t('seo.description')} />
                <link rel="canonical" href="https://www.afrinutsexport.com/invest" />
            </Helmet>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", "name": t('seo.title'), "description": t('seo.description') }} />

            {/* Hero — keep mount animation */}
            <HeroSection className="flex items-center justify-center text-center min-h-[100vh]">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-16" initial="hidden" animate="visible" variants={staggerContainer}>

                    {/* Left: Text Content */}
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaChartPie className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>{t('hero.title')}</motion.h1>
                        <Typography variant="lead" className="text-text-dark mb-3 text-base lg:text-lg">{t('hero.tagline')}</Typography>
                        <div className="inline-block bg-primary/5 border border-primary/10 rounded-xl px-4 py-2 mb-4">
                            <Typography variant="small" className="text-primary text-sm">
                                <FaSeedling className="inline mr-1.5 text-accent" />
                                {t('hero.interimNote')}
                            </Typography>
                        </div>
                        <StaggerList className="grid grid-cols-2 gap-3 mb-6">
                            {heroKPIs.map((kpi, idx) => (
                                <StaggerItem key={idx}>
                                    <InfoCard icon={kpi.icon} title={kpi.value} subtitle={kpi.label} iconColor="text-accent" variant="primary" showInfoBadge={false} className="h-full text-center" />
                                </StaggerItem>
                            ))}
                        </StaggerList>
                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <a href={ndaPDF} download className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaDownload className="text-xs" />{t('hero.downloadNda')}
                            </a>
                            <motion.button onClick={() => {
                                trackCtaClick('schedule_call', 'invest_hero');
                                navigate('/contact#schedule-call');
                                document.getElementById('schedule-call')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                                           className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm" whileHover={{ y: -1 }}>
                                <FaHandshake className="text-xs" />{t('hero.scheduleCall')}
                            </motion.button>
                            <Link
                                to="/faq?audience=investors"
                                onClick={() => trackCtaClick('faq_link', 'invest_hero')}
                                className="relative border border-accent/40 text-accent hover:bg-accent/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm"
                            >
                                <FaQuestionCircle className="text-xs" />{t('hero.viewFaq')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Invest Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={investHeroImage} alt="Investment Opportunity" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">{t('hero.imageOverlay')}</span>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </HeroSection>

            {/* Why This Investment is Different */}
            <Section className="py-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <Reveal>
                        <InfoCard
                            icon={FaHeart}
                            title={t('impactSummary.title', 'Built for Impact Investors')}
                            variant="secondary"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <Typography variant="body" className="text-gray-700">
                                {t('impactSummary.body', 'Your capital builds the first certified processing center in northwestern Côte d\'Ivoire. You get 25% equity, full Shariah compliance, and a Farm OS dashboard to monitor your investment in real time. Dividends begin in 2033.')}
                            </Typography>
                        </InfoCard>
                    </Reveal>
                </div>
            </Section>

            {/* Opportunity */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('opportunity.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">{t('opportunity.body')}</Typography>
                    </Reveal>
                    <StaggerList className="grid md:grid-cols-3 gap-6">
                        {opportunityCards.map((item, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard icon={item.icon} title={t(`opportunity.cards.${item.key}.title`)} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600 mb-4">{t(`opportunity.cards.${item.key}.desc`)}</Typography>
                                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-bold mb-3">{t(`opportunity.cards.${item.key}.stat`)}</span>
                                    <ul className="space-y-1.5 border-t border-gray-100 pt-3">
                                        {(t(`opportunity.cards.${item.key}.highlights`, { returnObjects: true }) as string[]).map((h, i) => (
                                            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600"><FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-[10px]" />{h}</li>
                                        ))}
                                    </ul>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* Land Map */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">
                            {t('landMap.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">
                            {t('landMap.caption')}
                        </Typography>
                    </Reveal>

                    {/* Clarification Banner */}
                    <Reveal className="mb-6 p-3 bg-blue-50/80 border border-blue-200 rounded-xl max-w-3xl mx-auto">
                        <Typography variant="small" className="text-blue-700 text-xs text-center">
                            <FaInfoCircle className="inline mr-1.5" />
                            {t('landMap.clarification')}
                        </Typography>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Map Image */}
                        <Reveal className="md:col-span-2">
                            <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-primary/20 shadow-xl overflow-hidden p-4">
                                <img
                                    src={landMapImage}
                                    alt={t('landMap.alt')}
                                    className="w-full h-auto rounded-xl"
                                    loading="lazy"
                                />
                                <div className="mt-3 p-3 bg-primary/5 rounded-lg text-center">
                                    <Typography variant="small" className="text-gray-500 text-xs">
                                        <FaInfoCircle className="inline mr-1.5 text-accent" />
                                        {t('landMap.note')}
                                    </Typography>
                                </div>
                            </div>
                        </Reveal>

                        {/* Stats */}
                        <Reveal className="md:col-span-1" delay={0.1}>
                            <div className="space-y-4">
                                {[
                                    { label: t('landMap.stats.total'), icon: FaGlobeAfrica, value: '70 ha', variant: 'primary' as const },
                                    { label: t('landMap.stats.farm'), icon: FaSeedling, value: '35 ha', variant: 'primary' as const },
                                    { label: t('landMap.stats.processing'), icon: FaIndustry, value: '10 ha', variant: 'primary' as const },
                                    { label: t('landMap.stats.community'), icon: FaUsers, value: '25 ha', variant: 'accent' as const },
                                ].map((item, idx) => (
                                    <InfoCard
                                        key={idx}
                                        icon={item.icon}
                                        title={item.value}
                                        subtitle={item.label}
                                        iconColor={item.variant === 'accent' ? 'text-gray-400' : 'text-accent'}
                                        showInfoBadge={false}
                                        variant={item.variant}
                                        className={`text-center ${item.variant === 'accent' ? 'opacity-70' : ''}`}
                                    />
                                ))}
                            </div>

                            {/* Status Badge */}
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg text-center">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
                                    <FaFileContract className="text-[10px]" />
                                    {t('landMap.stats.status')}
                                </span>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </Section>

            {/* Total Addressable Market */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('marketSize.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">{t('marketSize.subtitle')}</Typography>
                    </Reveal>
                    <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { value: '$8.5B+', label: t('marketSize.globalMarket.title'), sub: t('marketSize.globalMarket.growth'), icon: FaGlobeAfrica },
                            { value: '1.2M+ MT', label: t('marketSize.ivoryCoast.title'), sub: t('marketSize.ivoryCoast.gap'), icon: FaChartBar },
                            { value: '$500M+', label: t('marketSize.ourTarget.title'), sub: t('marketSize.ourTarget.description'), icon: FaChartLine },
                            { value: '4-5%', label: t('marketSize.growthRate'), sub: t('marketSize.growthDesc'), icon: FaArrowRight },
                        ].map((item, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard icon={item.icon} title={item.value} subtitle={item.label} iconColor="text-accent" showInfoBadge={false} className="h-full text-center">
                                    <Typography variant="small" className="text-gray-500 text-xs">{item.sub}</Typography>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                    <Reveal className="bg-primary/5 rounded-xl p-4">
                        <Typography variant="small" className="text-gray-600 text-center">
                            <strong className="text-primary">{t('marketSize.driversTitle')}</strong>
                        </Typography>
                        <ul className="mt-2 space-y-1 text-xs text-gray-600 max-w-2xl mx-auto">
                            {(t('marketSize.drivers', { returnObjects: true }) as string[]).map((d, i) => (
                                <li key={i} className="flex items-start gap-1.5"><FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-[10px]" />{d}</li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </Section>

            {/* What This Investment Activates */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">
                            {t('funding.title')}
                        </Typography>
                        <Typography variant="lead" className="max-w-3xl mx-auto text-gray-600">
                            {t('funding.subtitle')}
                        </Typography>
                    </Reveal>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Foundation Already Built */}
                        <Reveal>
                            <Typography
                                variant="h3"
                                className="text-primary flex items-center gap-2 mb-5"
                            >
                                <FaCheckCircle className="text-green-500" />
                                {t('funding.operational.title')}
                            </Typography>
                            <StaggerList className="space-y-3">
                                {operationalItems.map((item, idx) => (
                                    <StaggerItem key={idx}>
                                        <motion.div
                                            className="flex items-start gap-4 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                            whileHover={{ y: -2 }}
                                        >
                                            <motion.div
                                                className="bg-primary p-2 rounded-full text-white mt-0.5 shadow-md"
                                                whileHover={{ scale: 1.15, rotate: 5 }}
                                            >
                                                <item.icon className="text-lg" />
                                            </motion.div>
                                            <Typography variant="body" className="flex-1 text-left">
                                                {item.text}
                                            </Typography>
                                        </motion.div>
                                    </StaggerItem>
                                ))}
                            </StaggerList>
                        </Reveal>

                        {/* What This Investment Activates */}
                        <Reveal delay={0.1}>
                            <Typography
                                variant="h3"
                                className="text-primary flex items-center gap-2 mb-5"
                            >
                                <FaMoneyBillWave className="text-accent" />
                                {t('funding.supplyChain.title')}
                            </Typography>
                            <StaggerList className="space-y-3">
                                {supplyChainItems.map((item, idx) => (
                                    <StaggerItem key={idx}>
                                        <motion.div
                                            className="flex items-start gap-4 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                            whileHover={{ y: -2 }}
                                        >
                                            <motion.div
                                                className="bg-accent p-2 rounded-full text-white mt-0.5 shadow-md"
                                                whileHover={{ scale: 1.15, rotate: 5 }}
                                            >
                                                <item.icon className="text-lg" />
                                            </motion.div>
                                            <Typography variant="body" className="flex-1 text-left">
                                                {item.text}
                                            </Typography>
                                        </motion.div>
                                    </StaggerItem>
                                ))}
                            </StaggerList>
                        </Reveal>
                    </div>

                    {/* Quote */}
                    <Reveal
                        className="mt-6 relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-5 transform-gpu group max-w-2xl mx-auto"
                    >
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
                        <Typography
                            variant="body"
                            className="text-primary-dark italic relative z-10 text-center"
                        >
                            {t('funding.quote')}
                        </Typography>
                    </Reveal>
                </div>
            </Section>

            {/* Structured Capital Deployment */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">
                            {t('milestones.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('milestones.subtitle')}
                        </Typography>
                    </Reveal>

                    <StaggerList className="grid md:grid-cols-3 gap-6">
                        {(t('milestones.tranches', { returnObjects: true }) as any[]).map((tranche, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard
                                    icon={FaChartLine}
                                    title={tranche.name}
                                    subtitle={tranche.status}
                                    iconColor="text-accent"
                                    showInfoBadge={false}
                                    className="h-full"
                                >
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <Typography variant="small" className="text-accent text-xs font-semibold mb-1">
                                                Trigger
                                            </Typography>
                                            <Typography variant="small" className="text-gray-700">
                                                {tranche.trigger}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="small" className="text-accent text-xs font-semibold mb-1">
                                                Purpose
                                            </Typography>
                                            <Typography variant="small" className="text-gray-700">
                                                {tranche.purpose}
                                            </Typography>
                                        </div>
                                    </div>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>

                    <Reveal className="mt-6 p-3 bg-primary/5 rounded-lg max-w-2xl mx-auto text-center">
                        <Typography variant="small" className="text-gray-600 text-xs">
                            <FaInfoCircle className="inline mr-1.5 text-accent" />
                            {t('milestones.note')}
                        </Typography>
                    </Reveal>
                </div>
            </Section>

            {/* Farm OS: Technology Behind the Investment */}
            <Section className="py-10" id="farmos-gated">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('farmOs.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">{t('farmOs.body')}</Typography>
                    </Reveal>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Capabilities */}
                        <Reveal>
                            <InfoCard icon={FaMobile} title="Investor-Grade Technology" variant="secondary" showInfoBadge={false} className="h-full">
                                <ul className="space-y-2 text-sm">
                                    {(t('farmOs.capabilities', { returnObjects: true }) as string[]).map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>
                        </Reveal>

                        {/* Dashboard Visual Representation */}
                        <Reveal delay={0.1}>
                            <InfoCard icon={FaChartLine} title="Live Dashboard Access" variant="secondary" showInfoBadge={false} className="h-full text-center">
                                {/* Styled Dashboard Graphic — Not Real Data */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-inner mb-4">
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <div className="w-16 h-2 bg-gray-300 rounded-full"></div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                                            <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                                            <div className="w-6 h-1.5 bg-gray-200 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {['#5A7411', '#E04E00', '#A0C800'].map((color, i) => (
                                            <div key={i} className="rounded-lg p-2" style={{ backgroundColor: `${color}15` }}>
                                                <div className="w-8 h-1.5 rounded-full mb-1.5" style={{ backgroundColor: `${color}40` }}></div>
                                                <div className="w-12 h-3 rounded mb-1" style={{ backgroundColor: `${color}60` }}></div>
                                                <div className="w-16 h-1 rounded-full" style={{ backgroundColor: `${color}30` }}></div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-gray-100/50 rounded-lg p-3 mb-3">
                                        <div className="flex items-end gap-1 h-16">
                                            {[40, 65, 45, 80, 55, 90, 60, 75, 50, 85, 45, 70].map((h, i) => (
                                                <div key={i} className="flex-1 rounded-t" style={{
                                                    height: `${h}%`,
                                                    backgroundColor: i % 2 === 0 ? '#5A7411' : '#E04E00',
                                                    opacity: 0.6
                                                }}></div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
                                            <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
                                            <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
                                            <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-gray-100/50 rounded-lg p-2">
                                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-1.5"></div>
                                            <div className="w-16 h-2.5 bg-primary/40 rounded"></div>
                                        </div>
                                        <div className="bg-gray-100/50 rounded-lg p-2">
                                            <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-1.5"></div>
                                            <div className="w-16 h-2.5 bg-accent/40 rounded"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="inline-block bg-accent/10 text-accent text-xs font-medium px-4 py-2 rounded-full">
                                    {t('farmOs.cta')}
                                </div>
                            </InfoCard>
                        </Reveal>
                    </div>

                    {/* Gated Access — inline panel below the two cards */}
                    <Reveal delay={0.2}>
                        <InfoCard
                            icon={FaFileContract}
                            title={t('farmOsGated.title', 'Want to See Farm OS in Action?')}
                            variant="secondary"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <Typography variant="body" className="text-gray-700 max-w-3xl mx-auto mb-6">
                                {t('farmOsGated.body', 'Farm OS is our competitive advantage — a custom-built operating system that tracks every tree, every expense, and every export. We protect it carefully. Sign the NDA and we\'ll give you a live demo: real dashboards, block-level tracking, batch traceability, and financial reporting that most agribusinesses cannot match.')}
                            </Typography>

                            <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-3xl mx-auto">
                                {[
                                    { icon: FaChartLine, label: t('farmOsGated.preview.dashboard', 'Live Dashboard') },
                                    { icon: FaMapMarkerAlt, label: t('farmOsGated.preview.blocks', 'Block-Level Data') },
                                    { icon: FaSearch, label: t('farmOsGated.preview.trace', 'Batch Traceability') },
                                    { icon: FaFileContract, label: t('farmOsGated.preview.reports', 'Financial Reports') },
                                ].map((item, idx) => (
                                    <StaggerItem key={idx}>
                                        <div
                                            className="rounded-xl p-3 text-center transition-all duration-300"
                                            style={{
                                                background: 'rgba(255,255,255,0.55)',
                                                border: '1px solid rgba(255,255,255,0.7)',
                                                backdropFilter: 'blur(12px)',
                                                WebkitBackdropFilter: 'blur(12px)',
                                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.03)',
                                            }}
                                        >
                                            <item.icon className="text-accent text-xl mx-auto mb-1" />
                                            <div className="text-gray-700 text-xs">{item.label}</div>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerList>

                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={ndaPDF}
                                    download
                                    className="relative bg-gradient-to-r from-accent to-dark-orange hover:from-dark-orange hover:to-accent text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center gap-2"
                                >
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover/btn:opacity-70 transition-opacity duration-300" />
                                    <FaFileContract className="relative z-10" />
                                    <span className="relative z-10">{t('farmOsGated.signNda', 'Sign NDA for Farm OS Access')}</span>
                                </a>
                            </motion.div>

                            <Typography variant="small" className="text-gray-500 mt-4 text-xs">
                                {t('farmOsGated.note', 'Farm OS is proprietary technology. Access is granted only to verified investors and strategic partners under NDA.')}
                            </Typography>
                        </InfoCard>
                    </Reveal>
                </div>
            </Section>


            {/* Charts Row — The Opportunity + Your Capital */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">
                            {t('charts.sectionTitle')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">
                            {t('charts.sectionBody')}
                        </Typography>
                    </Reveal>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Reveal>
                            <InfoCard
                                icon={FaChartBar}
                                title={t('charts.processingGap.title')}
                                subtitle={t('charts.processingGap.subtitle')}
                                variant="primary"
                                showInfoBadge={false}
                            >
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart
                                        data={[
                                            { name: t('charts.processingGap.produced'), value: 1.2 },
                                            { name: t('charts.processingGap.processed'), value: 0.17 },
                                            { name: t('charts.processingGap.exported'), value: 1.03 },
                                        ]}
                                        layout="vertical"
                                        margin={{ left: 60, right: 30, top: 10, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" domain={[0, 1.2]} tickFormatter={(v) => `${v}M MT`} />
                                        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                                        <Tooltip formatter={(value: any) => `${Number(value).toFixed(2)}M MT`} />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                            <PieCell fill="#5A7411" />
                                            <PieCell fill="#E04E00" />
                                            <PieCell fill="#DEDAD4" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-3 p-3 bg-primary/5 rounded-lg text-center">
                                    <Typography variant="small" className="text-gray-600">
                                        <span dangerouslySetInnerHTML={{ __html: t('charts.processingGap.note') }} />
                                    </Typography>
                                </div>
                            </InfoCard>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <InfoCard
                                icon={FaChartBar}
                                title={t('charts.capitalAllocation.title')}
                                subtitle={t('charts.capitalAllocation.subtitle')}
                                iconColor="text-primary"
                                variant="primary"
                                className="h-full"
                                showInfoBadge={false}
                            >
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart
                                        data={capitalAllocation}
                                        layout="vertical"
                                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                                        <XAxis type="number" domain={[0, 100000]} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
                                        <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                                        <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} labelStyle={{ fontSize: 12 }} />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                            {capitalAllocation.map((entry, index) => (
                                                <PieCell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="mt-3 p-3 bg-primary/5 rounded-lg text-center">
                                    <Typography variant="small" className="text-gray-500">
                                        {t('charts.capitalAllocation.note')}
                                    </Typography>
                                </div>
                            </InfoCard>
                        </Reveal>
                    </div>
                </div>
            </Section>

            {/* Phase One: Trading Returns */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">
                            {t('phaseOneReturns.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">
                            {t('phaseOneReturns.subtitle')}
                        </Typography>
                    </Reveal>

                    <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: FaMoneyBillWave, value: t('phaseOneReturns.kpis.investmentValue'), label: t('phaseOneReturns.kpis.investment') },
                            { icon: FaChartPie, value: t('phaseOneReturns.kpis.equityValue'), label: t('phaseOneReturns.kpis.equity') },
                            { icon: FaBuilding, value: t('phaseOneReturns.kpis.postMoneyValue'), label: t('phaseOneReturns.kpis.postMoney') },
                            { icon: FaChartLine, value: t('phaseOneReturns.kpis.profitPerTruckValue'), label: t('phaseOneReturns.kpis.profitPerTruck') },
                        ].map((item, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard icon={item.icon} title={item.value} subtitle={item.label} iconColor="text-accent" showInfoBadge={false} className="h-full text-center" />
                            </StaggerItem>
                        ))}
                    </StaggerList>

                    <Reveal className="mb-8">
                        <InfoCard icon={FaChartBar} title={t('phaseOneReturns.tradingTable.title')} variant="primary" showInfoBadge={false}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-200 text-left">
                                        <th className="pb-2 font-medium text-gray-600">{t('phaseOneReturns.tradingTable.metric')}</th>
                                        <th className="pb-2 font-medium text-gray-600 text-right">{t('phaseOneReturns.tradingTable.value')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-white/20 transition-colors">
                                        <td className="py-2.5">{t('phaseOneReturns.tradingTable.capital')}</td>
                                        <td className="py-2.5 text-right font-medium">$30,000</td>
                                    </tr>
                                    <tr className="hover:bg-white/20 transition-colors">
                                        <td className="py-2.5">{t('phaseOneReturns.tradingTable.volume')}</td>
                                        <td className="py-2.5 text-right font-medium">42 MT</td>
                                    </tr>
                                    <tr className="hover:bg-white/20 transition-colors">
                                        <td className="py-2.5">{t('phaseOneReturns.tradingTable.profit')}</td>
                                        <td className="py-2.5 text-right font-bold text-primary">
                                            {isDesktop ? <CountUp to={14520} prefix="$" /> : '$14,520'}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/20 transition-colors">
                                        <td className="py-2.5">{t('phaseOneReturns.tradingTable.threeTrucks')}</td>
                                        <td className="py-2.5 text-right font-medium">
                                            $90,000 / {isDesktop ? <CountUp to={43560} prefix="$" /> : '$43,560'}
                                        </td>
                                    </tr>
                                    <tr className="bg-primary/5 font-semibold">
                                        <td className="py-2.5">{t('phaseOneReturns.tradingTable.equityShare')}</td>
                                        <td className="py-2.5 text-right text-primary">{t('phaseOneReturns.tradingTable.equityShareValue')}</td>
                                    </tr>
                                    <tr className="bg-accent/5 font-semibold">
                                        <td className="py-2.5">{t('phaseOneReturns.tradingTable.mudarabahShare')}</td>
                                        <td className="py-2.5 text-right text-accent">{t('phaseOneReturns.tradingTable.mudarabahShareValue')}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                <Typography variant="small" className="text-gray-600 text-xs">
                                    {t('phaseOneReturns.tradingTable.note')}
                                </Typography>
                            </div>
                        </InfoCard>
                    </Reveal>

                    <Reveal className="p-4 bg-blue-50/80 border-l-4 border-blue-500 rounded-r-xl max-w-3xl mx-auto">
                        <Typography variant="small" className="text-blue-700 text-sm">
                            <FaInfoCircle className="inline mr-2" />
                            {t('phaseOneReturns.distributionNote')}
                        </Typography>
                    </Reveal>

                    <Reveal className="mt-4 p-3 bg-blue-50/80 border border-blue-200 rounded-xl max-w-2xl mx-auto text-center">
                        <Typography variant="small" className="text-blue-700 text-xs">
                            <FaInfoCircle className="inline mr-1.5" />
                            {t('phaseOneReturns.liquidityNote')}
                        </Typography>
                    </Reveal>
                </div>
            </Section>

            {/* Phase Two: The Real Upside */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">
                            {t('returns.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">
                            {t('returns.subtitle')}
                        </Typography>
                        <div className="mt-4 inline-block bg-primary/5 border border-primary/10 rounded-xl px-4 py-2 max-w-3xl">
                            <Typography variant="small" className="text-primary text-sm">
                                <FaInfoCircle className="inline mr-1.5 text-accent" />
                                {t('returns.subtitleNote')}
                            </Typography>
                        </div>
                    </Reveal>

                    {/* Unit Economics Table */}
                    <Reveal className="mb-8">
                        <InfoCard icon={FaIndustry} title={t('returns.unitEconomics.title')} variant="primary" showInfoBadge={false}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-200 text-left">
                                        <th className="pb-2 font-medium text-gray-600">{t('returns.unitEconomics.item')}</th>
                                        <th className="pb-2 font-medium text-gray-600 text-right">{t('returns.unitEconomics.value')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="py-2.5">{t('returns.unitEconomics.rcnCost')}</td>
                                        <td className="py-2.5 text-right">{t('returns.unitEconomics.rcnCostValue')}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5">{t('returns.unitEconomics.kernelRecovery')}</td>
                                        <td className="py-2.5 text-right">{t('returns.unitEconomics.kernelRecoveryValue')}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5">{t('returns.unitEconomics.kernelPrice')}</td>
                                        <td className="py-2.5 text-right">{t('returns.unitEconomics.kernelPriceValue')}</td>
                                    </tr>
                                    <tr className="bg-primary/5 font-semibold">
                                        <td className="py-2.5">{t('returns.unitEconomics.kernelRevenue')}</td>
                                        <td className="py-2.5 text-right text-primary">
                                            {t('returns.unitEconomics.kernelRevenueValue')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5">{t('returns.unitEconomics.byproduct')}</td>
                                        <td className="py-2.5 text-right">{t('returns.unitEconomics.byproductValue')}</td>
                                    </tr>
                                    <tr className="bg-primary/10 font-bold">
                                        <td className="py-2.5">{t('returns.unitEconomics.grossValue')}</td>
                                        <td className="py-2.5 text-right text-primary">
                                            {t('returns.unitEconomics.grossValueValue')}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </InfoCard>
                    </Reveal>

                    {/* Scale Projections */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Reveal>
                            <InfoCard icon={FaIndustry} title={t('returns.scaleProjections.phaseTwo.title')} variant="primary" showInfoBadge={false} className="h-full">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                        <span className="text-gray-700">{t('returns.scaleProjections.phaseTwo.revenue')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                        <span className="text-gray-700">{t('returns.scaleProjections.phaseTwo.byproduct')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                        <span className="text-gray-700">{t('returns.scaleProjections.phaseTwo.margin')}</span>
                                    </li>
                                </ul>
                            </InfoCard>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <InfoCard icon={FaChartLine} title={t('returns.scaleProjections.phaseFour.title')} variant="accent" showInfoBadge={false} className="h-full">
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                        <span className="text-gray-700">{t('returns.scaleProjections.phaseFour.revenue')}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                        <span className="text-gray-700">{t('returns.scaleProjections.phaseFour.valuation')}</span>
                                    </li>
                                </ul>
                            </InfoCard>
                        </Reveal>
                    </div>

                    {/* Two Structures */}
                    <Reveal className="mb-6">
                        <StaggerList className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                            <StaggerItem>
                                <InfoCard icon={FaChartLine} title={t('returns.structures.equity.title')} variant="primary" showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600">
                                        {t('returns.structures.equity.description')}
                                    </Typography>
                                </InfoCard>
                            </StaggerItem>
                            <StaggerItem>
                                <InfoCard icon={FaHandshake} title={t('returns.structures.mudarabah.title')} variant="accent" showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600">
                                        {t('returns.structures.mudarabah.description')}
                                    </Typography>
                                </InfoCard>
                            </StaggerItem>
                        </StaggerList>
                    </Reveal>

                    {/* Bottom Line */}
                    <Reveal className="mb-6">
                        <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-6 text-center max-w-3xl mx-auto">
                            <Typography variant="lead" className="text-primary font-semibold">
                                {t('returns.bottomLine')}
                            </Typography>
                        </div>
                    </Reveal>

                    <Reveal className="mb-6 bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-center max-w-2xl mx-auto">
                        <Typography variant="small" className="text-blue-700 text-xs">
                            <FaInfoCircle className="inline mr-2" />
                            {t('returns.ndaNote')}
                        </Typography>
                    </Reveal>

                    <Reveal className="mb-6">
                        <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-6 text-center max-w-3xl mx-auto">
                            <Typography variant="lead" className="text-primary font-semibold mb-3">
                                {t('phaseOneReturns.closingTitle', 'Trading Returns & The Path Forward')}
                            </Typography>
                            <Typography variant="body" className="text-gray-700">
                                {t('phaseOneReturns.closingBody', 'This investment activates domestic raw cashew trading to generate immediate, short-cycle revenue while locking in our supply network. By participating in Phase One, investors secure early equity in a high-growth agritech ecosystem, capturing immediate trading distributions under our Shariah-compliant framework while positioning for the massive 5x margin expansion when the Phase Two processing facility goes live.')}
                            </Typography>
                        </div>
                    </Reveal>

                    <Reveal className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center max-w-2xl mx-auto">
                        <Typography variant="small" className="text-amber-700 text-xs">
                            {t('returns.disclaimer')}
                        </Typography>
                    </Reveal>
                </div>

                <Reveal className="text-center mt-4">
                    <Link to="/community" className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1">
                        <FaStar className="text-xs" />
                        {t('returns.community')}
                        <FaArrowRight className="text-xs" />
                    </Link>
                </Reveal>
            </Section>

            {/* Investment Journey Timeline */}
            <Section className="py-10 sm:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8 md:mb-12">
                        <Typography variant="h2" className="text-primary mb-4">
                            {t('timeline.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('timeline.subtitle')}
                        </Typography>
                    </Reveal>

                    {(() => {
                        const items = t('timeline.items', { returnObjects: true }) as any[];
                        const topRow = items.slice(0, 3);
                        const bottomRow = items.slice(3, 6);

                        const TimelineCard = ({ item, idx }: { item: any; idx: number }) => (
                            <StaggerItem className="flex flex-col items-center transform-gpu group">
                                <motion.div
                                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-display text-base md:text-xl font-bold border-4 shadow-lg mb-4 z-10 transition-all duration-500 transform-gpu relative ${
                                        item.status === 'complete'
                                            ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-400'
                                            : item.status === 'active'
                                                ? 'bg-gradient-to-br from-primary/5 to-accent/5 text-primary border-accent'
                                                : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 border-gray-300'
                                    }`}
                                    whileHover={{ scale: 1.15, rotateY: 5 }}
                                >
                                    <div className="absolute inset-0 rounded-full border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-500" />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                    <span className="relative z-10 text-sm md:text-base">{item.year}</span>
                                </motion.div>

                                <motion.div
                                    className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 p-4 md:p-5 rounded-2xl shadow-lg w-full transform-gpu group/card"
                                    style={{ transformStyle: 'preserve-3d' }}
                                    whileHover={{
                                        y: -8,
                                        scale: 1.03,
                                        rotateY: 3,
                                        boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)',
                                        transition: { duration: 0.3 },
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover/card:translate-z-[-10px] transition-all duration-500" />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover/card:opacity-60 transition-opacity duration-500" />
                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2 md:mb-3">
                                            <motion.div
                                                className="text-accent text-lg bg-accent/20 p-2 rounded-full transform-gpu group-hover/card:scale-110 transition-transform duration-300"
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                {item.status === 'complete' ? (
                                                    <FaCheckCircle />
                                                ) : item.status === 'active' ? (
                                                    <FaIndustry />
                                                ) : (
                                                    <FaCalendarAlt />
                                                )}
                                            </motion.div>
                                            <Typography variant="h4" className="text-primary text-base md:text-lg">
                                                {item.title}
                                            </Typography>
                                        </div>
                                        <Typography variant="small" className="text-gray-600 text-xs md:text-sm">
                                            {item.desc}
                                        </Typography>
                                    </div>
                                </motion.div>
                            </StaggerItem>
                        );

                        return (
                            <div className="relative">
                                <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
                                    {topRow.map((item, idx) => (
                                        <TimelineCard key={idx} item={item} idx={idx} />
                                    ))}
                                </StaggerList>

                                <div className="hidden md:flex items-center justify-center mb-8 md:mb-12">
                                    <div className="flex-1 h-1 bg-accent/30 rounded-full" />
                                    <div className="w-4 h-4 rounded-full bg-accent border-4 border-white shadow-md mx-2" />
                                    <div className="flex-1 h-1 bg-accent/30 rounded-full" />
                                </div>

                                <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                    {bottomRow.map((item, idx) => (
                                        <TimelineCard key={idx} item={item} idx={idx + 3} />
                                    ))}
                                </StaggerList>
                            </div>
                        );
                    })()}
                </div>
            </Section>

            {/* Exit Strategy & Investor Protections */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">
                            {t('exitStrategy.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('exitStrategy.subtitle')}
                        </Typography>
                    </Reveal>

                    {/* Exit Paths */}
                    <Reveal className="mb-4">
                        <Typography variant="h3" className="text-primary text-lg mb-4 flex items-center gap-2">
                            <FaGlobeAfrica className="text-accent text-base" />
                            {t('exitStrategy.optionsTitle', 'Exit Paths')}
                        </Typography>
                    </Reveal>
                    <StaggerList className="grid md:grid-cols-2 gap-4 mb-6">
                        {(t('exitStrategy.options', { returnObjects: true }) as any[]).map((opt, idx) => (
                            <StaggerItem key={idx} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                <Typography variant="h5" className="text-primary text-sm mb-1 flex items-center gap-1.5">
                                    <FaShieldAlt className="text-accent text-xs" />{opt.title}
                                </Typography>
                                <Typography variant="small" className="text-gray-600">{opt.description}</Typography>
                            </StaggerItem>
                        ))}
                    </StaggerList>

                    <Reveal className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center max-w-2xl mx-auto mb-8">
                        <Typography variant="small" className="text-amber-700 text-xs">{t('exitStrategy.liquidation')}</Typography>
                    </Reveal>

                    {/* Bridge */}
                    <Reveal className="text-center max-w-2xl mx-auto mb-8">
                        <Typography variant="small" className="text-gray-500 italic">
                            {t('exitStrategy.bridge', 'When the time comes to exit, these are the paths available — and these are the protections that stay with you through the journey.')}
                        </Typography>
                    </Reveal>

                    {/* Investor Protections */}
                    <Reveal className="mb-4">
                        <Typography variant="h3" className="text-primary text-lg mb-4 flex items-center gap-2">
                            <FaShieldAlt className="text-accent text-base" />
                            {t('investorProtections.title')}
                        </Typography>
                    </Reveal>
                    <Reveal className="text-center mb-4">
                        <Typography variant="small" className="text-gray-600 max-w-2xl mx-auto">
                            {t('investorProtections.subtitle')}
                        </Typography>
                    </Reveal>
                    <StaggerList className="grid md:grid-cols-2 gap-4">
                        {(t('investorProtections.items', { returnObjects: true }) as string[]).map((item, idx) => (
                            <StaggerItem key={idx} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                <div className="flex items-start gap-2">
                                    <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-sm" />
                                    <Typography variant="small" className="text-gray-700">{item}</Typography>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* How to Verify AfriNuts */}
            <Section className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">
                            {t('verify.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('verify.subtitle')}
                        </Typography>
                    </Reveal>

                    <Reveal>
                        <InfoCard icon={FaShieldAlt} title={t('verify.title')} variant="primary" showInfoBadge={false}>
                            <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { label: t('verify.items.rccm'), value: t('verify.items.rccmValue') },
                                    { label: t('verify.items.idu'), value: t('verify.items.iduValue') },
                                    { label: t('verify.items.registeredOffice'), value: t('verify.items.registeredOfficeValue') },
                                    { label: t('verify.items.linkedin'), value: t('verify.items.linkedinValue') },
                                    { label: t('verify.items.cbInsights'), value: t('verify.items.cbInsightsValue') },
                                    { label: t('verify.items.executives'), value: t('verify.items.executivesValue') },
                                    { label: t('verify.items.documents'), value: t('verify.items.documentsValue') },
                                ].map((item, idx) => (
                                    <StaggerItem key={idx} className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                                        <Typography variant="small" className="text-accent text-xs font-semibold mb-0.5">
                                            {item.label}
                                        </Typography>
                                        <Typography variant="small" className="text-gray-700 text-sm">
                                            {item.value}
                                        </Typography>
                                    </StaggerItem>
                                ))}
                            </StaggerList>

                            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <Typography variant="h5" className="text-primary text-sm font-semibold mb-2">
                                    {t('verify.whyPolished.title')}
                                </Typography>
                                <Typography variant="small" className="text-gray-700 text-sm leading-relaxed">
                                    {t('verify.whyPolished.body')}
                                </Typography>
                            </div>

                            {/* Land Status */}
                            <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <Typography variant="h5" className="text-primary text-sm font-semibold mb-2">
                                    <FaMapMarkerAlt className="inline mr-2 text-accent" />
                                    {t('landStatus.title')}
                                </Typography>
                                <Typography variant="small" className="text-gray-700 text-sm leading-relaxed mb-3">
                                    {t('landStatus.body')}
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
                                        <FaFileContract className="text-[10px]" />
                                        {t('landStatus.status')}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                        <FaCheckCircle className="text-[10px]" />
                                        {t('landStatus.document')}
                                    </span>
                                </div>
                            </div>

                            {/* KOR Note */}
                            <div className="mt-4 bg-blue-50/80 border-l-4 border-blue-500 rounded-r-xl p-4">
                                <div className="flex items-start gap-3">
                                    <FaChartBar className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <Typography variant="h5" className="text-blue-800 text-sm font-semibold mb-1">
                                            {t('korNote.title')}
                                        </Typography>
                                        <Typography variant="small" className="text-blue-700 text-sm leading-relaxed mb-3">
                                            {t('korNote.body')}
                                        </Typography>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                <FaInfoCircle className="text-[10px]" />
                                                {t('korNote.currentAssumption')}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                <FaCheckCircle className="text-[10px]" />
                                                {t('korNote.futureCommitment')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-green-50/80 border border-green-200 rounded-lg">
                                <Typography variant="small" className="text-green-700 text-xs text-center">
                                    <FaCheckCircle className="inline mr-1.5" />
                                    {t('verify.note')}
                                </Typography>
                            </div>
                        </InfoCard>
                    </Reveal>
                </div>
            </Section>

            {/* Due Diligence & Verification */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">
                            {t('dueDiligence.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('dueDiligence.subtitle')}
                        </Typography>
                    </Reveal>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Reveal>
                            <InfoCard icon={FaGlobeAfrica} title={t('dueDiligence.publicTitle')} variant="primary" showInfoBadge={false} className="h-full">
                                <ul className="space-y-3 text-sm">
                                    {(t('dueDiligence.publicItems', { returnObjects: true }) as string[]).map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <InfoCard icon={FaFileContract} title={t('dueDiligence.ndaTitle')} variant="accent" showInfoBadge={false} className="h-full">
                                <ul className="space-y-3 text-sm">
                                    {(t('dueDiligence.ndaItems', { returnObjects: true }) as string[]).map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <FaCheckCircle className="text-accent mt-0.5 flex-shrink-0 text-xs" />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </InfoCard>
                        </Reveal>
                    </div>

                    <Reveal className="mt-6 p-3 bg-primary/5 rounded-lg max-w-2xl mx-auto text-center">
                        <Typography variant="small" className="text-gray-600 text-xs">
                            <FaInfoCircle className="inline mr-1.5 text-accent" />
                            {t('dueDiligence.note')}
                        </Typography>
                    </Reveal>
                </div>
            </Section>

            {/* Certifications */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('certifications.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-3xl mx-auto">{t('certifications.body')}</Typography>
                    </Reveal>
                    <Reveal>
                        <CertificationsCard certifications={certifications} title={t('certifications.cardTitle')} subtitle={t('certifications.cardSubtitle')} variant="primary" columns={5} />
                    </Reveal>
                </div>
            </Section>

            {/* Competitive Analysis */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">{t('competitiveAnalysis.title')}</Typography>
                    </Reveal>
                    <Reveal className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl overflow-hidden transform-gpu">
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                        <div className="relative z-10">
                            <div className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-white">
                                <Typography variant="h3" className="!text-white">{t('competitiveAnalysis.tableTitle')}</Typography>
                            </div>
                            <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-200">
                                <div className="flex items-start gap-2">
                                    <FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0 text-xs" />
                                    <Typography variant="small" className="text-amber-700 text-xs">{t('competitiveAnalysis.disclaimer')}</Typography>
                                </div>
                            </div>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="bg-white/30 backdrop-blur-sm">
                                        <th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveAnalysis.competitorType')}</th>
                                        <th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveAnalysis.theirAdvantage')}</th>
                                        <th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveAnalysis.theirDisadvantage')}</th>
                                        <th className="px-6 py-4 text-left font-semibold text-text-dark">{t('competitiveAnalysis.ourStrategy')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200/50">
                                    {competitiveRows.map((row, idx) => (
                                        <tr key={idx} className={`${idx === 1 ? 'bg-white/10' : ''} hover:bg-white/20 transition-colors duration-300`}>
                                            <td className="px-6 py-4 font-medium text-text-dark">{row.competitor}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{row.advantage}</td>
                                            <td className="px-6 py-4 text-sm text-red-600">{row.weakness}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start">
                                                    <FaCheckCircle className="text-primary mt-1 mr-2 flex-shrink-0" />
                                                    <span className="text-sm text-green-700">{row.strategy}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="md:hidden p-4 space-y-4">
                                {competitiveRows.map((row, idx) => (
                                    <motion.div key={idx} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30" whileHover={{ y: -2 }}>
                                        <h4 className="font-semibold text-primary mb-2">{row.competitor}</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="font-medium">✓ {t('competitiveAnalysis.theirAdvantage')}:</span><p className="text-gray-600">{row.advantage}</p></div>
                                            <div><span className="font-medium">✗ {t('competitiveAnalysis.theirDisadvantage')}:</span><p className="text-red-600">{row.weakness}</p></div>
                                            <div className="bg-primary/10 p-3 rounded-lg mt-2"><span className="font-medium flex items-center gap-2"><FaShieldAlt className="text-primary" />{t('competitiveAnalysis.ourStrategy')}:</span><p className="text-green-700 mt-0.5">{row.strategy}</p></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                    <Reveal className="mt-8">
                        <InfoCard icon={FaCrown} title={t('competitiveAnalysis.uniqueValueTitle')} variant="primary" showInfoBadge={false} className="text-center">
                            <Typography variant="body" className="text-gray-700 max-w-3xl mx-auto">{t('competitiveAnalysis.uniqueValueDesc')}</Typography>
                        </InfoCard>
                    </Reveal>
                </div>
            </Section>

            {/* Shariah — Horizontal Banner */}
            <Section className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Reveal>
                        <InfoCard icon={FaHandshake} title={t('shariah.cardTitle')} variant="primary" showInfoBadge={false}>
                            <Typography variant="body" className="text-gray-600 mb-3">{t('shariah.body')}</Typography>
                            <StaggerList className="grid md:grid-cols-2 gap-2">
                                {(t('shariah.items', { returnObjects: true }) as string[]).map((item, i) => (
                                    <StaggerItem key={i} className="flex items-start gap-2">
                                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                        <span className="text-gray-700 text-sm">{item}</span>
                                    </StaggerItem>
                                ))}
                            </StaggerList>
                        </InfoCard>
                    </Reveal>
                </div>
            </Section>

            {/* Risk — Full Width Grid */}
            <Section className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Reveal>
                        <Typography variant="h2" className="mb-6 text-center">{t('risk.title')}</Typography>
                    </Reveal>
                    <StaggerList className="grid md:grid-cols-2 gap-4">
                        {riskItems.map((item, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard icon={FaShieldAlt} title={item.risk} variant="accent" showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600 text-xs leading-relaxed">
                                        {item.mitigation}
                                    </Typography>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* Impact */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">{t('impact.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('impact.subtitle')}</Typography>
                    </Reveal>
                    <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {impactMetrics.map((metric, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard icon={metric.icon} title={metric.value} subtitle={metric.label} iconColor={metric.color} showInfoBadge={false} className="h-full text-center">
                                    <Typography variant="small" className="text-gray-500 text-xs mt-2">{metric.desc}</Typography>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* Investor Letter — expanded social proof */}
            <Section className="py-10">
                <InvestorLetter
                    onScheduleVisit={() => {
                        trackCtaClick('schedule_visit', 'investor_letter');
                        navigate('/contact#schedule-call');
                    }}
                />
                <Typography variant="small" className="text-gray-400 text-xs text-center mt-6">
                    {t("investorLetter.permission")}
                </Typography>
            </Section>

            {/* Team */}
            <Section className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">
                            {t('team.title')}
                        </Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('team.subtitle')}
                        </Typography>
                    </Reveal>

                    <StaggerList className="grid sm:grid-cols-2 gap-6">
                        {teamMembers
                            .filter((member: any) => member.imageKey === 'ceo' || member.imageKey === 'cfo')
                            .map((member: any, idx: number) => {
                                const hasPhoto = teamImageMap[member.imageKey];

                                return (
                                    <StaggerItem key={idx}>
                                        <motion.div
                                            className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-6 transform-gpu overflow-hidden h-full"
                                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                            whileHover={{
                                                y: -6,
                                                scale: 1.03,
                                                boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)',
                                                transition: { duration: 0.3 },
                                            }}
                                        >
                                            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.05)]" />

                                            <div className="relative z-10 flex flex-col items-center text-center">
                                                <div className="relative mb-4">
                                                    {hasPhoto ? (
                                                        <img
                                                            src={hasPhoto}
                                                            alt={member.name}
                                                            className="w-24 h-24 rounded-full object-cover border-2 border-white/40 shadow-md group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <ProfilePlaceholder
                                                            name={member.name}
                                                            size={96}
                                                            variant="primary"
                                                            className="shadow-md group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    )}
                                                    <div className="absolute -bottom-1 -right-1 bg-accent text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white">
                                                        {member.name.charAt(0)}
                                                    </div>
                                                </div>

                                                <Typography variant="h4" className="text-primary">
                                                    {member.name}
                                                </Typography>
                                                <Typography variant="small" className="text-accent text-sm font-medium mt-1 mb-3">
                                                    {member.position}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-600 text-sm leading-relaxed">
                                                    {member.bio}
                                                </Typography>
                                            </div>
                                        </motion.div>
                                    </StaggerItem>
                                );
                            })}
                    </StaggerList>

                    <Reveal className="text-center mt-8">
                        <motion.button
                            onClick={() => {
                                trackCtaClick('view_leadership_team', 'invest_page');
                                navigate('/executive-team');
                            }}
                            className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-full transform-gpu transition-all duration-300 inline-flex items-center gap-2 text-sm font-medium bg-white/30 backdrop-blur-sm"
                            whileHover={{ y: -2, scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaUsers className="text-sm" />
                            {t('team.viewAll', 'View the Full Leadership Team')}
                            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Reveal>
                </div>
            </Section>

            {/* Final CTA */}
            <Section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Reveal>
                        <InfoCard
                            icon={FaFileContract}
                            title={t('cta.title')}
                            variant="primary"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto mb-6">
                                {t('cta.body')}
                            </Typography>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={ndaPDF}
                                    download
                                    className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-3 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center justify-center gap-2"
                                >
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover/btn:opacity-70 transition-opacity duration-300" />
                                    <FaFileContract className="relative z-10" />
                                    <span className="relative z-10">{t('cta.downloadNda')}</span>
                                </a>
                                <motion.button
                                    onClick={() => {
                                        trackCtaClick('schedule_call', 'invest_final_cta');
                                        navigate('/contact#schedule-call');
                                    }}
                                    className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-full transform-gpu font-medium inline-flex items-center justify-center gap-2 bg-white/30 backdrop-blur-sm transition-colors duration-300"
                                    whileHover={{ y: -2 }}
                                >
                                    <FaHandshake />
                                    {t('cta.scheduleCall')}
                                </motion.button>
                            </div>
                        </InfoCard>
                    </Reveal>
                </div>
            </Section>

            {/* Legal & Compliance */}
            <Section className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Reveal>
                        <InfoCard
                            icon={FaShieldAlt}
                            title={t('legalCompliance.title')}
                            subtitle={t('legalCompliance.subtitle')}
                            variant="secondary"
                            showInfoBadge={false}
                        >
                            <StaggerList className="space-y-3">
                                {(t('legalCompliance.items', { returnObjects: true }) as string[]).map((item, idx) => (
                                    <StaggerItem
                                        key={idx}
                                        className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/30"
                                    >
                                        <FaCheckCircle className="text-primary mt-0.5 flex-shrink-0 text-xs" />
                                        <Typography variant="small" className="text-gray-700 text-xs leading-relaxed">
                                            {item}
                                        </Typography>
                                    </StaggerItem>
                                ))}
                            </StaggerList>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <Typography variant="small" className="text-gray-500 text-xs italic text-center">
                                    {t('legalCompliance.note')}
                                </Typography>
                            </div>
                        </InfoCard>
                    </Reveal>
                </div>
            </Section>
        </div>
        </MotionConfig>
    );
};

export default Invest;