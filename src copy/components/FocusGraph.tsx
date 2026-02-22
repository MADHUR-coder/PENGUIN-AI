import { ResponsiveContainer, AreaChart, Area, YAxis, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';

export default function FocusGraph() {
    const { state } = useApp();
    const data = state.focusSession.history;

    if (!state.focusSession.active || data.length === 0) return null;

    return (
        <div className="focus-graph-container glass-card-static" style={{ height: 120, padding: 'var(--space-2)' }}>
            <div className="focus-graph-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, opacity: 0.7 }}>FOCUS TREND</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--cyan-primary)' }}>{state.focusSession.score}%</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--cyan-primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--cyan-primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="focus-tooltip" style={{ background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: 4, fontSize: 10 }}>
                                        {payload[0].value}%
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="var(--cyan-primary)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#focusGradient)"
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
