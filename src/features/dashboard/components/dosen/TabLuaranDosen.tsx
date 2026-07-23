// src/features/dashboard/components/dosen/TabLuaranDosen.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DosenKelulusanChart } from './DosenKelulusanChart';
import { DosenLuaranTable } from './DosenLuaranTable';
import { DosenGradingCompChart } from './DosenGradingCompChart';
import { useDosenKelulusan } from '@/features/dashboard/hooks/dosen/useDosenKelulusan';
import { useDosenGradingComp } from '@/features/dashboard/hooks/dosen/useDosenGradingComp';
import type { AkademikFilter } from '@/features/dashboard/types';

interface TabLuaranDosenProps {
  filter: AkademikFilter;
}

export function TabLuaranDosen({ filter }: TabLuaranDosenProps) {
  const { data: kelulusanData, isLoading: kelulusanLoading } = useDosenKelulusan(filter);
  const { data: gradingCompData, isLoading: gradingCompLoading } = useDosenGradingComp(filter);

  return (
    <div className="flex flex-col gap-4">

      <Card>
        <CardHeader>
          <CardTitle>Persentase Kelulusan</CardTitle>
          <CardDescription>Perbandingan nilai A-C vs D-E dengan periode sebelumnya</CardDescription>
        </CardHeader>
        <CardContent>
          <DosenKelulusanChart data={kelulusanData} isLoading={kelulusanLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Luaran per Mata Kuliah</CardTitle>
          <CardDescription>Rata-rata IP dan persentase lulus tiap kelas yang diajar</CardDescription>
        </CardHeader>
        <CardContent>
          <DosenLuaranTable filter={filter} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Komposisi Bobot Penilaian</CardTitle>
          <CardDescription>Skema penilaian (UTS, UAS, tugas, dst.) yang digunakan tiap kelas</CardDescription>
        </CardHeader>
        <CardContent>
          <DosenGradingCompChart items={gradingCompData?.items ?? []} isLoading={gradingCompLoading} />
        </CardContent>
      </Card>

    </div>
  );
}