'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import TrainerCard from '@/components/TrainerCard';
import { TRAINERS } from '@/lib/data/content';
import { db } from '@/lib/db';

export default function Trainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canFadeLeft, setCanFadeLeft] = useState(false);
  const [canFadeRight, setCanFadeRight] = useState(false);

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
        console.error('Failed to fetch trainers, using mock fallback', err);
        setTrainers(TRAINERS.map((t, idx) => ({ ...t, id: `mock-${idx}`, show_on_homepage: true, verified: true })));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Gradient overlays only — doesn't touch activeIndex
  const updateFadeState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanFadeLeft(scrollLeft > 1);
    setCanFadeRight(scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || trainers.length === 0) return;

    const timer = setTimeout(updateFadeState, 50);
    container.addEventListener('scroll', updateFadeState, { passive: true });
    const ro = new ResizeObserver(updateFadeState);
    ro.observe(container);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', updateFadeState);
      ro.disconnect();
    };
  }, [trainers, updateFadeState]);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement | undefined;
    if (!child) return;
    container.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  }, []);

  const goToIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(trainers.length - 1, index));
    setActiveIndex(clamped);
    scrollToIndex(clamped);
  }, [trainers.length, scrollToIndex]);

  const handlePrev = useCallback(() => {
    goToIndex(activeIndex - 1);
  }, [activeIndex, goToIndex]);

  const handleNext = useCallback(() => {
    goToIndex(activeIndex + 1);
  }, [activeIndex, goToIndex]);

  return (
    <section className="bg-bg-soft py-20 lg:py-28 overflow-hidden">
      <div className="container-x">
        <SectionHeading
          eyebrow="Meet Our Trainers"
          title={
            <>
              Learn from the{' '}
              <span className="text-primary">best in the field</span>
            </>
          }
          description="Our trainers hold international certifications, have taught thousands of students, and bring real-world experience into every class."
        />

        <div className="relative mt-12 lg:mt-16 w-full">
          {loading ? (
            <div className="py-12 text-center text-gray-400">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-2 text-xs font-semibold">Loading trainers...</p>
            </div>
          ) : trainers.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm font-semibold">No trainers configured for homepage display.</p>
            </div>
          ) : (
            <>
              <div className="relative -mx-5 sm:-mx-8 lg:mx-0">
                {/* Scrollable list */}
                <div
                  ref={scrollContainerRef}
                  className="flex gap-6 py-4 px-5 sm:px-8 lg:px-0 items-stretch scroll-smooth no-scrollbar overflow-x-auto snap-x snap-mandatory justify-start"
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
                {canFadeLeft && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-bg-soft via-bg-soft/70 to-transparent" />
                )}
                {canFadeRight && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-bg-soft via-bg-soft/70 to-transparent" />
                )}
              </div>

              {/* Controls — always shown once loaded, buttons are disabled at extremes */}
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
                      onClick={() => goToIndex(i)}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
