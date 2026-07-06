'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import TrainerCard from '@/components/TrainerCard';
import { TRAINERS } from '@/lib/data/content';
import { db } from '@/lib/db';

export default function AboutTrainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getTrainers();
        if (data && data.length > 0) {
          // Filter to show only active trainers configured for homepage/courses display
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

  const checkOverflow = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setShowControls(container.scrollWidth > container.clientWidth);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < maxScroll - 5);

    // Calculate active dot based on scroll position
    const children = container.children;
    if (children.length > 0) {
      let closestIndex = 0;
      let minDiff = Infinity;
      const containerLeft = container.getBoundingClientRect().left;

      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const childLeft = child.getBoundingClientRect().left;
        const diff = Math.abs(childLeft - containerLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }
      setActiveIndex(closestIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const children = container.children;
    if (children[index]) {
      const child = children[index] as HTMLElement;
      const paddingLeft = parseFloat(window.getComputedStyle(container).paddingLeft || '0');
      container.scrollTo({
        left: child.offsetLeft - paddingLeft,
        behavior: 'smooth',
      });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < trainers.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && trainers.length > 0) {
      container.addEventListener('scroll', handleScroll);
      // Run once to initialize button states & overflow
      handleScroll();
      checkOverflow();

      const resizeObserver = new ResizeObserver(() => {
        handleScroll();
        checkOverflow();
      });
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [trainers]);

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
      {/* Scrollable list */}
      <div
        ref={scrollContainerRef}
        className={`flex gap-6 py-4 px-4 items-stretch scroll-smooth no-scrollbar ${
          showControls
            ? 'overflow-x-auto snap-x snap-mandatory justify-start'
            : 'overflow-x-visible justify-center'
        }`}
      >
        {trainers.map((trainer, i) => (
          <Reveal
            key={trainer.id || trainer.name}
            delay={i * 80}
            className="flex flex-col items-stretch shrink-0 snap-start w-[245px] sm:w-[270px] h-full"
          >
            <TrainerCard trainer={trainer} />
          </Reveal>
        ))}
        {showControls && <div className="shrink-0 w-4" />}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!canScrollLeft}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink-soft shadow-soft transition-all duration-300 ${
              !canScrollLeft
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:border-primary hover:bg-primary hover:text-white cursor-pointer active:scale-95'
            }`}
            aria-label="Previous trainers"
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
            disabled={!canScrollRight}
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink-soft shadow-soft transition-all duration-300 ${
              !canScrollRight
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:border-primary hover:bg-primary hover:text-white cursor-pointer active:scale-95'
            }`}
            aria-label="Next trainers"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
