import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import logo from '@/assets/images/afrinuts-export-official-logo.png';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const [click, setClick] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [languageLabel, setLanguageLabel] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
    setLanguageLabel(newLang === 'en' ? 'FR' : 'EN');
  };

  useEffect(() => {
    setLanguageLabel(i18n.language === 'en' ? 'FR' : 'EN');
  }, [i18n.language]);

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems: { path: string; label: string }[] = [
    { path: '/about', label: t('navbar.about') },
    { path: '/products', label: t('navbar.products') },
    { path: '/farm', label: t('navbar.farm') },
    { path: '/contact', label: t('navbar.contact') },
  ];

  const handleClick = (): void => {
    setClick(!click);
    document.body.classList.toggle('overflow-hidden', !click);
  };

  const closeMobileMenu = (): void => {
    setClick(false);
    document.body.classList.remove('overflow-hidden');
  };

  return (
      <nav className={`fixed top-3 left-3 right-3 z-50 transition-all duration-300 ${scrolled ? 'scale-[0.98]' : ''}`}>
        <div className={`border border-gray-300 rounded-2xl bg-white shadow-lg mx-auto max-w-7xl transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
          <div className="flex justify-between items-center h-18 px-4 sm:px-6 lg:px-8">
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
                    className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <span className="ml-2 text-2xl font-bold text-primary group-hover:text-dark-orange transition-colors duration-300">
                AfriNuts Export
              </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {navItems.map((item, index) => (
                  <Link
                      key={index}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg text-lg font-medium transition-all duration-300 ${
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
              ))}
            </div>

            {/* Language Toggle */}
            <div className="hidden md:flex items-center ml-2">
              <button
                  onClick={toggleLanguage}
                  className="flex items-center text-gray-700 hover:text-primary p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                  aria-label={`Change language to ${languageLabel}`}
              >
                <FaGlobe className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">{languageLabel}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
              className={`${click ? 'block animate-fadeIn' : 'hidden'} md:hidden pb-3 px-4 transition-all duration-300`}
              aria-hidden={!click}
          >
            <div className="space-y-1">
              {navItems.map((item, index) => (
                  <Link
                      key={index}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-300 ${
                          isActive(item.path)
                              ? 'bg-primary text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                      }`}
                  >
                    {item.label}
                  </Link>
              ))}
              <div className="pt-1">
                <button
                    onClick={() => {
                      toggleLanguage();
                      closeMobileMenu();
                    }}
                    className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100 w-full transition-colors duration-300"
                >
                  <FaGlobe className="mr-3" />
                  <span>{t('navbar.language')}: {languageLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;