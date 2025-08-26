import React, {Fragment, useState, useEffect, KeyboardEvent} from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FaTimes, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {Dialog, Transition} from '@headlessui/react';
import { ProfileCard } from '@/components/ProfileCard/ProfileCard'; // Import ProfileCard

// Import executive images
import ceoImage from '@/assets/images/ceo.webp';
import cfoImage from '@/assets/images/cfo.webp';
import ccoImage from '@/assets/images/cco.webp';
import opsImage from '@/assets/images/ops-manager.webp';
import adminImage from '@/assets/images/admin-manager.webp';
import farmImage from '@/assets/images/farm-manager.webp';

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

    const executives: Executive[] = [
        {
            id: 1,
            name: "Hamza Sangare SR.",
            title: t('executives.ceo.title'),
            role: t('executives.ceo.role'),
            image: ceoImage,
            alt: t('executives.ceo.alt'),
            bio: t('executives.ceo.bio', { returnObjects: true }),
            certifications: ["Islamic Finance", "Strategic Leadership"],
            department: "leadership",
            email: "ceo@company.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "ceo"
        },
        {
            id: 2,
            name: "Sekou Hakim",
            title: t('executives.cfo.title'),
            role: t('executives.cfo.role'),
            image: cfoImage,
            alt: t('executives.cfo.alt'),
            bio: t('executives.cfo.bio', { returnObjects: true }),
            certifications: ["Sharia Compliance", "Organic Certification"],
            department: "leadership",
            email: "cfo@company.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "cfo"
        },
        {
            id: 3,
            name: "Mohamadue A. Kouyaté",
            title: t('executives.cco.title'),
            role: t('executives.cco.role'),
            image: ccoImage,
            alt: t('executives.cco.alt'),
            bio: t('executives.cco.bio', { returnObjects: true }),
            certifications: ["Rainforest Alliance", "Export Compliance"],
            department: "operations",
            email: "cco@company.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "cco"
        },
        {
            id: 4,
            name: "Rouillard Cedric",
            title: t('executives.ops.title'),
            role: t('executives.ops.role'),
            image: opsImage,
            alt: t('executives.ops.alt'),
            bio: t('executives.ops.bio', { returnObjects: true }),
            certifications: ["ISO 22000", "Food Safety"],
            department: "operations",
            email: "ops@company.com",
            linkedin: "https://linkedin.com/in/example",
            idLabel: "ops"
        },
        {
            id: 5,
            name: "Mohammed Beniken",
            title: t('executives.admin.title'),
            role: t('executives.admin.role'),
            image: adminImage,
            alt: t('executives.admin.alt'),
            bio: t('executives.admin.bio', { returnObjects: true }),
            certifications: ["Fair Trade", "Legal Compliance"],
            department: "operations",
            email: "admin@company.com",
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
            email: "farm@company.com",
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
            {/* Hero Section */}
            <Section
                fullHeight={true}
                className="flex items-center justify-center text-center min-h-[50vh] md:min-h-[50vh] bg-gradient-to-b"
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
                            {t('executives.subtitle')}
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        {t('executives.title')}
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <Typography
                            variant="lead"
                            className="text-text-dark max-w-3xl mx-auto"
                        >
                            {t('executives.description')}
                        </Typography>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Info/Intro Section */}
            <Section className="py-6 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        {t('executives.introHeading')}
                    </Typography>
                    <Typography variant="lead" className="text-text-dark mb-8">
                        {t('executives.introDescription')}
                    </Typography>
                    {t('executives.introSupporting', { defaultValue: '' }) && t('executives.introSupporting') !== '' && (
                        <Typography variant="body" className="text-text-dark mb-4">
                            {t('executives.introSupporting')}
                        </Typography>
                    )}
                </div>
            </Section>

            {/* Executive Team Grid using ProfileCard */}
            <Section className="py-16">
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
                                onClick={() => openModal(executive)}
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
                                    <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden bg-background rounded-3xl border-2 border-primary/20 hover:border-accent/30 hover:shadow-xl transition-shadow duration-300 text-left shadow-xl modal-content">
                                        <div className="p-6">
                                            {selectedExecutive && (
                                                <>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <Dialog.Title as="h3" className="text-lg font-semibold text-primary">
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
                                                            <Typography variant="body-sm" className="text-gray-700">
                                                                {t(`executives.${selectedExecutive.idLabel}.education`)}
                                                            </Typography>
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

                                                    <div className="mt-6 flex space-x-4">
                                                        <a href={`mailto:${selectedExecutive.email}`} className="text-primary hover:text-accent">
                                                            <FaEnvelope className="h-5 w-5" />
                                                        </a>
                                                        <a href={selectedExecutive.linkedin} className="text-primary hover:text-accent">
                                                            <FaLinkedin className="h-5 w-5" />
                                                        </a>
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

            {/* CTA Section - Enhanced with Glassy 3D */}
            <Section className="py-16 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 md:p-12 transform-gpu"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        whileHover={{
                            y: -5,
                            rotateY: 2,
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
                                {t('executives.ctaTitle')}
                            </Typography>
                            <Typography variant="lead" className="text-text-dark mb-8 max-w-3xl mx-auto">
                                {t('executives.ctaDescription')}
                            </Typography>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link
                                    to="/contact"
                                    className="inline-block bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white px-8 py-4 rounded-full transition-all duration-300 font-medium shadow-lg transform-gpu hover:scale-105 relative group"
                                >
                                    {/* Button 3D effect */}
                                    <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-300" />

                                    {/* Button glassy overlay */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                                    {/* Button inner glow */}
                                    <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />

                                    <span className="relative z-10">
                            {t('executives.ctaButton')}
                        </span>
                                </Link>
                            </motion.div>
                        </div>
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
