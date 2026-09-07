'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // When pathname or searchParams change, route transition is complete
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setLoading(false);
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(hideTimer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find the closest anchor element
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore modified clicks (cmd, ctrl, shift, alt)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // Ignore new tab / target="_blank"
      if (anchor.target && anchor.target !== '_self') return;

      // Ignore downloads
      if (anchor.hasAttribute('download')) return;

      // Ignore hash-only links or javascript: links
      if (href.startsWith('#') || href.startsWith('javascript:')) return;

      // Ignore external links
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return;

        // Ignore if clicking on the exact same page & hash
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search &&
          url.hash !== ''
        ) {
          return;
        }

        // If navigating to the exact same URL without hash, let browser handle
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return;
        }

        // Start loading progress immediately!
        startLoading();
      } catch {
        // invalid URL, ignore
      }
    };

    const startLoading = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

      setVisible(true);
      setLoading(true);
      setProgress(25);

      // Smooth progress increments
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 65) return prev + Math.random() * 15;
          if (prev < 85) return prev + Math.random() * 6;
          if (prev < 95) return prev + 0.5;
          return prev;
        });
      }, 150);

      // Safety timeout: reset if taking longer than 8 seconds
      safetyTimeoutRef.current = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          setVisible(false);
          setProgress(0);
        }, 200);
      }, 8000);
    };

    // Custom event listener so any button or code can trigger the bar manually
    const handleManualStart = () => startLoading();
    const handleManualStop = () => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setVisible(false);
        setProgress(0);
      }, 200);
    };

    window.addEventListener('tesca:nav-start', handleManualStart);
    window.addEventListener('tesca:nav-stop', handleManualStop);
    document.addEventListener('click', handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      window.removeEventListener('tesca:nav-start', handleManualStart);
      window.removeEventListener('tesca:nav-stop', handleManualStop);
      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Top glowing progress bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[999999] pointer-events-none transition-all duration-200 ease-out overflow-hidden"
        style={{
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-[#067779] via-[#0d9488] to-[#2dd4bf] shadow-[0_0_12px_#0d9488,0_0_5px_#067779] transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Floating subtle corner badge for unequivocal user confirmation */}
      <div className="fixed top-4 right-4 z-[999999] pointer-events-none transition-opacity duration-200">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-primary/20 flex items-center gap-2 text-xs font-bold text-primary animate-pulse">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          <span>Loading...</span>
        </div>
      </div>
    </>
  );
}
