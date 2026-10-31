import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import type { TrustResult } from '@/utils/trustScore';

const DIMENSION_LABEL: Record<string, string> = {
    quality: 'Quality consistency',
    traceability: 'Traceability & documentation',
    sustainability: 'Sustainability practices',
    compliance: 'Compliance & inspections',
    cooperation: 'Cooperation (v1 proxy)',
};

const DIMENSION_WEIGHT_LABEL: Record<string, number> = {
    quality: 40,
    traceability: 30,
    sustainability: 15,
    compliance: 10,
    cooperation: 5,
};

export const TrustPanel: React.FC<{ trust: TrustResult }> = ({ trust }) => {
    return (
        <div className="bg-white/50 rounded-xl p-4 border border-white/30 space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-primary">Supplier Trust Score</h4>
                <span className="text-[10px] text-gray-400">scoring {trust.scoringVersion}</span>
            </div>

            {/* Overall */}
            <div className="text-center py-2">
                <div className="text-4xl font-bold text-primary">
                    {trust.overall !== null ? trust.overall : '—'}
                    <span className="text-lg text-gray-400"> / 100</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Confidence: {trust.confidence} · {trust.verifiedTransactions} verified batches
                </div>
            </div>

            {/* Dimension breakdown */}
            <div className="space-y-2">
                {Object.entries(trust.dimensions).map(([key, value]) => {
                    if (key === 'delivery') {
                        return (
                            <div key={key} className="flex justify-between text-xs opacity-50">
                                <span>Delivery reliability</span>
                                <span className="italic">Not yet measurable (v2 — needs commitments)</span>
                            </div>
                        );
                    }
                    if (value === null) return null;
                    const w = DIMENSION_WEIGHT_LABEL[key] ?? 0;
                    const color =
                        value >= 80 ? 'bg-green-500' :
                            value >= 60 ? 'bg-primary' :
                                value >= 40 ? 'bg-amber-500' : 'bg-red-500';
                    return (
                        <div key={key}>
                            <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-gray-600">{DIMENSION_LABEL[key] ?? key} <span className="text-gray-400">({w}%)</span></span>
                                <span className="font-medium">{Math.round(value)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Flags */}
            {trust.flags.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                    <p className="text-[10px] font-medium text-gray-500 mb-1">Flags</p>
                    <ul className="text-[10px] text-gray-600 space-y-0.5">
                        {trust.flags.map(f => <li key={f}>• {f}</li>)}
                    </ul>
                </div>
            )}

            {/* Capacity — deliberately separate */}
            <div className="pt-2 border-t border-gray-200 flex justify-between text-xs">
                <span className="text-gray-500">Capacity (separate from trust)</span>
                <span className="font-medium">{(trust.capacityKg / 1000).toFixed(1)}T</span>
            </div>

            <p className="text-[10px] text-gray-400 leading-snug pt-2 border-t border-gray-200">
                <FaInfoCircle className="inline mr-1" />
                AfriNuts internal assessment, not independent certification. Missing evidence lowers confidence, not the score.
            </p>
        </div>
    );
};