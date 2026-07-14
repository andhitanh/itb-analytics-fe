import type { GradingCompItem } from '@/features/dashboard/api/akademik';
import type { GroupDataItem } from '@/features/dashboard/types';
import { chartColors } from '@/styles/chart-token';

const BUCKETS = [
  { field: 'avg_bobot_uts',          label: 'UTS'          },
  { field: 'avg_bobot_uas',          label: 'UAS'          },
  { field: 'avg_bobot_tugas',        label: 'Tugas'        },
  { field: 'avg_bobot_kuis',         label: 'Kuis'         },
  { field: 'avg_bobot_praktikum',    label: 'Praktikum'    },
  { field: 'avg_bobot_projek',       label: 'Projek'       },
  { field: 'avg_bobot_partisipatif', label: 'Partisipatif' },
] as const;

export function explodeToProfile(item: GradingCompItem): GroupDataItem[] {
  return BUCKETS
    .filter(({ field }) => item[field] !== null)
    .map(({ field, label }) => ({ label, kode: label, avg: item[field] as number }));
}

export const GRADING_BUCKET_COLORS = BUCKETS.map((b, i) => ({
  ...b,
  color: Object.values(chartColors)[i],
}));