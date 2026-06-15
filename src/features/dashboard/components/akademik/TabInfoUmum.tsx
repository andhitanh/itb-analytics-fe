import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RechartsTooltip }  from '@/components/ui/recharts-tooltip';
import { ProgressRankList } from '@/features/dashboard/components/shared-layouts/ProgressRankList';
import { HBarChart }        from '@/features/dashboard/components/shared-charts/HBarChart';
import { ScoreHeatmap }     from '@/features/dashboard/components/akademik/sections/ScoreHeatmap';
import { deriveOverallAvgGroup } from '@/features/dashboard/utils/grouping';
import {
  AVG_PER_QUESTION, QUESTIONS_SHORT, QUESTIONS_FULL,
  TEMPORAL_AVG, ISSUES_MAHASISWA, ISSUES_DOSEN,
} from '@/features/dashboard/mocks/mockData';
import { chartColors, AXIS_STYLE } from '@/styles/chart-token';
import { useUser }           from '@/context/UserContext';
import type { AkademikFilter } from '@/features/dashboard/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TabInfoUmumProps {
  filter: AkademikFilter;
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

export default function TabInfoUmum({ filter }: TabInfoUmumProps) {
  const { user } = useUser();

  // Q ranking items untuk ProgressRankList
  const allQItems = AVG_PER_QUESTION.map((v, i) => ({
    label: `${QUESTIONS_SHORT[i]}: ${QUESTIONS_FULL[i].slice(0, 58)}…`,
    value: v,
  }));
  const topQItems    = [...allQItems].sort((a, b) => b.value - a.value).slice(0, 5);
  const bottomQItems = [...allQItems].sort((a, b) => a.value - b.value).slice(0, 5);

  // Faculty avg bar (filter-aware)
  const overallGroupData = deriveOverallAvgGroup(filter, user.activeRole.role);
  const groupLabel       = filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas';

  return (
    <div className="flex flex-col gap-4">

      {/* Baris 1: Q ranking + Heatmap */}
      <div className="grid grid-cols-[320px_1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Peringkat Pertanyaan Kuesioner</CardTitle>
            <CardDescription>Rata-rata skor 12 pertanyaan se-ITB — 2023/24-2</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3.5">
            <div>
              <p className="text-[11px] font-bold text-score-high-text uppercase tracking-wide mb-2">
                ▲ Skor Tertinggi
              </p>
              <ProgressRankList items={topQItems} color={chartColors.success} domain={[2.5, 4.0]} mode="top" />
            </div>
            <div className="h-px bg-border" />
            <div>
              <p className="text-[11px] font-bold text-score-low-text uppercase tracking-wide mb-2">
                ▼ Skor Terendah
              </p>
              <ProgressRankList items={bottomQItems} color={chartColors.danger} domain={[2.5, 4.0]} mode="bottom" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heatmap Rata-Rata Skor per Fakultas × Pertanyaan</CardTitle>
            <CardDescription>Semester 2023/24-2 · outline merah = bottom 3 per baris</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreHeatmap />
          </CardContent>
        </Card>
      </div>

      {/* Baris 2: Temporal trend + Faculty bar */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tren Rata-Rata Skor Kuesioner ITB</CardTitle>
            <CardDescription>Rata-rata keseluruhan 12 pertanyaan lintas semua fakultas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TEMPORAL_AVG} margin={{ top: 4, right: 12, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" />
                <XAxis dataKey="semester" tick={AXIS_STYLE} />
                <YAxis domain={[3.2, 3.9]} tick={AXIS_STYLE} tickFormatter={v => v.toFixed(1)} />
                <Tooltip content={<RechartsTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="avg"  name="Rata-rata umum" stroke={chartColors.primary} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line dataKey="q1q3" name="Q1-Q3 (Luaran)" stroke={chartColors.mid}     strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
                <Line dataKey="q4q7" name="Q4-Q7 (Dosen)"  stroke={chartColors.light}   strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rata-Rata Skor per {groupLabel}</CardTitle>
            <CardDescription>Diurutkan tertinggi — semester 2023/24-2</CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart data={overallGroupData} color={chartColors.primary} domain={[3.0, 4.0]} />
          </CardContent>
        </Card>
      </div>

      {/* Baris 3: Isu dominan (ringkasan, non-interactive) */}
      <Card>
        <CardHeader>
          <CardTitle>Isu Dominan dari Komentar Kuesioner</CardTitle>
          <CardDescription>
            Top 5 tema terbanyak dari analisis teks komentar mahasiswa dan refleksi dosen — 2023/24-2
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