'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Star, 
  Users 
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { COURSES } from '@/lib/data/content';
import { useDemoModal } from '@/context/DemoModalContext';
import { db } from '@/lib/db';

// Metadata helper to augment course with premium details and high-quality photography
function getCourseMeta(courseIdOrTitle: string) {
  const normalized = (courseIdOrTitle || '').toLowerCase();
  
  if (normalized.includes('basic') || normalized.includes('starter') || normalized.includes('spoken-english-basic')) {
    return {
      subtitle: 'Build strong grammar foundations and start speaking confidently.',
      difficulty: 'Beginner',
      rating: '4.8',
      students: '5,400+',
      liveClasses: '48 Live Classes',
      certificate: 'Certificate Included',
      imageUrl: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    };
  }
  
  if (normalized.includes('advanced') || normalized.includes('business') || normalized.includes('business-communication') || normalized.includes('communication')) {
    return {
      subtitle: 'Master public speaking, business communication, and neutral accent.',
      difficulty: 'Advanced',
      rating: '4.9',
      students: '6,400+',
      liveClasses: '64 Live Classes',
      certificate: 'Certificate Included',
      imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    };
  }
  
  if (normalized.includes('ielts')) {
    return {
      subtitle: 'Targeted preparation to clear IELTS Academic & General with Band 7.5+.',
      difficulty: 'Intermediate to Advanced',
      rating: '4.9',
      students: '3,850+',
      liveClasses: '36 Live Classes',
      certificate: 'Score Report Included',
      imageUrl: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    };
  }
  
  if (normalized.includes('pte')) {
    return {
      subtitle: 'Master PTE Academic using smart templates and AI-scored mock tests.',
      difficulty: 'Intermediate to Advanced',
      rating: '4.8',
      students: '2,900+',
      liveClasses: '30 Live Classes',
      certificate: 'AI Report Included',
      imageUrl: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    };
  }
  
  if (normalized.includes('interview') || normalized.includes('career') || normalized.includes('accelerator')) {
    return {
      subtitle: 'Crack MNC interviews with resume building, mock rounds, and HR prep.',
      difficulty: 'All Levels',
      rating: '4.9',
      students: '1,800+',
      liveClasses: '20 Live Classes',
      certificate: 'Placement Support',
      imageUrl: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600',
      bgGradient: 'from-rose-500/10 via-red-500/5 to-transparent',
    };
  }
  
  return {
    subtitle: 'Enhance your communication skills with structured, certified training.',
    difficulty: 'Intermediate',
    rating: '4.8',
    students: '2,000+',
    liveClasses: 'Live Classes Included',
    certificate: 'Certificate Included',
    imageUrl: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=600',
    bgGradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
  };
}

export default function Courses() {
  const { openModal } = useDemoModal();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getCourses();
        if (data && data.length > 0) {
          const mapped = data.map((c: any) => {
            const priceVal = Number(c.price || 0);
            const origVal = Number(c.original_price || priceVal * 1.5);
            return {
              id: c.id,
              title: c.title,
              duration: c.duration || '3 Months',
              accent: c.accent || 'primary',
              benefits: c.benefits 
                ? c.benefits.split(',').map((b: string) => b.trim()) 
                : ['Grammar foundations', 'Vocabulary building', 'Basic conversation'],
              price: `₹${priceVal.toLocaleString('en-IN')}`,
              originalPrice: `₹${origVal.toLocaleString('en-IN')}`,
              popular: !!c.popular
            };
          });
          setCourses(mapped);
        } else {
          setCourses(COURSES);
        }
      } catch (err) {
        console.error('Failed to load courses on Home, using fallback', err);
        setCourses(COURSES);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section id="courses" className="bg-[#062426] py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          theme="dark"
          eyebrow="Courses"
          title={
            <>
              Programs designed for{' '}
              <span className="text-secondary">every level</span>
            </>
          }
          description="From absolute beginners to advanced exam takers — find the perfect course to match your goals and schedule."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 max-w-5xl mx-auto justify-center items-stretch">
          {loading ? (
            <div className="col-span-full py-12 text-center text-primary-200">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
              <p className="mt-2 text-xs font-semibold">Loading courses...</p>
            </div>
          ) : (
            courses.map((course, i) => {
              const isPopular = course.popular;
              const meta = getCourseMeta(course.id || course.title);

              return (
                <Reveal
                  key={course.title}
                  delay={i * 70}
                  className={isPopular ? 'lg:-mt-4' : ''}
                >
                  <article
                    className={`group relative flex h-full flex-col overflow-hidden rounded-[24px] transition-all duration-300 ease-out hover:-translate-y-2 ${
                      isPopular
                        ? 'bg-gradient-to-br from-[#0F766E] via-[#F97316] to-[#0F766E] p-[2px] shadow-[0_12px_40px_rgba(249,120,35,0.15)] hover:shadow-[0_24px_50px_rgba(249,120,35,0.25)]'
                        : 'border border-[#E8EDF3] bg-white shadow-soft hover:shadow-[0_20px_40px_rgba(15,118,110,0.12)]'
                    }`}
                  >
                    <div className={`flex flex-col h-full w-full bg-white rounded-[22px] overflow-hidden`}>
                      {/* Top subtle course visual cover image */}
                      <div className="relative h-[155px] w-full overflow-hidden bg-slate-50 border-b border-[#E8EDF3]/50">
                        {/* Course Cover Photo */}
                        <img 
                          src={meta.imageUrl} 
                          alt={course.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Gradient tint overlay for readable badges */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                        {/* Top floating difficulty badge */}
                        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap z-10">
                          <span className="rounded-full bg-white/95 backdrop-blur-sm border border-[#E8EDF3] px-2.5 py-0.5 text-[10px] font-bold text-[#0F172A] shadow-xs">
                            {meta.difficulty}
                          </span>
                        </div>

                        {/* Ribbon / Floating Badge for Popular course */}
                        {isPopular && (
                          <div className="absolute top-3 right-3 rounded-full bg-gradient-to-r from-[#F97316] to-[#E05E00] px-3 py-1 text-[9px] font-black text-white uppercase tracking-wider shadow-xs z-20">
                            ★ Most Popular
                          </div>
                        )}
                        
                        {/* Best Value Tag */}
                        {!isPopular && course.id === 'spoken-english-basic' && (
                          <div className="absolute top-3 right-3 rounded-full bg-teal-50 border border-teal-100 px-2.5 py-0.5 text-[9px] font-bold text-teal-700 uppercase tracking-wide z-20">
                            Best Value
                          </div>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          {/* Course title & Subtitle */}
                          <h3 className="font-heading text-lg font-bold text-[#0F172A] leading-snug group-hover:text-[#0F766E] transition-colors duration-250">
                            {course.title}
                          </h3>
                          <p className="text-[13px] leading-relaxed text-[#64748B] mt-1.5 font-medium min-h-[40px]">
                            {meta.subtitle}
                          </p>

                          {/* Trust Section as elegant pills */}
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs">
                              ⭐ {meta.rating} Rating
                            </span>
                            <span className="flex items-center gap-1 rounded-full bg-slate-50 border border-[#E8EDF3] px-2 py-0.5 text-[10px] font-bold text-[#0F172A] shadow-2xs">
                              <Users className="h-3 w-3 text-[#0F766E]" />
                              {meta.students} Students
                            </span>
                            <span className="flex items-center gap-1 rounded-full bg-teal-50 border border-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 shadow-2xs">
                              <Clock className="h-3 w-3 text-teal-700" />
                              {course.duration}
                            </span>
                          </div>

                          {/* Learning Outcomes */}
                          <div className="mt-5 pt-4 border-t border-slate-100">
                            <p className="text-[11px] font-black uppercase tracking-wider text-[#0F766E] mb-2.5">
                              What You&apos;ll Learn
                            </p>
                            <ul className="space-y-2">
                              {course.benefits.slice(0, 4).map((b: string) => (
                                <li key={b} className="flex items-start gap-2.5 text-xs text-[#0F172A] font-medium leading-tight">
                                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                            
                            {/* View Full Curriculum Link */}
                            <div className="mt-3.5">
                              <a
                                href="#curriculum"
                                onClick={(e) => {
                                  const el = document.getElementById('curriculum');
                                  if (el) {
                                    e.preventDefault();
                                    el.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F766E] hover:text-[#0b544e] transition-colors"
                              >
                                View Full Curriculum
                                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Pricing and CTAs */}
                        <div className="mt-6 pt-5 border-t border-slate-100">
                          <div className="flex items-baseline justify-between mb-4.5">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-[#0F172A] tracking-tight">{course.price}</span>
                              {course.originalPrice && course.originalPrice !== course.price && (
                                <span className="text-xs text-[#64748B] line-through font-semibold">{course.originalPrice}</span>
                              )}
                            </div>
                            {(() => {
                              try {
                                const orig = parseInt((course.originalPrice || '').replace(/[₹,]/g, ''));
                                const price = parseInt((course.price || '').replace(/[₹,]/g, ''));
                                if (orig > 0 && orig > price) {
                                  const pct = Math.round(((orig - price) / orig) * 100);
                                  return (
                                    <span className="rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                                      Save {pct}%
                                    </span>
                                  );
                                }
                              } catch (e) {}
                              return null;
                            })()}
                          </div>

                          <div className="flex flex-col gap-2">
                            {(() => {
                              const planParam = course.id === 'spoken-english-basic' ? 'starter' :
                                                course.id === 'business-communication' ? 'professional' :
                                                course.id === 'vocabulary-accelerator' ? 'premium' :
                                                course.title.toLowerCase().includes('basic') ? 'starter' :
                                                course.title.toLowerCase().includes('business') || course.title.toLowerCase().includes('interview') ? 'professional' :
                                                course.title.toLowerCase().includes('vocabulary') || course.title.toLowerCase().includes('idioms') ? 'premium' : '';
                              const enrollHref = planParam ? `/pricing?plan=${planParam}` : '/pricing';
                              return (
                                <a
                                  href={enrollHref}
                                  className={`w-full flex justify-center items-center gap-1.5 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 shadow-2xs group hover:shadow-xs cursor-pointer ${
                                    isPopular 
                                      ? 'bg-gradient-to-r from-[#F97316] to-[#E05E00] hover:from-[#e45f0e] hover:to-[#b63d00] text-white hover:brightness-105' 
                                      : 'bg-[#0F766E] hover:bg-[#0d645e] text-white'
                                  }`}
                                >
                                  Enroll Now
                                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </a>
                              );
                            })()}
                            <button
                              onClick={openModal}
                              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-[#0F172A] border border-[#E8EDF3] bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer"
                            >
                              Book Free Demo
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })
          )}
        </div>

        {/* Bottom note */}
        <Reveal className="mt-10 text-center" delay={200}>
          <p className="text-sm text-primary-200">
            All courses include live classes, recordings, study material, and
            lifetime alumni access.{' '}
            <button
              onClick={openModal}
              className="font-semibold text-secondary hover:underline cursor-pointer"
            >
              Not sure which course? Get free guidance →
            </button>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
