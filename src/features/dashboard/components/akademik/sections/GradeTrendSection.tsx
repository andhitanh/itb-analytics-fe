import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
import { TrendBadge } from "@/components/ui/domain-badges";
import { RechartsTooltip } from "@/components/ui/recharts-tooltip";
import { HBarChart } from "@/features/dashboard/components/shared-charts/HBarChart";
import { deriveGradeGroup } from "@/features/dashboard/utils/grouping";
import { TEMPORAL_GRADE } from "@/features/dashboard/mocks/mockData";
import { chartColors, AXIS_STYLE } from "@/styles/chart-token";
import { useUser } from "@/context/UserContext";
import type { AkademikFilter } from "@/features/dashboard/types";

const GRADE_LINES = [
  {
    key: "itb",
    name: "ITB",
    color: chartColors.primary,
    width: 2.5,
    dash: undefined,
  },
  {
    key: "sbm",
    name: "SBM",
    color: chartColors.success,
    width: 1.5,
    dash: "5 3",
  },
  {
    key: "fsrd",
    name: "FSRD",
    color: chartColors.warning,
    width: 1.5,
    dash: "5 3",
  },
  {
    key: "stei",
    name: "STEI",
    color: chartColors.mid,
    width: 1.5,
    dash: "4 4",
  },
  {
    key: "fmipa",
    name: "FMIPA",
    color: chartColors.light,
    width: 1.5,
    dash: "4 4",
  },
  {
    key: "fttm",
    name: "FTTM",
    color: chartColors.danger,
    width: 1.5,
    dash: "3 3",
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface GradeTrendSectionProps {
  filter: AkademikFilter;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GradeTrendSection({ filter }: GradeTrendSectionProps) {
  const { user } = useUser();
  const gradeGroupData = deriveGradeGroup(filter, user.activeRole);

  const latest = TEMPORAL_GRADE[TEMPORAL_GRADE.length - 1];
  const prev = TEMPORAL_GRADE[TEMPORAL_GRADE.length - 2];
  const delta = parseFloat((latest.itb - prev.itb).toFixed(2));
  const groupLabel = filter.fakultas !== "semua" ? "Prodi" : "Fakultas";

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Temporal trend — tidak terpengaruh grouping */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Rata-Rata Nilai Mahasiswa</CardTitle>
          <CardDescription>
            Perkembangan IP dari semester ke semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2.5 mb-1">
            <span className="text-[30px] font-extrabold text-text-dark leading-none">
              {latest.itb.toFixed(2)}
            </span>
            <span className="text-[14px] text-neutral">/ 4.00</span>
            <span
              className={`text-[12px] font-semibold px-2 py-0.5 rounded-md ${
                delta >= 0
                  ? "bg-score-high-bg text-score-high-text"
                  : "bg-score-low-bg text-score-low-text"
              }`}
            >
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)} vs semester
              lalu
            </span>
          </div>
          <p className="text-[11.5px] text-neutral mb-4">
            Rata-rata nilai akhir mahasiswa ITB (skala 4.0) — semester 2023/24-2
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={TEMPORAL_GRADE}
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
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
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
              {GRADE_LINES.map((l) => (
                <Line
                  key={l.key}
                  dataKey={l.key}
                  name={l.name}
                  stroke={l.color}
                  strokeWidth={l.width}
                  strokeDasharray={l.dash}
                  dot={l.key === "itb" ? { r: 3, fill: l.color } : false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Faculty/prodi comparison — terpengaruh filter + role */}
      <Card>
        <CardHeader>
          <CardTitle>Rata-Rata Nilai per {groupLabel}</CardTitle>
          <CardDescription>
            Diurutkan tertinggi · merah = di bawah 3.0
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HBarChart
            data={gradeGroupData}
            color={chartColors.primary}
            domain={[2.7, 3.6]}
            referenceLine={{
              value: 3.0,
              label: "Min. 3.0",
              color: chartColors.danger,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
