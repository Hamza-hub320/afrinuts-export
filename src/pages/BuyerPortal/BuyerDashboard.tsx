import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaBox, FaShip, FaSearch, FaLeaf, FaSignOutAlt,
    FaChevronDown, FaChevronRight,
    FaCheckCircle, FaWeightHanging, FaCertificate
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import Section from '@/components/Section/Section';
import { staggerContainer } from '@/utils/animations';
import { getAdminData, getBuyerPortalData } from '@/services/api';
import { buyerLogout, onBuyerAuthChange } from '@/services/buyerAuth';
import type { User } from 'firebase/auth';

import { BatchDossier } from '@/components/buyer/BatchDossier';
import { BatchListItem } from '@/components/buyer/BatchListItem';

// ── Shared Types ──
export interface GatedFarmer {
    id?: number;
    name: string;
    role: string;
    bio: string | null;
    quote: string | null;
    yearsFarming: string | null;
    photo: string;
    location: string;
    traceLevel?: string | null;
    cooperative?: string | null;
    consentShared?: { identity: boolean; location: boolean; photo: boolean };
    identityWithheld?: boolean;
    locationWithheld?: boolean;
    photoWithheld?: boolean;
}

export interface MyBatch {
    id: string;
    batchId: string;
    harvestDate: string;
    processingDate?: string;
    farmLocation: string;
    block?: string;
    processingFacility?: string;
    processingMethod?: string;
    shellingMethod?: string;
    gradingMethod?: string;
    certifications: string[];
    qualityGrade?: string;
    digitalSignature?: any;
    qualityScore?: number;
    testResults?: any;
    destination: string;
    buyer?: string;
    status: string;
    moistureContent?: number;
    nutCount?: number;
    kernelRatio?: number;
    defectiveRate?: number;
    overallScore?: number;
    rawWeightKg?: number;
    kernelWeightKg?: number;
    latitude?: number | null;
    longitude?: number | null;
    documents?: Record<string, string | null | undefined>;
    farmer?: GatedFarmer;
    sustainability?: any;
    supplier?: any;
    farmOsMetadata?: any;
}

export interface MasterBatch {
    masterBatchNumber: string;
    shipmentName: string | null;
    buyer: string | null;
    destination: string | null;
    totalBatches: number;
    totalWeightKg: number;
    grades: string | null;
    exportDate: number | null;
}

export interface MasterGroup {
    master: MasterBatch;
    batches: MyBatch[];
}

export interface BuyerInfo {
    companyName: string;
    contactPerson: string;
}

export interface MyBatchesResponse {
    buyer?: BuyerInfo;
    batches?: MyBatch[];
    masters?: MasterBatch[];
    isBulk?: boolean;
    masterBatch?: MasterBatch | null;
}

// ── GlassCard (matches AdminBuyers) ──
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

const BuyerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [buyerInfo, setBuyerInfo] = useState<BuyerInfo | null>(null);
    const [response, setResponse] = useState<MyBatchesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Selection & Layout State
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
    const [openBulkIds, setOpenBulkIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const unsubscribe = onBuyerAuthChange(setUser);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBuyerPortalData('myBatches');
                if (data.error === 'not_a_buyer') {
                    try {
                        await getAdminData('admin_listBuyers');
                        navigate('/dashboard/buyers');
                        return;
                    } catch {
                        throw new Error('You do not have access to this portal.');
                    }
                }
                setBuyerInfo(data.buyer || null);
                setResponse(data as MyBatchesResponse);
            } catch (err: any) {
                setError(err.message || 'Failed to load your batches');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user, navigate]);

    // ── Data Normalization ──
    const { individualBatches, masterGroups, allBatchesForKpis } = useMemo(() => {
        if (!response) return { individualBatches: [], masterGroups: [], allBatchesForKpis: [] };
        let individual: MyBatch[] = response.batches || [];
        let groups: MasterGroup[] = [];

        if (response.masters && Array.isArray(response.masters)) {
            groups = (response.masters as any[]).map((m: any) => ({ master: m, batches: m.batches || [] }));
        } else if (response.isBulk && response.masterBatch) {
            groups = [{ master: response.masterBatch, batches: response.batches || [] }];
            individual = [];
        }

        const allBatches = [...individual, ...groups.flatMap(g => g.batches)];
        return { individualBatches: individual, masterGroups: groups, allBatchesForKpis: allBatches };
    }, [response]);

    // Auto-select first batch and open first bulk
    useEffect(() => {
        if (allBatchesForKpis.length > 0 && !selectedBatchId) {
            setSelectedBatchId(allBatchesForKpis[0].id);
        }
        if (masterGroups.length > 0 && openBulkIds.size === 0) {
            setOpenBulkIds(new Set([masterGroups[0].master.masterBatchNumber]));
        }
    }, [allBatchesForKpis, masterGroups]);

    // Filter logic for search
    const filteredMasters = masterGroups.filter(g =>
        !searchQuery ||
        g.master.masterBatchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.batches.some(b => b.batchId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const filteredIndividuals = individualBatches.filter(b =>
        !searchQuery || b.batchId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedBatch = allBatchesForKpis.find(b => b.id === selectedBatchId) || null;

    // Derived KPIs
    const totalWeight = allBatchesForKpis.reduce((s, b) => s + (b.rawWeightKg || 0), 0);
    const premiumCount = allBatchesForKpis.filter(b => b.qualityGrade === 'PREMIUM').length;
    const premiumPct = allBatchesForKpis.length > 0 ? Math.round((premiumCount / allBatchesForKpis.length) * 100) : 0;

    const handleLogout = async () => {
        await buyerLogout();
        navigate('/portal/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-b-2 border-primary rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-6 bg-white rounded-xl shadow-md text-red-600">{error}</div>
        </div>
    );

    return (
        <div className="min-h-screen pt-[72px] bg-gray-50/50 font-sans">
            <Section className="py-6">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6">

                    {/* ── HERO & KPIs ── */}
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-8">
                        <GlassCard className="!p-0">
                            <div className="p-6 md:p-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative overflow-hidden">
                                {/* Pattern overlay */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-30 mix-blend-overlay pointer-events-none" />

                                <div className="relative z-10 lg:w-1/3">
                                    <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-2 text-xs font-bold">
                                        Your Shipments
                                    </Typography>
                                    <Typography variant="h2" className="text-3xl md:text-4xl font-display text-gray-900 mb-2">
                                        Track your cashew shipments
                                    </Typography>
                                    <Typography variant="body" className="text-gray-600 text-sm">
                                        Complete transparency from farm to port. Verify quality, origin and impact.
                                    </Typography>

                                    {/* Sign-out — bottom of hero copy on mobile, inline with text on desktop */}
                                    <button
                                        onClick={handleLogout}
                                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-white hover:text-red-600 transition"
                                    >
                                        <FaSignOutAlt className="text-xs" />
                                        Sign Out
                                    </button>
                                </div>

                                <div className="relative z-10 flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                    {/* KPI 1 */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-blue-50 text-accent rounded-md"><FaBox size={14} /></div>
                                            <span className="text-xs text-gray-500 font-medium">Total Shipments</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{allBatchesForKpis.length}</div>
                                        <div className="text-[10px] text-green-600 font-medium mt-1">↑ Updated today</div>
                                    </div>

                                    {/* KPI 2 */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-indigo-50 text-accent rounded-md"><FaWeightHanging size={14} /></div>
                                            <span className="text-xs text-gray-500 font-medium">Total Weight</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{(totalWeight / 1000).toFixed(1)} MT</div>
                                        <div className="text-[10px] text-primary font-medium mt-1">↑ Verified weights</div>
                                    </div>

                                    {/* KPI 3 */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-emerald-50 text-primary rounded-md"><FaCertificate size={14} /></div>
                                            <span className="text-xs text-gray-500 font-medium">Avg. Quality Grade</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">Premium</div>
                                        <div className="text-[10px] text-green-600 font-medium mt-1">{premiumPct}% premium grade</div>
                                    </div>

                                    {/* KPI 4 */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="p-1.5 bg-green-50 text-green-600 rounded-md"><FaLeaf size={14} /></div>
                                            <span className="text-xs text-gray-500 font-medium">Origin</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">Côte d'Ivoire</div>
                                        <div className="text-[10px] text-primary font-medium mt-1">100% traceable</div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* ── SPLIT LAYOUT: Sidebar + Detail ── */}
                    {allBatchesForKpis.length === 0 ? (
                        <GlassCard>
                            <div className="text-center py-16">
                                <FaBox className="text-4xl text-primary/40 mx-auto mb-4" />
                                <Typography variant="h4" className="text-gray-900 mb-2">No shipments yet</Typography>
                                <Typography variant="body" className="text-gray-500">
                                    We'll notify you when your first shipment is processed.
                                </Typography>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

                            {/* ── LEFT SIDEBAR ── */}
                            <aside className="lg:sticky lg:top-[90px] lg:max-h-[calc(100vh-120px)]">
                                <GlassCard className="!p-0 flex flex-col max-h-[calc(100vh-120px)]">
                                    <div className="p-4 border-b border-white/30">
                                        <div className="flex justify-between items-center mb-4">
                                            <Typography variant="h4" className="font-bold text-gray-900">
                                                Your Shipments
                                            </Typography>
                                        </div>
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                                            <input
                                                type="text"
                                                placeholder="Search batch ID..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 bg-white/60 border border-white/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-hide">
                                        {/* Bulk Groups */}
                                        {filteredMasters.map((group) => {
                                            const isOpen = openBulkIds.has(group.master.masterBatchNumber);
                                            return (
                                                <div key={group.master.masterBatchNumber} className="bg-blue-50/60 backdrop-blur-sm rounded-xl border border-blue-200/60 overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            setOpenBulkIds(prev => {
                                                                const next = new Set(prev);
                                                                next.has(group.master.masterBatchNumber)
                                                                    ? next.delete(group.master.masterBatchNumber)
                                                                    : next.add(group.master.masterBatchNumber);
                                                                return next;
                                                            });
                                                        }}
                                                        className="w-full flex items-center justify-between p-3 hover:bg-blue-100/40 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                                                <FaShip size={14} />
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="font-mono text-sm font-bold text-blue-900">
                                                                    {group.master.masterBatchNumber}
                                                                </div>
                                                                <div className="text-[11px] text-blue-700">
                                                                    {group.batches.length} batches · {((group.master.totalWeightKg || 0) / 1000).toFixed(1)}T
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {isOpen ? (
                                                            <FaChevronDown className="text-blue-500 text-xs" />
                                                        ) : (
                                                            <FaChevronRight className="text-blue-500 text-xs" />
                                                        )}
                                                    </button>

                                                    {isOpen && (
                                                        <div className="p-2 space-y-1 bg-white/50">
                                                            {group.batches.map(b => (
                                                                <BatchListItem
                                                                    key={b.id}
                                                                    batch={b}
                                                                    isSelected={selectedBatchId === b.id}
                                                                    onClick={() => setSelectedBatchId(b.id)}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Individual Batches */}
                                        {filteredIndividuals.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 px-2 mb-2 mt-4">
                                                    <FaBox className="text-gray-400 text-xs" />
                                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                                        Individual Batches
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    {filteredIndividuals.map(b => (
                                                        <BatchListItem
                                                            key={b.id}
                                                            batch={b}
                                                            isSelected={selectedBatchId === b.id}
                                                            onClick={() => setSelectedBatchId(b.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-green-50/70 backdrop-blur-sm border-t border-green-200/60">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <FaCheckCircle className="text-green-600 text-xs" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-green-900">
                                                    All shipments are 100% traceable
                                                </div>
                                                <div className="text-[10px] text-green-700">
                                                    From our farmers to your facility.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </aside>

                            {/* ── RIGHT DOSSIER ── */}
                            <main className="min-w-0">
                                {selectedBatch ? (
                                    <BatchDossier batch={selectedBatch} />
                                ) : (
                                    <GlassCard>
                                        <div className="flex flex-col items-center justify-center p-12 text-center">
                                            <FaSearch className="text-3xl text-primary/30 mb-4" />
                                            <Typography variant="h4" className="text-gray-900 mb-1">
                                                Select a shipment
                                            </Typography>
                                            <Typography variant="body" className="text-gray-500">
                                                Choose a batch from the list to view its full dossier.
                                            </Typography>
                                        </div>
                                    </GlassCard>
                                )}
                            </main>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
};

export default BuyerDashboard;