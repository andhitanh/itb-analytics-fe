// src/features/dashboard/hooks/dosen/useDosenGradingComp.ts
import { fetchDosenGradingComp } from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useDosenGradingComp(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchDosenGradingComp(filter, signal),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(',')],
  );
}