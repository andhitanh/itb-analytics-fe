import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatCard }           from '@/components/ui/stat-card';
import { HBarChart }          from '@/features/dashboard/components/charts/HBarChart';
import { deriveProdiGroup }   from '@/features/dashboard/utils/grouping';
import {
  PRODI_AVG_OVERALL, PRODI_PERWALIAN_AVG,
  PRODI_PERKULIAHAN_AVG, PRODI_LAPKERJA_AVG,
  PRODI_ITB_AVG, REKO_DIST,
} from '@/features/dashboard/mocks/mockDataWisudawan';
import { chartColors, AXIS_STYLE } from '@/styles/chart-token';
import type { WisudawanFilter } from '@/features/dashboard/types';

const GROUP_COLOR: Record<string, string> = {
  perwalian:   chartColors.primary,
  perkuliahan: chartColors.mid,
  karir:       chartColors.warning,
  kepuasan:    chartColors.success,
};

interface ProdiDetailSectionProps {
  filter: WisudawanFilter;
}

export function ProdiDetailSection({ filter }: ProdiDetailSectionProps) {
  const facultyData = deriveProdiGroup(filter);

  return (
    <div className="flex flex-col gap-4">
      {/* Baris 1: Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Skor Layanan Prodi"   value={PRODI_AVG_OVERALL.toFixed(2)}       sub="Rata-rata 12 item" valueClassName="text-primary" />
        <StatCard label="Layanan Perwalian"    value={PRODI_PERWALIAN_AVG.toFixed(2)}     sub="Rata-rata P01–P02"  valueClassName="text-mid" />
        <StatCard label="Kualitas Perkuliahan" value={PRODI_PERKULIAHAN_AVG.toFixed(2)}   sub="Rata-rata P03–P09"  valueClassName="text-light" />
        <StatCard label="Info Lapangan Kerja"  value={PRODI_LAPKERJA_AVG.toFixed(2)}      sub="P10 — Prodi jelaskan karir" valueClassName="text-warning" />
      </div>

      {/* Baris 2: Item chart + Faculty chart */}
      <div className="grid grid-cols-2 gap-4">
        {/* Item chart dengan per-group coloring */}
        <Card>
          <CardHeader>
            <CardTitle>Rata-Rata Skor Layanan Program Studi per Item</CardTitle>
            <CardDescription>Diurutkan dari terendah ke tertinggi — 2024-Oktober</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={PRODI_ITB_AVG}
                layout="vertical"
                margin={{ top: 0, right: 50, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
                <XAxis type="number" domain={[2.7, 4.0]} tick={AXIS_STYLE}
                  tickFormatter={v => typeof v === 'number' ? v.toFixed(1) : v} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: '#9BAAC4' }} width={175} />
                <Tooltip formatter={(v: any) => typeof v === 'number' ? v.toFixed(2) : v} />
                <Bar dataKey="avg" name="Skor rata-rata" radius={[0, 4, 4, 0]} maxBarSize={16}
                  label={{ position:'right', formatter:(v: any) => typeof v === 'number' ? v.toFixed(2) : '', fontSize:10, fill:'#4B5B7A' }}>
                  {PRODI_ITB_AVG.map(d => (
                    <Cell key={d.key} fill={GROUP_COLOR[d.group] ?? chartColors.neutral} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-3 flex-wrap">
              {Object.entries(GROUP_COLOR).map(([g, c]) => (
                <div key={g} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: c }} />
                  <span className="text-[11px] text-neutral capitalize">{g}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Faculty comparison */}
        <Card>
          <CardHeader>
            <CardTitle>
              Rata-Rata Skor Layanan Prodi per {filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas'}
            </CardTitle>
            <CardDescription>Diurutkan terendah ke tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart
              data={facultyData}
              color={chartColors.primary}
              domain={[2.8, 3.9]}
              sortOrder="asc"
            />
          </CardContent>
        </Card>
      </div>

      {/* Baris 3: Rekomendasi stacked bar */}
      <Card>
        <CardHeader>
          <CardTitle>Alasan Merekomendasikan ITB kepada Orang Lain</CardTitle>
          <CardDescription>Distribusi alasan utama per fakultas — 2024-Oktober</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={REKO_DIST} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
              <XAxis type="number" tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="faculty" tick={AXIS_STYLE} width={42} />
              <Tooltip formatter={(v: any) => typeof v === 'number' ? `${v}%` : v} />
              <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="kualitasDosen"     name="Kualitas Dosen"      stackId="a" fill={chartColors.primary} maxBarSize={16} />
              <Bar dataKey="fasilitasAkademik" name="Fasilitas Akademik"  stackId="a" fill={chartColors.mid}     maxBarSize={16} />
              <Bar dataKey="suasanaAkademik"   name="Suasana Akademik"    stackId="a" fill={chartColors.light}   maxBarSize={16} />
              <Bar dataKey="lapanganKerja"     name="Lapangan Kerja"      stackId="a" fill={chartColors.warning} maxBarSize={16} />
              <Bar dataKey="jejaringAlumni"    name="Jejaring Alumni"     stackId="a" fill={chartColors.success} maxBarSize={16} />
              <Bar dataKey="notRekom"          name="Tidak Rekomen"       stackId="a" fill={chartColors.danger}  maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}