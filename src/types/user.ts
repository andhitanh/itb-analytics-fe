// ─── Role Enum ────────────────────────────────────────────────────────────────

export type UserRole =
  | 'admin'
  | 'direktorat'
  | 'dekan'
  | 'jajaran_dekanat'
  | 'kaprodi'
  | 'jajaran_prodi'
  | 'dosen';

// ─── Role Entry (matches backend Redis session structure, camelCase) ───────────

export interface RoleEntry {
  userRoleId: number;
  role:       UserRole;
  dosenId:    number | null;
  kkId:       number | null;
  noPs:       number | null;
  kdFak:      string | null;
  isPrime:    boolean;
}

// ─── User Info ────────────────────────────────────────────────────────────────

export interface UserInfo {
  userId:         string;
  name:           string;
  email:          string;
  avatarUrl?:     string;
  availableRoles: RoleEntry[];
  activeRole:     RoleEntry;
}

// ─── Display Labels ───────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  admin:           'Administrator',
  direktorat:      'Direktorat',
  dekan:           'Dekan',
  jajaran_dekanat: 'Jajaran Dekanat',
  kaprodi:         'Kepala Program Studi',
  jajaran_prodi:   'Jajaran Program Studi',
  dosen:           'Dosen',
};

// Higher = more privilege; used to determine default active role when no isPrime
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin:           7,
  direktorat:      6,
  dekan:           5,
  jajaran_dekanat: 4,
  kaprodi:         3,
  jajaran_prodi:   2,
  dosen:           1,
};

// ─── Scope Lookup Tables ──────────────────────────────────────────────────────

export const FAKULTAS_NAMES: Record<string, string> = {
  STEI:  'Sekolah Teknik Elektro dan Informatika',
  FTI:   'Fakultas Teknologi Industri',
  FITB:  'Fakultas Ilmu dan Teknologi Kebumian',
  FMIPA: 'Fakultas Matematika dan Ilmu Pengetahuan Alam',
  FTMD:  'Fakultas Teknik Mesin dan Dirgantara',
  FTSL:  'Fakultas Teknik Sipil dan Lingkungan',
  FTTM:  'Fakultas Teknik Pertambangan dan Perminyakan',
  SAPPK: 'Sekolah Arsitektur, Perencanaan dan Pengembangan Kebijakan',
  SF:    'Sekolah Farmasi',
  SBM:   'Sekolah Bisnis dan Manajemen',
  FSRD:  'Fakultas Seni Rupa dan Desain',
  SITH:  'Sekolah Ilmu dan Teknologi Hayati',
  SPS:   'Sekolah Pascasarjana',
};

// Small mock subset — in production these come from API
export const PRODI_NAMES: Record<number, string> = {
  161: 'Teknik Informatika',
  198: 'Teknik Elektro',
  932: 'Teknik Kimia',
  935: 'Teknik Industri',
  207: 'Teknik Sipil',
  271: 'Manajemen Rekayasa Industri',
};

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Scope label for a single role entry, shown as sub-text in the role dropdown. */
export function getRoleScopeLabel(entry: RoleEntry): string {
  if (entry.kdFak) return FAKULTAS_NAMES[entry.kdFak] ?? entry.kdFak;
  if (entry.noPs)  return PRODI_NAMES[entry.noPs]     ?? `Prodi ${entry.noPs}`;
  return 'Institut Teknologi Bandung';
}

/**
 * Default active role: first entry with isPrime=true, or the one with
 * highest hierarchy if none is prime.
 */
export function resolveDefaultRole(roles: RoleEntry[]): RoleEntry {
  const prime = roles.find(r => r.isPrime);
  if (prime) return prime;
  return [...roles].sort(
    (a, b) => ROLE_HIERARCHY[b.role] - ROLE_HIERARCHY[a.role]
  )[0];
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}
