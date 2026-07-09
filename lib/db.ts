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
        price: course.price,
        students_count: course.students_count,
        original_price: course.original_price,
        duration: course.duration,
        benefits: course.benefits,
        accent: course.accent,
        popular: course.popular,
        tags: course.tags || [],
        keywords: course.keywords || [],
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
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.students_count !== undefined) dbUpdates.students_count = updates.students_count;
      if (updates.original_price !== undefined) dbUpdates.original_price = updates.original_price;
      if (updates.duration !== undefined) dbUpdates.duration = updates.duration;
      if (updates.benefits !== undefined) dbUpdates.benefits = updates.benefits;
      if (updates.accent !== undefined) dbUpdates.accent = updates.accent;
      if (updates.popular !== undefined) dbUpdates.popular = updates.popular;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.keywords !== undefined) dbUpdates.keywords = updates.keywords;

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

  // ─── Batches ───
  getBatches: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('batches').select('*').order('created_at', { ascending: true });
      if (error) {
        logError('batches', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getBatches failed:', err);
      return [];
    }
  },

  createBatch: async (batch: any) => {
    await ensureSupabaseClient();
    if (!supabase) return batch;
    try {
      const { data, error } = await supabase.from('batches').insert(batch).select().single();
      if (error) {
        logError('batches', error);
        return batch;
      }
      return data;
    } catch (err) {
      console.error('createBatch failed:', err);
      return batch;
    }
  },

  updateBatch: async (id: string, updates: any) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('batches').update(updates).eq('id', id);
      if (error) {
        logError('batches', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateBatch failed:', err);
      return false;
    }
  },

  deleteBatch: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('batches').delete().eq('id', id);
      if (error) {
        logError('batches', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('deleteBatch failed:', err);
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

  createPayment: async (payment: any) => {
    await ensureSupabaseClient();
    if (!supabase) return payment;
    try {
      const { data, error } = await supabase.from('payments').insert(payment).select().single();
      if (error) {
        logError('payments', error);
        return payment;
      }
      return data;
    } catch (err) {
      console.error('createPayment failed:', err);
      return payment;
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
        phone: p.phone,
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
        phone: p.phone,
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
        phone: p.phone,
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
  },

  // ─── Enrolled Courses & Progress ───
  getEnrolledCourses: async (studentId: string) => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      interface DBEnrollmentRow {
        progress: number;
        completed_lessons: number;
        last_active: string;
        id: string;
        courses: {
          id: string;
          title: string;
          price: number;
          duration?: string;
          accent?: string;
          benefits?: string;
          popular?: boolean;
        } | null;
      }

      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          progress,
          completed_lessons,
          last_active,
          id,
          courses (
            id,
            title,
            price,
            duration,
            accent,
            benefits,
            popular
          )
        `)
        .eq('student_id', studentId)
        .eq('status', 'active');

      if (error) {
        logError('enrollments', error);
        return [];
      }

      const rows = (data || []) as unknown as DBEnrollmentRow[];

      return rows.map((e) => {
        const c = e.courses || {
          id: '',
          title: 'Unknown Course',
          price: 0,
        };
        return {
          id: c.id,
          title: c.title,
          price: c.price,
          duration: c.duration || '3 Months',
          accent: c.accent || 'primary',
          benefits: c.benefits ? c.benefits.split(',').map((b: string) => b.trim()) : [],
          popular: !!c.popular,
          progress: e.progress || 0,
          completedLessons: e.completed_lessons || 0,
          lastActive: e.last_active || 'Not started yet',
          enrollmentId: e.id
        };
      });
    } catch (err) {
      console.error('getEnrolledCourses failed:', err);
      return [];
    }
  },

  getCourseModulesAndLessons: async (courseId: string) => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      interface DBModuleRow {
        id: string;
        course_id: string;
        title: string;
        order_index: number;
      }
      interface DBLessonRow {
        id: string;
        module_id: string;
        title: string;
        video_url: string;
        duration: number;
        is_preview: boolean;
        order_index: number;
      }

      // 1. Fetch modules
      const { data: modules, error: modError } = await supabase
        .from('course_modules')
        .select('id, course_id, title, order_index')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modError) {
        logError('course_modules', modError);
        return [];
      }

      if (!modules || modules.length === 0) return [];

      const moduleRows = modules as unknown as DBModuleRow[];

      // 2. Fetch all lessons for these modules
      const moduleIds = moduleRows.map((m) => m.id);
      const { data: lessons, error: lesError } = await supabase
        .from('lessons')
        .select('id, module_id, title, video_url, duration, is_preview, order_index')
        .in('module_id', moduleIds)
        .order('order_index', { ascending: true });

      if (lesError) {
        logError('lessons', lesError);
        return moduleRows.map((m) => ({ ...m, lessons: [] as DBLessonRow[] }));
      }

      const lessonRows = lessons as unknown as DBLessonRow[];

      // 3. Group lessons by module ID
      return moduleRows.map((m) => ({
        ...m,
        lessons: lessonRows.filter((l) => l.module_id === m.id)
      }));
    } catch (err) {
      console.error('getCourseModulesAndLessons failed:', err);
      return [];
    }
  },

  getCompletedLessons: async (studentId: string, courseId: string) => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      interface DBIdRow {
        id: string;
      }
      interface DBProgressRow {
        lesson_id: string;
      }

      // Get all lesson IDs for this course first
      const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', courseId);
      if (!modules || modules.length === 0) return [];
      
      const moduleIds = (modules as unknown as DBIdRow[]).map((m) => m.id);
      const { data: lessons } = await supabase.from('lessons').select('id').in('module_id', moduleIds);
      if (!lessons || lessons.length === 0) return [];
      
      const lessonIds = (lessons as unknown as DBIdRow[]).map((l) => l.id);

      // Fetch completed lessons from lesson_progress
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('student_id', studentId)
        .in('lesson_id', lessonIds)
        .eq('completed', true);

      if (error) {
        logError('lesson_progress', error);
        return [];
      }

      const progressRows = (data || []) as unknown as DBProgressRow[];

      return progressRows.map((row) => row.lesson_id);
    } catch (err) {
      console.error('getCompletedLessons failed:', err);
      return [];
    }
  },

  toggleLessonProgress: async (studentId: string, courseId: string, lessonId: string, completed: boolean, lastActiveTitle?: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      interface DBIdRow {
        id: string;
      }
      interface DBLessonIdRow {
        lesson_id: string;
      }

      // 1. Toggle the progress record
      if (completed) {
        const { error: upsertError } = await supabase
          .from('lesson_progress')
          .upsert({
            student_id: studentId,
            lesson_id: lessonId,
            completed: true
          }, { onConflict: 'student_id,lesson_id' });

        if (upsertError) {
          logError('lesson_progress', upsertError);
          return false;
        }
      } else {
        const { error: deleteError } = await supabase
          .from('lesson_progress')
          .delete()
          .eq('student_id', studentId)
          .eq('lesson_id', lessonId);

        if (deleteError) {
          logError('lesson_progress', deleteError);
          return false;
        }
      }

      // 2. Recalculate overall progress for the enrollment
      // Get all lessons for this course
      const { data: modules } = await supabase.from('course_modules').select('id').eq('course_id', courseId);
      if (modules && modules.length > 0) {
        const moduleIds = (modules as unknown as DBIdRow[]).map((m) => m.id);
        const { data: lessons } = await supabase.from('lessons').select('id').in('module_id', moduleIds);
        
        if (lessons && lessons.length > 0) {
          const totalLessonsCount = lessons.length;
          const lessonIds = (lessons as unknown as DBIdRow[]).map((l) => l.id);

          // Get completed count
          const { data: completedRows } = await supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('student_id', studentId)
            .in('lesson_id', lessonIds)
            .eq('completed', true);

          const completedCount = completedRows ? (completedRows as unknown as DBLessonIdRow[]).length : 0;
          const progressPercent = Math.round((completedCount / totalLessonsCount) * 100);

          // Update the enrollment
          const { error: enrollError } = await supabase
            .from('enrollments')
            .update({
              progress: progressPercent,
              completed_lessons: completedCount,
              last_active: lastActiveTitle ? `Active: ${lastActiveTitle}` : 'Just active'
            })
            .eq('student_id', studentId)
            .eq('course_id', courseId);

          if (enrollError) {
            logError('enrollments', enrollError);
          }
        }
      }
      return true;
    } catch (err) {
      console.error('toggleLessonProgress failed:', err);
      return false;
    }
  },

  enrollStudent: async (studentId: string, courseId: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('enrollments')
        .upsert({
          student_id: studentId,
          course_id: courseId,
          progress: 0,
          completed_lessons: 0,
          last_active: 'Course started',
          status: 'active'
        }, { onConflict: 'student_id,course_id' });

      if (error) {
        logError('enrollments', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('enrollStudent failed:', err);
      return false;
    }
  },

  // ─── Trainers ───
  getTrainers: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('trainers').select('*').order('created_at', { ascending: true });
      if (error) {
        logError('trainers', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getTrainers failed:', err);
      return [];
    }
  },

  createTrainer: async (trainer: any) => {
    await ensureSupabaseClient();
    if (!supabase) return trainer;
    try {
      const { data, error } = await supabase.from('trainers').insert(trainer).select().single();
      if (error) {
        logError('trainers', error);
        return trainer;
      }
      return data;
    } catch (err) {
      console.error('createTrainer failed:', err);
      return trainer;
    }
  },

  updateTrainer: async (id: string, updates: any) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('trainers').update(updates).eq('id', id);
      if (error) {
        logError('trainers', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateTrainer failed:', err);
      return false;
    }
  },

  deleteTrainer: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('trainers').delete().eq('id', id);
      if (error) {
        logError('trainers', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('deleteTrainer failed:', err);
      return false;
    }
  },

  // ─── Global Settings ───
  getSystemSettings: async () => {
    await ensureSupabaseClient();
    const defaultSettings = {
      schoolName: 'TESCA Spoken English',
      contactEmail: 'contact@tesca.com',
      supportPhone: '+91 98765 43210',
      currency: 'INR (₹)',
      enableRegistrations: true,
      maintenanceMode: false,
      enableFreeTest: true,
      showOfferBanner: true,
      showTimer: true,
      timerExpiryType: 'rolling',
      timerFixedExpiry: '',
      showProgressBar: true,
      claimedPercentage: 85,
      progressBarText: '🔥 [percentage]% of promotional seats claimed',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [] as string[],
    };

    if (!supabase) return defaultSettings;
    try {
      const { data, error } = await supabase.from('system_settings').select('*').eq('id', 1).maybeSingle();
      if (error) {
        if (isTableMissingError(error)) {
          console.warn('[DB] Table "system_settings" does not exist yet. Using default configurations.');
        } else {
          logError('system_settings', error);
        }
        return defaultSettings;
      }
      
      if (!data) return defaultSettings;

      return {
        schoolName: data.school_name ?? defaultSettings.schoolName,
        contactEmail: data.contact_email ?? defaultSettings.contactEmail,
        supportPhone: data.support_phone ?? defaultSettings.supportPhone,
        currency: data.currency ?? defaultSettings.currency,
        enableRegistrations: data.enable_registrations ?? defaultSettings.enableRegistrations,
        maintenanceMode: data.maintenance_mode ?? defaultSettings.maintenanceMode,
        enableFreeTest: data.enable_free_test ?? defaultSettings.enableFreeTest,
        showOfferBanner: data.show_offer_banner ?? defaultSettings.showOfferBanner,
        showTimer: data.show_timer ?? defaultSettings.showTimer,
        timerExpiryType: data.timer_expiry_type ?? defaultSettings.timerExpiryType,
        timerFixedExpiry: data.timer_fixed_expiry ?? defaultSettings.timerFixedExpiry,
        showProgressBar: data.show_progress_bar ?? defaultSettings.showProgressBar,
        claimedPercentage: data.claimed_percentage ?? defaultSettings.claimedPercentage,
        progressBarText: data.progress_bar_text ?? defaultSettings.progressBarText,
        seoTitle: data.seo_title ?? defaultSettings.seoTitle,
        seoDescription: data.seo_description ?? defaultSettings.seoDescription,
        seoKeywords: data.seo_keywords ?? defaultSettings.seoKeywords,
      };
    } catch (err) {
      console.error('getSystemSettings failed:', err);
      return defaultSettings;
    }
  },

  // ─── Blog Posts ───
  getBlogPosts: async () => {
    await ensureSupabaseClient();
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) {
        logError('blog_posts', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('getBlogPosts failed:', err);
      return [];
    }
  },

  createBlogPost: async (post: any) => {
    await ensureSupabaseClient();
    if (!supabase) return post;
    try {
      const { data, error } = await supabase.from('blog_posts').insert(post).select().single();
      if (error) {
        logError('blog_posts', error);
        return post;
      }
      return data;
    } catch (err) {
      console.error('createBlogPost failed:', err);
      return post;
    }
  },

  updateBlogPost: async (id: string, updates: any) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('blog_posts').update(updates).eq('id', id);
      if (error) {
        logError('blog_posts', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateBlogPost failed:', err);
      return false;
    }
  },

  deleteBlogPost: async (id: string) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) {
        logError('blog_posts', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('deleteBlogPost failed:', err);
      return false;
    }
  },

  updateSystemSettings: async (updates: any) => {
    await ensureSupabaseClient();
    if (!supabase) return false;
    try {
      const dbUpdates: any = { id: 1 };
      if (updates.schoolName !== undefined) dbUpdates.school_name = updates.schoolName;
      if (updates.contactEmail !== undefined) dbUpdates.contact_email = updates.contactEmail;
      if (updates.supportPhone !== undefined) dbUpdates.support_phone = updates.supportPhone;
      if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
      if (updates.enableRegistrations !== undefined) dbUpdates.enable_registrations = updates.enableRegistrations;
      if (updates.maintenanceMode !== undefined) dbUpdates.maintenance_mode = updates.maintenanceMode;
      if (updates.enableFreeTest !== undefined) dbUpdates.enable_free_test = updates.enableFreeTest;
      
      if (updates.showOfferBanner !== undefined) dbUpdates.show_offer_banner = updates.showOfferBanner;
      if (updates.showTimer !== undefined) dbUpdates.show_timer = updates.showTimer;
      if (updates.timerExpiryType !== undefined) dbUpdates.timer_expiry_type = updates.timerExpiryType;
      if (updates.timerFixedExpiry !== undefined) dbUpdates.timer_fixed_expiry = updates.timerFixedExpiry;
      if (updates.showProgressBar !== undefined) dbUpdates.show_progress_bar = updates.showProgressBar;
      if (updates.claimedPercentage !== undefined) dbUpdates.claimed_percentage = updates.claimedPercentage;
      if (updates.progressBarText !== undefined) dbUpdates.progress_bar_text = updates.progressBarText;

      if (updates.seoTitle !== undefined) dbUpdates.seo_title = updates.seoTitle;
      if (updates.seoDescription !== undefined) dbUpdates.seo_description = updates.seoDescription;
      if (updates.seoKeywords !== undefined) dbUpdates.seo_keywords = updates.seoKeywords;

      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase.from('system_settings').upsert(dbUpdates, { onConflict: 'id' });
      if (error) {
        logError('system_settings', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('updateSystemSettings failed:', err);
      return false;
    }
  }
};
