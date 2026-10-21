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
 * Send a magic link to the buyer's (or staff's) email.
 *
 * @param email        The recipient email.
 * @param redirectPath Where to send the user after sign-in.
 *                     Defaults to the buyer portal (`/portal`).
 *                     Staff should pass `/dashboard/buyers`.
 */
export async function sendMagicLink(
    email: string,
    redirectPath: string = '/portal'
): Promise<void> {
    const actionCodeSettings = {
        // `continueUrl` survives the magic-link round-trip and is readable on
        // the callback page via `?redirect=`.
        url: `${window.location.origin}/portal/auth/callback?redirect=${encodeURIComponent(
            redirectPath
        )}`,
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

    // Clean up only the Firebase auth params (apiKey, oobCode, mode, …)
    // while preserving our own `?redirect=` so the callback page can
    // still decide where to navigate.
    const url = new URL(window.location.href);
    const redirect = url.searchParams.get('redirect');
    const cleanUrl = redirect
        ? `/portal/auth/callback?redirect=${encodeURIComponent(redirect)}`
        : '/portal';
    window.history.replaceState({}, document.title, cleanUrl);

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