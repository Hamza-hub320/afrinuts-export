import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { Typography } from "@/components/Typography/Typography";
import Section from '@/components/Section/Section';

// Import executive images
import ceoImage from '@/assets/images/ceo.webp';
import cfoImage from '@/assets/images/cfo.webp';
import ccoImage from '@/assets/images/cco.webp';
import opsImage from '@/assets/images/ops-manager.webp';
import adminImage from '@/assets/images/admin-manager.webp';
import farmImage from '@/assets/images/farm-manager.webp';

const ExecutiveTeam: React.FC = () => {
    const { t } = useTranslation('executive');

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

    return (
        <Section className="py-16">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-3">
                        {t('executives.subtitle')}
                    </Typography>
                    <Typography variant="h2" className="text-text-dark mb-4">
                        {t('executives.title')}
                    </Typography>
                    <Typography variant="body" className="max-w-2xl mx-auto text-text-dark">
                        {t('executives.description')}
                    </Typography>
                </motion.div>

                {/* Executive Grid */}
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
                            className="bg-gradient-to-br from-primary/5 to-accent/5  border-2 border-primary/20 hover:border-accent/30 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
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
                                        <Typography variant="h5" className="text-lg font-bold text-primary truncate">
                                            {executive.name}
                                        </Typography>
                                        <Typography variant="subtitle" className="text-primary">
                                            {executive.title}
                                        </Typography>
                                        <Typography variant="small" className="text-text-dark mt-1">
                                            {executive.role}
                                        </Typography>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Typography variant="body-sm" className="text-text-dark">
                                        {Array.isArray(executive.bio) ? executive.bio[0] : executive.bio}
                                    </Typography>
                                </div>

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
        </Section>
    );
};

export default ExecutiveTeam;