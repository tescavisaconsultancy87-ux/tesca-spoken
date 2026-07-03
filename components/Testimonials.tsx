'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { TESTIMONIALS } from '@/lib/data/content';

const AUTO_INTERVAL = 6000;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const max = TESTIMONIALS.length - 1;
  const next = useCallback(() => setIndex((i) => (i >= max ? 0 : i + 1)), [max]);
  const prev = useCallback(() => setIndex((i) => (i <= 0 ? max : i - 1)), [max]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              Loved by students{' '}
              <span className="text-secondary">across the globe</span>
            </>
          }
          description="From first-time English speakers to IELTS top-scorers — hear directly from those who walked the journey."
        />

        {/* Carousel */}
        <div
          className="relative mx-auto mt-12 max-w-4xl lg:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Quote background */}
          <Quote className="absolute -top-6 left-6 h-24 w-24 text-primary-100 lg:-left-8 lg:-top-8 lg:h-32 lg:w-32" />

          {/* Slide track */}
          <div className="absolute inset-0 -z-10">
            <div className="h-full rounded-4xl bg-white shadow-soft-xl" />
          </div>

          <div className="overflow-hidden rounded-4xl border border-black/5 bg-white shadow-soft-lg">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="min-w-full p-8 lg:p-12">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-secondary text-secondary"
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <blockquote className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg lg:text-xl lg:leading-relaxed">
                    &ldquo;{t.review}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <figcaption className="mt-6 flex items-center gap-4 border-t border-black/5 pt-6">
                    <Image
                      src={t.photo}
                      alt={`Photo of ${t.name}`}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-primary-100"
                    />
                    <div>
                      <p className="font-heading text-sm font-bold text-ink">
                        {t.name}
                      </p>
                      <p className="text-xs font-medium text-primary">
                        {t.course}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                        <MapPin className="h-3 w-3" />
                        {t.location}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink-soft shadow-soft transition-all hover:border-primary hover:bg-primary hover:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-primary-200 hover:bg-primary-300'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === index}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink-soft shadow-soft transition-all hover:border-primary hover:bg-primary hover:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
