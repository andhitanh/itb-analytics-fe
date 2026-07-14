/**
 * src/routers/index.tsx
 */
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import MainLayout    from '@/layouts/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import ChatbotPage   from '@/pages/ChatbotPage';
import LoginPage     from '@/pages/LoginPage';

// Blokir akses ke halaman protected jika belum login.
// loading = true → render null dulu, cegah flash redirect ke /login.
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useUser();
  if (loading)         return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Redirect user yang sudah login jika coba akses /login secara manual.
function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useUser();
  if (loading)        return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <LoginPage />
          </RedirectIfAuth>
        }
      />

      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="chatbot" element={<ChatbotPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}