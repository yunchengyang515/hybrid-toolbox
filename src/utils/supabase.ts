import {
  createClientComponentClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { supabase as supabaseClient } from '@/lib/supabase';

// Re-export the main client for use in auth service
export const supabase = supabaseClient;

// Keep these helpers for server components if needed
export const createClient = createClientComponentClient<Database>();

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies });
};
