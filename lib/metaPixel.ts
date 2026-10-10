// Meta Pixel / Facebook Conversions Tracking Helper
// Gracefully tracks standard and custom events for Meta Ads conversion optimization

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'CompleteRegistration'
  | 'Contact';

export type MetaCustomEvent =
  | 'CTA_Click'
  | 'Demo_Lesson_Play'
  | 'Curriculum_Module_Expand'
  | 'Pricing_Viewed'
  | 'App_Download_Click'
  | 'FAQ_Expand'
  | 'ScrollDepth_50'
  | 'ScrollDepth_90';

export function trackMetaEvent(
  event: MetaStandardEvent | MetaCustomEvent,
  params?: Record<string, string | number | boolean | undefined>,
  isCustom = false
) {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.fbq === 'function') {
      if (isCustom) {
        window.fbq('trackCustom', event, params);
      } else {
        window.fbq('track', event, params);
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`[MetaPixel Simulated] ${isCustom ? 'Custom:' : ''} ${event}`, params);
    }
  } catch (err) {
    console.warn('[MetaPixel Error]', err);
  }
}

// Convenient pre-typed triggers
export const metaTracking = {
  pageView: () => trackMetaEvent('PageView'),
  viewContent: (courseName = 'Online Spoken English Course', price?: string) =>
    trackMetaEvent('ViewContent', { content_name: courseName, content_category: 'Course', value: price }),
  ctaClick: (location: string, label: string) =>
    trackMetaEvent('CTA_Click', { cta_location: location, cta_label: label }, true),
  initiateCheckout: (courseName = 'Online Spoken English Course', value?: string) =>
    trackMetaEvent('InitiateCheckout', { content_name: courseName, value: value || '₹2,999' }),
  appDownloadClick: (platform: 'playstore' | 'appstore' | 'classplus_web') =>
    trackMetaEvent('App_Download_Click', { platform }, true),
  demoPlay: (lessonTitle: string) =>
    trackMetaEvent('Demo_Lesson_Play', { lesson: lessonTitle }, true),
  curriculumExpand: (moduleNumber: string) =>
    trackMetaEvent('Curriculum_Module_Expand', { module: moduleNumber }, true),
  faqExpand: (question: string) =>
    trackMetaEvent('FAQ_Expand', { question }, true),
};
