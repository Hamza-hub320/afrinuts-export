import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaEnvelope, FaArrowLeft, FaCheckCircle, FaShieldAlt,
    FaUserTie, FaUserShield, FaArrowRight, FaRedo,
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { sendMagicLink } from '@/services/buyerAuth';
import logo from '@/assets/images/afrinuts-export-official-logo.webp';

const RESEND_COOLDOWN_SECONDS = 60;

const BuyerLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [mode, setMode] = useState<'buyer' | 'admin'>('buyer');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);

    // Countdown for resend button
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown(c => (c <= 1 ? 0 : c - 1)), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const sendLink = async (targetEmail: string) => {
        setStatus('sending');
        setErrorMessage('');
        try {
            // Redirect target is embedded in the magic-link URL so the
            // callback page knows where to send the user after auth.
            const redirect = mode === 'admin' ? '/dashboard/buyers' : '/portal';
            await sendMagicLink(targetEmail.trim().toLowerCase(), redirect);
            setStatus('sent');
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (error: any) {
            console.error('Magic link error:', error);
            setStatus('error');
            setErrorMessage(
                error?.message ||
                'Something went wrong. Please check your email address and try again.'
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendLink(email);
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        await sendLink(email);
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Animated blobs (matching Login.tsx) */}
            <div
                className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse"
                style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }}
            />
            <div
                className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full opacity-10 blur-3xl"
                style={{
                    background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)',
                    animation: 'float 8s ease-in-out infinite',
                }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl"
                style={{
                    background: 'radial-gradient(circle, rgba(90,116,17,0.4) 0%, transparent 70%)',
                    animation: 'float 10s ease-in-out infinite reverse',
                }}
            />

            <div className="relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Logo + Heading */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center mb-4"
                        >
                            <img
                                src={logo}
                                alt="AfriNuts Export Logo"
                                className="h-32 w-auto drop-shadow-lg"
                            />
                        </motion.div>
                        <Typography variant="h2" className="text-primary mb-2">
                            Buyer Portal
                        </Typography>
                        <Typography variant="body" className="text-text-dark/70">
                            Sign in with a secure email link — no password to remember
                        </Typography>
                    </div>

                    {/* Frosted Glass Card — 3D lift */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                        whileHover={{
                            y: -8,
                            scale: 1.03,
                            rotateY: 2,
                            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 },
                        }}
                    >
                        {/* 3D edge */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        {/* Inner shadow */}
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
                        {/* Pattern */}
                        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />
                        {/* Inside blobs */}
                        <div
                            className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-2xl animate-pulse"
                            style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }}
                        />
                        <div
                            className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full opacity-8 blur-2xl"
                            style={{
                                background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)',
                                animation: 'float 6s ease-in-out infinite',
                            }}
                        />

                        <div className="relative z-10 p-8">
                            {status === 'sent' ? (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <div className="p-3 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-xl mb-4">
                                        <div className="flex items-start gap-3">
                                            <FaCheckCircle className="text-green-600 text-xl mt-0.5 flex-shrink-0" />
                                            <div>
                                                <Typography variant="small" className="font-semibold text-green-800 mb-1">
                                                    Check your email
                                                </Typography>
                                                <Typography variant="small" className="text-green-700 text-sm">
                                                    We sent a {mode === 'admin' ? 'staff' : 'buyer'} login link to{' '}
                                                    <strong>{email}</strong>. Click it to continue.
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleResend}
                                            disabled={cooldown > 0}
                                            className="w-full flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm border border-primary/20 text-primary py-3 rounded-xl font-medium hover:bg-white/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaRedo className="text-xs" />
                                            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend link'}
                                        </button>
                                        <button
                                            onClick={() => { setStatus('idle'); setEmail(''); setCooldown(0); }}
                                            className="text-primary/70 hover:text-primary text-sm"
                                        >
                                            Use a different email
                                        </button>
                                    </div>

                                    <p className="mt-4 text-xs text-gray-500">
                                        The link expires in 1 hour. Check your spam folder if you don't see it.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Segmented control: Buyer vs Staff */}
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setMode('buyer')}
                                            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
                                                mode === 'buyer'
                                                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                                                    : 'text-gray-600 hover:text-primary'
                                            }`}
                                        >
                                            <FaUserTie size={12} /> Buyer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMode('admin')}
                                            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${
                                                mode === 'admin'
                                                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                                                    : 'text-gray-600 hover:text-primary'
                                            }`}
                                        >
                                            <FaUserShield size={12} /> Staff
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500 -mt-2">
                                        {mode === 'buyer'
                                            ? 'Buyers receive access to their assigned shipments.'
                                            : 'Farm OS staff (OWNER / MANAGER) sign in to manage buyers.'}
                                    </p>

                                    {/* Email field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Business Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaEnvelope className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={mode === 'admin' ? 'you@afrinutsexport.com' : 'procurement@nutriglobal.com'}
                                                className="block w-full pl-10 pr-3 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {status === 'error' && errorMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl"
                                        >
                                            <p className="text-sm text-red-600">{errorMessage}</p>
                                        </motion.div>
                                    )}

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="relative w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {status === 'sending' ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Login Link
                                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                    </motion.button>
                                </form>
                            )}

                            {/* Footer access info (mirrors Login.tsx) */}
                            <div className="mt-6 pt-6 border-t border-gray-200/50 space-y-2">
                                <div className="flex items-start gap-2">
                                    <FaShieldAlt className="text-primary/40 text-xs mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-500">
                                        <strong>Secure, passwordless access.</strong> Only invited buyers and staff can sign in.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FaEnvelope className="text-primary/40 text-xs mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-500">
                                        Not yet a buyer?{' '}
                                        <Link to="/contact" className="text-primary hover:underline">Contact us</Link>{' '}
                                        to request access. Staff use their existing Farm OS credentials.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Back link */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="text-primary/70 hover:text-primary transition-colors text-sm inline-flex items-center gap-1 group"
                        >
                            <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default BuyerLogin;