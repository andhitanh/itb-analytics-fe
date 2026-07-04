// src/features/dashboard/hooks/useSkorPertanyaanGroup.ts
import { fetchAkademikSkorPertanyaan } from '@/features/dashboard/api/akademik';
import { useAkademikQuery } from '@/features/dashboard/hooks/useAkademikQuery';
import type { AkademikFilter } from '@/features/dashboard/types';

/**
 * Fetch beberapa kode_grup sekaligus secara paralel (Promise.all), satu
 * loading/error state gabungan. Dipakai di tab yang butuh banyak kode_grup
 * berbeda dari endpoint yang sama (mis. TabPelaksanaan: q24, q25, q26, q27
 * untuk 4 HBarChart individual sekaligus).
 *
 * Hasil array SELALU sejajar urutannya dengan kodeGrupList — data[i] adalah
 * hasil fetch untuk kodeGrupList[i].
 */
export function useSkorPertanyaanGroup(
  filter:       AkademikFilter,
  kodeGrupList: readonly string[],
) {
  return useAkademikQuery(
    signal => Promise.all(
      kodeGrupList.map(kg => fetchAkademikSkorPertanyaan(filter, kg, signal)),
    ),
    [
      filter.tahunAjaran,
      filter.semester,
      filter.fakultas,
      filter.programStudi,
      filter.jenjang.join(','),
      kodeGrupList.join(','),
    ],
  );
}