import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import type { TrustResult } from '@/utils/trustScore';

const DIMENSION_LABEL: Record<string, string> = {
    quality: 'Quality consistency',
    delivery: 'Delivery reliability',
    traceability: 'Traceability & documentation',
    sustainability: 'Sustainability practices',
    compliance: 'Compliance & inspections',
    cooperation: 'Cooperation',
};

export const TrustPanel: React.FC<{ trust: TrustResult }> = ({ trust }) => {
    const weightFor = (key: string): number =>
        (trust.weights as Record<string, number>)[key] ?? 0;

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

                {/* Explain why score is withheld */}
                {trust.overall === null && (() => {
                    const missing: string[] = [];
                    if (trust.dimensions.quality === null) missing.push('quality');
                    if (trust.dimensions.delivery === null) missing.push('delivery');
                    if (trust.dimensions.traceability === null) missing.push('traceability');

                    return (
                        <div className="mt-3 p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-800 max-w-md mx-auto text-left">
                            <strong>Score withheld — insufficient evidence.</strong>
                            <br />
                            The framework requires quality, delivery, and traceability to all have evidence before producing an overall score.
                            {missing.length > 0 && (
                                <> Missing: <strong>{missing.join(', ')}</strong>.</>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* Dimension breakdown */}
            <div className="space-y-2">
                {Object.entries(trust.dimensions).map(([key, value]) => {
                    const weight = weightFor(key);

                    // Null dimension — show as awaiting evidence, not zero
                    if (value === null) {
                        return (
                            <div key={key} className="flex justify-between text-xs opacity-50">
                                <span>{DIMENSION_LABEL[key] ?? key}</span>
                                <span className="italic">
                                    {key === 'delivery'
                                        ? 'Awaiting validated commitments'
                                        : 'Awaiting evidence'}
                                </span>
                            </div>
                        );
                    }

                    const color =
                        value >= 80 ? 'bg-green-500' :
                            value >= 60 ? 'bg-primary' :
                                value >= 40 ? 'bg-amber-500' : 'bg-red-500';

                    return (
                        <div key={key}>
                            <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-gray-600">
                                    {DIMENSION_LABEL[key] ?? key}{' '}
                                    <span className="text-gray-400">({weight}%)</span>
                                </span>
                                <span className="font-medium">{Math.round(value)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`${color} h-1.5 rounded-full`}
                                    style={{ width: `${value}%` }}
                                />
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

            {/* Capacity — deliberately separate from trust */}
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