// components/ShippingInfoCard/ShippingInfoCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { InfoCard } from '../InfoCard/InfoCard';
import { FaInfoCircle } from 'react-icons/fa';
import { Typography } from '../Typography/Typography';

interface ShippingOption {
    title: string;
    description: string;
    available: boolean;
}

interface ShippingInfoCardProps {
    title: string;
    intro: string;
    currentlyAvailable: ShippingOption[];
    comingSoon: ShippingOption[];
    helpText: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export const ShippingInfoCard: React.FC<ShippingInfoCardProps> = ({
                                                                      title,
                                                                      intro,
                                                                      currentlyAvailable,
                                                                      comingSoon,
                                                                      helpText,
                                                                      icon: Icon = FaInfoCircle
                                                                  }) => {
    return (
        <InfoCard
            icon={Icon}
            title={title}
            className="h-full"
            variant="accent"
        >
            <div className="mb-6">
                <Typography variant="body" className="mb-4">
                    {intro}
                </Typography>
            </div>

            <div className="space-y-6">
                {/* Currently Available Options */}
                <div>
                    <Typography variant="h4" className="text-primary mb-3 border-b pb-2">
                        Currently Available
                    </Typography>

                    {currentlyAvailable.map((option, index) => (
                        <motion.div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm mb-4 border-l-4 border-green-500 transform-gpu hover:scale-[1.02] transition-transform duration-300"
                            whileHover={{ y: -2 }}
                        >
                            <Typography variant="h5" className="text-green-700 mb-1">
                                {option.title}
                            </Typography>
                            <Typography variant="body" className="text-text-dark">
                                {option.description}
                            </Typography>
                        </motion.div>
                    ))}
                </div>

                {/* Coming Soon Options */}
                <div>
                    <Typography variant="h4" className="text-primary mb-3 border-b pb-2">
                        Coming Soon
                    </Typography>

                    {comingSoon.map((option, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-lg shadow-sm mb-4 opacity-80 transform-gpu"
                            whileHover={{ y: -2 }}
                        >
                            <Typography variant="h5" className="text-gray-600 mb-1">
                                {option.title}
                            </Typography>
                            <Typography variant="body" className="text-gray-600">
                                {option.description}
                            </Typography>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 transform-gpu hover:scale-[1.02] transition-transform duration-300"
                whileHover={{ y: -2 }}
            >
                <Typography variant="body" className="text-primary font-medium">
                    {helpText}
                </Typography>
            </motion.div>
        </InfoCard>
    );
};