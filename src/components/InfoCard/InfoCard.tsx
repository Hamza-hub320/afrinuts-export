// src/components/InfoCard/InfoCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface InfoCardProps {
    icon: IconType;
    title: string;
    description: string;
    iconColor?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
                                                      icon: Icon,
                                                      title,
                                                      description,
                                                      iconColor = 'text-accent'
                                                  }) => {
    return (
        <motion.div
            className="group relative bg-white rounded-xl shadow-lg border border-warm-grey/20 p-6 h-full"
            whileHover={{
                y: -8,
                transition: { duration: 0.3 }
            }}
        >
            {/* AWS-style outer glow */}
            <div className="
        absolute -inset-[2px] rounded-xl
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
        shadow-glow-accent-md
        z-0
      "></div>

            {/* Subtle border accent on hover */}
            <div className="
        absolute -inset-[1px] rounded-xl
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        pointer-events-none
        border border-accent/30
        z-0
      "></div>

            {/* Main content */}
            <div className="relative z-10 h-full flex flex-col">
                <div className={`${iconColor} text-3xl mb-4`}>
                    <Icon />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
                <p className="text-text-dark flex-grow">{description}</p>
            </div>
        </motion.div>
    );
};