// src/components/InfoCard/InfoCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaInfoCircle } from 'react-icons/fa';

interface InfoCardProps {
    hideIconContainer?: boolean;
    icon?: IconType;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    iconColor?: string;
    className?: string;
    cta?: string | React.ReactNode;
    onClickCta?: () => void;
    variant?: 'primary' | 'accent' | 'secondary';
    showInfoBadge?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
                                                      icon: Icon,
                                                      hideIconContainer = false,
                                                      title,
                                                      subtitle,
                                                      children,
                                                      iconColor = 'text-accent',
                                                      className = '',
                                                      cta,
                                                      onClickCta,
                                                      variant = 'primary',
                                                      showInfoBadge = false,
                                                  }) => {
    // Define gradient and border based on variant
    const variantStyles = {
        primary: {
            bg: 'from-primary/5 to-accent/5',
            border: 'border-primary/20 hover:border-accent/30',
            glow: 'shadow-glow-primary-md'
        },
        accent: {
            bg: 'from-accent/5 to-primary/5',
            border: 'border-accent/20 hover:border-primary/30',
            glow: 'shadow-glow-accent-md'
        },
        secondary: {
            bg: 'from-secondary/5 to-primary/5',
            border: 'border-secondary/20 hover:border-primary/30',
            glow: 'shadow-glow-secondary-md'
        },
    };

    // Generate a safe ID for ARIA referencing
    const safeTitleId = `infocard-title-${typeof title === 'string' ? title.replace(/\s+/g, '-').toLowerCase() : 'no-title'}`;

    return (
        <motion.div
            className={`group relative bg-gradient-to-br ${variantStyles[variant].bg} 
                        border-2 ${variantStyles[variant].border} transition-all duration-500
                        rounded-2xl shadow-xl ring-1 ring-white/10 p-5 sm:p-6 min-h-[180px] 
                        transform-gpu ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                rotateY: 3,
                transition: { duration: 0.3 },
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
            }}
            whileTap={{ scale: 0.97 }}
            role="region"
            aria-labelledby={safeTitleId}
        >

            {showInfoBadge && (
                <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center transform-gpu group-hover:scale-125 transition-transform duration-500 z-20"
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <FaInfoCircle className="w-3 h-3 text-white" />
                </motion.div>
            )}

            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Inner shadow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            <div className="relative z-10 flex flex-col h-full">
                {!hideIconContainer && Icon && (
                    <motion.div
                        className="bg-white/40 dark:bg-white/15 p-3 rounded-full backdrop-blur-md mb-4 w-fit transform-gpu group-hover:scale-110 transition-transform duration-500 shadow-md"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        <Icon className={`${iconColor} text-2xl transform-gpu group-hover:scale-110 transition-transform duration-300`} />
                    </motion.div>
                )}

                <h3 id={safeTitleId} className="text-xl font-bold text-primary mb-1 relative z-10">
                    {title}
                </h3>

                {subtitle && <p className="text-sm text-text-dark mb-2 relative z-10">{subtitle}</p>}

                <div className="text-text-dark flex-grow relative z-10">{children}</div>

                {cta && (
                    <div className="mt-4 relative z-10">
                        {typeof cta === 'string' ? (
                            <motion.button
                                onClick={onClickCta}
                                className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-md hover:from-accent hover:to-primary transition-all duration-300 font-medium shadow-md transform-gpu hover:scale-105"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cta}
                            </motion.button>
                        ) : (
                            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                                {cta}
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};