import { Filter, X, Users } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button }    from '@/components/ui/button';
import { Badge }     from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  type WisudawanFilter,
  type PeriodeWisuda,
  type JenjangFilter,
  DEFAULT_WISUDAWAN_FILTER,
} from '@/features/dashboard/types';
import { TOTAL_RESPONDEN } from '@/features/dashboard/mocks/mockDataWisudawan';

// ─── Static options ───────────────────────────────────────────────────────────

const TAHUN_OPTIONS = [
  { value: 'semua',     label: 'Semua Tahun' },
  { value: '2024/2025', label: '2024/2025'   },
  { value: '2023/2024', label: '2023/2024'   },
  { value: '2022/2023', label: '2022/2023'   },
];

const PERIODE_OPTIONS: { value: PeriodeWisuda; label: string }[] = [
  { value: 'semua',    label: 'Semua Periode' },
  { value: 'april',   label: 'April'          },
  { value: 'agustus', label: 'Agustus'        },
  { value: 'oktober', label: 'Oktober'        },
];

const JENJANG_OPTIONS: JenjangFilter[] = ['S1', 'S2', 'S3', 'Profesi'];

const FAKULTAS_OPTIONS = [
  { value: 'semua', label: 'Semua Fakultas' },
  { value: 'STEI',  label: 'STEI'  },
  { value: 'FTI',   label: 'FTI'   },
  { value: 'FITB',  label: 'FITB'  },
  { value: 'FMIPA', label: 'FMIPA' },
  { value: 'FTMD',  label: 'FTMD'  },
  { value: 'FTSL',  label: 'FTSL'  },
  { value: 'FTTM',  label: 'FTTM'  },
  { value: 'SAPPK', label: 'SAPPK' },
  { value: 'SF',    label: 'SF'    },
  { value: 'SBM',   label: 'SBM'   },
  { value: 'FSRD',  label: 'FSRD'  },
  { value: 'SITH',  label: 'SITH'  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold text-neutral uppercase tracking-wide whitespace-nowrap shrink-0">
      {children}
    </span>
  );
}

const PILL_CLASS =
  'h-7 px-2.5 text-[12px] rounded-md border border-border-mid bg-surface ' +
  'text-text-mid font-normal ' +
  'data-[state=on]:bg-primary data-[state=on]:text-white data-[state=on]:border-primary ' +
  'data-[state=on]:font-semibold hover:bg-active transition-colors duration-150';

// ─── Props ────────────────────────────────────────────────────────────────────

interface WisudawanFilterBarProps {
  filter:   WisudawanFilter;
  onChange: (f: WisudawanFilter) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WisudawanFilterBar({ filter, onChange }: WisudawanFilterBarProps) {
  const activeCount = [
    filter.tahun    !== 'semua',
    filter.periode  !== 'semua',
    filter.jenjang.length > 0,
    filter.fakultas !== 'semua',
  ].filter(Boolean).length;

  return (
    <div className="bg-surface rounded-xl border border-border px-4 py-3 flex items-center gap-2.5 flex-wrap">

      {/* Icon + label */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Filter className="h-3.5 w-3.5 text-primary shrink-0" />
        <FilterLabel>Filter</FilterLabel>
      </div>

      <Separator orientation="vertical" className="h-5 shrink-0" />

      {/* Tahun */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Tahun</FilterLabel>
        <Select
          value={filter.tahun}
          onValueChange={v => onChange({ ...filter, tahun: v })}
        >
          <SelectTrigger className="h-7 text-[12px] border-border-mid min-w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAHUN_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value} className="text-[12px]">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-5 shrink-0" />

      {/* Periode wisuda — single select pills */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Periode</FilterLabel>
        <ToggleGroup
          type="single"
          value={filter.periode}
          onValueChange={v =>
            v && onChange({ ...filter, periode: v as PeriodeWisuda })
          }
          className="gap-1"
        >
          {PERIODE_OPTIONS.map(p => (
            <ToggleGroupItem
              key={p.value}
              value={p.value}
              className={PILL_CLASS}
            >
              {p.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Separator orientation="vertical" className="h-5 shrink-0" />

      {/* Jenjang — multi select pills */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Jenjang</FilterLabel>
        <ToggleGroup
          type="multiple"
          value={filter.jenjang}
          onValueChange={v =>
            onChange({ ...filter, jenjang: v as JenjangFilter[] })
          }
          className="gap-1"
        >
          {JENJANG_OPTIONS.map(j => (
            <ToggleGroupItem key={j} value={j} className={PILL_CLASS}>
              {j}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <Separator orientation="vertical" className="h-5 shrink-0" />

      {/* Fakultas */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Fakultas</FilterLabel>
        <Select
          value={filter.fakultas}
          onValueChange={v => onChange({ ...filter, fakultas: v })}
        >
          <SelectTrigger className="h-7 text-[12px] border-border-mid min-w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FAKULTAS_OPTIONS.map(o => (
              <SelectItem key={o.value} value={o.value} className="text-[12px]">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Responden count */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
        <span className="text-[11.5px] text-neutral">
          <Users className="inline h-3 w-3 mr-1 mb-px" />
          {TOTAL_RESPONDEN.toLocaleString('id')} responden
        </span>
      </div>

      {/* Active badge + reset */}
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
            onClick={() => onChange(DEFAULT_WISUDAWAN_FILTER)}
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