// src/services/api.ts
import { auth } from './firebase';
import {getMockData} from "@/services/mockData";

// Determine if we're in development
const isDevelopment = import.meta.env.DEV;

// API base URL - use proxy in dev, Netlify Functions in prod
const getApiBaseUrl = () => {
    if (isDevelopment) {
        return '/api'; // Will be proxied by Vite (with fallback to mock)
    }
    return '/.netlify/functions';
};

export const getPhotos = async (entityType: string, entityId: number, farmId: string = '1') => {
    if (isDevelopment) {
        return getMockData('getPhotos');
    }
    return callApi('photos', {
        action: 'getPhotos',
        farmId,
        [`${entityType}Id`]: entityId
    });
};

export async function callApi(endpoint: string, data?: any, requireAuth = true) {
    try {
        const baseUrl = getApiBaseUrl();

        // Only get token if auth is required
        let idToken: string | undefined;
        if (requireAuth) {
            idToken = await auth.currentUser?.getIdToken();
        }

        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(idToken && { 'Authorization': `Bearer ${idToken}` }),
            },
            body: JSON.stringify(data || {}),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn(`API call to ${endpoint} failed, using mock data:`, error);
        return null;
    }
}