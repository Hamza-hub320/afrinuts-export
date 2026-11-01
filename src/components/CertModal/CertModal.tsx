import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaTimes, FaCheckCircle, FaClock, FaDownload } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';

interface CertModalProps {
    isOpen: boolean;
    onClose: () => void;
    icon: IconType;
    title: string;
    description: string;
    issuer: string;
    status: 'achieved' | 'in-progress' | 'planned';
    benefits: string[] | string;
    validity?: string;
    color: string;
    borderColor: string;
    iconColor: string;
}

const CertModal: React.FC<CertModalProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 icon: Icon,
                                                 title,
                                                 description,
                                                 issuer,
                                                 status,
                                                 benefits,
                                                 validity,
                                                 color,
                                                 borderColor,
                                                 iconColor
                                             }) => {
    if (!isOpen) return null;

    // Normalize benefits to always be an array
    const benefitsArray: string[] = Array.isArray(benefits)
        ? benefits
        : typeof benefits === 'string'
            ? [benefits]
            : [];

    // Three-way status badge config
    const badge =
        status === 'achieved'
            ? { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-200', icon: FaCheckCircle, label: 'Certified' }
            : status === 'in-progress'
                ? { bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-200', icon: FaClock, label: 'In Progress' }
                : { bg: 'bg-gray-100', text: 'text-gray-600', ring: 'ring-gray-200', icon: FaClock, label: 'Planned' };
    const BadgeIcon = badge.icon;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden transform-gpu"
                onClick={(e) => e.stopPropagation()}
                style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                }}
            >
                {/* 3D edge effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px]" />

                {/* Glassy overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40" />

                <div className={`p-8 ${color} border-b-2 ${borderColor} relative z-10`}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center">
                            <div className={`text-4xl mr-4 ${iconColor}`}>
                                <Icon />
                            </div>
                            <div>
                                <Typography variant="h2">{title}</Typography>
                                <Typography variant="body" className="text-text-dark/70">
                                    {issuer}
                                </Typography>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-text-dark/50 hover:text-text-dark transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Status Badge — three-way */}
                    <div
                        className={`px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-medium ring-1 ${badge.bg} ${badge.text} ${badge.ring}`}
                    >
                        <BadgeIcon className="text-xs" />
                        <span>{badge.label}</span>
                        {status === 'achieved' && validity && (
                            <span className="opacity-70">• {validity}</span>
                        )}
                    </div>
                </div>

                <div className="p-8 relative z-10">
                    <Typography variant="h4" className="mb-4">
                        About this Certification
                    </Typography>
                    <Typography variant="body" className="mb-8">
                        {description}
                    </Typography>

                    <Typography variant="h4" className="mb-4">
                        Key Benefits
                    </Typography>
                    <ul className="space-y-3 mb-8">
                        {benefitsArray.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                                <div className={`w-2 h-2 rounded-full ${iconColor} mt-2 mr-3 flex-shrink-0`}></div>
                                <Typography variant="body">{benefit}</Typography>
                            </li>
                        ))}
                    </ul>

                    {/* Certificate downloads only for achieved certs */}
                    {status === 'achieved' && (
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <Typography variant="h5" className="mb-4">
                                Certificate Downloads
                            </Typography>
                            <button className="flex items-center text-primary hover:text-accent transition-colors">
                                <FaDownload className="mr-2" />
                                Download Certificate PDF
                            </button>
                        </div>
                    )}

                    {/* Optional: reassurance note for planned certs */}
                    {status === 'planned' && (
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <Typography variant="body" className="text-text-dark/70">
                                This certification is planned. Documentation and audit timeline will be published here once the certification process begins.
                            </Typography>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CertModal;