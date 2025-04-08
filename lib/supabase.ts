import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and Anon Key must be provided in environment variables'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    fetch: fetch.bind(globalThis)
  }
});

// Test connection on startup
(async () => {
  try {
    const { error } = await supabase.from('products').select('*').limit(1);
    if (error) throw error;
    console.log('Supabase connected successfully');
  } catch (error) {
    console.error('Supabase connection error:', error);
    throw new Error('Failed to connect to Supabase');
  }
})();