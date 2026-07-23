// src/features/dashboard/utils/dosenSkorKategori.ts — versi final
import type { HBarChartDataItem } from '@/features/dashboard/components/shared-charts/HBarChart';
import type { DosenKategoriSkorItem, DosenSkorPertanyaanItem } from '@/features/dashboard/api/dosen';

const KATEGORI_KODE_SUMBU: Record<string, string> = {
  capaian:            'Q1-Q3',
  pelaksanaan:        'Q4-Q7',
  q28:                'Q8',
  sarana_prasarana:   'Q9-Q10',
  perilaku_mahasiswa: 'Q11-Q12',
};

/** Extended type: kode = label singkat untuk sumbu, kodeKategoriAsli = identitas asli untuk klik. */
export interface KategoriChartDataItem extends HBarChartDataItem {
  kodeKategoriAsli: string;
}

export function toKategoriChartData(items: DosenKategoriSkorItem[]): KategoriChartDataItem[] {
  return items
    .filter(item => item.skor !== null)
    .map(item => ({
      kode:             KATEGORI_KODE_SUMBU[item.kode_kategori] ?? item.kode_kategori,
      label:            item.label,
      avg:              item.skor as number,
      kodeKategoriAsli: item.kode_kategori,
    }));
}

export function toPertanyaanChartData(items: DosenSkorPertanyaanItem[]): HBarChartDataItem[] {
  return items
    .filter(item => item.skor !== null)
    .map(item => ({
      kode:  item.kode_pertanyaan,
      label: item.pertanyaan,
      avg:   item.skor as number,
    }));
}