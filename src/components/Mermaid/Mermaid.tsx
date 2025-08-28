import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;

        const renderChart = async () => {
            if (ref.current) {
                try {
                    mermaid.initialize({ startOnLoad: false, theme: 'default' });

                    const { svg } = await mermaid.render(
                        `mermaid-${Date.now()}`,
                        chart
                    );

                    if (isMounted && ref.current) {
                        ref.current.innerHTML = svg;
                    }
                } catch (err) {
                    console.error('Mermaid render error:', err);
                }
            }
        };

        renderChart();

        return () => {
            isMounted = false;
        };
    }, [chart]);

    return <div ref={ref} className="mermaid" />;
};

export default Mermaid;