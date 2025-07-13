import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';
import { fadeIn } from '../../utils/animations';

interface TimelineItem {
    year: number;
    title: string;
    description: string;
    icon?: React.ReactNode;
}

interface FarmTimelineProps {
    items: TimelineItem[];
    className?: string;
}

const FarmTimeline: React.FC<FarmTimelineProps> = ({ items, className = '' }) => {
    return (
        <div className={`relative ${className}`}>
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-afri-secondary/30 top-0"></div>

            <div className="space-y-16">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className="relative flex flex-col md:flex-row items-center"
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {/* Year badge - alternates sides */}
                        <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-start justify-center' : 'md:justify-end justify-center'} mb-4 md:mb-0`}>
                            <div className="relative">
                                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-afri-secondary border-4 border-white z-10"></div>
                                <div className="bg-afri-primary text-white px-6 py-3 rounded-lg shadow-md">
                                    <Typography variant="h3" className="font-bold">
                                        {item.year}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        {/* Spacer for alternating layout */}
                        <div className="hidden md:block md:w-1/2"></div>

                        {/* Content card - alternates sides */}
                        <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                            <motion.div
                                className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${index % 2 === 0 ? 'border-afri-primary' : 'border-afri-secondary'}`}
                                whileHover={{ y: -5 }}
                            >
                                <div className="flex items-center mb-3">
                                    {item.icon && (
                                        <div className="mr-3 text-afri-secondary">
                                            {item.icon}
                                        </div>
                                    )}
                                    <Typography variant="h4" className="text-afri-primary">
                                        {item.title}
                                    </Typography>
                                </div>
                                <Typography variant="body" className="text-afri-dark">
                                    {item.description}
                                </Typography>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FarmTimeline;