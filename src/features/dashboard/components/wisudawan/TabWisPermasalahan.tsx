import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MASALAH_PREVALENSI, LAYANAN_DUKUNGAN } from '@/features/dashboard/mocks/mockDataWisudawan';
import { chartColors, AXIS_STYLE } from '@/styles/chart-token';
import type { WisudawanFilter } from '@/features/dashboard/types';

interface TabWisPermasalahanProps {
  filter: WisudawanFilter;
}

// Data transformation — dilakukan di level tab karena spesifik ke visualisasi ini
const AKADEMIS   = MASALAH_PREVALENSI.find(m => m.key === 'akademis')!;
const COMBINED   = MASALAH_PREVALENSI.filter(m => m.key !== 'akademis').map(m => ({
  label:         m.label.replace('Masalah ', ''),
  prevalensi:    m.pct,
  dampakAkademis: m.impactPct,
}));

export default function TabWisPermasalahan({ filter: _filter }: TabWisPermasalahanProps) {
  return (
    <div className="flex flex-col gap-4">

      {/* Callout: masalah akademis */}
      <div className="flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[#FFFBEB] border-[1.5px] border-[#FDE68A]">
        <div className="w-[42px] h-[42px] rounded-[10px] bg-[#FEF3C7] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L18 17H2L10 2z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M10 8v4M10 14h.01" stroke="#D97706" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#92400E] mb-0.5">
            Masalah Akademis — {AKADEMIS.pct}% wisudawan pernah mengalaminya
          </p>
          <p className="text-[12px] text-[#B45309] leading-relaxed">
            Dari mereka yang pernah mengalami, <b>{AKADEMIS.impactPct}%</b> menyatakan berdampak
            signifikan terhadap prestasi. Ditampilkan terpisah karena bersifat universal dan menjadi
            konteks utama untuk membaca data permasalahan lainnya.
          </p>
        </div>
      </div>

      {/* Baris 1: Dual bar + Layanan */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Prevalensi & Dampak Akademis Permasalahan Studi</CardTitle>
            <CardDescription>
              % yang pernah mengalami vs % yang menyatakan berdampak pada prestasi (di antara yang mengalami)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={COMBINED} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9BAAC4' }} />
                <YAxis tick={AXIS_STYLE} tickFormatter={v => `${v}%`} domain={[0, 80]} />
                <Tooltip formatter={(v: any) => typeof v === 'number' ? `${v}%` : v} />
                <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="prevalensi"      name="% Pernah mengalami"                  fill={chartColors.mid}    radius={[4,4,0,0]} maxBarSize={28} />
                <Bar dataKey="dampakAkademis"  name="% Berdampak akademis (yg mengalami)" fill={chartColors.danger} radius={[4,4,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-[11px] text-neutral mt-2">
              Masalah keuangan: prevalensi rendah (35%) tapi dampak akademis tinggi (61%) — sinyal prioritas intervensi.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kualitas Layanan Dukungan ITB</CardTitle>
            <CardDescription>
              Rata-rata skor kepuasan dari responden yang mengalami masalah terkait (skala 1–5)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 bg-active rounded-lg px-3 py-2 mb-4 text-[11.5px] text-text-mid">
              <span className="text-primary font-bold">ⓘ</span>
              Skor dihitung dari responden yang menjawab U07 saja. Angka di bawah nama = jumlah responden efektif.
            </div>

            <div className="flex flex-col gap-3.5">
              {LAYANAN_DUKUNGAN.map(d => {
                const pct   = ((d.avg - 1) / 4) * 100;
                const color = d.avg >= 3.5 ? chartColors.success : d.avg >= 3.0 ? chartColors.mid : chartColors.danger;
                return (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-[12.5px] font-semibold text-text-dark">{d.label}</span>
                        <span className="text-[11px] text-neutral ml-2">n = {d.respondents}%</span>
                      </div>
                      <span className="text-[14px] font-extrabold" style={{ color }}>
                        {d.avg.toFixed(2)}
                        <span className="text-[10px] font-normal text-neutral">/5</span>
                      </span>
                    </div>
                    <div className="h-2 bg-border rounded-full">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3.5 border-t border-border">
              <p className="text-[11.5px] text-[#374151] leading-relaxed">
                <b>Insight:</b> Bimbingan konseling mendapat skor terendah (2.88/5) meski masalah
                psikologis dialami 42% wisudawan. Gap ini mengindikasikan kebutuhan ekspansi kapasitas
                layanan psikologis kampus.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}