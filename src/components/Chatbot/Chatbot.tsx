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
import { afrinutsKnowledgeBase } from '@/data/afrinutsKnowledgeBase';

interface Message {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatbotProps {
    className?: string;
    initialMessage?: string;
}

// Enhanced knowledge processing
function enhanceKnowledgeBase(kb: typeof afrinutsKnowledgeBase) {
    return {
        ...kb,
        questionVariations: {
            'location': ['where is', 'located', 'address', 'based in', 'headquarters', 'country'],
            'products': ['what do you sell', 'offer', 'produce', 'products', 'goods', 'items'],
            'investment': ['invest', 'funding', 'ROI', 'return', 'capital', 'equity'],
            'sustainability': ['eco-friendly', 'green', 'environment', 'sustainable', 'ESG'],
            'farming': ['grow', 'cultivate', 'harvest', 'plant', 'farm', 'agriculture']
        },
        followUps: {
            'location': 'Would you like details about our farming regions or office locations?',
            'products': 'Are you interested in raw cashews or processed products?',
            'investment': 'Would you like information about investment terms or projected returns?',
            'sustainability': 'Would you like to know about our farming practices or processing sustainability?'
        }
    };
}

function extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = new Set(['the', 'and', 'are', 'you', 'your', 'what', 'where', 'how', 'why', 'when']);
    const keywords = new Set<string>();

    words.forEach(word => {
        const cleaned = word.replace(/[^a-z0-9]/g, '');
        if (cleaned.length > 2 && !commonWords.has(cleaned)) {
            keywords.add(cleaned);
        }
    });

    return Array.from(keywords);
}

function findBestMatch(message: string, kb: any) {
    const lowerMessage = message.toLowerCase();
    const userWords = new Set(extractKeywords(lowerMessage));

    // 1. Check exact question matches
    for (const category in kb.faqs) {
        for (const faq of kb.faqs[category]) {
            if (lowerMessage.includes(faq.question.toLowerCase())) {
                return {
                    ...faq,
                    category,
                    score: 100,
                    followUp: kb.followUps[category]
                };
            }
        }
    }

    // 2. Check category matches
    let bestMatch = null;
    let bestScore = 0;

    for (const [category, variations] of Object.entries(kb.questionVariations)) {
        let categoryScore = (variations as string[]).some(v => lowerMessage.includes(v)) ? 5 : 0;

        for (const faq of kb.faqs[category] || []) {
            let faqScore = categoryScore;
            const faqKeywords = extractKeywords(faq.question + ' ' + faq.answer);

            faqKeywords.forEach(keyword => {
                if (userWords.has(keyword)) faqScore += 1;
            });

            if (faqScore > bestScore) {
                bestScore = faqScore;
                bestMatch = {
                    ...faq,
                    category,
                    score: faqScore,
                    followUp: kb.followUps[category]
                };
            }
        }
    }

    // 3. Fallback to general matching
    if (!bestMatch || bestScore < 3) {
        for (const category in kb.faqs) {
            if (kb.questionVariations[category]) continue;

            for (const faq of kb.faqs[category]) {
                let faqScore = 0;
                extractKeywords(faq.question + ' ' + faq.answer).forEach(keyword => {
                    if (userWords.has(keyword)) faqScore += 1;
                });

                if (faqScore > bestScore) {
                    bestScore = faqScore;
                    bestMatch = {
                        ...faq,
                        category,
                        score: faqScore
                    };
                }
            }
        }
    }

    return bestScore >= 2 ? bestMatch : null;
}

function isGreeting(message: string): boolean {
    return ['hello', 'hi', 'hey', 'greetings'].some(g => message.toLowerCase().includes(g));
}

function isOffTopic(message: string): boolean {
    return ['politics', 'sports', 'weather', 'personal'].some(t => message.toLowerCase().includes(t));
}

export default function Chatbot({ className = '', initialMessage = undefined }: ChatbotProps) {
    const { t } = useTranslation('chatbot');
    const botInitialMessage = initialMessage ?? t('chatbot.initialMessage');
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem('afrinuts-chat');
        return saved ? JSON.parse(saved).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
        })) : [{ text: botInitialMessage, sender: 'bot', timestamp: new Date() }];
    });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOptions, setShowOptions] = useState(true);
    const [showContactForm, setShowContactForm] = useState(false);
    const [awaitingFollowUp, setAwaitingFollowUp] = useState<{category: string} | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [enhancedKB] = useState(() => enhanceKnowledgeBase(afrinutsKnowledgeBase));

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        localStorage.setItem('afrinuts-chat', JSON.stringify(messages));
    }, [messages]);

    const handleFollowUp = (response: string, category: string) => {
        const lowerResponse = response.toLowerCase();
        const kb = enhancedKB;

        switch(category) {
            case 'location':
                if (lowerResponse.includes('farm') || lowerResponse.includes('region')) {
                    return `Our farming operations span 50 hectares in ${kb.companyOverview.location.region}, with ideal conditions for premium cashew cultivation.`;
                }
                return `Our headquarters are in ${kb.companyOverview.location.city}, with easy access to major export routes.`;

            case 'products':
                if (lowerResponse.includes('raw') || lowerResponse.includes('unprocessed')) {
                    return "We specialize in premium raw cashew nuts, carefully graded for export. Our 2026 target is 90 tons with $930/ton domestic pricing.";
                }
                return "Our upcoming processing facility (2031) will produce:\n- Cashew kernels ($6,500/ton)\n- Cashew butter\n- Cashew oil\n- Cashew milk";

            case 'investment':
                if (lowerResponse.includes('term') || lowerResponse.includes('condition')) {
                    return "Investment details:\n- $200,000 for 25% equity\n- Riba-free structure\n- Dividends start 2031 (50% profit share)\n- 10% community reinvestment";
                }
                return `Projected returns:\n- 62.69% ROI first 2 years\n- 24.6% CAGR 2026-2031\n- Investor dividends from $6,731 (2031) to $60,419 (2036)`;

            case 'sustainability':
                if (lowerResponse.includes('process') || lowerResponse.includes('facility')) {
                    return "Our processing center will feature:\n- Solar power\n- Water recycling\n- Zero-waste CNSL utilization\n- Rainforest Alliance certification by 2032";
                }
                return "Our farming practices include:\n- Rainfed agriculture\n- Organic techniques\n- Agroforestry\n- Firebreak systems\n- Biodiversity buffers";

            default:
                return "I can provide more details if you're interested in a specific aspect.";
        }
    };

    const handleSend = async () => {
        const sanitizedInput = input.trim();
        if (!sanitizedInput || isLoading) return;

        const userMessage: Message = {
            text: sanitizedInput,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);
        setShowOptions(false);

        setTimeout(() => { // Simulate processing delay
            try {
                if (awaitingFollowUp) {
                    const followUpResponse = handleFollowUp(sanitizedInput, awaitingFollowUp.category);
                    setMessages(prev => [...prev, {
                        text: followUpResponse,
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                    setAwaitingFollowUp(null);
                    return;
                }

                if (isGreeting(sanitizedInput)) {
                    setMessages(prev => [...prev, {
                        text: "Hello! I'm the AfriNuts Assistant. I can tell you about:\n- Our cashew farming\n- Product offerings\n- Investment opportunities\n- Sustainability efforts\n\nWhat would you like to know?",
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                    return;
                }

                if (isOffTopic(sanitizedInput)) {
                    setMessages(prev => [...prev, {
                        text: "I specialize in AfriNuts Export information. Try asking about:\n- 'Where are you located?'\n- 'What products do you offer?'\n- 'How can I invest?'\n- 'Are you sustainable?'",
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                    return;
                }

                const match = findBestMatch(sanitizedInput, enhancedKB);

                if (match) {
                    setMessages(prev => [...prev, {
                        text: match.answer,
                        sender: 'bot',
                        timestamp: new Date()
                    }]);

                    if (match.followUp && !awaitingFollowUp) {
                        setTimeout(() => {
                            setMessages(prev => [...prev, {
                                text: match.followUp,
                                sender: 'bot',
                                timestamp: new Date()
                            }]);
                            setAwaitingFollowUp({ category: match.category });
                        }, 800);
                    }
                } else {
                    const defaultResponses = [
                        "Could you rephrase your question about AfriNuts?",
                        "I'm not sure about that. Try asking about our farming, products, or investments.",
                        "For detailed inquiries, please contact us at contact@afrinuts.com."
                    ];
                    setMessages(prev => [...prev, {
                        text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
                        sender: 'bot',
                        timestamp: new Date()
                    }]);
                }
            } catch (err) {
                setError("Sorry, there was an error processing your request.");
            } finally {
                setIsLoading(false);
            }
        }, 500);
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

    const topicSuggestions = [
        {
            title: "General",
            questions: [
                "Where is AfriNuts located?",
                "What products do you offer?",
                "When was the company founded?"
            ]
        },
        {
            title: "Operations",
            questions: [
                "How do you grow your cashews?",
                "When is harvest season?",
                "Are your farming methods organic?"
            ]
        },
        {
            title: "Financial",
            questions: [
                "What's your expected ROI?",
                "How are profits distributed?",
                "Is your investment Sharia-compliant?"
            ]
        }
    ];

    return (
        <div className={`fixed bottom-20 right-6 w-full max-w-[460px] sm:w-[460px] h-[600px] bg-white border border-gray-200 rounded-3xl shadow-xl flex flex-col ${className}`}>
            {/* Header */}
            <div className="p-4 bg-primary text-white flex items-center justify-between rounded-t-3xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <FaSeedling className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">AfriNuts Assistant</h2>
                        <p className="text-sm text-white/90">Ask about our cashew operations</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setMessages([{ text: botInitialMessage, sender: 'bot', timestamp: new Date() }]);
                            setShowOptions(true);
                        }}
                        className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full"
                    >
                        New Chat
                    </button>
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="p-2 rounded-full hover:bg-white/10"
                    >
                        <FaChevronDown className={`transition-transform ${showOptions ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            {showOptions && (
                <div className="p-4 bg-gray-50 border-b">
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                className="flex flex-col items-center bg-white p-3 rounded-lg border border-gray-200 hover:border-green-500"
                                onClick={() => action.action ? action.action() : (setInput(action.query), handleSend())}
                            >
                                <span className="text-2xl mb-1">{action.icon}</span>
                                <span className="text-sm font-medium">{action.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length <= 1 && !showOptions && (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                            <FaRobot className="text-text-dark text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Ask About AfriNuts</h3>
                        <div className="text-left mt-6">
                            {topicSuggestions.map((topic, i) => (
                                <div key={i} className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">{topic.title}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {topic.questions.map((q, j) => (
                                            <button
                                                key={j}
                                                onClick={() => {
                                                    setInput(q);
                                                    handleSend();
                                                }}
                                                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 rounded-bl-none'}`}>
                            <p className="whitespace-pre-line">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-2xl bg-gray-100">
                            <div className="flex items-center gap-2 text-sm">
                                <span>Thinking</span>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center">
                        <div className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-sm">
                            {error}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200">
                <div className="relative">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ask about AfriNuts..."
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-full disabled:opacity-50"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
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