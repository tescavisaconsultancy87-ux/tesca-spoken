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
  document.cookie = `sb-session-active=true; path=/${domain}; max-age=86400; SameSite=Lax${secure}`;
}

export function clearSessionActiveCookie(): void {
  if (typeof window === 'undefined') return;
  const domain = getCookieDomain();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `sb-session-active=; path=/${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
  document.cookie = `sb-session-active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
}

export function setMockSessionCookie(): void {
  if (typeof window === 'undefined') return;
  const domain = getCookieDomain();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `sb-mock-session=true; path=/${domain}; max-age=86400; SameSite=Lax${secure}`;
}

export function clearMockSessionCookie(): void {
  if (typeof window === 'undefined') return;
  const domain = getCookieDomain();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `sb-mock-session=; path=/${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
  document.cookie = `sb-mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
}

export const customCookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    const name = encodeURIComponent(key) + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return decodeURIComponent(c.substring(name.length));
      }
    }
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    const domain = getCookieDomain();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/${domain}; max-age=604800; SameSite=Lax${secure}`;
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    const domain = getCookieDomain();
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(key)}=; path=/${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
    document.cookie = `${encodeURIComponent(key)}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secure}`;
    try {
      window.localStorage.removeItem(key);
    } catch {}
  },
};

export function getRoleDashboardUrl(role: 'admin' | 'tutor' | 'student'): string {
  if (typeof window === 'undefined') return `/${role}`;

  const protocol = window.location.protocol;
  const hostName = window.location.hostname.toLowerCase();

  let currentSubdomain = '';
  if (hostName.endsWith('tesca.co') || hostName.endsWith('tescavisa.com')) {
    const parts = hostName.split('.');
    if (parts.length > 2) {
      currentSubdomain = parts[0];
    }
  } else if (hostName.endsWith('localhost')) {
    const parts = hostName.split('.');
    if (parts.length > 1) {
      currentSubdomain = parts[0];
    }
  }

  if (hostName.endsWith('tesca.co') || hostName.endsWith('tescavisa.com')) {
    const baseDomain = hostName.endsWith('tescavisa.com') ? 'tescavisa.com' : 'tesca.co';
    if (currentSubdomain === role) {
      return '/';
    }
    return `${protocol}//${role}.${baseDomain}/`;
  }

  if (hostName.includes('localhost') || hostName.includes('127.0.0.1')) {
    const port = window.location.port ? `:${window.location.port}` : '';
    if (currentSubdomain === role) {
      return '/';
    }
    if (hostName.endsWith('localhost')) {
      return `${protocol}//${role}.localhost${port}/`;
    }
    return `/${role}`;
  }

  if (currentSubdomain === role) {
    return '/';
  }
  return `/${role}`;
}
