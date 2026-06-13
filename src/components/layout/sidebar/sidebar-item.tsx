import { NavLink, useMatch } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  label:     string;
  icon:      string;
  path:      string;
  collapsed: boolean;
}

export function SidebarItem({ label, icon, path, collapsed }: SidebarItemProps) {
  const isActive = !!useMatch(path);

  const link = (
    <NavLink
      to={path}
      className={cn(
        'flex items-center rounded transition-all duration-150 select-none w-full',
        collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
        isActive
          ? 'bg-primary text-white'
          : 'text-text-mid hover:bg-active hover:text-primary'
      )}
    >
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className={isActive ? 'nav-icon-active' : undefined}
        style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}
      />
      {!collapsed && (
        <span className={cn(
          'text-[13.5px] tracking-wide whitespace-nowrap overflow-hidden',
          isActive ? 'font-semibold' : 'font-medium'
        )}>
          {label}
        </span>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="text-[13px] font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return link;
}
