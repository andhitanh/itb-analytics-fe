// src/features/dashboard/hooks/dosen/useDosenTrend.ts
import { fetchDosenTrend } from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

const DEFAULT_N_SEMESTER = 8;

export function useDosenTrend(filter: AkademikFilter, nSemester: number = DEFAULT_N_SEMESTER) {
  return useAkademikQuery(
    signal => fetchDosenTrend(filter, signal, nSemester),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(','), nSemester],
  );
}