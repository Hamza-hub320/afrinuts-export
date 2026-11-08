import React, {useEffect, useState, Fragment, useMemo} from 'react';
import { motion } from 'framer-motion';
import { computeSupplierMetrics } from '@/utils/supplierMetrics';
import { detectDevelopmentOpportunities } from '@/utils/supplierDevelopment';
import {
    FaUsers, FaStar, FaBox, FaCheckCircle, FaTimesCircle,
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaSeedling,
    FaSearch, FaChevronDown, FaTimes, FaFileAlt, FaChartBar,
    FaLeaf, FaFireExtinguisher, FaChild, FaHandshake,
    FaTractor, FaCalendarAlt, FaDollarSign, FaIndustry,
    FaAward, FaUser, FaTrophy, FaChartLine, FaHome, FaShieldAlt, FaCamera, FaExclamationTriangle, FaHistory
} from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import DashboardNavbar from '@/components/DashboardNavbar/DashboardNavbar';
import Section from '@/components/Section/Section';
import { fadeIn, staggerContainer } from '@/utils/animations';
import { getSupplierData } from '../services/api';
import { Dialog, Transition } from '@headlessui/react';
import SupplierMap from '@/components/SupplierMap/SupplierMap';
import Sparkline from '@/components/Sparkline/Sparkline';
import { computeTrustScore, TrustResult } from '@/utils/trustScore';
import {GiFarmer} from "react-icons/gi";
import {TrustPanel} from "@/components/TrustBadge/TrustPanel";
import {TrustBadge} from "@/components/TrustBadge/TrustBadge";

interface Supplier {
    id: string;
    name: string;
    type: string;
    status: string;

    // Identity & contact (captured)
    contactPerson: string;
    phone: string;
    email: string;
    location: string;
    region?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    hasLocation?: boolean;

    // Business identity (captured)
    registrationNumber?: string;
    taxId?: string;
    farmerIdNumber?: string;
    farmSize?: number;
    yearsFarming?: number;
    isCertified: boolean;
    certificationType?: string;
    certificationNumber?: string;
    certificationExpiryDate?: number;

    // Sustainability declarations (captured at onboarding)
    firebreakProtection?: boolean;
    noChildLabor?: boolean;
    sustainableHarvesting?: boolean;

    // Data consent (captured)
    dataConsentGiven?: boolean;
    dataConsentScope?: string[];
    dataConsentSignedBy?: string;
    dataConsentVersion?: string;
    dataConsentWithdrawnDate?: number | null;
    dataConsentWithdrawnReason?: string | null;

    // Profile
    photoUrl?: string;
    bio?: string;
    quote?: string;
    rating?: number;
    notes?: string;

    isActive: boolean;
}

interface QualityBatch {
    id: string;
    batchNumber: string;
    supplierId: number;
    weightKg: number;
    qualityGrade: string;
    qualityScore: number;
    moistureContent: number;
    defectiveRate: number;
    kernelRatio: number;
    nutCountPerKg: number;
    processingDate: number;
    testResults?: string;
    sustainableHarvesting?: boolean;
    firebreakProtection?: boolean;
    noChildLabor?: boolean;
    farmOsMonitored?: boolean;  // ADD
    verifiedAt?: number;        // ADD
}

const SupplierManagement: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [batchesBySupplier, setBatchesBySupplier] = useState<Record<string, any[]>>({});
    const [commitmentsBySupplier, setCommitmentsBySupplier] = useState<Record<string, any[]>>({});
    const [inspectionsBySupplier, setInspectionsBySupplier] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [supplierBatches, setSupplierBatches] = useState<QualityBatch[]>([]);
    const [supplierFinancials, setSupplierFinancials] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'quality' | 'financials'>('profile');
    const [modalLoading, setModalLoading] = useState(false);
    const [gradeDistribution, setGradeDistribution] = useState<{ grade: string; count: number }[]>([]);
    const [supplierTrend, setSupplierTrend] = useState<number[]>([]);
    const [unvalidated, setUnvalidated] = useState({ commitments: [], inspections: [] });
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [pendingCommitments, setPendingCommitments] = useState<any[]>([]);
    const [pendingInspections, setPendingInspections] = useState<any[]>([]);
    const [openDisputes, setOpenDisputes] = useState<any[]>([]);

    const isDevelopment = import.meta.env.DEV;

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const [data, disputesRes] = await Promise.all([
                    getSupplierData('getSuppliersWithTrust'),
                    getSupplierData('getOpenDisputes'),
                ]);
                setSuppliers(data.suppliers || []);
                setBatchesBySupplier(data.batchesBySupplier || {});
                setCommitmentsBySupplier(data.commitmentsBySupplier || {});
                setInspectionsBySupplier(data.inspectionsBySupplier || {});
                setPendingCommitments(data.pendingCommitments || []);
                setPendingInspections(data.pendingInspections || []);
                setOpenDisputes(disputesRes.disputes || []);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, []);

    const handleValidate = async (
        collection: 'supplier_commitments' | 'supplier_inspections',
        docId: string
    ) => {
        try {
            await getSupplierData('validateEvidence', {
                collection,
                docId,
                userId: 'portal-manager',
                farmId: '1',
            });

            // Remove from queue optimistically so the UI feels instant
            if (collection === 'supplier_commitments') {
                setPendingCommitments(prev => prev.filter(c => c.id !== docId));
            } else {
                setPendingInspections(prev => prev.filter(i => i.id !== docId));
            }

            // Force a full refresh to update the Trust Engine inputs
            // This ensures the item actually moved from "pending" to "validated"
            const data = await getSupplierData('getSuppliersWithTrust');
            setSuppliers(data.suppliers || []);
            setBatchesBySupplier(data.batchesBySupplier || {});
            setCommitmentsBySupplier(data.commitmentsBySupplier || {});
            setInspectionsBySupplier(data.inspectionsBySupplier || {});
            setPendingCommitments(data.pendingCommitments || []);
            setPendingInspections(data.pendingInspections || []);

        } catch (error) {
            console.error('Validation failed:', error);
            alert('Failed to validate. Check the console for details.');
        }
    };

    const handleResolveDispute = async (disputeId: string, resolution: 'UPHELD' | 'REJECTED') => {
        try {
            await getSupplierData('resolveDispute', {
                disputeId,
                resolution,
                reviewedBy: 'portal-manager',
            });
            setOpenDisputes(prev => prev.filter(d => d.id !== disputeId));
        } catch (error) {
            console.error('Failed to resolve dispute:', error);
        }
    };

    const trustBySupplier = useMemo(() => {
        const map: Record<string, TrustResult> = {};
        suppliers.forEach(s => {
            map[s.id] = computeTrustScore({
                supplier: {
                    ...s,
                    isActive: s.isActive ?? s.status === 'ACTIVE',
                },
                batches: batchesBySupplier[s.id] || [],
                commitments: commitmentsBySupplier[s.id] || [],
                inspections: inspectionsBySupplier[s.id] || [],
            });
        });
        return map;
    }, [suppliers, batchesBySupplier, commitmentsBySupplier, inspectionsBySupplier]);

    const developmentOpportunities = useMemo(() => {
        return detectDevelopmentOpportunities(suppliers, batchesBySupplier, trustBySupplier);
    }, [suppliers, batchesBySupplier, trustBySupplier]);

    const openSupplierDetail = async (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setModalLoading(true);
        setActiveTab('profile');
        try {
            const [batchesData, financialsData] = await Promise.all([
                getSupplierData('getSupplierQualityBatches', { supplierId: supplier.id }),
                getSupplierData('getSupplierFinancials', { supplierId: supplier.id }),
            ]);
            const batches = batchesData.batches || [];
            setSupplierBatches(batches);
            setSupplierFinancials(financialsData);

            // Compute trend from batches
            const last5Batches = batches.slice(0, 5);
            const trendScores = last5Batches
                .map((b: any) => b.rcnQualityScore ?? b.qualityScore)
                .filter((v: number | undefined): v is number => typeof v === 'number' && v > 0)
                .reverse();
            setSupplierTrend(trendScores);
        } catch (error) {
            console.error('Error fetching supplier details:', error);
        } finally {
            setModalLoading(false);
        }
    };

    const metricsBySupplier = useMemo(() => {
        const map: Record<string, ReturnType<typeof computeSupplierMetrics>> = {};
        suppliers.forEach(s => {
            map[s.id] = computeSupplierMetrics(
                s,
                batchesBySupplier[s.id] || [],
                trustBySupplier[s.id]
            );
        });
        return map;
    }, [suppliers, batchesBySupplier, trustBySupplier]);

    const filteredSuppliers = suppliers.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase());
        let matchType = false;
        if (filterType === 'All') matchType = true;
        else if (filterType === 'BUYER_READY') matchType = !!(s.dataConsentGiven && s.status === 'ACTIVE');
        else matchType = s.type === filterType || s.status === filterType;
        return matchSearch && matchType;
    });

    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'ACTIVE').length;
    const avgQualityScore = (() => {
        const values = Object.values(metricsBySupplier)
            .map(m => m.averageRcnQualityScore)
            .filter((v): v is number => v !== null);
        return values.length > 0
            ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
            : '—';
    })();

    const totalVolume = Object.values(metricsBySupplier)
        .reduce((sum, m) => sum + m.annualVolumeKg, 0);

    const handleRecalculateAll = async () => {
        if (isRecalculating) return;
        setIsRecalculating(true);

        let successCount = 0;

        try {
            for (const s of suppliers) {
                const trust = trustBySupplier[s.id];

                // Skip suppliers who don't have enough evidence to generate an overall score yet
                if (!trust || trust.overall === null) continue;

                await getSupplierData('saveScoreSnapshot', {
                    supplierId: s.id,
                    snapshotData: {
                        overall: trust.overall,
                        confidence: trust.confidence,
                        verifiedTransactions: trust.verifiedTransactions,
                        dimensions: trust.dimensions,
                        weightsUsed: trust.weights,
                        scoringVersion: trust.scoringVersion,
                        evidenceRefs: {
                            batchIds: (batchesBySupplier[s.id] || []).map((b: any) => b.id),
                        },
                    },
                });
                successCount++;
            }

            alert(`Successfully snapshotted ${successCount} supplier scores.`);
        } catch (error) {
            console.error('Failed to save snapshots:', error);
            alert('An error occurred while snapshotting scores.');
        } finally {
            setIsRecalculating(false);
        }
    };

    if (loading) {
        return (
            <main>
                <Section className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <DashboardNavbar />
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <GiFarmer className="text-primary text-3xl" />
                            </div>
                        </div>
                    </div>
                </Section>
            </main>
        );
    }

    const typeFilters = [
        'All',
        'OWN_FARM',
        'COOPERATIVE',
        'REGIONAL_SUPPLIER',
        'INDEPENDENT',
        'COMMERCIAL_AGGREGATOR',
        'PROCESSOR',
        'ACTIVE',
        'INACTIVE',
        'BUYER_READY'
    ];

    const gradeStyle = (grade: string): string => {
        if (grade === 'PREMIUM')  return 'bg-amber-100 text-amber-700';
        if (grade === 'REJECT')   return 'bg-red-100 text-red-700';
        return 'bg-blue-100 text-blue-700';   // STANDARD
    };

    return (
        <div className="min-h-screen relative overflow-hidden pt-[72px]">
            <DashboardNavbar />

            {/* Hero Header */}
            <Section
                fullHeight={false}
                className="flex items-center justify-center text-center min-h-[40vh] relative"
            >
                <motion.div
                    className="max-w-4xl px-6 sm:px-8 py-12"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeIn}>
                        <Typography variant="subhead" className="uppercase tracking-widest text-primary mb-4">
                            <FaUsers className="inline mr-3 text-accent" />
                            Supplier & Partner Network
                        </Typography>
                    </motion.div>
                    <motion.h1
                        className="font-display text-4xl md:text-5xl lg:text-6xl text-text-dark mb-6 leading-tight"
                        variants={fadeIn}
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Supplier Management
                    </motion.h1>
                    <motion.div variants={fadeIn}>
                        <motion.div variants={fadeIn}>
                            <Typography variant="lead" className="text-text-dark max-w-3xl mx-auto">
                                Decide who to trust, and why. Every supplier is scored on quality, traceability,
                                sustainability, compliance and cooperation — with the evidence behind each score
                                visible, and confidence stated separately from performance.
                            </Typography>
                            <Typography variant="small" className="text-gray-500 max-w-2xl mx-auto mt-3">
                                Capacity is shown separately from trust. Missing evidence lowers confidence, not the score.
                            </Typography>

                            {/* ADD THE BUTTON HERE */}
                            <motion.button
                                onClick={handleRecalculateAll}
                                disabled={isRecalculating}
                                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-white/60 border border-primary/30 text-primary hover:bg-primary hover:text-white rounded-full text-sm font-medium transition-all duration-300 shadow-sm backdrop-blur-sm disabled:opacity-50"
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FaHistory className={isRecalculating ? "animate-spin" : ""} />
                                {isRecalculating ? 'Recalculating...' : 'Recalculate & Snapshot Scores'}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Supply Intelligence Banner */}
            <Section className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <InfoCard
                            icon={FaChartLine}
                            title="Supply Intelligence"
                            subtitle="Transforming supplier data into procurement foresight"
                            iconColor="text-accent"
                            showInfoBadge={false}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {totalVolume > 0 ? `${(totalVolume / 1000).toFixed(0)}T` : '—'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Estimated Network Capacity</div>
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        {Object.values(metricsBySupplier).filter(m => m.annualVolumeKg > 0).length} supplier{
                                        Object.values(metricsBySupplier).filter(m => m.annualVolumeKg > 0).length !== 1 ? 's' : ''
                                    } with volume data
                                    </div>
                                </div>
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {suppliers.length > 0
                                            ? `${suppliers.filter(s => (s.yearsFarming ?? 0) >= 10).length}/${suppliers.length}`
                                            : '—'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Experienced Farmers (10+ yrs)</div>
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        Institutional knowledge in the network
                                    </div>
                                </div>
                                <div className="bg-white/40 rounded-xl p-4 border border-white/30 text-center">
                                    <div className="text-2xl font-bold text-amber-600">
                                        {(() => {
                                            // A supplier is "Premium-Grade" if ≥50% of their inspected batches carry the PREMIUM grade
                                            const premiumSuppliers = suppliers.filter(s => {
                                                const supplierBatches = (batchesBySupplier[s.id] || [])
                                                    .filter(b => b.qualityGrade);   // only graded batches
                                                if (supplierBatches.length === 0) return false;
                                                const premiumCount = supplierBatches.filter(b => b.qualityGrade === 'PREMIUM').length;
                                                return premiumCount / supplierBatches.length >= 0.5;
                                            });
                                            return suppliers.length > 0
                                                ? `${premiumSuppliers.length}/${suppliers.length}`
                                                : '—';
                                        })()}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Premium-Grade Suppliers</div>
                                    <div className="text-[10px] text-gray-400 mt-1">
                                        {(() => {
                                            const premiumSuppliers = suppliers.filter(s => {
                                                const supplierBatches = (batchesBySupplier[s.id] || [])
                                                    .filter(b => b.qualityGrade);
                                                if (supplierBatches.length === 0) return false;
                                                const premiumCount = supplierBatches.filter(b => b.qualityGrade === 'PREMIUM').length;
                                                return premiumCount / supplierBatches.length >= 0.5;
                                            });
                                            const suppliersWithGradedBatches = suppliers.filter(s =>
                                                (batchesBySupplier[s.id] || []).some(b => b.qualityGrade)
                                            ).length;

                                            if (suppliersWithGradedBatches === 0) return 'No graded batches yet';
                                            if (premiumSuppliers.length === suppliersWithGradedBatches &&
                                                suppliersWithGradedBatches === suppliers.length) {
                                                return 'All suppliers majority-premium';
                                            }
                                            return 'Tracking toward full premium network';
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg text-xs text-gray-600 text-center">
                                <FaChartLine className="inline mr-1 text-primary" />
                                Every delivery, every quality check, every supplier relationship builds this intelligence.
                                The more data that flows in, the more accurately we can forecast procurement before harvest begins.
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            {/* KPI Cards */}
            <Section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeIn}>
                            <InfoCard icon={FaUsers} title={String(totalSuppliers)} subtitle="Total Suppliers" iconColor="text-accent" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.1 }}>
                            <InfoCard icon={FaCheckCircle} title={String(activeSuppliers)} subtitle="Active Suppliers" iconColor="text-green-600" showInfoBadge={false} />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.2 }}>
                            <InfoCard
                                icon={FaStar}
                                title={(() => {
                                    const scores = Object.values(trustBySupplier)
                                        .map(t => t.overall)
                                        .filter((v): v is number => v !== null);
                                    return scores.length > 0
                                        ? `${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)}`
                                        : '—';
                                })()}
                                subtitle="Avg. Trust Score"
                                iconColor="text-yellow-500"
                                showInfoBadge={false}
                            />
                        </motion.div>
                        <motion.div variants={fadeIn} transition={{ delay: 0.3 }}>
                            <InfoCard icon={FaBox} title={`${(totalVolume / 1000).toFixed(0)}T`} subtitle="Annual Volume" iconColor="text-primary" showInfoBadge={false} />
                        </motion.div>
                    </motion.div>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative w-full sm:min-w-[280px] sm:max-w-sm">
                            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search suppliers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 bg-white/60 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {typeFilters.map(type => (
                                <motion.button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        filterType === type
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-gray-200'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {type === 'All' ? 'All Types' : type.replace(/_/g, ' ')}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Supplier Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSuppliers.map((supplier, idx) => (
                            <motion.div
                                key={supplier.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => openSupplierDetail(supplier)}
                                className="cursor-pointer"
                            >
                                <InfoCard
                                    title={supplier.name}
                                    subtitle={`${supplier.type?.replace(/_/g, ' ')} · ${supplier.location}`}
                                    icon={supplier.type === 'OWN_FARM' ? FaHome : FaUsers}
                                    iconColor={supplier.type === 'OWN_FARM' ? 'text-green-600' : 'text-accent'}
                                    showInfoBadge={false}
                                    className={`h-full hover:shadow-lg transition-all ${supplier.type === 'OWN_FARM' ? 'border-green-400/30 ring-1 ring-green-400/20' : ''}`}
                                >
                                    {/* OWN FARM Badge */}
                                    {supplier.type === 'OWN_FARM' && (
                                        <div className="mb-2">
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center gap-1 w-fit">
                                             <FaStar className="text-[10px]" />
                                                     Own Farm
                                        </span>
                                        </div>
                                    )}

                                    {/* Trust Badge */}
                                    <div className="mt-3 mb-2">
                                        <TrustBadge trust={trustBySupplier[supplier.id]} compact />
                                    </div>

                                    <div className="flex items-center gap-2 mt-3">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">RCN Quality: {metricsBySupplier[supplier.id]?.averageRcnQualityScore != null
                                            ? `${metricsBySupplier[supplier.id].averageRcnQualityScore!.toFixed(1)}`
                                            : '—'}
                                    </span>
                                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">{metricsBySupplier[supplier.id]?.annualVolumeKg > 0 ? `${(metricsBySupplier[supplier.id].annualVolumeKg / 1000).toFixed(1)}T` : 'No batches'}
                                    </span>
                                    </div>
                                    {/* Rejection Rate — only shown when supplier has rejected batches */}
                                    {metricsBySupplier[supplier.id]?.rejectionRate != null
                                        && metricsBySupplier[supplier.id].rejectionRate! > 0 && (
                                            <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${metricsBySupplier[supplier.id].rejectionRate! > 10 ? 'bg-red-100 text-red-700' : 'bg-amber-50 text-amber-700'}`}>Rejection: {metricsBySupplier[supplier.id].rejectionRate!.toFixed(0)}%</span>
                                            </div>
                                        )}
                                    {metricsBySupplier[supplier.id]?.rejectBatches > 0 && (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                            {metricsBySupplier[supplier.id].rejectBatches} rejected batch{
                                            metricsBySupplier[supplier.id].rejectBatches !== 1 ? 'es' : ''
                                            }
                                        </span>
                                    )}
                                    <div className="flex gap-2 mt-2">
                                        {supplier.sustainableHarvesting && (
                                            <span className="text-green-600 text-xs flex items-center gap-1"><FaLeaf /> Sustainable</span>
                                        )}
                                        {supplier.firebreakProtection && (
                                            <span className="text-orange-500 text-xs flex items-center gap-1"><FaFireExtinguisher /> Firebreak</span>
                                        )}
                                        {supplier.noChildLabor && (
                                            <span className="text-blue-500 text-xs flex items-center gap-1"><FaChild /> No Child Labor</span>
                                        )}
                                        {supplier.dataConsentGiven ? (
                                            <span className="text-primary text-xs flex items-center gap-1" title={`Scopes: ${supplier.dataConsentScope?.join(', ')}`}><FaShieldAlt /> Consent</span>
                                        ) : (
                                            <span className="text-amber-500 text-xs flex items-center gap-1" title="No data consent on record">
                                            <FaShieldAlt /> No Consent
                                             </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                        <FaPhone className="text-[10px]" /> {supplier.phone}
                                    </div>
                                </InfoCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Consent & Data Trust */}
            <Section className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                        <InfoCard
                            icon={FaShieldAlt}
                            title="Consent & Data Trust"
                            subtitle="Farmer data is held in trust — shared with buyers only where consent is recorded"
                            iconColor="text-primary"
                            showInfoBadge={false}
                        >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                {(() => {
                                    const withConsent = suppliers.filter(s => s.dataConsentGiven).length;
                                    const total = suppliers.length;
                                    const pct = total > 0 ? (withConsent / total) * 100 : 0;
                                    const locationConsent = suppliers.filter(s => s.dataConsentScope?.includes('location')).length;
                                    const identityConsent = suppliers.filter(s => s.dataConsentScope?.includes('identity')).length;
                                    const photoConsent = suppliers.filter(s => s.dataConsentScope?.includes('photo')).length;

                                    return [
                                        { label: 'Consent Coverage', value: `${withConsent}/${total}`, pct, icon: FaShieldAlt, color: 'text-primary', hint: `${pct.toFixed(0)}% of network` },
                                        { label: 'Identity Shared', value: `${identityConsent}/${total}`, icon: FaUser, color: 'text-accent', hint: 'Name visible to buyers' },
                                        { label: 'Location Shared', value: `${locationConsent}/${total}`, icon: FaMapMarkerAlt, color: 'text-green-600', hint: 'GPS visible to buyers' },
                                        { label: 'Photo Shared', value: `${photoConsent}/${total}`, icon: FaCamera, color: 'text-blue-500', hint: 'Photo visible to buyers' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/40 rounded-xl p-3 border border-white/30 text-center">
                                            <item.icon className={`text-xl mx-auto ${item.color}`} />
                                            <div className="text-lg font-bold mt-1">{item.value}</div>
                                            <div className="text-xs text-gray-500">{item.label}</div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">{item.hint}</div>
                                        </div>
                                    ));
                                })()}
                            </div>

                            {/* ============================================
                                Evidence Validation Queue (P1)
                             ============================================ */}
                            {(pendingCommitments.length > 0 || pendingInspections.length > 0) && (
                                <Section className="py-6">
                                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                                            <InfoCard
                                                icon={FaShieldAlt}
                                                title="Evidence Validation Queue"
                                                subtitle={`${pendingCommitments.length + pendingInspections.length} record${pendingCommitments.length + pendingInspections.length !== 1 ? 's' : ''} awaiting review`}
                                                iconColor="text-amber-600"
                                                showInfoBadge={false}
                                            >
                                                {pendingCommitments.length > 0 && (
                                                    <div className="mt-3">
                                                        <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                                                            <FaHandshake /> Commitments ({pendingCommitments.length})
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {pendingCommitments.map(c => {
                                                                const supplier = suppliers.find(s => s.id === String(c.supplierId));
                                                                return (
                                                                    <div key={c.id} className="bg-white/40 rounded-xl p-3 border border-white/30 flex items-center gap-3">
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-900 truncate">
                                                        {supplier?.name || `Supplier #${c.supplierId}`}
                                                    </span>
                                                                                <span className="text-[10px] text-gray-500">
                                                        {c.contractId} · {c.season}
                                                    </span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-600 mt-0.5">
                                                                                {c.committedKg} kg committed · {c.status}
                                                                                {c.delayReason && ` · Delay: ${c.delayReason}`}
                                                                                {c.buyerRequestedChange && ` · Buyer-requested`}
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleValidate('supplier_commitments', c.id)}
                                                                            className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-full hover:bg-dark-orange transition-colors flex-shrink-0"
                                                                        >
                                                                            Validate
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {pendingInspections.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                                                            <FaCheckCircle /> Inspections ({pendingInspections.length})
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {pendingInspections.map(i => {
                                                                const supplier = suppliers.find(s => s.id === String(i.supplierId));
                                                                return (
                                                                    <div key={i.id} className="bg-white/40 rounded-xl p-3 border border-white/30 flex items-center gap-3">
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-900 truncate">
                                                        {supplier?.name || `Supplier #${i.supplierId}`}
                                                    </span>
                                                                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                                                                    i.outcome === 'PASS' ? 'bg-green-100 text-green-700' :
                                                                                        i.outcome === 'FAIL' ? 'bg-red-100 text-red-700' :
                                                                                            'bg-amber-100 text-amber-700'
                                                                                }`}>
                                                        {i.outcome}
                                                    </span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-600 mt-0.5">
                                                                                {i.inspectionType} · {i.findings}
                                                                            </p>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleValidate('supplier_inspections', i.id)}
                                                                            className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-full hover:bg-dark-orange transition-colors flex-shrink-0"
                                                                        >
                                                                            Validate
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                <p className="text-[10px] text-gray-400 mt-4 text-center">
                                                    Validated records feed the Trust Engine. Delivery shows "Awaiting validated commitments" until a commitment is validated.
                                                </p>
                                            </InfoCard>
                                        </motion.div>
                                    </div>
                                </Section>
                            )}

                            {/* ============================================
                                Dispute Review Queue (Step 6c)
                                ============================================ */}
                            {openDisputes.length > 0 && (
                                <Section className="py-6">
                                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                                            <InfoCard
                                                icon={FaExclamationTriangle}
                                                title="Dispute Review Queue"
                                                subtitle={`${openDisputes.length} open dispute${openDisputes.length !== 1 ? 's' : ''}`}
                                                iconColor="text-red-600"
                                                showInfoBadge={false}
                                            >
                                                <div className="space-y-2 mt-3">
                                                    {openDisputes.map(d => {
                                                        const supplier = suppliers.find(s => s.id === String(d.supplierId));
                                                        return (
                                                            <div key={d.id} className="bg-white/40 rounded-xl p-3 border border-white/30">
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-sm font-semibold text-gray-900">{supplier?.name || `Supplier #${d.supplierId}`}</span>
                                                                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full font-medium">{d.reviewStatus}</span>
                                                                            <span className="text-[10px] text-gray-500">Target: {d.targetEntity} #{d.targetId}</span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-700 mt-1">{d.reason}</p>
                                                                        <p className="text-[10px] text-gray-400 mt-1">
                                                                            Submitted by {d.submittedBy} · {new Date(d.submittedDate).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex gap-2 flex-shrink-0">
                                                                        <button
                                                                            onClick={() => handleResolveDispute(d.id, 'UPHELD')}
                                                                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-colors"
                                                                        >
                                                                            Upheld
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleResolveDispute(d.id, 'REJECTED')}
                                                                            className="px-3 py-1.5 bg-gray-500 text-white text-xs font-medium rounded-full hover:bg-gray-600 transition-colors"
                                                                        >
                                                                            Rejected
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-4 text-center">
                                                    Upheld disputes require the correction to be applied in Farm OS, then Recalculate re-grades the batch.
                                                </p>
                                            </InfoCard>
                                        </motion.div>
                                    </div>
                                </Section>
                            )}


                            {/* Consent coverage bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Network consent coverage</span>
                                    <span>
                            {suppliers.filter(s => s.dataConsentGiven).length}/{suppliers.length}
                        </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <motion.div
                                        className="bg-primary h-2.5 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${suppliers.length > 0 ? (suppliers.filter(s => s.dataConsentGiven).length / suppliers.length) * 100 : 0}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg text-xs text-gray-600 text-center">
                                <FaShieldAlt className="inline mr-1 text-primary" />
                                Farmer data remains theirs. AfriNuts holds it in trust and shares only consented scopes with verified buyers. Withdrawn consent is respected immediately.
                            </div>
                        </InfoCard>
                    </motion.div>
                </div>
            </Section>

            {/* Supplier Leaderboard */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="mb-8"
                    >
                        <Typography variant="h3" className="mb-4 text-primary flex items-center gap-2">
                            <FaTrophy className="text-yellow-500" />
                            Supplier Leaderboard
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {suppliers
                                .filter(s => trustBySupplier[s.id]?.overall !== null)
                                .sort((a, b) => (trustBySupplier[b.id].overall ?? 0) - (trustBySupplier[a.id].overall ?? 0))
                                .slice(0, 6)
                                .map((supplier, idx) => {
                                    const trust = trustBySupplier[supplier.id];
                                    return (
                                        <motion.div
                                            key={supplier.id}
                                            variants={fadeIn}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30"
                                            whileHover={{ y: -2 }}
                                        >
                                        <span className="text-lg font-bold text-primary w-8">
                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                        </span>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm">{supplier.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Trust: {trust.overall} · {trust.confidence} · {trust.verifiedTransactions} batches
                                                </p>
                                            </div>
                                            <div className="flex gap-1">
                                                {supplier.sustainableHarvesting && <FaLeaf className="text-green-500 text-xs" title="Sustainable" />}
                                                {supplier.firebreakProtection && <FaFireExtinguisher className="text-orange-500 text-xs" title="Firebreak" />}
                                                {supplier.noChildLabor && <FaChild className="text-blue-500 text-xs" title="No Child Labor" />}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Supplier Map */}
            <Section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <Typography variant="h3" className="mb-4 text-primary flex items-center gap-2">
                            <FaMapMarkerAlt className="text-accent" />
                            Supplier Locations
                        </Typography>
                        <SupplierMap
                            suppliers={suppliers.map(s => ({
                                id: s.id,
                                name: s.name,
                                latitude: s.latitude || 0,
                                longitude: s.longitude || 0,
                                isActive: s.status === 'ACTIVE',
                                type: s.type,
                                location: s.location,
                            }))}
                            className="mb-6"
                        />
                    </motion.div>
                </div>
            </Section>

            {/* Trust Intelligence Row — A & B */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ============================================
                        OPTION A — Highest Trust Scores
                    ============================================ */}
                    <InfoCard
                        icon={FaShieldAlt}
                        title="Highest Trust Scores"
                        subtitle="Ranked by evidence-backed performance, not volume"
                        iconColor="text-green-600"
                        showInfoBadge={false}
                    >
                        <div className="space-y-2 mt-3">
                            {(() => {
                                const ranked = suppliers
                                    .map(s => ({ supplier: s, trust: trustBySupplier[s.id] }))
                                    .filter(x => x.trust?.overall !== null)
                                    .sort((a, b) => (b.trust.overall ?? 0) - (a.trust.overall ?? 0))
                                    .slice(0, 5);

                                if (ranked.length === 0) {
                                    return (
                                        <div className="text-center py-6 text-sm text-gray-500">
                                            <FaShieldAlt className="text-2xl mx-auto mb-2 text-gray-300" />
                                            <p className="font-medium text-gray-600">No complete scores yet</p>
                                            <p className="text-[11px] text-gray-400 mt-1 max-w-md mx-auto">
                                                A supplier needs validated commitments (delivery), inspected batches (quality), and registered location/consent (traceability) before receiving an overall trust score.
                                            </p>
                                        </div>
                                    );
                                }

                                return ranked.map(({ supplier, trust }, i) => (
                                    <div
                                        key={supplier.id}
                                        onClick={() => openSupplierDetail(supplier)}
                                        className="flex items-center gap-3 bg-white/40 rounded-xl p-2.5 border border-white/30 cursor-pointer hover:bg-white/60 transition-all"
                                    >
                                        <span className="w-6 text-sm font-bold text-gray-400 text-center">#{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{supplier.name}</p>
                                            <p className="text-[10px] text-gray-500">
                                                {trust.verifiedTransactions} verified batch{trust.verifiedTransactions !== 1 ? 'es' : ''}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-bold ${
                                                (trust.overall ?? 0) >= 85 ? 'text-green-600' :
                                                    (trust.overall ?? 0) >= 70 ? 'text-primary' :
                                                        (trust.overall ?? 0) >= 50 ? 'text-amber-600' : 'text-red-600'
                                            }`}>
                                                {trust.overall}
                                            </div>
                                            <div className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block ${
                                                trust.confidence === 'established' ? 'bg-green-100 text-green-700' :
                                                    trust.confidence === 'developing' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                            }`}>
                                                {trust.confidence}
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </InfoCard>

                    {/* ============================================
            OPTION B — Evidence Maturity
            ============================================ */}
                    <InfoCard
                        icon={FaHistory}
                        title="Evidence Maturity"
                        subtitle="How much verified history supports our supplier assessments"
                        iconColor="text-blue-600"
                        showInfoBadge={false}
                    >
                        <div className="space-y-3 mt-3">
                            {(() => {
                                const counts = { preliminary: 0, developing: 0, established: 0 };
                                Object.values(trustBySupplier).forEach(t => { counts[t.confidence]++; });
                                const total = Object.values(counts).reduce((a, b) => a + b, 0);

                                const tiers = [
                                    { key: 'preliminary' as const, label: 'Preliminary', range: '0–2 batches', color: 'bg-amber-500', textColor: 'text-amber-700', desc: 'Limited history — not unreliable, just new' },
                                    { key: 'developing' as const, label: 'Developing', range: '3–9 batches', color: 'bg-blue-500', textColor: 'text-blue-700', desc: 'Early performance pattern emerging' },
                                    { key: 'established' as const, label: 'Established', range: '10+ batches', color: 'bg-green-500', textColor: 'text-green-700', desc: 'Substantial verified history across cycles' },
                                ];

                                return tiers.map(tier => (
                                    <div key={tier.key} className="bg-white/40 rounded-xl p-3 border border-white/30">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={`text-sm font-semibold ${tier.textColor}`}>{tier.label}</span>
                                            <span className="text-xl font-bold">{counts[tier.key]}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 mb-1.5">{tier.range}</div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <motion.div
                                                className={`${tier.color} h-2 rounded-full`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${total > 0 ? (counts[tier.key] / total) * 100 : 0}%` }}
                                                transition={{ duration: 0.8 }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1.5">{tier.desc}</p>
                                    </div>
                                ));
                            })()}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 text-center">
                            Missing evidence lowers confidence — never the trust score itself.
                        </p>
                    </InfoCard>

                </div>
            </div>

            {/* ============================================
                OPTION C — Risk & Attention Radar
                ============================================ */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                <InfoCard
                    icon={FaExclamationTriangle}
                    title="Risk & Attention Radar"
                    subtitle="Suppliers requiring review — sorted by trust severity"
                    iconColor="text-amber-600"
                    showInfoBadge={false}
                >
                    {(() => {
                        const flagged = suppliers
                            .map(s => ({ supplier: s, trust: trustBySupplier[s.id] }))
                            .filter(x => x.trust && x.trust.flags.length > 0)
                            .sort((a, b) => (a.trust.overall ?? 100) - (b.trust.overall ?? 100));

                        if (flagged.length === 0) {
                            return (
                                <div className="text-center py-6 text-sm text-gray-400">
                                    <FaCheckCircle className="text-2xl text-green-500 mx-auto mb-2" />
                                    No suppliers currently require attention.
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-2 mt-3">
                                {flagged.slice(0, 6).map(({ supplier, trust }) => (
                                    <div
                                        key={supplier.id}
                                        onClick={() => openSupplierDetail(supplier)}
                                        className="bg-white/40 rounded-xl p-3 border border-white/30 cursor-pointer hover:bg-white/60 transition-all flex items-center gap-3"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium truncate">{supplier.name}</p>
                                                <span className="text-[10px] text-gray-400 flex-shrink-0">
                                        {supplier.type?.replace(/_/g, ' ')}
                                    </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {trust.flags.map(f => (
                                                    <span key={f} className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full">
                                            {f}
                                        </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-bold ${
                                                (trust.overall ?? 0) < 50 ? 'text-red-600' : 'text-amber-600'
                                            }`}>
                                                {trust.overall ?? '—'}
                                            </div>
                                            <div className="text-[10px] text-gray-400">{trust.confidence}</div>
                                        </div>
                                    </div>
                                ))}
                                {flagged.length > 6 && (
                                    <p className="text-[10px] text-gray-400 text-center pt-1">
                                        +{flagged.length - 6} more supplier{flagged.length - 6 !== 1 ? 's' : ''} with flags
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </InfoCard>
            </div>

            {/* ============================================
                Supplier Development Opportunities
                ============================================ */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                <InfoCard
                    icon={FaHandshake}
                    title="Supplier Development Opportunities"
                    subtitle="Where targeted support strengthens the supply network"
                    iconColor="text-primary"
                    showInfoBadge={false}
                >
                    {developmentOpportunities.length === 0 ? (
                        <div className="text-center py-6 text-sm text-gray-400">
                            <FaCheckCircle className="text-2xl text-green-500 mx-auto mb-2" />
                            No development opportunities detected — every supplier is meeting current thresholds.
                        </div>
                    ) : (
                        <>
                            {/* Summary strip */}
                            {(() => {
                                const high = developmentOpportunities.filter(o => o.severity === 'high').length;
                                const medium = developmentOpportunities.filter(o => o.severity === 'medium').length;
                                const low = developmentOpportunities.filter(o => o.severity === 'low').length;
                                return (
                                    <div className="grid grid-cols-3 gap-3 mb-4 mt-3">
                                        <div className="bg-red-50/60 rounded-xl p-3 border border-red-200 text-center">
                                            <div className="text-2xl font-bold text-red-600">{high}</div>
                                            <div className="text-[10px] text-gray-500">High priority</div>
                                        </div>
                                        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200 text-center">
                                            <div className="text-2xl font-bold text-amber-600">{medium}</div>
                                            <div className="text-[10px] text-gray-500">Medium priority</div>
                                        </div>
                                        <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-200 text-center">
                                            <div className="text-2xl font-bold text-blue-600">{low}</div>
                                            <div className="text-[10px] text-gray-500">Capacity building</div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Opportunities list */}
                            <div className="space-y-2">
                                {developmentOpportunities.slice(0, 8).map((opp, i) => {
                                    const supplier = suppliers.find(s => s.id === opp.supplierId);
                                    const borderColor =
                                        opp.severity === 'high' ? 'border-l-red-400' :
                                            opp.severity === 'medium' ? 'border-l-amber-400' :
                                                'border-l-blue-400';
                                    const badgeColor =
                                        opp.severity === 'high' ? 'bg-red-100 text-red-700' :
                                            opp.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-blue-100 text-blue-700';

                                    return (
                                        <div
                                            key={`${opp.supplierId}-${opp.weakness}-${i}`}
                                            onClick={() => supplier && openSupplierDetail(supplier)}
                                            className={`bg-white/40 rounded-xl p-3 border border-white/30 border-l-4 ${borderColor} cursor-pointer hover:bg-white/60 transition-all`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {opp.supplierName}
                                                        </p>
                                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${badgeColor}`}>
                                                {opp.severity}
                                            </span>
                                                        <span className="text-[10px] text-gray-400">
                                                {opp.confidence}
                                            </span>
                                                    </div>
                                                    <p className="text-xs text-gray-700 font-medium mt-1">
                                                        {opp.weakness}
                                                    </p>
                                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                                        {opp.metric}
                                                    </p>
                                                    <p className="text-[11px] text-primary mt-1.5 flex items-center gap-1">
                                                        <FaHandshake className="text-[10px]" />
                                                        <span className="font-medium">Suggested support:</span>
                                                        <span className="text-gray-600">{opp.suggestedSupport}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer insight */}
                            {developmentOpportunities.length > 0 && (
                                <div className="mt-4 p-3 bg-primary/5 rounded-lg text-[11px] text-gray-600">
                                    <FaChartLine className="inline mr-1 text-primary" />
                                    <strong>The continuous improvement cycle:</strong> measure performance → identify weaknesses →
                                    provide targeted support → measure improvements in later cycles.
                                    {developmentOpportunities.length > 8 && (
                                        <span className="ml-1 text-gray-500">
                                +{developmentOpportunities.length - 8} more opportunit{developmentOpportunities.length - 8 === 1 ? 'y' : 'ies'} below.
                            </span>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </InfoCard>
            </div>



            {/* Financial Efficiency */}
            <Section className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <InfoCard
                        icon={FaDollarSign}
                        title="Supplier Financial Efficiency"
                        subtitle="Revenue generated per 1 FCFA spent on procurement"
                        iconColor="text-primary"
                        showInfoBadge={false}
                    >
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto mt-3">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="pb-2 font-medium text-gray-600">Supplier</th>
                                    <th className="pb-2 font-medium text-gray-600">Procurement</th>
                                    <th className="pb-2 font-medium text-gray-600">Revenue</th>
                                    <th className="pb-2 font-medium text-gray-600">Efficiency</th>
                                </tr>
                                </thead>
                                <tbody>
                                {suppliers.slice(0, 5).map(supplier => {
                                    const metrics = metricsBySupplier[supplier.id];
                                    const volumeKg = metrics?.annualVolumeKg ?? 0;
                                    const procurement = volumeKg * 500;
                                    const revenue = volumeKg * 1500;
                                    const efficiency = (revenue / (procurement || 1)).toFixed(1);
                                    return (
                                        <tr key={supplier.id} className="border-b border-gray-100 last:border-0 hover:bg-white/20">
                                            <td className="py-2 font-medium">{supplier.name}</td>
                                            <td className="py-2">{new Intl.NumberFormat('fr-FR').format(procurement)} FCFA</td>
                                            <td className="py-2">{new Intl.NumberFormat('fr-FR').format(revenue)} FCFA</td>
                                            <td className="py-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${Number(efficiency) > 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{efficiency}x</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3 mt-3">
                            {suppliers.slice(0, 5).map(supplier => {
                                const metrics = metricsBySupplier[supplier.id];
                                const volumeKg = metrics?.annualVolumeKg ?? 0;
                                const procurement = volumeKg * 500;
                                const revenue = volumeKg * 1500;
                                const efficiency = (revenue / (procurement || 1)).toFixed(1);
                                return (
                                    <motion.div
                                        key={supplier.id}
                                        className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                                        whileHover={{ y: -2 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-primary text-sm">{supplier.name}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${Number(efficiency) > 2 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {efficiency}x
                                </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-gray-500">Procurement</span>
                                                <p className="font-medium text-gray-700">{new Intl.NumberFormat('fr-FR').format(procurement)} FCFA</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Revenue</span>
                                                <p className="font-medium text-gray-700">{new Intl.NumberFormat('fr-FR').format(revenue)} FCFA</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </InfoCard>
                </div>
            </Section>

            {/* Supplier Detail Modal */}
            <Transition.Root show={!!selectedSupplier} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedSupplier(null)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:scale-95"
                            >
                                <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl text-left shadow-xl backdrop-blur-lg transition-all"
                                              style={{
                                                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.9) 100%)',
                                                  border: '1px solid rgba(255,255,255,0.5)',
                                                  boxShadow: '0 8px 32px rgba(165, 105, 66, 0.2), inset 0 1px 0 rgba(255,255,255,0.6)',
                                              }}
                                >
                                    {/* Animated blobs */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl animate-pulse"
                                         style={{ background: 'radial-gradient(circle, rgba(165,105,66,0.4) 0%, transparent 70%)' }} />
                                    <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full opacity-8 blur-3xl"
                                         style={{ background: 'radial-gradient(circle, rgba(210,125,45,0.4) 0%, transparent 70%)' }} />

                                    <div className="relative z-10 p-6">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <Dialog.Title as="h2" className="text-2xl font-bold text-primary">
                                                    {selectedSupplier?.name}
                                                </Dialog.Title>
                                                <p className="text-sm text-gray-500">{selectedSupplier?.type?.replace(/_/g, ' ')} · {selectedSupplier?.location}</p>
                                            </div>
                                            <button onClick={() => setSelectedSupplier(null)} className="text-gray-400 hover:text-gray-600">
                                                <FaTimes className="text-xl" />
                                            </button>
                                        </div>

                                        {/* Tabs */}
                                        <div className="flex border-b border-gray-200 mb-6">
                                            {['profile', 'quality', 'financials'].map(tab => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab as any)}
                                                    className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                                                        activeTab === tab
                                                            ? 'border-b-2 border-primary text-primary'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                >
                                                    {tab === 'profile' ? 'Profile & Compliance' : tab === 'quality' ? 'Quality History' : 'Financials'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Tab Content */}
                                        {modalLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {activeTab === 'profile' && selectedSupplier && (
                                                    <div className="space-y-4">
                                                        {/* Photo + Name Header */}
                                                        <div className="flex items-center gap-4">
                                                            {selectedSupplier.photoUrl ? (
                                                                <img src={selectedSupplier.photoUrl} alt={selectedSupplier.name}
                                                                     className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
                                                            ) : (
                                                                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                                                                    selectedSupplier.type === 'OWN_FARM' ? 'bg-green-100' : 'bg-primary/10'
                                                                }`}>
                                                                    {selectedSupplier.type === 'OWN_FARM' ? (
                                                                        <FaHome className="text-green-600 text-2xl" />
                                                                    ) : (
                                                                        <FaUsers className="text-primary text-2xl" />
                                                                    )}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="text-xl font-bold text-primary">{selectedSupplier.name}</h3>
                                                                    {selectedSupplier.type === 'OWN_FARM' && (
                                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                                            Own Farm
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-500">{selectedSupplier.type?.replace(/_/g, ' ')} · {selectedSupplier.status}</p>
                                                                {selectedSupplier.type === 'OWN_FARM' && selectedSupplier.quote && (
                                                                    <p className="text-xs text-green-700 italic mt-1 max-w-md">"{selectedSupplier.quote}"</p>
                                                                )}
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FaStar key={i} className={i < (selectedSupplier.rating ?? 0) ? 'text-yellow-500' : 'text-gray-300'} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Own Farm Banner */}
                                                        {selectedSupplier.type === 'OWN_FARM' && (
                                                            <div className="bg-green-50/80 border border-green-200 rounded-xl p-4 mb-4">
                                                                <div className="flex items-start gap-3">
                                                                    <FaHome className="text-green-600 text-xl mt-0.5" />
                                                                    <div>
                                                                        <h4 className="font-medium text-green-800">AfriNuts Own Farm Production</h4>
                                                                        <p className="text-sm text-green-700 mt-1">
                                                                            This represents cashews grown on our 35-hectare farm in Odienné. Managed by {selectedSupplier.contactPerson},
                                                                            our farm serves as the quality benchmark for all supplier-sourced cashews.
                                                                        </p>
                                                                        <div className="flex gap-4 mt-2 text-xs text-green-600">
                                                                            <span>{selectedSupplier.farmSize} hectares</span>
                                                                            <span>{selectedSupplier.yearsFarming} years farming</span>
                                                                            <span>100% Farm OS monitored</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <TrustPanel trust={trustBySupplier[selectedSupplier.id]} />

                                                        {/* Bio / Quote */}
                                                        {selectedSupplier.bio && (
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-1">About</h4>
                                                                <p className="text-sm text-gray-700">{selectedSupplier.bio}</p>
                                                            </div>
                                                        )}
                                                        {selectedSupplier.quote && (
                                                            <div className="bg-accent/10 rounded-xl p-4 italic text-accent-dark text-sm">
                                                                "{selectedSupplier.quote}"
                                                            </div>
                                                        )}

                                                        {/* Contact + Business Details Grid */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Contact Information</h4>
                                                                <p className="text-sm flex items-center gap-2"><FaUser className="text-gray-400" /> {selectedSupplier.contactPerson}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaPhone className="text-gray-400" /> {selectedSupplier.phone}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaEnvelope className="text-gray-400" /> {selectedSupplier.email}</p>
                                                                <p className="text-sm flex items-center gap-2"><FaMapMarkerAlt className="text-gray-400" /> {selectedSupplier.location}</p>
                                                            </div>
                                                            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                                <h4 className="font-medium text-primary mb-2">Business Information</h4>
                                                                <p className="text-sm"><strong>Region:</strong> {selectedSupplier.region || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Country:</strong> {selectedSupplier.country || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Registration #:</strong> {selectedSupplier.registrationNumber || 'N/A'}</p>
                                                                <p className="text-sm"><strong>Tax ID:</strong> {selectedSupplier.taxId || 'N/A'}</p>
                                                                {selectedSupplier.farmSize ? <p className="text-sm"><strong>Farm Size:</strong> {selectedSupplier.farmSize} ha</p> : null}
                                                                {selectedSupplier.yearsFarming ? <p className="text-sm"><strong>Years Farming:</strong> {selectedSupplier.yearsFarming}</p> : null}
                                                                <p className="text-sm">
    <strong>Annual Volume:</strong>{' '}
    {metricsBySupplier[selectedSupplier.id]?.annualVolumeKg > 0
        ? `${(metricsBySupplier[selectedSupplier.id].annualVolumeKg / 1000).toFixed(1)}T`
        : 'N/A'}
</p>
<p className="text-sm">
    <strong>RCN Quality:</strong>{' '}
    {metricsBySupplier[selectedSupplier.id]?.averageRcnQualityScore != null
        ? `${metricsBySupplier[selectedSupplier.id].averageRcnQualityScore!.toFixed(1)}`
        : 'Pending'}
</p>
                                                            </div>
                                                        </div>

                                                        {/* Certifications */}
                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2">Certifications</h4>
                                                            {selectedSupplier.isCertified ? (
                                                                <div className="space-y-1">
                                                                    <p className="text-sm"><strong>Type:</strong> {selectedSupplier.certificationType || 'N/A'}</p>
                                                                    <p className="text-sm"><strong>Number:</strong> {selectedSupplier.certificationNumber || 'N/A'}</p>
                                                                    {selectedSupplier.certificationExpiryDate ? (
                                                                        <p className="text-sm"><strong>Expires:</strong> {new Date(selectedSupplier.certificationExpiryDate).toLocaleDateString()}</p>
                                                                    ) : null}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500">Not certified</p>
                                                            )}
                                                        </div>

                                                        {/* Sustainability Compliance */}
                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2">Sustainability Compliance</h4>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                <div className="flex items-center gap-2">
                                                                    {selectedSupplier.sustainableHarvesting ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                                                                    <span className="text-sm">Sustainable Harvesting</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {selectedSupplier.firebreakProtection ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                                                                    <span className="text-sm">Firebreak Protection</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {selectedSupplier.noChildLabor ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-400" />}
                                                                    <span className="text-sm">No Child Labor</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-gray-500">Has Location: {selectedSupplier.hasLocation ? 'Yes' : 'No'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Data Consent & Trust */}
                                                        <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                                                            <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                                                                <FaShieldAlt /> Data Consent & Trust
                                                            </h4>
                                                            {selectedSupplier.dataConsentGiven ? (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <FaCheckCircle className="text-green-500" />
                                                                        <span className="text-sm font-medium text-green-700">Consent on record</span>
                                                                        {selectedSupplier.dataConsentVersion && (
                                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">v{selectedSupplier.dataConsentVersion}</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-gray-600">
                                                                        Signed by <strong>{selectedSupplier.dataConsentSignedBy}</strong>
                                                                        {selectedSupplier.farmerIdNumber && <> · Farmer ID: {selectedSupplier.farmerIdNumber}</>}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        {['identity', 'location', 'photo'].map(scope => {
                                                                            const has = selectedSupplier.dataConsentScope?.includes(scope);
                                                                            return (
                                                                                <span key={scope} className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                                                                    has ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 line-through'
                                                                                }`}>{has ? <FaCheckCircle className="text-[10px]" /> : <FaTimesCircle className="text-[10px]" />}
                                                                                    {scope.charAt(0).toUpperCase() + scope.slice(1)} shared</span>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {selectedSupplier.dataConsentWithdrawnDate ? (
                                                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                                                                            <strong>Withdrawn</strong> on {new Date(selectedSupplier.dataConsentWithdrawnDate).toLocaleDateString()}
                                                                            {selectedSupplier.dataConsentWithdrawnReason && <> — {selectedSupplier.dataConsentWithdrawnReason}</>}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-xs text-gray-400 mt-2">
                                                                            Buyer Portal will show only the consented scopes. Consent can be withdrawn at any time.
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <FaTimesCircle className="text-amber-500" />
                                                                    <span className="text-sm text-amber-700">No consent on record — identity and location withheld from buyers</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Internal Notes (for management) */}
                                                        {selectedSupplier.notes && (
                                                            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200">
                                                                <h4 className="font-medium text-amber-700 mb-2">Internal Notes</h4>
                                                                <p className="text-sm text-gray-700">{selectedSupplier.notes}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'quality' && (
                                                    <div>
                                                        {supplierBatches.length === 0 ? (
                                                            <div className="text-center py-8 text-gray-400">
                                                                <FaBox className="text-3xl mx-auto mb-2" />
                                                                <Typography variant="small">No quality batches recorded for this supplier yet.</Typography>
                                                                <Typography variant="small" className="text-xs mt-1">
                                                                    Batch data will appear here as deliveries are processed through quality control.
                                                                </Typography>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Batch Summary */}
                                                                <div className="grid grid-cols-3 gap-3 mb-4">
                                                                    <div className="bg-white/50 rounded-xl p-3 text-center border border-white/30">
                                                                        <div className="text-2xl font-bold text-primary">{supplierBatches.length}</div>
                                                                        <div className="text-xs text-gray-500">Total Batches</div>
                                                                    </div>
                                                                    <div className="bg-white/50 rounded-xl p-3 text-center border border-white/30">
                                                                        <div className="text-2xl font-bold text-primary">
                                                                            {supplierBatches.reduce((sum, b) => sum + (b.weightKg || 0), 0).toLocaleString()} kg
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">Total Delivered</div>
                                                                    </div>
                                                                    <div className="bg-white/50 rounded-xl p-3 text-center border border-white/30">
                                                                        <div className="text-2xl font-bold text-primary">
                                                                            {(supplierBatches.reduce((sum, b) => sum + (b.qualityScore || 0), 0) / supplierBatches.length).toFixed(1)}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">Avg Quality</div>
                                                                    </div>
                                                                    <div className="text-2xl font-bold text-primary">
                                                                        {(() => {
                                                                            const valid = supplierBatches
                                                                                .map(b => (b as any).rcnQualityScore ?? b.qualityScore)
                                                                                .filter((v): v is number => typeof v === 'number' && v > 0);
                                                                            return valid.length > 0
                                                                                ? `${(valid.reduce((s, v) => s + v, 0) / valid.length).toFixed(1)}`
                                                                                : '—';
                                                                        })()}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">Avg RCN Quality</div>
                                                                </div>

                                                                {/* Batch Table */}
                                                                <div className="overflow-x-auto">
                                                                    <table className="w-full text-sm">
                                                                        <thead>
                                                                        <tr className="border-b border-gray-200 text-left">
                                                                            <th className="pb-2 font-medium text-gray-600">Batch #</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Date</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Weight</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Grade</th>
                                                                            <th className="pb-2 font-medium text-gray-600">RCN Score</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Moisture</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Defects</th>
                                                                            <th className="pb-2 font-medium text-gray-600">KOR (g/kg)</th>
                                                                            <th className="pb-2 font-medium text-gray-600">Compliance</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {supplierBatches.map(batch => (
                                                                            <tr key={batch.id} className="border-b border-gray-100 last:border-0 hover:bg-white/20">
                                                                                <td className="py-2 font-medium">{batch.batchNumber}</td>
                                                                                <td className="py-2 text-xs">{new Date(batch.processingDate).toLocaleDateString()}</td>
                                                                                <td className="py-2">{batch.weightKg?.toLocaleString()} kg</td>
                                                                                <td className="py-2">
                                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${gradeStyle(batch.qualityGrade)}`}>{batch.qualityGrade}</span>
                                                                                </td>
                                                                                <td className="py-2">
                                                                                    {(batch as any).rcnQualityScore != null
                                                                                        ? `${Number((batch as any).rcnQualityScore).toFixed(1)}`
                                                                                        : '—'}
                                                                                </td>
                                                                                <td className="py-2">{Number(batch.moistureContent ?? 0).toFixed(1)}%</td>
                                                                                <td className="py-2">{Number(batch.defectiveRate ?? 0).toFixed(1)}%</td>
                                                                                <td className="py-2">
                                                                                    {(batch as any).korGPerKg != null
                                                                                        ? `${Number((batch as any).korGPerKg).toFixed(0)} g`
                                                                                        : '—'}
                                                                                </td>
                                                                                <td className="py-2">
                                                                                    <div className="flex gap-1">
                                                                                        {batch.sustainableHarvesting && <FaLeaf className="text-green-500 text-xs" title="Sustainable" />}
                                                                                        {batch.firebreakProtection && <FaFireExtinguisher className="text-orange-500 text-xs" title="Firebreak" />}
                                                                                        {batch.noChildLabor && <FaChild className="text-blue-500 text-xs" title="No Child Labor" />}
                                                                                        {batch.farmOsMonitored && <FaChartBar className="text-purple-500 text-xs" title="FarmOS" />}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                                {/* Quality Trend Sparkline */}
                                                                {supplierTrend.length > 0 && (
                                                                    <div className="bg-white/50 rounded-xl p-4 border border-white/30 mt-4">
                                                                        <h4 className="font-medium text-primary mb-2">Quality Trend (Last {supplierTrend.length} Batches)</h4>
                                                                        <div className="flex items-center gap-3">
                                                                            <Sparkline data={supplierTrend} width={120} height={36} color="#5A7411" />
                                                                            <div className="text-sm text-gray-600">
                                                                                {supplierTrend.length >= 2 ? (
                                                                                    <>
                                                                                        {supplierTrend[0].toFixed(1)} → {supplierTrend[supplierTrend.length-1].toFixed(1)}
                                                                                        <span className="ml-2 text-xs">
                                                                                            {supplierTrend[supplierTrend.length-1] > supplierTrend[0] ? (
                                                                                        <span className="text-green-600">↑ Improving</span>
                                                                                            ) : supplierTrend[supplierTrend.length-1] < supplierTrend[0] ? (
                                                                                         <span className="text-red-600">↓ Declining</span>
                                                                                             ) : (
                                                                                        <span className="text-gray-500">→ Stable</span>
                                                                                                 )}
                                                                                          </span>
                                                                                    </>
                                                                                ) : 'Not enough data'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                {activeTab === 'financials' && (
                                                    <div>
                                                        {!supplierFinancials || (supplierFinancials.totalProcurement === 0 && supplierFinancials.totalRevenue === 0) ? (
                                                            <div className="text-center py-8 text-gray-400">
                                                                <FaDollarSign className="text-3xl mx-auto mb-2" />
                                                                <Typography variant="small">No financial data recorded for this supplier yet.</Typography>
                                                                <Typography variant="small" className="text-xs mt-1">
                                                                    Financial records will appear as procurement expenses and sales revenues are linked to this supplier's batches.
                                                                </Typography>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {/* Summary Cards */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                                    <div className="bg-green-50/50 rounded-xl p-4 border border-green-200 text-center">
                                                                        <p className="text-sm text-gray-500">Total Procured</p>
                                                                        <p className="text-2xl font-bold text-green-700">
                                                                            {new Intl.NumberFormat('fr-FR').format(supplierFinancials.totalProcurement)} FCFA
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {supplierFinancials.expenses?.length || 0} expense record{(supplierFinancials.expenses?.length || 0) !== 1 ? 's' : ''}
                                                                        </p>
                                                                    </div>
                                                                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200 text-center">
                                                                        <p className="text-sm text-gray-500">Revenue from Batches</p>
                                                                        <p className="text-2xl font-bold text-blue-700">
                                                                            {new Intl.NumberFormat('fr-FR').format(supplierFinancials.totalRevenue)} FCFA
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {supplierFinancials.revenues?.length || 0} sale record{(supplierFinancials.revenues?.length || 0) !== 1 ? 's' : ''}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Expenses Table */}
                                                                {supplierFinancials.expenses?.length > 0 && (
                                                                    <div className="mb-4">
                                                                        <h4 className="font-medium text-primary mb-2">Procurement Expenses</h4>
                                                                        <div className="overflow-x-auto">
                                                                            <table className="w-full text-sm">
                                                                                <thead>
                                                                                <tr className="border-b border-gray-200 text-left">
                                                                                    <th className="pb-2">Date</th>
                                                                                    <th className="pb-2">Amount</th>
                                                                                    <th className="pb-2">Batch</th>
                                                                                    <th className="pb-2">Description</th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                {supplierFinancials.expenses.map((exp: any) => (
                                                                                    <tr key={exp.id} className="border-b border-gray-100">
                                                                                        <td className="py-1">{new Date(exp.date).toLocaleDateString()}</td>
                                                                                        <td className="py-1 font-medium">{new Intl.NumberFormat('fr-FR').format(exp.amount)} FCFA</td>
                                                                                        <td className="py-1">{exp.batchNumber || '—'}</td>
                                                                                        <td className="py-1 text-xs text-gray-500">{exp.description || '—'}</td>
                                                                                    </tr>
                                                                                ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default SupplierManagement;