import React from 'react';

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="pt-40 lg:pt-48 pb-16 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/30">
        <div className="container-x max-w-3xl mx-auto text-center space-y-4 animate-pulse">
          <div className="h-6 w-28 bg-teal-100 rounded-full mx-auto" />
          <div className="h-10 sm:h-12 w-3/4 bg-slate-200 rounded-xl mx-auto" />
          <div className="h-4 w-1/2 bg-slate-100 rounded-md mx-auto" />
        </div>
      </div>

      {/* Courses Grid Skeleton */}
      <div className="container-x py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-[24px] border border-[#E8EDF3] bg-white overflow-hidden shadow-soft animate-pulse"
            >
              <div className="aspect-[16/10] w-full bg-slate-100" />
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-5 w-4/5 bg-slate-200 rounded" />
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-3/4 bg-slate-100 rounded" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-6 w-24 bg-slate-200 rounded" />
                  <div className="h-8 w-28 bg-primary/20 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
