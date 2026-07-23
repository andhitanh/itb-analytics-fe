// src/features/dashboard/utils/dosenGradingComp.ts
import type { DosenGradingCompItem } from '@/features/dashboard/api/dosen';
import { GRADING_BUCKET_COLORS } from '@/features/dashboard/utils/gradingComp';

/**
 * Reuse GRADING_BUCKET_COLORS dari dashboard akademik (bukan definisi warna
 * baru) — supaya "UTS" konsisten warnanya di seluruh aplikasi, baik dilihat
 * kaprodi (per fakultas/prodi) maupun dosen (per kelas). Field DB-nya beda
 * nama (bobot_* di sini, avg_bobot_* di GradingCompItem) tapi makna warnanya
 * harus tetap identik.
 */
const DOSEN_BUCKET_FIELD_MAP = [
  { field: 'bobot_uts',          label: 'UTS'          },
  { field: 'bobot_uas',          label: 'UAS'          },
  { field: 'bobot_tugas',        label: 'Tugas'        },
  { field: 'bobot_kuis',         label: 'Kuis'         },
  { field: 'bobot_praktikum',    label: 'Praktikum'    },
  { field: 'bobot_projek',       label: 'Projek'       },
  { field: 'bobot_partisipatif', label: 'Partisipatif' },
] as const;

export interface DosenGradingCompChartRow {
  kelas: string; // "IF2210 · Kelas 1" — identitas baris di sumbu-y
  [bucketLabel: string]: string | number | undefined;
}

/**
 * Ubah 1 DosenGradingCompItem jadi 1 baris chart siap pakai Recharts.
 * Bucket bernilai null (komponen tidak dipakai kelas ini) sengaja
 * di-`undefined`-kan, bukan 0 — Recharts memperlakukan `undefined` sebagai
 * "tidak digambar" pada stacked bar, sedangkan 0 akan tetap menempati slot
 * (terlihat sebagai segmen setebal nol, membingungkan saat hover tooltip).
 */
export function toDosenGradingCompRow(item: DosenGradingCompItem): DosenGradingCompChartRow {
  const row: DosenGradingCompChartRow = { kelas: `${item.kode_matkul} · Kelas ${item.no_kelas}` };
  for (const { field, label } of DOSEN_BUCKET_FIELD_MAP) {
    row[label] = item[field as keyof DosenGradingCompItem] ?? undefined;
  }
  return row;
}

export function buildDosenGradingCompRows(items: DosenGradingCompItem[]): DosenGradingCompChartRow[] {
  return items.map(toDosenGradingCompRow);
}

export { GRADING_BUCKET_COLORS };