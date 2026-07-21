// src/features/dashboard/components/shared-charts/gradingCompChartContext.ts
import type { GradingCompItem } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { ChartContext } from '@/features/chatbot/types';

function entityFields(item: GradingCompItem, granularity: 'fakultas' | 'prodi') {
  return granularity === 'fakultas'
    ? { kode_fakultas: item.kode, nama_fakultas_id: item.label }
    : { kode_prodi: item.kode, nama_prodi_id: item.label };
}

// Field avg_bobot_* opsional -- dihilangkan total dari baris kalau bobotnya
// null (bukan diisi 0), sesuai 08-grading-composition-chart.md §4: "Komponen
// yang tidak muncul di series berarti tidak dipakai sama sekali, bukan data
// hilang." Menyertakan 0 secara eksplisit akan disalahartikan sebagai
// "dipakai tapi bobotnya nol", padahal beda makna dengan "tidak dipakai".
function bobotFields(item: GradingCompItem): Record<string, number> {
  const entries: [string, number | null][] = [
    ['avg_bobot_uts', item.avg_bobot_uts],
    ['avg_bobot_uas', item.avg_bobot_uas],
    ['avg_bobot_tugas', item.avg_bobot_tugas],
    ['avg_bobot_kuis', item.avg_bobot_kuis],
    ['avg_bobot_praktikum', item.avg_bobot_praktikum],
    ['avg_bobot_projek', item.avg_bobot_projek],
    ['avg_bobot_partisipatif', item.avg_bobot_partisipatif],
  ];
  return Object.fromEntries(entries.filter((e): e is [string, number] => e[1] !== null));
}

/**
 * Susun chart_context untuk tombol "Tanya insight" di GradingCompChart.
 * chart_type dipilih otomatis mengikuti jumlah entitas, sama seperti
 * collapse logic komponen visualnya sendiri (items.length === 1).
 */
export function buildGradingCompChartContext(
  filter: AkademikFilter,
  items: GradingCompItem[],
  granularity: 'fakultas' | 'prodi',
): ChartContext {
  const isSet = (v: unknown) => Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== 'semua';
  const entityLabel = granularity === 'fakultas' ? 'fakultas' : 'program studi';

  const filtersApplied = {
    ...(isSet(filter.tahunAjaran) && { tahun_ajaran: filter.tahunAjaran }),
    ...(isSet(filter.semester) && { semester: [Number(filter.semester)] }),
    ...(isSet(filter.fakultas) && { kode_fakultas: filter.fakultas }),
    ...(isSet(filter.programStudi) && { no_prodi: filter.programStudi.map(Number) }),
  };

  if (items.length === 1) {
    const item = items[0];
    return {
      chart_type: 'grading_composition_single_entity_bar_chart',
      title: `Komposisi Komponen Penilaian — ${item.label}`,
      series: [{ ...entityFields(item, granularity), ...bobotFields(item), jumlah_kelas: item.jumlah_kelas }],
      filters_applied: filtersApplied,
      hint: [
        `Identifikasi komponen penilaian dominan pada ${entityLabel} ini.`,
        'Komponen yang tidak muncul di series berarti tidak dipakai sama sekali oleh entitas ini, bukan data hilang.',
      ],
    };
  }

  return {
    chart_type: 'grading_composition_stacked_bar_chart',
    title: `Komposisi Komponen Penilaian per ${granularity === 'fakultas' ? 'Fakultas' : 'Prodi'}`,
    series: items.map((item) => ({
      ...entityFields(item, granularity),
      ...bobotFields(item),
      jumlah_kelas: item.jumlah_kelas,
    })),
    filters_applied: filtersApplied,
    hint: [
      `Identifikasi pola penilaian dominan tiap ${entityLabel}: berbasis ujian (total bobot rata-rata UTS dan bobot rata-rata UAS besar) atau berbasis tugas/proyek.`,
      `Identifikasi komponen penilaian yang dominan digunakan oleh setiap ${entityLabel}.`,
      `Bandingkan pola bobot antar${entityLabel === 'fakultas' ? 'fakultas' : 'program studi'} untuk melihat perbedaan karakteristik penilaian.`,
    ],
  };
}