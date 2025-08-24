// components/TestimonialCard/TestimonialCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { InfoCard } from '../InfoCard/InfoCard';
import { IconType } from 'react-icons';

interface TestimonialCardProps {
    quote: string;
    name: string;
    position: string;
    icon: IconType;
    iconAria: string;
    variant?: 'primary' | 'accent' | 'secondary';
    className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
                                                                    quote,
                                                                    name,
                                                                    position,
                                                                    icon: Icon,
                                                                    iconAria,
                                                                    variant = 'primary',
                                                                    className = ''
                                                                }) => {
    return (
        <InfoCard
            icon={Icon}
            title={name}
            subtitle={position}
            variant={variant}
            className={`text-center ${className}`}
            hideIconContainer={false}
        >
            <blockquote className="text-lg italic text-gray-800 mb-4 mt-2">
                &ldquo;{quote}&rdquo;
            </blockquote>
            <div className="font-semibold text-primary">{name}</div>
            <div className="text-sm text-gray-600">{position}</div>
        </InfoCard>
    );
};