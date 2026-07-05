// src/features/dashboard/hooks/useFilterOptions.ts
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import {
  fetchAkademikFilterOptions,
  type AkademikFilterOptionsResponse,
} from '@/features/dashboard/api/akademik';

export interface UseFilterOptionsResult {
  data:      AkademikFilterOptionsResponse | null;
  isLoading: boolean;
  error:     string | null;
}

export function useFilterOptions(): UseFilterOptionsResult {
  const [data,      setData]      = useState<AkademikFilterOptionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const { user } = useUser();
  const activeRoleId = user?.activeRole?.userRoleId ?? null;

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetchAkademikFilterOptions(controller.signal)
      .then(setData)
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(err?.message ?? 'Gagal memuat opsi filter.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [activeRoleId]); // hanya fetch sekali saat mount — filter options stabil per session

  return { data, isLoading, error };
}