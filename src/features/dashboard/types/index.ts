// src/features/dashboard/types/index.ts
export type Sentiment = 'positive' | 'neutral' | 'negative';

// Nilai mengikuti kd_strata DB persis: "S1" | "S2" | "S3" | "PR"
// Label tampilan ("Profesi") ada di filterOptions.jenjang[].label dari API
export type JenjangFilter = 'S1' | 'S2' | 'S3' | 'PR';

// Nilai mengikuti output _SEMESTER_MAP di backend: "ganjil" bukan "gasal"
export type SemesterFilter = 'semua' | 'ganjil' | 'genap' | 'pendek';

export interface AkademikFilter {
  tahunAjaran:  string;
  semester:     SemesterFilter;
  jenjang:      JenjangFilter[];
  fakultas:     string;        // kd_fak, mis. "STEI"
  programStudi: string;        // str(no_ps), mis. "135" — atau 'semua'
}

export const DEFAULT_AKADEMIK_FILTER: AkademikFilter = {
  tahunAjaran:  'semua',
  semester:     'semua',
  jenjang:      [],
  fakultas:     'semua',
  programStudi: 'semua',
};

// ─── Wisudawan (tidak berubah) ─────────────────────────────────────────────

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

export interface Issue {
  label:     string;
  count:     number;
  sentiment: Sentiment;
}

export interface GroupDataItem {
  label: string;
  avg:   number;
}