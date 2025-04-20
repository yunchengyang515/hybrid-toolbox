import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface AuthService {
  signIn(): Promise<User | null | void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  handleAuthCallback(): Promise<{
    user?: User | null;
    error?: Error | null;
  }>;
}

export class SupabaseAuthService implements AuthService {
  async signIn(): Promise<void> {
    try {
      // Use VITE_UI_BASE environment variable as the base URL
      const baseUrl = import.meta.env.VITE_UI_BASE;
      // Safely join the URL parts to handle trailing slashes correctly
      const redirectUrl = new URL('/auth/callback', baseUrl).toString();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
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
      return user || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Low-level handler for authentication callbacks from OAuth providers
   * @returns A promise that resolves with the session data or error
   * @private
   */
  async handleAuthCallback(): Promise<{ user?: User | null; error?: Error | null }> {
    try {
      const { error } = await supabase.auth.getSession();

      // Check if we have a hash fragment from OAuth redirect
      if (window.location.hash) {
        // Process the OAuth callback
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        return { user: authData.user, error: null };
      }

      return { user: null, error: error as Error | null };
    } catch (error) {
      console.error('Error handling auth callback:', error);
      return { user: null, error: error as Error | null };
    }
  }
}

export const createAuthService = (): AuthService => {
  return new SupabaseAuthService();
};
