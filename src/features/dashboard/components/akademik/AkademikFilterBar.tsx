// src/features/dashboard/components/akademik/AkademikFilterBar.tsx
import { useMemo } from 'react';
import { Filter, X, Lock } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button }    from '@/components/ui/button';
import { Badge }     from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  type AkademikFilter,
  type SemesterFilter,
  type JenjangFilter,
  DEFAULT_AKADEMIK_FILTER,
} from '@/features/dashboard/types';
import type { AkademikFilterOptionsResponse } from '@/features/dashboard/api/akademik';

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold text-neutral uppercase tracking-wide whitespace-nowrap shrink-0">
      {children}
    </span>
  );
}

function LockedLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 h-7 px-2.5 text-[12px] rounded-md border border-border-mid bg-active text-primary font-semibold">
      <Lock className="h-3 w-3 shrink-0" />
      {label}
    </div>
  );
}

const PILL_CLASS =
  'h-7 px-2.5 text-[12px] rounded-md border border-border-mid bg-surface ' +
  'text-text-mid font-normal ' +
  'data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:border-primary ' +
  'data-[state=on]:font-semibold hover:bg-active transition-colors duration-150 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AkademikFilterBarProps {
  filter:        AkademikFilter;
  onChange:      (f: AkademikFilter) => void;
  filterOptions: AkademikFilterOptionsResponse | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AkademikFilterBar({ filter, onChange, filterOptions }: AkademikFilterBarProps) {
  const isLoading = filterOptions === null;
  const locked    = filterOptions?.locked ?? { fakultas: null, prodi: null };

  // Prodi yang tampil: filter by fakultas aktif, lalu filter by jenjang aktif jika ada
  const prodiOptions = useMemo(() => {
    if (!filterOptions || filter.fakultas === 'semua') return [];
    const byFak = filterOptions.prodi_by_fakultas[filter.fakultas] ?? [];
    if (filter.jenjang.length === 0) return byFak;
    return byFak.filter(p => filter.jenjang.includes(p.kd_strata as JenjangFilter));
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
    filter.tahunAjaran  !== 'semua',
    filter.semester     !== 'semua',
    filter.jenjang.length > 0,
    filter.fakultas     !== 'semua',
    filter.programStudi !== 'semua',
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border px-4 py-3 flex items-center gap-2.5 h-[52px] animate-pulse">
        <div className="h-3.5 w-3.5 rounded bg-border-mid" />
        <div className="h-4 w-12 rounded bg-border-mid" />
        <div className="h-5 w-px bg-border-mid" />
        <div className="h-7 w-[130px] rounded-md bg-border-mid" />
        <div className="h-5 w-px bg-border-mid" />
        <div className="h-7 w-[200px] rounded-md bg-border-mid" />
        <div className="h-5 w-px bg-border-mid" />
        <div className="h-7 w-[160px] rounded-md bg-border-mid" />
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border px-4 py-3 flex items-center gap-2.5 flex-wrap">

      <div className="flex items-center gap-1.5 shrink-0">
        <Filter className="h-3.5 w-3.5 text-primary shrink-0" />
        <FilterLabel>Filter</FilterLabel>
      </div>

      <Separator orientation="vertical" className="h-5 shrink-0" />

      {/* Tahun ajaran */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Tahun</FilterLabel>
        <Select
          value={filter.tahunAjaran}
          onValueChange={v => onChange({ ...filter, tahunAjaran: v, programStudi: 'semua' })}
        >
          <SelectTrigger className="h-7 text-[12px] border-border-mid min-w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua" className="text-[12px]">Semua Tahun</SelectItem>
            {filterOptions.tahun_ajaran.map(o => (
              <SelectItem key={o.value} value={o.value} className="text-[12px]">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-5 shrink-0" />

      {/* Semester */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Semester</FilterLabel>
        <ToggleGroup
          type="single"
          value={filter.semester}
          onValueChange={v => v && onChange({ ...filter, semester: v as SemesterFilter })}
          className="gap-1"
        >
          <ToggleGroupItem value="semua" className={PILL_CLASS}>Semua</ToggleGroupItem>
          {filterOptions.semester.map(s => (
            <ToggleGroupItem key={s.value} value={s.value} className={PILL_CLASS}>
              {s.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Separator orientation="vertical" className="h-5 shrink-0" />

      {/* Jenjang */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Jenjang</FilterLabel>
        <ToggleGroup
          type="multiple"
          value={filter.jenjang}
          onValueChange={v => onChange({ ...filter, jenjang: v as JenjangFilter[], programStudi: 'semua' })}
          className="gap-1"
        >
          {filterOptions.jenjang.map(j => (
            <ToggleGroupItem key={j.value} value={j.value} className={PILL_CLASS}>
              {j.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Separator orientation="vertical" className="h-5 shrink-0" />

      {/* Fakultas — locked jika role dekan/kaprodi */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Fakultas</FilterLabel>
        {locked.fakultas ? (
          <LockedLabel label={lockedFakLabel ?? locked.fakultas} />
        ) : (
          <Select
            value={filter.fakultas}
            onValueChange={v => onChange({ ...filter, fakultas: v, programStudi: 'semua' })}
          >
            <SelectTrigger className="h-7 text-[12px] border-border-mid min-w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua" className="text-[12px]">Semua Fakultas</SelectItem>
              {filterOptions.fakultas.map(o => (
                <SelectItem key={o.value} value={o.value} className="text-[12px]">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Program Studi — muncul jika fakultas dipilih */}
      {filter.fakultas !== 'semua' && (
        <>
          <Separator orientation="vertical" className="h-5 shrink-0" />
          <div className="flex items-center gap-1.5">
            <FilterLabel>Prodi</FilterLabel>
            {locked.prodi ? (
              <LockedLabel label={lockedProdiLabel ?? locked.prodi} />
            ) : (
              <Select
                value={filter.programStudi}
                onValueChange={v => onChange({ ...filter, programStudi: v })}
              >
                <SelectTrigger className="h-7 text-[12px] border-border-mid min-w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua" className="text-[12px]">Semua Program Studi</SelectItem>
                  {prodiOptions.map(o => (
                    <SelectItem key={o.value} value={o.value} className="text-[12px]">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </>
      )}

      <div className="flex-1" />

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
            onClick={() => onChange(DEFAULT_AKADEMIK_FILTER)}
            className="h-7 px-2.5 text-[12px] text-danger hover:text-danger hover:bg-[#FEF2F2] gap-1"
          >
            <X className="h-3 w-3" />
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}