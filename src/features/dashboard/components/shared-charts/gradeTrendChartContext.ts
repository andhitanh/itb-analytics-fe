// src/features/dashboard/components/shared-charts/gradeTrendChartContext.ts
import type { GradeTrendResponse, GradeTrendPoint } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';

type TrendMetric = 'overall' | 'capaian' | 'pelaksanaan';

const FIELD_BY_METRIC: Record<TrendMetric, keyof GradeTrendPoint> = {
  overall: 'avg_skor_overall',
  capaian: 'avg_skor_capaian',
  pelaksanaan: 'avg_skor_pelaksanaan',
};

/**
 * Susun chart_context untuk kartu tren line chart (score_trend_line_chart).
 * Dipakai untuk 2 kartu berbeda yang sama-sama bersumber dari useGradeTrend,
 * cuma beda apa yang divisualisasikan -- makanya 1 fungsi diparameterisasi
 * lewat `title`+`metrics`, bukan 2 fungsi terpisah yang isinya 90% sama:
 *
 * - GradeTrendSection ("Tren Rata-Rata Nilai Mahasiswa", Tab Luaran):
 *   1 garis -> metrics=['overall']
 * - TabInfoUmum ("Tren Rata-Rata Skor Kuesioner ITB"):
 *   3 garis -> metrics=['overall','capaian','pelaksanaan']
 *
 * Payload sengaja HANYA menyertakan metric yang benar-benar diplot di
 * chart yang bersangkutan -- kalau kartu cuma menampilkan 1 garis, series
 * tidak ikut menyelundupkan avg_skor_capaian/pelaksanaan yang tidak
 * terlihat user, supaya chatbot tidak membahas angka yang tidak ada di layar.
 *
 * Tidak ada mode collapse -- chart ini memang satu-satunya yang sengaja
 * menampilkan banyak periode sekaligus (lihat 06-grade-trend-chart.md §1).
 * tahun_ajaran/semester juga TIDAK PERNAH dikirim di filters_applied --
 * endpoint /grade-trend memang mengabaikan kedua filter itu (lihat komentar
 * di fetchAkademikGradeTrend, akademik.ts), konsisten dengan
 * 02-chart-context-empty-templates.md §6.
 */
export function buildGradeTrendChartContext(
  filter: AkademikFilter,
  data: GradeTrendResponse | null | undefined,
  title: string = 'Tren Rata-Rata Skor Kuesioner',
  metrics: TrendMetric[] = ['overall'],
): ChartContext {
  const trend = data?.trend ?? [];
  const isSet = (v: unknown) => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== 'semua';

  return {
    chart_type: 'score_trend_line_chart',
    title,
    x_axis_label: 'Semester',
    y_axis_label: 'Skor (skala 1-4)',
    series: trend.map((p) => ({
      period_label: p.period_label,
      tahun_ajaran: p.tahun_ajaran,
      semester: p.semester,
      ...Object.fromEntries(metrics.map((m) => [FIELD_BY_METRIC[m], p[FIELD_BY_METRIC[m]]])),
    })),
    filters_applied: {
      ...(isSet(filter.fakultas) && { kode_fakultas: filter.fakultas }),
      ...(isSet(filter.programStudi) && { no_prodi: filter.programStudi.map(Number) }),
    },
    hint: [
      'Identifikasi arah tren (naik/turun) sepanjang periode yang tersedia.',
      'Perhatikan titik semester dengan kenaikan atau penurunan nilai yang tajam.',
      ...(metrics.length > 1
        ? ['Bandingkan arah tren antar-garis (mis. apakah Q1-Q3 dan Q4-Q7 bergerak searah atau justru berlawanan dengan rata-rata umum).']
        : []),
    ],
  };
}