import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import NotFoundActions from '@/components/NotFoundActions';

export const metadata: Metadata = {
  title: '404 — Page Not Found | TESCA Spoken English',
  description:
    'The page you are looking for has been moved, deleted, or is temporarily unavailable. Return to TESCA Spoken English homepage.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://tesca.co/404',
  },
};

export default function CustomNotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-28 pb-16 lg:pt-36">
        <div className="w-full px-4 text-center max-w-2xl mx-auto space-y-6">
          {/* Huge Gradient 404 Text */}
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter bg-gradient-to-b from-[#067779] to-[#0b3336] bg-clip-text text-transparent select-none leading-none">
            404
          </h1>

          {/* Page Not Found Label */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Page Not Found
          </h2>

          {/* Core Description */}
          <p className="text-xs md:text-sm text-slate-400 font-semibold max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          {/* Actions component */}
          <div className="pt-2">
            <NotFoundActions />
          </div>

          {/* Help Links footer support */}
          <div className="pt-10 text-[10px] md:text-xs text-slate-400 font-semibold">
            Need help?{' '}
            <Link href="/contact" className="text-[#067779] hover:underline font-bold transition-all">
              Contact our support team
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
