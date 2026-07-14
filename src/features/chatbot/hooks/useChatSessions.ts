// src/features/chatbot/hooks/useChatSessions.ts
import { useCallback, useEffect, useState } from 'react';
import { deleteSession, fetchSessions } from '@/features/chatbot/api/sessions';
import type { SessionSummary } from '@/features/chatbot/types';

export interface UseChatSessionsResult {
  sessions: SessionSummary[];
  isLoading: boolean;
  activeSessionId: string;
  startNewChat: () => void;
  selectSession: (sessionId: string) => void;
  removeSession: (sessionId: string) => Promise<void>;
  refreshSessions: () => void;
}

/**
 * Mengelola daftar percakapan (sidebar) dan sesi mana yang sedang aktif.
 *
 * session_id sengaja di-generate di frontend (crypto.randomUUID()), bukan
 * lewat panggilan API -- backend membuat baris di database secara lazy saat
 * pesan pertama terkirim (lihat api/services/chat_service.py). Ini membuat
 * "New Chat" instan tanpa round-trip jaringan, sama seperti perilaku ChatGPT.
 */
export function useChatSessions(): UseChatSessionsResult {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => crypto.randomUUID());

  const refreshSessions = useCallback(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetchSessions(controller.signal)
      .then(setSessions)
      .catch(() => {
        // Gagal muat riwayat bukan blocker -- chatbot tetap bisa dipakai
        // tanpa sidebar terisi, jadi cukup diamkan daripada tampilkan error.
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => refreshSessions(), [refreshSessions]);

  const startNewChat = useCallback(() => {
    setActiveSessionId(crypto.randomUUID());
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  const removeSession = useCallback(
    async (sessionId: string) => {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
      if (sessionId === activeSessionId) startNewChat();
    },
    [activeSessionId, startNewChat],
  );

  return {
    sessions,
    isLoading,
    activeSessionId,
    startNewChat,
    selectSession,
    removeSession,
    refreshSessions,
  };
}