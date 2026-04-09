'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const platformColors = {
  netflix: { stroke: '#E50914', fill: 'rgba(229, 9, 20, 0.3)' },
  prime: { stroke: '#00A8E1', fill: 'rgba(0, 168, 225, 0.3)' },
  hotstar: { stroke: '#FFD700', fill: 'rgba(255, 215, 0, 0.3)' },
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMinutes(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
  return val;
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(20, 20, 20, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '12px 16px',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{ color: '#fff', fontWeight: 600, marginBottom: '4px', fontSize: '13px' }}>{label}</p>
        <p style={{ color: '#b3b3b3', fontSize: '12px' }}>
          {formatMinutes(payload[0].value)} mins watched
        </p>
      </div>
    );
  }
  return null;
}

export default function WatchTimeChart({ data, platform }) {
  const colors = platformColors[platform] || platformColors.netflix;

  const chartData = data.map(d => ({
    name: `${monthNames[d.month - 1]} ${d.year}`,
    hours: d.watch_minutes,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${platform}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.4} />
            <stop offset="95%" stopColor={colors.stroke} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#666', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatMinutes}
          tick={{ fill: '#666', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="hours"
          stroke={colors.stroke}
          strokeWidth={2.5}
          fill={`url(#gradient-${platform})`}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}