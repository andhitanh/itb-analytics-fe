// src/features/dashboard/components/shared-charts/courseRankingChartContext.ts
import type { CourseRankingItem } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';

// Cermin tabel "Field skor per metric" di 03-entity-comparison-and-ranking-chart.md §2.1.
// q4_q7 sengaja tidak dipetakan ke 1 field tunggal -- ditangani terpisah di
// buildCourseRankingChartContext karena strukturnya beda (rata_rata_dari_kolom + nilai).
const METRIC_FIELD: Record<string, string> = {
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

const Q4_Q7_KOLOM = ['skor_q24', 'skor_q25', 'skor_q26', 'skor_q27'];

function toSeriesRow(item: CourseRankingItem, posisi: 'top' | 'bottom', metric: string) {
  const base = {
    posisi_ranking: posisi,
    kode_matkul: item.kode_matkul,
    nama_matkul_id: item.nama_matkul_id,
    jumlah_mahasiswa: item.jumlah_mahasiswa,
  };

  if (metric === 'q4_q7') {
    return { ...base, rata_rata_dari_kolom: Q4_Q7_KOLOM, nilai: item.skor };
  }
  return { ...base, [METRIC_FIELD[metric] ?? metric]: item.skor };
}

/**
 * Susun chart_context untuk tombol "Tanya insight" di CourseRankingSection.
 *
 * Catatan granularitas (keputusan sementara -- lihat pembahasan implementasi):
 * series di sini berbutir MATA KULIAH (mengikuti data yang sudah tersedia di
 * endpoint /api/dashboard/akademik/course-ranking), BUKAN kelas individual.
 * Karena itu field kelas_id/no_kelas/jumlah_kelas_aktif TIDAK disertakan --
 * menyertakan field yang datanya tidak benar-benar ada lebih berbahaya
 * daripada tidak menyertakannya sama sekali. hint di bawah juga sengaja
 * memakai kata "mata kuliah", bukan "kelas", supaya konsisten dengan apa
 * yang benar-benar ditampilkan di kartu ini.
 *
 * Catatan implementasi: AkademikFilterBar memakai sentinel string "semua"
 * untuk "tidak difilter" (bukan undefined/null) -- helper ini menyaring
 * sentinel itu supaya filters_applied yang dikirim ke chatbot cuma berisi
 * filter yang benar-benar aktif, sesuai kontrak "objeknya kosong {} kalau
 * tidak ada filter aktif" (01-chart-context-type.md §6).
 */
export function buildCourseRankingChartContext(
  metric: string,
  title: string,
  data: { top: CourseRankingItem[]; bottom: CourseRankingItem[] } | null | undefined,
  filter: AkademikFilter,
): ChartContext {
  const series = [
    ...(data?.top ?? []).map((item) => toSeriesRow(item, 'top', metric)),
    ...(data?.bottom ?? []).map((item) => toSeriesRow(item, 'bottom', metric)),
  ];

  const isSet = (v: unknown) => v !== undefined && v !== null && v !== 'semua';

  return {
    chart_type: 'course_ranking_top_bottom_list',
    title,
    series,
    filters_applied: {
      ...(isSet(filter.tahunAjaran) && { tahun_ajaran: filter.tahunAjaran }),
      ...(isSet(filter.semester) && { semester: [Number(filter.semester)] }),
      ...(isSet(filter.fakultas) && { kode_fakultas: [filter.fakultas] }),
      ...(isSet(filter.programStudi) && { no_prodi: [Number(filter.programStudi)] }),
    },
    hint: [
      'Bandingkan mata kuliah top dan bottom untuk metrik ini.',
      'Prioritaskan mata kuliah bottom dengan jumlah_mahasiswa besar karena dampaknya lebih luas.',
    ],
  };
}