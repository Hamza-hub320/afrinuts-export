import { FaWhatsapp } from 'react-icons/fa';
import React from 'react';

interface ChatbotProps {
  className?: string;
}

const WHATSAPP_NUMBER = '<3854577473>';
const WHATSAPP_URL = `https://wa.me/${3854577473}?text=Hello%20AfriNuts`;

const Chatbot: React.FC<ChatbotProps> = ({ className = '' }) => {
  return (
    <button
      className={`fixed bottom-20 right-6 z-50 flex items-center px-4 py-2 rounded-full bg-primary hover:bg-primary text-white shadow-lg transition-colors ${className}`}
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