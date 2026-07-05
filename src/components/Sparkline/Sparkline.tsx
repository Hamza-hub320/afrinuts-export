import React from 'react';

interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

const Sparkline: React.FC<SparklineProps> = ({
                                                 data,
                                                 width = 80,
                                                 height = 24,
                                                 color = '#5A7411',
                                                 className = ''
                                             }) => {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    // Compute trend direction for arrow
    const first = data[0];
    const last = data[data.length - 1];
    const trend = last > first ? 'up' : last < first ? 'down' : 'stable';
    const arrowColor = trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#6b7280';
    const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* End dot */}
                <circle
                    cx={width}
                    cy={height - ((last - min) / range) * height}
                    r="2"
                    fill={color}
                />
            </svg>
            <span style={{ color: arrowColor, fontSize: '0.8rem', fontWeight: 'bold' }}>{arrow}</span>
        </div>
    );
};

export default Sparkline;