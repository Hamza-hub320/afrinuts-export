import Chatbot from '@/components/Chatbot/Chatbot';

export interface Message {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    suggestions?: string[];
}