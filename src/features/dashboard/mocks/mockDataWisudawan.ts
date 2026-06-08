import type { Issue } from '@/features/dashboard/types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const FACULTIES    = ['STEI','FTI','FITB','FMIPA','FTMD','FTSL','FTTM','SAPPK','SF','SBM','FSRD','SITH'];
export const PERIODS      = ['2023-Apr','2023-Agu','2023-Okt','2024-Apr','2024-Agu','2024-Okt'];
export const PERIODS_SHORT = ['23-Apr','23-Agu','23-Okt','24-Apr','24-Agu','24-Okt'];

// ─── Fasilitas ITB ────────────────────────────────────────────────────────────

export const FASILITAS_ITEMS = [
  { key:'F01', label:'Ruang kelas cukup',            group:'ruangan'   },
  { key:'F02', label:'Ruang kelas kondusif',          group:'ruangan'   },
  { key:'F03', label:'Laboratorium kondusif',         group:'ruangan'   },
  { key:'F04', label:'Akses internet memadai',        group:'digital'   },
  { key:'F05', label:'Fasilitas pengembangan karir',  group:'penunjang' },
  { key:'F06', label:'Akses sumber pustaka',          group:'digital'   },
  { key:'F07', label:'Perangkat up-to-date',          group:'digital'   },
  { key:'F08', label:'Toilet layak',                  group:'penunjang' },
  { key:'F09', label:'Kantin layak',                  group:'penunjang' },
  { key:'F10', label:'Fasilitas rekreasi',             group:'penunjang' },
  { key:'F11', label:'Fasilitas kesehatan',            group:'penunjang' },
];

export const FASILITAS_BY_FACULTY: Record<string, number[]> = {
  STEI:  [3.42,3.51,3.48,3.38,3.05,3.44,3.21,2.88,2.75,2.92,2.80],
  FTI:   [3.38,3.45,3.42,3.32,3.02,3.40,3.18,2.85,2.72,2.88,2.76],
  FITB:  [3.35,3.40,3.38,3.28,2.98,3.35,3.14,2.82,2.68,2.82,2.72],
  FMIPA: [3.40,3.48,3.45,3.35,3.05,3.42,3.20,2.88,2.78,2.90,2.82],
  FTMD:  [3.32,3.38,3.35,3.25,2.95,3.32,3.10,2.80,2.65,2.80,2.70],
  FTSL:  [3.36,3.42,3.40,3.30,3.00,3.38,3.15,2.84,2.70,2.84,2.74],
  FTTM:  [3.28,3.32,3.30,3.20,2.90,3.28,3.05,2.75,2.60,2.75,2.65],
  SAPPK: [3.48,3.56,3.52,3.42,3.12,3.50,3.28,2.95,2.85,3.00,2.90],
  SF:    [3.45,3.52,3.50,3.40,3.08,3.48,3.25,2.92,2.82,2.95,2.88],
  SBM:   [3.55,3.62,3.58,3.50,3.22,3.56,3.38,3.05,2.95,3.10,3.00],
  FSRD:  [3.52,3.58,3.55,3.45,3.18,3.52,3.32,3.00,2.90,3.05,2.95],
  SITH:  [3.38,3.45,3.42,3.32,3.02,3.40,3.18,2.84,2.72,2.88,2.78],
};

export const KEPUASAN_KESELURUHAN_BY_FACULTY: Record<string, number> = {
  STEI:3.55, FTI:3.50, FITB:3.45, FMIPA:3.52, FTMD:3.42,
  FTSL:3.47, FTTM:3.38, SAPPK:3.60, SF:3.58, SBM:3.72, FSRD:3.68, SITH:3.48,
};

function avgAcross(itemIdx: number): number {
  const vals = FACULTIES.map(f => FASILITAS_BY_FACULTY[f][itemIdx]);
  return parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2));
}

export const FASILITAS_ITB_AVG = FASILITAS_ITEMS
  .map((item, i) => ({ ...item, avg: avgAcross(i) }))
  .sort((a, b) => a.avg - b.avg);

export const FASILITAS_AVG_OVERALL = parseFloat(
  (FASILITAS_ITB_AVG.reduce((s, d) => s + d.avg, 0) / FASILITAS_ITB_AVG.length).toFixed(2),
);

function groupAvg(keys: string[]): number {
  const indices = keys.map(k => FASILITAS_ITEMS.findIndex(i => i.key === k));
  return parseFloat(
    (indices.map(i => avgAcross(i)).reduce((s, v) => s + v, 0) / indices.length).toFixed(2),
  );
}

export const FASILITAS_RUANGAN_AVG  = groupAvg(['F01','F02','F03']);
export const FASILITAS_DIGITAL_AVG  = groupAvg(['F04','F06','F07']);
export const FASILITAS_PENUNJANG_AVG = groupAvg(['F08','F09','F10','F11']);

export const KEPUASAN_KESELURUHAN_AVG = parseFloat(
  (FACULTIES.map(f => KEPUASAN_KESELURUHAN_BY_FACULTY[f]).reduce((s, v) => s + v, 0) / FACULTIES.length).toFixed(2),
);

export const FASILITAS_FACULTY_AVG = FACULTIES.map(f => ({
  faculty:  f,
  avg:      parseFloat((FASILITAS_BY_FACULTY[f].reduce((s, v) => s + v, 0) / FASILITAS_BY_FACULTY[f].length).toFixed(2)),
  kepuasan: KEPUASAN_KESELURUHAN_BY_FACULTY[f],
})).sort((a, b) => a.avg - b.avg);

// ─── Program Studi ────────────────────────────────────────────────────────────

export const PRODI_ITEMS = [
  { key:'P01', label:'Wali akademik selalu ada',            group:'perwalian'   },
  { key:'P02', label:'Wali akademik bantu syarat studi',    group:'perwalian'   },
  { key:'P03', label:'Dosen beri interaksi informal',       group:'perkuliahan' },
  { key:'P04', label:'Dosen perhatian pada proses belajar', group:'perkuliahan' },
  { key:'P05', label:'Dosen kemampuan profesional',         group:'perkuliahan' },
  { key:'P06', label:'MK wajib beri dasar kuat',            group:'perkuliahan' },
  { key:'P07', label:'Keleluasaan pilih MK pilihan',        group:'perkuliahan' },
  { key:'P08', label:'Lab/studio selaras teori',            group:'perkuliahan' },
  { key:'P09', label:'Sarana lab/studio memadai',           group:'perkuliahan' },
  { key:'P10', label:'Prodi jelaskan lapangan kerja',       group:'karir'       },
  { key:'P11', label:'Suka bidang studi',                   group:'kepuasan'    },
  { key:'P12', label:'Akan pilih prodi yang sama',          group:'kepuasan'    },
];

export const PRODI_BY_FACULTY: Record<string, number[]> = {
  STEI:  [3.20,3.35,3.10,3.38,3.65,3.55,3.25,3.45,3.42,2.88,3.72,3.48],
  FTI:   [3.15,3.30,3.05,3.32,3.60,3.50,3.20,3.40,3.38,2.82,3.68,3.42],
  FITB:  [3.12,3.28,3.02,3.28,3.55,3.45,3.15,3.35,3.32,2.78,3.62,3.38],
  FMIPA: [3.18,3.32,3.08,3.35,3.62,3.52,3.22,3.42,3.40,2.85,3.70,3.45],
  FTMD:  [3.08,3.22,2.98,3.25,3.52,3.42,3.12,3.32,3.28,2.75,3.58,3.32],
  FTSL:  [3.14,3.28,3.04,3.30,3.58,3.48,3.18,3.38,3.35,2.80,3.64,3.40],
  FTTM:  [3.02,3.18,2.92,3.20,3.48,3.38,3.08,3.28,3.22,2.70,3.52,3.28],
  SAPPK: [3.28,3.42,3.18,3.45,3.70,3.60,3.32,3.52,3.48,2.95,3.78,3.55],
  SF:    [3.25,3.38,3.15,3.42,3.68,3.58,3.28,3.50,3.45,2.92,3.75,3.52],
  SBM:   [3.38,3.52,3.30,3.55,3.78,3.68,3.42,3.60,3.55,3.10,3.85,3.65],
  FSRD:  [3.35,3.48,3.28,3.52,3.75,3.65,3.38,3.58,3.52,3.05,3.82,3.62],
  SITH:  [3.18,3.32,3.08,3.35,3.60,3.50,3.22,3.42,3.38,2.84,3.68,3.44],
};

function prodiItemAvg(i: number): number {
  const vals = FACULTIES.map(f => PRODI_BY_FACULTY[f][i]);
  return parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2));
}

export const PRODI_ITB_AVG = PRODI_ITEMS
  .map((item, i) => ({ ...item, avg: prodiItemAvg(i) }))
  .sort((a, b) => a.avg - b.avg);

export const PRODI_FACULTY_AVG = FACULTIES.map(f => ({
  faculty:     f,
  avg:         parseFloat((PRODI_BY_FACULTY[f].reduce((s, v) => s + v, 0) / PRODI_BY_FACULTY[f].length).toFixed(2)),
  p12_pctSame: Math.round((PRODI_BY_FACULTY[f][11] / 4) * 100),
})).sort((a, b) => a.avg - b.avg);

export const PRODI_AVG_OVERALL = parseFloat(
  (PRODI_ITB_AVG.reduce((s, d) => s + d.avg, 0) / PRODI_ITB_AVG.length).toFixed(2),
);
export const PRODI_PERWALIAN_AVG = parseFloat(
  ([0,1].map(i => prodiItemAvg(i)).reduce((s, v) => s + v, 0) / 2).toFixed(2),
);
export const PRODI_PERKULIAHAN_AVG = parseFloat(
  ([2,3,4,5,6,7,8].map(i => prodiItemAvg(i)).reduce((s, v) => s + v, 0) / 7).toFixed(2),
);
export const PRODI_LAPKERJA_AVG = prodiItemAvg(9);

export interface FacultyItemRank { faculty: string; item: string; avg: number; }

export const PRODI_BOTTOM3_PER_FAC: FacultyItemRank[] = FACULTIES.flatMap(f =>
  PRODI_BY_FACULTY[f]
    .map((v, i) => ({ faculty: f, item: PRODI_ITEMS[i].label, avg: v }))
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 3),
);
export const PRODI_TOP3_PER_FAC: FacultyItemRank[] = FACULTIES.flatMap(f =>
  PRODI_BY_FACULTY[f]
    .map((v, i) => ({ faculty: f, item: PRODI_ITEMS[i].label, avg: v }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3),
);

export interface RekoData {
  faculty: string;
  notRekom: number; kualitasDosen: number; fasilitasAkademik: number;
  suasanaAkademik: number; lapanganKerja: number; jejaringAlumni: number; other: number;
}

export const REKO_DIST: RekoData[] = [
  { faculty:'STEI',  notRekom:2, kualitasDosen:35, fasilitasAkademik:22, suasanaAkademik:20, lapanganKerja:12, jejaringAlumni:6,  other:3 },
  { faculty:'FTI',   notRekom:3, kualitasDosen:30, fasilitasAkademik:20, suasanaAkademik:22, lapanganKerja:15, jejaringAlumni:7,  other:3 },
  { faculty:'FITB',  notRekom:4, kualitasDosen:28, fasilitasAkademik:18, suasanaAkademik:20, lapanganKerja:18, jejaringAlumni:9,  other:3 },
  { faculty:'FMIPA', notRekom:3, kualitasDosen:32, fasilitasAkademik:21, suasanaAkademik:22, lapanganKerja:13, jejaringAlumni:6,  other:3 },
  { faculty:'FTMD',  notRekom:4, kualitasDosen:27, fasilitasAkademik:18, suasanaAkademik:21, lapanganKerja:19, jejaringAlumni:8,  other:3 },
  { faculty:'FTSL',  notRekom:3, kualitasDosen:29, fasilitasAkademik:19, suasanaAkademik:22, lapanganKerja:17, jejaringAlumni:7,  other:3 },
  { faculty:'FTTM',  notRekom:5, kualitasDosen:25, fasilitasAkademik:16, suasanaAkademik:20, lapanganKerja:22, jejaringAlumni:9,  other:3 },
  { faculty:'SAPPK', notRekom:2, kualitasDosen:36, fasilitasAkademik:24, suasanaAkademik:22, lapanganKerja:10, jejaringAlumni:4,  other:2 },
  { faculty:'SF',    notRekom:2, kualitasDosen:34, fasilitasAkademik:23, suasanaAkademik:20, lapanganKerja:11, jejaringAlumni:7,  other:3 },
  { faculty:'SBM',   notRekom:1, kualitasDosen:30, fasilitasAkademik:18, suasanaAkademik:18, lapanganKerja:20, jejaringAlumni:10, other:3 },
  { faculty:'FSRD',  notRekom:1, kualitasDosen:38, fasilitasAkademik:28, suasanaAkademik:20, lapanganKerja:8,  jejaringAlumni:3,  other:2 },
  { faculty:'SITH',  notRekom:3, kualitasDosen:30, fasilitasAkademik:20, suasanaAkademik:22, lapanganKerja:15, jejaringAlumni:7,  other:3 },
];

// ─── Softskill & Karakter ─────────────────────────────────────────────────────

export const SOFTSKILL_ITEMS = [
  'Komunikasi lisan','Komunikasi tertulis','Berbahasa asing',
  'Selesaikan masalah sistematis','Penilaian kritis terhadap orang lain',
  'Kritisi pemikiran diri sendiri','Kemukakan pendapat','Kerja tim','Kerja mandiri',
];

export const KARAKTER_ITEMS = [
  'Kejujuran','Memelihara komitmen','Menjaga emosi',
  'Kepedulian terhadap orang lain','Bersikap objektif',
  'Tidak mudah menyerah','Patuh pada aturan/hukum',
];

export const SOFTSKILL_BY_FACULTY: Record<string, number[]> = {
  STEI:  [3.38,3.42,2.85,3.65,3.50,3.48,3.40,3.55,3.60],
  FTI:   [3.32,3.38,2.80,3.60,3.45,3.42,3.35,3.50,3.55],
  FITB:  [3.28,3.32,2.75,3.55,3.40,3.38,3.30,3.45,3.50],
  FMIPA: [3.35,3.40,2.82,3.62,3.48,3.45,3.38,3.52,3.58],
  FTMD:  [3.25,3.28,2.72,3.52,3.38,3.35,3.28,3.42,3.48],
  FTSL:  [3.30,3.35,2.78,3.58,3.42,3.40,3.32,3.48,3.52],
  FTTM:  [3.20,3.25,2.68,3.48,3.32,3.30,3.22,3.38,3.44],
  SAPPK: [3.45,3.50,2.92,3.70,3.58,3.55,3.48,3.62,3.65],
  SF:    [3.42,3.48,2.88,3.68,3.55,3.52,3.45,3.60,3.62],
  SBM:   [3.58,3.62,3.05,3.75,3.65,3.62,3.58,3.72,3.68],
  FSRD:  [3.55,3.58,2.98,3.72,3.62,3.60,3.55,3.68,3.65],
  SITH:  [3.32,3.38,2.80,3.60,3.45,3.42,3.35,3.50,3.55],
};

export const KARAKTER_BY_FACULTY: Record<string, number[]> = {
  STEI:  [3.72,3.65,3.42,3.58,3.55,3.68,3.75],
  FTI:   [3.68,3.60,3.38,3.52,3.50,3.62,3.70],
  FITB:  [3.62,3.55,3.32,3.48,3.45,3.58,3.65],
  FMIPA: [3.70,3.62,3.40,3.55,3.52,3.65,3.72],
  FTMD:  [3.58,3.52,3.28,3.44,3.42,3.55,3.62],
  FTSL:  [3.64,3.56,3.34,3.50,3.48,3.60,3.68],
  FTTM:  [3.52,3.45,3.22,3.38,3.35,3.48,3.55],
  SAPPK: [3.78,3.70,3.48,3.64,3.62,3.74,3.80],
  SF:    [3.75,3.68,3.45,3.62,3.58,3.72,3.78],
  SBM:   [3.85,3.78,3.58,3.72,3.70,3.82,3.88],
  FSRD:  [3.82,3.74,3.55,3.68,3.66,3.78,3.84],
  SITH:  [3.66,3.58,3.36,3.52,3.50,3.62,3.70],
};

function skillItemAvg(data: Record<string, number[]>, idx: number): number {
  const vals = FACULTIES.map(f => data[f][idx]);
  return parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2));
}

export const SOFTSKILL_ITB_AVG = SOFTSKILL_ITEMS
  .map((label, i) => ({ label, avg: skillItemAvg(SOFTSKILL_BY_FACULTY, i) }))
  .sort((a, b) => a.avg - b.avg);

export const KARAKTER_ITB_AVG = KARAKTER_ITEMS
  .map((label, i) => ({ label, avg: skillItemAvg(KARAKTER_BY_FACULTY, i) }))
  .sort((a, b) => a.avg - b.avg);

export const SOFTSKILL_FACULTY_AVG = FACULTIES.map(f => ({
  faculty: f,
  avg: parseFloat((SOFTSKILL_BY_FACULTY[f].reduce((s, v) => s + v, 0) / SOFTSKILL_BY_FACULTY[f].length).toFixed(2)),
})).sort((a, b) => a.avg - b.avg);

export const KARAKTER_FACULTY_AVG = FACULTIES.map(f => ({
  faculty: f,
  avg: parseFloat((KARAKTER_BY_FACULTY[f].reduce((s, v) => s + v, 0) / KARAKTER_BY_FACULTY[f].length).toFixed(2)),
})).sort((a, b) => a.avg - b.avg);

// ─── Permasalahan ─────────────────────────────────────────────────────────────

export const MASALAH_PREVALENSI = [
  { key:'akademis',   label:'Masalah Akademis',       pct:58, impactPct:42, color:'#F5A623' },
  { key:'keuangan',   label:'Masalah Keuangan',       pct:35, impactPct:61, color:'#E74C3C' },
  { key:'psikologis', label:'Masalah Psikologis',     pct:42, impactPct:55, color:'#9B59B6' },
  { key:'sosial',     label:'Masalah Sosial/Budaya',  pct:22, impactPct:38, color:'#3498DB' },
  { key:'kesehatan',  label:'Masalah Kesehatan',      pct:48, impactPct:34, color:'#27AE60' },
];

export const LAYANAN_DUKUNGAN = [
  { label:'Beasiswa / Pinjaman',  avg:3.12, respondents:35, color:'#E74C3C' },
  { label:'Bimbingan Konseling',  avg:2.88, respondents:42, color:'#9B59B6' },
  { label:'Nasehat Dosen Wali',   avg:3.35, respondents:58, color:'#F5A623' },
  { label:'Nasehat Dosen MK',     avg:3.48, respondents:58, color:'#27AE60' },
];

// ─── Tren temporal ────────────────────────────────────────────────────────────

export const TEMPORAL_WISUDA = PERIODS_SHORT.map((sem, i) => ({
  semester:      sem,
  kepuasanUmum:  parseFloat((3.35 + i * 0.04).toFixed(2)),
  fasilitas:     parseFloat((3.20 + i * 0.03).toFixed(2)),
  prodi:         parseFloat((3.40 + i * 0.025).toFixed(2)),
  softskill:     parseFloat((3.45 + i * 0.02).toFixed(2)),
  responden:     1800 + i * 120,
}));

// ─── Distribusi Strata & Responden ───────────────────────────────────────────

export const STRATA_DIST = [
  { name:'S1',      value:62, color:'#003366' },
  { name:'S2',      value:28, color:'#1A6AB5' },
  { name:'S3',      value:6,  color:'#4CA3DD' },
  { name:'Profesi', value:4,  color:'#A8D4F5' },
];

export const RESPONDEN_BY_FACULTY = [
  { faculty:'STEI', count:380 }, { faculty:'FTI',   count:290 },
  { faculty:'FITB', count:185 }, { faculty:'FMIPA', count:210 },
  { faculty:'FTMD', count:165 }, { faculty:'FTSL',  count:195 },
  { faculty:'FTTM', count:140 }, { faculty:'SAPPK', count:120 },
  { faculty:'SF',   count:135 }, { faculty:'SBM',   count:220 },
  { faculty:'FSRD', count:115 }, { faculty:'SITH',  count:145 },
].sort((a, b) => b.count - a.count);

export const TOTAL_RESPONDEN = RESPONDEN_BY_FACULTY.reduce((s, d) => s + d.count, 0);

// ─── Top/Bottom aspek evaluasi ────────────────────────────────────────────────

const ALL_ITEMS_FLAT = [
  ...FASILITAS_ITEMS.map((it, i) => ({ label: it.label, avg: avgAcross(i),                         src: 'Fasilitas'     })),
  ...PRODI_ITEMS.map((it, i)     => ({ label: it.label, avg: prodiItemAvg(i),                       src: 'Program Studi' })),
  ...SOFTSKILL_ITEMS.map((lb, i) => ({ label: lb,        avg: skillItemAvg(SOFTSKILL_BY_FACULTY, i), src: 'Softskill'     })),
  ...KARAKTER_ITEMS.map((lb, i)  => ({ label: lb,        avg: skillItemAvg(KARAKTER_BY_FACULTY, i),  src: 'Karakter'      })),
];

export const TOP5_ASPEK    = [...ALL_ITEMS_FLAT].sort((a, b) => b.avg - a.avg).slice(0, 5);
export const BOTTOM5_ASPEK = [...ALL_ITEMS_FLAT].sort((a, b) => a.avg - b.avg).slice(0, 5);

// ─── Suara Wisudawan ─────────────────────────────────────────────────────────
// Issue type diimport dari @/features/dashboard/types

export const ISSUES_POSITIF: Issue[] = [
  { label:'Kualitas dosen dan pengajaran yang profesional',  count:1245, sentiment:'positive' },
  { label:'Suasana akademik yang kompetitif dan mendukung',  count:1102, sentiment:'positive' },
  { label:'Fasilitas kampus lengkap dan modern',             count:988,  sentiment:'positive' },
  { label:'Jejaring alumni yang luas',                       count:872,  sentiment:'positive' },
  { label:'Pengalaman organisasi dan kemahasiswaan',         count:741,  sentiment:'positive' },
];

export const ISSUES_NEGATIF: Issue[] = [
  { label:'Biaya kuliah (UKT) terlalu tinggi',              count:1842, sentiment:'negative' },
  { label:'Beban akademik sangat berat dan melelahkan',     count:1523, sentiment:'negative' },
  { label:'Fasilitas toilet dan kantin kurang memadai',     count:1211, sentiment:'negative' },
  { label:'Kurangnya pendampingan kesehatan mental',        count:1089, sentiment:'negative' },
  { label:'Sarana parkir dan transportasi kampus terbatas', count:876,  sentiment:'negative' },
];

export const ISSUES_SARAN: Issue[] = [
  { label:'Tingkatkan layanan kesehatan dan konseling',      count:1432, sentiment:'neutral'  },
  { label:'Renovasi dan perbanyak fasilitas toilet',         count:1285, sentiment:'neutral'  },
  { label:'Kurangi biaya administrasi dan transparansi UKT', count:1140, sentiment:'neutral'  },
  { label:'Perbanyak program magang dan koneksi industri',   count:982,  sentiment:'positive' },
  { label:'Perbaiki sistem penjadwalan dan SIX',             count:891,  sentiment:'neutral'  },
];

export const RAW_POSITIF = [
  'Dosen-dosen di sini luar biasa kompeten dan benar-benar peduli dengan perkembangan mahasiswanya.',
  'Suasana belajar yang penuh semangat dan kompetisi sehat membuat saya terus berkembang.',
  'Fasilitas laboratorium sangat lengkap dan mendukung penelitian saya hingga ke level internasional.',
  'Jejaring alumni ITB benar-benar membantu saya mendapat pekerjaan pertama setelah lulus.',
  'Banyak kesempatan lomba dan kompetisi yang membentuk kemampuan saya secara nyata.',
];

export const RAW_NEGATIF = [
  'UKT yang terus naik terasa memberatkan, terutama di tengah kondisi ekonomi keluarga yang sulit.',
  'Tekanan akademik sangat tinggi sehingga sering mengorbankan kesehatan fisik dan mental.',
  'Toilet di beberapa gedung masih dalam kondisi memprihatinkan dan perlu perhatian lebih.',
  'Tidak ada layanan konseling yang mudah diakses saat saya sedang mengalami krisis.',
  'Kantin kampus penuh dan mahal, pilihan makanan juga terbatas.',
];

export const RAW_SARAN = [
  'Tolong sediakan psikolog kampus yang lebih banyak dan mudah diakses tanpa stigma.',
  'Renovasi toilet serentak, bukan satu gedung per tahun — ini sudah jadi keluhan bertahun-tahun.',
  'Transparansi perhitungan UKT agar mahasiswa dan orang tua bisa memahami dan merencanakannya.',
  'Perluas program magang terstruktur yang terintegrasi dengan kurikulum.',
  'Sistem SIX perlu diperbaiki secara menyeluruh — pengalaman mahasiswa sangat frustrasi saat KRS.',
];

// ─── Komentar untuk Acara Wisuda ─────────────────────────────────────────────

export const KOMENTAR_WISUDA = {
  lucu: [
    { strata:'S1', faculty:'SBM',   text:'Motto sukses studi di ITB: Tidur adalah kemewahan, kopi adalah kebutuhan primer.' },
    { strata:'S2', faculty:'STEI',  text:'Sifat khas diri sendiri: Introvert, tapi teman-teman bilang extrovert. Sampai sekarang saya masih bingung siapa yang benar.' },
    { strata:'S1', faculty:'FSRD',  text:'Suka duka ITB: Sukanya ketemu orang-orang keren. Dukanya, semua orang keren itu jadi saingan.' },
  ],
  inspiratif: [
    { strata:'S2', faculty:'FMIPA', text:'Lewat bidang nuklir ini saya bisa berani bermimpi mencapai tingkat paling tinggi dalam pendidikan dan berkontribusi untuk kemajuan bangsa.' },
    { strata:'S1', faculty:'FTI',   text:'Saya belajar bahwa batas kemampuan kita jauh lebih jauh dari yang kita kira. ITB yang membuktikannya.' },
    { strata:'S2', faculty:'SBM',   text:'Keep moving forward — walaupun banyak cobaan datang, itu yang membuat diri kita lebih kuat.' },
  ],
  popular: [
    { strata:'S1', faculty:'FTMD',  text:'Suka duka di ITB: suka karena mendapatkan teman terbaik seumur hidup, duka karena harus meninggalkan mereka setelah lulus.' },
    { strata:'S2', faculty:'STEI',  text:'Belajar bisa dari siapa saja, dari mana saja, dan kapan saja — itulah yang ITB ajarkan kepada saya.' },
    { strata:'S1', faculty:'FMIPA', text:'Selama berkuliah, jangan lupa mencari teman buat belajar dan jangan malu meminta bantuan.' },
  ],
};