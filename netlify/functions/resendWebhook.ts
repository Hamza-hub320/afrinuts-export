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

function log(level: 'info' | 'warn' | 'error', event: string, data: Record<string, any> = {}) {
    const payload = { ts: new Date().toISOString(), level, event, ...data };
    if (level === 'error') console.error(JSON.stringify(payload));
    else if (level === 'warn') console.warn(JSON.stringify(payload));
    else console.info(JSON.stringify(payload));
}

async function findBuyerByEmail(email: string): Promise<{ id: string; companyName: string } | null> {
    if (!email) return null;
    const snap = await db
        .collection('farms').doc('1')
        .collection('buyers')
        .where('email', '==', email.trim().toLowerCase())
        .limit(1)
        .get();

    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, companyName: doc.data().companyName || 'Unknown' };
}

export const handler: Handler = async (event: HandlerEvent) => {
    const eventId = event.headers['svix-id'] || event.headers['Svix-Id'];
    const baseHeaders = { 'Content-Type': 'application/json' };

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: baseHeaders, body: JSON.stringify({ error: 'method_not_allowed' }) };
    }

    // ── Parse the body directly (svix not reliable on Netlify) ──
    let payload: any;
    try {
        const rawBody = event.isBase64Encoded
            ? Buffer.from(event.body || '', 'base64').toString('utf8')
            : event.body || '';

        payload = JSON.parse(rawBody);
    } catch (err: any) {
        log('warn', 'webhook_body_invalid', { err: err?.message, eventId });
        return { statusCode: 400, headers: baseHeaders, body: JSON.stringify({ error: 'invalid_body' }) };
    }

    if (!payload || !payload.type) {
        log('warn', 'webhook_payload_invalid', { eventId });
        return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true, note: 'empty_payload' }) };
    }

    // ── Idempotency ──
    if (eventId) {
        const seenRef = db.collection('farms').doc('1').collection('webhook_events').doc(eventId);
        const seenDoc = await seenRef.get();
        if (seenDoc.exists) {
            log('info', 'webhook_duplicate', { eventId });
            return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true, duplicate: true }) };
        }
        await seenRef.set({ type: payload.type, createdAt: new Date().toISOString() });
    }

    const type = payload.type as string;
    const data = payload.data || {};
    const recipientEmail: string | null = data?.to?.[0] || data?.email || null;

    log('info', 'webhook_received', { eventId, type, recipientEmail });

    // ── Route by event type ──
    if (type === 'email.bounced') {
        const rawBounceType = data?.bounce?.type || 'unknown';
        const bounceType = rawBounceType.toLowerCase().includes('permanent') ? 'hard' : 'soft';
        const reason = data?.bounce?.message || 'unknown';

        const buyer = await findBuyerByEmail(recipientEmail || '');
        if (!buyer) {
            log('warn', 'bounce_no_buyer', { eventId, recipientEmail });
            return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true, note: 'no_buyer' }) };
        }

        await db
            .collection('farms').doc('1')
            .collection('buyers').doc(buyer.id)
            .update({
                emailBounced: true,
                emailBounceType: bounceType,
                lastBounceAt: new Date().toISOString(),
                emailBounceReason: reason,
            });

        log('warn', 'buyer_marked_bounced', {
            eventId, buyerId: buyer.id, companyName: buyer.companyName,
            recipientEmail, bounceType, reason,
        });

        return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true }) };
    }

    if (type === 'email.complained') {
        const buyer = await findBuyerByEmail(recipientEmail || '');
        if (!buyer) {
            log('warn', 'complaint_no_buyer', { eventId, recipientEmail });
            return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true, note: 'no_buyer' }) };
        }

        await db
            .collection('farms').doc('1')
            .collection('buyers').doc(buyer.id)
            .update({
                emailBounced: true,
                emailBounceType: 'complaint',
                lastBounceAt: new Date().toISOString(),
                emailBounceReason: 'marked_as_spam',
            });

        log('warn', 'buyer_marked_complaint', {
            eventId, buyerId: buyer.id, companyName: buyer.companyName, recipientEmail,
        });

        return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true }) };
    }

    if (type === 'email.delivered') {
        if (recipientEmail) {
            const buyer = await findBuyerByEmail(recipientEmail);
            if (buyer) {
                const buyerDoc = await db
                    .collection('farms').doc('1')
                    .collection('buyers').doc(buyer.id)
                    .get();
                const data2 = buyerDoc.data();
                if (data2?.emailBounceType === 'soft') {
                    await buyerDoc.ref.update({
                        emailBounced: false,
                        emailBounceType: null,
                        emailBounceReason: null,
                    });
                    log('info', 'soft_bounce_cleared', { eventId, buyerId: buyer.id });
                }
            }
        }
        return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 200, headers: baseHeaders, body: JSON.stringify({ ok: true, ignored: type }) };
};