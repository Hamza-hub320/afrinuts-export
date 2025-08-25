// components/FormCard/FormCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface FormCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'accent' | 'secondary';
}

export const FormCard: React.FC<FormCardProps> = ({
                                                      title,
                                                      subtitle,
                                                      children,
                                                      className = '',
                                                      variant = 'primary',
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

    const currentVariant = variantStyles[variant];

    return (
        <motion.div
            className={`relative bg-gradient-to-br ${currentVariant.bg} 
                        border-2 ${currentVariant.border} transition-all duration-500
                        rounded-2xl shadow-xl ring-1 ring-white/10 p-5 sm:p-6
                        transform-gpu w-full max-w-2xl mx-auto ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -4,
                transition: { duration: 0.3 },
                boxShadow: '0 12px 25px -5px rgba(0, 0, 0, 0.15)',
            }}
            whileTap={{ scale: 0.97 }}
            role="region"
            aria-labelledby={`formcard-title-${title}`}
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] hover:translate-z-[-10px] transition-all duration-500" />

            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 hover:opacity-60 transition-opacity duration-500" />

            {/* Inner shadow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            <div className="relative z-10">
                <h3 id={`formcard-title-${title}`} className="text-xl font-bold text-primary mb-2">
                    {title}
                </h3>

                {subtitle && <p className="text-sm text-text-dark mb-4">{subtitle}</p>}

                <div className="text-text-dark">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};