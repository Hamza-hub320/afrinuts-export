// components/CertificationsCard/CertificationsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaAward, FaCertificate, FaRibbon, FaClock, FaSpinner, FaCheck } from 'react-icons/fa';

export interface Certification {
    id: string;
    title: string;
    description?: string;
    status?: 'achieved' | 'in-progress' | 'planned';
    targetDate?: string;
    issuer?: string;
    year?: string;
    icon?: React.ComponentType<{ className?: string }>;
    verificationLink?: string;
}

interface CertificationsCardProps {
    certifications: Certification[];
    title?: string;
    subtitle?: string;
    className?: string;
    variant?: 'primary' | 'accent' | 'secondary';
    columns?: 2 | 3 | 4 | 5;
    compact?: boolean;
}

export const CertificationsCard: React.FC<CertificationsCardProps> = ({
                                                                          certifications,
                                                                          title = "Our Certifications",
                                                                          subtitle = "Quality standards and industry recognition",
                                                                          className = '',
                                                                          variant = 'primary',
                                                                          columns = 4,
                                                                          compact = false,
                                                                      }) => {
    // Variant styles
    const variantStyles = {
        primary: {
            bg: 'from-primary/5 to-accent/5',
            border: 'border-primary/20 hover:border-accent/30',
            text: 'text-primary',
            icon: 'text-primary'
        },
        accent: {
            bg: 'from-accent/5 to-primary/5',
            border: 'border-accent/20 hover:border-primary/30',
            text: 'text-accent-dark',
            icon: 'text-accent'
        },
        secondary: {
            bg: 'from-secondary/5 to-primary/5',
            border: 'border-secondary/20 hover:border-primary/30',
            text: 'text-secondary-dark',
            icon: 'text-secondary'
        },
    };

    // Helper function to get status badge styles
    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'achieved':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-700',
                    icon: FaCheck,
                    label: 'Certified'
                };
            case 'in-progress':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-700',
                    icon: FaSpinner,
                    label: 'In Progress'
                };
            case 'planned':
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-600',
                    icon: FaClock,
                    label: 'Planned'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-600',
                    icon: FaClock,
                    label: 'Planned'
                };
        }
    };

    // Column classes
    const columnClasses = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4',
        5: 'grid-cols-2 md:grid-cols-5'
    };

    const currentVariant = variantStyles[variant];

    // Default icon if none provided
    const DefaultIcon = FaShieldAlt;

    return (
        <motion.div
            className={`group relative bg-gradient-to-br ${currentVariant.bg} border-2 ${currentVariant.border} transition-all duration-500 rounded-2xl shadow-xl p-5 sm:p-6 transform-gpu ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -5,
                scale: 1.01,
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.2)',
                transition: { duration: 0.3 }
            }}
        >
            {/* 3D edge effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />

            {/* Glassy overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

            {/* Inner shadow effect */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMjUiLz48L2c+PC9zdmc+')] opacity-20" />

            <div className="relative z-10">
                {/* Header */}
                {(title || subtitle) && (
                    <div className="text-center mb-8">
                        {title && (
                            <h2 className={`text-2xl font-bold ${currentVariant.text} mb-2`}>
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-text-dark text-sm max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Certifications Grid */}
                <motion.div
                    className={`grid ${columnClasses[columns]} gap-4 md:gap-6`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    {certifications.map((certification) => {
                        const IconComponent = certification.icon || DefaultIcon;
                        const statusBadge = getStatusBadge(certification.status);

                        return (
                            <motion.div
                                key={certification.id}
                                className="group/cert relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex flex-col items-center text-center transform-gpu"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 15
                                        }
                                    }
                                }}
                                whileHover={{
                                    y: -5,
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                {/* Certification Icon */}
                                <motion.div
                                    className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-3 transform-gpu group-hover/cert:scale-110 transition-transform duration-500 shadow-md"
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <IconComponent className={`${currentVariant.icon} text-lg`} />
                                </motion.div>

                                {/* Certification Title */}
                                <h3 className="font-semibold text-text-dark text-sm mb-1">
                                    {certification.title}
                                </h3>

                                {/* Status Badge */}
                                {certification.status && (
                                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} mb-2`}>
                                        <statusBadge.icon className="w-3 h-3" />
                                        <span>{statusBadge.label}</span>
                                    </div>
                                )}

                                {/* Target Date */}
                                {certification.targetDate && (
                                    <div className="text-xs text-primary font-medium mb-2">
                                        Target: {certification.targetDate}
                                    </div>
                                )}

                                {/* Optional Description */}
                                {!compact && certification.description && (
                                    <p className="text-text-dark/70 text-xs mb-2">
                                        {certification.description}
                                    </p>
                                )}

                                {/* Optional Issuer */}
                                {!compact && certification.issuer && (
                                    <div className="text-text-dark/60 text-xs mt-auto">
                                        {certification.issuer}
                                    </div>
                                )}

                                {/* Verification Badge */}
                                {certification.verificationLink && (
                                    <motion.a
                                        href={certification.verificationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center transform-gpu group-hover/cert:scale-125 transition-transform duration-500 shadow-sm"
                                        whileHover={{ scale: 1.2 }}
                                        aria-label="Verify certification"
                                    >
                                        <FaCheckCircle className="h-3 w-3 text-white" />
                                    </motion.a>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
};