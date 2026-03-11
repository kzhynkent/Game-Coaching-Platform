'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'player' | 'coach';
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    role: 'player' | 'coach'
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore user from sessionStorage (not localStorage — token stays in httpOnly cookie)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('auth_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // Ignore parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      if (res.success && res.user) {
        const u = res.user as unknown as User;
        setUser(u);
        sessionStorage.setItem('auth_user', JSON.stringify(u));
        return { success: true };
      }
      return { success: false, error: res.error || 'Login failed.' };
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, role: 'player' | 'coach') => {
      const res = await authApi.register(email, password, role);
      if (res.success && res.user) {
        const u = res.user as unknown as User;
        setUser(u);
        sessionStorage.setItem('auth_user', JSON.stringify(u));
        return { success: true };
      }
      return { success: false, error: res.error || 'Registration failed.' };
    },
    []
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    sessionStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
