'use client';

import Image from 'next/image';
import { Briefcase } from 'lucide-react';

interface TrainerCardProps {
  trainer: {
    id?: string;
    name: string;
    role: string; // Used as Expertise
    experience: string;
    photo: string;
  };
}

export default function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <article className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-soft-lg">
      {/* Photo Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-55">
        <Image
          src={trainer.photo || 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'}
          alt={`Photo of ${trainer.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Modern dark gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div className="space-y-1">
          <h3 className="font-heading text-lg font-bold text-ink leading-snug transition-colors duration-300 group-hover:text-primary">
            {trainer.name}
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-primary min-h-[2rem] line-clamp-2">
            {trainer.role}
          </p>
        </div>

        {/* Experience details with standard border separator */}
        <div className="mt-4 pt-4 border-t border-black/5">
          <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
            <Briefcase className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium text-ink-soft">Experience:</span>
            <span className="font-semibold text-ink">{trainer.experience}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
