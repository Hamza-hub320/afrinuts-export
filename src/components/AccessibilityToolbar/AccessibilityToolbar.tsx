import React, { useState, useEffect } from 'react';
import { FaFont, FaEye, FaUniversalAccess } from 'react-icons/fa';

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
      document.body.classList.add('high-contrast');
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
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrastMode', newContrast.toString());
  };

  return (
      <div className={`
      fixed right-0 top-1/2 transform -translate-y-1/2
      bg-primary text-white shadow-lg rounded-l-lg
      transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'}
      z-50
    `}>
        <button
            className={`
          w-10 h-10 flex items-center justify-center
          bg-primary hover:bg-dark-orange text-white
          rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent
        `}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close accessibility toolbar" : "Open accessibility toolbar"}
        >
          <FaUniversalAccess className="text-xl" />
        </button>

        {isOpen && (
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <button
                    className={`
                w-10 h-10 flex items-center justify-center
                bg-secondary hover:bg-olive text-white
                rounded focus:outline-none focus:ring-2 focus:ring-accent
                ${fontSize <= 80 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
                    onClick={() => updateFontSize(fontSize - 10)}
                    aria-label="Decrease font size"
                    disabled={fontSize <= 80}
                >
                  <FaFont /> A-
                </button>
                <span className="text-sm font-medium w-12 text-center">{fontSize}%</span>
                <button
                    className={`
                w-10 h-10 flex items-center justify-center
                bg-secondary hover:bg-olive text-white
                rounded focus:outline-none focus:ring-2 focus:ring-accent
                ${fontSize >= 150 ? 'opacity-50 cursor-not-allowed' : ''}
              `}
                    onClick={() => updateFontSize(fontSize + 10)}
                    aria-label="Increase font size"
                    disabled={fontSize >= 150}
                >
                  <FaFont /> A+
                </button>
              </div>

              <button
                  onClick={toggleContrast}
                  className={`
              w-full flex items-center justify-center space-x-2
              px-4 py-2 rounded
              ${highContrast ? 'bg-accent text-white' : 'bg-secondary text-white hover:bg-olive'}
              focus:outline-none focus:ring-2 focus:ring-accent
            `}
                  aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
              >
                <FaEye /> <span>High Contrast</span>
              </button>
            </div>
        )}
      </div>
  );
};

export default AccessibilityToolbar;