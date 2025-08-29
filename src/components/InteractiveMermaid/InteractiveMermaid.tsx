// components/InteractiveMermaid/InteractiveMermaid.tsx
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface InteractiveMermaidProps {
    chart: string;
    onElementClick: (zoneName: string) => void;
    className?: string;
}

const InteractiveMermaid: React.FC<InteractiveMermaidProps> = ({
                                                                   chart,
                                                                   onElementClick,
                                                                   className = ''
                                                               }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Initialize mermaid
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'inherit',
        });
    }, []);

    // Generate SVG from mermaid
    useEffect(() => {
        const generateSVG = async () => {
            try {
                setIsLoading(true);
                const { svg } = await mermaid.render('interactive-flowchart', chart);
                setSvgContent(svg);

                // Add click handlers after SVG is rendered
                setTimeout(() => {
                    addClickHandlers();
                    setIsLoading(false);
                }, 100);
            } catch (error) {
                console.error('Error generating mermaid SVG:', error);
                setIsLoading(false);
            }
        };

        generateSVG();
    }, [chart]);

    const addClickHandlers = () => {
        if (!containerRef.current) return;

        // Create a mapping of node labels to zone names
        const labelToZoneMap: Record<string, string> = {
            'Raw Nut Reception & Weighbridge': 'Raw Nut Reception & Weighbridge',
            'Raw Nut Storage Warehouse': 'Raw Nut Storage Warehouse',
            'Processing Hall - Dirty Zone': 'Processing Hall - Dirty Zone',
            'Processing Hall - Clean Zone': 'Processing Hall - Clean Zone',
            'Grading & Packing Section': 'Grading & Packing Section',
            'Finished Goods Warehouse': 'Finished Goods Warehouse',
            'Dispatch & Export Bay': 'Dispatch & Export Bay',
            'Locker Rooms & Hygiene Stations': 'Locker Rooms & Hygiene Stations',
            'Prayer Space & Rest Area': 'Prayer Space & Rest Area',
            'Training / Meeting Room': 'Training / Meeting Room',
            'Canteen': 'Canteen',
            'Water Treatment Plant': 'Water Treatment Plant',
            'Biomass Boiler / Solar PV': 'Biomass Boiler / Solar PV',
            'Future Expansion Area': 'Future Expansion Area',
        };

        // Add click handlers to all nodes
        const nodes = containerRef.current.querySelectorAll('.node');
        nodes.forEach(node => {
            // Find the text element inside the node
            const textElement = node.querySelector('text');
            if (textElement) {
                const label = textElement.textContent || '';
                const zoneName = labelToZoneMap[label];

                if (zoneName) {
                    // Make the node clickable
                    node.style.cursor = 'pointer';

                    // Remove existing event listeners
                    node.replaceWith(node.cloneNode(true));
                    const newNode = containerRef.current?.querySelector(`[id="${node.id}"]`);

                    if (newNode) {
                        newNode.addEventListener('click', () => {
                            onElementClick(zoneName);
                        });

                        // Add hover effects
                        newNode.addEventListener('mouseenter', () => {
                            const rect = newNode.querySelector('rect');
                            const polygon = newNode.querySelector('polygon');
                            const path = newNode.querySelector('path');

                            if (rect) rect.style.filter = 'brightness(1.2)';
                            if (polygon) polygon.style.filter = 'brightness(1.2)';
                            if (path) path.style.filter = 'brightness(1.2)';
                        });

                        newNode.addEventListener('mouseleave', () => {
                            const rect = newNode.querySelector('rect');
                            const polygon = newNode.querySelector('polygon');
                            const path = newNode.querySelector('path');

                            if (rect) rect.style.filter = 'none';
                            if (polygon) polygon.style.filter = 'none';
                            if (path) path.style.filter = 'none';
                        });
                    }
                }
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-text-dark/50">
                    Loading flowchart...
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`interactive-mermaid ${className}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export default InteractiveMermaid;