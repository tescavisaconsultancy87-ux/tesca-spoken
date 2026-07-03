'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Award, BadgeCheck, Users, Briefcase } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { TRAINERS } from '@/lib/data/content';
import { db } from '@/lib/db';

export default function Trainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getTrainers();
        if (data && data.length > 0) {
          // Filter to show only active homepage trainers
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

  return (
    <section className="bg-bg-soft py-20 lg:py-28">
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-gray-400">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-2 text-xs font-semibold">Loading trainers...</p>
            </div>
          ) : trainers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400">
              <p className="text-sm font-semibold">No trainers configured for homepage display.</p>
            </div>
          ) : (
            trainers.map((trainer, i) => (
              <Reveal key={trainer.id || trainer.name} delay={i * 80}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-soft-lg">
                  {/* Photo */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={trainer.photo}
                      alt={`Photo of ${trainer.name}, ${trainer.role}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 250px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Verified badge */}
                    {trainer.verified && (
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-primary shadow-soft backdrop-blur-sm">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}

                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-heading text-base font-bold text-white">
                        {trainer.name}
                      </h3>
                      <p className="text-xs font-medium text-secondary-200">
                        {trainer.role}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 p-4">
                    <div className="flex items-center gap-2 text-xs text-ink-soft">
                      <Briefcase className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">Experience:</span>
                      <span>{trainer.experience}</span>
                    </div>
                    {trainer.certification && (
                      <div className="flex items-center gap-2 text-xs text-ink-soft">
                        <Award className="h-3.5 w-3.5 text-secondary" />
                        <span className="font-medium">Cert:</span>
                        <span>{trainer.certification}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-ink-soft">
                      <Users className="h-3.5 w-3.5 text-accent" />
                      <span className="font-medium">Trained:</span>
                      <span>{trainer.students}</span>
                    </div>
                  </div>

                  {/* Specialization bar */}
                  <div className="border-t border-black/5 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                      Specializes in
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-primary">
                      {trainer.specialization}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
