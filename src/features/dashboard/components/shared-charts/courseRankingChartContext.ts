// src/features/dashboard/components/shared-charts/courseRankingChartContext.ts
import type { CourseRankingItem } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';
import { METRIC_FIELD, Q4_Q7_KOLOM, Q4_Q7_QUESTION_REFERENCE, questionReferenceFor } from '@/features/dashboard/components/shared-charts/metricFieldMap';

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
    question_reference: metric === 'q4_q7' ? Q4_Q7_QUESTION_REFERENCE : questionReferenceFor(metric),
  };
}