import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Firebase config (public values - safe for client)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Helper to call Netlify Functions
export async function callFunction(functionName, data) {
    const idToken = await auth.currentUser?.getIdToken();

    const response = await fetch(`/.netlify/functions/${functionName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(idToken && { 'Authorization': `Bearer ${idToken}` }),
        },
        body: JSON.stringify(data),
    });

    return response.json();
}

export { signInWithEmailAndPassword, signOut, onAuthStateChanged };