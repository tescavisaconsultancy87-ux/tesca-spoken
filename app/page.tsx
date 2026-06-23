import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <WhyTesca />
        <Courses />
        <Journey />
        <StudentSuccess />
        <Testimonials />
        <Trainers />
        <FreeTest />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
