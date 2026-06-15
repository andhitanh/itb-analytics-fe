/**
 * src/lib/axios.ts
 *
 * Satu axios instance untuk seluruh aplikasi.
 *
 * baseURL:
 *   - Dev  : '' (kosong) → request /api/* di-forward Vite proxy ke backend lokal
 *   - Prod : VITE_API_URL dari .env.production → request langsung ke backend
 *
 * withCredentials: true → browser kirim session cookie di setiap request
 */
import axios from 'axios';

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;