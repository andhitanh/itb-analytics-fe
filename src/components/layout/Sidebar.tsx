import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarItem } from './sidebar/sidebar-item';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import logoSidebar from '@/assets/images/logo-sidebar.png';

import dashboardIcon    from '@/assets/icons/dashboard-icon.svg';
// import fullDataIcon     from '@/assets/icons/full-data-icon.svg';
import chatbotIcon      from '@/assets/icons/chatbot-icon.svg';
// import uploadDataIcon   from '@/assets/icons/upload-data-icon.svg';
// import accMgmtIcon      from '@/assets/icons/acc-management-icon.svg';
// import settingsIcon     from '@/assets/icons/settings-icon.svg';

// ─── Menu definitions ─────────────────────────────────────────────────────────

const ADMIN_MENU = [
  { label: 'Dashboard',      icon: dashboardIcon,  path: '/dashboard' },
  // { label: 'Data Lengkap',   icon: fullDataIcon,   path: '/data-lengkap' },
  { label: 'Chatbot',        icon: chatbotIcon,    path: '/chatbot' },
  // { label: 'Unggah Data',    icon: uploadDataIcon, path: '/unggah-data' },
  // { label: 'Manajemen Akun', icon: accMgmtIcon,    path: '/manajemen-akun' },
  // { label: 'Pengaturan',     icon: settingsIcon,   path: '/pengaturan' },
];

const USER_MENU = [
  { label: 'Dashboard',       icon: dashboardIcon, path: '/dashboard' },
  // { label: 'Data Mata Kuliah',icon: fullDataIcon,  path: '/data-mata-kuliah' },
  { label: 'Chatbot',         icon: chatbotIcon,   path: '/chatbot' },
  // { label: 'Pengaturan',      icon: settingsIcon,  path: '/pengaturan' },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  if (!user) return null;
  const menu = user.activeRole.role === 'admin' ? ADMIN_MENU : USER_MENU;

  return (
    <aside
      className={cn(
        'h-screen bg-surface flex flex-col shrink-0 z-50 overflow-hidden',
        'rounded-r-[20px] shadow-[4px_0_20px_0_rgba(0,0,0,0.05)]',
        'transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center shrink-0 min-h-[72px] transition-all duration-[280ms]',
        collapsed ? 'justify-center py-6 px-0' : 'px-5 py-5'
      )}>
        <img
          src={logoSidebar}
          alt="Aplikasi Akademik ITB"
          className={cn(
            'object-contain transition-all duration-[280ms]',
            collapsed
              ? 'h-[30px] max-w-[34x] object-center'
              : 'h-[34px] max-w-[180px] object-left'
          )}
        />
      </div>

      <Separator className="mx-4" />

      {/* Navigation */}
      <nav
        aria-label="Menu utama"
        className={cn(
          'flex-1 flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden',
          collapsed ? 'px-2 py-2.5' : 'px-3 py-2.5'
        )}
      >
        {menu.map(item => (
          <SidebarItem key={item.path} {...item} collapsed={collapsed} />
        ))}
      </nav>

      <Separator className="mx-4" />

      {/* Collapse toggle */}
      <div className={cn(
        'flex shrink-0 p-3.5',
        collapsed ? 'justify-center' : 'justify-end'
      )}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(prev => !prev)}
          aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          className="w-8 h-8 bg-active border-border-mid text-text-mid hover:bg-[#E2EBF6] hover:text-primary"
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft  className="h-4 w-4" />
          }
        </Button>
      </div>
    </aside>
  );
}