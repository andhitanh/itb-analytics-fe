import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout   from '@/layouts/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage     from '@/pages/LoginPage';
import { useUser }  from '@/context/UserContext';

// Sementara: anggap user sudah login jika ada di context.
// Ketika auth nyata diimplementasi, ganti dengan cek session token.
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
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