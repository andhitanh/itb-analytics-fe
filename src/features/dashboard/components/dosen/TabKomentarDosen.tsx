// src/features/dashboard/components/dosen/TabKomentarDosen.tsx
import { RawCommentList } from '@/features/dashboard/components/shared-layouts/RawCommentList';
import { DosenRefleksiCard } from './DosenRefleksiCard';
import { chartColors } from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';

interface TabKomentarDosenProps {
  filter: AkademikFilter;
}

export function TabKomentarDosen({ filter }: TabKomentarDosenProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Komentar mahasiswa: TETAP reuse RawCommentList + endpoint generik --
          v_akademik_komentar_mahasiswa RLS-nya sudah benar untuk dosen
          (filter semua_dosen_id), tidak butuh endpoint khusus. */}
      <RawCommentList
        filter={filter}
        sumber="mahasiswa"
        title="Komentar Mahasiswa"
        subtitle="Komentar bebas dari kuesioner evaluasi mahasiswa di kelas yang Anda ajar"
        color={chartColors.mid}
      />

      {/* Refleksi & usulan: endpoint KHUSUS dashboard dosen (bukan lagi
          RawCommentList generik) -- lihat DosenRefleksiCard. */}
      <DosenRefleksiCard filter={filter} />
    </div>
  );
}