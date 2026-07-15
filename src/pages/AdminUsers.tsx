import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaUserPlus, FaUserShield, FaUserSlash, FaCrown, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { auth } from '../services/firebase';

interface UserRecord {
    uid: string;
    email: string;
    displayName: string;
    role: string;
    disabled: boolean;
    lastSignIn: string;
    createdAt: string;
}

const ROLES = ['OWNER', 'MANAGER', 'INVESTOR'];

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchUsers = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await fetch('/.netlify/functions/manageUsers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ action: 'listUsers' }),
            });
            const data = await response.json();
            if (data.users) setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (uid: string, role: string) => {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch('/.netlify/functions/manageUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ action: 'setRole', uid, role }),
        });
        const data = await response.json();
        if (data.success) {
            setMessage(`Role updated to ${role}`);
            fetchUsers();
        }
    };

    const handleToggleUser = async (uid: string, disable: boolean) => {
        const token = await auth.currentUser?.getIdToken();
        const response = await fetch('/.netlify/functions/manageUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ action: disable ? 'disableUser' : 'enableUser', uid }),
        });
        const data = await response.json();
        if (data.success) {
            setMessage(disable ? 'User disabled' : 'User enabled');
            fetchUsers();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-[72px]">
                <DashboardNavbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            <Section className="flex items-center justify-center text-center min-h-[40vh] relative">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-12" initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaUserShield className="inline mr-3 text-accent" />
                            Admin Panel
                        </Typography>
                    </motion.div>
                    <motion.h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight" variants={fadeIn} style={{ letterSpacing: '-0.03em' }}>
                        User Management
                    </motion.h1>
                </motion.div>
            </Section>

            <Section className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {message && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                            <FaCheckCircle /> {message}
                            <button onClick={() => setMessage('')} className="ml-auto"><FaTimes className="text-xs" /></button>
                        </div>
                    )}

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <InfoCard icon={FaUsers} title={`Users (${users.length})`} iconColor="text-accent" showInfoBadge={false}>
                            <div className="overflow-x-auto mt-3">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-gray-200 text-left">
                                        <th className="pb-2 font-medium text-gray-600">User</th>
                                        <th className="pb-2 font-medium text-gray-600">Role</th>
                                        <th className="pb-2 font-medium text-gray-600">Status</th>
                                        <th className="pb-2 font-medium text-gray-600">Last Sign In</th>
                                        <th className="pb-2 font-medium text-gray-600">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map(user => (
                                        <tr key={user.uid} className="border-b border-gray-100 last:border-0 hover:bg-white/20">
                                            <td className="py-2">
                                                <div className="font-medium">{user.displayName || '—'}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="py-2">
                                                <select
                                                    value={user.role}
                                                    onChange={e => handleRoleChange(user.uid, e.target.value)}
                                                    className="px-2 py-1 rounded-lg border border-gray-300 bg-white/60 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                                >
                                                    {ROLES.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.disabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                        {user.disabled ? 'Disabled' : 'Active'}
                                                    </span>
                                            </td>
                                            <td className="py-2 text-xs text-gray-500">
                                                {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Never'}
                                            </td>
                                            <td className="py-2">
                                                <button
                                                    onClick={() => handleToggleUser(user.uid, !user.disabled)}
                                                    className={`px-2 py-1 rounded text-xs font-medium ${user.disabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'} transition-colors`}
                                                >
                                                    {user.disabled ? 'Enable' : 'Disable'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default AdminUsers;