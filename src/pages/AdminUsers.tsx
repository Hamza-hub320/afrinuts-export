import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaUserPlus,
    FaUserShield,
    FaUserSlash,
    FaCrown,
    FaCheckCircle,
    FaTimes,
    FaHistory, FaUser
} from 'react-icons/fa';
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
    title?: string;
    lastLoginDevice?: string;
    company?: string;
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

            {/* Hero */}
            <Section className="flex items-center justify-center text-center min-h-[30vh] relative">
                <motion.div className="max-w-4xl px-6 sm:px-8 py-8" initial="hidden" animate="visible" variants={staggerContainer}>
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
                {/* Toast Message */}
                {message && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm flex items-center gap-2">
                        <FaCheckCircle /> {message}
                        <button onClick={() => setMessage('')} className="ml-auto"><FaTimes className="text-xs" /></button>
                    </div>
                )}

                {/* KPI Stats Row */}
                <motion.div className="grid grid-cols-3 gap-4 mb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                    <motion.div variants={fadeIn}><InfoCard icon={FaUsers} title={String(users.length)} subtitle="Total Users" iconColor="text-accent" showInfoBadge={false} /></motion.div>
                    <motion.div variants={fadeIn} transition={{ delay: 0.1 }}><InfoCard icon={FaCrown} title={String(users.filter(u => u.role === 'OWNER').length)} subtitle="Owners" iconColor="text-yellow-500" showInfoBadge={false} /></motion.div>
                    <motion.div variants={fadeIn} transition={{ delay: 0.2 }}><InfoCard icon={FaUserSlash} title={String(users.filter(u => u.disabled).length)} subtitle="Disabled" iconColor="text-red-500" showInfoBadge={false} /></motion.div>
                </motion.div>

                {/* Role Distribution + Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InfoCard icon={FaUserShield} title="Role Distribution" iconColor="text-primary" showInfoBadge={false}>
                        <div className="space-y-3 mt-3">
                            {[
                                { role: 'OWNER', icon: FaCrown, color: 'text-yellow-500', bar: 'bg-yellow-500' },
                                { role: 'MANAGER', icon: FaUserShield, color: 'text-blue-500', bar: 'bg-blue-500' },
                                { role: 'INVESTOR', icon: FaUser, color: 'text-gray-500', bar: 'bg-gray-400' },
                            ].map(({ role, icon: Icon, color, bar }) => {
                                const count = users.filter(u => u.role === role).length;
                                const pct = users.length > 0 ? (count / users.length) * 100 : 0;
                                return (
                                    <div key={role}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="flex items-center gap-1"><Icon className={color} /> {role}</span>
                                            <span className="font-medium">{count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <motion.div className={`${bar} h-2.5 rounded-full`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </InfoCard>

                    <InfoCard icon={FaHistory} title="Recent Activity" iconColor="text-blue-500" showInfoBadge={false}>
                        <div className="space-y-2 mt-3">
                            {users.filter(u => u.lastSignIn).sort((a, b) => new Date(b.lastSignIn).getTime() - new Date(a.lastSignIn).getTime()).slice(0, 5).map(user => (
                                <div key={user.uid} className="flex items-center justify-between bg-white/30 rounded-lg px-3 py-2 text-sm">
                                    <span className="font-medium truncate">{user.displayName || user.email}</span>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`px-1.5 py-0.5 rounded-full ${user.role === 'OWNER' ? 'bg-yellow-100 text-yellow-700' : user.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                                        <span className="text-gray-500">{new Date(user.lastSignIn).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                            {users.filter(u => u.lastSignIn).length === 0 && <p className="text-center text-gray-400 text-sm py-4">No recent activity</p>}
                        </div>
                    </InfoCard>
                </div>

                {/* User Table */}
                <InfoCard icon={FaUsers} title={`All Users (${users.length})`} iconColor="text-accent" showInfoBadge={false}>
                    {users.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <FaUsers className="text-3xl mx-auto mb-2" />
                            <Typography variant="small">No users found</Typography>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto mt-3">
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
                                        <tr key={user.uid} className="border-b border-gray-100 last:border-0 hover:bg-white/20 transition-colors">
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                        user.role === 'OWNER' ? 'bg-yellow-100' :
                                                            user.role === 'MANAGER' ? 'bg-blue-100' : 'bg-gray-100'
                                                    }`}>
                                                        {user.role === 'OWNER' ? (
                                                            <FaCrown className="text-yellow-600 text-sm" />
                                                        ) : user.role === 'MANAGER' ? (
                                                            <FaUserShield className="text-blue-600 text-sm" />
                                                        ) : (
                                                            <FaUser className="text-gray-500 text-sm" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.displayName || '—'}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                        {user.title && <div className="text-[10px] text-gray-500 italic">{user.title}</div>}
                                                        {user.company && <div className="text-[10px] text-gray-400">{user.company}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <select value={user.role} onChange={e => handleRoleChange(user.uid, e.target.value)}
                                                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                                            user.role === 'OWNER' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                                user.role === 'MANAGER' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                                    'bg-gray-50 border-gray-200 text-gray-600'
                                                        }`}>
                                                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                                </select>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${user.disabled ? 'bg-red-400' : 'bg-green-400'}`} />
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.disabled ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                        {user.disabled ? 'Disabled' : 'Active'}
                                    </span>
                                                </div>
                                                {user.disabled && (
                                                    <div className="text-[10px] text-gray-400 mt-0.5">Account deactivated</div>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                {user.lastSignIn ? (
                                                    <div>
                                                        <div className="text-xs font-medium text-gray-700">
                                                            {new Date(user.lastSignIn).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(user.lastSignIn).toLocaleTimeString('en-US', {
                                                                hour: '2-digit', minute: '2-digit'
                                                            })}
                                                        </div>
                                                        {user.lastLoginDevice && (
                                                            <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[140px]" title={user.lastLoginDevice}>
                                                                {user.lastLoginDevice}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Never signed in</span>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleToggleUser(user.uid, !user.disabled)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-sm ${
                                                                user.disabled
                                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                                                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                                            }`}>
                                                        {user.disabled ? 'Enable' : 'Disable'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3 mt-3">
                                {users.map(user => (
                                    <motion.div
                                        key={user.uid}
                                        className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                                        whileHover={{ y: -1 }}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                user.role === 'OWNER' ? 'bg-yellow-100' :
                                                    user.role === 'MANAGER' ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}>
                                                {user.role === 'OWNER' ? <FaCrown className="text-yellow-600 text-sm" /> :
                                                    user.role === 'MANAGER' ? <FaUserShield className="text-blue-600 text-sm" /> :
                                                        <FaUser className="text-gray-500 text-sm" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 truncate">{user.displayName || '—'}</div>
                                                <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                                {user.title && <div className="text-[10px] text-gray-400">{user.title}</div>}
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.disabled ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                {user.disabled ? 'Disabled' : 'Active'}
                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="text-gray-500">Role</span>
                                                <select value={user.role} onChange={e => handleRoleChange(user.uid, e.target.value)}
                                                        className="mt-1 w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-white/60 text-xs focus:outline-none focus:ring-1 focus:ring-primary">
                                                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Last Sign In</span>
                                                <div className="mt-1 font-medium">
                                                    {user.lastSignIn
                                                        ? new Date(user.lastSignIn).toLocaleDateString()
                                                        : <span className="text-gray-400 italic">Never</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <button onClick={() => handleToggleUser(user.uid, !user.disabled)}
                                                    className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
                                                        user.disabled
                                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                    }`}>
                                                {user.disabled ? 'Enable Account' : 'Disable Account'}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </InfoCard>
            </div>
        </div>
    );
};

export default AdminUsers;