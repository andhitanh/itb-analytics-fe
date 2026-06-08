import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ProgressRankList, type ProgressRankItem } from '@/features/dashboard/components/shared-layouts/ProgressRankList';
import { TOP5_ASPEK, BOTTOM5_ASPEK } from '@/features/dashboard/mocks/mockDataWisudawan';
import { chartColors } from '@/styles/chart-token';

const SRC_COLOR: Record<string, string> = {
  'Fasilitas':     chartColors.light,
  'Program Studi': chartColors.primary,
  'Softskill':     chartColors.success,
  'Karakter':      chartColors.purple,
};

function toRankItems(aspek: typeof TOP5_ASPEK): ProgressRankItem[] {
  return aspek.map(item => ({
    label:          item.label,
    value:          item.avg,
    sublabel:       item.src,
    sublabelColor:  SRC_COLOR[item.src] ?? chartColors.neutral,
  }));
}

export function AspekRankingSection() {
  return (
    <div className="grid grid-cols-[1fr_280px_280px] gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Legenda Domain Evaluasi</CardTitle>
          <CardDescription>Warna sublabel menunjukkan asal domain aspek</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2.5">
            {Object.entries(SRC_COLOR).map(([src, color]) => (
              <div key={src} className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[12.5px] font-semibold text-text-dark">{src}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bottom 5 Aspek</CardTitle>
          <CardDescription>Skor terendah lintas semua domain</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressRankList
            items={toRankItems(BOTTOM5_ASPEK)}
            color={chartColors.danger}
            domain={[2.5, 4.0]}
            mode="bottom"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Aspek</CardTitle>
          <CardDescription>Skor tertinggi lintas semua domain</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressRankList
            items={toRankItems(TOP5_ASPEK)}
            color={chartColors.success}
            domain={[2.5, 4.0]}
            mode="top"
          />
        </CardContent>
      </Card>
    </div>
  );
}