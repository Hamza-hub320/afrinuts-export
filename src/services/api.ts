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
        if (action === 'getSuppliers') return getMockData('getSuppliers');
        if (action === 'getSupplierQualityBatches') return getMockData('getSupplierQualityBatches');
        if (action === 'getSupplierFinancials') return getMockData('getSupplierFinancials');
    }
    return callApi('supplierData', { action, ...params });
};

export async function callApi(endpoint: string, data?: any, requireAuth = true, method: string = 'POST') {
    try {
        const baseUrl = getApiBaseUrl();
        let idToken: string | undefined;

        if (requireAuth) {
            idToken = await auth.currentUser?.getIdToken();
        }

        let url = `${baseUrl}/${endpoint}`;
        let body: string | undefined;

        if (method === 'GET' && data) {
            // Convert data to query string
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
            throw new Error(`API call failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn(`API call to ${endpoint} failed, using mock data:`, error);
        return null;
    }
}