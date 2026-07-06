'use client';

import { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import TrainerCard from '@/components/TrainerCard';
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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 max-w-6xl mx-auto">
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
                <TrainerCard trainer={trainer} />
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
