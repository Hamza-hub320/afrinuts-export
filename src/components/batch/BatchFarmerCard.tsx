import { motion } from 'framer-motion';
import { Typography } from '@/components/Typography/Typography';
import { GiFarmer } from 'react-icons/gi';
import { FaMapMarkerAlt, FaShieldAlt, FaLock } from 'react-icons/fa';

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
        <GlassCard>
            {/* Header row — icon + title */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GiFarmer className="text-primary text-lg" />
                </div>
                <Typography variant="h4" className="font-bold text-gray-900">
                    Meet the Farmer Behind This Batch
                </Typography>
            </div>

            {hasAnyWithheld && (
                <div className="mb-4 px-3 py-2.5 bg-blue-50/70 backdrop-blur-sm border border-blue-200/70 rounded-lg flex items-start gap-2">
                    <FaShieldAlt className="text-blue-600 text-xs mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                        {identityWithheld && locationWithheld && photoWithheld
                            ? 'This farmer has chosen to keep their personal details private. The batch is still fully traceable to its origin.'
                            : "Some personal details are withheld at the farmer's request. Details they have consented to share are shown below."}
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar — falls back to icon if photo is withheld or missing */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg flex items-center justify-center bg-white/60 backdrop-blur-sm flex-shrink-0">
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

                <div className="flex-1 text-center sm:text-left min-w-0">
                    {/* Name — gated on identity scope */}
                    <Typography variant="h4" className="text-primary font-bold mb-1">
                        {farmer.name || 'Verified Farmer'}
                    </Typography>

                    {/* Role — always visible. It's non-identifying. */}
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
                        <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border-l-4 border-primary">
                            <Typography variant="body" className="text-primary-dark italic text-sm">
                                "{farmer.quote}"
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </GlassCard>
    );
};