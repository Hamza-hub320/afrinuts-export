import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft, FaClipboardCheck,
    FaExclamationTriangle, FaExternalLinkAlt,
} from 'react-icons/fa';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { useAuth } from '@/contexts/AuthContext';
import { getComplianceData } from '@/services/api';

type Programme = {
    certificationId: string;
    farmId: string;
    certificationName: string;
    certificationBody: string;
    status: string;
    effectiveStatus: string;
    scope: string;
    applicableStandards: any[];
    statusHistory: any[];
    targetDate: number;
    approvalDate: number;
    expiryDate: number;
    createdAt: number | null;
    updatedAt: number | null;
};

type ComplianceRecord = Record<string, any>;

type QueueItem = {
    collection: 'audits' | 'inspections' | 'verifications';
    docId: string;
    recordId: string;
    certificationId: string;
    certificationName: string;
    recordType: string;
    result: string;
    date: number;
    validatedAt: number | null;
};

type ProgrammeDetail = {
    programme: Programme;
    audits: ComplianceRecord[];
    inspections: ComplianceRecord[];
    verifications: ComplianceRecord[];
    documents: ComplianceRecord[];
};

const EXPIRING_WINDOW_DAYS = 90;

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <motion.div
        className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        whileHover={{ y: -3, transition: { duration: 0.25 } }}
    >
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />
        <div className="relative z-10 p-5 sm:p-6">{children}</div>
    </motion.div>
);

function formatDate(value: unknown): string {
    const timestamp = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(timestamp) || timestamp <= 0) return '—';
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatStatus(status: string): string {
    return (status || 'UNKNOWN').replace(/_/g, ' ');
}

function StatusPill({ status }: { status: string }) {
    const normalized = (status || '').toUpperCase();
    const color = normalized === 'CERTIFIED' || normalized === 'CLOSED' || normalized === 'PASS'
        ? 'bg-green-100 text-green-800'
        : normalized === 'EXPIRED' || normalized === 'SUSPENDED' || normalized === 'FAIL' || normalized === 'OPEN'
            ? 'bg-red-100 text-red-800'
            : normalized.includes('PROGRESS') || normalized === 'AUDIT_READY' || normalized.includes('CONDITION')
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-700';
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{formatStatus(status)}</span>;
}

function EmptyState({ children }: { children: React.ReactNode }) {
    return <div className="py-8 text-center text-sm italic text-gray-500">{children}</div>;
}

function recordTitle(record: ComplianceRecord, key: string): string {
    return record[key] || record.auditId || record.inspectionId || record.verificationId || record.documentId || '—';
}

function safeFileUrl(value: unknown): string | null {
    if (typeof value !== 'string' || !value) return null;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
    } catch {
        return null;
    }
}

const Compliance: React.FC = () => {
    const { certificationId } = useParams<{ certificationId: string }>();
    const { user, isOwner, isCEO, isComplianceOfficer, isManager } = useAuth();
    const navigate = useNavigate();
    const canValidate = isOwner || isCEO || isComplianceOfficer || isManager;

    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [detail, setDetail] = useState<ProgrammeDetail | null>(null);
    const [activeTab, setActiveTab] = useState<'audits' | 'inspections' | 'verifications' | 'documents' | 'history'>('audits');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [validatingId, setValidatingId] = useState<string | null>(null);

    const loadListData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [programmeResponse, queueResponse] = await Promise.all([
                getComplianceData('listProgrammes'),
                getComplianceData('listValidationQueue'),
            ]);
            if (!programmeResponse?.programmes || !queueResponse?.queue) {
                throw new Error('Could not load compliance data. Please refresh and try again.');
            }
            setProgrammes(programmeResponse.programmes);
            setQueue(queueResponse.queue);
        } catch (loadError: any) {
            setError(loadError?.message || 'Could not load compliance data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!certificationId) {
            setDetail(null);
            void loadListData();
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);
        setActiveTab('audits');
        getComplianceData('getProgramme', { certificationId })
            .then((response: ProgrammeDetail | null) => {
                if (!response?.programme) throw new Error('Could not load this programme.');
                if (!cancelled) setDetail(response);
            })
            .catch((loadError: any) => {
                if (!cancelled) setError(loadError?.message || 'Could not load this programme.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [certificationId, loadListData]);

    const dueAndExpiring = useMemo(() => {
        const now = Date.now();
        const cutoff = now + EXPIRING_WINDOW_DAYS * 24 * 60 * 60 * 1000;
        return programmes
            .filter(programme => programme.effectiveStatus === 'EXPIRED'
                || (programme.effectiveStatus === 'CERTIFIED'
                    && programme.expiryDate >= now
                    && programme.expiryDate <= cutoff))
            .sort((a, b) => a.expiryDate - b.expiryDate);
    }, [programmes]);

    const handleValidate = async (item: QueueItem) => {
        setValidatingId(item.docId);
        setNotice(null);
        try {
            const response = await getComplianceData('validateComplianceRecord', {
                collection: item.collection,
                docId: item.docId,
            });
            if (!response?.success) throw new Error(response?.error || 'Validation failed.');
            setNotice(response.unchanged ? 'This record was already validated.' : 'Record validated.');
            await loadListData();
        } catch (validateError: any) {
            setError(validateError?.message || 'Validation failed.');
        } finally {
            setValidatingId(null);
        }
    };

    const pageTitle = certificationId ? detail?.programme.certificationName || 'Programme' : 'Compliance';

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />
            <Section className="relative py-8 sm:py-10">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    {certificationId && (
                        <button
                            onClick={() => navigate('/dashboard/compliance')}
                            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
                        >
                            <FaArrowLeft /> Back to Compliance
                        </button>
                    )}

                    <div className="mb-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-primary">{pageTitle}</h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            {certificationId
                                ? detail?.programme.certificationBody || 'Certification programme details and records.'
                                : 'Certification programmes, the validation queue, and expiring certificates.'}
                        </p>
                    </div>

                    {notice && <div role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</div>}
                    {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

                    {loading ? (
                        <div className="flex min-h-[35vh] items-center justify-center">
                            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
                        </div>
                    ) : certificationId ? (
                        detail ? (
                            <ProgrammePage detail={detail} activeTab={activeTab} setActiveTab={setActiveTab} />
                        ) : <EmptyState>Programme details are unavailable.</EmptyState>
                    ) : (
                        <>
                            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <InfoCard hideIconContainer title={programmes.length} subtitle="Programmes" className="min-h-0" />
                                <InfoCard hideIconContainer title={queue.length} subtitle="Awaiting validation" className="min-h-0" />
                                <InfoCard hideIconContainer title={dueAndExpiring.length} subtitle="Expiring soon" className="min-h-0" />
                            </div>

                            <div className="space-y-5">
                                <GlassCard>
                                    <h2 className="text-xl font-bold text-primary">Programmes</h2>
                                    <p className="mb-4 mt-1 text-sm text-gray-600">Open a programme to review its status, records, and history.</p>
                                    {programmes.length === 0 ? <EmptyState>No certification programmes found.</EmptyState> : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[720px] text-left text-sm">
                                                <thead>
                                                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                                    <th className="py-3 pr-4">Programme</th><th className="py-3 pr-4">Body</th>
                                                    <th className="py-3 pr-4">Scope</th><th className="py-3 pr-4">Status</th>
                                                    <th className="py-3 pr-4">Target</th><th className="py-3">Expiry</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {programmes.map(programme => (
                                                    <tr key={programme.certificationId} className="border-b border-gray-100 last:border-0 hover:bg-white/30">
                                                        <td className="py-3 pr-4">
                                                            <Link className="font-semibold text-primary hover:underline" to={`/dashboard/compliance/${encodeURIComponent(programme.certificationId)}`}>
                                                                {programme.certificationName || programme.certificationId}
                                                            </Link>
                                                            <div className="text-xs text-gray-500">{programme.certificationId}</div>
                                                        </td>
                                                        <td className="py-3 pr-4">{programme.certificationBody || '—'}</td>
                                                        <td className="py-3 pr-4">{programme.scope || '—'}</td>
                                                        <td className="py-3 pr-4"><StatusPill status={programme.effectiveStatus} /></td>
                                                        <td className="py-3 pr-4">{formatDate(programme.targetDate)}</td>
                                                        <td className="py-3">{formatDate(programme.expiryDate)}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </GlassCard>

                                <GlassCard>
                                    <div className="mb-1 flex items-center gap-2"><FaClipboardCheck className="text-primary" /><h2 className="text-xl font-bold text-primary">Validation queue</h2></div>
                                    <p className="mb-4 text-sm text-gray-600">Internal audits, inspections and verifications waiting for validation.</p>
                                    {queue.length === 0 ? <EmptyState>Queue clear — nothing awaiting validation.</EmptyState> : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[650px] text-left text-sm">
                                                <thead><tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                                    <th className="py-3 pr-4">Record</th><th className="py-3 pr-4">Type</th><th className="py-3 pr-4">Result</th><th className="py-3 pr-4">Date</th><th className="py-3">Action</th>
                                                </tr></thead>
                                                <tbody>{queue.map(item => (
                                                    <tr key={`${item.collection}:${item.docId}`} className="border-b border-gray-100 last:border-0">
                                                        <td className="py-3 pr-4"><Link className="font-semibold text-primary hover:underline" to={`/dashboard/compliance/${encodeURIComponent(item.certificationId)}`}>{item.recordId}</Link><div className="text-xs text-gray-500">{item.certificationName || item.certificationId}</div></td>
                                                        <td className="py-3 pr-4">{item.recordType}</td>
                                                        <td className="py-3 pr-4">{item.result ? <StatusPill status={item.result} /> : '—'}</td>
                                                        <td className="py-3 pr-4">{formatDate(item.date)}</td>
                                                        <td className="py-3">{canValidate && <button disabled={validatingId === item.docId} onClick={() => void handleValidate(item)} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-accent disabled:cursor-wait disabled:opacity-60">{validatingId === item.docId ? 'Validating…' : 'Validate'}</button>}</td>
                                                    </tr>
                                                ))}</tbody>
                                            </table>
                                        </div>
                                    )}
                                </GlassCard>

                                <GlassCard>
                                    <div className="mb-1 flex items-center gap-2"><FaExclamationTriangle className="text-amber-600" /><h2 className="text-xl font-bold text-primary">Due &amp; expiring</h2></div>
                                    <p className="mb-4 text-sm text-gray-600">Certified programmes expiring within {EXPIRING_WINDOW_DAYS} days, plus expired programmes.</p>
                                    {dueAndExpiring.length === 0 ? <EmptyState>No programmes expiring in the next {EXPIRING_WINDOW_DAYS} days.</EmptyState> : (
                                        <div className="space-y-2">{dueAndExpiring.map(programme => (
                                            <Link key={programme.certificationId} to={`/dashboard/compliance/${encodeURIComponent(programme.certificationId)}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/10 bg-white/40 px-4 py-3 hover:bg-white/70">
                                                <span><strong className="text-primary">{programme.certificationName || programme.certificationId}</strong><span className="ml-2 text-xs text-gray-500">{programme.certificationBody}</span></span>
                                                <span className="flex items-center gap-3"><StatusPill status={programme.effectiveStatus} /><span className="text-sm text-gray-600">{formatDate(programme.expiryDate)}</span></span>
                                            </Link>
                                        ))}</div>
                                    )}
                                </GlassCard>
                            </div>
                        </>
                    )}
                </div>
            </Section>
        </div>
    );
};

function ProgrammePage({
    detail,
    activeTab,
    setActiveTab,
}: {
    detail: ProgrammeDetail;
    activeTab: 'audits' | 'inspections' | 'verifications' | 'documents' | 'history';
    setActiveTab: (tab: 'audits' | 'inspections' | 'verifications' | 'documents' | 'history') => void;
}) {
    const programme = detail.programme;
    const tabs = [
        ['audits', 'Audits'],
        ['inspections', 'Compliance inspections'],
        ['verifications', 'Verifications'],
        ['documents', 'Documents'],
        ['history', 'Status history'],
    ] as const;
    const history = [...(programme.statusHistory || [])].sort((a, b) => Number(b.date ?? 0) - Number(a.date ?? 0));

    return (
        <div className="space-y-5">
            <GlassCard>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-[160px_1fr]">
                    <dt className="text-gray-500">Effective status</dt><dd className="font-medium"><StatusPill status={programme.effectiveStatus} />{programme.effectiveStatus !== programme.status && <span className="ml-2 text-xs text-gray-500">Stored status: {formatStatus(programme.status)}</span>}</dd>
                    <dt className="text-gray-500">Body</dt><dd>{programme.certificationBody || '—'}</dd>
                    <dt className="text-gray-500">Scope</dt><dd>{programme.scope || '—'}</dd>
                    <dt className="text-gray-500">Standards</dt><dd>{programme.applicableStandards?.length ? programme.applicableStandards.map(item => typeof item === 'string' ? item : item?.name || JSON.stringify(item)).join(' · ') : '—'}</dd>
                    <dt className="text-gray-500">Target date</dt><dd>{formatDate(programme.targetDate)}</dd>
                    <dt className="text-gray-500">Approval date</dt><dd>{formatDate(programme.approvalDate)}</dd>
                    <dt className="text-gray-500">Expiry date</dt><dd>{formatDate(programme.expiryDate)}</dd>
                </dl>
                <p className="mt-4 rounded-xl bg-white/40 p-3 text-xs text-gray-600">Effective expiry is derived at read time: a certified programme past its expiry date displays as expired without changing its stored status.</p>
            </GlassCard>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Programme records">
                {tabs.map(([key, label]) => (
                    <button key={key} role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key)} className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${activeTab === key ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white/50 text-gray-700 hover:border-primary'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {activeTab === 'audits' && <GlassCard>
                <h2 className="mb-4 text-xl font-bold text-primary">Audits</h2>
                {detail.audits.length === 0 ? <EmptyState>No audits recorded.</EmptyState> : <div className="space-y-4">{detail.audits.map(audit => (
                    <div key={audit.auditId} className="rounded-xl border border-primary/10 bg-white/30 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold text-primary">{recordTitle(audit, 'auditId')}</h3><p className="text-sm text-gray-600">{audit.auditType || '—'} · {audit.auditorName || '—'}{audit.auditorBody ? ` · ${audit.auditorBody}` : ''}</p></div><StatusPill status={audit.status || '—'} /></div>
                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500"><span>Date: {formatDate(audit.auditDate)}</span><span>Scope: {audit.scope || '—'}</span><span>Validated: {isValidatedAt(audit.validatedAt) ? formatDate(audit.validatedAt) : '—'}</span>{audit.validatedBy && <span>By: {audit.validatedBy}</span>}</div>
                        {safeFileUrl(audit.reportUrl) && <a className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline" href={safeFileUrl(audit.reportUrl) || undefined} target="_blank" rel="noreferrer">Open audit report <FaExternalLinkAlt size={11} /></a>}
                        {audit.findings?.length > 0 && <div className="mt-3 space-y-2">{audit.findings.map((finding: any, index: number) => <Finding key={`${audit.auditId}-finding-${index}`} title={finding.finding} action={finding.correctiveAction} status={finding.status} assignedTo={finding.assignedTo} dueDate={finding.dueDate} />)}</div>}
                    </div>
                ))}</div>}
            </GlassCard>}

            {activeTab === 'inspections' && <GlassCard>
                <h2 className="mb-4 text-xl font-bold text-primary">Compliance inspections</h2>
                {detail.inspections.length === 0 ? <EmptyState>No compliance inspections recorded.</EmptyState> : <div className="space-y-4">{detail.inspections.map(inspection => (
                    <div key={inspection.inspectionId} className="rounded-xl border border-primary/10 bg-white/30 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold text-primary">{recordTitle(inspection, 'inspectionId')}</h3><p className="text-sm text-gray-600">{inspection.inspectorName || '—'}{inspection.inspectorBody ? ` · ${inspection.inspectorBody}` : ''}</p></div><span className="text-sm text-gray-600">{formatDate(inspection.inspectionDate)}</span></div>
                        {inspection.remarks && <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{inspection.remarks}</p>}
                        <div className="mt-2 text-xs text-gray-500">Validated: {isValidatedAt(inspection.validatedAt) ? formatDate(inspection.validatedAt) : '—'}{inspection.validatedBy ? ` · by ${inspection.validatedBy}` : ''}</div>
                        {inspection.correctiveActions?.length > 0 && <div className="mt-3 space-y-2">{inspection.correctiveActions.map((action: any, index: number) => <Finding key={`${inspection.inspectionId}-action-${index}`} title={action.description} action={action.description} status={action.status} assignedTo={action.assignedTo} dueDate={action.dueDate} />)}</div>}
                        {safeFileUrl(inspection.reportUrl) && <a className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline" href={safeFileUrl(inspection.reportUrl) || undefined} target="_blank" rel="noreferrer">Open inspection report <FaExternalLinkAlt size={11} /></a>}
                        {inspection.photos?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{inspection.photos.map((photo: any, index: number) => { const url = safeFileUrl(typeof photo === 'string' ? photo : photo?.url); return url ? <a key={`${inspection.inspectionId}-photo-${index}`} href={url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">Evidence photo {index + 1}</a> : null; })}</div>}
                    </div>
                ))}</div>}
            </GlassCard>}

            {activeTab === 'verifications' && <GlassCard>
                <h2 className="mb-4 text-xl font-bold text-primary">Verifications</h2>
                {detail.verifications.length === 0 ? <EmptyState>No verifications recorded.</EmptyState> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b border-gray-200 text-xs uppercase text-gray-500"><th className="py-3 pr-4">Type</th><th className="py-3 pr-4">Date</th><th className="py-3 pr-4">Result</th><th className="py-3 pr-4">Verified by</th><th className="py-3">Validated</th></tr></thead><tbody>{detail.verifications.map(record => <tr key={record.verificationId} className="border-b border-gray-100 last:border-0"><td className="py-3 pr-4">{record.verificationType || '—'}<div className="text-xs text-gray-500">{record.verificationId}</div></td><td className="py-3 pr-4">{formatDate(record.verificationDate)}</td><td className="py-3 pr-4"><StatusPill status={record.status || '—'} /></td><td className="py-3 pr-4">{record.verifiedBy || '—'}</td><td className="py-3">{isValidatedAt(record.validatedAt) ? formatDate(record.validatedAt) : '—'}</td></tr>)}</tbody></table>{detail.verifications.some(record => record.comment || record.evidence?.length) && <div className="mt-4 space-y-3">{detail.verifications.filter(record => record.comment || record.evidence?.length).map(record => <div key={`${record.verificationId}-evidence`} className="rounded-lg bg-white/30 p-3 text-sm"><strong>{record.verificationId}</strong>{record.comment && <p className="mt-1 whitespace-pre-wrap">{record.comment}</p>}{record.evidence?.map((evidence: any, index: number) => <p key={index} className="mt-1 text-xs text-gray-600">{typeof evidence === 'string' ? evidence : evidence?.name || JSON.stringify(evidence)}</p>)}</div>)}</div>}</div>}
            </GlassCard>}

            {activeTab === 'documents' && <GlassCard>
                <h2 className="mb-4 text-xl font-bold text-primary">Documents</h2>
                {detail.documents.length === 0 ? <EmptyState>No documents recorded.</EmptyState> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b border-gray-200 text-xs uppercase text-gray-500"><th className="py-3 pr-4">Document</th><th className="py-3 pr-4">Type</th><th className="py-3 pr-4">Issue date</th><th className="py-3 pr-4">Expiry date</th><th className="py-3">Status</th></tr></thead><tbody>{detail.documents.map(document => { const url = safeFileUrl(document.fileUrl); return <tr key={document.documentId} className="border-b border-gray-100 last:border-0"><td className="py-3 pr-4">{url ? <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">{document.documentName || document.documentId} <FaExternalLinkAlt className="inline" size={10} /></a> : document.documentName || document.documentId}</td><td className="py-3 pr-4">{formatStatus(document.documentType || '—')}</td><td className="py-3 pr-4">{formatDate(document.issueDate)}</td><td className="py-3 pr-4">{formatDate(document.expiryDate)}</td><td className="py-3">{document.status ? <StatusPill status={document.status} /> : '—'}</td></tr>; })}</tbody></table></div>}
            </GlassCard>}

            {activeTab === 'history' && <GlassCard>
                <h2 className="mb-4 text-xl font-bold text-primary">Status history</h2>
                {history.length === 0 ? <EmptyState>No status changes recorded.</EmptyState> : <div className="space-y-3">{history.map((event: any, index: number) => <div key={`${event.date || 'event'}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/10 bg-white/30 px-4 py-3"><div className="flex flex-wrap items-center gap-2"><StatusPill status={event.fromStatus || '—'} /><span className="text-gray-400">→</span><StatusPill status={event.toStatus || '—'} /></div><div className="text-right text-xs text-gray-600"><div>{formatDate(event.date)}</div><div>{event.actor || '—'}{event.documentId ? ` · ${event.documentId}` : ''}</div></div></div>)}</div>}
            </GlassCard>}
        </div>
    );
}

function isValidatedAt(value: unknown): boolean {
    const timestamp = Number(value);
    return Number.isFinite(timestamp) && timestamp > 0;
}

function Finding({ title, action, status, assignedTo, dueDate }: { title?: string; action?: string; status?: string; assignedTo?: string; dueDate?: number }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-primary/5 p-3 text-sm">
            <div className="min-w-[220px] flex-1"><strong>{title || 'Finding'}</strong>{action && action !== title && <p className="mt-1 text-gray-600">Action: {action}</p>}<p className="mt-1 text-xs text-gray-500">{assignedTo ? `Assigned to ${assignedTo} · ` : ''}Due {formatDate(dueDate)}</p></div>
            <StatusPill status={status || 'OPEN'} />
        </div>
    );
}

export default Compliance;
