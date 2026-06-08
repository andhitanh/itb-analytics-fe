import { WisudawanStatsSection }   from '@/features/dashboard/components/wisudawan/sections/WisudawanStatsSection';
import { RespondenOverviewSection } from '@/features/dashboard/components/wisudawan/sections/RespondenOverviewSection';
import { AspekRankingSection }      from '@/features/dashboard/components/wisudawan/sections/AspekRankingSection';
import { KomentarWisudaSection }    from '@/features/dashboard/components/wisudawan/sections/KomentarWisudaSection';
import type { WisudawanFilter }     from '@/features/dashboard/types';

interface TabWisInfoUmumProps {
  filter: WisudawanFilter;
}

export default function TabWisInfoUmum({ filter: _filter }: TabWisInfoUmumProps) {
  return (
    <div className="flex flex-col gap-4">
      <WisudawanStatsSection />
      <RespondenOverviewSection />
      <AspekRankingSection />
      <KomentarWisudaSection />
    </div>
  );
}