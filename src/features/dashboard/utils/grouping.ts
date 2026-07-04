import {
  FASILITAS_FACULTY_AVG,
  PRODI_FACULTY_AVG,
  SOFTSKILL_FACULTY_AVG,
  KARAKTER_FACULTY_AVG,
} from '@/features/dashboard/mocks/mockDataWisudawan';
import type { WisudawanFilter, GroupDataItem } from '@/features/dashboard/types';

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