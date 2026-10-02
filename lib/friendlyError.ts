/**
 * Centralized User-Friendly Error Sanitizer & Safe API Fetch Utility
 *
 * Ensures all error messages displayed to end-users across modals, banners,
 * and toasts are clean, actionable, and empathetic.
 *
 * Guaranteed to NEVER leak:
 * - Raw database/Postgres errors (tables, columns, relations, foreign keys, UUIDs, constraints, 42P01, etc.)
 * - Backend stack traces or internal server details
 * - JSON parse errors ("Unexpected token '<'", "<!DOCTYPE ", etc.)
 */

export function formatUserError(err: any, fallback = 'Unable to complete this action. Please try again.'): string {
  if (!err) return fallback;

  let msg = '';
  if (typeof err === 'string') {
    msg = err;
  } else if (err.message && typeof err.message === 'string') {
    msg = err.message;
  } else if (err.error && typeof err.error === 'string') {
    msg = err.error;
  } else if (err.error_description && typeof err.error_description === 'string') {
    msg = err.error_description;
  } else {
    try {
      msg = JSON.stringify(err);
    } catch {
      msg = String(err);
    }
  }

  if (!msg || msg === '{}' || msg === '[object Object]') {
    return fallback;
  }

  const lower = msg.toLowerCase();

  // 1. JSON parsing & HTML DOCTYPE errors (e.g. Unexpected token '<', "<!DOCTYPE "...)
  if (
    lower.includes('unexpected token') ||
    lower.includes('<!doctype') ||
    lower.includes('is not valid json') ||
    lower.includes('json.parse') ||
    lower.includes('syntaxerror') ||
    lower.includes('<html') ||
    lower.includes('token <')
  ) {
    return 'Unable to process server response. Please refresh the page and try again.';
  }

  // 2. Network & connectivity errors
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('network error') ||
    lower.includes('connection refused') ||
    lower.includes('econnrefused') ||
    lower.includes('timeout') ||
    lower.includes('load failed') ||
    lower.includes('abort')
  ) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }

  // 3. Database, Postgres, and SQL schema leaks
  if (
    lower.includes('relation') ||
    lower.includes('table') ||
    lower.includes('column') ||
    lower.includes('postgres') ||
    lower.includes('database') ||
    lower.includes('uuid') ||
    lower.includes('violates') ||
    lower.includes('foreign key') ||
    lower.includes('42p01') ||
    lower.includes('42703') ||
    lower.includes('23505') ||
    lower.includes('pgrst') ||
    lower.includes('sql') ||
    lower.includes('schema') ||
    lower.includes('constraint') ||
    lower.includes('trigger') ||
    lower.includes('row level security') ||
    lower.includes('rls')
  ) {
    return 'Unable to save changes right now. Please try again in a few moments.';
  }

  // 4. Server internal errors & Cloudflare 5xx
  if (
    lower.includes('internal server error') ||
    lower.includes('server configuration') ||
    lower.includes('bad gateway') ||
    lower.includes('gateway timeout') ||
    lower.includes('500') ||
    lower.includes('502') ||
    lower.includes('503') ||
    lower.includes('504')
  ) {
    return 'Service is temporarily busy. Please try again in a moment.';
  }

  // 5. Auth / Session token expiration
  if (
    lower.includes('jwt') ||
    lower.includes('token expired') ||
    lower.includes('session has been revoked') ||
    lower.includes('unauthorized') ||
    lower.includes('bearer') ||
    lower.includes('invalid or expired session')
  ) {
    return 'Your session has expired. Please refresh the page or log in again.';
  }

  // 6. Common clean user messages
  if (lower.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials.';
  }
  if (lower.includes('too many requests') || lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a minute before trying again.';
  }

  return msg;
}

/**
 * Safely executes a fetch request and parses JSON without throwing SyntaxError on HTML responses.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    let data: any = null;
    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          status: res.status,
          error: data?.error ? formatUserError(data.error) : 'Your session has expired. Please refresh or log in again.',
        };
      }
      if (res.status === 404) {
        return {
          ok: false,
          status: res.status,
          error: 'The requested service endpoint was not found.',
        };
      }
      if (res.status >= 500) {
        return {
          ok: false,
          status: res.status,
          error: data?.error ? formatUserError(data.error) : 'Service is temporarily unavailable. Please try again.',
        };
      }
      return {
        ok: false,
        status: res.status,
        error: formatUserError(data?.error || data?.message || `Request failed with status ${res.status}`),
      };
    }

    return { ok: true, status: res.status, data };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: formatUserError(err),
    };
  }
}
