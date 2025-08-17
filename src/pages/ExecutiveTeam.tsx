import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';
import { FaTimes } from 'react-icons/fa';

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
                className="flex items-center justify-center text-center min-h-[45vh] bg-gradient-to-b from-primary/20 to-background"
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

            {/* Executive Team Grid */}
            <Section className="py-16 bg-background">
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
                                                className="text-lg font-bold text-primary"
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
                {isModalOpen && selectedExecutive && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex justify-center min-h-screen px-4 text-center items-start sm:items-center pt-16 sm:pt-0">
                            {/* Background overlay */}
                            <div
                                className="fixed inset-0 bg-black/75 transition-opacity"
                                aria-hidden="true"
                                onClick={closeModal}
                            ></div>

                            {/* Modal content */}
                            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-2xl w-full mx-auto my-8">
                                <div className="bg-white px-4 pt-6 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Typography variant="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                        {selectedExecutive.name}
                                                    </Typography>
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

                                            <div className="mt-4">
                                                <img
                                                    src={selectedExecutive.image}
                                                    alt={selectedExecutive.alt}
                                                    className="h-32 w-32 rounded-full object-cover border-2 border-primary/20 mx-auto sm:mx-0"
                                                />
                                            </div>

                                            <div className="mt-4">
                                                <Typography variant="body" className="text-gray-700">
                                                    {Array.isArray(selectedExecutive.bio)
                                                        ? selectedExecutive.bio.map((paragraph, index) => (
                                                            <p key={index} className="mb-4">{paragraph}</p>
                                                        ))
                                                        : selectedExecutive.bio}
                                                </Typography>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Typography variant="small" className="font-medium text-gray-900">
                                                    Certifications & Expertise:
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
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Section>
        </main>
    );
};

export default ExecutiveTeam;