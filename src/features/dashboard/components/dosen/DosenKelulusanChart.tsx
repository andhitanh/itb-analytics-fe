// src/features/dashboard/components/dosen/DosenKelulusanChart.tsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartState } from '@/features/dashboard/components/shared-charts/ChartState';
import { AXIS_STYLE, chartColors } from '@/styles/chart-token';
import type { DosenKelulusanResponse } from '@/features/dashboard/api/dosen';

interface DosenKelulusanChartProps {
  data:      DosenKelulusanResponse | null;
  isLoading: boolean;
}

/**
 * 2 kategori (lulus A-C, tidak lulus D-E) x 2 seri (periode ini, periode
 * lalu). Warna: primary untuk periode ini (fokus perhatian), neutral untuk
 * periode lalu (pembanding) — sesuai aturan warna: seri yang jadi fokus
 * pakai warna paling jenuh, pembanding pakai warna netral.
 */
export function DosenKelulusanChart({ data, isLoading }: DosenKelulusanChartProps) {
  if (isLoading) return <ChartState label="Memuat data…" height={200} />;
  if (!data || data.pct_lulus_periode_ini == null) {
    return <ChartState label="Belum ada data nilai untuk periode ini." height={200} />;
  }

  const chartData = [
    {
      kategori:     'Lulus (A-C)',
      periodeIni:   data.pct_lulus_periode_ini,
      periodeLalu:  data.pct_lulus_periode_lalu ?? undefined,
    },
    {
      kategori:     'Tidak Lulus (D-E)',
      periodeIni:   100 - data.pct_lulus_periode_ini,
      periodeLalu:  data.pct_lulus_periode_lalu != null ? 100 - data.pct_lulus_periode_lalu : undefined,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-[11.5px]">
        <LegendDot color={chartColors.primary} label="Periode ini" />
        {data.prev_period_label && (
          <LegendDot color={chartColors.neutral} label={`Periode lalu (${data.prev_period_label})`} />
        )}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" vertical={false} />
          <XAxis dataKey="kategori" tick={AXIS_STYLE} />
          <YAxis domain={[0, 100]} tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
          <Tooltip formatter={(v: any) => (typeof v === 'number' ? `${v.toFixed(0)}%` : v)} />
          <Bar dataKey="periodeIni" name="Periode ini" fill={chartColors.primary} radius={[4, 4, 0, 0]} maxBarSize={48} />
          <Bar dataKey="periodeLalu" name="Periode lalu" fill={chartColors.neutral} radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-neutral">
      <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}