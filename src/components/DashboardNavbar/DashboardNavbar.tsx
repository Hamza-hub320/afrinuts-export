import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaTachometerAlt, FaBorderAll, FaClipboardList, FaChartPie, FaChartBar
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const DashboardNavbar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [navbarHeight, setNavbarHeight] = useState(80);

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

    useEffect(() => {
        const updatePosition = () => {
            const allNavs = document.querySelectorAll('nav.fixed');
            const mainNav = Array.from(allNavs).find(
                nav => nav instanceof HTMLElement &&
                    parseInt(getComputedStyle(nav).zIndex) === 50
            );

            if (mainNav && mainNav.getBoundingClientRect().height > 0) {
                // Main navbar is present — position below it
                const rect = mainNav.getBoundingClientRect();
                setNavbarHeight(rect.bottom + 4);
            } else {
                // No main navbar (dashboard pages) — use top-4 equivalent
                setNavbarHeight(16); // 16px = top-4
            }
        };

        updatePosition();

        const timers = [50, 200, 500].map(delay => setTimeout(updatePosition, delay));

        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
            timers.forEach(clearTimeout);
        };
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard', sub: 'Overview' },
        { path: '/dashboard/blocks', icon: FaBorderAll, label: 'Map', sub: 'Farm grid' },
        { path: '/dashboard/tasks', icon: FaClipboardList, label: 'Tasks', sub: 'Operations' },
        { path: '/dashboard/financials', icon: FaChartPie, label: 'Financials', sub: 'Reports' },
        { path: '/investor', icon: FaChartBar, label: 'Investor', sub: 'View Portal' },
    ];

    return (
        <nav
            ref={menuRef}
            className="fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-full max-w-full sm:max-w-[95vw] sm:w-auto px-3 sm:px-0"
            style={{
                top: `${navbarHeight}px`,
                position: 'fixed'
            }}
        >
            <div className={`relative bg-white/60 backdrop-blur-md border-2 border-white/40 shadow-lg mx-auto transition-all duration-300 rounded-2xl ${
                scrolled ? 'shadow-xl bg-white/80 backdrop-blur-lg scale-[0.97]' : ''
            }`}>
                {/* Desktop: pill shape */}
                <div className="hidden sm:flex justify-center items-center min-h-[48px] py-1 px-4 gap-1">
                    {navLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                isActive(link.path)
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-600 hover:bg-white/60 hover:text-primary'
                            }`}
                        >
                            <link.icon size={16} />
                            <span>{link.label}</span>
                        </button>
                    ))}

                    {/* Role & Logout — desktop */}
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/30">
                    <span className="text-xs text-gray-400 bg-white/40 backdrop-blur-sm px-2 py-1 rounded-full">
                        {user?.role || 'User'}
                    </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-sm text-gray-400 hover:text-red-500 hover:bg-white/50 transition-all"
                            title="Logout"
                        >
                            <FaSignOutAlt size={12} />
                        </button>
                    </div>
                </div>

                {/* Mobile: stacked layout like main navbar */}
                <div className="sm:hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors whitespace-nowrap mr-2"
                        >
                            <FaTachometerAlt size={18} className="text-primary" />
                            <span>Dashboard</span>
                        </button>
                        <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 bg-white/40 backdrop-blur-sm px-2 py-1 rounded-full">
                            {user?.role || 'User'}
                        </span>
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-white/60 transition-colors"
                                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                            >
                                {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                            </button>
                        </div>
                    </div>

                    {mobileOpen && (
                        <div className="pb-4 px-4 space-y-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => {
                                        navigate(link.path);
                                        setMobileOpen(false);
                                    }}
                                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                        isActive(link.path)
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-white/60'
                                    }`}
                                >
                                    <link.icon size={18} />
                                    <div className="text-left">
                                        <span className="block">{link.label}</span>
                                        <span className="text-xs opacity-70">{link.sub}</span>
                                    </div>
                                </button>
                            ))}
                            <div className="pt-2 border-t border-gray-200/50">
                                <button
                                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-base text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <FaSignOutAlt size={18} />
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