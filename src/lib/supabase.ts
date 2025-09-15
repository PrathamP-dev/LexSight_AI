import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client if the required environment variables are available.
 * This function is designed to be called on-demand to prevent startup crashes
 * when environment variables are not set.
 * @returns A Supabase client instance or null if credentials are not provided.
 */
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseUrl.trim() !== '' && supabaseAnonKey && supabaseAnonKey.trim() !== '') {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return null; 
};
