// src/features/dashboard/hooks/useStatsOverview.ts
import { useState, useEffect } from 'react';
import {
  fetchAkademikStatsOverview,
  type StatsOverviewResponse,
} from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';

export interface UseStatsOverviewResult {
  data:      StatsOverviewResponse | null;
  isLoading: boolean;
  error:     string | null;
}

export function useStatsOverview(filter: AkademikFilter): UseStatsOverviewResult {
  const [data,      setData]      = useState<StatsOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetchAkademikStatsOverview(filter, controller.signal)
      .then(setData)
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(err?.message ?? 'Gagal memuat statistik.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filter.tahunAjaran,
    filter.semester,
    filter.fakultas,
    filter.programStudi,
    filter.jenjang.join(','), // array by reference berubah tiap render — bandingkan by value
  ]);

  return { data, isLoading, error };
}