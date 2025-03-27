import { createClient } from '@supabase/supabase-js';

// These values can be replaced with your Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogle() {
  try {
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      if (error) throw error;
      return data;
    } else {
      // Mock mode - simulate successful auth
      return { user: { id: 'mock-id', email: 'mock@example.com' } };
    }
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}