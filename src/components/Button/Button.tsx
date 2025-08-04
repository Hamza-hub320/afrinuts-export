import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           variant = 'primary',
                                           size = 'md',
                                           className = '',
                                           disabled = false,
                                           loading = false,
                                           type = 'button',
                                       }) => {
    const baseClasses = 'rounded-md font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const variantClasses = {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-md',
        secondary: 'bg-secondary text-dark-orange hover:bg-secondary/90 shadow-md',
        outline: 'border border-primary text-primary bg-white hover:bg-warm-grey/20 shadow-sm',
        ghost: 'text-text-dark bg-white/90 hover:bg-white shadow-sm',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
        >
            {loading ? (
                <>
                    <FaSpinner className="animate-spin mr-2" />
                    {children}
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;