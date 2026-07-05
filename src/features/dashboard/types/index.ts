// ─── Shared primitives ────────────────────────────────────────────────────────

export type Sentiment    = 'positive' | 'neutral' | 'negative';
export type JenjangFilter = 'S1' | 'S2' | 'S3' | 'Profesi';

// ─── Akademik filter ──────────────────────────────────────────────────────────

export type SemesterFilter = 'semua' | 'ganjil' | 'genap' | 'pendek';

export interface AkademikFilter {
  tahunAjaran:  string;
  semester:     SemesterFilter;
  jenjang:      JenjangFilter[];
  fakultas:     string;
  programStudi: string;
}

export const DEFAULT_AKADEMIK_FILTER: AkademikFilter = {
  tahunAjaran:  'semua',
  semester:     'semua',
  jenjang:      [],
  fakultas:     'semua',
  programStudi: 'semua',
};

// ─── Wisudawan filter ─────────────────────────────────────────────────────────

export type PeriodeWisuda = 'semua' | 'april' | 'agustus' | 'oktober';

export interface WisudawanFilter {
  tahun:    string;
  periode:  PeriodeWisuda;
  jenjang:  JenjangFilter[];
  fakultas: string;
}

export const DEFAULT_WISUDAWAN_FILTER: WisudawanFilter = {
  tahun:    'semua',
  periode:  'semua',
  jenjang:  [],
  fakultas: 'semua',
};

// ─── Domain types ─────────────────────────────────────────────────────────────

/**
 * Satu entri isu dari analisis teks komentar.
 * Dipakai oleh IssueList, IssueCommentSection, TabKomentar, TabWisSuara.
 */
export interface Issue {
  label:     string;
  count:     number;
  sentiment: Sentiment;
}

/** Shape data yang diterima HBarChart dan dikembalikan fungsi grouping */
export interface GroupDataItem {
  label: string;
  kode:  string;
  avg:   number;
}