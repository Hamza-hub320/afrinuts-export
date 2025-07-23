import React, { useState, useEffect } from 'react';
import { FaFont, FaEye, FaUniversalAccess } from 'react-icons/fa';

const AccessibilityToolbar = () => {
  // Initialize state with a function to check device type
  const [fontSize, setFontSize] = useState<number>(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window !== 'undefined') {
      // Check if the screen is mobile/tablet size (768px is common breakpoint for tablets)
      return window.innerWidth < 1024 ? 80 : 90;
    }
    return 80; // Default fallback
  });

  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibilityFontSize');
    const savedContrast = localStorage.getItem('highContrastMode');

    if (savedFontSize) {
      const size = Number(savedFontSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    } else {
      // Apply the default size based on device if no saved value exists
      const defaultSize = window.innerWidth < 1024 ? 80 : 90;
      document.documentElement.style.fontSize = `${defaultSize}%`;
    }

    if (savedContrast === 'true') {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const updateFontSize = (newSize: number) => {
    const clampedSize = Math.max(80, Math.min(newSize, 100));
    setFontSize(clampedSize);
    document.documentElement.style.fontSize = `${clampedSize}%`;
    localStorage.setItem('accessibilityFontSize', clampedSize.toString());
  };

  const toggleContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    document.documentElement.classList.toggle('high-contrast');
    localStorage.setItem('highContrastMode', newContrast.toString());
  };

  return (
      <div className={`
      fixed right-0 top-1/2 transform -translate-y-1/2
      bg-navy text-white shadow-lg rounded-l-lg
      transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'}
      z-50
    `}>
        <button
            className={`
          w-10 h-10 flex items-center justify-center
          bg-navy hover:bg-dark-orange text-white
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
                bg-olive hover:bg-green-900 text-white
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
                bg-olive hover:bg-green-900 text-white
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
              ${highContrast ? 'bg-accent text-white' : 'bg-olive text-white hover:bg-green-900'}
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