import React, { useState, useEffect } from 'react';
import { FaFont, FaEye, FaUniversalAccess } from 'react-icons/fa';
import styles from './AccessibilityToolbar.module.css';

const AccessibilityToolbar = () => {
  const [fontSize, setFontSize] = useState<number>(100);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibilityFontSize');
    const savedContrast = localStorage.getItem('highContrastMode');

    if (savedFontSize) {
      const size = Number(savedFontSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }

    if (savedContrast === 'true') {
      setHighContrast(true);
      document.body.classList.add(styles['high-contrast']);
    }
  }, []);

  const updateFontSize = (newSize: number) => {
    const clampedSize = Math.max(80, Math.min(newSize, 150));
    setFontSize(clampedSize);
    document.documentElement.style.fontSize = `${clampedSize}%`;
    localStorage.setItem('accessibilityFontSize', clampedSize.toString());
  };

  const toggleContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    document.body.classList.toggle(styles['high-contrast']);
    localStorage.setItem('highContrastMode', newContrast.toString());
  };

  return (
      <div className={`${styles['accessibility-toolbar']} ${isOpen ? styles.open : ''}`}>
        <button
            className={styles['toolbar-toggle']}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close accessibility toolbar" : "Open accessibility toolbar"}
        >
          <FaUniversalAccess />
        </button>

        {isOpen && (
            <div className={styles['toolbar-options']}>
              <div className={styles['font-controls']}>
                <button
                    onClick={() => updateFontSize(fontSize - 10)}
                    aria-label="Decrease font size"
                    disabled={fontSize <= 80}
                >
                  <FaFont /> A-
                </button>
                <span className={styles['font-size-display']}>{fontSize}%</span>
                <button
                    onClick={() => updateFontSize(fontSize + 10)}
                    aria-label="Increase font size"
                    disabled={fontSize >= 150}
                >
                  <FaFont /> A+
                </button>
              </div>

              <button
                  onClick={toggleContrast}
                  className={highContrast ? styles.active : ''}
                  aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
              >
                <FaEye /> High Contrast
              </button>
            </div>
        )}
      </div>
  );
};

export default AccessibilityToolbar;