// src/components/Section/Section.tsx
import React, { CSSProperties } from 'react';

// Type for imported images in Vite
interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
}

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    bgImage?: string | StaticImageData; // Accept both string paths and imported images
    overlay?: boolean;
    overlayColor?: string;
    fullHeight?: boolean;
    containerClass?: string;
    imageStyles?: CSSProperties; // Renamed from bgImageStyles to avoid confusion
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
                                             imageStyles = {}
                                         }) => {
    const backgroundStyle: CSSProperties = bgImage
        ? {
            backgroundImage: typeof bgImage === 'string'
                ? `url(${bgImage})`
                : `url(${bgImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            ...imageStyles // Spread additional image styles
        }
        : {};

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