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
const FARM_ID = '1';
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
};

const REGISTRY_URLS: Record<string, string> = {
    ecocert: 'https://certificat.ecocert.com',
    "halal côte d'ivoire": 'https://halalci.org/',
    sgs: 'https://www.sgs.com/en-ci/certified-clients-and-products/certified-client-directory',
    'fair trade international': 'https://www.flocert.net/fairtrade-customer-search/',
    'rainforest alliance': 'https://knowledge.rainforest-alliance.org/docs/list-of-certificate-holders',
};

function programmeCode(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const name = value.trim().toLowerCase();
    if (name.includes('organic')) return 'organic';
    if (name.includes('halal')) return 'halal';
    if (name.includes('iso') && name.includes('22000')) return 'iso22000';
    if (name.includes('fair trade') || name.includes('fairtrade')) return 'fairtrade';
    if (name.includes('rainforest')) return 'rainforest';
    return null;
}

function registryUrl(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    return REGISTRY_URLS[value.trim().toLowerCase()] ?? null;
}

function timestamp(value: unknown): number | null {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function publicStatus(status: string, expiryDate: number | null, now: number, isPubliclyPublished: boolean): string {
    if (status === 'SUSPENDED') return 'Suspended';
    if (status === 'CERTIFIED' && expiryDate && expiryDate < now) return 'Expired';
    if (status === 'CERTIFIED') return isPubliclyPublished ? 'Certified' : 'In Progress';
    if (status === 'NOT_STARTED') return 'Planned';
    return 'In Progress';
}

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    try {
        const now = Date.now();
        const farmRef = db.collection('farms').doc(FARM_ID);
        const certifications = await farmRef.collection('certifications').get();
        const programmes = await Promise.all(certifications.docs.map(async certification => {
            const data = certification.data();
            const code = programmeCode(data.certificationName);
            if (!code) return null;

            const certificateSnapshot = await farmRef.collection('documents')
                .where('certificationId', '==', certification.id)
                .get();
            const currentCertificate = certificateSnapshot.docs
                .filter(doc => String(doc.data().documentType ?? '').toUpperCase() === 'CERTIFICATE' && Number(doc.data().issueDate ?? 0) > 0)
                .sort((a, b) => Number(b.data().issueDate ?? 0) - Number(a.data().issueDate ?? 0))[0];
            const expiryDate = timestamp(data.expiryDate);
            const status = String(data.status ?? 'NOT_STARTED').toUpperCase();
            const isPublishedCurrentCertificate = status === 'CERTIFIED'
                && Boolean(data.publicPublishedAt)
                && Boolean(currentCertificate)
                && data.publicPublishedCertificateId === currentCertificate?.id;
            const label = publicStatus(status, expiryDate, now, isPublishedCurrentCertificate);
            const body = String(data.certificationBody ?? '');
            const url = registryUrl(body);

            return {
                programmeCode: code,
                name: String(data.certificationName ?? ''),
                body,
                scope: String(data.scope ?? ''),
                statusLabel: label,
                targetDate: timestamp(data.targetDate),
                approvalDate: timestamp(data.approvalDate),
                expiryDate,
                ...(isPublishedCurrentCertificate && currentCertificate && url ? {
                    certificateNumber: String(currentCertificate.data().documentName ?? ''),
                    registryUrl: url,
                } : {}),
            };
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ asOf: now, programmes: programmes.filter(Boolean) }),
        };
    } catch (error) {
        console.error('Public certification claims request failed:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'internal_error' }) };
    }
};
