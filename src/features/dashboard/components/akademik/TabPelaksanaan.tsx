import {
  LineChart, Line, BarChart, Bar, Cell, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendBadge }          from '@/components/ui/domain-badges';
import { RechartsTooltip }     from '@/components/ui/recharts-tooltip';
import { ProgressRankList }    from '@/features/dashboard/components/shared-layouts/ProgressRankList';
import { EntityAwareChart }    from '@/features/dashboard/components/shared-charts/EntityAwareChart';
import { ChartState }          from '@/features/dashboard/components/shared-charts/ChartState';
import { GradingCompChart }    from '@/features/dashboard/components/akademik/sections/GradingCompChart';
import { AttendanceSection }   from '@/features/dashboard/components/akademik/sections/AttendanceSection';
import { CourseRankingSection } from '@/features/dashboard/components/akademik/sections/CourseRankingSection';
import { useSkorPertanyaan }      from '@/features/dashboard/hooks/useSkorPertanyaan';
import { useSkorPertanyaanGroup } from '@/features/dashboard/hooks/useSkorPertanyaanGroup';
import { useGradeTrend }          from '@/features/dashboard/hooks/useGradeTrend';
import { useGradingComp }         from '@/features/dashboard/hooks/useGradingComp';
import { useSkorBySks }           from '@/features/dashboard/hooks/useSkorBySks';
import { toHBarData, averageAcrossGroups } from '@/features/dashboard/utils/skorPertanyaan';
import { chartColors, AXIS_STYLE } from '@/styles/chart-token';
import { METRIC_Q8 } from '@/features/dashboard/constants/courseRankingMetrics';
import type { AkademikFilter } from '@/features/dashboard/types';
import { ChartInsightButton } from '@/features/dashboard/components/shared-charts/ChartInsightButton';
import { buildGradingCompChartContext } from '@/features/dashboard/components/shared-charts/gradingCompChartContext';
import { buildSkorBySksChartContext } from '@/features/dashboard/components/shared-charts/skorBySksChartContext';
import { buildEntityComparisonChartContext } from '@/features/dashboard/components/shared-charts/entityComparisonChartContext';

// ─── Props ────────────────────────────────────────────────────────────────────

interface TabPelaksanaanProps {
  filter:  AkademikFilter;
  onDrill: (kode: string) => void;
}

// ─── Sub-tab: Rancangan Pelaksanaan ───────────────────────────────────────────

const Q8_BAR_COLOR = (q8: number | null) => {
  if (q8 === null) return '#D1D9E0';
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

function SubTabRancangan({ filter, onDrill }: { filter: AkademikFilter; onDrill: (kode: string) => void }) {
  const { data: q8Data, isLoading: q8Loading } = useSkorPertanyaan(filter, 'q28');
  const q8ChartData = toHBarData(q8Data);

  const { data: trendData, isLoading: trendLoading } = useGradeTrend(filter);
  const q8TrendChartData = (trendData?.trend ?? []).map(p => ({
    semester: p.period_label,
    q8:       p.avg_skor_q28,
  }));

  const { data: gradingCompData, isLoading: gradingCompLoading } = useGradingComp(filter);

  const { data: skorBySksData, isLoading: skorBySksLoading } = useSkorBySks(filter);
  const skorBySksChartData = skorBySksData?.items ?? [];

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
            {trendLoading ? (
              <ChartState label="Memuat data…" />
            ) : q8TrendChartData.length === 0 ? (
              <ChartState label="Tidak ada data untuk filter ini." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={q8TrendChartData} margin={{ top: 8, right: 24, bottom: 0, left: -16 }}>
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
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Komposisi komponen penilaian per fakultas */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Komposisi Komponen Penilaian per {filter.fakultas.length > 0 ? 'Prodi' : 'Fakultas'}</CardTitle>
                <CardDescription>Rata-rata persentase bobot per jenis komponen</CardDescription>
              </div>
              {!gradingCompLoading && (gradingCompData?.items.length ?? 0) > 0 && (
                <ChartInsightButton
                  chartContext={buildGradingCompChartContext(
                    filter,
                    gradingCompData?.items ?? [],
                    gradingCompData?.granularity ?? 'fakultas',
                  )}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <GradingCompChart items={gradingCompData?.items ?? []} isLoading={gradingCompLoading} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Q8 per fakultas/prodi — collapse otomatis ke course-ranking */}
        <Card>
          <CardContent className="pt-5">
            {q8ChartData.length !== 1 && (
              <p className="text-[12px] font-semibold text-text-dark mb-2">
                Q8 — Kesesuaian Beban Kerja dengan SKS per {filter.fakultas.length > 0 ? 'Prodi' : 'Fakultas'}
              </p>
            )}
            {q8Loading ? (
              <ChartState label="Memuat data…" />
            ) : (
              <EntityAwareChart
                items={q8ChartData}
                color={chartColors.warning}
                domain={[2.8, 4.0]}
                height={300}
                filter={filter}
                courseRankingMetric={METRIC_Q8.metric}
                courseRankingTitle={METRIC_Q8.title}
                onDrill={onDrill}
              />
            )}
          </CardContent>
        </Card>

        {/* Q8 × SKS bucket */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Q8 per Kelompok SKS</CardTitle>
                <CardDescription>
                  Rata-rata skor Q8 berdasarkan besar SKS mata kuliah · semakin besar SKS, beban cenderung makin tidak proporsional
                </CardDescription>
              </div>
              {!skorBySksLoading && skorBySksChartData.length > 0 && (
                <ChartInsightButton chartContext={buildSkorBySksChartContext(filter, skorBySksChartData)} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {skorBySksLoading ? (
              <ChartState label="Memuat data…" />
            ) : skorBySksChartData.length === 0 ? (
              <ChartState label="Tidak ada data untuk filter ini." />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={skorBySksChartData}
                  margin={{ top: 8, right: 24, bottom: 0, left: -16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" vertical={false} />
                  <XAxis dataKey="sks_label" tick={AXIS_STYLE} />
                  <YAxis domain={[2.8, 4.0]} tick={AXIS_STYLE} tickCount={7} />
                  <Tooltip
                    formatter={(v: any) => typeof v === 'number' ? `${v.toFixed(2)} / 4.00` : 'Tidak ada data'}
                    labelFormatter={(label) => {
                      const item = skorBySksChartData.find(d => d.sks_label === label);
                      return `${label} · ${item?.jumlah_kelas?.toLocaleString('id') ?? ''} kelas`;
                    }}
                  />
                  <ReferenceLine
                    y={3.0}
                    stroke="#E24B4A"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                    label={THRESHOLD_LABEL}
                  />
                  <Bar dataKey="avg_skor_q8" name="Q8" maxBarSize={64} radius={[4, 4, 0, 0]}>
                    {skorBySksChartData.map(d => (
                      <Cell key={d.sks_label} fill={Q8_BAR_COLOR(d.avg_skor_q8)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Sub-tab: Performa Dosen ───────────────────────────────────────────────────

// Q4-Q7 saja (BUKAN grup backend 'pelaksanaan' yang mencakup Q4-Q8) —
// Q8 (beban kerja) sudah ditampilkan terpisah di SubTabRancangan, jadi
// sengaja dikeluarkan dari ranking "Performa Dosen" supaya semantiknya
// tidak bercampur dengan topik beban kerja.
const DOSEN_KODE_GRUP = ['q24', 'q25', 'q26', 'q27'] as const;

function SubTabPerformaDosen({ filter, onDrill }: { filter: AkademikFilter; onDrill: (kode: string) => void }) {
  const { data, isLoading } = useSkorPertanyaanGroup(filter, DOSEN_KODE_GRUP);
  const [q4Data, q5Data, q6Data, q7Data] = data ?? [null, null, null, null];
  const q4q7Raw = averageAcrossGroups(data ?? []).sort((a, b) => b.value - a.value);
  const q4q7Items = q4q7Raw.map(({ label, value, delta }) => ({
    label,
    value,
    badge: <TrendBadge trend={delta ?? 0} />,
  }));
  // Bentuk terpisah untuk chart_context (butuh kode+avg, bukan value+badge
  // yang dipakai ProgressRankList) -- averageAcrossGroups sudah mengembalikan
  // kode, cuma dibuang di q4q7Items karena tidak dipakai untuk tampilan.
  const q4q7GroupData = q4q7Raw.map(({ label, kode, value, delta }) => ({ label, kode, avg: value, delta }));

  return (
    <div className="flex flex-col gap-4">
      {/* Kehadiran + agregasi Q4-Q7: stacked (3-baris) HANYA mode
          Kaprodi/Kadep (1 entitas). Mode Direktorat/Dekan (>1 entitas)
          tetap side-by-side seperti semula. */}
      <div className={q4q7Items.length === 1 ? 'flex flex-col gap-4' : 'grid grid-cols-2 gap-4'}>
        <Card>
          <CardHeader>
            <CardTitle>Rata-Rata Kehadiran Dosen per {filter.fakultas.length > 0 ? 'Prodi' : 'Fakultas'}</CardTitle>
            {/* <CardDescription>Diurutkan dari tertinggi</CardDescription> */}
          </CardHeader>
          <CardContent>
            <AttendanceSection
              filter={filter}
              type="lecturer"
              avgLabel="Rata-rata kehadiran dosen"
              color={chartColors.primary}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>
                  {q4q7Items.length === 1 ? 'Rata-Rata Q4-Q7 — Performa Dosen' : 'Peringkat — Rata-Rata Q4–Q7 (Performa Dosen)'}
                </CardTitle>
                <CardDescription>
                  {q4q7Items.length === 1 ? 'Top/bottom mata kuliah berdasarkan skor ini' : 'Q4: Terorganisir · Q5: Komunikasi · Q6: Peduli · Q7: Adil'}
                </CardDescription>
              </div>
              {q4q7Items.length > 1 && !isLoading && (
                <ChartInsightButton
                  chartContext={buildEntityComparisonChartContext('q4_q7', 'Peringkat — Rata-Rata Q4–Q7 (Performa Dosen)', q4q7GroupData, filter)}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {q4q7Items.length === 1 ? (
              <CourseRankingSection filter={filter} metric="q4_q7" title="Rata-Rata Q4-Q7 — Performa Dosen" />
            ) : isLoading ? (
              <ChartState label="Memuat data…" />
            ) : q4q7Items.length === 0 ? (
              <ChartState label="Tidak ada data untuk filter ini." />
            ) : (
              <ProgressRankList items={q4q7Items} color={chartColors.mid} domain={[3.0, 4.0]} showRank={q4q7Items.length > 1} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Q4-Q7 individual. Mode Kaprodi/Kadep (1 entitas → kartu
          Bottom5/Top5) dulu dipaksa 2x(grid-cols-2) = 4 kartu 2 kolom
          masing-masing pecah lagi jadi 2 sub-kolom → sempit. Ganti Tabs. */}
      {q4q7Items.length === 1 ? (
        <Tabs defaultValue="q24">
          <TabsList className="w-full h-auto p-1">
            <TabsTrigger value="q24" className="flex-1 py-1.5">Q4 — Terorganisir</TabsTrigger>
            <TabsTrigger value="q25" className="flex-1 py-1.5">Q5 — Komunikasi</TabsTrigger>
            <TabsTrigger value="q26" className="flex-1 py-1.5">Q6 — Peduli</TabsTrigger>
            <TabsTrigger value="q27" className="flex-1 py-1.5">Q7 — Adil</TabsTrigger>
          </TabsList>
          <TabsContent value="q24">
            <EntityAwareChart
              items={toHBarData(q4Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q24" courseRankingTitle="Q4 — Perkuliahan Terorganisir"
              onDrill={onDrill}
            />
          </TabsContent>
          <TabsContent value="q25">
            <EntityAwareChart
              items={toHBarData(q5Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q25" courseRankingTitle="Q5 — Komunikasi Efektif"
              onDrill={onDrill}
            />
          </TabsContent>
          <TabsContent value="q26">
            <EntityAwareChart
              items={toHBarData(q6Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q26" courseRankingTitle="Q6 — Dosen Peduli Pencapaian"
              onDrill={onDrill}
            />
          </TabsContent>
          <TabsContent value="q27">
            <EntityAwareChart
              items={toHBarData(q7Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q27" courseRankingTitle="Q7 — Dosen Berlaku Adil"
              onDrill={onDrill}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card><CardContent className="pt-5">
              <p className="text-[12px] font-semibold text-text-dark mb-2">Q4 — Perkuliahan Terorganisir</p>
              <EntityAwareChart
                items={toHBarData(q4Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
                filter={filter} courseRankingMetric="q24" courseRankingTitle="Q4 — Perkuliahan Terorganisir"
                onDrill={onDrill}
              />
            </CardContent></Card>
            <Card><CardContent className="pt-5">
              <p className="text-[12px] font-semibold text-text-dark mb-2">Q5 — Komunikasi Efektif</p>
              <EntityAwareChart
                items={toHBarData(q5Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
                filter={filter} courseRankingMetric="q25" courseRankingTitle="Q5 — Komunikasi Efektif"
                onDrill={onDrill}
              />
            </CardContent></Card>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card><CardContent className="pt-5">
              <p className="text-[12px] font-semibold text-text-dark mb-2">Q6 — Dosen Peduli Pencapaian</p>
              <EntityAwareChart
                items={toHBarData(q6Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
                filter={filter} courseRankingMetric="q26" courseRankingTitle="Q6 — Dosen Peduli Pencapaian"
                onDrill={onDrill}
              />
            </CardContent></Card>
            <Card><CardContent className="pt-5">
              <p className="text-[12px] font-semibold text-text-dark mb-2">Q7 — Dosen Berlaku Adil</p>
              <EntityAwareChart
                items={toHBarData(q7Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
                filter={filter} courseRankingMetric="q27" courseRankingTitle="Q7 — Dosen Berlaku Adil"
                onDrill={onDrill}
              />
            </CardContent></Card>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sub-tab: Performa Mahasiswa ──────────────────────────────────────────────

// q35=Q11, q37=Q12 untuk chart individual; 'perilaku_mahasiswa' adalah
// grup backend precomputed (Q11-Q12) — dipakai langsung untuk ranking,
// bukan dihitung ulang dari q35/q37 manual (backend lebih otoritatif).
const MAHASISWA_KODE_GRUP = ['q35', 'q37', 'perilaku_mahasiswa'] as const;

function SubTabPerformaMahasiswa({ filter, onDrill }: { filter: AkademikFilter; onDrill: (kode: string) => void }) {
  const { data, isLoading } = useSkorPertanyaanGroup(filter, MAHASISWA_KODE_GRUP);
  const [q11Data, q12Data, perilakuData] = data ?? [null, null, null];

  const q11q12Items = (perilakuData?.items ?? [])
    .filter(item => item.skor !== null)
    .map(item => ({
      label: perilakuData?.granularity === 'fakultas' ? item.kode : item.label,
      value: item.skor as number,
      badge: (
        <TrendBadge
          trend={item.prev_skor !== null ? parseFloat((item.skor! - item.prev_skor).toFixed(2)) : 0}
        />
      ),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-4">
      {/* Kehadiran + agregasi Q11-Q12: stacked (3-baris) HANYA mode
          Kaprodi/Kadep (1 entitas). Mode Direktorat/Dekan (>1 entitas)
          tetap side-by-side seperti semula. */}
      <div className={q11q12Items.length === 1 ? 'flex flex-col gap-4' : 'grid grid-cols-2 gap-4'}>
        <Card>
          <CardHeader>
            <CardTitle>Rata-Rata Kehadiran Mahasiswa per {filter.fakultas.length > 0 ? 'Prodi' : 'Fakultas'}</CardTitle>
            {/* <CardDescription>Diurutkan dari tertinggi</CardDescription> */}
          </CardHeader>
          <CardContent>
            <AttendanceSection
              filter={filter}
              type="student"
              avgLabel="Rata-rata kehadiran mahasiswa"
              color={chartColors.mid}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>
                 {q11q12Items.length === 1 ? 'Rata-Rata Q11-Q12 — Performa Mahasiswa' : 'Peringkat — Rata-Rata Q11–Q12 (Performa Mahasiswa)'}
                </CardTitle>
                <CardDescription>
                  {q11q12Items.length === 1 ? 'Top/bottom mata kuliah berdasarkan skor ini' : 'Q11: Mahasiswa berusaha sungguh-sungguh · Q12: Pengalaman positif'}
                </CardDescription>
              </div>
              {q11q12Items.length > 1 && !isLoading && (
                <ChartInsightButton
                  chartContext={buildEntityComparisonChartContext('perilaku_mahasiswa', 'Peringkat — Rata-Rata Q11–Q12 (Performa Mahasiswa)', toHBarData(perilakuData), filter)}
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {q11q12Items.length === 1 ? (
              <CourseRankingSection filter={filter} metric="perilaku_mahasiswa" title="Rata-Rata Q11-Q12 — Performa Mahasiswa" />
            ) : isLoading ? (
              <ChartState label="Memuat data…" />
            ) : q11q12Items.length === 0 ? (
              <ChartState label="Tidak ada data untuk filter ini." />
            ) : (
              <ProgressRankList items={q11q12Items} color={chartColors.light} domain={[3.0, 4.0]} showRank={q11q12Items.length > 1} />
            )}
          </CardContent>
        </Card>
      </div>

      {q11q12Items.length === 1 ? (
        <Tabs defaultValue="q35">
          <TabsList className="w-full h-auto p-1">
            <TabsTrigger value="q35" className="flex-1 py-1.5">Q11 — Berusaha Sungguh-sungguh</TabsTrigger>
            <TabsTrigger value="q37" className="flex-1 py-1.5">Q12 — Pengalaman Positif</TabsTrigger>
          </TabsList>
          <TabsContent value="q35">
            <EntityAwareChart
              items={toHBarData(q11Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q35" courseRankingTitle="Q11 — Mahasiswa Berusaha Sungguh-Sungguh"
              onDrill={onDrill}
            />
          </TabsContent>
          <TabsContent value="q37">
            <EntityAwareChart
              items={toHBarData(q12Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q37" courseRankingTitle="Q12 — Pengalaman Belajar Positif"
              onDrill={onDrill}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Card><CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q11 — Mahasiswa Berusaha Sungguh-sungguh</p>
            <EntityAwareChart
              items={toHBarData(q11Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q35" courseRankingTitle="Q11 — Mahasiswa Berusaha Sungguh-Sungguh"
              onDrill={onDrill}
            />
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q12 — Pengalaman Belajar Positif</p>
            <EntityAwareChart
              items={toHBarData(q12Data)} color={chartColors.primary} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q37" courseRankingTitle="Q12 — Pengalaman Belajar Positif"
              onDrill={onDrill}
            />
          </CardContent></Card>
        </div>
      )}
    </div>
  );
}

// ─── Sub-tab: Sarana Prasarana ────────────────────────────────────────────────

// q29=Q9, q30=Q10 untuk chart individual; 'sarana_prasarana' adalah
// grup backend precomputed (Q9-Q10), dipakai langsung untuk ranking.
const SARANA_KODE_GRUP = ['q29', 'q30', 'sarana_prasarana'] as const;

function SubTabSarana({ filter, onDrill }: { filter: AkademikFilter; onDrill: (kode: string) => void }) {
  const { data, isLoading } = useSkorPertanyaanGroup(filter, SARANA_KODE_GRUP);
  const [q9Data, q10Data, saranaData] = data ?? [null, null, null];

  const q9q10Items = (saranaData?.items ?? [])
    .filter(item => item.skor !== null)
    .map(item => ({
      label: saranaData?.granularity === 'fakultas' ? item.kode : item.label,
      value: item.skor as number,
      badge: (
        <TrendBadge
          trend={item.prev_skor !== null ? parseFloat((item.skor! - item.prev_skor).toFixed(2)) : 0}
        />
      ),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>
                {q9q10Items.length === 1 ? 'Rata-Rata Q9-Q10 — Sarana Prasarana' : 'Peringkat — Rata-Rata Q9–Q10 (Sarana Prasarana)'}
              </CardTitle>
              <CardDescription>
                {q9q10Items.length === 1 ? 'Top/bottom mata kuliah berdasarkan skor ini' : 'Q9: Sarana prasarana memadai · Q10: Fasilitas pendukung di luar kuliah'}
              </CardDescription>
            </div>
            {q9q10Items.length > 1 && !isLoading && (
              <ChartInsightButton
                chartContext={buildEntityComparisonChartContext('sarana_prasarana', 'Peringkat — Rata-Rata Q9–Q10 (Sarana Prasarana)', toHBarData(saranaData), filter)}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {q9q10Items.length === 1 ? (
            <CourseRankingSection filter={filter} metric="sarana_prasarana" title="Rata-Rata Q9-Q10 — Sarana Prasarana" />
          ) : isLoading ? (
            <ChartState label="Memuat data…" />
          ) : q9q10Items.length === 0 ? (
            <ChartState label="Tidak ada data untuk filter ini." />
          ) : (
            <ProgressRankList items={q9q10Items} color={chartColors.warning} domain={[3.0, 4.0]} showRank={q9q10Items.length > 1} />
          )}
        </CardContent>
      </Card>

      {q9q10Items.length === 1 ? (
        <Tabs defaultValue="q29">
          <TabsList className="w-full h-auto p-1">
            <TabsTrigger value="q29" className="flex-1 py-1.5">Q9 — Sarana Memadai</TabsTrigger>
            <TabsTrigger value="q30" className="flex-1 py-1.5">Q10 — Fasilitas Pendukung</TabsTrigger>
          </TabsList>
          <TabsContent value="q29">
            <EntityAwareChart
              items={toHBarData(q9Data)} color={chartColors.warning} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q29" courseRankingTitle="Q9 — Sarana Prasarana Memadai"
              onDrill={onDrill}
            />
          </TabsContent>
          <TabsContent value="q30">
            <EntityAwareChart
              items={toHBarData(q10Data)} color={chartColors.light} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q30" courseRankingTitle="Q10 — Fasilitas Pendukung di Luar Kuliah"
              onDrill={onDrill}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Card><CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q9 — Sarana Prasarana Memadai</p>
            <EntityAwareChart
              items={toHBarData(q9Data)} color={chartColors.warning} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q29" courseRankingTitle="Q9 — Sarana Prasarana Memadai"
              onDrill={onDrill}
            />
          </CardContent></Card>
          <Card><CardContent className="pt-5">
            <p className="text-[12px] font-semibold text-text-dark mb-2">Q10 — Fasilitas Pendukung di Luar Kuliah</p>
            <EntityAwareChart
              items={toHBarData(q10Data)} color={chartColors.light} domain={[3.0, 4.0]} height={300}
              filter={filter} courseRankingMetric="q30" courseRankingTitle="Q10 — Fasilitas Pendukung di Luar Kuliah"
              onDrill={onDrill}
            />
          </CardContent></Card>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TabPelaksanaan({ filter, onDrill }: TabPelaksanaanProps) {
  return (
    <Tabs defaultValue="rancangan">
      <TabsList className="mb-4">
        <TabsTrigger value="rancangan">Rancangan Pelaksanaan</TabsTrigger>
        <TabsTrigger value="dosen">Performa Dosen</TabsTrigger>
        <TabsTrigger value="mahasiswa">Performa Mahasiswa</TabsTrigger>
        <TabsTrigger value="sarana">Sarana Prasarana</TabsTrigger>
      </TabsList>
      <TabsContent value="rancangan"><SubTabRancangan         filter={filter} onDrill={onDrill} /></TabsContent>
      <TabsContent value="dosen">    <SubTabPerformaDosen     filter={filter} onDrill={onDrill} /></TabsContent>
      <TabsContent value="mahasiswa"><SubTabPerformaMahasiswa filter={filter} onDrill={onDrill} /></TabsContent>
      <TabsContent value="sarana">   <SubTabSarana            filter={filter} onDrill={onDrill} /></TabsContent>
    </Tabs>
  );
}