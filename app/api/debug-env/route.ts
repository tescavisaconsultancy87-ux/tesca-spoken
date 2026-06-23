import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Get dynamic runtime keys if available
  const runtimeUrl = typeof process !== 'undefined' && process.env ? process.env['NEXT_PUBLIC_SUPABASE_URL'] || '' : '';
  const runtimeAnonKey = typeof process !== 'undefined' && process.env ? process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '' : '';

  // Gather environment keys (excluding sensitive details for security)
  const envKeys = typeof process !== 'undefined' && process.env ? Object.keys(process.env) : [];

  return NextResponse.json({
    message: "Secure Environment Diagnostics (Values are hidden for safety)",
    supabaseUrlStatic: {
      exists: !!supabaseUrl,
      length: supabaseUrl.length,
      prefix: supabaseUrl ? supabaseUrl.substring(0, 15) : '',
    },
    supabaseAnonKeyStatic: {
      exists: !!supabaseAnonKey,
      length: supabaseAnonKey.length,
      prefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 45) + '...' : '',
    },
    supabaseUrlRuntime: {
      exists: !!runtimeUrl,
      length: runtimeUrl.length,
      prefix: runtimeUrl ? runtimeUrl.substring(0, 15) : '',
    },
    supabaseAnonKeyRuntime: {
      exists: !!runtimeAnonKey,
      length: runtimeAnonKey.length,
      prefix: runtimeAnonKey ? runtimeAnonKey.substring(0, 45) + '...' : '',
    },
    envKeysPresentCount: envKeys.length,
    publicEnvKeysList: envKeys.filter(k => k.startsWith('NEXT_PUBLIC_') || k.startsWith('APP_')),
  });
}
