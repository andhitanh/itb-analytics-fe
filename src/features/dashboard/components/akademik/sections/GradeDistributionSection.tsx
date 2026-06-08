import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AXIS_STYLE } from '@/styles/chart-token';
import { ITB_GRADE_DIST, GRADE_DIST_SORTED } from '@/features/dashboard/mocks/mockData';
import type { AkademikFilter } from '@/features/dashboard/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const GRADE_COLORS: Record<string, string> = {
  A: '#003366', AB: '#1A6AB5', B: '#4CA3DD', BC: '#7CBCE8',
  C: '#B3DBEF', D: '#F5C842', E: '#E74C3C',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function GradePie() {
  const acTotal = ITB_GRADE_DIST.A + ITB_GRADE_DIST.AB + ITB_GRADE_DIST.B + ITB_GRADE_DIST.BC + ITB_GRADE_DIST.C;
  const deTotal = ITB_GRADE_DIST.D + ITB_GRADE_DIST.E;
  const pieData = [
    { name: 'Lulus (A–C)',       value: acTotal, color: '#003366' },
    { name: 'Tidak Lulus (D–E)', value: deTotal, color: '#E74C3C' },
  ];
  const grades  = Object.entries(ITB_GRADE_DIST) as [string, number][];

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
          {grades.map(([g, pct]) => (
            <div key={g} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: GRADE_COLORS[g] }} />
              <span className="text-[12px] text-text-mid font-medium">{g}</span>
              <span className="text-[12px] font-bold text-text-dark ml-auto">{pct}%</span>
            </div>
          ))}
        </div>
        <div className="mt-2.5 pt-2 border-t border-border">
          <p className="text-[11px] text-neutral">
            Lulus A–C: <b className="text-primary">{acTotal}%</b>
            &nbsp;|&nbsp;
            Tidak lulus: <b className="text-danger">{deTotal}%</b>
          </p>
        </div>
      </div>
    </div>
  );
}

function GradeStackedBar() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={GRADE_DIST_SORTED} layout="vertical" margin={{ top: 0, right: 32, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" horizontal={false} />
        <XAxis type="number" tick={AXIS_STYLE} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="faculty" tick={AXIS_STYLE} width={42} />
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

export function GradeDistributionSection({ filter: _filter }: GradeDistributionSectionProps) {
  return (
    <div className="grid grid-cols-[380px_1fr] gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Nilai Kelulusan ITB</CardTitle>
          <CardDescription>Akumulasi seluruh fakultas — semester 2023/24-2</CardDescription>
        </CardHeader>
        <CardContent>
          <GradePie />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribusi Grade per Fakultas</CardTitle>
          <CardDescription>Diurutkan berdasarkan rata-rata nilai tertinggi — semester 2023/24-2</CardDescription>
        </CardHeader>
        <CardContent>
          <GradeStackedBar />
        </CardContent>
      </Card>
    </div>
  );
}