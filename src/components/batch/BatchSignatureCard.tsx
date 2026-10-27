import { motion } from 'framer-motion';
import { Typography } from '@/components/Typography/Typography';
import { FaMobile, FaClipboardList, FaCalendarAlt, FaClock, FaShieldAlt } from 'react-icons/fa';

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

export const BatchSignatureCard = ({ metadata, signature }: { metadata: any; signature: any }) => {
    if (!metadata) return null;

    const items = [
        { label: 'Record ID', value: metadata.recordId, icon: FaClipboardList },
        { label: 'Created', value: metadata.created, icon: FaCalendarAlt },
        { label: 'Last Updated', value: metadata.lastUpdated, icon: FaClock },
        { label: 'Status', value: metadata.verificationStatus, icon: FaShieldAlt, highlight: true },
    ];

    return (
        <GlassCard>
            {/* Header row — icon + title, matching other GlassCard sections */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FaMobile className="text-primary text-lg" />
                </div>
                <Typography variant="h4" className="font-bold text-gray-900">
                    Farm OS Record
                </Typography>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {items.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={i}
                            className={`rounded-xl p-3 border text-center ${
                                item.highlight
                                    ? 'bg-green-50/70 backdrop-blur-sm border-green-200/70'
                                    : 'bg-white/50 backdrop-blur-sm border-white/40'
                            }`}
                        >
                            <Icon
                                className={`text-lg mx-auto mb-1 ${
                                    item.highlight ? 'text-green-600' : 'text-accent'
                                }`}
                            />
                            <Typography
                                variant="small"
                                className="text-gray-500 text-[10px] uppercase tracking-wider"
                            >
                                {item.label}
                            </Typography>
                            <Typography
                                variant="small"
                                className={`font-semibold text-xs mt-0.5 ${
                                    item.highlight ? 'text-green-700' : 'text-primary'
                                }`}
                            >
                                {item.value}
                            </Typography>
                        </div>
                    );
                })}
            </div>

            {signature && (
                <div className="mt-4 pt-4 border-t border-white/30">
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                        <div className="flex items-center gap-2 mb-3">
                            <FaShieldAlt className="text-green-600" />
                            <Typography variant="small" className="font-semibold text-primary">
                                Digital Signature
                            </Typography>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                Verified
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="bg-white/70 rounded-lg p-2.5 text-center">
                                <Typography
                                    variant="small"
                                    className="text-gray-400 text-[10px] uppercase tracking-wider"
                                >
                                    Verification Code
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="font-mono font-bold text-primary mt-0.5 tracking-wider"
                                >
                                    {signature.code}
                                </Typography>
                            </div>
                            <div className="bg-white/70 rounded-lg p-2.5 text-center">
                                <Typography
                                    variant="small"
                                    className="text-gray-400 text-[10px] uppercase tracking-wider"
                                >
                                    Signature
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="font-mono text-primary text-[9px] mt-0.5 truncate"
                                >
                                    {signature.signature}
                                </Typography>
                            </div>
                            <div className="bg-white/70 rounded-lg p-2.5 text-center">
                                <Typography
                                    variant="small"
                                    className="text-gray-400 text-[10px] uppercase tracking-wider"
                                >
                                    Signed Date
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="text-primary font-medium mt-0.5"
                                >
                                    {signature.signedDate}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </GlassCard>
    );
};