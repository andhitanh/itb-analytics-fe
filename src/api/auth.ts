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
  // Label entitas siap-tampil, sudah dihitung backend sesuai role
  // (nama fakultas/prodi/kk, atau "Institut Teknologi Bandung" untuk
  // admin/direktorat). Lihat auth/role_mapper.py::_compute_scope_label.
  scope_label:  string | null;
}

interface MeResponse {
  user_id:         number | string;
  nama:            string;
  active_role:     { role: string; user_role_id: number; scope_label: string | null };
  available_roles: MeRoleEntry[];
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapRole(r: MeRoleEntry): RoleEntry {
  return {
    userRoleId:  r.user_role_id,
    role:        r.role as RoleEntry['role'],
    isPrime:     r.is_prime,
    scopeLabel:  r.scope_label,
    // Field-field ini tidak dikembalikan oleh /me; diisi null.
    // Gunakan endpoint terpisah jika scope detail (kd_fak/no_ps/kk_id
    // mentah) diperlukan — untuk kebutuhan tampilan header, scopeLabel
    // di atas sudah cukup dan tidak perlu di-resolve lagi di frontend.
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

// ─── Response shape dari backend PATCH /api/auth/role ─────────────────────────

interface SwitchRoleResponse {
  active_role:     { role: string; user_role_id: number; scope_label: string | null };
  available_roles: MeRoleEntry[];
}

export async function patchActiveRole(userRoleId: number): Promise<SwitchRoleResponse> {
  const { data } = await api.patch<SwitchRoleResponse>('/api/auth/role', { user_role_id: userRoleId });
  return data;
}