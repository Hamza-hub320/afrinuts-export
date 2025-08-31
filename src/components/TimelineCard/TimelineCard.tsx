import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaArrowRight,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';

interface TimelineItem {
    date: string;
    title: string;
    description: string;
    status?: 'completed' | 'current' | 'upcoming';
    milestone?: boolean;
    actualDate?: Date; // For precise date comparison
}

interface TimelineCardProps {
    title: string;
    subtitle?: string;
    items: TimelineItem[] | any;
    className?: string;
    showProgress?: boolean;
    expandable?: boolean;
    dynamicStatus?: boolean; // Enable/disable dynamic status
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
                                                              title,
                                                              subtitle,
                                                              items,
                                                              className = '',
                                                              showProgress = true,
                                                              expandable = true,
                                                              dynamicStatus = true // Default to dynamic status
                                                          }) => {
    const [expanded, setExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [processedItems, setProcessedItems] = useState<TimelineItem[]>([]);

    // Update current date periodically (once per day)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 86400000); // Update once per day

        return () => clearInterval(timer);
    }, []);

    // Process items when they change or currentDate updates
    useEffect(() => {
        const processItems = (items: any): TimelineItem[] => {
            if (!items) return [];

            let itemsArray: any[] = [];

            // If items is already an array of TimelineItem
            if (Array.isArray(items)) {
                itemsArray = items;
            }
            // If items is an object with an items property
            else if (typeof items === 'object' && items !== null && 'items' in items) {
                itemsArray = Array.isArray(items.items) ? items.items : [];
            }

            return itemsArray.map((item: any, index: number) => {
                const timelineItem: TimelineItem = {
                    date: item.date || '',
                    title: item.title || '',
                    description: item.description || '',
                    status: item.status,
                    milestone: item.milestone || false,
                    actualDate: item.actualDate
                };

                // Determine status if not explicitly provided
                if (!timelineItem.status) {
                    timelineItem.status = determineStatus(timelineItem, index, itemsArray.length);
                }

                return timelineItem;
            });
        };

        const determineStatus = (item: TimelineItem, index: number, total: number): 'completed' | 'current' | 'upcoming' => {
            if (dynamicStatus) {
                // Try to parse date for dynamic status determination
                let itemDate: Date | null = null;

                if (item.actualDate) {
                    itemDate = item.actualDate;
                } else {
                    // Parse the date string
                    try {
                        if (item.date.includes('-')) {
                            // Range like "2025-2026" - use the start year
                            const startYear = parseInt(item.date.split('-')[0]);
                            if (!isNaN(startYear)) {
                                itemDate = new Date(startYear, 0, 1); // January 1st of the start year
                            }
                        } else if (item.date.includes('+')) {
                            // Future date like "2033+" - use the base year
                            const baseYear = parseInt(item.date.replace('+', ''));
                            if (!isNaN(baseYear)) {
                                itemDate = new Date(baseYear, 0, 1);
                            }
                        } else {
                            // Single year like "2024"
                            const year = parseInt(item.date);
                            if (!isNaN(year)) {
                                itemDate = new Date(year, 0, 1);
                            }
                        }
                    } catch (error) {
                        console.warn('Could not parse date:', item.date);
                    }
                }

                if (itemDate) {
                    // Compare with current date
                    if (itemDate < currentDate) {
                        return 'completed';
                    } else if (
                        itemDate.getFullYear() === currentDate.getFullYear() ||
                        (itemDate.getFullYear() - 1 === currentDate.getFullYear() &&
                            currentDate.getMonth() >= 9) // Q4 consideration
                    ) {
                        return 'current';
                    } else {
                        return 'upcoming';
                    }
                }
            }

            // Fallback: position-based status
            if (index < Math.floor(total * 0.3)) return 'completed';
            if (index === Math.floor(total * 0.3)) return 'current';
            return 'upcoming';
        };

        setProcessedItems(processItems(items));
    }, [items, currentDate, dynamicStatus]);

    const completedItems = processedItems.filter(item => item.status === 'completed').length;
    const progressPercentage = processedItems.length > 0 ? (completedItems / processedItems.length) * 100 : 0;

    return (
        <motion.div
            className={`group relative bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-500 rounded-2xl shadow-xl transform-gpu overflow-hidden ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                rotateY: 2,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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

            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
                        {subtitle && (
                            <p className="text-text-dark/70">{subtitle}</p>
                        )}
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="bg-white/40 backdrop-blur-md p-3 rounded-full shadow-md"
                    >
                        <FaCalendarAlt className="text-primary text-xl" />
                    </motion.div>
                </div>

                {/* Show message if no items */}
                {processedItems.length === 0 && (
                    <div className="text-center py-8 text-text-dark/60">
                        <FaClock className="text-3xl mx-auto mb-2" />
                        <p>No roadmap items available</p>
                    </div>
                )}

                {/* Progress Bar - conditionally rendered */}
                {showProgress && processedItems.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2 text-sm font-medium text-text-dark">
                            <span>Progress: {completedItems}/{processedItems.length}</span>
                            <span>{Math.round(progressPercentage)}% Complete</span>
                        </div>
                        <div className="w-full bg-white/30 backdrop-blur-sm rounded-full h-3 overflow-hidden">
                            <motion.div
                                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />
                        </div>
                    </div>
                )}

                {/* Timeline Items */}
                {processedItems.length > 0 && (
                    <div className="space-y-4">
                        {processedItems.slice(0, expandable && !expanded ? 3 : processedItems.length).map((item, index) => (
                            <motion.div
                                key={index}
                                className={`flex items-start p-4 rounded-xl border-2 transition-all duration-300 ${
                                    item.status === 'completed'
                                        ? 'border-green-400/30 bg-green-500/10'
                                        : item.status === 'current'
                                            ? 'border-primary/30 bg-primary/10'
                                            : 'border-gray-300/30 bg-white/20'
                                }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -2, scale: 1.01 }}
                            >
                                {/* Status icon */}
                                <div className={`mr-4 p-2 rounded-full ${
                                    item.status === 'completed'
                                        ? 'bg-green-500/20 text-green-600'
                                        : item.status === 'current'
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-gray-400/20 text-gray-500'
                                }`}>
                                    {item.status === 'completed' ? (
                                        <FaCheckCircle className="text-lg" />
                                    ) : item.status === 'current' ? (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <FaClock className="text-lg" />
                                        </motion.div>
                                    ) : (
                                        <FaClock className="text-lg" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-text-dark">{item.title}</h3>
                                        <span className={`text-sm px-2 py-1 rounded-full ${
                                            item.status === 'completed'
                                                ? 'bg-green-500/20 text-green-700'
                                                : item.status === 'current'
                                                    ? 'bg-primary/20 text-primary'
                                                    : 'bg-gray-400/20 text-gray-600'
                                        }`}>
                      {item.date}
                    </span>
                                    </div>
                                    <p className="text-text-dark/70 text-sm mt-1">{item.description}</p>

                                    {item.milestone && (
                                        <div className="mt-2 inline-flex items-center px-2 py-1 bg-accent/20 text-accent-dark text-xs rounded-full">
                                            🎯 Key Milestone
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Expand/Collapse Button - conditionally rendered */}
                {expandable && processedItems.length > 3 && (
                    <motion.button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full mt-6 py-3 bg-white/30 backdrop-blur-sm rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 flex items-center justify-center text-primary font-medium"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {expanded ? (
                            <>
                                <FaChevronUp className="mr-2" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <FaChevronDown className="mr-2" />
                                Show {processedItems.length - 3} More Items
                            </>
                        )}
                    </motion.button>
                )}

                {/* Call to Action */}
                {processedItems.length > 0 && (
                    <motion.button
                        className="w-full mt-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium shadow-md flex items-center justify-center transform-gpu hover:scale-105 transition-all duration-300"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Track Our Progress
                        <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};