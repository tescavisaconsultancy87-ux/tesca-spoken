import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_muUxazaYGqFYmVaDNvFQs2op3is6tKdobhs2jZRbYH3q';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

let isInitialized = false;

interface PostHogInternal {
  __loaded?: boolean;
}

/**
 * Initializes PostHog analytics on the client side with all capture flags enabled.
 */
export function initPostHog() {
  if (typeof window === 'undefined') return;

  if (typeof window !== 'undefined') {
    const isDevHost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local');
    if (isDevHost) {
      return;
    }
  }

  const phInternal = posthog as unknown as PostHogInternal;
  if (isInitialized || phInternal.__loaded) {
    return;
  }

  if (!POSTHOG_KEY) {
    console.warn('[PostHog] Project API key is missing.');
    return;
  }

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
      capture_pageview: false, // Handled manually for Next.js App Router SPA navigation
      capture_pageleave: true,
      capture_heatmaps: true,
      capture_performance: true,
      person_profiles: 'always',
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
        },
      },
      persistence: 'localStorage+cookie',
      bootstrap: {},
    });

    isInitialized = true;
  } catch (error) {
    console.error('[PostHog] Initialization error:', error);
  }
}

// Automatically initialize on the client immediately upon module load
if (typeof window !== 'undefined') {
  initPostHog();
}

/**
 * Capture a custom PostHog event with arbitrary properties.
 */
export function captureEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    const phInternal = posthog as unknown as PostHogInternal;
    if (!isInitialized && !phInternal.__loaded) {
      initPostHog();
    }
    posthog.capture(eventName, {
      ...properties,
      $current_url: window.location.href,
      pathname: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[PostHog] Failed to capture event:', eventName, err);
  }
}

/**
 * Specifically tracks button and interactive element clicks with rich metadata.
 */
export function captureButtonClick(
  buttonLabel: string,
  properties?: Record<string, unknown>
) {
  captureEvent('button_click', {
    button_label: buttonLabel,
    ...properties,
  });
}

/**
 * Specifically tracks scroll milestones (e.g. 25%, 50%, 75%, 90%, 100%).
 */
export function captureScrollDepth(
  depthPercentage: number,
  properties?: Record<string, unknown>
) {
  captureEvent('scroll_depth_milestone', {
    depth_percentage: depthPercentage,
    ...properties,
  });
}

/**
 * Specifically tracks page engagement and active duration when leaving or switching routes.
 */
export function captureActivityDuration(
  durationSeconds: number,
  properties?: Record<string, unknown>
) {
  captureEvent('activity_scroll_duration', {
    duration_seconds: durationSeconds,
    ...properties,
  });
}

/**
 * Identifies a user in PostHog (e.g., after login, demo request, or form submission).
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    posthog.identify(userId, traits);
  } catch (err) {
    console.warn('[PostHog] Failed to identify user:', err);
  }
}

/**
 * Resets user session state (e.g. upon logout).
 */
export function resetUser() {
  if (typeof window === 'undefined') return;
  try {
    posthog.reset();
  } catch (err) {
    console.warn('[PostHog] Failed to reset user:', err);
  }
}

export { posthog };
