// src/features/dashboard/hooks/useSkorHeatmap.ts
import { fetchAkademikSkorHeatmap } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useSkorHeatmap(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchAkademikSkorHeatmap(filter, signal),
    [
      filter.tahunAjaran,
      filter.semester,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
    ],
  );
}