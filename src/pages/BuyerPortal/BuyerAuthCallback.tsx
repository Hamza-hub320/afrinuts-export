import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaShieldAlt, FaEnvelope, FaCheckCircle,
    FaArrowLeft, FaRedo,
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { completeMagicLinkSignIn, STORAGE_KEY } from '@/services/buyerAuth';
import logo from '@/assets/images/afrinuts-export-official-logo.webp';

const ALLOWED_REDIRECTS = ['/portal', '/dashboard/buyers'];

const BuyerAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'ready' | 'signing-in' | 'error'>('ready');
    const [errorMessage, setErrorMessage] = useState('');

    const rawRedirect = searchParams.get('redirect') || '/portal';
    const redirectPath = ALLOWED_REDIRECTS.includes(rawRedirect) ? rawRedirect : '/portal';
    const isStaffRedirect = redirectPath === '/dashboard/buyers';

    const handleSignIn = async () => {
        setStatus('signing-in');
        try {
            // Hydrate stored email from the server-generated link so
            // completeMagicLinkSignIn() doesn't prompt the user.
            const emailHint = searchParams.get('email');
            if (emailHint) {
                window.localStorage.setItem(STORAGE_KEY, emailHint.trim().toLowerCase());
            }

            const user = await completeMagicLinkSignIn();
            if (user) {
                navigate(redirectPath, { replace: true });
            } else {
                navigate('/portal/login', { replace: true });
            }
        } catch (error: any) {
            console.error('Sign-in error:', error);
            setStatus('error');
            setErrorMessage(
                error?.code === 'auth/invalid-action-code'
                    ? 'This login link has already been used or expired. Please request a new one.'
                    : error?.message || 'Could not complete sign-in'
            );
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Animated blobs (matching Login.tsx / BuyerLogin.tsx) */}
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
                            {isStaffRedirect ? 'Complete Staff Sign In' : 'Complete Your Sign In'}
                        </Typography>
                        <Typography variant="body" className="text-text-dark/70">
                            One click to verify and open your portal
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
                            {status === 'ready' && (
                                <div className="text-center">
                                    <FaEnvelope className="text-4xl text-accent mx-auto mb-4" />
                                    <Typography variant="body" className="text-gray-600 mb-5 text-sm">
                                        Click the button below to securely complete your sign-in.
                                        This prevents email scanners from using your one-time link.
                                    </Typography>
                                    <motion.button
                                        onClick={handleSignIn}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden group"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <FaShieldAlt className="text-xs" />
                                            Sign In Now
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                    </motion.button>
                                </div>
                            )}

                            {status === 'signing-in' && (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                                    <Typography variant="body" className="text-gray-600 text-sm">
                                        Signing you in...
                                    </Typography>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="text-center">
                                    <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl mb-4">
                                        <Typography variant="body" className="text-red-600 text-sm">
                                            {errorMessage}
                                        </Typography>
                                    </div>
                                    <motion.button
                                        onClick={() => navigate('/portal/login')}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-medium"
                                    >
                                        <FaRedo className="text-xs" />
                                        Request New Link
                                    </motion.button>
                                </div>
                            )}

                            {/* Footer note (mirrors Login.tsx) */}
                            <div className="mt-6 pt-6 border-t border-gray-200/50 space-y-2">
                                <div className="flex items-start gap-2">
                                    <FaCheckCircle className="text-primary/40 text-xs mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-500">
                                        <strong>Secure, passwordless verification.</strong> The link is
                                        one-time use and cryptographically tied to your email.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FaEnvelope className="text-primary/40 text-xs mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-500">
                                        Didn't request this?{' '}
                                        <Link to="/contact" className="text-primary hover:underline">Contact us</Link>{' '}
                                        immediately — someone may have signed up with your email.
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

export default BuyerAuthCallback;