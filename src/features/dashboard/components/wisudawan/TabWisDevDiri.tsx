import { DevDiriSection }     from '@/features/dashboard/components/wisudawan/sections/DevDiriSection';
import type { WisudawanFilter } from '@/features/dashboard/types';

interface TabWisDevDiriProps {
  filter: WisudawanFilter;
}

export default function TabWisDevDiri({ filter }: TabWisDevDiriProps) {
  return <DevDiriSection filter={filter} />;
}