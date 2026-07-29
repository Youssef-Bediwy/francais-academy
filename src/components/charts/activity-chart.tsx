'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ActivityPoint } from '@/types/progress';

export function ActivityChart({ data, label }: { data: ActivityPoint[]; label: string }) {
  return (
    <div className="h-64 w-full" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(value: string) => value.slice(5)}
            stroke="#9C9488"
          />
          <YAxis tick={{ fontSize: 11 }} stroke="#9C9488" allowDecimals={false} />
          <ChartTooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #DDD9D2', fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="xp"
            stroke="#EA580C"
            strokeWidth={2}
            fill="url(#xpGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
