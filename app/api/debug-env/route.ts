import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthAndRole } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: auth.error || 'Access denied.' },
        { status: auth.status || 401 }
      );
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Get dynamic runtime keys if available
    const runtimeUrl = typeof process !== 'undefined' && process.env ? process.env['NEXT_PUBLIC_SUPABASE_URL'] || '' : '';
    const runtimeAnonKey = typeof process !== 'undefined' && process.env ? process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '' : '';

    // Gather environment keys safely
    let envKeys: string[] = [];
    try {
      if (typeof process !== 'undefined' && process.env) {
        envKeys = Object.keys(process.env);
      }
    } catch (e: any) {
      envKeys = ['Error reading keys: ' + (e.message || String(e))];
    }

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
      publicEnvKeysList: envKeys.filter(k => k.startsWith('NEXT_PUBLIC_') || k.startsWith('APP_') || k.includes('Error')),
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message || String(err),
      stack: err.stack,
    }, { status: 200 });
  }
}
