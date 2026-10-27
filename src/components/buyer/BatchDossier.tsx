import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaShip, FaBox, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt,
    FaTruck, FaBuilding, FaFlask, FaFileAlt, FaLeaf,
    FaShieldAlt, FaDownload, FaPrint, FaShare, FaCopy,
    FaWhatsapp, FaTwitter, FaLinkedin, FaEnvelope, FaChartBar,
    FaUser, FaMobile, FaCertificate,
} from 'react-icons/fa';
import { GiFarmer, GiFruitTree, GiFactory, GiCargoShip } from 'react-icons/gi';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { BatchFarmerCard } from '@/components/batch/BatchFarmerCard';
import { BatchSustainabilityCard } from '@/components/batch/BatchSustainabilityCard';
import { BatchSignatureCard } from '@/components/batch/BatchSignatureCard';
import BatchLocationMap from '@/components/BatchLocationMap/BatchLocationMap';
import type { MyBatch } from '@/pages/BuyerPortal/BuyerDashboard';

interface BatchDossierProps {
    batch: MyBatch;
}

type Tab = 'journey' | 'quality' | 'documents' | 'farmer' | 'map' | 'signature';

// ── GlassCard — matches AdminBuyers / Financials ──
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <motion.div
        className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden ${className}`}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        whileHover={{
            y: -5,
            scale: 1.01,
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
            transition: { duration: 0.3 },
        }}
    >
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
        <div className="relative z-10 p-5">{children}</div>
    </motion.div>
);

export const BatchDossier: React.FC<BatchDossierProps> = ({ batch }) => {
    const [activeTab, setActiveTab] = useState<Tab>('journey');
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const status = batch.status || 'PENDING';
    const isProcessing = status === 'Processing' || status === 'QUALITY_VERIFIED';
    const isShipped = status === 'Shipped' || status === 'SHIPPED';
    const isDelivered = status === 'Delivered' || status === 'DELIVERED';

    const locationWithheld = batch.farmer?.locationWithheld === true;
    const displayLocation = locationWithheld
        ? "Côte d'Ivoire · Odienné region"
        : `${batch.farmLocation}${batch.block ? ` · Block ${batch.block}` : ''}`;

    const journeySteps = [
        {
            icon: GiFruitTree,
            title: 'Harvest & Collection',
            detail: batch.processingDate || batch.harvestDate
                ? new Date(batch.processingDate || batch.harvestDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })
                : '—',
            sub: batch.farmLocation || 'Odienné',
            status: 'complete',
        },
        {
            icon: GiFactory,
            title: 'Processing & Quality Check',
            detail: batch.processingFacility || 'AfriNuts NDC',
            sub: batch.qualityGrade ? `Grade: ${batch.qualityGrade}` : '',
            status: isProcessing || isShipped || isDelivered ? 'complete' : 'active',
        },
        {
            icon: FaBox,
            title: 'Packing',
            detail: batch.rawWeightKg ? `${(batch.rawWeightKg / 1000).toFixed(1)}T packaged` : 'Packaging',
            sub: batch.kernelRatio ? `Kernel ratio: ${batch.kernelRatio}%` : '',
            status: isShipped || isDelivered ? 'complete' : isProcessing ? 'active' : 'upcoming',
        },
        {
            icon: GiCargoShip,
            title: 'Port Departure',
            detail: isShipped || isDelivered ? 'Via Port of Abidjan' : 'Pending',
            sub: batch.destination || 'Destination TBD',
            status: isShipped || isDelivered ? 'complete' : 'upcoming',
        },
        {
            icon: FaBuilding,
            title: 'Arrival',
            detail: isDelivered ? '✓ Delivered' : isShipped ? 'In transit' : 'Estimated on delivery',
            sub: batch.destination || '—',
            status: isDelivered ? 'complete' : isShipped ? 'active' : 'upcoming',
        },
    ];

    const handleShare = async (platform?: string) => {
        const url = `${window.location.origin}/trace?batchId=${encodeURIComponent(batch.batchId)}`;
        const text = `AfriNuts Batch: ${batch.batchId}`;
        if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        else if (platform === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        else if (platform === 'email') window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {}
        }
        setShowShareMenu(false);
    };

    const qualityMetrics = [
        { label: 'Moisture Content', value: batch.moistureContent, unit: '%', max: 10, good: true },
        { label: 'Foreign Matter', value: batch.defectiveRate, unit: '%', max: 10, good: true },
        { label: 'Broken Kernels', value: batch.kernelRatio ? 100 - batch.kernelRatio : null, unit: '%', max: 100, good: true },
        { label: 'Nut Count', value: batch.nutCount, unit: '/kg', max: 250, good: true },
    ];

    return (
        <div className="space-y-4">
            {/* ── DOSSIER HEADER ── */}
            <GlassCard>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {batch.qualityGrade && (
                                <span
                                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                        batch.qualityGrade === 'PREMIUM'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                                >
                                    {batch.qualityGrade}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                {status.replace(/_/g, ' ')}
                            </span>
                        </div>

                        <Typography variant="h2" className="font-mono text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            {batch.batchId}
                        </Typography>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-600">
                            <span className="flex items-center gap-1.5">
                                <FaCalendarAlt className="text-gray-400" />
                                {batch.processingDate || batch.harvestDate
                                    ? new Date(batch.processingDate || batch.harvestDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })
                                    : '—'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-gray-400" />
                                {displayLocation}
                            </span>
                            {batch.rawWeightKg && (
                                <span className="flex items-center gap-1.5">
                                    <FaBox className="text-gray-400" />
                                    {(batch.rawWeightKg / 1000).toFixed(1)}T
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                        <button
                            onClick={() => window.print()}
                            className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg text-xs font-medium text-gray-700 hover:bg-white transition flex items-center gap-1.5"
                        >
                            <FaPrint /> Print
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowShareMenu(!showShareMenu)}
                                className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition flex items-center gap-1.5"
                            >
                                {copied ? <FaCheckCircle /> : <FaShare />}
                                {copied ? 'Copied' : 'Share'}
                            </button>
                            {showShareMenu && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                                    {[
                                        { icon: FaCopy, label: 'Copy Link', action: () => handleShare() },
                                        { icon: FaWhatsapp, label: 'WhatsApp', action: () => handleShare('whatsapp') },
                                        { icon: FaTwitter, label: 'Twitter', action: () => handleShare('twitter') },
                                        { icon: FaLinkedin, label: 'LinkedIn', action: () => handleShare('linkedin') },
                                        { icon: FaEnvelope, label: 'Email', action: () => handleShare('email') },
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={item.action}
                                            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm transition"
                                        >
                                            <item.icon className="text-gray-500 text-xs" />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* ── TAB BAR ── */}
            <GlassCard className="!p-1.5">
                <div className="flex overflow-x-auto scrollbar-hide">
                    {[
                        { key: 'journey' as Tab, icon: FaMapMarkerAlt, label: 'Journey' },
                        { key: 'quality' as Tab, icon: FaChartBar, label: 'Quality' },
                        { key: 'documents' as Tab, icon: FaFileAlt, label: 'Documents' },
                        { key: 'farmer' as Tab, icon: FaUser, label: 'Farmer' },
                        { key: 'map' as Tab, icon: FaMapMarkerAlt, label: 'Map' },
                        { key: 'signature' as Tab, icon: FaShieldAlt, label: 'Signature' },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                                    active
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-gray-600 hover:bg-white/60'
                                }`}
                            >
                                <Icon className="text-xs" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </GlassCard>

            {/* ── TAB CONTENT ── */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {/* JOURNEY TAB */}
                {activeTab === 'journey' && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {/* Left: Shipment Journey */}
                        <GlassCard>
                            <Typography variant="h4" className="font-bold text-gray-900 mb-4">
                                Shipment Journey
                            </Typography>
                            <div className="space-y-0">
                                {journeySteps.map((step, i) => {
                                    const Icon = step.icon;
                                    const isLast = i === journeySteps.length - 1;
                                    return (
                                        <div key={i} className="flex gap-3 relative">
                                            {!isLast && (
                                                <div
                                                    className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${
                                                        step.status === 'complete' ? 'bg-green-300' : 'bg-gray-200'
                                                    }`}
                                                />
                                            )}
                                            <div
                                                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    step.status === 'complete'
                                                        ? 'bg-green-100 text-green-600'
                                                        : step.status === 'active'
                                                            ? 'bg-blue-100 text-blue-600'
                                                            : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {step.status === 'complete' ? (
                                                    <FaCheckCircle className="text-sm" />
                                                ) : (
                                                    <Icon className="text-sm" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="font-semibold text-sm text-gray-900">
                                                            {step.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {step.detail}
                                                            {step.sub && ` · ${step.sub}`}
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                                            step.status === 'complete'
                                                                ? 'bg-green-100 text-green-700'
                                                                : step.status === 'active'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                    >
                                                        {step.status === 'complete'
                                                            ? 'Completed'
                                                            : step.status === 'active'
                                                                ? 'In Transit'
                                                                : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </GlassCard>

                        {/* Right: Quality Metrics + Lab Results */}
                        <div className="space-y-4">
                            <GlassCard>
                                <Typography variant="h4" className="font-bold text-gray-900 mb-4">
                                    Quality Metrics
                                </Typography>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative w-32 h-32 flex-shrink-0">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke="#16a34a"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(batch.qualityScore || 0) * 2.64} 264`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {batch.qualityScore ? Math.round(batch.qualityScore) : '—'}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full space-y-2.5">
                                        {qualityMetrics.map((m, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">{m.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900">
                                                        {m.value != null ? `${m.value}${m.unit}` : '—'}
                                                    </span>
                                                    {m.value != null && (
                                                        <FaCheckCircle className="text-green-500 text-xs" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                                            <span className="text-gray-600">Grade</span>
                                            <span
                                                className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                                    batch.qualityGrade === 'PREMIUM'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {batch.qualityGrade || '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            {batch.testResults && (
                                <GlassCard>
                                    <Typography variant="h4" className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FaFlask className="text-accent" /> Lab Test Results
                                    </Typography>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Aflatoxin', value: batch.testResults.aflatoxin, unit: 'ppb', limit: 4 },
                                            { label: 'Heavy Metals', value: batch.testResults.heavyMetals, unit: 'ppb', limit: 0.5 },
                                            { label: 'Pesticide Residue', value: batch.testResults.pesticideResidue, unit: 'ppb', limit: 0.5 },
                                        ].map((t, i) => {
                                            const passed = t.value != null && t.value < t.limit;
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/40"
                                                >
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {t.label}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500">
                                                            Limit: &lt; {t.limit} {t.unit}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`text-sm font-semibold ${
                                                                passed ? 'text-green-600' : 'text-red-600'
                                                            }`}
                                                        >
                                                            {t.value != null ? `${t.value} ${t.unit}` : 'Pending'}
                                                        </span>
                                                        {passed && <FaCheckCircle className="text-green-500 text-xs" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </GlassCard>
                            )}
                        </div>
                    </div>
                )}

                {/* QUALITY TAB */}
                {activeTab === 'quality' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <GlassCard>
                            <Typography variant="h4" className="font-bold text-gray-900 mb-3">
                                Quality Metrics
                            </Typography>
                            <div className="space-y-3">
                                {[
                                    { label: 'Moisture', value: batch.moistureContent, unit: '%', max: 10, color: 'bg-primary' },
                                    { label: 'Nut Count', value: batch.nutCount, unit: '/kg', max: 250, color: 'bg-blue-500' },
                                    { label: 'Kernel Ratio', value: batch.kernelRatio, unit: '%', max: 55, color: 'bg-accent' },
                                    { label: 'Defects', value: batch.defectiveRate, unit: '%', max: 10, color: 'bg-red-500' },
                                ]
                                    .filter((m) => m.value != null)
                                    .map((metric, i) => (
                                        <div
                                            key={i}
                                            className="bg-white/50 rounded-xl p-3 border border-white/40"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-700 font-medium text-sm">
                                                    {metric.label}
                                                </span>
                                                <span className="font-bold text-primary">
                                                    {metric.value}
                                                    {metric.unit}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200/60 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${metric.color}`}
                                                    style={{
                                                        width: `${Math.min((metric.value! / metric.max) * 100, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                {batch.overallScore && (
                                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 text-center border border-primary/20">
                                        <div className="font-bold text-primary text-3xl">
                                            {batch.overallScore}%
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            Overall Quality Score
                                        </div>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <Typography variant="h4" className="font-bold text-gray-900 mb-3">
                                Certifications
                            </Typography>
                            <div className="space-y-2">
                                {batch.certifications?.length > 0 ? (
                                    batch.certifications.map((cert, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 bg-white/50 rounded-xl p-3 border border-white/40"
                                        >
                                            <FaCertificate className="text-accent" />
                                            <div>
                                                <div className="font-medium text-gray-800">{cert}</div>
                                                <div className="text-green-600 text-xs flex items-center gap-1">
                                                    <FaCheckCircle className="text-[10px]" /> Verified
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm">No certifications recorded.</p>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === 'documents' && (
                    <GlassCard>
                        <Typography variant="h4" className="font-bold text-gray-900 mb-4">
                            Export Documents
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { title: 'Certificate of Origin', key: 'coo', icon: FaFileAlt },
                                { title: 'Phytosanitary Certificate', key: 'phyto', icon: FaLeaf },
                                { title: 'Bill of Lading', key: 'billOfLading', icon: FaTruck },
                                { title: 'Packing List', key: 'packingList', icon: FaBox },
                                { title: 'Commercial Invoice', key: 'invoice', icon: FaFileAlt },
                                { title: 'Insurance Certificate', key: 'insurance', icon: FaShieldAlt },
                            ].map((doc, i) => {
                                const url = batch.documents?.[doc.key];
                                return (
                                    <div
                                        key={i}
                                        className={`rounded-xl p-4 border flex items-center justify-between ${
                                            url
                                                ? 'bg-green-50/60 border-green-200/60'
                                                : 'bg-white/50 border-white/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                                    url
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-gray-200 text-gray-400'
                                                }`}
                                            >
                                                <doc.icon className="text-sm" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800">
                                                    {doc.title}
                                                </div>
                                                <div className="text-[10px] text-gray-500">
                                                    {url ? 'Available' : 'Pending'}
                                                </div>
                                            </div>
                                        </div>
                                        {url && (
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-accent transition"
                                            >
                                                <FaDownload />
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>
                )}

                {/* FARMER TAB */}
                {activeTab === 'farmer' && (
                    <div className="space-y-4">
                        <BatchFarmerCard farmer={batch.farmer} />
                        {batch.supplier && (
                            <GlassCard>
                                <Typography
                                    variant="h4"
                                    className="font-bold text-gray-900 mb-4 flex items-center gap-2"
                                >
                                    <GiFarmer className="text-accent" /> Farm Network
                                </Typography>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {[
                                        { label: 'Supplier Type', value: batch.supplier.type, icon: GiFruitTree },
                                        { label: 'Farm OS Status', value: batch.supplier.farmOsStatus, icon: FaMobile },
                                        { label: 'Harvest Season', value: batch.supplier.season, icon: FaCalendarAlt },
                                        { label: 'Traceability Level', value: batch.supplier.traceLevel, icon: FaShieldAlt },
                                        { label: 'Cooperative', value: batch.supplier.cooperative || 'AfriNuts Owned', icon: GiFarmer },
                                    ].map((item, i) => {
                                        const Icon = item.icon;
                                        return (
                                            <div
                                                key={i}
                                                className="bg-white/50 rounded-xl p-3 border border-white/40 text-center"
                                            >
                                                <Icon className="text-accent text-lg mx-auto mb-1" />
                                                <div className="text-gray-500 text-[10px] uppercase tracking-wider">
                                                    {item.label}
                                                </div>
                                                <div className="text-primary font-semibold text-xs mt-0.5">
                                                    {item.value}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </GlassCard>
                        )}
                    </div>
                )}

                {/* MAP TAB */}
                {activeTab === 'map' && (
                    <GlassCard>
                        <Typography
                            variant="h4"
                            className="font-bold text-gray-900 mb-4 flex items-center gap-2"
                        >
                            <FaMapMarkerAlt className="text-accent" /> Location & Route
                        </Typography>
                        <BatchLocationMap
                            latitude={batch.latitude ?? 9.51}
                            longitude={batch.longitude ?? -7.5692}
                            farmName={batch.farmLocation || 'AfriNuts Farm'}
                            block={batch.block}
                            locationWithheld={locationWithheld}
                        />
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <FaMapMarkerAlt className="text-accent text-xs" />
                            <Typography variant="small" className="text-gray-600">
                                {displayLocation}
                            </Typography>
                        </div>
                    </GlassCard>
                )}

                {/* SIGNATURE TAB */}
                {activeTab === 'signature' && (
                    <div className="space-y-4">
                        <BatchSignatureCard
                            metadata={batch.farmOsMetadata}
                            signature={batch.digitalSignature}
                        />
                        <BatchSustainabilityCard sustainability={batch.sustainability} />
                    </div>
                )}
            </motion.div>
        </div>
    );
};