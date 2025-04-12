import { createClient } from '@supabase/supabase-js';

// Use empty strings as fallbacks to prevent errors during initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a safe version of the Supabase client that won't throw during initialization
let supabaseClient;

const createSupabaseClient = () => {
  if (supabaseClient) return supabaseClient;
  
  try {
    if (supabaseUrl && supabaseAnonKey) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
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
      supabaseClient = {
        from: () => ({
          select: () => ({
            eq: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
              update: () => Promise.resolve({ data: [], error: null })
            }),
            update: () => ({
              eq: () => Promise.resolve({ data: [], error: null })
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
    supabaseClient = {
      from: () => ({
        select: () => ({
          eq: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
            update: () => Promise.resolve({ data: [], error: null })
          }),
          update: () => ({
            eq: () => Promise.resolve({ data: [], error: null })
          })
        })
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null })
      }
    };
  }
  
  return supabaseClient;
};

// Export a lazy-initialized supabase client
export const supabase = new Proxy({}, {
  get: (target, prop) => {
    const client = createSupabaseClient();
    return client[prop];
  }
});