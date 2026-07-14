import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrendBadge }           from '@/components/ui/domain-badges';
import { ProgressRankList }     from '@/features/dashboard/components/shared-layouts/ProgressRankList';
import { EntityAwareChart }     from '@/features/dashboard/components/shared-charts/EntityAwareChart';
import { CourseRankingSection } from '@/features/dashboard/components/akademik/sections/CourseRankingSection';
import { GradeDistributionSection } from '@/features/dashboard/components/akademik/sections/GradeDistributionSection';
import { GradeTrendSection } from '@/features/dashboard/components/akademik/sections/GradeTrendSection';
import { useSkorPertanyaanGroup } from '@/features/dashboard/hooks/useSkorPertanyaanGroup';
import { useGradeDistribution }   from '@/features/dashboard/hooks/useGradeDistribution';
import { toHBarData }        from '@/features/dashboard/utils/skorPertanyaan';
import { toIpHBarData }      from '@/features/dashboard/utils/gradeDistribution';
import { chartColors }          from '@/styles/chart-token';
import type { AkademikFilter }  from '@/features/dashboard/types';

interface TabLuaranProps {
  filter:  AkademikFilter;
  onDrill: (kode: string) => void;
}

// Urutan HARUS konsisten dengan index akses di bawah (KODE_GRUP[0] = Q1, dst).
const KODE_GRUP = ['q21', 'q22', 'q23', 'capaian'] as const;

export default function TabLuaran({ filter, onDrill }: TabLuaranProps) {
  const { data, isLoading } = useSkorPertanyaanGroup(filter, KODE_GRUP);
  const [q1Data, q2Data, q3Data, capaianData] = data ?? [null, null, null, null];

  // Satu fetch dipakai bersama GradeDistributionSection DAN panel kanan
  // GradeTrendSection ("Rata-Rata Nilai per Fakultas/Prodi", field avg_ip) —
  // keduanya mounted bersamaan di tab ini, jadi kalau masing-masing fetch
  // sendiri itu 2 request duplikat untuk data yang identik.
  const gradeDist = useGradeDistribution(filter);
  const ipData = toIpHBarData(gradeDist.data);

  // Ranking fakultas/prodi untuk Q1-Q3 (Ketercapaian Luaran) — pakai grup
  // 'capaian' yang backend sudah precompute (avg Q1-Q3), bukan dihitung
  // manual dari 3 response terpisah.
  const qGroupItems = (capaianData?.items ?? [])
    .filter(item => item.skor !== null)
    .map(item => ({
      label: capaianData?.granularity === 'fakultas' ? item.kode : item.label,
      value: item.skor as number,
      badge: (
        <TrendBadge
          trend={item.prev_skor !== null ? parseFloat((item.skor! - item.prev_skor).toFixed(2)) : 0}
        />
      ),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-4">

      <GradeDistributionSection filter={filter} data={gradeDist.data} isLoading={gradeDist.isLoading} />
      <GradeTrendSection        filter={filter} ipData={ipData} ipLoading={gradeDist.isLoading} onDrill={onDrill} />

      {/* Q1-Q3 Peringkat Fakultas/Prodi — collapse otomatis ke course-ranking */}
      <Card>
        <CardHeader>
          <CardTitle>
            {qGroupItems.length === 1
              ? 'Rata-Rata Q1-Q3 — Ketercapaian Luaran MK'
              : `Peringkat ${filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas'} — Rata-Rata Q1–Q3 (Ketercapaian Luaran MK)`}
          </CardTitle>
          <CardDescription>
            {qGroupItems.length === 1
              ? 'Top/bottom mata kuliah berdasarkan skor ini'
              : 'Q1: Informasi luaran · Q2: Perkuliahan diarahkan ke luaran · Q3: Mahasiswa mencapai luaran'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {qGroupItems.length === 1 ? (
            <CourseRankingSection filter={filter} metric="capaian" title="Rata-Rata Q1-Q3 — Ketercapaian Luaran MK" />
          ) : isLoading ? (
            <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">Memuat data…</div>
          ) : qGroupItems.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-[12px] text-neutral">Tidak ada data untuk filter ini.</div>
          ) : (
            <ProgressRankList
              items={qGroupItems}
              color={chartColors.mid}
              domain={[3.0, 4.0]}
              showRank={qGroupItems.length > 1}
            />
          )}
        </CardContent>
      </Card>

      {/* Q1, Q2, Q3 individual */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q1 — Informasi Luaran MK</p>
            <EntityAwareChart
              items={toHBarData(q1Data)}
              color={chartColors.primary}
              domain={[3.0, 4.0]}
              height={300}
              filter={filter}
              courseRankingMetric="q21"
              courseRankingTitle="Q1 — Informasi Luaran MK"
              onDrill={onDrill}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q2 — Perkuliahan ke Luaran</p>
            <EntityAwareChart
              items={toHBarData(q2Data)}
              color={chartColors.mid}
              domain={[3.0, 4.0]}
              height={300}
              filter={filter}
              courseRankingMetric="q22"
              courseRankingTitle="Q2 — Perkuliahan ke Luaran"
              onDrill={onDrill}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q3 — Mahasiswa Mencapai Luaran</p>
            <EntityAwareChart
              items={toHBarData(q3Data)}
              color={chartColors.light}
              domain={[3.0, 4.0]}
              height={300}
              filter={filter}
              courseRankingMetric="q23"
              courseRankingTitle="Q3 — Mahasiswa Mencapai Luaran"
              onDrill={onDrill}
            />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}