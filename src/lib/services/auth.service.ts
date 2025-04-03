import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';

export interface AuthService {
  signIn(): Promise<User | null | void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export class SupabaseAuthService implements AuthService {
  async signIn(): Promise<void> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      console.log('Sign-in data:', data);
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return user
        ? {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          }
        : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
}

export const createAuthService = (): AuthService => {
  return new SupabaseAuthService();
};
