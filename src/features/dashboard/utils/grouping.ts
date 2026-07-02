import {
  FACULTIES,
  FACULTY_AVG,
  FACULTY_GRADE_LATEST,
  getFacultyQScore,
} from '@/features/dashboard/mocks/mockData';
import {
  FASILITAS_FACULTY_AVG,
  PRODI_FACULTY_AVG,
  SOFTSKILL_FACULTY_AVG,
  KARAKTER_FACULTY_AVG,
} from '@/features/dashboard/mocks/mockDataWisudawan';
import type { AkademikFilter, WisudawanFilter, GroupDataItem } from '@/features/dashboard/types';
import type { UserRole } from '@/types/user';

// ─── Akademik ─────────────────────────────────────────────────────────────────

/**
 * Skor per pertanyaan kuesioner, dikelompokkan per entitas.
 * Saat ini: fakultas. Ketika API: prodi jika filter/role mengindikasikan.
 */
export function deriveQScoreGroup(
  filter: AkademikFilter,
  _role:  UserRole,
  qIndex: number,
): GroupDataItem[] {
  const faculties = filter.fakultas !== 'semua'
    ? [filter.fakultas]
    : FACULTIES;
  return faculties.map(f => ({ label: f, avg: getFacultyQScore(f, qIndex) }));
}

/**
 * Rata-rata keseluruhan skor kuesioner per entitas.
 */
export function deriveOverallAvgGroup(
  filter: AkademikFilter,
  _role:  UserRole,
): GroupDataItem[] {
  const source = filter.fakultas !== 'semua'
    ? FACULTY_AVG.filter(d => d.faculty === filter.fakultas)
    : FACULTY_AVG;
  return source.map(d => ({ label: d.faculty, avg: d.avg }));
}

/**
 * Rata-rata nilai akhir (IP) per entitas.
 */
export function deriveGradeGroup(
  filter: AkademikFilter,
  _role:  UserRole,
): GroupDataItem[] {
  const source = filter.fakultas !== 'semua'
    ? FACULTY_GRADE_LATEST.filter(d => d.faculty === filter.fakultas)
    : FACULTY_GRADE_LATEST;
  return source.map(d => ({ label: d.faculty, avg: d.avg }));
}

// ─── Wisudawan ────────────────────────────────────────────────────────────────

export function deriveFasilitasGroup(
  filter: WisudawanFilter,
): GroupDataItem[] {
  const source = filter.fakultas !== 'semua'
    ? FASILITAS_FACULTY_AVG.filter(d => d.faculty === filter.fakultas)
    : FASILITAS_FACULTY_AVG;
  return source.map(d => ({ label: d.faculty, avg: d.avg }));
}

export function deriveProdiGroup(
  filter: WisudawanFilter,
): GroupDataItem[] {
  const source = filter.fakultas !== 'semua'
    ? PRODI_FACULTY_AVG.filter(d => d.faculty === filter.fakultas)
    : PRODI_FACULTY_AVG;
  return source.map(d => ({ label: d.faculty, avg: d.avg }));
}

export function deriveSoftskillGroup(
  filter: WisudawanFilter,
): GroupDataItem[] {
  const source = filter.fakultas !== 'semua'
    ? SOFTSKILL_FACULTY_AVG.filter(d => d.faculty === filter.fakultas)
    : SOFTSKILL_FACULTY_AVG;
  return source.map(d => ({ label: d.faculty, avg: d.avg }));
}

export function deriveKarakterGroup(
  filter: WisudawanFilter,
): GroupDataItem[] {
  const source = filter.fakultas !== 'semua'
    ? KARAKTER_FACULTY_AVG.filter(d => d.faculty === filter.fakultas)
    : KARAKTER_FACULTY_AVG;
  return source.map(d => ({ label: d.faculty, avg: d.avg }));
}