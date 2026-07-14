// src/features/chatbot/components/ProgressIndicator.tsx
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatProgress } from '@/features/chatbot/hooks/useChatStream';

// Nama teknis node -> label yang dipahami pengguna non-teknis.
// Sengaja daftar tertutup (bukan format string generik dari node name)
// supaya label yang tampil selalu bahasa manusia, bukan istilah internal
// seperti "schema_linker" atau "sql_executor".
const NODE_LABELS: Record<string, string> = {
  input_guard: 'Memeriksa pertanyaan',
  intent_classifier: 'Memahami maksud pertanyaan',
  out_of_scope: 'Memeriksa cakupan pertanyaan',
  query_rewriter: 'Menyusun ulang pertanyaan',
  planner: 'Menyusun rencana jawaban',
  schema_linker: 'Mencari data yang relevan',
  sql_generator: 'Menyusun permintaan data',
  sql_validator: 'Memvalidasi permintaan data',
  sql_executor: 'Mengambil data',
  answer_validator: 'Memeriksa jawaban',
  step_reasoner: 'Menganalisis hasil',
  synthesizer: 'Menyusun jawaban',
};

function labelFor(node: string): string {
  return NODE_LABELS[node] ?? 'Memproses';
}

interface ProgressIndicatorProps {
  progress: ChatProgress;
}

/**
 * Indikator status "sedang berpikir" -- BUKAN typing-effect token-per-token,
 * karena backend tidak stream token (lihat useChatStream). Ini status per
 * tahap agent, ditampilkan sebagai baris teks berjalan dengan titik berdenyut,
 * konsisten dengan posisi avatar assistant di MessageBubble.
 */
export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="shrink-0">
        <AvatarFallback className="bg-secondary text-primary">
          <Bot className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex gap-0.5">
          <span className="size-1.5 animate-pulse rounded-full bg-neutral [animation-delay:0ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-neutral [animation-delay:150ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-neutral [animation-delay:300ms]" />
        </span>
        <span>{labelFor(progress.node)}</span>
      </div>
    </div>
  );
}