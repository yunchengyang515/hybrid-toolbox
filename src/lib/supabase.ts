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
