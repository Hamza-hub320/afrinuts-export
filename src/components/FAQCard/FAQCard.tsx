// components/FAQCard/FAQCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaDownload, FaFileAlt } from 'react-icons/fa';
import { InfoCard } from '../InfoCard/InfoCard';
import { Typography } from '../Typography/Typography';
import { LazyMotion, domAnimation } from 'framer-motion';

interface FAQItem {
    question: string;
    answer: string;
    audience?: string[];
    visualAid?: {
        type: 'image' | 'video';
        src: string;
        alt: string;
        caption?: string;
    };
    actions?: {
        contact?: boolean;
        download?: string;
        request?: string;
    };
}

interface FAQCardProps {
    title: string;
    icon: React.ReactNode;
    questions: FAQItem[];
    variant?: 'primary' | 'accent' | 'secondary';
    className?: string;
    onActionClick?: (action: any, item: FAQItem) => void;
    getButtonLabel?: (item: FAQItem) => string;
}

export const FAQCard: React.FC<FAQCardProps> = ({
                                                    title,
                                                    icon,
                                                    questions,
                                                    variant = 'primary',
                                                    className = '',
                                                    onActionClick,
                                                    getButtonLabel
                                                }) => {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSection(sectionId);
        }
    };

    const VisualAid = ({ type, src, alt, caption }: {
        type: 'image' | 'video';
        src: string;
        alt: string;
        caption?: string;
    }) => {
        return (
            <div className="my-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/30">
                {type === 'image' && <img src={src} alt={alt} className="w-full h-auto rounded-md max-h-64 object-contain" />}
                {type === 'video' && (
                    <video controls className="w-full rounded-md">
                        <source src={src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}
                {caption && <p className="text-sm text-gray-600 mt-2 text-center">{caption}</p>}
            </div>
        );
    };

    return (
        <InfoCard
            title={title}
            icon={() => icon}
            variant={variant}
            className={`faq-card ${className}`}
            hideIconContainer={false}
            cta={
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-primary hover:text-accent font-medium text-sm flex items-center"
                >
                    {isExpanded ? 'Show Less' : 'Show All Questions'}
                    {isExpanded ? (
                        <FaChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                        <FaChevronDown className="ml-1 w-4 h-4" />
                    )}
                </button>
            }
        >
            <div className="space-y-4 mt-4">
                {questions.slice(0, isExpanded ? questions.length : 3).map((item, index) => (
                    <motion.div
                        key={index}
                        className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0 bg-white/50 backdrop-blur-sm rounded-lg p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <button
                            className="w-full text-left flex justify-between items-center group py-2"
                            onClick={() => toggleSection(`question-${index}`)}
                            onKeyDown={(e) => handleKeyDown(e, `question-${index}`)}
                            aria-expanded={openSections[`question-${index}`]}
                            aria-controls={`answer-${index}`}
                        >
                            <Typography
                                variant="h5"
                                className="text-text-dark text-base font-medium group-hover:text-primary transition-colors"
                            >
                                {item.question}
                            </Typography>
                            {openSections[`question-${index}`] ? (
                                <FaChevronUp className="text-primary ml-4 flex-shrink-0" />
                            ) : (
                                <FaChevronDown className="text-primary ml-4 flex-shrink-0 group-hover:text-primary transition-colors" />
                            )}
                        </button>

                        <LazyMotion features={domAnimation}>
                            <motion.div
                                id={`answer-${index}`}
                                role="region"
                                aria-labelledby={`question-${index}`}
                                initial={false}
                                animate={{
                                    height: openSections[`question-${index}`] ? 'auto' : 0,
                                    opacity: openSections[`question-${index}`] ? 1 : 0
                                }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="pb-2 pl-1">
                                    <Typography variant="body" className="text-text-dark leading-relaxed mb-3">
                                        {item.answer}
                                    </Typography>

                                    {/* Visual Aid */}
                                    {item.visualAid && (
                                        <VisualAid
                                            type={item.visualAid.type}
                                            src={item.visualAid.src}
                                            alt={item.visualAid.alt}
                                            caption={item.visualAid.caption}
                                        />
                                    )}

                                    {/* Action Buttons */}
                                    {(item.actions?.contact || item.actions?.download || item.actions?.request) && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {(item.actions?.contact || item.actions?.request) && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-accent transition-colors flex items-center shadow-md"
                                                    onClick={() => onActionClick?.({ type: 'request', link: item.actions?.request }, item)}
                                                >
                                                    <FaFileAlt className="mr-2" />
                                                    {getButtonLabel?.(item) || 'Request Information'}
                                                </motion.button>
                                            )}
                                            {item.actions?.download && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center shadow-md"
                                                    onClick={() => onActionClick?.({ type: 'download', link: item.actions?.download }, item)}
                                                >
                                                    <FaDownload className="mr-2" />
                                                    {getButtonLabel?.(item) || 'Download PDF'}
                                                </motion.button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </LazyMotion>
                    </motion.div>
                ))}
            </div>

            {questions.length > 3 && !isExpanded && (
                <div className="text-center mt-4">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="text-primary hover:text-accent font-medium text-sm"
                    >
                        + {questions.length - 3} more questions
                    </button>
                </div>
            )}
        </InfoCard>
    );
};