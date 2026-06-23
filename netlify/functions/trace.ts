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

        // Helper function to resolve a media field to a URL
        const getAssetUrl = (field: any): string | null => {
            if (!field?.sys?.id) return null;
            const asset = data.includes?.Asset?.find((a: any) => a.sys.id === field.sys.id);
            return asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : null;
        };

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
            moistureContent: item.fields.moistureContent,
            nutCount: item.fields.nutCount,
            kernelRatio: item.fields.kernelRatio,
            defectiveRate: item.fields.defectiveRate,
            overallScore: item.fields.overallScore,
            labReportUrl: item.fields.labReportUrl,
            documents: {
                coo: getAssetUrl(item.fields.certificateOfOrigin),
                phyto: getAssetUrl(item.fields.phytosanitaryCertificate),
                billOfLading: getAssetUrl(item.fields.billOfLading),
                packingList: getAssetUrl(item.fields.packingList),
                invoice: getAssetUrl(item.fields.commercialInvoice),
                insurance: getAssetUrl(item.fields.insuranceCertificate),
                compliancePack: getAssetUrl(item.fields.compliancePack),
            },
            farmer: item.fields.farmerName ? {
                name: item.fields.farmerName,
                role: item.fields.farmerRole || 'Farmer',
                photo: getAssetUrl(item.fields.farmerPhoto) || null,
                yearsFarming: item.fields.farmerYearsFarming || '',
                location: item.fields.farmerLocation || 'Odienné, Côte d\'Ivoire',
                bio: item.fields.farmerBio || '',
                quote: item.fields.farmerQuote || '',
            } : null,
            supplier: {
                type: item.fields.supplierType || 'AfriNuts Owned Farm',
                farmSize: item.fields.farmSize || '35 Hectares',
                farmOsStatus: item.fields.farmOsStatus || 'Active',
                season: item.fields.harvestSeason || '2026',
                traceLevel: item.fields.traceabilityLevel || 'Block-Level Verified',
                cooperative: item.fields.cooperative || null,
            },
            sustainability: {
                noChildLabor: item.fields.noChildLabor ?? true,
                farmOsMonitored: item.fields.farmOsMonitored ?? true,
                firebreak: item.fields.firebreakProtection ?? true,
                sustainableHarvesting: item.fields.sustainableHarvesting ?? true,
            },
            farmOsMetadata: {
                recordId: item.fields.farmOsRecordId || `FOS-${item.fields.batchId}`,
                created: item.fields.farmOsCreatedDate || item.fields.harvestDate,
                lastUpdated: item.fields.farmOsLastUpdated || new Date().toISOString(),
                verificationStatus: item.fields.verificationStatus || 'Verified',
            },
            latitude: item.fields.gpsLatitude || 9.78856,
            longitude: item.fields.gpsLongitude || -6.83423,
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