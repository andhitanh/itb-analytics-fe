// src/features/dashboard/hooks/useGradeDistribution.ts
import { fetchAkademikGradeDistribution } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useGradeDistribution(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchAkademikGradeDistribution(filter, signal),
    [
      filter.tahunAjaran,
      filter.semester,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
    ],
  );
}