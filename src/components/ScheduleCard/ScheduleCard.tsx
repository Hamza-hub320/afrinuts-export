// src/components/ScheduleCard/ScheduleCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaCalendarAlt } from 'react-icons/fa';

interface ScheduleCardProps {
    icon?: IconType;
    title: string;
    subtitle?: string;
    embedUrl: string;
    iconColor?: string;
    variant?: 'primary' | 'accent' | 'secondary';
    height?: number;
    className?: string;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
                                                              icon: Icon = FaCalendarAlt,
                                                              title,
                                                              subtitle,
                                                              embedUrl,
                                                              iconColor = 'text-accent',
                                                              variant = 'primary',
                                                              height = 700,
                                                              className = '',
                                                          }) => {
    const variantStyles = {
        primary: {
            bg: 'from-primary/5 to-accent/5',
            border: 'border-primary/20 hover:border-accent/30',
        },
        accent: {
            bg: 'from-accent/5 to-primary/5',
            border: 'border-accent/20 hover:border-primary/30',
        },
        secondary: {
            bg: 'from-secondary/5 to-primary/5',
            border: 'border-secondary/20 hover:border-primary/30',
        },
    };

    const currentVariant = variantStyles[variant];
    const safeTitleId = `schedulecard-title-${title.replace(/\s+/g, '-').toLowerCase()}`;

    return (
        <motion.div
            className={`group relative bg-gradient-to-br ${currentVariant.bg}
                        border-2 ${currentVariant.border} transition-all duration-500
                        rounded-2xl shadow-xl ring-1 ring-white/10 p-5 sm:p-6
                        transform-gpu ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -6,
                scale: 1.01,
                rotateY: 1,
                transition: { duration: 0.3 },
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
            }}
            role="region"
            aria-labelledby={safeTitleId}
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500 pointer-events-none" />

            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

            {/* Inner shadow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500 pointer-events-none" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    {Icon && (
                        <motion.div
                            className="bg-white/40 dark:bg-white/15 p-3 rounded-full backdrop-blur-md transform-gpu shadow-md"
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Icon className={`${iconColor} text-2xl`} />
                        </motion.div>
                    )}
                    <div>
                        <h3 id={safeTitleId} className="text-xl font-bold text-primary">
                            {title}
                        </h3>
                        {subtitle && (
                            <p className="text-sm text-text-dark">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Embed */}
                <div className="rounded-xl overflow-hidden bg-white/40 backdrop-blur-sm border border-white/30">
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height={height}
                        frameBorder="0"
                        title={title}
                        className="rounded-xl"
                        loading="lazy"
                    />
                </div>
            </div>
        </motion.div>
    );
};