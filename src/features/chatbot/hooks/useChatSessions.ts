// src/features/chatbot/hooks/useChatSessions.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { deleteSession, fetchSessions } from '@/features/chatbot/api/sessions';
import { useUser } from '@/context/UserContext';
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
  const { user } = useUser();
  const activeRoleId = user?.activeRole.userRoleId;

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

  // Riwayat percakapan di backend difilter per role aktif (lihat
  // chat.py: `WHERE user_id = %s AND active_role = %s::jsonb`) -- setiap
  // role adalah "ruang kerja" percakapan yang terpisah. Jadi saat user
  // ganti role lewat dropdown profil (UserContext.setActiveRole), 2 hal
  // harus terjadi otomatis, tanpa perlu refresh manual:
  //   1. Sidebar di-refresh -- daftar percakapan role lama tidak relevan lagi.
  //   2. Percakapan aktif di ChatWindow direset ke sesi baru -- melanjutkan
  //      sesi lama di bawah role baru akan tercampur konteks scope yang beda.
  //
  // activeRoleIdRef dipakai (bukan langsung reset di setiap render) supaya
  // efek ini HANYA jalan saat activeRoleId benar-benar BERUBAH -- bukan saat
  // mount pertama (di mount pertama, ref sudah sama dengan activeRoleId saat
  // itu, jadi tidak trigger reset yang tidak perlu).
  const activeRoleIdRef = useRef(activeRoleId);
  useEffect(() => {
    if (activeRoleIdRef.current === activeRoleId) return;
    activeRoleIdRef.current = activeRoleId;

    setActiveSessionId(crypto.randomUUID());
    refreshSessions();
  }, [activeRoleId, refreshSessions]);

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