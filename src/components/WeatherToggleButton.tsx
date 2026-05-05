import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudSun, FaTimes } from 'react-icons/fa';
import DashboardWeatherWidget from '@/components/DashboardWeatherWidget';

const WeatherToggleButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white rounded-l-lg shadow-xl transform-gpu focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 border-2 border-white/20"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close weather' : 'Open weather'}
                whileHover={{ scale: 1.08, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.96 }}
            >
                <div className="absolute inset-0 rounded-l-lg border border-white/30 transform-gpu translate-z-[-4px] hover:translate-z-[-6px] transition-all duration-300" />
                <div className="absolute inset-0 rounded-l-lg bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                <div className="relative z-10">
                    {isOpen ? <FaTimes className="text-xl" /> : <FaCloudSun className="text-xl" />}
                </div>
            </motion.button>

            {/* Expanded Widget Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute right-12 top-0"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 110, damping: 18 }}
                    >
                        <DashboardWeatherWidget location="Odienne" compact />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default WeatherToggleButton;