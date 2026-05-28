import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { FaUniversalAccess, FaTextHeight, FaAlignLeft, FaTimes, FaUnderline } from 'react-icons/fa';
import { TbLetterSpacing } from 'react-icons/tb';
import { motion } from 'framer-motion';

type AccessibilitySettings = {
  fontSize: number;
  letterSpacing: boolean;
  lineHeight: boolean;
  textUnderline: boolean;
};

const AccessibilityToolbar = () => {
  const { t } = useTranslation('home');
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 80,
    letterSpacing: false,
    lineHeight: false,
    textUnderline: false
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    } else {
      if (window.innerWidth >= 1024) {
        document.documentElement.style.fontSize = '100%';
      } else {
        document.documentElement.style.fontSize = '80%';
      }
    }

    return () => {
      document.documentElement.style.fontSize = '';
      document.documentElement.style.removeProperty('--letter-spacing');
      document.documentElement.style.removeProperty('--word-spacing');
      document.documentElement.style.removeProperty('--line-height');
      document.documentElement.style.removeProperty('--link-underline');
      document.documentElement.style.removeProperty('--link-underline-offset');
    };
  }, []);

  const applySettings = (newSettings: AccessibilitySettings) => {
    document.documentElement.style.fontSize = `${newSettings.fontSize}%`;

    if (newSettings.letterSpacing) {
      document.documentElement.style.setProperty('--letter-spacing', '0.12em');
      document.documentElement.style.setProperty('--word-spacing', '0.16em');
    } else {
      document.documentElement.style.removeProperty('--letter-spacing');
      document.documentElement.style.removeProperty('--word-spacing');
    }

    if (newSettings.lineHeight) {
      document.documentElement.style.setProperty('--line-height', '1.8');
    } else {
      document.documentElement.style.removeProperty('--line-height');
    }

    if (newSettings.textUnderline) {
      document.documentElement.style.setProperty('--link-underline', 'underline');
      document.documentElement.style.setProperty('--link-underline-offset', '0.2em');
    } else {
      document.documentElement.style.removeProperty('--link-underline');
      document.documentElement.style.removeProperty('--link-underline-offset');
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    applySettings(updatedSettings);
    localStorage.setItem('accessibilitySettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 80,
      letterSpacing: false,
      lineHeight: false,
      textUnderline: false
    };
    updateSettings(defaultSettings);
  };

  return (
      <>
        {/* Floating Toggle Button */}
        <motion.button
            className="fixed right-0 top-[30%] z-[9999] w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white rounded-l-lg shadow-xl transform-gpu focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 border-2 border-white/20"
            style={{ transformStyle: 'preserve-3d' }}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={isOpen ? t('accessibility.close') : t('accessibility.open')}
            whileHover={{ scale: 1.08, boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)' }}
            whileTap={{ scale: 0.96 }}
        >
          <div className="absolute inset-0 rounded-l-lg border border-white/30 transform-gpu translate-z-[-4px]" />
          <div className="absolute inset-0 rounded-l-lg bg-gradient-to-b from-white/20 to-transparent opacity-50" />
          <div className="relative z-10">
            {isOpen ? <FaTimes className="text-xl" /> : <FaUniversalAccess className="text-xl" />}
          </div>
        </motion.button>

        {/* Toolbar Panel */}
        {isOpen && (
            <motion.div
                className="fixed right-0 top-[calc(30%+48px)] z-[9998] w-56 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl rounded-l-lg shadow-2xl border-2 border-white/20 transform-gpu overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 110, damping: 18 }}
                role="region"
                aria-label={t('accessibility.toolbar')}
            >
              <div className="absolute inset-0 rounded-l-lg border-2 border-white/30 transform-gpu translate-z-[-6px]" />
              <div className="absolute inset-0 rounded-l-lg bg-gradient-to-b from-white/15 to-transparent opacity-40" />
              <div className="absolute inset-0 rounded-l-lg shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)]" />
              <div className="absolute inset-0 rounded-l-lg bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-10" />

              <div className="relative z-10 p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-gray-800">{t('accessibility.title')}</h2>
                  <motion.button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-xs text-primary hover:text-accent focus:outline-none px-2 py-1 rounded"
                      aria-expanded={isExpanded}
                      whileHover={{ y: -1 }}
                  >
                    {isExpanded ? t('accessibility.showLess') : t('accessibility.showMore')}
                  </motion.button>
                </div>

                {/* Font Size */}
                <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="flex items-center text-xs text-gray-700">
                    <FaTextHeight className="mr-2" /> {t('accessibility.textSize')}
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <motion.button
                        onClick={() => updateSettings({ fontSize: Math.max(80, settings.fontSize - 10) })}
                        className="w-7 h-7 flex items-center justify-center bg-white/80 text-gray-800 rounded-lg border border-gray-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={settings.fontSize <= 80}
                        whileHover={{ y: -1 }}
                    >A-</motion.button>
                    <span className="text-xs w-8 text-center text-gray-800 font-medium">{settings.fontSize}%</span>
                    <motion.button
                        onClick={() => updateSettings({ fontSize: Math.min(150, settings.fontSize + 10) })}
                        className="w-7 h-7 flex items-center justify-center bg-white/80 text-gray-800 rounded-lg border border-gray-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={settings.fontSize >= 150}
                        whileHover={{ y: -1 }}
                    >A+</motion.button>
                  </div>
                </motion.div>

                {/* Expanded Controls */}
                {isExpanded && (
                    <motion.div className="mt-4 pt-4 border-t border-gray-200/50 space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                      {[
                        { key: 'letterSpacing', icon: TbLetterSpacing, label: t('accessibility.letterSpacing') },
                        { key: 'lineHeight', icon: FaAlignLeft, label: t('accessibility.lineHeight') },
                        { key: 'textUnderline', icon: FaUnderline, label: t('accessibility.linkUnderline') },
                      ].map((item) => (
                          <motion.button
                              key={item.key}
                              onClick={() => updateSettings({ [item.key]: !settings[item.key as keyof AccessibilitySettings] } as any)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs ${
                                  settings[item.key as keyof AccessibilitySettings]
                                      ? 'bg-primary/20 text-primary border border-primary/30'
                                      : 'bg-white/80 text-gray-800 border border-gray-200'
                              } hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary`}
                              aria-pressed={!!settings[item.key as keyof AccessibilitySettings]}
                              whileHover={{ y: -1 }}
                          >
                            <span className="flex items-center"><item.icon className="mr-2" />{item.label}</span>
                            {settings[item.key as keyof AccessibilitySettings] ? t('accessibility.on') : t('accessibility.off')}
                          </motion.button>
                      ))}
                    </motion.div>
                )}

                {/* Reset Button */}
                <motion.div className="mt-4 pt-3 border-t border-gray-200/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <motion.button
                      onClick={resetSettings}
                      className="w-full py-2 text-xs text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200"
                      whileHover={{ y: -1 }}
                  >{t('accessibility.reset')}</motion.button>
                </motion.div>

                {/* Accessibility Statement Link */}
                <motion.div className="mt-2 text-[10px] text-center text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  <a href="/accessibility" className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded">{t('accessibility.statement')}</a>
                </motion.div>
              </div>
            </motion.div>
        )}
      </>
  );
};

export default AccessibilityToolbar;