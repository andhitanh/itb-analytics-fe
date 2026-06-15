import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrendBadge }           from '@/components/ui/domain-badges';
import { ProgressRankList }     from '@/features/dashboard/components/shared-layouts/ProgressRankList';
import { HBarChart }            from '@/features/dashboard/components/shared-charts/HBarChart';
import { GradeDistributionSection } from '@/features/dashboard/components/akademik/sections/GradeDistributionSection';
import { GradeTrendSection } from '@/features/dashboard/components/akademik/sections/GradeTrendSection';
import { CourseRankingSection } from '@/features/dashboard/components/akademik/sections/CourseRankingSection';
import { deriveQScoreGroup }    from '@/features/dashboard/utils/grouping';
import {
  FACULTIES, LATEST_SCORES, getFacultyQScorePrev,
} from '@/features/dashboard/mocks/mockData';
import { chartColors }          from '@/styles/chart-token';
import { useUser }              from '@/context/UserContext';
import type { AkademikFilter }  from '@/features/dashboard/types';

interface TabLuaranProps {
  filter: AkademikFilter;
}

export default function TabLuaran({ filter }: TabLuaranProps) {
  const { user } = useUser();

  // Ranking fakultas untuk Q1-Q3 (Ketercapaian Luaran)
  const qGroupItems = FACULTIES.map(f => {
    const curr = [0,1,2].reduce((s, qi) => s + LATEST_SCORES[f][qi], 0) / 3;
    const prev = [0,1,2].reduce((s, qi) => s + getFacultyQScorePrev(f, qi), 0) / 3;
    return {
      label: f,
      value: parseFloat(curr.toFixed(2)),
      badge: <TrendBadge trend={parseFloat((curr - prev).toFixed(2))} />,
    };
  }).sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-4">

      <GradeDistributionSection filter={filter} />
      <GradeTrendSection        filter={filter} />
      <CourseRankingSection     filter={filter} />

      {/* Q1-Q3 Peringkat Fakultas */}
      <Card>
        <CardHeader>
          <CardTitle>Peringkat {filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas'} — Rata-Rata Q1–Q3 (Ketercapaian Luaran MK)</CardTitle>
          <CardDescription>Q1: Informasi luaran · Q2: Perkuliahan diarahkan ke luaran · Q3: Mahasiswa mencapai luaran</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressRankList
            items={qGroupItems}
            color={chartColors.mid}
            domain={[3.0, 4.0]}
          />
        </CardContent>
      </Card>

      {/* Q1, Q2, Q3 individual */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q1 — Informasi Luaran MK</p>
            <HBarChart
              data={deriveQScoreGroup(filter, user.activeRole.role, 0)}
              color={chartColors.primary}
              domain={[3.0, 4.0]}
              height={180}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q2 — Perkuliahan ke Luaran</p>
            <HBarChart
              data={deriveQScoreGroup(filter, user.activeRole.role, 1)}
              color={chartColors.mid}
              domain={[3.0, 4.0]}
              height={180}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q3 — Mahasiswa Mencapai Luaran</p>
            <HBarChart
              data={deriveQScoreGroup(filter, user.activeRole.role, 2)}
              color={chartColors.light}
              domain={[3.0, 4.0]}
              height={180}
            />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}