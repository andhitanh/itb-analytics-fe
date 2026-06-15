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
import { fetchMe, postLogout } from '@/api/auth';
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

  // ── Role switcher (local only) ─────────────────────────────────────────────
  // Backend PATCH /api/auth/role masih dikomentari.
  // Saat backend enable endpoint tersebut, tambahkan API call di sini.
  const setActiveRole = useCallback((userRoleId: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const entry = prev.availableRoles.find(
        (r: RoleEntry) => r.userRoleId === userRoleId,
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