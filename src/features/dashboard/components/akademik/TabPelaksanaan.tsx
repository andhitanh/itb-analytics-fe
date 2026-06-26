import {
  LineChart, Line, BarChart, Bar, Cell, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendBadge }          from '@/components/ui/domain-badges';
import { RechartsTooltip }     from '@/components/ui/recharts-tooltip';
import { ProgressRankList }    from '@/features/dashboard/components/shared-layouts/ProgressRankList';
import { HBarChart }           from '@/features/dashboard/components/shared-charts/HBarChart';
import { AttendanceSection }   from '@/features/dashboard/components/akademik/sections/AttendanceSection';
import { deriveQScoreGroup }   from '@/features/dashboard/utils/grouping';
import {
  FACULTIES, LATEST_SCORES, getFacultyQScorePrev,
  TEMPORAL_AVG, GRADING_COMP, Q8_BY_SKS,
} from '@/features/dashboard/mocks/mockData';
import { chartColors, AXIS_STYLE } from '@/styles/chart-token';
import { useUser }             from '@/context/UserContext';
import type { AkademikFilter } from '@/features/dashboard/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TabPelaksanaanProps {
  filter: AkademikFilter;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeQGroupItems(
  filter:   AkademikFilter,
  qIndices: number[],
) {
  const faculties = filter.fakultas !== 'semua' ? [filter.fakultas] : FACULTIES;
  return faculties.map(f => {
    const curr = qIndices.reduce((s, qi) => s + LATEST_SCORES[f][qi], 0) / qIndices.length;
    const prev = qIndices.reduce((s, qi) => s + getFacultyQScorePrev(f, qi), 0) / qIndices.length;
    return {
      label: f,
      value: parseFloat(curr.toFixed(2)),
      badge: <TrendBadge trend={parseFloat((curr - prev).toFixed(2))} />,
    };
  }).sort((a, b) => b.value - a.value);
}

// ─── Sub-tab: Rancangan Pelaksanaan ───────────────────────────────────────────

const Q8_BAR_COLOR = (q8: number) => {
  if (q8 >= 3.5) return '#1D9E75';
  if (q8 >= 3.3) return '#185FA5';
  if (q8 >= 3.0) return '#EF9F27';
  return '#E24B4A';
};

const THRESHOLD_LABEL = {
  value: 'threshold 3.0',
  position: 'insideTopRight' as const,
  fontSize: 10,
  fill: '#E24B4A',
};

function SubTabRancangan({ filter }: { filter: AkademikFilter }) {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">

        {/* Tren Q8 per semester */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Q8 - Kesesuaian Beban Kerja Lintas Semester</CardTitle>
            <CardDescription>Rata-rata skor Q8 se-ITB · garis merah = threshold 3.0</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={TEMPORAL_AVG} margin={{ top: 8, right: 24, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" />
                <XAxis dataKey="semester" tick={AXIS_STYLE} />
                <YAxis domain={[2.8, 4.0]} tick={AXIS_STYLE} tickCount={7} />
                <Tooltip
                  content={<RechartsTooltip />}
                  formatter={(v: any) => typeof v === 'number' ? `${v.toFixed(2)} / 4.00` : v}
                />
                <ReferenceLine
                  y={3.0}
                  stroke="#E24B4A"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={THRESHOLD_LABEL}
                />
                <Line
                  dataKey="q8"
                  name="Q8 Beban Kerja"
                  stroke={chartColors.warning}
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Komposisi komponen penilaian per fakultas */}
        <Card>
          <CardHeader>
            <CardTitle>Komposisi Komponen Penilaian per Fakultas</CardTitle>
            <CardDescription>Rata-rata persentase bobot per jenis komponen</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={GRADING_COMP}
                layout="vertical"
                margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
                <XAxis type="number" tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="faculty" tick={AXIS_STYLE} width={42} />
                <Tooltip formatter={(v: any) => typeof v === 'number' ? `${v}%` : v} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                {([
                  { key: 'UTS',       color: chartColors.primary },
                  { key: 'UAS',       color: chartColors.mid     },
                  { key: 'Tugas',     color: chartColors.light   },
                  { key: 'Kuis',      color: chartColors.pale    },
                  { key: 'Praktikum', color: chartColors.warning },
                  { key: 'Other',     color: '#D1D9E0'           },
                ] as const).map(({ key, color }) => (
                  <Bar key={key} dataKey={key} name={key} stackId="a" fill={color} maxBarSize={16} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Q8 per fakultas — HBarChart */}
        <Card>
          <CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">
              Q8 — Kesesuaian Beban Kerja dengan SKS per {filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas'}
            </p>
            <HBarChart
              data={deriveQScoreGroup(filter, user.activeRole.role, 7)}
              color={chartColors.warning}
              domain={[2.8, 4.0]}
              height={220}
            />
          </CardContent>
        </Card>

        {/* Q8 × SKS bucket */}
        <Card>
          <CardHeader>
            <CardTitle>Q8 per Kelompok SKS</CardTitle>
            <CardDescription>
              Rata-rata skor Q8 berdasarkan besar SKS mata kuliah · semakin besar SKS, beban cenderung makin tidak proporsional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={Q8_BY_SKS}
                margin={{ top: 8, right: 24, bottom: 0, left: -16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" vertical={false} />
                <XAxis dataKey="sks" tick={AXIS_STYLE} />
                <YAxis domain={[2.8, 4.0]} tick={AXIS_STYLE} tickCount={7} />
                <Tooltip
                  formatter={(v: any) => typeof v === 'number' ? `${v.toFixed(2)} / 4.00` : v}
                  labelFormatter={(label) => {
                    const key = String(label);
                    const item = Q8_BY_SKS.find(d => d.sks === key);
                    return `${key} · ${item?.n?.toLocaleString() ?? ''} kelas`;
                  }}
                />
                <ReferenceLine
                  y={3.0}
                  stroke="#E24B4A"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={THRESHOLD_LABEL}
                />
                <Bar dataKey="q8" name="Q8" maxBarSize={64} radius={[4, 4, 0, 0]}>
                  {Q8_BY_SKS.map(d => (
                    <Cell key={d.sks} fill={Q8_BAR_COLOR(d.q8)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Sub-tab: Performa Dosen ───────────────────────────────────────────────────

function SubTabPerformaDosen({ filter }: { filter: AkademikFilter }) {
  const { user } = useUser();
  const q4q7Items = makeQGroupItems(filter, [3, 4, 5, 6]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rata-Rata Kehadiran Dosen per {filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas'}</CardTitle>
            <CardDescription>Diurutkan dari tertinggi — semester 2023/24-2</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceSection
              filter={filter}
              type="lecturer"
              avgLabel="Rata-rata kehadiran dosen se-ITB"
              color={chartColors.primary}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peringkat — Rata-Rata Q4–Q7 (Performa Dosen)</CardTitle>
            <CardDescription>Q4: Terorganisir · Q5: Komunikasi · Q6: Peduli · Q7: Adil</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressRankList items={q4q7Items} color={chartColors.mid} domain={[3.0, 4.0]} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-[12px] font-semibold text-text-dark mb-2">Q4 — Perkuliahan Terorganisir</p>
          <HBarChart data={deriveQScoreGroup(filter, user.activeRole.role, 3)} color={chartColors.primary} domain={[3.0, 4.0]} height={180} />
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-[12px] font-semibold text-text-dark mb-2">Q5 — Komunikasi Efektif</p>
          <HBarChart data={deriveQScoreGroup(filter, user.activeRole.role, 4)} color={chartColors.mid}     domain={[3.0, 4.0]} height={180} />
        </CardContent></Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-[12px] font-semibold text-text-dark mb-2">Q6 — Dosen Peduli Pencapaian</p>
          <HBarChart data={deriveQScoreGroup(filter, user.activeRole.role, 5)} color={chartColors.light}   domain={[3.0, 4.0]} height={180} />
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-[12px] font-semibold text-text-dark mb-2">Q7 — Dosen Berlaku Adil</p>
          <HBarChart data={deriveQScoreGroup(filter, user.activeRole.role, 6)} color={chartColors.primary} domain={[3.0, 4.0]} height={180} />
        </CardContent></Card>
      </div>
    </div>
  );
}

// ─── Sub-tab: Performa Mahasiswa ──────────────────────────────────────────────

function SubTabPerformaMahasiswa({ filter }: { filter: AkademikFilter }) {
  const { user } = useUser();
  const q11q12Items = makeQGroupItems(filter, [10, 11]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rata-Rata Kehadiran Mahasiswa per {filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas'}</CardTitle>
            <CardDescription>Diurutkan dari tertinggi — semester 2023/24-2</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceSection
              filter={filter}
              type="student"
              avgLabel="Rata-rata kehadiran mahasiswa se-ITB"
              color={chartColors.mid}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peringkat — Rata-Rata Q11–Q12 (Performa Mahasiswa)</CardTitle>
            <CardDescription>Q11: Mahasiswa berusaha sungguh-sungguh · Q12: Pengalaman positif</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressRankList items={q11q12Items} color={chartColors.light} domain={[3.0, 4.0]} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-[12px] font-semibold text-text-dark mb-2">Q11 — Mahasiswa Berusaha Sungguh-sungguh</p>
          <HBarChart data={deriveQScoreGroup(filter, user.activeRole.role, 10)} color={chartColors.mid}     domain={[3.0, 4.0]} height={180} />
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-[12px] font-semibold text-text-dark mb-2">Q12 — Pengalaman Belajar Positif</p>
          <HBarChart data={deriveQScoreGroup(filter, user.activeRole.role, 11)} color={chartColors.primary} domain={[3.0, 4.0]} height={180} />
        </CardContent></Card>
      </div>
    </div>
  );
}

// ─── Sub-tab: Sarana Prasarana ────────────────────────────────────────────────

function SubTabSarana({ filter }: { filter: AkademikFilter }) {
  const { user } = useUser();
  const q9q10Items = makeQGroupItems(filter, [8, 9]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Peringkat — Rata-Rata Q9–Q10 (Sarana Prasarana)</CardTitle>
          <CardDescription>Q9: Sarana prasarana memadai · Q10: Fasilitas pendukung di luar kuliah</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressRankList items={q9q10Items} color={chartColors.warning} domain={[3.0, 4.0]} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="pt-5">
          <p className="text-[12px] font-semibold text-text-dark mb-2">Q9 — Sarana Prasarana Memadai</p>
          <HBarChart data={deriveQScoreGroup(filter, user.activeRole.role, 8)} color={chartColors.warning} domain={[3.0, 4.0]} height={220} />
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-[12px] font-semibold text-text-dark mb-2">Q10 — Fasilitas Pendukung di Luar Kuliah</p>
          <HBarChart data={deriveQScoreGroup(filter, user.activeRole.role, 9)} color={chartColors.light}   domain={[3.0, 4.0]} height={220} />
        </CardContent></Card>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TabPelaksanaan({ filter }: TabPelaksanaanProps) {
  return (
    <Tabs defaultValue="rancangan">
      <TabsList className="mb-4">
        <TabsTrigger value="rancangan">Rancangan Pelaksanaan</TabsTrigger>
        <TabsTrigger value="dosen">Performa Dosen</TabsTrigger>
        <TabsTrigger value="mahasiswa">Performa Mahasiswa</TabsTrigger>
        <TabsTrigger value="sarana">Sarana Prasarana</TabsTrigger>
      </TabsList>
      <TabsContent value="rancangan"><SubTabRancangan         filter={filter} /></TabsContent>
      <TabsContent value="dosen">    <SubTabPerformaDosen     filter={filter} /></TabsContent>
      <TabsContent value="mahasiswa"><SubTabPerformaMahasiswa filter={filter} /></TabsContent>
      <TabsContent value="sarana">   <SubTabSarana            filter={filter} /></TabsContent>
    </Tabs>
  );
}