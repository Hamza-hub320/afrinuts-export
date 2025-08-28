// components/ClickableSVG/ClickableSVG.tsx
import React, { useState, useEffect } from 'react';

interface ClickableSVGProps {
    svgContent: string;
    onElementClick?: (id: string, text: string, elementType: string) => void;
    className?: string;
}

const ClickableSVG: React.FC<ClickableSVGProps> = ({
                                                       svgContent,
                                                       onElementClick,
                                                       className = ''
                                                   }) => {
    const [processedSvg, setProcessedSvg] = useState<string>('');

    useEffect(() => {
        if (!svgContent) return;

        // Parse the SVG and add click handlers
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        // Make all nodes and clusters clickable
        const clickableElements = svgElement.querySelectorAll('.node, .cluster, .edgeLabel, .label');

        clickableElements.forEach(element => {
            const id = element.id;
            const textElement = element.querySelector('text');
            const text = textElement?.textContent || element.textContent || '';
            const elementType = element.classList.contains('node') ? 'node' :
                element.classList.contains('cluster') ? 'cluster' : 'label';

            // Add click event with more data
            element.setAttribute('style', 'cursor: pointer;');
            element.setAttribute('onclick', `window.handleSVGClick('${id}', '${text.replace(/'/g, "\\'")}', '${elementType}')`);

            // Add hover effects
            element.setAttribute('onmouseover', 'this.style.opacity = "0.8"');
            element.setAttribute('onmouseout', 'this.style.opacity = "1"');
        });

        // Update the SVG content
        setProcessedSvg(new XMLSerializer().serializeToString(svgElement));
    }, [svgContent]);

    // Add global click handler
    useEffect(() => {
        if (onElementClick) {
            (window as any).handleSVGClick = (id: string, text: string, elementType: string) => {
                console.log('SVG element clicked:', { id, text, elementType });
                onElementClick(id, text, elementType);
            };
        }

        return () => {
            delete (window as any).handleSVGClick;
        };
    }, [onElementClick]);

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: processedSvg }}
        />
    );
};

export default ClickableSVG;