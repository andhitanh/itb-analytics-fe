import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { HBarChart } from '@/features/dashboard/components/charts/HBarChart';
import { deriveSoftskillGroup, deriveKarakterGroup } from '@/features/dashboard/utils/grouping';
import {
  SOFTSKILL_ITB_AVG,
  KARAKTER_ITB_AVG,
} from '@/features/dashboard/mocks/mockDataWisudawan';
import { chartColors } from '@/styles/chart-token';
import type { WisudawanFilter } from '@/features/dashboard/types';

interface DevDiriSectionProps {
  filter: WisudawanFilter;
}

export function DevDiriSection({ filter }: DevDiriSectionProps) {
  const softskillFacultyData = deriveSoftskillGroup(filter);
  const karakterFacultyData  = deriveKarakterGroup(filter);

  const softskillOverall = parseFloat((
    SOFTSKILL_ITB_AVG.reduce((s, d) => s + d.avg, 0) / SOFTSKILL_ITB_AVG.length
  ).toFixed(2));
  const karakterOverall  = parseFloat((
    KARAKTER_ITB_AVG.reduce((s, d) => s + d.avg, 0) / KARAKTER_ITB_AVG.length
  ).toFixed(2));

  const groupLabel = filter.fakultas !== 'semua' ? 'Prodi' : 'Fakultas';

  return (
    <div className="flex flex-col gap-4">

      {/* Baris 1: Softskill */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[28px] font-extrabold text-mid leading-none">
                {softskillOverall.toFixed(2)}
              </span>
              <span className="text-[13px] text-neutral">/ 4.00</span>
              <span className="text-[11px] text-neutral">rata-rata 9 aspek</span>
            </div>
            <CardTitle>Skor Peningkatan Softskill — ITB</CardTitle>
            <CardDescription>
              Seberapa besar lingkungan ITB mendukung peningkatan kemampuan (skala 4)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart
              data={SOFTSKILL_ITB_AVG}
              color={chartColors.mid}
              domain={[2.5, 4.0]}
              sortOrder="asc"
              axisWidth={185}
              height={SOFTSKILL_ITB_AVG.length * 34 + 20}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Softskill per {groupLabel}</CardTitle>
            <CardDescription>Rata-rata 9 item softskill — diurutkan terendah ke tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart
              data={softskillFacultyData}
              color={chartColors.mid}
              domain={[3.0, 4.0]}
              sortOrder="asc"
            />
          </CardContent>
        </Card>
      </div>

      {/* Baris 2: Karakter */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[28px] font-extrabold text-purple leading-none">
                {karakterOverall.toFixed(2)}
              </span>
              <span className="text-[13px] text-neutral">/ 4.00</span>
              <span className="text-[11px] text-neutral">rata-rata 7 aspek</span>
            </div>
            <CardTitle>Skor Pengembangan Karakter — ITB</CardTitle>
            <CardDescription>
              Seberapa besar lingkungan ITB mendukung pengembangan karakter (skala 4)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart
              data={KARAKTER_ITB_AVG}
              color={chartColors.purple}
              domain={[3.0, 4.0]}
              sortOrder="asc"
              axisWidth={185}
              height={KARAKTER_ITB_AVG.length * 34 + 20}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbandingan Karakter per {groupLabel}</CardTitle>
            <CardDescription>Rata-rata 7 item karakter — diurutkan terendah ke tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <HBarChart
              data={karakterFacultyData}
              color={chartColors.purple}
              domain={[3.0, 4.0]}
              sortOrder="asc"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}