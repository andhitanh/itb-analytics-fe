// src/features/dashboard/components/shared-charts/metricFieldMap.ts
import type { QuestionReference } from '@/features/chatbot/types';

/**
 * Cermin tabel "Field skor per metric" di 03-entity-comparison-and-ranking-
 * chart.md §2.1 -- berlaku IDENTIK untuk entity_comparison_bar_chart maupun
 * course_ranking_top_bottom_list (field skornya sama, cuma grain baris beda).
 * Satu-satunya sumber kebenaran untuk mapping ini -- courseRankingChartContext
 * dan entityComparisonChartContext sama-sama import dari sini, supaya tidak
 * ada 2 tabel mapping yang bisa diam-diam saling menyimpang.
 *
 * "q4_q7" sengaja tidak ada di sini -- field-nya bukan 1 nama tunggal
 * (rata_rata_dari_kolom + nilai), ditangani terpisah lewat Q4_Q7_KOLOM
 * di bawah, lihat 03 §2.1.1.
 */
export const METRIC_FIELD: Record<string, string> = {
  overall: 'avg_skor_overall',
  capaian: 'avg_skor_capaian',
  q21: 'skor_q21', q22: 'skor_q22', q23: 'skor_q23',
  q24: 'skor_q24', q25: 'skor_q25', q26: 'skor_q26', q27: 'skor_q27',
  q28: 'skor_q28',
  sarana_prasarana: 'avg_skor_sarana_prasarana',
  q29: 'skor_q29', q30: 'skor_q30',
  perilaku_mahasiswa: 'avg_skor_perilaku_mahasiswa',
  q35: 'skor_q35', q37: 'skor_q37',
  avg_ip: 'avg_ip_akhir_mahasiswa',
};

export const Q4_Q7_KOLOM = ['skor_q24', 'skor_q25', 'skor_q26', 'skor_q27'];

export const Q4_Q7_QUESTION_REFERENCE: Record<string, QuestionReference> = {
  skor_q24: { kode_pertanyaan_frontend: 'Q4', pertanyaan: 'Pelaksanaan perkuliahan terorganisir dengan baik' },
  skor_q25: { kode_pertanyaan_frontend: 'Q5', pertanyaan: 'Dosen berkomunikasi dengan efektif' },
  skor_q26: { kode_pertanyaan_frontend: 'Q6', pertanyaan: 'Dosen peduli terhadap pencapaian mahasiswa akan luaran mata kuliah' },
  skor_q27: { kode_pertanyaan_frontend: 'Q7', pertanyaan: 'Dosen berlaku adil kepada mahasiswa' },
};

/**
 * question_reference cuma ada untuk metric individual (q21-q30, q35, q37) --
 * TIDAK ada untuk metric komposit (overall, capaian, sarana_prasarana,
 * perilaku_mahasiswa) maupun avg_ip, karena itu bukan 1 pertanyaan kuesioner
 * individual (lihat 01-chart-context-type.md §5.3).
 */
const INDIVIDUAL_QUESTION_REFERENCE: Record<string, QuestionReference> = {
  skor_q21: { kode_pertanyaan_frontend: 'Q1', pertanyaan: 'Mahasiswa memperoleh cukup informasi luaran mata kuliah' },
  skor_q22: { kode_pertanyaan_frontend: 'Q2', pertanyaan: 'Perkuliahan diarahkan agar mahasiswa mencapai luaran mata kuliah' },
  skor_q23: { kode_pertanyaan_frontend: 'Q3', pertanyaan: 'Mahasiswa mencapai luaran mata kuliah' },
  ...Q4_Q7_QUESTION_REFERENCE,
  skor_q28: { kode_pertanyaan_frontend: 'Q8', pertanyaan: 'Kesesuaian beban kerja dengan SKS' },
  skor_q29: { kode_pertanyaan_frontend: 'Q9', pertanyaan: 'Sarana prasarana untuk mata kuliah tersedia dengan memadai' },
  skor_q30: { kode_pertanyaan_frontend: 'Q10', pertanyaan: 'Tersedia cukup fasilitas pendukung di luar kuliah' },
  skor_q35: { kode_pertanyaan_frontend: 'Q11', pertanyaan: 'Mahasiswa berusaha dengan sungguh-sungguh mengikuti mata kuliah' },
  skor_q37: { kode_pertanyaan_frontend: 'Q12', pertanyaan: 'Mahasiswa memperoleh pengalaman belajar yang positif' },
};

/** question_reference untuk 1 metric, atau undefined kalau metric ini komposit/avg_ip/q4_q7. */
export function questionReferenceFor(metric: string): Record<string, QuestionReference> | undefined {
  const field = METRIC_FIELD[metric];
  if (!field || !(field in INDIVIDUAL_QUESTION_REFERENCE)) return undefined;
  return { [field]: INDIVIDUAL_QUESTION_REFERENCE[field] };
}