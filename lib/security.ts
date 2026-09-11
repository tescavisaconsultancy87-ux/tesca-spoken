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
  if (!err) return 'An unexpected error occurred. Please try again.';

  const lowerMsg = (err.message || '').toLowerCase();
  if (!lowerMsg.includes('invalid login credentials')) {
    console.error('[Security] Raw error encountered:', err);
  } else {
    console.warn('[Security] Authentication attempt failed:', err.message || err);
  }
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
    return 'Invalid Email or password. Please check your credentials.';
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

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

// In-memory rate limiting map
const ipCache = new Map<string, { count: number; resetTime: number }>();

export function getClientIp(request: NextRequest): string {
  // x-real-ip is set by Cloudflare and is the most reliable
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  // cf-connecting-ip is set by Cloudflare at the edge
  const cloudflareIp = request.headers.get('cf-connecting-ip');
  if (cloudflareIp) return cloudflareIp;

  // x-forwarded-for may contain spoofed values — take the last IP (set by trusted proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim()).filter(Boolean);
    const lastIp = ips[ips.length - 1];
    if (lastIp) return lastIp;
  }

  return request.headers.get('x-real-ip') || '127.0.0.1';
}

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

export function secureRandomInt(min: number, maxExclusive: number): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(maxExclusive) || maxExclusive <= min) {
    throw new Error('Invalid secure random integer bounds.');
  }

  const range = maxExclusive - min;
  const max = 0xffffffff;
  const limit = max - (max % range);
  const values = new Uint32Array(1);

  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);

  return min + (values[0] % range);
}

export function generateSecurePassword(length = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(secureRandomInt(0, chars.length));
  }
  return password;
}

// Verify Authorization and Role (Authentication and Authorization for APIs)
export async function verifyAuthAndRole(
  request: NextRequest,
  allowedRoles: ('student' | 'admin' | 'tutor')[]
): Promise<{ 
  authorized: boolean; 
  user?: { id: string; email: string; role: 'student' | 'admin' | 'tutor'; name?: string }; 
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
      if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV === 'development') {
        console.warn('[Security] Supabase config missing. Dev Sandbox authentication bypass (ALLOW_DEV_AUTH_BYPASS enabled).');
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

    // Check if token has been blacklisted (logged out)
    try {
      const tokenHash = await sha256Hex(token);
      const { data: blacklisted } = await client
        .from('token_blacklist')
        .select('id')
        .eq('token_hash', tokenHash)
        .maybeSingle();
      if (blacklisted) {
        return { authorized: false, error: 'Session has been revoked. Please log in again.', status: 401 };
      }
    } catch (_) {
      // Blacklist check failure is non-fatal — token still validated by Supabase Auth
    }

    const email = user.email || '';
    
    // Resolve user role and name
    let role: 'student' | 'admin' | 'tutor' = 'student';
    let profileName = '';

    const dbClient = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
      : client;

    const { data: profile } = await dbClient
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.name) {
      profileName = profile.name;
    }

    if (isAdminEmail(email)) {
      role = 'admin';
    } else if (isTutorEmail(email)) {
      role = 'tutor';
    } else if (profile?.role) {
      role = profile.role as 'student' | 'admin' | 'tutor';
    } else if (user.user_metadata?.role) {
      role = user.user_metadata.role as 'student' | 'admin' | 'tutor';
    }

    if (!allowedRoles.includes(role)) {
      return { authorized: false, error: `Access denied. Forbidden.`, status: 403 };
    }

    const userName = profileName || (user.user_metadata?.name as string) || email.split('@')[0] || 'User';
    return { authorized: true, user: { id: user.id, email, role, name: userName } };
  } catch (err: any) {
    return { authorized: false, error: err.message || 'Authentication error', status: 500 };
  }
}

/**
 * Normalizes and validates phone numbers for both Indian and International formats.
 * - Handles +91 or 91 prefix (strips to 10-digit Indian standard)
 * - Handles 0 prefix (strips to 10-digit Indian standard)
 * - Accepts 10-digit Indian numbers starting with 6-9
 * - Accepts international numbers (7 to 15 digits)
 */
export function normalizePhoneNumber(rawPhone: string | undefined | null): {
  valid: boolean;
  phone: string;
  isIndian: boolean;
  error?: string;
} {
  if (!rawPhone || !rawPhone.trim()) {
    return { valid: false, phone: '', isIndian: false, error: 'Phone number is required.' };
  }

  const digits = rawPhone.replace(/\D/g, '');

  if (digits.length < 7 || digits.length > 15) {
    return {
      valid: false,
      phone: digits,
      isIndian: false,
      error: 'Please enter a valid phone number (7 to 15 digits).',
    };
  }

  // Check 12-digit Indian number with 91 country code
  if (digits.length === 12 && digits.startsWith('91')) {
    const indian10 = digits.slice(2);
    if (/^[6-9]\d{9}$/.test(indian10)) {
      return { valid: true, phone: indian10, isIndian: true };
    }
  }

  // Check 11-digit Indian number with leading 0
  if (digits.length === 11 && digits.startsWith('0')) {
    const indian10 = digits.slice(1);
    if (/^[6-9]\d{9}$/.test(indian10)) {
      return { valid: true, phone: indian10, isIndian: true };
    }
  }

  // 10-digit standard
  if (digits.length === 10) {
    return { valid: true, phone: digits, isIndian: /^[6-9]\d{9}$/.test(digits) };
  }

  // International standard (7 to 15 digits)
  return { valid: true, phone: digits, isIndian: false };
}

