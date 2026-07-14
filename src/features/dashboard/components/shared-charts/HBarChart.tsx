import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { AXIS_STYLE } from '@/styles/chart-token';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HBarChartDataItem {
  label: string;
  kode:  string;
  avg:   number;
  delta?: number | null;
}

interface HBarChartProps {
  data:           HBarChartDataItem[];
  color:          string;
  domain?:        [number, number];
  height?:        number;
  axisWidth?:     number;
  sortOrder?:     'asc' | 'desc';
  referenceLine?: {
    value:  number;
    label:  string;
    color?: string;
  };
  labelFormatter?: (value: number) => string;
  /**
   * Kalau diisi, tiap bar bisa diklik untuk drill-down (mis. fakultas →
   * prodi). Menerima `kode` bar yang diklik. Opsional — chart tanpa prop
   * ini tetap berfungsi normal, tidak clickable.
   */
  onBarClick?: (kode: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HBarChart({
  data,
  color,
  domain         = [3.0, 4.0],
  height         = 320,
  axisWidth      = 42,
  sortOrder      = 'desc',
  referenceLine,
  labelFormatter = v => v.toFixed(2),
  onBarClick,
}: HBarChartProps) {
  const sorted = [...data].sort((a, b) =>
    sortOrder === 'desc' ? b.avg - a.avg : a.avg - b.avg,
  );

  const chartKey = `${sorted.length}-${sorted[0]?.label ?? 'empty'}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        key={chartKey}
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
          dataKey="kode"
          tick={AXIS_STYLE}
          width={axisWidth}
          interval={0}
        />

        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const item = payload[0].payload as HBarChartDataItem;
            return (
              <div className="rounded-md border bg-white px-2.5 py-1.5 shadow-sm text-[11.5px]">
                <p className="font-semibold text-neutral-800">{item.label}</p>
                <p className="text-neutral-500">
                  {labelFormatter(item.avg)}
                </p>
              </div>
            );
          }}
        />

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
          isAnimationActive={false}
          onClick={onBarClick ? (d: any) => onBarClick((d.payload as HBarChartDataItem).kode) : undefined}
          style={onBarClick ? { cursor: 'pointer' } : undefined}
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