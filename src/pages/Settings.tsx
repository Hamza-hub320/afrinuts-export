import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaUser, FaLock, FaCheckCircle, FaEye, FaEyeSlash,
    FaShieldAlt, FaUserShield, FaTimesCircle, FaHistory
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import {GiFarmer} from "react-icons/gi";

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    // 👇 REMOVED: const [loading, setLoading] = useState(true);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');
        if (newPassword !== confirmPassword) { setStatus('error'); setMessage('New passwords do not match.'); return; }
        if (newPassword.length < 6) { setStatus('error'); setMessage('Password must be at least 6 characters.'); return; }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser || !currentUser.email) throw new Error('Not authenticated');
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);
            setStatus('success'); setMessage('Password updated successfully.');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (error: any) {
            setStatus('error');
            setMessage(error.code === 'auth/wrong-password' ? 'Current password is incorrect.' : error.message || 'Failed to update password.');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            <Section className="flex items-center justify-center text-center min-h-[30vh] relative">
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

            <Section className="py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    {/* Row 1: Profile + Security Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                            {/* Security Overview */}
                            <InfoCard icon={FaShieldAlt} title="Security Overview" iconColor="text-amber-500" showInfoBadge={false}>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div className="bg-white/40 rounded-xl p-3 border border-white/30 text-center">
                                        <div className="text-lg font-bold text-primary">
                                            {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Today'}
                                        </div>
                                        <div className="text-xs text-gray-500">Last Login</div>
                                    </div>
                                    <div className="bg-white/40 rounded-xl p-3 border border-white/30 text-center">
                                        <div className="text-lg font-bold text-green-600">
                                            {user?.emailVerified ? 'Verified' : 'Pending'}
                                        </div>
                                        <div className="text-xs text-gray-500">Email Status</div>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">Device</span>
                                        <span className="font-medium">{user?.lastLoginDevice || 'Unknown'}</span>
                                    </div>
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">IP Address</span>
                                        <span className="font-medium">{user?.lastLoginIp || 'Unknown'}</span>
                                    </div>
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">Account Created</span>
                                        <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
                                    </div>
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">Two-Factor Auth</span>
                                        <span className={`font-medium ${user?.twoFactorEnabled ? 'text-green-600' : 'text-red-500'}`}>
                {user?.twoFactorEnabled ? 'Enabled' : 'Not Configured'}
            </span>
                                    </div>
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">Failed Login Attempts</span>
                                        <span className={`font-medium ${(user?.failedLoginAttempts || 0) > 0 ? 'text-red-500' : 'text-green-600'}`}>
                {user?.failedLoginAttempts || 0}
            </span>
                                    </div>
                                </div>
                            </InfoCard>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                            {/* Account Information */}
                            <InfoCard icon={FaUser} title="Account Information" iconColor="text-accent" showInfoBadge={false}>
                                <div className="space-y-2 mt-2">
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">Email</span>
                                        <span className="font-medium">{user?.email || '—'}</span>
                                    </div>
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">Display Name</span>
                                        <span className="font-medium">{user?.name || user?.displayName || '—'}</span>
                                    </div>
                                    {user?.title && (
                                        <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                            <span className="text-gray-500">Title</span>
                                            <span className="font-medium italic">{user.title}</span>
                                        </div>
                                    )}
                                    {user?.company && (
                                        <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                            <span className="text-gray-500">Company</span>
                                            <span className="font-medium">{user.company}</span>
                                        </div>
                                    )}
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">Role</span>
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                {user?.role || 'User'}
            </span>
                                    </div>
                                    <div className="bg-white/30 rounded-lg px-3 py-2 flex justify-between text-xs">
                                        <span className="text-gray-500">Phone</span>
                                        <span className="font-medium">{user?.phone || '—'}</span>
                                    </div>
                                </div>
                                {user?.bio && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <span className="text-xs text-gray-500">Bio</span>
                                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">{user.bio}</p>
                                    </div>
                                )}
                            </InfoCard>
                        </motion.div>
                    </div>

                    {/* Row 2: Password Change + Permissions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                            <InfoCard icon={FaLock} title="Change Password" iconColor="text-primary" showInfoBadge={false}>
                                <form onSubmit={handlePasswordChange} className="space-y-4 mt-3">
                                    <div className="relative">
                                        <label className="block text-xs text-gray-500 mb-1">Current Password</label>
                                        <div className="relative">
                                            <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
                                                   className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" />
                                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                                {showCurrent ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-xs text-gray-500 mb-1">New Password</label>
                                        <div className="relative">
                                            <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                                                   className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10" />
                                            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                                {showNew ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
                                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                                               className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/60 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    {status !== 'idle' && (
                                        <div className={`p-3 rounded-lg text-sm ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {status === 'success' && <FaCheckCircle className="inline mr-1" />}{message}
                                        </div>
                                    )}
                                    <button type="submit" disabled={status === 'loading'}
                                            className="w-full py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:from-accent hover:to-primary transition-all disabled:opacity-50">
                                        {status === 'loading' ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </InfoCard>
                        </motion.div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                            <InfoCard icon={FaUserShield} title="Permissions & Access" iconColor="text-primary" showInfoBadge={false}>
                                <div className="space-y-2 mt-3">
                                    {[
                                        { label: 'Dashboard & Analytics', roles: ['OWNER', 'MANAGER', 'INVESTOR'] },
                                        { label: 'Farm Operations', roles: ['OWNER', 'MANAGER'] },
                                        { label: 'Financial Reports', roles: ['OWNER', 'MANAGER', 'INVESTOR'] },
                                        { label: 'Supplier & Batch Management', roles: ['OWNER', 'MANAGER'] },
                                        { label: 'User Management', roles: ['OWNER'] },
                                    ].map((perm, i) => {
                                        const hasAccess = perm.roles.includes(user?.role || '');
                                        return (
                                            <div key={i} className="flex items-center justify-between bg-white/30 rounded-lg px-3 py-2 text-sm">
                                                <span>{perm.label}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${hasAccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {hasAccess ? <FaCheckCircle className="inline mr-1" /> : <FaTimesCircle className="inline mr-1" />}
                                                    {hasAccess ? 'Access' : 'Restricted'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </InfoCard>
                        </motion.div>
                    </div>

                    {/* Row 3: Account Activity (full width) */}
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <InfoCard icon={FaHistory} title="Account Activity" iconColor="text-blue-500" showInfoBadge={false}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-xs text-gray-500 mb-1">Account Created</div>
                                    <div className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
                                </div>
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-xs text-gray-500 mb-1">Last Password Change</div>
                                    <div className="font-medium">Today</div>
                                </div>
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-xs text-gray-500 mb-1">Current Session</div>
                                    <div className="font-medium">{new Date().toLocaleTimeString()}</div>
                                </div>
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default Settings;