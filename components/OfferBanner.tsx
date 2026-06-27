'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Zap } from 'lucide-react';

function useCountdown() {
  const getTimeLeft = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = Math.max(0, end.getTime() - now.getTime());
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function OfferBanner() {
  const pathname = usePathname();
  const isExcludedPage =
    pathname === '/login' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/student') ||
    pathname.startsWith('/tutor');
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { hours, minutes, seconds } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, '0');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const isVisible = !scrolled && !isExcludedPage;
    document.documentElement.style.setProperty('--banner-height', isVisible ? '36px' : '0px');
  }, [scrolled, hasMounted, isExcludedPage]);

  if (!hasMounted || isExcludedPage) return null;

  return (
    <div
      id="offer-banner"
      className={`fixed top-0 inset-x-0 z-[60] flex h-9 items-center justify-center gap-3 bg-accent px-4 text-white sm:gap-5 transition-all duration-500 ${
        scrolled
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Icon */}
      <Zap className="h-4 w-4 shrink-0 animate-pulse" aria-hidden="true" />

      {/* Text */}
      <span className="text-xs font-semibold sm:text-sm">
        🎉 Limited Time Offer — Up to{' '}
        <strong className="underline underline-offset-2">50% OFF</strong> on all courses!
      </span>

      {/* Countdown */}
      <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tabular-nums">
        <span>{pad(hours)}</span>
        <span className="opacity-70 animate-pulse">:</span>
        <span>{pad(minutes)}</span>
        <span className="opacity-70 animate-pulse">:</span>
        <span>{pad(seconds)}</span>
      </div>

      {/* CTA */}
      <a
        href="/pricing"
        className="hidden rounded-full bg-white px-3 py-1 text-xs font-bold text-accent transition-transform hover:scale-105 sm:block"
      >
        Grab Now →
      </a>


    </div>
  );
}

