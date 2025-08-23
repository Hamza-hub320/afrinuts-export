// src/components/InfoCard/InfoCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface InfoCardProps {
    hideIconContainer?: boolean;
    icon?: IconType;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    iconColor?: string;
    className?: string;
    cta?: string | React.ReactNode;
    onClickCta?: () => void;
    variant?: 'primary' | 'accent' | 'secondary'; // optional theme variants
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
                                                  }) => {
    // Define gradient and border based on variant
    const variantStyles = {
        primary: 'from-primary/5 to-accent/5 border-primary/20',
        accent: 'from-accent/5 to-primary/5 border-accent/20',
        secondary: 'from-secondary/5 to-primary/5 border-secondary/20',
    };

    return (
        <motion.div
            className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 
                        hover:border-accent/30 transition-all duration-300 
                        rounded-2xl shadow-xl ring-1 ring-white/10 p-5 sm:p-6 min-h-[180px] ${className}`}
            whileHover={{
                y: -4,
                transition: { duration: 0.3 },
                boxShadow: '0 12px 25px -5px rgba(0, 0, 0, 0.15)',
            }}
            whileTap={{ scale: 0.97 }}
            role="region"
            aria-labelledby={`infocard-title-${title}`}
        >
            {/* Outer glow */}
            <div
                className="
                    absolute -inset-[2px] rounded-xl
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    pointer-events-none
                    shadow-glow-accent-md
                    z-0
                "
            ></div>

            <div className="relative z-10 flex flex-col h-full">
                {!hideIconContainer && Icon && (
                    <motion.div
                        className="bg-white/30 dark:bg-white/10 p-3 rounded-full backdrop-blur-sm mb-4 w-fit"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <Icon className={`${iconColor} text-2xl`} />
                    </motion.div>
                )}

                <h3 id={`infocard-title-${title}`} className="text-xl font-bold text-primary mb-1">
                    {title}
                </h3>

                {subtitle && <p className="text-sm text-text-dark mb-2">{subtitle}</p>}

                <div className="text-text-dark flex-grow">{children}</div>

                {cta && (
                    <div className="mt-4">
                        {typeof cta === 'string' ? (
                            <button
                                onClick={onClickCta}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition-colors font-medium"
                            >
                                {cta}
                            </button>
                        ) : (
                            cta
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};