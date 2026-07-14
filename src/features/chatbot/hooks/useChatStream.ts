// src/features/chatbot/hooks/useChatStream.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { streamChat } from '@/features/chatbot/api/streamChat';
import type { ChatArtifact, ChatMessage } from '@/features/chatbot/types';

export interface ChatUIMessage extends ChatMessage {
  id: string;
  artifacts?: ChatArtifact[];
}

export interface ChatProgress {
  node: string;
  reasoning?: string;
}

export interface UseChatStreamResult {
  messages: ChatUIMessage[];
  progress: ChatProgress | null;
  isStreaming: boolean;
  error: string | null;
  sendMessage: (query: string) => Promise<void>;
  abort: () => void;
  loadMessages: (initial: ChatMessage[]) => void;
}

/**
 * Mengelola state 1 percakapan aktif: daftar pesan, progres node yang sedang
 * berjalan, dan status streaming. Reset otomatis setiap kali sessionId berubah
 * (pindah / mulai chat baru), supaya pesan sesi lama tidak "bocor" ke sesi baru.
 */
export function useChatStream(sessionId: string): UseChatStreamResult {
  const [messages, setMessages] = useState<ChatUIMessage[]>([]);
  const [progress, setProgress] = useState<ChatProgress | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setProgress(null);
    setError(null);
    setIsStreaming(false);
  }, [sessionId]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || isStreaming) return;

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setError(null);
      setProgress(null);
      setIsStreaming(true);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: trimmed }]);

      await streamChat(
        trimmed,
        sessionId,
        {
          onNodeUpdate: (event) => {
            setProgress({ node: event.node, reasoning: event.reasoning });
          },
          onFinalResponse: (event) => {
            const resp = event.data;
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: resp.narrative,
                artifacts: resp.artifacts,
              },
            ]);
            setProgress(null);
          },
          onError: (message) => {
            setError(message);
            setProgress(null);
          },
        },
        controller.signal,
      );

      if (!controller.signal.aborted) setIsStreaming(false);
    },
    [sessionId, isStreaming],
  );

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setProgress(null);
  }, []);

  const loadMessages = useCallback((initial: ChatMessage[]) => {
    setMessages(initial.map((m) => ({ id: crypto.randomUUID(), ...m })));
  }, []);

  return { messages, progress, isStreaming, error, sendMessage, abort, loadMessages };
}