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
const REDIRECT_KEY = 'buyerPortalRedirect';

/**
 * Send a magic link to the buyer's email.
 * @param email  The email to send the link to.
 * @param redirect  Where to send the user after sign-in. Defaults to /portal.
 *                  Use /admin/buyers for admin mode.
 */
export async function sendMagicLink(email: string, redirect: string = '/portal'): Promise<void> {
    const actionCodeSettings = {
        url: `${window.location.origin}/portal/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem(STORAGE_KEY, email);
    window.localStorage.setItem(REDIRECT_KEY, redirect);
}

/**
 * Complete the sign-in when the user returns from clicking the magic link.
 * Returns the authenticated user and the redirect target.
 */
export async function completeMagicLink(): Promise<{ user: User; redirect: string } | null> {
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

    // Determine redirect from URL param first, then fall back to stored value
    const url = new URL(window.location.href);
    const redirect =
        url.searchParams.get('redirect')
        || window.localStorage.getItem(REDIRECT_KEY)
        || '/portal';

    window.localStorage.removeItem(REDIRECT_KEY);

    // Clean up the URL
    window.history.replaceState({}, document.title, '/portal');

    return { user: result.user, redirect };
}

/**
 * Legacy wrapper — returns only the user.
 * @deprecated Use `completeMagicLink` instead.
 */
export async function completeMagicLinkSignIn(): Promise<User | null> {
    const result = await completeMagicLink();
    return result?.user ?? null;
}

/**
 * Log out the current buyer (or admin).
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