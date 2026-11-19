import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, type DocumentData, type DocumentSnapshot, type QueryDocumentSnapshot, type QuerySnapshot } from 'firebase-admin/firestore';

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
const auth = getAuth();
const FARM_ID = '1';
const INTERNAL_ROLES = new Set(['OWNER', 'CEO', 'COMPLIANCE_OFFICER', 'MANAGER']);
const VALIDATABLE_COLLECTIONS = new Set(['audits', 'inspections', 'verifications']);

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type AuthResult =
    | { ok: true; actorUid: string; actorRole: string }
    | { ok: false; statusCode: number; error: string };

function parseJsonArray(value: unknown): any[] {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value.trim()) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function optionalValue(data: DocumentData, key: string): any {
    return data[key] ?? null;
}

function isValidated(value: unknown): boolean {
    const timestamp = Number(value);
    return Number.isFinite(timestamp) && timestamp > 0;
}

function hasNoValidationStamp(data: DocumentData): boolean {
    return data.validatedAt == null || Number(data.validatedAt) === 0;
}

function mapProgramme(doc: DocumentSnapshot<DocumentData>, now: number) {
    const data = doc.data() || {};
    const status = data.status || 'NOT_STARTED';
    const expiryDate = Number(data.expiryDate ?? 0);
    // Match Farm OS effective status: derive EXPIRED at read time without
    // rewriting the stored certification status.
    const effectiveStatus = status === 'CERTIFIED' && expiryDate > 0 && expiryDate < now
        ? 'EXPIRED'
        : status;

    return {
        certificationId: doc.id,
        farmId: data.farmId ?? FARM_ID,
        certificationName: data.certificationName ?? '',
        certificationBody: data.certificationBody ?? '',
        status,
        effectiveStatus,
        scope: data.scope ?? '',
        applicableStandards: parseJsonArray(data.applicableStandardsJson),
        statusHistory: parseJsonArray(data.statusHistoryJson),
        targetDate: Number(data.targetDate ?? 0),
        approvalDate: Number(data.approvalDate ?? 0),
        expiryDate,
        createdAt: optionalValue(data, 'createdAt'),
        updatedAt: optionalValue(data, 'updatedAt'),
    };
}

function mapAudit(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data();
    return {
        auditId: doc.id,
        certificationId: data.certificationId ?? '',
        farmId: data.farmId ?? FARM_ID,
        auditType: data.auditType ?? '',
        auditDate: Number(data.auditDate ?? 0),
        auditorName: data.auditorName ?? '',
        auditorBody: data.auditorBody ?? '',
        scope: data.scope ?? '',
        findings: parseJsonArray(data.findingsJson),
        status: data.status ?? '',
        reportUrl: data.reportUrl ?? '',
        validatedAt: optionalValue(data, 'validatedAt'),
        validatedBy: optionalValue(data, 'validatedBy'),
        validatedByName: null,
        supersedesId: optionalValue(data, 'supersedesId'),
        createdAt: optionalValue(data, 'createdAt'),
        updatedAt: optionalValue(data, 'updatedAt'),
    };
}

function mapInspection(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data();
    return {
        inspectionId: doc.id,
        certificationId: data.certificationId ?? '',
        certificationName: data.certificationName ?? '',
        farmId: data.farmId ?? FARM_ID,
        inspectionDate: Number(data.inspectionDate ?? 0),
        inspectorName: data.inspectorName ?? '',
        inspectorBody: data.inspectorBody ?? '',
        remarks: data.remarks ?? '',
        correctiveActions: parseJsonArray(data.correctiveActionsJson),
        photos: parseJsonArray(data.photosJson),
        reportUrl: data.reportUrl ?? '',
        validatedAt: optionalValue(data, 'validatedAt'),
        validatedBy: optionalValue(data, 'validatedBy'),
        validatedByName: null,
        supersedesId: optionalValue(data, 'supersedesId'),
        createdAt: optionalValue(data, 'createdAt'),
        updatedAt: optionalValue(data, 'updatedAt'),
    };
}

function mapVerification(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data();
    return {
        verificationId: doc.id,
        certificationId: data.certificationId ?? '',
        farmId: data.farmId ?? FARM_ID,
        verificationType: data.verificationType ?? '',
        verificationDate: Number(data.verificationDate ?? 0),
        verifiedBy: data.verifiedBy ?? '',
        status: data.status ?? '',
        evidence: parseJsonArray(data.evidenceJson),
        comment: data.comment ?? '',
        validatedAt: optionalValue(data, 'validatedAt'),
        validatedBy: optionalValue(data, 'validatedBy'),
        validatedByName: null,
        supersedesId: optionalValue(data, 'supersedesId'),
        createdAt: optionalValue(data, 'createdAt'),
        updatedAt: optionalValue(data, 'updatedAt'),
    };
}

function mapDocument(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data();
    return {
        documentId: doc.id,
        certificationId: data.certificationId ?? '',
        farmId: data.farmId ?? FARM_ID,
        documentType: data.documentType ?? '',
        documentName: data.documentName ?? '',
        issueDate: Number(data.issueDate ?? 0),
        expiryDate: Number(data.expiryDate ?? 0),
        fileUrl: data.fileUrl ?? '',
        status: data.status ?? '',
        createdAt: optionalValue(data, 'createdAt'),
        updatedAt: optionalValue(data, 'updatedAt'),
    };
}

async function addValidatorNames<T extends { validatedBy: unknown }>(records: T[]): Promise<Array<T & { validatedByName: string | null }>> {
    const validatorUids = [...new Set(
        records
            .map(record => record.validatedBy)
            .filter((uid): uid is string => typeof uid === 'string' && uid.length > 0),
    )];
    const nameEntries = await Promise.all(validatorUids.map(async uid => {
        const userDoc = await db.collection('users').doc(uid).get();
        const name = userDoc.exists ? userDoc.data()?.name : null;
        return [uid, typeof name === 'string' && name.trim() ? name : null] as const;
    }));
    const namesByUid = new Map(nameEntries);

    return records.map(record => ({
        ...record,
        validatedByName: typeof record.validatedBy === 'string'
            ? namesByUid.get(record.validatedBy) ?? null
            : null,
    }));
}

async function authorize(event: HandlerEvent): Promise<AuthResult> {
    const authorization = event.headers.authorization || event.headers.Authorization || '';
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return { ok: false, statusCode: 401, error: 'unauthorized' };

    let actorUid: string;
    try {
        const decoded = await auth.verifyIdToken(match[1].trim());
        actorUid = decoded.uid;
    } catch {
        return { ok: false, statusCode: 401, error: 'unauthorized' };
    }

    const actorDoc = await db.collection('users').doc(actorUid).get();
    const actorRole = actorDoc.exists ? actorDoc.data()?.role : null;
    if (typeof actorRole !== 'string' || !INTERNAL_ROLES.has(actorRole)) {
        return { ok: false, statusCode: 403, error: 'not_authorized' };
    }

    return { ok: true, actorUid, actorRole };
}

function unvalidatedQueueRows(
    snapshot: QuerySnapshot<DocumentData>,
    supersededIds: Set<string>,
    programmeNames: Map<string, string>,
    collection: 'audits' | 'inspections' | 'verifications',
) {
    return snapshot.docs
        .filter(doc => {
            const data = doc.data();
            return hasNoValidationStamp(data) && !supersededIds.has(doc.id);
        })
        .map(doc => {
            const data = doc.data();
            const recordType = collection === 'audits'
                ? (data.auditType === 'INTERNAL' ? 'Internal audit' : data.auditType || 'Audit')
                : collection === 'inspections' ? 'Compliance inspection' : 'Verification';
            const date = Number(data.auditDate ?? data.inspectionDate ?? data.verificationDate ?? 0);
            return {
                collection,
                docId: doc.id,
                recordId: doc.id,
                certificationId: data.certificationId ?? '',
                certificationName: programmeNames.get(data.certificationId) ?? data.certificationName ?? '',
                recordType,
                result: data.status ?? '',
                date,
                validatedAt: null,
            };
        });
}

export const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    try {
        let params: any;
        try {
            params = JSON.parse(event.body || '{}');
        } catch {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_json' }) };
        }

        const gate = await authorize(event);
        if (!gate.ok) {
            return { statusCode: gate.statusCode, headers, body: JSON.stringify({ error: gate.error }) };
        }

        const action = params?.action;
        const farmRef = db.collection('farms').doc(FARM_ID);

        if (action === 'listProgrammes') {
            const snapshot = await farmRef.collection('certifications').get();
            const programmes = snapshot.docs
                .map(doc => mapProgramme(doc, Date.now()))
                .sort((a, b) => a.certificationName.localeCompare(b.certificationName));
            return { statusCode: 200, headers, body: JSON.stringify({ programmes }) };
        }

        if (action === 'getProgramme') {
            const certificationId = typeof params.certificationId === 'string' ? params.certificationId.trim() : '';
            if (!certificationId) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_certification_id' }) };
            }

            const certificationDoc = await farmRef.collection('certifications').doc(certificationId).get();
            if (!certificationDoc.exists) {
                return { statusCode: 404, headers, body: JSON.stringify({ error: 'programme_not_found' }) };
            }

            const [audits, inspections, verifications, documents] = await Promise.all([
                farmRef.collection('audits').where('certificationId', '==', certificationId).get(),
                farmRef.collection('inspections').where('certificationId', '==', certificationId).get(),
                farmRef.collection('verifications').where('certificationId', '==', certificationId).get(),
                farmRef.collection('documents').where('certificationId', '==', certificationId).get(),
            ]);

            const byDate = (field: string) => (a: any, b: any) => Number(b[field] ?? 0) - Number(a[field] ?? 0);
            const mappedAudits = audits.docs.map(mapAudit).sort(byDate('auditDate'));
            const mappedInspections = inspections.docs.map(mapInspection).sort(byDate('inspectionDate'));
            const mappedVerifications = verifications.docs.map(mapVerification).sort(byDate('verificationDate'));
            const recordsWithValidatorNames = await addValidatorNames([
                ...mappedAudits,
                ...mappedInspections,
                ...mappedVerifications,
            ]);
            const namedAudits = recordsWithValidatorNames.slice(0, mappedAudits.length);
            const namedInspections = recordsWithValidatorNames.slice(mappedAudits.length, mappedAudits.length + mappedInspections.length);
            const namedVerifications = recordsWithValidatorNames.slice(mappedAudits.length + mappedInspections.length);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    programme: mapProgramme(certificationDoc, Date.now()),
                    audits: namedAudits,
                    inspections: namedInspections,
                    verifications: namedVerifications,
                    documents: documents.docs.map(mapDocument).sort(byDate('issueDate')),
                }),
            };
        }

        if (action === 'listValidationQueue') {
            const [programmeSnapshot, audits, inspections, verifications] = await Promise.all([
                farmRef.collection('certifications').get(),
                farmRef.collection('audits').get(),
                farmRef.collection('inspections').get(),
                farmRef.collection('verifications').get(),
            ]);

            const programmeNames = new Map(programmeSnapshot.docs.map(doc => [doc.id, doc.data().certificationName ?? '']));
            const supersededIds = (snapshot: QuerySnapshot<DocumentData>) => new Set(
                snapshot.docs.map(doc => doc.data().supersedesId).filter((id): id is string => typeof id === 'string' && id.length > 0),
            );
            const queue = [
                ...unvalidatedQueueRows(audits, supersededIds(audits), programmeNames, 'audits')
                    .filter(row => row.recordType === 'Internal audit'),
                ...unvalidatedQueueRows(inspections, supersededIds(inspections), programmeNames, 'inspections'),
                ...unvalidatedQueueRows(verifications, supersededIds(verifications), programmeNames, 'verifications'),
            ].sort((a, b) => a.date - b.date);

            return { statusCode: 200, headers, body: JSON.stringify({ queue }) };
        }

        if (action === 'validateComplianceRecord') {
            const collection = params.collection;
            const docId = typeof params.docId === 'string' ? params.docId.trim() : '';
            if (typeof collection !== 'string' || !VALIDATABLE_COLLECTIONS.has(collection)) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_collection' }) };
            }
            if (!docId) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_document_id' }) };
            }

            const docRef = farmRef.collection(collection).doc(docId);
            const doc = await docRef.get();
            if (!doc.exists) {
                return { statusCode: 404, headers, body: JSON.stringify({ error: 'record_not_found' }) };
            }
            if (isValidated(doc.data()?.validatedAt)) {
                return { statusCode: 200, headers, body: JSON.stringify({ success: true, unchanged: true }) };
            }

            const now = Date.now();
            await docRef.update({ validatedAt: now, validatedBy: gate.actorUid, updatedAt: now });
            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_action' }) };
    } catch (error) {
        console.error('Compliance data request failed:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'internal_error' }) };
    }
};
