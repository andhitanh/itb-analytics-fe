import { fetchDosenRefleksi } from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useDosenRefleksi(filter: AkademikFilter, page: number) {
  return useAkademikQuery(
    signal => fetchDosenRefleksi(filter, page, signal),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(','), page],
  );
}