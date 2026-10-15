import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Reveal, StaggerList, StaggerItem } from '@/components/Reveal';
import { Typography } from "@/components/Typography/Typography";
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@/components/Section/Section';
import {
    FaTree,
    FaHandsHelping,
    FaGlobe,
    FaChartLine,
    FaSeedling,
    FaMapSigns,
    FaLeaf,
    FaMobile,
    FaMapMarkerAlt,
    FaUsers,
    FaArrowRight,
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import heritageImage from '@/assets/images/heritage.webp';
import farmImage from '@/assets/images/farm.webp';
import innovationImage from '@/assets/images/innovation.webp';
import communityImage from '@/assets/images/community.webp';
import futureImage from '@/assets/images/future.webp';
import ourStoryHeroImage from '@/assets/images/our-story-hero.webp';
import JsonLd from "@/components/Seo/JsonLd";
import { Helmet } from "react-helmet-async";
import {HeroSection} from "@/components/HeroSection/HeroSection";

const OurStory: React.FC = () => {
    const { t, i18n } = useTranslation('story');
    const isRTL = i18n.dir() === 'rtl';

    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

    const storySections = [
        {
            title: t('sections.heritage.title'),
            icon: FaTree,
            image: heritageImage,
            description: t('sections.heritage.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.heritage.alt',
        },
        {
            title: t('sections.tradition.title'),
            icon: FaSeedling,
            image: farmImage,
            description: t('sections.tradition.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/5 to-accent/10 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.tradition.alt',
        },
        {
            title: t('sections.innovation.title'),
            icon: FaChartLine,
            image: innovationImage,
            description: t('sections.innovation.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.innovation.alt',
        },
        {
            title: t('sections.community.title'),
            icon: FaHandsHelping,
            image: communityImage,
            description: t('sections.community.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/5 to-accent/10 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.community.alt',
        },
        {
            title: t('sections.future.title'),
            icon: FaGlobe,
            image: futureImage,
            description: t('sections.future.content', { returnObjects: true }),
            color: 'bg-gradient-to-br from-primary/20 to-accent/5 bg-opacity-50 backdrop-blur-md border-2 border-accent/20',
            altKey: 'sections.future.alt',
        },
    ];

    /* --- Track which section is centered in the viewport --- */
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sectionRefs.current.forEach((el, index) => {
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveIndex(index);
                },
                { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [storySections.length]);

    const handleDotClick = (index: number) => {
        sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const toggleExpand = (index: number) => {
        setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    /* --- RTL-aware helpers --- */
    const getFlexDirection = (index: number) => {
        if (isRTL) return index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row';
        return index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse';
    };

    const getContentMargin = (index: number) => {
        if (isRTL) return index % 2 === 0 ? 'md:ml-16' : 'md:mr-16';
        return index % 2 === 0 ? 'md:mr-16' : 'md:ml-16';
    };

    const getImagePadding = (index: number) => {
        if (isRTL) return index % 2 === 0 ? 'md:pl-16' : 'md:pr-16';
        return index % 2 === 0 ? 'md:pr-16' : 'md:pl-16';
    };

    return (
        <main className={`text-text-dark font-sans leading-relaxed ${isRTL ? 'direction-rtl' : 'direction-ltr'}`}>
            <Helmet>
                <title>Our Story | Three Generations of Cashew Farming | AfriNuts Export</title>
                <meta name="description" content="From grandfather's fields to a tech-enabled agribusiness — the story of AfriNuts Export. Three generations of cashew farming in Odienné, Côte d'Ivoire, guided by Islamic values and community impact." />
                <link rel="canonical" href="https://www.afrinutsexport.com/about/our-story" />
                <meta property="og:title" content="Our Story | Three Generations of Cashew Farming | AfriNuts Export" />
                <meta property="og:description" content="From grandfather's fields to a tech-enabled agribusiness. Three generations of cashew farming in Odienné, Côte d'Ivoire." />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Our Story - AfriNuts Export",
                "description": "Three generations of cashew farming in Odienné, Ivory Coast. Heritage, sustainability, community, and Islamic values.",
                "mainEntity": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "foundingDate": "2023",
                    "founders": [
                        { "@type": "Person", "name": "Hamza S. Ralsan Sangare" },
                        { "@type": "Person", "name": "Sekou Hakim Peters" },
                    ],
                    "knowsAbout": ["Organic Cashew Farming", "Islamic Finance", "Community Development", "Sustainable Agriculture"],
                },
            }} />

            {/* Breadcrumbs */}
            <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-[100px] pb-1">
                <div className="text-sm text-text-dark flex items-center gap-1 flex-wrap">
                    <Link to="/" className="hover:text-primary transition-colors">{t('breadcrumbs.home', 'Home')}</Link>
                    <span>/</span>
                    <Link to="/about" className="hover:text-primary transition-colors">{t('breadcrumbs.about', 'About')}</Link>
                    <span>/</span>
                    <span className="text-primary font-medium">{t('breadcrumbs.ourStory', 'Our Story')}</span>
                </div>
            </div>

            {/* HERO — own mount animation */}
            <HeroSection className="flex items-center justify-center text-center pt-2 pb-8 lg:pb-12" animate={false}>
                <motion.div
                    className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    {/* Left: Text Content */}
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaMapSigns className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1
                            className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight"
                            variants={fadeIn}
                            style={{ letterSpacing: '-0.03em' }}
                        >
                            {t('hero.title')}
                        </motion.h1>

                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg italic">
                            "{t('hero.quote')}"
                        </Typography>

                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaTree}
                                title={t('intro.title')}
                                variant="secondary"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('intro.description')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                <FaLeaf className="text-[10px]" /> {t('hero.badgeGenerations', '3 Generations')}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                <FaMobile className="text-[10px]" /> {t('hero.badgeFarmOS', 'Farm OS Powered')}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                                <FaMapMarkerAlt className="text-[10px]" /> {t('hero.badgeLocation', 'Odienné, CI')}
                            </span>
                        </div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <Link to="/about" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaUsers className="text-xs" />{t('hero.ctaAbout', 'About AfriNuts')}
                            </Link>
                            <Link to="/farm" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaArrowRight className="text-xs" />{t('hero.ctaFarm', 'Explore the Farm')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Story Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div
                            className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                            whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}
                        >
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={ourStoryHeroImage} alt="AfriNuts Story" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">Our Story</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </HeroSection>

            {/* STORY TIMELINE — Glass rail + illuminated dots + glow behind active image */}
            <Section className="py-16 md:py-24" animate={false}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center mb-16">
                        <Typography variant="h2" className="mb-4">
                            {t('timeline.title')}
                        </Typography>
                        <Typography variant="body" className="max-w-3xl mx-auto">
                            {t('timeline.subtitle')}
                        </Typography>
                    </Reveal>

                    <div className="relative">
                        {/* Glass progress rail */}
                        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full bg-white/25 backdrop-blur-md border border-white/30 shadow-[inset_0_0_6px_rgba(255,255,255,0.4)]">
                            <motion.div
                                className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-primary via-accent to-primary shadow-[0_0_8px_rgba(90,116,17,0.55)]"
                                initial={{ height: '0%' }}
                                animate={{ height: `${((activeIndex + 1) / storySections.length) * 100}%` }}
                                transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                            />
                        </div>

                        <StaggerList className="space-y-20 md:space-y-28">
                            {storySections.map((section, index) => {
                                const isActive = activeIndex === index;
                                const isPassed = activeIndex > index;

                                return (
                                    <StaggerItem key={index}>
                                        <div
                                            ref={(el) => { sectionRefs.current[index] = el; }}
                                            id={`section-${index}`}
                                            dir={isRTL ? 'rtl' : 'ltr'}
                                            className="relative"
                                        >
                                            {/* Centered dot + chip column */}
                                            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center z-20 pointer-events-none" aria-hidden="true">
                                                <button
                                                    onClick={() => handleDotClick(index)}
                                                    className={`mb-3 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest backdrop-blur-md border transition-all duration-500 pointer-events-auto cursor-pointer
                                                        ${isActive
                                                        ? 'bg-accent text-white border-white/60 shadow-[0_0_12px_rgba(224,78,0,0.45)]'
                                                        : isPassed
                                                            ? 'bg-primary/85 text-white border-white/40'
                                                            : 'bg-white/40 text-gray-500 border-white/50'
                                                    }`}
                                                >
                                                    {String(index + 1).padStart(2, '0')}
                                                </button>

                                                <motion.div
                                                    className={`relative w-8 h-8 rounded-full border-2 transform-gpu transition-all duration-500
                                                        ${isActive
                                                        ? 'bg-accent border-white shadow-[0_0_10px_rgba(224,78,0,0.55)]'
                                                        : isPassed
                                                            ? 'bg-primary border-white/80 shadow-[0_0_6px_rgba(90,116,17,0.4)]'
                                                            : 'bg-white/50 border-white/70 backdrop-blur-md'
                                                    }`}
                                                    animate={{ scale: isActive ? 1.08 : 1 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/60 to-transparent opacity-60 pointer-events-none" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        {isPassed ? (
                                                            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        ) : isActive ? (
                                                            <span className="w-2.5 h-2.5 rounded-full bg-white" />
                                                        ) : (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>

                                            <div className={`flex flex-col ${getFlexDirection(index)} gap-8 md:gap-16 items-center`}>
                                                {/* Image with pulsing glow BEHIND it */}
                                                <div className={`flex-1 w-full ${getImagePadding(index)}`}>
                                                    <div className="relative">
                                                        {isActive && (
                                                            <>
                                                                <motion.span
                                                                    className="absolute inset-0 -m-4 rounded-[2rem] bg-accent/30 blur-3xl pointer-events-none"
                                                                    animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.98, 1.04, 0.98] }}
                                                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                                                />
                                                                <motion.span
                                                                    className="absolute inset-0 -m-8 rounded-[2.5rem] bg-accent/15 blur-3xl pointer-events-none"
                                                                    animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.06, 1] }}
                                                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                                                                />
                                                            </>
                                                        )}

                                                        <motion.div
                                                            className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-700
                                                                ${isActive
                                                                ? 'border-white/60 shadow-[0_20px_50px_-15px_rgba(224,78,0,0.4)]'
                                                                : 'border-white/20 shadow-xl'
                                                            }`}
                                                            whileHover={{ scale: 1.03 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <img
                                                                src={section.image}
                                                                alt={t(section.altKey)}
                                                                className="w-full h-auto object-cover aspect-video md:aspect-square"
                                                                loading="lazy"
                                                            />
                                                        </motion.div>
                                                    </div>
                                                </div>

                                                {/* InfoCard content */}
                                                <div className={`flex-1 w-full ${getContentMargin(index)}`}>
                                                    <InfoCard
                                                        title={section.title}
                                                        image={section.image}
                                                        variant="secondary"
                                                        icon={section.icon}
                                                        alt={t(section.altKey)}
                                                        color={section.color}
                                                    >
                                                        {Array.isArray(section.description)
                                                            ? section.description.map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
                                                            : section.description}
                                                    </InfoCard>
                                                </div>
                                            </div>
                                        </div>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerList>
                    </div>
                </div>
            </Section>

            {/* CTA */}
            <Section className="py-16 text-text-dark">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{ transformStyle: 'preserve-3d' }}
                        whileHover={{ y: -5, rotateY: 2, transition: { duration: 0.3 } }}
                    >
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] transition-all duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 transition-opacity duration-500" />
                        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] transition-shadow duration-500" />
                        <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        <div className="relative z-10">
                            <Typography variant="h2" className="mb-6">
                                {t('cta.title')}
                            </Typography>
                            <Typography variant="lead" className="mb-8 max-w-3xl mx-auto">
                                {t('cta.subtitle')}
                            </Typography>
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                <Link
                                    to="/contact"
                                    className="group bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center mx-auto transform-gpu relative overflow-hidden"
                                >
                                    {t('cta.button')}
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </main>
    );
};

export default OurStory;