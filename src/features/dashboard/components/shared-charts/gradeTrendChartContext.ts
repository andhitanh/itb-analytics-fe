// src/features/dashboard/components/shared-charts/gradeTrendChartContext.ts
import type { GradeTrendResponse } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';

/**
 * Susun chart_context untuk tombol "Tanya insight" di kartu "Tren Rata-Rata
 * Nilai Mahasiswa" (line chart). Selalu chart_type score_trend_line_chart --
 * tidak ada mode collapse, chart ini memang satu-satunya yang sengaja
 * menampilkan banyak periode sekaligus (lihat 06-grade-trend-chart.md §1).
 *
 * Catatan: berbeda dari chart_type lain, tahun_ajaran/semester TIDAK PERNAH
 * dikirim di filters_applied di sini -- endpoint /grade-trend memang
 * mengabaikan kedua filter itu (lihat komentar di fetchAkademikGradeTrend,
 * akademik.ts), konsisten dengan 02-chart-context-empty-templates.md §6.
 * Hanya kode_fakultas/no_prodi (drill ke 1 entitas) yang relevan di sini.
 */
export function buildGradeTrendChartContext(
  filter: AkademikFilter,
  data: GradeTrendResponse | null | undefined,
): ChartContext {
  const trend = data?.trend ?? [];
  const isSet = (v: unknown) => v !== undefined && v !== null && v !== 'semua';

  return {
    chart_type: 'score_trend_line_chart',
    title: 'Tren Rata-Rata Skor Kuesioner',
    x_axis_label: 'Semester',
    y_axis_label: 'Skor (skala 1-4)',
    series: trend.map((p) => ({
      period_label: p.period_label,
      tahun_ajaran: p.tahun_ajaran,
      semester: p.semester,
      avg_skor_overall: p.avg_skor_overall,
    })),
    filters_applied: {
      ...(isSet(filter.fakultas) && { kode_fakultas: [filter.fakultas] }),
      ...(isSet(filter.programStudi) && { no_prodi: [Number(filter.programStudi)] }),
    },
    hint: [
      'Identifikasi arah tren (naik/turun) sepanjang periode yang tersedia.',
      'Perhatikan titik semester dengan kenaikan atau penurunan nilai yang tajam.',
    ],
  };
}