import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaTachometerAlt, FaBorderAll, FaClipboardList, FaChartPie, FaChartBar, FaMobile, FaBox, FaCog, FaUserShield, FaUsers
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { GiFarmer } from "react-icons/gi";

const DashboardNavbar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navbarTop = 16;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    const navLinks = [
        { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
        { path: '/dashboard/blocks', icon: FaBorderAll, label: 'Map' },
        { path: '/dashboard/tasks', icon: FaClipboardList, label: 'Tasks' },
        { path: '/dashboard/financials', icon: FaChartPie, label: 'Financials' },
        { path: '/investor', icon: FaChartBar, label: 'Investor' },
        { path: '/farm-os', icon: FaMobile, label: 'AOS' },
        { path: '/dashboard/suppliers', icon: GiFarmer, label: 'Suppliers' },
        { path: '/dashboard/batches', icon: FaBox, label: 'Batches' },
        { path: '/dashboard/buyers', icon: FaUsers, label: 'Buyers' },
        { path: '/dashboard/settings', icon: FaCog, label: 'Settings' },
        { path: '/dashboard/users', icon: FaUserShield, label: 'Users', roles: ['OWNER'] },
    ];

    const filteredLinks = navLinks.filter(link => !link.roles || link.roles.includes(user?.role || ''));

    return (
        <nav
            ref={menuRef}
            className="fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-full max-w-full sm:max-w-fit sm:w-auto px-3 sm:px-0"
            style={{ top: `${navbarTop}px` }}
        >
            <div className={`relative bg-white/60 backdrop-blur-md border-2 border-white/40 shadow-lg mx-auto transition-all duration-300 rounded-2xl ${
                scrolled ? 'shadow-xl bg-white/80 backdrop-blur-lg scale-[0.97]' : ''
            }`}>
                {/* Desktop: compact pill */}
                <div className="hidden sm:flex justify-center items-center min-h-[44px] py-1 px-2 gap-0.5">
                    {filteredLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            title={link.label}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                                isActive(link.path)
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-500 hover:bg-white/70 hover:text-primary'
                            }`}
                        >
                            <link.icon size={14} />
                            <span>{link.label}</span>
                        </button>
                    ))}

                    {/* Divider + Role + Logout */}
                    <div className="flex items-center gap-1.5 ml-1 pl-1.5 border-l border-gray-200/60">
                        <span className="text-[10px] text-gray-400 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
                            {user?.role || 'User'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-gray-400 hover:text-red-500 hover:bg-white/60 transition-all"
                            title="Logout"
                        >
                            <FaSignOutAlt size={12} />
                        </button>
                    </div>
                </div>

                {/* Mobile */}
                <div className="sm:hidden">
                    <div className="flex items-center justify-between px-4 py-2.5">
                        <button
                            onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                        >
                            <FaTachometerAlt size={16} className="text-primary" />
                            <span>Dashboard</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 bg-white/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                {user?.role || 'User'}
                            </span>
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-1.5 rounded-lg text-gray-600 hover:text-primary hover:bg-white/60 transition-colors"
                                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            >
                                {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
                            </button>
                        </div>
                    </div>

                    {mobileOpen && (
                        <div className="pb-3 px-3 space-y-0.5">
                            {filteredLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => { navigate(link.path); setMobileOpen(false); }}
                                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                        isActive(link.path)
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-white/60'
                                    }`}
                                >
                                    <link.icon size={16} />
                                    <span>{link.label}</span>
                                </button>
                            ))}
                            <div className="pt-2 mt-1 border-t border-gray-200/50">
                                <button
                                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <FaSignOutAlt size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavbar;