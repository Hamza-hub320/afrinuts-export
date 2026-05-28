import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaSmile } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const FeedbackButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleRating = async (value: number) => {
        setRating(value);
        setSubmitted(true);

        // Send feedback via EmailJS
        try {
            await emailjs.send(
                'service_qftryeh',
                'template_feedback', // Create this template in EmailJS
                {
                    rating: value,
                    page: window.location.pathname,
                    timestamp: new Date().toLocaleString(),
                },
                'BuIYx9hnXwuMJjbhE'
            );
        } catch (error) {
            console.error('Failed to send feedback:', error);
        }

        // Auto-close after 2 seconds
        setTimeout(() => {
            setIsOpen(false);
            setRating(null);
            setSubmitted(false);
        }, 2000);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                className="fixed right-0 top-[calc(30%+56px)] z-[9999] w-12 h-12 flex items-center justify-center bg-gradient-to-br from-accent to-dark-orange text-white rounded-l-lg shadow-xl transform-gpu focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 border-2 border-white/20"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Share feedback"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                whileHover={{ scale: 1.08, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.96 }}
            >
                <div className="absolute inset-0 rounded-l-lg border border-white/30 transform-gpu translate-z-[-4px]" />
                <div className="absolute inset-0 rounded-l-lg bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                <FaStar className="text-xl relative z-10" />
            </motion.button>

            {/* Feedback Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed right-0 top-[calc(30%+112px)] z-[9998] w-56 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl rounded-l-lg shadow-2xl border-2 border-white/20 transform-gpu overflow-hidden"
                        style={{ transformStyle: 'preserve-3d' }}
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 110, damping: 18 }}
                    >
                        <div className="absolute inset-0 rounded-l-lg border-2 border-white/30 transform-gpu translate-z-[-6px]" />
                        <div className="absolute inset-0 rounded-l-lg bg-gradient-to-b from-white/15 to-transparent opacity-40" />
                        <div className="absolute inset-0 rounded-l-lg shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />

                        <div className="relative z-10 p-4">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-bold text-gray-800">
                                    {submitted ? 'Thank You!' : 'Rate Your Experience'}
                                </h3>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <FaTimes className="text-xs" />
                                </button>
                            </div>

                            {!submitted ? (
                                <>
                                    <p className="text-xs text-gray-600 mb-3">
                                        How satisfied are you with our website?
                                    </p>
                                    <div className="flex justify-between gap-1">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <motion.button
                                                key={value}
                                                onClick={() => handleRating(value)}
                                                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                                                    rating === value
                                                        ? 'bg-accent text-white shadow-md'
                                                        : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                                                }`}
                                                whileHover={{ scale: 1.15, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {value}
                                            </motion.button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                                        <span>Not satisfied</span>
                                        <span>Very satisfied</span>
                                    </div>
                                </>
                            ) : (
                                <motion.div
                                    className="text-center py-3"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                >
                                    <div className="flex justify-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`text-lg ${star <= (rating || 0) ? 'text-amber-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600">We appreciate your feedback!</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FeedbackButton;