import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout          from '@/layouts/MainLayout';
import DashboardPage        from '@/pages/DashboardPage';
// import ChatbotPage          from '@/pages/ChatbotPage';
// import { PlaceholderPage }  from '@/pages/PlaceholderPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"      element={<DashboardPage />} />
        {/* <Route path="chatbot"        element={<ChatbotPage />} /> */}
        {/* <Route path="data-lengkap"   element={<PlaceholderPage slug="data-lengkap" />} />
        <Route path="unggah-data"    element={<PlaceholderPage slug="unggah-data" />} />
        <Route path="manajemen-akun" element={<PlaceholderPage slug="manajemen-akun" />} />
        <Route path="pengaturan"     element={<PlaceholderPage slug="pengaturan" />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}