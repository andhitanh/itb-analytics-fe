// src/features/dashboard/hooks/useGradeTrend.ts
import { fetchAkademikGradeTrend } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

const DEFAULT_N_SEMESTER = 6;

export function useGradeTrend(filter: AkademikFilter, nSemester: number = DEFAULT_N_SEMESTER) {
  return useAkademikQuery(
    signal => fetchAkademikGradeTrend(filter, nSemester, signal),
    [
      filter.tahunAjaran,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
      nSemester,
      // filter.semester sengaja TIDAK jadi dependency — endpoint ini mengabaikannya,
      // jadi mengubah semester tidak boleh memicu refetch yang sia-sia.
    ],
  );
}