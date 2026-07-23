// src/features/dashboard/components/dosen/TabInfoUmumDosen.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DosenTrendSparkline } from './DosenTrendSparkline';
import { DosenKelasTable } from './DosenKelasTable';
import { useDosenTrend } from '@/features/dashboard/hooks/dosen/useDosenTrend';
import { chartColors } from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';

interface TabInfoUmumDosenProps {
  filter: AkademikFilter;
}

export function TabInfoUmumDosen({ filter }: TabInfoUmumDosenProps) {
  const { data, isLoading } = useDosenTrend(filter);
  const trend = data?.trend ?? [];

  const ipData       = trend.map(p => ({ x: p.period_label, y: p.avg_ip_mahasiswa }));
  const overallData  = trend.map(p => ({ x: p.period_label, y: p.avg_skor_overall }));
  const q4q7Data     = trend.map(p => ({ x: p.period_label, y: p.avg_skor_q4_q7 }));

  return (
    <div className="flex flex-col gap-4">

      {/* Baris 1: 3 tren temporal */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Semester</CardTitle>
          <CardDescription>
            Perkembangan IP mahasiswa, skor kuesioner, dan performa mengajar Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <DosenTrendSparkline
              label="Rata-Rata IP Mahasiswa"
              unit="/ 4.00"
              data={ipData}
              color={chartColors.mid}
              isLoading={isLoading}
            />
            <DosenTrendSparkline
              label="Rata-Rata Kuesioner (Q1-Q12)"
              unit="/ 4.00"
              data={overallData}
              color={chartColors.mid}
              isLoading={isLoading}
            />
            <DosenTrendSparkline
              label="Performa Dosen (Q4-Q7)"
              unit="/ 4.00"
              data={q4q7Data}
              color={chartColors.mid}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Baris 2: tabel utama */}
      <Card>
        <CardHeader>
          <CardTitle>Semua Kelas yang Diajar</CardTitle>
          <CardDescription>Klik header kolom untuk mengurutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <DosenKelasTable filter={filter} />
        </CardContent>
      </Card>

      {/* Baris 3: top isu — menunggu endpoint isu_dominan (pipeline RAG) */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Isu yang Sering Muncul</CardTitle>
          <CardDescription>Ringkasan otomatis dari komentar dan refleksi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center text-[12px] text-neutral text-center px-6">
            Ringkasan isu belum tersedia. Sementara ini, lihat komentar lengkap di tab Ringkasan Komentar.
          </div>
        </CardContent>
      </Card> */}

    </div>
  );
}