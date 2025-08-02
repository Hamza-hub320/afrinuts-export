// src/components/InfoCard/InfoCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface InfoCardProps {
    hideIconContainer?: boolean;
    icon?: IconType;
    title: string;
    children: React.ReactNode;
    iconColor?: string;
    className?: string;
    cta?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
                                                      icon: Icon,
                                                      hideIconContainer = false,
                                                      title,
                                                      children,
                                                      iconColor = 'text-accent',
                                                      className = '',
                                                      cta
                                                  }) => {
    return (
        <motion.div
            className={`group relative  bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-accent/30 transition-all duration-300 rounded-2xl shadow-xl ring-1 ring-white/10 p-5 sm:p-6 h-full ${className}`}
            whileHover={{
                y: -4,
                transition: { duration: 0.3 },
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            whileTap={{ scale: 0.97 }}
        >
            {/* Outer glow */}
            <div className="
        absolute -inset-[2px] rounded-xl
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
        shadow-glow-accent-md
        z-0
      "></div>



            {/* Main content */}
            <div className="relative z-10 h-full flex flex-col">
                <motion.div
                    className="bg-white/30 dark:bg-white/10  p-3 rounded-full backdrop-blur-sm mb-4 w-fit"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <Icon className={`${iconColor} text-2xl`} />
                </motion.div>
                <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
                <div className="text-text-dark flex-grow">{children}</div>
                {cta && (
                    <button className="mt-4 text-accent hover:underline font-medium self-start">
                        {cta}
                    </button>
                )}
            </div>
        </motion.div>
    );
};