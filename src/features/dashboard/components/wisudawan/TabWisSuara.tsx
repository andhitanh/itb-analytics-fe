import { IssueCommentSection } from '@/features/dashboard/components/shared-layouts/IssueCommentSection';
import {
  ISSUES_POSITIF, ISSUES_NEGATIF, ISSUES_SARAN,
  RAW_POSITIF, RAW_NEGATIF, RAW_SARAN,
} from '@/features/dashboard/mocks/mockDataWisudawan';
import { chartColors }          from '@/styles/chart-token';
import type { WisudawanFilter } from '@/features/dashboard/types';

interface TabWisSuaraProps {
  filter: WisudawanFilter;
}

export default function TabWisSuara({ filter: _filter }: TabWisSuaraProps) {
  return (
    <div className="flex flex-col gap-4">
      <IssueCommentSection
        title="Top 5 Isu Dominan — Segi Positif Studi di ITB"
        subtitle="Tema terbanyak dari kolom 'Segi Positif Studi' · klik isu untuk filter komentar"
        issues={ISSUES_POSITIF}
        rawComments={RAW_POSITIF}
        barColor={chartColors.success}
      />
      <IssueCommentSection
        title="Top 5 Isu Dominan — Segi Negatif Studi di ITB"
        subtitle="Tema terbanyak dari kolom 'Segi Negatif Studi' · klik isu untuk filter komentar"
        issues={ISSUES_NEGATIF}
        rawComments={RAW_NEGATIF}
        barColor={chartColors.danger}
      />
      <IssueCommentSection
        title="Top 5 Isu Dominan — Saran Perbaikan untuk ITB"
        subtitle="Tema terbanyak dari kolom 'Saran Perbaikan' · klik isu untuk filter komentar"
        issues={ISSUES_SARAN}
        rawComments={RAW_SARAN}
        barColor={chartColors.primary}
      />
    </div>
  );
}