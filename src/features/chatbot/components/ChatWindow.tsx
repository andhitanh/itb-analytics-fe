// src/features/chatbot/components/ChatWindow.tsx
import { useEffect, useRef, useState } from 'react';
import { fetchSessionMessages } from '@/features/chatbot/api/sessions';
import { useChatStream } from '@/features/chatbot/hooks/useChatStream';
import { MessageList } from '@/features/chatbot/components/MessageList';
import { ChatInput } from '@/features/chatbot/components/ChatInput';

interface ChatWindowProps {
  sessionId: string;
  /** Dipanggil setelah giliran pertama di sesi ini selesai -- sinyal bagi
   *  parent (ChatbotPage) untuk refresh daftar percakapan di sidebar, karena
   *  backend baru mencatat sesi ini ke database setelah pesan pertama terkirim. */
  onConversationStarted?: () => void;
}

/**
 * Layout percakapan utuh untuk 1 sesi: memuat riwayat lama (kalau ada),
 * lalu menyambungkan MessageList dan ChatInput ke state streaming aktif.
 */
export function ChatWindow({ sessionId, onConversationStarted }: ChatWindowProps) {
  const { messages, progress, isStreaming, error, sendMessage, abort, loadMessages } =
    useChatStream(sessionId);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const wasEmptyRef = useRef(true);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoadingHistory(true);

    fetchSessionMessages(sessionId, controller.signal)
      .then((history) => {
        loadMessages(history);
        wasEmptyRef.current = history.length === 0;
      })
      .catch(() => {
        // Riwayat gagal dimuat -- mulai percakapan kosong, bukan blocker.
        wasEmptyRef.current = true;
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingHistory(false);
      });

    return () => controller.abort();
  }, [sessionId, loadMessages]);

  const handleSend = async (query: string) => {
    const isFirstTurn = wasEmptyRef.current;
    wasEmptyRef.current = false;
    await sendMessage(query);
    if (isFirstTurn) onConversationStarted?.();
  };

  if (isLoadingHistory) {
    return <div className="h-full" />; // riwayat biasanya dimuat dalam hitungan puluhan ms, tidak perlu skeleton
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <MessageList messages={messages} progress={progress} error={error} onSelectPrompt={handleSend} />
      </div>
      <div className="border-t border-border bg-card px-4 py-3 md:px-8">
        <div className="mx-auto max-w-3xl">
          <ChatInput isStreaming={isStreaming} onSend={handleSend} onStop={abort} />
        </div>
      </div>
    </div>
  );
}