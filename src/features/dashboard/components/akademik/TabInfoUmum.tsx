import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RechartsTooltip }  from '@/components/ui/recharts-tooltip';
import { ProgressRankList } from '@/features/dashboard/components/shared-layouts/ProgressRankList';
import { EntityAwareChart } from '@/features/dashboard/components/shared-charts/EntityAwareChart';
import { ScoreHeatmap }     from '@/features/dashboard/components/akademik/sections/ScoreHeatmap';
import { useSkorPertanyaan } from '@/features/dashboard/hooks/useSkorPertanyaan';
import { useGradeTrend }     from '@/features/dashboard/hooks/useGradeTrend';
import { useSkorHeatmap }    from '@/features/dashboard/hooks/useSkorHeatmap';
import { toHBarData } from '@/features/dashboard/utils/skorPertanyaan';
import { computeAvgPerQuestion } from '@/features/dashboard/utils/skorHeatmap';
import {
  QUESTIONS_SHORT, QUESTIONS_FULL,
  ISSUES_MAHASISWA, ISSUES_DOSEN,
} from '@/features/dashboard/mocks/mockData';
import { METRIC_OVERALL } from '@/features/dashboard/constants/courseRankingMetrics';
import { chartColors, AXIS_STYLE } from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TabInfoUmumProps {
  filter:  AkademikFilter;
  onDrill: (kode: string) => void;
}

// ─── Local: non-interactive issue preview ─────────────────────────────────────

function StaticIssueList({
  title, issues, color,
}: {
  title:  string;
  issues: typeof ISSUES_MAHASISWA;
  color:  string;
}) {
  const max = issues[0].count;
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[12px] font-bold text-text-dark mb-2.5">{title}</p>
      <div className="flex flex-col gap-1.5">
        {issues.slice(0, 5).map((iss, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[11px] text-neutral font-bold w-4 shrink-0">{i + 1}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11.5px] text-text-dark font-medium">{iss.label}</span>
                <span className="text-[11.5px] font-bold shrink-0 ml-2" style={{ color }}>
                  {iss.count.toLocaleString('id')}
                </span>
              </div>
              <div className="h-1 bg-border rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(iss.count / max) * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TabInfoUmum({ filter, onDrill }: TabInfoUmumProps) {
  // Satu fetch dipakai bersama ScoreHeatmap DAN ranking Q1-Q12 di card
  // sebelahnya (keduanya mounted bersamaan di baris 1) — hindari 2 request
  // duplikat untuk data identik, sama seperti pola grade-distribution.
  const { data: heatmapData, isLoading: heatmapLoading } = useSkorHeatmap(filter);
  const avgPerQ = computeAvgPerQuestion(heatmapData);

  // Q ranking items untuk ProgressRankList — skip Q yang belum ada data
  // sama sekali (avg null), bukan ditampilkan sebagai 0 (akan salah masuk
  // "skor terendah").
  const allQItems = avgPerQ
    .map((v, i) => ({
      label: `${QUESTIONS_SHORT[i]}: ${QUESTIONS_FULL[i].slice(0, 58)}…`,
      value: v,
    }))
    .filter((item): item is { label: string; value: number } => item.value !== null);
  const topQItems    = [...allQItems].sort((a, b) => b.value - a.value).slice(0, 5);
  const bottomQItems = [...allQItems].sort((a, b) => a.value - b.value).slice(0, 5);

  // Rata-rata skor per fakultas/prodi (filter-aware) — otomatis collapse ke
  // CourseRankingSection lewat EntityAwareChart kalau items.length===1.
  const { data: overallData, isLoading: overallLoading } = useSkorPertanyaan(filter, 'overall');
  const overallGroupData = toHBarData(overallData);
  const groupLabel       = filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas';

  // Temporal 3-garis (avg keseluruhan, Q1-Q3 capaian, Q4-Q7 pelaksanaan)
  const { data: trendData, isLoading: trendLoading } = useGradeTrend(filter);
  const trend = trendData?.trend ?? [];
  const temporalChartData = trend.map(p => ({
    semester: p.period_label,
    avg:      p.avg_skor_overall,
    q1q3:     p.avg_skor_capaian,
    q4q7:     p.avg_skor_pelaksanaan,
  }));

  return (
    <div className="flex flex-col gap-4">

      {/* Baris 1: Q ranking + Heatmap */}
      <div className="grid grid-cols-[320px_1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Peringkat Pertanyaan Kuesioner</CardTitle>
            <CardDescription>Rata-rata skor 12 pertanyaan — sesuai filter aktif</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3.5">
            {heatmapLoading ? (
              <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">
                Memuat data…
              </div>
            ) : allQItems.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">
                Tidak ada data untuk filter ini.
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[11px] font-bold text-score-high-text uppercase tracking-wide mb-2">
                    ▲ Skor Tertinggi
                  </p>
                  <ProgressRankList items={topQItems} color={chartColors.success} domain={[2.5, 4.0]} mode="top" showRank={topQItems.length > 1} />
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-[11px] font-bold text-score-low-text uppercase tracking-wide mb-2">
                    ▼ Skor Terendah
                  </p>
                  <ProgressRankList items={bottomQItems} color={chartColors.danger} domain={[2.5, 4.0]} mode="bottom" showRank={bottomQItems.length > 1} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Heatmap Rata-Rata Skor per {filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas'} × Pertanyaan
            </CardTitle>
            <CardDescription>
              {filter.tahunAjaran !== 'semua' ? filter.tahunAjaran : 'Seluruh tahun ajaran'}
              {filter.semester !== 'semua' ? ` · ${filter.semester}` : ''}
              {' · outline merah = bottom 3 per baris'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreHeatmap data={heatmapData} isLoading={heatmapLoading} />
          </CardContent>
        </Card>
      </div>

      {/* Baris 2a: Temporal trend (full width) */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Rata-Rata Skor Kuesioner ITB</CardTitle>
          <CardDescription>Rata-rata keseluruhan 12 pertanyaan lintas semua fakultas</CardDescription>
        </CardHeader>
        <CardContent>
          {trendLoading ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-neutral">
              Memuat data tren…
            </div>
          ) : temporalChartData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-neutral">
              Tidak ada data untuk filter ini.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={temporalChartData} margin={{ top: 4, right: 12, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" />
                <XAxis dataKey="semester" tick={AXIS_STYLE} />
                <YAxis domain={[3.2, 3.9]} tick={AXIS_STYLE} tickFormatter={v => v.toFixed(1)} />
                <Tooltip content={<RechartsTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="avg"  name="Rata-rata umum" stroke={chartColors.primary} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} connectNulls />
                {/* <Line dataKey="q1q3" name="Q1-Q3 (Luaran)" stroke={chartColors.mid}     strokeWidth={1.5} dot={false} strokeDasharray="5 3" connectNulls />
                <Line dataKey="q4q7" name="Q4-Q7 (Dosen)"  stroke={chartColors.light}   strokeWidth={1.5} dot={false} strokeDasharray="5 3" connectNulls /> */}
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Baris 2b: Rata-rata skor per fakultas/prodi — collapse otomatis */}
      <Card>
        <CardHeader>
          <CardTitle>Rata-Rata Skor per {groupLabel}</CardTitle>
          <CardDescription>Diurutkan tertinggi — sesuai filter aktif</CardDescription>
        </CardHeader>
        <CardContent>
          {overallLoading ? (
            <div className="h-[300px] flex items-center justify-center text-[12px] text-neutral">
              Memuat data…
            </div>
          ) : (
            <EntityAwareChart
              items={overallGroupData}
              color={chartColors.primary}
              domain={[3.0, 4.0]}
              height={300}
              filter={filter}
              courseRankingMetric={METRIC_OVERALL.metric}
              courseRankingTitle={METRIC_OVERALL.title}
              onDrill={onDrill}
            />
          )}
        </CardContent>
      </Card>

      {/* Baris 3: Isu dominan (ringkasan, non-interactive) */}
      <Card>
        <CardHeader>
          <CardTitle>{overallGroupData.length === 1 ? METRIC_OVERALL.title : `Rata-Rata Skor per ${groupLabel}`}</CardTitle>
          <CardDescription>
            {overallGroupData.length === 1
              ? 'Top/bottom mata kuliah berdasarkan rata-rata skor kuesioner'
              : 'Diurutkan tertinggi — sesuai filter aktif'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <StaticIssueList title="Suara Mahasiswa" issues={ISSUES_MAHASISWA} color={chartColors.danger} />
            <div className="w-px bg-border shrink-0" />
            <StaticIssueList title="Refleksi Dosen"  issues={ISSUES_DOSEN}     color={chartColors.warning} />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}