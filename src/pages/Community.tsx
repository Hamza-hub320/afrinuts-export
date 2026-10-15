import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaHeart, FaHandshake, FaUsers, FaArrowRight,
    FaWater, FaBookOpen, FaMosque, FaLeaf, FaChartLine,
    FaStar
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Section from '@/components/Section/Section';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Reveal, StaggerList, StaggerItem } from '@/components/Reveal';
import JsonLd from '@/components/Seo/JsonLd';
import { Helmet } from 'react-helmet-async';
import communityHeroImage from '@/assets/images/community-hero.webp';
import partnerVideo from '@/assets/videos/current-partners.mp4';
import VideoGallery from "@/components/VideoGallery/VideoGallery";
import {HeroSection} from "@/components/HeroSection/HeroSection";

const Community: React.FC = () => {
    const { t } = useTranslation('community');
    const navigate = useNavigate();

    const iconMap: Record<string, React.ComponentType> = {
        FaWater, FaBookOpen, FaMosque, FaUsers, FaHeart, FaLeaf, FaChartLine, FaHandshake, FaStar,
    };

    const impactAreas = t('impactAreas.items', { returnObjects: true }) as any[];
    const howItWorks = t('howItWorks.steps', { returnObjects: true }) as any[];
    const heroBadges = t('hero.badges', { returnObjects: true }) as any[];
    const cooperativeTags = t('cooperative.tags', { returnObjects: true }) as string[];

    return (
        <div className="text-text-dark font-sans">
            <Helmet>
                <title>{t('seo.title')}</title>
                <meta name="description" content={t('seo.description')} />
                <link rel="canonical" href="https://www.afrinutsexport.com/community" />
            </Helmet>

            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": t('seo.title'),
                "description": t('seo.description'),
            }} />

            {/* HERO — own mount animation */}
            <HeroSection className="flex items-center justify-center text-center min-h-[90vh]" animate={false}>
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaHeart className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1
                            className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight"
                            variants={fadeIn}
                            style={{ letterSpacing: '-0.03em' }}
                            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
                        />
                        <Typography variant="lead" className="text-text-dark mb-3 text-base lg:text-lg">{t('hero.body')}</Typography>

                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard icon={FaHeart} title={t('hero.introTitle')} variant="secondary" showInfoBadge={false}>
                                <Typography variant="small" className="text-gray-600">{t('hero.introBody')}</Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                            {heroBadges.map((badge, idx) => {
                                const IconComponent = iconMap[badge.icon] || FaStar;
                                return (
                                    <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 ${badge.bg} ${badge.text} text-xs rounded-full font-medium`}>
                                        <IconComponent className="text-[10px]" /> {badge.label}
                                    </span>
                                );
                            })}
                        </div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <Link to="/wholesale" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaLeaf className="text-xs" />{t('hero.ctaSource')}
                            </Link>
                            <Link to="/invest" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaArrowRight className="text-xs" />{t('hero.ctaInvest')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={communityHeroImage} alt={t('hero.imageAlt')} className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">{t('hero.imageLabel')}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </HeroSection>

            {/* HOW IT WORKS */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('howItWorks.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('howItWorks.body')}</Typography>
                    </Reveal>

                    <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {howItWorks.map((item, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard title={item.title} subtitle={`${t('howItWorks.stepLabel')} ${item.step}`} iconColor="text-accent" showInfoBadge={false} className="h-full text-center">
                                    <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">{item.step}</div>
                                    <Typography variant="small" className="text-gray-600">{item.desc}</Typography>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* IMPACT AREAS */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('impactAreas.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('impactAreas.body')}</Typography>
                    </Reveal>

                    <StaggerList className="grid md:grid-cols-2 gap-6">
                        {impactAreas.map((item, idx) => {
                            const IconComponent = iconMap[item.icon] || FaStar;
                            return (
                                <StaggerItem key={idx}>
                                    <InfoCard icon={IconComponent} title={item.title} iconColor={item.color} showInfoBadge={false} className="h-full">
                                        <Typography variant="small" className="text-gray-600 mb-3">{item.desc}</Typography>
                                        <span className={`inline-block px-3 py-1 ${item.bg} ${item.color} text-xs rounded-full font-bold`}>{item.stat}</span>
                                    </InfoCard>
                                </StaggerItem>
                            );
                        })}
                    </StaggerList>
                </div>
            </Section>

            {/* COOPERATIVE VIDEO */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <Reveal className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">{t('cooperative.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('cooperative.body')}</Typography>
                    </Reveal>

                    <Reveal>
                        <div className="space-y-4">
                            <VideoGallery
                                videos={[{
                                    src: partnerVideo,
                                    title: t('cooperative.videoTitle', 'Cooperative Partnership Video'),
                                }]}
                            />

                            <InfoCard icon={FaUsers} title={t('cooperative.cardTitle')} variant="primary" showInfoBadge={false}>
                                <Typography variant="body" className="text-gray-600 mb-4">{t('cooperative.description')}</Typography>
                                <StaggerList className="flex flex-wrap gap-2">
                                    {cooperativeTags.map((tag, idx) => (
                                        <StaggerItem key={idx}>
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">{tag}</span>
                                        </StaggerItem>
                                    ))}
                                </StaggerList>
                            </InfoCard>
                        </div>
                    </Reveal>
                </div>
            </Section>

            {/* SADAQAH JARIYAH */}
            <Section className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <Typography variant="h2" className="mb-4">{t('sadaqah.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 mb-6 max-w-2xl mx-auto">{t('sadaqah.body')}</Typography>

                    <InfoCard icon={FaStar} title={t('sadaqah.cardTitle')} variant="accent" showInfoBadge={false} className="text-center">
                        <Typography variant="body" className="text-gray-600 mb-4 max-w-2xl mx-auto">{t('sadaqah.body2')}</Typography>
                        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 max-w-2xl mx-auto mt-4">
                            <Typography variant="small" className="text-amber-800 italic">
                                {t('sadaqah.hadith')}
                            </Typography>
                            <Typography variant="small" className="text-amber-600 mt-1 font-medium">
                                {t('sadaqah.hadithSource')}
                            </Typography>
                        </div>
                    </InfoCard>
                </div>
            </Section>

            {/* FOR BUYERS + FOR INVESTORS */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <StaggerList className="grid md:grid-cols-2 gap-8">
                        <StaggerItem>
                            <InfoCard icon={FaLeaf} title={t('forBuyers.title')} variant="primary" showInfoBadge={false} className="h-full">
                                <Typography variant="body" className="text-gray-600 mb-4">{t('forBuyers.body')}</Typography>
                                <Link to="/wholesale" className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1">
                                    {t('forBuyers.cta')} <FaArrowRight className="text-xs" />
                                </Link>
                            </InfoCard>
                        </StaggerItem>
                        <StaggerItem>
                            <InfoCard icon={FaChartLine} title={t('forInvestors.title')} variant="accent" showInfoBadge={false} className="h-full">
                                <Typography variant="body" className="text-gray-600 mb-4">{t('forInvestors.body')}</Typography>
                                <Link to="/invest" className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1">
                                    {t('forInvestors.cta')} <FaArrowRight className="text-xs" />
                                </Link>
                            </InfoCard>
                        </StaggerItem>
                    </StaggerList>
                </div>
            </Section>

            {/* FINAL CTA */}
            <Section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{ transformStyle: 'preserve-3d' }}
                        whileHover={{ y: -6, scale: 1.02 }}
                    >
                        <div className="absolute inset-0 rounded-3xl border-2 border-white/20" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                        <div className="relative z-10">
                            <Typography variant="h2" className="mb-4 text-primary">{t('cta.title')}</Typography>
                            <Typography variant="body" className="mb-6 text-gray-600 max-w-2xl mx-auto">{t('cta.body')}</Typography>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/wholesale" className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-2">
                                    <FaLeaf className="text-xs" />{t('cta.source')}
                                </Link>
                                <Link to="/invest" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm">
                                    <FaChartLine className="text-xs" />{t('cta.invest')}
                                </Link>
                                <Link to="/partners" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-6 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm">
                                    <FaHandshake className="text-xs" />{t('cta.partner')}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default Community;