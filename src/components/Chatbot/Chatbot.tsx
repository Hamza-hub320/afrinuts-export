import { FaWhatsapp } from 'react-icons/fa';
import React from 'react';

interface ChatbotProps {
  className?: string;
}

/**
 * Floating WhatsApp button for AfriNuts.
 * Replace <YOUR_NUMBER> with your WhatsApp number, e.g., 1234567890.
 */
const WHATSAPP_NUMBER = '<YOUR_NUMBER>'; // <-- Replace with your WhatsApp number (no + or spaces)
const WHATSAPP_URL = `https://wa.me/${+3854577473}?text=Hello%20AfriNuts`;

const Chatbot: React.FC<ChatbotProps> = ({ className = '' }) => {
  return (
    <button
      className={`fixed bottom-6 right-6 z-50 flex items-center px-4 py-2 rounded-full bg-primary hover:bg-primary text-white shadow-lg transition-colors ${className}`}
      aria-label="Chat on WhatsApp"
      onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
      type="button"
    >
      <div className="flex items-center">
        <FaWhatsapp className="text-2xl" />
        <span className="ml-2 font-medium">Chat with us</span>
      </div>
    </button>
  );
};

export default Chatbot;