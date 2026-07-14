// src/features/chatbot/ChatbotPage.tsx
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChatSessions } from '@/features/chatbot/hooks/useChatSessions';
import { ChatSidebar } from '@/features/chatbot/components/ChatSidebar';
import { ChatWindow } from '@/features/chatbot/components/ChatWindow';
import type { ChartInsightNavigationState } from '@/features/chatbot/types';

/**
 * Halaman chatbot utuh: panel riwayat percakapan (ChatSidebar) di kiri,
 * jendela percakapan aktif (ChatWindow) di kanan.
 *
 * "Sesi mana yang sedang aktif" sengaja dikelola di useChatSessions (bukan
 * di sini sebagai useState terpisah) -- ini state UI, tapi startNewChat/
 * selectSession/removeSession semuanya perlu tahu activeSessionId juga,
 * jadi menyatukannya di 1 hook mencegah 2 sumber kebenaran yang bisa
 * tidak sinkron.
 *
 * key={activeSessionId} pada ChatWindow memaksa remount saat sesi berganti
 * -- lebih sederhana dan lebih aman daripada mengandalkan useEffect di
 * ChatWindow/useChatStream untuk membersihkan sisa state UI lokal
 * (mis. input yang sedang diketik) setiap kali sessionId berubah.
 */
export default function ChatbotPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    sessions,
    isLoading,
    activeSessionId,
    startNewChat,
    selectSession,
    removeSession,
    refreshSessions,
  } = useChatSessions();

  // Ambil chart_context sekali dari navigation state (dikirim tombol "Tanya
  // insight" di dashboard, lihat ChartInsightButton). Disimpan lewat lazy
  // initializer -- dibaca sekali saat mount, BUKAN terus mengikuti
  // location.state -- karena location.state akan segera dibersihkan
  // (lihat effect di bawah), dan kalau kita terus bergantung padanya
  // setelah dibersihkan, nilainya sudah null.
  const [pendingInsight] = useState<ChartInsightNavigationState | null>(
    () => (location.state as ChartInsightNavigationState | null) ?? null,
  );

  const hasConsumedRef = useRef(false);
  useEffect(() => {
    if (!pendingInsight || hasConsumedRef.current) return;
    hasConsumedRef.current = true;

    // Mulai dari sesi baru -- jangan tumpuk insight ke percakapan yang
    // sedang aktif. Aman dipanggil walau activeSessionId saat mount memang
    // sudah baru (kasus umum: navigasi dari dashboard selalu me-mount ulang
    // halaman ini) -- startNewChat cuma membuat UUID baru lagi.
    startNewChat();

    // Bersihkan location.state SEGERA -- supaya refresh atau tombol back
    // browser tidak memicu pengiriman insight yang sama untuk kedua kalinya.
    navigate('.', { replace: true, state: null });
  }, [pendingInsight, startNewChat, navigate]);

  return (
    <div className="-m-7 flex h-[calc(100vh-4rem)] overflow-hidden">
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        isLoading={isLoading}
        onSelectSession={selectSession}
        onNewChat={startNewChat}
        onDeleteSession={removeSession}
      />
      <div className="min-w-0 flex-1 bg-page">
        <ChatWindow
          key={activeSessionId}
          sessionId={activeSessionId}
          onConversationStarted={refreshSessions}
          autoSend={
            pendingInsight
              ? { query: pendingInsight.autoQuery, chartContext: pendingInsight.chartContext }
              : undefined
          }
        />
      </div>
    </div>
  );
}