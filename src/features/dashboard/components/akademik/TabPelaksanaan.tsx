import {
  LineChart, Line, BarChart, Bar,
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
  CASE_METHOD, CASE_METHOD_TEMPORAL, GRADING_COMP,
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

function SubTabRancangan({ filter }: { filter: AkademikFilter }) {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Tren case method */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Penerapan Case Method & Team-Based Project</CardTitle>
            <CardDescription>Persentase bobot komponen penilaian inovatif lintas semester</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={CASE_METHOD_TEMPORAL} margin={{ top: 4, right: 12, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" />
                <XAxis dataKey="semester" tick={AXIS_STYLE} />
                <YAxis domain={[20, 50]} tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: any) => typeof v === 'number' ? `${v.toFixed(1)}%` : v} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="combined" name="Case + TBP"  stroke={chartColors.primary} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line dataKey="caseOnly" name="Case Method" stroke={chartColors.mid}     strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
                <Line dataKey="teamOnly" name="Team-Based"  stroke={chartColors.light}   strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Case method per fakultas */}
        <Card>
          <CardHeader>
            <CardTitle>Case Method + Team-Based Project per Fakultas</CardTitle>
            <CardDescription>Persentase bobot gabungan — diurutkan tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[...CASE_METHOD].sort((a, b) => b.combined - a.combined)} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
                <XAxis type="number" tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="faculty" tick={AXIS_STYLE} width={42} />
                <Tooltip formatter={(v: any) => typeof v === 'number' ? `${v}%` : v} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="caseMethod" name="Case Method" stackId="a" fill={chartColors.primary} maxBarSize={16} />
                <Bar dataKey="teamBased"  name="Team-Based"  stackId="a" fill={chartColors.mid}     maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Komposisi penilaian */}
        <Card>
          <CardHeader>
            <CardTitle>Komposisi Komponen Penilaian per Fakultas</CardTitle>
            <CardDescription>Persentase bobot setiap komponen</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={GRADING_COMP} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
                <XAxis type="number" tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="faculty" tick={AXIS_STYLE} width={42} />
                <Tooltip formatter={(v: any) => typeof v === 'number' ? `${v}%` : v} />
                <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                {[
                  { key:'UTS',       color: chartColors.primary },
                  { key:'UAS',       color: chartColors.mid     },
                  { key:'Tugas',     color: chartColors.light   },
                  { key:'Kuis',      color: chartColors.pale    },
                  { key:'Praktikum', color: chartColors.warning },
                  { key:'Other',     color: '#D1D9E0'           },
                ].map(({ key, color }) => (
                  <Bar key={key} dataKey={key} name={key} stackId="a" fill={color} maxBarSize={16} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Q8 — Beban kerja */}
        <Card>
          <CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q8 — Beban Kerja Sesuai SKS</p>
            <HBarChart
              data={deriveQScoreGroup(filter, user.activeRole.role, 7)}
              color={chartColors.warning}
              domain={[2.8, 3.5]}
              height={220}
            />
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