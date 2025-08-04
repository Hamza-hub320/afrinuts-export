import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'xs' | 'sm' | 'md' | 'lg';
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
    const baseClasses =
        'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeClasses: Record<string, string> = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-5 py-3 text-lg',
    };

    const variantClasses: Record<string, string> = {
        primary:
            'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
        secondary:
            'bg-secondary text-primary-dark hover:bg-secondary/90 focus:ring-secondary',
        outline:
            'border border-primary text-primary bg-transparent hover:bg-primary/10 focus:ring-primary',
        ghost:
            'bg-transparent text-text-dark hover:bg-gray-100 focus:ring-gray-300',
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
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
        >
            {loading ? (
                <>
                    <FaSpinner className="animate-spin mr-2 text-sm" />
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;