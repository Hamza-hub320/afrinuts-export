import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface FarmBlockProps {
    blockName: string;
    status: 'PLANTED' | 'PLOWED' | 'CLEARED' | 'NOT CLEARED';
    survivalRate?: number;
    icon: React.ReactNode;
    colors: {
        bg: string;
        border: string;
        badge: string;
        icon: string;
    };
    infrastructure?: {
        type: 'guard-post' | 'water-tank';
        label: string;
    };
    onClick: () => void;
}

export const FarmBlock: React.FC<FarmBlockProps> = ({
                                                        blockName,
                                                        status,
                                                        survivalRate,
                                                        icon,
                                                        colors,
                                                        infrastructure,
                                                        onClick,
                                                    }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.08, y: -6 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`aspect-square rounded-xl cursor-pointer transition-all shadow-md hover:shadow-2xl p-2 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br ${colors.bg} border-2 ${colors.border}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
        >
            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent opacity-50" />

            {/* Inner highlight */}
            <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_4px_rgba(255,255,255,0.5)]" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Block Name */}
                <div className="text-sm font-bold text-gray-800">{blockName}</div>

                {/* Status Icon */}
                <div className={`text-xl my-1 p-1.5 rounded-full ${colors.icon}`}>
                    {icon}
                </div>

                {/* Survival Rate (only for planted blocks) */}
                {status === 'PLANTED' && survivalRate !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {survivalRate.toFixed(0)}%
                    </span>
                )}

                {/* Infrastructure Markers */}
                {infrastructure && (
                    <div
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                            infrastructure.type === 'guard-post'
                                ? 'bg-red-500 animate-pulse'
                                : 'bg-blue-500'
                        }`}
                        title={infrastructure.label}
                    />
                )}
            </div>
        </motion.div>
    );
};