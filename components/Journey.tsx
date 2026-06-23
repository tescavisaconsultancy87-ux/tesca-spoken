import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { JOURNEY_STEPS } from '@/lib/data/content';

export default function Journey() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Your Journey"
          title={
            <>
              From your first word to{' '}
              <span className="text-primary">fluent conversations</span>
            </>
          }
          description="A structured six-step pathway that takes you from where you are today to confident, fluent communication."
        />

        {/* Timeline */}
        <div className="relative mt-14 lg:mt-20">
          {/* Desktop center line */}
          <div
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 lg:block"
            aria-hidden="true"
          >
            <div className="h-full w-full bg-gradient-to-b from-primary via-primary-300 to-secondary" />
          </div>

          {/* Mobile vertical line */}
          <div
            className="absolute left-[27px] top-0 h-full w-px bg-gradient-to-b from-primary via-primary-200 to-secondary lg:hidden"
            aria-hidden="true"
          />

          <div className="space-y-8 lg:space-y-0">
            {JOURNEY_STEPS.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Reveal key={item.step} delay={i * 60}>
                  <div
                    className={`relative flex items-start gap-5 pl-0 lg:mb-[-2px] lg:gap-0 ${
                      isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* Step node */}
                    <div className="relative z-10 flex shrink-0 items-center lg:order-2 lg:mx-auto">
                      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-bg-soft bg-white shadow-soft-lg lg:h-16 lg:w-16">
                        <span className="font-heading text-lg font-bold text-primary lg:text-xl">
                          {item.step}
                        </span>
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary-200 opacity-40" />
                      </span>
                    </div>

                    {/* Content card */}
                    <div
                      className={`flex-1 lg:order-1 lg:w-[calc(50%-3rem)] lg:flex-none lg:justify-end ${
                        isLeft ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'
                      }`}
                    >
                      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-soft-lg lg:p-6">
                        <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
                          Step {item.step}
                        </span>
                        <h3 className="mt-1.5 font-heading text-base font-bold text-ink lg:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for desktop */}
                    <div className="hidden lg:order-3 lg:block lg:w-[calc(50%-3rem)]" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
