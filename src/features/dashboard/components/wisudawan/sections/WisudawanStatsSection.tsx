import { StatCard } from '@/components/ui/stat-card';
import {
  TOTAL_RESPONDEN,
  KEPUASAN_KESELURUHAN_AVG,
  FASILITAS_AVG_OVERALL,
  PRODI_AVG_OVERALL,
  SOFTSKILL_ITB_AVG,
  KARAKTER_ITB_AVG,
} from '@/features/dashboard/mocks/mockDataWisudawan';

export function WisudawanStatsSection() {
  const devDiriAvg = parseFloat((
    [...SOFTSKILL_ITB_AVG, ...KARAKTER_ITB_AVG]
      .reduce((s, d) => s + d.avg, 0) /
    (SOFTSKILL_ITB_AVG.length + KARAKTER_ITB_AVG.length)
  ).toFixed(2));

  return (
    <div className="grid grid-cols-5 gap-3">
      <StatCard
        label="Total Responden"
        value={TOTAL_RESPONDEN.toLocaleString('id')}
        sub="Periode 2024-Oktober"
      />
      <StatCard
        label="Kepuasan Keseluruhan"
        value={KEPUASAN_KESELURUHAN_AVG.toFixed(2)}
        sub="Rata-rata skor (skala 4)"
        valueClassName="text-primary"
      />
      <StatCard
        label="Skor Fasilitas"
        value={FASILITAS_AVG_OVERALL.toFixed(2)}
        sub="Rata-rata 11 item fasilitas"
        valueClassName="text-mid"
      />
      <StatCard
        label="Skor Layanan Prodi"
        value={PRODI_AVG_OVERALL.toFixed(2)}
        sub="Rata-rata 12 item prodi"
        valueClassName="text-light"
      />
      <StatCard
        label="Pengembangan Diri"
        value={devDiriAvg.toFixed(2)}
        sub="Rata-rata softskill + karakter"
        valueClassName="text-purple"
      />
    </div>
  );
}