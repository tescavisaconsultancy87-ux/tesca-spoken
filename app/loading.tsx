import React from 'react';

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/90 shadow-soft-xl border border-slate-100">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-3 border-teal-100" />
          <div className="absolute inset-0 rounded-full border-3 border-[#067779] border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-bold text-[#067779] tracking-wide">Loading page...</p>
      </div>
    </div>
  );
}
