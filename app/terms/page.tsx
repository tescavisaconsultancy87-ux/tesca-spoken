import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';

export const metadata: Metadata = {
  title: 'Terms of Service - TESCA Spoken English',
  description: 'Read our terms of service to understand the rules and guidelines for using our website and services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <div className="container-x py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl font-bold text-ink mb-6">
              Terms of Service
            </h1>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the tesca.co website (the "Service") operated by TESCA Spoken English.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Intellectual Property
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              The Service and its original content, features and functionality are and will remain the exclusive property of TESCA Spoken English and its licensors. The Service is protected by copyright, trademark and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of TESCA Spoken English.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Links To Other Web Sites
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Our Service may contain links to third-party web sites or services that are not owned or controlled by TESCA Spoken English.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              TESCA Spoken English has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that TESCA Spoken English shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Termination
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Limitation Of Liability
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              In no event shall TESCA Spoken English, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy has been set forth elsewhere.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              TESCA Spoken English assumes no responsibility or liability for any errors or omissions in the content of the Service.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Governing Law
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Changes
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Contact Us
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              If you have any questions about these Terms, please contact us.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
