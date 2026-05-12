import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaCheckCircle, FaClock, FaArrowRight } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';

interface CertCardProps {
    icon: IconType;
    title: string;
    description: string;
    issuer: string;
    status: 'achieved' | 'upcoming'| 'in-progress';
    benefits: string[] | string;
    validity?: string;
    color: string;
    borderColor: string;
    iconColor: string;
    onClick?: () => void;
    className?: string;
}

const CertCard: React.FC<CertCardProps> = ({
                                               icon: Icon,
                                               title,
                                               description,
                                               issuer,
                                               status,
                                               benefits,
                                               validity,
                                               color,
                                               borderColor,
                                               iconColor,
                                               onClick,
                                               className = ''
                                           }) => {
    // Ensure benefits is always an array
    const benefitsArray: string[] = Array.isArray(benefits)
        ? benefits
        : typeof benefits === 'string'
            ? [benefits]
            : [];

    return (
        <motion.div
            className={`group relative bg-gradient-to-br ${color} border-2 ${borderColor} transition-all duration-500 rounded-3xl shadow-xl overflow-hidden transform-gpu cursor-pointer h-full ${className}`}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            whileHover={{ y: -8, scale: 1.02, rotateY: 2, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', transition: { duration: 0.3 } }}
            onClick={onClick}
        >
            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 transform-gpu translate-z-[-6px] group-hover:translate-z-[-10px] transition-all duration-500" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/15 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[inset_0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-500" />
            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml;base64,...')] opacity-20" />

            <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                    status === 'achieved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {status === 'achieved' ? 'Certified' : 'In Progress'}
                </div>

                {/* Icon and Title */}
                <div className="text-center mb-4">
                    <div className={`text-4xl mb-2 ${iconColor}`}>
                        <Icon />
                    </div>
                    <Typography variant="h4" className="mb-2">{title}</Typography>
                    <Typography variant="body-sm" className="text-text-dark/70">{issuer}</Typography>
                </div>

                {/* Description */}
                <Typography variant="body-sm" className="text-center mb-4 flex-grow line-clamp-3">{description}</Typography>

                {/* Benefits Preview */}
                {benefitsArray.length > 0 && (
                    <div className="mb-4">
                        <Typography variant="small" className="font-medium mb-2">Key Benefits:</Typography>
                        <ul className="space-y-1">
                            {benefitsArray.slice(0, 2).map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <div className={`w-1.5 h-1.5 rounded-full ${iconColor} mt-1.5 mr-2 flex-shrink-0`} />
                                    <Typography variant="body-sm" className="text-text-dark/80">{benefit}</Typography>
                                </li>
                            ))}
                            {benefitsArray.length > 2 && (
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0" />
                                    <Typography variant="body-sm" className="text-text-dark/60">
                                        +{benefitsArray.length - 2} more benefits
                                    </Typography>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Validity */}
                {status === 'achieved' && validity && (
                    <div className="mb-4 text-center">
                        <Typography variant="small" className="text-green-600 font-medium">
                            Valid until: {validity}
                        </Typography>
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-auto">
                    <span className="inline-flex items-center text-sm text-primary font-medium group-hover:underline">
                        Learn more <FaArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default CertCard;