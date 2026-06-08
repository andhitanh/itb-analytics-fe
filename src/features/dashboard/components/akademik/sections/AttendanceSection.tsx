import { HBarChart }              from '@/features/dashboard/components/charts/HBarChart';
import { TrendBadge }             from '@/components/ui/domain-badges';
import { deriveAttendanceFull }   from '@/features/dashboard/utils/grouping';
import { useUser }                from '@/context/UserContext';
import type { AkademikFilter }    from '@/features/dashboard/types';

interface AttendanceSectionProps {
  filter:   AkademikFilter;
  type:     'lecturer' | 'student';
  avgLabel: string;
  color:    string;
}

export function AttendanceSection({
  filter, type, avgLabel, color,
}: AttendanceSectionProps) {
  const { user }   = useUser();
  const fullData   = deriveAttendanceFull(filter, user.activeRole, type);
  const chartData  = fullData.map(d => ({ label: d.label, avg: d.avg }));
  const avgCurr    = fullData.reduce((s, d) => s + d.avg,  0) / fullData.length;
  const avgPrev    = fullData.reduce((s, d) => s + d.prev, 0) / fullData.length;
  const delta      = parseFloat((avgCurr - avgPrev).toFixed(1));

  return (
    <div>
      <div className="flex items-baseline gap-2.5 mb-1">
        <span className="text-[28px] font-extrabold leading-none" style={{ color }}>
          {avgCurr.toFixed(1)}%
        </span>
        <TrendBadge trend={delta} />
      </div>
      <p className="text-[11.5px] text-neutral mb-3.5">{avgLabel}</p>
      <HBarChart
        data={chartData}
        color={color}
        domain={[70, 100]}
        height={180}
        labelFormatter={v => `${v}%`}
      />
    </div>
  );
}