import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';

export const metadata: Metadata = {
  title: 'Privacy Policy - TESCA Spoken English',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <div className="container-x py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl font-bold text-ink mb-6">
              Privacy Policy
            </h1>
            <p className="mb-4 text-ink-muted leading-relaxed">
              At TESCA Spoken English, accessible from tesca.co, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by TESCA Spoken English and how we use it.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Log Files
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              TESCA Spoken English follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, internet service provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement around the website, and gathering demographic information.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Cookies and Web Beacons
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Like any other website, TESCA Spoken English uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners include .... Each of these ad servers has its own privacy policy for their data. For easier access, we hyperlinked to their Privacy Policies below.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              <span className="font-medium">Google</span>: https://policies.google.com/technologies/ads
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              <span className="font-medium">Google AdSense</span>: https://www.google.com/adsense/support/answer/2839090
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              <span className="font-medium">DoubleClick</span>: https://support.google.com/admanager/answer/2839080
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Privacy Policies
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              You may consult this list to find the privacy policy for each of the advertising partners of TESCA Spoken English.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on TESCA Spoken English, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Note that TESCA Spoken English has no access to or control over these cookies that are used by third-party advertisers.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              CCPA Privacy Rights (Do Not Sell My Personal Information)
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Under the CCPA, among other rights, California consumers have the right to:
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              Request a business that discloses a consumer's personal information to a third party for the purposes of the sale of personal information. (Opt-out of sale)
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              Request a business to delete any personal information about a consumer that a business has collected.
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              Request a business to disclose the categories and specific pieces of personal information that a business has collected about a consumer.
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              Request that a business not sell any personal information about a consumer that a business has collected.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              GDPR Data Protection Rights
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              The right to rectification – You have the right to request that we correct any information that you believe is inaccurate. You also have the right to request that we complete the information that you believe is incomplete.
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              The right to erasure – You have the right to request that we delete your personal data, under certain conditions.
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.
            </p>
            <p className="mb-2 text-ink-muted leading-relaxed">
              The right to data portability – You have the right to request that we transfer your data that we have collected to another organization, or directly to you, under certain conditions.
            </p>
            <h2 className="font-heading text-2xl font-bold text-ink mt-6 mb-4">
              Children's Information
            </h2>
            <p className="mb-4 text-ink-muted leading-relaxed">
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
            </p>
            <p className="mb-4 text-ink-muted leading-relaxed">
              TESCA Spoken English does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
