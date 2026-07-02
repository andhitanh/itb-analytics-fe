import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AXIS_STYLE } from '@/styles/chart-token';
import { useGradeDistribution } from '@/features/dashboard/hooks/useGradeDistribution';
import type { GradeDistItem } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const GRADE_COLORS: Record<string, string> = {
  A: '#003366', AB: '#1A6AB5', B: '#4CA3DD', BC: '#7CBCE8',
  C: '#B3DBEF', D: '#F5C842', E: '#E74C3C',
};

const GRADE_FIELD_MAP = {
  A:  'dist_pct_a',
  AB: 'dist_pct_ab',
  B:  'dist_pct_b',
  BC: 'dist_pct_bc',
  C:  'dist_pct_c',
  D:  'dist_pct_d',
  E:  'dist_pct_e',
} as const satisfies Record<string, keyof GradeDistItem>;

type GradeKey = keyof typeof GRADE_FIELD_MAP;

// ─── Aggregation helper ─────────────────────────────────────────────────────

/**
 * Rata-rata tertimbang berdasarkan total_mahasiswa per item.
 * Kalau items cuma 1 (kaprodi/dekan dengan scope tunggal), hasilnya otomatis
 * sama dengan nilai item itu sendiri — tidak perlu percabangan terpisah.
 * Item dengan total_mahasiswa = 0 tidak ikut menggeser rata-rata.
 */
function weightedAvg(
  items: GradeDistItem[],
  field: keyof GradeDistItem,
): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const item of items) {
    const value = item[field];
    if (value === null || item.total_mahasiswa === 0) continue;
    weightedSum += (value as number) * item.total_mahasiswa;
    totalWeight += item.total_mahasiswa;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GradePie({ items }: { items: GradeDistItem[] }) {
  // dist_pct_lulus_a_c sudah dihitung backend — pakai langsung, jangan
  // jumlahkan A+AB+B+BC+C manual di sini (duplikasi logic yang rawan salah).
  const acTotal = Math.round(weightedAvg(items, 'dist_pct_lulus_a_c'));
  const deTotal = 100 - acTotal; // sisa: D, E, T (tidak hadir) tergabung

  const pieData = [
    { name: 'Lulus (A–C)', value: acTotal, color: '#003366' },
    { name: 'Belum Lulus', value: deTotal, color: '#E74C3C' },
  ];

  const gradeEntries = (Object.keys(GRADE_FIELD_MAP) as GradeKey[]).map(g => ({
    grade: g,
    pct:   Math.round(weightedAvg(items, GRADE_FIELD_MAP[g])),
  }));

  return (
    <div className="flex items-center gap-5">
      <PieChart width={150} height={150}>
        <Pie data={pieData} cx={70} cy={70} innerRadius={45} outerRadius={70} dataKey="value" startAngle={90} endAngle={-270}>
          {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <text x={75} y={65} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 18, fontWeight: 700, fill: '#1A2B4A' }}>{acTotal}%</text>
        <text x={75} y={83} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 10, fill: '#9BAAC4' }}>Lulus</text>
      </PieChart>
      <div>
        <p className="text-[11px] text-neutral font-semibold mb-2 uppercase tracking-wide">Sebaran Nilai ITB</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {gradeEntries.map(({ grade, pct }) => (
            <div key={grade} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: GRADE_COLORS[grade] }} />
              <span className="text-[12px] text-text-mid font-medium">{grade}</span>
              <span className="text-[12px] font-bold text-text-dark ml-auto">{pct}%</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 pt-2 border-t border-border">
          <p className="text-[11px] text-neutral">
            Lulus A–C: <b className="text-primary">{acTotal}%</b>
            &nbsp;|&nbsp;
            Belum lulus: <b className="text-danger">{deTotal}%</b>
          </p>
        </div>
      </div>
    </div>
  );
}

function GradeStackedBar({ items, granularity }: { items: GradeDistItem[]; granularity: 'fakultas' | 'prodi' }) {
  // kode hanya berupa singkatan yang enak dibaca di level fakultas (mis. "STEI").
  // Di level prodi, kode = str(no_ps) — ID numerik, bukan singkatan — jadi
  // label (nama lengkap prodi) yang dipakai supaya tidak menampilkan angka mentah.
  const chartData = items.map(item => ({
    faculty: granularity === 'fakultas' ? item.kode : item.label,
    A:  item.dist_pct_a  ?? 0,
    AB: item.dist_pct_ab ?? 0,
    B:  item.dist_pct_b  ?? 0,
    BC: item.dist_pct_bc ?? 0,
    C:  item.dist_pct_c  ?? 0,
    D:  item.dist_pct_d  ?? 0,
    E:  item.dist_pct_e  ?? 0,
  }));

  if (chartData.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center text-[12px] text-neutral">
        Tidak ada data untuk filter ini.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
        <XAxis type="number" tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="faculty" tick={AXIS_STYLE} width={granularity === 'fakultas' ? 42 : 140} />
        <Tooltip formatter={(v: any) => typeof v === 'number' ? `${v}%` : v} />
        <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
        {(['A','AB','B','BC','C','D','E'] as const).map(g => (
          <Bar key={g} dataKey={g} name={g} stackId="a" fill={GRADE_COLORS[g]} maxBarSize={18} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GradeDistributionSectionProps {
  filter: AkademikFilter;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GradeDistributionSection({ filter }: GradeDistributionSectionProps) {
  const { data, isLoading } = useGradeDistribution(filter);
  const items = data?.items ?? [];
  const groupLabel = filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas';

  return (
    <div className="grid grid-cols-[380px_1fr] gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Nilai Kelulusan {filter.fakultas !== 'semua' ? filter.fakultas : 'ITB'}</CardTitle>
          <CardDescription>Akumulasi sesuai filter aktif</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[150px] flex items-center justify-center text-[12px] text-neutral">
              Memuat data…
            </div>
          ) : items.length === 0 ? (
            <div className="h-[150px] flex items-center justify-center text-[12px] text-neutral">
              Tidak ada data untuk filter ini.
            </div>
          ) : (
            <GradePie items={items} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribusi Grade per {groupLabel}</CardTitle>
          <CardDescription>Diurutkan sesuai respons backend — sesuai filter aktif</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[350px] flex items-center justify-center text-[12px] text-neutral">
              Memuat data…
            </div>
          ) : (
            <GradeStackedBar items={items} granularity={data?.granularity ?? 'fakultas'} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}