// src/features/dashboard/components/shared-charts/entityComparisonChartContext.ts
import type { AkademikFilter, GroupDataItem } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';
import { METRIC_FIELD, Q4_Q7_KOLOM, Q4_Q7_QUESTION_REFERENCE, questionReferenceFor } from '@/features/dashboard/components/shared-charts/metricFieldMap';

function entityFields(item: GroupDataItem, granularity: 'fakultas' | 'prodi') {
  return granularity === 'fakultas'
    ? { kode_fakultas: item.kode, nama_fakultas_id: item.label }
    : { kode_prodi: item.kode, nama_prodi_id: item.label };
}

/**
 * Susun chart_context entity_comparison_bar_chart -- dipakai generik oleh
 * EntityAwareChart untuk SEMUA 16 metric skor kuesioner + avg_ip (mode >1
 * entitas, sebelum collapse ke CourseRankingSection). 1 fungsi ini melayani
 * ~17 titik pemakaian dashboard sekaligus karena field skor & question_
 * reference-nya diturunkan dari metric string yang sudah konsisten dipakai
 * di seluruh call site (courseRankingMetric prop yang sama persis dipakai
 * untuk collapse ke course_ranking_top_bottom_list).
 *
 * granularity ditentukan dari filter.fakultas (sama seperti pola groupLabel
 * yang sudah dipakai berulang di TabInfoUmum/TabLuaran/TabPelaksanaan):
 * fakultas belum difilter -> baris = fakultas; sudah difilter ke 1 fakultas
 * -> baris = prodi dalam fakultas itu.
 */
export function buildEntityComparisonChartContext(
  metric: string,
  title: string,
  items: GroupDataItem[],
  filter: AkademikFilter,
): ChartContext {
  const granularity: 'fakultas' | 'prodi' = filter.fakultas.length > 0 ? 'prodi' : 'fakultas';
  const isSet = (v: unknown) => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== 'semua';

  const toRow = (item: GroupDataItem) => {
    const base = { ...entityFields(item, granularity), delta_periode_lalu: item.delta ?? null };
    return metric === 'q4_q7'
      ? { ...base, rata_rata_dari_kolom: Q4_Q7_KOLOM, nilai: item.avg }
      : { ...base, [METRIC_FIELD[metric] ?? metric]: item.avg };
  };

  const entityLabel = granularity === 'fakultas' ? 'fakultas' : 'program studi';

  return {
    chart_type: 'entity_comparison_bar_chart',
    title,
    y_axis_label: metric === 'avg_ip' ? 'IP rata-rata (skala 0-4)' : 'Skor rata-rata (skala 1-4)',
    series: items.map(toRow),
    filters_applied: {
      ...(isSet(filter.tahunAjaran) && { tahun_ajaran: filter.tahunAjaran }),
      ...(isSet(filter.semester) && { semester: [Number(filter.semester)] }),
      ...(isSet(filter.fakultas) && { kode_fakultas: filter.fakultas }),
      ...(isSet(filter.programStudi) && { no_prodi: filter.programStudi.map(Number) }),
    },
    hint: [
      `Identifikasi ${entityLabel} dengan nilai tertinggi dan terendah pada metrik ini.`,
      `Identifikasi seberapa lebar kesenjangan antar${entityLabel === 'fakultas' ? 'fakultas' : 'program studi'} (apakah merata, atau ada outlier jauh di bawah rata-rata)`,
      'Untuk metrik skor kuesioner (skor_q21 sampai skor_q37), nilai di bawah 3.0 (skala 1-4) mengindikasikan area yang perlu perhatian; ambang ini tidak berlaku untuk metrik avg_ip.',
    ],
    question_reference: metric === 'q4_q7' ? Q4_Q7_QUESTION_REFERENCE : questionReferenceFor(metric),
  };
}