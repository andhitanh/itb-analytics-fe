// src/features/dashboard/hooks/dosen/useDosenSkorPertanyaan.ts
import { useState } from 'react';
import {
  fetchDosenSkorPertanyaan,
  type DosenKategoriSkor,
} from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

/**
 * Beda dari hook lain di folder ini: fetch HANYA jalan kalau kategoriAktif
 * terisi (bukan null). Ini yang membuat panel drill-down Tab 3 default
 * collapsed — tidak ada request ke backend sampai pengguna benar-benar
 * mengklik 1 bar kategori. Menjaga beban server dan payload awal tetap
 * minim, konsisten dengan prinsip "ringkas di permukaan, detail satu klik
 * lagi" dari spesifikasi desain.
 *
 * kategoriAktif & setKategoriAktif diekspos ke pemanggil (bukan disembunyikan
 * di dalam hook) karena komponen Tab 3 butuh tahu kategori mana yang sedang
 * aktif untuk menampilkan judul panel detail dan highlight bar yang dipilih.
 */
export function useDosenSkorPertanyaan(filter: AkademikFilter) {
  const [kategoriAktif, setKategoriAktif] = useState<DosenKategoriSkor | null>(null);

  const query = useAkademikQuery(
    signal =>
      kategoriAktif
        ? fetchDosenSkorPertanyaan(filter, kategoriAktif, signal)
        : Promise.resolve(null),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(','), kategoriAktif],
  );

  return { ...query, kategoriAktif, setKategoriAktif };
}