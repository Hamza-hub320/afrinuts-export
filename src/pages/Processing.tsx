import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    FaExpand,
    FaCompress
} from "react-icons/fa";
// AnimatedProgressBar: KPI glassy 3D progress bar with animation
interface AnimatedProgressBarProps {
    label: string;
    value: number;
    color: 'primary' | 'accent' | 'green';
    duration?: number;
    isVisible: boolean;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
                                                                     label,
                                                                     value,
                                                                     color,
                                                                     duration = 1500,
                                                                     isVisible
                                                                 }) => {
    const [progress, setProgress] = useState(0);
    const percentage = Math.abs(value);
    const isNegative = value < 0;

    const colorClasses = {
        primary: {
            bg: 'bg-primary/20',
            bar: 'bg-primary',
            text: 'text-primary'
        },
        accent: {
            bg: 'bg-accent/20',
            bar: 'bg-accent',
            text: 'text-accent'
        },
        green: {
            bg: 'bg-green-200',
            bar: 'bg-green-600',
            text: 'text-green-600'
        }
    };

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setProgress(percentage);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setProgress(0);
        }
    }, [isVisible, percentage]);

    return (
        <div className="mb-8 transform-gpu">
            <div className="flex justify-between mb-3">
                <span className={`text-base font-medium ${colorClasses[color].text}`}>{label}</span>
                <span className={`text-base font-medium ${colorClasses[color].text}`}>
          {isNegative ? '-' : ''}{progress}%
        </span>
            </div>

            {/* Progress bar container with glassy effect */}
            <div className={`relative w-full h-5 rounded-2xl ${colorClasses[color].bg} shadow-inner overflow-hidden transform-gpu`}
                 style={{ transformStyle: 'preserve-3d' }}>

                {/* 3D edge effect */}
                <div className="absolute inset-0 rounded-2xl border border-white/30 transform-gpu translate-z-[-2px] transition-all duration-300" />

                {/* Glassy overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-40 transition-opacity duration-300" />

                {/* Inner shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" />

                {/* Subtle pattern */}
                <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMCwgMCwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iNjAiIHkyPSI2MCIvPjxsaW5lIHgxPSI2MCIgeTE9IjAiIHgyPSIwIiB5Mj0iNjAiLz48L2c+PC9zdmc+')] opacity-10" />

                {/* Animated progress bar */}
                <motion.div
                    className={`relative h-5 rounded-2xl ${colorClasses[color].bar} shadow-lg transform-gpu`}
                    initial={{ width: "0%" }}
                    animate={{ width: isVisible ? `${100 - percentage}%` : "0%" }}
                    transition={{ duration: duration / 1000, ease: "easeOut" }}
                    style={{
                        transformStyle: 'preserve-3d',
                        originX: 0
                    }}
                >
                    {/* Progress bar glossy effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent" />

                    {/* Progress bar inner highlight */}
                    <div className="absolute top-0 left-0 w-full h-1/2 rounded-t-2xl bg-white/10" />

                    {/* Animated particles (optional) */}
                    {isVisible && (
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div
                                className="absolute top-0 right-0 w-2 h-full bg-white/30"
                                initial={{ x: -20 }}
                                animate={{ x: '100%' }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "linear"
                                }}
                            />
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Improvement indicator */}
            <div className="flex justify-end mt-2">
                <motion.span
                    className={`text-xs font-medium ${colorClasses[color].text} flex items-center`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
                    transition={{ delay: duration / 1000, duration: 0.3 }}
                >
                    {isNegative ? (
                        <>
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            Reduction
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            Improvement
                        </>
                    )}
                </motion.span>
            </div>
        </div>
    );
};
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Mermaid from '@/components/Mermaid/Mermaid';

const Processing: React.FC = () => {
    const { t } = useTranslation('processing');
    const navigate = useNavigate();
    const [activePhase, setActivePhase] = useState<'phase1' | 'phase2'>('phase1');
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mermaidKey, setMermaidKey] = useState(0);
    const [viewMode, setViewMode] = useState<'diagram' | 'steps'>('diagram');
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    // Phase 1 Mermaid chart
    const phase1Chart = `
    flowchart TD
      A[Reception & Storage of Raw Nuts] --> B[Steaming_Roasting_Small_Batch]
      A1(RCN intake, manual sampling, warehouse stacking) --> A
      B1(Small drum roasters_steam kettles; no chemicals) --> B
      B --> C[Shelling_Manual_Semi_automatic]
      C1(Hand shellers, bench-top cutters, protective gear) --> C
      C --> D[Drying & Peeling]
      D1(Small tray/borma dryers, air-curing, manual peeling) --> D
      D --> E[Grading]
      E1(Manual size/color sorters, visual inspection) --> E
      E --> F[Packaging]
      F1(Small vacuum sealer + nitrogen flush; cartons) --> F
      F --> G[Finished Goods Storage]
      G1(FIFO, humidity control with simple hygrometers) --> G
      G --> H[Dispatch & Export Docs]
      H1(Manual records, COO, SGS, Organic, Halal cert prep) --> H

      subgraph QA1[Inline QA & Records]
        Q1[Moisture tests_oven method]:::qa
        Q2[Kernel out-turn cut tests]:::qa
        Q3[Batch logs_paper/Excel]:::qa
      end
      A -.-> Q1
      C -.-> Q2
      D -.-> Q3

      classDef qa fill:#fef9c3,stroke:#ca8a04,color:#713f12;
  `;

    // Phase 2 Mermaid chart
    const phase2Chart = `
     flowchart TD
      A["Reception & Storage of Raw Nuts"] --> B["Steaming / Roasting (Industrial)"]
      A1["RCN intake, sampling labs, silo/warehouse storage with ventilation"] --> A
      B1["Continuous steam roasters / large drum roasters; no chemicals"] --> B
      B --> C["Shelling (Automated)"]
      C1["Semi-automated cutters, conveyorized shellers, dust extractors"] --> C
      C --> D["Drying & Peeling"]
      D1["Industrial tray/borma dryers with airflow; mechanical peeling aids"] --> D
      D --> E["Grading"]
      E1["Mechanical graders: size/color sorters, metal detectors"] --> E
      E --> F["Packaging"]
      F1["Industrial vacuum packers, nitrogen-flush, inline checkweighers"] --> F
      F --> G["Finished Goods Storage"]
      G1["Cold room storage, humidity control with sensors"] --> G
      G --> H["Dispatch & Export Docs"]
      H1["ERP system for COO, SGS, Phyto, Halal, Organic certs"] --> H

      subgraph QA2[Inline QA & Records]
        Q1["Moisture sensors, automated logging"]:::qa
        Q2["Kernel out-turn (lab sampling)"]:::qa
        Q3["ERP-based traceability & batch logs"]:::qa
        Q4["Metal detection inline"]:::qa
      end
      A --> Q1
      C --> Q2
      D --> Q3
      E --> Q4

      classDef qa fill:#d1fae5,stroke:#047857,color:#064e3b;
  `;

    const currentChart = activePhase === 'phase1' ? phase1Chart : phase2Chart;

    // Phase 1 steps
    const phase1Steps = [
        {
            title: t('phase1.steps.reception.title'),
            description: t('phase1.steps.reception.description'),
            icon: FaIndustry,
            duration: 4000
        },
        {
            title: t('phase1.steps.steaming.title'),
            description: t('phase1.steps.steaming.description'),
            icon: FaCogs,
            duration: 4000
        },
        {
            title: t('phase1.steps.shelling.title'),
            description: t('phase1.steps.shelling.description'),
            icon: FaRobot,
            duration: 4000
        },
        {
            title: t('phase1.steps.drying.title'),
            description: t('phase1.steps.drying.description'),
            icon: FaTree,
            duration: 4000
        },
        {
            title: t('phase1.steps.grading.title'),
            description: t('phase1.steps.grading.description'),
            icon: FaLeaf,
            duration: 4000
        },
        {
            title: t('phase1.steps.packaging.title'),
            description: t('phase1.steps.packaging.description'),
            icon: FaShieldAlt,
            duration: 4000
        }
    ];

    // Phase 2 steps
    const phase2Steps = [
        {
            title: t('phase2.steps.reception.title'),
            description: t('phase2.steps.reception.description'),
            icon: FaIndustry,
            duration: 3500
        },
        {
            title: t('phase2.steps.steaming.title'),
            description: t('phase2.steps.steaming.description'),
            icon: FaCogs,
            duration: 3500
        },
        {
            title: t('phase2.steps.shelling.title'),
            description: t('phase2.steps.shelling.description'),
            icon: FaRobot,
            duration: 3500
        },
        {
            title: t('phase2.steps.drying.title'),
            description: t('phase2.steps.drying.description'),
            icon: FaTree,
            duration: 3500
        },
        {
            title: t('phase2.steps.grading.title'),
            description: t('phase2.steps.grading.description'),
            icon: FaLeaf,
            duration: 3500
        },
        {
            title: t('phase2.steps.packaging.title'),
            description: t('phase2.steps.packaging.description'),
            icon: FaShieldAlt,
            duration: 3500
        }
    ];

    const currentSteps = activePhase === 'phase1' ? phase1Steps : phase2Steps;

    // Reinitialize Mermaid when phase changes
    useEffect(() => {
        setMermaidKey(prev => prev + 1);
    }, [activePhase]);

    // Auto-play animation for step-by-step view
    useEffect(() => {
        if (isPlaying && viewMode === 'steps') {
            animationRef.current = setInterval(() => {
                setActiveStep(prev => (prev + 1) % currentSteps.length);
            }, currentSteps[activeStep]?.duration || 4000);
        } else if (animationRef.current) {
            clearInterval(animationRef.current);
        }

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [isPlaying, activeStep, currentSteps.length, viewMode]);

    const nextStep = () => {
        setActiveStep(prev => (prev + 1) % currentSteps.length);
    };

    const prevStep = () => {
        setActiveStep(prev => (prev - 1 + currentSteps.length) % currentSteps.length);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'diagram' ? 'steps' : 'diagram');
        setIsPlaying(false);
    };

    return (
        <main className="text-text-dark font-sans">
            {/* Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[50vh] md:min-h-[50vh] bg-gradient-to-b bg-transparent"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="subhead"
                            className="uppercase tracking-widest text-primary mb-4"
                        >
                            {t('hero.subtitle')}
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        {t('hero.title')}
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="lead"
                            className="text-text-dark max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('hero.description')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Back Button */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.button
                        onClick={() => navigate('/farm')}
                        className="flex items-center text-primary hover:text-accent transition-colors"
                        whileHover={{ x: -5 }}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        <FaArrowLeft className="mr-2" />
                        {t('backToFarm')}
                    </motion.button>
                </div>
            </Section>

            {/* Phase Selection */}
           {/* Processing Roadmap Section */}
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
                            {t('roadmap.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('roadmap.description')}
                        </Typography>
                    </motion.div>
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
                        <InfoCard
                            icon={FaIndustry}
                            title={t('roadmap.phase1.title')}
                            iconColor="text-primary"
                            className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 shadow-lg flex flex-col"
                        >
                            <Typography variant="body" className="mb-4">
                                {t('roadmap.phase1.description')}
                            </Typography>
                            <ul className="list-disc pl-6 text-left text-base text-text-dark/80">
                                <li>{t('roadmap.phase1.point1')}</li>
                                <li>{t('roadmap.phase1.point2')}</li>
                                <li>{t('roadmap.phase1.point3')}</li>
                            </ul>
                        </InfoCard>
                        <InfoCard
                            icon={FaCogs}
                            title={t('roadmap.phase2.title')}
                            iconColor="text-accent"
                            className="flex-1 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20 shadow-lg flex flex-col"
                        >
                            <Typography variant="body" className="mb-4">
                                {t('roadmap.phase2.description')}
                            </Typography>
                            <ul className="list-disc pl-6 text-left text-base text-text-dark/80">
                                <li>{t('roadmap.phase2.point1')}</li>
                                <li>{t('roadmap.phase2.point2')}</li>
                                <li>{t('roadmap.phase2.point3')}</li>
                            </ul>
                        </InfoCard>
                    </div>
                </div>
            </Section>
            <Section className="py-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-6">
                            {t('phases.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto mb-8 text-base md:text-lg leading-relaxed"
                        >
                            {t('phases.description')}
                        </Typography>


                        <div className="flex justify-center space-x-2 flex-wrap">
                            <motion.button
                                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-medium transition-all duration-300 transform-gpu ${
                                    activePhase === 'phase1'
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'bg-white text-primary border-2 border-primary/30 hover:border-primary/50'
                                }`}
                                onClick={() => setActivePhase('phase1')}
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {t('phases.phase1')}
                            </motion.button>
                            <motion.button
                                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-lg font-medium transition-all duration-300 transform-gpu ${
                                    activePhase === 'phase2'
                                        ? 'bg-accent text-white shadow-lg'
                                        : 'bg-white text-accent border-2 border-accent/30 hover:border-accent/50'
                                }`}
                                onClick={() => setActivePhase('phase2')}
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {t('phases.phase2')}
                            </motion.button>
                        </div>
                        </motion.div>

                    {/* Phase Description */}
                    <motion.div
                        className="mb-16 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h3" className="mb-4 text-primary">
                            {activePhase === 'phase1' ? t('phase1.title') : t('phase2.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-4xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {activePhase === 'phase1' ? t('phase1.description') : t('phase2.description')}
                        </Typography>
                        <div className="mt-4 flex items-center justify-center space-x-4">
                            <div className="flex items-center bg-primary/10 px-4 py-2 rounded-full">
                                <FaIndustry className="text-primary mr-2" />
                                <span className="text-xs sm:text-sm font-medium">
                                    {activePhase === 'phase1' ? '1,000-2,000 MT/year' : '5,000 MT/year'}
                                </span>
                            </div>
                            <div className="flex items-center bg-accent/10 px-4 py-2 rounded-full">
                                <FaCogs className="text-accent mr-2" />
                                <span className="text-xs sm:text-sm font-medium">
                                    {activePhase === 'phase1' ? t('phase1.automation') : t('phase2.automation')}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* View Mode Toggle */}
                    <motion.div
                        className="flex justify-center mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 border border-primary/20">
                            <button
                                onClick={() => setViewMode('diagram')}
                                className={`px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                                    viewMode === 'diagram'
                                        ? 'bg-primary text-white'
                                        : 'text-primary hover:bg-primary/10'
                                }`}
                            >
                                {t('viewMode.diagram')}
                            </button>
                            <button
                                onClick={() => setViewMode('steps')}
                                className={`px-3 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                                    viewMode === 'steps'
                                        ? 'bg-accent text-white'
                                        : 'text-accent hover:bg-accent/10'
                                }`}
                            >
                                {t('viewMode.steps')}
                            </button>
                        </div>
                    </motion.div>

                    {/* Workflow Visualization Container */}
                    <motion.div
                        className={`relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border-2 border-primary/20 hover:border-accent/30 transition-all duration-500 shadow-xl overflow-hidden transform-gpu ${
                            isFullscreen ? 'fixed inset-0 z-50 m-4' : ''
                        }`}
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
                            rotateY: 2,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <Typography variant="h3" className="mb-2">
                                        {viewMode === 'diagram' ? t('workflow.title') : t('stepByStep.title')}
                                    </Typography>
                                    <Typography
                                        variant="body-sm"
                                        className="text-text-dark/70 text-sm md:text-base leading-relaxed"
                                    >
                                        {viewMode === 'diagram' ? t('workflow.subtitle') : t('stepByStep.subtitle')}
                                    </Typography>
                                </div>
                                <div className="flex space-x-2">
                                    {viewMode === 'diagram' && (
                                        <motion.button
                                            onClick={toggleFullscreen}
                                            className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                        >
                                            {isFullscreen ? <FaCompress /> : <FaExpand />}
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            {/* Content based on view mode */}
                            {viewMode === 'diagram' ? (
                                /* Mermaid Diagram View */
                                <>
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 overflow-auto">
                                        <Mermaid
                                            chart={currentChart}
                                            key={mermaidKey}
                                        />
                                    </div>

                                    {/* Legend */}
                                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 rounded-sm bg-[#fef9c3] border border-[#ca8a04] mr-2"></div>
                                            <span className="text-sm text-text-dark">{t('workflow.qaManual')}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 rounded-sm bg-[#d1fae5] border border-[#047857] mr-2"></div>
                                            <span className="text-sm text-text-dark">{t('workflow.qaAutomated')}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 rounded-sm bg-purple-200 border border-purple-500 mr-2"></div>
                                            <span className="text-sm text-text-dark">{t('workflow.processStep')}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Step-by-Step View */
                                <>
                                    <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
                                        {/* Step Visualization */}
                                        <div className="flex-1 mb-8 lg:mb-0 lg:mr-8">
                                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-primary/20">
                                                <div className="flex justify-center items-center h-40 sm:h-64">
                                                    <div className="text-center">
                                                        <div className="text-6xl mb-4 text-primary">
                                                            {activeStep + 1}
                                                        </div>
                                                        <Typography variant="h4" className="text-primary">
                                                            {currentSteps[activeStep]?.title}
                                                        </Typography>
                                                        <div className="mt-4 text-4xl text-accent">
                                                            {React.createElement(currentSteps[activeStep]?.icon)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step Description */}
                                        <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                                            <Typography variant="h4" className="mb-4 text-primary">
                                                {currentSteps[activeStep]?.title}
                                            </Typography>
                                            <Typography
                                                variant="body"
                                                className="text-text-dark text-base md:text-lg leading-relaxed"
                                            >
                                                {currentSteps[activeStep]?.description}
                                            </Typography>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex justify-center items-center space-x-4">
                                        <motion.button
                                            onClick={prevStep}
                                            className="p-2 sm:p-3 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            aria-label="Previous step"
                                        >
                                            <FaArrowLeft />
                                        </motion.button>

                                        <motion.button
                                            onClick={togglePlay}
                                            className="px-3 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-full flex items-center space-x-2"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>{isPlaying ? t('controls.pause') : t('controls.play')}</span>
                                            {isPlaying ? <FaPause /> : <FaPlay />}
                                        </motion.button>

                                        <motion.button
                                            onClick={nextStep}
                                            className="p-2 sm:p-3 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            aria-label="Next step"
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
                                                    index === activeStep
                                                        ? 'bg-primary scale-125'
                                                        : 'bg-primary/30 hover:bg-primary/50'
                                                }`}
                                                aria-label={`Go to step ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Phase Toggle */}
                            <div className="flex justify-center items-center space-x-4 mt-6">
                                <motion.button
                                    onClick={() => setActivePhase('phase1')}
                                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium transition-colors ${
                                        activePhase === 'phase1'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('phases.phase1')}
                                </motion.button>

                                <motion.button
                                    onClick={() => setActivePhase('phase2')}
                                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-sm font-medium transition-colors ${
                                        activePhase === 'phase2'
                                            ? 'bg-accent text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('phases.phase2')}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
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
                            iconColor="text-accent"
                        >
                            {t('differentiators.quality.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaRecycle}
                            title={t('differentiators.sustainability.title')}
                            iconColor="text-accent"
                        >
                            {t('differentiators.sustainability.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaCertificate}
                            title={t('differentiators.certifications.title')}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <InfoCard
                            icon={FaCertificate}
                            title={t('certifications.organic.title')}
                            iconColor="text-[#22c55e]"
                        >
                            {t('certifications.organic.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaCertificate}
                            title={t('certifications.fairtrade.title')}
                            iconColor="text-[#fbbf24]"
                        >
                            {t('certifications.fairtrade.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaCertificate}
                            title={t('certifications.halal.title')}
                            iconColor="text-[#0ea5e9]"
                        >
                            {t('certifications.halal.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaCertificate}
                            title={t('certifications.iso.title')}
                            iconColor="text-[#818cf8]"
                        >
                            {t('certifications.iso.description')}
                        </InfoCard>
                    </div>
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
                            iconColor="text-accent"
                        >
                            {t('sustainability.water.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaRecycle}
                            title={t('sustainability.waste.title')}
                            iconColor="text-accent"
                        >
                            {t('sustainability.waste.description')}
                        </InfoCard>
                        <InfoCard
                            icon={FaLeaf}
                            title={t('sustainability.energy.title')}
                            iconColor="text-accent"
                        >
                            {t('sustainability.energy.description')}
                        </InfoCard>
                    </div>
                </div>
            </Section>

            {/* KPI Section */}
            <Section className="py-16">
                <div className="max-w-2xl mx-auto">
                    <AnimatedProgressBar
                        label={t('sustainability.kpis.water')}
                        value={-38}
                        color="primary"
                        isVisible={true}
                    />
                    <AnimatedProgressBar
                        label={t('sustainability.kpis.waste')}
                        value={-45}
                        color="accent"
                        isVisible={true}
                    />
                    <AnimatedProgressBar
                        label={t('sustainability.kpis.energy')}
                        value={-29}
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
                                onClick={() => navigate('/contact')}
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