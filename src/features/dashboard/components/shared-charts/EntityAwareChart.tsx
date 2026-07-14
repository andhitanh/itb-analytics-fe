import { HBarChart, type HBarChartDataItem } from './HBarChart';
import { ChartState } from './ChartState';
import { TrendBadge } from '@/components/ui/domain-badges';
import { CourseRankingSection } from '@/features/dashboard/components/akademik/sections/CourseRankingSection';
import type { GroupDataItem, AkademikFilter } from '@/features/dashboard/types';

interface EntityAwareChartProps {
  items:                    GroupDataItem[];
  color:                    string;
  domain?:                  [number, number];
  height?:                  number;
  labelFormatter?:          (value: number) => string;
  sortOrder?:               'asc' | 'desc';
  /**
   * Set true kalau parent SUDAH menampilkan KPI+delta sendiri di luar
   * komponen ini (seperti AttendanceSection) — supaya mode profil (1 entitas)
   * tidak duplikat menampilkan angka yang sama dua kali.
   */
  referenceLine?: {
    value:  number;
    label:  string;
    color?: string;
  };
  hideProfileIfRedundant?: boolean;
  /** Ketiganya diisi bersamaan → saat items.length===1, render
   * CourseRankingSection (top/bottom matkul) alih-alih SingleEntityProfile. */
  filter?:              AkademikFilter;
  courseRankingMetric?: string;
  courseRankingTitle?:  string;
  /**
   * Dipanggil saat user klik salah satu bar (mode perbandingan, >1 entitas).
   * Terima kode entitas yang diklik — parent bertanggung jawab update filter
   * (mis. setFilter({ ...filter, fakultas: kode })). Tidak relevan saat
   * items.length===1 karena tidak ada "bar lain" untuk diklik lagi.
   */
  onDrill?: (kode: string) => void;
}

/**
 * Wrapper generik untuk seluruh chart perbandingan "1 baris = 1 entitas"
 * (fakultas/prodi/dll). Bereaksi terhadap PANJANG DATA, bukan role —
 * konsisten baik untuk scope yang memang terkunci (Kaprodi/Dekan) maupun
 * Direktorat yang kebetulan memfilter jadi 1 entitas (drill-down).
 *
 * - >1 baris → HBarChart (mode perbandingan, clickable kalau onDrill diisi)
 * - ==1 baris → CourseRankingSection (kalau filter+metric diisi) atau
 *   profil KPI + delta (fallback)
 * - 0 baris → ChartState kosong
 */
export function EntityAwareChart({
  items,
  color,
  domain = [3.0, 4.0],
  height = 300,
  labelFormatter = v => v.toFixed(2),
  sortOrder = 'desc',
  referenceLine,
  hideProfileIfRedundant = false,
  filter,
  courseRankingMetric,
  courseRankingTitle,
  onDrill,
}: EntityAwareChartProps) {
  if (items.length === 0) {
    return <ChartState label="Tidak ada data untuk filter ini." height={height} />;
  }

  if (items.length === 1) {
    if (hideProfileIfRedundant) return null;

    if (filter && courseRankingMetric) {
      return (
        <CourseRankingSection
          filter={filter}
          metric={courseRankingMetric}
          title={courseRankingTitle ?? items[0].label}
        />
      );
    }

    return (
      <SingleEntityProfile
        item={items[0]}
        color={color}
        height={height}
        labelFormatter={labelFormatter}
      />
    );
  }

  const data: HBarChartDataItem[] = items;
  return (
    <HBarChart
      data={data}
      color={color}
      domain={domain}
      height={height}
      labelFormatter={labelFormatter}
      sortOrder={sortOrder}
      referenceLine={referenceLine}
      onBarClick={onDrill}
    />
  );
}

// ─── Mode profil: 1 entitas ───────────────────────────────────────────────────

interface SingleEntityProfileProps {
  item:            GroupDataItem;
  color:           string;
  height:          number;
  labelFormatter:  (value: number) => string;
}

function SingleEntityProfile({ item, color, height, labelFormatter }: SingleEntityProfileProps) {
  const hasDelta = item.delta !== undefined && item.delta !== null;

  return (
    <div
      className="flex flex-col items-center justify-center gap-1.5"
      style={{ height }}
    >
      <span className="text-[13px] text-neutral">{item.label}</span>
      <div className="flex items-baseline gap-2.5">
        <span className="text-[32px] font-extrabold leading-none" style={{ color }}>
          {labelFormatter(item.avg)}
        </span>
        {hasDelta && <TrendBadge trend={item.delta as number} />}
      </div>
    </div>
  );
}