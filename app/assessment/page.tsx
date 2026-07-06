'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, HelpCircle, Award, BookOpen, MessageCircle, RotateCcw, Loader2 } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number; // index of correct option
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Choose the correct sentence:",
    options: [
      "She don't like coffee in the morning.",
      "She doesn't likes coffee in the morning.",
      "She doesn't like coffee in the morning.",
      "She not likes coffee in the morning."
    ],
    answer: 2
  },
  {
    id: 2,
    text: "Which word best completes: 'If it rains tomorrow, we _______ stay at home.'",
    options: [
      "would",
      "will",
      "are",
      "have"
    ],
    answer: 1
  },
  {
    id: 3,
    text: "Identify the antonym of the word 'AMBIGUOUS':",
    options: [
      "Unclear",
      "Vague",
      "Precise",
      "Cryptic"
    ],
    answer: 2
  },
  {
    id: 4,
    text: "Complete the idiom: 'By working hard, he finally got the ball _______.'",
    options: [
      "rolling",
      "playing",
      "spinning",
      "moving"
    ],
    answer: 0
  },
  {
    id: 5,
    text: "Choose the correct past participle form: 'They have _______ all the juice.'",
    options: [
      "drank",
      "drunk",
      "drinked",
      "drunken"
    ],
    answer: 1
  },
  {
    id: 6,
    text: "Which sentence uses the present perfect continuous tense correctly?",
    options: [
      "I am learning English for three years.",
      "I learned English for three years.",
      "I have been learning English for three years.",
      "I have learned English for three years."
    ],
    answer: 2
  },
  {
    id: 7,
    text: "What does 'I am looking forward to meeting you' mean?",
    options: [
      "I am searching for you.",
      "I am excited about our future meeting.",
      "I am looking at your face.",
      "I met you in the past."
    ],
    answer: 1
  },
  {
    id: 8,
    text: "Select the correct word: 'The company's new policy has had a major _______ on employee morale.'",
    options: [
      "affect",
      "effect",
      "effection",
      "affection"
    ],
    answer: 1
  },
  {
    id: 9,
    text: "Complete: 'Had I known about the storm, I _______ stayed indoors.'",
    options: [
      "will have",
      "would have",
      "should",
      "had"
    ],
    answer: 1
  },
  {
    id: 10,
    text: "What is the closest synonym to the word 'METICULOUS'?",
    options: [
      "Careless",
      "Thorough",
      "Quick",
      "Lazy"
    ],
    answer: 1
  }
];

export default function AssessmentPage() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [showLeadModal, setShowLeadModal] = useState<boolean>(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '' });
  const [submittingLead, setSubmittingLead] = useState<boolean>(false);
  const [leadError, setLeadError] = useState<string>('');

  const handleSelectOption = (qId: number, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowLeadModal(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setQuizFinished(false);
    setShowLeadModal(false);
    setLeadForm({ name: '', phone: '', email: '' });
    setLeadError('');
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');

    // Phone validation
    const cleanedPhone = leadForm.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setLeadError('Mobile number must be exactly 10 digits.');
      return;
    }

    setSubmittingLead(true);

    try {
      const notesPayload = `Source: CEFR Assessment\nCEFR Level: ${cefrLevel}\nRecommended Course: ${courseRecommendation}\nCorrect Answers: ${totalCorrect}/${QUESTIONS.length}`;

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'assessment',
          name: leadForm.name,
          phone: leadForm.phone,
          email: leadForm.email || undefined,
          notes: notesPayload
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit details.');
      }

      setShowLeadModal(false);
      setQuizFinished(true);
    } catch (err: any) {
      console.error('Lead submit error:', err);
      setLeadError(err.message || 'An error occurred. Please try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  // Compute Results
  const totalCorrect = QUESTIONS.filter(q => answers[q.id] === q.answer).length;
  
  let cefrLevel = '';
  let courseRecommendation = '';
  let courseDetails = '';
  let colorTheme = '';

  if (totalCorrect <= 3) {
    cefrLevel = 'Elementary / Beginner (A1–A2)';
    courseRecommendation = 'Spoken English Basic Course';
    courseDetails = 'This course focuses on building solid grammar foundations, elementary vocabulary, basic sentence structure, and building initial speaking confidence.';
    colorTheme = 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700';
  } else if (totalCorrect <= 7) {
    cefrLevel = 'Intermediate (B1–B2)';
    courseRecommendation = 'Spoken English Mastery — Intermediate';
    courseDetails = 'Perfect for learners who can speak basic sentences but struggle with vocabulary recall, idioms, complex grammar, or confidence. Focused on conversational fluency.';
    colorTheme = 'from-blue-50 to-indigo-50 border-blue-200 text-blue-700';
  } else {
    cefrLevel = 'Advanced Speaker (C1–C2)';
    courseRecommendation = 'Business Communication & Interview Prep';
    courseDetails = 'Designed for professionals who need accent neutralisation, corporate communication skills, public presentation tools, and formal interview readiness coaching.';
    colorTheme = 'from-purple-50 to-fuchsia-50 border-purple-200 text-purple-700';
  }

  const currentQuestion = QUESTIONS[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://tesca.co'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'English Assessment',
        'item': 'https://tesca.co/assessment'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <main className="flex-grow pt-40 pb-20 lg:pt-48 lg:pb-28 bg-gradient-to-b from-primary-50/20 via-white to-secondary-50/20">
        <div className="container-x max-w-4xl">
          
          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[2.5rem] border border-black/5 p-6 sm:p-12 shadow-soft-xl space-y-8"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full">
                      English Assessment Test
                    </span>
                    <h2 className="text-xl font-extrabold text-gray-800 tracking-tight leading-snug">
                      Assess your CEFR Level
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-gray-400 self-start sm:self-center">
                    Question {currentIdx + 1} of {QUESTIONS.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-gray-150 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-350"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Question body */}
                <div className="space-y-6">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-800 flex gap-2">
                    <HelpCircle className="h-6 w-6 text-primary shrink-0" />
                    {currentQuestion.text}
                  </h3>

                  <div className="grid gap-3">
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = answers[currentQuestion.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between group cursor-pointer ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-primary shadow-soft' 
                              : 'border-black/5 bg-bg-soft hover:bg-black/5 text-gray-700 hover:text-black'
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'
                          }`}>
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between border-t border-black/5 pt-6 mt-4">
                  <button
                    type="button"
                    disabled={currentIdx === 0}
                    onClick={handlePrev}
                    className="btn-secondary text-xs disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={answers[currentQuestion.id] === undefined}
                    onClick={handleNext}
                    className="btn-primary text-xs cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    {currentIdx === QUESTIONS.length - 1 ? 'See My CEFR Result' : 'Next Question'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[2.5rem] border border-black/5 p-6 sm:p-12 shadow-soft-xl space-y-8 text-center"
              >
                {/* Result header */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-16 w-16 bg-secondary/15 rounded-full flex items-center justify-center text-secondary shadow-soft">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight leading-tight">
                      Assessment Completed!
                    </h2>
                    <p className="text-sm text-gray-400 font-semibold mt-1">
                      You answered {totalCorrect} out of {QUESTIONS.length} questions correctly.
                    </p>
                  </div>
                </div>

                {/* Result Card */}
                <div className={`p-6 sm:p-8 rounded-[2rem] border bg-gradient-to-br text-left space-y-4 ${colorTheme}`}>
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-opacity-80">Your Measured Level:</p>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold">{cefrLevel}</h3>
                  </div>
                  
                  <div className="border-t border-black/5 pt-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-opacity-80">Recommended Course:</p>
                      <h4 className="font-heading text-base sm:text-lg font-bold text-gray-800">{courseRecommendation}</h4>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed">
                      {courseDetails}
                    </p>
                  </div>
                </div>

                {/* Perks list */}
                <div className="text-left space-y-3 max-w-lg mx-auto">
                  <h4 className="text-xs font-bold text-gray-850 uppercase tracking-wider">What you get at TESCA:</h4>
                  <ul className="grid gap-2.5 text-xs font-semibold text-gray-500">
                    <li className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-primary-50 text-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      Daily Live Interactive Speaking Batches.
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-primary-50 text-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      Mock Tests & CEFR Assessment reports.
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded-full bg-primary-50 text-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      1-on-1 speaking practice with expert trainers.
                    </li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-black/5">
                  <a
                    href="/?demo=true"
                    className="btn-warm w-full sm:w-auto justify-center px-8 py-3.5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Book Free Counseling
                  </a>
                  
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="btn-secondary w-full sm:w-auto justify-center px-8 py-3.5 cursor-pointer font-bold"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </main>

      {/* Lead Capture Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-soft-xl p-8 sm:p-10 space-y-6 text-center animate-scale-up border border-black/5">
            
            <div className="space-y-2">
              <span className="text-[28px]" role="img" aria-label="party popper">🎉</span>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight leading-tight">
                Your assessment is complete!
              </h3>
              <p className="text-sm font-bold text-primary">
                Your CEFR level is ready.
              </p>
              <p className="text-xs text-gray-450 font-semibold leading-relaxed">
                Enter your details to view your result and receive personalized course recommendations.
              </p>
            </div>

            {leadError && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-xs font-semibold text-red-650 text-left">
                {leadError}
              </div>
            )}

            <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-black/10 bg-bg-soft px-4 py-3 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">
                    Mobile Number <span className="text-accent">*</span>
                  </label>
                  <span className={`text-[10px] font-semibold transition-colors ${leadForm.phone.length === 10 ? 'text-green-600' : 'text-gray-400'}`}>
                    {leadForm.phone.length} / 10 digits
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  value={leadForm.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setLeadForm(f => ({ ...f, phone: val }));
                  }}
                  placeholder="Enter 10-digit number"
                  className="w-full rounded-xl border border-black/10 bg-bg-soft px-4 py-3 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-black/10 bg-bg-soft px-4 py-3 text-xs text-ink placeholder:text-ink-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submittingLead}
                className="btn-primary w-full justify-center py-3.5 mt-6 cursor-pointer font-bold text-sm"
              >
                {submittingLead ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    Loading...
                  </>
                ) : (
                  'View My Result'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <FloatingActions />
    </div>
  );
}
