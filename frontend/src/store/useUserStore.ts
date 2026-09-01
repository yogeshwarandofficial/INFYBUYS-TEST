import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/services/auth.service';

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'verification-required'
  | 'session-expired';

interface UserState {
  user: User | null;
  status: AuthStatus;
  token: string | null;
  setUser: (user: User | null, token?: string) => void;
  setStatus: (status: AuthStatus) => void;
  logout: (expired?: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      status: 'idle',
      token: null,
      setUser: (user, token) => set({
        user: user ? { ...user, roles: user.roles?.map(r => r.toLowerCase()) } : null,
        token: token || null,
        status: user ? (
          import.meta.env.VITE_EMAIL_VERIFICATION_ENABLED === 'true'
            ? (user.verified ? 'authenticated' : 'verification-required')
            : 'authenticated'
        ) : 'unauthenticated'
      }),
      setStatus: (status) => set({ status }),
      logout: (expired = false) => set({
        user: null,
        token: null,
        status: expired ? 'session-expired' : 'unauthenticated'
      }),
    }),
    {
      name: 'infybuys-auth-storage',
    }
  )
);
