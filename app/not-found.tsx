import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found – TESCA Spoken English',
  description: 'Sorry, the page you are looking for does not exist.',
};

export default function CustomNotFound() {
  return (
    <div className="min-h-screen bg-bg-soft">
      <Navbar />
      <main className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
        <div className="text-center space-y-8 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-xl">
            404
          </div>
          <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">
            Page Not Found
          </h1>
          <p className="text-lg text-ink-muted max-w-xl mx-auto">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <a href="/" className="btn-warm inline-flex items-center gap-2">
            Return to Homepage
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
