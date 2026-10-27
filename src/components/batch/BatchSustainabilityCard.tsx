import { GlassCard } from '@/components/buyer/GlassCard';
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

export const BatchSustainabilityCard = ({ sustainability }: { sustainability: any }) => {
    if (!sustainability) return null;

    const items = [
        { icon: FaChild, label: 'No Child Labor', active: sustainability.noChildLabor },
        { icon: FaMobile, label: 'Farm OS Monitored', active: sustainability.farmOsMonitored },
        { icon: FaShieldAlt, label: 'Firebreak', active: sustainability.firebreak },
        { icon: FaTree, label: 'Sustainable Harvest', active: sustainability.sustainableHarvesting },
    ];

    return (
        <GlassCard
            icon={FaLeaf}
            title="Sustainability Verification"
            variant="primary"
            minimal
        >
            <div className="grid grid-cols-2 gap-2 mt-1">
                {items.map((item, i) => {
                    const Icon = item.icon;
                    const active = item.active;
                    return (
                        <div
                            key={i}
                            className={`rounded-lg p-3 border text-center transition-colors ${
                                active
                                    ? 'bg-green-50/70 border-green-200'
                                    : 'bg-gray-50/60 border-gray-200'
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