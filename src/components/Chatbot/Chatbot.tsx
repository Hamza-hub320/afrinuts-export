import React from 'react';
import { FaWhatsapp, FaPhone, FaComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FloatingButtonsProps {
    className?: string;
}

const WHATSAPP_NUMBER = '3854577473';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20AfriNuts`;

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ className = '' }) => {
    return (
        <div className={`fixed bottom-36 left-4 z-50 flex flex-col items-end space-y-2 ${className}`}>
            {/* WhatsApp Button */}
            <motion.button
                className="flex items-center px-3 py-2 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl transform-gpu group relative"
                style={{
                    transformStyle: 'preserve-3d',
                }}
                aria-label="Chat on WhatsApp"
                onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
                type="button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.5
                }}
                whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: '0 10px 25px -5px rgba(72, 187, 120, 0.4)',
                    transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
            >
                {/* 3D edge effect */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-300" />

                {/* Glassy overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                {/* Inner glow */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />

                <div className="relative z-10 flex items-center">
                    <FaWhatsapp className="text-xl" />
                    <motion.span
                        className="ml-2 text-sm font-medium"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        transition={{ delay: 0.8, duration: 0.3 }}
                    >
                        Chat with us
                    </motion.span>
                </div>
            </motion.button>

            {/* Contact Us Button */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.3
                }}
            >
                <Link
                    to="/contact"
                    className="flex items-center px-3 py-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl transform-gpu group relative"
                    style={{
                        transformStyle: 'preserve-3d',
                    }}
                    aria-label="Go to Contact Page"
                >
                    {/* 3D edge effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 transform-gpu translate-z-[-4px] group-hover:translate-z-[-6px] transition-all duration-300" />

                    {/* Glassy overlay */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />

                    {/* Inner glow */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.3)]" />

                    <div className="relative z-10 flex items-center">
                        <FaComment className="text-lg" />
                        <span className="ml-2 text-sm font-medium">Contact Us</span>
                    </div>
                </Link>
            </motion.div>

            {/* Quick Call Button (Optional) */}
        </div>
    );
};

export default FloatingButtons;