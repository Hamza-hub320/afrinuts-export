import React, {useState, useEffect, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {Link, useNavigate} from 'react-router-dom';
import { trackCtaClick } from '@/utils/analytics';
import {
    FaIndustry,
    FaCogs,
    FaRobot,
    FaTree,
    FaLeaf,
    FaShieldAlt,
    FaCertificate,
    FaWater,
    FaRecycle,
    FaArrowRight,
    FaArrowLeft,
    FaPlay,
    FaPause,
     FaAward,
    FaRibbon, FaCheckCircle, FaChartLine,
} from "react-icons/fa";
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import {CertificationsCard} from "@/components/CertificationsCard/CertificationsCard";
import {Helmet} from "react-helmet-async";
import JsonLd from "@/components/Seo/JsonLd";

interface AnimatedProgressBarProps {
    label: string;
    value: number;
    color: 'primary' | 'accent' | 'green';
    duration?: number;
    isVisible: boolean;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
                                                                     label, value, color, duration = 1500, isVisible
                                                                 }) => {
    const [progress, setProgress] = useState(0);
    const percentage = Math.abs(value);

    const colorClasses = {
        primary: { bg: 'bg-primary/20', bar: 'bg-primary', text: 'text-primary' },
        accent: { bg: 'bg-accent/20', bar: 'bg-accent', text: 'text-accent' },
        green: { bg: 'bg-green-200', bar: 'bg-green-600', text: 'text-green-600' }
    };

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setProgress(percentage), 100);
            return () => clearTimeout(timer);
        } else {
            setProgress(0);
        }
    }, [isVisible, percentage]);

    return (
        <div className="mb-8 transform-gpu">
            <div className="flex justify-between mb-3">
                <span className={`text-base font-medium ${colorClasses[color].text}`}>{label}</span>
                <span className={`text-base font-medium ${colorClasses[color].text}`}>{progress}%</span>
            </div>
            <div className={`relative w-full h-5 rounded-2xl ${colorClasses[color].bg} shadow-inner overflow-hidden transform-gpu`}>
                <div className="absolute inset-0 rounded-2xl border border-white/30" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-40" />
                <motion.div
                    className={`relative h-5 rounded-2xl ${colorClasses[color].bar} shadow-lg`}
                    initial={{ width: "0%" }}
                    animate={{ width: isVisible ? `${percentage}%` : "0%" }}
                    transition={{ duration: duration / 1000, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent" />
                </motion.div>
            </div>
        </div>
    );
};

const FlowStep: React.FC<{
    icon: React.ElementType;
    title: string;
    description: string;
    number: number;
    color: 'primary' | 'accent';
    className?: string;
}> = ({ icon: Icon, title, description, number, color, className = '' }) => (
    <motion.div
        className={`flex-1 relative bg-gradient-to-br ${
            color === 'primary' ? 'from-primary/5 to-accent/5 border-primary/20 hover:border-accent/30' : 'from-accent/5 to-primary/5 border-accent/20 hover:border-primary/30'
        } border-2 rounded-2xl p-5 text-center transition-all duration-500 transform-gpu overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        whileHover={{ y: -6, scale: 1.02, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }}
    >
        {/* 3D edge effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
        {/* Glassy overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        {/* Inner shadow */}
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
        {/* Background pattern */}
        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

        <div className="relative z-10">
            <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ${
                color === 'primary' ? 'bg-primary' : 'bg-primary'
            }`}>{number}</div>
            <Icon className={`text-3xl mb-3 ${color === 'primary' ? 'text-primary' : 'text-primary'}`} />
            <Typography variant="h4" className="mb-2">{title}</Typography>
            <Typography variant="small" className="text-gray-600">{description}</Typography>
        </div>
    </motion.div>
);

// Arrow connector
const FlowArrow: React.FC<{ direction?: 'right' | 'down' }> = ({ direction = 'right' }) => (
    <div className={`flex items-center justify-center ${direction === 'down' ? 'py-2' : 'px-2'}`}>
        <FaArrowRight className={`text-gray-400 ${direction === 'down' ? 'rotate-90' : ''}`} />
    </div>
);

const Processing: React.FC = () => {
    const { t } = useTranslation('processing');
    const navigate = useNavigate();
    const [activePhase, setActivePhase] = useState<'phase1' | 'phase2'>('phase1');
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const animationRef = useRef<NodeJS.Timeout | null>(null);


    const [viewMode, setViewMode] = useState<'diagram' | 'steps'>('diagram');


    const phase1Steps = [
        { title: t('phase1.steps.reception.title'), description: t('phase1.steps.reception.description'), icon: FaIndustry, duration: 4000 },
        { title: t('phase1.steps.steaming.title'), description: t('phase1.steps.steaming.description'), icon: FaCogs, duration: 4000 },
        { title: t('phase1.steps.shelling.title'), description: t('phase1.steps.shelling.description'), icon: FaRobot, duration: 4000 },
        { title: t('phase1.steps.drying.title'), description: t('phase1.steps.drying.description'), icon: FaTree, duration: 4000 },
        { title: t('phase1.steps.grading.title'), description: t('phase1.steps.grading.description'), icon: FaLeaf, duration: 4000 },
        { title: t('phase1.steps.packaging.title'), description: t('phase1.steps.packaging.description'), icon: FaShieldAlt, duration: 4000 }
    ];

    const phase2Steps = [
        { title: t('phase2.steps.reception.title'), description: t('phase2.steps.reception.description'), icon: FaIndustry, duration: 3500 },
        { title: t('phase2.steps.steaming.title'), description: t('phase2.steps.steaming.description'), icon: FaCogs, duration: 3500 },
        { title: t('phase2.steps.shelling.title'), description: t('phase2.steps.shelling.description'), icon: FaRobot, duration: 3500 },
        { title: t('phase2.steps.drying.title'), description: t('phase2.steps.drying.description'), icon: FaTree, duration: 3500 },
        { title: t('phase2.steps.grading.title'), description: t('phase2.steps.grading.description'), icon: FaLeaf, duration: 3500 },
        { title: t('phase2.steps.packaging.title'), description: t('phase2.steps.packaging.description'), icon: FaShieldAlt, duration: 3500 }
    ];

    const currentSteps = activePhase === 'phase1' ? phase1Steps : phase2Steps;

    useEffect(() => {
        if (isPlaying && viewMode === 'steps') {
            animationRef.current = setInterval(() => {
                setActiveStep(prev => (prev + 1) % currentSteps.length);
            }, currentSteps[activeStep]?.duration || 4000);
        } else if (animationRef.current) {
            clearInterval(animationRef.current);
        }
        return () => { if (animationRef.current) clearInterval(animationRef.current); };
    }, [isPlaying, activeStep, currentSteps.length, viewMode]);

    const nextStep = () => setActiveStep(prev => (prev + 1) % currentSteps.length);
    const prevStep = () => setActiveStep(prev => (prev - 1 + currentSteps.length) % currentSteps.length);
    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>Cashew Processing | AfriNuts Export – Chemical-Free & Certified</title>
                <meta name="description" content="AfriNuts Export processes organic cashews in Ivory Coast. Two-phase roadmap: pilot to industrial. Chemical-free, certification-ready, and sustainable." />
                <link rel="canonical" href="https://www.afrinutsexport.com/processing" />
            </Helmet>
            <JsonLd data={{
                "@context": "https://schema.org", "@type": "Product",
                "name": "AfriNuts Processed Cashew Kernels",
                "description": "Chemical-free, organic cashew kernels processed in Ivory Coast.",
                "brand": { "@type": "Brand", "name": "AfriNuts Export" },
                "manufacturer": { "@type": "Organization", "name": "AfriNuts Export", "location": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": "Odienné", "addressCountry": "CI" } } }
            }} />

            <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-[88px] pb-2">
                <div className="text-sm text-text-dark mb-4 flex items-center gap-1 flex-wrap">
                    <Link to="/" className="hover:text-primary transition-colors">{t('breadcrumbs.home', 'Home')}</Link>
                    <span>/</span>
                    <Link to="/farm" className="hover:text-primary transition-colors">{t('breadcrumbs.farm', 'Farm')}</Link>
                    <span>/</span>
                    <span className="text-primary font-medium">{t('breadcrumbs.processing', 'Processing')}</span>
                </div>
            </div>

            {/* Hero */}
            <Section fullHeight={false} className="flex items-center justify-center text-center min-h-[40vh]">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-12" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}><Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">{t('hero.subtitle')}</Typography></motion.div>
                    <motion.h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>{t('hero.title')}</motion.h1>
                    <motion.div variants={fadeIn}><Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">{t('hero.description')}</Typography></motion.div>
                </motion.div>
            </Section>

            {/* Roadmap */}
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-12" variants={fadeIn}><Typography variant="h2" className="mb-4">{t('roadmap.title')}</Typography><Typography variant="body" className="max-w-3xl mx-auto">{t('roadmap.description')}</Typography></motion.div>
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                        <InfoCard icon={FaIndustry} title={t('roadmap.phase1.title')} iconColor="text-primary" showInfoBadge={false} className="flex-1">
                            <Typography variant="body" className="mb-4">{t('roadmap.phase1.description')}</Typography>
                            <ul className="list-disc pl-6 text-left text-base text-text-dark/80">
                                <li>{t('roadmap.phase1.point1')}</li><li>{t('roadmap.phase1.point2')}</li><li>{t('roadmap.phase1.point3')}</li>
                            </ul>
                        </InfoCard>
                        <InfoCard icon={FaCogs} title={t('roadmap.phase2.title')} iconColor="text-accent" showInfoBadge={false} className="flex-1">
                            <Typography variant="body" className="mb-4">{t('roadmap.phase2.description')}</Typography>
                            <ul className="list-disc pl-6 text-left text-base text-text-dark/80">
                                <li>{t('roadmap.phase2.point1')}</li><li>{t('roadmap.phase2.point2')}</li><li>{t('roadmap.phase2.point3')}</li>
                            </ul>
                        </InfoCard>
                    </div>
                </div>
            </Section>

            {/* Phases Section with Flow Diagram */}
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-12" variants={fadeIn}>
                        <Typography variant="h2" className="mb-6">{t('phases.title')}</Typography>
                        <Typography variant="body" className="max-w-3xl mx-auto mb-8">{t('phases.description')}</Typography>
                        <div className="flex justify-center space-x-2 flex-wrap">
                            <motion.button className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-medium transition-all ${activePhase === 'phase1' ? 'bg-primary text-white shadow-lg' : 'bg-white text-primary border-2 border-primary/30'}`}
                                           onClick={() => { trackCtaClick('phase1_tab', 'processing_page'); setActivePhase('phase1'); }} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>{t('phases.phase1')}</motion.button>
                            <motion.button className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-medium transition-all ${activePhase === 'phase2' ? 'bg-accent text-white shadow-lg' : 'bg-white text-accent border-2 border-accent/30'}`}
                                           onClick={() => { trackCtaClick('phase2_tab', 'processing_page'); setActivePhase('phase2'); }} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>{t('phases.phase2')}</motion.button>
                        </div>
                    </motion.div>

                    {/* Chemical-Free Badge */}
                    <motion.div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 md:p-12 text-center mb-12 shadow-xl"
                                variants={fadeIn} whileHover={{ y: -4 }}>
                        <FaLeaf className="text-green-600 text-3xl mx-auto mb-4" />
                        <Typography variant="h2" className="mb-4 text-green-800">{t('chemicalFree.title')}</Typography>
                        <Typography variant="lead" className="text-green-700">{t('chemicalFree.description')}</Typography>
                    </motion.div>

                    {/* Processing Flow Carousel */}
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 shadow-xl overflow-hidden transform-gpu"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        whileHover={{ y: -8, scale: 1.02, rotateY: 2, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', transition: { duration: 0.3 } }}
                    >
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <Typography variant="h3" className="mb-2">
                                    {currentSteps[activeStep]?.title}
                                </Typography>
                                <Typography variant="body-sm" className="text-text-dark/70">
                                    {t('phases.phase1')} — Step {activeStep + 1} of {currentSteps.length}
                                </Typography>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
                                {/* Step Icon/Visual */}
                                <div className="flex-1">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/20 flex justify-center items-center h-48">
                                        <div className="text-6xl text-primary">
                                            {React.createElement(currentSteps[activeStep]?.icon)}
                                        </div>
                                    </div>
                                </div>

                                {/* Step Description */}
                                <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                                    <Typography variant="body" className="mb-4">
                                        {currentSteps[activeStep]?.description}
                                    </Typography>

                                    {/* QA Info for specific steps */}
                                    {activeStep === 0 && (
                                        <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                                            <Typography variant="small" className="text-amber-700">
                                                <strong>{t('workflow.qaLabel')}:</strong> {t('phase1.qa.moisture')}
                                            </Typography>
                                        </div>
                                    )}
                                    {activeStep === 2 && (
                                        <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                                            <Typography variant="small" className="text-amber-700">
                                                <strong>{t('workflow.qaLabel')}:</strong> {t('phase1.qa.kernel')}
                                            </Typography>
                                        </div>
                                    )}
                                    {activeStep === 3 && activePhase === 'phase1' && (
                                        <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                                            <Typography variant="small" className="text-amber-700">
                                                <strong>{t('workflow.qaLabel')}:</strong> {t('phase1.qa.batchLogs')}
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex justify-center items-center space-x-4">
                                <motion.button
                                    onClick={prevStep}
                                    className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaArrowLeft />
                                </motion.button>
                                <motion.button
                                    onClick={togglePlay}
                                    className="px-6 py-3 bg-primary text-white rounded-full flex items-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isPlaying ? <FaPause /> : <FaPlay />}
                                    <span>{isPlaying ? t('controls.pause') : t('controls.play')}</span>
                                </motion.button>
                                <motion.button
                                    onClick={nextStep}
                                    className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaArrowRight />
                                </motion.button>
                            </div>

                            {/* Progress indicators */}
                            <div className="mt-6 flex justify-center space-x-2">
                                {currentSteps.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveStep(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            index === activeStep ? 'bg-primary scale-125' : 'bg-primary/30 hover:bg-primary/50'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Why Process Locally */}
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('whyProcessLocal.title')}
                        </Typography>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(t('whyProcessLocal.benefits', { returnObjects: true }) as string[]).map((benefit, index) => (
                            <motion.div
                                key={index}
                                className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-2xl p-6 text-center transform-gpu shadow-lg transition-all duration-500"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                whileHover={{ y: -6, scale: 1.03, rotateY: 2, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)', transition: { duration: 0.3 } }}
                            >
                                {/* 3D edge effect */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                {/* Glassy overlay */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                {/* Inner shadow */}
                                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                                {/* Background pattern */}
                                <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                <div className="relative z-10">
                                    <motion.div
                                        className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm"
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <FaCheckCircle className="text-primary text-xl" />
                                    </motion.div>
                                    <Typography variant="body" className="text-text-dark">{benefit}</Typography>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Key Differentiators */}
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('differentiators.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('differentiators.description')}
                        </Typography>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <InfoCard
                            icon={FaShieldAlt}
                            title={t('differentiators.quality.title')}
                            showInfoBadge={false}
                            iconColor="text-accent"
                        >
                            {t('differentiators.quality.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaRecycle}
                            title={t('differentiators.sustainability.title')}
                            showInfoBadge={false}
                            iconColor="text-accent"
                        >
                            {t('differentiators.sustainability.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaCertificate}
                            title={t('differentiators.certifications.title')}
                            showInfoBadge={false}
                            iconColor="text-accent"
                        >
                            {t('differentiators.certifications.description')}
                        </InfoCard>
                    </div>
                </div>
            </Section>

            {/* Certification Section */}
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('certifications.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('certifications.description')}
                        </Typography>
                    </motion.div>

                    <CertificationsCard
                        certifications={[
                            {
                                id: 'organic',
                                title: t('certifications.organic.title'),
                                description: t('certifications.organic.description'),
                                icon: FaLeaf,
                                status: t('certifications.organic.status') as 'achieved' | 'in-progress' | 'planned',
                                targetDate: t('certifications.organic.targetDate'),
                                issuer: t('certifications.organic.issuer')
                            },
                            {
                                id: 'halal',
                                title: t('certifications.halal.title'),
                                description: t('certifications.halal.description'),
                                icon: FaAward,
                                status: t('certifications.halal.status') as 'achieved' | 'in-progress' | 'planned',
                                targetDate: t('certifications.halal.targetDate'),
                                issuer: t('certifications.halal.issuer')
                            },
                            {
                                id: 'iso',
                                title: t('certifications.iso.title'),
                                description: t('certifications.iso.description'),
                                icon: FaShieldAlt,
                                status: t('certifications.iso.status') as 'achieved' | 'in-progress' | 'planned',
                                targetDate: t('certifications.iso.targetDate'),
                                issuer: t('certifications.iso.issuer')
                            },
                            {
                                id: 'fairtrade',
                                title: t('certifications.fairtrade.title'),
                                description: t('certifications.fairtrade.description'),
                                icon: FaRibbon,
                                status: t('certifications.fairtrade.status') as 'achieved' | 'in-progress' | 'planned',
                                targetDate: t('certifications.fairtrade.targetDate'),
                                issuer: t('certifications.fairtrade.issuer')
                            }
                        ]}
                        title={t('certifications.title')}
                        subtitle={t('certifications.description')}
                        variant="primary"
                        columns={4}
                    />
                </div>
            </Section>

            {/* Sustainability Section */}
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('sustainability.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('sustainability.description')}
                        </Typography>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <InfoCard
                            icon={FaWater}
                            title={t('sustainability.water.title')}
                            showInfoBadge={false}
                            iconColor="text-accent"
                        >
                            {t('sustainability.water.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaRecycle}
                            title={t('sustainability.waste.title')}
                            showInfoBadge={false}
                            iconColor="text-accent"
                        >
                            {t('sustainability.waste.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaLeaf}
                            title={t('sustainability.energy.title')}
                            showInfoBadge={false}
                            iconColor="text-accent"
                        >
                            {t('sustainability.energy.description')}
                        </InfoCard>
                    </div>
                </div>
            </Section>

            {/* CNSL Recovery */}
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="flex flex-col lg:flex-row gap-8 items-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div className="lg:w-1/2" variants={fadeIn}>
                            <InfoCard
                                icon={FaRecycle}
                                title={t('cnslRecovery.title')}
                                iconColor="text-accent"
                                showInfoBadge={false}
                            >
                                {t('cnslRecovery.description')}
                            </InfoCard>
                        </motion.div>
                        <motion.div className="lg:w-1/2" variants={fadeIn}>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: t('cnslRecovery.uses.biofuels'), icon: FaIndustry },
                                    { label: t('cnslRecovery.uses.lubricants'), icon: FaCogs },
                                    { label: t('cnslRecovery.uses.polymers'), icon: FaRecycle },
                                    { label: t('cnslRecovery.uses.revenue'), icon: FaChartLine },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 rounded-2xl p-4 text-center transform-gpu shadow-md transition-all duration-500"
                                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                        whileHover={{ y: -4, scale: 1.03, boxShadow: '0 15px 30px -8px rgba(0,0,0,0.15)', transition: { duration: 0.3 } }}
                                    >
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-4px] group-hover:translate-z-[-8px] transition-all duration-500" />
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] group-hover:shadow-[inset_0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-500" />
                                        <div className="relative z-10">
                                            <motion.div
                                                className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-2"
                                                whileHover={{ scale: 1.15, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                            >
                                                <item.icon className="text-primary text-xl" />
                                            </motion.div>
                                            <Typography variant="small" className="text-text-dark font-medium">{item.label}</Typography>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* KPI Section */}
            <Section className="py-16">
                <div className="max-w-2xl mx-auto">
                    <AnimatedProgressBar
                        label={t('sustainability.kpis.water')}
                        value={38}
                        color="primary"
                        isVisible={true}
                    />
                    <AnimatedProgressBar
                        label={t('sustainability.kpis.waste')}
                        value={45}
                        color="accent"
                        isVisible={true}
                    />
                    <AnimatedProgressBar
                        label={t('sustainability.kpis.energy')}
                        value={29}
                        color="green"
                        isVisible={true}
                    />
                </div>
            </Section>

            {/* Call to Action - Enhanced with Glassy 3D */}
            <Section className="py-16 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                            rotateY: 3,
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-primary mb-4">
                                {t('cta.title')}
                            </Typography>
                            <Typography variant="lead" className="text-text-dark mb-8 max-w-3xl mx-auto">
                                {t('cta.description')}
                            </Typography>

                            <motion.button
                                className="group relative bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-medium shadow-lg transform-gpu hover:scale-105 overflow-hidden"
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    trackCtaClick('contact_us', 'processing_page');
                                    navigate('/contact');
                                }}
                            >
                                {/* Button glossy overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Button inner shadow */}
                                <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />

                                {/* Button text */}
                                <span className="relative z-10 flex items-center justify-center">
                        {t('cta.button')}
                                    <svg
                                        className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default Processing;