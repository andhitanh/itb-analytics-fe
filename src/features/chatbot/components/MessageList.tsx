// src/features/chatbot/components/MessageList.tsx
import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageBubble } from '@/features/chatbot/components/MessageBubble';
import { ProgressIndicator } from '@/features/chatbot/components/ProgressIndicator';
import { ErrorBanner } from '@/features/chatbot/components/ErrorBanner';
import type { ChatUIMessage, ChatProgress } from '@/features/chatbot/hooks/useChatStream';

const SUGGESTED_PROMPTS = [
  'Berapa rata-rata IPK di prodi saya?',
  'Bagaimana tren nilai mata kuliah tahun ini dibanding tahun lalu?',
  'Mata kuliah apa yang punya skor evaluasi terendah?',
];

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

/**
 * Tampilan awal sebelum ada percakapan -- headline singkat + beberapa contoh
 * pertanyaan yang bisa langsung diklik. Pola ini familiar dari chatbot modern
 * (ChatGPT, Claude): membantu pengguna baru paham apa yang bisa ditanyakan
 * tanpa perlu membaca dokumentasi apa pun.
 */
function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
        <Bot className="size-6 text-primary" />
      </div>
      <div className="space-y-1.5">
        <p className="text-base font-medium text-foreground">Tanyakan tentang data akademik Anda</p>
        <p className="text-sm text-muted-foreground">
          Jawaban disusun berdasarkan data portofolio akademik sesuai cakupan akses Anda.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            size="sm"
            className="h-auto whitespace-normal px-3 py-2 text-left font-normal"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}

interface MessageListProps {
  messages: ChatUIMessage[];
  progress: ChatProgress | null;
  error: string | null;
  onSelectPrompt: (prompt: string) => void;
}

export function MessageList({ messages, progress, error, onSelectPrompt }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, progress, error]);

  if (messages.length === 0 && !progress && !error) {
    return <EmptyState onSelectPrompt={onSelectPrompt} />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 md:px-8">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {progress && <ProgressIndicator progress={progress} />}
        {error && <ErrorBanner message={error} />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}