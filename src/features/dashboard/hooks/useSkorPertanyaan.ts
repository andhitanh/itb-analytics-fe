// src/features/dashboard/hooks/useSkorPertanyaan.ts
import { useSkorPertanyaanGroup } from '@/features/dashboard/hooks/useSkorPertanyaanGroup';
import type { AkademikFilter } from '@/features/dashboard/types';

/**
 * Fetch satu kode_grup. Dibangun di atas useSkorPertanyaanGroup (bukan
 * duplikasi useAkademikQuery) supaya cuma ada satu implementasi fetch untuk
 * endpoint ini di seluruh codebase.
 */
export function useSkorPertanyaan(filter: AkademikFilter, kodeGrup: string) {
  const { data, isLoading, error } = useSkorPertanyaanGroup(filter, [kodeGrup]);
  return { data: data?.[0] ?? null, isLoading, error };
}