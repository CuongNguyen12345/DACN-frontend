import React from 'react';

const RadarChart = ({ data, size = 300 }) => {
    // data: [{ subject: 'Math', value: 80 }, ...] value 0-100
    const center = size / 2;
    const radius = (size / 2) - 40; // padding
    const total = data.length;
    const angleSlice = (Math.PI * 2) / total;

    // Helper to calculate coordinates
    const getCoordinates = (value, index) => {
        const angle = index * angleSlice - Math.PI / 2; // Rotate start to top
        const r = (value / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y };
    };

    // Grid levels (20%, 40%, 60%, 80%, 100%)
    const levels = [20, 40, 60, 80, 100];

    // Create polygon points string
    const getPolygonPoints = (dataValues) => {
        return dataValues.map((d, i) => {
            const { x, y } = getCoordinates(d.value, i);
            return `${x},${y}`;
        }).join(' ');
    };

    const polyPoints = getPolygonPoints(data);

    return (
        <div style={{ width: size, height: size, margin: '0 auto', position: 'relative' }}>
            <svg width={size} height={size}>
                {/* Grid Circles/Polygons */}
                {levels.map((level) => (
                    <circle
                        key={level}
                        cx={center}
                        cy={center}
                        r={(level / 100) * radius}
                        fill="none"
                        stroke="#e8e8e8"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Axes */}
                {data.map((_, i) => {
                    const { x, y } = getCoordinates(100, i);
                    return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#e8e8e8" />;
                })}

                {/* Data Polygon */}
                <polygon points={polyPoints} fill="rgba(24, 144, 255, 0.2)" stroke="#1890ff" strokeWidth="2" />

                {/* Data Points */}
                {data.map((d, i) => {
                    const { x, y } = getCoordinates(d.value, i);
                    return <circle key={i} cx={x} cy={y} r="4" fill="#1890ff" />;
                })}

                {/* Labels */}
                {data.map((d, i) => {
                    const { x, y } = getCoordinates(115, i); // Place slightly outside
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            style={{ fontSize: '12px', fill: '#666', fontWeight: 500 }}
                        >
                            {d.subject}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

export default RadarChart;
