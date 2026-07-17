import { RawCommentList } from '@/features/dashboard/components/shared-layouts/RawCommentList';
import { chartColors }    from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';

interface TabKomentarProps {
  filter: AkademikFilter;
}

export default function TabKomentar({ filter }: TabKomentarProps) {
  return (
    <div className="flex flex-col gap-4">
      <RawCommentList
        filter={filter}
        sumber="itb"
        title="Usulan Perbaikan untuk ITB"
        subtitle="Rekomendasi dosen ke ITB dari portofolio dosen"
        color={chartColors.primary}
      />
      <RawCommentList
        filter={filter}
        sumber="dosen"
        title="Refleksi Dosen"
        subtitle="Usulan perbaikan dari portofolio dosen"
        color={chartColors.warning}
      />
      <RawCommentList
        filter={filter}
        sumber="mahasiswa"
        title="Komentar Mahasiswa"
        subtitle="Komentar bebas dari kuesioner evaluasi mahasiswa"
        color={chartColors.mid}
      />
    </div>
  );
}