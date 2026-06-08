import { IssueCommentSection } from '@/features/dashboard/components/shared-layouts/IssueCommentSection';
import {
  ISSUES_MAHASISWA, ISSUES_DOSEN, ISSUES_ITB,
  RAW_COMMENTS_MAHASISWA, RAW_COMMENTS_DOSEN, RAW_COMMENTS_ITB,
} from '@/features/dashboard/mocks/mockData';
import { chartColors }         from '@/styles/chart-token';
import type { AkademikFilter } from '@/features/dashboard/types';

interface TabKomentarProps {
  filter: AkademikFilter;
}

export default function TabKomentar({ filter: _filter }: TabKomentarProps) {
  return (
    <div className="flex flex-col gap-4">
      <IssueCommentSection
        title="Top 10 Isu Dominan — Usulan Perbaikan untuk ITB"
        subtitle="Tema terbanyak dari kolom 'Usulan Perbaikan oleh ITB' · klik isu untuk filter"
        issues={ISSUES_ITB}
        rawComments={RAW_COMMENTS_ITB}
        barColor={chartColors.primary}
      />
      <IssueCommentSection
        title="Top 10 Isu Dominan — Refleksi Dosen"
        subtitle="Tema terbanyak dari kolom 'Refleksi Pelaksanaan Perkuliahan' · klik isu untuk filter"
        issues={ISSUES_DOSEN}
        rawComments={RAW_COMMENTS_DOSEN}
        barColor={chartColors.warning}
      />
      <IssueCommentSection
        title="Top 10 Isu Dominan — Komentar Mahasiswa"
        subtitle="Tema terbanyak dari saran mahasiswa di kuesioner · klik isu untuk filter"
        issues={ISSUES_MAHASISWA}
        rawComments={RAW_COMMENTS_MAHASISWA}
        barColor={chartColors.mid}
      />
    </div>
  );
}