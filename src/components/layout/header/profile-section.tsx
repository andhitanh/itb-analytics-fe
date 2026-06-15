import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import {
  type RoleEntry,
  ROLE_LABELS,
  getRoleScopeLabel,
  getInitials,
} from '@/types/user';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Check, ChevronDown, LogOut, Shield, Building2, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/user';

// ─── Role Icon ────────────────────────────────────────────────────────────────

const ROLE_ICON: Record<UserRole, React.ReactNode> = {
  admin:           <Shield    className="h-3.5 w-3.5" />,
  direktorat:      <Building2 className="h-3.5 w-3.5" />,
  dekan:           <Building2 className="h-3.5 w-3.5" />,
  jajaran_dekanat: <Building2 className="h-3.5 w-3.5" />,
  kaprodi:         <BookOpen  className="h-3.5 w-3.5" />,
  jajaran_prodi:   <BookOpen  className="h-3.5 w-3.5" />,
  dosen:           <User      className="h-3.5 w-3.5" />,
};

// ─── Dropdown Item ────────────────────────────────────────────────────────────

function RoleItem({
  entry,
  isActive,
  onSelect,
}: {
  entry:    RoleEntry;
  isActive: boolean;
  onSelect: () => void;
}) {
  const scopeLabel = getRoleScopeLabel(entry);

  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={cn(
        'flex items-center gap-2.5 rounded-[7px] px-3 py-2.5 cursor-pointer select-none',
        isActive
          ? 'bg-active text-primary'
          : 'text-text-mid hover:bg-subtle',
      )}
    >
      <span className={cn(
        'flex items-center justify-center w-6 h-6 rounded-md shrink-0',
        isActive ? 'bg-primary/10 text-primary' : 'bg-border text-neutral',
      )}>
        {ROLE_ICON[entry.role]}
      </span>

      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-[12.5px] leading-tight',
          isActive ? 'font-semibold text-primary' : 'font-medium text-text-dark',
        )}>
          {ROLE_LABELS[entry.role]}
        </p>
        <p className="text-[11px] text-neutral truncate mt-0.5">{scopeLabel}</p>
      </div>

      {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
    </DropdownMenuItem>
  );
}

// ─── Profile Section ──────────────────────────────────────────────────────────

export function ProfileSection() {
  const { user, setActiveRole, logout } = useUser();
  const navigate = useNavigate();

  // user dijamin non-null di sini karena ProfileSection hanya dirender
  // di dalam RequireAuth (MainLayout). Tapi guard tetap dipasang untuk safety.
  if (!user) return null;

  const { activeRole, availableRoles } = user;
  const hasMultiRoles = availableRoles.length > 1;
  const scopeLabel    = getRoleScopeLabel(activeRole);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group rounded-lg hover:bg-subtle transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="flex items-center gap-2 px-0.5 py-0.5 text-left">
            <Avatar className="w-[38px] h-[38px] border-2 border-border-mid shrink-0">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary text-white text-[13px] font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-px min-w-0">
              <span className="text-[13.5px] font-semibold text-text-dark truncate max-w-[180px]">
                {user.name}
              </span>
              <span className="text-[12px] font-medium text-primary whitespace-nowrap">
                {ROLE_LABELS[activeRole.role]}
              </span>
              <span className="text-[11.5px] text-neutral truncate max-w-[180px]">
                {scopeLabel}
              </span>
            </div>

            <ChevronDown className="h-3 w-3 text-neutral shrink-0 ml-0.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[260px] rounded-[12px] border-border-mid shadow-[0_8px_24px_rgba(0,0,0,0.10)] p-1.5"
      >
        {/* Role switcher — hanya tampil jika multi-role */}
        {hasMultiRoles && (
          <>
            <DropdownMenuLabel className="flex items-center gap-2 px-2.5 pb-2 pt-1 border-b border-border mb-1.5">
              <span className="text-[11px] text-neutral font-semibold uppercase tracking-wide">
                Pilih Peran Aktif
              </span>
              <span className="ml-auto text-[10.5px] text-neutral bg-border px-1.5 py-0.5 rounded-full">
                {availableRoles.length} peran
              </span>
            </DropdownMenuLabel>

            <div className="flex flex-col gap-0.5">
              {availableRoles.map(entry => (
                <RoleItem
                  key={entry.userRoleId}
                  entry={entry}
                  isActive={entry.userRoleId === activeRole.userRoleId}
                  onSelect={() => setActiveRole(entry.userRoleId)}
                />
              ))}
            </div>

            <DropdownMenuSeparator className="my-1.5" />
          </>
        )}

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-[7px] px-3 py-2.5 cursor-pointer text-danger hover:bg-danger/8 focus:bg-danger/8 focus:text-danger"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-danger/10 text-danger shrink-0">
            <LogOut className="h-3.5 w-3.5" />
          </span>
          <span className="text-[12.5px] font-medium">Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}