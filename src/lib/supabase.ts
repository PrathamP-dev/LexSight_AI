import { createClient } from '@supabase/supabase-js';

// Conditionally create the client only if the credentials are provided
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Ensure the variables are not empty strings before creating the client
  if (supabaseUrl && supabaseUrl.trim() !== '' && supabaseAnonKey && supabaseAnonKey.trim() !== '') {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  // Return null if credentials are not available to prevent crashes
  return null; 
};

export const supabase = createSupabaseClient();
