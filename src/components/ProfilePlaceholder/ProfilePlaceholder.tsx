import React from 'react';
import { FaUserTie } from 'react-icons/fa';
import {GiFarmer} from "react-icons/gi";

interface ProfilePlaceholderProps {
    name: string;
    size?: number;
    className?: string;
    variant?: 'primary' | 'accent' | 'secondary';
}

const ProfilePlaceholder: React.FC<ProfilePlaceholderProps> = ({
                                                                   name,
                                                                   size = 128,
                                                                   className = '',
                                                                   variant = 'primary'
                                                               }) => {
    // Color palette matching ProfileCard variants
    const variantColors = {
        primary: {
            bg: 'bg-primary/20',
            text: 'text-primary',
            border: 'border-primary/30',
        },
        accent: {
            bg: 'bg-accent/20',
            text: 'text-accent',
            border: 'border-accent/30',
        },
        secondary: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            border: 'border-green-300/30',
        },
    };

    const c = variantColors[variant];

    return (
        <div
            className={`rounded-full flex items-center justify-center border-2 ${c.border} ${c.bg} ${c.text} ${className}`}
            style={{ width: size, height: size }}
        >
            <GiFarmer style={{ fontSize: size * 0.4 }} />
        </div>
    );
};

export default ProfilePlaceholder;