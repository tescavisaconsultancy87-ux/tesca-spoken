export interface CurriculumModule {
  id: string;
  number: string;
  title: string;
  tagline: string;
  topics: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  location?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const LANDING_CONFIG = {
  brandName: 'TESCA VISA CONSULTANCY & SPOKEN ENGLISH',
  shortBrand: 'TESCA',
  courseName: 'Online Spoken English Course',
  headline: 'Speak English With Confidence.',
  subheadline: 'Without Fear. Without Hesitation.',
  heroDescription:
    'Build the English speaking skills you need for real-life conversations, work, interviews and everyday communication. Learn practical spoken English through structured lessons, real-life examples and regular practice — all from your phone.',
  courseDuration: '[ADD DURATION]',
  numberOfLessons: '[ADD NUMBER]',
  level: 'Beginner to Intermediate',
  format: '100% Online Mobile Learning',
  accessPlatform: 'Class Plus App',
  language: 'English + Gujarati / Hindi Support',
  accessPeriod: '[ADD ACTUAL DETAILS]',
  originalPrice: '₹[ORIGINAL PRICE]',
  actualPrice: '₹[ACTUAL PRICE]',
  offerExpiryDate: '[DATE]',
  contactNumber: '[CONTACT NUMBER]',
  whatsappNumber: '[WHATSAPP NUMBER]',
  email: '[EMAIL]',
  appLink: '#pricing', // Defaults to anchor, replace with actual Class Plus deep link
  playStoreLink: 'https://play.google.com/store/apps/details?id=co.classplus', // Replace with specific Class Plus institute app link if available
  appStoreLink: 'https://apps.apple.com/in/app/classplus/id1527632612', // Replace with specific Class Plus iOS app link if available
};

export const TRUST_INDICATORS = [
  'Learn at your own pace',
  'Mobile-friendly learning',
  'Practical English',
  'Beginner-friendly',
];

export const PROBLEM_CARDS = [
  {
    id: 'problem-1',
    title: 'I Understand English But Can’t Speak',
    description: 'You understand what others say, but finding the right words to reply feels difficult and frustrating.',
    iconName: 'Ear',
  },
  {
    id: 'problem-2',
    title: 'I Translate Everything in My Head',
    description: 'You first think in Gujarati or Hindi, construct the sentence mentally, and then struggle to speak naturally in real time.',
    iconName: 'Languages',
  },
  {
    id: 'problem-3',
    title: 'I Feel Nervous Speaking English',
    description: 'You worry about making grammar mistakes or being judged, so you stay quiet instead of speaking up.',
    iconName: 'AlertCircle',
  },
  {
    id: 'problem-4',
    title: 'I Don’t Know What to Say',
    description: 'You may know grammar rules from textbooks, but you struggle to start or carry natural everyday conversations.',
    iconName: 'MessageSquareOff',
  },
];

export const SOLUTION_PILLARS = [
  {
    step: '01',
    title: 'Speak',
    subtitle: 'Everyday Sentences',
    description: 'Practice useful sentences and everyday conversations from day one so speaking becomes a natural habit.',
    iconName: 'Mic',
  },
  {
    step: '02',
    title: 'Understand',
    subtitle: 'Vocabulary & Context',
    description: 'Build practical vocabulary and effortlessly understand common English idioms, collocations, and expressions.',
    iconName: 'Lightbulb',
  },
  {
    step: '03',
    title: 'Apply',
    subtitle: 'Real-Life Situations',
    description: 'Use English in realistic contexts: workplace meetings, job interviews, customer calls, and casual meetups.',
    iconName: 'Target',
  },
  {
    step: '04',
    title: 'Improve',
    subtitle: 'Consistent Growth',
    description: 'Follow bite-sized structured lessons and practice consistently right from your phone at your own convenient pace.',
    iconName: 'TrendingUp',
  },
];

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'mod-1',
    number: 'Module 01',
    title: 'English Basics',
    tagline: 'Laying the solid speaking foundation',
    topics: [
      'Natural sentence formation without overthinking',
      'High-frequency basic vocabulary for daily life',
      'Common expressions for quick verbal responses',
      'Eliminating initial hesitations and speech blocks',
    ],
  },
  {
    id: 'mod-2',
    number: 'Module 02',
    title: 'Daily Conversation',
    tagline: 'Fluency in everyday social interactions',
    topics: [
      'Polite greetings and memorable self-introductions',
      'Asking questions confidently in multiple contexts',
      'Everyday conversations (shopping, ordering food, travel)',
      'Small talk skills with colleagues and strangers',
    ],
  },
  {
    id: 'mod-3',
    number: 'Module 03',
    title: 'Grammar for Speaking',
    tagline: 'Practical spoken grammar without textbook boredom',
    topics: [
      'Mastering past, present, and future tenses naturally',
      'Helping verbs (is, am, are, was, were, have, has, had)',
      'Modal verbs for requests and suggestions (can, could, should, would)',
      'Correcting the most common spoken grammar blunders',
    ],
  },
  {
    id: 'mod-4',
    number: 'Module 04',
    title: 'Vocabulary Building',
    tagline: 'Expressing your exact thoughts clearly',
    topics: [
      'Everyday active vocabulary vs passive memorization',
      'Phrasal verbs and collocations native speakers use',
      'Describing feelings, opinions, and work updates',
      'Word replacement shortcuts for smarter communication',
    ],
  },
  {
    id: 'mod-5',
    number: 'Module 05',
    title: 'Speaking Practice',
    tagline: 'Putting words into active verbal practice',
    topics: [
      'Guided conversation drills and roleplays',
      'Prompt question-answer response practice',
      'Situational English (workplace, calls, interviews, emergencies)',
      'Techniques to stop translating from mother tongue',
    ],
  },
  {
    id: 'mod-6',
    number: 'Module 06',
    title: 'Confidence Building',
    tagline: 'Speaking fearlessly in front of anyone',
    topics: [
      'Overcoming fear of judgment and public speaking blocks',
      'Speech pacing, pronunciation clarity, and pause management',
      'Handling moments when you forget a word smoothly',
      'Lifelong speaking fluency habits and self-correction',
    ],
  },
];

export const WHY_US_FEATURES = [
  {
    title: 'Practical English',
    description: 'Learn conversational English that you can actually use in daily work, travel, and personal conversations.',
    iconName: 'CheckCircle2',
  },
  {
    title: 'Learn From Your Phone',
    description: 'Enjoy seamless access to all your audio, video, and practice materials inside the modern Class Plus app.',
    iconName: 'Smartphone',
  },
  {
    title: 'Learn at Your Own Pace',
    description: 'Replay lessons anytime. Study early morning, during commutes, or late at night without schedule stress.',
    iconName: 'Clock',
  },
  {
    title: 'Structured Learning',
    description: 'Follow an organized step-by-step roadmap instead of wasting hours watching disjointed YouTube tutorials.',
    iconName: 'Compass',
  },
  {
    title: 'Real-Life Situations',
    description: 'Tackle real-world scenarios: office meetings, social gatherings, customer inquiries, and interviews.',
    iconName: 'Users',
  },
  {
    title: 'Practice-Based Learning',
    description: 'Focus on active verbal production and usage exercises rather than memorizing dry theory formulas.',
    iconName: 'Headphones',
  },
];

export const AUDIENCE_PERSONAS = [
  {
    title: 'Students',
    tagline: 'Academic & Campus Confidence',
    description: 'Present seminar projects, ace college viva exams, and talk confidently with professors and peers.',
    iconName: 'GraduationCap',
  },
  {
    title: 'Job Seekers',
    tagline: 'Interview Mastery',
    description: 'Answer HR interview questions fluently, introduce yourself convincingly, and land competitive roles.',
    iconName: 'Briefcase',
  },
  {
    title: 'Working Professionals',
    tagline: 'Workplace Advancement',
    description: 'Communicate comfortably in client meetings, email follow-ups, team scrums, and project presentations.',
    iconName: 'Laptop',
  },
  {
    title: 'Homemakers',
    tagline: 'Social & Daily Empowerment',
    description: 'Help your children with homework, speak during parent-teacher meetings, and converse freely when traveling.',
    iconName: 'HeartHandshake',
  },
  {
    title: 'Beginners',
    tagline: 'Zero to Conversational',
    description: 'Start learning English right from the true fundamentals in a friendly, non-judgmental environment.',
    iconName: 'Sparkles',
  },
  {
    title: 'Anyone Who Wants Confidence',
    tagline: 'Overcome Hesitation',
    description: 'Break free from shyness and express your ideas fluently without fearing grammatical mistakes.',
    iconName: 'Smile',
  },
];

export const BEFORE_AFTER = {
  before: [
    'Hesitates and stops mid-sentence while speaking',
    'Struggles to form correct sentences on the spot',
    'Translates from Gujarati/Hindi word-by-word',
    'Feels restricted by a limited daily vocabulary',
    'Constantly afraid of being judged or making mistakes',
  ],
  after: [
    'Forms sentences naturally and speaks more fluidly',
    'Understands everyday spoken English with ease',
    'Uses practical vocabulary and modern idioms',
    'Speaks with greater confidence in meetings and social settings',
    'Communicates comfortably without dreading mistakes',
  ],
  disclaimer:
    'With consistent practice and active participation, you can work toward speaking English with lasting confidence and clarity.',
};

export const HOW_IT_WORKS_STEPS = [
  {
    stepNumber: '01',
    title: 'Download Class Plus',
    description: 'Get the Class Plus app on your Android or iOS smartphone in just a few seconds.',
    badge: 'Quick Setup',
  },
  {
    stepNumber: '02',
    title: 'Choose the Course',
    description: 'Find our Online Spoken English Course, review the details, and complete your secure enrollment.',
    badge: 'Instant Confirmation',
  },
  {
    stepNumber: '03',
    title: 'Start Learning',
    description: 'Instantly unlock your lesson videos, audio practice drills, and study notes directly from your pocket.',
    badge: 'Anytime Access',
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    name: '[Student Name / Verified Learner]',
    role: 'Working Professional',
    location: 'Surat',
    rating: 5,
    text: 'I used to freeze whenever a client spoke to me in English. This course broke down daily conversations into simple formulas. Now I handle client calls without hesitation!',
  },
  {
    id: 'test-2',
    name: '[Student Name / Verified Learner]',
    role: 'Job Seeker',
    location: 'Ahmedabad',
    rating: 5,
    text: 'Thinking in Gujarati and translating in my head was my biggest barrier. The practical exercises in Module 5 completely changed my speaking confidence for job interviews.',
  },
  {
    id: 'test-3',
    name: '[Student Name / Verified Learner]',
    role: 'College Student',
    location: 'Gujarat',
    rating: 5,
    text: 'Unlike boring textbook classes, this course teaches practical conversational English. The Class Plus app allows me to practice while traveling on the college bus.',
  },
  {
    id: 'test-4',
    name: '[Student Name / Verified Learner]',
    role: 'Homemaker',
    location: 'Surat',
    rating: 5,
    text: 'Attending parent-teacher meetings used to make me very nervous. After completing the daily conversation lessons, I can talk to teachers smoothly.',
  },
];

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Who is this course for?',
    answer:
      'This course is specially designed for students, job seekers, working professionals, homemakers, and anyone who understands basic English but struggles to speak fluently and confidently in real-life conversations.',
  },
  {
    id: 'faq-2',
    question: 'Do I need prior English knowledge?',
    answer:
      'No advanced English background is required. If you understand basic sentences, this course will guide you step by step to formulate thoughts and speak naturally.',
  },
  {
    id: 'faq-3',
    question: 'Is this course suitable for beginners?',
    answer:
      'Yes! Module 01 starts from fundamental sentence structures and essential vocabulary, making it completely beginner-friendly.',
  },
  {
    id: 'faq-4',
    question: 'How do I access the course?',
    answer:
      'Once enrolled, you will receive instant access inside the Class Plus mobile app on your smartphone, as well as on any web browser.',
  },
  {
    id: 'faq-5',
    question: 'Do I need the Class Plus app?',
    answer:
      'Yes, the course lessons, assignments, and practice resources are hosted on the Class Plus platform for smooth streaming and offline downloading on mobile.',
  },
  {
    id: 'faq-6',
    question: 'Can I learn using my mobile phone?',
    answer:
      'Absolutely! The entire course is optimized for mobile-first learning so you can watch lessons, listen to audio drills, and review notes from anywhere.',
  },
  {
    id: 'faq-7',
    question: 'How long will I have access to the course?',
    answer:
      'You will have access as specified in the course package ([ADD ACTUAL DETAILS]). You can learn at your own pace and revisit lessons whenever you need a refresher.',
  },
  {
    id: 'faq-8',
    question: 'Is there a certificate provided?',
    answer:
      '[Certificate details: ADD ACTUAL DETAILS]. A course completion certificate is typically issued upon finishing the modules and practice checkpoints.',
  },
  {
    id: 'faq-9',
    question: 'What topics are covered in the curriculum?',
    answer:
      'The course covers 6 comprehensive modules: English Basics, Daily Conversation, Grammar for Speaking, Vocabulary Building, Active Speaking Practice, and Confidence Building.',
  },
  {
    id: 'faq-10',
    question: 'How do I purchase the course?',
    answer:
      'Click the "Start Learning" or "Buy The Course" button on this page. You will be directed to the Class Plus checkout where you can enter your mobile number and complete the secure payment.',
  },
  {
    id: 'faq-11',
    question: 'What payment methods are available?',
    answer:
      'All standard Indian payment options are supported including UPI (Google Pay, PhonePe, Paytm), Net Banking, Debit Cards, and Credit Cards.',
  },
  {
    id: 'faq-12',
    question: 'What happens immediately after I purchase?',
    answer:
      'Your course batch is automatically unlocked in your Class Plus account. You can log in with your registered mobile number and start learning immediately.',
  },
];
