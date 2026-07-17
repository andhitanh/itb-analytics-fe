// ─── Shared primitives ────────────────────────────────────────────────────────

export type Sentiment    = 'positive' | 'neutral' | 'negative';
export type JenjangFilter = 'S1' | 'S2' | 'S3' | 'Profesi';

// ─── Akademik filter ──────────────────────────────────────────────────────────

/**
 * Nilai semester mengikuti FilterOption.value dari backend ("1"|"2"|"3" —
 * ganjil/genap/pendek). Tetap string karena datang dari API, bukan enum tetap.
 */
export type SemesterFilter = string;

export interface AkademikFilter {
  /** Single-select, wajib selalu ada nilai — tidak ada opsi "Semua". */
  tahunAjaran:  string;
  /** Multi-select. Array kosong = "Semua Semester". */
  semester:     SemesterFilter[];
  /** Multi-select. Array kosong = "Semua Jenjang". */
  jenjang:      JenjangFilter[];
  /** Multi-select. Array kosong = "Semua Fakultas". */
  fakultas:     string[];
  /** Multi-select. Array kosong = "Semua Program Studi". */
  programStudi: string[];
}

export const DEFAULT_AKADEMIK_FILTER: AkademikFilter = {
  // Diisi otomatis dari filterOptions.tahun_ajaran[0] saat data pertama tiba
  // (lihat DashboardAkademik.tsx) — string kosong hanya state transisi awal.
  tahunAjaran:  '',
  semester:     [],
  jenjang:      [],
  fakultas:     [],
  programStudi: [],
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
  delta?: number | null;
}