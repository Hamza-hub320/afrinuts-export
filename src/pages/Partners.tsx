import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaHandshake, FaMobile, FaUsers,
    FaCheckCircle, FaEnvelope,
    FaCertificate,
    FaChevronUp, FaChevronDown, FaStar, FaArrowRight, FaGlobeAfrica
} from 'react-icons/fa';
import Section from '@/components/Section/Section';
import { Reveal, StaggerList, StaggerItem } from '@/components/Reveal';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { fadeIn, staggerContainer } from '@/utils/animations';
import JsonLd from '@/components/Seo/JsonLd';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import partnerHeroImage from '@/assets/images/partner-hero.webp';
import ccakVideo from '@/assets/videos/ccak-meeting.mp4';
import landTransferVideo from '@/assets/videos/land-transfer.mp4';
import partnersTripVideo from '@/assets/videos/partners-trip.mp4';
import tripPhoto1 from '@/assets/images/partners/trip-1.webp';
import tripPhoto2 from '@/assets/images/partners/trip-2.webp';
import tripPhoto3 from '@/assets/images/partners/trip-3.webp';
import tripPhoto4 from '@/assets/images/partners/trip-4.webp';
import {
    GiCardboardBox,
    GiFactory,
    GiPublicSpeaker,
    GiSprout
} from "react-icons/gi";
import ImageGallery from "@/components/ImageGallery/ImageGallery";
import VideoGallery from "@/components/VideoGallery/VideoGallery";
import {HeroSection} from "@/components/HeroSection/HeroSection";


const Partners: React.FC = () => {
    const { t } = useTranslation('partners');
    const navigate = useNavigate();

    const whyPartnerIcons: Record<string, React.ComponentType> = { FaMobile, GiSprout, FaCertificate, FaUsers };
    const modelIcons: Record<string, React.ComponentType> = { FaUsers, GiCardboardBox, FaMobile, GiFactory };
    const trustIcons: Record<string, React.ComponentType> = {
        GiSprout, FaCertificate, FaUsers, FaHandshake
    };

    const whyPartner = (t('whyPartner.items', { returnObjects: true }) as any[]).map(item => ({
        ...item,
        icon: whyPartnerIcons[item.icon] || FaHandshake,
    }));

    const partnershipModels = (t('models.items', { returnObjects: true }) as any[]).map(item => ({
        ...item,
        icon: modelIcons[item.icon] || FaHandshake,
    }));

    const processSteps = t('process.steps', { returnObjects: true }) as any[];

    const faqItems = t('faq.items', { returnObjects: true }) as any[];

    return (
        <div className="text-text-dark font-sans">
            <Helmet>
                <title>{t('seo.title')}</title>
                <meta name="description" content={t('seo.description')} />
                <link rel="canonical" href="https://www.afrinutsexport.com/partners" />
            </Helmet>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", "name": t('seo.title'), "description": t('seo.description') }} />

            {/* HERO — own mount animation */}
            <HeroSection className="flex items-center justify-center text-center min-h-[90vh]" animate={false}>
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaHandshake className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }} dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
                        <Typography variant="lead" className="text-text-dark mb-3 text-base lg:text-lg">{t('hero.lead')}</Typography>

                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaUsers}
                                title={t('hero.introTitle', 'How We Partner')}
                                variant="secondary"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('hero.introBody', 'Four partnership models designed for different organizations. From outgrower cooperatives to Farm OS licensing — we have a path for you. Every partnership is backed by our operational farm, proprietary technology, and commitment to transparency.')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                            {(t('hero.badges', { returnObjects: true }) as any[]).map((badge, idx) => (
                                <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 ${badge.bg} ${badge.text} text-xs rounded-full font-medium`}>
                                    {React.createElement(whyPartnerIcons[badge.icon] || FaCheckCircle, { className: "text-[10px]" })} {badge.label}
                                </span>
                            ))}
                        </div>
                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <motion.button onClick={() => navigate('/contact?type=partnership')} className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5" whileHover={{ y: -1 }}>
                                <FaHandshake className="text-xs" />{t('hero.becomePartner')}
                            </motion.button>
                            <a href={`mailto:${t('hero.email')}`} className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaEnvelope className="text-xs" />{t('hero.email')}
                            </a>
                        </motion.div>
                    </motion.div>
                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-100 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[690px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={partnerHeroImage} alt={t('hero.imageAlt')} className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">{t('hero.imageLabel')}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </HeroSection>

            {/* TRUST BAR */}
            <Section className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-6">
                        <Typography variant="h2" className="text-primary">
                            {t('trust.title', 'Built on Trust. Ready for Partners.')}
                        </Typography>
                    </div>
                    <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(t('trust.items', { returnObjects: true }) as any[]).map((item, idx) => (
                            <StaggerItem key={idx}>
                                <motion.div
                                    className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-lg p-5 text-center transform-gpu overflow-hidden h-full"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ y: -4, scale: 1.03, boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)', transition: { duration: 0.3 } }}
                                >
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                                    <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                                    <div className="relative z-10">
                                        <motion.div
                                            className="bg-accent/10 p-3 rounded-full w-fit mx-auto mb-3"
                                            whileHover={{ scale: 1.15, rotate: 5 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            {React.createElement(trustIcons[item.icon] || FaCheckCircle, { className: "text-accent text-xl" })}
                                        </motion.div>
                                        <div className="text-2xl font-bold text-primary">{item.value}</div>
                                        <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                                    </div>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* WHY PARTNER */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('whyPartner.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('whyPartner.body')}</Typography>
                    </div>

                    <StaggerList className="grid md:grid-cols-4 gap-4 mb-6">
                        {whyPartner.map((item, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard icon={item.icon} title={item.title} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600 mb-3">{item.desc}</Typography>
                                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-bold">{item.stat}</span>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* PARTNERSHIP MODELS */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('models.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('models.body')}</Typography>
                    </div>
                    <StaggerList className="grid md:grid-cols-2 gap-6">
                        {partnershipModels.map((model, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard icon={model.icon} title={model.title} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                    <span className="inline-block px-2.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium mb-3">{model.tag}</span>
                                    <div className="space-y-3">
                                        <div>
                                            <Typography variant="small" className="text-gray-500 text-xs uppercase tracking-wider mb-1">{t('models.idealFor')}</Typography>
                                            <Typography variant="small" className="text-gray-700">{model.idealFor}</Typography>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-green-50/50 rounded-lg p-3">
                                                <Typography variant="small" className="text-green-700 text-xs font-medium mb-1.5">{t('models.weOffer')}</Typography>
                                                <ul className="space-y-1">
                                                    {(model.weOffer as string[]).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-1 text-xs text-gray-600">
                                                            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-[10px]" />{item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-primary/5 rounded-lg p-3">
                                                <Typography variant="small" className="text-primary text-xs font-medium mb-1.5">{t('models.youBring')}</Typography>
                                                <ul className="space-y-1">
                                                    {(model.partnerOffers as string[]).map((item, i) => (
                                                        <li key={i} className="flex items-start gap-1 text-xs text-gray-600">
                                                            <FaStar className="text-primary mt-0.5 flex-shrink-0 text-[10px]" />{item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* TRIP MILESTONES */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <Typography variant="h2" className="mb-4">{t('milestones.title', 'The Foundation Is Built. Now We Scale.')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('milestones.body', 'Before asking for partners, we did the work. 70 hectares secured. Corporation legally registered with RCCM and IDU. Government relationships established. Community trust earned. This is not a pitch. This is a platform ready for partners.')}
                        </Typography>
                    </div>

                    {/* Key Achievements */}
                    <StaggerList className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            {
                                icon: GiSprout,
                                title: t('milestones.land.title', '70 Hectares Secured'),
                                desc: t('milestones.land.desc', 'Family land officially transferred. 35ha for farm, 10ha for processing, 25ha for community. Title process underway with the Agent Foncier Rural.'),
                                stat: t('milestones.land.stat', 'Title in Process'),
                                color: 'text-green-600',
                                bg: 'bg-green-50'
                            },
                            {
                                icon: FaCertificate,
                                title: t('milestones.corp.title', 'Corporation Registered'),
                                desc: t('milestones.corp.desc', 'AfriNuts Export SARL is now a legally registered company. RCCM: CI-ABJ-03-2026-B12-04223. IDU: CI-2026-0066959 J. Dossier N° 512502 accepted by CEPICI.'),
                                stat: t('milestones.corp.stat', 'Completed'),
                                color: 'text-primary',
                                bg: 'bg-primary/10'
                            },
                            {
                                icon: FaHandshake,
                                title: t('milestones.gov.title', 'Government Partnerships'),
                                desc: t('milestones.gov.desc', 'Meeting held with CCAK representative in Odienné-Madinani. Upcoming meeting with Director and General Director of Conseil Coton Anacard et Karité.'),
                                stat: t('milestones.gov.stat', 'In Progress'),
                                color: 'text-blue-600',
                                bg: 'bg-blue-50'
                            },
                            {
                                icon: GiPublicSpeaker,
                                title: t('milestones.community.title', 'Community Trust Earned'),
                                desc: t('milestones.community.desc', 'Family land transfer completed with community recognition. Village leadership engaged. Local relationships that took generations to build — now part of AfriNuts\' foundation.'),
                                stat: t('milestones.community.stat', 'Established'),
                                color: 'text-amber-600',
                                bg: 'bg-amber-50'
                            },
                        ].map((item, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard icon={item.icon} title={item.title} iconColor={item.color} showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600 mb-3">{item.desc}</Typography>
                                    <span className={`inline-block px-3 py-1 ${item.bg} ${item.color} text-xs rounded-full font-bold`}>{item.stat}</span>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>

                    {/* Video Gallery */}
                    <Reveal className="mb-8">
                        <InfoCard icon={GiPublicSpeaker} title={t('milestones.videoGalleryTitle', 'Videos from the Trip')} variant="primary" showInfoBadge={false}>
                            <VideoGallery
                                videos={[
                                    {
                                        src: partnersTripVideo,
                                        title: t('milestones.videoMain', 'The Trip in Action'),
                                        description: t('milestones.videoMainDesc', 'Highlights from the partnership development trip to Odienné.'),
                                    },
                                    {
                                        src: ccakVideo,
                                        title: t('milestones.videoCcak', 'Meeting with CCAK Representative'),
                                        description: t('milestones.videoCcakDesc', 'Mr. Ouattara, CCAK Representative for Odienné-Madinani'),
                                    },
                                    {
                                        src: landTransferVideo,
                                        title: t('milestones.landVideo', 'Family Land Transfer — 70 Hectares'),
                                        description: t('milestones.landVideoDesc', 'A family member officially transferring the 70 hectares to AfriNuts Export. This land has been in the family for generations — now it becomes the foundation of a tech-enabled agribusiness platform.'),
                                    },
                                ]}
                            />
                        </InfoCard>
                    </Reveal>

                    {/* Photo Gallery */}
                    <Reveal delay={0.1}>
                        <ImageGallery
                            images={[
                                { src: tripPhoto1, alt: 'Trip photo 1', caption: t('milestones.galleryCaptions.photo1', 'Team with government officials') },
                                { src: tripPhoto2, alt: 'Trip photo 2', caption: t('milestones.galleryCaptions.photo2', 'Community meeting in Odienné') },
                                { src: tripPhoto3, alt: 'Trip photo 3', caption: t('milestones.galleryCaptions.photo3', 'Farm inspection with local partners') },
                                { src: tripPhoto4, alt: 'Trip photo 4', caption: t('milestones.galleryCaptions.photo4', 'Farm inspection with local partners') },
                            ]}
                        />
                    </Reveal>
                </div>
            </Section>

            {/* HOW TO PARTNER */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">{t('process.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-xl mx-auto">{t('process.body')}</Typography>
                    </div>
                    <StaggerList className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {processSteps.map((item, idx) => (
                            <StaggerItem key={idx}>
                                <InfoCard title={item.title} subtitle={`${t('process.stepLabel')} ${item.step}`} iconColor="text-accent" showInfoBadge={false} className="h-full text-center">
                                    <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">{item.step}</div>
                                    <Typography variant="small" className="text-gray-600">{item.desc}</Typography>
                                </InfoCard>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>
            </Section>

            {/* FAQ */}
            <Section className="py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-8">
                        <Typography variant="h2" className="mb-4">{t('faq.title')}</Typography>
                    </div>
                    <PartnersFAQ items={faqItems} viewAllLabel={t('faq.viewAll')} />
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
                                <motion.button
                                    onClick={() => navigate('/contact?type=partnership')}
                                    className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center gap-2"
                                    whileHover={{ y: -2 }}
                                >
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                    <FaHandshake className="relative z-10" />
                                    <span className="relative z-10">{t('cta.becomePartner')}</span>
                                </motion.button>
                                <a href={`mailto:${t('hero.email')}`} className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full transform-gpu font-medium inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm">
                                    <FaEnvelope /> {t('hero.email')}
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

/* ---------------------------------------------
 * PartnersFAQ — kept local, uses motion for the
 * accordion open/close since it's user-driven
 * ------------------------------------------- */
const PartnersFAQ: React.FC<{ items: any[]; viewAllLabel?: string }> = ({ items, viewAllLabel }) => {
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
    const toggleItem = (idx: number) => setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));

    return (
        <motion.div
            className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl transform-gpu overflow-hidden"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)', transition: { duration: 0.3 } }}
        >
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
            <div className="relative z-10 p-6">
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 overflow-hidden">
                            <button className="w-full text-left flex justify-between items-center p-4 group" onClick={() => toggleItem(idx)} aria-expanded={openItems[idx]}>
                                <Typography variant="h5" className="text-text-dark text-sm font-medium group-hover:text-primary transition-colors pr-4">{item.q}</Typography>
                                {openItems[idx] ? <FaChevronUp className="text-primary flex-shrink-0" /> : <FaChevronDown className="text-primary flex-shrink-0" />}
                            </button>
                            {openItems[idx] && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                    <div className="px-4 pb-4"><Typography variant="body" className="text-gray-600">{item.a}</Typography></div>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
                {viewAllLabel && (
                    <div className="mt-5 text-center">
                        <Link to="/faq" className="text-accent hover:text-primary text-sm font-medium inline-flex items-center gap-1">
                            {viewAllLabel} <FaArrowRight className="text-xs" />
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Partners;