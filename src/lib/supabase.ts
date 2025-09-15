import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Conditionally create the client only if the credentials are provided
const createSupabaseClient = () => {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  // Return null if credentials are not available to prevent crashes
  return null; 
};

export const supabase = createSupabaseClient();
