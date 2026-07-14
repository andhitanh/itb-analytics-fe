// src/features/chatbot/api/streamChat.ts
//
// Fungsi murni (bukan React hook) untuk konsumsi SSE dari POST /api/chat/stream.
// Dipisah dari hook supaya logic parsing stream bisa diuji terpisah dari React,
// dan supaya useChatStream (hook) tetap fokus ke state management saja.

import type { ChartContext, ChatStreamEvent } from '@/features/chatbot/types';

// baseURL kosong di dev (di-proxy Vite), atau VITE_API_URL di prod — konsisten
// dengan src/lib/axios.ts. Tidak pakai axios di sini karena axios tidak
// mendukung ReadableStream body secara native untuk parsing SSE manual.
const API_BASE = import.meta.env.VITE_API_URL ?? '';

export interface StreamChatCallbacks {
  onNodeUpdate?: (event: Extract<ChatStreamEvent, { event: 'node_update' }>) => void;
  onFinalResponse: (event: Extract<ChatStreamEvent, { event: 'final_response' }>) => void;
  onError: (message: string) => void;
}

/**
 * Kirim 1 pertanyaan ke /api/chat/stream dan proses event SSE-nya.
 *
 * @param query        Teks pertanyaan user
 * @param sessionId    ID percakapan (di-generate frontend via crypto.randomUUID())
 * @param callbacks    Handler untuk tiap jenis event
 * @param signal       AbortSignal untuk cancel dari luar (misal user pindah chat)
 * @param chartContext Opsional -- disertakan saat pesan dipicu dari tombol
 *                      "Tanya insight" di dashboard (lihat ChartInsightButton).
 *                      Backend memvalidasinya ketat sebagai Pydantic model,
 *                      jadi bentuknya harus persis mengikuti tipe ChartContext.
 */
export async function streamChat(
  query: string,
  sessionId: string,
  callbacks: StreamChatCallbacks,
  signal?: AbortSignal,
  chartContext?: ChartContext,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // wajib -- auth backend berbasis session cookie
      body: JSON.stringify({
        query,
        session_id: sessionId,
        ...(chartContext && { chart_context: chartContext }),
      }),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) return; // dibatalkan user, bukan error sungguhan
    callbacks.onError('Tidak bisa terhubung ke server.');
    return;
  }

  if (!response.ok || !response.body) {
    // 422 = chart_context ditolak validasi Pydantic backend (lihat
    // ChartContext.model_validate di chat_service.py) -- ini murni bug
    // pemetaan data di kartu dashboard, bukan kesalahan user, jadi pesannya
    // dibedakan supaya gampang dilacak saat development.
    const message = response.status === 422
      ? 'Data grafik yang dikirim tidak valid. Coba lagi, atau ajukan pertanyaan manual.'
      : `Permintaan gagal (status ${response.status}).`;
    callbacks.onError(message);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let receivedTerminalEvent = false;

  try {
    while (true) {
      let readResult: ReadableStreamReadResult<Uint8Array>;
      try {
        readResult = await reader.read();
      } catch {
        if (signal?.aborted) return;
        callbacks.onError('Koneksi terputus saat menerima jawaban.');
        return;
      }

      const { done, value } = readResult;
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 1 event SSE dipisah "\n\n" -- lihat yield f"data: ...\n\n" di backend
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? ''; // sisa yang belum lengkap, simpan untuk chunk berikutnya

      for (const part of parts) {
        if (!part.startsWith('data: ')) continue;

        let parsed: ChatStreamEvent;
        try {
          parsed = JSON.parse(part.slice(6));
        } catch {
          continue; // event tidak valid, skip -- jangan jatuhkan seluruh stream
        }

        if (parsed.event === 'node_update') {
          callbacks.onNodeUpdate?.(parsed);
        } else if (parsed.event === 'final_response') {
          receivedTerminalEvent = true;
          callbacks.onFinalResponse(parsed);
        } else if (parsed.event === 'error') {
          receivedTerminalEvent = true;
          callbacks.onError(parsed.message);
        }
      }
    }

    // Stream ditutup server (done: true) tapi tidak pernah mengirim event
    // final_response ATAU error -- ini terjadi kalau backend crash di tengah
    // proses tanpa pengaman try/except (mis. exception mentah di 1 node graph)
    // sehingga koneksi terputus diam-diam. Tanpa pengaman ini, UI akan macet
    // permanen menampilkan progress indicator terakhir yang sempat diterima.
    if (!signal?.aborted && !receivedTerminalEvent) {
      callbacks.onError('Terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.');
    }
  } finally {
    // Wajib dilepas eksplisit: kalau reader ditinggal locked (misal karena
    // salah satu `return` di atas, atau AbortController membatalkan fetch di
    // tengah baca), stream di baliknya tidak akan pernah ditutup dengan
    // bersih -- ini yang mencegah memory leak saat koneksi dibatalkan.
    reader.releaseLock();
  }
}