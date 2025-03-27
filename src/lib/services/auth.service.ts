import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';

export interface AuthService {
  signIn(): Promise<User | null>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export class SupabaseAuthService implements AuthService {
  async signIn(): Promise<User | null> {
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google'
        });
        if (error) throw error;
        return data.user;
      } else {
        // Mock mode
        return { 
          id: 'mock-id',
          email: 'mock@example.com',
          name: 'Mock User'
        };
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
}

export const createAuthService = (): AuthService => {
  return new SupabaseAuthService();
};