// src/components/GlowingCard/GlowingCard.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowingCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: 'lift' | 'scale';
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
                                                            children,
                                                            className = '',
                                                            hoverEffect = 'lift'
                                                        }) => {
    return (
        <motion.div
            className={`group relative bg-white rounded-xl shadow-lg border border-warm-grey/20 p-6 ${className}`}
            whileHover={{
                y: hoverEffect === 'lift' ? -8 : 0,
                scale: hoverEffect === 'scale' ? 1.03 : 1,
                transition: { duration: 0.3 }
            }}
        >
            {/* AWS-style outer glow */}
            <div className="
        absolute -inset-[2px] rounded-xl
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
        shadow-glow-accent-md
        z-0
      "></div>

            {/* Subtle border accent on hover */}
            <div className="
        absolute -inset-[1px] rounded-xl
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        pointer-events-none
        border border-accent/30
        z-0
      "></div>

            {/* Main content */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};

export default GlowingCard;