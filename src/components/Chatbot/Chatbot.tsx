import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface FloatingButtonsProps {
    className?: string;
}

const WHATSAPP_NUMBER = '3854577473';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20AfriNuts`;

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ className = '' }) => {
    return (
        <div className={`fixed bottom-20 left-6 z-50 flex flex-col items-start space-y-3 ${className}`}>
            {/* WhatsApp Button */}
            <button
                className="flex items-center px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-colors"
                aria-label="Chat on WhatsApp"
                onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
                type="button"
            >
                <FaWhatsapp className="text-2xl" />
                <span className="ml-2 font-medium">Chat with us</span>
            </button>

            {/* Contact Us Button */}
            <Link
                to="/contact"
                className="flex items-center px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors"
                aria-label="Go to Contact Page"
            >
                Contact Us
            </Link>
        </div>
    );
};

export default FloatingButtons;