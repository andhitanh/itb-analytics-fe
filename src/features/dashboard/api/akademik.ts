// src/features/dashboard/api/akademik.ts
import api from '@/lib/axios';

// ─── Response types (mirroring backend Pydantic schema) ───────────────────────

export interface FilterOption {
  value: string;
  label: string;
}

export interface ProdiOption {
  value:     string;  // str(no_ps) — unik per baris
  label:     string;  // mis. "Teknik Informatika (S1)"
  kd_ps:     string;  // mis. "IF"
  kd_strata: string;  // "S1" | "S2" | "S3" | "PR"
}

export interface FilterOptionsLocked {
  fakultas: string | null;
  prodi:    string | null;
}

export interface AkademikFilterOptionsResponse {
  locked:            FilterOptionsLocked;
  tahun_ajaran:      FilterOption[];
  semester:          FilterOption[];
  jenjang:           FilterOption[];
  fakultas:          FilterOption[];
  prodi_by_fakultas: Record<string, ProdiOption[]>;
}

// ─── Fetch function ───────────────────────────────────────────────────────────

export async function fetchAkademikFilterOptions(
  signal?: AbortSignal,
): Promise<AkademikFilterOptionsResponse> {
  const { data } = await api.get<AkademikFilterOptionsResponse>(
    '/api/dashboard/akademik/filter-options',
    { signal },
  );
  return data;
}

