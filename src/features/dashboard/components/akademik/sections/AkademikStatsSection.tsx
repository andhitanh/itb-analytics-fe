import { StatCard } from '@/components/ui/stat-card';
import type { StatsOverviewResponse } from '@/features/dashboard/api/akademik';

// ─── Icons ────────────────────────────────────────────────────────────────────

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="#003366" strokeWidth="1.5"/>
      <path d="M4 7h12M8 3v14" stroke="#003366" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function ClassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="11" rx="2" stroke="#003366" strokeWidth="1.5"/>
      <path d="M7 17h6M10 14v3" stroke="#003366" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function TeacherIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3" stroke="#003366" strokeWidth="1.5"/>
      <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#003366" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
function StudentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L18 7l-8 4L2 7l8-4z" stroke="#003366" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M2 7v5M18 7v3M6 10.5v3.5a6 6 0 0 0 8 0v-3.5" stroke="#003366" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AkademikStatsSectionProps {
  data:      StatsOverviewResponse | null;
  isLoading: boolean;
}

const PLACEHOLDER = '—';

export function AkademikStatsSection({ data, isLoading }: AkademikStatsSectionProps) {
  const fmt = (n: number | undefined, opts?: Intl.NumberFormatOptions) =>
    isLoading || n === undefined ? PLACEHOLDER : n.toLocaleString('id', opts);

  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard
        label="Mata Kuliah"
        value={fmt(data?.jumlah_matkul_aktif)}
        sub="Aktif semester ini"
        icon={<BookIcon />}
      />
      <StatCard
        label="Kelas / MK"
        value={
          isLoading || !data || data.jumlah_matkul_aktif === 0
            ? PLACEHOLDER
            : (data.jumlah_kelas / data.jumlah_matkul_aktif).toFixed(1)
        }
        sub="Rata-rata kelas per MK"
        icon={<ClassIcon />}
      />
      <StatCard
        label="Dosen Aktif"
        value={fmt(data?.jumlah_dosen_aktif)}
        sub="Mengajar semester ini"
        icon={<TeacherIcon />}
      />
      <StatCard
        label="Mahasiswa"
        value={fmt(data?.jumlah_mahasiswa_aktif)}
        sub="Terdaftar semester ini"
        icon={<StudentIcon />}
      />
    </div>
  );
}