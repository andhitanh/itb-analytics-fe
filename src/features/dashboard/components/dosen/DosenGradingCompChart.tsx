// src/features/dashboard/components/dosen/DosenGradingCompChart.tsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ChartState } from '@/features/dashboard/components/shared-charts/ChartState';
import { buildDosenGradingCompRows, GRADING_BUCKET_COLORS } from '@/features/dashboard/utils/dosenGradingComp';
import { AXIS_STYLE } from '@/styles/chart-token';
import type { DosenGradingCompItem } from '@/features/dashboard/api/dosen';

interface DosenGradingCompChartProps {
  items:     DosenGradingCompItem[];
  isLoading: boolean;
}

/**
 * Chart height mengikuti jumlah kelas — 1 kelas butuh ruang bar yang sama
 * dengan 5 kelas per baris, jadi tinggi tetap harus proporsional supaya
 * bar tidak terlalu gemuk (1 kelas) atau terlalu kurus (banyak kelas).
 */
function computeHeight(rowCount: number): number {
  const MIN_HEIGHT = 140;
  const HEIGHT_PER_ROW = 48;
  return Math.max(MIN_HEIGHT, rowCount * HEIGHT_PER_ROW);
}

export function DosenGradingCompChart({ items, isLoading }: DosenGradingCompChartProps) {
  if (isLoading) return <ChartState label="Memuat data…" height={220} />;
  if (items.length === 0) {
    return <ChartState label="Belum ada data komponen penilaian untuk periode ini." height={220} />;
  }

  const rows = buildDosenGradingCompRows(items);
  const height = computeHeight(rows.length);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="kelas" tick={AXIS_STYLE} width={140} interval={0} />
        <Tooltip formatter={(v: any) => (typeof v === 'number' ? `${v}%` : v)} />
        <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        {GRADING_BUCKET_COLORS.map(({ label, color }) => (
          <Bar key={label} dataKey={label} name={label} stackId="a" fill={color} maxBarSize={22} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}