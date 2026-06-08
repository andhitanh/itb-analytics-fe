import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RechartsTooltip } from '@/components/ui/recharts-tooltip';
import {
  STRATA_DIST, TEMPORAL_WISUDA, RESPONDEN_BY_FACULTY,
} from '@/features/dashboard/mocks/mockDataWisudawan';
import { chartColors, AXIS_STYLE } from '@/styles/chart-token';

export function RespondenOverviewSection() {
  return (
    <div className="flex flex-col gap-4">

      {/* Baris 1: Pie strata + Line tren */}
      <div className="grid grid-cols-[320px_1fr] gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Responden per Strata</CardTitle>
            <CardDescription>Periode wisuda 2024-Oktober</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-5">
              <PieChart width={150} height={150}>
                <Pie data={STRATA_DIST} cx={70} cy={70} innerRadius={42} outerRadius={68}
                  dataKey="value" startAngle={90} endAngle={-270}>
                  {STRATA_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
              <div className="flex flex-col gap-2">
                {STRATA_DIST.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[12.5px] text-text-mid font-medium">{d.name}</span>
                    <span className="text-[13px] font-bold text-text-dark ml-auto pl-4">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tren Kepuasan 6 Periode Wisuda Terakhir</CardTitle>
            <CardDescription>Rata-rata skor kepuasan per domain — skala 4.0</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={TEMPORAL_WISUDA} margin={{ top: 4, right: 12, bottom: 0, left: -14 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" />
                <XAxis dataKey="semester" tick={AXIS_STYLE} />
                <YAxis domain={[3.0, 4.0]} tick={AXIS_STYLE} tickFormatter={v => v.toFixed(1)} />
                <Tooltip content={<RechartsTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="kepuasanUmum" name="Kepuasan Umum"    stroke={chartColors.primary} strokeWidth={2.5} dot={{ r: 3 }} />
                <Line dataKey="fasilitas"    name="Fasilitas"         stroke={chartColors.mid}     strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                <Line dataKey="prodi"        name="Layanan Prodi"     stroke={chartColors.light}   strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
                <Line dataKey="softskill"    name="Pengembangan Diri" stroke={chartColors.purple}  strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Baris 2: Bar responden per fakultas */}
      <Card>
        <CardHeader>
          <CardTitle>Jumlah Responden per Fakultas</CardTitle>
          <CardDescription>Periode 2024-Oktober</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={RESPONDEN_BY_FACULTY} layout="vertical" margin={{ top: 0, right: 44, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
              <XAxis type="number" tick={AXIS_STYLE} />
              <YAxis type="category" dataKey="faculty" tick={AXIS_STYLE} width={42} />
              <Tooltip />
              <Bar dataKey="count" name="Responden" fill={chartColors.primary}
                radius={[0, 4, 4, 0]} maxBarSize={16}
                label={{ position: 'right', formatter: (v: any) => v, fontSize: 10, fill: '#4B5B7A' }} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}