import { createContext, useContext, useState, type ReactNode } from 'react';
import { type UserInfo, type UserRole, getHighestRole } from '../types/user';

// ─── Mock Users (ganti dengan data dari API/auth nanti) ───────────────────────

const MOCK_ADMIN_USER: UserInfo = {
  id: '1',
  name: 'Budi Santoso',
  email: 'budi.santoso@itb.ac.id',
  roles: ['admin'],
  activeRole: 'admin',
};

// Contoh multi-role user (untuk testing):
// const MOCK_MULTI_USER: UserInfo = {
//   id: '2',
//   name: 'Rina Wijaya',
//   email: 'rina.wijaya@itb.ac.id',
//   roles: ['kaprodi', 'dosen'],
//   activeRole: 'kaprodi',
//   faculty: 'STEI',
//   department: 'Teknik Informatika',
// };

// ─── Context ──────────────────────────────────────────────────────────────────

interface UserContextType {
  user: UserInfo;
  setActiveRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo>(() => ({
    ...MOCK_ADMIN_USER,
    activeRole: getHighestRole(MOCK_ADMIN_USER.roles),
  }));

  const setActiveRole = (role: UserRole) => {
    if (user.roles.includes(role)) {
      setUser(prev => ({ ...prev, activeRole: role }));
    }
  };

  return (
    <UserContext.Provider value={{ user, setActiveRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within <UserProvider>');
  return ctx;
}