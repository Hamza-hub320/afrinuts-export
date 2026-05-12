import type { Handler } from '@netlify/functions';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

export const handler: Handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    };

    const query = event.queryStringParameters || {};
    const slug = query.slug;
    const category = query.category;

    try {
        let url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=blogPost&order=-fields.publishedDate`;

        if (slug) url += `&fields.slug=${slug}&limit=1`;
        if (category && category !== 'All') url += `&fields.category=${category}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(slug ? { post: null } : { posts: [] }),
            };
        }

        const posts = data.items.map((item: any) => {
            let imageUrl = null;
            if (item.fields.featuredImage && data.includes?.Asset) {
                const asset = data.includes.Asset.find(
                    (a: any) => a.sys.id === item.fields.featuredImage.sys.id
                );
                if (asset?.fields?.file?.url) {
                    imageUrl = `https:${asset.fields.file.url}`;
                }
            }

            return {
                id: item.sys.id,
                title: item.fields.title,
                slug: item.fields.slug,
                excerpt: item.fields.excerpt,
                content: item.fields.content,
                category: item.fields.category,
                author: item.fields.author,
                publishedDate: item.fields.publishedDate,
                metaDescription: item.fields.metaDescription,
                featuredImage: imageUrl,
            };
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(slug ? { post: posts[0] || null } : { posts }),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};