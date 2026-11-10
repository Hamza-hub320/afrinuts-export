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

export const getSupplierNetworkSummary = async (farmId: string = '1') => {
    if (isDevelopment) {
        // No mock yet — return a shape identical to the S1 response
        return {
            generatedAt: Date.now(),
            scoringVersion: 'v2.0',
            totalSuppliers: 0,
            activeSuppliers: 0,
            buyerReadyCount: 0,
            avgTrustOverall: null,
            scoredCount: 0,
            verifiedVolumeKg: 0,
            consentCounts: { full: 0, partial: 0, none: 0, withdrawn: 0 },
            queueCounts: { pendingCommitments: 0, pendingInspections: 0, openDisputes: 0 },
            maturityCounts: { preliminary: 0, developing: 0, established: 0 },
            topTrust: [],
            topRisk: null,
            riskCounts: { critical: 0, high: 0, medium: 0 },
            financialEfficiency: [],
        };
    }
    return callApi('supplierNetwork', {
        action: 'getSupplierNetworkSummary',
        farmId,
    });
};

export const listSuppliers = async (params: {
    search?: string;
    type?: string;
    sort?: 'name' | 'trust_desc' | 'trust_asc' | 'volume_desc' | 'quality_desc';
    page?: number;
    pageSize?: number;
    farmId?: string;
}) => {
    const { farmId = '1', ...rest } = params;
    return callApi('supplierNetwork', {
        action: 'listSuppliers',
        farmId,
        ...rest,
    });
};

export const getNetworkMapPoints = async (farmId: string = '1') => {
    return callApi('supplierNetwork', {
        action: 'getNetworkMapPoints',
        farmId,
    });
};

export const getEvidenceQueues = async (farmId: string = '1') => {
    return callApi('supplierNetwork', {
        action: 'getEvidenceQueues',
        farmId,
    });
};

export interface ExportSuppliersParams {
    farmId: string;
    search?: string;
    type?: string;
    sort?: string;
    exportedBy: string;
}

export async function exportSuppliers(params: ExportSuppliersParams): Promise<{
    filename: string;
    csv: string;
    rowCount: number;
}> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/supplierNetwork`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'exportSuppliers', ...params }),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Export failed: ${response.status}${text ? ` — ${text}` : ''}`);
    }

    return response.json();
}

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

export const getAdminData = async (action: string, params?: any) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const token = await user.getIdToken();

    const postActions = [
        'admin_createBuyer',
        'admin_updateBuyer',
        'admin_assignBatches',
        'admin_deleteBuyer',
        'admin_approveAssignment',
        'admin_rejectAssignment',
    ];

    // 👇 use the array — this is the fix
    if (postActions.includes(action)) {
        const response = await fetch(`/.netlify/functions/buyerPortal?action=${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(params || {}),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.hint || err.error || `Request failed: ${response.status}`);
        }
        return response.json();
    }

    // GET actions
    const queryParams = new URLSearchParams({ action, ...(params || {}) }).toString();
    const response = await fetch(
        `/.netlify/functions/buyerPortal?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.hint || err.error || `Request failed: ${response.status}`);
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