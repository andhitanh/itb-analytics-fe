import { useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card';
import { IssueList, RawComments } from '@/components/ui/issue-list';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Issue {
  label:     string;
  count:     number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface IssueCommentSectionProps {
  title:       string;
  subtitle:    string;
  issues:      Issue[];
  rawComments: string[];
  /** Warna bar dan count — ambil dari chartColors */
  barColor:    string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function IssueCommentSection({
  title,
  subtitle,
  issues,
  rawComments,
  barColor,
}: IssueCommentSectionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  // Simulasi filter komentar berdasarkan isu terpilih
  // Pada implementasi nyata: filter berdasarkan issue tag dari API
  const displayedComments = selected !== null
    ? rawComments.slice(0, 3)
    : rawComments;

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Kiri: daftar isu */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <IssueList
            issues={issues}
            barColor={barColor}
            selected={selected}
            onSelect={setSelected}
          />
          {selected !== null && (
            <p className="text-[11.5px] text-neutral mt-2.5">
              Panel kanan menampilkan komentar untuk isu:{' '}
              <b className="text-text-dark">{issues[selected].label}</b>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Kanan: komentar mentah */}
      <Card>
        <CardHeader>
          <CardTitle>Komentar Mentah</CardTitle>
          <CardDescription>
            {selected !== null
              ? `Filter: ${issues[selected].label}`
              : 'Semua isu — klik isu di kiri untuk filter'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayedComments.length > 0 ? (
            <RawComments
              comments={displayedComments}
              selected={selected}
              issueLabel={
                selected !== null ? issues[selected].label : undefined
              }
            />
          ) : (
            <p className="text-[12px] text-neutral text-center py-6">
              Tidak ada komentar tersedia untuk isu ini.
            </p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}