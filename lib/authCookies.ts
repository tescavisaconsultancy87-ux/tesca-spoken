export function getCookieDomain(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname.toLowerCase();
  if (hostname.endsWith('tesca.co')) return '; domain=.tesca.co';
  if (hostname.endsWith('tescavisa.com')) return '; domain=.tescavisa.com';
  return '';
}

export function setSessionActiveCookie(): void {
  if (typeof window === 'undefined') return;
  const domain = getCookieDomain();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `sb-session-active=true; path=/; max-age=86400; SameSite=Lax${domain}${secure}`;
  document.cookie = `sb-session-active=true; path=/; max-age=86400; SameSite=Lax${secure}`;
}

export function clearSessionActiveCookie(): void {
  if (typeof window === 'undefined') return;
  const domain = getCookieDomain();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `sb-session-active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${domain}${secure}`;
  document.cookie = `sb-session-active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
}

export function setMockSessionCookie(): void {
  if (typeof window === 'undefined') return;
  const domain = getCookieDomain();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `sb-mock-session=true; path=/; max-age=86400; SameSite=Lax${domain}${secure}`;
  document.cookie = `sb-mock-session=true; path=/; max-age=86400; SameSite=Lax${secure}`;
}

export function clearMockSessionCookie(): void {
  if (typeof window === 'undefined') return;
  const domain = getCookieDomain();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `sb-mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${domain}${secure}`;
  document.cookie = `sb-mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
}

export const customCookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const localVal = window.localStorage.getItem(key);
      if (localVal) return localVal;
    } catch {}

    const name = encodeURIComponent(key) + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return decodeURIComponent(c.substring(name.length));
      }
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch {}

    const domain = getCookieDomain();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    const cookieVal = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    // Only attempt cookie setting if size fits within browser cookie limits (~3800 bytes)
    if (cookieVal.length < 3800) {
      document.cookie = `${cookieVal}; path=/; max-age=604800; SameSite=Lax${domain}${secure}`;
      document.cookie = `${cookieVal}; path=/; max-age=604800; SameSite=Lax${secure}`;
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {}

    const domain = getCookieDomain();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(key)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${domain}${secure}`;
    document.cookie = `${encodeURIComponent(key)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
  },
};

export function clearAllAuthStorage(): void {
  if (typeof window === 'undefined') return;
  clearSessionActiveCookie();
  clearMockSessionCookie();
  try {
    sessionStorage.removeItem('tesca_dev_session');
    // Clear all sb- items from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('sb-') || k.includes('supabase'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

export function getRoleDashboardUrl(role: 'admin' | 'tutor' | 'student'): string {
  if (typeof window === 'undefined') return `/${role}`;

  const protocol = window.location.protocol;
  const hostName = window.location.hostname.toLowerCase();

  if (hostName.endsWith('tesca.co') || hostName.endsWith('tescavisa.com')) {
    const baseDomain = hostName.endsWith('tescavisa.com') ? 'tescavisa.com' : 'tesca.co';
    return `${protocol}//${role}.${baseDomain}/`;
  }

  if (hostName.includes('localhost') || hostName.includes('127.0.0.1')) {
    const port = window.location.port ? `:${window.location.port}` : '';
    if (hostName.endsWith('localhost')) {
      return `${protocol}//${role}.localhost${port}/`;
    }
    return `/${role}`;
  }

  return `/${role}`;
}

