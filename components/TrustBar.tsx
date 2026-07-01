'use client';

import { TRUST_STATS } from '@/lib/data/content';
import { useCounter } from '@/hooks/useCounter';
import { useReveal } from '@/hooks/useReveal';
import { Award, Users, ThumbsUp, GraduationCap, BookOpen, type LucideIcon } from 'lucide-react';

const STAT_ICONS: Record<number, LucideIcon> = {
  0: Award,          // 2,005 Since
  1: Users,          // 5,000+ Students Trained
  2: ThumbsUp,        // 95% Satisfaction Rate
  3: GraduationCap,  // 20+ Expert Trainers
  4: BookOpen,       // 2 Learning Modes
};

function StatItem({
  stat,
  index,
  active,
}: {
  stat: (typeof TRUST_STATS)[number];
  index: number;
  active: boolean;
}) {
  const count = useCounter(stat.value, active);
  const Icon = STAT_ICONS[index] ?? Award;

  const formattedValue = stat.isYear ? stat.value.toLocaleString() : count.toLocaleString();
  const displayValue = stat.suffix === '+' ? `${formattedValue} +` : `${formattedValue}${stat.suffix}`;

  return (
    <div className="group/stat flex flex-col items-center px-4 py-3 text-center">
      {/* Icon */}
      <div className="mb-4 text-slate-400 transition-all duration-500 group-hover/stat:-translate-y-1.5 group-hover/stat:text-primary">
        <Icon className="h-9 w-9 stroke-[1.25]" />
      </div>
      
      {/* Value */}
      <span className="font-heading text-3xl font-extrabold text-slate-700 tracking-tight sm:text-4xl transition-colors duration-300 group-hover/stat:text-slate-800">
        {displayValue}
      </span>
      
      {/* Label */}
      <span className="mt-2 text-xs font-semibold text-slate-400 tracking-wide">
        {stat.label}
      </span>
    </div>
  );
}

export default function TrustBar() {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="relative z-20 -mt-6 bg-bg-soft py-8 lg:py-10">
      <div className="container-x">
        <div
          ref={ref}
          className="grid grid-cols-2 gap-x-4 gap-y-8 rounded-4xl border border-slate-100 bg-white px-6 py-10 shadow-soft-lg sm:grid-cols-3 lg:grid-cols-5 lg:px-12"
        >
          {TRUST_STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} active={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
