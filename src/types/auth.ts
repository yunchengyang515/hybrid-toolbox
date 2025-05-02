export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isMockMode: boolean;
}

// Re-export auth-related types from shared types
export * from '../shared/types';
