import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { InvestorTier } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Array<'OWNER' | 'CEO' | 'COMPLIANCE_OFFICER' | 'MANAGER' | 'FIELD_OFFICER' | 'WORKER' | 'INVESTOR'>;
    allowedInvestorTiers?: InvestorTier[];
    investorTierRedirects?: Partial<Record<InvestorTier | 'NONE', string>>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, allowedInvestorTiers, investorTierRedirects }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    if (user.role === 'INVESTOR' && allowedInvestorTiers && (!user.investorTier || !allowedInvestorTiers.includes(user.investorTier))) {
        const tierKey: InvestorTier | 'NONE' = user.investorTier ?? 'NONE';
        return <Navigate to={investorTierRedirects?.[tierKey] ?? '/login'} replace />;
    }

    return <>{children}</>;
};
