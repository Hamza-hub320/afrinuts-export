import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    auth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    callFunction
} from '../services/firebase';

interface User {
    uid: string;
    email: string;
    name: string;
    role: 'OWNER' | 'MANAGER' | 'WORKER' | 'INVESTOR';
    displayName?: string | null;
    lastSignIn?: string | null;
    emailVerified?: boolean;
    createdAt?: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isOwner: boolean;
    isManager: boolean;
    isInvestor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Verify session and get user data from Netlify function
                const result = await callFunction('auth', { action: 'verify', idToken: await firebaseUser.getIdToken() });
                if (result.success) {
                    setUser(result.user);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const result = await callFunction('auth', { action: 'signin', email, password });
        if (!result.success) {
            throw new Error(result.error);
        }

        // Sign in with Firebase client SDK
        await signInWithEmailAndPassword(auth, email, password);
        setUser(result.user);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const isOwner = user?.role === 'OWNER';
    const isManager = user?.role === 'MANAGER' || isOwner;
    const isInvestor = user?.role === 'INVESTOR';

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isOwner, isManager, isInvestor }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};