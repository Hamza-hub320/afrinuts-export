// components/ClickableSVG/ClickableSVG.tsx
import React, { useEffect, useRef } from 'react';

interface ClickableSVGProps {
    svgContent: string;
    onElementClick: (id: string, text: string, elementType: string) => void;
    className?: string;
}

const ClickableSVG: React.FC<ClickableSVGProps> = ({
                                                       svgContent,
                                                       onElementClick,
                                                       className = ''
                                                   }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !svgContent) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if click is on any SVG element that might be part of a node
            const isShape = target.closest('[class*="node"]') ||
                target.closest('rect') ||
                target.closest('path') ||
                target.closest('polygon');
            const isText = target.tagName === 'text' || target.closest('text');

            if (isShape || isText) {
                // Find the closest node container
                let nodeElement = target.closest('.node');
                if (!nodeElement) {
                    // If we clicked on a shape or text directly, find the parent node
                    nodeElement = target.closest('g');
                }

                if (nodeElement) {
                    // Try to extract text content from the node
                    let textContent = '';
                    const textElements = nodeElement.querySelectorAll('text');
                    if (textElements.length > 0) {
                        // Combine all text elements within the node
                        textContent = Array.from(textElements)
                            .map(el => el.textContent || '')
                            .filter(text => text.trim().length > 0)
                            .join(' ');
                    }

                    // Try to get ID from the node or generate one from text
                    let id = nodeElement.id || '';
                    if (!id && textContent) {
                        // Create a simple ID from the text content
                        id = textContent.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                    }

                    console.log('SVG Click detected:', { id, textContent, elementType: isText ? 'text' : 'shape' });
                    onElementClick(id, textContent, isText ? 'text' : 'shape');
                }
            }
        };

        const container = containerRef.current;
        container.addEventListener('click', handleClick);

        // Add pointer cursor to all potentially clickable elements
        const clickableElements = container.querySelectorAll('g, rect, path, polygon, text');
        clickableElements.forEach(element => {
            (element as HTMLElement).style.cursor = 'pointer';
        });

        // Add visual feedback for clickable elements
        const style = document.createElement('style');
        style.textContent = `
      .clickable-svg g:hover > rect,
      .clickable-svg g:hover > path,
      .clickable-svg g:hover > polygon {
        filter: brightness(1.2);
        stroke-width: 2px;
      }
      .clickable-svg text:hover {
        font-weight: bold;
      }
    `;
        container.appendChild(style);

        return () => {
            container.removeEventListener('click', handleClick);
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, [svgContent, onElementClick]);

    return (
        <div
            ref={containerRef}
            className={`clickable-svg ${className}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export default ClickableSVG;