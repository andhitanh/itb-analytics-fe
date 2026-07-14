// src/features/chatbot/components/ChatInput.tsx
import { useState, type KeyboardEvent } from 'react';
import { Square, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  isStreaming: boolean;
  onSend: (query: string) => void;
  onStop: () => void;
}

/**
 * Kotak input percakapan. Enter mengirim, Shift+Enter baris baru --
 * konvensi yang sudah familiar dari hampir semua aplikasi chat. Textarea
 * memakai class "field-sizing-content" bawaan (lihat components/ui/textarea)
 * untuk auto-resize tanpa JS tambahan.
 */
export function ChatInput({ isStreaming, onSend, onStop }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-xl border border-input bg-card p-2 shadow-sm">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tanyakan sesuatu tentang data akademik..."
        disabled={isStreaming}
        className="max-h-40 min-h-9 resize-none border-0 bg-transparent px-2 py-1.5 shadow-none focus-visible:ring-0"
      />
      {isStreaming ? (
        <Button size="icon" variant="secondary" onClick={onStop} aria-label="Hentikan">
          <Square className="size-3.5 fill-current" />
        </Button>
      ) : (
        <Button size="icon" onClick={handleSend} disabled={!value.trim()} aria-label="Kirim">
          <ArrowUp className="size-4" />
        </Button>
      )}
    </div>
  );
}