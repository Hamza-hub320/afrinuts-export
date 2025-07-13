import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Typography } from '../Typography/Typography';

interface StatsCounterProps {
    endValue: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

const StatsCounter: React.FC<StatsCounterProps> = ({
                                                       endValue,
                                                       duration = 2,
                                                       suffix = '',
                                                       prefix = '',
                                                       className = ''
                                                   }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = endValue / (duration * 60); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= endValue) {
                setCount(endValue);
                clearInterval(timer);
            } else {
                setCount(Math.ceil(start));
            }
        }, 1000 / 60); // 60fps

        return () => clearInterval(timer);
    }, [endValue, duration]);

    return (
        <motion.div className={className}>
            <Typography variant="h3" className="font-bold">
                {prefix}{count}{suffix}
            </Typography>
        </motion.div>
    );
};

export default StatsCounter;