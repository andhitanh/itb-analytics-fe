// src/features/dashboard/components/dosen/DosenRefleksiCard.tsx
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useDosenRefleksi } from '@/features/dashboard/hooks/dosen/useDosenRefleksi';
import { chartColors } from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';

interface DosenRefleksiCardProps {
  filter: AkademikFilter;
}

/**
 * Struktur & styling identik RawCommentList (bukan komponen baru dari nol),
 * tapi WAJIB pakai hook terpisah (useDosenRefleksi -> /dosen/refleksi),
 * bukan useKomentarMentah (-> /akademik/komentar-mentah) -- endpoint
 * terakhir itu untuk sumber="dosen" scope-nya seluas prodi (RLS terbuka
 * untuk chatbot), sedangkan dashboard butuh dibatasi ke portofolio milik
 * dosen ini sendiri. Lihat get_dosen_refleksi di akademik_dosen.py.
 */
export function DosenRefleksiCard({ filter }: DosenRefleksiCardProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filter.tahunAjaran, filter.semester, filter.jenjang.join(',')]);

  const { data, isLoading } = useDosenRefleksi(filter, page);
  const items      = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refleksi & Usulan Perbaikan</CardTitle>
        <CardDescription>Dari portofolio Anda sendiri, untuk periode akademik berikutnya</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-[12px] text-neutral text-center py-6">Memuat…</p>
        ) : items.length === 0 ? (
          <p className="text-[12px] text-neutral text-center py-6">
            Anda belum mengisi refleksi/usulan perbaikan untuk periode ini.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
              {items.map(item => (
                <div key={`${item.kelas_id}-${item.tahun_ajaran}-${item.semester}`} className="border-b border-border pb-2.5 last:border-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span
                      className="text-[10.5px] font-semibold px-1.5 py-px rounded"
                      style={{ color: chartColors.warning, backgroundColor: `${chartColors.warning}1A` }}
                    >
                      {item.kode_matkul}
                    </span>
                    <span className="text-[11px] text-text-dark font-medium">{item.nama_matkul_id}</span>
                    <span className="text-[10.5px] text-neutral">
                      · {item.tahun_ajaran} sem {item.semester}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-mid leading-relaxed whitespace-pre-line">
                    {item.teks}
                  </p>
                </div>
              ))}
            </div>

            {pagination && pagination.total_pages > 1 && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="text-[11px] font-medium text-primary disabled:text-neutral disabled:cursor-not-allowed"
                >
                  ← Sebelumnya
                </button>
                <span className="text-[11px] text-neutral">
                  Halaman {pagination.page} dari {pagination.total_pages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
                  disabled={pagination.page >= pagination.total_pages}
                  className="text-[11px] font-medium text-primary disabled:text-neutral disabled:cursor-not-allowed"
                >
                  Selanjutnya →
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}