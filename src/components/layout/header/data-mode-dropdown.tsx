import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Check } from 'lucide-react';
import { useDataMode, DATA_MODE_LABELS, type DataMode } from '@/context/DataModeContext';

export function DataModeDropdown() {
  const { dataMode, setDataMode } = useDataMode();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-[30px] border-border-mid text-primary font-semibold">
          {DATA_MODE_LABELS[dataMode]}
          <ChevronDown className="ml-1.5 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[240px]">
        {(['portofolio', 'wisudawan'] as DataMode[]).map(m => (
          <DropdownMenuItem
            key={m}
            onClick={() => setDataMode(m)}
            className="flex items-center justify-between"
          >
            {DATA_MODE_LABELS[m]}
            {dataMode === m && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}