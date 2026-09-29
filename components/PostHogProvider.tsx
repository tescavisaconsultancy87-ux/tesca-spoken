'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import {
  initPostHog,
  posthog,
  captureEvent,
  captureScrollDepth,
  captureActivityDuration,
} from '@/lib/posthog';

/**
 * Tracks route changes, scroll depth milestones, active duration on page,
 * and comprehensive button/link click events.
 */
function PostHogTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Route & Duration Tracking Refs (initialized with neutral defaults for React 19 purity)
  const pageStartTimeRef = useRef<number>(0);
  const activeSecondsRef = useRef<number>(0);
  const lastActiveTimestampRef = useRef<number>(0);
  const firstScrollTimeRef = useRef<number | null>(null);
  const scrollCountRef = useRef<number>(0);
  const maxScrollPercentRef = useRef<number>(0);
  const maxScrollPxRef = useRef<number>(0);
  const triggeredMilestonesRef = useRef<Set<number>>(new Set());
  const currentUrlRef = useRef<string>('');

  // 1. Route Change & Pageview Tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = window.location.href;
    currentUrlRef.current = url;

    // Reset page-level metrics on route change
    pageStartTimeRef.current = Date.now();
    activeSecondsRef.current = 0;
    lastActiveTimestampRef.current = Date.now();
    firstScrollTimeRef.current = null;
    scrollCountRef.current = 0;
    maxScrollPercentRef.current = 0;
    maxScrollPxRef.current = 0;
    triggeredMilestonesRef.current = new Set();

    // Trigger Pageview
    captureEvent('$pageview', {
      $current_url: url,
      pathname,
      search: searchParams?.toString() || '',
      title: typeof document !== 'undefined' ? document.title : '',
    });

    // Cleanup / Pageleave tracker for this specific route
    return () => {
      if (pageStartTimeRef.current === 0) return;
      const durationSeconds = Math.max(
        0,
        Math.round((Date.now() - pageStartTimeRef.current) / 1000)
      );

      captureActivityDuration(durationSeconds, {
        active_duration_seconds: Math.round(activeSecondsRef.current),
        total_duration_seconds: durationSeconds,
        max_scroll_percentage: maxScrollPercentRef.current,
        max_scroll_px: maxScrollPxRef.current,
        scroll_events_count: scrollCountRef.current,
        time_to_first_scroll_seconds: firstScrollTimeRef.current
          ? Math.round((firstScrollTimeRef.current - pageStartTimeRef.current) / 1000)
          : null,
        pathname,
        $current_url: url,
      });
    };
  }, [pathname, searchParams]);

  // 2. Active Dwell & Visibility Tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastActiveTimestampRef.current = Date.now();
    let isDocumentVisible = !document.hidden;

    // Record user activity to measure genuine active engagement
    const recordUserActivity = () => {
      lastActiveTimestampRef.current = Date.now();
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) {
        lastActiveTimestampRef.current = Date.now();
      }
    };

    const activityInterval = setInterval(() => {
      const now = Date.now();
      const idleTimeMs = now - lastActiveTimestampRef.current;

      // Only count as active engagement if document is visible and idle time is under 30 seconds
      if (isDocumentVisible && idleTimeMs < 30000) {
        activeSecondsRef.current += 1;
      }
    }, 1000);

    const userActivityEvents: (keyof WindowEventMap)[] = [
      'mousemove',
      'keydown',
      'touchstart',
      'click',
    ];

    userActivityEvents.forEach((event) => {
      window.addEventListener(event, recordUserActivity, { passive: true });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(activityInterval);
      userActivityEvents.forEach((event) => {
        window.removeEventListener(event, recordUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 3. Scroll Depth & Scroll Duration Milestones
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const milestones = [25, 50, 75, 90, 100];
    let scrollThrottleTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      lastActiveTimestampRef.current = Date.now();
      scrollCountRef.current += 1;

      if (!firstScrollTimeRef.current) {
        firstScrollTimeRef.current = Date.now();
      }

      if (scrollThrottleTimeout) return;

      scrollThrottleTimeout = setTimeout(() => {
        scrollThrottleTimeout = null;

        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const viewportHeight = window.innerHeight || 0;
        const documentHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          viewportHeight
        );

        const currentDepthPx = scrollTop + viewportHeight;
        const scrollPercent = Math.min(
          100,
          Math.max(0, Math.round((currentDepthPx / documentHeight) * 100))
        );

        if (scrollPercent > maxScrollPercentRef.current) {
          maxScrollPercentRef.current = scrollPercent;
        }
        if (scrollTop > maxScrollPxRef.current) {
          maxScrollPxRef.current = Math.round(scrollTop);
        }

        // Check each milestone (25%, 50%, 75%, 90%, 100%)
        milestones.forEach((milestone) => {
          if (
            scrollPercent >= milestone &&
            !triggeredMilestonesRef.current.has(milestone)
          ) {
            triggeredMilestonesRef.current.add(milestone);
            const timeSinceLoadSeconds = pageStartTimeRef.current > 0
              ? Math.round((Date.now() - pageStartTimeRef.current) / 1000)
              : 0;

            captureScrollDepth(milestone, {
              milestone_percentage: milestone,
              scroll_depth_px: Math.round(currentDepthPx),
              viewport_height: viewportHeight,
              document_height: documentHeight,
              scroll_duration_seconds: timeSinceLoadSeconds,
              pathname: window.location.pathname,
              $current_url: window.location.href,
            });
          }
        });
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollThrottleTimeout) clearTimeout(scrollThrottleTimeout);
    };
  }, [pathname]);

  // 4. Intelligent Button & Interactive Element Click Tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find the closest interactive target element
      const interactiveEl = target.closest<HTMLElement>(
        'button, a, [role="button"], input[type="submit"], input[type="button"], [data-event], [data-ph-capture]'
      );

      if (!interactiveEl) return;

      // Determine clean label / text
      const rawText =
        interactiveEl.getAttribute('aria-label') ||
        interactiveEl.getAttribute('title') ||
        (interactiveEl as HTMLInputElement).value ||
        (interactiveEl as HTMLInputElement).placeholder ||
        interactiveEl.innerText ||
        interactiveEl.textContent ||
        interactiveEl.getAttribute('data-event') ||
        '';

      const cleanLabel = rawText.trim().replace(/\s+/g, ' ').slice(0, 80);

      // Determine element type
      const tagName = interactiveEl.tagName.toLowerCase();
      let elementType = tagName;
      if (tagName === 'a') elementType = 'link';
      else if (tagName === 'button') elementType = 'button';
      else if (interactiveEl.getAttribute('role') === 'button') elementType = 'role_button';

      // Find nearest semantic context container (section, form, navbar, modal, etc.)
      const container = interactiveEl.closest<HTMLElement>(
        'header, nav, footer, section, form, [role="dialog"], [data-section], aside'
      );
      const sectionName =
        container?.getAttribute('data-section') ||
        container?.getAttribute('id') ||
        container?.getAttribute('aria-label') ||
        container?.tagName.toLowerCase() ||
        'page_body';

      // Extract href if link
      const href =
        interactiveEl.getAttribute('href') ||
        interactiveEl.closest('a')?.getAttribute('href') ||
        undefined;

      captureEvent('button_click', {
        button_label: cleanLabel || 'unlabeled_button',
        element_type: elementType,
        element_tag: tagName,
        element_id: interactiveEl.id || undefined,
        section_name: sectionName,
        target_href: href,
        is_external_link: href ? /^https?:\/\//i.test(href) && !href.includes(window.location.hostname) : false,
        pathname: window.location.pathname,
      });
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  return null;
}

interface PostHogProviderProps {
  children: React.ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
