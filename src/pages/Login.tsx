import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { trackCtaClick } from '@/utils/analytics';

import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaArrowRight, FaShieldAlt
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import logo from '@/assets/images/afrinuts-export-official-logo.webp';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            trackCtaClick('login', 'login_page');
            navigate('/dashboard');
        } catch (err: any) {
            const message = err.message || '';
            if (message.includes('user-not-found') || message.includes('invalid-email')) {
                setError('No account found with this email address. If you are a new investor, please sign the NDA first.');
            } else if (message.includes('wrong-password')) {
                setError('Incorrect password. Please try again or use the forgot password link.');
            } else if (message.includes('too-many-requests')) {
                setError('Too many login attempts. Please wait a moment and try again.');
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
            {/* Animated blobs */}
            <div
                className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse"
                style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }}
            />
            <div
                className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full opacity-10 blur-3xl"
                style={{
                    background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)',
                    animation: 'float 8s ease-in-out infinite'
                }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl"
                style={{
                    background: 'radial-gradient(circle, rgba(90,116,17,0.4) 0%, transparent 70%)',
                    animation: 'float 10s ease-in-out infinite reverse'
                }}
            />

            <div className="relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Logo / Brand */}
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
                            Welcome Back
                        </Typography>
                        <Typography variant="body" className="text-text-dark/70">
                            Sign in to access your farm dashboard
                        </Typography>
                    </div>

                    {/* Login Card - Frosted Glass with 3D Lift */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl"
                        style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                        }}
                        whileHover={{
                            y: -8,
                            scale: 1.03,
                            rotateY: 2,
                            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.25)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* 3D edge effect */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

                        {/* Glassy overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                        {/* Inner shadow effect */}
                        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

                        {/* Animated blobs inside card */}
                        <div
                            className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-2xl animate-pulse"
                            style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }}
                        />
                        <div
                            className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full opacity-8 blur-2xl"
                            style={{
                                background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)',
                                animation: 'float 6s ease-in-out infinite'
                            }}
                        />

                        <div className="relative z-10 p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                                            placeholder="you@afrinutsexport.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-12 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex justify-end mt-1">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/contact?subject=Password%20Reset')}
                                            className="text-xs text-primary/60 hover:text-primary transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl"
                                    >
                                        <p className="text-sm text-red-600">{error}</p>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                Sign In
                                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                </motion.button>
                            </form>

                            {/* Access Information */}
                            <div className="mt-6 pt-6 border-t border-gray-200/50 space-y-2">
                                <div className="flex items-start gap-2">
                                    <FaLock className="text-primary/40 text-xs mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-500">
                                        <strong>Farm owners, managers, and verified investors only.</strong> New investors receive credentials after signing the NDA.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FaEnvelope className="text-primary/40 text-xs mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-500">
                                        Don't have access? <Link to="/invest" className="text-primary hover:underline">Become an investor</Link> or <Link to="/contact" className="text-primary hover:underline">request credentials</Link>.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FaShieldAlt className="text-primary/40 text-xs mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-400">
                                        All credentials are encrypted. Your Farm OS dashboard data is private and secure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Back Link */}
                    <div className="text-center mt-6">
                        <Link to="/" className="text-primary/70 hover:text-primary transition-colors text-sm inline-flex items-center gap-1 group">
                            ← Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default Login;
