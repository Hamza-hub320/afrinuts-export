// src/components/Section/Section.tsx
import React, { CSSProperties } from 'react';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    bgImage?: string;
    overlay?: boolean;
    overlayColor?: string;
    fullHeight?: boolean;
    containerClass?: string;
}

const Section: React.FC<SectionProps> = ({
                                             children,
                                             className = '',
                                             id,
                                             bgImage,
                                             overlay = false,
                                             overlayColor = 'bg-black/50',
                                             fullHeight = false,
                                             containerClass = ''
                                         }) => {
    const backgroundStyle: CSSProperties = bgImage
        ? {
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }
        : {};

    return (
        <section
            id={id}
            className={`
        relative
        ${fullHeight ? 'min-h-screen' : 'py-20'}
        ${className}
      `}
            style={backgroundStyle}
        >
            {overlay && (
                <div className={`absolute inset-0 ${overlayColor}`} />
            )}
            <div className={`container mx-auto px-4 relative z-10 ${containerClass}`}>
                {children}
            </div>
        </section>
    );
};

export default Section;