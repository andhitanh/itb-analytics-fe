// src/features/dashboard/hooks/useCourseRanking.ts
import { fetchAkademikCourseRanking } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

const DEFAULT_LIMIT = 5;

export function useCourseRanking(
  filter: AkademikFilter,
  metric: string = 'overall',
  limit:  number = DEFAULT_LIMIT,
) {
  return useAkademikQuery(
    signal => fetchAkademikCourseRanking(filter, signal, limit, metric),
    [
      filter.tahunAjaran,
      filter.semester,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
      metric, 
      limit,
    ],
  );
}