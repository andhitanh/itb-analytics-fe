import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrendBadge } from '@/components/ui/domain-badges';
import { useCourseRanking } from '@/features/dashboard/hooks/useCourseRanking';
import type { CourseRankingItem } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import { chartColors } from '@/styles/chart-token';

// ─── CourseCard — local, hanya dipakai di section ini ─────────────────────────

function CourseCard({ course, rank, mode }: {
  course: CourseRankingItem;
  rank:   number;
  mode:   'top' | 'bottom';
}) {
  const color      = mode === 'top' ? chartColors.success : chartColors.danger;
  const bgClass    = mode === 'top' ? 'bg-score-high-bg' : 'bg-score-low-bg';
  const textClass  = mode === 'top' ? 'text-score-high-text' : 'text-score-low-text';

  // acPerc (% lulus A-C) tidak tersedia di endpoint ini — dihapus dari
  // tampilan, bukan diisi angka mengarang. students diganti jumlah_kelas
  // (endpoint ini tidak punya jumlah mahasiswa per MK).
  const delta = course.avg_skor !== null && course.prev_skor !== null
    ? parseFloat((course.avg_skor - course.prev_skor).toFixed(2))
    : 0;

  return (
    <div className="flex items-start gap-2.5 py-2.5 border-b border-border last:border-0">
      <div className={`w-6 h-6 rounded-full ${bgClass} flex items-center justify-center shrink-0 mt-0.5`}>
        <span className={`text-[11px] font-bold ${textClass}`}>{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-[12.5px] font-semibold text-text-dark">{course.nama_matkul_id}</span>
          <span className="text-[10.5px] text-neutral bg-border px-1.5 py-px rounded shrink-0">
            {course.kode_fakultas}
          </span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[13px] font-bold" style={{ color }}>
            {course.avg_skor !== null ? course.avg_skor.toFixed(2) : '—'}
          </span>
          <TrendBadge trend={delta} />
          <span className="text-[11px] text-neutral">{course.jumlah_kelas.toLocaleString('id')} kelas</span>
          <span className="text-[11px] text-text-mid">{course.sks} SKS</span>
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

export function CourseRankingSection({ filter }: CourseRankingSectionProps) {
  const { data, isLoading } = useCourseRanking(filter);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bottom {data?.limit ?? 5} Mata Kuliah</CardTitle>
          <CardDescription>Berdasarkan rata-rata skor kuesioner — sesuai filter aktif</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">Memuat data…</div>
          ) : !data || data.bottom.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">Tidak ada data untuk filter ini.</div>
          ) : (
            data.bottom.map((c, i) => (
              <CourseCard key={c.kode_matkul} course={c} rank={i + 1} mode="bottom" />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top {data?.limit ?? 5} Mata Kuliah</CardTitle>
          <CardDescription>Berdasarkan rata-rata skor kuesioner — sesuai filter aktif</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">Memuat data…</div>
          ) : !data || data.top.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">Tidak ada data untuk filter ini.</div>
          ) : (
            data.top.map((c, i) => (
              <CourseCard key={c.kode_matkul} course={c} rank={i + 1} mode="top" />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}