// components/FarmTimeline/FarmTimeline.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';

interface TimelineItem {
    year: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface FarmTimelineProps {
    items: TimelineItem[];
}

const FarmTimeline: React.FC<FarmTimelineProps> = ({ items }) => {
    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 h-full w-1 bg-accent transform -translate-x-1/2"></div>

            {/* Timeline items */}
            <div className="space-y-16">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Year marker - Updated with accent colors */}
                        <div className="w-1/2 flex justify-center relative z-10">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center font-display text-2xl font-bold border-4 shadow-lg
                text-accent border-accent bg-white`}>
                                {item.year}
                            </div>
                        </div>

                        {/* Content card */}
                        <div className="w-1/2 px-8">
                            <div className={`p-6 rounded-xl shadow-lg bg-white ${index % 2 === 0 ? 'ml-8' : 'mr-8'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-accent text-xl">
                                        {item.icon}
                                    </div>
                                    <Typography variant="h3" className="text-primary">
                                        {item.title}
                                    </Typography>
                                </div>
                                <Typography variant="body">
                                    {item.description}
                                </Typography>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FarmTimeline;