import { InfoCard } from '@/components/InfoCard/InfoCard';
import { Typography } from '@/components/Typography/Typography';
import { FaMobile, FaClipboardList, FaCalendarAlt, FaClock, FaShieldAlt } from 'react-icons/fa';

export const BatchSignatureCard = ({ metadata, signature }: { metadata: any; signature: any }) => {
    if (!metadata) return null;

    const items = [
        { label: 'Record ID', value: metadata.recordId, icon: FaClipboardList },
        { label: 'Created', value: metadata.created, icon: FaCalendarAlt },
        { label: 'Last Updated', value: metadata.lastUpdated, icon: FaClock },
        { label: 'Status', value: metadata.verificationStatus, icon: FaShieldAlt, highlight: true },
    ];

    return (
        <InfoCard icon={FaMobile} title="Farm OS Record" variant="accent" showInfoBadge={false}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className={`rounded-xl p-3 border text-center ${
                            item.highlight ? 'bg-green-50/60 border-green-200' : 'bg-white/40 border-white/30'
                        }`}
                    >
                        <item.icon
                            className={`text-lg mx-auto mb-1 ${
                                item.highlight ? 'text-green-600' : 'text-accent'
                            }`}
                        />
                        <Typography variant="small" className="text-gray-500 text-[10px] uppercase tracking-wider">
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
                ))}
            </div>
            {signature && (
                <div className="mt-4 pt-4 border-t border-gray-200/30">
                    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/20">
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
                            <div className="bg-white/50 rounded-lg p-2.5 text-center">
                                <Typography variant="small" className="text-gray-400 text-[10px] uppercase tracking-wider">
                                    Verification Code
                                </Typography>
                                <Typography variant="small" className="font-mono font-bold text-primary mt-0.5 tracking-wider">
                                    {signature.code}
                                </Typography>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2.5 text-center">
                                <Typography variant="small" className="text-gray-400 text-[10px] uppercase tracking-wider">
                                    Signature
                                </Typography>
                                <Typography variant="small" className="font-mono text-primary text-[9px] mt-0.5 truncate">
                                    {signature.signature}
                                </Typography>
                            </div>
                            <div className="bg-white/50 rounded-lg p-2.5 text-center">
                                <Typography variant="small" className="text-gray-400 text-[10px] uppercase tracking-wider">
                                    Signed Date
                                </Typography>
                                <Typography variant="small" className="text-primary font-medium mt-0.5">
                                    {signature.signedDate}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </InfoCard>
    );
};