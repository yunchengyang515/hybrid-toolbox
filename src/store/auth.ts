import { create } from 'zustand';
import { AuthState, User } from '@/types/auth';
import { createAuthService, AuthService } from '@/lib/services/auth.service';
import { isSafeMode } from '@/lib/utils';

const authService: AuthService = createAuthService();

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initMockSession: () => void;
  initSafeMode: () => void;
  isSafeMode: boolean;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  isAuthenticated: false,
  isMockMode: false,
  isSafeMode: isSafeMode(),
  setUser: user => set({ user, isAuthenticated: !!user }),
  logout: async () => {
    await authService.signOut();
    set({ user: null, isAuthenticated: false, isMockMode: false });
  },
  initMockSession: () =>
    set({
      user: {
        id: 'mock-user-id',
        email: 'demo@example.com',
        name: 'Demo User',
      },
      isAuthenticated: true,
      isMockMode: true,
    }),
  initSafeMode: () =>
    set({
      user: {
        id: 'bolt-dev-user',
        email: 'bolt-dev@example.com',
        name: 'Bolt Dev User',
      },
      isAuthenticated: true,
      isMockMode: true,
      isSafeMode: true,
    }),
}));
