// src/features/dashboard/hooks/dosen/useDosenKelulusan.ts
import { fetchDosenKelulusan } from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useDosenKelulusan(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchDosenKelulusan(filter, signal),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(',')],
  );
}