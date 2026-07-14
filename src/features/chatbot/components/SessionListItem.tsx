// src/features/chatbot/components/SessionListItem.tsx
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SessionSummary } from '@/features/chatbot/types';

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60_000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay === 1) return 'Kemarin';
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

interface SessionListItemProps {
  session: SessionSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function SessionListItem({ session, isActive, onSelect, onDelete }: SessionListItemProps) {
  const title = session.title?.trim() || 'Percakapan baru';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Hapus percakapan ini? Riwayatnya tidak bisa dikembalikan.')) {
      onDelete();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={cn(
        'group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors',
        isActive ? 'bg-secondary' : 'hover:bg-muted',
      )}
    >
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm',
            isActive ? 'font-medium text-accent-foreground' : 'text-foreground',
          )}
        >
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{formatRelativeTime(session.updated_at)}</p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
        onClick={handleDelete}
        aria-label="Hapus percakapan"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}