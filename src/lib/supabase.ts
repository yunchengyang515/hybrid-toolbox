import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (supabaseUrl && supabaseUrl.startsWith('https://')) {
  console.log('Supabase URL is secure:', supabaseUrl);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Running in mock mode.');
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'mock-key'
);

export async function signInWithGoogle() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      user: {
        id: 'mock-id',
        email: 'mock@example.com',
        user_metadata: { full_name: 'Mock User' },
      },
    };
  }

  console.log('Signing in with Google...');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/chat`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}
