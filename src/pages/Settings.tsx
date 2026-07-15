import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaCheckCircle, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setStatus('error');
            setMessage('New passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters.');
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser || !currentUser.email) throw new Error('Not authenticated');

            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);

            setStatus('success');
            setMessage('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setStatus('error');
            if (error.code === 'auth/wrong-password') {
                setMessage('Current password is incorrect.');
            } else {
                setMessage(error.message || 'Failed to update password.');
            }
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            <Section className="flex items-center justify-center text-center min-h-[40vh] relative">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-12" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaUser className="inline mr-3 text-accent" />
                            Account Settings
                        </Typography>
                    </motion.div>
                    <motion.h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                        Profile & Security
                    </motion.h1>
                </motion.div>
            </Section>

            <Section className="py-8">
                <div className="max-w-lg mx-auto px-4 sm:px-6">
                    {/* Profile Info */}
                    <motion.div className="mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <InfoCard icon={FaUser} title="Account Information" iconColor="text-accent" showInfoBadge={false}>
                            <div className="space-y-3 mt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium">{user?.email || '—'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Display Name</span>
                                    <span className="font-medium">{user?.name || user?.displayName || '—'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Role</span>
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                        {user?.role || 'User'}
                                    </span>
                                </div>
                            </div>
                        </InfoCard>
                    </motion.div>

                    {/* Password Change */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <InfoCard icon={FaLock} title="Change Password" iconColor="text-primary" showInfoBadge={false}>
                            <form onSubmit={handlePasswordChange} className="space-y-4 mt-3">
                                <div className="relative">
                                    <label className="block text-xs text-gray-500 mb-1">Current Password</label>
                                    <div className="relative">
                                        <input type={showCurrent ? 'text' : 'password'} value={currentPassword}
                                               onChange={e => setCurrentPassword(e.target.value)} required
                                               className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" />
                                        <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                            {showCurrent ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block text-xs text-gray-500 mb-1">New Password</label>
                                    <div className="relative">
                                        <input type={showNew ? 'text' : 'password'} value={newPassword}
                                               onChange={e => setNewPassword(e.target.value)} required
                                               className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" />
                                        <button type="button" onClick={() => setShowNew(!showNew)}
                                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                            {showNew ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
                                    <input type="password" value={confirmPassword}
                                           onChange={e => setConfirmPassword(e.target.value)} required
                                           className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                </div>

                                {status !== 'idle' && (
                                    <div className={`p-3 rounded-lg text-sm ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        {status === 'success' && <FaCheckCircle className="inline mr-1" />}
                                        {message}
                                    </div>
                                )}

                                <button type="submit" disabled={status === 'loading'}
                                        className="w-full py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:from-accent hover:to-primary transition-all disabled:opacity-50">
                                    {status === 'loading' ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default Settings;