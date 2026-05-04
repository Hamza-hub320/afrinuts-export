import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGlobe, FaBars, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import logo from '@/assets/images/afrinuts-export-official-logo.webp';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

// Type for language configuration
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
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const desktopLanguageDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const farmDropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Language configuration
  const languages: LanguageConfig[] = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'fr', label: 'Français', dir: 'ltr' },
    { code: 'ar', label: 'العربية', dir: 'rtl' }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
          languageDropdownRef.current &&
          !languageDropdownRef.current.contains(event.target as Node) &&
          desktopLanguageDropdownRef.current &&
          !desktopLanguageDropdownRef.current.contains(event.target as Node)
      ) {
        setLanguageDropdownOpen(false);
      }

      if (
          aboutDropdownRef.current &&
          !aboutDropdownRef.current.contains(event.target as Node)
      ) {
        setAboutDropdownOpen(false);
      }

      if (
          farmDropdownRef.current &&
          !farmDropdownRef.current.contains(event.target as Node)
      ) {
        setFarmDropdownOpen(false);
      }

      if (
          productsDropdownRef.current &&
          !productsDropdownRef.current.contains(event.target as Node)
      ) {
        setProductsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
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
    // Exact match for home
    if (path === '/') return location.pathname === '/';

    // Treat About link as active for any of its subpages including Executive Team or History
    if (path === '/about') {
      return ['/about', '/executive-team', '/about/our-story']
          .some(p => location.pathname === p);
    }

    // Treat Products link as active for any of its subpages including Certifications
    if (path === '/products') {
      return ['/products', '/certifications']
          .some(p => location.pathname === p);
    }

    // Farm and its subpages — ADD THIS BLOCK
    if (path === '/farm') {
      return ['/farm', '/processing', '/processing/facility-flowchart']
          .some(p => location.pathname === p);
    }

    // Default: highlight if the current path starts with the link path
    return location.pathname === path;
  };

  const navItems: { path: string; label: string; dropdown?: { path: string; label: string }[] }[] = [
    {
      path: '/about',
      label: t('navbar.about'),
      dropdown: [
        { path: '/about', label: t('navbar.about_overview') },
        { path: '/executive-team', label: t('navbar.executive_team') },
        { path: '/about/our-story', label: t('navbar.our_story') }
      ]
    },
    {
      path: '/products',
      label: t('navbar.products'),
      dropdown: [
        { path: '/products', label: t('navbar.products_overview') },
        { path: '/certifications', label: t('navbar.certifications') }
      ]
    },
    {
      path: '/farm',
      label: t('navbar.farm'),
      dropdown: [
        { path: '/farm', label: t('navbar.farm') },
        { path: '/processing', label: t('navbar.processing') },
        { path: '/processing/facility-flowchart', label: t('navbar.facility_flowchart') }
      ]
    },
    { path: '/sustainability', label: t('navbar.sustainability') },
    { path: '/vision', label: t('navbar.vision') },
    { path: '/contact', label: t('navbar.contact') },
    { path: '/trace', label: t('navbar.trace') },
    { path: '/news', label: t('navbar.news') },
    { path: '/faq', label: t('navbar.faq') },
  ];

  const handleClick = (): void => {
    setClick(!click);
    document.body.classList.toggle('overflow-hidden', !click);
  };

  const closeMobileMenu = (): void => {
    setClick(false);
    setAboutDropdownOpen(false);
    setFarmDropdownOpen(false);
    setProductsDropdownOpen(false);
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

  const toggleProductsDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProductsDropdownOpen(!productsDropdownOpen);
    setLanguageDropdownOpen(false);
    setAboutDropdownOpen(false);
    setFarmDropdownOpen(false);
  };

  const toggleFarmDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFarmDropdownOpen(!farmDropdownOpen);
    setLanguageDropdownOpen(false);
    setAboutDropdownOpen(false);
    setProductsDropdownOpen(false);
  };

  const handleAboutClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setAboutDropdownOpen(false);
    navigate(path);
    closeMobileMenu();
  };

  const handleProductsClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setProductsDropdownOpen(false);
    navigate(path);
    closeMobileMenu();
  };

  const handleFarmClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setFarmDropdownOpen(false);
    navigate(path);
    closeMobileMenu();
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
      <nav className={`fixed top-2 left-3 right-3 z-50 transition-all duration-300 ${scrolled ? 'scale-[0.98]' : ''}`}>
        <div className={`relative bg-white/60 backdrop-blur-md border-2 border-white/40 rounded-2xl shadow-lg mx-auto max-w-7xl transition-all duration-300 ${scrolled ? 'shadow-xl bg-white/80 backdrop-blur-lg' : ''}`}>
          <div className="flex justify-between items-center h-20 px-3 sm:px-4 lg:px-6">

            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                  to="/"
                  className="flex items-center group"
                  onClick={closeMobileMenu}
              >
                <img
                    src={logo}
                    alt="AfriNuts Export Logo"
                    width={64}
                    height={64}
                    className="h-12 w-auto md:h-16 transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
                    decoding="sync"
                />
                <span className="ml-2 text-2xl font-bold text-primary group-hover:text-dark-orange transition-colors duration-300">
                AfriNuts
              </span>
              </Link>
            </div>

            {/* Desktop Navigation and Language Toggle */}
            <div className="hidden md:flex items-center gap-0">
              {/* Navigation Links */}
              {navItems.map((item, index) => {
                if (item.dropdown) {
                  if (item.path === '/about') {
                    return (
                        <div key={index} className="relative" ref={aboutDropdownRef}>
                          <button type="button"
                                  onClick={toggleAboutDropdown}
                                  className={`px-4 py-2 rounded-lg text-lg font-medium. transition-all duration-300 flex items-center ${
                                      isActive(item.path)
                                          ? 'bg-primary text-white shadow-md'
                                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary hover:shadow-sm'
                                  }`}
                          >
                            {item.label}
                            {aboutDropdownOpen ? (
                                <FaChevronUp className="ml-1" />
                            ) : (
                                <FaChevronDown className="ml-1" />
                            )}
                          </button>
                          {aboutDropdownOpen && (
                              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                                {item.dropdown.map((dropdownItem, idx) => (
                                    <Link
                                        key={idx}
                                        to={dropdownItem.path}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setAboutDropdownOpen(false);
                                        }}
                                        className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
                                            isActive(dropdownItem.path) ? 'bg-gray-100 font-medium' : ''
                                        }`}
                                    >
                                      {dropdownItem.label}
                                    </Link>
                                ))}
                              </div>
                          )}
                        </div>
                    );
                  }
                  if (item.path === '/products') {
                    return (
                        <div key={index} className="relative" ref={productsDropdownRef}>
                          <button type="button"
                                  onClick={toggleProductsDropdown}
                                  className={`px-4 py-2 rounded-lg text-lg font-medium. transition-all duration-300 flex items-center ${
                                      isActive(item.path)
                                          ? 'bg-primary text-white shadow-md'
                                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary hover:shadow-sm'
                                  }`}
                          >
                            {item.label}
                            {productsDropdownOpen ? (
                                <FaChevronUp className="ml-1" />
                            ) : (
                                <FaChevronDown className="ml-1" />
                            )}
                          </button>
                          {productsDropdownOpen && (
                              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                                {item.dropdown.map((dropdownItem, idx) => (
                                    <Link
                                        key={idx}
                                        to={dropdownItem.path}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setProductsDropdownOpen(false);
                                        }}
                                        className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
                                            isActive(dropdownItem.path) ? 'bg-gray-100 font-medium' : ''
                                        }`}
                                    >
                                      {dropdownItem.label}
                                    </Link>
                                ))}
                              </div>
                          )}
                        </div>
                    );
                  }
                  if (item.path === '/farm') {
                    return (
                        <div key={index} className="relative" ref={farmDropdownRef}>
                          <button type="button"
                                  onClick={toggleFarmDropdown}
                                  className={`px-4 py-2 rounded-lg text-lg font-medium. transition-all duration-300 flex items-center ${
                                      isActive(item.path)
                                          ? 'bg-primary text-white shadow-md'
                                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary hover:shadow-sm'
                                  }`}
                          >
                            {item.label}
                            {farmDropdownOpen ? (
                                <FaChevronUp className="ml-1" />
                            ) : (
                                <FaChevronDown className="ml-1" />
                            )}
                          </button>
                          {farmDropdownOpen && (
                              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                                {item.dropdown.map((dropdownItem, idx) => (
                                    <Link
                                        key={idx}
                                        to={dropdownItem.path}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setFarmDropdownOpen(false);
                                        }}
                                        className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
                                            isActive(dropdownItem.path) ? 'bg-gray-100 font-medium' : ''
                                        }`}
                                    >
                                      {dropdownItem.label}
                                    </Link>
                                ))}
                              </div>
                          )}
                        </div>
                    );
                  }
                  // fallback for other dropdowns if any
                  return null;
                }
                // Not a dropdown
                return (
                    <Link
                        key={index}
                        to={item.path}
                        className={`px-4 py-2 rounded-lg text-lg font-medium. transition-all duration-300 ${
                            isActive(item.path)
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-primary hover:shadow-sm'
                        }`}
                        onClick={() => {
                          if (isActive(item.path)) {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                    >
                      {item.label}
                    </Link>
                );
              })}

              {/* Language Dropdown */}
              <div className="relative ml-2" ref={desktopLanguageDropdownRef}>
                <button
                    onClick={toggleLanguageDropdown}
                    className="flex items-center text-gray-700 hover:text-primary p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                    aria-label="Language selection"
                    aria-expanded={languageDropdownOpen}
                >
                  <FaGlobe className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
                  {languageDropdownOpen ? (
                      <FaChevronUp className="ml-1" />
                  ) : (
                      <FaChevronDown className="ml-1" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {languageDropdownOpen && (
                    <div className={`absolute ${
                        i18n.language === 'ar' ? 'left-0' : 'right-0'
                    } mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200`}>
                      {languages.map((lang) => (
                          <button
                              key={lang.code}
                              onClick={(e) => {
                                e.stopPropagation();
                                changeLanguage(lang.code);
                              }}
                              className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
                                  i18n.language === lang.code ? 'bg-gray-100 font-medium' : ''
                              }`}
                          >
                            {lang.label}
                          </button>
                      ))}
                    </div>
                )}
              </div>

              {/* Login/Logout Button — OUTSIDE the language div */}
              {user ? (
                  <button
                      onClick={() => logout()}
                      className="flex items-center text-gray-700 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 ml-1"
                      title="Logout"
                  >
                    <FaSignOutAlt size={18} />
                  </button>
              ) : (
                  <Link
                      to="/login"
                      className="flex items-center text-gray-700 hover:text-primary p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 ml-1"
                      title="Login"
                  >
                    <FaUserCircle size={20} />
                  </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {/* Language Toggle Button (visible on mobile) */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                    onClick={toggleLanguageDropdown}
                    className="flex items-center text-gray-700 p-2 rounded-lg transition-colors duration-300"
                    aria-label="Language selection"
                    aria-expanded={languageDropdownOpen}
                >
                  <FaGlobe className="mr-1" />
                  <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
                  {languageDropdownOpen ? (
                      <FaChevronUp className="ml-1" />
                  ) : (
                      <FaChevronDown className="ml-1" />
                  )}
                </button>

                {/* Dropdown Menu for Mobile */}
                {languageDropdownOpen && (
                    <div className={`absolute ${
                        i18n.language === 'ar' ? 'left-0' : 'right-0'
                    } mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200`}>
                      {languages.map((lang) => (
                          <button
                              key={lang.code}
                              onClick={(e) => {
                                e.stopPropagation();
                                changeLanguage(lang.code);
                              }}
                              className={`block w-full text-left px-4 py-2 text-text-dark hover:bg-gray-100 transition-colors duration-200 ${
                                  i18n.language === lang.code ? 'bg-gray-100 font-medium' : ''
                              }`}
                          >
                            {lang.label}
                          </button>
                      ))}
                    </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                  onClick={handleClick}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none transition-colors duration-300"
                  aria-expanded={click}
                  aria-label={click ? "Close menu" : "Open menu"}
              >
                {click ? (
                    <FaTimes className="block h-6 w-6" />
                ) : (
                    <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Flat Layout */}
          <div className={`${click ? 'block' : 'hidden'} md:hidden pb-3 px-4`}>
            <div className="space-y-1">
              {navItems.map((item) => (
                  <React.Fragment key={item.path}>
                    {!item.dropdown ? (
                        <Link
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={`block px-3 py-3 rounded-lg text-base font-medium ${
                                location.pathname === item.path ? 'bg-primary text-white font-bold' : 'text-gray-700'
                            }`}
                        >
                          {item.label}
                        </Link>
                    ) : (
                        <>
                          {item.dropdown.map((subItem) => (
                              <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  onClick={closeMobileMenu}
                                  className={`block px-5 py-2 rounded-lg text-base font-medium ${
                                      location.pathname === subItem.path ? 'bg-primary text-white font-bold' : 'text-gray-700'
                                  }`}
                              >
                                {subItem.label}
                              </Link>
                          ))}
                        </>
                    )}
                  </React.Fragment>
              ))}
              {user ? (
                  <button
                      onClick={() => { logout(); closeMobileMenu(); }}
                      className="block px-3 py-3 rounded-lg text-base font-medium text-red-500 w-full text-left"
                  >
                    Logout
                  </button>
              ) : (
                  <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700"
                  >
                    Login
                  </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;