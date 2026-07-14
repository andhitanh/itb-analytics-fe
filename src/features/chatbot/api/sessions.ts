// src/features/chatbot/api/sessions.ts
import api from '@/lib/axios';
import type { ChatMessage, SessionSummary } from '@/features/chatbot/types';

export async function fetchSessions(signal?: AbortSignal): Promise<SessionSummary[]> {
  const { data } = await api.get<SessionSummary[]>('/api/chat/sessions', { signal });
  return data;
}

export async function fetchSessionMessages(
  sessionId: string,
  signal?: AbortSignal,
): Promise<ChatMessage[]> {
  const { data } = await api.get<{ role: 'user' | 'assistant'; content: string; created_at: string }[]>(
    `/api/chat/sessions/${sessionId}/messages`,
    { signal },
  );
  return data.map((m) => ({ role: m.role, content: m.content, createdAt: m.created_at }));
}

export async function deleteSession(sessionId: string): Promise<void> {
  await api.delete(`/api/chat/sessions/${sessionId}`);
}