// src/features/chatbot/types.ts

// ─── Kontrak dasar (cermin dari api/routers/schemas.py) ──────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string; // ISO timestamp, opsional untuk pesan yang belum tersimpan
}

export interface ChartArtifact {
  artifact_type: 'chart';
  artifact_id: string;
  title: string;
  chart_type: string;
  chart_spec: Record<string, unknown>; // Vega-Lite spec, dirender apa adanya
  insight?: string | null;
}

export interface TableArtifact {
  artifact_type: 'table';
  artifact_id: string;
  title: string;
  columns: { name: string; type: string; display_name: string }[];
  rows: Record<string, unknown>[];
  row_count: number;
  is_truncated: boolean;
}

export type ChatArtifact = ChartArtifact | TableArtifact;

export interface ChatResponse {
  response_type: 'text' | 'mixed' | 'clarification' | 'error';
  narrative: string;
  artifacts: ChatArtifact[];
  follow_up_suggestions: string[];
  clarification_question: string | null;
  disclaimer: string | null;
}

export interface SessionSummary {
  session_id: string;
  title: string | null;
  summary: string | null;
  updated_at: string;
}

// ─── Event SSE (cermin dari event_generator di api/routers/chat.py) ──────────

export interface NodeUpdateEvent {
  event: 'node_update';
  node: string;
  namespace: string[];
  plan?: unknown;
  reasoning?: string;
  sql?: string;
  error?: string;
}

export interface FinalResponseEvent {
  event: 'final_response';
  data: ChatResponse;
}

export interface StreamErrorEvent {
  event: 'error';
  message: string;
}

export type ChatStreamEvent = NodeUpdateEvent | FinalResponseEvent | StreamErrorEvent;