// components/ContactInfoCard/ContactInfoCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { InfoCard } from '../InfoCard/InfoCard';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { Typography } from '../Typography/Typography';
import WeatherDisplay from '../WeatherDisplay/WeatherDisplay';

interface ContactInfo {
    title: string;
    content: string[];
}

interface ContactInfoCardProps {
    title: string;
    weatherLocation: string;
    contactItems: {
        address: ContactInfo;
        phone: ContactInfo;
        email: ContactInfo;
        hours: ContactInfo;
    };
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
                                                                    title,
                                                                    weatherLocation,
                                                                    contactItems
                                                                }) => {
    const iconMap = {
        address: FaMapMarkerAlt,
        phone: FaPhone,
        email: FaEnvelope,
        hours: FaClock
    };

    return (
        <InfoCard
            title={title}
            className="h-full"
            variant="primary"
        >
            {/* Weather Widget */}
            <div className="mb-6">
                <WeatherDisplay location={weatherLocation} />
            </div>

            {/* Contact Info Items */}
            <div className="space-y-6">
                {Object.entries(contactItems).map(([key, info]) => {
                    const IconComponent = iconMap[key as keyof typeof iconMap];
                    return (
                        <motion.div
                            key={key}
                            className="flex gap-4 items-start bg-white/30 backdrop-blur-sm p-4 rounded-xl transform-gpu hover:scale-[1.02] transition-transform duration-300"
                            whileHover={{ x: 3 }}
                        >
                            <div className="bg-accent/10 p-3 rounded-full text-accent flex-shrink-0 transform-gpu hover:scale-110 transition-transform duration-300">
                                <IconComponent className="text-xl" />
                            </div>
                            <div>
                                <Typography variant="h4" className="text-primary mb-1">
                                    {info.title}
                                </Typography>
                                {info.content.map((line, index) => (
                                    <Typography key={index} variant="body">{line}</Typography>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </InfoCard>
    );
};