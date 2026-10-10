export interface BranchDetail {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  area: string;
  address: string;
  fullAddress: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  altPhone?: string;
  email: string;
  whatsapp: string;
  workingHours: string;
  landmark: string;
  googleMapsEmbed: string;
  googleMapsDirectionsUrl: string;
  googleReviewUrl: string;
  rating: number;
  reviewCount: number;
  coursesOffered: string[];
  features: string[];
  localKeywords: string[];
  nearbyLandmarks: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const SURAT_BRANCHES: BranchDetail[] = [
  {
    slug: 'sarthana',
    name: 'TESCA Spoken English & Visa Consultancy — Sarthana (Head Office)',
    shortName: 'Sarthana Branch',
    tagline: 'Head Office & Premier Language Learning Campus in Sarthana, Surat',
    area: 'Sarthana Jakatnaka',
    address: '110, 111, 112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka',
    fullAddress: '110, 111, 112 Royal Arcade, Opp. Deep Kamal Mall, Sarthana Jakatnaka, Surat, Gujarat 395006',
    postalCode: '395006',
    latitude: 21.21728,
    longitude: 72.88586,
    phone: '+91 84888 05888',
    altPhone: '+91 99250 60609',
    email: 'tescavisaconsultancy87@gmail.com',
    whatsapp: '918488805888',
    workingHours: 'Mon – Sat: 7:00 AM – 8:00 PM | Sun: Special Batch Sessions',
    landmark: 'Opposite Deep Kamal Mall, Royal Arcade',
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29754.938162078433!2d72.8858624!3d21.21728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f8647b359b3%3A0x11f64af5f5637cfe!2sTESCA%20VISA%20CONSULTANCY!5e0!3m2!1sen!2sin!4v1783070611318!5m2!1sen!2sin',
    googleMapsDirectionsUrl: 'https://maps.google.com/?q=21.21728,72.88586',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJs1mzR4ZP4DsR_nxj9fVK9hE',
    rating: 4.9,
    reviewCount: 310,
    coursesOffered: [
      'Spoken English Basic (Beginner to Conversational)',
      'Spoken English Advanced (Corporate & Public Speaking)',
      'IELTS Preparation (Academic & General 7.5+ Bands)',
      'PTE Academic Coaching (AI Scored Mock Tests)',
      'Study Abroad & Student Visa Consultancy (Canada, UK, USA, Australia)',
      'Interview Preparation & Personality Development',
    ],
    features: [
      'Spacious AC Classrooms with Smart Interactive Displays',
      'Cambridge-Certified Trainers with 15+ Years Experience',
      'Dedicated Speaking Lab for Daily Mock Conversations',
      'Exclusive Canada & UK Visa Counseling Center',
      'Flexible Morning, Afternoon & Late Evening Batches',
      'Free 45-Minute Live Interactive Demo Class',
    ],
    localKeywords: [
      'spoken english classes in sarthana surat',
      'best ielts coaching sarthana jakatnaka',
      'study abroad consultant sarthana surat',
      'pte classes near deep kamal mall surat',
      'english speaking course sarthana',
    ],
    nearbyLandmarks: ['Deep Kamal Mall', 'Royal Arcade', 'Sarthana Nature Park / Zoo', 'Kamrej Highway Junction'],
    faqs: [
      {
        question: 'Where is the TESCA Sarthana branch located?',
        answer:
          'Our Head Office is at 110-112 Royal Arcade, directly opposite Deep Kamal Mall at Sarthana Jakatnaka, Surat. It is easily accessible from Varachha, Kamrej, and Simada.',
      },
      {
        question: 'Are demo classes available at Sarthana?',
        answer:
          'Yes! We offer a 100% Free 45-minute Live Demo Class at our Sarthana campus. You can experience our teaching methodology before enrolling.',
      },
      {
        question: 'Does the Sarthana branch provide student visa consultancy?',
        answer:
          'Yes, Sarthana is our primary visa consultation center offering end-to-end guidance for student visas to Canada, the UK, Australia, the USA, and European nations.',
      },
    ],
  },
  {
    slug: 'mota-varachha',
    name: 'TESCA Spoken English & Visa Consultancy — Mota Varachha',
    shortName: 'Mota Varachha Branch',
    tagline: 'Premier Spoken English & IELTS Center at Lajamani Chowk, Mota Varachha',
    area: 'Mota Varachha',
    address: '106-107, Ambika Pinnacle, Lajamani Chowk, Mota Varachha',
    fullAddress: '106-107, Ambika Pinnacle, Lajamani Chowk, Mota Varachha, Surat, Gujarat 395006',
    postalCode: '395006',
    latitude: 21.238247,
    longitude: 72.885543,
    phone: '+91 84888 05888',
    altPhone: '+91 99250 60609',
    email: 'tescavisaconsultancy87@gmail.com',
    whatsapp: '918488805888',
    workingHours: 'Mon – Sat: 7:00 AM – 8:00 PM',
    landmark: 'Above Ambika Pinnacle, Lajamani Chowk',
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.8386097921198!2d72.88554337597363!3d21.238247480549106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04fffa7abe0fb%3A0xd7c140b507f0e691!2sTESCA%20SPOKEN%20ENGLISH%20AND%20VISA%20COUNSULTANCY!5e0!3m2!1sen!2sin!4v1783070684461!5m2!1sen!2sin',
    googleMapsDirectionsUrl: 'https://maps.google.com/?q=21.238247,72.885543',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ--Crp_9P4DsRkebwB7VAwdc',
    rating: 4.9,
    reviewCount: 220,
    coursesOffered: [
      'Spoken English Basic & Advanced',
      'IELTS Coaching (Academic & General)',
      'PTE Academic Preparation',
      'Foreign Education & Student Visa Assistance',
      'Personality Development & Public Speaking',
    ],
    features: [
      'Modern Classroom Infrastructure in Ambika Pinnacle',
      'Special Speaking Focus for Gujarati-Medium Students',
      'Comprehensive Study Material and Vocabulary Workbooks',
      'Small Batch Sizes (8–12 Students) for Personal Attention',
      'Expert Mock Interviews and One-on-One Feedback',
    ],
    localKeywords: [
      'spoken english classes in mota varachha',
      'ielts coaching lajamani chowk surat',
      'pte classes in mota varachha',
      'english speaking class mota varachha',
      'visa consultant mota varachha surat',
    ],
    nearbyLandmarks: ['Lajamani Chowk', 'Ambika Pinnacle', 'Mota Varachha Lake Garden', 'Sudama Chowk'],
    faqs: [
      {
        question: 'Where is TESCA located in Mota Varachha?',
        answer:
          'We are located at 106-107 Ambika Pinnacle, Lajamani Chowk, Mota Varachha, Surat. Landmark: Lajamani Chowk crossroads.',
      },
      {
        question: 'Are there separate batches for working professionals in Mota Varachha?',
        answer:
          'Yes, we provide early morning (7:00 AM – 8:30 AM) and evening batches (6:30 PM – 8:00 PM) tailored specifically for job seekers, business professionals, and college students.',
      },
    ],
  },
  {
    slug: 'hirabaug',
    name: 'TESCA Spoken English & Visa Consultancy — Hirabaug (Varachha)',
    shortName: 'Hirabaug Branch',
    tagline: 'Leading Spoken English Institute at Hirabaug, Varachha, Surat',
    area: 'Hirabaug (Varachha)',
    address: '39, Ambika Vijay Soc., 2nd Floor, Near Surat Super Store, Hirabaug',
    fullAddress: '39, Ambika Vijay Soc., 2nd Floor, Near Surat Super Store, Hirabaug, Varachha, Surat, Gujarat 395006',
    postalCode: '395006',
    latitude: 21.2148449,
    longitude: 72.8581873,
    phone: '+91 84888 05888',
    altPhone: '+91 99250 60609',
    email: 'tescavisaconsultancy87@gmail.com',
    whatsapp: '918488805888',
    workingHours: 'Mon – Sat: 7:00 AM – 8:00 PM',
    landmark: 'Near Surat Super Store, Ambika Vijay Society, Hirabaug',
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1859.7143171918644!2d72.85818739660405!3d21.214844924916058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f003b425e37%3A0xbe2c90ec8201665e!2sTESCA%20ENGLISH%20SPOKEN!5e0!3m2!1sen!2sin!4v1783072796797!5m2!1sen!2sin',
    googleMapsDirectionsUrl: 'https://maps.google.com/?q=21.2148449,72.8581873',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN15COwBPoDsRXmYBguyQLb4',
    rating: 4.8,
    reviewCount: 185,
    coursesOffered: [
      'Basic to Advanced Spoken English',
      'IELTS Academic & General Coaching',
      'PTE Academic Fast-Track Preparation',
      'Grammar & Sentence Construction Mastery',
      'Study Abroad Consultation',
    ],
    features: [
      'Central Varachha Location with Convenient Transit Access',
      'Intensive Daily Speaking Sessions and Presentation Drills',
      'Experienced English Tutors with Bilingual Support (Gujarati/Hindi)',
      'Free Diagnostic Skill Assessment on Day One',
    ],
    localKeywords: [
      'spoken english classes in hirabaug surat',
      'ielts classes varachha surat',
      'best english institute near surat super store',
      'spoken english varachha',
      'visa consultancy hirabaug surat',
    ],
    nearbyLandmarks: ['Surat Super Store', 'Hirabaug Circle', 'Varachha Main Road', 'Mini Bazar'],
    faqs: [
      {
        question: 'How do I reach the Hirabaug branch?',
        answer:
          'We are located on the 2nd Floor of 39 Ambika Vijay Society, right near Surat Super Store, Hirabaug, Varachha. Very easy walking distance from Hirabaug Circle.',
      },
    ],
  },
  {
    slug: 'yogichowk',
    name: 'TESCA Spoken English & Visa Consultancy — Yogichowk',
    shortName: 'Yogichowk Branch',
    tagline: 'High-Rated Spoken English & Study Abroad Academy at Yogichowk, Surat',
    area: 'Yogichowk',
    address: '2nd Floor, Bhavna Park Soc., Opp. Paladium Mall, Above Prasang Fashion, Yogichowk',
    fullAddress: '2nd Floor, Bhavna Park Soc., Opp. Paladium Mall, Above Prasang Fashion, Yogichowk, Surat, Gujarat 395006',
    postalCode: '395006',
    latitude: 21.2135179,
    longitude: 72.8815115,
    phone: '+91 84888 05888',
    altPhone: '+91 99250 60609',
    email: 'tescavisaconsultancy87@gmail.com',
    whatsapp: '918488805888',
    workingHours: 'Mon – Sat: 7:00 AM – 8:00 PM',
    landmark: 'Opposite Paladium Mall, Above Prasang Fashion',
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.4620727097463!2d72.88151159678955!3d21.21351790000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f00099b1a45%3A0x790d12f6f9c10d20!2sTESCA%20SPOKEN%20ENGLISH%20%26%20COMPUTER%20EDUCATION!5e0!3m2!1sen!2sin!4v1783070752116!5m2!1sen!2sin',
    googleMapsDirectionsUrl: 'https://maps.google.com/?q=21.2135179,72.8815115',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJRRqbCQBPoDsRII3B-fYpDXk',
    rating: 4.9,
    reviewCount: 205,
    coursesOffered: [
      'Comprehensive Spoken English',
      'IELTS Band 7.5+ Mentorship',
      'PTE Academic Scoring Tactics',
      'Student Visa Guidance & Profile Assessment',
      'Daily Group Discussions and Fluency Drills',
    ],
    features: [
      'Prime Location Opposite Paladium Mall in Yogichowk',
      'Interactive Learning Environment with Modern Audio Tools',
      'Friendly Mentors Focused on Overcoming Shyness and Hesitation',
      'Individual Doubt Resolution and Grammar Drills',
    ],
    localKeywords: [
      'spoken english classes yogichowk surat',
      'ielts coaching near paladium mall',
      'spoken english classes near yogichowk',
      'english classes in varachha yogichowk',
      'visa consultancy yogichowk',
    ],
    nearbyLandmarks: ['Paladium Mall', 'Prasang Fashion', 'Bhavna Park Society', 'Yogi Chowk BRTS Stop'],
    faqs: [
      {
        question: 'Where is the Yogichowk branch situated?',
        answer:
          'Located on the 2nd Floor of Bhavna Park Society, opposite Paladium Mall and directly above Prasang Fashion at Yogichowk, Surat.',
      },
      {
        question: 'Can I attend a free trial class at Yogichowk?',
        answer:
          'Yes, book online or via WhatsApp (+91 84888 05888) to reserve your seat for the free live demonstration class.',
      },
    ],
  },
];

export function getBranchBySlug(slug: string): BranchDetail | undefined {
  return SURAT_BRANCHES.find((b) => b.slug === slug);
}
