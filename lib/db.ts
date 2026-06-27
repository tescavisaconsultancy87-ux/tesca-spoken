import { supabase, ensureSupabaseClient } from './supabaseClient';

// Helper to determine if a Supabase error is a 'relation does not exist' error (Postgres code 42P01)
const isTableMissingError = (error: any) => {
  return error && (error.code === '42P01' || error.message?.includes('relation') && error.message?.includes('does not exist'));
};

// Helper to log warning about database setup
const logError = (tableName: string, error: any) => {
  console.error(`Database error on table "${tableName}":`, error.message || error);
};

// ═══════════════════════════════════════════════════════════
// DB CRUD Operations (Database Only, No Mock Fallbacks)
// ═══════════════════════════════════════════════════════════

export const db = {
  // ─── Courses ───
  getCourses: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) {
        logError('courses', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getCourses failed:', err);
      return [];
    }
  },

  createCourse: async (course: any) => {
    await ensureSupabaseClient();
    if (!supabase) return course;
    try {
      const dbCourse = {
        id: course.id,
        title: course.title,
        trainer: course.trainer,
        category: course.category,
        price: course.price,
        lessons_count: course.lessons_count,
        students_count: course.students_count,
      };
      const { data, error } = await supabase.from('courses').insert(dbCourse).select().single();
      if (error) {
        logError('courses', error);
        return course;
      }
      return data;
    } catch (err) {
      console.error('createCourse failed:', err);
      return course;
    }
  },

  deleteCourse: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) {
        logError('courses', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('deleteCourse failed:', err);
      return false;
    }
  },

  updateCourse: async (id: string, updates: any) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.trainer !== undefined) dbUpdates.trainer = updates.trainer;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.lessons_count !== undefined) dbUpdates.lessons_count = updates.lessons_count;
      if (updates.students_count !== undefined) dbUpdates.students_count = updates.students_count;

      const { error } = await supabase.from('courses').update(dbUpdates).eq('id', id);
      if (error) {
        logError('courses', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateCourse failed:', err);
      return false;
    }
  },

  // ─── Live Classes ───
  getLiveClasses: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('live_classes').select('*').order('created_at', { ascending: true });
      if (error) {
        logError('live_classes', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getLiveClasses failed:', err);
      return [];
    }
  },

  createLiveClass: async (lc: any) => {
    await ensureSupabaseClient();
    if (!supabase) return lc;
    try {
      const { data, error } = await supabase.from('live_classes').insert(lc).select().single();
      if (error) {
        logError('live_classes', error);
        return lc;
      }
      return data;
    } catch (err) {
      console.error('createLiveClass failed:', err);
      return lc;
    }
  },

  updateLiveClass: async (id: string, updates: any) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('live_classes').update(updates).eq('id', id);
      if (error) {
        logError('live_classes', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateLiveClass failed:', err);
      return false;
    }
  },

  deleteLiveClass: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('live_classes').delete().eq('id', id);
      if (error) {
        logError('live_classes', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('deleteLiveClass failed:', err);
      return false;
    }
  },

  // ─── Study Materials ───
  getStudyMaterials: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('study_materials').select('*').order('created_at', { ascending: false });
      if (error) {
        logError('study_materials', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getStudyMaterials failed:', err);
      return [];
    }
  },

  createStudyMaterial: async (mat: any) => {
    await ensureSupabaseClient();
    if (!supabase) return mat;
    try {
      const { data, error } = await supabase.from('study_materials').insert(mat).select().single();
      if (error) {
        logError('study_materials', error);
        return mat;
      }
      return data;
    } catch (err) {
      console.error('createStudyMaterial failed:', err);
      return mat;
    }
  },

  updateStudyMaterial: async (id: string, updates: any) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('study_materials').update(updates).eq('id', id);
      if (error) {
        logError('study_materials', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateStudyMaterial failed:', err);
      return false;
    }
  },

  deleteStudyMaterial: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('study_materials').delete().eq('id', id);
      if (error) {
        logError('study_materials', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('deleteStudyMaterial failed:', err);
      return false;
    }
  },

  // ─── Payments ───
  getPayments: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (error) {
        logError('payments', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getPayments failed:', err);
      return [];
    }
  },

  // ─── Leads ───
  getLeads: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (error) {
        logError('leads', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getLeads failed:', err);
      return [];
    }
  },

  updateLeadStatus: async (id: string, status: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('leads').update({ status }).eq('id', id);
      if (error) {
        logError('leads', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateLeadStatus failed:', err);
      return false;
    }
  },

  // ─── Testimonials ───
  getTestimonials: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (error) {
        logError('testimonials', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getTestimonials failed:', err);
      return [];
    }
  },

  createTestimonial: async (test: any) => {
    await ensureSupabaseClient();
    if (!supabase) return test;
    try {
      const { data, error } = await supabase.from('testimonials').insert(test).select().single();
      if (error) {
        logError('testimonials', error);
        return test;
      }
      return data;
    } catch (err) {
      console.error('createTestimonial failed:', err);
      return test;
    }
  },

  updateTestimonialStatus: async (id: string, status: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('testimonials').update({ status }).eq('id', id);
      if (error) {
        logError('testimonials', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateTestimonialStatus failed:', err);
      return false;
    }
  },

  deleteTestimonial: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        logError('testimonials', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('deleteTestimonial failed:', err);
      return false;
    }
  },


  // ─── Students Profiles ───
  getStudents: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('role', 'student').order('created_at', { ascending: false });
      if (error) {
        logError('profiles', error);
        return [];
      }
      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name || 'Student User',
        email: p.email,
        course: p.level ? `Spoken English — ${p.level}` : 'Spoken English Mastery',
        joinedDate: new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'active'
      }));
    } catch (err) {
      console.error('getStudents failed:', err);
      return [];
    }
  },

  getAdmins: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('role', 'admin').order('created_at', { ascending: false });
      if (error) {
        logError('profiles', error);
        return [];
      }
      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name || 'Admin User',
        email: p.email,
        joinedDate: new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'active'
      }));
    } catch (err) {
      console.error('getAdmins failed:', err);
      return [];
    }
  },

  getTutors: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('role', 'tutor').order('created_at', { ascending: false });
      if (error) {
        logError('profiles', error);
        return [];
      }
      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name || 'Tutor User',
        email: p.email,
        joinedDate: new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'active'
      }));
    } catch (err) {
      console.error('getTutors failed:', err);
      return [];
    }
  },

  createStudentProfile: async (student: any) => {
    await ensureSupabaseClient();
    if (!supabase) return student;
    try {
      const { data, error } = await supabase.from('profiles').insert({
        id: student.id || crypto.randomUUID(),
        email: student.email,
        role: 'student',
        name: student.name,
        level: 'Intermediate (B1)'
      }).select().single();
      
      if (error) {
        logError('profiles', error);
        return student;
      }
      return data;
    } catch (err) {
      console.error('createStudentProfile failed:', err);
      return student;
    }
  },

  deleteStudentProfile: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) {
        logError('profiles', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('deleteStudentProfile failed:', err);
      return false;
    }
  },

  // ─── Profile Details ───
  getProfile: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) {
        logError('profiles', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('getProfile failed:', err);
      return null;
    }
  },

  // ─── Status computation ───
  computeStatus: (dateTime: string, duration: string): 'upcoming' | 'live' | 'completed' => {
    const start = new Date(dateTime);
    if (isNaN(start.getTime())) return 'upcoming';
    const now = new Date();
    const mins = parseInt(duration) || 0;
    const end = new Date(start.getTime() + mins * 60000);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'completed';
  },

  updateProfile: async (id: string, updates: any) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', id);
      if (error) {
        logError('profiles', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateProfile failed:', err);
      return false;
    }
  }
};
