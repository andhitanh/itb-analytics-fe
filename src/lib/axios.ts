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
 *
 * 401 interceptor: dispatch event 'auth:unauthorized' saat session expired.
 * UserContext mendengarkan event ini dan reset auth state → router redirect ke /login.
 * Decoupled dari React state sehingga interceptor tidak perlu import context.
 */
import axios from 'axios';

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default api;