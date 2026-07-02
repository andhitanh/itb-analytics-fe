// src/features/dashboard/hooks/useAkademikQuery.ts
import { useState, useEffect } from 'react';

export interface UseAkademikQueryResult<T> {
  data:      T | null;
  isLoading: boolean;
  error:     string | null;
}

/**
 * Hook generik untuk fetch data dashboard akademik yang bergantung pada filter.
 *
 * Dipakai oleh semua hook endpoint-specific (useStatsOverview, useAttendance, dst)
 * supaya boilerplate useState + AbortController + loading/error tidak diulang
 * di setiap hook. Setiap hook endpoint-specific tetap ada satu file sendiri —
 * ini bukan "satu hook untuk semua endpoint", hanya menghilangkan duplikasi
 * mekanisme fetch-nya.
 *
 * @param fetchFn Fungsi fetch, menerima AbortSignal untuk cleanup saat filter berubah
 *                sebelum request sebelumnya selesai (mencegah race condition).
 * @param deps    Dependency array — HARUS primitif (string/number), bukan objek/array
 *                by reference, supaya tidak retrigger di setiap render. Untuk field
 *                array seperti filter.jenjang, pakai filter.jenjang.join(',').
 */
export function useAkademikQuery<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
): UseAkademikQueryResult<T> {
  const [data,      setData]      = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchFn(controller.signal)
      .then(setData)
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(err?.message ?? 'Gagal memuat data.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error };
}