import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaGlobe,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaBox,
  FaCertificate,
  FaIndustry,
  FaQuestionCircle,
  FaPenFancy, FaGlobeAfrica, FaDrawPolygon
} from 'react-icons/fa';
import logo from '@/assets/images/afrinuts-export-official-logo.webp';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import {GiCardboardBox, GiEarthAfricaEurope, GiFactory, GiFarmer, GiFruitBowl, GiPeanut} from 'react-icons/gi';

type LanguageConfig = {
  code: string;
  label: string;
  dir?: 'ltr' | 'rtl';
};

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const [click, setClick] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState<boolean>(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState<boolean>(false);
  const [farmDropdownOpen, setFarmDropdownOpen] = useState<boolean>(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState<boolean>(false);
  const [newsDropdownOpen, setNewsDropdownOpen] = useState<boolean>(false);
  const newsDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const desktopLanguageDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const farmDropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const languages: LanguageConfig[] = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'fr', label: 'Français', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node) &&
          desktopLanguageDropdownRef.current && !desktopLanguageDropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
      if (farmDropdownRef.current && !farmDropdownRef.current.contains(event.target as Node)) {
        setFarmDropdownOpen(false);
      }
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
      if (newsDropdownRef.current && !newsDropdownRef.current.contains(event.target as Node)) {
        setNewsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (langCode: string) => {
    const selectedLang = languages.find(lang => lang.code === langCode);
    if (selectedLang) {
      i18n.changeLanguage(langCode).then(() => {
        document.documentElement.lang = langCode;
        document.documentElement.dir = selectedLang.dir || 'ltr';
        localStorage.setItem('i18nextLng', langCode);
      });
    }
    setLanguageDropdownOpen(false);
  };

  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';

    // About dropdown still exists — highlight for all subpages
    if (path === '/about') {
      return ['/about', '/executive-team', '/about/our-story', '/sustainability', '/vision']
          .some(p => location.pathname === p);
    }

    // Everything else — exact match (standalone pages)
    return location.pathname === path;
  };

  // Primary Nav (Audience)
  const primaryNavItems = [
    {
      path: '/about',
      label: t('navbar.about'),
      dropdown: [
        { path: '/about', label: t('navbar.about_overview') },
        { path: '/executive-team', label: t('navbar.executive_team') },
        { path: '/about/our-story', label: t('navbar.our_story') },
        { path: '/sustainability', label: t('navbar.sustainability') },
        { path: '/vision', label: t('navbar.vision') },
      ]
    },
    { path: '/wholesale', label: t('navbar.wholesale', 'Wholesale') },
    { path: '/invest', label: t('navbar.invest', 'Invest') },
    { path: '/partners', label: t('navbar.partners', 'Partners') },
    { path: '/community', label: t('navbar.community', 'Community') },
    { path: '/contact', label: t('navbar.contact') },
  ];

  // Secondary Nav (Capability)
  const secondaryNavItems = [
    { path: '/trace', label: t('navbar.trace', 'Trace'), icon: FaSearch },
    { path: '/products', label: t('navbar.products', 'Products'), icon: GiPeanut},
    { path: '/certifications', label: t('navbar.certifications', 'Certs'), icon: FaCertificate },
    { path: '/processing', label: t('navbar.processing', 'Processing'), icon: GiFactory },
    { path: '/processing/facility-flowchart', label: t('navbar.facility_flowchart', 'Facility'), icon: FaDrawPolygon },
    { path: '/farm', label: t('navbar.farm', 'Farm'), icon:  GiFarmer },
    { path: '/blog', label: t('navbar.blog', 'Blog'), icon: FaPenFancy },
    { path: '/news', label: t('navbar.news', 'News'), icon: GiEarthAfricaEurope},
    { path: '/faq', label: t('navbar.faq', 'FAQ'), icon: FaQuestionCircle },
  ];

  const closeMobileMenu = () => {
    setClick(false);
    setAboutDropdownOpen(false);
    setFarmDropdownOpen(false);
    setProductsDropdownOpen(false);
    setNewsDropdownOpen(false);
    document.body.classList.remove('overflow-hidden');
  };

  const toggleLanguageDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLanguageDropdownOpen(!languageDropdownOpen);
    setAboutDropdownOpen(false);
    setFarmDropdownOpen(false);
    setProductsDropdownOpen(false);
  };

  const toggleAboutDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAboutDropdownOpen(!aboutDropdownOpen);
    setLanguageDropdownOpen(false);
    setFarmDropdownOpen(false);
    setProductsDropdownOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const navRef = useRef<HTMLElement>(null);

  return (
      <nav ref={navRef} className={`fixed top-2 left-2 right-2 z-50 transition-all duration-300 ${scrolled ? 'scale-[0.98]' : ''}`}>
        {/* Primary Navbar */}
        <div className={`relative z-30 bg-white/70 backdrop-blur-md border-2 border-white/40 rounded-2xl shadow-lg mx-auto max-w-7xl transition-all duration-300 ${scrolled ? 'shadow-xl bg-white/85 backdrop-blur-lg' : ''}`}>
          <div className="flex justify-between items-center h-14 px-3 sm:px-4 lg:px-5">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center group" onClick={closeMobileMenu}>
                <img src={logo} alt="AfriNuts Export Logo" width={102} height={102}
                     className="h-10 w-auto md:h-12 transition-transform duration-300 group-hover:scale-105"
                     loading="eager" decoding="sync" />
                <span className="ml-2 text-xl font-bold text-primary group-hover:text-dark-orange transition-colors duration-300">AfriNuts</span>
              </Link>
            </div>

            {/* Primary Nav Links */}
            <div className="hidden md:flex items-center gap-0.5">
              {primaryNavItems.map((item, index) => {
                if (item.dropdown) {
                  return (
                      <div key={index} className="relative" ref={aboutDropdownRef}>
                        <button type="button" onClick={toggleAboutDropdown}
                                className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                                    isActive(item.path) ? 'bg-primary text-white shadow-md' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}>
                          {item.label}
                          {aboutDropdownOpen ? <FaChevronUp className="ml-1 text-xs" /> : <FaChevronDown className="ml-1 text-xs" />}
                        </button>
                        {aboutDropdownOpen && (
                            <div className="absolute left-0 mt-1.5 w-44 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-[100] border border-white/30 overflow-hidden">
                              {item.dropdown.map((dropdownItem, idx) => (
                                  <Link key={idx} to={dropdownItem.path} onClick={(e) => { e.stopPropagation(); setAboutDropdownOpen(false); }}
                                        className={`block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${isActive(dropdownItem.path) ? 'bg-gray-100 font-medium' : ''}`}>
                                    {dropdownItem.label}
                                  </Link>
                              ))}
                            </div>
                        )}
                      </div>
                  );
                }
                return (
                    <Link key={index} to={item.path}
                          className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                              isActive(item.path) ? 'bg-primary text-white shadow-md' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}
                          onClick={() => { if (isActive(item.path)) window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                      {item.label}
                    </Link>
                );
              })}

              {/* Language + Login */}
              <div className="relative ml-1" ref={desktopLanguageDropdownRef}>
                <button onClick={toggleLanguageDropdown}
                        className="flex items-center text-gray-700 hover:text-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Language selection" aria-expanded={languageDropdownOpen}>
                  <FaGlobe className="mr-1 text-xs" />
                  <span className="font-medium text-sm">{currentLanguage.code.toUpperCase()}</span>
                  {languageDropdownOpen ? <FaChevronUp className="ml-0.5 text-xs" /> : <FaChevronDown className="ml-0.5 text-xs" />}
                </button>
                {languageDropdownOpen && (
                    <div className={`absolute ${i18n.language === 'ar' ? 'left-0' : 'right-0'} mt-1.5 w-36 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl z-[100] border border-white/30 overflow-hidden`}>
                      {languages.map((lang) => (
                          <button key={lang.code} onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code); }}
                                  className={`block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${i18n.language === lang.code ? 'bg-gray-100 font-medium' : ''}`}>
                            {lang.label}
                          </button>
                      ))}
                    </div>
                )}
              </div>

              {user ? (
                  <button onClick={() => logout()} className="flex items-center text-gray-700 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-0.5" title="Logout">
                    <FaSignOutAlt size={16} />
                  </button>
              ) : (
                  <Link to="/login" className="flex items-center text-gray-700 hover:text-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-0.5" title="Login">
                    <FaUserCircle size={16} />
                  </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center space-x-3">
              <div className="relative" ref={languageDropdownRef}>
                <button onClick={toggleLanguageDropdown} className="flex items-center text-gray-700 p-1.5 rounded-lg transition-colors"
                        aria-label="Language selection" aria-expanded={languageDropdownOpen}>
                  <FaGlobe className="mr-1 text-sm" /><span className="font-medium text-sm">{currentLanguage.code.toUpperCase()}</span>
                </button>
                {languageDropdownOpen && (
                    <div className={`absolute ${i18n.language === 'ar' ? 'left-0' : 'right-0'} mt-1.5 w-36 bg-white rounded-xl shadow-lg z-50 border border-gray-200`}>
                      {languages.map((lang) => (
                          <button key={lang.code} onClick={(e) => { e.stopPropagation(); changeLanguage(lang.code); }}
                                  className={`block w-full text-left px-3 py-2 text-sm text-text-dark hover:bg-gray-100 ${i18n.language === lang.code ? 'bg-gray-100 font-medium' : ''}`}>
                            {lang.label}
                          </button>
                      ))}
                    </div>
                )}
              </div>
              <button onClick={() => { setClick(!click); document.body.classList.toggle('overflow-hidden', !click); }}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                      aria-expanded={click} aria-label={click ? "Close menu" : "Open menu"}>
                {click ? <FaTimes className="block h-5 w-5" /> : <FaBars className="block h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`${click ? 'block' : 'hidden'} md:hidden pb-3 px-4 overflow-y-auto max-h-[70vh]`}>
            <div className="space-y-0.5">
              {[...primaryNavItems, ...secondaryNavItems].map((item: any) => (
                  <React.Fragment key={item.path}>
                    {!item.dropdown ? (
                        <Link to={item.path} onClick={closeMobileMenu}
                              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${location.pathname === item.path ? 'bg-primary text-white font-bold' : 'text-gray-700'}`}>
                          {item.icon && <item.icon className="inline mr-2 text-xs" />}{item.label}
                        </Link>
                    ) : (
                        item.dropdown.map((subItem: any) => (
                            <Link key={subItem.path} to={subItem.path} onClick={closeMobileMenu}
                                  className={`block px-5 py-2 rounded-lg text-sm font-medium ${location.pathname === subItem.path ? 'bg-primary text-white font-bold' : 'text-gray-700'}`}>
                              {subItem.label}
                            </Link>
                        ))
                    )}
                  </React.Fragment>
              ))}
              {user ? (
                  <button onClick={() => { logout(); closeMobileMenu(); }}
                          className="block px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 w-full text-left">Logout</button>
              ) : (
                  <Link to="/login" onClick={closeMobileMenu} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700">Login</Link>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navbar - Capability Focused */}
        <div className="hidden md:block relative mx-auto max-w-7xl mt-1.5">
          <div className="bg-white/50 backdrop-blur-md border border-white/30 rounded-xl shadow-sm px-3 py-1.5 flex items-center justify-center gap-1 flex-wrap">
            {secondaryNavItems.map((item, idx) => (
                <Link key={idx} to={item.path}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                          isActive(item.path) ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-white/60 hover:text-primary'}`}>
                  <item.icon className="text-[10px]" />
                  {item.label}
                </Link>
            ))}
          </div>
        </div>
      </nav>
  );
};

export default Navbar;