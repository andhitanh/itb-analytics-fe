import type { Issue } from '@/features/dashboard/types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const FACULTIES = ['STEI','FTI','FITB','FMIPA','FTMD','FTSL','FTTM','SAPPK','SF','SBM','FSRD','SITH'];

export const FACULTY_FULL: Record<string, string> = {
  STEI:  'Sekolah Teknik Elektro & Informatika',
  FTI:   'Fakultas Teknologi Industri',
  FITB:  'Fak. Ilmu & Teknologi Kebumian',
  FMIPA: 'Fak. Matematika & IPA',
  FTMD:  'Fak. Teknik Mesin & Dirgantara',
  FTSL:  'Fak. Teknik Sipil & Lingkungan',
  FTTM:  'Fak. Teknik Pertambangan & Perminyakan',
  SAPPK: 'Sekolah Arsitektur, Perencanaan & Kebijakan',
  SF:    'Sekolah Farmasi',
  SBM:   'Sekolah Bisnis & Manajemen',
  FSRD:  'Fak. Seni Rupa & Desain',
  SITH:  'Sekolah Ilmu & Teknologi Hayati',
};

export const SEMESTERS       = ['2020/21-2','2021/22-1','2021/22-2','2022/23-1','2022/23-2','2023/24-1','2023/24-2'];
export const SEMESTERS_SHORT = ['20/21-2','21/22-1','21/22-2','22/23-1','22/23-2','23/24-1','23/24-2'];

export const QUESTIONS_SHORT = ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10','Q11','Q12'];

export const QUESTIONS_FULL = [
  'Saya memperoleh informasi yang cukup tentang hal-hal tertentu yang harus saya capai atau kuasai (luaran matakuliah) sesudah mengikuti matakuliah ini.',
  'Pelaksanaan perkuliahan diarahkan agar mahasiswa dapat mencapai atau menguasai luaran matakuliah ini.',
  'Saya mencapai atau menguasai luaran matakuliah ini.',
  'Pelaksanaan perkuliahan terorganisir dengan baik.',
  'Dosen berkomunikasi dengan efektif.',
  'Dosen peduli terhadap pencapaian atau penguasaan mahasiswa akan luaran matakuliah ini.',
  'Dosen berlaku adil (fair) kepada mahasiswa.',
  'Beban kerja untuk matakuliah ini sesuai dengan SKS-nya.',
  'Sarana prasarana untuk matakuliah tersedia dengan memadai.',
  'Tersedia cukup fasilitas pendukung di luar kuliah yang memungkinkan saya mengikuti matakuliah ini dengan baik.',
  'Saya berusaha dengan sungguh-sungguh mengikuti matakuliah ini.',
  'Saya memperoleh pengalaman belajar yang positif dalam matakuliah ini.',
];

// ─── Faculty Q-scores (latest semester: 2023/24-2) ───────────────────────────

export const LATEST_SCORES: Record<string, number[]> = {
  STEI:  [3.62,3.65,3.52,3.71,3.68,3.74,3.81,3.12,3.28,3.22,3.55,3.61],
  FTI:   [3.58,3.61,3.48,3.65,3.63,3.70,3.75,3.08,3.31,3.19,3.52,3.57],
  FITB:  [3.55,3.59,3.45,3.62,3.59,3.67,3.72,3.15,3.24,3.18,3.49,3.54],
  FMIPA: [3.60,3.63,3.50,3.68,3.65,3.72,3.78,3.10,3.30,3.20,3.53,3.58],
  FTMD:  [3.53,3.57,3.43,3.60,3.57,3.65,3.70,3.05,3.22,3.15,3.47,3.52],
  FTSL:  [3.56,3.60,3.46,3.63,3.60,3.68,3.73,3.09,3.26,3.17,3.50,3.55],
  FTTM:  [3.50,3.54,3.40,3.57,3.55,3.62,3.68,3.02,3.18,3.12,3.45,3.50],
  SAPPK: [3.66,3.69,3.56,3.74,3.71,3.78,3.83,3.18,3.35,3.28,3.60,3.65],
  SF:    [3.63,3.67,3.54,3.72,3.69,3.76,3.81,3.15,3.32,3.25,3.57,3.62],
  SBM:   [3.70,3.73,3.61,3.79,3.76,3.83,3.88,3.25,3.40,3.35,3.65,3.71],
  FSRD:  [3.68,3.71,3.59,3.77,3.74,3.81,3.86,3.22,3.38,3.32,3.63,3.69],
  SITH:  [3.57,3.61,3.47,3.64,3.62,3.69,3.74,3.11,3.27,3.20,3.51,3.56],
};

const DELTAS: Record<string, number[]> = {
  '2023/24-1': [0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02],
  '2022/23-2': [0.04,0.04,0.04,0.04,0.04,0.03,0.03,0.04,0.04,0.04,0.03,0.04],
  '2022/23-1': [0.07,0.07,0.06,0.07,0.06,0.05,0.05,0.06,0.07,0.07,0.05,0.06],
  '2021/22-2': [0.10,0.10,0.09,0.10,0.09,0.08,0.08,0.09,0.10,0.10,0.08,0.09],
  '2021/22-1': [0.13,0.13,0.12,0.13,0.12,0.11,0.11,0.12,0.13,0.13,0.10,0.12],
  '2020/21-2': [0.16,0.16,0.14,0.16,0.14,0.13,0.13,0.14,0.16,0.16,0.12,0.14],
};

export function getScoreForSemester(faculty: string, semester: string): number[] {
  const base = LATEST_SCORES[faculty];
  if (semester === '2023/24-2') return base;
  const delta = DELTAS[semester];
  return base.map((b, i) => Math.round((b - delta[i]) * 100) / 100);
}

export function avgOf(arr: number[]): number {
  return Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 100) / 100;
}

export const AVG_PER_QUESTION: number[] = QUESTIONS_SHORT.map((_, qi) => {
  const vals = FACULTIES.map(f => LATEST_SCORES[f][qi]);
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 100) / 100;
});

export const TEMPORAL_AVG = SEMESTERS.map(sem => ({
  semester: sem,
  sem,
  avg:   avgOf(FACULTIES.flatMap(f => getScoreForSemester(f, sem))),
  q1q3:  avgOf(FACULTIES.flatMap(f => getScoreForSemester(f, sem).slice(0, 3))),
  q4q7:  avgOf(FACULTIES.flatMap(f => getScoreForSemester(f, sem).slice(3, 7))),
  q8:    avgOf(FACULTIES.map(f => getScoreForSemester(f, sem)[7])),
  q9q10: avgOf(FACULTIES.flatMap(f => getScoreForSemester(f, sem).slice(8, 10))),
}));
TEMPORAL_AVG.forEach((d, i) => { d.semester = SEMESTERS_SHORT[i]; });

export const FACULTY_AVG = FACULTIES.map(f => ({
  faculty: f,
  avg:    avgOf(LATEST_SCORES[f]),
  q1q3:   avgOf(LATEST_SCORES[f].slice(0, 3)),
  q4q7:   avgOf(LATEST_SCORES[f].slice(3, 7)),
  q8:     LATEST_SCORES[f][7],
  q9q10:  avgOf(LATEST_SCORES[f].slice(8, 10)),
  q11q12: avgOf(LATEST_SCORES[f].slice(10, 12)),
  prev:   avgOf(FACULTIES.map(f2 => avgOf(getScoreForSemester(f2, '2023/24-1')))),
}));

export function getFacultyQScore(faculty: string, qIndex: number): number {
  return LATEST_SCORES[faculty][qIndex];
}

export function getFacultyQScorePrev(faculty: string, qIndex: number): number {
  return getScoreForSemester(faculty, '2023/24-1')[qIndex];
}

// ─── Temporal Grade ───────────────────────────────────────────────────────────

export interface TemporalGradePoint {
  semester: string;
  itb: number; sbm: number; fsrd: number;
  stei: number; fmipa: number; fttm: number;
}

export const TEMPORAL_GRADE: TemporalGradePoint[] = [
  { semester:'20/21-2', itb:2.92, sbm:3.20, fsrd:3.25, stei:2.98, fmipa:2.91, fttm:2.79 },
  { semester:'21/22-1', itb:2.95, sbm:3.24, fsrd:3.28, stei:3.01, fmipa:2.94, fttm:2.81 },
  { semester:'21/22-2', itb:2.99, sbm:3.27, fsrd:3.32, stei:3.04, fmipa:2.97, fttm:2.84 },
  { semester:'22/23-1', itb:3.02, sbm:3.31, fsrd:3.36, stei:3.07, fmipa:3.01, fttm:2.88 },
  { semester:'22/23-2', itb:3.04, sbm:3.33, fsrd:3.39, stei:3.08, fmipa:3.03, fttm:2.91 },
  { semester:'23/24-1', itb:3.06, sbm:3.35, fsrd:3.41, stei:3.10, fmipa:3.06, fttm:2.94 },
  { semester:'23/24-2', itb:3.08, sbm:3.38, fsrd:3.43, stei:3.11, fmipa:3.08, fttm:2.97 },
];

// ─── Grade Distribution ───────────────────────────────────────────────────────

export interface GradeDist {
  faculty: string;
  A: number; AB: number; B: number; BC: number; C: number; D: number; E: number;
  avgScore: number;
}

export const GRADE_DIST: GradeDist[] = [
  { faculty:'STEI',  A:22, AB:28, B:24, BC:12, C:8,  D:4, E:2, avgScore:3.11 },
  { faculty:'FTI',   A:20, AB:26, B:25, BC:13, C:9,  D:5, E:2, avgScore:3.06 },
  { faculty:'FITB',  A:19, AB:25, B:24, BC:15, C:10, D:5, E:2, avgScore:3.02 },
  { faculty:'FMIPA', A:21, AB:27, B:23, BC:13, C:9,  D:5, E:2, avgScore:3.08 },
  { faculty:'FTMD',  A:18, AB:24, B:24, BC:16, C:11, D:5, E:2, avgScore:2.99 },
  { faculty:'FTSL',  A:20, AB:25, B:24, BC:14, C:10, D:5, E:2, avgScore:3.04 },
  { faculty:'FTTM',  A:17, AB:23, B:24, BC:16, C:12, D:6, E:2, avgScore:2.97 },
  { faculty:'SAPPK', A:26, AB:30, B:22, BC:11, C:7,  D:3, E:1, avgScore:3.23 },
  { faculty:'SF',    A:24, AB:28, B:23, BC:12, C:8,  D:4, E:1, avgScore:3.17 },
  { faculty:'SBM',   A:32, AB:30, B:20, BC:10, C:5,  D:2, E:1, avgScore:3.38 },
  { faculty:'FSRD',  A:35, AB:28, B:19, BC:9,  C:6,  D:2, E:1, avgScore:3.43 },
  { faculty:'SITH',  A:21, AB:26, B:24, BC:14, C:9,  D:4, E:2, avgScore:3.07 },
];

export const GRADE_DIST_SORTED = [...GRADE_DIST].sort((a, b) => b.avgScore - a.avgScore);

export const FACULTY_GRADE_LATEST = [...GRADE_DIST]
  .sort((a, b) => b.avgScore - a.avgScore)
  .map(d => ({ faculty: d.faculty, avg: d.avgScore }));

export const ITB_GRADE_DIST = {
  A:  Math.round(GRADE_DIST.reduce((s, d) => s + d.A,  0) / GRADE_DIST.length),
  AB: Math.round(GRADE_DIST.reduce((s, d) => s + d.AB, 0) / GRADE_DIST.length),
  B:  Math.round(GRADE_DIST.reduce((s, d) => s + d.B,  0) / GRADE_DIST.length),
  BC: Math.round(GRADE_DIST.reduce((s, d) => s + d.BC, 0) / GRADE_DIST.length),
  C:  Math.round(GRADE_DIST.reduce((s, d) => s + d.C,  0) / GRADE_DIST.length),
  D:  Math.round(GRADE_DIST.reduce((s, d) => s + d.D,  0) / GRADE_DIST.length),
  E:  Math.round(GRADE_DIST.reduce((s, d) => s + d.E,  0) / GRADE_DIST.length),
};

// ─── Case Method & Team-Based Project ────────────────────────────────────────

export interface CaseMethodData {
  faculty: string;
  caseMethod: number; teamBased: number;
  combined: number; neither: number;
}

export const CASE_METHOD: CaseMethodData[] = [
  { faculty:'STEI',  caseMethod:18, teamBased:22, combined:40, neither:60 },
  { faculty:'FTI',   caseMethod:15, teamBased:20, combined:35, neither:65 },
  { faculty:'FITB',  caseMethod:12, teamBased:15, combined:27, neither:73 },
  { faculty:'FMIPA', caseMethod:10, teamBased:12, combined:22, neither:78 },
  { faculty:'FTMD',  caseMethod:14, teamBased:18, combined:32, neither:68 },
  { faculty:'FTSL',  caseMethod:16, teamBased:17, combined:33, neither:67 },
  { faculty:'FTTM',  caseMethod: 8, teamBased:12, combined:20, neither:80 },
  { faculty:'SAPPK', caseMethod:28, teamBased:25, combined:53, neither:47 },
  { faculty:'SF',    caseMethod:20, teamBased:18, combined:38, neither:62 },
  { faculty:'SBM',   caseMethod:32, teamBased:28, combined:60, neither:40 },
  { faculty:'FSRD',  caseMethod:25, teamBased:32, combined:57, neither:43 },
  { faculty:'SITH',  caseMethod:14, teamBased:16, combined:30, neither:70 },
];

export const CASE_METHOD_TEMPORAL = SEMESTERS_SHORT.map((s, i) => ({
  semester: s,
  combined: parseFloat((31 + i * 1.2).toFixed(1)),
  caseOnly: parseFloat((16 + i * 0.6).toFixed(1)),
  teamOnly: parseFloat((15 + i * 0.6).toFixed(1)),
}));

// ─── Grading Component Composition ───────────────────────────────────────────

export interface GradingComp {
  faculty: string;
  UTS: number; UAS: number; Tugas: number;
  Kuis: number; Praktikum: number; Other: number;
}

export const GRADING_COMP: GradingComp[] = [
  { faculty:'STEI',  UTS:25, UAS:30, Tugas:20, Kuis:10, Praktikum:10, Other:5  },
  { faculty:'FTI',   UTS:28, UAS:32, Tugas:18, Kuis:8,  Praktikum:10, Other:4  },
  { faculty:'FITB',  UTS:25, UAS:30, Tugas:20, Kuis:10, Praktikum:12, Other:3  },
  { faculty:'FMIPA', UTS:30, UAS:35, Tugas:15, Kuis:10, Praktikum:8,  Other:2  },
  { faculty:'FTMD',  UTS:27, UAS:33, Tugas:18, Kuis:8,  Praktikum:12, Other:2  },
  { faculty:'FTSL',  UTS:25, UAS:30, Tugas:20, Kuis:10, Praktikum:12, Other:3  },
  { faculty:'FTTM',  UTS:28, UAS:32, Tugas:16, Kuis:8,  Praktikum:14, Other:2  },
  { faculty:'SAPPK', UTS:20, UAS:25, Tugas:30, Kuis:5,  Praktikum:10, Other:10 },
  { faculty:'SF',    UTS:22, UAS:28, Tugas:20, Kuis:10, Praktikum:18, Other:2  },
  { faculty:'SBM',   UTS:20, UAS:25, Tugas:30, Kuis:10, Praktikum:5,  Other:10 },
  { faculty:'FSRD',  UTS:15, UAS:20, Tugas:40, Kuis:5,  Praktikum:15, Other:5  },
  { faculty:'SITH',  UTS:24, UAS:28, Tugas:20, Kuis:10, Praktikum:16, Other:2  },
];

// ─── Q8 by SKS Bucket ─────────────────────────────────────────────────────────

export interface Q8BySKS {
  sks:  string;
  q8:   number;
  n:    number;
}

export const Q8_BY_SKS: Q8BySKS[] = [
  { sks: '1–2 SKS', q8: 3.65, n: 423  },
  { sks: '3 SKS',   q8: 3.42, n: 2841 },
  { sks: '4 SKS',   q8: 3.31, n: 1205 },
  { sks: '5+ SKS',  q8: 3.18, n: 352  },
];

// ─── Attendance ───────────────────────────────────────────────────────────────

export const LECTURER_ATTENDANCE = FACULTIES.map((f, i) => ({
  faculty: f,
  value: [96,94,93,95,92,94,91,97,95,97,96,94][i],
  prev:  [95,93,92,94,91,93,90,96,94,96,95,93][i],
}));

export const STUDENT_ATTENDANCE = FACULTIES.map((f, i) => ({
  faculty: f,
  value: [88,85,83,86,82,84,80,90,87,91,89,85][i],
  prev:  [86,83,81,84,80,82,78,88,85,89,87,83][i],
}));

// ─── Top & Bottom Courses ─────────────────────────────────────────────────────

export const TOP_COURSES = [
  { name:'Kewirausahaan dan Inovasi', faculty:'SBM',   avg:3.72, students:180, trend:+0.05, acPerc:91 },
  { name:'Desain Interior',           faculty:'FSRD',  avg:3.68, students:45,  trend:+0.03, acPerc:93 },
  { name:'Manajemen Proyek Kreatif',  faculty:'FSRD',  avg:3.65, students:38,  trend:+0.04, acPerc:95 },
  { name:'Etika Bisnis',              faculty:'SBM',   avg:3.63, students:145, trend:+0.02, acPerc:90 },
  { name:'Studio Perancangan 3',      faculty:'SAPPK', avg:3.61, students:52,  trend:+0.03, acPerc:89 },
];

export const BOTTOM_COURSES = [
  { name:'Matematika Rekayasa III', faculty:'FMIPA', avg:2.61, students:320, trend:-0.03, acPerc:52 },
  { name:'Mekanika Kuantum',        faculty:'FMIPA', avg:2.72, students:210, trend:+0.04, acPerc:58 },
  { name:'Termodinamika Lanjut',    faculty:'FTMD',  avg:2.78, students:185, trend:-0.01, acPerc:60 },
  { name:'Mineralogi',              faculty:'FTTM',  avg:2.81, students:165, trend:+0.02, acPerc:62 },
  { name:'Kalkulus Multivariabel',  faculty:'FMIPA', avg:2.83, students:410, trend:+0.05, acPerc:63 },
];

// ─── Dominant Issues ─────────────────────────────────────────────────────────
// Issue type diimport dari @/features/dashboard/types

export const ISSUES_MAHASISWA: Issue[] = [
  { label:'Beban tugas terlalu berat',              count:1842, sentiment:'negative' },
  { label:'Koneksi internet/WiFi kampus buruk',     count:1235, sentiment:'negative' },
  { label:'Penjelasan materi kurang jelas',          count:1102, sentiment:'negative' },
  { label:'Kurang variasi metode pembelajaran',     count:894,  sentiment:'negative' },
  { label:'Jadwal kuliah padat/bentrok',            count:821,  sentiment:'negative' },
  { label:'Ketersediaan referensi terbatas',        count:712,  sentiment:'negative' },
  { label:'Ruang kelas kurang nyaman',              count:680,  sentiment:'negative' },
  { label:'Feedback penilaian kurang cepat',        count:598,  sentiment:'negative' },
  { label:'Sarana lab tidak memadai',               count:541,  sentiment:'negative' },
  { label:'Harapan positif terhadap mata kuliah',   count:312,  sentiment:'positive' },
];

export const ISSUES_DOSEN: Issue[] = [
  { label:'Ukuran kelas terlalu besar',             count:425, sentiment:'negative' },
  { label:'Keterbatasan sarana praktikum',          count:388, sentiment:'negative' },
  { label:'Kurangnya jumlah asisten/TA',            count:341, sentiment:'negative' },
  { label:'Sinkronisasi kurikulum antarprodi',      count:290, sentiment:'neutral'  },
  { label:'Jadwal yang tidak fleksibel',            count:256, sentiment:'negative' },
  { label:'Mahasiswa kurang mempersiapkan diri',    count:238, sentiment:'negative' },
  { label:'Platform e-learning kurang optimal',     count:211, sentiment:'negative' },
  { label:'Koordinasi antar dosen pengampu',        count:189, sentiment:'neutral'  },
  { label:'Beban administrasi terlalu tinggi',      count:172, sentiment:'negative' },
  { label:'Inovasi metode sudah berjalan baik',     count:98,  sentiment:'positive' },
];

export const ISSUES_ITB: Issue[] = [
  { label:'Renovasi dan peningkatan lab',           count:512, sentiment:'negative' },
  { label:'Peningkatan kualitas WiFi kampus',       count:478, sentiment:'negative' },
  { label:'Penambahan kuota asisten/TA',            count:421, sentiment:'negative' },
  { label:'Revisi kurikulum lebih kontekstual',     count:389, sentiment:'neutral'  },
  { label:'Pembaruan sistem akademik SIX',          count:356, sentiment:'negative' },
  { label:'Pengurangan beban administrasi dosen',   count:312, sentiment:'negative' },
  { label:'Penambahan ruang belajar mahasiswa',     count:289, sentiment:'negative' },
  { label:'Standarisasi penilaian antarprodi',      count:245, sentiment:'neutral'  },
  { label:'Dukungan pengembangan metode inovatif',  count:201, sentiment:'positive' },
  { label:'Peningkatan layanan perpustakaan digital',count:178, sentiment:'negative' },
];

export const RAW_COMMENTS_MAHASISWA = [
  'Tugas setiap minggu sangat banyak dan menghabiskan waktu untuk mata kuliah lain.',
  'WiFi di gedung kuliah sering putus-putus sehingga menghambat pembelajaran.',
  'Materi perlu lebih banyak contoh soal dan latihan sebelum ujian.',
  'Dosen memberikan penjelasan yang sangat sistematis dan mudah dipahami.',
  'Banyak tugas mendadak tanpa pemberitahuan sebelumnya.',
  'Kuliah lebih menarik jika ada studi kasus nyata dari industri.',
];

export const RAW_COMMENTS_DOSEN = [
  'Dengan kelas 80 mahasiswa, sulit memberikan perhatian individual kepada setiap mahasiswa.',
  'Peralatan laboratorium perlu diperbarui agar relevan dengan perkembangan industri.',
  'Koordinasi antar dosen untuk mata kuliah berkoordinasi perlu ditingkatkan.',
  'Mahasiswa perlu lebih aktif membaca materi sebelum kuliah dimulai.',
  'Platform LMS yang ada belum mendukung fitur kuis interaktif yang memadai.',
];

export const RAW_COMMENTS_ITB = [
  'Diharapkan ITB dapat menyediakan lebih banyak ruang belajar kelompok di luar jam kuliah.',
  'Sistem penjadwalan perlu dioptimasi untuk menghindari bentrokan jadwal yang sering terjadi.',
  'Dukungan pengembangan metode case method perlu lebih sistematis dari tingkat fakultas.',
  'Perpustakaan digital ITB perlu memperluas koleksi jurnal internasional.',
  'Perlu ada pelatihan pedagogik bagi dosen untuk metode pembelajaran inovatif.',
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export const STATS = {
  totalCourses:       847,
  avgClassPerCourse:  2.8,
  activeLecturers:    512,
  activeStudents:     16241,
};