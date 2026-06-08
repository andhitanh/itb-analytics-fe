// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import { DataModeProvider } from '@/context/DataModeContext';
import { AppRouter } from '@/routers/index';

export default function App() {
  return (
    <UserProvider>
      <DataModeProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </DataModeProvider>
    </UserProvider>
  );
}