import React from 'react';

export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Dark Hero Section matching courses/[id] */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 pt-36 pb-20 lg:pt-44 lg:pb-28 text-white">
        <div className="container-x relative z-10 max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-4 w-28 bg-white/20 rounded" />
          <div className="h-10 sm:h-14 w-3/4 bg-white/20 rounded-xl" />
          <div className="h-4 w-1/2 bg-white/10 rounded" />
          <div className="flex gap-4 pt-4">
            <div className="h-8 w-24 bg-white/10 rounded-full" />
            <div className="h-8 w-32 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content & Pricing Cards Skeleton */}
      <div className="container-x max-w-5xl mx-auto py-16">
        <div className="grid gap-10 lg:grid-cols-12 animate-pulse">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-3">
              <div className="h-6 w-40 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-5/6 bg-slate-100 rounded" />
            </div>

            <div className="space-y-4 pt-6">
              <div className="h-6 w-48 bg-slate-200 rounded" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 w-full bg-slate-50 border border-slate-100 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-soft space-y-6">
              <div className="h-8 w-28 bg-slate-200 rounded" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-4/5 bg-slate-100 rounded" />
              </div>
              <div className="h-12 w-full bg-primary/20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
