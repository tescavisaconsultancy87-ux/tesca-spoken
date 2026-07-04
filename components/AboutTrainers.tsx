'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
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
        <div
          key={trainer.id || trainer.name}
          className="group overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="relative h-56 overflow-hidden bg-gray-50">
            <Image
              src={trainer.photo}
              alt={trainer.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 250px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
            {trainer.students && (
              <div className="absolute bottom-3 left-3">
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white">
                  {trainer.students} students
                </span>
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="font-heading text-base font-bold text-ink">{trainer.name}</h3>
            <p className="text-sm text-primary font-medium mt-0.5">{trainer.role}</p>
            <div className="mt-3 space-y-1.5">
              {trainer.certification && (
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{trainer.certification}</span>
                </div>
              )}
              {trainer.experience && (
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{trainer.experience} experience</span>
                </div>
              )}
              {trainer.specialization && (
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{trainer.specialization}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
