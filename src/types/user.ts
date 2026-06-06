export type UserRole = 'admin' | 'institusi' | 'dekanat' | 'kaprodi' | 'dosen';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: UserRole[];
  activeRole: UserRole;
  faculty?: string;
  department?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  institusi: 'Direktorat Pendidikan',
  dekanat: 'Dekanat',
  kaprodi: 'Kepala Program Studi',
  dosen: 'Dosen Mata Kuliah',
};

// Higher number = higher privilege
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 5,
  institusi: 4,
  dekanat: 3,
  kaprodi: 2,
  dosen: 1,
};

export function getHighestRole(roles: UserRole[]): UserRole {
  return [...roles].sort((a, b) => ROLE_HIERARCHY[b] - ROLE_HIERARCHY[a])[0];
}

export function getAffiliationLabel(user: UserInfo): string {
  if (user.activeRole === 'admin' || user.activeRole === 'institusi') {
    return 'Direktorat ITB';
  }
  if (user.activeRole === 'dekanat') {
    return user.faculty ?? 'Fakultas';
  }
  // kaprodi or dosen — show faculty · department
  const parts = [user.faculty, user.department].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : 'Program Studi';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}