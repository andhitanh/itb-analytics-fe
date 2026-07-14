import { useDataMode }        from '@/context/DataModeContext';
import DashboardAkademik  from '@/features/dashboard/DashboardAkademik';
// import DashboardWisudawan from '@/features/dashboard/DashboardWisudawan';

export default function DashboardPage() {
  const { dataMode } = useDataMode();

  return dataMode === 'wisudawan'
    ? <DashboardAkademik />
    : <DashboardAkademik />;
}