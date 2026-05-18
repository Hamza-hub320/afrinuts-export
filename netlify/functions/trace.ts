import type { Handler } from '@netlify/functions';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };

    const query = event.queryStringParameters || {};
    const batchId = query.batchId;
    const slug = query.slug;

    try {
        let url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=batch&order=-fields.harvestDate`;

        if (batchId) {
            url += `&fields.batchId=${encodeURIComponent(batchId)}&limit=1`;
        }
        if (slug) {
            url += `&fields.slug=${encodeURIComponent(slug)}&limit=1`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(batchId || slug ? { batch: null } : { batches: [] }),
            };
        }

        const batches = data.items.map((item: any) => ({
            id: item.sys.id,
            batchId: item.fields.batchId,
            harvestDate: item.fields.harvestDate,
            farmLocation: item.fields.farmLocation,
            block: item.fields.block,
            processingInfo: item.fields.processingInfo,
            certifications: item.fields.certifications || [],
            qualityGrade: item.fields.qualityGrade,
            qualityResults: item.fields.qualityResults,
            destination: item.fields.destination,
            buyer: item.fields.buyer,
            status: item.fields.status,
            slug: item.fields.slug,
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(
                batchId || slug
                    ? { batch: batches[0] || null }
                    : { batches }
            ),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};