/**
 * src/api/auth.ts
 *
 * Fungsi HTTP untuk endpoint auth. Tidak ada side-effect, hanya return data.
 * Semua transformasi snake_case → camelCase dilakukan di sini, bukan di context.
 */
import api from '@/lib/axios';
import { type RoleEntry, type UserInfo, resolveDefaultRole } from '@/types/user';

// ─── Response shape dari backend /api/auth/me ─────────────────────────────────

interface MeRoleEntry {
  role:         string;
  user_role_id: number;
  is_prime:     boolean;
}

interface MeResponse {
  user_id:         number | string;
  nama:            string;
  active_role:     { role: string; user_role_id: number };
  available_roles: MeRoleEntry[];
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapRole(r: MeRoleEntry): RoleEntry {
  return {
    userRoleId: r.user_role_id,
    role:       r.role as RoleEntry['role'],
    isPrime:    r.is_prime,
    // Field-field ini tidak dikembalikan oleh /me; diisi null.
    // Gunakan endpoint terpisah jika scope detail diperlukan.
    dosenId: null,
    kkId:    null,
    noPs:    null,
    kdFak:   null,
  };
}

function mapMeResponse(data: MeResponse): UserInfo {
  const availableRoles = data.available_roles.map(mapRole);

  // activeRole dari server dijadikan referensi, lalu sinkronkan ke objek lokal
  // supaya RoleEntry yang dikembalikan adalah objek yang sama dengan yang ada
  // di availableRoles (bukan copy partial).
  const activeRole =
    availableRoles.find(
      r => r.userRoleId === data.active_role.user_role_id,
    ) ?? resolveDefaultRole(availableRoles);

  return {
    userId:         String(data.user_id),
    name:           data.nama,
    email:          '',          // /me tidak mengembalikan email
    availableRoles,
    activeRole,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Ambil info user yang sedang login.
 * Throws AxiosError dengan status 401 jika belum login / session expired.
 */
export async function fetchMe(): Promise<UserInfo> {
  const { data } = await api.get<MeResponse>('/api/auth/me');
  return mapMeResponse(data);
}

/**
 * Hapus session di server dan clear cookie.
 * Tidak throw meskipun sudah logout sebelumnya (idempotent).
 */
export async function postLogout(): Promise<void> {
  await api.post('/api/auth/logout');
}