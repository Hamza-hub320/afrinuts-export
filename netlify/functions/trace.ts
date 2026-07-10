import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = getFirestore();

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const query = event.queryStringParameters || {};
        const batchId = query.batchId;
        const fid = '1';

        if (batchId) {
            // Fetch specific batch from quality_batches
            const batchSnapshot = await db
                .collection('farms').doc(fid)
                .collection('quality_batches')
                .where('batchNumber', '==', batchId)
                .limit(1)
                .get();

            if (batchSnapshot.empty) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ batch: null }),
                };
            }

            const batchDoc = batchSnapshot.docs[0];
            const batchData = { id: batchDoc.id, ...batchDoc.data() } as any;

            // Fetch linked supplier
            let supplier: any = null;  // Add type annotation
            if (batchData.supplierId) {
                const supplierDoc = await db
                    .collection('farms').doc(fid)
                    .collection('suppliers')
                    .doc(String(batchData.supplierId))
                    .get();
                if (supplierDoc.exists) {
                    supplier = { id: supplierDoc.id, ...supplierDoc.data() };
                }
            }

            // Fetch traceability
            const traceSnapshot = await db
                .collection('farms').doc(fid)
                .collection('batch_traceability')
                .where('batchNumber', '==', batchId)
                .limit(1)
                .get();
            let traceability: any = null;
            if (!traceSnapshot.empty) {
                const traceDoc = traceSnapshot.docs[0];
                traceability = { id: traceDoc.id, ...traceDoc.data() };
            }

            // Fetch linked revenues
            const revSnapshot = await db
                .collection('farms').doc(fid)
                .collection('revenues')
                .where('batchNumber', '==', batchId)
                .limit(1)
                .get();
            const revenues = revSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

            // Map to public-friendly format
            const testResults = batchData.testResults ? JSON.parse(batchData.testResults) : {};

            const batch = {
                id: batchData.id,
                batchId: batchData.batchNumber,
                harvestDate: new Date(batchData.processingDate).toISOString(),
                farmLocation: supplier?.location || 'Odienné, Côte d\'Ivoire',
                block: batchData.blockId ? `Block ${batchData.blockId}` : null,
                processingInfo: `${batchData.sourceType?.replace(/_/g, ' ')} · ${batchData.qualityGrade}`,
                certifications: [
                    batchData.sustainableHarvesting ? 'Organic' : null,
                    batchData.noChildLabor ? 'Fair Trade' : null,
                    batchData.firebreakProtection ? 'Rainforest Alliance' : null,
                ].filter(Boolean),
                qualityGrade: batchData.qualityGrade,
                qualityResults: `Aflatoxin: ${testResults.aflatoxin || '—'}ppb · Score: ${batchData.qualityScore?.toFixed(1)}%`,
                destination: traceability?.destination || 'Export Market',
                buyer: traceability?.buyer || revenues[0]?.buyer || null,
                status: traceability ? 'Shipped' : 'Processing',
                slug: batchData.batchNumber?.toLowerCase().replace(/\s+/g, '-'),
                moistureContent: batchData.moistureContent,
                nutCount: batchData.nutCountPerKg,
                kernelRatio: batchData.kernelRatio,
                defectiveRate: batchData.defectiveRate,
                overallScore: batchData.qualityScore,
                labReportUrl: null,
                latitude: supplier?.latitude || 9.51,
                longitude: supplier?.longitude || -7.5692,
                documents: {
                    coo: null,
                    phyto: null,
                    billOfLading: null,
                    packingList: null,
                    invoice: null,
                    insurance: null,
                    compliancePack: '/documents/compliance-pack.pdf',
                },
                farmer: supplier ? {
                    name: supplier.contactPerson,
                    role: supplier.type?.replace(/_/g, ' ') || 'Farmer',
                    photo: supplier.photoUrl || '',
                    yearsFarming: `${supplier.yearsFarming || 0}+ years`,
                    location: supplier.location || 'Odienné',
                    bio: supplier.bio || 'Dedicated cashew farmer in the Odienné region.',
                    quote: supplier.quote || null,
                } : null,
                supplier: supplier ? {
                    type: supplier.type?.replace(/_/g, ' ') || 'Independent',
                    farmSize: supplier.farmSize ? `${supplier.farmSize} ha` : 'N/A',
                    farmOsStatus: 'Active',
                    season: '2026',
                    traceLevel: 'Block-Level Verified',
                    cooperative: supplier.type === 'COOPERATIVE' ? supplier.name : 'AfriNuts Network',
                } : null,
                sustainability: {
                    noChildLabor: batchData.noChildLabor || false,
                    farmOsMonitored: batchData.farmOsMonitored || false,
                    firebreak: batchData.firebreakProtection || false,
                    sustainableHarvesting: batchData.sustainableHarvesting || false,
                },
                farmOsMetadata: {
                    recordId: `FOS-${batchData.batchNumber}`,
                    created: new Date(batchData.createdAt).toLocaleDateString(),
                    lastUpdated: new Date(batchData.updatedAt).toLocaleDateString(),
                    verificationStatus: batchData.verifiedAt ? 'Verified' : 'Pending',
                },
            };

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ batch }),
            };
        }

        // Return all available batch IDs for search suggestions
        const allBatchesSnapshot = await db
            .collection('farms').doc(fid)
            .collection('quality_batches')
            .limit(20)
            .get();

        const batches = allBatchesSnapshot.docs.map(doc => ({
            id: doc.id,
            batchId: doc.data().batchNumber,
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ batches }),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};