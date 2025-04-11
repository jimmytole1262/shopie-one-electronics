import { createClient } from '@supabase/supabase-js';

// Use empty strings as fallbacks to prevent errors during initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a safe version of the Supabase client that won't throw during initialization
let supabase;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      global: {
        fetch: fetch.bind(globalThis)
      }
    });
  } else {
    // Create a mock client that returns empty data for all operations
    supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            limit: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      // Add other commonly used methods as needed
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null })
      }
    };
    console.warn('Supabase credentials not found. Using mock client.');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a mock client as fallback
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          limit: () => Promise.resolve({ data: [], error: null })
        })
      })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    }
  };
}

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

export { supabase };