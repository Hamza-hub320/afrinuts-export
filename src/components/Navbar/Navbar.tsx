import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import logo from '@/assets/images/afrinuts-export-official-logo.png';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const [click, setClick] = useState<boolean>(false);
  const [languageLabel, setLanguageLabel] = useState<string>('');

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
      <nav className="fixed top-3 left-3 right-3 z-50">
        <div className="border border-gray-300 rounded-2xl bg-white shadow-lg mx-auto max-w-7xl">
          <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
                <img
                    src={logo}
                    alt="AfriNuts Export Logo"
                    className="h-8 w-auto"
                />
                <span className="ml-2 text-xl font-bold text-primary">
                AfriNuts Export
              </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                  onClick={handleClick}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
                  aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {click ? (
                    <FaTimes className="block h-6 w-6" />
                ) : (
                    <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navItems.map((item, index) => (
                  <Link
                      key={index}
                      to={item.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive(item.path)
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                      }`}
                  >
                    {item.label}
                  </Link>
              ))}
            </div>

            {/* Language Toggle */}
            <div className="hidden md:flex items-center ml-4">
              <button
                  onClick={toggleLanguage}
                  className="flex items-center text-gray-700 hover:text-primary p-2 rounded-lg hover:bg-gray-100"
              >
                <FaGlobe className="mr-1" />
                <span>{languageLabel}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`${click ? 'block' : 'hidden'} md:hidden pb-3 px-4`}>
            <div className="space-y-1">
              {navItems.map((item, index) => (
                  <Link
                      key={index}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2 rounded-lg text-base font-medium ${
                          isActive(item.path)
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                      }`}
                  >
                    {item.label}
                  </Link>
              ))}
              <div className="pt-2">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100 w-full"
                >
                  <FaGlobe className="mr-2" />
                  <span>{languageLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;