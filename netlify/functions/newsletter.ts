import type { Handler, HandlerEvent } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }),
        };
    }

    let email: string;
    try {
        const body = JSON.parse(event.body || '{}');
        email = body.email;
    } catch {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'INVALID_REQUEST' }),
        };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'INVALID_EMAIL' }),
        };
    }

    const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;

    if (!BUTTONDOWN_API_KEY) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'SERVER_ERROR' }),
        };
    }

    try {
        const response = await fetch('https://api.buttondown.email/v1/subscribers', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Check if already subscribed
            if (response.status === 400 && data?.detail?.includes('already')) {
                return {
                    statusCode: 409,
                    headers,
                    body: JSON.stringify({ error: 'ALREADY_SUBSCRIBED' }),
                };
            }
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: 'SUBSCRIBE_FAILED' }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'SUBSCRIBE_SUCCESS' }),
        };
    } catch (error: unknown) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'SERVER_ERROR' }),
        };
    }
};