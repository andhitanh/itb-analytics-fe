// src/features/dashboard/components/dosen/DosenKelasTable.tsx
import { useState } from 'react';
import { useDosenKelas } from '@/features/dashboard/hooks/dosen/useDosenKelas';
import type { AkademikFilter } from '@/features/dashboard/types';
import type { DosenKelasItem } from '@/features/dashboard/api/dosen';

type SortableKey = Extract <
  keyof DosenKelasItem,
  'jumlah_mahasiswa' | 'avg_ip' | 'avg_skor_overall' | 'pct_kehadiran_dosen' | 'pct_kehadiran_mahasiswa'
>;

const SORTABLE_COLUMNS: { key: SortableKey; label: string }[] = [
  { key: 'jumlah_mahasiswa',        label: 'Jumlah Mhs' },
  { key: 'avg_ip',                  label: 'Rata-Rata IP' },
  { key: 'avg_skor_overall',        label: 'Rata-Rata Q1-Q12' },
  { key: 'pct_kehadiran_dosen',     label: '% Kehadiran Dosen' },
  { key: 'pct_kehadiran_mahasiswa', label: '% Kehadiran Mhs' },
];

interface DosenKelasTableProps {
  filter: AkademikFilter;
}

export function DosenKelasTable({ filter }: DosenKelasTableProps) {
  const { data, isLoading } = useDosenKelas(filter);
  const [sortKey,  setSortKey]  = useState<SortableKey>('jumlah_mahasiswa');
  const [sortDesc, setSortDesc] = useState(true);

  const items = [...(data?.items ?? [])].sort((a, b) => {
    const valueA = a[sortKey] ?? -Infinity;
    const valueB = b[sortKey] ?? -Infinity;
    return sortDesc ? valueB - valueA : valueA - valueB;
  });

  function toggleSort(key: SortableKey) {
    if (key === sortKey) {
      setSortDesc(current => !current);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center text-[12px] text-neutral">
        Memuat data…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-[13px] text-neutral text-center px-6">
        Belum ada kelas yang diampu pada periode ini.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px] border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="text-left py-2 px-2.5 text-neutral font-semibold whitespace-nowrap">
              Kode MK
            </th>
            <th scope="col" className="text-left py-2 px-2.5 text-neutral font-semibold">
              Nama MK
            </th>
            <th scope="col" className="text-left py-2 px-2.5 text-neutral font-semibold whitespace-nowrap">
              Kelas
            </th>
            {SORTABLE_COLUMNS.map(col => (
              <th
                key={col.key}
                scope="col"
                onClick={() => toggleSort(col.key)}
                className="text-right py-2 px-2.5 text-neutral font-semibold whitespace-nowrap cursor-pointer select-none hover:text-text-dark transition-colors"
              >
                {col.label}
                <span className="inline-block w-3 ml-0.5 text-primary">
                  {sortKey === col.key ? (sortDesc ? '↓' : '↑') : ''}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr
              key={item.kelas_id}
              className="border-b border-border last:border-0 hover:bg-active transition-colors"
            >
              <td className="py-2 px-2.5 font-medium text-text-dark whitespace-nowrap">
                {item.kode_matkul}
              </td>
              <td className="py-2 px-2.5 text-text-dark">{item.nama_matkul_id}</td>
              <td className="py-2 px-2.5 text-neutral whitespace-nowrap">
                K{item.no_kelas}
              </td>
              <td className="py-2 px-2.5 text-right text-text-dark">
                {item.jumlah_mahasiswa}
              </td>
              <DeltaCell value={item.avg_ip} prev={item.prev_avg_ip} decimals={2} />
              <DeltaCell value={item.avg_skor_overall} prev={item.prev_avg_skor_overall} decimals={2} />
              <PercentCell value={item.pct_kehadiran_dosen} />
              <PercentCell value={item.pct_kehadiran_mahasiswa} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Sel dengan delta (panah + warna, bukan warna saja) ────────────────────────

interface DeltaCellProps {
  value:    number | null;
  prev:     number | null;
  decimals: number;
}

function DeltaCell({ value, prev, decimals }: DeltaCellProps) {
  if (value == null) {
    return <td className="py-2 px-2.5 text-right text-neutral">—</td>;
  }

  const delta = prev != null ? value - prev : null;
  const isSignificant = delta != null && Math.abs(delta) >= 0.01;

  return (
    <td className="py-2 px-2.5 text-right text-text-dark whitespace-nowrap">
      {value.toFixed(decimals)}
      {isSignificant && (
        <span className={delta! > 0 ? 'text-success ml-1 text-[11px]' : 'text-danger ml-1 text-[11px]'}>
          {delta! > 0 ? '↑' : '↓'}
          {Math.abs(delta!).toFixed(decimals)}
        </span>
      )}
    </td>
  );
}

function PercentCell({ value }: { value: number | null }) {
  return (
    <td className="py-2 px-2.5 text-right text-text-dark whitespace-nowrap">
      {value == null ? '—' : `${value.toFixed(0)}%`}
    </td>
  );
}