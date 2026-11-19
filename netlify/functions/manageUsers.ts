import type { Handler, HandlerEvent } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (only once)
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const auth = getAuth();
const db = getFirestore();

const INVESTOR_TIERS = ['PROSPECT', 'NDA_SIGNED', 'INVESTED'] as const;
type InvestorTier = typeof INVESTOR_TIERS[number];

export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return {statusCode: 200, headers, body: ''};
    }

    try {
        const {action, uid, role} = JSON.parse(event.body || '{}');

        // Verify auth token
        const authHeader = event.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        const decoded = await auth.verifyIdToken(token);

        // listUsers — no role check (route already protected)
        if (action === 'listUsers') {
            const firestoreSnapshot = await db.collection('users').get();

            const firestoreUsers = firestoreSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    uid: doc.id,
                    email: data.email || '',
                    displayName: data.name || data.displayName || '',
                    role: data.role || 'INVESTOR',
                    disabled: data.isActive === false,
                    lastSignIn: data.lastLoginAt || null,
                    lastLoginDevice: data.lastLoginDevice || null,
                    createdAt: data.createdAt || null,
                    bio: data.bio || null,
                    company: data.company || null,
                    title: data.title || null,
                    phone: data.phone || null,
                };
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({users: firestoreUsers}),
            };
        }

        // Protected actions — require OWNER role from Firestore
        const userDoc = await db.collection('users').doc(decoded.uid).get();
        const userRole = userDoc.exists ? userDoc.data()?.role : null;

        if (userRole !== 'OWNER') {
            return {statusCode: 403, headers, body: JSON.stringify({error: 'Only owners can manage users'})};
        }

        // ============================================================
        // Part D — admin_events recorder. Top-level collection
        // admin_events/{eventId}; farmId is a field on each doc.
        // ============================================================
        const recordAdminEvent = async (evt: {
            type: 'ROLE_CHANGED' | 'ACCOUNT_CREATED' | 'ACCOUNT_DISABLED' | 'ACCOUNT_ENABLED' | 'INVESTOR_TIER_CHANGED';
            targetUid: string;
            targetEmail: string;
            fromRole?: string | null;
            toRole?: string | null;
            reason?: string;
            fromTier?: InvestorTier | null;
            toTier?: InvestorTier | null;
        }) => {
            await db.collection('admin_events').add({
                type: evt.type,
                actorUid: decoded.uid,
                actorEmail: (await auth.getUser(decoded.uid)).email || '',
                actorRole: userRole,
                targetUid: evt.targetUid,
                targetEmail: evt.targetEmail,
                ...(evt.type !== 'INVESTOR_TIER_CHANGED' && {
                    fromRole: evt.fromRole ?? null,
                    toRole: evt.toRole ?? null,
                }),
                ...(evt.reason !== undefined && {reason: evt.reason}),
                ...(evt.type === 'INVESTOR_TIER_CHANGED' && {
                    fromTier: evt.fromTier ?? null,
                    toTier: evt.toTier ?? null,
                }),
                at: Date.now(),
                farmId: '1',
            });
        };

        if (action === 'setInvestorTier' && uid) {
            const {investorTier: newTier} = JSON.parse(event.body || '{}');
            if (!INVESTOR_TIERS.includes(newTier)) {
                return {statusCode: 400, headers, body: JSON.stringify({error: 'Invalid investor tier'})};
            }

            const targetDoc = await db.collection('users').doc(uid).get();
            const targetData = targetDoc.data() || {};
            if (!targetDoc.exists || targetData.role !== 'INVESTOR') {
                return {statusCode: 400, headers, body: JSON.stringify({error: 'Target user must have INVESTOR role'})};
            }

            const fromTier = (targetData.investorTier ?? null) as InvestorTier | null;
            if (fromTier === newTier) {
                return {statusCode: 200, headers, body: JSON.stringify({success: true, unchanged: true})};
            }

            await db.collection('users').doc(uid).update({investorTier: newTier});
            await recordAdminEvent({
                type: 'INVESTOR_TIER_CHANGED',
                targetUid: uid,
                targetEmail: targetData.email || '',
                fromTier,
                toTier: newTier,
            });
            return {statusCode: 200, headers, body: JSON.stringify({success: true})};
        }

        if (action === 'setRole' && uid && role) {
            const targetDoc = await db.collection('users').doc(uid).get();
            const fromRole = targetDoc.exists ? (targetDoc.data()?.role ?? null) : null;
            const targetEmail = targetDoc.exists ? (targetDoc.data()?.email || '') : '';

            await db.collection('users').doc(uid).update({role});
            await recordAdminEvent({
                type: 'ROLE_CHANGED',
                targetUid: uid,
                targetEmail,
                fromRole,
                toRole: role,
            });
            return {statusCode: 200, headers, body: JSON.stringify({success: true})};
        }

        if (action === 'disableUser' && uid) {
            const {reason} = JSON.parse(event.body || '{}');
            const targetDoc = await db.collection('users').doc(uid).get();
            const targetEmail = targetDoc.exists ? (targetDoc.data()?.email || '') : '';

            await db.collection('users').doc(uid).update({isActive: false});
            await recordAdminEvent({
                type: 'ACCOUNT_DISABLED',
                targetUid: uid,
                targetEmail,
                reason,
            });
            return {statusCode: 200, headers, body: JSON.stringify({success: true})};
        }

        if (action === 'enableUser' && uid) {
            const targetDoc = await db.collection('users').doc(uid).get();
            const targetEmail = targetDoc.exists ? (targetDoc.data()?.email || '') : '';

            await db.collection('users').doc(uid).update({isActive: true});
            await recordAdminEvent({
                type: 'ACCOUNT_ENABLED',
                targetUid: uid,
                targetEmail,
            });
            return {statusCode: 200, headers, body: JSON.stringify({success: true})};
        }

        if (action === 'createUser') {
            const {email: newEmail, role: newRole, investorTier: requestedInvestorTier} = JSON.parse(event.body || '{}');
            if (!newEmail || !newRole) {
                return {statusCode: 400, headers, body: JSON.stringify({error: 'email and role required'})};
            }
            if (requestedInvestorTier != null && !INVESTOR_TIERS.includes(requestedInvestorTier)) {
                return {statusCode: 400, headers, body: JSON.stringify({error: 'Invalid investor tier'})};
            }
            const tierToStore: InvestorTier | null = newRole === 'INVESTOR'
                ? (requestedInvestorTier || 'NDA_SIGNED')
                : null;
            const ALLOWED_ROLES = ['OWNER', 'CEO', 'COMPLIANCE_OFFICER', 'MANAGER', 'FIELD_OFFICER', 'WORKER', 'INVESTOR'];
            if (!ALLOWED_ROLES.includes(newRole)) {
                return {statusCode: 400, headers, body: JSON.stringify({error: `Invalid role: ${newRole}`})};
            }

            let existingUser: any = null;
            try {
                existingUser = await auth.getUserByEmail(newEmail);
            } catch (lookupErr: any) {
                if (lookupErr.code !== 'auth/user-not-found') {
                    throw lookupErr;
                }
            }

            if (existingUser) {
                const uidToUse = existingUser.uid;
                const targetDoc = await db.collection('users').doc(uidToUse).get();
                const fromRole = targetDoc.exists ? (targetDoc.data()?.role ?? null) : null;

                if (targetDoc.exists && fromRole === newRole) {
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: true,
                            uid: uidToUse,
                            email: newEmail,
                            role: newRole,
                            existed: true
                        }),
                    };
                }

                await db.collection('users').doc(uidToUse).set(
                    {
                        role: newRole,
                        isActive: true,
                        email: newEmail,
                        farmId: '1',
                        investorTier: tierToStore,
                        ...(targetDoc.exists ? {} : {createdAt: Date.now()}),
                    },
                    {merge: true}
                );
                await recordAdminEvent({
                    type: 'ROLE_CHANGED',
                    targetUid: uidToUse,
                    targetEmail: newEmail,
                    fromRole,
                    toRole: newRole,
                });
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({success: true, uid: uidToUse, email: newEmail, role: newRole, existed: true}),
                };
            }

            const createdUser = await auth.createUser({email: newEmail});
            await db.collection('users').doc(createdUser.uid).set({
                role: newRole,
                isActive: true,
                createdAt: Date.now(),
                farmId: '1',
                email: newEmail,
                investorTier: tierToStore,
            });
            await recordAdminEvent({
                type: 'ACCOUNT_CREATED',
                targetUid: createdUser.uid,
                targetEmail: newEmail,
                toRole: newRole,
            });
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    uid: createdUser.uid,
                    email: newEmail,
                    role: newRole,
                    existed: false
                }),
            };
        }

        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};