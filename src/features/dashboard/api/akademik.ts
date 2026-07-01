// src/features/dashboard/api/akademik.ts
import api from '@/lib/axios';
import type { AkademikFilter } from '@/features/dashboard/types';

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

// ─── Stats overview ─────────────────────────────────────────────────────────

export interface StatsOverviewResponse {
  jumlah_kelas:                number;
  jumlah_matkul_aktif:         number;
  jumlah_dosen_aktif:          number;
  jumlah_mahasiswa_aktif:      number;
  avg_pct_kehadiran_dosen:     number | null;
  avg_pct_kehadiran_mahasiswa: number | null;
  avg_ip_akhir_mahasiswa:      number | null;
}

/**
 * Bangun query params dari AkademikFilter.
 * 'semua' berarti "tidak difilter" — tidak dikirim ke backend sama sekali.
 * jenjang dikirim sebagai repeated key (?jenjang=S1&jenjang=S2) sesuai
 * FastAPI list[str] via Depends().
 */
function buildAkademikParams(filter: AkademikFilter): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.tahunAjaran  !== 'semua') params.set('tahun_ajaran', filter.tahunAjaran);
  if (filter.semester     !== 'semua') params.set('semester', filter.semester);
  if (filter.fakultas     !== 'semua') params.set('fakultas', filter.fakultas);
  if (filter.programStudi !== 'semua') params.set('no_ps', filter.programStudi);
  filter.jenjang.forEach(j => params.append('jenjang', j));

  return params;
}

export async function fetchAkademikStatsOverview(
  filter: AkademikFilter,
  signal?: AbortSignal,
): Promise<StatsOverviewResponse> {
  const { data } = await api.get<StatsOverviewResponse>(
    '/api/dashboard/akademik/stats-overview',
    { params: buildAkademikParams(filter), signal },
  );
  return data;
}