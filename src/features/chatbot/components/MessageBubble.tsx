// src/features/chatbot/components/MessageBubble.tsx
import { Bot, BarChart2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/context/UserContext';
import { getInitials } from '@/types/user';
import { ChatArtifact } from '@/features/chatbot/components/ChatArtifact';
import type { ChatUIMessage } from '@/features/chatbot/hooks/useChatStream';

interface MessageBubbleProps {
  message: ChatUIMessage;
}

/**
 * Render 1 giliran pesan. User dan assistant dibedakan lewat tata letak
 * (bukan lewat label/emoji): pesan user adalah bubble solid rata kanan,
 * pesan assistant adalah teks datar rata kiri dengan avatar Bot -- pola
 * yang sama dipakai ChatGPT/Claude, sudah familiar bagi pengguna tanpa
 * perlu dijelaskan.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useUser();

  if (message.role === 'user') {
    return (
      <div className="flex items-start justify-end gap-3">
        <div className="flex max-w-[75%] flex-col items-end gap-1.5">
          {message.chartContextTitle && (
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-cream px-2.5 py-1 text-xs text-primary">
              <BarChart2 className="size-3.5 shrink-0" />
              <span className="truncate">{message.chartContextTitle}</span>
            </div>
          )}
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
            {message.content}
          </div>
        </div>
        <Avatar className="mt-0.5 shrink-0">
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {user ? getInitials(user.name) : ''}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <Avatar className="mt-0.5 shrink-0">
        <AvatarFallback className="bg-cream text-primary">
          <Bot className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex max-w-[85%] flex-col gap-3">
        <p className="text-sm leading-relaxed text-foreground">{message.content}</p>
        {message.artifacts?.map((artifact) => (
          <ChatArtifact key={artifact.artifact_id} artifact={artifact} />
        ))}
      </div>
    </div>
  );
}