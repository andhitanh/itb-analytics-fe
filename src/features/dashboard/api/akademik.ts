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
  jumlah_kelas:           number;
  jumlah_matkul_aktif:    number;
  jumlah_dosen_aktif:     number;
  jumlah_mahasiswa_aktif: number;
  avg_kelas_per_matkul:   number | null;
}

/**
 * Bangun query params dari AkademikFilter.
 * 'semua' berarti "tidak difilter" — tidak dikirim ke backend sama sekali.
 * jenjang dikirim sebagai repeated key (?jenjang=S1&jenjang=S2) sesuai
 * FastAPI list[str] via Depends().
 *
 * extra: param tambahan di luar filter standar (mis. kode_grup, limit,
 * n_semester) yang dibutuhkan endpoint tertentu.
 */
function buildAkademikParams(
  filter: AkademikFilter,
  extra?: Record<string, string | number>,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.tahunAjaran  !== 'semua') params.set('tahun_ajaran', filter.tahunAjaran);
  if (filter.semester     !== 'semua') params.set('semester', filter.semester);
  if (filter.fakultas     !== 'semua') params.set('fakultas', filter.fakultas);
  if (filter.programStudi !== 'semua') params.set('no_ps', filter.programStudi);
  filter.jenjang.forEach(j => params.append('jenjang', j));

  if (extra) {
    Object.entries(extra).forEach(([key, value]) => params.set(key, String(value)));
  }

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

// ─── Attendance ───────────────────────────────────────────────────────────────

export interface AttendanceItem {
  label:                    string;
  kode:                     string;
  kehadiran_dosen:          number | null;
  kehadiran_mahasiswa:      number | null;
  prev_kehadiran_dosen:     number | null;
  prev_kehadiran_mahasiswa: number | null;
  prev_period_label:        string | null;
}

export interface AttendanceResponse {
  granularity: 'fakultas' | 'prodi';
  items:       AttendanceItem[];
}

export async function fetchAkademikAttendance(
  filter: AkademikFilter,
  signal?: AbortSignal,
): Promise<AttendanceResponse> {
  const { data } = await api.get<AttendanceResponse>(
    '/api/dashboard/akademik/attendance',
    { params: buildAkademikParams(filter), signal },
  );
  return data;
}

// ─── Grade trend ────────────────────────────────────────────────────────────

export interface GradeTrendPoint {
  period_label:       string;
  tahun_ajaran:        string;
  semester:            number;
  avg_skor_overall:    number | null;
  dist_pct_a:          number | null;
  dist_pct_lulus_a_c:  number | null;
  total_mahasiswa:     number;
}

export interface GradeTrendResponse {
  granularity: 'fakultas' | 'prodi';
  n_semester:  number;
  trend:       GradeTrendPoint[];
}

/**
 * Endpoint ini mengabaikan filter.semester (nature-nya time-series, bukan
 * snapshot satu semester) — semester sengaja tidak dikirim supaya kode di
 * sini jujur soal apa yang benar-benar dipakai backend, bukan mengirim param
 * yang diam-diam diabaikan.
 */
export async function fetchAkademikGradeTrend(
  filter:     AkademikFilter,
  nSemester:  number,
  signal?:    AbortSignal,
): Promise<GradeTrendResponse> {
  const { data } = await api.get<GradeTrendResponse>(
    '/api/dashboard/akademik/grade-trend',
    {
      params: buildAkademikParams(
        { ...filter, semester: 'semua' },
        { n_semester: nSemester },
      ),
      signal,
    },
  );
  return data;
}

// ─── Grade distribution ─────────────────────────────────────────────────────

export interface GradeDistItem {
  label:              string;
  kode:               string;
  dist_pct_a:         number | null;
  dist_pct_ab:        number | null;
  dist_pct_b:         number | null;
  dist_pct_bc:        number | null;
  dist_pct_c:         number | null;
  dist_pct_d:         number | null;
  dist_pct_e:         number | null;
  dist_pct_t:         number | null;
  dist_pct_pass:      number | null;
  dist_pct_fail:      number | null;
  dist_pct_lulus_a_c: number | null;
  dist_pct_lulus_a_d: number | null;
  total_mahasiswa:    number;
}

export interface GradeDistResponse {
  granularity: 'fakultas' | 'prodi';
  items:       GradeDistItem[];
}

export async function fetchAkademikGradeDistribution(
  filter: AkademikFilter,
  signal?: AbortSignal,
): Promise<GradeDistResponse> {
  const { data } = await api.get<GradeDistResponse>(
    '/api/dashboard/akademik/grade-distribution',
    { params: buildAkademikParams(filter), signal },
  );
  return data;
}

// ─── Skor heatmap ───────────────────────────────────────────────────────────

export interface HeatmapRow {
  label:        string;
  kode:         string;
  avg_skor_q21: number | null;
  avg_skor_q22: number | null;
  avg_skor_q23: number | null;
  avg_skor_q24: number | null;
  avg_skor_q25: number | null;
  avg_skor_q26: number | null;
  avg_skor_q27: number | null;
  avg_skor_q28: number | null;
  avg_skor_q29: number | null;
  avg_skor_q30: number | null;
  avg_skor_q35: number | null;
  avg_skor_q37: number | null;
}

export interface SkorHeatmapResponse {
  granularity: 'fakultas' | 'prodi';
  items:       HeatmapRow[];
}

export async function fetchAkademikSkorHeatmap(
  filter: AkademikFilter,
  signal?: AbortSignal,
): Promise<SkorHeatmapResponse> {
  const { data } = await api.get<SkorHeatmapResponse>(
    '/api/dashboard/akademik/skor-heatmap',
    { params: buildAkademikParams(filter), signal },
  );
  return data;
}