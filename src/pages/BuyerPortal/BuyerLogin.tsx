import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import Section from '@components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { sendMagicLink } from '@/services/buyerAuth';

const BuyerLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        try {
            await sendMagicLink(email.trim().toLowerCase());
            setStatus('sent');
        } catch (error: any) {
            console.error('Magic link error:', error);
            setStatus('error');
            setErrorMessage(
                error?.code === 'auth/user-not-found'
                    ? 'No buyer account found with this email. Contact us if you believe this is an error.'
                    : error?.message || 'Something went wrong. Please try again.'
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center pt-[72px] px-4">
            <motion.div
                className="max-w-md w-full"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <Link to="/trace" className="inline-flex items-center gap-2 text-primary hover:text-accent mb-6 text-sm">
                    <FaArrowLeft className="text-xs" /> Back to Home
                </Link>

                <InfoCard
                    icon={FaShieldAlt}
                    title="Buyer Portal Login"
                    subtitle="Access your shipments' full documentation"
                    variant="primary"
                    showInfoBadge={false}
                >
                    {status === 'sent' ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <FaCheckCircle className="text-green-600 text-xl mt-0.5" />
                                    <div>
                                        <Typography variant="small" className="font-semibold text-green-800 mb-1">
                                            Check your email
                                        </Typography>
                                        <Typography variant="small" className="text-green-700 text-sm">
                                            We sent a login link to <strong>{email}</strong>. Click it to access your buyer portal.
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <Typography variant="small" className="text-gray-500 text-xs">
                                The link expires in 1 hour. Check your spam folder if you don't see it.
                            </Typography>
                            <button
                                onClick={() => { setStatus('idle'); setEmail(''); }}
                                className="mt-4 text-primary hover:text-accent text-sm font-medium"
                            >
                                Use a different email
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Typography variant="body" className="text-gray-700 mb-4 text-sm">
                                Enter your business email. We'll send you a secure login link — no password to remember.
                            </Typography>

                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Business Email
                            </label>
                            <div className="relative mb-4">
                                <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="procurement@nutriglobal.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                            </div>

                            {status === 'error' && errorMessage && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                                    <Typography variant="small" className="text-red-700 text-sm">
                                        {errorMessage}
                                    </Typography>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Login Link'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <Typography variant="small" className="text-gray-500 text-xs text-center">
                            Not yet a buyer? <Link to="/contact" className="text-accent hover:text-primary underline">Contact us</Link> to get access.
                        </Typography>
                    </div>
                </InfoCard>
            </motion.div>
        </div>
    );
};

export default BuyerLogin;