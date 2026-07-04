// src/features/dashboard/hooks/useSkorBySks.ts
import { fetchAkademikSkorBySks } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useSkorBySks(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchAkademikSkorBySks(filter, signal),
    [
      filter.tahunAjaran,
      filter.semester,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
    ],
  );
}