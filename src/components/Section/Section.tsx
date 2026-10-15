// src/components/Section/Section.tsx
import React, { CSSProperties, ReactNode } from 'react';
import { Reveal } from '@/components/Reveal';

interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    bgGradient?: string;
}

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    bgImage?: string | StaticImageData;
    overlay?: boolean;
    overlayColor?: string;
    fullHeight?: boolean;
    containerClass?: string;
    imageStyles?: CSSProperties;
    /** Auto-wrap children in <Reveal>. Default: true */
    animate?: boolean;
    /** Reveal delay in seconds. Default: 0 */
    animateDelay?: number;
    /** Disable the inner container (for edge-to-edge sections). Default: false */
    noContainer?: boolean;
}

const Section: React.FC<SectionProps> = ({
                                             children,
                                             className = '',
                                             id,
                                             bgImage,
                                             overlay = false,
                                             overlayColor = 'bg-black/50',
                                             fullHeight = false,
                                             containerClass = '',
                                             imageStyles = {},
                                             animate = true,
                                             animateDelay = 0,
                                             noContainer = false,
                                         }) => {
    const backgroundStyle: CSSProperties = bgImage
        ? {
            backgroundImage:
                typeof bgImage === 'string'
                    ? `url(${bgImage})`
                    : `url(${bgImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            ...imageStyles,
        }
        : {};

    const content = noContainer ? (
        children
    ) : (
        <div className={`container mx-auto px-4 relative z-10 ${containerClass}`}>
            {children}
        </div>
    );

    return (
        <section
            id={id}
            className={`
                relative
                ${fullHeight ? 'min-h-screen' : 'py-16'}
                ${className}
            `}
            style={backgroundStyle}
        >
            {overlay && <div className={`absolute inset-0 ${overlayColor}`} />}
            {animate ? (
                <Reveal delay={animateDelay}>{content}</Reveal>
            ) : (
                content
            )}
        </section>
    );
};

export default Section;