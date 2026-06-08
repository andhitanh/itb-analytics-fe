import { ProdiDetailSection } from '@/features/dashboard/components/wisudawan/sections/ProdiDetailSection';
import type { WisudawanFilter } from '@/features/dashboard/types';

interface TabWisProdiProps {
  filter: WisudawanFilter;
}

export default function TabWisProdi({ filter }: TabWisProdiProps) {
  return <ProdiDetailSection filter={filter} />;
}