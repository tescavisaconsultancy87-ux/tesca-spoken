import { createClient } from '@supabase/supabase-js';

// Helper to get client dynamically (especially for server-side where process.env is populated at runtime)
const getInitialClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (url && anonKey) {
    return createClient(url, anonKey);
  }
  return null;
};

let activeClient = getInitialClient();

export let supabase = activeClient;

export function initializeDynamicSupabase(url: string, anonKey: string) {
  if (url && anonKey) {
    activeClient = createClient(url, anonKey);
    supabase = activeClient;
    return activeClient;
  }
  return null;
}

export async function ensureSupabaseClient() {
  if (supabase) return supabase;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data.supabaseUrl && data.supabaseAnonKey) {
          initializeDynamicSupabase(data.supabaseUrl, data.supabaseAnonKey);
        }
      }
    } catch (e) {
      console.error('Failed to dynamically fetch Supabase configuration', e);
    }
  }

  return supabase;
}
