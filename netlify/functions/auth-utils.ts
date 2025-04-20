import { HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Standard CORS headers for responses
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

/**
 * Validates user JWT token from Authorization header
 */
export async function validateAuth(event: HandlerEvent) {
  try {
    // Extract JWT token from Authorization header
    const authHeader = event.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'Missing or invalid authorization header' };
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Auth validation error:', error);
      return { user: null, error: error.message };
    }
    console.log('Auth validation data:', data);
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

/**
 * Returns a standard unauthorized response
 */
export function unauthorizedResponse() {
  return {
    statusCode: 401,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Unauthorized' }),
  };
}
