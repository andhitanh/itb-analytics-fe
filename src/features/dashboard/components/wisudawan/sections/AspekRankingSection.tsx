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

function DomainLegend() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {Object.entries(SRC_COLOR).map(([src, color]) => (
        <div key={src} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-[11.5px] font-medium text-text-mid">{src}</span>
        </div>
      ))}
    </div>
  );
}

export function AspekRankingSection() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bottom 5 Aspek</CardTitle>
          <CardDescription>Skor terendah lintas semua domain</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <ProgressRankList
            items={toRankItems(BOTTOM5_ASPEK)}
            color={chartColors.danger}
            domain={[2.5, 4.0]}
            mode="bottom"
          />
          <DomainLegend />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Aspek</CardTitle>
          <CardDescription>Skor tertinggi lintas semua domain</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <ProgressRankList
            items={toRankItems(TOP5_ASPEK)}
            color={chartColors.success}
            domain={[2.5, 4.0]}
            mode="top"
          />
          <DomainLegend />
        </CardContent>
      </Card>
    </div>
  );
}