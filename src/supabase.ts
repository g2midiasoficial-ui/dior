import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Public project values (the publishable key is meant to ship to the browser; access is enforced by RLS).
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY override them, e.g. to point at another project.
const DEFAULT_SUPABASE_URL = 'https://ienjsdxngxrzkbbdrfyi.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_5wZ8jLi7BIRfyXtADavoxw_U604q3KC';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// When the env vars are missing the app keeps working in local-only mode (localStorage)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

if (!isSupabaseConfigured) {
  console.warn('Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env. Usando apenas armazenamento local.');
}
