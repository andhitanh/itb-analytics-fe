import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { HBarChart } from "@/features/dashboard/components/shared-charts/HBarChart";
import { deriveFasilitasGroup } from "@/features/dashboard/utils/grouping";
import {
  KEPUASAN_KESELURUHAN_AVG,
  FASILITAS_RUANGAN_AVG,
  FASILITAS_DIGITAL_AVG,
  FASILITAS_PENUNJANG_AVG,
  FASILITAS_ITB_AVG,
} from "@/features/dashboard/mocks/mockDataWisudawan";
import { chartColors, AXIS_STYLE } from "@/styles/chart-token";
import type { WisudawanFilter } from "@/features/dashboard/types";

// Warna per group item
const GROUP_COLOR: Record<string, string> = {
  ruangan: chartColors.primary,
  digital: chartColors.mid,
  penunjang: chartColors.warning,
};

interface FasilitasDetailSectionProps {
  filter: WisudawanFilter;
}

export function FasilitasDetailSection({
  filter,
}: FasilitasDetailSectionProps) {
  const facultyData = deriveFasilitasGroup(filter);
  const lowestItem = FASILITAS_ITB_AVG[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Baris 1: 5 stat cards */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard
          label="Kepuasan Keseluruhan"
          value={KEPUASAN_KESELURUHAN_AVG.toFixed(2)}
          sub="Q12 — Puas dengan pendidikan ITB"
          valueClassName="text-primary"
        />
        <StatCard
          label="Fasilitas Ruangan"
          value={FASILITAS_RUANGAN_AVG.toFixed(2)}
          sub="Rata-rata Q1–Q3 (kelas + lab)"
          valueClassName="text-mid"
        />
        <StatCard
          label="Akses Digital"
          value={FASILITAS_DIGITAL_AVG.toFixed(2)}
          sub="Q4, Q6, Q7 (internet, pustaka)"
          valueClassName="text-light"
        />
        <StatCard
          label="Fasilitas Penunjang"
          value={FASILITAS_PENUNJANG_AVG.toFixed(2)}
          sub="Q5, Q8–Q11 (toilet, kantin)"
          valueClassName="text-warning"
        />
        <div className="bg-surface rounded-xl border-[1.5px] border-score-low-bg px-5 py-4">
          <p className="text-[11px] font-semibold text-neutral uppercase tracking-wide mb-0.5">
            Skor Terendah
          </p>
          <p className="text-[18px] font-extrabold text-danger leading-none mb-1">
            {lowestItem.avg.toFixed(2)}
          </p>
          <p className="text-[11.5px] text-text-mid font-medium">
            {lowestItem.label}
          </p>
        </div>
      </div>

      {/* Baris 2: Item chart + Faculty chart */}
      <div className="grid grid-cols-2 gap-4">
        {/* Item chart — pakai Recharts langsung karena butuh per-bar coloring */}
        <Card>
          <CardHeader>
            <CardTitle>Rata-Rata Skor Fasilitas ITB per Item</CardTitle>
            <CardDescription>
              Diurutkan dari terendah ke tertinggi — 2024-Oktober
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={FASILITAS_ITB_AVG}
                layout="vertical"
                margin={{ top: 0, right: 50, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F0F2F7"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[2.4, 4.0]}
                  tick={AXIS_STYLE}
                  tickFormatter={(v) =>
                    typeof v === "number" ? v.toFixed(1) : v
                  }
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#9BAAC4" }}
                  width={160}
                />
                <Tooltip
                  formatter={(v: any) =>
                    typeof v === "number" ? v.toFixed(2) : v
                  }
                />
                <ReferenceLine
                  x={3.0}
                  stroke={chartColors.danger}
                  strokeDasharray="4 3"
                  strokeWidth={1}
                />
                <Bar
                  dataKey="avg"
                  name="Skor rata-rata"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={16}
                  label={{
                    position: "right",
                    formatter: (v: any) =>
                      typeof v === "number" ? v.toFixed(2) : "",
                    fontSize: 10,
                    fill: "#4B5B7A",
                  }}
                >
                  {FASILITAS_ITB_AVG.map((d) => (
                    <Cell
                      key={d.key}
                      fill={GROUP_COLOR[d.group] ?? chartColors.light}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Group legend */}
            <div className="flex gap-4 mt-3 flex-wrap">
              {[
                { label: "Ruangan (Q1–Q3)", color: chartColors.primary },
                {
                  label: "Digital & Pustaka (Q4,Q6,Q7)",
                  color: chartColors.mid,
                },
                { label: "Penunjang (Q5,Q8–Q11)", color: chartColors.warning },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-[3px]"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-[11px] text-neutral">{l.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Faculty chart — pakai HBarChart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Rata-Rata Skor Fasilitas per{" "}
              {filter.fakultas !== "semua" ? "Prodi" : "Fakultas"}
            </CardTitle>
            <CardDescription>
              Diurutkan terendah ke tertinggi — rata-rata 11 item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart
              data={facultyData}
              color={chartColors.mid}
              domain={[2.8, 3.8]}
              sortOrder="asc"
              referenceLine={{
                value: 3.0,
                label: "Min. 3.0",
                color: chartColors.danger,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
