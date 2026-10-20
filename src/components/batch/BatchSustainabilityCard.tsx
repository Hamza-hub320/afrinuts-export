import { InfoCard } from '@/components/InfoCard/InfoCard';
import { Typography } from '@/components/Typography/Typography';
import { FaLeaf, FaChild, FaMobile, FaShieldAlt, FaTree, FaGlobeEurope } from 'react-icons/fa';

export const BatchSustainabilityCard = ({ sustainability }: { sustainability: any }) => {
    if (!sustainability) return null;

    const items = [
        { icon: FaChild, label: 'No Child Labor', active: sustainability.noChildLabor },
        { icon: FaMobile, label: 'Farm OS Monitored', active: sustainability.farmOsMonitored },
        { icon: FaShieldAlt, label: 'Firebreak', active: sustainability.firebreak },
        { icon: FaTree, label: 'Sustainable Harvest', active: sustainability.sustainableHarvesting },
    ];

    return (
        <InfoCard icon={FaLeaf} title="Sustainability Verification" variant="primary" showInfoBadge={false}>
            <div className="grid grid-cols-2 gap-3 mt-3">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={`rounded-xl p-4 border text-center ${
                            item.active
                                ? 'bg-green-50/60 border-green-200'
                                : 'bg-gray-50/40 border-gray-200'
                        }`}
                    >
                        <item.icon
                            className={`text-2xl mx-auto mb-2 ${
                                item.active ? 'text-green-600' : 'text-gray-400'
                            }`}
                        />
                        <Typography variant="small" className="text-gray-600 text-xs font-medium">
                            {item.label}
                        </Typography>
                        <Typography
                            variant="small"
                            className={`text-xs font-bold mt-1 ${
                                item.active ? 'text-green-700' : 'text-gray-500'
                            }`}
                        >
                            {item.active ? 'Verified ✓' : 'Pending'}
                        </Typography>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200/30 text-center">
                <Typography variant="small" className="text-gray-400 text-xs flex items-center justify-center gap-1.5">
                    <FaGlobeEurope className="text-[10px]" />
                    Meets EU Due Diligence requirements for sustainable sourcing verification
                </Typography>
            </div>
        </InfoCard>
    );
};