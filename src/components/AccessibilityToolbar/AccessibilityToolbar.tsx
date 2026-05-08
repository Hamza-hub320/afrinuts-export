import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import {
  FaUniversalAccess,
  FaSun,
  FaMoon,
  FaTextHeight,
  FaAlignLeft,
  FaTimes,
  FaUnderline
} from 'react-icons/fa';
import { RiContrastFill } from 'react-icons/ri';
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
      if (window.innerWidth >= 1024) {
        // Laptop or larger screens: default 90%
        document.documentElement.style.fontSize = `100%`;
      } else {
        // Mobile devices: default 80%
        document.documentElement.style.fontSize = `80%`;
      }
    }
  }, []);

  // Add this new useEffect after the existing ones
  useEffect(() => {
    // Load and apply saved settings on mount
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    }

    // Cleanup: reset only font-related properties when leaving
    return () => {
      document.documentElement.style.fontSize = '';
      document.documentElement.style.removeProperty('--letter-spacing');
      document.documentElement.style.removeProperty('--word-spacing');
      document.documentElement.style.removeProperty('--line-height');
      document.documentElement.style.removeProperty('--link-underline');
      document.documentElement.style.removeProperty('--link-underline-offset');
    };
  }, []);

  // Apply settings to document
  const applySettings = (newSettings: AccessibilitySettings) => {

    const publicLayout = document.querySelector('main');

    // Font size - only for public pages
    if (publicLayout && !window.location.pathname.startsWith('/dashboard') && !window.location.pathname.startsWith('/investor')) {
      document.documentElement.style.fontSize = `${newSettings.fontSize}%`;
    }
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
          bg-gradient-to-br from-primary to-accent text-white
          rounded-l-lg shadow-xl transform-gpu
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
          border-2 border-white/20
        `}
            style={{
              transformStyle: 'preserve-3d',
            }}
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
            whileHover={{
              scale: 1.08,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            }}
            whileTap={{ scale: 0.96 }}
        >
          {/* 3D edge effect */}
          <div className="absolute inset-0 rounded-l-lg border border-white/30 transform-gpu translate-z-[-4px] hover:translate-z-[-6px] transition-all duration-300" />

          {/* Glassy overlay */}
          <div className="absolute inset-0 rounded-l-lg bg-gradient-to-b from-white/20 to-transparent opacity-50" />

          <div className="relative z-10">
            {isOpen ? (
                <FaTimes className="text-xl"/>
            ) : (
                <>
                  <FaUniversalAccess className="text-xl"/>
                </>
            )}
          </div>
        </motion.button>

        {/* Toolbar Panel */}
        {isOpen && (
            <motion.div
                className={`
            fixed right-0 top-[30%] z-[9998]
            bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-800/95 dark:to-gray-900/95 
            shadow-2xl rounded-l-lg transform-gpu
            border-2 border-white/20
            backdrop-blur-xl
            high-contrast:border-2 high-contrast:border-primary
          `}
                style={{
                  transformStyle: 'preserve-3d',
                }}
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
              {/* 3D edge effect */}
              <div className="absolute inset-0 rounded-l-lg border-2 border-white/30 transform-gpu translate-z-[-6px] transition-all duration-500" />

              {/* Glassy overlay */}
              <div className="absolute inset-0 rounded-l-lg bg-gradient-to-b from-white/15 to-transparent opacity-40 transition-opacity duration-500" />

              {/* Inner shadow effect */}
              <div className="absolute inset-0 rounded-l-lg shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] transition-shadow duration-500" />

              {/* Subtle background pattern */}
              <div className="absolute inset-0 rounded-l-lg bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-10" />

              <div className="relative z-10 p-4 w-64 high-contrast:bg-secondary high-contrast:text-text-dark">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white high-contrast:text-primary">
                    {t('accessibility.title')}
                  </h2>
                  <motion.button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-sm text-primary hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 transform-gpu hover:scale-105 transition-all duration-200 high-contrast:text-accent"
                      aria-expanded={isExpanded}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    {isExpanded ? t('accessibility.showLess') : t('accessibility.showMore')}
                  </motion.button>
                </div>

                {/* Basic Controls */}
                <div className="space-y-3">
                  {/* Font Size */}
                  <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="fontSize"
                           className="flex items-center text-sm text-gray-700 dark:text-gray-300 high-contrast:text-text-dark">
                      <FaTextHeight className="mr-2"/> {t('accessibility.textSize')}
                    </label>
                    <div className="flex items-center space-x-2">
                      <motion.button
                          onClick={() => updateSettings({fontSize: Math.max(80, settings.fontSize - 10)})}
                          className="w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transform-gpu hover:scale-110 transition-all duration-200 high-contrast:bg-primary high-contrast:text-white high-contrast:border-2 high-contrast:border-accent backdrop-blur-sm"
                          aria-label={t('accessibility.decreaseFont')}
                          disabled={settings.fontSize <= 80}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.9 }}
                      >
                        A-
                      </motion.button>
                      <span className="text-xs w-8 text-center text-gray-800 dark:text-white high-contrast:text-text-dark font-medium">
                          {settings.fontSize}%
                        </span>
                      <motion.button
                          onClick={() => updateSettings({fontSize: Math.min(150, settings.fontSize + 10)})}
                          className="w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transform-gpu hover:scale-110 transition-all duration-200 high-contrast:bg-primary high-contrast:text-white high-contrast:border-2 high-contrast:border-accent backdrop-blur-sm"
                          aria-label={t('accessibility.increaseFont')}
                          disabled={settings.fontSize >= 150}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.9 }}
                      >
                        A+
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* High Contrast */}
                  <motion.button
                      onClick={() => updateSettings({highContrast: !settings.highContrast})}
                      className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg
                  ${settings.highContrast ? 'bg-accent/20 text-accent-dark border border-accent/30' : 'bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'}
                  hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                  high-contrast:border-2 high-contrast:border-accent transform-gpu hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm
                `}
                      aria-pressed={settings.highContrast}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                  >
                <span className="flex items-center">
                  <RiContrastFill className="mr-2"/> {t('accessibility.highContrast')}
                </span>
                    {settings.highContrast ? t('accessibility.on') : t('accessibility.off')}
                  </motion.button>

                  {/* Dark Mode */}
                  <motion.button
                      onClick={() => updateSettings({darkMode: !settings.darkMode})}
                      className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg
                  ${settings.darkMode ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'}
                  hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                  high-contrast:border-2 high-contrast:border-accent transform-gpu hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm
                `}
                      aria-pressed={settings.darkMode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                  >
                <span className="flex items-center">
                  {settings.darkMode ? <FaSun className="mr-2"/> : <FaMoon className="mr-2"/>}
                  {t('accessibility.darkMode')}
                </span>
                    {settings.darkMode ? t('accessibility.on') : t('accessibility.off')}
                  </motion.button>
                </div>

                {/* Expanded Controls */}
                {isExpanded && (
                    <motion.div
                        className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 high-contrast:border-t-2 high-contrast:border-primary space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                      {/* Letter Spacing */}
                      <motion.button
                          onClick={() => updateSettings({letterSpacing: !settings.letterSpacing})}
                          className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg
                    ${settings.letterSpacing ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'}
                    hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                    high-contrast:border-2 high-contrast:border-accent transform-gpu hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm
                  `}
                          aria-pressed={settings.letterSpacing}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                      >
                  <span className="flex items-center">
                    <TbLetterSpacing className="mr-2"/> {t('accessibility.letterSpacing')}
                  </span>
                        {settings.letterSpacing ? t('accessibility.on') : t('accessibility.off')}
                      </motion.button>

                      {/* Line Height */}
                      <motion.button
                          onClick={() => updateSettings({lineHeight: !settings.lineHeight})}
                          className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg
                    ${settings.lineHeight ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'}
                    hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                    high-contrast:border-2 high-contrast:border-accent transform-gpu hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm
                  `}
                          aria-pressed={settings.lineHeight}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                      >
                  <span className="flex items-center">
                    <FaAlignLeft className="mr-2"/> {t('accessibility.lineHeight')}
                  </span>
                        {settings.lineHeight ? t('accessibility.on') : t('accessibility.off')}
                      </motion.button>

                      {/* Text Underline */}
                      <motion.button
                          onClick={() => updateSettings({textUnderline: !settings.textUnderline})}
                          className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg
                    ${settings.textUnderline ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'}
                    hover:bg-white dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                    high-contrast:border-2 high-contrast:border-accent transform-gpu hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm
                  `}
                          aria-pressed={settings.textUnderline}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                      >
                  <span className="flex items-center">
                    <FaUnderline className="mr-2"/> {t('accessibility.linkUnderline')}
                  </span>
                        {settings.textUnderline ? t('accessibility.on') : t('accessibility.off')}
                      </motion.button>
                    </motion.div>
                )}

                {/* Reset Button */}
                <motion.div
                    className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 high-contrast:border-t-2 high-contrast:border-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                  <motion.button
                      onClick={resetSettings}
                      className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transform-gpu hover:scale-[1.02] transition-all duration-200 high-contrast:text-accent high-contrast:hover:text-primary bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                  >
                    {t('accessibility.reset')}
                  </motion.button>
                </motion.div>

                {/* Accessibility Statement Link */}
                <motion.div
                    className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 high-contrast:text-text-dark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                  <a
                      href="/accessibility"
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded high-contrast:text-accent transform-gpu hover:scale-105 transition-transform duration-200"
                      aria-label={t('accessibility.readStatement')}
                  >
                    {t('accessibility.statement')}
                  </a>
                </motion.div>
              </div>
            </motion.div>
        )}
      </>
  );
};

export default AccessibilityToolbar;