export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Courses', href: '/courses' },
  { label: 'Study Abroad', href: 'https://tescavisa.com', external: true },
  { label: 'Blog', href: '/blog' },
  { label: 'Assessment', href: '/assessment' },
  { label: 'Contact', href: '/contact' },
];

export const WHATSAPP_URL = 'https://wa.me/919824152731?text=Hi%20TESCA,%20I%20would%20like%20to%20book%20a%20free%20demo%20class.';

export const TRUST_STATS = [
  { value: 2005, label: 'Years of Trust', suffix: '', isYear: true, prefix: 'Since ' },
  { value: 5000, label: 'Students Trained', suffix: '+' },
  { value: 95, label: 'Satisfaction Rate', suffix: '%' },
  { value: 20, label: 'Expert Trainers', suffix: '+' },
  { value: 2, label: 'Learning Modes', suffix: '' },
];

export const WHY_TESCA = [
  {
    icon: 'GraduationCap',
    title: 'Expert Trainers',
    description: 'Learn from Cambridge-certified trainers with 15+ years of experience in spoken English and international exam preparation.',
  },
  {
    icon: 'RadiatingCircle',
    title: 'Live Interactive Classes',
    description: 'Real-time speaking practice with instant feedback. No passive lectures — every session is a two-way conversation.',
  },
  {
    icon: 'CalendarClock',
    title: 'Flexible Learning',
    description: 'Choose morning, evening, or weekend batches. Learn from home or in-person at our campuses — your schedule, your rules.',
  },
  {
    icon: 'Globe',
    title: 'IELTS & PTE Preparation',
    description: 'Targeted preparation with mock tests, scoring rubrics, and proven strategies that have delivered hundreds of 7.5+ bands.',
  },
  {
    icon: 'Briefcase',
    title: 'Career-Focused Learning',
    description: 'Resume building, interview mockups, and corporate communication training integrated into every program.',
  },
  {
    icon: 'Infinity',
    title: 'Lifetime Support',
    description: 'Once a TESCA student, always a TESCA student. Access alumni communities, refresher sessions, and resources for life.',
  },
];

export const COURSES = [
  {
    title: 'Spoken English Basic',
    duration: '3 Months',
    accent: 'primary',
    benefits: ['Grammar foundations', 'Vocabulary building', 'Basic conversation', 'Pronunciation basics'],
    price: '₹7,999',
    originalPrice: '₹11,999',
    whoShouldJoin: 'Complete beginners, homemakers, students, and anyone who struggles to form basic English sentences.',
    curriculum: [
      { module: 'Foundation', topics: ['Alphabets & Phonics', 'Self-introduction', 'Basic greetings & phrases', 'Simple present tense'] },
      { module: 'Grammar Core', topics: ['Tenses (Past, Present, Future)', 'Question formation', 'Articles & Prepositions', 'Subject-verb agreement'] },
      { module: 'Vocabulary', topics: ['Daily-use words (500+)', 'Synonyms & Antonyms', 'Common idioms', 'Contextual usage'] },
      { module: 'Speaking Practice', topics: ['Guided conversations', 'Describing people & places', 'Storytelling exercises', 'Role-play scenarios'] },
    ],
    teachingMethod: 'Live interactive group classes (8–12 students) with daily speaking practice, weekly assignments, and recorded session access.',
  },
  {
    title: 'Spoken English Advanced',
    duration: '4 Months',
    accent: 'secondary',
    benefits: ['Advanced fluency', 'Public speaking', 'Business communication', 'Neutral accent'],
    price: '₹12,999',
    originalPrice: '₹17,999',
    popular: true,
    whoShouldJoin: 'Working professionals, managers, entrepreneurs, and anyone who can speak basic English but wants fluency and confidence.',
    curriculum: [
      { module: 'Fluency Building', topics: ['Advanced sentence structures', 'Filler-free speaking', 'Speed & rhythm training', 'Debate & discussion'] },
      { module: 'Business English', topics: ['Email writing', 'Meeting communication', 'Presentation skills', 'Corporate vocabulary'] },
      { module: 'Public Speaking', topics: ['Speech delivery techniques', 'Body language mastery', 'Audience engagement', 'Impromptu speaking'] },
      { module: 'Accent & Pronunciation', topics: ['Neutral accent training', 'Intonation patterns', 'Stress & linking words', 'Native-like pronunciation'] },
    ],
    teachingMethod: 'Intensive live sessions (5 per week) with real-world scenarios, group debates, presentations, and one-on-one feedback.',
  },
  {
    title: 'IELTS Preparation',
    duration: '6 Weeks',
    accent: 'primary',
    benefits: ['All 4 modules', '15+ mock tests', 'Band 7.5+ strategies', 'Writing evaluation'],
    price: '₹9,999',
    originalPrice: '₹14,999',
    whoShouldJoin: 'Students planning to study abroad, professionals seeking PR, and anyone targeting IELTS Academic or General Training.',
    curriculum: [
      { module: 'Listening', topics: ['Section-wise strategies', 'Note completion', 'Multiple choice', 'Map labelling & matching'] },
      { module: 'Reading', topics: ['Skimming & scanning', 'True/False/Not Given', 'Heading matching', 'Paragraph completion'] },
      { module: 'Writing', topics: ['Task 1 (Graph/Letter)', 'Task 2 Essay structures', 'Coherence & cohesion', 'Band 7+ vocabulary'] },
      { module: 'Speaking', topics: ['Part 1, 2, 3 strategies', 'Cue card practice', 'Fluency techniques', 'Pronunciation scoring'] },
    ],
    teachingMethod: 'Daily intensive sessions covering all 4 modules with weekly full mock tests, individual writing evaluations, and 1-on-1 speaking practice.',
  },
  {
    title: 'PTE Preparation',
    duration: '5 Weeks',
    accent: 'secondary',
    benefits: ['AI-scored mock tests', 'Speaking templates', 'Writing framework', '65+ score guarantee'],
    price: '₹8,999',
    originalPrice: '₹12,999',
    whoShouldJoin: 'Students and professionals targeting PTE Academic for Australian, UK, or New Zealand visa/university applications.',
    curriculum: [
      { module: 'Speaking & Writing', topics: ['Read aloud templates', 'Repeat sentence drills', 'Describe image framework', 'Summarize written text'] },
      { module: 'Reading', topics: ['Re-order paragraphs', 'Fill in the blanks', 'Multiple choice strategies', 'Speed reading'] },
      { module: 'Listening', topics: ['Summarize spoken text', 'Fill in the blanks', 'Highlight correct summary', 'Write from dictation'] },
      { module: 'Mock Tests & Review', topics: ['Full AI-scored mocks', 'Score analysis sessions', 'Weak area targeting', 'Exam-day strategy'] },
    ],
    teachingMethod: 'Template-driven training with AI-scored mock exams every week, computer-based practice, and targeted weak-area coaching.',
  },
  {
    title: 'Interview Preparation',
    duration: '4 Weeks',
    accent: 'accent',
    benefits: ['Mock interviews', 'HR question mastery', 'Resume review', 'Confidence coaching'],
    price: '₹5,999',
    originalPrice: '₹8,999',
    whoShouldJoin: 'Job seekers, freshers, career changers, and professionals preparing for MNC interviews or visa interviews.',
    curriculum: [
      { module: 'Self-Presentation', topics: ['Tell me about yourself', 'Strengths & weaknesses', 'Career goals articulation', 'Elevator pitch'] },
      { module: 'HR Questions', topics: ['Behavioral questions (STAR)', 'Situational questions', 'Salary negotiation', 'Why this company/role?'] },
      { module: 'Communication', topics: ['Body language & posture', 'Eye contact & gestures', 'Voice modulation', 'Handling nervousness'] },
      { module: 'Mock Rounds', topics: ['Full mock interviews', 'Panel interview simulation', 'Video interview practice', 'Personalized feedback'] },
    ],
    teachingMethod: 'Intensive 1-on-1 and group mock interview sessions with video recording, playback analysis, and HR expert feedback.',
  },
];

export const JOURNEY_STEPS = [
  {
    step: 1,
    title: 'Free Consultation',
    description: 'Talk to a counsellor who understands your goals — study abroad, career growth, or personal confidence.',
  },
  {
    step: 2,
    title: 'Skill Assessment',
    description: 'Take a diagnostic test that pinpoints your current level across speaking, listening, reading, and writing.',
  },
  {
    step: 3,
    title: 'Course Enrollment',
    description: 'Get matched with the perfect course and batch. Choose online, offline, or hybrid learning.',
  },
  {
    step: 4,
    title: 'Live Learning',
    description: 'Attend interactive live classes with expert trainers. Practice speaking in every single session.',
  },
  {
    step: 5,
    title: 'Practice Sessions',
    description: 'Join peer practice groups, mock interviews, and real-world conversation scenarios.',
  },
  {
    step: 6,
    title: 'Fluent Communication',
    description: 'Walk away speaking English with confidence — ready for interviews, exams, and life abroad.',
  },
];

export const SUCCESS_METRICS = [
  { value: 25, label: 'Countries Reached', suffix: '+' },
  { value: 12000, label: 'Mock Tests Conducted', suffix: '+' },
  { value: 1200, label: 'IELTS 7+ Scores', suffix: '+' },
  { value: 15, label: 'Years of Teaching', suffix: '+' },
];

export const TRANSFORMATIONS = [
  {
    name: 'Priya Sharma',
    course: 'Spoken English Advanced',
    before: 'Struggled forming sentences in meetings; avoided speaking in group settings.',
    after: 'Leads client presentations confidently; promoted to Team Lead within 6 months.',
    band: 'From shy to spotlight',
  },
  {
    name: 'Rahul Verma',
    course: 'IELTS Preparation',
    before: 'Scored Band 5.5 in first attempt; discouraged about studying abroad.',
    after: 'Achieved Band 8.0; admitted to University of Toronto for Masters.',
    band: 'Band 5.5 → 8.0',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Ananya Gupta',
    course: 'IELTS Preparation',
    rating: 5,
    review:
      'TESCA transformed my approach to English. I went from Band 5.5 to Band 8.0 in just 8 weeks. The trainers genuinely care about your progress and the mock tests are incredibly realistic. I am now studying at the University of Melbourne.',
    photo: 'https://images.pexels.com/photos/5905902/pexels-photo-5905902.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    location: 'Surat, India',
  },
  {
    name: 'Karthik Reddy',
    course: 'Spoken English Advanced',
    rating: 5,
    review:
      'I was terrified of speaking in meetings. After 4 months at TESCA, I gave a presentation to 200 people without breaking a sweat. The interactive classes forced me to practice every single day. Worth every rupee.',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    location: 'Surat, India',
  },
  {
    name: 'Sneha Patel',
    course: 'PTE Preparation',
    rating: 5,
    review:
      'Scored 88 in PTE after just 5 weeks of training. The AI-scored mock tests and speaking templates were game-changers. TESCA does not just teach English — they teach you how to crack the exam strategically.',
    photo: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    location: 'Surat, India',
  },
  {
    name: 'Mohammed Ali',
    course: 'Interview Preparation',
    rating: 5,
    review:
      'I failed 7 interviews before joining TESCA. After their interview prep program, I cleared 3 back-to-back rounds and landed a job at a Fortune 500 company. The mock interviews felt real and the feedback was brutally honest.',
    photo: 'https://images.pexels.com/photos/2531551/pexels-photo-2531551.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    location: 'Dubai, UAE',
  },
  {
    name: 'Divya Menon',
    course: 'Spoken English Basic',
    rating: 5,
    review:
      'I joined as a complete beginner who could barely introduce myself. TESCA built my foundation brick by brick with patience and encouragement. Six months later, I can hold full conversations in English. Life-changing.',
    photo: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    location: 'Surat, India',
  },
  {
    name: 'Vikram Singh',
    course: 'IELTS Preparation',
    rating: 5,
    review:
      'The writing evaluation was the most valuable part. My trainer went line-by-line through every essay and showed me exactly where I was losing marks. Band 7.5 achieved. Highly recommend TESCA to anyone serious about IELTS.',
    photo: 'https://images.pexels.com/photos/2014427/pexels-photo-2014427.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    location: 'Surat, India',
  },
];

export const TRAINERS = [
  {
    name: 'Dr. Anjali Desai',
    role: 'Lead IELTS Trainer',
    experience: '18 years',
    certification: 'CELTA, TESOL',
    specialization: 'IELTS Speaking & Writing',
    photo: 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    students: '2,400+',
  },
  {
    name: 'James Whitfield',
    role: 'Native English Expert',
    experience: '12 years',
    certification: 'DELTA, MA Linguistics',
    specialization: 'Accent Neutralization',
    photo: 'https://images.pexels.com/photos/5212702/pexels-photo-5212702.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    students: '1,800+',
  },
  {
    name: 'Meera Krishnan',
    role: 'PTE & Communication Coach',
    experience: '10 years',
    certification: 'TEFL, PTE Certified',
    specialization: 'PTE Academic',
    photo: 'https://images.pexels.com/photos/5212295/pexels-photo-5212295.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    students: '1,500+',
  },
  {
    name: 'Rohan Mehta',
    role: 'Corporate Communication Trainer',
    experience: '14 years',
    certification: 'MBA, TESOL',
    specialization: 'Interview & Corporate English',
    photo: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
    students: '2,100+',
  },
];

export const FAQS = [
  {
    question: 'Do I need any prior English knowledge to join?',
    answer:
      'Not at all. We have courses for complete beginners to advanced learners. Our free skill assessment will identify your current level and place you in the perfect batch. Over 30% of our students started with basic or no English.',
  },
  {
    question: 'How are the classes conducted — online or offline?',
    answer:
      'Both. You can choose 100% online live classes, in-person sessions at our campuses, or a hybrid model. All modes offer the same quality of teaching, and you can switch between them anytime during your course.',
  },
  {
    question: 'What is the duration of each course?',
    answer:
      'Course durations vary: Spoken English Basic is 3 months, Advanced is 4 months, IELTS is 6 weeks, PTE is 5 weeks, and Interview Preparation is 4 weeks. Flexible batch timings are available including weekends.',
  },
  {
    question: 'Do you guarantee results for IELTS and PTE?',
    answer:
      'While no institute can legally guarantee a specific score, our students have a 95% success rate of achieving their target band. We provide unlimited mock tests, personalized feedback, and proven strategies. If you do not hit your target, you get free extended coaching.',
  },
  {
    question: 'Is the free demo class really free?',
    answer:
      'Yes, completely free with no obligations. The demo class is a full 45-minute session where you will learn a real topic, meet your trainer, and experience our teaching style. No credit card required — just book and attend.',
  },
  {
    question: 'What is the refund policy?',
    answer:
      'We enforce a strict no-refund policy. Once the course fee is paid, it is non-refundable, non-cancellable, and non-transferable. We highly recommend booking our free demo class to experience our teaching quality and format before making a payment.',
  },
];

export const COURSE_FAQS = [
  {
    question: 'What is the batch size for each course?',
    answer:
      'Our spoken English batches have 8–12 students for personalized attention. IELTS and PTE batches are capped at 10 students. Interview preparation can be 1-on-1 or in groups of up to 6.',
  },
  {
    question: 'Can I switch courses midway?',
    answer:
      'Yes. If your counsellor agrees that a different course better suits your level, we allow a one-time course switch within the first 2 weeks at no additional cost.',
  },
  {
    question: 'What happens if I miss a class?',
    answer:
      'All live sessions are recorded and uploaded to your student dashboard within 2 hours. You can watch them anytime. We also offer make-up sessions on weekends for students who miss more than 3 classes.',
  },
  {
    question: 'Do I get a certificate after completing the course?',
    answer:
      'Yes. Every student who completes 80% of the course receives a TESCA Certificate of Completion. IELTS and PTE students also receive a mock score report to share with universities or employers.',
  },
  {
    question: 'Are the trainers qualified?',
    answer:
      'Absolutely. Our trainers hold international certifications like CELTA, DELTA, TESOL, and TEFL. They have 10–18 years of teaching experience and have trained thousands of students across 25+ countries.',
  },
  {
    question: 'What study materials are provided?',
    answer:
      'Each course includes downloadable PDFs, vocabulary lists, grammar guides, practice worksheets, and recorded video lessons. IELTS and PTE students also get access to full-length mock tests with AI-scoring.',
  },
];

export const PRICING_FAQS = [
  {
    question: 'What is the difference between Starter, Professional, and Premium plans?',
    answer:
      'Starter covers the Spoken English Basic course (3 months). Professional includes the Advanced course with more sessions and mock tests. Premium is the all-access plan with every course, daily sessions, and 1-on-1 trainer coaching.',
  },
  {
    question: 'Can I pay in monthly installments (EMI)?',
    answer:
      'Yes. We offer a Monthly EMI option on all plans. You can choose to pay the full amount upfront and save 10%, or split it into monthly payments with zero additional interest.',
  },
  {
    question: 'Is there a free trial before I pay?',
    answer:
      'Yes. We offer a completely free 45-minute demo class with no obligation. Experience our teaching style, meet your trainer, and then decide. No credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept UPI, debit/credit cards, net banking, and wallet payments through our secure Razorpay gateway. All transactions are encrypted and PCI-DSS compliant.',
  },
  {
    question: 'What is the refund policy?',
    answer:
      'We enforce a strict no-refund policy. Once the course fee is paid, it is non-refundable, non-cancellable, and non-transferable. We highly recommend booking our free demo class before making a payment.',
  },
  {
    question: 'Are there any hidden fees or charges?',
    answer:
      'None at all. The price you see is the price you pay. All taxes, study materials, mock tests, and platform access fees are included. No surprises.',
  },
];
