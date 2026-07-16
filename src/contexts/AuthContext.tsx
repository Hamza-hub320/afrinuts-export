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
    lastLoginAt?: number | null;
    lastLoginDevice?: string | null;
    lastLoginIp?: string | null;
    title?: string | null;      // ADD
    company?: string | null;    // ADD
    bio?: string | null;        // ADD
    phone?: string | null;      // ADD
    failedLoginAttempts?: number | null;
    twoFactorEnabled?: boolean | null;
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
        if (!result.success) throw new Error(result.error);

        console.log('Login result user:', result.user);

        await signInWithEmailAndPassword(auth, email, password);

        setUser({
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.name,
            displayName: result.user.name,
            role: result.user.role,
            lastLoginAt: result.user.lastLoginAt || null,
            lastLoginDevice: result.user.lastLoginDevice || null,
            lastLoginIp: result.user.lastLoginIp || null,
            emailVerified: true,
            title: result.user.title || null,
            company: result.user.company || null,
            bio: result.user.bio || null,
            phone: result.user.phone || null,
            failedLoginAttempts: result.user.failedLoginAttempts || 0,
            twoFactorEnabled: result.user.twoFactorEnabled || false,
            createdAt: result.user.createdAt || null
        });
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