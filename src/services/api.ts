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
        ...(entityId && { [`${entityType}Id`]: entityId }),
    }, true, 'GET');
};

export const getSupplierData = async (action: string, params?: any) => {
    if (isDevelopment) {
        return getMockData(action, params);
    }
    return callApi('supplierData', { action, ...params }, false);
};

export const getBuyerPortalData = async (action: string, params?: any) => {
    if (isDevelopment) {
        // Mock data for dev
        return getMockData(action, params);
    }

    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const token = await user.getIdToken();
    const queryParams = new URLSearchParams({ action, ...params }).toString();

    const response = await fetch(
        `/.netlify/functions/buyerPortal?${queryParams}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `Request failed: ${response.status}`);
    }

    return response.json();
};

export async function callApi(endpoint: string, data?: any, requireAuth = true, method: string = 'POST') {
    try {
        const baseUrl = getApiBaseUrl();
        let idToken: string | undefined;

        if (requireAuth) {
            idToken = await auth.currentUser?.getIdToken();
        }

        console.log('Calling', endpoint, '| auth required:', requireAuth, '| token present:', !!idToken);

        let url = `${baseUrl}/${endpoint}`;
        let body: string | undefined;

        if (method === 'GET' && data) {
            const params = new URLSearchParams();
            Object.entries(data).forEach(([key, value]) => {
                params.append(key, String(value));
            });
            url += `?${params.toString()}`;
        } else {
            body = JSON.stringify(data || {});
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(idToken && { 'Authorization': `Bearer ${idToken}` }),
            },
            ...(body && { body }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API call failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn(`API call to ${endpoint} failed:`, error);
        return null;
    }
}