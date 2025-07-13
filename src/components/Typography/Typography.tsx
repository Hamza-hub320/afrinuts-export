// components/Typography.tsx
import React from 'react';
import { motion } from 'framer-motion';

type TypographyVariant =
    | 'display-2xl' | 'display-xl' | 'display-lg'  // Display styles
    | 'h1' | 'h2' | 'h3' | 'h4'
    | 'subtitle'
    | 'subhead'
    | 'body' | 'small';                            // Body text

interface TypographyProps {
    variant?: TypographyVariant;
    className?: string;
    children: React.ReactNode;
    [key: string]: any;
}

const variantClasses: {
    "display-2xl": string;
    "display-xl": string;
    "display-lg": string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    subtitle?: string;
    subhead: string;
    body: string;
    small: string
} = {
    // Display styles - using Playfair Display
    'display-2xl': 'font-display text-display-2xl text-primary',
    'display-xl': 'font-display text-display-xl text-primary',
    'display-lg': 'font-display text-display-lg text-primary',

    // Headings - using Playfair Display
    h1: 'font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary',
    h2: 'font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary',
    h3: 'font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary',
    h4: 'font-display text-xl md:text-2xl lg:text-3xl font-semibold text-primary',

    // Subheadings - using Open Sans
    subtitle: 'font-subhead text-lg text-primary',
    subhead: 'font-subhead text-lg md:text-xl font-medium text-primary',

    // Body text - using Inter
    body: 'font-sans text-base',
    small: 'font-sans text-sm'
};

export const Typography: React.FC<TypographyProps> = ({
                                                          variant = 'body',
                                                          className = '',
                                                          children,
                                                          ...props
                                                      }) => {
    const baseClasses = 'text-text-dark leading-relaxed';
    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <motion.div className={combinedClasses} {...props}>
            {children}
        </motion.div>
    );
};