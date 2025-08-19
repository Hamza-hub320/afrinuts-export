import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import {
  FaFont,
  FaEye,
  FaUniversalAccess,
  FaSun,
  FaMoon,
  FaTextHeight,
  FaAlignLeft,
  FaTimes,
  FaUnderline
} from 'react-icons/fa';
import { RiContrastFill } from 'react-icons/ri';
import { IoTextSharp } from 'react-icons/io5';
import { TbLetterSpacing } from 'react-icons/tb';
import { motion } from 'framer-motion';

type AccessibilitySettings = {
  fontSize: number;
  highContrast: boolean;
  darkMode: boolean;
  letterSpacing: boolean;
  lineHeight: boolean;
  textUnderline: boolean;
};

const AccessibilityToolbar = () => {
  const { t } = useTranslation('home');
  // Initialize state with default settings
  const [settings, setSettings] = useState<AccessibilitySettings>(() => ({
    fontSize: 80,
    highContrast: false,
    darkMode: false,
    letterSpacing: false,
    lineHeight: false,
    textUnderline: false
  }));

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    } else {
      // No saved settings: apply default font size immediately on first load
      document.documentElement.style.fontSize = `80%`;
    }
  }, []);

  // Apply settings to document
  const applySettings = (newSettings: AccessibilitySettings) => {
    // Font size
    document.documentElement.style.fontSize = `${newSettings.fontSize}%`;

    // High contrast (uses your existing CSS layer)
    if (newSettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Dark mode
    if (newSettings.darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }

    // Letter spacing
    if (newSettings.letterSpacing) {
      document.documentElement.style.setProperty('--letter-spacing', '0.12em');
      document.documentElement.style.setProperty('--word-spacing', '0.16em');
    } else {
      document.documentElement.style.removeProperty('--letter-spacing');
      document.documentElement.style.removeProperty('--word-spacing');
    }

    // Line height
    if (newSettings.lineHeight) {
      document.documentElement.style.setProperty('--line-height', '1.8');
    } else {
      document.documentElement.style.removeProperty('--line-height');
    }

    // Text underline
    if (newSettings.textUnderline) {
      document.documentElement.style.setProperty('--link-underline', 'underline');
      document.documentElement.style.setProperty('--link-underline-offset', '0.2em');
    } else {
      document.documentElement.style.removeProperty('--link-underline');
      document.documentElement.style.removeProperty('--link-underline-offset');
    }
  };

  // Update settings
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = {...settings, ...newSettings};
    setSettings(updatedSettings);
    applySettings(updatedSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(updatedSettings));
  };

  // Reset all settings to default
  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 80,
      highContrast: false,
      darkMode: false,
      letterSpacing: false,
      lineHeight: false,
      textUnderline: false
    };
    updateSettings(defaultSettings);
  };

  // Reduce animation after first interaction
  useEffect(() => {
    if (isOpen) setHasInteracted(true);
  }, [isOpen]);

  return (
      <>
        {/* Floating Toggle Button */}
        <motion.button
            className={`
          fixed right-0 top-[30%] z-[9999]
          w-12 h-12 flex items-center justify-center
          bg-primary hover:bg-primary-dark text-white
          rounded-l-lg shadow-xl
          focus:outline-none focus:ring-2 focus:ring-accent
          border-2 border-white/20
        `}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? t('accessibility.close') : t('accessibility.open')}
            initial={{ y: '-50%', x: 0, scale: 1 }}
            animate={{
              y: '-50%',
              x: 0,
              scale: 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 20
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
        >
          {isOpen ? (
              <FaTimes className="text-xl"/>
          ) : (
              <>
                <FaUniversalAccess className="text-xl"/>
                <motion.span
                    className="absolute -left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap"
                    initial={{opacity: 0, x: -10}}
                    animate={{opacity: 1, x: -40}}
                    transition={{delay: 0.3}}
                >
                  {t('accessibility.title')}
                </motion.span>
              </>
          )}
        </motion.button>

        {/* Toolbar Panel */}
        {isOpen && (
            <motion.div
                className={`
            fixed right-0 top-[30%]
            bg-white dark:bg-gray-800 shadow-xl rounded-l-lg
            transition-all duration-300 ease-in-out z-[9998]
            border border-gray-200 dark:border-gray-700
            high-contrast:border-2 high-contrast:border-primary
          `}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                  type: 'spring',
                  stiffness: 110,
                  damping: 18
                }}
                role="region"
                aria-label={t('accessibility.toolbar')}
            >
              <div className="p-4 w-64 high-contrast:bg-secondary high-contrast:text-text-dark">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white high-contrast:text-primary">
                    {t('accessibility.title')}
                  </h2>
                  <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-sm text-primary hover:underline focus:outline-none high-contrast:text-accent"
                      aria-expanded={isExpanded}
                  >
                    {isExpanded ? t('accessibility.showLess') : t('accessibility.showMore')}
                  </button>
                </div>

                {/* Basic Controls */}
                <div className="space-y-3">
                  {/* Font Size */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="fontSize"
                           className="flex items-center text-sm text-gray-700 dark:text-gray-300 high-contrast:text-text-dark">
                      <FaTextHeight className="mr-2"/> {t('accessibility.textSize')}
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                          onClick={() => updateSettings({fontSize: Math.max(80, settings.fontSize - 10)})}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary high-contrast:bg-primary high-contrast:text-white high-contrast:border-2 high-contrast:border-accent"
                          aria-label={t('accessibility.decreaseFont')}
                          disabled={settings.fontSize <= 80}
                      >
                        A-
                      </button>
                      <span className="text-xs w-8 text-center text-white dark:text-white high-contrast:text-text-dark">
                          {settings.fontSize}%
                        </span>
                      <button
                          onClick={() => updateSettings({fontSize: Math.min(150, settings.fontSize + 10)})}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary high-contrast:bg-primary high-contrast:text-white high-contrast:border-2 high-contrast:border-accent"
                          aria-label={t('accessibility.increaseFont')}
                          disabled={settings.fontSize >= 150}
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* High Contrast */}
                  <button
                      onClick={() => updateSettings({highContrast: !settings.highContrast})}
                      className={`
                  w-full flex items-center justify-between px-3 py-2 rounded
                  ${settings.highContrast ? 'bg-accent text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                  hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                  high-contrast:border-2 high-contrast:border-accent
                `}
                      aria-pressed={settings.highContrast}
                  >
                <span className="flex items-center">
                  <RiContrastFill className="mr-2"/> {t('accessibility.highContrast')}
                </span>
                    {settings.highContrast ? t('accessibility.on') : t('accessibility.off')}
                  </button>

                  {/* Dark Mode */}
                  <button
                      onClick={() => updateSettings({darkMode: !settings.darkMode})}
                      className={`
                  w-full flex items-center justify-between px-3 py-2 rounded
                  ${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                  hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                  high-contrast:border-2 high-contrast:border-accent
                `}
                      aria-pressed={settings.darkMode}
                  >
                <span className="flex items-center">
                  {settings.darkMode ? <FaSun className="mr-2"/> : <FaMoon className="mr-2"/>}
                  {t('accessibility.darkMode')}
                </span>
                    {settings.darkMode ? t('accessibility.on') : t('accessibility.off')}
                  </button>
                </div>

                {/* Expanded Controls */}
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 high-contrast:border-t-2 high-contrast:border-primary space-y-3">
                      {/* Letter Spacing */}
                      <button
                          onClick={() => updateSettings({letterSpacing: !settings.letterSpacing})}
                          className={`
                    w-full flex items-center justify-between px-3 py-2 rounded
                    ${settings.letterSpacing ? 'bg-primary/10 text-primary dark:text-primary-light' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                    hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                    high-contrast:border-2 high-contrast:border-accent
                  `}
                          aria-pressed={settings.letterSpacing}
                      >
                  <span className="flex items-center">
                    <TbLetterSpacing className="mr-2"/> {t('accessibility.letterSpacing')}
                  </span>
                        {settings.letterSpacing ? t('accessibility.on') : t('accessibility.off')}
                      </button>

                      {/* Line Height */}
                      <button
                          onClick={() => updateSettings({lineHeight: !settings.lineHeight})}
                          className={`
                    w-full flex items-center justify-between px-3 py-2 rounded
                    ${settings.lineHeight ? 'bg-primary/10 text-primary dark:text-primary-light' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                    hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                    high-contrast:border-2 high-contrast:border-accent
                  `}
                          aria-pressed={settings.lineHeight}
                      >
                  <span className="flex items-center">
                    <FaAlignLeft className="mr-2"/> {t('accessibility.lineHeight')}
                  </span>
                        {settings.lineHeight ? t('accessibility.on') : t('accessibility.off')}
                      </button>

                      {/* Text Underline */}
                      <button
                          onClick={() => updateSettings({textUnderline: !settings.textUnderline})}
                          className={`
                    w-full flex items-center justify-between px-3 py-2 rounded
                    ${settings.textUnderline ? 'bg-primary/10 text-primary dark:text-primary-light' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}
                    hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                    high-contrast:border-2 high-contrast:border-accent
                  `}
                          aria-pressed={settings.textUnderline}
                      >
                  <span className="flex items-center">
                    <FaUnderline className="mr-2"/> {t('accessibility.linkUnderline')}
                  </span>
                        {settings.textUnderline ? t('accessibility.on') : t('accessibility.off')}
                      </button>
                    </div>
                )}

                {/* Reset Button */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 high-contrast:border-t-2 high-contrast:border-primary">
                  <button
                      onClick={resetSettings}
                      className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-primary rounded high-contrast:text-accent high-contrast:hover:text-primary"
                  >
                    {t('accessibility.reset')}
                  </button>
                </div>

                {/* Accessibility Statement Link */}
                <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 high-contrast:text-text-dark">
                  <a
                      href="/accessibility"
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded high-contrast:text-accent"
                      aria-label={t('accessibility.readStatement')}
                  >
                    {t('accessibility.statement')}
                  </a>
                </div>
              </div>
            </motion.div>
        )}
      </>
  );
};

export default AccessibilityToolbar;