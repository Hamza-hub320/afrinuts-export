// components/ProfileCard/ProfileCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExpand, FaQuoteLeft } from 'react-icons/fa';
import ProfilePlaceholder from '@/components/ProfilePlaceholder/ProfilePlaceholder';

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
                                                            image, name, position, message, signature, altText,
                                                            expandable = false, className = '', variant = 'primary', onClick,
                                                        }) => {
    const [expanded] = useState(false);
    const shouldTruncate = expandable && message.length > 1;

    const variantColors = {
        primary: { border: 'border-primary/30', text: 'text-primary', bg: 'from-primary/5 to-accent/5', accent: 'bg-primary' },
        accent: { border: 'border-accent/30', text: 'text-accent', bg: 'from-accent/5 to-primary/5', accent: 'bg-accent' },
        secondary: { border: 'border-secondary/30', text: 'text-secondary-dark', bg: 'from-secondary/5 to-primary/5', accent: 'bg-secondary' },
    };
    const c = variantColors[variant];

    return (
        <motion.div
            className={`group relative bg-gradient-to-br ${c.bg} border-2 ${c.border} transition-all duration-500 rounded-2xl shadow-xl ring-1 ring-white/10 p-5 sm:p-6 h-full transform-gpu ${className}`}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            whileHover={{ y: -8, scale: 1.02, rotateY: 2, boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2)', transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            {/* Glass effects */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            {/* Expand indicator */}
            {onClick && (
                <motion.div
                    className="absolute -top-2 -right-2 w-7 h-7 bg-accent rounded-full flex items-center justify-center transform-gpu group-hover:scale-125 transition-transform duration-500 z-20 shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{ scale: 1.3, rotate: 5 }}>
                    <FaExpand className="w-3 h-3 text-white" />
                </motion.div>
            )}

            <div className="relative z-10 flex flex-col h-full">
                {/* Name + Position — Top-Aligned */}
                <div className="text-center mb-4">
                    <h3 className={`font-display text-lg md:text-xl ${c.text} relative z-10`}>{name}</h3>
                    <motion.p className="font-subhead text-xs md:text-sm text-text-dark/70 relative z-10 mt-0.5" whileHover={{ x: 2 }}>
                        {position}
                    </motion.p>
                </div>

                {/* Image — Large, Centered, Overlapping the bottom edge */}
                <div className="flex justify-center -mb-8 relative z-10">
                    <motion.div
                        className={`relative w-[75px] h-[75px] sm:w-[75px] sm:h-[75px] md:w-[75px] md:h-[75px] rounded-full overflow-hidden border-4 ${c.border} shadow-lg transform-gpu group-hover:scale-105 transition-transform duration-500`}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ type: 'spring', stiffness: 300 }}>
                        {image ? (
                            <img src={image} alt={altText || name} className="w-full h-full object-cover" />
                        ) : (
                            <ProfilePlaceholder name={name} size={67} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                    </motion.div>
                </div>

                {/* Quote + Bio — Bottom Section with background */}
                <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 pt-10 flex-1 flex flex-col">
                    {/* Quote icon */}
                    <FaQuoteLeft className="text-primary/20 text-lg mb-2" />

                    <div className="space-y-3 flex-1">
                        {message.map((paragraph, index) => (
                            <motion.p
                                key={`msg-${index}`}
                                className={`text-sm md:text-base text-text-dark leading-relaxed ${!expanded && shouldTruncate && index >= 1 ? 'hidden' : ''}`}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                {paragraph}
                            </motion.p>
                        ))}
                    </div>

                    {/* Signature */}
                    <motion.p className={`mt-4 font-display italic ${c.text} text-xs md:text-sm text-right`} whileHover={{ x: 2 }}>
                        {signature}
                    </motion.p>
                </div>
            </div>
        </motion.div>
    );
};