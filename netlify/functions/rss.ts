import type { Handler, HandlerEvent } from '@netlify/functions';
import { parseStringPromise } from 'xml2js';

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const { url, name } = event.queryStringParameters || {};

    if (!url) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing feed URL' }) };
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AfriNuts-News-Aggregator/1.0',
                'Accept': 'application/rss+xml, application/xml, text/xml, */*',
            },
        });

        if (!response.ok) {
            return { statusCode: 502, headers, body: JSON.stringify({ error: `Feed returned ${response.status}` }) };
        }

        const xml = await response.text();
        const parsed = await parseStringPromise(xml);

        // Handle both RSS 2.0 and RDF formats
        let items: any[] = [];

        if (parsed.rss?.channel?.[0]?.item) {
            items = parsed.rss.channel[0].item;
        } else if (parsed['rdf:RDF']?.item) {
            items = parsed['rdf:RDF'].item;
        } else if (parsed.feed?.entry) {
            items = parsed.feed.entry;
        }

        const articles = items.map((item: any) => ({
            title: cleanText(item.title?.[0] || item.title || ''),
            link: item.link?.[0] || item.link || '#',
            pubDate: item.pubDate?.[0] || item.pubDate || item.published?.[0] || new Date().toISOString(),
            contentSnippet: cleanText(
                (item.description?.[0] || item.description || item.summary?.[0] || '').substring(0, 200)
            ),
            creator: item['dc:creator']?.[0] || item.author?.[0]?.name?.[0] || name || '',
            source: name || 'RSS Feed',
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ items: articles, feedName: name }),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

function cleanText(text: any): string {
    if (!text) return '';
    const str = typeof text === 'string' ? text : String(text._ || text);
    return str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}