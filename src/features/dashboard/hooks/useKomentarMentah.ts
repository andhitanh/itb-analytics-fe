// src/features/dashboard/hooks/useKomentarMentah.ts
import { fetchAkademikKomentarMentah } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { KomentarSumber } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';

const DEFAULT_PAGE_SIZE = 10;

/**
 * Hook ini TIDAK menyimpan state `page` sendiri — page dikontrol oleh
 * komponen pemanggil (RawCommentList), supaya tombol Prev/Next di UI bisa
 * langsung memanggil setPage tanpa perlu expose setter dari sini.
 */
export function useKomentarMentah(
  filter:   AkademikFilter,
  sumber:   KomentarSumber,
  page:     number,
  pageSize: number = DEFAULT_PAGE_SIZE,
) {
  return useAkademikQuery(
    signal => fetchAkademikKomentarMentah(filter, sumber, page, signal, pageSize),
    [
      filter.tahunAjaran,
      filter.semester,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
      sumber,
      page,
      pageSize,
    ],
  );
}