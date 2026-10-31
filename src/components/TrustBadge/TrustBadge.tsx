import React from 'react';
import { FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import type { TrustResult } from '@/utils/trustScore';

const CONFIDENCE_LABEL: Record<TrustResult['confidence'], string> = {
    preliminary: 'Preliminary',
    developing: 'Developing evidence',
    established: 'Established evidence',
};

const CONFIDENCE_COLOR: Record<TrustResult['confidence'], string> = {
    preliminary: 'bg-amber-100 text-amber-700',
    developing: 'bg-blue-100 text-blue-700',
    established: 'bg-green-100 text-green-700',
};

export const TrustBadge: React.FC<{ trust: TrustResult; compact?: boolean }> = ({ trust, compact }) => {
    if (trust.overall === null) {
        return (
            <span className="text-xs text-gray-400 flex items-center gap-1">
                <FaExclamationTriangle /> Not enough evidence
            </span>
        );
    }

    const tier =
        trust.overall >= 85 ? { label: 'Excellent', color: 'text-green-600' } :
            trust.overall >= 70 ? { label: 'Good', color: 'text-primary' } :
                trust.overall >= 50 ? { label: 'Fair', color: 'text-amber-600' } :
                    { label: 'Needs support', color: 'text-red-600' };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1 text-sm font-bold ${tier.color}`}>
                <FaShieldAlt className="text-xs" />
                {trust.overall} / 100
            </span>
            {!compact && <span className="text-xs text-gray-500">{tier.label}</span>}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CONFIDENCE_COLOR[trust.confidence]}`}>
                {CONFIDENCE_LABEL[trust.confidence]} · {trust.verifiedTransactions} txn
            </span>
        </div>
    );
};