'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What courses do you offer?',
    answer: 'We offer a wide range of English courses including Spoken English, IELTS preparation, PTE preparation, Business English, and Interview Preparation. Our courses are designed for all levels from beginner to advanced.',
  },
  {
    question: 'How do I enroll in a course?',
    answer: 'You can enroll by visiting our website and filling out the enrollment form, or by contacting us via phone or email. We also offer a free demo class to help you choose the right course.',
  },
  {
    question: 'Are your teachers certified?',
    answer: 'Yes, all our teachers are certified and experienced. They hold qualifications such as TEFL, TESOL, or CELTA and have undergone our rigorous training program.',
  },
  {
    question: 'Do you offer online classes?',
    answer: 'Absolutely! We offer both online and in-person classes. Our online classes are live and interactive, allowing you to learn from the comfort of your home.',
  },
  {
    question: 'What is the duration of the courses?',
    answer: 'Course duration varies depending on the type and level. Typically, our courses range from 4 weeks to 6 months. We also offer flexible schedules to accommodate your needs.',
  },
  {
    question: 'How can I track my progress?',
    answer: 'We provide regular assessments and feedback to track your progress. You will receive progress reports and have access to our learning portal where you can see your achievements and areas for improvement.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-bg-soft">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main>
        <section className="py-12">
          <div className="container-x">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                Frequently Asked Questions
              </span>
              <h1 className="font-heading mt-3 text-4xl font-bold text-ink sm:text-5xl">
                Frequently Asked Questions
              </h1>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="border border-black/5 rounded-2xl overflow-hidden shadow-soft bg-white transition-all duration-350">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between px-6 py-4 cursor-pointer text-left hover:bg-primary-50/50 transition-colors focus:outline-none"
                    >
                      <h3 className="font-heading text-base font-bold text-gray-800">{faq.question}</h3>
                      <span className="text-primary transition-transform duration-200">
                        {isOpen ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-6 py-4 text-xs text-gray-500 font-medium leading-relaxed border-t border-gray-50 bg-gray-50/20 animate-fade-in">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
