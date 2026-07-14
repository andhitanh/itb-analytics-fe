// components/shared-charts/ChartState.tsx
interface ChartStateProps {
  label:  string;
  height?: number;
}

/**
 * Loading/empty state generik untuk kartu chart. Sebelumnya didefinisikan
 * lokal & duplikat di TabPelaksanaan.tsx, AttendanceSection.tsx,
 * ScoreHeatmap.tsx dengan teks dan className yang nyaris identik — diekstrak
 * ke sini sebagai satu-satunya sumber kebenaran.
 */
export function ChartState({ label, height = 300 }: ChartStateProps) {
  return (
    <div
      className="flex items-center justify-center text-[12px] text-neutral"
      style={{ height }}
    >
      {label}
    </div>
  );
}