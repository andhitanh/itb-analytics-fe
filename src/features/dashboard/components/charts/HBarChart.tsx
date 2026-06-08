import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { AXIS_STYLE } from '@/styles/chart-token';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HBarChartDataItem {
  label: string;
  avg:   number;
}

interface HBarChartProps {
  /** Data entity-agnostic: bisa fakultas, prodi, mata kuliah, dll */
  data:           HBarChartDataItem[];
  /** Warna bar — ambil dari chartColors */
  color:          string;
  /** Domain axis X, default [3.0, 4.0] */
  domain?:        [number, number];
  /** Tinggi chart dalam px, default 260 */
  height?:        number;
  /** Urutan: desc = tertinggi di atas (default), asc = terendah di atas */

  axisWidth?: number; // default 42, item charts butuh lebih lebar

  sortOrder?:     'asc' | 'desc';
  /** Garis referensi vertikal opsional, misal batas nilai minimum */
  referenceLine?: {
    value:  number;
    label:  string;
    color?: string;
  };
  /** Format label nilai di kanan bar, default toFixed(2) */
  labelFormatter?: (value: number) => string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HBarChart({
  data,
  color,
  domain        = [3.0, 4.0],
  height        = 260,
  axisWidth     = 42,
  sortOrder     = 'desc',
  referenceLine,
  labelFormatter = v => v.toFixed(2),
}: HBarChartProps) {
  const sorted = [...data].sort((a, b) =>
    sortOrder === 'desc' ? b.avg - a.avg : a.avg - b.avg,
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 0, right: 44, bottom: 0, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />

        <XAxis
          type="number"
          domain={domain}
          tick={AXIS_STYLE}
          tickFormatter={v => v.toFixed(1)}
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={AXIS_STYLE}
          width={axisWidth}
        />

        <Tooltip formatter={(v: any) => typeof v === 'number' ? labelFormatter(v) : String(v ?? '')} />

        {referenceLine && (
          <ReferenceLine
            x={referenceLine.value}
            stroke={referenceLine.color ?? '#E74C3C'}
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{
              value:    referenceLine.label,
              position: 'insideTopRight',
              fontSize: 10,
              fill:     referenceLine.color ?? '#E74C3C',
            }}
          />
        )}

        <Bar
          dataKey="avg"
          name="Nilai"
          fill={color}
          radius={[0, 4, 4, 0]}
          maxBarSize={18}
          label={{
            position:  'right',
            formatter: (v: unknown) =>
              typeof v === 'number' ? labelFormatter(v) : '',
            fontSize: 10,
            fill:     '#4B5B7A',
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}