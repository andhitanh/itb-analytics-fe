// src/features/dashboard/components/shared-charts/attendanceChartContext.ts
import type { AttendanceResponse } from '@/features/dashboard/api/akademik';
import type { GroupDataItem, AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';

type AttendanceType = 'lecturer' | 'student';

const FIELD_BY_TYPE: Record<AttendanceType, string> = {
  lecturer: 'avg_pct_kehadiran_dosen',
  student: 'avg_pct_kehadiran_mahasiswa',
};

const LABEL_BY_TYPE: Record<AttendanceType, string> = {
  lecturer: 'Dosen',
  student: 'Mahasiswa',
};

// Cermin hint standar entity_comparison_bar_chart granularitas fakultas/prodi
// dan single_entity_percentage_value, lihat 04-attendance-chart.md §2.
const COMPARISON_HINT = [
  'Identifikasi entitas dengan nilai tertinggi dan terendah pada metrik ini.',
  'Identifikasi seberapa lebar kesenjangan antarentitas (apakah merata, atau ada outlier jauh di bawah rata-rata)',
  'Nilai berskala 0-100%, bukan skala skor kuesioner 1-4.',
];
const SINGLE_ENTITY_HINT = [
  'Bandingkan angka ini dengan delta_periode_lalu untuk menilai tren membaik atau memburuk.',
  'Nilai berskala 0-100%, bukan skala skor kuesioner 1-4.',
];

/**
 * Field identitas entitas per baris series -- lihat catatan di
 * buildAttendanceChartContext soal keterbatasan no_prodi (numeric ID).
 */
function entityFields(item: GroupDataItem, granularity: 'fakultas' | 'prodi') {
  return granularity === 'fakultas'
    ? { kode_fakultas: item.kode, nama_fakultas_id: item.label }
    : { kode_prodi: item.kode, nama_prodi_id: item.label };
}

/**
 * Susun chart_context untuk tombol "Tanya insight" di AttendanceSection.
 * chart_type dipilih otomatis mengikuti jumlah entitas yang sama seperti
 * logic collapse EntityAwareChart (>1 baris = perbandingan, 1 baris = profil
 * tunggal) -- supaya insight yang diminta chatbot selalu cocok dengan bentuk
 * chart yang benar-benar sedang dilihat user saat itu.
 *
 * Catatan keterbatasan data: AttendanceItem dari endpoint dashboard cuma
 * punya `kode`/`label` generik (bukan field terpisah no_prodi numerik).
 * Untuk granularitas prodi, field `no_prodi` (int) yang disebut di dokumen
 * chart_context sengaja TIDAK disertakan di sini -- kode_prodi + nama_prodi
 * sudah cukup untuk chatbot menyusun narasi, dan menyertakan ID yang keliru
 * lebih berisiko daripada tidak menyertakannya sama sekali.
 */
export function buildAttendanceChartContext(
  type: AttendanceType,
  filter: AkademikFilter,
  data: AttendanceResponse | null | undefined,
  chartData: GroupDataItem[],
): ChartContext {
  const granularity = data?.granularity ?? 'fakultas';
  const field = FIELD_BY_TYPE[type];
  const entityLabel = LABEL_BY_TYPE[type];
  const isSet = (v: unknown) => v !== undefined && v !== null && v !== 'semua';

  const filtersApplied = {
    ...(isSet(filter.tahunAjaran) && { tahun_ajaran: filter.tahunAjaran }),
    ...(isSet(filter.semester) && { semester: [Number(filter.semester)] }),
    ...(isSet(filter.fakultas) && { kode_fakultas: [filter.fakultas] }),
    ...(isSet(filter.programStudi) && { no_prodi: [Number(filter.programStudi)] }),
  };

  if (chartData.length === 1) {
    const item = chartData[0];
    return {
      chart_type: 'single_entity_percentage_value',
      title: `Rata-Rata Kehadiran ${entityLabel}`,
      series: [{
        ...entityFields(item, granularity),
        [field]: item.avg,
        delta_periode_lalu: item.delta ?? null,
      }],
      filters_applied: filtersApplied,
      hint: SINGLE_ENTITY_HINT,
    };
  }

  return {
    chart_type: 'entity_comparison_bar_chart',
    title: `Rata-Rata Kehadiran ${entityLabel} per ${granularity === 'fakultas' ? 'Fakultas' : 'Prodi'}`,
    y_axis_label: 'Persentase kehadiran (%)',
    series: chartData.map((item) => ({
      ...entityFields(item, granularity),
      [field]: item.avg,
      delta_periode_lalu: item.delta ?? null,
    })),
    filters_applied: filtersApplied,
    hint: COMPARISON_HINT,
  };
}