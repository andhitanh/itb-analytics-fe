import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import { useDataMode, DATA_MODE_LABELS, type DataMode } from '@/context/DataModeContext';
import { cn } from '@/lib/utils';

export function DataModeDropdown() {
  const { dataMode, setDataMode } = useDataMode();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-[30px] bg-subtle border-[#D0DCF0] hover:bg-active text-primary font-semibold">
          {DATA_MODE_LABELS[dataMode]}
          <ChevronDown className="ml-1.5 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="min-w-[240px] rounded-[10px] border-border-mid shadow-[0_8px_24px_rgba(0,0,0,0.09)] p-1"
      >
        {(['portofolio', 'wisudawan'] as DataMode[]).map(m => (
          <DropdownMenuItem
            key={m}
            onClick={() => setDataMode(m)}
            className={cn(
              'flex items-center justify-between rounded-[7px] px-3 py-[9px] text-[13px] cursor-pointer',
              dataMode === m
                ? 'bg-active text-primary font-semibold'
                : 'text-text-mid font-normal hover:bg-subtle'
            )}
          >
            {DATA_MODE_LABELS[m]}
            {dataMode === m && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}