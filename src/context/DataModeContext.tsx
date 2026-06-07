import { createContext, useContext, useState, type ReactNode } from 'react';

export type DataMode = 'portofolio' | 'wisudawan';

export const DATA_MODE_LABELS: Record<DataMode, string> = {
  portofolio: 'Portofolio & Kuesioner Akademik',
  wisudawan:  'Ulasan Wisudawan',
};

interface DataModeContextType {
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
}

const DataModeContext = createContext<DataModeContextType | null>(null);

export function DataModeProvider({ children }: { children: ReactNode }) {
  const [dataMode, setDataMode] = useState<DataMode>('portofolio');
  return (
    <DataModeContext.Provider value={{ dataMode, setDataMode }}>
      {children}
    </DataModeContext.Provider>
  );
}

export function useDataMode(): DataModeContextType {
  const ctx = useContext(DataModeContext);
  if (!ctx) throw new Error('useDataMode must be used within <DataModeProvider>');
  return ctx;
}