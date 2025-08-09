import type { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit';
import { createRouter, expressWrapper } from 'next-connect';
import Cors from 'cors';
import { afrinutsKnowledgeBase } from '@/data/afrinutsKnowledgeBase';

// Initialize CORS middleware using environment variable for allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'];

const cors = Cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like curl or server-to-server)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
});

// Rate limiting (15 requests per minute)
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 15,
    message: 'Too many requests, please try again later.'
});

const router = createRouter<NextApiRequest, NextApiResponse>();

// System prompt that will guide the chatbot's responses
const SYSTEM_PROMPT = `
You are AfriNuts Assistant, an AI chatbot for AfriNuts Export, a cashew farming and export business based in Ivory Coast. 

Key guidelines:
1. ONLY answer questions about AfriNuts Export and its operations
2. Base your answers strictly on the provided knowledge base
3. For investment inquiries, direct them to contact@afrinuts.com
4. Be professional but friendly in tone
5. If unsure, say "I'm not sure about that, but you can contact us at contact@afrinuts.com for more information"

Knowledge Base:
${JSON.stringify(afrinutsKnowledgeBase, null, 2)}
`;

// Helper to run middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

router
    .use(async (req, res, next) => {
        await runMiddleware(req, res, cors);
        next();
    })
    .use(expressWrapper(limiter))
    // Explicit OPTIONS handler for preflight CORS request
    .options('/api/chat', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).end();
    })
    .post(async (req, res) => {
        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ error: 'Message is required' });
            }

            // First check if this is a greeting
            if (isGreeting(message)) {
                return res.json({
                    reply: "Hello! I'm the AfriNuts Assistant. How can I help you learn about our cashew farming and export business?"
                });
            }

            // Check if this is an off-topic question
            if (isOffTopic(message)) {
                return res.json({
                    reply: "I specialize in AfriNuts Export information only. Please ask about our cashew operations, products, or business."
                });
            }

            // Call DeepSeek API with the system prompt for context
            const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: "system",
                            content: SYSTEM_PROMPT
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                })
            });

            if (!deepseekResponse.ok) {
                throw new Error(`DeepSeek API error: ${deepseekResponse.status}`);
            }

            const data = await deepseekResponse.json();
            console.log('DeepSeek API response:', JSON.stringify(data, null, 2));
            const reply = data.choices[0]?.message?.content || "I couldn't generate a response.";

            res.status(200).json({ reply });
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

// Helper functions
function isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'];
    return greetings.some(g => message.toLowerCase().includes(g));
}

function isOffTopic(message: string): boolean {
    const offTopics = [
        'politics', 'sports', 'other business', 'competitor',
        'weather', 'personal', 'your name', 'who are you'
    ];
    return offTopics.some(topic => message.toLowerCase().includes(topic));
}

export default router.handler({
    onError: (err, req, res) => {
        console.error(err);
        res.status(500).end('Internal server error');
    },
    onNoMatch: (req, res) => {
        res.status(404).end('Not found');
    }
});