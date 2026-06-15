/**
 * src/routers/index.tsx
 *
 * RequireAuth menunggu loading selesai sebelum memutuskan redirect,
 * mencegah flash redirect ke /login saat user sebenarnya sudah login.
 */
import { Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import MainLayout    from '@/layouts/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage     from '@/pages/LoginPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useUser();

  if (loading) return null; // atau <PageSpinner /> jika ada
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}