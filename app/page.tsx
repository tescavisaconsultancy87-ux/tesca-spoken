import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WhyTesca from '@/components/WhyTesca';
import Courses from '@/components/Courses';
import Journey from '@/components/Journey';
import StudentSuccess from '@/components/StudentSuccess';
import Testimonials from '@/components/Testimonials';
import Trainers from '@/components/Trainers';
import FreeTest from '@/components/FreeTest';
import Faq from '@/components/Faq';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { db } from '@/lib/db';

export default async function Home() {
  let showFreeTest = true;
  try {
    const settings = await db.getSystemSettings();
    showFreeTest = !!settings.enableFreeTest;
  } catch (err) {
    console.error('Failed to load settings in Home Page:', err);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <WhyTesca />
        <Courses />
        <Journey />
        <StudentSuccess />
        <Testimonials />
        <Trainers />
        {showFreeTest && <FreeTest />}
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
