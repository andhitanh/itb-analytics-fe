import { FasilitasDetailSection } from '@/features/dashboard/components/wisudawan/sections/FasilitasDetailSection';
import type { WisudawanFilter }   from '@/features/dashboard/types';

interface TabWisFasilitasProps {
  filter: WisudawanFilter;
}

export default function TabWisFasilitas({ filter }: TabWisFasilitasProps) {
  return <FasilitasDetailSection filter={filter} />;
}