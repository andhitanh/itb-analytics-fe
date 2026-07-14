import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { RechartsTooltip } from "@/components/ui/recharts-tooltip";
import { EntityAwareChart } from "@/features/dashboard/components/shared-charts/EntityAwareChart";
import { useGradeTrend } from "@/features/dashboard/hooks/useGradeTrend";
import { chartColors, AXIS_STYLE } from "@/styles/chart-token";
import type { GroupDataItem, AkademikFilter } from "@/features/dashboard/types";
import { ChartInsightButton } from "@/features/dashboard/components/shared-charts/ChartInsightButton";
import { buildGradeTrendChartContext } from "@/features/dashboard/components/shared-charts/gradeTrendChartContext";

// ─── Props ────────────────────────────────────────────────────────────────────

interface GradeTrendSectionProps {
  filter:    AkademikFilter;
  ipData:    GroupDataItem[];
  ipLoading: boolean;
  onDrill:   (kode: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GradeTrendSection({ filter, ipData, ipLoading, onDrill }: GradeTrendSectionProps) {
  const groupLabel = filter.fakultas !== "semua" ? "Prodi" : "Fakultas";

  const { data, isLoading } = useGradeTrend(filter);
  const trend = data?.trend ?? [];

  const chartData = trend.map(p => ({
    semester: p.period_label,
    skor:     p.avg_skor_overall,
  }));

  const last = trend[trend.length - 1];
  const prev = trend[trend.length - 2];
  const delta =
    last?.avg_skor_overall != null && prev?.avg_skor_overall != null
      ? parseFloat((last.avg_skor_overall - prev.avg_skor_overall).toFixed(2))
      : null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Temporal trend — tidak terpengaruh grouping */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>Tren Rata-Rata Nilai Mahasiswa</CardTitle>
              <CardDescription>
                Perkembangan skor dari semester ke semester
              </CardDescription>
            </div>
            {!isLoading && chartData.length > 0 && (
              <ChartInsightButton chartContext={buildGradeTrendChartContext(filter, data)} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-[30px] font-extrabold text-text-dark leading-none">
              {isLoading || last?.avg_skor_overall == null ? "—" : last.avg_skor_overall.toFixed(2)}
            </span>
            <span className="text-[14px] text-neutral">/ 4.00</span>
            {!isLoading && delta !== null && (
              <span
                className={`text-[12px] font-semibold px-2 py-0.5 rounded-md ${
                  delta >= 0
                    ? "bg-score-high-bg text-score-high-text"
                    : "bg-score-low-bg text-score-low-text"
                }`}
              >
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)} vs semester lalu
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-neutral mb-4">
            {last ? `Skor rata-rata kuesioner — semester ${last.period_label}` : "Rata-rata skor kuesioner"}
          </p>
          {isLoading ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-neutral">
              Memuat data tren…
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-neutral">
              Tidak ada data untuk filter ini.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 12, bottom: 0, left: -14 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" />
                <XAxis dataKey="semester" tick={AXIS_STYLE} />
                <YAxis
                  domain={[2.7, 3.6]}
                  tick={AXIS_STYLE}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <Tooltip content={<RechartsTooltip />} />
                <ReferenceLine
                  y={3.0}
                  stroke="#E74C3C"
                  strokeDasharray="6 3"
                  strokeWidth={1}
                  label={{
                    value: "Min. 3.0",
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "#E74C3C",
                  }}
                />
                <Line
                  dataKey="skor"
                  name="Skor Rata-Rata"
                  stroke={chartColors.primary}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: chartColors.primary }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Faculty/prodi comparison — avg_ip dari endpoint grade-distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{ipData.length === 1 ? 'Rata-Rata IP' : `Rata-Rata Nilai per ${groupLabel}`}</CardTitle>
          <CardDescription>
              {ipData.length === 1
              ? 'Top/bottom mata kuliah berdasarkan rata-rata IP'
              : 'Diurutkan tertinggi · merah = di bawah 3.0'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ipLoading ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-neutral">
              Memuat data…
            </div>
          ) : ipData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-neutral">
              Tidak ada data untuk filter ini.
            </div>
          ) : (
            <EntityAwareChart
              items={ipData}
              color={chartColors.primary}
              domain={[2.7, 3.6]}
              referenceLine={{ value: 3.0, label: "Min. 3.0", color: chartColors.danger }}
              filter={filter}
              courseRankingMetric="avg_ip"
              courseRankingTitle="Rata-Rata IP"
              onDrill={onDrill}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}