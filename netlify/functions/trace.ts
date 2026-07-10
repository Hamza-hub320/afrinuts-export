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

async function fetchBatchDetails(fid: string, batchNumber: string) {
    const batchSnapshot = await db
        .collection('farms').doc(fid)
        .collection('quality_batches')
        .where('batchNumber', '==', batchNumber)
        .limit(1)
        .get();

    if (batchSnapshot.empty) return null;

    const batchDoc = batchSnapshot.docs[0];
    const batchData = { id: batchDoc.id, ...batchDoc.data() } as any;

    let supplier: any = null;
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

    const traceSnapshot = await db
        .collection('farms').doc(fid)
        .collection('batch_traceability')
        .where('batchNumber', '==', batchNumber)
        .limit(1)
        .get();
    let traceability: any = null;
    if (!traceSnapshot.empty) {
        const traceDoc = traceSnapshot.docs[0];
        traceability = { id: traceDoc.id, ...traceDoc.data() };
    }

    const revSnapshot = await db
        .collection('farms').doc(fid)
        .collection('revenues')
        .where('batchNumber', '==', batchNumber)
        .limit(1)
        .get();
    const revenues = revSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

    return { batchData, supplier, traceability, revenues };
}

function mapToPublicBatch(batchData: any, supplier: any, traceability: any, revenues: any[]) {
    const testResults = batchData.testResults ? JSON.parse(batchData.testResults) : {};

    return {
        id: batchData.id,
        batchId: batchData.batchNumber,
        harvestDate: new Date(batchData.processingDate).toISOString(),
        farmLocation: supplier?.location || 'Odienné, Côte d\'Ivoire',
        block: batchData.blockId ? `Block ${batchData.blockId}` : null,
        processingInfo: `${batchData.sourceType?.replace(/_/g, ' ')} · ${batchData.qualityGrade}`,
        certifications: [
            ...(traceability?.certificationIds
                ? traceability.certificationIds.split(',').map((c: string) => c.trim())
                : []),
        ].filter(Boolean),
        qualityGrade: batchData.qualityGrade,
        qualityResults: `Aflatoxin: ${testResults.aflatoxin || '—'}ppb · Score: ${batchData.qualityScore?.toFixed(1)}%`,
        destination: traceability?.destination || 'Export Market',
        buyer: traceability?.buyer || revenues[0]?.buyer || null,
        status: traceability ? 'Shipped' : 'Processing',
        slug: batchData.batchNumber?.toLowerCase(),
        moistureContent: batchData.moistureContent,
        nutCount: batchData.nutCountPerKg,
        kernelRatio: batchData.kernelRatio,
        defectiveRate: batchData.defectiveRate,
        overallScore: Math.round(batchData.qualityScore * 10) / 10,
        weightKg: batchData.weightKg,
        labReportUrl: null,
        latitude: supplier?.latitude || 9.51,
        longitude: supplier?.longitude || -7.5692,
        documents: {
            coo: traceability?.documents ? (() => {
                try {
                    const docs = typeof traceability.documents === 'string' ? JSON.parse(traceability.documents) : traceability.documents;
                    return docs?.certificateOfOrigin || docs?.coo || docs?.qualityCertificate || null;
                } catch { return null; }
            })() : null,
            phyto: traceability?.documents ? (() => {
                try {
                    const docs = typeof traceability.documents === 'string' ? JSON.parse(traceability.documents) : traceability.documents;
                    return docs?.phytosanitary || docs?.phyto || null;
                } catch { return null; }
            })() : null,
            billOfLading: traceability?.documents ? (() => {
                try {
                    const docs = typeof traceability.documents === 'string' ? JSON.parse(traceability.documents) : traceability.documents;
                    return docs?.billOfLading || null;
                } catch { return null; }
            })() : null,
            packingList: traceability?.documents ? (() => {
                try {
                    const docs = typeof traceability.documents === 'string' ? JSON.parse(traceability.documents) : traceability.documents;
                    return docs?.packingList || null;
                } catch { return null; }
            })() : null,
            invoice: traceability?.documents ? (() => {
                try {
                    const docs = typeof traceability.documents === 'string' ? JSON.parse(traceability.documents) : traceability.documents;
                    return docs?.commercialInvoice || docs?.invoice || null;
                } catch { return null; }
            })() : null,
            insurance: null,
            compliancePack: '/documents/compliance-pack.pdf',
        },
        farmer: supplier ? {
            id: supplier.id,
            name: supplier.contactPerson,
            role: supplier.type?.replace(/_/g, ' ') || 'Farmer',
            photo: supplier.photoUrl || '',
            yearsFarming: `${supplier.yearsFarming || 0}+ years`,
            location: supplier.location || 'Odienné',
            bio: supplier.bio || 'Dedicated cashew farmer in the Odienné region.',
            quote: supplier.quote || null,
        } : null,
        supplier: supplier ? {
            id: supplier.id,
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
        sourceType: batchData.sourceType,
        supplierId: batchData.supplierId,
    };
}

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
            // Check if it's a master traceability (bulk shipment)
            const allMasterSnapshot = await db
                .collection('farms').doc(fid)
                .collection('master_traceability')
                .get();

            const masterDoc = allMasterSnapshot.docs.find(
                doc => doc.data().masterBatchNumber === batchId
            );

            if (masterDoc) {
                const masterData = { id: masterDoc.id, ...masterDoc.data() } as any;

                const batchNumbers: string[] = typeof masterData.batchNumbers === 'string'
                    ? JSON.parse(masterData.batchNumbers)
                    : masterData.batchNumbers || [];

                const batchDetails = await Promise.all(
                    batchNumbers.map((bn: string) => fetchBatchDetails(fid, bn))
                );

                const batches = batchDetails
                    .filter(Boolean)
                    .map((detail: any) => mapToPublicBatch(detail.batchData, detail.supplier, detail.traceability, detail.revenues));

                const farmers = batches
                    .map(b => b.farmer)
                    .filter((f: any, i: number, arr: any[]) => f && arr.findIndex((x: any) => x?.id === f.id) === i);

                const supplierTypes = [...new Set(batches.map(b => b.supplier?.type).filter(Boolean))];

                const sustainability = {
                    noChildLabor: batches.every(b => b.sustainability?.noChildLabor),
                    farmOsMonitored: batches.some(b => b.sustainability?.farmOsMonitored),
                    firebreak: batches.every(b => b.sustainability?.firebreak),
                    sustainableHarvesting: batches.every(b => b.sustainability?.sustainableHarvesting),
                };

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        isBulk: true,
                        masterBatch: {
                            id: masterData.id,
                            masterBatchNumber: masterData.masterBatchNumber,
                            shipmentName: masterData.shipmentName,
                            buyer: masterData.buyer,
                            destination: masterData.destination,
                            exportDate: masterData.exportDate,
                            totalBatches: masterData.totalBatches,
                            totalWeightKg: masterData.totalWeightKg,
                            grades: masterData.grades,
                            traceabilityUrl: masterData.traceabilityUrl,
                        },
                        batches,
                        farmers,
                        supplierTypes,
                        sustainability,
                        farmOsMetadata: {
                            recordId: `FOS-MB-${masterData.masterBatchNumber}`,
                            created: new Date(masterData.createdAt).toLocaleDateString(),
                            lastUpdated: new Date(masterData.updatedAt).toLocaleDateString(),
                            verificationStatus: 'Verified',
                        },
                    }),
                };
            }

            // Single batch
            const detail = await fetchBatchDetails(fid, batchId);
            if (!detail) {
                return { statusCode: 200, headers, body: JSON.stringify({ batch: null }) };
            }

            const batch = mapToPublicBatch(detail.batchData, detail.supplier, detail.traceability, detail.revenues);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ isBulk: false, batch }),
            };
        }

        // Return all available IDs
        const [batchesSnapshot, masterSnapshot] = await Promise.all([
            db.collection('farms').doc(fid).collection('quality_batches').limit(20).get(),
            db.collection('farms').doc(fid).collection('master_traceability').limit(10).get(),
        ]);

        const batches = batchesSnapshot.docs.map(doc => ({
            id: doc.id,
            batchId: doc.data().batchNumber,
        }));

        const masterBatches = masterSnapshot.docs.map(doc => ({
            id: doc.id,
            batchId: doc.data().masterBatchNumber,
            isBulk: true,
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ batches: [...batches, ...masterBatches] }),
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};