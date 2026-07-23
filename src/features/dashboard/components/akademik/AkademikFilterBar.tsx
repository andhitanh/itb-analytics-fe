// src/features/dashboard/components/akademik/AkademikFilterBar.tsx
import { useMemo } from 'react';
import { Filter, X, Lock } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button }    from '@/components/ui/button';
import { Badge }     from '@/components/ui/badge';
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
} from '@/components/ui/tooltip';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import {
  type AkademikFilter,
  type JenjangFilter,
  DEFAULT_AKADEMIK_FILTER,
} from '@/features/dashboard/types';
import type { AkademikFilterOptionsResponse } from '@/features/dashboard/api/akademik';
import { cn } from '@/lib/utils';

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold text-neutral uppercase tracking-wide whitespace-nowrap shrink-0">
      {children}
    </span>
  );
}

function LockedLabel({ label, reason }: { label: string; reason: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 h-8 px-2.5 text-[12px] rounded-md border border-border-mid bg-active text-primary font-semibold cursor-help min-w-[150px]">
            <Lock className="h-3 w-3 shrink-0" />
            {label}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[11.5px] max-w-[220px]">
          {reason}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AkademikFilterBarProps {
  filter:        AkademikFilter;
  onChange:      (f: AkademikFilter) => void;
  filterOptions: AkademikFilterOptionsResponse | null;
  /**
   * true untuk dashboard dosen — scope-nya sudah terkunci ke dosen_id di
   * backend (bukan fakultas/prodi), jadi dropdown Fakultas & Program Studi
   * tidak relevan ditampilkan sama sekali (bukan sekadar dikunci/disabled,
   * tapi memang bukan dimensi yang dipakai endpoint dosen). Default false
   * supaya DashboardAkademik.tsx (kaprodi/dekan/direktorat) tidak berubah
   * perilakunya sama sekali.
   */
  hideEntitasFilter?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AkademikFilterBar({
  filter,
  onChange,
  filterOptions,
  hideEntitasFilter = false,
}: AkademikFilterBarProps) {
  const isLoading = filterOptions === null;
  const locked    = filterOptions?.locked ?? { fakultas: null, prodi: null };

  // Prodi yang tampil: union prodi dari seluruh fakultas terpilih (atau semua
  // fakultas kalau belum ada yang dipilih), lalu disaring oleh jenjang aktif.
  const prodiOptions = useMemo(() => {
    if (!filterOptions) return [];
    const fakultasKeys = filter.fakultas.length > 0
      ? filter.fakultas
      : Object.keys(filterOptions.prodi_by_fakultas);
    const merged = fakultasKeys.flatMap(fk => filterOptions.prodi_by_fakultas[fk] ?? []);
    if (filter.jenjang.length === 0) return merged;
    return merged.filter(p => filter.jenjang.includes(p.kd_strata as JenjangFilter));
  }, [filterOptions, filter.fakultas, filter.jenjang]);

  // Label untuk prodi yang terkunci (tampilkan nama, bukan no_ps)
  const lockedProdiLabel = useMemo(() => {
    if (!locked.prodi || !filterOptions) return null;
    for (const prodiList of Object.values(filterOptions.prodi_by_fakultas)) {
      const found = prodiList.find(p => p.value === locked.prodi);
      if (found) return found.label;
    }
    return locked.prodi;
  }, [locked.prodi, filterOptions]);

  // Label untuk fakultas yang terkunci
  const lockedFakLabel = useMemo(() => {
    if (!locked.fakultas || !filterOptions) return null;
    return filterOptions.fakultas.find(f => f.value === locked.fakultas)?.label
      ?? locked.fakultas;
  }, [locked.fakultas, filterOptions]);

  const activeCount = [
    filter.semester !== 'semua',
    filter.jenjang.length      > 0,
    filter.fakultas.length     > 0,
    filter.programStudi.length > 0,
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border px-4 py-3 flex flex-col gap-3 animate-pulse">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-[140px] rounded-md bg-border-mid" />
          <div className="h-8 w-[140px] rounded-md bg-border-mid" />
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="h-8 rounded-md bg-border-mid" />
          <div className="h-8 rounded-md bg-border-mid" />
          <div className="h-8 rounded-md bg-border-mid" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border px-4 py-3.5 flex flex-col gap-3">

      {/* Baris 1: Tahun Ajaran & Semester — single-select, sejajar, terpisah dari filter multi-select */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="h-3.5 w-3.5 text-primary shrink-0" />
            <FilterLabel>Filter</FilterLabel>
          </div>
          <div className="flex items-center gap-1.5">
            <FilterLabel>Tahun Ajaran</FilterLabel>
            <Select
              value={filter.tahunAjaran}
              onValueChange={v => onChange({ ...filter, tahunAjaran: v, programStudi: [] })}
            >
              <SelectTrigger className="h-8 text-[12px] border-border-mid min-w-[140px]">
                <SelectValue placeholder="Memuat..." />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.tahun_ajaran.map(o => (
                  <SelectItem key={o.value} value={o.value} className="text-[12px]">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <FilterLabel>Semester</FilterLabel>
            <Select
              value={filter.semester}
              onValueChange={v => onChange({ ...filter, semester: v })}
            >
              <SelectTrigger className="h-8 text-[12px] border-border-mid min-w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua" className="text-[12px]">Semua Semester</SelectItem>
                {filterOptions.semester.map(o => (
                  <SelectItem key={o.value} value={o.value} className="text-[12px]">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeCount > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="secondary"
              className="bg-active text-primary border-0 gap-1.5 px-2.5 py-1 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {activeCount} filter aktif
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ ...DEFAULT_AKADEMIK_FILTER, tahunAjaran: filter.tahunAjaran })}
              className="h-7 px-2.5 text-[12px] text-danger hover:text-danger hover:bg-[#FEF2F2] gap-1"
            >
              <X className="h-3 w-3" />
              Reset
            </Button>
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Baris 2: Jenjang selalu tampil. Fakultas & Program Studi hanya untuk
          role non-dosen — lihat dokumentasi prop hideEntitasFilter di atas. */}
      <div
        className={cn(
          'grid gap-2.5',
          hideEntitasFilter ? 'grid-cols-1 max-w-[240px]' : 'grid-cols-3',
        )}
      >

        <MultiSelectDropdown
          label="Jenjang"
          options={filterOptions.jenjang}
          selected={filter.jenjang}
          onChange={v => onChange({ ...filter, jenjang: v as JenjangFilter[], programStudi: [] })}
        />

        {!hideEntitasFilter && (
          <>
            {locked.fakultas ? (
              <div className="flex items-center gap-1.5">
                <LockedLabel
                  label={lockedFakLabel ?? locked.fakultas}
                  reason="Tampilan Anda dikunci ke fakultas ini sesuai wewenang akun Anda."
                />
              </div>
            ) : (
              <MultiSelectDropdown
                label="Fakultas"
                options={filterOptions.fakultas}
                selected={filter.fakultas}
                onChange={v => onChange({ ...filter, fakultas: v, programStudi: [] })}
              />
            )}

            {locked.prodi ? (
              <div className="flex items-center gap-1.5">
                <LockedLabel
                  label={lockedProdiLabel ?? locked.prodi}
                  reason="Tampilan Anda dikunci ke program studi ini sesuai wewenang akun Anda."
                />
              </div>
            ) : (
              <MultiSelectDropdown
                label="Program Studi"
                options={prodiOptions}
                selected={filter.programStudi}
                onChange={v => onChange({ ...filter, programStudi: v })}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}