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
 * Array kosong berarti "tidak difilter" — tidak dikirim ke backend sama
 * sekali. semester, fakultas, no_ps, dan jenjang semuanya multi-select dan
 * dikirim sebagai repeated key (?fakultas=STEI&fakultas=SBM) sesuai
 * FastAPI list[str] via Depends(). tahun_ajaran tetap single-value wajib.
 *
 * extra: param tambahan di luar filter standar (mis. kode_grup, limit,
 * n_semester) yang dibutuhkan endpoint tertentu.
 */
function buildAkademikParams(
  filter: AkademikFilter,
  extra?: Record<string, string | number>,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.tahunAjaran) params.set('tahun_ajaran', filter.tahunAjaran);
  filter.semester.forEach(s => params.append('semester', s));
  filter.fakultas.forEach(f => params.append('fakultas', f));
  filter.programStudi.forEach(p => params.append('no_ps', p));
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
  period_label:         string;
  tahun_ajaran:         string;
  semester:             number;
  avg_skor_overall:     number | null;
  avg_skor_capaian:     number | null;
  avg_skor_pelaksanaan: number | null;
  avg_skor_q28:         number | null;
  dist_pct_a:           number | null;
  dist_pct_lulus_a_c:   number | null;
  total_mahasiswa:      number;
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
        { ...filter, semester: [] },
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
  avg_ip:             number | null;
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

// ─── Skor pertanyaan ────────────────────────────────────────────────────────

export interface SkorItem {
  label:             string;
  kode:              string;
  skor:              number | null;
  prev_skor:         number | null;
  prev_period_label: string | null;
}

export interface SkorPertanyaanResponse {
  granularity: 'fakultas' | 'prodi';
  kode_grup:   string;
  items:       SkorItem[];
}

export async function fetchAkademikSkorPertanyaan(
  filter:    AkademikFilter,
  kodeGrup:  string,
  signal?:   AbortSignal,
): Promise<SkorPertanyaanResponse> {
  const { data } = await api.get<SkorPertanyaanResponse>(
    '/api/dashboard/akademik/skor-pertanyaan',
    { params: buildAkademikParams(filter, { kode_grup: kodeGrup }), signal },
  );
  return data;
}

// ─── Course ranking ─────────────────────────────────────────────────────────

export interface CourseRankingItem {
  kode_matkul:       string;
  nama_matkul_id:    string;
  sks:               number;
  kode_prodi:        string;
  nama_prodi_id:     string;
  kode_fakultas:     string;
  jumlah_kelas:      number;
  jumlah_mahasiswa:  number;
  skor:              number | null;
  prev_skor:         number | null;
  prev_period_label: string | null;
}

export interface CourseRankingResponse {
  limit:  number;
  metric: string;
  top:    CourseRankingItem[];
  bottom: CourseRankingItem[];
}

const DEFAULT_COURSE_RANKING_LIMIT = 5;

export async function fetchAkademikCourseRanking(
  filter:  AkademikFilter,
  signal?: AbortSignal,
  limit:   number = DEFAULT_COURSE_RANKING_LIMIT,
  metric:  string = 'overall',
): Promise<CourseRankingResponse> {
  const { data } = await api.get<CourseRankingResponse>(
    '/api/dashboard/akademik/course-ranking',
    { params: buildAkademikParams(filter, { limit, metric }), signal },
  );
  return data;
}

// ─── Grading comp ───────────────────────────────────────────────────────────

export interface GradingCompItem {
  label:                  string;
  kode:                   string;
  jumlah_kelas:           number;
  avg_bobot_uts:          number | null;
  avg_bobot_uas:          number | null;
  avg_bobot_tugas:        number | null;
  avg_bobot_kuis:         number | null;
  avg_bobot_praktikum:    number | null;
  avg_bobot_projek:       number | null;
  avg_bobot_partisipatif: number | null;
}

export interface GradingCompResponse {
  granularity: 'fakultas' | 'prodi';
  items:       GradingCompItem[];
}

export async function fetchAkademikGradingComp(
  filter: AkademikFilter,
  signal?: AbortSignal,
): Promise<GradingCompResponse> {
  const { data } = await api.get<GradingCompResponse>(
    '/api/dashboard/akademik/grading-comp',
    { params: buildAkademikParams(filter), signal },
  );
  return data;
}

// ─── Skor by SKS ────────────────────────────────────────────────────────────

export interface SkorBySksBucket {
  sks_label:    string;
  jumlah_kelas: number;
  avg_skor_q8:  number | null;
}

export interface SkorBySksResponse {
  // Tidak ada granularity — selalu 3 bucket tetap terlepas dari role,
  // grain-nya berdasarkan SKS bukan entitas organisasi.
  items: SkorBySksBucket[];
}

export async function fetchAkademikSkorBySks(
  filter: AkademikFilter,
  signal?: AbortSignal,
): Promise<SkorBySksResponse> {
  const { data } = await api.get<SkorBySksResponse>(
    '/api/dashboard/akademik/skor-by-sks',
    { params: buildAkademikParams(filter), signal },
  );
  return data;
}

// ─── Komentar mentah ────────────────────────────────────────────────────────

export type KomentarSumber = 'mahasiswa' | 'dosen' | 'itb';

export interface KomentarItem {
  kelas_id:       number;
  kode_matkul:    string;
  nama_matkul_id: string;
  kode_prodi:     string;
  nama_prodi_id:  string;
  kode_fakultas:  string;
  tahun_ajaran:   string;
  semester:       number;
  teks:           string;
}

export interface KomentarPagination {
  page:        number;
  page_size:   number;
  total_items: number;
  total_pages: number;
}

export interface KomentarResponse {
  sumber:     KomentarSumber;
  pagination: KomentarPagination;
  items:      KomentarItem[];
}

const DEFAULT_KOMENTAR_PAGE_SIZE = 10;

/**
 * Belum ada fitur filter-by-isu (menunggu endpoint /isu-dominan terpisah
 * dari tim RAG) — endpoint ini murni daftar komentar mentah + pagination.
 */
export async function fetchAkademikKomentarMentah(
  filter:    AkademikFilter,
  sumber:    KomentarSumber,
  page:      number,
  signal?:   AbortSignal,
  pageSize:  number = DEFAULT_KOMENTAR_PAGE_SIZE,
): Promise<KomentarResponse> {
  const { data } = await api.get<KomentarResponse>(
    '/api/dashboard/akademik/komentar-mentah',
    {
      params: buildAkademikParams(filter, { sumber, page, page_size: pageSize }),
      signal,
    },
  );
  return data;
}