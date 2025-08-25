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

            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            {/* ChevronDoubleUpIcon - Positioned like certification checkmark */}
            {onClick && (
                <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center transform-gpu group-hover:scale-125 transition-transform duration-500 z-20"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{
                        scale: 1.3,
                        rotate: 5,
                        transition: { duration: 0.2 }
                    }}
                >
                    <ChevronDoubleUpIcon className="w-3 h-3 text-white" />
                </motion.div>
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

                {shouldTruncate && (
                    <motion.button
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                        className={`mt-4 ${currentVariant.text} hover:${currentVariant.text}/80 font-medium flex items-center relative z-10 transform-gpu hover:scale-105 transition-transform duration-300`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {expanded ? (
                            <>
                                {t('cfo.readLess')}
                                <motion.span
                                    animate={{ rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                                </motion.span>
                            </>
                        ) : (
                            <>
                                {t('cfo.readMore')}
                                <motion.span
                                    animate={{ rotate: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                                </motion.span>
                            </>
                        )}
                    </motion.button>
                )}

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