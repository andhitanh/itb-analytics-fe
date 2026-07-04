// src/features/dashboard/hooks/useGradingComp.ts
import { fetchAkademikGradingComp } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useGradingComp(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchAkademikGradingComp(filter, signal),
    [
      filter.tahunAjaran,
      filter.semester,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
    ],
  );
}