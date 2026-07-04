import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useKomentarMentah } from '@/features/dashboard/hooks/useKomentarMentah';
import type { KomentarSumber } from '@/features/dashboard/api/akademik';
import type { AkademikFilter } from '@/features/dashboard/types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface RawCommentListProps {
  filter:   AkademikFilter;
  sumber:   KomentarSumber;
  title:    string;
  subtitle: string;
  /** Warna aksen kecil di kode mata kuliah — konsisten dengan barColor lama */
  color:    string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Pengganti IssueCommentSection. Fitur "klik isu untuk filter komentar" pada
 * komponen lama butuh endpoint /isu-dominan yang belum ada (menunggu
 * pipeline RAG tim lain) — jadi untuk saat ini daftar ditampilkan polos
 * dengan pagination, tanpa filter tema. Fitur filter-by-isu ditambahkan
 * belakangan begitu /isu-dominan tersedia.
 */
export function RawCommentList({ filter, sumber, title, subtitle, color }: RawCommentListProps) {
  const [page, setPage] = useState(1);

  // Filter berubah → mulai lagi dari halaman 1, supaya tidak nyangkut di
  // halaman yang mungkin sudah di luar jangkauan hasil filter baru.
  useEffect(() => {
    setPage(1);
  }, [
    filter.tahunAjaran,
    filter.semester,
    filter.fakultas,
    filter.programStudi,
    filter.jenjang.join(','),
    sumber,
  ]);

  const { data, isLoading } = useKomentarMentah(filter, sumber, page);
  const items      = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-[12px] text-neutral text-center py-6">Memuat komentar…</p>
        ) : items.length === 0 ? (
          <p className="text-[12px] text-neutral text-center py-6">
            Tidak ada komentar untuk filter ini.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
              {items.map(item => (
                <div key={`${item.kelas_id}-${item.teks.slice(0, 20)}`} className="border-b border-border pb-2.5 last:border-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[10.5px] font-semibold px-1.5 py-px rounded" style={{ color, backgroundColor: `${color}1A` }}>
                      {item.kode_matkul}
                    </span>
                    <span className="text-[11px] text-text-dark font-medium">{item.nama_matkul_id}</span>
                    <span className="text-[10.5px] text-neutral">
                      · {item.kode_prodi} · {item.tahun_ajaran} sem {item.semester}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-mid leading-relaxed">{item.teks}</p>
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
                  Halaman {pagination.page} dari {pagination.total_pages} · {pagination.total_items.toLocaleString('id')} komentar
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