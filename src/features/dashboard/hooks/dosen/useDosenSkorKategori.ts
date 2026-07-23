// src/features/dashboard/hooks/dosen/useDosenSkorKategori.ts
import { fetchDosenSkorKategori } from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useDosenSkorKategori(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchDosenSkorKategori(filter, signal),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(',')],
  );
}