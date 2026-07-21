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
  /**
   * Label entitas siap-tampil untuk profil header, sudah dihitung backend
   * (nama fakultas untuk dekan/jajaran dekanat, nama prodi untuk
   * kaprodi/jajaran prodi, nama kk untuk dosen, atau label institut untuk
   * admin/direktorat). null hanya terjadi kalau backend gagal resolve
   * (harusnya tidak pernah, tapi tetap ditangani lewat fallback di
   * getRoleScopeLabel).
   */
  scopeLabel: string | null;
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

const INSTITUT_LABEL = 'Institut Teknologi Bandung';

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Scope label for a single role entry, shown as sub-text in the role dropdown
 * and in the profile header.
 *
 * Sumber utama adalah `scopeLabel` yang sudah dihitung backend (lihat
 * auth/role_mapper.py::_compute_scope_label) — backend yang query nama
 * fakultas/prodi/kk sebenarnya dari DB, bukan lookup table statis di sini.
 * Fallback ke label institut hanya untuk jaga-jaga kalau field ini kosong
 * (mis. sesi lama sebelum field ini ada, atau error saat resolve di backend).
 */
export function getRoleScopeLabel(entry: RoleEntry): string {
  return entry.scopeLabel ?? INSTITUT_LABEL;
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