// src/features/dashboard/DashboardAkademik.tsx
import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AkademikFilterBar }    from './components/akademik/AkademikFilterBar';
import { AkademikStatsSection } from './components/akademik/sections/AkademikStatsSection';
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
  // Buat lookup label dari options — stabil selama filterOptions tidak berubah
  const semesterLabel = useMemo(() => {
    if (!filterOptions) return {};
    return Object.fromEntries(filterOptions.semester.map(s => [s.value, s.label]));
  }, [filterOptions]);

  const jenjangLabel = useMemo(() => {
    if (!filterOptions) return {};
    return Object.fromEntries(filterOptions.jenjang.map(j => [j.value, j.label]));
  }, [filterOptions]);

  const prodiLabel = useMemo(() => {
    if (!filterOptions || filter.programStudi === 'semua') return null;
    const byFak = filterOptions.prodi_by_fakultas[filter.fakultas] ?? [];
    return byFak.find(p => p.value === filter.programStudi)?.label ?? null;
  }, [filterOptions, filter.programStudi, filter.fakultas]);

  const parts: string[] = [];
  if (filter.tahunAjaran  !== 'semua') parts.push(filter.tahunAjaran);
  if (filter.semester     !== 'semua') parts.push(semesterLabel[filter.semester] ?? filter.semester);
  if (filter.jenjang.length > 0)       parts.push(filter.jenjang.map(j => jenjangLabel[j] ?? j).join(', '));
  if (filter.fakultas     !== 'semua') parts.push(filter.fakultas);
  if (prodiLabel)                       parts.push(prodiLabel);

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
      tahunAjaran:  tahun_ajaran[0]?.value ?? 'semua',
      semester:     'semua',
      jenjang:      [],
      fakultas:     locked.fakultas ?? 'semua',
      programStudi: locked.prodi    ?? 'semua',
    });
  }, [filterOptions]);

  return (
    <div className="flex flex-col gap-4">

      <AkademikStatsSection data={stats} isLoading={statsLoading} />

      <AkademikFilterBar
        filter={filter}
        onChange={setFilter}
        filterOptions={filterOptions}
      />

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
          <TabsContent value="info-umum"   className="mt-0"><TabInfoUmum    filter={filter} /></TabsContent>
          <TabsContent value="luaran"      className="mt-0"><TabLuaran      filter={filter} /></TabsContent>
          <TabsContent value="pelaksanaan" className="mt-0"><TabPelaksanaan filter={filter} /></TabsContent>
          <TabsContent value="komentar"    className="mt-0"><TabKomentar    filter={filter} /></TabsContent>
        </div>

      </Tabs>
    </div>
  );
}