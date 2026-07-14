import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { HBarChart } from '@/features/dashboard/components/shared-charts/HBarChart';
import { ChartState } from '@/features/dashboard/components/shared-charts/ChartState';
import { explodeToProfile, GRADING_BUCKET_COLORS } from '@/features/dashboard/utils/gradingComp';
import { AXIS_STYLE, chartColors } from '@/styles/chart-token';
import type { GradingCompItem } from '@/features/dashboard/api/akademik';

interface GradingCompChartProps {
  items:     GradingCompItem[];
  isLoading: boolean;
}

export function GradingCompChart({ items, isLoading }: GradingCompChartProps) {
  if (isLoading) return <ChartState label="Memuat data…" height={350} />;
  if (items.length === 0) return <ChartState label="Tidak ada data untuk filter ini." height={350} />;

  if (items.length === 1) {
    return (
      <HBarChart
        data={explodeToProfile(items[0])}
        color={chartColors.primary}
        domain={[0, 100]}
        height={350}
        labelFormatter={v => `${v}%`}
        sortOrder="desc"
      />
    );
  }

  const stackedData = items.map(item => ({
    faculty:      item.kode,
    UTS:          item.avg_bobot_uts          ?? undefined,
    UAS:          item.avg_bobot_uas          ?? undefined,
    Tugas:        item.avg_bobot_tugas        ?? undefined,
    Kuis:         item.avg_bobot_kuis         ?? undefined,
    Praktikum:    item.avg_bobot_praktikum    ?? undefined,
    Projek:       item.avg_bobot_projek       ?? undefined,
    Partisipatif: item.avg_bobot_partisipatif ?? undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={stackedData} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
        <XAxis type="number" tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="faculty" tick={AXIS_STYLE} width={42} />
        <Tooltip formatter={(v: any) => typeof v === 'number' ? `${v}%` : v} />
        <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        {GRADING_BUCKET_COLORS.map(({ label, color }) => (
          <Bar key={label} dataKey={label} name={label} stackId="a" fill={color} maxBarSize={16} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}