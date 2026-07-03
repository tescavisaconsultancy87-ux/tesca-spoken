'use client';

import SectionHeading from '@/components/SectionHeading';

const SCHOOLS = [
  { name: 'Ashadeep Group of Schools', logo: '/schools/Ashadeep_Group_of_Schools.png' },
  { name: 'Concept Modern School', logo: '/schools/Concept Modern School.jpg' },
  { name: 'Global International School', logo: '/schools/Global International.jpg' },
  { name: 'Haridarshan School', logo: '/schools/Haridarshan school.jpg' },
  { name: 'Udan International School', logo: '/schools/Udan International School.jpg' },
  { name: 'Vibrant International Academy', logo: '/schools/Vibrant International Academy.png' },
  { name: 'Ankur Vidhyalay', logo: '/schools/ankur vidhyalay.jpg' },
  { name: 'Apple Public School', logo: '/schools/apple public school.jpg' },
  { name: 'Bhagwati International School', logo: '/schools/bhagwati international.jpg' },
  { name: 'Diamond Girls School', logo: '/schools/diamond girls.jpg' },
  { name: 'Matrubhumi Vidhya Sankul', logo: '/schools/matrubhumi vidhya sankul.jpg' },
  { name: 'Sanskartirth School', logo: '/schools/sanskartirth.png' },
  { name: 'Vashishtha School', logo: '/schools/vashishtha.png' },
];

export default function SchoolMarquee() {
  // Duplicate schools array to ensure a seamless infinite scroll loop
  const marqueeItems = [...SCHOOLS, ...SCHOOLS];

  return (
    <section className="bg-bg-soft py-16 border-y border-slate-100 overflow-hidden">
      <div className="container-x">
        <SectionHeading
          eyebrow="Associated Schools"
          title={
            <>
              Trusted by Students from{' '}
              <span className="text-secondary">Leading Schools</span>
            </>
          }
          description="We are proud to train and support students from these top-tier academic institutions in their spoken English journey."
        />
      </div>

      {/* Infinite Marquee Container - Full Width */}
      <div className="relative mt-12 w-full">
        {/* Edge gradient masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-bg-soft via-bg-soft/75 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-bg-soft via-bg-soft/75 to-transparent" />

        {/* Marquee Track */}
        <div className="flex w-max animate-marquee gap-6 py-4 hover:[animation-play-state:paused] cursor-pointer">
          {marqueeItems.map((school, i) => (
            <div
              key={`${school.name}-${i}`}
              className="flex w-48 h-28 flex-col items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:border-primary/20"
            >
              {/* Logo Area */}
              <div className="flex flex-1 items-center justify-center w-full">
                <img
                  src={school.logo}
                  alt={`${school.name} logo`}
                  className="max-h-12 max-w-full object-contain transition-all duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* School Name */}
              <p className="mt-2 text-center text-[11px] font-semibold text-slate-600 tracking-wide line-clamp-1 w-full">
                {school.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
