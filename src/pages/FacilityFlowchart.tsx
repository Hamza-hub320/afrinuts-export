import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    FaWarehouse,
    FaIndustry,
    FaBox,
    FaTruck,
    FaShower,
    FaPray,
    FaChalkboardTeacher,
    FaUtensils,
    FaWater,
    FaSolarPanel,
    FaExpand,
    FaCompress,
    FaInfoCircle,
    FaArrowLeft,
    FaCertificate
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from "@/components/InfoCard/InfoCard";
import ClickableSVG from '@/components/ClickableSVG/ClickableSVG';
import mermaid from 'mermaid';

const FacilityFlowchart: React.FC = () => {
    const { t } = useTranslation('facility');
    const navigate = useNavigate();
    const [activeZone, setActiveZone] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [svgContent, setSvgContent] = useState<string>('');
    const diagramRef = useRef<HTMLDivElement>(null);

    // Mermaid flowchart definition
    const facilityChart = `
flowchart LR
    A[Raw Nut Reception & Weighbridge] --> B[Raw Nut Storage Warehouse]
    B --> C[Processing Hall - Dirty Zone]
    C --> D[Processing Hall - Clean Zone]
    D --> E[Grading & Packing Section]
    E --> F[Finished Goods Warehouse]
    F --> G[Dispatch & Export Bay]

    subgraph Staff Facilities
      H[Locker Rooms & Hygiene Stations]
      I[Prayer Space & Rest Area]
      J[Training / Meeting Room]
      K[Canteen]
    end

    %% Hygiene checkpoints
    H --> C
    H --> D

    %% Utilities & Expansion
    subgraph Utilities & Expansion
      U1[Water Treatment Plant]
      U2[Biomass Boiler / Solar PV]
      U3[Future Expansion Area]
    end

    Utilities & Expansion -. support .-> C
    Utilities & Expansion -. support .-> D
    Utilities & Expansion -. support .-> E

    classDef process fill:#3b82f6,stroke:#1d4ed8,color:white;
    classDef staff fill:#10b981,stroke:#047857,color:white;
    classDef utilities fill:#f59e0b,stroke:#d97706,color:white;
    
    class A,B,C,D,E,F,G process;
    class H,I,J,K staff;
    class U1,U2,U3 utilities;
  `;

    // Initialize mermaid
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'inherit',
        });
    }, []);

    // Generate SVG from mermaid
    useEffect(() => {
        const generateSVG = async () => {
            try {
                const { svg } = await mermaid.render('facility-flowchart', facilityChart);
                setSvgContent(svg);
            } catch (error) {
                console.error('Error generating mermaid SVG:', error);
            }
        };

        generateSVG();
    }, [facilityChart]);

    // Helper to get features array for a given key, safely typed
    const getFeatures = (key: string): (string | object)[] => {
        const result = t(key, { returnObjects: true });
        return Array.isArray(result) ? result : [];
    };

    // Zone information data
    const zoneInfo = {
        'Raw Nut Reception & Weighbridge': {
            icon: FaTruck,
            description: t('zones.reception.description'),
            features: getFeatures('zones.reception.features'),
            color: 'primary'
        },
        'Raw Nut Storage Warehouse': {
            icon: FaWarehouse,
            description: t('zones.storage.description'),
            features: getFeatures('zones.storage.features'),
            color: 'primary'
        },
        'Processing Hall - Dirty Zone': {
            icon: FaIndustry,
            description: t('zones.dirtyZone.description'),
            features: getFeatures('zones.dirtyZone.features'),
            color: 'primary'
        },
        'Processing Hall - Clean Zone': {
            icon: FaIndustry,
            description: t('zones.cleanZone.description'),
            features: getFeatures('zones.cleanZone.features'),
            color: 'primary'
        },
        'Grading & Packing Section': {
            icon: FaBox,
            description: t('zones.grading.description'),
            features: getFeatures('zones.grading.features'),
            color: 'primary'
        },
        'Finished Goods Warehouse': {
            icon: FaWarehouse,
            description: t('zones.finished.description'),
            features: getFeatures('zones.finished.features'),
            color: 'primary'
        },
        'Dispatch & Export Bay': {
            icon: FaTruck,
            description: t('zones.dispatch.description'),
            features: getFeatures('zones.dispatch.features'),
            color: 'primary'
        },
        'Locker Rooms & Hygiene Stations': {
            icon: FaShower,
            description: t('zones.locker.description'),
            features: getFeatures('zones.locker.features'),
            color: 'accent'
        },
        'Prayer Space & Rest Area': {
            icon: FaPray,
            description: t('zones.prayer.description'),
            features: getFeatures('zones.prayer.features'),
            color: 'accent'
        },
        'Training / Meeting Room': {
            icon: FaChalkboardTeacher,
            description: t('zones.training.description'),
            features: getFeatures('zones.training.features'),
            color: 'accent'
        },
        'Canteen': {
            icon: FaUtensils,
            description: t('zones.canteen.description'),
            features: getFeatures('zones.canteen.features'),
            color: 'accent'
        },
        'Water Treatment Plant': {
            icon: FaWater,
            description: t('zones.water.description'),
            features: getFeatures('zones.water.features'),
            color: 'secondary'
        },
        'Biomass Boiler / Solar PV': {
            icon: FaSolarPanel,
            description: t('zones.energy.description'),
            features: getFeatures('zones.energy.features'),
            color: 'secondary'
        },
        'Future Expansion Area': {
            icon: FaExpand,
            description: t('zones.expansion.description'),
            features: getFeatures('zones.expansion.features'),
            color: 'secondary'
        }
    } as const;

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Add this near your state declarations
    const [debugInfo, setDebugInfo] = useState<{id: string, text: string, type: string} | null>(null);


    const handleSVGClick = (id: string, text: string, elementType: string) => {
        console.log('Clicked element:', { id, text, elementType });

        // More comprehensive zone mapping
        const zoneMap: Record<string, string> = {
            // Node IDs (may vary based on mermaid version)
            'flowchart-A-62': 'Raw Nut Reception & Weighbridge',
            'flowchart-B-63': 'Raw Nut Storage Warehouse',
            'flowchart-C-64': 'Processing Hall - Dirty Zone',
            'flowchart-D-65': 'Processing Hall - Clean Zone',
            'flowchart-E-66': 'Grading & Packing Section',
            'flowchart-F-67': 'Finished Goods Warehouse',
            'flowchart-G-68': 'Dispatch & Export Bay',
            'flowchart-H-69': 'Locker Rooms & Hygiene Stations',
            'flowchart-I-70': 'Prayer Space & Rest Area',
            'flowchart-J-71': 'Training / Meeting Room',
            'flowchart-K-72': 'Canteen',
            'flowchart-U1-73': 'Water Treatment Plant',
            'flowchart-U2-74': 'Biomass Boiler / Solar PV',
            'flowchart-U3-75': 'Future Expansion Area',

            // Text-based mapping as fallback
            'Raw Nut Reception & Weighbridge': 'Raw Nut Reception & Weighbridge',
            'Raw Nut Storage Warehouse': 'Raw Nut Storage Warehouse',
            'Processing Hall - Dirty Zone': 'Processing Hall - Dirty Zone',
            'Processing Hall - Clean Zone': 'Processing Hall - Clean Zone',
            'Grading & Packing Section': 'Grading & Packing Section',
            'Finished Goods Warehouse': 'Finished Goods Warehouse',
            'Dispatch & Export Bay': 'Dispatch & Export Bay',
            'Locker Rooms & Hygiene Stations': 'Locker Rooms & Hygiene Stations',
            'Prayer Space & Rest Area': 'Prayer Space & Rest Area',
            'Training / Meeting Room': 'Training / Meeting Room',
            'Canteen': 'Canteen',
            'Water Treatment Plant': 'Water Treatment Plant',
            'Biomass Boiler / Solar PV': 'Biomass Boiler / Solar PV',
            'Future Expansion Area': 'Future Expansion Area',

            // Shorthand / label-only mappings
            'Expansion': 'Future Expansion Area',
            'Utilities': 'Utilities & Expansion',
            'Dirty Zone': 'Processing Hall - Dirty Zone',
            'Clean Zone': 'Processing Hall - Clean Zone',
            'Grading': 'Grading & Packing Section',
        };

        // Try to find the zone by ID first, then by text
        let zoneName = zoneMap[id] || zoneMap[text] || text;

        // If we still can't find it, try partial matching (case-insensitive)
        if (!zoneInfo[zoneName as keyof typeof zoneInfo]) {
            for (const key in zoneInfo) {
                if (
                    key.toLowerCase().includes(text.toLowerCase()) ||
                    text.toLowerCase().includes(key.toLowerCase())
                ) {
                    zoneName = key;
                    break;
                }
            }
        }

        console.log('Resolved zone:', zoneName);

        if (zoneInfo[zoneName as keyof typeof zoneInfo]) {
            setActiveZone(zoneName === activeZone ? null : zoneName);
        } else {
            console.warn('Unknown zone clicked:', { id, text, elementType });
        }
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
                        onClick={() => navigate('/processing')}
                        className="flex items-center text-primary hover:text-accent transition-colors"
                        whileHover={{ x: -5 }}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        <FaArrowLeft className="mr-2" />
                        {t('backToProcessing')}
                    </motion.button>
                </div>
            </Section>

            {/* Introduction */}
            <Section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-6">
                            {t('introduction.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-4xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('introduction.description')}
                        </Typography>
                    </motion.div>

                    {/* Key Features Grid */}
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {[
                            {
                                title: t('features.hygiene.title'),
                                description: t('features.hygiene.description'),
                                icon: FaShower,
                                variant: 'primary' as const
                            },
                            {
                                title: t('features.efficiency.title'),
                                description: t('features.efficiency.description'),
                                icon: FaIndustry,
                                variant: 'accent' as const
                            },
                            {
                                title: t('features.sustainability.title'),
                                description: t('features.sustainability.description'),
                                icon: FaSolarPanel,
                                variant: 'secondary' as const
                            }
                        ].map((feature, index) => (
                            <InfoCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                variant={feature.variant}
                                className="h-full"
                            >
                                <Typography variant="body">
                                    {feature.description}
                                </Typography>
                            </InfoCard>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* Interactive Flowchart Section */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('flowchart.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('flowchart.description')}
                        </Typography>
                    </motion.div>

                    {/* Flowchart Container */}
                    <motion.div
                        ref={diagramRef}
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
                                        {t('flowchart.title')}
                                    </Typography>
                                    <Typography
                                        variant="body-sm"
                                        className="text-text-dark/70 text-sm md:text-base leading-relaxed"
                                    >
                                        {t('flowchart.instructions')}
                                    </Typography>
                                </div>
                                <div className="flex space-x-2">
                                    <motion.button
                                        onClick={toggleFullscreen}
                                        className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        aria-label={isFullscreen ? t('controls.compress') : t('controls.expand')}
                                    >
                                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Clickable SVG Diagram */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 overflow-auto">
                                {svgContent ? (
                                    <ClickableSVG
                                        svgContent={svgContent}
                                        onElementClick={handleSVGClick}
                                        className="w-full h-auto"
                                    />
                                ) : (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-pulse text-text-dark/50">
                                            Loading flowchart...
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex flex-wrap justify-center gap-4">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-sm bg-[#3b82f6] border border-[#1d4ed8] mr-2"></div>
                                    <span className="text-sm text-text-dark">{t('legend.process')}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-sm bg-[#10b981] border border-[#047857] mr-2"></div>
                                    <span className="text-sm text-text-dark">{t('legend.staff')}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-sm bg-[#f59e0b] border border-[#d97706] mr-2"></div>
                                    <span className="text-sm text-text-dark">{t('legend.utilities')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Zone Information Panel */}
                    {activeZone && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="mt-8"
                        >
                            {(() => {
                                const zone = zoneInfo[activeZone as keyof typeof zoneInfo];
                                return (
                                    <InfoCard
                                        icon={zone.icon}
                                        title={activeZone}
                                        variant={zone.color as 'primary' | 'accent' | 'secondary'}
                                        className="relative"
                                    >
                                        {/* Close button */}
                                        <button
                                            onClick={() => setActiveZone(null)}
                                            className="absolute top-4 right-4 p-1 bg-white/80 rounded-full text-text-dark/70 hover:text-text-dark transition-colors z-20"
                                            aria-label="Close panel"
                                        >
                                            ×
                                        </button>

                                        <Typography variant="body" className="mb-4">
                                            {zone.description}
                                        </Typography>

                                        <Typography variant="h5" className="mb-3">
                                            {t('featuresTitle')}
                                        </Typography>
                                        <ul className="space-y-2">
                                            {(Array.isArray(zone.features) ? zone.features : []).map((feature, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className={`w-2 h-2 rounded-full bg-${zone.color} mt-2 mr-3 flex-shrink-0`}></div>
                                                    <Typography variant="body-sm">
                                                        {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </InfoCard>
                                );
                            })()}
                        </motion.div>
                    )}
                </div>
            </Section>

            {/* Compliance & Standards Section */}
            <Section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <Typography variant="h2" className="mb-4">
                            {t('compliance.title')}
                        </Typography>
                        <Typography
                            variant="body"
                            className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed"
                        >
                            {t('compliance.description')}
                        </Typography>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <InfoCard
                            icon={FaShower}
                            title={t('compliance.hygiene.title')}
                            variant="primary"
                        >
                            <ul className="space-y-3">
                                {getFeatures('compliance.hygiene.features').map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <FaInfoCircle className="text-primary mt-1 mr-3 flex-shrink-0" />
                                        <Typography variant="body">
                                            {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </InfoCard>

                        <InfoCard
                            icon={FaCertificate}
                            title={t('compliance.certifications.title')}
                            variant="accent"
                        >
                            <ul className="space-y-3">
                                {getFeatures('compliance.certifications.standards').map((standard, index) => (
                                    <li key={index} className="flex items-start">
                                        <FaInfoCircle className="text-accent mt-1 mr-3 flex-shrink-0" />
                                        <Typography variant="body">
                                            {typeof standard === 'string' ? standard : JSON.stringify(standard)}
                                        </Typography>
                                    </li>
                                ))}
                            </ul>
                        </InfoCard>
                    </div>
                </div>
            </Section>

            {/* Call to Action */}
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

export default FacilityFlowchart;