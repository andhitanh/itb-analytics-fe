// src/features/dashboard/components/shared-charts/gradeDistributionChartContext.ts
import type { GradeDistItem, GradeDistResponse } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';

// Cermin hint standar grade_distribution_* -- lihat 05-grade-distribution-chart.md §3.
function buildHint(entityLabel: 'fakultas' | 'program studi'): string[] {
  return [
    `Bandingkan proporsi grade lulus (A-C) vs bermasalah (D-E-T) antar${entityLabel === 'fakultas' ? 'fakultas' : 'program studi'}.`,
    `Identifikasi mayoritas nilai yang diraih oleh setiap ${entityLabel} untuk mendapat gambaran pemahaman umum mahasiswa ${entityLabel} terkait terhadap pelaksanaan perkuliahan di ${entityLabel} tersebut.`,
    'Identifikasi apakah terdapat flag pada hasil yang diraih, ditandai dengan 100% mahasiswa meraih suatu kategori nilai.',
  ];
}

/**
 * Field identitas entitas per baris series -- lihat catatan keterbatasan
 * no_prodi (numeric ID) di attendanceChartContext.ts, berlaku sama di sini:
 * GradeDistItem cuma punya kode/label generik, bukan ID numerik terpisah.
 */
function entityFields(item: GradeDistItem, granularity: 'fakultas' | 'prodi') {
  return granularity === 'fakultas'
    ? { kode_fakultas: item.kode, nama_fakultas_id: item.label }
    : { kode_prodi: item.kode, nama_prodi_id: item.label };
}

function gradeFields(item: GradeDistItem) {
  return {
    dist_pct_a: item.dist_pct_a,
    dist_pct_ab: item.dist_pct_ab,
    dist_pct_b: item.dist_pct_b,
    dist_pct_bc: item.dist_pct_bc,
    dist_pct_c: item.dist_pct_c,
    dist_pct_d: item.dist_pct_d,
    dist_pct_e: item.dist_pct_e,
    dist_pct_t: item.dist_pct_t,
    total_mahasiswa: item.total_mahasiswa,
  };
}

/**
 * Susun chart_context untuk tombol "Tanya insight" di kartu "Distribusi
 * Grade per Fakultas/Prodi" (GradeStackedBar). chart_type dipilih otomatis
 * mengikuti jumlah entitas, sama seperti collapse logic komponen visualnya
 * sendiri (>1 baris = stacked bar perbandingan, 1 baris = profil tunggal).
 *
 * Catatan: kartu "Sebaran Nilai ITB" (GradePie, donut chart) SENGAJA tidak
 * dipasangi tombol ini -- itu cuma agregat ringkasan, bukan salah satu dari
 * 10 chart_type yang didukung chart_interpreter (lihat 05-grade-distribution-
 * chart.md §1: "GradePie ... selalu 1 pie", tidak punya varian chart_type).
 */
export function buildGradeDistributionChartContext(
  filter: AkademikFilter,
  data: GradeDistResponse | null | undefined,
): ChartContext {
  const granularity = data?.granularity ?? 'fakultas';
  const items = data?.items ?? [];
  const entityLabel = granularity === 'fakultas' ? 'fakultas' : 'program studi';
  const isSet = (v: unknown) => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== 'semua';

  const filtersApplied = {
    ...(isSet(filter.tahunAjaran) && { tahun_ajaran: filter.tahunAjaran }),
    ...(isSet(filter.semester) && { semester: [Number(filter.semester)] }),
    ...(isSet(filter.fakultas) && { kode_fakultas: filter.fakultas }),
    ...(isSet(filter.programStudi) && { no_prodi: filter.programStudi.map(Number) }),
  };

  if (items.length === 1) {
    const item = items[0];
    return {
      chart_type: 'grade_distribution_single_entity_bar_chart',
      title: `Distribusi Grade — ${item.label}`,
      series: [{ ...entityFields(item, granularity), ...gradeFields(item) }],
      filters_applied: filtersApplied,
      hint: buildHint(entityLabel),
    };
  }

  return {
    chart_type: 'grade_distribution_stacked_bar_chart',
    title: `Distribusi Grade per ${granularity === 'fakultas' ? 'Fakultas' : 'Prodi'}`,
    series: items.map((item) => ({ ...entityFields(item, granularity), ...gradeFields(item) })),
    filters_applied: filtersApplied,
    hint: buildHint(entityLabel),
  };
}