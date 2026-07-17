'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundActions() {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-[#067779] hover:bg-[#056062] text-white font-bold text-sm inline-flex items-center gap-2 transition-all shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5"
      >
        <Home className="h-4 w-4" />
        Go Home
      </Link>
      <button
        onClick={handleBack}
        className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-700 font-bold text-sm inline-flex items-center gap-2 transition-all hover:bg-gray-50 hover:-translate-y-0.5 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </button>
    </div>
  );
}
