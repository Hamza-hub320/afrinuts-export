import { InfoCard } from '@/components/InfoCard/InfoCard';
import { Typography } from '@/components/Typography/Typography';
import { GiFarmer } from 'react-icons/gi';
import { FaMapMarkerAlt } from 'react-icons/fa';

export const BatchFarmerCard = ({ farmer }: { farmer: any }) => {
    if (!farmer) return null;
    return (
        <InfoCard
            icon={GiFarmer}
            title="Meet the Farmer Behind This Batch"
            variant="primary"
            showInfoBadge={false}
        >
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex items-center justify-center bg-primary/5">
                    {farmer.photo ? (
                        <img
                            src={farmer.photo}
                            alt={farmer.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <GiFarmer className="text-5xl text-primary/40" />
                    )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <Typography variant="h4" className="text-primary mb-1">
                        {farmer.name}
                    </Typography>
                    <Typography variant="small" className="text-accent font-medium mb-2">
                        {farmer.role} · {farmer.yearsFarming}
                    </Typography>
                    <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-3">
                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                        <Typography variant="small" className="text-gray-500">
                            {farmer.location}
                        </Typography>
                    </div>
                    <Typography variant="body" className="text-gray-600 text-sm leading-relaxed">
                        {farmer.bio}
                    </Typography>
                    {farmer.quote && (
                        <div className="mt-4 bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
                            <Typography variant="body" className="text-primary-dark italic text-sm">
                                "{farmer.quote}"
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </InfoCard>
    );
};