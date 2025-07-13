import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { fadeIn } from '../../utils/animations';

interface SustainabilityBadgeProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

const SustainabilityBadge: React.FC<SustainabilityBadgeProps> = ({
                                                                     icon,
                                                                     title,
                                                                     description,
                                                                     className = ''
                                                                 }) => {
    return (
        <motion.div
            className={`bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-afri-primary ${className}`}
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
        >
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-afri-light flex items-center justify-center mb-4 text-afri-secondary">
                    <div className="text-2xl">
                        {icon}
                    </div>
                </div>

                <Typography variant="h4" className="text-afri-primary mb-3">
                    {title}
                </Typography>

                <Typography variant="body" className="text-afri-dark">
                    {description}
                </Typography>
            </div>

            {/* Eco badge in corner */}
            <div className="absolute top-2 right-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="#4CAF50" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </motion.div>
    );
};

export default SustainabilityBadge;