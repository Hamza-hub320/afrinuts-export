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
    const contentType = query.contentType || 'blogPost';

    try {
        let url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=${contentType}`;

        if (slug) url += `&fields.slug=${slug}&limit=1`;
        if (category && category !== 'All') url += `&fields.category=${category}`;
        if (contentType !== 'testimonial') {url += `&order=-fields.publishedDate`;}

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
            if (item.fields.image && data.includes?.Asset) {
                const asset = data.includes.Asset.find(
                    (a: any) => a.sys.id === item.fields.image.sys.id
                );
                if (asset?.fields?.file?.url) {
                    imageUrl = `https:${asset.fields.file.url}`;
                }
            }

            f (item.fields.content?.content && data.includes?.Asset) {
                item.fields.content.content = item.fields.content.content.map((node: any) => {
                    if (node.nodeType === 'embedded-asset-block' && node.data?.target?.sys?.id) {
                        const asset = data.includes.Asset.find(
                            (a: any) => a.sys.id === node.data.target.sys.id
                        );
                        if (asset?.fields) {
                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    target: {
                                        ...node.data.target,
                                        fields: asset.fields
                                    }
                                }
                            };
                        }
                    }
                    return node;
                });
            }


            // Base fields
            const base = {
                id: item.sys.id,
                publishedDate: item.fields.publishedDate,
            };

            // Testimonial fields
            if (contentType === 'testimonial') {
                return {
                    ...base,
                    quote: item.fields.quote,
                    buyerName: item.fields.buyerName,
                    company: item.fields.company,
                    region: item.fields.region,
                    verified: item.fields.verified,
                    featured: item.fields.featured,
                };
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
                image: imageUrl,
                tags: item.fields.tags || [],
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