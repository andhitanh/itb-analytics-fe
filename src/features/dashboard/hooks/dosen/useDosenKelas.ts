// src/features/dashboard/hooks/dosen/useDosenKelas.ts
import { fetchDosenKelas } from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useDosenKelas(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchDosenKelas(filter, signal),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(',')],
  );
}