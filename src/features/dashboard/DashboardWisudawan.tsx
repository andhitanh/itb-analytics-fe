import { useState }  from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WisudawanFilterBar }  from './components/wisudawan/WisudawanFilterBar';
import TabWisInfoUmum     from './components/wisudawan/TabWisInfoUmum';
import TabWisFasilitas    from './components/wisudawan/TabWisFasilitas';
import TabWisProdi        from './components/wisudawan/TabWisProdi';
import TabWisDevDiri      from './components/wisudawan/TabWisDevDiri';
import TabWisPermasalahan from './components/wisudawan/TabWisPermasalahan';
import TabWisSuara        from './components/wisudawan/TabWisSuara';
import {
  type WisudawanFilter,
  type PeriodeWisuda,
  DEFAULT_WISUDAWAN_FILTER,
} from './types';
import { cn } from '@/lib/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { value: 'info-umum',    label: 'Informasi Umum'        },
  { value: 'fasilitas',    label: 'Penyediaan Fasilitas'  },
  { value: 'prodi',        label: 'Layanan Program Studi' },
  { value: 'dev-diri',     label: 'Pengembangan Diri'     },
  { value: 'permasalahan', label: 'Permasalahan Studi'    },
  { value: 'suara',        label: 'Suara Wisudawan'       },
];

const TAB_TRIGGER = cn(
  'px-4 py-[14px] rounded-none border-b-2 border-transparent bg-transparent shadow-none',
  'text-[13px] font-medium whitespace-nowrap transition-colors duration-150',
  'data-[state=inactive]:text-neutral',
    'data-[state=active]:border-b-primary data-[state=active]:border-x-transparent data-[state=active]:border-t-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:font-bold',
  'hover:text-text-dark',
);

// ─── Filter Summary Pill ──────────────────────────────────────────────────────

const PERIODE_LABELS: Record<PeriodeWisuda, string> = {
  semua: '', april: 'April', agustus: 'Agustus', oktober: 'Oktober',
};

function FilterSummaryPill({ filter }: { filter: WisudawanFilter }) {
  const parts: string[] = [];
  if (filter.tahun    !== 'semua') parts.push(filter.tahun);
  if (filter.periode  !== 'semua') parts.push(PERIODE_LABELS[filter.periode]);
  if (filter.jenjang.length > 0)   parts.push(filter.jenjang.join(', '));
  if (filter.fakultas !== 'semua') parts.push(filter.fakultas);

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

export default function DashboardWisudawan() {
  const [filter, setFilter] = useState<WisudawanFilter>(DEFAULT_WISUDAWAN_FILTER);

  return (
    <div className="flex flex-col gap-4">

      {/* Filter bar */}
      <WisudawanFilterBar filter={filter} onChange={setFilter} />

      {/* Tab section */}
      <Tabs defaultValue="info-umum" className="gap-0">

        {/* Tab nav */}
        <div className="bg-surface rounded-t-[14px] border border-border border-b-0 overflow-hidden">
          <div className="flex items-center justify-between px-5">
            <TabsList className="bg-transparent justify-start rounded-none gap-0 h-auto p-0 flex-1 overflow-x-auto">
              {TABS.map(t => (
                <TabsTrigger key={t.value} value={t.value} className={TAB_TRIGGER}>
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <FilterSummaryPill filter={filter} />
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-surface rounded-b-[14px] border border-border border-t-0 p-6">
          <TabsContent value="info-umum"    className="mt-0">
            <TabWisInfoUmum     filter={filter} />
          </TabsContent>
          <TabsContent value="fasilitas"    className="mt-0">
            <TabWisFasilitas    filter={filter} />
          </TabsContent>
          <TabsContent value="prodi"        className="mt-0">
            <TabWisProdi        filter={filter} />
          </TabsContent>
          <TabsContent value="dev-diri"     className="mt-0">
            <TabWisDevDiri      filter={filter} />
          </TabsContent>
          <TabsContent value="permasalahan" className="mt-0">
            <TabWisPermasalahan filter={filter} />
          </TabsContent>
          <TabsContent value="suara"        className="mt-0">
            <TabWisSuara        filter={filter} />
          </TabsContent>
        </div>

      </Tabs>
    </div>
  );
}