import { EntityAwareChart } from "@/features/dashboard/components/shared-charts/EntityAwareChart";
import { ChartState } from '@/features/dashboard/components/shared-charts/ChartState';
import { TrendBadge } from "@/components/ui/domain-badges";
import { useAttendance } from "@/features/dashboard/hooks/useAttendance";
import type { AttendanceItem } from "@/features/dashboard/api/akademik";
import type { AkademikFilter } from "@/features/dashboard/types";

interface AttendanceSectionProps {
  filter: AkademikFilter;
  type: "lecturer" | "student";
  avgLabel: string;
  color: string;
}

function pickCurr(item: AttendanceItem, type: AttendanceSectionProps["type"]) {
  return type === "lecturer" ? item.kehadiran_dosen : item.kehadiran_mahasiswa;
}
function pickPrev(item: AttendanceItem, type: AttendanceSectionProps["type"]) {
  return type === "lecturer" ? item.prev_kehadiran_dosen : item.prev_kehadiran_mahasiswa;
}

/** Rata-rata dari nilai non-null saja — item tanpa data tidak ikut menggeser rata-rata. */
function average(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return null;
  return valid.reduce((s, v) => s + v, 0) / valid.length;
}

export function AttendanceSection({
  filter,
  type,
  avgLabel,
  color,
}: AttendanceSectionProps) {
  const { data, isLoading } = useAttendance(filter);
  const items = data?.items ?? [];

  const chartData = items
    .filter(item => pickCurr(item, type) !== null)
    .map(item => ({
      label: item.label,
      kode:  item.kode,
      avg:   pickCurr(item, type) as number,
      delta: pickPrev(item, type) !== null
        ? parseFloat(((pickCurr(item, type) as number) - (pickPrev(item, type) as number)).toFixed(1))
        : null,
    }));

  const avgCurr = average(items.map(item => pickCurr(item, type)));
  const avgPrev = average(items.map(item => pickPrev(item, type)));
  const delta = avgCurr !== null && avgPrev !== null
    ? parseFloat((avgCurr - avgPrev).toFixed(1))
    : null;

  return (
    <div>
      <div className="flex items-baseline gap-2.5 mb-1">
        <span
          className="text-[28px] font-extrabold leading-none"
          style={{ color }}
        >
          {isLoading || avgCurr === null ? "—" : `${avgCurr.toFixed(1)}%`}
        </span>
        {!isLoading && delta !== null && <TrendBadge trend={delta} />}
      </div>
      <p className="text-[11.5px] text-neutral mb-3.5">{avgLabel}</p>
      {isLoading ? (
        <ChartState label="Memuat data kehadiran…" height={300} />
      ) : chartData.length === 0 ? (
        <ChartState label="Tidak ada data untuk filter ini." height={300} />
      ) : (
        <EntityAwareChart
         items={chartData}
          color={color}
          domain={[70, 100]}
          height={300}
          labelFormatter={(v) => `${v}%`}
          hideProfileIfRedundant
        />
      )}
    </div>
  );
}