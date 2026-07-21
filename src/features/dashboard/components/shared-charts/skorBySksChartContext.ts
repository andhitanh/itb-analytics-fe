// src/features/dashboard/components/shared-charts/skorBySksChartContext.ts
import type { SkorBySksBucket } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';

/**
 * Susun chart_context untuk tombol "Tanya insight" di kartu "Q8 per
 * Kelompok SKS". Selalu chart_type score_by_sks_bucket_bar_chart -- tidak
 * ada granularitas entitas maupun mode collapse sama sekali (grain-nya
 * bucket SKS tetap, sama untuk semua role/scope), lihat
 * 02-chart-context-empty-templates.md §10.
 */
export function buildSkorBySksChartContext(
  filter: AkademikFilter,
  items: SkorBySksBucket[],
): ChartContext {
  const isSet = (v: unknown) => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== 'semua';

  return {
    chart_type: 'score_by_sks_bucket_bar_chart',
    title: 'Q8 per Kelompok SKS',
    x_axis_label: 'Kelompok SKS',
    y_axis_label: 'Skor rata-rata (skala 1-4)',
    // avg_skor_q8 (nama field response dashboard) -> skor_q28 (nama kolom
    // database asli yang dipakai kontrak chart_context, sama seperti
    // penyesuaian di scoreHeatmapChartContext.ts).
    series: items.map((item) => ({
      sks_label: item.sks_label,
      jumlah_kelas: item.jumlah_kelas,
      skor_q28: item.avg_skor_q8,
    })),
    filters_applied: {
      ...(isSet(filter.tahunAjaran) && { tahun_ajaran: filter.tahunAjaran }),
      ...(isSet(filter.semester) && { semester: [Number(filter.semester)] }),
      ...(isSet(filter.fakultas) && { kode_fakultas: filter.fakultas }),
      ...(isSet(filter.programStudi) && { no_prodi: filter.programStudi.map(Number) }),
    },
    hint: [
      'Identifikasi apakah skor Q8 menurun seiring bertambahnya jumlah SKS.',
      'Bandingkan jumlah_kelas antar-bucket untuk menilai keterwakilan rata-rata skor tiap bucket.',
    ],
    question_reference: {
      skor_q28: { kode_pertanyaan_frontend: 'Q8', pertanyaan: 'Kesesuaian beban kerja dengan SKS' },
    },
  };
}