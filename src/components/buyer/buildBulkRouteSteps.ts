import type { JourneyRouteStep } from '@/components/buyer/JourneyRoute';
import type { MasterBatch, MyBatch } from '@/pages/BuyerPortal/BuyerDashboard';

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

export function buildBulkRouteSteps(master: MasterBatch, batches: MyBatch[]): JourneyRouteStep[] {
    const harvestRecorded = batches.filter(batch => eventTime(batch.harvestDate) > 0).length;
    const harvestComplete = batches.length > 0 && harvestRecorded === batches.length;
    const qualityRecorded = batches.filter(batch => Boolean(batch.qualityGrade)).length;
    const qualityComplete = batches.length > 0 && qualityRecorded === batches.length;
    const departureTime = eventTime(master.exportDate);
    const departed = departureTime > 0;
    const receiptTime = eventTime(master.receivedAt);
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

    return [
        { title: 'Harvest & Collection', state: harvestComplete ? 'complete' : 'active', summary: `${harvestRecorded} batches · ${harvestRange}` },
        { title: 'Processing & Quality', state: qualityComplete ? 'complete' : 'active', summary: `${qualityRecorded} graded${gradeSummary ? ` · ${gradeSummary}` : ''}` },
        { title: 'Packing', state: 'upcoming', summary: 'Upcoming' },
        { title: 'Port Departure', state: departed ? 'complete' : 'upcoming', summary: departed ? `${formatDate(departureTime)}${master.destination ? ` · ${master.destination}` : ''}` : 'Not departed' },
        { title: 'Arrival', state: received ? 'complete' : departed ? 'active' : 'upcoming', summary: received ? `Received ${formatDate(receiptTime)}` : departed ? 'In transit' : 'Awaiting departure' },
    ];
}
