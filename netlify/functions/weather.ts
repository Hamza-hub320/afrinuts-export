// netlify/functions/weather.ts
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    const location = event.queryStringParameters?.location || 'Odienne';
    const apiKey = process.env.VITE_WEATHER_API_KEY;

    if (!apiKey) {
        return { statusCode: 500, body: 'API key not set' };
    }

    try {
        const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&aqi=no`
        );
        const data = await res.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (err: any) {
        return { statusCode: 500, body: err.message };
    }
};