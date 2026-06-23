import { type ReactNode } from 'react';
import Reveal from '@/components/Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  theme = 'light',
}: SectionHeadingProps) {
  const isDark = theme === 'dark';
  return (
    <Reveal
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'}`}
    >
      {eyebrow && (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${
          isDark ? 'bg-white/10 text-white' : 'bg-primary-50 text-primary'
        }`}>
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] ${
        isDark ? 'text-white' : 'text-ink'
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${
          isDark ? 'text-primary-100/80' : 'text-ink-muted'
        }`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
