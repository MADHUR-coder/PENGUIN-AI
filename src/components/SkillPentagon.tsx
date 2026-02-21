import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { DOMAINS } from '../data/questionBank';

interface SkillPentagonProps {
    data: Record<string, number>;
    size?: number;
}

export default function SkillPentagon({ data, size = 300 }: SkillPentagonProps) {
    const chartData = DOMAINS.map((d) => ({
        domain: d.label,
        icon: d.icon,
        value: Math.round(data[d.id] || 0),
        fullMark: 100,
    }));

    return (
        <div style={{ width: size, height: size, margin: '0 auto' }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid
                        stroke="rgba(34, 211, 238, 0.12)"
                        gridType="polygon"
                    />
                    <PolarAngleAxis
                        dataKey="domain"
                        tick={({ x, y, payload }) => (
                            <g transform={`translate(${x},${y})`}>
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="#94a3b8"
                                    fontSize={11}
                                    fontFamily="Inter"
                                    fontWeight={500}
                                >
                                    {chartData.find(d => d.domain === payload.value)?.icon}{' '}
                                    {payload.value}
                                </text>
                            </g>
                        )}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Skill"
                        dataKey="value"
                        stroke="#22d3ee"
                        strokeWidth={2}
                        fill="rgba(34, 211, 238, 0.15)"
                        fillOpacity={1}
                        dot={{
                            r: 4,
                            fill: '#22d3ee',
                            stroke: '#0a0e1a',
                            strokeWidth: 2,
                        }}
                        animationDuration={1000}
                        animationEasing="ease-out"
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
