import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Predefined role overrides based on email
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();

  // Check from environment variable list
  const envAdminEmails = process.env.ADMIN_EMAILS || '';
  if (envAdminEmails) {
    const adminList = envAdminEmails.split(',').map(e => e.trim().toLowerCase());
    if (adminList.includes(cleanEmail)) return true;
  }

  return cleanEmail === 'tescavisaconsultancy87@gmail.com' || cleanEmail === 'admin@tesca.com';
}

export function isTutorEmail(email: string | undefined): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  return cleanEmail === 'tutor@gmail.com' || cleanEmail === 'tutor@tesca.com';
}

// Format raw error objects into user-friendly strings without leaking details
export function formatFriendlyError(err: any): string {
  console.error('[Security] Raw error encountered:', err);
  if (!err) return 'An unexpected error occurred. Please try again.';
  if (typeof err === 'string') return err;

  // Intercept network/connectivity errors
  if (
    err.name === 'AuthRetryableFetchError' ||
    err.message?.includes('fetch') ||
    err.message?.includes('NetworkError') ||
    err.status === 0
  ) {
    return 'Connection to the authentication server failed. Please check your internet connection or try again later.';
  }

  let msg = '';
  if (err.message) {
    msg = err.message;
  } else if (err.error_description) {
    msg = err.error_description;
  } else if (err.error && typeof err.error === 'string') {
    msg = err.error;
  } else {
    try {
      msg = JSON.stringify(err);
    } catch (_) {
      msg = String(err);
    }
  }

  if (!msg || msg === '{}') {
    msg = 'An unexpected error occurred.';
  }

  // Security filters: hide internal postgres / supabase / schema structures
  const lower = msg.toLowerCase();
  if (
    lower.includes('relation') ||
    lower.includes('table') ||
    lower.includes('column') ||
    lower.includes('postgres') ||
    lower.includes('database') ||
    lower.includes('uuid') ||
    lower.includes('violates') ||
    lower.includes('foreign key') ||
    lower.includes('42p01')
  ) {
    return 'A database connection or query error occurred. Please contact the administrator.';
  }

  // Handle specific Supabase Auth errors gracefully
  if (lower.includes('invalid login credentials')) {
    return 'Invalid username or password. Please check your credentials.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please verify your email.';
  }
  if (lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  if (lower.includes('token expired') || lower.includes('recovery token is invalid')) {
    return 'The password reset link has expired or is invalid. Please request a new one.';
  }

  return msg;
}

// In-memory rate limiting map
const ipCache = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, limit = 10, windowMs = 60000): { success: boolean; resetTime: number } {
  const now = Date.now();
  const data = ipCache.get(ip);

  if (!data || now > data.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, resetTime: now + windowMs };
  }

  if (data.count >= limit) {
    return { success: false, resetTime: data.resetTime };
  }

  data.count += 1;
  return { success: true, resetTime: data.resetTime };
}

// Verify Authorization and Role (Authentication and Authorization for APIs)
export async function verifyAuthAndRole(
  request: NextRequest,
  allowedRoles: ('student' | 'admin' | 'tutor')[]
): Promise<{ 
  authorized: boolean; 
  user?: { id: string; email: string; role: 'student' | 'admin' | 'tutor' }; 
  error?: string; 
  status?: number 
}> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authorized: false, error: 'Authentication required. Missing Bearer token.', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      // In dev mode without supabase url, bypass security to allow testing
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Security] Supabase config missing. Dev Sandbox authentication bypass.');
        return { authorized: true, user: { id: 'dev-admin-id', email: 'admin@tesca.com', role: 'admin' } };
      }
      return { authorized: false, error: 'Database configuration missing.', status: 500 };
    }

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    const { data: { user }, error } = await client.auth.getUser(token);
    if (error || !user) {
      return { authorized: false, error: 'Invalid or expired session. Please log in again.', status: 401 };
    }

    const email = user.email || '';
    
    // Resolve user role
    let role: 'student' | 'admin' | 'tutor' = 'student';
    if (isAdminEmail(email)) {
      role = 'admin';
    } else if (isTutorEmail(email)) {
      role = 'tutor';
    } else {
      // Query database for role
      const { data: profile } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role) {
        role = profile.role as 'student' | 'admin' | 'tutor';
      }
    }

    if (!allowedRoles.includes(role)) {
      return { authorized: false, error: `Access denied. Forbidden.`, status: 403 };
    }

    return { authorized: true, user: { id: user.id, email, role } };
  } catch (err: any) {
    return { authorized: false, error: err.message || 'Authentication error', status: 500 };
  }
}
