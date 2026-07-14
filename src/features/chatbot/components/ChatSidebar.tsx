// src/features/chatbot/components/ChatSidebar.tsx
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SessionListItem } from '@/features/chatbot/components/SessionListItem';
import type { SessionSummary } from '@/features/chatbot/types';

interface ChatSidebarProps {
  sessions: SessionSummary[];
  activeSessionId: string;
  isLoading: boolean;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

/**
 * Sidebar riwayat percakapan -- khusus di dalam halaman chatbot, beda dari
 * navigasi utama aplikasi (components/layout/Sidebar). Ditempatkan sebagai
 * panel kedua di sebelah ChatWindow, bukan menimpa sidebar navigasi utama.
 */
export function ChatSidebar({
  sessions,
  activeSessionId,
  isLoading,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="p-3">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={onNewChat}>
          <Plus className="size-4" />
          Percakapan baru
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2">
        {!isLoading && sessions.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">Belum ada percakapan.</p>
        ) : (
          <div className="flex flex-col gap-0.5 pb-3">
            {sessions.map((session) => (
              <SessionListItem
                key={session.session_id}
                session={session}
                isActive={session.session_id === activeSessionId}
                onSelect={() => onSelectSession(session.session_id)}
                onDelete={() => onDeleteSession(session.session_id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}