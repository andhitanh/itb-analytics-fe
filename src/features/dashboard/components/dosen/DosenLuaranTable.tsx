// src/features/dashboard/components/dosen/DosenLuaranTable.tsx
import { useDosenLuaran } from '@/features/dashboard/hooks/dosen/useDosenLuaran';
import type { AkademikFilter } from '@/features/dashboard/types';

interface DosenLuaranTableProps {
  filter: AkademikFilter;
}

export function DosenLuaranTable({ filter }: DosenLuaranTableProps) {
  const { data, isLoading } = useDosenLuaran(filter);
  const items = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="h-32 flex items-center justify-center text-[12px] text-neutral">
        Memuat data…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-[13px] text-neutral text-center px-6">
        Belum ada data luaran untuk periode ini.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px] border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="text-left py-2 px-2.5 text-neutral font-semibold whitespace-nowrap">Kode MK</th>
            <th scope="col" className="text-left py-2 px-2.5 text-neutral font-semibold">Nama MK</th>
            <th scope="col" className="text-left py-2 px-2.5 text-neutral font-semibold whitespace-nowrap">Kelas</th>
            <th scope="col" className="text-right py-2 px-2.5 text-neutral font-semibold whitespace-nowrap">Jumlah Mhs</th>
            <th scope="col" className="text-right py-2 px-2.5 text-neutral font-semibold whitespace-nowrap">Rata-Rata IP</th>
            <th scope="col" className="text-right py-2 px-2.5 text-neutral font-semibold whitespace-nowrap">% Lulus (A-C)</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.kelas_id} className="border-b border-border last:border-0 hover:bg-active transition-colors">
              <td className="py-2 px-2.5 font-medium text-text-dark whitespace-nowrap">{item.kode_matkul}</td>
              <td className="py-2 px-2.5 text-text-dark">{item.nama_matkul_id}</td>
              <td className="py-2 px-2.5 text-neutral whitespace-nowrap">Kelas {item.no_kelas}</td>
              <td className="py-2 px-2.5 text-right text-text-dark">{item.jumlah_mahasiswa}</td>
              <td className="py-2 px-2.5 text-right text-text-dark">
                {item.avg_ip != null ? item.avg_ip.toFixed(2) : '—'}
              </td>
              <td className="py-2 px-2.5 text-right text-text-dark">
                {item.pct_lulus_a_c != null ? `${item.pct_lulus_a_c.toFixed(0)}%` : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}