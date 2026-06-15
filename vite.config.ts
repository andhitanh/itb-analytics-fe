import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv dengan prefix '' → baca SEMUA env var, termasuk yang tanpa prefix VITE_.
  // Dibutuhkan agar BACKEND_DEV_URL (tanpa prefix) terbaca di config level.
  // Variabel tanpa prefix VITE_ tidak di-expose ke browser, aman.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },

    server: {
      // Proxy aktif hanya saat dev server (`npm run dev`).
      // Di production build, tidak ada proxy — axios pakai VITE_API_URL langsung.
      proxy: {
        // Forward semua /api/* ke backend lokal → browser tidak kena CORS.
        '/api': {
          target: env.BACKEND_DEV_URL ?? 'http://localhost:8000',
          changeOrigin: true,
          // Tidak perlu rewrite path — /api sudah sesuai routing backend
        },
      },
    },
  };
});