'use client';

export function useTracking() {
  const getUtmData = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    const stored = sessionStorage.getItem('tesca_utm');
    if (params.has('utm_source') || params.has('utm_campaign')) {
      const utm: Record<string, string> = {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_term: params.get('utm_term') || '',
        utm_content: params.get('utm_content') || '',
      };
      sessionStorage.setItem('tesca_utm', JSON.stringify(utm));
      return utm;
    }
    if (stored) {
      try { return JSON.parse(stored); } catch { }
    }
    return {};
  };

  const getReferrer = (): string => {
    if (typeof document === 'undefined') return '';
    const ref = document.referrer || '';
    if (!ref) return 'direct';
    try {
      const url = new URL(ref);
      if (url.hostname.includes('google')) return 'google/organic';
      if (url.hostname.includes('facebook')) return 'facebook/social';
      if (url.hostname.includes('instagram')) return 'instagram/social';
      if (url.hostname.includes('youtube')) return 'youtube/social';
      if (url.hostname.includes('wa.me') || url.hostname.includes('whatsapp')) return 'whatsapp/social';
      return url.hostname;
    } catch {
      return 'direct';
    }
  };

  const getLeadEnrichment = (): Record<string, string> => {
    return {
      ...getUtmData(),
      referrer: getReferrer(),
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    };
  };

  const trackEvent = (eventName: string, payload?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && typeof (window as any).dataLayer !== 'undefined') {
      (window as any).dataLayer.push({
        event: eventName,
        ...payload,
      });
    }
  };

  return { getUtmData, getReferrer, getLeadEnrichment, trackEvent };
}
