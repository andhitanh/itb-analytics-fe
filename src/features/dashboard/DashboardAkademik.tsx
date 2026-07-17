// src/features/dashboard/DashboardAkademik.tsx
import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AkademikFilterBar }    from './components/akademik/AkademikFilterBar';
import { AkademikStatsSection } from './components/akademik/sections/AkademikStatsSection';
import { Breadcrumb }           from './components/shared-layouts/Breadcrumb';
import TabInfoUmum    from './components/akademik/TabInfoUmum';
import TabLuaran      from './components/akademik/TabLuaran';
import TabPelaksanaan from './components/akademik/TabPelaksanaan';
import TabKomentar    from './components/akademik/TabKomentar';
import { useFilterOptions } from './hooks/useFilterOptions';
import { useStatsOverview } from './hooks/useStatsOverview';
import {
  type AkademikFilter,
  DEFAULT_AKADEMIK_FILTER,
} from './types';
import type { AkademikFilterOptionsResponse } from './api/akademik';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'info-umum',   label: 'Informasi Umum'          },
  { value: 'luaran',      label: 'Luaran Mata Kuliah'      },
  { value: 'pelaksanaan', label: 'Pelaksanaan Perkuliahan' },
  { value: 'komentar',    label: 'Ringkasan Komentar'      },
];

const TAB_TRIGGER = cn(
  'px-4 py-[14px] rounded-none border-b-2 border-transparent bg-transparent shadow-none',
  'text-[13px] font-medium whitespace-nowrap transition-colors duration-150',
  'data-[state=inactive]:text-neutral',
  'data-[state=active]:border-b-primary data-[state=active]:border-x-transparent data-[state=active]:border-t-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:font-bold',
  'hover:text-text-dark',
);

// ─── Filter Summary Pill ──────────────────────────────────────────────────────

interface FilterSummaryPillProps {
  filter:        AkademikFilter;
  filterOptions: AkademikFilterOptionsResponse | null;
}

function FilterSummaryPill({ filter, filterOptions }: FilterSummaryPillProps) {
  const semesterLabel = useMemo(() => {
    if (!filterOptions) return {};
    return Object.fromEntries(filterOptions.semester.map(s => [s.value, s.label]));
  }, [filterOptions]);

  const jenjangLabel = useMemo(() => {
    if (!filterOptions) return {};
    return Object.fromEntries(filterOptions.jenjang.map(j => [j.value, j.label]));
  }, [filterOptions]);

  const prodiLabels = useMemo(() => {
    if (!filterOptions || filter.programStudi.length === 0) return [];
    const allProdi = Object.values(filterOptions.prodi_by_fakultas).flat();
    return filter.programStudi
      .map(v => allProdi.find(p => p.value === v)?.label ?? v);
  }, [filterOptions, filter.programStudi]);

  const parts: string[] = [];
  if (filter.tahunAjaran)              parts.push(filter.tahunAjaran);
  if (filter.semester.length > 0)      parts.push(filter.semester.map(s => semesterLabel[s] ?? s).join(', '));
  if (filter.jenjang.length > 0)       parts.push(filter.jenjang.map(j => jenjangLabel[j] ?? j).join(', '));
  if (filter.fakultas.length > 0)      parts.push(filter.fakultas.join(', '));
  if (prodiLabels.length > 0)          parts.push(prodiLabels.join(', '));

  if (parts.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 bg-active rounded-full px-3 py-1 border border-[#D6E4F5] shrink-0">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M1 3h10M3 6h6M5 9h2" stroke="#003366" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="text-[11px] font-medium text-primary whitespace-nowrap">
        {parts.join(' · ')}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardAkademik() {
  const { data: filterOptions } = useFilterOptions();
  const [filter, setFilter] = useState<AkademikFilter>(DEFAULT_AKADEMIK_FILTER);
  const { data: stats, isLoading: statsLoading } = useStatsOverview(filter);

  // Inisialisasi filter dari API: jalankan sekali saat filterOptions pertama kali tiba
  useEffect(() => {
    if (!filterOptions) return;
    const { locked, tahun_ajaran } = filterOptions;
    setFilter({
      tahunAjaran:  tahun_ajaran[0]?.value ?? '',
      semester:     [],
      jenjang:      [],
      fakultas:     locked.fakultas ? [locked.fakultas] : [],
      programStudi: locked.prodi    ? [locked.prodi]    : [],
    });
  }, [filterOptions]);

  // Drill-down murni reuse state filter yang sudah ada — bukan state baru.
  // Cuma relevan untuk Direktorat (locked.fakultas null); untuk Dekan/Kaprodi
  // filter.fakultas/programStudi sudah dikunci RLS, breadcrumb tidak muncul
  // karena locked.fakultas pasti terisi (bukan null) untuk mereka. Drill-down
  // tetap merepresentasikan 1 fakultas tunggal (array 1 elemen).
  const isDrilledManually = filterOptions?.locked.fakultas === null && filter.fakultas.length === 1;
  const drilledLabel = isDrilledManually
    ? filterOptions?.fakultas.find(f => f.value === filter.fakultas[0])?.label ?? filter.fakultas[0]
    : null;

  const handleDrill = (kode: string) => {
    setFilter({ ...filter, fakultas: [kode], programStudi: [] });
  };

  const handleDrillUp = () => {
    setFilter({ ...filter, fakultas: [], programStudi: [] });
  };

  return (
    <div className="flex flex-col gap-4">

      <AkademikStatsSection data={stats} isLoading={statsLoading} />

      <AkademikFilterBar
        filter={filter}
        onChange={setFilter}
        filterOptions={filterOptions}
      />

      {isDrilledManually && (
        <Breadcrumb
          root="Semua fakultas"
          current={drilledLabel!}
          onBack={handleDrillUp}
        />
      )}

      <Tabs defaultValue="info-umum" className="gap-0">

        <div className="bg-surface rounded-t-[14px] border border-border border-b-0 overflow-hidden">
          <div className="flex items-center justify-between px-5">
            <TabsList className="bg-transparent justify-start rounded-none gap-0 h-auto p-0 flex-1 overflow-x-auto">
              {TABS.map(t => (
                <TabsTrigger key={t.value} value={t.value} className={TAB_TRIGGER}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <FilterSummaryPill filter={filter} filterOptions={filterOptions} />
          </div>
        </div>

        <div className="bg-surface rounded-b-[14px] border border-border border-t-0 p-6">
          <TabsContent value="info-umum"   className="mt-0">
            <TabInfoUmum    filter={filter} onDrill={handleDrill} />
          </TabsContent>
          <TabsContent value="luaran"      className="mt-0">
            <TabLuaran      filter={filter} onDrill={handleDrill} />
          </TabsContent>
          <TabsContent value="pelaksanaan" className="mt-0">
            <TabPelaksanaan filter={filter} onDrill={handleDrill} />
          </TabsContent>
          <TabsContent value="komentar"    className="mt-0">
            <TabKomentar    filter={filter} />
          </TabsContent>
        </div>

      </Tabs>
    </div>
  );
}