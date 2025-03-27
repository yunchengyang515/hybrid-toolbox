import { create } from 'zustand';
import { AuthState, User } from '@/types/auth';
import { createAuthService, AuthService } from '@/lib/services/auth.service';

const authService: AuthService = createAuthService();

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initMockSession: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isMockMode: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: async () => {
    await authService.signOut();
    set({ user: null, isAuthenticated: false, isMockMode: false });
  },
  initMockSession: () => set({
    user: {
      id: 'mock-user-id',
      email: 'demo@example.com',
      name: 'Demo User'
    },
    isAuthenticated: true,
    isMockMode: true
  })
}));