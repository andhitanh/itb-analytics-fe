// src/features/dashboard/components/shared-charts/scoreHeatmapChartContext.ts
import { HEATMAP_Q_FIELDS } from '@/features/dashboard/utils/skorHeatmap';
import type { HeatmapRow, SkorHeatmapResponse } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext, QuestionReference } from '@/features/chatbot/types';

// avg_skor_qXX (nama field di response dashboard) -> skor_qXX (nama kolom
// database asli yang dipakai kontrak chart_context, lihat 00-README.md §4:
// "Semua field di chart_context.series ... memakai nama kolom database asli").
// Urutannya HARUS selaras dengan HEATMAP_Q_FIELDS (sumber kebenaran urutan Q1-Q12).
const DB_FIELD_AND_REF: { dbField: string; ref: QuestionReference }[] = [
  { dbField: 'skor_q21', ref: { kode_pertanyaan_frontend: 'Q1', pertanyaan: 'Mahasiswa memperoleh cukup informasi luaran mata kuliah' } },
  { dbField: 'skor_q22', ref: { kode_pertanyaan_frontend: 'Q2', pertanyaan: 'Perkuliahan diarahkan agar mahasiswa mencapai luaran mata kuliah' } },
  { dbField: 'skor_q23', ref: { kode_pertanyaan_frontend: 'Q3', pertanyaan: 'Mahasiswa mencapai luaran mata kuliah' } },
  { dbField: 'skor_q24', ref: { kode_pertanyaan_frontend: 'Q4', pertanyaan: 'Pelaksanaan perkuliahan terorganisir dengan baik' } },
  { dbField: 'skor_q25', ref: { kode_pertanyaan_frontend: 'Q5', pertanyaan: 'Dosen berkomunikasi dengan efektif' } },
  { dbField: 'skor_q26', ref: { kode_pertanyaan_frontend: 'Q6', pertanyaan: 'Dosen peduli terhadap pencapaian mahasiswa akan luaran mata kuliah' } },
  { dbField: 'skor_q27', ref: { kode_pertanyaan_frontend: 'Q7', pertanyaan: 'Dosen berlaku adil kepada mahasiswa' } },
  { dbField: 'skor_q28', ref: { kode_pertanyaan_frontend: 'Q8', pertanyaan: 'Kesesuaian beban kerja dengan SKS' } },
  { dbField: 'skor_q29', ref: { kode_pertanyaan_frontend: 'Q9', pertanyaan: 'Sarana prasarana untuk mata kuliah tersedia dengan memadai' } },
  { dbField: 'skor_q30', ref: { kode_pertanyaan_frontend: 'Q10', pertanyaan: 'Tersedia cukup fasilitas pendukung di luar kuliah' } },
  { dbField: 'skor_q35', ref: { kode_pertanyaan_frontend: 'Q11', pertanyaan: 'Mahasiswa berusaha dengan sungguh-sungguh mengikuti mata kuliah' } },
  { dbField: 'skor_q37', ref: { kode_pertanyaan_frontend: 'Q12', pertanyaan: 'Mahasiswa memperoleh pengalaman belajar yang positif' } },
];

const QUESTION_REFERENCE = Object.fromEntries(
  DB_FIELD_AND_REF.map(({ dbField, ref }) => [dbField, ref]),
);

/** 3 nama kolom (bukan index) dengan skor terendah pada 1 baris -- null diabaikan. */
function bottom3Kolom(row: HeatmapRow): string[] {
  return HEATMAP_Q_FIELDS
    .map((field, i) => ({ dbField: DB_FIELD_AND_REF[i].dbField, value: row[field] }))
    .filter((r): r is { dbField: string; value: number } => r.value !== null)
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)
    .map((r) => r.dbField);
}

function entityFields(item: HeatmapRow, granularity: 'fakultas' | 'prodi') {
  return granularity === 'fakultas'
    ? { kode_fakultas: item.kode, nama_fakultas_id: item.label }
    : { kode_prodi: item.kode, nama_prodi_id: item.label };
}

function scoreFields(item: HeatmapRow): Record<string, number | null> {
  return Object.fromEntries(
    HEATMAP_Q_FIELDS.map((field, i) => [DB_FIELD_AND_REF[i].dbField, item[field]]),
  );
}

/**
 * Susun chart_context untuk tombol "Tanya insight" di kartu ScoreHeatmap.
 * Selalu chart_type score_heatmap_matrix_chart -- tidak ada mode collapse
 * untuk heatmap (lihat 02-chart-context-empty-templates.md §7: granularitas
 * fakultas/prodi keduanya mode perbandingan, tidak ada varian 1-entitas).
 */
export function buildScoreHeatmapChartContext(
  filter: AkademikFilter,
  data: SkorHeatmapResponse | null | undefined,
): ChartContext {
  const granularity = data?.granularity ?? 'fakultas';
  const items = data?.items ?? [];
  const isSet = (v: unknown) => v !== undefined && v !== null && v !== 'semua';

  return {
    chart_type: 'score_heatmap_matrix_chart',
    title: `Heatmap Rata-Rata Skor per ${granularity === 'fakultas' ? 'Fakultas' : 'Prodi'} × Pertanyaan`,
    series: items.map((item) => ({
      ...entityFields(item, granularity),
      ...scoreFields(item),
      bottom_3_kolom: bottom3Kolom(item),
    })),
    filters_applied: {
      ...(isSet(filter.tahunAjaran) && { tahun_ajaran: filter.tahunAjaran }),
      ...(isSet(filter.semester) && { semester: [Number(filter.semester)] }),
      ...(isSet(filter.fakultas) && { kode_fakultas: [filter.fakultas] }),
      ...(isSet(filter.programStudi) && { no_prodi: [Number(filter.programStudi)] }),
    },
    hint: [
      'Identifikasi pertanyaan (kolom) yang konsisten rendah di banyak entitas.',
      'Identifikasi pertanyaan (kolom) bottom_3_kolom (3 pertanyaan dengan skor terendah) di setiap entitas untuk mengidentifikasi poin pertanyaan apa yang perlu menjadi perhatian untuk evaluasi setiap entitas.',
    ],
    question_reference: QUESTION_REFERENCE,
  };
}