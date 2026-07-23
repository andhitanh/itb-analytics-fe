// src/features/dashboard/hooks/dosen/useDosenStatsOverview.ts
import { fetchDosenStatsOverview } from '@/features/dashboard/api/dosen';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useDosenStatsOverview(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchDosenStatsOverview(filter, signal),
    [filter.tahunAjaran, filter.semester, filter.jenjang.join(',')],
  );
}