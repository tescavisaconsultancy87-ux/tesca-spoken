import React from 'react';

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top spacing matching Navbar */}
      <div className="pt-36 lg:pt-44 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/30 pb-12">
        <div className="container-x max-w-3xl mx-auto space-y-6 animate-pulse">
          {/* Back link placeholder */}
          <div className="h-4 w-24 bg-slate-200 rounded-md" />

          {/* Category pill placeholder */}
          <div className="h-6 w-28 bg-teal-100/80 rounded-full" />

          {/* Title placeholder */}
          <div className="space-y-3">
            <div className="h-9 sm:h-12 w-11/12 bg-slate-200 rounded-xl" />
            <div className="h-9 sm:h-12 w-3/4 bg-slate-200 rounded-xl" />
          </div>

          {/* Author & Date meta */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-4 w-32 bg-slate-200 rounded-md" />
            <div className="h-4 w-28 bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* Featured image skeleton */}
      <div className="container-x max-w-3xl mx-auto -mt-6">
        <div className="aspect-[16/9] w-full rounded-2xl bg-slate-100 border border-slate-200/60 shadow-sm animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-slate-300">
            <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
            <span className="text-xs font-semibold">Loading article...</span>
          </div>
        </div>
      </div>

      {/* Article Body Skeleton */}
      <div className="container-x max-w-3xl mx-auto py-16 space-y-6 animate-pulse">
        <div className="space-y-2.5">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-4/5 bg-slate-100 rounded" />
        </div>

        <div className="h-6 w-48 bg-slate-200 rounded-lg pt-4" />

        <div className="space-y-2.5">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-11/12 bg-slate-100 rounded" />
          <div className="h-4 w-3/4 bg-slate-100 rounded" />
        </div>

        <div className="space-y-2.5">
          <div className="h-4 w-full bg-slate-100 rounded" />
          <div className="h-4 w-5/6 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}
