import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaTruck, FaBuilding,
    FaIndustry, FaFlask, FaCertificate, FaLeaf, FaChild, FaMobile,
    FaTree, FaShieldAlt, FaDatabase, FaClock, FaFileAlt, FaDownload,
    FaPrint, FaShare, FaChartBar, FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
import { GiFarmer, GiFruitTree, GiFactory, GiCargoShip } from 'react-icons/gi';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import BatchLocationMap from '@/components/BatchLocationMap/BatchLocationMap';

export interface MyBatch {
    id: string;
    batchId: string;
    harvestDate: string;
    farmLocation: string;
    block?: string;
    processingInfo?: string;
    processingFacility?: string;
    processingLocation?: string;
    processingMethod?: string;
    shellingMethod?: string;
    gradingMethod?: string;
    yieldPercentage?: number | null;
    certifications: string[];
    qualityGrade?: string;
    verificationCode?: string | null;
    digitalSignature?: { code: string; signedDate: string; signature: string; } | null;
    testResults?: { aflatoxin?: number; heavyMetals?: number; pesticideResidue?: number; };
    destination: string;
    buyer?: string;
    status: string;
    moistureContent?: number;
    nutCount?: number;
    kernelRatio?: number;
    defectiveRate?: number;
    overallScore?: number;
    kernelWeightKg?: number;
    rawWeightKg?: number;
    latitude?: number;
    longitude?: number;
    documents?: { coo?: string; phyto?: string; billOfLading?: string; packingList?: string; invoice?: string; insurance?: string; };
    farmer?: { name: string; role: string; photo: string; yearsFarming: string; location: string; bio: string; quote?: string; } | null;
    sustainability?: { noChildLabor: boolean; farmOsMonitored: boolean; firebreak: boolean; sustainableHarvesting: boolean; } | null;
    farmOsMetadata?: { recordId: string; created: string; lastUpdated: string; verificationStatus: string; };
    sourceType?: string;
}

interface BatchDossierCardProps {
    batch: MyBatch;
    index: number;
    total: number;
    onShare: (batchId: string) => void;
}

export const BatchDossierCard: React.FC<BatchDossierCardProps> = ({ batch, index, total, onShare }) => {
    const [activeTab, setActiveTab] = useState<'journey' | 'quality' | 'documents'>('journey');

    const status = batch.status;
    const isProcessing = status === 'Processing' || status === 'QUALITY_VERIFIED';
    const isShipped = status === 'Shipped' || status === 'SHIPPED';
    const isDelivered = status === 'Delivered' || status === 'DELIVERED';

    const journeySteps = [
        { icon: GiFruitTree, title: 'Farm', detail: batch.farmLocation || 'Odienné', sub: batch.block ? `Block ${batch.block}` : 'Main Farm', status: 'complete' },
        { icon: GiFactory, title: 'Process', detail: batch.processingFacility || 'AfriNuts NDC', sub: batch.qualityGrade ? `Grade: ${batch.qualityGrade}` : '', status: isProcessing || isShipped || isDelivered ? 'complete' : 'active' },
        { icon: FaCertificate, title: 'Certify', detail: batch.certifications?.[0] || 'Pending', sub: `${batch.certifications?.length || 0} certifications`, status: isShipped || isDelivered ? 'complete' : isProcessing ? 'active' : 'upcoming' },
        { icon: GiCargoShip, title: 'Ship', detail: batch.destination || 'Awaiting', sub: isShipped || isDelivered ? 'Via Abidjan' : 'Not yet shipped', status: isShipped || isDelivered ? 'complete' : 'upcoming' },
        { icon: FaBuilding, title: 'Deliver', detail: batch.buyer || batch.destination || 'Awaiting', sub: isDelivered ? '✓ Delivered' : isShipped ? 'In Transit' : 'Pending', status: isDelivered ? 'complete' : isShipped ? 'active' : 'upcoming' },
        { icon: FaFileAlt, title: 'Docs', detail: batch.documents && Object.values(batch.documents).some(Boolean) ? 'Export Ready' : 'Processing', sub: batch.documents && Object.values(batch.documents).filter(Boolean).length > 0 ? `${Object.values(batch.documents).filter(Boolean).length} documents` : 'Pending', status: isDelivered ? 'complete' : 'upcoming' },
    ];

    return (
        <div className="space-y-6">
            {/* The Batch Dossier Card */}
            <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl shadow-xl p-8 transform-gpu overflow-hidden">
                <div className="relative z-10">
                    <div className="text-center mb-8">
                        {total > 1 && <div className="text-gray-400 text-sm mb-1">Batch {index + 1} of {total}</div>}
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full">
                            <FaCheckCircle className="text-primary" />
                            <span className="font-mono text-lg font-bold text-primary">{batch.batchId}</span>
                        </div>
                        {batch.sourceType === 'OWN_FARM' && (
                            <span className="ml-3 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">AfriNuts Farm</span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            { label: 'Harvest Date', value: new Date(batch.harvestDate).toLocaleDateString(), icon: FaCalendarAlt },
                            { label: 'Farm Location', value: `${batch.farmLocation}${batch.block ? ` · ${batch.block}` : ''}`, icon: FaMapMarkerAlt },
                            { label: 'Destination', value: batch.destination || '—', icon: FaTruck },
                            { label: 'Receiving Company', value: batch.buyer || '—', icon: FaBuilding },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-center gap-2 mb-1"><item.icon className="text-accent text-sm" /><span className="text-gray-500 font-medium text-xs uppercase">{item.label}</span></div>
                                <div className="font-semibold text-gray-800">{item.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-2 mb-3"><FaIndustry className="text-accent text-sm" /><span className="text-gray-500 font-medium text-xs uppercase">Processing</span></div>
                            <div className="space-y-2">
                                {[
                                    { label: 'Facility', value: batch.processingFacility || '—' },
                                    { label: 'Method', value: batch.processingMethod || '—' },
                                    batch.yieldPercentage ? { label: 'Yield', value: `${batch.yieldPercentage}%` } : null,
                                ].filter(Boolean).map((item: any, i) => (
                                    <div key={i} className="flex justify-between text-sm"><span className="text-gray-500">{item.label}</span><span className="font-medium text-gray-700">{item.value}</span></div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-2 mb-3"><FaFlask className="text-accent text-sm" /><span className="text-gray-500 font-medium text-xs uppercase">Quality</span></div>
                            <div className="space-y-2">
                                {batch.testResults && [
                                    { label: 'Aflatoxin', value: `${batch.testResults.aflatoxin || '—'} ppb` },
                                    { label: 'Heavy Metals', value: `${batch.testResults.heavyMetals || '—'} ppb` },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm"><span className="text-gray-500">{item.label}</span><span className="font-medium text-gray-700">{item.value}</span></div>
                                ))}
                                <div className="pt-2 border-t border-gray-200/50 flex justify-between text-sm"><span className="text-gray-500">Score</span><span className="font-bold text-primary">{batch.overallScore?.toFixed(1)}%</span></div>
                            </div>
                        </div>
                    </div>

                    {batch.certifications && batch.certifications.length > 0 && (
                        <div className="mt-5 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-2 mb-2"><FaCertificate className="text-accent text-sm" /><span className="text-gray-500 font-medium text-xs uppercase">Certifications</span></div>
                            <div className="flex flex-wrap gap-2">{batch.certifications.map((cert, idx) => (<span key={idx} className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">{cert}</span>))}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Farmer Profile */}
            {batch.farmer && (
                <InfoCard icon={GiFarmer} title="Meet the Farmer" variant="primary" showInfoBadge={false}>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {batch.farmer.photo ? <img src={batch.farmer.photo} className="w-full h-full object-cover" /> : <GiFarmer className="text-2xl text-primary" />}
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">{batch.farmer.name}</div>
                            <div className="text-xs text-accent">{batch.farmer.role} · {batch.farmer.yearsFarming}</div>
                            <div className="text-xs text-gray-500 mt-1">{batch.farmer.location}</div>
                        </div>
                    </div>
                </InfoCard>
            )}

            {/* Sustainability */}
            {batch.sustainability && (
                <InfoCard icon={FaLeaf} title="Sustainability" variant="primary" showInfoBadge={false}>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {[
                            { icon: FaChild, label: 'No Child Labor', active: batch.sustainability.noChildLabor },
                            { icon: FaMobile, label: 'Farm OS Monitored', active: batch.sustainability.farmOsMonitored },
                            { icon: FaShieldAlt, label: 'Firebreak', active: batch.sustainability.firebreak },
                            { icon: FaTree, label: 'Sust. Harvest', active: batch.sustainability.sustainableHarvesting },
                        ].map((item, i) => (
                            <div key={i} className={`p-3 rounded-xl text-center text-xs border ${item.active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                <item.icon className={`mx-auto mb-1 ${item.active ? 'text-green-600' : 'text-gray-400'}`} />
                                {item.label} {item.active && '✓'}
                            </div>
                        ))}
                    </div>
                </InfoCard>
            )}

            {/* GPS Map */}
            {batch.latitude && batch.longitude && (
                <InfoCard icon={FaMapMarkerAlt} title="GPS Location" variant="primary" showInfoBadge={false}>
                    <BatchLocationMap latitude={batch.latitude} longitude={batch.longitude} farmName={batch.farmLocation} block={batch.block} />
                </InfoCard>
            )}

            {/* Digital Signature */}
            {batch.verificationCode && (
                <InfoCard icon={FaShieldAlt} title="Digital Signature" variant="accent" showInfoBadge={false}>
                    <div className="bg-white/50 rounded-lg p-3 text-center">
                        <div className="text-[10px] text-gray-500 uppercase">Verification Code</div>
                        <div className="font-mono text-primary font-bold">{batch.verificationCode}</div>
                    </div>
                </InfoCard>
            )}

            {/* Tabs: Journey, Quality, Documents */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
                <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                    {[{ key: 'journey' as const, icon: FaMapMarkerAlt, label: 'Journey' }, { key: 'quality' as const, icon: FaChartBar, label: 'Quality' }, { key: 'documents' as const, icon: FaFileAlt, label: 'Documents' }].map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>
                            <tab.icon className="text-xs" />{tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'journey' && (
                    <div className="hidden md:grid grid-cols-6 gap-4">
                        {journeySteps.map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 ${step.status === 'complete' ? 'border-green-500 bg-green-50 text-green-600' : step.status === 'active' ? 'border-accent bg-orange-50 text-accent animate-pulse' : 'border-gray-300 bg-gray-50 text-gray-400'}`}>
                                    <step.icon className="text-xl" />
                                </div>
                                <div className="font-bold text-primary text-xs">{step.title}</div>
                                <div className="text-gray-500 text-[10px] mt-1">{step.detail}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'quality' && (
                    <div className="text-center text-gray-500 text-sm">Quality metrics displayed above in the Dossier card.</div>
                )}

                {activeTab === 'documents' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            { title: 'Certificate of Origin', key: 'coo' }, { title: 'Phytosanitary', key: 'phyto' },
                            { title: 'Bill of Lading', key: 'billOfLading' }, { title: 'Packing List', key: 'packingList' },
                            { title: 'Invoice', key: 'invoice' }, { title: 'Insurance', key: 'insurance' },
                        ].map((doc, i) => {
                            const docUrl = batch.documents?.[doc.key as keyof typeof batch.documents];
                            return (
                                <div key={i} className="bg-white/50 rounded-xl p-3 border border-white/30">
                                    <div className="text-xs font-semibold text-gray-700 mb-1">{doc.title}</div>
                                    {docUrl ? <a href={docUrl} className="text-accent text-xs flex items-center gap-1"><FaDownload /> Download</a> : <span className="text-gray-400 text-xs">Pending</span>}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center gap-3">
                <div className="text-gray-500 text-sm">Batch {index + 1} of {total}</div>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="px-4 py-2 bg-white/50 border border-gray-200 rounded-full text-sm font-medium hover:bg-white/80 transition flex items-center gap-2"><FaPrint className="text-xs" /> Print</button>
                    <button onClick={() => onShare(batch.batchId)} className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-dark-orange transition flex items-center gap-2"><FaShare className="text-xs" /> Share</button>
                </div>
            </div>
        </div>
    );
};