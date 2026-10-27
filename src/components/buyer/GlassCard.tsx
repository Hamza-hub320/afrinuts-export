import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { Typography } from '@/components/Typography/Typography';

interface GlassCardProps {
    icon?: IconType;
    title?: string;
    subtitle?: string;
    iconColor?: string;
    variant?: 'primary' | 'accent' | 'secondary';
    children: React.ReactNode;
    className?: string;
    /** Minimal = no hover lift, no 3D tilt. Good for dense data cards. */
    minimal?: boolean;
}

const variantAccent = {
    primary: { tint: 'from-primary/5 to-accent/5', border: 'border-primary/20', icon: 'text-primary' },
    accent: { tint: 'from-accent/5 to-primary/5', border: 'border-accent/20', icon: 'text-accent' },
    secondary: { tint: 'from-secondary/5 to-primary/5', border: 'border-secondary/20', icon: 'text-secondary' },
};

export const GlassCard: React.FC<GlassCardProps> = ({
                                                        icon: Icon,
                                                        title,
                                                        subtitle,
                                                        iconColor,
                                                        variant = 'primary',
                                                        children,
                                                        className = '',
                                                        minimal = false,
                                                    }) => {
    const accent = variantAccent[variant];

    const motionProps = minimal
        ? {}
        : {
            whileHover: {
                y: -3,
                scale: 1.005,
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.25 },
            },
        };

    return (
        <motion.div
            className={`group relative bg-gradient-to-br ${accent.tint} border ${accent.border} rounded-2xl shadow-sm transition-shadow duration-300 ${className}`}
            {...motionProps}
        >
            {/* Frosted overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent opacity-60 pointer-events-none" />
            {/* Inner highlight */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] pointer-events-none" />

            <div className="relative z-10 p-5">
                {(Icon || title) && (
                    <div className="flex items-center gap-2.5 mb-3">
                        {Icon && (
                            <div className="w-8 h-8 rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm flex-shrink-0">
                                <Icon className={`${iconColor || accent.icon} text-sm`} />
                            </div>
                        )}
                        <div className="min-w-0">
                            {title && (
                                <Typography
                                    variant="small"
                                    className="font-semibold text-gray-900 leading-tight"
                                >
                                    {title}
                                </Typography>
                            )}
                            {subtitle && (
                                <Typography
                                    variant="small"
                                    className="text-gray-500 text-[11px] leading-tight mt-0.5"
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </div>
                    </div>
                )}

                {children}
            </div>
        </motion.div>
    );
};