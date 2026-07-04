// src/features/dashboard/utils/skorPertanyaan.ts
import type { SkorItem, SkorPertanyaanResponse } from '@/features/dashboard/api/akademik';
import type { GroupDataItem } from '@/features/dashboard/types';

/**
 * SkorItem[] → GroupDataItem[] untuk HBarChart.
 * - kode dipakai sebagai label di granularity fakultas (singkatan enak dibaca).
 * - label (nama lengkap) dipakai di granularity prodi (kode di sana cuma
 *   str(no_ps), angka mentah — lihat keputusan yang sama di GradeDistribution
 *   dan ScoreHeatmap).
 * - Item dengan skor null di-skip, bukan ditampilkan sebagai 0 (0 akan
 *   menyesatkan seolah skornya benar-benar terendah).
 */
export function toHBarData(response: SkorPertanyaanResponse | null): GroupDataItem[] {
  if (!response) return [];
  const useKode = response.granularity === 'fakultas';
  return response.items
    .filter((item): item is SkorItem & { skor: number } => item.skor !== null)
    .map(item => ({ label: useKode ? item.kode : item.label, avg: item.skor }));
}

/**
 * Rata-rata sederhana (bukan tertimbang — SkorItem tidak punya field bobot
 * seperti total_mahasiswa) dari skor + prev_skor SEJUMLAH kode_grup, per
 * entitas yang sama (dicocokkan lewat `kode`). Dipakai saat backend tidak
 * punya grup precomputed yang persis sesuai kebutuhan UI (mis. "Q4-Q7 saja",
 * beda dari grup backend "pelaksanaan" yang mencakup Q4-Q8).
 *
 * Kalau backend sudah punya grup yang pas (capaian, sarana_prasarana,
 * perilaku_mahasiswa), JANGAN pakai fungsi ini — pakai kode_grup itu
 * langsung, supaya tidak menduplikasi logic averaging yang backend sudah
 * kerjakan lebih akurat (backend bisa punya bobot/definisi yang berbeda).
 */
export function averageAcrossGroups(
  responses: (SkorPertanyaanResponse | null)[],
): { label: string; value: number; delta: number | null }[] {
  const valid = responses.filter((r): r is SkorPertanyaanResponse => r !== null);
  if (valid.length === 0) return [];

  const useKode = valid[0].granularity === 'fakultas';
  const byEntity = new Map<string, { label: string; skors: number[]; deltas: number[] }>();

  for (const response of valid) {
    for (const item of response.items) {
      if (item.skor === null) continue;
      const key = item.kode;
      const entry = byEntity.get(key) ?? {
        label: useKode ? item.kode : item.label,
        skors: [],
        deltas: [],
      };
      entry.skors.push(item.skor);
      if (item.prev_skor !== null) {
        entry.deltas.push(item.skor - item.prev_skor);
      }
      byEntity.set(key, entry);
    }
  }

  return Array.from(byEntity.values()).map(({ label, skors, deltas }) => ({
    label,
    value: parseFloat((skors.reduce((s, v) => s + v, 0) / skors.length).toFixed(2)),
    delta: deltas.length > 0
      ? parseFloat((deltas.reduce((s, v) => s + v, 0) / deltas.length).toFixed(2))
      : null,
  }));
}