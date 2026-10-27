import { InfoCard } from '@/components/InfoCard/InfoCard';
import { Typography } from '@/components/Typography/Typography';
import { GiFarmer } from 'react-icons/gi';
import { FaMapMarkerAlt, FaShieldAlt, FaLock } from 'react-icons/fa';

export const BatchFarmerCard = ({ farmer }: { farmer: any }) => {
    if (!farmer) return null;

    // Consent state is decided server-side (buyerPortal.buildGatedFarmer)
    // and passed through as boolean flags. Never trust the raw fields —
    // read the flags first.
    const identityWithheld = farmer.identityWithheld === true;
    const locationWithheld = farmer.locationWithheld === true;
    const photoWithheld = farmer.photoWithheld === true;
    const hasAnyWithheld = identityWithheld || locationWithheld || photoWithheld;

    return (
        <InfoCard
            icon={GiFarmer}
            title="Meet the Farmer Behind This Batch"
            variant="primary"
            showInfoBadge={false}
        >
            {hasAnyWithheld && (
                <div className="mt-3 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                    <FaShieldAlt className="text-blue-600 text-xs mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                        {identityWithheld && locationWithheld && photoWithheld
                            ? 'This farmer has chosen to keep their personal details private. The batch is still fully traceable to its origin.'
                            : 'Some personal details are withheld at the farmer\'s request. Details they have consented to share are shown below.'}
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                {/* Avatar — falls back to icon if photo is withheld or missing */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex items-center justify-center bg-primary/5">
                    {farmer.photo && !photoWithheld ? (
                        <img
                            src={farmer.photo}
                            alt={farmer.name || 'Verified farmer'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <GiFarmer className="text-5xl text-primary/40" />
                    )}
                    {photoWithheld && (
                        <div className="absolute bottom-1 right-1 bg-white/90 rounded-full p-1 shadow-sm">
                            <FaLock className="text-gray-400 text-[10px]" />
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                    {/* Name — gated on identity scope */}
                    <Typography variant="h4" className="text-primary mb-1">
                        {farmer.name || 'Verified Farmer'}
                    </Typography>

                    {/* Role — always visible. It's non-identifying ("Independent", "Cooperative Member"). */}
                    <Typography variant="small" className="text-accent font-medium mb-2">
                        {farmer.role}
                        {!identityWithheld && farmer.yearsFarming && ` · ${farmer.yearsFarming}`}
                    </Typography>

                    {/* Location — gated on location scope, falls back to region */}
                    <div className="flex items-center gap-1.5 justify-center sm:justify-start mb-3">
                        <FaMapMarkerAlt className="text-gray-400 text-xs" />
                        <Typography variant="small" className="text-gray-500">
                            {farmer.location || "Côte d'Ivoire"}
                            {locationWithheld && (
                                <span className="text-gray-400 italic"> (region only)</span>
                            )}
                        </Typography>
                    </div>

                    {/* Bio — gated on identity scope */}
                    {!identityWithheld && farmer.bio && (
                        <Typography variant="body" className="text-gray-600 text-sm leading-relaxed">
                            {farmer.bio}
                        </Typography>
                    )}

                    {identityWithheld && (
                        <Typography variant="body" className="text-gray-500 text-sm leading-relaxed italic">
                            This farmer prefers to remain anonymous. Every batch is traceable to its farm, cooperative, and origin region — verified at harvest.
                        </Typography>
                    )}

                    {/* Quote — gated on identity scope */}
                    {!identityWithheld && farmer.quote && (
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