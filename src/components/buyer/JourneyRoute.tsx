import React from 'react';
import { GlassCard } from '@/components/buyer/GlassCard';

export type JourneyRouteState = 'complete' | 'active' | 'upcoming';

export interface JourneyRouteStep {
    title: string;
    summary: string;
    state: JourneyRouteState;
}

interface JourneyRouteProps {
    steps: JourneyRouteStep[];
    arrivalAction?: React.ReactNode;
    receiptAction?: React.ReactNode;
}

export const JourneyRoute: React.FC<JourneyRouteProps> = ({ steps, arrivalAction, receiptAction }) => (
    <GlassCard minimal>
        <div className="overflow-x-auto pb-2" aria-label="Shipment route summary">
            <div className="min-w-[760px]">
                <svg viewBox="0 0 800 56" role="img" aria-label="Harvest and collection to arrival route" className="h-14 w-full overflow-visible">
                    <line x1="80" y1="28" x2="720" y2="28" stroke="#d1d5db" strokeWidth="4" />
                    {steps.map((step, index) => {
                        const x = 80 + index * 160;
                        const color = step.state === 'complete' ? '#16a34a' : step.state === 'active' ? '#2563eb' : '#9ca3af';
                        return <g key={step.title}>
                            <circle cx={x} cy="28" r="12" fill="white" stroke={color} strokeWidth="4" />
                            {step.state === 'complete' && <circle cx={x} cy="28" r="5" fill={color} />}
                        </g>;
                    })}
                </svg>
                <div className="grid grid-cols-5 gap-2 -mt-1">
                    {steps.map(({ title, summary, state }, index) => (
                        <div key={title} className="min-w-0 text-center">
                            <div className={`truncate text-[11px] font-semibold ${state === 'complete' ? 'text-green-700' : state === 'active' ? 'text-blue-700' : 'text-gray-500'}`} title={title}>{title}</div>
                            <div className="truncate text-[10px] text-gray-500" title={summary}>{summary}</div>
                            {index === steps.length - 1 && (receiptAction ?? arrivalAction)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </GlassCard>
);
