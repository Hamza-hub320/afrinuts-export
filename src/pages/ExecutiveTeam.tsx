import React, {Fragment, useState, useEffect, KeyboardEvent} from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import {
    FaTimes,
    FaEnvelope,
    FaLinkedin,
    FaUserTie,
    FaArrowLeft,
    FaUsers,
    FaCheckCircle,
    FaGlobeAfrica, FaHandshake, FaMobile, FaChartLine
} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {Dialog, Transition} from '@headlessui/react';
import { ProfileCard } from '@/components/ProfileCard/ProfileCard';
import { trackCtaClick } from '@/utils/analytics';

// Import executive images
import ceoImage from '@/assets/images/ceo.webp';
import cfoImage from '@/assets/images/cfo.webp';
import ccoImage from '@/assets/images/cco.webp';
import opsImage from '@/assets/images/ops-manager.webp';
import adminImage from '@/assets/images/admin-manager.webp';
import farmImage from '@/assets/images/farm-manager.webp';
import executiveHeroImage from '@/assets/images/executive.webp';
import JsonLd from "@/components/Seo/JsonLd";
import {Helmet} from "react-helmet-async";
import { InfoCard } from '@/components/InfoCard/InfoCard';

interface Executive {
    id: number;
    name: string;
    title: string;
    role: string;
    image: string;
    alt: string;
    bio: string | string[];
    certifications: string[];
    department: string;
    email: string;
    linkedin: string;
    idLabel: string;
}

const ExecutiveTeam: React.FC = () => {
    const { t } = useTranslation('executive');
    const [selectedExecutive, setSelectedExecutive] = useState<Executive | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const executives: Executive[] = [
        {
            id: 1,
            name: "Hamza Sangare SR.",
            title: t('executives.ceo.title'),
            role: t('executives.ceo.role'),
            image: ceoImage,
            alt: t('executives.ceo.alt'),
            bio: t('executives.ceo.bio', { returnObjects: true }),
            certifications: [
                "ITIL® 4 Foundation",
                "CompTIA Project+",
                "AWS Certified Cloud Practitioner",
                "Islamic Finance & Governance (Applied)"
            ],
            department: "leadership",
            email: "hamza@afrinutsexport.com",
            linkedin: "https://www.linkedin.com/in/hamza-sangare-827a8a130/",
            idLabel: "ceo"
        },
        {
            id: 2,
            name: "Sekou Hakim Peters",
            title: t('executives.cfo.title'),
            role: t('executives.cfo.role'),
            image: cfoImage,
            alt: t('executives.cfo.alt'),
            bio: t('executives.cfo.bio', { returnObjects: true }),
            certifications: ["Sharia Compliance", "Organic Certification"],
            department: "leadership",
            email: "sekou@afrinutsexport.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "cfo"
        },
        {
            id: 3,
            name: "Muhamadue Aly Kouyate",
            title: t('executives.cco.title'),
            role: t('executives.cco.role'),
            image: ccoImage,
            alt: t('executives.cco.alt'),
            bio: t('executives.cco.bio', { returnObjects: true }),
            certifications: ["Export & Trade Compliance", "Supply Chain and Logistics Management", "Process Improvement & Lean Practices"],
            department: "operations",
            email: "mohamad@afrinutsexport.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "cco"
        },
        {
            id: 4,
            name: "Alassana Bah",
            title: t('executives.ops.title'),
            role: t('executives.ops.role'),
            image: opsImage,
            alt: t('executives.cto.alt'),
            bio: t('executives.ops.bio', { returnObjects: true }),
            education: [
                "B.Sc. in Computer Science or Information Technology",
                "M.Sc. in Data Science or Agricultural Technology (in progress)"
            ],
            certifications: [
                "AWS Certified Solutions Architect",
                "Certified Data Analyst (CDA)",
                "IoT Security Certification",
                "Agritech Systems Integration"
            ],
            department: "Technology",
            email: "alassana@afrinutsexport.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "ops"
        },
        {
            id: 5,
            name: "Mohamed Beniken",
            title: t('executives.admin.title'),
            role: t('executives.admin.role'),
            image: adminImage,
            alt: t('executives.admin.alt'),
            bio: t('executives.admin.bio', { returnObjects: true }),
            certifications: ["Fair Trade", "Legal Compliance"],
            department: "operations",
            email: "mohamedb@afrinutsexport.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "admin"
        },
        {
            id: 6,
            name: "Souleymane Sangare",
            title: t('executives.farm.title'),
            role: t('executives.farm.role'),
            image: farmImage,
            alt: t('executives.farm.alt'),
            bio: t('executives.farm.bio', { returnObjects: true }),
            certifications: ["Sustainable Agriculture", "Community Development"],
            department: "operations",
            email: "souleymane@afrinutsexport.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "farm"
        }
    ];

    const openModal = (executive: Executive) => {
        setSelectedExecutive(executive);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
    };

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown as unknown as EventListener);
            // Focus on close button when modal opens
            setTimeout(() => {
                const closeButton = document.querySelector('[aria-label="Close modal"]') as HTMLElement;
                if (closeButton) closeButton.focus();
            }, 100);
        }
        return () => document.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
    }, [isModalOpen]);

    return (
        <main className="text-text-dark font-sans">
            <Helmet>
                <title>Executive Team | AfriNuts Export | Leadership in Cashew Agribusiness</title>
                <meta name="description" content="Meet the leadership team behind AfriNuts Export — from software engineering to agribusiness, our executives bring decades of experience in finance, technology, operations, and sustainable farming in Côte d'Ivoire." />
                <link rel="canonical" href="https://www.afrinutsexport.com/executive-team" />
            </Helmet>
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Meet the Team Building a New Standard for Ethical Agribusiness",
                "description": "Guided by Islamic values of Amanah and Ihsan, our leadership team brings together decades of experience in agribusiness, finance, technology, and community development.",
                "about": {
                    "@type": "Organization",
                    "name": "AfriNuts Export",
                    "description": "Building a vertically integrated, ethical cashew value chain rooted in Côte d'Ivoire.",
                    "employees": [
                        {
                            "@type": "Person",
                            "name": "Hamza S. Ralsan Sangare",
                            "jobTitle": "Chief Executive Officer",
                            "email": "hamza@afrinutsexport.com",
                            "sameAs": "https://www.linkedin.com/in/hamza-sangare-827a8a130/"
                        },
                        {
                            "@type": "Person",
                            "name": "Sekou Hakim",
                            "jobTitle": "Chief Financial & Operating Officer",
                            "email": "sekou@afrinutsexport.com",
                            "sameAs": "https://www.linkedin.com/in/sekou-peters"
                        },
                        {
                            "@type": "Person",
                            "name": "Mohamadue Kouyaté",
                            "jobTitle": "Chief Commercial Officer"
                        },
                        {
                            "@type": "Person",
                            "name": "Alassana Bah",
                            "jobTitle": "Chief Technology Officer"
                        },
                        {
                            "@type": "Person",
                            "name": "Mohammed Beniken",
                            "jobTitle": "Chief Administrative Officer"
                        },
                        {
                            "@type": "Person",
                            "name": "Souleymane Sangare",
                            "jobTitle": "Agricultural Operations Manager"
                        }
                    ]
                }
            }} />
            <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-[88px] pb-2">
            <div className="text-sm text-text-dark mb-4 flex items-center gap-1 flex-wrap">
                <Link to="/" className="hover:text-primary transition-colors">{t('breadcrumbs.home', 'Home')}</Link>
                <span>/</span>
                <Link to="/about" className="hover:text-primary transition-colors">{t('breadcrumbs.about', 'About')}</Link>
                <span>/</span>
                <span className="text-primary font-medium">{t('breadcrumbs.executiveTeam', 'Executive Team')}</span>
            </div>
            </div>
            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[50vh]">
                <motion.div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-28" initial="hidden" animate="visible" variants={staggerContainer}>

                    {/* Left: Text Content */}
                    <motion.div className="flex-1 max-w-none lg:max-w-xl text-center lg:text-left" variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                            <FaUserTie className="inline mr-2 text-accent" />{t('executives.subtitle')}
                        </Typography>
                        <motion.h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-text-dark mb-4 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                            {t('executives.title')}
                        </motion.h1>

                        {/* Lead Text */}
                        <Typography variant="lead" className="text-text-dark mb-5 text-base lg:text-lg">
                            {t('executives.lead', 'Most agribusiness teams are farmers who learned business. Ours is a software engineer who built a farm operating system, a financial architect who structures Shariah-compliant investments, and a trade compliance specialist who knows every document your shipment needs. We didn\'t assemble a team — we built a platform.')}
                        </Typography>

                        {/* Executive Intro Card */}
                        <motion.div variants={fadeIn} className="mb-5">
                            <InfoCard
                                icon={FaUsers}
                                title={t('executives.introTitle', 'Built Here. Not Bought.')}
                                variant="accent"
                                showInfoBadge={false}
                            >
                                <Typography variant="small" className="text-gray-600">
                                    {t('executives.description')}
                                </Typography>
                            </InfoCard>
                        </motion.div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    <FaUserTie className="text-[10px]" /> {t('executives.badgeTeam', '6 Leaders')}
                </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                    <FaCheckCircle className="text-[10px]" /> {t('executives.badgeGlobal', '3 Continents')}
                </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
                    <FaGlobeAfrica className="text-[10px]" /> {t('executives.badgeHQ', 'Odienné, CI')}
                </span>
                        </div>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <button
                                onClick={() => document.getElementById('team-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md inline-flex items-center gap-1.5">
                                <FaUsers className="text-xs" />{t('executives.ctaMeet', 'Meet the Team')}
                            </button>
                            <Link to="/about" className="relative border border-primary/40 text-primary hover:bg-primary/5 px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 bg-white/50 backdrop-blur-sm">
                                <FaArrowLeft className="text-xs" />{t('executives.backToAbout', 'About AfriNuts')}
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right: Team Image */}
                    <motion.div className="flex-shrink-0 lg:ml-auto lg:-mr-16" variants={fadeIn} transition={{ delay: 0.2 }}>
                        <motion.div className="relative w-96 h-96 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[650px] rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/40 transform-gpu group"
                                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                                    whileHover={{ scale: 1.03, rotateY: 2, transition: { duration: 0.3 } }}>
                            <div className="absolute inset-0 rounded-[2rem] border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                            <img src={executiveHeroImage} alt="AfriNuts Executive Team" className="w-full h-full object-cover" />
                            <div className="absolute bottom-3 left-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                                <span className="text-primary text-[11px] font-semibold">{t('executives.imageLabel')}</span>
                            </div>
                        </motion.div>
                    </motion.div>

                </motion.div>
            </Section>

            {/* Why Our Team Is Different */}
            <Section className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div className="text-center mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                        <Typography variant="h2" className="mb-4">{t('executives.whyDifferentTitle', 'Why Our Team Is Different')}</Typography>
                        <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
                            {t('executives.whyDifferentBody', 'Most agribusiness teams look the same: farmers and traders. Ours includes the software engineer who built our operating system, the financial architect who structured our Shariah-compliant investment model, and the trade compliance specialist who ensures every shipment meets EU standards.')}
                        </Typography>
                    </motion.div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                icon: FaMobile,
                                title: t('executives.tech', 'Technology Built In-House'),
                                desc: t('executives.techDesc', 'Farm OS was not purchased. It was architected and coded by our CEO, running on devices our CTO configured. Every line of code is ours.')
                            },
                            {
                                icon: FaHandshake,
                                title: t('executives.finance', 'Shariah-Compliant by Design'),
                                desc: t('executives.financeDesc', 'Our CFO structured our Mudarabah investment model — not a consultant. Islamic finance isn\'t a checkbox. It\'s how we\'re built.')
                            },
                            {
                                icon: FaGlobeAfrica,
                                title: t('executives.operations', 'Boots on the Ground + Global Reach'),
                                desc: t('executives.operationsDesc', 'Our farm manager lives in Odienné. Our commercial officer manages EU and Middle East buyer relationships. We span continents from day one.')
                            },
                        ].map((item, idx) => (
                            <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: idx * 0.1 }}>
                                <InfoCard icon={item.icon} title={item.title} iconColor="text-accent" showInfoBadge={false} className="h-full">
                                    <Typography variant="small" className="text-gray-600">{item.desc}</Typography>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Executive Team Grid using ProfileCard */}
            <Section className="py-16" id="team-grid">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {executives.map((executive) => (
                            <ProfileCard
                                key={executive.id}
                                image={executive.image}
                                name={executive.name}
                                position={executive.title}
                                message={Array.isArray(executive.bio) ? executive.bio : [executive.bio]}
                                signature={executive.role}
                                altText={executive.alt}
                                expandable={true}
                                variant={executive.department === "leadership" ? "primary" : "accent"}
                                className="cursor-pointer"
                                onClick={() => {
                                    trackCtaClick('view_bio', 'executive_team');
                                    openModal(executive);
                                }}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Bio Modal */}
                <Transition.Root show={isModalOpen && !!selectedExecutive} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={closeModal} role="dialog" aria-modal="true">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden bg-white/80 backdrop-blur-lg rounded-3xl border-2 border-white/40 shadow-xl text-left modal-content transition-all duration-300 hover:shadow-2xl">
                                        <div className="p-6">
                                            {selectedExecutive && (
                                                <>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <Dialog.Title as="h2" className="text-lg font-semibold text-primary">
                                                                {selectedExecutive.name}
                                                            </Dialog.Title>
                                                            <Typography variant="small" className="text-primary">
                                                                {selectedExecutive.title}
                                                            </Typography>
                                                        </div>
                                                        <button
                                                            onClick={closeModal}
                                                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                                            aria-label="Close modal"
                                                        >
                                                            <FaTimes className="h-6 w-6" />
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 flex flex-col sm:flex-row gap-6">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={selectedExecutive.image}
                                                                alt={selectedExecutive.alt}
                                                                className="h-32 w-32 rounded-full object-cover border-2 border-primary/20"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Typography variant="body" className="text-gray-700">
                                                                {Array.isArray(selectedExecutive.bio)
                                                                    ? selectedExecutive.bio.map((paragraph: string, index: number) => (
                                                                        <p key={index} className="mb-4">{paragraph}</p>
                                                                    ))
                                                                    : selectedExecutive.bio}
                                                            </Typography>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Typography variant="small" className="font-medium text-gray-900">
                                                                {t('executives.labels.experience')}
                                                            </Typography>
                                                            <Typography variant="body-sm" className="text-gray-700">
                                                                {t(`executives.${selectedExecutive.idLabel}.experience`)}
                                                            </Typography>
                                                        </div>
                                                        <div>
                                                            <Typography variant="small" className="font-medium text-gray-900">
                                                                {t('executives.labels.education')}
                                                            </Typography>

                                                            {Array.isArray(t(`executives.${selectedExecutive.idLabel}.education`, { returnObjects: true })) ? (
                                                                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                                                                    {(t(`executives.${selectedExecutive.idLabel}.education`, { returnObjects: true }) as string[]).map(
                                                                        (item, index) => (
                                                                            <li key={index}>{item}</li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            ) : (
                                                                <Typography variant="body-sm" className="text-gray-700">
                                                                    {t(`executives.${selectedExecutive.idLabel}.education`)}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <Typography variant="small" className="font-medium text-gray-900">
                                                            {t('executives.labels.certifications')}
                                                        </Typography>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {selectedExecutive.certifications.map((cert: string, index: number) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                                                >
                                                                    {cert}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Email & LinkedIn */}
                                                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FaEnvelope className="text-primary" />
                                                            <a href={`mailto:${selectedExecutive.email}`} className="text-gray-700 hover:text-accent transition-colors">
                                                                {selectedExecutive.email}
                                                            </a>
                                                        </div>
                                                        {selectedExecutive.linkedin && selectedExecutive.linkedin !== 'https://linkedin.com/in/example' && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <FaLinkedin className="text-primary" />
                                                                <a href={selectedExecutive.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-accent transition-colors">
                                                                    LinkedIn Profile
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-6 flex justify-end">
                                                        <button
                                                            onClick={closeModal}
                                                            className="bg-primary hover:bg-dark-orange text-white px-4 py-2 rounded-md text-sm"
                                                        >
                                                            {t('executives.labels.close')}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </Section>

            {/* CTA Section */}
            <Section className="py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <InfoCard
                            icon={FaUsers}
                            title={t('executives.ctaTitle', 'Ready to Work With Us?')}
                            variant="primary"
                            showInfoBadge={false}
                            className="text-center"
                        >
                            <Typography variant="body" className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                {t('executives.ctaDescription', 'Behind every shipment of traceable cashews is this team — building the technology, managing the farm, structuring the finance, and ensuring compliance. Whether you\'re a buyer, investor, or partner — let\'s start the conversation.')}
                            </Typography>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/contact"
                                      className="relative bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transform-gpu group/btn overflow-hidden font-medium shadow-lg inline-flex items-center gap-2">
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                    <FaEnvelope className="relative z-10" />
                                    <span className="relative z-10">{t('executives.ctaButton', 'Start a Conversation')}</span>
                                </Link>
                                <Link to="/invest"
                                      className="relative border-2 border-primary/50 text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-full transform-gpu font-medium inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm">
                                    <FaChartLine /> {t('executives.ctaInvest', 'Investor Information')}
                                </Link>
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            <style>{`
    @media (max-width: 640px) {
        .modal-content {
            margin: 0.5rem;
            width: calc(100% - 1rem);
        }
    }
`}</style>
        </main>
    );
};

export default ExecutiveTeam;
