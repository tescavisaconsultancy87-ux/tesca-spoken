import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { Home, HelpCircle } from 'lucide-react';

export default function CustomNotFound() {
  return (
    <div className="min-h-screen bg-bg-soft flex flex-col justify-between">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-28 pb-16 lg:pt-36">
        <div className="container-x w-full">
          <div className="max-w-4xl mx-auto bg-white border border-black/5 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-soft hover:shadow-soft-lg transition-all duration-300">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              
              {/* Text Area */}
              <div className="text-center lg:text-left lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-rose-600 shadow-soft">
                  Error 404
                </div>
                
                <h1 className="font-heading text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
                  Lost in <span className="text-primary">Translation?</span>
                </h1>
                
                <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
                  The page you are looking for has either been moved, deleted, or never existed in the first place. Don&apos;t worry — let&apos;s get you back on track!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/" className="w-full sm:w-auto btn-warm inline-flex items-center justify-center gap-2">
                    <Home className="h-4 w-4" />
                    Back to Home
                  </Link>
                  <Link 
                    href="/faq" 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-150 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Browse FAQs
                  </Link>
                </div>
              </div>

              {/* Illustration Area */}
              <div className="lg:col-span-5 flex justify-center order-first lg:order-last">
                <div className="relative w-full max-w-[280px] lg:max-w-none aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 p-2 border border-black/5 shadow-soft">
                  <img
                    src="/not_found_graphic.png"
                    alt="404 Page Not Found Illustration"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
