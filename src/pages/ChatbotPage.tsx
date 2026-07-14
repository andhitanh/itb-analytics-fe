// src/features/chatbot/ChatbotPage.tsx
import { useChatSessions } from '@/features/chatbot/hooks/useChatSessions';
import { ChatSidebar } from '@/features/chatbot/components/ChatSidebar';
import { ChatWindow } from '@/features/chatbot/components/ChatWindow';

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
  const {
    sessions,
    isLoading,
    activeSessionId,
    startNewChat,
    selectSession,
    removeSession,
    refreshSessions,
  } = useChatSessions();

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
        />
      </div>
    </div>
  );
}