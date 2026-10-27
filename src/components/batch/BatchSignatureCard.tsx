import { GlassCard } from '@/components/buyer/GlassCard';
import { Typography } from '@/components/Typography/Typography';
import {
    FaMobile,
    FaClipboardList,
    FaCalendarAlt,
    FaClock,
    FaShieldAlt,
} from 'react-icons/fa';

export const BatchSignatureCard = ({
                                       metadata,
                                       signature,
                                   }: {
    metadata: any;
    signature: any;
}) => {
    if (!metadata) return null;

    const items = [
        { label: 'Record ID', value: metadata.recordId, icon: FaClipboardList },
        { label: 'Created', value: metadata.created, icon: FaCalendarAlt },
        { label: 'Last Updated', value: metadata.lastUpdated, icon: FaClock },
        { label: 'Status', value: metadata.verificationStatus, icon: FaShieldAlt, highlight: true },
    ];

    return (
        <GlassCard
            icon={FaMobile}
            title="Farm OS Record"
            variant="accent"
            minimal
        >
            {/* Status tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                {items.map((item, i) => {
                    const Icon = item.icon;
                    const isGreen = item.highlight;
                    return (
                        <div
                            key={i}
                            className={`rounded-lg p-2.5 border text-center ${
                                isGreen
                                    ? 'bg-green-50/70 border-green-200'
                                    : 'bg-white/50 border-white/50'
                            }`}
                        >
                            <Icon
                                className={`text-sm mx-auto mb-1 ${
                                    isGreen ? 'text-green-600' : 'text-accent'
                                }`}
                            />
                            <div className="text-gray-500 text-[9px] uppercase tracking-wider">
                                {item.label}
                            </div>
                            <div
                                className={`font-semibold text-[11px] mt-0.5 truncate ${
                                    isGreen ? 'text-green-700' : 'text-primary'
                                }`}
                                title={String(item.value ?? '')}
                            >
                                {item.value ?? '—'}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Digital signature */}
            {signature && (
                <div className="mt-4 pt-3 border-t border-white/50">
                    <div className="bg-white/50 rounded-lg p-3 border border-white/60">
                        <div className="flex items-center gap-2 mb-2.5">
                            <FaShieldAlt className="text-green-600 text-sm" />
                            <span className="font-semibold text-gray-900 text-sm">
                                Digital Signature
                            </span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-semibold">
                                Verified
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="bg-white/60 rounded-md p-2 text-center">
                                <div className="text-gray-400 text-[9px] uppercase tracking-wider">
                                    Verification Code
                                </div>
                                <div className="font-mono font-bold text-primary text-xs mt-0.5 tracking-wider truncate">
                                    {signature.code}
                                </div>
                            </div>
                            <div className="bg-white/60 rounded-md p-2 text-center">
                                <div className="text-gray-400 text-[9px] uppercase tracking-wider">
                                    Signature
                                </div>
                                <div
                                    className="font-mono text-primary text-[10px] mt-0.5 truncate"
                                    title={signature.signature}
                                >
                                    {signature.signature}
                                </div>
                            </div>
                            <div className="bg-white/60 rounded-md p-2 text-center">
                                <div className="text-gray-400 text-[9px] uppercase tracking-wider">
                                    Signed Date
                                </div>
                                <div className="text-primary font-medium text-[11px] mt-0.5 truncate">
                                    {signature.signedDate}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </GlassCard>
    );
};