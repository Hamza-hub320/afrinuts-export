import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Improved CORS config allowing Authorization header and credentials
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Your POST /api/chat route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Call Deepseek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: message }],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`Deepseek API error: ${response.status}`);
        }

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to process your message',
            details: error.message,
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));