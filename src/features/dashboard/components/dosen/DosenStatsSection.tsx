// src/features/dashboard/components/dosen/DosenStatsSection.tsx
import { StatCard } from '@/components/ui/stat-card';
import { useDosenStatsOverview } from '@/features/dashboard/hooks/dosen/useDosenStatsOverview';
import type { AkademikFilter } from '@/features/dashboard/types';

interface DosenStatsSectionProps {
  filter: AkademikFilter;
}

export function DosenStatsSection({ filter }: DosenStatsSectionProps) {
  const { data, isLoading } = useDosenStatsOverview(filter);

  const format = (value?: number) =>
    isLoading || value == null ? '—' : value.toLocaleString('id-ID');

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Mata Kuliah Diajar"
        value={format(data?.jumlah_matkul)}
        sub="Periode terpilih"
      />
      <StatCard
        label="Kelas Diajar"
        value={format(data?.jumlah_kelas)}
        sub="Termasuk kelas paralel"
      />
      <StatCard
        label="Total SKS Diajar"
        value={format(data?.total_sks_diajar)}
        sub="Beban mengajar"
      />
      <StatCard
        label="Mahasiswa Diajar"
        value={format(data?.jumlah_mahasiswa)}
        sub="Seluruh kelas"
      />
    </div>
  );
}