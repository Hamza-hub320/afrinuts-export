import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string; // explicitly typed
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
        });

        if (ref.current) {
            ref.current.removeAttribute('data-processed');
            ref.current.innerHTML = chart;
            mermaid.init(undefined, ref.current);
        }
    }, [chart]);

    return <div ref={ref} className="mermaid" />;
};

export default Mermaid;