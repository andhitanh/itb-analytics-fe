// src/features/dashboard/components/dosen/DosenTrendSparkline.tsx
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RechartsTooltip } from '@/components/ui/recharts-tooltip';

interface DosenTrendSparklineProps {
  label:     string;
  unit:      string;
  data:      { x: string; y: number | null }[];
  color:     string;
  isLoading: boolean;
}

export function DosenTrendSparkline({ label, unit, data, color, isLoading }: DosenTrendSparklineProps) {
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const delta =
    last?.y != null && prev?.y != null
      ? parseFloat((last.y - prev.y).toFixed(2))
      : null;

  return (
    <div>
      <p className="text-[12px] text-neutral mb-1">{label}</p>

      <div className="flex items-baseline gap-2 mb-2.5">
        <span className="text-[20px] font-extrabold text-text-dark leading-none">
          {isLoading || last?.y == null ? '—' : last.y.toFixed(2)}
        </span>
        <span className="text-[12px] text-neutral">{unit}</span>
        {!isLoading && delta !== null && Math.abs(delta) >= 0.01 && (
          <span
            className={
              delta >= 0
                ? 'text-[11px] font-semibold text-success'
                : 'text-[11px] font-semibold text-danger'
            }
          >
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(2)}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-[100px] flex items-center justify-center text-[11px] text-neutral">
          Memuat…
        </div>
      ) : data.length === 0 ? (
        <div className="h-[100px] flex items-center justify-center text-[11px] text-neutral">
          Belum ada data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            {/* dataKey="x" WAJIB diisi -- ini yang membuat Recharts memakai
                period_label ("2024/2025 Ganjil") sebagai label tooltip,
                bukan index array (0,1,2,...). hide agar axis tidak
                digambar secara visual, sparkline tetap terlihat sama. */}
            <XAxis dataKey="x" hide />
            <Tooltip content={<RechartsTooltip />} />
            <Line
              dataKey="y"
              name={label}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}