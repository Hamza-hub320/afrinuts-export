import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import {
    FaLeaf,
    FaSeedling,
    FaChartLine,
    FaHeadset,
    FaPaperPlane,
    FaTimes,
    FaChevronDown,
    FaRobot
} from 'react-icons/fa';
import type { Message } from '@/types/chat';

interface ChatbotProps {
    className?: string;
    initialMessage?: string;
}


const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/chat';
const MAX_INPUT_LENGTH = 500;
const REQUEST_TIMEOUT = 10000;

export default function Chatbot({
                                    className = '',
                                    initialMessage = undefined,
                                }: ChatbotProps) {
    const { t } = useTranslation('chatbot');
    const botInitialMessage = initialMessage ?? t('chatbot.initialMessage');
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem('afrinuts-chat');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            } catch (e) {
                console.error('Failed to parse saved messages', e);
            }
        }
        return [
            { text: botInitialMessage, sender: 'bot', timestamp: new Date() },
        ];
    });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOptions, setShowOptions] = useState(true);
    const [showContactForm, setShowContactForm] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (messages.length > 1) {
            try {
                localStorage.setItem('afrinuts-chat', JSON.stringify(messages));
            } catch (e) {
                console.error('Failed to save messages', e);
            }
        }
    }, [messages]);

    const handleSend = async () => {
        const sanitizedInput = input.trim().slice(0, MAX_INPUT_LENGTH);
        if (!sanitizedInput || isLoading) return;

        const userMessage: Message = {
            text: sanitizedInput,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);
        setShowOptions(false);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: sanitizedInput }),
                signal: controller.signal,
                credentials: 'include' // If you need to send cookies
            });

            if (!response.ok) {
                // Handle specific CORS-related errors
                if (response.status === 0) {
                    // This typically indicates a CORS error
                    throw new Error('Failed to connect to the server. Please check your network and CORS settings.');
                }
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After');
                    throw new Error(
                        retryAfter
                            ? `Please wait ${retryAfter} seconds before trying again`
                            : 'Too many requests. Please wait a moment.'
                    );
                }
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            const botMessage: Message = {
                text: data.reply,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            let errorMessage = 'An unknown error occurred';
            if (err instanceof Error) {
                errorMessage = err.name === 'AbortError'
                    ? 'Request timed out'
                    : err.message;

                // More specific error for CORS issues
                if (err.message.includes('Failed to fetch') || err.message.includes('Access-Control-Allow-Origin')) {
                    errorMessage = 'Connection error. Please ensure the server is running and CORS is properly configured.';
                }
            }
            setError(errorMessage);
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    };

    const quickActions = [
        {
            icon: <FaSeedling className="text-primary" />,
            title: t('chatbot.quickActions.cashewFarming'),
            query: "Tell me about your cashew farming practices"
        },
        {
            icon: <FaChartLine className="text-primary" />,
            title: t('chatbot.quickActions.investments'),
            query: "How can I invest in Afrinuts?"
        },
        {
            icon: <FaLeaf className="text-primary" />,
            title: t('chatbot.quickActions.sustainability'),
            query: "What sustainability practices do you follow?"
        },
        {
            icon: <FaHeadset className="text-primary" />,
            title: t('chatbot.quickActions.contactSales'),
            action: () => setShowContactForm(true)
        }
    ];

    return (
        <div className={`fixed bottom-20 right-6 w-full max-w-[460px] sm:w-[460px] sm:right-6 left-3 sm:left-auto h-[600px] bg-gradient-to-br from-primary/5 to-accent/5  border-2 border-primary/20 hover:border-accent/30 transition-all duration-300  rounded-3xl shadow-xl overflow-hidden flex flex-col ${className}`}>
            {/* Header */}
            <div className="p-4 bg-primary text-background flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        {/* Agriculture-themed icon */}
                        <FaSeedling className="text-background text-lg" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{t('chatbot.header.title')}</h2>
                        <p className="text-sm text-background/90">{t('chatbot.header.subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setMessages([{ text: botInitialMessage, sender: 'bot', timestamp: new Date() }]);
                            setShowOptions(true);
                            setError(null);
                        }}
                        className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                        title={t('chatbot.buttons.resetChatTitle')}
                    >
                        {t('chatbot.buttons.newChat')}
                    </button>
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title={showOptions ? t('chatbot.buttons.hideHelp') : t('chatbot.buttons.showHelp')}
                        aria-label={showOptions ? t('chatbot.buttons.hideHelp') : t('chatbot.buttons.showHelp')}
                    >
                        <FaChevronDown className={`transition-transform ${showOptions ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Welcome/Quick Actions Panel */}
            {showOptions && (
                <div className="p-6 bg-gray-50 border-b">
                    <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">{t('chatbot.quickActions.title')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className="flex flex-col items-center text-center bg-white p-4 rounded-xl border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                                onClick={() => action.action ? action.action() : setInput(action.query)}
                            >
                                <span className="text-2xl mb-2">{action.icon}</span>
                                <span className="text-sm font-medium text-gray-800">{action.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-white space-y-4">
                {messages.length <= 1 && !showOptions && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <FaRobot className="text-primary text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('chatbot.header.title')}</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {t('chatbot.header.subtitle')}
                        </p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                                msg.sender === 'user'
                                    ? 'bg-primary text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                        >
                            <p className="text-base">{msg.text}</p>
                            {!isNaN(new Date(msg.timestamp).getTime()) && (
                                <p className={`text-sm opacity-70 mt-1 ${msg.sender === 'user' ? 'text-white/90' : 'text-gray-700'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                            <div className="flex items-center gap-2 text-sm">
                                <span>{t('chatbot.status.thinking')}</span>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center">
                        <div className="px-4 py-2 rounded-lg bg-red-100 text-red-800 text-sm">
                            {error}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="relative">
                    <label htmlFor="chat-input" className="sr-only">{t('chatbot.input.placeholder')}</label>
                    <input
                        id="chat-input"
                        type="text"
                        aria-label={t('chatbot.input.placeholder')}
                        value={input}
                        onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-14 text-base placeholder-gray-500"
                        placeholder={t('chatbot.input.placeholder')}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        aria-label={t('chatbot.buttons.sendMessage')}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full disabled:opacity-50 hover:bg-primary-dark transition-colors"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <FaPaperPlane />
                        )}
                    </button>
                </div>
                <p className="text-sm text-gray-700 mt-2 text-center">
                    {t('chatbot.footer.title')}{' '}
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-primary hover:underline"
                        type="button"
                    >
                        {showOptions ? t('chatbot.footer.toggleHelpHide') : t('chatbot.footer.toggleHelpShow')}
                    </button>
                </p>
            </div>

            {/* Contact Form Modal */}
            {showContactForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{t('chatbot.contactForm.title')}</h3>
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('chatbot.contactForm.name')}</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('chatbot.contactForm.email')}</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('chatbot.contactForm.message')}</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                                    rows={4}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowContactForm(false)}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    {t('chatbot.contactForm.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    {t('chatbot.contactForm.send')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}