// src/features/dashboard/DashboardDosen.tsx
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AkademikFilterBar }   from './components/akademik/AkademikFilterBar';
import { DosenStatsSection }   from './components/dosen/DosenStatsSection';
import { TabInfoUmumDosen }    from './components/dosen/TabInfoUmumDosen';
import { TabLuaranDosen }      from './components/dosen/TabLuaranDosen';
import { TabPenilaianDosen }   from './components/dosen/TabPenilaianDosen';
import { TabKomentarDosen }    from './components/dosen/TabKomentarDosen';
import { useFilterOptions }    from './hooks/useFilterOptions';
import { type AkademikFilter, DEFAULT_AKADEMIK_FILTER } from './types';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'info-umum', label: 'Informasi Umum'       },
  { value: 'luaran',    label: 'Luaran Mata Kuliah'   },
  { value: 'penilaian', label: 'Kuesioner Mahasiswa'  },
  { value: 'komentar',  label: 'Ringkasan Komentar'   },
];

// Class tab trigger disalin persis dari DashboardAkademik.tsx — konsistensi
// visual tab lintas dashboard, bukan style baru.
const TAB_TRIGGER = cn(
  'px-4 py-[14px] rounded-none border-b-2 border-transparent bg-transparent shadow-none',
  'text-[13px] font-medium whitespace-nowrap transition-colors duration-150',
  'data-[state=inactive]:text-neutral',
  'data-[state=active]:border-b-primary data-[state=active]:border-x-transparent data-[state=active]:border-t-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:font-bold',
  'hover:text-text-dark',
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardDosen() {
  const { data: filterOptions } = useFilterOptions();
  const [filter, setFilter] = useState<AkademikFilter>(DEFAULT_AKADEMIK_FILTER);

  // Inisialisasi tahun ajaran default begitu filterOptions tiba — pola sama
  // persis dengan DashboardAkademik.tsx. fakultas/programStudi TIDAK diisi
  // dari locked.* di sini (beda dari DashboardAkademik) karena endpoint
  // dosen tidak menerima dimensi itu sama sekali — mengisinya hanya akan
  // jadi state yang tidak pernah dipakai.
  useEffect(() => {
    if (!filterOptions) return;
    setFilter(current => ({
      ...current,
      tahunAjaran: filterOptions.tahun_ajaran[0]?.value ?? '',
    }));
  }, [filterOptions]);

  return (
    <div className="flex flex-col gap-4">

      <DosenStatsSection filter={filter} />

      <AkademikFilterBar
        filter={filter}
        onChange={setFilter}
        filterOptions={filterOptions}
        hideEntitasFilter
      />

      <Tabs defaultValue="info-umum" className="gap-0">

        <div className="bg-surface rounded-t-[14px] border border-border border-b-0 overflow-hidden">
          <TabsList className="bg-transparent justify-start rounded-none gap-0 h-auto p-0 px-5 overflow-x-auto">
            {TABS.map(t => (
              <TabsTrigger key={t.value} value={t.value} className={TAB_TRIGGER}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="bg-surface rounded-b-[14px] border border-border border-t-0 p-6">
          <TabsContent value="info-umum" className="mt-0">
            <TabInfoUmumDosen filter={filter} />
          </TabsContent>
          <TabsContent value="luaran" className="mt-0">
            <TabLuaranDosen filter={filter} />
          </TabsContent>
          <TabsContent value="penilaian" className="mt-0">
            <TabPenilaianDosen filter={filter} />
          </TabsContent>
          <TabsContent value="komentar" className="mt-0">
            <TabKomentarDosen filter={filter} />
          </TabsContent>
        </div>

      </Tabs>
    </div>
  );
}