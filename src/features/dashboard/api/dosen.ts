// src/features/dashboard/api/dosen.ts
import api from '@/lib/axios';
import type { AkademikFilter } from '@/features/dashboard/types';

// ─── Param builder ──────────────────────────────────────────────────────────

/**
 * Param builder khusus endpoint dosen — HANYA tahun_ajaran, semester, jenjang.
 * Sengaja TIDAK reuse buildAkademikParams dari api/akademik.ts: fungsi itu
 * juga menyertakan fakultas/no_ps, sementara endpoint dosen tidak menerima
 * dimensi itu sama sekali (scope dikunci di backend ke dosen_id — lihat
 * _require_dosen_id di dashboard_dosen.py). Mengirim param yang diam-diam
 * diabaikan backend adalah kontrak yang tidak jujur, meski itu berarti 5
 * baris kode ini mirip dengan versi akademik.
 */
function buildDosenParams(
  filter: AkademikFilter,
  extra?: Record<string, string | number>,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.tahunAjaran)          params.set('tahun_ajaran', filter.tahunAjaran);
  if (filter.semester !== 'semua') params.set('semester', filter.semester);
  filter.jenjang.forEach(j => params.append('jenjang', j));

  if (extra) {
    Object.entries(extra).forEach(([key, value]) => params.set(key, String(value)));
  }

  return params;
}

// ─── Stats overview ─────────────────────────────────────────────────────────

export interface DosenStatsOverviewResponse {
  jumlah_matkul:    number;
  jumlah_kelas:     number;
  total_sks_diajar: number;
  jumlah_mahasiswa: number;
}

export async function fetchDosenStatsOverview(
  filter: AkademikFilter,
  signal?: AbortSignal,
): Promise<DosenStatsOverviewResponse> {
  const { data } = await api.get<DosenStatsOverviewResponse>(
    '/api/dashboard/dosen/stats-overview',
    { params: buildDosenParams(filter), signal },
  );
  return data;
}

// ─── Trend temporal (Tab 1 baris 1) ─────────────────────────────────────────

export interface DosenTrendPoint {
  period_label:     string;
  tahun_ajaran:     string;
  semester:         number;
  avg_ip_mahasiswa: number | null;
  avg_skor_overall: number | null;
  avg_skor_q4_q7:   number | null;
}

export interface DosenTrendResponse {
  trend: DosenTrendPoint[];
}

const DEFAULT_TREND_N_SEMESTER = 8;

export async function fetchDosenTrend(
  filter:     AkademikFilter,
  signal?:    AbortSignal,
  nSemester:  number = DEFAULT_TREND_N_SEMESTER,
): Promise<DosenTrendResponse> {
  const { data } = await api.get<DosenTrendResponse>(
    '/api/dashboard/dosen/trend',
    { params: buildDosenParams(filter, { n_semester: nSemester }), signal },
  );
  return data;
}

// ─── Tabel utama kelas (Tab 1 baris 2) ──────────────────────────────────────

export interface DosenKelasItem {
  kelas_id:                number;
  kode_matkul:             string;
  nama_matkul_id:          string;
  no_kelas:                number;
  jumlah_mahasiswa:        number;
  avg_ip:                  number | null;
  prev_avg_ip:             number | null;
  avg_skor_overall:        number | null;
  prev_avg_skor_overall:   number | null;
  pct_kehadiran_dosen:     number | null;
  pct_kehadiran_mahasiswa: number | null;
}

export interface DosenKelasResponse {
  items: DosenKelasItem[];
}

export async function fetchDosenKelas(
  filter:  AkademikFilter,
  signal?: AbortSignal,
): Promise<DosenKelasResponse> {
  const { data } = await api.get<DosenKelasResponse>(
    '/api/dashboard/dosen/kelas',
    { params: buildDosenParams(filter), signal },
  );
  return data;
}

// ─── Kelulusan A-C vs D-E (Tab 2 baris 1) ───────────────────────────────────

export interface DosenKelulusanResponse {
  pct_lulus_periode_ini:  number | null;
  pct_lulus_periode_lalu: number | null;
  prev_period_label:      string | null;
}

export async function fetchDosenKelulusan(
  filter:  AkademikFilter,
  signal?: AbortSignal,
): Promise<DosenKelulusanResponse> {
  const { data } = await api.get<DosenKelulusanResponse>(
    '/api/dashboard/dosen/kelulusan',
    { params: buildDosenParams(filter), signal },
  );
  return data;
}

// ─── Tabel luaran (Tab 2 baris 2) ───────────────────────────────────────────

export interface DosenLuaranItem {
  kelas_id:         number;
  kode_matkul:      string;
  nama_matkul_id:   string;
  no_kelas:         number;
  jumlah_mahasiswa: number;
  avg_ip:           number | null;
  pct_lulus_a_c:    number | null;
}

export interface DosenLuaranResponse {
  items: DosenLuaranItem[];
}

export async function fetchDosenLuaran(
  filter:  AkademikFilter,
  signal?: AbortSignal,
): Promise<DosenLuaranResponse> {
  const { data } = await api.get<DosenLuaranResponse>(
    '/api/dashboard/dosen/luaran',
    { params: buildDosenParams(filter), signal },
  );
  return data;
}

// ─── Komposisi bobot penilaian (Tab 2 baris 3) ──────────────────────────────

export interface DosenGradingCompItem {
  kelas_id:           number;
  kode_matkul:        string;
  no_kelas:           number;
  bobot_uts:          number | null;
  bobot_uas:          number | null;
  bobot_tugas:        number | null;
  bobot_kuis:         number | null;
  bobot_praktikum:    number | null;
  bobot_projek:       number | null;
  bobot_partisipatif: number | null;
}

export interface DosenGradingCompResponse {
  items: DosenGradingCompItem[];
}

export async function fetchDosenGradingComp(
  filter:  AkademikFilter,
  signal?: AbortSignal,
): Promise<DosenGradingCompResponse> {
  const { data } = await api.get<DosenGradingCompResponse>(
    '/api/dashboard/dosen/grading-comp',
    { params: buildDosenParams(filter), signal },
  );
  return data;
}

// ─── Skor per kategori (Tab 3, default view) ────────────────────────────────

/**
 * Sama persis dengan KategoriSkor (Literal) di backend
 * (api/schemas/dashboard_dosen.py) — satu sumber kebenaran nilai enum ini,
 * disalin ke sisi frontend karena TypeScript tidak bisa import Literal
 * Python secara langsung.
 */
export type DosenKategoriSkor =
  | 'capaian'
  | 'pelaksanaan'
  | 'q28'
  | 'sarana_prasarana'
  | 'perilaku_mahasiswa';

export interface DosenKategoriSkorItem {
  kode_kategori: DosenKategoriSkor;
  label:         string;
  skor:          number | null;
}

export interface DosenSkorKategoriResponse {
  items: DosenKategoriSkorItem[];
}

export async function fetchDosenSkorKategori(
  filter:  AkademikFilter,
  signal?: AbortSignal,
): Promise<DosenSkorKategoriResponse> {
  const { data } = await api.get<DosenSkorKategoriResponse>(
    '/api/dashboard/dosen/skor-kategori',
    { params: buildDosenParams(filter), signal },
  );
  return data;
}

// ─── Drill-down per pertanyaan (Tab 3, saat 1 kategori diklik) ──────────────

export interface DosenSkorPertanyaanItem {
  kode_pertanyaan: string;
  pertanyaan:      string;
  skor:            number | null;
}

export interface DosenSkorPertanyaanResponse {
  kode_kategori: DosenKategoriSkor;
  items:         DosenSkorPertanyaanItem[];
}

export async function fetchDosenSkorPertanyaan(
  filter:        AkademikFilter,
  kodeKategori:  DosenKategoriSkor,
  signal?:       AbortSignal,
): Promise<DosenSkorPertanyaanResponse> {
  const { data } = await api.get<DosenSkorPertanyaanResponse>(
    '/api/dashboard/dosen/skor-pertanyaan',
    { params: buildDosenParams(filter, { kode_kategori: kodeKategori }), signal },
  );
  return data;
}