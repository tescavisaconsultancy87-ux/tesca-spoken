'use client';

import { TRUST_STATS } from '@/lib/data/content';
import { useCounter } from '@/hooks/useCounter';
import { useReveal } from '@/hooks/useReveal';

function StatItem({
  stat,
  active,
}: {
  stat: (typeof TRUST_STATS)[number];
  active: boolean;
}) {
  const count = useCounter(stat.value, active);
  return (
    <div className="flex flex-col items-center px-3 py-4 text-center">
      <span className="font-heading text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
        {stat.isYear ? stat.value.toLocaleString() : count.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="mt-1 text-xs font-medium text-ink-muted sm:text-sm">
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
          className="grid grid-cols-2 gap-y-6 rounded-4xl border border-black/5 bg-white px-4 py-6 shadow-soft-lg sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-black/5 lg:px-8"
        >
          {TRUST_STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
