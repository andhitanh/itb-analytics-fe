import { useUser } from '@/context/UserContext';
import { type UserRole, ROLE_LABELS, getAffiliationLabel, getInitials } from '@/types/user';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileSection() {
  const { user, setActiveRole } = useUser();
  const hasMultiRoles = user.roles.length > 1;
  const affiliation = getAffiliationLabel(user);

  // Kalau hanya satu role, tampilkan info saja tanpa dropdown
  const trigger = (
    <div className="flex items-center gap-2 px-0.5 text-left">
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
          {ROLE_LABELS[user.activeRole]}
        </span>
        <span className="text-[11.5px] text-neutral truncate max-w-[180px]">
          {affiliation}
        </span>
      </div>

      {hasMultiRoles && (
        <ChevronDown className="h-3 w-3 text-neutral shrink-0 ml-0.5 transition-transform duration-200" />
      )}
    </div>
  );

  // Tidak punya multi-role — tampilkan tanpa interaksi
  if (!hasMultiRoles) {
    return <div>{trigger}</div>;
  }

  // Punya multi-role — bungkus dengan DropdownMenu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg hover:bg-subtle transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary">
          {trigger}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[200px] rounded-[10px] border-border-mid shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-1"
      >
        <DropdownMenuLabel className="px-3 pb-2 pt-1.5 text-[11px] text-neutral font-semibold uppercase tracking-wide border-b border-border mb-1">
          Pilih Peran
        </DropdownMenuLabel>

        {user.roles.map((role: UserRole) => (
          <DropdownMenuItem
            key={role}
            onClick={() => setActiveRole(role)}
            className={cn(
              'flex items-center justify-between rounded-[7px] px-3 py-2 text-[13px] cursor-pointer',
              user.activeRole === role
                ? 'bg-active text-primary font-semibold'
                : 'text-text-mid font-normal hover:bg-subtle'
            )}
          >
            {ROLE_LABELS[role]}
            {user.activeRole === role && (
              <Check className="h-3.5 w-3.5 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}