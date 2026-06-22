import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaHandshake, FaIndustry, FaMobile, FaLeaf, FaUsers,
    FaCheckCircle, FaEnvelope,
    FaCertificate, FaBox,
    FaChevronUp, FaChevronDown, FaStar, FaArrowRight
} from 'react-icons/fa';
import Section from '@/components/Section/Section';
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
import {GiCardboardBox, GiFactory, GiPublicSpeaker, GiSprout} from "react-icons/gi";



const Partners: React.FC = () => {
    const { t } = useTranslation('partners');
    const navigate = useNavigate();

    const whyPartnerIcons: Record<string, React.ComponentType> = { FaMobile, GiSprout, FaCertificate, FaUsers };
    const modelIcons: Record<string, React.ComponentType> = { FaUsers, GiCardboardBox, FaMobile, GiFactory };

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

            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[90vh]">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaHandshake className="inline mr-2 text-accent" />{t('hero.subtitle')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }} dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
                        <Typography variant="lead" className="text-text-dark mb-3 text-base lg:text-lg">{t('hero.lead')}</Typography>

                        {/* Partners Intro Card */}
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
                    {/* Right: Partner Image */}
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
            </Section>

            {/* Why Partner */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('whyPartner.title')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('whyPartner.body')}</Typography>
                    </motion.div>

                    {/* Four Cards Grid */}
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                        {whyPartner.map((item, idx) => (
                            <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                <InfoCard icon={item.icon} title={item.title} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600 mb-3">{item.desc}</Typography>
                                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-bold">{item.stat}</span>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Centered Link Below Cards */}
                    <div className="text-center">
                        <Link to="/invest" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                            <FaMobile className="text-xs" />{t('hero.ctaFarmOS', 'See Farm OS (Under NDA)')}
                        </Link>
                    </div>
                </div>
            </Section>

            {/* Partnership Models */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('models.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">{t('models.body')}</Typography>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-6">
                    {partnershipModels.map((model, idx) => (
                        <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
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
                                            <ul className="space-y-1">{(model.weOffer as string[]).map((item, i) => (<li key={i} className="flex items-start gap-1 text-xs text-gray-600"><FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-[10px]" />{item}</li>))}</ul>
                                        </div>
                                        <div className="bg-primary/5 rounded-lg p-3">
                                            <Typography variant="small" className="text-primary text-xs font-medium mb-1.5">{t('models.youBring')}</Typography>
                                            <ul className="space-y-1">{(model.partnerOffers as string[]).map((item, i) => (<li key={i} className="flex items-start gap-1 text-xs text-gray-600"><FaStar className="text-primary mt-0.5 flex-shrink-0 text-[10px]" />{item}</li>))}</ul>
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>
                        </motion.div>
                    ))}
                </div>
            </div></Section>

            {/* Trip Milestones */}
            <Section className="py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('milestones.title', 'The Foundation Is Built. Now We Scale.')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('milestones.body', 'Before asking for partners, we did the work. 70 hectares secured. Corporation legally registered with RCCM and IDU. Government relationships established. Community trust earned. This is not a pitch. This is a platform ready for partners.')}
                        </Typography>
                    </motion.div>

                    {/* Key Achievements */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                            <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                <InfoCard icon={item.icon} title={item.title} iconColor={item.color} showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600 mb-3">{item.desc}</Typography>
                                    <span className={`inline-block px-3 py-1 ${item.bg} ${item.color} text-xs rounded-full font-bold`}>{item.stat}</span>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Video Gallery */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Main Trip Video */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                            <InfoCard icon={GiPublicSpeaker} title={t('milestones.videoMain', 'The Trip in Action')} variant="primary" showInfoBadge={false}>
                                <div className="rounded-xl overflow-hidden shadow-lg border-2 border-white/30">
                                    <video controls preload="metadata" className="w-full rounded-xl" style={{ minHeight: '280px', maxHeight: '360px', objectFit: 'cover' }}>
                                        <source src={partnersTripVideo} type="video/mp4" />
                                    </video>
                                </div>
                            </InfoCard>
                        </motion.div>

                        {/* CCAK Meeting Video */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: 0.1 }}>
                            <InfoCard icon={FaHandshake} title={t('milestones.videoCcak', 'Meeting with CCAK Representative')} variant="accent" showInfoBadge={false}>
                                <div className="rounded-xl overflow-hidden shadow-lg border-2 border-white/30">
                                    <video controls preload="metadata" className="w-full rounded-xl" style={{ minHeight: '280px', maxHeight: '360px', objectFit: 'cover' }}>
                                        <source src={ccakVideo} type="video/mp4" />
                                    </video>
                                </div>
                                <Typography variant="small" className="text-gray-600 mt-3 text-center">
                                    {t('milestones.videoCcakDesc', 'Mr. Ouattara, CCAK Representative for Odienné-Madinani')}
                                </Typography>
                            </InfoCard>
                        </motion.div>
                    </div>

                    {/* Land Transfer Video */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-8">
                        <InfoCard icon={GiSprout} title={t('milestones.landVideo', 'Family Land Transfer — 70 Hectares')} variant="primary" showInfoBadge={false}>
                            <div className="grid md:grid-cols-2 gap-4 items-center">
                                <div className="rounded-xl overflow-hidden shadow-lg border-2 border-white/30">
                                    <video
                                        controls
                                        preload="metadata"
                                        className="w-full rounded-xl"
                                        style={{ minHeight: '280px', maxHeight: '360px', objectFit: 'cover' }}
                                    >
                                        <source src={landTransferVideo} type="video/mp4" />
                                    </video>
                                </div>
                                <div>
                                    <Typography variant="body" className="text-gray-600">
                                        {t('milestones.landVideoDesc', 'A family member officially transferring the 70 hectares to AfriNuts Export. This land has been in the family for generations — now it becomes the foundation of a tech-enabled agribusiness platform. The title process is underway with the Agent Foncier Rural.')}
                                    </Typography>
                                </div>
                            </div>
                        </InfoCard>
                    </motion.div>

                    {/* Photo Gallery */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <InfoCard icon={FaStar} title={t('milestones.galleryTitle', 'Moments from the Trip')} variant="accent" showInfoBadge={false}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[tripPhoto1, tripPhoto2, tripPhoto3, tripPhoto4].map((photo, idx) => (
                                    <motion.div key={idx} className="rounded-xl overflow-hidden shadow-md border-2 border-white/30 aspect-square"
                                                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
                                        <img src={photo} alt={`Trip photo ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                    </motion.div>
                                ))}
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            {/* How to Partner */}
            <Section className="py-10"><div className="max-w-6xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('process.title')}</Typography>
                    <Typography variant="body" className="text-gray-600 max-w-xl mx-auto">{t('process.body')}</Typography>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{processSteps.map((item, idx) => (
                    <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                        <InfoCard title={item.title} subtitle={`${t('process.stepLabel')} ${item.step}`} iconColor="text-accent" showInfoBadge={false} className="h-full text-center">
                            <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">{item.step}</div>
                            <Typography variant="small" className="text-gray-600">{item.desc}</Typography>
                        </InfoCard>
                    </motion.div>
                ))}</div>
            </div></Section>

            {/* FAQ */}
            <Section className="py-10"><div className="max-w-3xl mx-auto px-4 sm:px-6">
                <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <Typography variant="h2" className="mb-4">{t('faq.title')}</Typography>
                </motion.div>
                <PartnersFAQ items={faqItems} viewAllLabel={t('faq.viewAll')} />
            </div></Section>

            {/* Final CTA */}
            <Section className="py-16"><div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <motion.div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu" style={{ transformStyle: 'preserve-3d' }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} whileHover={{ y: -6, scale: 1.02 }}>
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/20" /><div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                    <div className="relative z-10">
                        <Typography variant="h2" className="mb-4 text-primary">{t('cta.title')}</Typography>
                        <Typography variant="body" className="mb-6 text-gray-600 max-w-2xl mx-auto">{t('cta.body')}</Typography>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button onClick={() => navigate('/contact?type=partnership')} className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center gap-2" whileHover={{ y: -2 }}><div className="absolute inset-0 rounded-full border-2 border-white/30" /><FaHandshake className="relative z-10" /><span className="relative z-10">{t('cta.becomePartner')}</span></motion.button>
                            <a href={`mailto:${t('hero.email')}`} className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full transform-gpu font-medium inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm"><FaEnvelope /> {t('hero.email')}</a>
                        </div>
                    </div>
                </motion.div>
            </div></Section>
        </div>
    );
};

// Foldable FAQ Component
const PartnersFAQ: React.FC<{ items: any[]; viewAllLabel?: string }> = ({ items, viewAllLabel }) => {
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
    const toggleItem = (idx: number) => setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));

    return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                    className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-2xl shadow-xl transform-gpu overflow-hidden"
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 30px -8px rgba(165,105,66,0.15)', transition: { duration: 0.3 } }}>
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