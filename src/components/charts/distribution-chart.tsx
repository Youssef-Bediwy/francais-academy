'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function DistributionChart({
  data,
  label,
}: {
  data: { name: string; value: number }[];
  label: string;
}) {
  return (
    <div className="h-64 w-full" role="img" aria-label={label}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#9C9488" />
          <YAxis tick={{ fontSize: 11 }} stroke="#9C9488" allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DDD9D2', fontSize: 12 }} />
          <Bar dataKey="value" fill="#14B88A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
