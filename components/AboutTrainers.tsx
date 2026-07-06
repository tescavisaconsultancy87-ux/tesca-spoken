'use client';

import { useState, useEffect } from 'react';
import TrainerCard from '@/components/TrainerCard';
import { TRAINERS } from '@/lib/data/content';
import { db } from '@/lib/db';

export default function AboutTrainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="col-span-full py-12 text-center text-gray-400">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-2 text-xs font-semibold">Loading trainers...</p>
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-gray-400">
        <p className="text-sm font-semibold">No trainers configured for display.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {trainers.map((trainer) => (
        <TrainerCard key={trainer.id || trainer.name} trainer={trainer} />
      ))}
    </div>
  );
}
