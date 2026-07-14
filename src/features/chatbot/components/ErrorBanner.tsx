// src/features/chatbot/components/ErrorBanner.tsx
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
}

/**
 * Banner error untuk kegagalan komunikasi dengan chatbot (koneksi putus,
 * server error, dsb). Sengaja bukan bagian dari MessageBubble -- error
 * transport itu beda kategori dari isi percakapan, jadi ditampilkan
 * sebagai elemen UI terpisah, bukan seolah-olah pesan dari assistant.
 */
export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}