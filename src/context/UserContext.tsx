/**
 * src/context/UserContext.tsx
 *
 * Sumber kebenaran tunggal untuk state auth + user di seluruh aplikasi.
 *
 * Flow:
 *   1. Mount → panggil GET /api/auth/me
 *   2a. 200  → set user, isAuthenticated = true
 *   2b. 401  → user = null, isAuthenticated = false (belum/sudah tidak login)
 *   3. logout() → POST /api/auth/logout → reset state → router redirect ke /login
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

  // Cek session yang ada saat aplikasi pertama dimuat.
  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch((err) => {
        // 401 = belum login / session expired → bukan error yang perlu dilaporkan
        if (!axios.isAxiosError(err) || err.response?.status !== 401) {
          console.error('[Auth] Gagal fetch /me:', err);
        }
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const setActiveRole = useCallback((userRoleId: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const entry = prev.availableRoles.find(
        (r: RoleEntry) => r.userRoleId === userRoleId,
      );
      return entry ? { ...prev, activeRole: entry } : prev;
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await postLogout();
    } finally {
      // Reset state meskipun request logout gagal di sisi server
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