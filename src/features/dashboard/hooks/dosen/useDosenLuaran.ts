// src/features/dashboard/hooks/dosen/useDosenLuaran.ts
import { fetchDosenLuaran } from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useDosenLuaran(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchDosenLuaran(filter, signal),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(',')],
  );
}