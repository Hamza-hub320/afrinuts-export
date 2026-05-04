import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMap, FaTasks, FaChartLine, FaDollarSign, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const DashboardNavbar: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [navbarHeight, setNavbarHeight] = useState(92);

    // Measure the main navbar height on mount and resize
    useEffect(() => {
        const measureNavbar = () => {
            const mainNav = document.querySelector('nav.fixed');
            if (mainNav) {
                const height = mainNav.getBoundingClientRect().height;
                setNavbarHeight(height + 8); // 8px for the top-2 gap
            }
        };

        // Measure immediately
        measureNavbar();

        // Measure after a short delay (for images to load)
        const timer = setTimeout(measureNavbar, 500);

        // Measure on resize
        window.addEventListener('resize', measureNavbar);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', measureNavbar);
        };
    }, []);

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

    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { path: '/dashboard/blocks', icon: FaMap, label: 'Block Map', sub: 'Farm grid' },
        { path: '/dashboard/tasks', icon: FaTasks, label: 'Tasks', sub: 'Operations' },
        { path: '/dashboard/financials', icon: FaChartLine, label: 'Financials', sub: 'Reports' },
        { path: '/investor', icon: FaDollarSign, label: 'Investor Portal', sub: 'View-only' },
    ];

    return (
        <nav
            ref={menuRef}
            className="fixed top-[92px] left-1/2 -translate-x-1/2 z-40 transition-all duration-300 w-auto"
            style={{ top: `${navbarHeight}px` }}
        >
            <div className={`relative bg-white/60 backdrop-blur-md border-2 border-white/40 shadow-lg mx-auto px-2 transition-all duration-300 ${
                mobileOpen ? 'rounded-3xl' : 'rounded-full'
            } ${scrolled && !mobileOpen ? 'shadow-xl bg-white/80 backdrop-blur-lg scale-[0.97]' : ''}`}>
                <div className="flex justify-center items-center h-12 px-4 gap-1">
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
                            <span className="hidden md:inline">{link.label}</span>
                        </button>
                    ))}

                    {/* Role & Logout — desktop */}
                    <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-white/30">
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

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="sm:hidden ml-2 p-2 rounded-full text-gray-600 hover:text-primary hover:bg-white/60 transition-colors"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="sm:hidden pb-4 px-4 space-y-1 bg-transparent">
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
                        <div className="pt-2 border-t border-gray-200">
                            <span className="block px-4 py-2 text-xs text-gray-400">{user?.role || 'User'}</span>
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
        </nav>
    );
};

export default DashboardNavbar;