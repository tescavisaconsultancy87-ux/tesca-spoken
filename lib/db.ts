import { supabase } from './supabaseClient';

// Helper to determine if a Supabase error is a 'relation does not exist' error (Postgres code 42P01)
const isTableMissingError = (error: any) => {
  return error && (error.code === '42P01' || error.message?.includes('relation') && error.message?.includes('does not exist'));
};

// ═══════════════════════════════════════════════════════════
// Mock Data Fallbacks (when tables aren't setup in Supabase console yet)
// ═══════════════════════════════════════════════════════════

const mockCourses = [
  { id: 'spoken-english-intermediate', title: 'Spoken English Mastery — Intermediate', trainer: 'Sarah Jenkins', category: 'Fluency & Pronunciation', price: 29.00, lessons_count: 18, students_count: 654 },
  { id: 'business-communication', title: 'Business Communication & Interview Prep', trainer: 'David Vance', category: 'Professional Skills', price: 49.00, lessons_count: 20, students_count: 382 },
  { id: 'vocabulary-accelerator', title: 'Vocabulary & Idioms Accelerator', trainer: 'Emma Watson', category: 'Vocabulary', price: 19.00, lessons_count: 12, students_count: 384 }
];

const mockLiveClasses = [
  { id: 'lc-1', topic: 'Vocabulary Blast: Idioms for Social Gatherings', trainer: 'Sarah Jenkins', date_time: 'Today, 4:00 PM (IST)', duration: '60 mins', status: 'live', join_url: 'https://meet.google.com/abc-defg-hij' },
  { id: 'lc-2', topic: 'Speaking Challenge: Group Discussion Practice', trainer: 'David Vance', date_time: 'Tomorrow, 11:30 AM (IST)', duration: '45 mins', status: 'upcoming', join_url: 'https://meet.google.com/abc-defg-hij' },
  { id: 'lc-3', topic: 'Grammar Essentials: Perfecting the Past Tense', trainer: 'Emma Watson', date_time: 'June 25, 2:00 PM (IST)', duration: '60 mins', status: 'upcoming' },
  { id: 'lc-4', topic: 'Pronunciation Lab: Hard & Soft Consonant Sounds', trainer: 'Sarah Jenkins', date_time: 'June 21, 4:00 PM (IST)', duration: '60 mins', status: 'completed', recording_url: '#' },
  { id: 'lc-5', topic: 'Introductory Speaking Session: Ice Breaking', trainer: 'Emma Watson', date_time: 'June 18, 10:00 AM (IST)', duration: '45 mins', status: 'completed', recording_url: '#' }
];

const mockMaterials = [
  { id: 'mat-1', name: '100 Common Idioms for Daily Conversation', category: 'vocabulary', format: 'PDF', size: '1.2 MB', download_url: '#', added_date: 'June 20, 2026' },
  { id: 'mat-2', name: 'Irregular Verbs Cheat Sheet & Quiz', category: 'grammar', format: 'PDF', size: '850 KB', download_url: '#', added_date: 'June 18, 2026' },
  { id: 'mat-3', name: 'Daily Pronunciation Practice Audio (Lesson 3)', category: 'speaking', format: 'MP3', size: '14.5 MB', download_url: '#', added_date: 'June 15, 2026' },
  { id: 'mat-4', name: 'Intermediate Conversation Starters Workbook', category: 'speaking', format: 'PDF', size: '3.4 MB', download_url: '#', added_date: 'June 10, 2026' },
  { id: 'mat-5', name: 'Present Perfect vs Past Simple Exercises', category: 'worksheet', format: 'DOCX', size: '220 KB', download_url: '#', added_date: 'June 05, 2026' }
];

const mockPayments = [
  { id: 'TXN-9021', student_name: 'Aarav Patel', email: 'aarav.patel@gmail.com', amount: 29.00, date: 'June 23, 2026', method: 'Visa •••• 4242', status: 'success' },
  { id: 'TXN-9020', student_name: 'Neha Sharma', email: 'neha.sharma@yahoo.com', amount: 49.00, date: 'June 22, 2026', method: 'Mastercard •••• 8812', status: 'success' },
  { id: 'TXN-9019', student_name: 'Rahul Kapoor', email: 'rahul.k@gmail.com', amount: 29.00, date: 'June 20, 2026', method: 'Visa •••• 1109', status: 'failed' },
  { id: 'TXN-9018', student_name: 'Priya Nair', email: 'priya.nair@outlook.com', amount: 29.00, date: 'June 18, 2026', method: 'UPI Transfer', status: 'success' },
  { id: 'TXN-9017', student_name: 'Devendra Patil', email: 'dev.patil@gmail.com', amount: 19.00, date: 'June 15, 2026', method: 'Visa •••• 9901', status: 'refunded' }
];

const mockLeads = [
  { id: 'lead-1', name: 'Vikram Singh', phone: '+91 91234 56789', email: 'vikram.singh@gmail.com', notes: 'Interested in the Spoken English Mastery course. Prefers morning batches.', status: 'new', date_added: 'June 23, 2026' },
  { id: 'lead-2', name: 'Anjali Sharma', email: 'anjali.s@yahoo.com', phone: '+91 98123 45670', notes: 'Wants to improve business vocabulary for upcoming job interviews.', status: 'contacted', date_added: 'June 22, 2026' },
  { id: 'lead-3', name: 'Suresh Patel', phone: '+91 99000 88812', email: 'suresh.patel@gmail.com', notes: 'Registered for a free level assessment. Waiting for callback.', status: 'new', date_added: 'June 21, 2026' },
  { id: 'lead-4', name: 'Meera Deshmukh', phone: '+91 98222 33344', email: 'meera.d@gmail.com', notes: 'Converted from lead to enrolled student today!', status: 'converted', date_added: 'June 18, 2026' }
];

const mockTestimonials = [
  { id: 'test-1', name: 'Rohan Sharma', course: 'Spoken English Mastery', rating: 5, message: 'I gained so much confidence! The trainers were amazing and really focused on conversation practices.', status: 'approved', date: 'June 18, 2026' },
  { id: 'test-2', name: 'Pooja Patel', course: 'Business Communication', rating: 5, message: 'The interview preparation sections were a game changer. I cracked my interview at a top MNC!', status: 'approved', date: 'June 15, 2026' },
  { id: 'test-3', name: 'Amit Verma', course: 'Vocabulary Accelerator', rating: 4, message: 'Great course materials and worksheets. My vocabulary improved significantly.', status: 'hidden', date: 'June 10, 2026' }
];

const mockBlogPosts = [
  { id: 'post-1', title: '5 Common Grammar Mistakes Spoken English Learners Make', category: 'Grammar Tips', author: 'Sarah Jenkins', publish_date: 'June 20, 2026', status: 'published' },
  { id: 'post-2', title: 'How to Crack Your Next Job Interview: Ultimate Guide', category: 'Career Growth', author: 'David Vance', publish_date: 'June 15, 2026', status: 'published' },
  { id: 'post-3', title: '10 Idioms that Will Make You Sound Like a Native Speaker', category: 'Vocabulary', author: 'Emma Watson', publish_date: 'June 10, 2026', status: 'draft' }
];

const mockStudents = [
  { id: 'stud-1', name: 'Aarav Patel', email: 'aarav.patel@gmail.com', course: 'Spoken English Mastery — Intermediate', joinedDate: 'May 10, 2026', status: 'active' },
  { id: 'stud-2', name: 'Neha Sharma', email: 'neha.sharma@yahoo.com', course: 'Business Communication & Interview Prep', joinedDate: 'June 02, 2026', status: 'active' },
  { id: 'stud-3', name: 'Rohit Verma', email: 'rohit.verma@gmail.com', course: 'Vocabulary & Idioms Accelerator', joinedDate: 'June 15, 2026', status: 'pending' },
  { id: 'stud-4', name: 'Priya Nair', email: 'priya.nair@outlook.com', course: 'Spoken English Mastery — Intermediate', joinedDate: 'April 20, 2026', status: 'suspended' }
];

// Helper to warn about tables setup
const logWarning = (tableName: string) => {
  console.warn(`Supabase relation "${tableName}" not found. Using local mock dataset fallback. Copy/paste "supabase/schema.sql" into your Supabase dashboard SQL Editor to create table.`);
};

// ═══════════════════════════════════════════════════════════
// DB CRUD Operations
// ═══════════════════════════════════════════════════════════

export const db = {
  // ─── Courses ───
  getCourses: async () => {
    if (!supabase) return mockCourses;
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) {
        if (isTableMissingError(error)) {
          logWarning('courses');
          return mockCourses;
        }
        throw error;
      }
      return data && data.length > 0 ? data : mockCourses;
    } catch {
      return mockCourses;
    }
  },

  createCourse: async (course: any) => {
    if (!supabase) return course;
    try {
      const { data, error } = await supabase.from('courses').insert(course).select().single();
      if (error) {
        if (isTableMissingError(error)) return course;
        throw error;
      }
      return data;
    } catch {
      return course;
    }
  },

  deleteCourse: async (id: string) => {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) {
        if (isTableMissingError(error)) return true;
        throw error;
      }
      return true;
    } catch {
      return false;
    }
  },

  // ─── Live Classes ───
  getLiveClasses: async () => {
    if (!supabase) return mockLiveClasses;
    try {
      const { data, error } = await supabase.from('live_classes').select('*').order('created_at', { ascending: true });
      if (error) {
        if (isTableMissingError(error)) {
          logWarning('live_classes');
          return mockLiveClasses;
        }
        throw error;
      }
      return data && data.length > 0 ? data : mockLiveClasses;
    } catch {
      return mockLiveClasses;
    }
  },

  // ─── Study Materials ───
  getStudyMaterials: async () => {
    if (!supabase) return mockMaterials;
    try {
      const { data, error } = await supabase.from('study_materials').select('*').order('created_at', { ascending: false });
      if (error) {
        if (isTableMissingError(error)) {
          logWarning('study_materials');
          return mockMaterials;
        }
        throw error;
      }
      return data && data.length > 0 ? data : mockMaterials;
    } catch {
      return mockMaterials;
    }
  },

  // ─── Payments ───
  getPayments: async () => {
    if (!supabase) return mockPayments;
    try {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (error) {
        if (isTableMissingError(error)) {
          logWarning('payments');
          return mockPayments;
        }
        throw error;
      }
      return data && data.length > 0 ? data : mockPayments;
    } catch {
      return mockPayments;
    }
  },

  // ─── Leads ───
  getLeads: async () => {
    if (!supabase) return mockLeads;
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) {
        if (isTableMissingError(error)) {
          logWarning('leads');
          return mockLeads;
        }
        throw error;
      }
      return data && data.length > 0 ? data : mockLeads;
    } catch {
      return mockLeads;
    }
  },

  updateLeadStatus: async (id: string, status: string) => {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) {
        if (isTableMissingError(error)) return true;
        throw error;
      }
      return true;
    } catch {
      return false;
    }
  },

  // ─── Testimonials ───
  getTestimonials: async () => {
    if (!supabase) return mockTestimonials;
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (error) {
        if (isTableMissingError(error)) {
          logWarning('testimonials');
          return mockTestimonials;
        }
        throw error;
      }
      return data && data.length > 0 ? data : mockTestimonials;
    } catch {
      return mockTestimonials;
    }
  },

  createTestimonial: async (test: any) => {
    if (!supabase) return test;
    try {
      const { data, error } = await supabase.from('testimonials').insert(test).select().single();
      if (error) {
        if (isTableMissingError(error)) return test;
        throw error;
      }
      return data;
    } catch {
      return test;
    }
  },

  updateTestimonialStatus: async (id: string, status: string) => {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('testimonials').update({ status }).eq('id', id);
      if (error) {
        if (isTableMissingError(error)) return true;
        throw error;
      }
      return true;
    } catch {
      return false;
    }
  },

  deleteTestimonial: async (id: string) => {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        if (isTableMissingError(error)) return true;
        throw error;
      }
      return true;
    } catch {
      return false;
    }
  },

  // ─── Blog Posts ───
  getBlogPosts: async () => {
    if (!supabase) return mockBlogPosts;
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) {
        if (isTableMissingError(error)) {
          logWarning('blog_posts');
          return mockBlogPosts;
        }
        throw error;
      }
      return data && data.length > 0 ? data : mockBlogPosts;
    } catch {
      return mockBlogPosts;
    }
  },

  createBlogPost: async (post: any) => {
    if (!supabase) return post;
    try {
      const { data, error } = await supabase.from('blog_posts').insert(post).select().single();
      if (error) {
        if (isTableMissingError(error)) return post;
        throw error;
      }
      return data;
    } catch {
      return post;
    }
  },

  updateBlogPostStatus: async (id: string, status: string) => {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('blog_posts').update({ status }).eq('id', id);
      if (error) {
        if (isTableMissingError(error)) return true;
        throw error;
      }
      return true;
    } catch {
      return false;
    }
  },

  deleteBlogPost: async (id: string) => {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) {
        if (isTableMissingError(error)) return true;
        throw error;
      }
      return true;
    } catch {
      return false;
    }
  },

  // ─── Students Profiles ───
  getStudents: async () => {
    if (!supabase) return mockStudents;
    try {
      // Fetch user profiles where role is 'student'
      const { data, error } = await supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false });
      if (error) {
        if (isTableMissingError(error)) {
          logWarning('profiles');
          return mockStudents;
        }
        throw error;
      }
      return data && data.length > 0 
        ? data.map((p: any) => ({
            id: p.id,
            name: p.name || 'Student User',
            email: p.email,
            course: p.level ? `Spoken English — ${p.level}` : 'Spoken English Mastery',
            joinedDate: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'active'
          }))
        : mockStudents;
    } catch {
      return mockStudents;
    }
  },

  getAdmins: async () => {
    const mockAdmins = [
      { id: 'dev-admin-id', name: 'Admin User', email: 'admin@tesca.com', joinedDate: 'May 10, 2026', status: 'active' }
    ];
    if (!supabase) return mockAdmins;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('role', 'admin').order('created_at', { ascending: false });
      if (error) {
        if (isTableMissingError(error)) {
          return mockAdmins;
        }
        throw error;
      }
      return data && data.length > 0 
        ? data.map((p: any) => ({
            id: p.id,
            name: p.name || 'Admin User',
            email: p.email,
            joinedDate: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: 'active'
          }))
        : mockAdmins;
    } catch {
      return mockAdmins;
    }
  },

  createStudentProfile: async (student: any) => {
    if (!supabase) return student;
    try {
      // Mock-like profile insertion (auth registration must happen via admin/auth panel)
      const { data, error } = await supabase.from('profiles').insert({
        id: student.id || crypto.randomUUID(),
        email: student.email,
        role: 'student',
        name: student.name,
        level: 'Intermediate (B1)'
      }).select().single();
      
      if (error) {
        if (isTableMissingError(error)) return student;
        throw error;
      }
      return data;
    } catch {
      return student;
    }
  },

  deleteStudentProfile: async (id: string) => {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) {
        if (isTableMissingError(error)) return true;
        throw error;
      }
      return true;
    } catch {
      return false;
    }
  },

  // ─── Profile Details ───
  getProfile: async (id: string) => {
    if (!supabase) {
      return {
        id,
        name: 'Student User',
        email: 'student@tesca.com',
        role: 'student',
        level: 'Intermediate (B1)',
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        created_at: new Date().toISOString()
      };
    }
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) {
        if (isTableMissingError(error)) {
          return {
            id,
            name: 'Student User',
            email: 'student@tesca.com',
            role: 'student',
            level: 'Intermediate (B1)',
            phone: '+91 98765 43210',
            location: 'Mumbai, India',
            created_at: new Date().toISOString()
          };
        }
        throw error;
      }
      return data;
    } catch {
      return {
        id,
        name: 'Student User',
        email: 'student@tesca.com',
        role: 'student',
        level: 'Intermediate (B1)',
        phone: '+91 98765 43210',
        location: 'Mumbai, India',
        created_at: new Date().toISOString()
      };
    }
  },

  updateProfile: async (id: string, updates: any) => {
    if (!supabase) return true;
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', id);
      if (error) {
        if (isTableMissingError(error)) return true;
        throw error;
      }
      return true;
    } catch {
      return false;
    }
  }
};
