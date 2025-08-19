import React, {Fragment, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {Dialog, Transition} from '@headlessui/react';

// Import executive images
import ceoImage from '@/assets/images/ceo.webp';
import cfoImage from '@/assets/images/cfo.webp';
import ccoImage from '@/assets/images/cco.webp';
import opsImage from '@/assets/images/ops-manager.webp';
import adminImage from '@/assets/images/admin-manager.webp';
import farmImage from '@/assets/images/farm-manager.webp';

const ExecutiveTeam: React.FC = () => {
    const { t } = useTranslation('executive');
    const [selectedExecutive, setSelectedExecutive] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const executives = [
        {
            id: 1,
            name: "Hamza Sangare SR.",
            title: t('executives.ceo.title'),
            role: t('executives.ceo.role'),
            image: ceoImage,
            alt: t('executives.ceo.alt'),
            bio: t('executives.ceo.bio', { returnObjects: true }),
            certifications: ["Islamic Finance", "Strategic Leadership"]
        },
        {
            id: 2,
            name: "Sekou Hakim",
            title: t('executives.cfo.title'),
            role: t('executives.cfo.role'),
            image: cfoImage,
            alt: t('executives.cfo.alt'),
            bio: t('executives.cfo.bio', { returnObjects: true }),
            certifications: ["Sharia Compliance", "Organic Certification"]
        },
        {
            id: 3,
            name: "Mohamadue A. Kouyaté",
            title: t('executives.cco.title'),
            role: t('executives.cco.role'),
            image: ccoImage,
            alt: t('executives.cco.alt'),
            bio: t('executives.cco.bio', { returnObjects: true }),
            certifications: ["Rainforest Alliance", "Export Compliance"]
        },
        {
            id: 4,
            name: "Rouillard Cedric",
            title: t('executives.ops.title'),
            role: t('executives.ops.role'),
            image: opsImage,
            alt: t('executives.ops.alt'),
            bio: t('executives.ops.bio', { returnObjects: true }),
            certifications: ["ISO 22000", "Food Safety"]
        },
        {
            id: 5,
            name: "Mohammed Beniken",
            title: t('executives.admin.title'),
            role: t('executives.admin.role'),
            image: adminImage,
            alt: t('executives.admin.alt'),
            bio: t('executives.admin.bio', { returnObjects: true }),
            certifications: ["Fair Trade", "Legal Compliance"]
        },
        {
            id: 6,
            name: "Souleymane Sangare",
            title: t('executives.farm.title'),
            role: t('executives.farm.role'),
            image: farmImage,
            alt: t('executives.farm.alt'),
            bio: t('executives.farm.bio', { returnObjects: true }),
            certifications: ["Sustainable Agriculture", "Community Development"]
        }
    ];

    const openModal = (executive: any) => {
        setSelectedExecutive(executive);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

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
                    {/* Optionally supporting text */}
                    {t('executives.introSupporting', { defaultValue: '' }) && t('executives.introSupporting') !== '' && (
                        <Typography variant="body" className="text-text-dark mb-4">
                            {t('executives.introSupporting')}
                        </Typography>
                    )}
                </div>
            </Section>

            {/* Executive Team Grid */}
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
                            <motion.div
                                key={executive.id}
                                className="border-gray-100 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-8 border-2 border-primary/20 hover:border-accent/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                                variants={fadeIn}
                                whileHover={{ y: -5 }}
                            >
                                <div className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
                                                src={executive.image}
                                                alt={executive.alt}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Typography
                                                variant="h5"
                                                className="text-lg font-bold !text-primary"
                                            >
                                                {executive.name}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="text-primary"
                                            >
                                                {executive.title}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="text-text-dark mt-1"
                                            >
                                                {executive.role}
                                            </Typography>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Typography
                                            variant="body-sm"
                                            className="text-text-dark"
                                        >
                                            {Array.isArray(executive.bio) ? executive.bio[0] : executive.bio}
                                        </Typography>
                                    </div>

                                    {/* Read More Button */}
                                    <button
                                        onClick={() => openModal(executive)}
                                        className="mt-4 text-primary hover:text-accent font-medium text-sm flex items-center transition-colors duration-300"
                                    >
                                        Read More
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex flex-wrap gap-2">
                                            {executive.certifications.map((cert, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                                >
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Bio Modal */}
                <Transition.Root show={isModalOpen && !!selectedExecutive} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                                    <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden bg-background rounded-3xl border-2 border-primary/20 hover:border-accent/30 hover:shadow-xl transition-shadow duration-300 text-left shadow-xl">
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
                                                                    ? selectedExecutive.bio.map((paragraph, index) => (
                                                                        <p key={index} className="mb-4">{paragraph}</p>
                                                                    ))
                                                                    : selectedExecutive.bio}
                                                            </Typography>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <Typography variant="small" className="font-medium text-gray-900">
                                                            Certifications & Expertise:
                                                        </Typography>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {selectedExecutive.certifications.map((cert, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                                                >
                                                                    {cert}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex justify-end">
                                                        <button
                                                            onClick={closeModal}
                                                            className="bg-primary hover:bg-dark-orange text-white px-4 py-2 rounded-md text-sm"
                                                        >
                                                            Close
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

            {/* CTA Section after Executive Team Grid */}
            <Section className="py-16 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        {t('executives.ctaTitle')}
                    </Typography>
                    <Typography variant="lead" className="text-text-dark mb-8">
                        {t('executives.ctaDescription')}
                    </Typography>
                    <Link
                        to="/contact"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-full hover:bg-accent transition-colors font-medium"
                    >
                        {t('executives.ctaButton')}
                    </Link>
                </div>
            </Section>
        </main>
    );
};

export default ExecutiveTeam;