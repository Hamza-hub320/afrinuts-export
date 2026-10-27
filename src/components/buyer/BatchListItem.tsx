import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import type { MyBatch } from '@/pages/BuyerPortal/BuyerDashboard';

interface BatchListItemProps {
    batch: MyBatch;
    isSelected: boolean;
    onClick: () => void;
}

const gradeColor = (grade?: string) => {
    if (grade === 'PREMIUM') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (grade === 'STANDARD') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
};

const statusDot = (status: string) => {
    if (status === 'SHIPPED' || status === 'Shipped') return 'bg-green-500';
    if (status === 'QUALITY_VERIFIED' || status === 'Processing') return 'bg-blue-500';
    if (status === 'DELIVERED' || status === 'Delivered') return 'bg-emerald-600';
    return 'bg-amber-400';
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return '—';
    }
};

export const BatchListItem: React.FC<BatchListItemProps> = ({
                                                                batch,
                                                                isSelected,
                                                                onClick,
                                                            }) => {
    const weightKg = batch.rawWeightKg || 0;
    const weightTonnes = (weightKg / 1000).toFixed(1);
    const locationWithheld = batch.farmer?.locationWithheld === true;
    const locationLabel = locationWithheld
        ? "Côte d'Ivoire"
        : batch.farmLocation || '—';

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3 rounded-xl border transition-all group ${
                isSelected
                    ? 'bg-white border-primary shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-white/70'
            }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    {/* Status dot */}
                    <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${statusDot(batch.status)}`}
                        title={batch.status?.replace(/_/g, ' ')}
                    />

                    <div className="flex-1 min-w-0">
                        {/* Batch ID */}
                        <div className="font-mono text-sm font-semibold text-gray-900 truncate">
                            {batch.batchId}
                        </div>

                        {/* Metadata row */}
                        <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                            {formatDate(batch.processingDate || batch.harvestDate)} ·{' '}
                            {locationLabel}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {/* Grade chip */}
                    {batch.qualityGrade && (
                        <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${gradeColor(
                                batch.qualityGrade
                            )}`}
                        >
                            {batch.qualityGrade}
                        </span>
                    )}

                    {/* Weight */}
                    {weightKg > 0 && (
                        <span className="text-[10px] text-gray-500 font-medium">
                            {weightTonnes}T
                        </span>
                    )}
                </div>

                <FaChevronRight
                    className={`text-xs flex-shrink-0 self-center ml-1 transition-colors ${
                        isSelected ? 'text-primary' : 'text-gray-300 group-hover:text-gray-400'
                    }`}
                />
            </div>
        </button>
    );
};