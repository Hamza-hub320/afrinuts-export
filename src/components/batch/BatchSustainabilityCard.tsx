import { motion } from 'framer-motion';
import { Typography } from '@/components/Typography/Typography';
import {
    FaLeaf,
    FaChild,
    FaMobile,
    FaShieldAlt,
    FaTree,
    FaGlobeEurope,
    FaCheckCircle,
} from 'react-icons/fa';

// ── GlassCard — matches AdminBuyers / Financials / BatchDossier ──
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

export const BatchSustainabilityCard = ({ sustainability }: { sustainability: any }) => {
    if (!sustainability) return null;

    const items = [
        { icon: FaChild, label: 'No Child Labor', active: sustainability.noChildLabor },
        { icon: FaMobile, label: 'Farm OS Monitored', active: sustainability.farmOsMonitored },
        { icon: FaShieldAlt, label: 'Firebreak', active: sustainability.firebreak },
        { icon: FaTree, label: 'Sustainable Harvest', active: sustainability.sustainableHarvesting },
    ];

    return (
        <GlassCard>
            {/* Header row — icon + title */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FaLeaf className="text-primary text-lg" />
                </div>
                <Typography variant="h4" className="font-bold text-gray-900">
                    Sustainability Verification
                </Typography>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {items.map((item, i) => {
                    const Icon = item.icon;
                    const active = item.active;
                    return (
                        <div
                            key={i}
                            className={`rounded-lg p-3 border text-center transition-colors ${
                                active
                                    ? 'bg-green-50/70 backdrop-blur-sm border-green-200/70'
                                    : 'bg-white/50 backdrop-blur-sm border-white/40'
                            }`}
                        >
                            <Icon
                                className={`text-xl mx-auto mb-1.5 ${
                                    active ? 'text-green-600' : 'text-gray-400'
                                }`}
                            />
                            <div className="text-gray-700 text-[11px] font-medium leading-tight">
                                {item.label}
                            </div>
                            <div
                                className={`text-[10px] font-bold mt-1 flex items-center justify-center gap-1 ${
                                    active ? 'text-green-700' : 'text-gray-500'
                                }`}
                            >
                                {active ? (
                                    <>
                                        <FaCheckCircle className="text-[9px]" /> Verified
                                    </>
                                ) : (
                                    'Pending'
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 pt-3 border-t border-white/50 text-center">
                <div className="text-gray-500 text-[10px] flex items-center justify-center gap-1.5 leading-relaxed">
                    <FaGlobeEurope className="text-[9px]" />
                    Meets EU Due Diligence requirements for sustainable sourcing verification
                </div>
            </div>
        </GlassCard>
    );
};