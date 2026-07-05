/**
 * src/context/UserContext.tsx
 *
 * Sumber kebenaran tunggal untuk state auth + user di seluruh aplikasi.
 *
 * Flow login:
 *   App mount → GET /api/auth/me
 *     200  → user terisi, isAuthenticated = true
 *     401  → user = null, isAuthenticated = false
 *
 * Flow session expiry (mid-session):
 *   axios interceptor (lib/axios.ts) dispatch 'auth:unauthorized'
 *   → listener di sini reset user → RequireAuth redirect ke /login
 *
 * Flow logout:
 *   logout() → POST /api/auth/logout → reset user
 *   → pemanggil (profile-section) navigate ke /login
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import axios from 'axios';
import { fetchMe, postLogout, patchActiveRole } from '@/api/auth';
import { type UserInfo, type RoleEntry } from '@/types/user';

// ─── Context Type ─────────────────────────────────────────────────────────────

interface UserContextType {
  user:            UserInfo | null;
  isAuthenticated: boolean;
  loading:         boolean;
  setActiveRole:   (userRoleId: number) => void;
  logout:          () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext<UserContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function UserProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch((err) => {
        // 401 = belum / tidak lagi login → kondisi normal, bukan error
        if (!axios.isAxiosError(err) || err.response?.status !== 401) {
          console.error('[Auth] Gagal fetch /me:', err);
        }
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Handle session expiry mid-session ─────────────────────────────────────
  // axios interceptor dispatch 'auth:unauthorized' saat terima 401.
  // Di sini kita reset user → isAuthenticated jadi false
  // → RequireAuth otomatis redirect ke /login.
  useEffect(() => {
    function onUnauthorized() {
      setUser(null);
    }
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

   // ── Role switcher ────────────────────────────────────────────────────────
 // Panggil backend dulu (source of truth ada di session Redis), baru update
// state lokal dari RESPONS backend — bukan dari input userRoleId mentah,
 // supaya kalau backend menolak (403, role tidak valid), UI tidak ikut
 // berubah secara keliru.
 const setActiveRole = useCallback(async (userRoleId: number) => {
   const result = await patchActiveRole(userRoleId); // { active_role, available_roles }
   setUser(prev => {
     if (!prev) return prev;
     const entry = prev.availableRoles.find(
       (r: RoleEntry) => r.userRoleId === result.active_role.user_role_id,
     );
     return entry ? { ...prev, activeRole: entry } : prev;
   });
 }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await postLogout();
    } finally {
      // Reset state meskipun request gagal — sisi browser tetap bersih
      setUser(null);
    }
  }, []);

  const value: UserContextType = {
    user,
    isAuthenticated: user !== null,
    loading,
    setActiveRole,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within <UserProvider>');
  return ctx;
}