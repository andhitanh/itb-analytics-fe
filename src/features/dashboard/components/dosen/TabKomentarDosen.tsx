// src/features/dashboard/components/dosen/TabKomentarDosen.tsx
import { RawCommentList } from '@/features/dashboard/components/shared-layouts/RawCommentList';
import { chartColors } from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';

interface TabKomentarDosenProps {
  filter: AkademikFilter;
}

/**
 * Reuse penuh RawCommentList — komponen ini fetch lewat
 * fetchAkademikKomentarMentah (api/akademik.ts) yang sudah ada, TIDAK ada
 * endpoint atau hook baru di sini. Scope ke kelas milik dosen sudah otomatis
 * benar dari RLS backend (v_akademik_komentar_mahasiswa filter semua_dosen_id,
 * v_akademik_portofolio dibatasi lewat service dosen — lihat Tahap 3 backend),
 * jadi tidak ada parameter tambahan yang perlu dikirim dari sisi frontend.
 *
 * sumber 'itb' (rekomendasi dosen ke ITB) sengaja TIDAK ditampilkan di sini —
 * itu konteksnya usulan dari dosen ke level institusi, bukan sesuatu yang
 * relevan untuk dosen tinjau ulang tentang dirinya sendiri di dashboard
 * personal. Beda kebutuhan dari dashboard kaprodi/direktorat yang memang
 * perlu melihat semua 3 sumber untuk evaluasi antarunit.
 */
export function TabKomentarDosen({ filter }: TabKomentarDosenProps) {
  return (
    <div className="flex flex-col gap-4">
      <RawCommentList
        filter={filter}
        sumber="mahasiswa"
        title="Komentar Mahasiswa"
        subtitle="Komentar bebas dari kuesioner evaluasi mahasiswa di kelas yang Anda ajar"
        color={chartColors.mid}
      />
      <RawCommentList
        filter={filter}
        sumber="dosen"
        title="Refleksi & Usulan Perbaikan"
        subtitle="Usulan perbaikan dari portofolio Anda untuk periode akademik berikutnya"
        color={chartColors.warning}
      />
    </div>
  );
}