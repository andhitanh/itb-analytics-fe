// src/pages/DashboardPage.tsx
import { useUser } from '@/context/UserContext';
import DashboardAkademik from '@/features/dashboard/DashboardAkademik';
import DashboardDosen    from '@/features/dashboard/DashboardDosen';

/**
 * Dashboard yang dirender ditentukan oleh ROLE aktif user, bukan dataMode
 * (dataMode membedakan sumber data akademik vs wisudawan — konsep berbeda
 * dari siapa yang melihat). Role 'dosen' selalu dapat dashboard personal;
 * role lain (kaprodi, dekan, direktorat, dst.) dapat dashboard manajerial
 * yang sudah ada, terlepas dari dataMode.
 */
export default function DashboardPage() {
  const { user } = useUser();

  if (user?.activeRole.role === 'dosen') {
    return <DashboardDosen />;
  }

  return <DashboardAkademik />;
}