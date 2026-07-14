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

// ─── Chart Interpreter (cermin dari ChartContext di agent/state.py) ─────────
//
// Dikirim dari card dashboard lewat tombol "Tanya insight" -- lihat
// ChartInsightButton.tsx. Bentuknya harus align 1:1 dengan backend karena
// divalidasi ketat sebagai Pydantic model (ChartContext.model_validate) di
// chat_service.py; kalau field wajib hilang atau chart_type di luar 10 nilai
// ini, backend menolak dengan 422 sebelum stream dimulai.

export type ChartType =
  | 'entity_comparison_bar_chart'
  | 'course_ranking_top_bottom_list'
  | 'single_entity_percentage_value'
  | 'grade_distribution_stacked_bar_chart'
  | 'grade_distribution_single_entity_bar_chart'
  | 'score_trend_line_chart'
  | 'score_heatmap_matrix_chart'
  | 'grading_composition_stacked_bar_chart'
  | 'grading_composition_single_entity_bar_chart'
  | 'score_by_sks_bucket_bar_chart';

export interface QuestionReference {
  kode_pertanyaan_frontend: string;
  pertanyaan: string;
}

export interface ChartFiltersApplied {
  tahun_ajaran?: string;
  semester?: number[];
  jenjang?: string[];
  kode_fakultas?: string[];
  no_prodi?: number[];
}

export interface ChartContext {
  chart_type: ChartType;
  title: string;
  x_axis_label?: string;
  y_axis_label?: string;
  series: Record<string, unknown>[];
  filters_applied?: ChartFiltersApplied;
  hint: string[];
  jumlah_kelas_aktif?: number;
  question_reference?: Record<string, QuestionReference>;
}

/** Kalimat tetap yang dikirim tombol "Tanya insight" -- satu sumber, dipakai
 *  di seluruh frontend (tombol & auto-trigger ChatbotPage) supaya konsisten
 *  kalau backend suatu saat mengubah kalimat trigger-nya. */
export const CHART_INSIGHT_QUERY = 'Insight apa yang bisa saya ambil dari grafik ini?';

/** State yang dibawa lewat navigate('/chatbot', { state }) saat tombol
 *  "Tanya insight" diklik dari card dashboard -- lihat ChartInsightButton.tsx
 *  (pengirim) dan ChatbotPage.tsx (penerima, via useLocation().state). */
export interface ChartInsightNavigationState {
  chartContext: ChartContext;
  autoQuery: string;
}

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