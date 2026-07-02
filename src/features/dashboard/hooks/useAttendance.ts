// src/features/dashboard/hooks/useAttendance.ts
import { fetchAkademikAttendance } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

export function useAttendance(filter: AkademikFilter) {
  return useAkademikQuery(
    signal => fetchAkademikAttendance(filter, signal),
    [
      filter.tahunAjaran,
      filter.semester,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
    ],
  );
}