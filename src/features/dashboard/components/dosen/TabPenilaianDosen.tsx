// src/features/dashboard/components/dosen/TabPenilaianDosen.tsx
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartState } from '@/features/dashboard/components/shared-charts/ChartState';
import { HBarChart } from '@/features/dashboard/components/shared-charts/HBarChart';
import { useDosenSkorKategori } from '@/features/dashboard/hooks/dosen/useDosenSkorKategori';
import { useDosenSkorPertanyaan } from '@/features/dashboard/hooks/dosen/useDosenSkorPertanyaan';
import { toKategoriChartData, toPertanyaanChartData } from '@/features/dashboard/utils/dosenSkorKategori';
import { chartColors } from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { DosenKategoriSkor } from '@/features/dashboard/api/dosen';

interface TabPenilaianDosenProps {
  filter: AkademikFilter;
}

export function TabPenilaianDosen({ filter }: TabPenilaianDosenProps) {
  const { data: kategoriData, isLoading: kategoriLoading } = useDosenSkorKategori(filter);
  const { data: detailData, isLoading: detailLoading, kategoriAktif, setKategoriAktif } =
    useDosenSkorPertanyaan(filter);

  const kategoriItems = kategoriData?.items ?? [];
  const kategoriChartData = useMemo(() => toKategoriChartData(kategoriItems), [kategoriItems]);

  // Peta label singkat yang tampil di sumbu ("Q1-Q3", dst — nilai `kode`
  // di kategoriChartData) → kode_kategori asli ("capaian", dst) yang
  // dibutuhkan setKategoriAktif. Dibangun sekali per render data baru,
  // bukan reverse-search di dalam handler klik setiap kali diklik.
  const sumbuKeKodeAsli = useMemo(
    () => Object.fromEntries(kategoriChartData.map(item => [item.kode, item.kodeKategoriAsli])),
    [kategoriChartData],
  );

  const kategoriAktifLabel = kategoriItems.find(
    item => item.kode_kategori === kategoriAktif,
  )?.label;

  return (
    <div className="flex flex-col gap-4">

      <Card>
        <CardHeader>
          <CardTitle>Rata-Rata Hasil Kuesioner Mahasiswa per Kategori Pertanyaan</CardTitle>
          <CardDescription>Klik salah satu kategori untuk melihat rincian nilai per pertanyaan kuesioner</CardDescription>
        </CardHeader>
        <CardContent>
          {kategoriLoading ? (
            <ChartState label="Memuat data…" height={220} />
          ) : kategoriChartData.length === 0 ? (
            <ChartState label="Belum ada data kuesioner untuk periode ini." height={220} />
          ) : (
            <HBarChart
              data={kategoriChartData}
              color={chartColors.primary}
              domain={[1, 4]}
              axisWidth={64}
              height={220}
              onBarClick={kodeSumbu => {
                const kodeAsli = sumbuKeKodeAsli[kodeSumbu] as DosenKategoriSkor | undefined;
                if (kodeAsli) setKategoriAktif(kodeAsli);
              }}
            />
          )}
        </CardContent>
      </Card>

      {kategoriAktif && (
        <Card>
          <CardHeader>
            <CardTitle>Rincian Per Pertanyaan — {kategoriAktifLabel}</CardTitle>
            <CardDescription>Skor rata-rata tiap pertanyaan dalam kategori ini</CardDescription>
          </CardHeader>
          <CardContent>
            {detailLoading ? (
              <ChartState label="Memuat data…" height={180} />
            ) : !detailData || detailData.items.length === 0 ? (
              <ChartState label="Belum ada data untuk kategori ini." height={180} />
            ) : (
              <HBarChart
                data={toPertanyaanChartData(detailData.items)}
                color={chartColors.mid}
                domain={[1, 4]}
                axisWidth={48}
                height={180}
              />
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}