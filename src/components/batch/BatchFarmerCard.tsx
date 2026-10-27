import { GlassCard } from '@/components/buyer/GlassCard';
import { Typography } from '@/components/Typography/Typography';
import { GiFarmer } from 'react-icons/gi';
import { FaMapMarkerAlt, FaShieldAlt, FaLock } from 'react-icons/fa';

export const BatchFarmerCard = ({ farmer }: { farmer: any }) => {
    if (!farmer) return null;

    const identityWithheld = farmer.identityWithheld === true;
    const locationWithheld = farmer.locationWithheld === true;
    const photoWithheld = farmer.photoWithheld === true;
    const hasAnyWithheld = identityWithheld || locationWithheld || photoWithheld;

    return (
        <GlassCard
            icon={GiFarmer}
            title="Meet the Farmer Behind This Batch"
            variant="primary"
        >
            {hasAnyWithheld && (
                <div className="mt-1 mb-3 px-3 py-2 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-2">
                    <FaShieldAlt className="text-blue-600 text-xs mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                        {identityWithheld && locationWithheld && photoWithheld
                            ? 'This farmer has chosen to keep their personal details private. The batch is still fully traceable to its origin.'
                            : "Some personal details are withheld at the farmer's request. Details they have consented to share are shown below."}
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Avatar */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white/60 shadow-md flex items-center justify-center bg-white/40 flex-shrink-0">
                    {farmer.photo && !photoWithheld ? (
                        <img
                            src={farmer.photo}
                            alt={farmer.name || 'Verified farmer'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <GiFarmer className="text-4xl text-primary/40" />
                    )}
                    {photoWithheld && (
                        <div className="absolute bottom-1 right-1 bg-white/90 rounded-full p-1 shadow-sm">
                            <FaLock className="text-gray-400 text-[10px]" />
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center sm:text-left min-w-0">
                    {/* Name */}
                    <Typography variant="h4" className="text-gray-900 font-bold mb-1">
                        {farmer.name || 'Verified Farmer'}
                    </Typography>

                    {/* Role · years */}
                    <Typography variant="small" className="text-accent font-medium mb-2">
                        {farmer.role}
                        {!identityWithheld && farmer.yearsFarming && ` · ${farmer.yearsFarming}`}
                    </Typography>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-3">
                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                        <Typography variant="small" className="text-gray-600">
                            {farmer.location || "Côte d'Ivoire"}
                            {locationWithheld && (
                                <span className="text-gray-400 italic"> (region only)</span>
                            )}
                        </Typography>
                    </div>

                    {/* Bio */}
                    {!identityWithheld && farmer.bio && (
                        <Typography variant="body" className="text-gray-600 text-sm leading-relaxed">
                            {farmer.bio}
                        </Typography>
                    )}

                    {identityWithheld && (
                        <Typography variant="body" className="text-gray-500 text-sm leading-relaxed italic">
                            This farmer prefers to remain anonymous. Every batch is traceable to its farm,
                            cooperative, and origin region — verified at harvest.
                        </Typography>
                    )}

                    {/* Quote */}
                    {!identityWithheld && farmer.quote && (
                        <div className="mt-4 bg-white/40 rounded-lg p-3 border-l-4 border-primary">
                            <Typography variant="body" className="text-gray-700 italic text-sm">
                                "{farmer.quote}"
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
};