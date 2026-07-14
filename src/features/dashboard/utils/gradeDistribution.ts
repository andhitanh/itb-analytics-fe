// src/features/dashboard/utils/gradeDistribution.ts
import type { GradeDistItem, GradeDistResponse } from '@/features/dashboard/api/akademik';
import type { GroupDataItem } from '@/features/dashboard/types';

/**
 * avg_ip per entitas → GroupDataItem[] untuk HBarChart.
 * Dipakai GradeTrendSection panel kanan ("Rata-Rata Nilai per Fakultas/Prodi") —
 * BUKAN dist_pct_* (itu skala persen, avg_ip skala IP [0,4]).
 * Sama seperti toHBarData di skorPertanyaan.ts: kode untuk granularity
 * fakultas, label untuk prodi; item dengan avg_ip null di-skip.
 */
export function toIpHBarData(response: GradeDistResponse | null): GroupDataItem[] {
  if (!response) return [];
  return response.items
    .filter((item): item is GradeDistItem & { avg_ip: number } => item.avg_ip !== null)
    .map(item => ({ label: item.label, kode: item.kode, avg: item.avg_ip }));
}

export function explodeGradeToProfile(item: GradeDistItem): GroupDataItem[] {
  const grades: [keyof GradeDistItem, string][] = [
    ['dist_pct_a','A'], ['dist_pct_ab','AB'], ['dist_pct_b','B'], ['dist_pct_bc','BC'],
    ['dist_pct_c','C'], ['dist_pct_d','D'], ['dist_pct_e','E'], ['dist_pct_t','T'],
  ];
  return grades
    .filter(([field]) => item[field] !== null)
    .map(([field, label]) => ({ label, kode: label, avg: item[field] as number }));
}