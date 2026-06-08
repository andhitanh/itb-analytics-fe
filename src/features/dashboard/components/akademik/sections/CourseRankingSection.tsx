import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrendBadge } from '@/components/ui/domain-badges';
import { TOP_COURSES, BOTTOM_COURSES } from '@/features/dashboard/mocks/mockData';
import { chartColors } from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';

// ─── CourseCard — local, hanya dipakai di section ini ─────────────────────────

interface Course {
  name:    string;
  faculty: string;
  avg:     number;
  students:number;
  trend:   number;
  acPerc:  number;
}

function CourseCard({ course, rank, mode }: {
  course: Course;
  rank:   number;
  mode:   'top' | 'bottom';
}) {
  const color      = mode === 'top' ? chartColors.success : chartColors.danger;
  const bgClass    = mode === 'top' ? 'bg-score-high-bg' : 'bg-score-low-bg';
  const textClass  = mode === 'top' ? 'text-score-high-text' : 'text-score-low-text';

  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-0">
      <div className={`w-6 h-6 rounded-full ${bgClass} flex items-center justify-center shrink-0 mt-0.5`}>
        <span className={`text-[11px] font-bold ${textClass}`}>{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-[12.5px] font-semibold text-text-dark">{course.name}</span>
          <span className="text-[10.5px] text-neutral bg-border px-1.5 py-px rounded shrink-0">
            {course.faculty}
          </span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[13px] font-bold" style={{ color }}>{course.avg.toFixed(2)}</span>
          <TrendBadge trend={course.trend} />
          <span className="text-[11px] text-neutral">{course.students.toLocaleString('id')} mhs</span>
          <span className="text-[11px] text-text-mid">A–C: <b>{course.acPerc}%</b></span>
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CourseRankingSectionProps {
  filter: AkademikFilter;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CourseRankingSection({ filter: _filter }: CourseRankingSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bottom 5 Mata Kuliah</CardTitle>
          <CardDescription>Berdasarkan rata-rata nilai akhir mahasiswa — se-ITB</CardDescription>
        </CardHeader>
        <CardContent>
          {BOTTOM_COURSES.map((c, i) => (
            <CourseCard key={i} course={c} rank={i + 1} mode="bottom" />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Mata Kuliah</CardTitle>
          <CardDescription>Berdasarkan rata-rata nilai akhir mahasiswa — se-ITB</CardDescription>
        </CardHeader>
        <CardContent>
          {TOP_COURSES.map((c, i) => (
            <CourseCard key={i} course={c} rank={i + 1} mode="top" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}