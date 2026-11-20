import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaShip } from 'react-icons/fa';
import { GlassCard } from '@/components/buyer/GlassCard';
import { JourneyRoute, type JourneyRouteStep } from '@/components/buyer/JourneyRoute';
import { getBuyerPortalData } from '@/services/api';
import type { MasterBatch, MyBatch } from '@/pages/BuyerPortal/BuyerDashboard';

interface ShipmentJourneyProps {
    master: MasterBatch;
    batches: MyBatch[];
}

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

    const steps: JourneyRouteStep[] = [
        { title: 'Harvest & Collection', state: harvestComplete ? 'complete' : 'active', summary: `${harvestRecorded} batches · ${harvestRange}` },
        { title: 'Processing & Quality', state: qualityComplete ? 'complete' : 'active', summary: `${qualityRecorded} graded${gradeSummary ? ` · ${gradeSummary}` : ''}` },
        { title: 'Packing', state: 'upcoming', summary: 'Upcoming' },
        { title: 'Port Departure', state: departed ? 'complete' : 'upcoming', summary: departed ? `${formatDate(departureTime)}${master.destination ? ` · ${master.destination}` : ''}` : 'Not departed' },
        { title: 'Arrival', state: received ? 'complete' : departed ? 'active' : 'upcoming', summary: received ? `Received ${formatDate(receiptTime)}` : departed ? 'In transit' : 'Awaiting departure' },
    ];

    return (
        <div className="space-y-4">
            <GlassCard icon={FaShip} title={master.shipmentName || master.masterBatchNumber} subtitle={`${master.masterBatchNumber} · ${batches.length} ${batches.length === 1 ? 'batch' : 'batches'}`}>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                    <span>Destination: {master.destination || '—'}</span>
                    <span>Export date: {departed ? formatDate(departureTime) : 'Not departed'}</span>
                </div>
            </GlassCard>

            <JourneyRoute
                steps={steps}
                arrivalAction={departed && !received && (
                    <div className="mt-2">
                        <button type="button" onClick={confirmReceipt} disabled={savingReceipt} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                            {savingReceipt ? 'Confirming…' : 'Confirm receipt'} <FaArrowRight />
                        </button>
                        {receiptMessage && <p role="status" className="mt-1 text-[10px] text-gray-600">{receiptMessage}</p>}
                    </div>
                )}
            />
        </div>
    );
};
