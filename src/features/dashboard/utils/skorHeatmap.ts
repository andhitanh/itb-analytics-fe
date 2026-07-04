// src/features/dashboard/utils/skorHeatmap.ts
import type { HeatmapRow, SkorHeatmapResponse } from '@/features/dashboard/api/akademik';

/**
 * Urutan field HARUS selaras dengan QUESTIONS_SHORT/QUESTIONS_FULL di mockData
 * (index 0 = Q1 = avg_skor_q21, dst) — lihat mapping di api_endpoint_reference.md.
 * Satu-satunya sumber kebenaran untuk urutan ini — ScoreHeatmap dan
 * computeAvgPerQuestion di bawah sama-sama import dari sini, bukan
 * masing-masing definisi array sendiri yang bisa saling tidak sinkron.
 */
export const HEATMAP_Q_FIELDS = [
  'avg_skor_q21', 'avg_skor_q22', 'avg_skor_q23', 'avg_skor_q24',
  'avg_skor_q25', 'avg_skor_q26', 'avg_skor_q27', 'avg_skor_q28',
  'avg_skor_q29', 'avg_skor_q30', 'avg_skor_q35', 'avg_skor_q37',
] as const satisfies readonly (keyof HeatmapRow)[];

/**
 * Rata-rata tiap kolom Q, across semua entitas dalam response — dipakai
 * untuk "Peringkat Pertanyaan Kuesioner" (TabInfoUmum), dihitung dari data
 * yang sama dengan ScoreHeatmap, tanpa endpoint terpisah.
 *
 * Bukan rata-rata tertimbang (HeatmapRow tidak punya field jumlah_mahasiswa/
 * jumlah_kelas) — murni rata-rata antar entitas. Kolom dengan seluruh
 * entitas bernilai null menghasilkan null (bukan 0), supaya "tidak ada data"
 * tidak disalahartikan jadi "skor terendah" saat di-sort untuk ranking.
 */
export function computeAvgPerQuestion(
  response: SkorHeatmapResponse | null,
): (number | null)[] {
  if (!response || response.items.length === 0) {
    return HEATMAP_Q_FIELDS.map(() => null);
  }
  return HEATMAP_Q_FIELDS.map(field => {
    const values = response.items
      .map(item => item[field])
      .filter((v): v is number => v !== null);
    return values.length > 0
      ? values.reduce((s, v) => s + v, 0) / values.length
      : null;
  });
}