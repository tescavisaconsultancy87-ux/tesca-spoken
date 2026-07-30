import React from 'react';

interface WaveDividerProps {
  /** 'top' places the wave at the top of section, 'bottom' at the bottom */
  position?: 'top' | 'bottom';
  /** Fill color class, e.g. "text-white fill-current", "text-[#062426] fill-current" */
  fillColor?: string;
  /** Select wave shape pattern (1 to 4) for natural section variety */
  variant?: 1 | 2 | 3 | 4;
  /** Height responsiveness class */
  heightClass?: string;
  /** Flip wave horizontally */
  flipHorizontal?: boolean;
  /** Custom extra container classes */
  className?: string;
}

export default function WaveDivider({
  position = 'bottom',
  fillColor = 'text-white',
  variant = 1,
  heightClass = 'h-10 sm:h-14 md:h-20 lg:h-24',
  flipHorizontal = false,
  className = '',
}: WaveDividerProps) {
  // Fluid SVG wave paths tailored for smooth section flow
  const wavePaths = {
    1: 'M0,32 C320,95 480,10 720,50 C960,90 1180,15 1440,40 L1440,120 L0,120 Z',
    2: 'M0,50 C240,110 480,10 720,60 C960,110 1200,20 1440,45 L1440,120 L0,120 Z',
    3: 'M0,40 C360,120 720,0 1080,70 C1260,105 1380,45 1440,30 L1440,120 L0,120 Z',
    4: 'M0,60 C300,10 600,110 900,40 C1200,-10 1350,70 1440,50 L1440,120 L0,120 Z',
  };

  const selectedPath = wavePaths[variant] || wavePaths[1];
  const transforms = [
    position === 'top' ? 'rotate-180' : '',
    flipHorizontal ? 'scale-x-[-1]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`relative w-full overflow-hidden leading-none pointer-events-none z-20 ${
        position === 'top' ? '-mt-1 -translate-y-[1px]' : '-mb-1 translate-y-[1px]'
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        className={`relative block w-full ${heightClass} ${fillColor} fill-current ${
          transforms ? `transform ${transforms}` : ''
        }`}
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d={selectedPath} />
      </svg>
    </div>
  );
}
