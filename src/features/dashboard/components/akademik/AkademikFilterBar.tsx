import { useMemo }                 from 'react';
import { Filter, X }               from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button }                  from '@/components/ui/button';
import { Badge }                   from '@/components/ui/badge';
import { Separator }               from '@/components/ui/separator';
import {
  type AkademikFilter,
  type SemesterFilter,
  type JenjangFilter,
  DEFAULT_AKADEMIK_FILTER,
} from '@/features/dashboard/types';

// ─── Static options ───────────────────────────────────────────────────────────

const TAHUN_OPTIONS = [
  { value: 'semua',     label: 'Semua Tahun' },
  { value: '2025/2026', label: '2025/2026'   },
  { value: '2024/2025', label: '2024/2025'   },
  { value: '2023/2024', label: '2023/2024'   },
  { value: '2022/2023', label: '2022/2023'   },
];

const SEMESTER_OPTIONS: { value: SemesterFilter; label: string }[] = [
  { value: 'semua',  label: 'Semua'  },
  { value: 'gasal',  label: 'Gasal'  },
  { value: 'genap',  label: 'Genap'  },
  { value: 'pendek', label: 'Pendek' },
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

const PRODI_BY_FAKULTAS: Record<string, { value: string; label: string }[]> = {
  STEI:  [
    { value: 'IF',  label: 'Teknik Informatika'           },
    { value: 'EL',  label: 'Teknik Elektro'               },
    { value: 'STI', label: 'Sistem & Teknologi Informasi' },
  ],
  FTI:   [
    { value: 'TK',  label: 'Teknik Kimia'                },
    { value: 'TF',  label: 'Teknik Fisika'               },
    { value: 'TI',  label: 'Teknik Industri'             },
    { value: 'MRI', label: 'Manajemen Rekayasa Industri' },
  ],
  FITB:  [
    { value: 'GL',  label: 'Teknik Geologi'             },
    { value: 'GD',  label: 'Teknik Geodesi & Geomatika' },
    { value: 'MET', label: 'Meteorologi'                },
    { value: 'OS',  label: 'Oseanografi'                },
  ],
  FMIPA: [
    { value: 'MA',  label: 'Matematika' },
    { value: 'FI',  label: 'Fisika'     },
    { value: 'KI',  label: 'Kimia'      },
    { value: 'AS',  label: 'Astronomi'  },
    { value: 'AK',  label: 'Aktuaria'   },
  ],
  FTMD:  [
    { value: 'MS',  label: 'Teknik Mesin'      },
    { value: 'AE',  label: 'Teknik Dirgantara' },
    { value: 'MT',  label: 'Teknik Material'   },
  ],
  FTSL:  [
    { value: 'SI',  label: 'Teknik Sipil'      },
    { value: 'TL',  label: 'Teknik Lingkungan' },
    { value: 'KL',  label: 'Teknik Kelautan'   },
  ],
  FTTM:  [
    { value: 'TA',  label: 'Teknik Pertambangan' },
    { value: 'TM',  label: 'Teknik Perminyakan'  },
    { value: 'MN',  label: 'Teknik Metalurgi'    },
    { value: 'GF',  label: 'Teknik Geofisika'    },
  ],
  SAPPK: [
    { value: 'PL',  label: 'Perencanaan Wilayah & Kota' },
    { value: 'AR',  label: 'Arsitektur'                 },
  ],
  SF:    [
    { value: 'FK',  label: 'Farmasi Klinik & Komunitas' },
    { value: 'ST',  label: 'Sains & Teknologi Farmasi'  },
  ],
  SBM:   [
    { value: 'MG',  label: 'Manajemen'     },
    { value: 'KW',  label: 'Kewirausahaan' },
  ],
  FSRD:  [
    { value: 'DP',  label: 'Desain Produk'           },
    { value: 'DKV', label: 'Desain Komunikasi Visual' },
    { value: 'KR',  label: 'Kriya'                   },
    { value: 'SR',  label: 'Seni Rupa'               },
  ],
  SITH:  [
    { value: 'RH',  label: 'Rekayasa Hayati'    },
    { value: 'RP',  label: 'Rekayasa Pertanian' },
    { value: 'RK',  label: 'Rekayasa Kehutanan' },
    { value: 'BI',  label: 'Biologi'            },
  ],
};

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

interface AkademikFilterBarProps {
  filter:   AkademikFilter;
  onChange: (f: AkademikFilter) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AkademikFilterBar({ filter, onChange }: AkademikFilterBarProps) {
  const prodiOptions = useMemo(() => {
    if (filter.fakultas === 'semua') return [];
    return PRODI_BY_FAKULTAS[filter.fakultas] ?? [];
  }, [filter.fakultas]);

  const activeCount = [
    filter.tahunAjaran  !== 'semua',
    filter.semester     !== 'semua',
    filter.jenjang.length > 0,
    filter.fakultas     !== 'semua',
    filter.programStudi !== 'semua',
  ].filter(Boolean).length;

  return (
    <div className="bg-surface rounded-xl border border-border px-4 py-3 flex items-center gap-2.5 flex-wrap">

      {/* Icon + label */}
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
          onValueChange={v =>
            onChange({ ...filter, tahunAjaran: v, programStudi: 'semua' })
          }
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

      {/* Semester — single select pills */}
      <div className="flex items-center gap-1.5">
        <FilterLabel>Semester</FilterLabel>
        <ToggleGroup
          type="single"
          value={filter.semester}
          onValueChange={v =>
            v && onChange({ ...filter, semester: v as SemesterFilter })
          }
          className="gap-1"
        >
          {SEMESTER_OPTIONS.map(s => (
            <ToggleGroupItem
              key={s.value}
              value={s.value}
              className={PILL_CLASS}
            >
              {s.label}
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
          onValueChange={v =>
            onChange({ ...filter, fakultas: v, programStudi: 'semua' })
          }
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

      {/* Program Studi — muncul hanya jika fakultas dipilih */}
      {filter.fakultas !== 'semua' && (
        <>
          <Separator orientation="vertical" className="h-5 shrink-0" />
          <div className="flex items-center gap-1.5">
            <FilterLabel>Prodi</FilterLabel>
            <Select
              value={filter.programStudi}
              onValueChange={v => onChange({ ...filter, programStudi: v })}
            >
              <SelectTrigger className="h-7 text-[12px] border-border-mid min-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua" className="text-[12px]">
                  Semua Program Studi
                </SelectItem>
                {prodiOptions.map(o => (
                  <SelectItem key={o.value} value={o.value} className="text-[12px]">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

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