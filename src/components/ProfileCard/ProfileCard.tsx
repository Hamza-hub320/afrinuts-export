// components/ProfileCard/ProfileCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronDoubleUpIcon } from '@heroicons/react/24/outline';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {t} from "i18next";
import {useTranslation} from "react-i18next";

interface ProfileCardProps {
    image: string;
    name: string;
    position: string;
    message: string[];
    signature: string;
    altText: string;
    expandable?: boolean;
    className?: string;
    variant?: 'primary' | 'accent' | 'secondary';
    onClick?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    image,
    name,
    position,
    message,
    signature,
    altText,
    expandable = false,
    className = '',
    variant = 'primary',
    onClick,
}) => {
    const [expanded, setExpanded] = useState(false);
    const shouldTruncate = expandable && message.length > 1;
    const { t } = useTranslation('about');

    // Variant colors
    const variantColors = {
        primary: {
            border: 'border-primary/30',
            text: 'text-primary',
            bg: 'from-primary/5 to-accent/5',
            glow: 'shadow-glow-primary-md'
        },
        accent: {
            border: 'border-accent/30',
            text: 'text-accent-dark',
            bg: 'from-accent/5 to-primary/5',
            glow: 'shadow-glow-accent-md'
        },
        secondary: {
            border: 'border-secondary/30',
            text: 'text-secondary-dark',
            bg: 'from-secondary/5 to-primary/5',
            glow: 'shadow-glow-secondary-md'
        },
    };

    const currentVariant = variantColors[variant];

    return (
        <motion.div
            className={`group relative bg-gradient-to-br ${currentVariant.bg} border-2 ${currentVariant.border} transition-all duration-500 rounded-2xl shadow-xl ring-1 ring-white/10 p-5 sm:p-6 h-full transform-gpu ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                rotateY: 2,
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Inner shadow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

            {onClick && (
              <div className="absolute top-2 right-2 z-20 flex items-center space-x-1 text-xs px-2 py-1 rounded-full shadow-md pointer-events-none">
                <ChevronDoubleUpIcon className="w-3 h-3" />
              </div>
            )}

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-6">
                    <motion.div
                        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 ${currentVariant.border} transform-gpu group-hover:scale-110 transition-transform duration-500 shadow-md`}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <img
                            src={image}
                            alt={altText}
                            width={80}
                            height={80}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />

                        {/* Profile image glossy overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                    </motion.div>

                    <div className="text-center sm:text-left">
                        <h3 className={`font-display text-xl md:text-2xl ${currentVariant.text} relative z-10`}>{name}</h3>
                        <motion.p
                            className="font-subhead text-sm md:text-base text-text-dark relative z-10"
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            {position}
                        </motion.p>
                    </div>
                </div>

                <div className="prose max-w-none space-y-4 relative z-10">
                    {message.map((paragraph, index) => (
                        <motion.p
                            key={`message-para-${index}`}
                            className={`text-base md:text-lg text-text-dark ${
                                !expanded && shouldTruncate && index >= 1 ? 'hidden' : ''
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </div>
                <motion.p
                    className={`mt-6 font-display italic ${currentVariant.text} text-sm md:text-base relative z-10`}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                >
                    {signature}
                </motion.p>
            </div>
        </motion.div>
    );
};