import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaBox, FaBuilding, FaCalendarAlt, FaCheckCircle, FaClipboardCheck, FaLeaf, FaMapMarkerAlt, FaShip } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { GlassCard } from '@/components/buyer/GlassCard';
import { getBuyerPortalData } from '@/services/api';
import type { MasterBatch, MyBatch } from '@/pages/BuyerPortal/BuyerDashboard';

interface ShipmentJourneyProps {
    master: MasterBatch;
    batches: MyBatch[];
}

type JourneyState = 'complete' | 'active' | 'upcoming';

function eventTime(value: number | string | null | undefined): number {
    if (value == null || value === '') return 0;
    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(numeric) && numeric > 0) return numeric;
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value: number | string | null | undefined): string {
    const time = eventTime(value);
    return time > 0 ? new Date(time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}

function hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));
}

export const ShipmentJourney: React.FC<ShipmentJourneyProps> = ({ master, batches }) => {
    const [receivedAt, setReceivedAt] = useState<number | null>(master.receivedAt || null);
    const [savingReceipt, setSavingReceipt] = useState(false);
    const [receiptMessage, setReceiptMessage] = useState('');

    useEffect(() => setReceivedAt(master.receivedAt || null), [master.masterBatchNumber, master.receivedAt]);

    const harvestRecorded = batches.filter(batch => eventTime(batch.harvestDate) > 0).length;
    const harvestComplete = batches.length > 0 && harvestRecorded === batches.length;
    const qualityRecorded = batches.filter(batch => Boolean(batch.qualityGrade)).length;
    const qualityComplete = batches.length > 0 && qualityRecorded === batches.length;
    const departureTime = eventTime(master.exportDate);
    const departed = departureTime > 0;
    const receiptTime = eventTime(receivedAt);
    const received = receiptTime > 0;
    const harvestDates = batches.map(batch => eventTime(batch.harvestDate)).filter(time => time > 0).sort((a, b) => a - b);
    const firstHarvestDate = harvestDates.length > 0 ? formatDate(harvestDates[0]) : '';
    const lastHarvestDate = harvestDates.length > 0 ? formatDate(harvestDates[harvestDates.length - 1]) : '';
    const harvestRange = !firstHarvestDate
        ? '—'
        : firstHarvestDate === lastHarvestDate
            ? firstHarvestDate
            : `${firstHarvestDate}–${lastHarvestDate}`;
    const gradeCounts = batches.reduce<Record<string, number>>((counts, batch) => {
        if (batch.qualityGrade) counts[batch.qualityGrade] = (counts[batch.qualityGrade] || 0) + 1;
        return counts;
    }, {});
    const gradeSummary = Object.entries(gradeCounts).map(([grade, count]) => `${grade} ×${count}`).join(', ');

    const confirmReceipt = async () => {
        setSavingReceipt(true);
        setReceiptMessage('');
        try {
            const result = await getBuyerPortalData('confirmReceipt', { masterBatchNumber: master.masterBatchNumber });
            setReceivedAt(eventTime(result.receivedAt) || Date.now());
            setReceiptMessage('Receipt confirmed.');
        } catch (error) {
            setReceiptMessage(error instanceof Error ? error.message : 'Could not confirm receipt.');
        } finally {
            setSavingReceipt(false);
        }
    };

    const steps: Array<{ title: string; icon: IconType; state: JourneyState; summary: string }> = [
        { title: 'Harvest & Collection', icon: FaLeaf, state: harvestComplete ? 'complete' : 'active', summary: `${harvestRecorded} batches · ${harvestRange}` },
        { title: 'Processing & Quality', icon: FaClipboardCheck, state: qualityComplete ? 'complete' : 'active', summary: `${qualityRecorded} graded${gradeSummary ? ` · ${gradeSummary}` : ''}` },
        { title: 'Packing', icon: FaBox, state: 'upcoming', summary: 'Upcoming' },
        { title: 'Port Departure', icon: FaShip, state: departed ? 'complete' : 'upcoming', summary: departed ? `${formatDate(departureTime)}${master.destination ? ` · ${master.destination}` : ''}` : 'Not departed' },
        { title: 'Arrival', icon: FaBuilding, state: received ? 'complete' : departed ? 'active' : 'upcoming', summary: received ? `Received ${formatDate(receiptTime)}` : departed ? 'In transit' : 'Awaiting departure' },
    ];

    return (
        <div className="space-y-4">
            <GlassCard icon={FaShip} title={master.shipmentName || master.masterBatchNumber} subtitle={`${master.masterBatchNumber} · ${batches.length} ${batches.length === 1 ? 'batch' : 'batches'}`}>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                    <span>Destination: {master.destination || '—'}</span>
                    <span>Export date: {departed ? formatDate(departureTime) : 'Not departed'}</span>
                </div>
            </GlassCard>

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
                            {steps.map(({ title, summary, state }) => (
                                <div key={title} className="min-w-0 text-center">
                                    <div className={`truncate text-[11px] font-semibold ${state === 'complete' ? 'text-green-700' : state === 'active' ? 'text-blue-700' : 'text-gray-500'}`} title={title}>{title}</div>
                                    <div className="truncate text-[10px] text-gray-500" title={summary}>{summary}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </GlassCard>

            {steps.map(({ title, icon: Icon, state }) => (
                <GlassCard key={title} minimal className="!p-0">
                    <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${state === 'complete' ? 'bg-green-100 text-green-700' : state === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                            {state === 'complete' ? <FaCheckCircle /> : <Icon />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-semibold text-gray-900">{title}</h3>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${state === 'complete' ? 'bg-green-100 text-green-700' : state === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {state === 'complete' ? 'Complete' : state === 'active' ? 'In progress' : 'Upcoming'}
                                </span>
                            </div>

                            {title === 'Harvest & Collection' && (
                                <div className="mt-3 space-y-2">
                                    {!harvestComplete && <p className="text-xs text-gray-500">{harvestRecorded} of {batches.length} batches recorded.</p>}
                                    {batches.map(batch => {
                                        const identityShared = batch.farmer?.consentShared?.identity === true;
                                        const locationShared = batch.farmer?.consentShared?.location === true;
                                        const location = !locationShared || batch.farmer?.locationWithheld
                                            ? "Côte d'Ivoire · Odienné region"
                                            : `${batch.farmLocation || batch.farmer?.location || '—'}${batch.block ? ` · Block ${batch.block}` : ''}`;
                                        return (
                                            <div key={batch.id} className="rounded-xl border border-gray-200/70 bg-white/40 px-3 py-2 text-xs">
                                                <div className="font-mono font-semibold text-gray-800">{batch.batchId}</div>
                                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-gray-600">
                                                    <span><FaCalendarAlt className="mr-1 inline" />{formatDate(batch.harvestDate)}</span>
                                                    <span><FaMapMarkerAlt className="mr-1 inline" />{location}</span>
                                                    {identityShared && batch.farmer?.name && <span>{batch.farmer.name}</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {title === 'Processing & Quality' && (
                                <div className="mt-3 space-y-2">
                                    {!qualityComplete && <p className="text-xs text-gray-500">{qualityRecorded} of {batches.length} batches recorded.</p>}
                                    {batches.map(batch => (
                                        <div key={batch.id} className="rounded-xl border border-gray-200/70 bg-white/40 px-3 py-2 text-xs">
                                            <div className="font-mono font-semibold text-gray-800">{batch.batchId}</div>
                                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-gray-600">
                                                <span>Grade: {batch.qualityGrade || 'Pending'}</span>
                                                {hasValue(batch.moistureContent) && <span>Moisture: {batch.moistureContent}%</span>}
                                                {hasValue(batch.defectiveRate) && <span>Defective: {batch.defectiveRate}%</span>}
                                                {hasValue(batch.nutCount) && <span>Nut count: {batch.nutCount}/kg</span>}
                                                {hasValue(batch.korGPerKg) && <span>KOR: {batch.korGPerKg} g/kg</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {title === 'Packing' && <p className="mt-2 text-sm text-gray-600">Packaging is recorded when the processing build lands.</p>}

                            {title === 'Port Departure' && (
                                <p className="mt-2 text-sm text-gray-600">{departed ? `${formatDate(departureTime)} · ${master.destination || 'Destination not recorded'}` : 'Not departed'}</p>
                            )}

                            {title === 'Arrival' && (
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                    {received ? (
                                        <span>Received {formatDate(receiptTime)} · {master.buyer || 'Buyer'}</span>
                                    ) : departed ? (
                                        <>
                                            <span>In transit</span>
                                            <button type="button" onClick={confirmReceipt} disabled={savingReceipt} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                                                {savingReceipt ? 'Confirming…' : 'Confirm receipt'} <FaArrowRight />
                                            </button>
                                        </>
                                    ) : <span>Awaiting departure</span>}
                                    {receiptMessage && <span role="status" className="text-xs">{receiptMessage}</span>}
                                </div>
                            )}
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
};
