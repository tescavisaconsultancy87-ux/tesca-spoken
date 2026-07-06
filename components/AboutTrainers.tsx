'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import TrainerCard from '@/components/TrainerCard';
import { TRAINERS } from '@/lib/data/content';
import { db } from '@/lib/db';

export default function AboutTrainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trainersLengthRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getTrainers();
        if (data && data.length > 0) {
          const active = data.filter((t: any) => !!t.show_on_homepage);
          setTrainers(active);
        } else {
          setTrainers(TRAINERS.map((t, idx) => ({ ...t, id: `mock-${idx}`, show_on_homepage: true, verified: true })));
        }
      } catch (err) {
        console.error('Failed to fetch trainers for About page, using mock fallback', err);
        setTrainers(TRAINERS.map((t, idx) => ({ ...t, id: `mock-${idx}`, show_on_homepage: true, verified: true })));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    trainersLengthRef.current = trainers.length;
  }, [trainers]);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const isOverflowing = maxScroll > 1;

    setShowControls(isOverflowing);
    setCanScrollLeft(scrollLeft > 1);
    setCanScrollRight(scrollLeft < maxScroll - 1);

    const len = trainersLengthRef.current;
    if (len === 0) return;

    let closestIndex = 0;
    let minDist = Infinity;
    for (let i = 0; i < len; i++) {
      const child = container.children[i] as HTMLElement | undefined;
      if (!child) continue;
      const dist = Math.abs(child.offsetLeft - scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }
    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || trainers.length === 0) return;

    const timer = setTimeout(updateScrollState, 50);
    container.addEventListener('scroll', updateScrollState, { passive: true });

    const ro = new ResizeObserver(updateScrollState);
    ro.observe(container);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [trainers, updateScrollState]);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;
    container.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex(prev => {
      const next = Math.max(0, prev - 1);
      scrollToIndex(next);
      return next;
    });
  }, [scrollToIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex(prev => {
      const next = Math.min(trainersLengthRef.current - 1, prev + 1);
      scrollToIndex(next);
      return next;
    });
  }, [scrollToIndex]);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-400">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-2 text-xs font-semibold">Loading trainers...</p>
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <p className="text-sm font-semibold">No trainers configured for display.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative -mx-5 sm:-mx-8 lg:mx-0">
        {/* Scrollable list */}
        <div
          ref={scrollContainerRef}
          className={`flex gap-6 py-4 px-5 sm:px-8 lg:px-0 items-stretch scroll-smooth no-scrollbar overflow-x-auto snap-x snap-mandatory ${
            showControls ? 'justify-start' : 'justify-start lg:justify-center'
          }`}
        >
          {trainers.map((trainer, i) => (
            <Reveal
              key={trainer.id || trainer.name}
              delay={i * 80}
              className="flex flex-col items-stretch shrink-0 snap-start w-[calc(100vw-2.5rem)] sm:w-[270px] h-full"
            >
              <TrainerCard trainer={trainer} />
            </Reveal>
          ))}
        </div>

        {/* Gradient Overlays */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-bg-soft via-bg-soft/70 to-transparent" />
        )}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-bg-soft via-bg-soft/70 to-transparent" />
        )}
      </div>

      {/* Controls — always shown once loaded */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink-soft shadow-soft transition-all duration-300 ${
            activeIndex === 0
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:border-primary hover:bg-primary hover:text-white cursor-pointer active:scale-95'
          }`}
          aria-label="Previous trainer"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {trainers.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-primary-200 hover:bg-primary-300'
              }`}
              aria-label={`Go to trainer ${i + 1}`}
              aria-current={i === activeIndex}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={activeIndex === trainers.length - 1}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink-soft shadow-soft transition-all duration-300 ${
            activeIndex === trainers.length - 1
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:border-primary hover:bg-primary hover:text-white cursor-pointer active:scale-95'
          }`}
          aria-label="Next trainer"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
