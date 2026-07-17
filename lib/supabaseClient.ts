import { createClient } from '@supabase/supabase-js';

// Helper to get client dynamically (especially for server-side where process.env is populated at runtime)
const getInitialClient = () => {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  if (url && anonKey) {
    try {
      return createClient(url, anonKey);
    } catch (e: any) {
      console.error('[Supabase Client] Static Init Error:', e);
    }
  }
  return null;
};

let activeClient = getInitialClient();

export let supabase = activeClient;

export function initializeDynamicSupabase(url: string, anonKey: string) {
  const cleanUrl = (url || '').trim();
  const cleanKey = (anonKey || '').trim();
  if (cleanUrl && cleanKey) {
    try {
      activeClient = createClient(cleanUrl, cleanKey);
      supabase = activeClient;
      return activeClient;
    } catch (e: any) {
      console.error('[Supabase Client] Dynamic Init Error:', e);
    }
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
