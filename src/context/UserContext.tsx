import { createContext, useContext, useState, type ReactNode } from 'react';
import { type UserInfo, type RoleEntry, resolveDefaultRole } from '@/types/user';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ROLES: RoleEntry[] = [
  { userRoleId: 1, role: 'admin',      dosenId: null, kkId: null, noPs: null,  kdFak: null,   isPrime: false },
  { userRoleId: 2, role: 'direktorat', dosenId: null, kkId: null, noPs: null,  kdFak: null,   isPrime: false },
  { userRoleId: 3, role: 'dekan',      dosenId: 666,  kkId: null, noPs: null,  kdFak: 'STEI', isPrime: true  },
  { userRoleId: 4, role: 'kaprodi',    dosenId: 666,  kkId: null, noPs: 161,   kdFak: null,   isPrime: false },
  { userRoleId: 5, role: 'kaprodi',    dosenId: 666,  kkId: null, noPs: 198,   kdFak: null,   isPrime: false },
];

const MOCK_USER: UserInfo = {
  userId:         '9090901111',
  name:           'Rina Wijaya',
  email:          'rina.wijaya@itb.ac.id',
  availableRoles: MOCK_ROLES,
  activeRole:     resolveDefaultRole(MOCK_ROLES),
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface UserContextType {
  user:          UserInfo;
  setActiveRole: (userRoleId: number) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo>(MOCK_USER);

  const setActiveRole = (userRoleId: number) => {
    const entry = user.availableRoles.find(r => r.userRoleId === userRoleId);
    if (entry) setUser(prev => ({ ...prev, activeRole: entry }));
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
