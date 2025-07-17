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
    subtitle: string;
    subhead: string;
    body: string;
    small: string
} = {
    // Display styles - using Playfair Display
    'display-2xl': 'font-display text-display-2xl text-dark',
    'display-xl': 'font-display text-display-xl text-dark',
    'display-lg': 'font-display text-display-lg text-dark',

    // Headings - using Playfair Display
    h1: 'font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-dark',
    h2: 'font-display text-3xl md:text-4xl lg:text-5xl font-bold text-dark',
    h3: 'font-accent text-2xl md:text-3xl font-bold text-primary tracking-wide',
    h4: 'font-subhead text-xl md:text-2xl font-semibold text-dark tracking-tight',

    // Subheadings - using Open Sans
    subtitle: 'font-subhead text-lg text-dark',
    subhead: 'font-subhead text-lg md:text-xl font-medium text-dark',

    // Body text - using Inter
    body: 'font-sans text-base text-dark',
    small: 'font-sans text-sm  text-dark',
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

export default Typography;