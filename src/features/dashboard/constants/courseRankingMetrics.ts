// src/features/dashboard/constants/courseRankingMetrics.ts

export interface CourseRankingMetricDef {
  metric: string;
  title:  string;
}

/** Tab Info Umum — pengganti chart "Rata-Rata Skor Per Fakultas/Prodi" */
export const METRIC_OVERALL: CourseRankingMetricDef = {
  metric: 'overall', title: 'Rata-Rata 12 Skor Kuesioner',
};

/** Tab Luaran Mata Kuliah — Q1-Q3 & breakdown */
export const METRICS_LUARAN: CourseRankingMetricDef[] = [
  { metric: 'capaian', title: 'Rata-Rata Q1-Q3 — Capaian Pembelajaran' },
  { metric: 'q21',     title: 'Q1 — Informasi Luaran MK' },
  { metric: 'q22',     title: 'Q2 — Perkuliahan ke Luaran' },
  { metric: 'q23',     title: 'Q3 — Mahasiswa Mencapai Luaran' },
];

/** Sub-tab Rancangan Pelaksanaan — Q8 */
export const METRIC_Q8: CourseRankingMetricDef = {
  metric: 'q28', title: 'Q8 — Kesesuaian Beban Kerja dengan SKS',
};

/** Sub-tab Performa Dosen — Q4-Q7 (rata-rata manual, TERPISAH dari Q8) */
export const METRICS_PERFORMA_DOSEN: CourseRankingMetricDef[] = [
  { metric: 'q4_q7', title: 'Rata-Rata Q4-Q7 — Performa Dosen' },
  { metric: 'q24',   title: 'Q4 — Perkuliahan Terorganisir' },
  { metric: 'q25',   title: 'Q5 — Komunikasi Efektif' },
  { metric: 'q26',   title: 'Q6 — Dosen Peduli Pencapaian' },
  { metric: 'q27',   title: 'Q7 — Dosen Berlaku Adil' },
];

/** Sub-tab Performa Mahasiswa — Q11-Q12 */
export const METRICS_PERFORMA_MAHASISWA: CourseRankingMetricDef[] = [
  { metric: 'perilaku_mahasiswa', title: 'Rata-Rata Q11-Q12 — Performa Mahasiswa' },
  { metric: 'q35',                title: 'Q11 — Mahasiswa Berusaha Sungguh-Sungguh' },
  { metric: 'q37',                title: 'Q12 — Pengalaman Belajar Positif' },
];

/** Sub-tab Sarana Prasarana — Q9-Q10 */
export const METRICS_SARANA_PRASARANA: CourseRankingMetricDef[] = [
  { metric: 'sarana_prasarana', title: 'Rata-Rata Q9-Q10 — Sarana Prasarana' },
  { metric: 'q29',              title: 'Q9 — Sarana Prasarana Memadai' },
  { metric: 'q30',               title: 'Q10 — Fasilitas Pendukung di Luar Kuliah' },
];

/** Tab Luaran Mata Kuliah — daftar top/bottom-by-IP (dipakai bersama field jumlah_mahasiswa) */
export const METRIC_AVG_IP: CourseRankingMetricDef = {
  metric: 'avg_ip', title: 'Rata-Rata IP',
};