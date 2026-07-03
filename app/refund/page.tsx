import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';

export const metadata: Metadata = {
  title: 'Refund Policy - TESCA Spoken English',
  description: 'Read our refund policy regarding spoken English and competitive training courses.',
  alternates: {
    canonical: 'https://tesca.co/refund',
  },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container-x py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl font-bold text-ink mb-6">
              Refund & Cancellation Policy
            </h1>
            
            <div className="prose max-w-none text-ink-muted leading-relaxed space-y-6">
              <p>
                Thank you for choosing <strong>TESCA Spoken English</strong>. We are committed to providing the highest quality of spoken English, IELTS, PTE, and interview preparation training.
              </p>

              <div className="bg-orange-50 border-l-4 border-secondary p-4 rounded-r-xl my-6">
                <p className="font-bold text-orange-950 margin-bottom-1 text-sm">⚠️ STRICT NO-REFUND POLICY</p>
                <p className="text-xs text-orange-900">
                  All course enrollments, subscription purchases, live batch assignments, and study material digital access provisions are final. <strong>TESCA Spoken English enforces a strict NO-REFUND, non-cancellable, and non-transferable policy.</strong> Once a transaction is processed and payment is completed, no refunds will be issued under any circumstances.
                </p>
              </div>

              <h2 className="font-heading text-xl font-bold text-ink pt-4">
                1. Service Commencement & Material Access
              </h2>
              <p>
                Immediately upon completing your payment checkout:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your student account credentials are automatically generated and emailed.</li>
                <li>Instant digital access to proprietary curriculum documents, vocabulary lists, and practice modules is provisioned.</li>
                <li>A training slot is dedicated to you in your selected batch, preventing other potential students from booking that seat.</li>
              </ul>
              <p>
                Consequently, we cannot reverse payment transactions or cancel course enrollments once finalized.
              </p>

              <h2 className="font-heading text-xl font-bold text-ink pt-4">
                2. Subscription Billing Plans (EMI)
              </h2>
              <p>
                For students who enroll using monthly payment options:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You agree to pay the complete set of subscription payments as scheduled.</li>
                <li>Early cancellation of batch schedules or stopping class attendance does not excuse the student from completing the billing plan.</li>
              </ul>

              <h2 className="font-heading text-xl font-bold text-ink pt-4">
                3. Technical Support
              </h2>
              <p>
                If you encounter any technical complications logging into the student portal, attending live batches, or accessing your lessons, please contact our support team at <a href="mailto:tescavisaconsultancy87@gmail.com" className="text-primary hover:underline">tescavisaconsultancy87@gmail.com</a>. We will work diligently to resolve your access issues.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
