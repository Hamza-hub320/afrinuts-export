import {
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink,
    onAuthStateChanged,
    signOut,
    User,
} from 'firebase/auth';
import { auth } from './firebase';

const STORAGE_KEY = 'buyerPortalEmail';

/**
 * Send a magic link to the buyer's email.
 */
export async function sendMagicLink(email: string): Promise<void> {
    const actionCodeSettings = {
        url: `${window.location.origin}/portal/auth/callback`,
        handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem(STORAGE_KEY, email);
}

/**
 * Complete the sign-in when the user returns from clicking the magic link.
 * Returns the authenticated Firebase User.
 */
export async function completeMagicLinkSignIn(): Promise<User | null> {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
        return null;
    }

    let email = window.localStorage.getItem(STORAGE_KEY);

    if (!email) {
        // User opened the link on a different device — prompt for email
        email = window.prompt('Please enter the email you used to request the login link:');
    }

    if (!email) {
        throw new Error('Email is required to complete sign-in');
    }

    const result = await signInWithEmailLink(auth, email, window.location.href);
    window.localStorage.removeItem(STORAGE_KEY);

    // Clean up the URL (remove the magic link query params)
    window.history.replaceState({}, document.title, '/portal');

    return result.user;
}

/**
 * Log out the current buyer.
 */
export async function buyerLogout(): Promise<void> {
    await signOut(auth);
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onBuyerAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}