// components/ProfileCard/ProfileCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
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
                                                        }) => {
    const [expanded, setExpanded] = useState(false);
    const shouldTruncate = expandable && message.length > 1;
    const { t } = useTranslation('about');

    // Variant colors
    const variantColors = {
        primary: {
            border: 'border-primary/30',
            text: 'text-primary',
        },
        accent: {
            border: 'border-accent/30',
            text: 'text-accent-dark',
        },
        secondary: {
            border: 'border-secondary/30',
            text: 'text-secondary-dark',
        },
    };

    const currentVariant = variantColors[variant];

    return (
        <motion.div
            className={`group relative  bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-300 rounded-2xl shadow-xl ring-1 ring-white/10 p-5 sm:p-6 h-full ${className}`}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 md:mb-6">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 ${currentVariant.border}`}>
                    <img
                        src={image}
                        alt={altText}
                        width={80}
                        height={80}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                    />

                    {/* Outer glow */}
                    <div className="
        absolute -inset-[2px] rounded-xl
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
        shadow-glow-accent-md
        z-0
      "></div>

                </div>
                <div className="text-center sm:text-left">
                    <h3 className={`font-display text-xl md:text-2xl ${currentVariant.text}`}>{name}</h3>
                    <p className="font-subhead text-sm md:text-base text-text-dark">{position}</p>
                </div>
            </div>

            <div className="prose max-w-none space-y-4">
                {message.map((paragraph, index) => (
                    <p
                        key={`message-para-${index}`}
                        className={`text-base md:text-lg text-text-dark ${
                            !expanded && shouldTruncate && index >= 1 ? 'hidden' : ''
                        }`}
                    >
                        {paragraph}
                    </p>
                ))}
            </div>

            {shouldTruncate && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`mt-4 ${currentVariant.text} hover:${currentVariant.text}/80 font-medium flex items-center`}
                >
                    {expanded ? (
                        <>
                        {t('cfo.readLess')}
                            <ChevronUpIcon className="ml-1 h-4 w-4" />
                        </>
                    ) : (
                        <>
                        {t('cfo.readMore')}
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                        </>
                    )}
                </button>
            )}

            <p className={`mt-6 font-display italic ${currentVariant.text} text-sm md:text-base`}>
                {signature}
            </p>
        </motion.div>
    );
};