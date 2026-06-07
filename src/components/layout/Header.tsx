import { useLocation } from 'react-router-dom';
import { useDataMode } from '@/context/DataModeContext';
import { DataModeDropdown }   from './header/data-mode-dropdown';
import { NotificationButton } from './header/notification-button';
import { ProfileSection }     from './header/profile-section';
import { Separator }          from '@/components/ui/separator';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':        'Dashboard',
  '/data-lengkap':     'Data Lengkap',
  '/chatbot':          'Chatbot',
  '/unggah-data':      'Unggah Data',
  '/manajemen-akun':   'Manajemen Akun',
  '/pengaturan':       'Pengaturan',
  '/data-mata-kuliah': 'Data Mata Kuliah',
};

export default function Header() {
  const location  = useLocation();
  const { dataMode } = useDataMode();
  const pageTitle   = PAGE_TITLES[location.pathname] ?? 'Halaman';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">

      {/* Kiri: judul halaman + data mode selector */}
      <div className="flex items-center gap-3">
        <h1 className="text-[17px] font-bold text-text-dark tracking-tight leading-none whitespace-nowrap">
          {pageTitle}
        </h1>
        {isDashboard && <DataModeDropdown />}
      </div>

      {/* Kanan: notifikasi + divider + profil */}
      <div className="flex items-center gap-2.5">
        <NotificationButton />
        <Separator orientation="vertical" className="h-7 mx-0.5" />
        <ProfileSection />
      </div>

    </header>
  );
}